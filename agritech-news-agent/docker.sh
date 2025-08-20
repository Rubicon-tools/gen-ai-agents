#!/bin/bash

CONTAINER_NAME="agritech-news-agent"

case "$1" in
  build)
    echo "🚀 Building Docker image..."
    docker compose build --no-cache $CONTAINER_NAME

    echo "⬆️ Starting container after build..."
    docker compose up -d $CONTAINER_NAME

    echo "📦 Container is running in the background. You can now trigger scraping."
    ;;

  scrape)
    echo "📄 Running scraper inside the container..."

    ARTICLE_LIMIT=25
    CONTINUE_FLAG=""
    BACKGROUND="false"

    # Parse arguments
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
          ;; # skip positional command
        *)
          echo "❌ Invalid argument: '$arg'"
          echo "Usage: bash $0 scrape [limit] [-continue] [-bg]"
          exit 1
          ;;
      esac
    done

    if [ "$BACKGROUND" = "true" ]; then
      echo "🧵 Running in background with nohup..."
      nohup docker exec $CONTAINER_NAME python app/scraper/main.py "$ARTICLE_LIMIT" "$CONTINUE_FLAG" > logs/scraper.out 2>&1 &
      echo "📌 Background PID: $!"
      echo "📝 Logs: logs/scraper.out"
    else
      docker exec -it $CONTAINER_NAME python app/scraper/main.py "$ARTICLE_LIMIT" "$CONTINUE_FLAG"
    fi
    ;;

  stop-scraper)
    echo "🛑 Attempting to stop background scraper process..."
    docker exec -it $CONTAINER_NAME pkill -f main.py && echo "✅ Scraper stopped." || echo "⚠️ No running scraper found."
    ;;

  up)
    echo "⬆️ Starting container..."
    docker compose up -d $CONTAINER_NAME
    ;;

  stop)
    echo "🛑 Stopping container..."
    docker compose down
    ;;

  *)
    echo "Usage: bash $0 {build|scrape [limit] [-continue] [-bg]|stop-scraper|up|stop}"
    exit 1
    ;;
esac
