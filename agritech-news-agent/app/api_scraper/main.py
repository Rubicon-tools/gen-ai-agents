# main.py
import argparse
from app.scraper_api.scraper import fetch_and_store

def main():
    parser = argparse.ArgumentParser(description="arXiv API → Postgres (+optional Spaces upload)")
    parser.add_argument("--mode", choices=["oldest", "newest"], default="newest",
                        help="oldest=ascending insert, newest=descending then reverse before insert")
    parser.add_argument("--query", default="agriculture",
                        help="arXiv search query (supports ti:, abs:, au:, cat:, AND/OR)")
    parser.add_argument("--page-size", type=int, default=200,
                        help="max_results per request")
    parser.add_argument("--sleep", type=float, default=3.0,
                        help="seconds to sleep between requests (be polite)")
    parser.add_argument("--max-pages", type=int, default=None,
                        help="limit pages for testing")
    args = parser.parse_args()

    result = fetch_and_store(
        query=args.query,
        mode=args.mode,
        page_size=args.page_size,
        sleep=args.sleep,
        max_pages=args.max_pages,
    )
    print(result)

if __name__ == "__main__":
    main()
