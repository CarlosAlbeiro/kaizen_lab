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

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

RUN mkdir -p uploads

EXPOSE 3055

# Argumento para URL de API en tiempo de build
ARG PORT
ARG NODE_ENV
ARG JWT_SECRET

ENV PORT=$PORT
ENV NODE_ENV=$NODE_ENV
ENV JWT_SECRET=$JWT_SECRET

CMD ["npm", "start"]
