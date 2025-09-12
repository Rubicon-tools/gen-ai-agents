import argparse
from app.api_scraper.scraper import fetch_and_store

def main():
    p = argparse.ArgumentParser(description="arXiv API → Postgres (+Spaces)")
    p.add_argument("--mode", choices=["oldest", "newest"], required=True)
    p.add_argument("--query", default="all:agriculture")
    p.add_argument("--page-size", type=int, default=200)
    p.add_argument("--sleep", type=float, default=3.0)
    p.add_argument("--total", type=int, default=None)
    p.add_argument("--start-page", type=int, default=1)
    p.add_argument("--newest-window-pages", type=int, default=3)
    args = p.parse_args()

    result = fetch_and_store(
        query=args.query,
        mode=args.mode,
        page_size=args.page_size,
        sleep=args.sleep,
        total_results=args.total,
        newest_window_pages=args.newest_window_pages,
        start_page=args.start_page,
    )
    print(result)

if __name__ == "__main__":
    main()
