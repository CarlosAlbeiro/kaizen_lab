# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy source code and config
COPY . .

# Build the TypeScript project
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy compiled files from builder stage
COPY --from=builder /app/dist ./dist

# Set environment variables (can be overridden at runtime)
ENV PORT=3055
ENV NODE_ENV=production
ENV JWT_SECRET=kaizen_lab_super_secret_jwt_key_2026_production

# Expose the port the app runs on
EXPOSE 3055

# Command to run the application
CMD ["npm", "start"]
