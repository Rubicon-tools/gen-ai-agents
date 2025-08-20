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
    UPDATE_FLAG=""

    # Validate and assign arguments
    if [ -z "$2" ]; then
      # No second arg: use defaults
      :
    elif [[ "$2" =~ ^[0-9]+$ ]]; then
      ARTICLE_LIMIT="$2"
      if [ "$3" == "-continue" ]; then
        CONTINUE_FLAG="--continue"
      elif [ "$3" == "-update" ]; then
        UPDATE_FLAG="--update"
      elif [ -n "$3" ]; then
        echo "❌ Invalid argument: '$3'"
        echo "Usage: bash $0 scrape [limit] [-continue|-update]"
        exit 1
      fi
    elif [ "$2" == "-continue" ]; then
      CONTINUE_FLAG="--continue"
      if [ -n "$3" ]; then
        echo "❌ Invalid argument order. Use: bash $0 scrape [limit] [-continue]"
        exit 1
      fi
    elif [ "$2" == "-update" ]; then
      UPDATE_FLAG="--update"
      if [ -n "$3" ]; then
        echo "❌ Invalid argument order. Use: bash $0 scrape [limit] [-update]"
        exit 1
      fi
    else
      echo "❌ Invalid argument: '$2'"
      echo "Usage: bash $0 scrape [limit] [-continue|-update]"
      exit 1
    fi

    if [ -n "$UPDATE_FLAG" ]; then
      docker exec -it $CONTAINER_NAME python app/scraper/main.py "$ARTICLE_LIMIT" "$UPDATE_FLAG"
    else
      docker exec -it $CONTAINER_NAME python app/scraper/main.py "$ARTICLE_LIMIT" "$CONTINUE_FLAG"
    fi
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
