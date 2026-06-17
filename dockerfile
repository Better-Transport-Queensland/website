# Stage 1: Build the application
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies (including dev for build)
RUN npm ci

# Copy the rest of the application source
COPY . .

# Beta mode is a build-time flag: NEXT_PUBLIC_* values are inlined by Next
# during the build. Defaults to false; CI sets it to true for prereleases.
ARG NEXT_PUBLIC_IS_BETA=false
ENV NEXT_PUBLIC_IS_BETA=$NEXT_PUBLIC_IS_BETA

# Build the Next.js application (standalone mode enabled in next.config.mjs)
RUN npm run build


# Stage 2: Serve the application
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy only the standalone build output and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Use non-root user for security
USER node

# Expose the port the app runs on
EXPOSE 3000

# Command to run the Next.js application
CMD ["node", "server.js"]