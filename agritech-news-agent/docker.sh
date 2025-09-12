#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load .env if present
if [ -f "$SCRIPT_DIR/.env" ]; then
  set -o allexport
  source "$SCRIPT_DIR/.env"
  set +o allexport
fi

# Compose file logic
COMPOSE_FILE="docker-compose-prod.yml"
if [ -n "$ENV" ] && [ -f "$SCRIPT_DIR/docker-compose-${ENV}.yml" ]; then
  COMPOSE_FILE="docker-compose-${ENV}.yml"
fi

CONTAINER_NAME="agritech-news-agent"

case "$1" in
  build)
    echo "Building Docker image using $COMPOSE_FILE..."
    docker compose -f $COMPOSE_FILE build

    echo "⬆️ Starting container after build..."
    docker compose -f $COMPOSE_FILE up -d
    ;;
  up)
    echo "Starting containers using $COMPOSE_FILE..."
    docker compose -f $COMPOSE_FILE up -d
    ;;
  down)
    echo "Stopping containers using $COMPOSE_FILE..."
    docker compose -f $COMPOSE_FILE down
    ;;
  restart)
    echo "Restarting containers using $COMPOSE_FILE..."
    docker compose -f $COMPOSE_FILE restart
    ;;
  logs)
    shift
    echo "Showing logs using $COMPOSE_FILE..."
    docker compose -f $COMPOSE_FILE logs "$@"
    ;;
  scrape)
    echo "📄 Running scraper inside the container..."

    ARTICLE_LIMIT=25
    CONTINUE_FLAG=""
    BACKGROUND="false"

    for arg in "$@"; do
      case "$arg" in
        -continue)
          CONTINUE_FLAG="--continue"
          ;;
        -bg)
          BACKGROUND="true"
          ;;
        [0-9]*)
          ARTICLE_LIMIT="$arg"
          ;;
        scrape)
          ;; # skip
        *)
          echo "❌ Invalid argument: '$arg'"
          echo "Usage: bash $0 scrape [limit] [-continue] [-bg]"
          exit 1
          ;;
      esac
    done

    CMD="python app/scraper/main.py $ARTICLE_LIMIT $CONTINUE_FLAG"

    if [ "$BACKGROUND" = "true" ]; then
      echo "🧵 Running in background with nohup..."
      nohup docker exec $CONTAINER_NAME $CMD > logs/scraper.out 2>&1 &
      echo "📌 Background PID: $!"
      echo "📝 Logs: logs/scraper.out"
    else
      docker exec -it $CONTAINER_NAME $CMD
    fi
    ;;

  scrape-newest)
    echo "📰 Scraping newest articles (most recent first)..."

    BACKGROUND="false"

    for arg in "$@"; do
      case "$arg" in
        -bg)
          BACKGROUND="true"
          ;;
        scrape-newest)
          ;; # skip
        *)
          echo "❌ Invalid argument: '$arg'"
          echo "Usage: bash $0 scrape-newest [-bg]"
          exit 1
          ;;
      esac
    done

    CMD="python app/scraper/main.py --newest --continue"

    if [ "$BACKGROUND" = "true" ]; then
      echo "🧵 Running in background with nohup..."
      nohup docker exec $CONTAINER_NAME $CMD > logs/scraper-newest.out 2>&1 &
      echo "📌 Background PID: $!"
      echo "📝 Logs: logs/scraper-newest.out"
    else
      docker exec -it $CONTAINER_NAME $CMD
    fi
    ;;
  api-scraper)
    echo "📡 Running API scraper (oldest-first backfill)..."

    BACKGROUND="false"
    QUERY="agriculture"
    PAGE_SIZE=200
    SLEEP=3.0
    MAX_PAGES=""

    # Parse args: -bg, -q/--query, --page-size, --sleep, --max-pages
    shift
    while [[ $# -gt 0 ]]; do
      case "$1" in
        -bg)
          BACKGROUND="true"
          ;;
        -q|--query)
          QUERY="$2"; shift
          ;;
        --page-size)
          PAGE_SIZE="$2"; shift
          ;;
        --sleep)
          SLEEP="$2"; shift
          ;;
        --max-pages)
          MAX_PAGES="$2"; shift
          ;;
        *)
          echo "❌ Invalid argument: '$1'"
          echo "Usage: bash $0 api-scraper [-bg] [-q|--query \"agriculture\"] [--page-size 200] [--sleep 3.0] [--max-pages N]"
          exit 1
          ;;
      esac
      shift
    done

    CMD="python main.py --mode oldest --query \"$QUERY\" --page-size $PAGE_SIZE --sleep $SLEEP"
    if [ -n "$MAX_PAGES" ]; then
      CMD="$CMD --max-pages $MAX_PAGES"
    fi

    if [ "$BACKGROUND" = "true" ]; then
      echo "🧵 Running in background with nohup..."
      mkdir -p logs
      nohup docker exec $CONTAINER_NAME bash -lc "$CMD" > logs/api-scraper.out 2>&1 &
      echo "📌 Background PID: $!"
      echo "📝 Logs: logs/api-scraper.out"
    else
      docker exec -it $CONTAINER_NAME bash -lc "$CMD"
    fi
    ;;
  api-scraper-newest)
    echo "📰 Running API scraper (newest-first daily mode)..."

    BACKGROUND="false"
    QUERY="agriculture"
    PAGE_SIZE=200
    SLEEP=3.0
    MAX_PAGES=""

    # Parse args: -bg, -q/--query, --page-size, --sleep, --max-pages
    shift
    while [[ $# -gt 0 ]]; do
      case "$1" in
        -bg)
          BACKGROUND="true"
          ;;
        -q|--query)
          QUERY="$2"; shift
          ;;
        --page-size)
          PAGE_SIZE="$2"; shift
          ;;
        --sleep)
          SLEEP="$2"; shift
          ;;
        --max-pages)
          MAX_PAGES="$2"; shift
          ;;
        *)
          echo "❌ Invalid argument: '$1'"
          echo "Usage: bash $0 api-scraper-newest [-bg] [-q|--query \"agriculture\"] [--page-size 200] [--sleep 3.0] [--max-pages N]"
          exit 1
          ;;
      esac
      shift
    done

    CMD="python main.py --mode newest --query \"$QUERY\" --page-size $PAGE_SIZE --sleep $SLEEP"
    if [ -n "$MAX_PAGES" ]; then
      CMD="$CMD --max-pages $MAX_PAGES"
    fi

    if [ "$BACKGROUND" = "true" ]; then
      echo "🧵 Running in background with nohup..."
      mkdir -p logs
      nohup docker exec $CONTAINER_NAME bash -lc "$CMD" > logs/api-scraper-newest.out 2>&1 &
      echo "📌 Background PID: $!"
      echo "📝 Logs: logs/api-scraper-newest.out"
    else
      docker exec -it $CONTAINER_NAME bash -lc "$CMD"
    fi
    ;;
  stop-scraper)
    echo "🛑 Attempting to stop background scraper process..."
    docker exec -it $CONTAINER_NAME pkill -f main.py && echo "✅ Scraper stopped." || echo "⚠️ No running scraper found."
    ;;
  *)
    echo "Usage:"
    echo "  bash $0 build"
    echo "  bash $0 up"
    echo "  bash $0 down"
    echo "  bash $0 restart"
    echo "  bash $0 logs [service]"
    echo "  bash $0 scrape [limit] [-continue] [-bg]"
    echo "  bash $0 scrape-newest [-bg]"
    echo "  bash $0 stop-scraper"
    exit 1
    ;;
esac
