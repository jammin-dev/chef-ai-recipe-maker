Command to copy from the Docker to backend file
```
docker compose cp \
  backend:/app/app/alembic/test \
  backend/app/alembic/test
```