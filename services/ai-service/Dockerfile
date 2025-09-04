FROM python:3.12-slim

WORKDIR /app

# Install minimal deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY app ./app

EXPOSE 9000
ENV MODEL_BACKEND=template
ENV MODEL_NAME=distilgpt2
ENV USE_GPU=false

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "9000"]
