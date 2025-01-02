# Stage 1: Base Node.js environment
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Copy package manager lock files
COPY package.json bun.lockb /app/

# Install Bun for faster dependency installation
RUN npm install -g bun && bun install --frozen-lockfile

# Copy the entire application code
COPY . .

# Stage 2: Build the application
FROM base AS builder

# Set environment variables for production
ENV NODE_ENV=production

# Build the Next.js application
RUN bun run build

# Remove development dependencies
RUN bun install --production --frozen-lockfile

# Stage 3: Production-ready image
FROM node:18-alpine AS production

# Set the working directory
WORKDIR /app

# Set environment variables for production
ENV NODE_ENV=production

# Copy only the built application and necessary files
COPY --from=builder /app/public /app/public
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules

# Expose the port the app runs on
EXPOSE 3000

# Run the application
CMD ["bun", "start"]
