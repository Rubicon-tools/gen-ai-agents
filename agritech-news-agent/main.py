from app.scraper import scrape
import sys

if __name__ == "__main__":
    args = sys.argv[1:]

    # Default value
    max_articles = 10
    continue_mode = False

    if len(args) >= 1:
        if args[0].isdigit():
            max_articles = int(args[0])
            if len(args) > 1 and args[1] == "--continue":
                continue_mode = True
        elif args[0] == "--continue":
            continue_mode = True
        else:
            print("❌ Invalid argument.")
            print("Usage: python main.py [limit] [--continue]")
            sys.exit(1)

    # Just the query and sort order — no size or start
    url = (
        "https://arxiv.org/search/?searchtype=all&query=agriculture&abstracts=show&order=-submitted_date"
    )

    scrape(url, total_articles=max_articles, continue_mode=continue_mode)
