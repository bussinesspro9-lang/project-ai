FROM oven/bun:1 AS builder
WORKDIR /app

# Copy workspace config files first (for dependency caching)
COPY package.json bun.lock* bunfig.toml ./

# Copy all package.json files for workspace dep resolution
COPY api/package.json ./api/
COPY our-app/package.json ./our-app/
COPY packages/ai/package.json ./packages/ai/
COPY packages/auth-ui/package.json ./packages/auth-ui/
COPY packages/shared-utils/package.json ./packages/shared-utils/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/asset-manager/package.json ./packages/asset-manager/
COPY packages/device-preview/package.json ./packages/device-preview/
COPY packages/i18n/package.json ./packages/i18n/
COPY packages/notifications/package.json ./packages/notifications/

# Install all workspace dependencies
RUN bun install

# Copy all package source code
COPY packages/ ./packages/
COPY api/ ./api/

# Build all shared packages, then the API
RUN bun run build:packages && cd api && bun run build

# ── Production runner ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy the compiled API dist
COPY --from=builder /app/api/dist ./api/dist
COPY --from=builder /app/api/package.json ./api/package.json

# Copy root node_modules (hoisted)
COPY --from=builder /app/node_modules ./node_modules

# Copy built packages so node can resolve workspace deps
COPY --from=builder /app/packages/ ./packages/

# Railway injects $PORT at runtime
EXPOSE $PORT

CMD ["node", "api/dist/main"]
