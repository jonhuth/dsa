# Dockerfile for the Flask backend.
#
# BUILD CONTEXT: the repo ROOT, not api/. The api imports the repo-root
# `algorithms/` package at startup (api/app/services/registry.py instantiates a
# module-level AlgorithmRegistry that does `from algorithms... import ...`), and
# that package lives OUTSIDE api/. Building from api/ can't see it, so the app
# crashed on import and never passed its /health check. Railway must therefore
# set this service's Root Directory to the repo root and Dockerfile Path to
# api/Dockerfile.
FROM python:3.11-slim

WORKDIR /app

# uv for fast, locked installs
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# API dependency manifest + source (paths are relative to the repo root)
COPY api/pyproject.toml ./
COPY api/app ./app

# Shared algorithm implementations — the repo-root package the registry imports.
COPY algorithms ./algorithms

# Install runtime deps into a project venv (no dev group)
RUN uv sync --no-dev

# /app is on the path so both `app` (Flask) and `algorithms` resolve
ENV PYTHONPATH=/app
ENV FLASK_APP=app.main

EXPOSE 5000

# Bind the port Railway provides; fall back to 5000 for local runs.
CMD ["sh", "-c", "uv run flask --app app.main run --host=0.0.0.0 --port=${PORT:-5000}"]
