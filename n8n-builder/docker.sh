#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_banner() {
    echo -e "${CYAN}"
    echo "============================="
    echo "         n8n Docker           "
    echo "============================="
    echo -e "${NC}"
}

print_usage() {
    echo -e "${YELLOW}Usage:${NC} ./docker.sh {${GREEN}up${NC}|${RED}down${NC}|${CYAN}logs${NC}|${YELLOW}rebuild${NC}}"
}

print_banner

case "$1" in
    up)
        echo -e "${GREEN}Starting containers...${NC}"
        docker compose up -d
        echo -e "${GREEN}Done!${NC}"
        ;;
    down)
        echo -e "${RED}Stopping containers...${NC}"
        docker compose down
        echo -e "${RED}Done!${NC}"
        ;;
    logs)
        echo -e "${CYAN}Showing logs...${NC}"
        docker compose logs -f
        ;;
    rebuild)
        echo -e "${YELLOW}Rebuilding containers...${NC}"
        docker compose down
        docker compose build
        docker compose up -d
        echo -e "${YELLOW}Rebuild complete!${NC}"
        ;;
    *)
        print_usage
        ;;
esac
