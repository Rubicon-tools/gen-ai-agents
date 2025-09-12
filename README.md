# ⚙️ Docker Utility Script

This repository contains a **helper script (`docker.sh`)** that simplifies common tasks for managing your Docker-based application, including building containers, managing lifecycle, exporting/importing data, and automatically reloading your Caddy reverse proxy after changes.

---

## 📁 File Structure

```
gen-ai-agents/
├── agritech-news-agent/
├── jira-report-generator/
├── n8n-builder/
├── n8n-builder-ngrok/
├── outline-doc/
├── internal-dashboard/
├── docker.sh
├── docker-compose-dev.yml
├── docker-compose-prod.yml
├── table_csv_tool.py
├── .env
├── .env.example
├── .gitignore
├── Dockerfile
└── README.md

```

---

## ⚙️ Initial Setup — One-Time Bootstrap

Before running this script on any individual project (like `agritech-news-agent`), you must:

1. **Go to the `gen-ai-agents` folder** (the root folder that holds all your subprojects)
2. **Run the initial build there** to create the shared base containers and network

```bash
cd gen-ai-agents
bash docker.sh build
```

This will create the necessary shared containers and network:

- 🧠 `gen-ai-caddy` — reverse proxy
- 🌐 `gen-ai-network` — the shared Docker network used by all sub-projects

> ⚠️ **Important:** This only needs to be done **once**. All subprojects (like `agritech-news-agent`) will then attach to this shared `gen-ai-network`.

3. **Adapt your `.env` file** in your project folder before running its build, making sure it points to the correct shared containers (Postgres host, etc.).

4. Now you can run `build` on your desired project:

```bash
cd agritech-news-agent
bash docker.sh build
```

---

## 🚀 Features

- 📦 **Build & Start** containers using the appropriate Compose file (`prod` by default or based on `NODE_ENV`)
- ♻️ **Restart / Stop / Start / Down** containers quickly
- 📝 **Export** any PostgreSQL table to CSV
- 📥 **Import** CSV back into PostgreSQL
- 📡 **Auto-reload Caddy** after build, restart, or up — so changes to your Caddyfile take effect immediately

---

## ⚙️ Environment

The script checks `NODE_ENV` to choose which compose file to use:

- `NODE_ENV=dev` → uses `docker-compose-dev.yml`
- `NODE_ENV=prod` (default) → uses `docker-compose-prod.yml`

Create a `.env` file in the project root with your usual environment variables (PostgreSQL credentials, etc.)

---

## 🧪 Usage

Run commands with:

```bash
bash docker.sh <command> [args...]
```

### 📋 Available Commands

| Command          | Description                                                      | Example                                     |
|------------------|------------------------------------------------------------------|---------------------------------------------|
| `build`           | Build containers and start them, then reload Caddy               | `bash docker.sh build`                       |
| `up`               | Start containers and reload Caddy                               | `bash docker.sh up`                          |
| `restart`          | Restart containers and reload Caddy                             | `bash docker.sh restart`                     |
| `down`              | Stop and remove containers                                     | `bash docker.sh down`                        |
| `logs`               | Show container logs                                             | `bash docker.sh logs app`                    |
| `export <table>`      | Export a database table to CSV                                 | `bash docker.sh export articles`             |
| `import <file.csv>`   | Import a CSV file into the database                            | `bash docker.sh import articles.csv`         |

---

## ⚡ Caddy Reload Behavior

Whenever you run:
- `build`
- `up`
- `restart`

…the script will automatically run:

```bash
docker exec gen-ai-caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
```

to make sure your Caddy reverse proxy uses the latest configuration.

---

## 🧼 Notes

- All commands must be run from the same directory as `docker.sh`.
- CSV files must be placed in the same directory before using `import`.
- `table_csv_tool.py` handles the actual import/export logic inside the container.

---

## 📄 License

MIT — free to use, modify, and distribute.
