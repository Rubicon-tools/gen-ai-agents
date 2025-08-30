#!/bin/bash

set -e

case "$1" in
  build)
    docker compose build

    docker compose up -d
    ;;
  up)
    docker compose up -d
    ;;
  down)
    docker compose down
    ;;
  restart)
    docker compose down
    docker compose up -d
    ;;
  logs)
    docker compose logs -f
    ;;
  *)
    echo "Usage: $0 {build|up|down|restart|logs}"
    ;;
esac
