# Dockerfile for Next.js frontend
FROM oven/bun:1 AS base

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Development
FROM base AS development
EXPOSE 3000
CMD ["bun", "dev"]

# Production build
FROM base AS builder
# next.config.ts bakes the /api rewrite destination from NEXT_PUBLIC_API_URL at
# BUILD time (Next writes it into .next/routes-manifest.json; `next start` never
# re-reads it). Without this ARG the build can't see the Railway service var and
# bakes the http://localhost:5000 fallback, so the proxy 500s in production.
# Railway passes service variables to Docker builds as --build-arg.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
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
