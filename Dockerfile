FROM python:3.11-slim

WORKDIR /app

COPY ai_service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ai_service/ ./ai_service/
COPY frontend/ ./frontend/

ENV PYTHONPATH=/app
ENV ENV=production
ENV PORT=10000

EXPOSE 10000

WORKDIR /app/ai_service

CMD ["python", "app.py"] 