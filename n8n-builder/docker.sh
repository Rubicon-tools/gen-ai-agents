#!/bin/bash

# ────── COLORS ──────
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ────── HELP ──────
print_help() {
  echo -e "${CYAN}Usage:${NC} ./docker.sh [up|down|restart|help]"
  echo ""
  echo "Commands:"
  echo "  up        Start all containers and pull Ollama models"
  echo "  down      Stop and remove all containers and volumes"
  echo "  restart   Restart containers (down + up)"
  echo "  help      Show this help message"
}

# ────── MODEL PULLER ──────
pull_ollama_models() {
  echo -e "${CYAN}⏳ Pulling Ollama model(s): ${OLLAMA_MODELS}${NC}"
  docker compose up -d ollama
  sleep 5

  IFS=',' read -ra MODELS <<< "$OLLAMA_MODELS"
  for model in "${MODELS[@]}"; do
    echo -e "${CYAN}⬇ Pulling model: $model${NC}"
    docker exec ollama ollama pull "$model" || echo -e "${YELLOW}⚠ Failed to pull: $model${NC}"
  done
}

# ────── UP ──────
start_services() {
  echo -e "${CYAN}▶ Starting containers...${NC}"
  pull_ollama_models
  docker compose up -d
  echo -e "${GREEN}✅ All services are up and running.${NC}"
}

# ────── DOWN ──────
stop_services() {
  echo -e "${RED}🛑 Stopping and removing all containers and volumes...${NC}"
  docker compose down -v
  echo -e "${GREEN}✅ All containers and volumes have been removed.${NC}"
}

# ────── MAIN SWITCH ──────
case "$1" in
  up)
    start_services
    ;;
  down)
    stop_services
    ;;
  restart)
    stop_services
    start_services
    ;;
  help | *)
    print_help
    ;;
esac
