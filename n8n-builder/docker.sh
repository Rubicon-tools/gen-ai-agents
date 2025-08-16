#!/bin/bash
set -e

COMPOSE_FILE=docker-compose.yml

case "$1" in
  up)
    echo "🚀 Starting containers..."
    docker compose -f $COMPOSE_FILE up -d
    ;;
  down)
    echo "🛑 Stopping containers..."
    docker compose -f $COMPOSE_FILE down
    ;;
  restart)
    echo "🔄 Restarting containers..."
    docker compose -f $COMPOSE_FILE down
    docker compose -f $COMPOSE_FILE up -d
    ;;
  logs)
    echo "📜 Showing logs (Ctrl+C to exit)..."
    docker compose -f $COMPOSE_FILE logs -f
    ;;
  *)
    echo "Usage: $0 {up|down|restart|logs}"
    exit 1
    ;;
esac
