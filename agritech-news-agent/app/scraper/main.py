from app.scraper.scraper import scrape
import sys

def scrape_all_articles(limit, continue_mode):
    """
    Scrape all articles from oldest to newest.
    Used for initial bulk ingestion.
    """
    url = "https://arxiv.org/search/?searchtype=all&query=agriculture&abstracts=show&order=submitted_date"
    scrape(url, total_articles=limit, continue_mode=continue_mode)

def scrape_newest_articles(limit, continue_mode):
    """
    Scrape newest articles from newest to oldest.
    Used for daily updates.
    'continue_mode' is optional and disabled by default.
    To preserve order in DB, reverse insert within page.
    """
    url = "https://arxiv.org/search/?searchtype=all&query=agriculture&abstracts=show&order=-submitted_date"
    scrape(url, total_articles=limit, continue_mode=continue_mode, reverse_within_page=True)

if __name__ == "__main__":
    args = sys.argv[1:]

    # Defaults
    max_articles = 25
    continue_mode = False
    get_newest_mode = False

    # Parse CLI args
    for arg in args:
        if arg.isdigit():
            max_articles = int(arg)
        elif arg == "--continue":
            continue_mode = True
        elif arg == "--newest":
            get_newest_mode = True
        else:
            print(f"❌ Unknown argument: {arg}")
            print("Usage: python main.py [limit] [--continue] [--newest]")
            sys.exit(1)

    # Run the appropriate scrape method
    if get_newest_mode:
        scrape_newest_articles(max_articles, continue_mode)
    else:
        scrape_all_articles(max_articles, continue_mode)
