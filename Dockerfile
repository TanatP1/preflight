# Multi-stage build for production optimization
FROM node:18-alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client before building
RUN npx prisma generate

# Build the app
RUN npm run build

# Stage 3: Production runtime
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create system user and group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install required runtime dependencies
RUN apk add --no-cache openssl

# Copy application files with proper ownership
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Ensure proper permissions on critical directories
RUN chown -R nextjs:nodejs /app
RUN chmod -R 755 /app

# Create entrypoint script to handle Prisma initialization
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'set -e' >> /app/entrypoint.sh && \
    echo 'echo "Checking database connection..."' >> /app/entrypoint.sh && \
    echo 'npx prisma db push --accept-data-loss || echo "Database sync failed, continuing..."' >> /app/entrypoint.sh && \
    echo 'echo "Starting application..."' >> /app/entrypoint.sh && \
    echo 'exec "$@"' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh && \
    chown nextjs:nodejs /app/entrypoint.sh

# Switch to non-privileged user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use entrypoint script to handle Prisma and then start the app
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", ".next/standalone/server.js"]
