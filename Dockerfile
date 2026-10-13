# syntax=docker/dockerfile:1

# Stage 1: Dependencies installation
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
# Cache npm global store across builds
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Stage 2: Next.js build
FROM node:20-alpine AS builder
WORKDIR /app

# Accept build arguments for client-side environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

# Set them as environment variables during build time so Next.js can inline them
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=$NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Cache Next.js build artifacts (.next/cache) for rapid recompilation
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

# Stage 3: Minimal production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Non-root security configuration
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Copy only the standalone bundle and static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
