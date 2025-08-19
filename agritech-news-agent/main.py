from app.scraper import scrape
from app.config import DEFAULT_MAX_ARTICLES

if __name__ == "__main__":
    # Just the query and sort order — no size or start
    url = (
        "https://arxiv.org/search/?searchtype=all&query=agriculture&abstracts=show&order=-submitted_date"
    )

    scrape(url, total_articles=DEFAULT_MAX_ARTICLES)
