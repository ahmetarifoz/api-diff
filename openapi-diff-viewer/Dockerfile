# ---- Base image ----
FROM python:3.12-slim AS backend

# Çalışma dizini
WORKDIR /app

# Backend bağımlılıkları
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Frontend build çıktısını kopyala
COPY frontend/dist ./frontend/dist

# Backend kodunu kopyala
COPY backend/ ./backend/

# Çalıştırma komutu
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]