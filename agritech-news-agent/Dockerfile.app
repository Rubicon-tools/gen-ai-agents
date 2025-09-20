# Dockerfile

FROM python:3.11-bookworm

WORKDIR /app

# Set PYTHONPATH so Python can find the 'app' module
ENV PYTHONPATH=/app

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Default: keep container alive
CMD ["tail", "-f", "/dev/null"]
