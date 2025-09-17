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
if [ -n "$NODE_ENV" ] && [ -f "$SCRIPT_DIR/docker-compose-${NODE_ENV}.yml" ]; then
  COMPOSE_FILE="docker-compose-${NODE_ENV}.yml"
fi

CONTAINER_NAME="gen-ai-service-tools"

case "$1" in
  export)
    echo "Exporting table using $COMPOSE_FILE..."
    if [ -z "$2" ]; then
      echo "Usage: bash docker.sh export <table_name>"
      exit 1
    fi
    docker compose -f $COMPOSE_FILE run --rm $CONTAINER_NAME python3 table_csv_tool.py export "$2"
    ;;
  import)
    echo "Importing CSV file using $COMPOSE_FILE..."
    if [ -z "$2" ]; then
      echo "Usage: bash docker.sh import <csv_file>"
      exit 1
    fi
    if [ ! -f "$SCRIPT_DIR/$2" ]; then
      echo "CSV file '$2' not found in script directory."
      exit 1
    fi
    docker compose -f $COMPOSE_FILE run --rm -v "$SCRIPT_DIR/$2":/app/"$2" $CONTAINER_NAME python3 table_csv_tool.py import "$2"
    ;;
  build)
    echo "Removing caddy volumes..."
    docker volume rm gen-ai-caddy_data
    docker volume rm gen-ai-caddy_config

    echo "Building Docker image using $COMPOSE_FILE..."
    docker compose -f $COMPOSE_FILE build

    echo "⬆️ Starting container after build..."
    docker compose -f $COMPOSE_FILE up -d
    ;;
  up)
    echo "Removing caddy volumes..."
    docker volume rm gen-ai-caddy_data
    docker volume rm gen-ai-caddy_config

    echo "Starting containers using $COMPOSE_FILE..."
    docker compose -f $COMPOSE_FILE up -d
    ;;
  down)
    echo "Stopping containers using $COMPOSE_FILE..."
    docker compose -f $COMPOSE_FILE down
    ;;
  restart)
    echo "Removing caddy volumes..."
    docker volume rm gen-ai-caddy_data
    docker volume rm gen-ai-caddy_config

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
    echo "  bash docker.sh export <table_name>"
    echo "  bash docker.sh import <csv_file>"
    echo "  bash docker.sh build"
    echo "  bash docker.sh up"
    echo "  bash docker.sh down"
    echo "  bash docker.sh restart"
    echo "  bash docker.sh logs [service]"
    echo ""
    echo "Set NODE_ENV=dev to use docker-compose-dev.yml (or NODE_ENV=prod, etc.)"
    exit 1
    ;;
esac
