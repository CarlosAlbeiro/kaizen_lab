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

ENV PORT=3055
ENV NODE_ENV=production
ENV JWT_SECRET=kaizen_lab_super_secret_jwt_key_2026_production

CMD ["npm", "start"]
