# Traffic Prediction System

End-to-end traffic forecasting pipeline using TypeScript (API/UI), Python (model training), and PostgreSQL for ingesting, training, and serving time‑series + geospatial forecasts.

This README includes detailed setup and many useful commands for development, training, testing, deployment, and troubleshooting.

---

## Table of contents

- About
- Architecture
- Quick prerequisites
- Local development (everything with commands)
  - Database
  - Backend API (TypeScript)
  - Frontend (TypeScript)
  - Model training (Python)
  - Running everything with Docker Compose
- Testing & linting
- CI / CD hints
- Production / Deployment
- API examples
- Environment variables
- Troubleshooting
- Contributing
- License

---

## About

This repo implements a pipeline to:
- Ingest time-series + geospatial traffic data into PostgreSQL/PostGIS.
- Train forecasting models in Python.
- Serve predictions via a TypeScript API and UI.
- Support dev workflows with Docker and local tools.

---

## Architecture

- postgres (+ PostGIS) — ingestion & storage
- python/ — model training, dataset prep, evaluation
- api/ (TypeScript) — serve predictions and expose ingestion endpoints
- ui/ (TypeScript) — dashboard for forecasts and maps
- infra/ — Docker Compose, k8s manifests, migration scripts

---

## Quick prerequisites

- git >= 2.20
- Node.js >= 18 and a package manager (pnpm/yarn/npm)
- Python 3.10+
- Docker & docker-compose (or Docker Desktop)
- PostgreSQL client (psql) for local DB management
- Optional: pgAdmin, PostGIS support for spatial queries

---

## Environment files

Create per-component env files (examples below).

api/.env
```
PORT=4000
DATABASE_URL=postgresql://traffic_user:password@localhost:5432/traffic
MODEL_PATH=/app/models/latest
NODE_ENV=development
```

python/.env
```
DATABASE_URL=postgresql://traffic_user:password@localhost:5432/traffic
MODEL_DIR=./models
PYTHONPATH=.
```

docker/.env
```
POSTGRES_USER=traffic_user
POSTGRES_PASSWORD=supersecret
POSTGRES_DB=traffic
```

---

## Database — local setup

Using plain psql (adjust values to match docker/.env):

- Create DB & user:
  - psql -U postgres -h localhost
  - CREATE ROLE traffic_user WITH LOGIN PASSWORD 'supersecret';
  - CREATE DATABASE traffic OWNER traffic_user;

- Enable PostGIS (run in psql as superuser):
  - CREATE EXTENSION IF NOT EXISTS postgis;
  - CREATE EXTENSION IF NOT EXISTS postgis_topology;

- Run SQL schema and seeds:
  - psql -U traffic_user -d traffic -f sql/schema.sql
  - psql -U traffic_user -d traffic -f sql/seeds/seed_sample_data.sql

If using Docker Compose (recommended), see the Docker section below for automated DB provisioning.

---

## Local development — API (TypeScript)

From repo root, assuming api/ contains a Node/TypeScript project.

Install deps:
- pnpm install
- or: npm install
- or: yarn install

Development server:
- pnpm --filter api dev
- npm run --prefix api dev
- yarn --cwd api dev

Build:
- pnpm --filter api build
- npm run --prefix api build

Start production:
- pnpm --filter api start
- NODE_ENV=production npm --prefix api start

Run lint & format:
- pnpm --filter api lint
- pnpm --filter api format

Run tests:
- pnpm --filter api test
- npm run --prefix api test

Useful debugging commands:
- Inspect DB connection: curl http://localhost:4000/health
- Run migrations (example with TypeORM or node-pg-migrate):
  - pnpm --filter api migrate:up
  - or: npx node-pg-migrate up --migrations-dir api/src/migrations

---

## Local development — Frontend (UI)

Assuming ui/ is a standard React/Vite/Next app.

Install & run:
- pnpm --filter ui install
- pnpm --filter ui dev
- npm --prefix ui run dev
- yarn --cwd ui dev

Build & serve:
- pnpm --filter ui build
- pnpm --filter ui preview

Run tests:
- pnpm --filter ui test

---

## Model training & evaluation (Python)

