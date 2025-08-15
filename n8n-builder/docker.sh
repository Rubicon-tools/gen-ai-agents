#!/bin/bash
set -e

# ────── COLORS ──────
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ────── CONFIG ──────
OLLAMA_SERVICE_NAME="ollama"
ENV_FILE=".env"

# ────── UTILS ──────
print_banner() {
  echo -e "${CYAN}"
  echo "====================================="
  echo "        🚀 n8n Docker Manager        "
  echo "====================================="
  echo -e "${NC}"
}

print_usage() {
  echo -e "${YELLOW}Usage:${NC} ./docker.sh {${GREEN}up${NC}|${RED}down${NC}|${CYAN}logs${NC}|${YELLOW}rebuild${NC}|status|restart|ps}"
}

pull_models() {
  echo -e "${CYAN}🔄 Checking if Ollama is running...${NC}"

  if docker compose ps --services --filter "status=running" | grep -q "^$OLLAMA_SERVICE_NAME$"; then

    # Extract models from .env
    if [ ! -f "$ENV_FILE" ]; then
      echo -e "${RED}❌ .env file not found. Cannot load OLLAMA_MODELS.${NC}"
      return
    fi

    MODELS_RAW=$(grep "^OLLAMA_MODELS=" "$ENV_FILE" | cut -d '=' -f2- | tr -d '"')
    if [ -z "$MODELS_RAW" ]; then
      echo -e "${YELLOW}⚠ No OLLAMA_MODELS defined in .env. Skipping pulls.${NC}"
      return
    fi

    IFS=',' read -ra MODELS <<< "$MODELS_RAW"

    echo -e "${CYAN}⬇ Pulling models: ${MODELS[*]}${NC}"
    for model in "${MODELS[@]}"; do
      model=$(echo "$model" | xargs) # trim whitespace
      [ -n "$model" ] && docker compose exec "$OLLAMA_SERVICE_NAME" ollama pull "$model"
    done

    echo -e "${GREEN}✔ Ollama models pulled successfully.${NC}"
  else
    echo -e "${YELLOW}⚠ Ollama container not running. Skipping model pull.${NC}"
  fi
}

# ────── MAIN ──────
print_banner

case "$1" in
  up)
    echo -e "${GREEN}▶ Starting containers...${NC}"
    docker compose up -d
    pull_models
    echo -e "${GREEN}✔ All containers started.${NC}"
    ;;

  down)
    echo -e "${RED}⏹ Stopping containers...${NC}"
    docker compose down
    echo -e "${RED}✖ Containers stopped.${NC}"
    ;;

  logs)
    echo -e "${CYAN}📄 Showing logs...${NC}"
    docker compose logs -f
    ;;

  rebuild)
    echo -e "${YELLOW}🛠 Rebuilding containers...${NC}"
    docker compose down
    docker compose build
    docker compose up -d
    pull_models
    echo -e "${GREEN}🔁 Rebuild complete.${NC}"
    ;;

  restart)
    echo -e "${YELLOW}🔄 Restarting containers...${NC}"
    docker compose restart
    echo -e "${GREEN}✔ Restart complete.${NC}"
    ;;

  status)
    echo -e "${CYAN}📦 Container status:${NC}"
    docker compose ps
    ;;

  ps)
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    ;;

  *)
    print_usage
    ;;
esac
