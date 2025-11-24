# ---------- Frontend build stage ----------
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Paket dosyalarını kopyala
COPY frontend/package*.json ./

# Bağımlılıkları kur
RUN npm install

# Tüm frontend kodunu kopyala
COPY frontend/ .

# Prod build
RUN npm run build

# ---------- Backend (final image) ----------
FROM python:3.12-slim AS backend

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# İhtiyaç olabilecek sistem paketleri (gerek yoksa sadeleştirebilirsin)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Backend bağımlılıkları
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Backend kodunu kopyala
COPY backend/ ./backend/

# Frontend build çıktısını backend içine kopyala
# NOT: Buradaki yolu kendi projene göre ayarla.
# Örneğin FastAPI'de StaticFiles ile "/static" diye serve ediyorsan:
# app.mount("/static", StaticFiles(directory="backend/static"), name="static")
COPY --from=frontend-builder /app/frontend/dist ./backend/static

EXPOSE 8080

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
