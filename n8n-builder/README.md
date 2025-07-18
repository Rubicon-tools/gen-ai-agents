
# 🚀 n8n Self-Hosted with Caddy (Dockerized)

This project provides a simple, production-ready setup for running **n8n** with **Caddy** as a reverse proxy using **Docker Compose** on a **DigitalOcean VPS**.

Caddy automatically handles HTTPS certificates via Let's Encrypt, and this configuration cleanly separates concerns between `n8n` and `Caddy`.

---

## 📂 Project Structure
```
.
├── .env                # Environment variables (domain, timezone, paths)
├── docker-compose.yml  # Docker Compose configuration
├── docker.sh           # Helper script for managing containers (colorful)
├── caddy_config/
│   └── Caddyfile       # Caddy reverse proxy configuration
└── local_files/        # Folder for n8n's local files (optional persistence)
```

---

## ⚙️ Environment Variables (`.env`)
| Key           | Description                      |
|---------------|----------------------------------|
| DATA_FOLDER   | Path for volumes (local persistence) |
| DOMAIN_NAME   | Your main domain (e.g., `xx.ma`)    |
| SUBDOMAIN     | Your subdomain (e.g., `yy`)         |
| GENERIC_TIMEZONE | Your timezone (e.g., `Africa/Casablanca`) |
| SSL_EMAIL     | Email used for SSL certificates     |

---

## 🔧 Usage

### 1️⃣ Start Containers
```bash
./docker.sh up
```

### 2️⃣ View Logs
```bash
./docker.sh logs
```

### 3️⃣ Stop Containers
```bash
./docker.sh down
```

### 4️⃣ Rebuild Everything
```bash
./docker.sh rebuild
```

---

## 🌐 Access
Once running, access your instance at:
```
https://<SUBDOMAIN>.<DOMAIN_NAME>  (Example: https://yy.xx.ma)
```

---

## 🐳 Useful Docker Commands
```bash
docker ps          # See running containers
docker logs <name> # View logs for a specific container
docker compose down --volumes # Remove containers & volumes
```

---

## 📌 Notes
- **Caddy** handles HTTPS certificates via Let's Encrypt automatically.
- **DNS** must point your `yy.xx.ma` to your DigitalOcean droplet.
- Volumes are used for persistence (`n8n_data`, `caddy_data`).
- This setup is intended for **production** use.

---

## 🤝 Credits
- [n8n.io](https://n8n.io)
- [Caddy Server](https://caddyserver.com)
- [Docker](https://docker.com)

---

## 🛠️ Optional Improvements
- Healthchecks for containers
- Automatic backups for `n8n`
- Monitoring via Watchtower or Uptime Kuma

---
