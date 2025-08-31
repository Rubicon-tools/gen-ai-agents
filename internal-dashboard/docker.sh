#!/bin/bash
# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "🌍 Environment: NODE_ENV=${NODE_ENV:-production}"

APP_NAME="internal-dashboard"

case "$1" in
  build)
    echo "🚀 Building and starting $APP_NAME..."
    docker-compose up --build -d
    ;;

  down)
    echo "🛑 Stopping $APP_NAME..."
    docker-compose down
    ;;

  restart)
    echo "🔁 Restarting $APP_NAME..."
    docker-compose down
    docker-compose up --build -d
    ;;

  logs)
    echo "📜 Logs for $APP_NAME:"
    docker-compose logs -f
    ;;

  clean)
    echo "🧹 Removing containers, images, and volumes..."
    docker-compose down -v --rmi all --remove-orphans
    ;;

  help|*)
    echo "Usage: ./docker.sh {build|down|restart|logs|clean}"
    ;;
esac
