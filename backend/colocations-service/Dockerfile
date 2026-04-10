FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# ── Stage test ────────────────────────────────────────────────────────────────
FROM base AS test
COPY . .
RUN npm test

# ── Stage production ──────────────────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 3002
CMD ["node", "server.js"]
