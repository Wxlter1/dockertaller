FROM node:20 AS builder
WORKDIR /app

# Compilar frontend React
COPY frontend/package.json ./frontend/
COPY frontend/vite.config.js ./frontend/
COPY frontend/index.html ./frontend/
COPY frontend/src ./frontend/src
RUN cd frontend && npm install && npm run build

# Compilar backend TypeScript
COPY backend-node/package.json backend-node/tsconfig.json ./backend-node/
COPY backend-node/src ./backend-node/src
RUN cd backend-node && npm install && npm run build

FROM node:20-slim
WORKDIR /app

COPY backend-node/package.json ./
RUN npm install --production
COPY --from=builder /app/backend-node/dist ./dist
COPY --from=builder /app/frontend/dist ./public
RUN mkdir -p /app/data

EXPOSE 3000
CMD ["node", "dist/server.js"]
