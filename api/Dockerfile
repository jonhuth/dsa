# Dockerfile for Flask backend
FROM python:3.11-slim

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy dependency files
COPY pyproject.toml ./
COPY app ./app

# Create directory for algorithms (will be mounted as volume)
RUN mkdir -p /app/algorithms

# Install dependencies
RUN uv sync --no-dev

# Set Python path
ENV PYTHONPATH=/app
ENV FLASK_APP=app.main

EXPOSE 5000

# Development
CMD ["uv", "run", "flask", "run", "--host=0.0.0.0", "--port=5000"]
