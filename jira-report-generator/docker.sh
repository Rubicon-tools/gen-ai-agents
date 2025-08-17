#!/bin/bash

CONTAINER_NAME="report-generator"

case "$1" in
  build)
    echo "🚀 Building Docker image..."
    docker compose build --no-cache $CONTAINER_NAME

    echo "⬆️ Starting container after build..."
    docker compose up -d $CONTAINER_NAME

    echo "📦 Container is running in the background. You can now generate reports anytime."
    ;;

  generate)
    echo "📄 Generating report inside running container..."
    docker exec $CONTAINER_NAME python report_script.py
    ;;

  up)
    echo "⬆️ Starting and persisting container..."
    docker compose up -d $CONTAINER_NAME
    echo "📦 Container is running in the background. You can now generate reports anytime."
    ;;

  stop)
    echo "🛑 Stopping container..."
    docker compose down
    ;;

  *)
    echo "Usage: bash $0 {build|generate|up|stop}"
    exit 1
    ;;
esac
