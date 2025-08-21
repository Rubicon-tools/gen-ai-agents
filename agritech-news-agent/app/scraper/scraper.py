import os
import time
import math
import random
import requests
from bs4 import BeautifulSoup, NavigableString
from app.db import insert_article, init_db, get_all_article_ids
from app.scraper.uploader import upload_pdf_to_spaces
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://arxiv.org"
PAGE_SIZE = 25
PROGRESS_EVERY = 1
TEMP_PDF_DIR = "/tmp"
S3_UPLOAD = os.getenv("S3_UPLOAD") == "true"

def print_duration(seconds):
    if seconds < 60:
        print(f"🕒 Time spent: {seconds:.2f} seconds")
    elif seconds < 3600:
        print(f"🕒 Time spent: {seconds / 60:.2f} minutes")
    else:
        print(f"🕒 Time spent: {seconds / 3600:.2f} hours")

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
            "pdf_url": pdf_url,
            "uploaded_file_url": None
        }
    except Exception as e:
        print(f"❌ Error parsing article: {e}")
        return None

def download_and_upload_pdf(arxiv_id):
    pdf_url = f"{BASE_URL}/pdf/{arxiv_id}"
    local_path = os.path.join(TEMP_PDF_DIR, f"{arxiv_id}.pdf")
    try:
        response = requests.get(pdf_url)
        if response.status_code == 200:
            with open(local_path, "wb") as f:
                f.write(response.content)
            uploaded_url = upload_pdf_to_spaces(local_path, object_name=f"{arxiv_id}.pdf")
            os.remove(local_path)
            return uploaded_url
        else:
            print(f"❌ Could not download PDF for {arxiv_id}")
            return None
    except Exception as e:
        print(f"❌ Error downloading/uploading PDF for {arxiv_id}: {e}")
        return None

def scrape(base_url: str, total_articles: int = None, continue_mode: bool = False, newest: bool = False):
    start_time = time.time()
    print(f"🚜 Starting agritech-news-agent scraper...")
    init_db()

    if not newest and (not total_articles or total_articles <= 0):
        print("❌ total_articles must be a positive integer when newest=False.")
        return

    print("📦 Preloading existing article IDs...")
    existing_ids = get_all_article_ids()
    print(f"✅ Loaded {len(existing_ids)} existing articles from DB.")

    scraped = 0

    if newest:
        # Only fetch the first page
        paged_url = f"{base_url}&size={PAGE_SIZE}&start=0"
        print(f"\n🔍 Scraping page 1:\n{paged_url}\n")

        try:
            response = requests.get(paged_url)
            response.raise_for_status()
        except Exception as e:
            print(f"❌ Failed to fetch newest page: {e}")
            return

        soup = BeautifulSoup(response.text, "html.parser")
        results = soup.find_all("li", class_="arxiv-result")
        if not results:
            print("⚠️ No articles found on this page.")
            return

        parsed_articles = [parse_article(article) for article in results if parse_article(article) is not None]
        parsed_articles.reverse()  # Optional: newest at the end

        for parsed in parsed_articles:
            article_id = parsed["article_id"]
            if article_id in existing_ids:
                print(f"⏭️  Skipping existing article_id: {article_id}")
                continue

            if S3_UPLOAD:
                uploaded_pdf_url = download_and_upload_pdf(article_id)
                if uploaded_pdf_url:
                    parsed["uploaded_file_url"] = uploaded_pdf_url

            insert_article(parsed)
            existing_ids.add(article_id)
            scraped += 1
            print(f"📊 Progress: {scraped} article(s) saved")

            time.sleep(random.uniform(1.2, 2.5))

    else:
        # Standard pagination scraping
        total_pages = math.ceil(total_articles / PAGE_SIZE)

        for page in range(total_pages):
            if scraped >= total_articles:
                break

            start = page * PAGE_SIZE
            paged_url = f"{base_url}&size={PAGE_SIZE}&start={start}"
            print(f"\n🔍 Scraping page {page + 1}:\n{paged_url}\n")

            try:
                response = requests.get(paged_url)
                response.raise_for_status()
            except Exception as e:
                print(f"❌ Failed to fetch page {page + 1}: {e}")
                continue

            soup = BeautifulSoup(response.text, "html.parser")
            results = soup.find_all("li", class_="arxiv-result")
            if not results:
                print("⚠️ No articles found on this page.")
                break

            parsed_articles = [parse_article(article) for article in results if parse_article(article) is not None]

            for parsed in parsed_articles:
                if scraped >= total_articles:
                    break

                article_id = parsed["article_id"]
                if article_id in existing_ids:
                    if continue_mode:
                        print(f"⏭️  Skipping existing article_id: {article_id}")
                        scraped += 1
                        continue
                    else:
                        print(f"🛑 Found already scraped article_id: {article_id}. Stopping.")
                        print_duration(time.time() - start_time)
                        return

                if S3_UPLOAD:
                    uploaded_pdf_url = download_and_upload_pdf(article_id)
                    if uploaded_pdf_url:
                        parsed["uploaded_file_url"] = uploaded_pdf_url

                insert_article(parsed)
                existing_ids.add(article_id)
                scraped += 1

                if scraped % PROGRESS_EVERY == 0:
                    print(f"📊 Progress: {scraped}/{total_articles} articles saved")

                time.sleep(random.uniform(1.2, 2.5))

    print(f"\n✅ Done. Scraped and saved {scraped} article(s).")
    print_duration(time.time() - start_time)
