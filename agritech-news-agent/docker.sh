#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/.env" ]; then
  set -o allexport
  source "$SCRIPT_DIR/.env"
  set +o allexport
fi

COMPOSE_FILE="docker-compose-prod.yml"
if [ -n "$ENV" ] && [ -f "$SCRIPT_DIR/docker-compose-${ENV}.yml" ]; then
  COMPOSE_FILE="docker-compose-${ENV}.yml"
fi

CONTAINER_NAME="agritech-news-agent-app"

case "$1" in
  build)
    echo "🔨 Building Docker image using $COMPOSE_FILE..."
    docker compose -f $COMPOSE_FILE build
    echo "⬆️ Starting container after build..."
    docker compose -f $COMPOSE_FILE up -d
    ;;

  up)
    echo "🚀 Starting containers using $COMPOSE_FILE..."
    docker compose -f $COMPOSE_FILE up -d
    ;;

  down)
    echo "🛑 Stopping containers using $COMPOSE_FILE..."
    docker compose -f $COMPOSE_FILE down
    ;;

  restart)
    echo "🔁 Restarting containers using $COMPOSE_FILE..."
    docker compose -f $COMPOSE_FILE restart
    ;;

  logs)
    shift
    echo "📜 Showing logs using $COMPOSE_FILE..."
    docker compose -f $COMPOSE_FILE logs "$@"
    ;;

  scrape)
    echo "📄 Running legacy HTML scraper..."

    ARTICLE_LIMIT=25
    CONTINUE_FLAG=""
    BACKGROUND="false"

    for arg in "$@"; do
      case "$arg" in
        -continue) CONTINUE_FLAG="--continue" ;;
        -bg) BACKGROUND="true" ;;
        [0-9]*) ARTICLE_LIMIT="$arg" ;;
        scrape) ;; # skip
        *)
          echo "❌ Invalid argument: '$arg'"
          echo "Usage: bash $0 scrape [limit] [-continue] [-bg]"
          exit 1 ;;
      esac
    done

    CMD="python app/scraper/main.py $ARTICLE_LIMIT $CONTINUE_FLAG"
    if [ "$BACKGROUND" = "true" ]; then
      echo "🧵 Running in background with nohup..."
      mkdir -p logs
      nohup docker exec $CONTAINER_NAME $CMD > logs/scraper.out 2>&1 &
      echo "📌 PID: $!  |  📝 logs/scraper.out"
    else
      docker exec -it $CONTAINER_NAME $CMD
    fi
    ;;

  scrape-newest)
    echo "📰 Scraping newest articles (most recent first)..."

    BACKGROUND="false"
    shift
    while [[ $# -gt 0 ]]; do
      case "$1" in
        -bg) BACKGROUND="true" ;;
        *)
          echo "❌ Invalid argument: '$1'"
          echo "Usage: bash $0 scrape-newest [-bg]"
          exit 1 ;;
      esac
      shift
    done

    CMD="python app/scraper/main.py --newest --continue"
    if [ "$BACKGROUND" = "true" ]; then
      echo "🧵 Running in background with nohup..."
      mkdir -p logs
      nohup docker exec $CONTAINER_NAME bash -lc "$CMD" > logs/scraper-newest.out 2>&1 &
      echo "📌 PID: $!  |  📝 logs/scraper-newest.out"
    else
      docker exec -it $CONTAINER_NAME bash -lc "$CMD"
    fi
    ;;
  api-scraper)
    echo "📡 Running API scraper: full backfill (oldest→newest, single pass)…"

    BACKGROUND="false"
    QUERY="agriculture"
    PAGE_SIZE=200
    SLEEP=3.0
    TOTAL=""
    START_PAGE=1

    shift
    while [[ $# -gt 0 ]]; do
      case "$1" in
        -bg) BACKGROUND="true" ;;
        -q|--query) QUERY="$2"; shift ;;
        --page-size) PAGE_SIZE="$2"; shift ;;
        --sleep) SLEEP="$2"; shift ;;
        --total) TOTAL="$2"; shift ;;
        --start-page) START_PAGE="$2"; shift ;;
        *)
          echo "❌ Invalid argument: '$1'"
          echo "Usage: bash $0 api-scraper [-bg] [-q|--query q] [--page-size 200] [--sleep 3.0] [--total N] [--start-page 1]"
          exit 1 ;;
      esac
      shift
    done

    CMD="python app/api_scraper/main.py --mode oldest --query \"$QUERY\" --page-size $PAGE_SIZE --sleep $SLEEP"
    if [ -n "$TOTAL" ]; then
      CMD="$CMD --total $TOTAL"
    fi
    if [ -n "$START_PAGE" ]; then
      CMD="$CMD --start-page $START_PAGE"
    fi

    if [ "$BACKGROUND" = "true" ]; then
      echo "🧵 Running in background…"
      mkdir -p logs
      nohup docker exec $CONTAINER_NAME bash -lc "$CMD" > logs/api-scraper.out 2>&1 &
      echo "📌 PID: $!  |  📝 logs/api-scraper.out"
    else
      docker exec -it $CONTAINER_NAME bash -lc "$CMD"
    fi
    ;;
  api-scraper-newest)
    echo "📰 Running API scraper: newest-only window…"

    BACKGROUND="false"
    QUERY="agriculture"
    PAGE_SIZE=200
    SLEEP=3.0
    NEWEST_PAGES=3

    shift
    while [[ $# -gt 0 ]]; do
      case "$1" in
        -bg) BACKGROUND="true" ;;
        -q|--query) QUERY="$2"; shift ;;
        --page-size) PAGE_SIZE="$2"; shift ;;
        --sleep) SLEEP="$2"; shift ;;
        --newest-pages) NEWEST_PAGES="$2"; shift ;;
        *)
          echo "❌ Invalid argument: '$1'"
          echo "Usage: bash $0 api-scraper-newest [-bg] [-q|--query q] [--page-size 200] [--sleep 3.0] [--newest-pages 3]"
          exit 1 ;;
      esac
      shift
    done

    CMD="python app/api_scraper/main.py --mode newest --query \"$QUERY\" --page-size $PAGE_SIZE --sleep $SLEEP --newest-window-pages $NEWEST_PAGES"
    if [ "$BACKGROUND" = "true" ]; then
      echo "🧵 Running in background…"
      mkdir -p logs
      nohup docker exec $CONTAINER_NAME bash -lc "$CMD" > logs/api-scraper-newest.out 2>&1 &
      echo "📌 PID: $!  |  📝 logs/api-scraper-newest.out"
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
    echo "  bash $0 build|up|down|restart"
    echo "  bash $0 logs [service]"
    echo "  bash $0 scrape [limit] [-continue] [-bg]"
    echo "  bash $0 scrape-newest [-bg]"
    echo "  bash $0 api-scraper [-bg] [...]"
    echo "  bash $0 api-scraper-newest [-bg] [...]"
    echo "  bash $0 stop-scraper"
    exit 1
    ;;
esac
