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
if [ -n "$ENV_NODE" ] && [ -f "$SCRIPT_DIR/docker-compose-${ENV_NODE}.yml" ]; then
  COMPOSE_FILE="docker-compose-${ENV_NODE}.yml"
fi

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
  *)
    echo "Usage:"
    echo "  bash docker.sh build"
    echo "  bash docker.sh up"
    echo "  bash docker.sh down"
    echo "  bash docker.sh restart"
    echo "  bash docker.sh logs [service]"
    echo ""
    echo "Set ENV_NODE=dev to use docker-compose-dev.yml (or ENV_NODE=prod, etc.)"
    exit 1
    ;;
esac
