# Dockerfile for Next.js frontend
FROM oven/bun:1 AS base

WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Development
FROM base AS development
EXPOSE 3000
CMD ["bun", "dev"]

# Production build
FROM base AS builder
RUN bun run build

# Production runtime
FROM oven/bun:1-slim AS production
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["bun", "start"]
