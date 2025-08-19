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
    ARTICLE_LIMIT=${2:-10}  # Default to 10 if not provided
    docker exec -it $CONTAINER_NAME python main.py $ARTICLE_LIMIT
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
    echo "Usage: bash $0 {build|scrape [limit]|up|stop}"
    exit 1
    ;;
esac
