import os
import re
import time
import tempfile
from math import ceil
from typing import Dict, Optional, List

import httpx
import feedparser
from dateutil import parser as dtparse

from app.db import init_db, get_all_article_ids, insert_article
from app.uploader import upload_pdf_to_spaces

ARXIV_BASE = "https://export.arxiv.org/api/query"

def _build_url(query: str, start: int, max_results: int, sort_order: str) -> str:
    from urllib.parse import urlencode
    params = {
        "search_query": query,
        "start": start,
        "max_results": max_results,
        "sortBy": "submittedDate",
        "sortOrder": sort_order,
    }
    return f"{ARXIV_BASE}?{urlencode(params)}"

_MODERN_RE = re.compile(r"(?P<base>\d{4}\.\d{5})(?:v\d+)?$")
_LEGACY_RE = re.compile(r"(?P<base>[a-z\-]+\/\d{7})(?:v\d+)?$", re.IGNORECASE)

def _normalize_arxiv_id(entry_id_url: str) -> str:
    """
    Normalize arXiv IDs by:
      - taking everything after /abs/
      - replacing '/' with '_'
      - stripping version suffix 'vN' if present
    """
    # Get last part after /abs/
    try:
        raw = entry_id_url.split("/abs/", 1)[1]
    except IndexError:
        raw = entry_id_url.rsplit("/", 1)[-1]

    # Replace '/' with '_'
    safe_id = raw.replace("/", "_")

    # Remove version suffix if present (…v1, …v2, …v10)
    if "v" in safe_id:
        base, vpart = safe_id.rsplit("v", 1)
        if vpart.isdigit():
            return base
    return safe_id

def _entry_to_article(entry) -> Dict[str, Optional[str]]:
    pdf_url = None
    for link in entry.get("links", []) or []:
        if link.get("type") == "application/pdf":
            pdf_url = link.get("href")
            break
    authors_list: List[str] = []
    for a in entry.get("authors", []) or []:
        name = getattr(a, "name", None)
        if not name and isinstance(a, dict):
            name = a.get("name")
        if name:
            authors_list.append(name)
    raw_id = entry.get("id", "")
    base_id = _normalize_arxiv_id(raw_id)
    return {
        "article_id": base_id,
        "title": (entry.get("title") or "").strip(),
        "authors": ", ".join(authors_list),
        "abstract": (entry.get("summary") or "").strip(),
        "submission_date": dtparse.parse(entry.get("updated")).isoformat() if entry.get("updated") else None,
        "originally_announced": dtparse.parse(entry.get("published")).isoformat() if entry.get("published") else None,
        "pdf_url": pdf_url,
        "uploaded_file_url": None,
    }

def _maybe_upload_pdf(article: Dict[str, Optional[str]]) -> None:
    if os.getenv("S3_UPLOAD", "false").lower() != "true":
        return
    if not article.get("pdf_url"):
        return
    tmp_path = None
    try:
        with httpx.stream("GET", article["pdf_url"], timeout=60) as r:
            r.raise_for_status()
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                for chunk in r.iter_bytes():
                    tmp.write(chunk)
                tmp_path = tmp.name
        safe_id = article["article_id"].replace("/", "_")
        uploaded_url = upload_pdf_to_spaces(tmp_path, object_name=f"{safe_id}.pdf")
        if uploaded_url:
            article["uploaded_file_url"] = uploaded_url
            print(f"☁️ Uploaded {article['article_id']}")
        else:
            print(f"⚠️ Upload returned no URL for {article['article_id']}")
    except Exception as e:
        print(f"❌ Upload failed for {article.get('article_id','?')}: {e}")
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except OSError:
                pass

def fetch_and_store(
    query: str,
    mode: str,
    page_size: int = 200,
    sleep: float = 3.0,
    total_results: Optional[int] = None,
    newest_window_pages: int = 3,
    start_page: int = 1,
) -> Dict[str, int]:
    init_db()
    existing_ids = get_all_article_ids()
    created = 0

    if mode == "oldest":
        if total_results is None:
            url0 = _build_url(query=query, start=0, max_results=page_size, sort_order="ascending")
            print(f"🔎 Probe {url0}")
            r0 = httpx.get(url0, headers={"User-Agent": "agritech-news-agent/1.0"}, timeout=60)
            r0.raise_for_status()
            feed0 = feedparser.parse(r0.text)
            try:
                total_results = int(feed0.feed.get("opensearch_totalresults", 0) or 0)
            except Exception:
                total_results = 0
            if total_results <= 0:
                total_results = len(feed0.entries or [])
        total_pages = ceil(total_results / page_size)
        first_page = max(1, start_page)
        print(f"📄 Oldest-first total={total_results} size={page_size} pages={total_pages} start_page={first_page}")
        for page in range(first_page, total_pages + 1):
            start = (page - 1) * page_size
            url = _build_url(query=query, start=start, max_results=page_size, sort_order="ascending")
            print(f"⬅️ Page {page}/{total_pages} start={start}")
            r = httpx.get(url, headers={"User-Agent": "agritech-news-agent/1.0"}, timeout=60)
            r.raise_for_status()
            feed = feedparser.parse(r.text)
            entries = feed.entries or []
            for e in entries:
                article = _entry_to_article(e)
                if article["article_id"] in existing_ids:
                    print(f"🔁 Duplicate {article['article_id']} — skipping")
                    continue
                _maybe_upload_pdf(article)
                insert_article(article)
                existing_ids.add(article["article_id"])
                created += 1
            if page < total_pages:
                time.sleep(sleep)

    elif mode == "newest":
        pages_to_fetch = max(1, newest_window_pages)
        print(f"📰 Newest window pages={pages_to_fetch} size={page_size}")
        collected: List[Dict] = []
        for page in range(1, pages_to_fetch + 1):
            start = (page - 1) * page_size
            url = _build_url(query=query, start=start, max_results=page_size, sort_order="descending")
            print(f"➡️ Newest page {page}/{pages_to_fetch} start={start}")
            r = httpx.get(url, headers={"User-Agent": "agritech-news-agent/1.0"}, timeout=60)
            r.raise_for_status()
            feed = feedparser.parse(r.text)
            entries = feed.entries or []
            for e in entries:
                collected.append(_entry_to_article(e))
            if page < pages_to_fetch:
                time.sleep(sleep)
        collected.reverse()
        for article in collected:
            if article["article_id"] in existing_ids:
                print(f"🔁 Duplicate {article['article_id']} — skipping")
                continue
            _maybe_upload_pdf(article)
            insert_article(article)
            existing_ids.add(article["article_id"])
            created += 1
    else:
        raise ValueError("mode must be 'oldest' or 'newest'")

    print(f"✅ Created {created}")
    return {"created": created}
