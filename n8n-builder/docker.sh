#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PROFILE="cpu"  # Change to gpu or gpu-amd if needed
OLLAMA_CONTAINER="gen-ai-n8n-builder-ollama-$PROFILE"

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
    echo -e "${CYAN}Pulling required Ollama models...${NC}"
    docker exec "$OLLAMA_CONTAINER" ollama pull llama3
    docker exec "$OLLAMA_CONTAINER" ollama pull llava
    echo -e "${GREEN}✔ Ollama models pulled successfully.${NC}"
}

print_banner

case "$1" in
    up)
        echo -e "${GREEN}Starting containers with profile '$PROFILE'...${NC}"
        docker compose --profile $PROFILE up -d
        pull_models
        echo -e "${GREEN}✔ Containers and models are ready!${NC}"
        ;;
    down)
        echo -e "${RED}Stopping containers...${NC}"
        docker compose down
        echo -e "${RED}✖ Containers stopped.${NC}"
        ;;
    logs)
        echo -e "${CYAN}Showing logs...${NC}"
        docker compose logs -f
        ;;
    rebuild)
        echo -e "${YELLOW}Rebuilding containers...${NC}"
        docker compose down
        docker compose build
        docker compose --profile $PROFILE up -d
        pull_models
        echo -e "${YELLOW}🔁 Rebuild complete!${NC}"
        ;;
    status)
        echo -e "${CYAN}Container status:${NC}"
        docker compose ps
        ;;
    restart)
        echo -e "${YELLOW}Restarting containers...${NC}"
        docker compose restart
        echo -e "${GREEN}✔ Restart complete.${NC}"
        ;;
    ps)
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        ;;
    *)
        print_usage
        ;;
esac
