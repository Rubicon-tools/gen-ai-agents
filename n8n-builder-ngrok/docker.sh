#!/bin/bash

# ────── COLORS ──────
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ────── SETTINGS ──────
NGROK_API="http://localhost:4040/api/tunnels"
ENV_FILE=".env"
PROJECT_NAME="n8n + Ngrok + Ollama + PostgreSQL"
TMP_NGROK_URL_FILE=".ngrok_url.tmp"

print_banner() {
  echo -e "${CYAN}"
  echo "=============================================="
  echo "   🚀 $PROJECT_NAME Launcher"
  echo "==============================================${NC}"
}

print_usage() {
  echo -e "${YELLOW}Usage:${NC} ./docker.sh {${GREEN}up${NC}|${RED}down${NC}|${CYAN}logs${NC}|restart|status}"
}

load_env_var() {
  grep "^$1=" "$ENV_FILE" | cut -d '=' -f2-
}

get_ngrok_url() {
  echo -e "${CYAN}⏳ Waiting for Ngrok tunnel...${NC}"
  for i in {1..15}; do
    NGROK_URL=$(curl -s "$NGROK_API" | jq -r '.tunnels[] | select(.proto=="https") | .public_url')
    if [[ -n "$NGROK_URL" ]]; then
      echo -e "${GREEN}✔ Ngrok is running at: $NGROK_URL${NC}"
      echo "$NGROK_URL" > "$TMP_NGROK_URL_FILE"
      return 0
    fi
    sleep 1
  done
  echo -e "${RED}❌ Failed to fetch Ngrok URL.${NC}"
  return 1
}

generate_env() {
  local url=$1
  local token=$(load_env_var "NGROK_TOKEN")
  local tz=$(load_env_var "TIMEZONE")
  local postgres_user=$(load_env_var "POSTGRES_USER")
  local postgres_pass=$(load_env_var "POSTGRES_PASSWORD")
  local postgres_db=$(load_env_var "POSTGRES_DB")
  local ollama_models=$(load_env_var "OLLAMA_MODELS")

  echo -e "${CYAN}🔧 Regenerating .env with new URL: $url${NC}"
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

# ────── MAIN ──────
print_banner

case "$1" in
  up)
    echo -e "${GREEN}▶ Starting containers...${NC}"
    docker compose up -d

    if get_ngrok_url; then
      INITIAL_URL=$(cat "$TMP_NGROK_URL_FILE")
      generate_env "$INITIAL_URL"
      rm -f "$TMP_NGROK_URL_FILE"

      echo -e "${YELLOW}🔁 Restarting containers with updated .env...${NC}"
      docker compose down
      docker compose up -d

      echo -e "${CYAN}⏳ Waiting for Ngrok to regenerate final tunnel...${NC}"
      sleep 3
      if get_ngrok_url; then
        FINAL_URL=$(cat "$TMP_NGROK_URL_FILE")
        rm -f "$TMP_NGROK_URL_FILE"

        # Update .env again with the real active Ngrok URL
        generate_env "$FINAL_URL"
        echo -e "${GREEN}✔ All ready.${NC}"
        echo -e "${CYAN}🌐 n8n Editor: $FINAL_URL"
        echo -e "🧠 Ollama API: http://localhost:11434${NC}"
      fi
    fi
    ;;
  down)
    echo -e "${RED}⏹ Stopping containers...${NC}"
    docker compose down
    ;;
  restart)
    echo -e "${YELLOW}🔁 Restarting containers...${NC}"
    docker compose down
    docker compose up -d
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
