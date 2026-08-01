FROM node:20-alpine

WORKDIR /app

# Declare ARGs for build-time configuration with defaults
ARG PORT=8093
ARG VITE_API_URL=http://localhost:3055/api

# Set ENVs from ARGs
ENV PORT=${PORT}
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN npm install -g serve

EXPOSE ${PORT}

CMD ["sh", "-c", "serve -s dist -l ${PORT}"]