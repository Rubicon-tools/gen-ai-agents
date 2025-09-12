import os
import time
import tempfile
from typing import Dict, Optional

import httpx
import feedparser
from dateutil import parser as dtparse

from app.db import init_db, get_all_article_ids, insert_article
from app.uploader import upload_pdf_to_spaces

ARXIV_BASE = "https://export.arxiv.org/api/query"


def _build_url(
    query: str,
    start: int,
    max_results: int,
    sort_order: str = "ascending",
) -> str:
    """Build arXiv API URL."""
    from urllib.parse import urlencode

    params = {
        "search_query": query,
        "start": start,
        "max_results": max_results,
        "sortBy": "submittedDate",
        "sortOrder": sort_order,  # "ascending" (oldest) or "descending" (newest)
    }
    return f"{ARXIV_BASE}?{urlencode(params)}"


def _entry_to_article(entry) -> Dict[str, Optional[str]]:
    """Convert a feedparser entry → article dict matching your DB schema."""
    # PDF link
    pdf_url = None
    for link in entry.get("links", []):
        if link.get("type") == "application/pdf":
            pdf_url = link.get("href")
            break

    # arXiv id without version
    raw_id = entry.get("id", "")  # e.g. http://arxiv.org/abs/2401.01234v2
    last = raw_id.rsplit("/", 1)[-1]
    if "v" in last:
        base_id = last.split("v", 1)[0]
    else:
        base_id = last

    # authors
    authors_list = []
    for a in entry.get("authors", []) or []:
        # feedparser returns author objects with .name
        name = getattr(a, "name", None) or a.get("name") if isinstance(a, dict) else None
        if name:
            authors_list.append(name)

    return {
        "article_id": base_id,
        "title": (entry.get("title") or "").strip(),
        "authors": ", ".join(authors_list),
        "abstract": (entry.get("summary") or "").strip(),
        "submission_date": (
            dtparse.parse(entry.get("updated")).isoformat() if entry.get("updated") else None
        ),
        "originally_announced": (
            dtparse.parse(entry.get("published")).isoformat() if entry.get("published") else None
        ),
        "pdf_url": pdf_url,
        "uploaded_file_url": None,  # set if S3 upload is enabled
    }


def _maybe_upload_pdf(article: Dict[str, Optional[str]]) -> None:
    """Upload PDF to Spaces if enabled via S3_UPLOAD=true."""
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
            print(f"☁️ Uploaded {article['article_id']} to Spaces")
        else:
            print(f"⚠️ Upload returned no URL for {article['article_id']}")
    except Exception as e:
        print(f"❌ Upload failed for {article.get('article_id', '?')}: {e}")
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except OSError:
                pass


def fetch_and_store(
    query: str = "agriculture",
    mode: str = "newest",
    page_size: int = 200,
    sleep: float = 3.0,
    max_pages: Optional[int] = None,
) -> Dict[str, int]:
    """
    Fetch from arXiv API and store in DB.

    mode:
      - "oldest": ascending from API, insert as-is (good for big backfills)
      - "newest": descending from API, then reverse entries BEFORE insert
                  (so newest ends up LAST — identical to parsed_articles.reverse())
    """
    init_db()
    existing_ids = get_all_article_ids()

    created = 0
    start = 0
    page_count = 0
    sort_order = "ascending" if mode == "oldest" else "descending"

    while True:
        url = _build_url(query, start=start, max_results=page_size, sort_order=sort_order)
        print(f"🔎 Fetching {url}")
        r = httpx.get(
            url,
            headers={"User-Agent": "agritech-news-agent/1.0 (arxiv api)"},
            timeout=60,
        )
        r.raise_for_status()

        feed = feedparser.parse(r.text)
        entries = feed.entries or []
        if not entries:
            break

        # IMPORTANT: for newest mode, reverse the page BEFORE inserting
        # to mimic your old parsed_articles.reverse() (newest ends up at the end)
        if mode == "newest":
            entries = list(entries)[::-1]

        for e in entries:
            article = _entry_to_article(e)
            if article["article_id"] in existing_ids:
                continue
            _maybe_upload_pdf(article)  # may set uploaded_file_url
            insert_article(article)
            existing_ids.add(article["article_id"])
            created += 1

        start += len(entries)
        page_count += 1

        total = int(feed.feed.get("opensearch_totalresults", 0) or 0)
        if max_pages and page_count >= max_pages:
            break
        if start >= total:
            break

        # arXiv ToU: be polite (no more than ~1 req / 3s)
        time.sleep(sleep)

    return {"created": created}
