# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package.json ./
RUN npm install

# Copy source code
COPY . .

# Build Vite client and compile server.ts to server.js
RUN npm run build

# Production Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy package.json and install production-only dependencies
COPY package.json ./
RUN npm install --omit=dev

# Copy compiled build output and server script from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/firebase-blueprint.json ./firebase-blueprint.json
COPY --from=builder /app/firestore.rules ./firestore.rules

EXPOSE 3000

CMD ["node", "server.js"]
