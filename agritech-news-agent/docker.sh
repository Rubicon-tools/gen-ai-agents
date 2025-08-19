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

    ARTICLE_LIMIT=10
    CONTINUE_FLAG=""

    # Validate and assign arguments
    if [ -z "$2" ]; then
      # No second arg: use defaults
      :
    elif [[ "$2" =~ ^[0-9]+$ ]]; then
      ARTICLE_LIMIT="$2"
      if [ "$3" == "-continue" ]; then
        CONTINUE_FLAG="--continue"
      elif [ -n "$3" ]; then
        echo "❌ Invalid argument: '$3'"
        echo "Usage: bash $0 scrape [limit] [-continue]"
        exit 1
      fi
    elif [ "$2" == "-continue" ]; then
      CONTINUE_FLAG="--continue"
      if [ -n "$3" ]; then
        echo "❌ Invalid argument order. Use: bash $0 scrape [limit] [-continue]"
        exit 1
      fi
    else
      echo "❌ Invalid argument: '$2'"
      echo "Usage: bash $0 scrape [limit] [-continue]"
      exit 1
    fi

    docker exec -it $CONTAINER_NAME python main.py "$ARTICLE_LIMIT" "$CONTINUE_FLAG"
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
    echo "Usage: bash $0 {build|scrape [limit] [-continue]|up|stop}"
    exit 1
    ;;
esac
