# 🧠 Agritech News Agent

A robust and resumable scraper that collects agriculture-related research papers from [arXiv.org](https://arxiv.org). Built with Docker, PostgreSQL, and Python — optimized for performance, duplicate handling, and future-proof extensions (e.g., PDF storage in DigitalOcean).

---

## 🚀 Features

- 🔍 Scrapes agriculture-related articles from arXiv (using search).
- ✅ Automatically skips already-scraped articles when using `--continue` mode.
- 🧠 Resumable scraping using `article_id` logic.
- 📦 Saves all metadata into a PostgreSQL database.
- ⚙️ Dockerized for easy local or remote deployments.

---

## 📁 Project Structure

```bash
agritech-news-agent/
├── app/
│   ├── scraper.py         # Scraping logic and logic for resume mode
│   ├── db.py              # DB connection, schema, and insert logic
│   ├── config.py          # Environment-based settings
│   └── __init__.py
├── Dockerfile             # Container build instructions
├── docker-compose.yml     # Services config (Postgres, scraper)
├── docker.sh              # CLI tool to build/start/scrape
├── main.py                # Entry point for the scraper
├── requirements.txt       # Python dependencies
└── README.md              # You’re reading it!
```

---

## ⚙️ Setup Instructions

### 1. 📦 Install Dependencies

Make sure you have:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- (Optional) [Python 3.11+](https://www.python.org/) if running outside Docker

---

### 2. ⚙️ Configure Environment

Create a `.env` file with the following content:

```env
ENV=dev

POSTGRES_HOST=n8n-builder-dev-postgres
POSTGRES_PORT=5432
POSTGRES_USER=n8n
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=n8n_db
```

---

### 3. 🐳 Build & Start the App

```bash
bash docker.sh build
```

This builds the image and starts the container. To check if it’s running:

```bash
docker ps
```

---

## 🧪 Usage

### ➕ Scrape New Articles

```bash
bash docker.sh scrape
```

This will scrape the latest 10 articles and **stop on the first duplicate** found.

### 🔁 Continue Mode (Skip Existing)

```bash
bash docker.sh scrape -continue
```

Keeps scraping up to 10 articles, **skipping** those already saved; usually used when your scraper stopped mid-scrape.

### 🎯 Specify Limit

```bash
bash docker.sh scrape 20
bash docker.sh scrape 20 -continue
```

---

## 🧼 Cleanup

To stop and remove containers:

```bash
bash docker.sh stop
```

---

## 📄 License

MIT License — do whatever you want, but give credit where due.

---
## ✨ Credits

Built by the GenAI team 🧠 with ❤️ — Powered by Docker & Python