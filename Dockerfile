FROM python:3.11-slim

WORKDIR /intel-npu-top
COPY intel-npu-top.py ./intel-npu-top.py

CMD ["python3", "intel-npu-top.py"]
