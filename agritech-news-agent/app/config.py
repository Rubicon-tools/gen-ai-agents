# app/config.py

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Environment: 'dev' or 'prod'
ENV = os.getenv("ENV", "dev").lower()

# PostgreSQL connection settings
POSTGRES = {
    "host": os.getenv("POSTGRES_HOST", "localhost"),
    "port": int(os.getenv("POSTGRES_PORT", 5432)),
    "user": os.getenv("POSTGRES_USER", "postgres"),
    "password": os.getenv("POSTGRES_PASSWORD", "postgres"),
    "database": os.getenv("POSTGRES_DB", "arxiv_db"),
}

# Scraping configuration
DEFAULT_MAX_ARTICLES = 5
