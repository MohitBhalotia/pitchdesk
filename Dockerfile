# Next.js production image (Coolify: build context = repo root, this Dockerfile).
# Requires `output: "standalone"` in next.config.ts.
#
# NEXT_PUBLIC_* vars are inlined into the client bundle at build time, so they
# must be set as build-time env vars on the Coolify resource (not just runtime).

FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
