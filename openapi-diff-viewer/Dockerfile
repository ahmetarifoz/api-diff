# ---------- Frontend build stage ----------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Package files
COPY frontend/package*.json ./
RUN npm install

# Copy source and build
COPY frontend/ .
RUN npm run build

# ---------- Backend (final image) ----------
FROM python:3.12-slim AS backend
WORKDIR /app

# Environment for Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend assets into backend static folder
COPY --from=frontend-builder /app/frontend/dist ./backend/static

# Dynamic port (Render, Railway, Fly.io etc.)
ARG PORT=8080
EXPOSE ${PORT}

# Start FastAPI with uvicorn, respecting $PORT env var
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
