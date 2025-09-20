# 🧠 Agritech News Agent

A robust and resumable agent that collects agriculture-related research papers from [arXiv.org](https://arxiv.org).  
Built with Docker, PostgreSQL, and Python — optimized for performance, duplicate handling, and future-proof extensions (e.g., PDF storage in DigitalOcean Spaces).

---

## ⚙️ Initial Setup — One-Time Bootstrap

Before building this project, you must first set up the shared base infrastructure:

1. **Go to the `gen-ai-agents` folder** (the root folder for all subprojects)
2. **Run the build script there** to create shared services and network:

```bash
cd gen-ai-agents
bash docker.sh build
```

This will create the necessary shared containers and network:

- 🧠 `gen-ai-caddy` — reverse proxy
- 🌐 `gen-ai-network` — the shared Docker network used by all sub-projects

> ⚠️ **Important:** This step only needs to be done **once**. All subprojects (like `agritech-news-agent`) will then attach to this shared `gen-ai-network`.

3. **Adapt your `.env`** in the `agritech-news-agent` folder to point to the shared PostgreSQL service (`POSTGRES_HOST`, etc.)

4. Now you can build this project:

```bash
cd agritech-news-agent
bash docker.sh build
```

---

## 🚀 Features

- ⚡ Scrape or fetch agriculture-related articles from arXiv
- 🧠 Two ingestion modes:
  - `scraper/` — legacy HTML scraper
  - `api_scraper/` — modern API-based fetcher (recommended)
- ✅ Automatically skips already-inserted articles
- 📦 Saves metadata to PostgreSQL
- ☁️ Optionally uploads PDFs to DigitalOcean Spaces
- ⚙️ Fully Dockerized

---

## 📁 Project Structure

```bash
agritech-news-agent/
│
├── app/
│   ├── config.py
│   ├── db.py
│   ├── uploader.py
│   ├── __init__.py
│   │
│   ├── scraper/            # 🕸️ Legacy HTML scraper
│   │   ├── __init__.py
│   │   ├── api.py
│   │   ├── scraper.py
│   │   └── main.py
│   │
│   ├── api_scraper/         # ⚡ Official API-based fetcher
│   │   ├── __init__.py
│   │   ├── api.py
│   │   ├── scraper.py
│   │   └── main.py
│   │
│   └── rag/                 # Optional RAG ingestion logic
│       ├── __init__.py
│       └── api.py
│
├── docker.sh
├── Dockerfile
├── docker-compose-dev.yml
├── docker-compose-prod.yml
├── requirements.txt
├── .env.example
└── README.md
```

---

## ⚙️ Environment Variables

```env
ENV=dev

POSTGRES_HOST=n8n-builder-dev-postgres
POSTGRES_PORT=5432
POSTGRES_USER=n8n
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=n8n_db

S3_UPLOAD=false
SPACES_KEY=your_access_key
SPACES_SECRET=your_secret_key
SPACES_REGION=fra1
SPACES_BUCKET=your-bucket-name
SPACES_ENDPOINT=https://fra1.digitaloceanspaces.com
```

---

📋 Available Commands

| Command | Description | Example |
|---|---|---|
| `build` | Build the image with the selected compose file and start containers | `bash docker.sh build` |
| `up` | Start containers (detached) using the selected compose file | `bash docker.sh up` |
| `restart` | Restart running containers | `bash docker.sh restart` |
| `down` | Stop and remove containers | `bash docker.sh down` |
| `logs [service]` | Show container logs (optionally for a specific service) | `bash docker.sh logs app` |
| `scrape [limit] [-continue] [-bg]` | Run the **legacy HTML** scraper. `limit` defaults to 25; `-continue` skips already-saved articles; `-bg` runs in background and writes to `logs/scraper.out`. | `bash docker.sh scrape 50 -continue -bg` |
| `scrape-newest [-bg]` | Run the **legacy HTML** scraper for newest items (uses `--newest --continue`). `-bg` runs in background to `logs/scraper-newest.out`. | `bash docker.sh scrape-newest -bg` |
| `api-scraper [-bg] [-q|--query q] [--page-size N] [--sleep S] [--total T] [--start-page P]` | Run the **API** scraper in **oldest→newest (single pass)** mode. Defaults: `q=agriculture`, `page-size=200`, `sleep=3.0`. Use `--total` to supply known total results and `--start-page` (1-based) to resume. `-bg` logs to `logs/api-scraper.out`. | `bash docker.sh api-scraper --total 3179 --page-size 200` |
| `api-scraper-newest [-bg] [-q|--query q] [--page-size N] [--sleep S] [--newest-pages K]` | Run the **API** scraper for the newest window (default last **3 pages**). Inserts in chronological order and skips duplicates. `-bg` logs to `logs/api-scraper-newest.out`. | `bash docker.sh api-scraper-newest --newest-pages 3 -bg` |
| `stop-scraper` | Stop any background scraper process running inside the container | `bash docker.sh stop-scraper` |

---

## 🧪 Usage

### 🕸️ Legacy HTML Scraper

#### Full Backfill (Oldest → Newest)

```bash
bash docker.sh scrape
bash docker.sh scrape 20 -continue
```

- Scrapes using the HTML pages  
- `-continue` skips already-saved IDs  
- Use `-bg` to run in background  
- Logs: `logs/scraper.out`

#### Daily Sync (Newest-Only Window)

```bash
bash docker.sh scrape-newest
bash docker.sh scrape-newest 20 -continue
```

- Skips duplicates automatically  
- Logs: `logs/scraper-newest.out`

---

### ⚡ API Scraper (Recommended)

Fetches directly from the official arXiv API — faster, more reliable, and version-safe.

#### Full Backfill (Oldest → Newest)

```bash
bash docker.sh api-scraper --total 3179 --page-size 200
```

- Downloads all articles (starting from oldest)  
- Use `-bg` to run in background  
- Logs: `logs/api-scraper.out`

#### Daily Sync (Newest-Only Window)

```bash
bash docker.sh api-scraper-newest --newest-pages 3 --page-size 200
```

- Checks only the newest ~600 articles  
- Skips duplicates automatically  
- Logs: `logs/api-scraper-newest.out`

---

## 🧼 Cleanup

Stop and remove containers:

```bash
bash docker.sh down
```

---

## 📄 License

MIT — free to use, modify, and distribute.
