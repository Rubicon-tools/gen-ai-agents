#!/bin/bash

# ────── COLORS ──────
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# ────── SETTINGS ──────
NGROK_API="http://localhost:4040/api/tunnels"
ENV_FILE=".env"
PROJECT_NAME="n8n + Ngrok + Ollama + PostgreSQL"

print_banner() {
  echo -e "${CYAN}"
  echo -e "===================================================="
  echo -e "   🚀 $PROJECT_NAME Launcher"
  echo -e "====================================================${NC}"
}

print_usage() {
  echo -e "${YELLOW}Usage:${NC} ./docker.sh {${GREEN}up${NC}|${RED}down${NC}|${CYAN}logs${NC}|restart|status}"
}

load_env_var() {
  grep "^$1=" "$ENV_FILE" | cut -d '=' -f2-
}

generate_env_with_url() {
  local url=$1
  local token=$(load_env_var "NGROK_TOKEN")
  local tz=$(load_env_var "TIMEZONE")
  local postgres_user=$(load_env_var "POSTGRES_USER")
  local postgres_pass=$(load_env_var "POSTGRES_PASSWORD")
  local postgres_db=$(load_env_var "POSTGRES_DB")
  local ollama_models=$(load_env_var "OLLAMA_MODELS")

  echo -e "${CYAN}🔧 Writing .env with Ngrok URL: $url${NC}"
  cat > "$ENV_FILE" <<EOF
# Timezone
TIMEZONE=$tz

# ngrok
NGROK_TOKEN=$token
URL=$url
WEBHOOK_URL=$url
EDITOR_BASE_URL=$url

# n8n
N8N_DEFAULT_BINARY_DATA_MODE=filesystem
N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
N8N_RUNNERS_ENABLED=true
N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true

# PostgreSQL
POSTGRES_USER=$postgres_user
POSTGRES_PASSWORD=$postgres_pass
POSTGRES_DB=$postgres_db

# Ollama
OLLAMA_MODELS=$ollama_models
EOF
}

fetch_ngrok_url() {
  echo -e "${CYAN}⏳ Waiting for Ngrok to expose a tunnel...${NC}"
  for i in {1..30}; do
    local url=$(curl -s "$NGROK_API" | jq -r '.tunnels[] | select(.proto=="https") | .public_url')
    if [[ -n "$url" && "$url" != "null" ]]; then
      echo "$url"  # ✅ Output clean URL (no color)
      return 0
    fi
    echo -e "${YELLOW}↪ Still waiting for Ngrok... ($i/30)${NC}"
    sleep 2
  done
  return 1
}

pull_ollama_models() {
  echo -e "${CYAN}🧠 Ensuring Ollama models are pulled...${NC}"
  docker exec ollama ollama pull gemma:2b
  docker exec ollama ollama pull llama3
  docker exec ollama ollama pull llava
  docker exec ollama ollama pull nous-hermes2
  docker exec ollama ollama pull mistral
  docker exec ollama ollama pull mistral:7b
}

# ────── MAIN ──────
print_banner

case "$1" in
  up)
    echo -e "${GREEN}▶ Starting all containers...${NC}"
    docker compose up -d

    pull_ollama_models

    sleep 8

    url=$(fetch_ngrok_url 2>/dev/null | tail -n 1)
    if [[ -z "$url" ]]; then
      echo -e "${RED}⛔ Aborting: Failed to fetch Ngrok URL.${NC}"
      exit 1
    fi

    echo -e "${GREEN}✔ Ngrok public URL: $url${NC}"
    generate_env_with_url "$url"

    echo -e "${YELLOW}🔁 Restarting only n8n container with updated URLs...${NC}"
    docker compose stop n8n
    docker compose rm -f n8n
    docker compose --env-file "$ENV_FILE" up -d n8n

    echo -e "${GREEN}✔ All ready.${NC}"
    echo -e "${CYAN}🌐 n8n Editor: $url"
    echo -e "🧠 Ollama API: http://localhost:11434${NC}"
    ;;
  down)
    echo -e "${RED}⏹ Stopping all containers...${NC}"
    docker compose down
    ;;
  restart)
    echo -e "${YELLOW}🔁 Restarting all containers...${NC}"
    docker compose down
    docker compose --env-file "$ENV_FILE" up -d --force-recreate --remove-orphans
    ;;
  logs)
    docker compose logs -f
    ;;
  status)
    docker compose ps
    ;;
  *)
    print_usage
    ;;
esac
