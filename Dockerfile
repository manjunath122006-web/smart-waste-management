FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency definition and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project source code
COPY backend/ ./backend/
COPY .env.example .env

# Expose standard Cloud Run / Container port
EXPOSE 8000

ENV PORT=8000
ENV HOST=0.0.0.0
ENV ENVIRONMENT=production

CMD ["python", "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]

