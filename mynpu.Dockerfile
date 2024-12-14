FROM python:3.11-slim

WORKDIR /
COPY mynpu.py /mynpu.py

# If you need extra Python dependencies, install them here
# RUN pip install textual # Uncomment if needed, or any other packages

CMD ["python3", "mynpu.py"]
