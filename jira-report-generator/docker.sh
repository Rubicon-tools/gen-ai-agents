#!/bin/bash

IMAGE_NAME="report-generator"
SERVICE_NAME="report-generator"
CONTAINER_NAME="report-generator"

case "$1" in
  build)
    echo "🚀 Building Docker image..."
    docker compose build --no-cache $SERVICE_NAME
    ;;

  generate)
    echo "📄 Generating report inside running container..."
    docker exec $CONTAINER_NAME python report_script.py
    echo "✅ Report generated in ./reports/jira_report.pdf"
    ;;

  up)
    echo "⬆️ Starting and persisting container..."
    docker compose up -d $SERVICE_NAME
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
