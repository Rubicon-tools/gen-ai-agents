# main.py

from app.scraper import scrape
from app.config import DEFAULT_MAX_ARTICLES

if __name__ == "__main__":
    # You can modify this query string or pass it dynamically
    url = (
        "https://arxiv.org/search/?searchtype=all&query=agriculture&abstracts=show&size=50&order=-submitted_date"
    )

    print("🚜 Starting agritech-news-agent scraper...")
    scrape(url, max_articles=DEFAULT_MAX_ARTICLES)
