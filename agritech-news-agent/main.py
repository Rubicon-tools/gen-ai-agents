from app.scraper import scrape
import sys

if __name__ == "__main__":
    max_articles = int(sys.argv[1])

    # Just the query and sort order — no size or start
    url = (
        "https://arxiv.org/search/?searchtype=all&query=agriculture&abstracts=show&order=-submitted_date"
    )

    scrape(url, total_articles=max_articles)
