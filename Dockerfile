FROM python:3.11-slim

WORKDIR /mynpu
COPY mynpu.py ./mynpu.py

CMD ["python3", "mynpu.py"]
