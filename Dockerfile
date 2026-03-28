# Stage 1: Build Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Runtime
FROM node:20-slim
WORKDIR /app

# Copy Backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production
COPY backend/ ./backend/

# Copy built frontend from Stage 1 into backend's reach
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Ensure uploads directory exists
RUN mkdir -p /app/backend/uploads

# Set Environment
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Run the app
CMD ["node", "backend/server.js"]