Set up virtualenv:
- python -m venv .venv
- source .venv/bin/activate
- pip install -r python/requirements.txt

Run training:
- python python/train.py --config python/configs/train.yaml --output python/models/latest

Example flags:
- --epochs 50
- --batch-size 64
- --lr 0.001

Evaluate:
- python python/evaluate.py --model python/models/latest --dataset python/data/val.csv

Exporting model for serving:
- python python/export.py --model python/models/latest --format torchscript --out api/models/latest

Notebook:
- jupyter lab --notebook-dir=python/notebooks

Common scripts (inside python/):
- pip install -r requirements-dev.txt
- pytest -q

---

## Run everything with Docker Compose

A ready docker-compose.yml is in docker/ or repo root. Example commands:

Start stack:
- docker compose up --build

Start in background:
- docker compose up -d --build

Stop:
- docker compose down

Recreate and remove volumes (clean DB):
- docker compose down -v --remove-orphans

Run a one-off command (e.g., psql):
- docker compose exec db psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}

Apply migrations inside API container:
- docker compose exec api pnpm --filter api migrate:up

Build images only:
- docker compose build

Tail logs:
- docker compose logs -f api
- docker compose logs -f db

---

## Docker image commands

Build API image:
- docker build -t traffic-api:local -f api/Dockerfile api

Run API container:
- docker run -it --rm --env-file api/.env -p 4000:4000 traffic-api:local

---

## Tests & CI

Run test suite for all components:
- pnpm -w -s test
- pnpm -w -s lint

Suggested GH Actions (example)
- Check out -> install Node -> install Python -> run linters -> run tests -> build docker images -> push to registry

Example local CI command:
- pnpm -w -s lint && pnpm -w -s test && python -m pytest -q

---

## API examples

Health:
- curl http://localhost:4000/health

Get forecast:
- curl -X POST http://localhost:4000/api/v1/forecast \
  -H "Content-Type: application/json" \
  -d '{"location": {"lat": 37.77, "lon": -122.42}, "horizon": 24, "features": {}}'

Ingest data:
- curl -X POST http://localhost:4000/api/v1/data \
  -H "Content-Type: application/json" \
  -d @samples/sample_ingest.json

Example of fetching geojson tiles (UI uses this):
- curl http://localhost:4000/api/v1/tiles?z=12&x=654&y=1582

---

## Environment variables (full list)

Top-level (examples):
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB
- DATABASE_URL
- MODEL_PATH
- NODE_ENV
- PORT
- SENTRY_DSN (optional)
- REDIS_URL (optional for caching/queue)

Document per-service env files: api/.env, python/.env, ui/.env, docker/.env

---

## Production & deployment tips

- Build models and store in an immutable artifact registry (S3 or GCS) and point API to model URI.
- Use Kubernetes with a deployment + HPA and a Postgres managed service (RDS/AzurePG/CloudSQL) with PostGIS enabled.
- Secrets: use vault or cloud secrets manager.
- CI: run training only on dedicated runner; trigger model deployment via tag/release pipeline.
- Rolling updates: use readinessProbe and preStop hook to drain in-flight predictions.

---

## Troubleshooting

Common issues:
- DB connection refused: check DATABASE_URL, ensure Postgres is up, check network and docker compose port mapping.
- PostGIS functions missing: ensure extension created via CREATE EXTENSION postgis; use superuser to create extension.
- Model not found: confirm MODEL_PATH and that model artifact exists inside container.
- Slow queries: add indexes on time columns and geospatial columns (GIST on geometry).

Useful debug commands:
- docker compose exec db psql -U traffic_user -d traffic -c "SELECT postgis_full_version();"
- docker compose exec api curl http://localhost:4000/health -v
- psql -h host -U user -d db -c "EXPLAIN ANALYZE SELECT ..."

---

## Contributing

- Fork -> branch -> PR
- Follow code style: Prettier + ESLint + isort/black for python
- Add tests for model changes and API regressions
- Update README + docs for any public API changes

Suggested local workflow:
- git checkout -b feat/my-change
- make sure tests pass: pnpm -w -s test && pytest
- git commit -m "feat: short description"
- push and open PR

---

## License

MIT — see LICENSE file.
