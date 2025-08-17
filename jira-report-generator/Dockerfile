FROM python:3.11-bookworm

# Set working directory
WORKDIR /app

# Pre-install stable, precompiled dependencies required by WeasyPrint
RUN apt-get update && apt-get install -y \
    python3-pip \
    weasyprint \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    fonts-liberation \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your code
COPY . .

# Ensure output folder exists
RUN mkdir -p /app/reports

# Run script
CMD ["python", "report_script.py"]
