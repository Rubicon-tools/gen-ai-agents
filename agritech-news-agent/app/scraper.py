import time
import random
import requests
from bs4 import BeautifulSoup
from app.db import insert_article, init_db

BASE_URL = "https://arxiv.org"

def parse_article(article):
    try:
        arxiv_id = article.find("p", class_="list-title").a.text.strip().replace("arXiv:", "")
        title = article.find("p", class_="title").text.strip()
        authors = ", ".join(a.text.strip() for a in article.find("p", class_="authors").find_all("a"))
        abstract_block = article.find("span", class_="abstract-full")
        abstract = abstract_block.text.strip().replace("△ Less", "") if abstract_block else ""
        date_line = article.find("p", class_="is-size-7").text.strip()
        submission_date = date_line.replace("Submitted ", "").split(";")[0].strip()
        pdf_link = article.find("a", title="Download PDF")
        pdf_url = BASE_URL + pdf_link['href'] if pdf_link else ""
        return {
            "id": arxiv_id,
            "title": title,
            "authors": authors,
            "abstract": abstract,
            "submission_date": submission_date,
            "pdf_url": pdf_url
        }
    except Exception as e:
        print(f"❌ Error parsing article: {e}")
        return None

def scrape(url: str, max_articles: int = None):
    print(f"🔍 Scraping from:\n{url}\n")
    init_db()

    response = requests.get(url)
    if response.status_code != 200:
        print(f"❌ Failed to fetch page: HTTP {response.status_code}")
        return

    soup = BeautifulSoup(response.text, "html.parser")
    results = soup.find_all("li", class_="arxiv-result")

    # None or 0 means scrape all
    max_articles = float("inf") if not max_articles else max_articles

    count = 0
    for article in results:
        if count >= max_articles:
            break
        parsed = parse_article(article)
        if parsed:
            insert_article(parsed)
            count += 1

            # 💤 Sleep to mimic human behavior
            time.sleep(random.uniform(1.2, 2.5))

    print(f"\n✅ Done. Scraped and saved {count} article(s).")
