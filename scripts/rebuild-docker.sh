#!/usr/bin/env bash

set -euo pipefail

# 1) Stop and remove all containers/services defined in docker-compose.yml
echo "Shutting down all running docker-compose containers..."
docker compose down

# 2) Remove the backend image
#    Adjust "backend" if your image name is different
echo "Removing 'backend' image..."
docker rmi -f $(docker images --filter=reference='backend' --format '{{.ID}}') || true

# 3) Launch docker compose watch
echo "Starting docker compose watch..."
docker compose watch
