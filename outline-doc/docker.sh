#!/bin/bash

set -e

# Load .env variables
source .env

# Default to 'dev' if OUTLINE_NODE_ENV is unset or 'development'
case "$OUTLINE_NODE_ENV" in
  development|"")
    NODE_ENV_SHORT="dev"
    ;;
  production)
    NODE_ENV_SHORT="prod"
    ;;
  *)
    NODE_ENV_SHORT="$OUTLINE_NODE_ENV"
    ;;
esac

COMPOSE_FILE="docker-compose-${NODE_ENV_SHORT}.yml"

case "$1" in
  build)
    docker compose -f $COMPOSE_FILE build
    docker compose -f $COMPOSE_FILE up -d
    ;;
  up)
    docker compose -f $COMPOSE_FILE up -d
    ;;
  down)
    docker compose -f $COMPOSE_FILE down
    ;;
  restart)
    docker compose -f $COMPOSE_FILE down
    docker compose -f $COMPOSE_FILE up -d
    ;;
  logs)
    docker compose -f $COMPOSE_FILE logs -f
    ;;
  *)
    echo "Usage: $0 {build|up|down|restart|logs}"
    ;;
esac
