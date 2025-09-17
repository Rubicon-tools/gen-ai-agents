"""
Scraper API package for agritech-news-agent.

Contains logic for fetching arXiv articles using the official API and
orchestrating storage routines.

- scraper.py : Core logic for querying the arXiv API, transforming
                  entries into the article schema, and inserting them
                  into PostgreSQL (with optional PDF upload to Spaces).
- main.py       : CLI entrypoint for running the process manually or
                  via cron.
- api.py        : (optional) FastAPI service exposing /api-scrape
                  so automations like n8n can trigger the ingestion.
"""