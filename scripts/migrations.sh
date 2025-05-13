#!/bin/bash

set -e

# Config
CONTAINER_NAME="backend"
MIGRATION_MSG="${1:-"Auto migration"}"
VERSIONS_DIR="/app/app/alembic/versions"
LOCAL_DIR="./backend/app/alembic/versions"

# Step 1: Run alembic revision inside container
echo "🔧 Generating migration inside Docker..."
docker compose exec "$CONTAINER_NAME" alembic revision --autogenerate -m "$MIGRATION_MSG"

# Step 2: Get the latest file generated inside the container
LATEST_FILE=$(docker compose exec "$CONTAINER_NAME" bash -c "ls -t $VERSIONS_DIR | head -n1")
echo "📄 Latest migration file: $LATEST_FILE"

# Step 3: Upgrade the DB
echo "⬆️  Applying migration..."
docker compose exec "$CONTAINER_NAME" alembic upgrade head

# Step 4: Copy the file to local system (in case volume mount isn't working)
echo "📥 Copying migration file to local filesystem..."
docker cp "$(docker compose ps -q $CONTAINER_NAME):$VERSIONS_DIR/$LATEST_FILE" "$LOCAL_DIR/$LATEST_FILE"

echo "✅ Done: $LOCAL_DIR/$LATEST_FILE"
