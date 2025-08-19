import time
import math
import random
import requests
from bs4 import BeautifulSoup, NavigableString
from app.db import insert_article, init_db, get_all_article_ids

BASE_URL = "https://arxiv.org"
PAGE_SIZE = 25
PROGRESS_EVERY = 1

def parse_article(article):
    try:
        arxiv_id = article.find("p", class_="list-title").a.text.strip().replace("arXiv:", "")
        title = article.find("p", class_="title").text.strip()
        authors = ", ".join(a.text.strip() for a in article.find("p", class_="authors").find_all("a"))

        abstract_block = article.find("span", class_="abstract-full")
        abstract = abstract_block.text.strip().replace("△ Less", "") if abstract_block else ""

        # Submission date
        submission_date = ""
        date_block = article.find("p", class_="is-size-7")
        if date_block and "Submitted" in date_block.text:
            submission_date = date_block.text.split("Submitted")[1].split(";")[0].strip()

        # Originally announced
        originally_announced = ""
        announced_tag = date_block.find("span", string="originally announced")
        if announced_tag and isinstance(announced_tag.next_sibling, NavigableString):
            originally_announced = announced_tag.next_sibling.strip().rstrip(".")

        # PDF URL
        pdf_url = f"{BASE_URL}/pdf/{arxiv_id}"

        return {
            "article_id": arxiv_id,
            "title": title,
            "authors": authors,
            "abstract": abstract,
            "submission_date": submission_date,
            "originally_announced": originally_announced,
            "pdf_url": pdf_url
        }

    except Exception as e:
        print(f"❌ Error parsing article: {e}")
        return None


def scrape(base_url: str, total_articles: int = None):
    print(f"🚜 Starting agritech-news-agent scraper...")
    init_db()

    if not total_articles or total_articles <= 0:
        print("❌ total_articles must be a positive integer.")
        return

    print("📦 Preloading existing article IDs...")
    existing_ids = get_all_article_ids()
    print(f"✅ Loaded {len(existing_ids)} existing articles from DB.")

    total_pages = math.ceil(total_articles / PAGE_SIZE)
    scraped = 0

    for page in range(total_pages):
        if scraped >= total_articles:
            break

        start = page * PAGE_SIZE
        paged_url = f"{base_url}&size={PAGE_SIZE}&start={start}"
        print(f"\n🔍 Scraping page {page + 1}:\n{paged_url}\n")

        try:
            response = requests.get(paged_url)
        except Exception as e:
            print(f"❌ Failed to fetch page {page + 1}: {e}")
            continue

        if response.status_code != 200:
            print(f"❌ HTTP {response.status_code} on page {page + 1}")
            continue

        soup = BeautifulSoup(response.text, "html.parser")
        results = soup.find_all("li", class_="arxiv-result")
        if not results:
            print("⚠️ No articles found on this page.")
            break

        parsed_articles = [
            parse_article(article)
            for article in results
            if parse_article(article) is not None
        ]

        # Sort newest first
        parsed_articles.sort(key=lambda a: float(a['article_id']), reverse=True)

        for parsed in parsed_articles:
            if scraped >= total_articles:
                break

            article_id = parsed["article_id"]
            if article_id in existing_ids:
                print(f"⏭️ Skipping existing article_id: {article_id}")
                existing_ids.add(article_id)
                scraped += 1
                continue

            insert_article(parsed)
            time.sleep(0.5)
            existing_ids.add(article_id)
            scraped += 1

            if scraped % PROGRESS_EVERY == 0:
                print(f"📊 Progress: {scraped}/{total_articles} articles saved")

            time.sleep(random.uniform(1.2, 2.5))

    print(f"\n✅ Done. Scraped and saved {scraped} new article(s).")
