#!/bin/bash

IMAGE_NAME="report-generator"
SERVICE_NAME="report-generator"

case "$1" in
  build)
    echo "🚀 Building Docker image..."
    docker compose build --no-cache $SERVICE_NAME
    ;;

  generate)
    echo "📄 Generating report..."
    docker compose run --rm --entrypoint "python" $SERVICE_NAME report_script.py
    echo "✅ Report generated in ./reports/jira_report.pdf"
    ;;

  up)
    echo "⬆️ Starting persistent container..."
    docker compose up -d $SERVICE_NAME
    docker compose logs -f $SERVICE_NAME
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
