FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# ── Stage test ────────────────────────────────────────────────────────────────
FROM base AS test
COPY . .
RUN npm test -- --watchAll=false --passWithNoTests

# ── Stage build ───────────────────────────────────────────────────────────────
FROM base AS build
COPY . .
RUN npm run build

# ── Stage production ──────────────────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
EXPOSE 3004
CMD ["serve", "-s", "build", "-l", "3004"]
