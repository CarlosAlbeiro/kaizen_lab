# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Declare ARGs for build-time configuration with defaults
ARG PORT=3055
ARG NODE_ENV=production
ARG JWT_SECRET=kaizen_lab_super_secret_jwt_key_2026_production
ARG PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ARG PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set ENVs from ARGs
ENV PORT=${PORT}
ENV NODE_ENV=${NODE_ENV}
ENV JWT_SECRET=${JWT_SECRET}
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=${PUPPETEER_SKIP_CHROMIUM_DOWNLOAD}
ENV PUPPETEER_EXECUTABLE_PATH=${PUPPETEER_EXECUTABLE_PATH}

# Install Chromium and system dependencies required by Puppeteer on Alpine
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

RUN mkdir -p uploads

EXPOSE ${PORT}

CMD ["npm", "start"]
