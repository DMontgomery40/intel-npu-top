#!/usr/bin/env python3
import os
import time

NPU_DEVICE_PATH = "/sys/devices/pci0000:00/0000:00:0b.0/power/runtime_active_time"

def read_runtime():
    try:
        with open(NPU_DEVICE_PATH, "r") as f:
            return float(f.read().strip())
    except:
        return 0.0

previous_npu_runtime = 0.0
previous_time = time.time()

while True:
    current_runtime = read_runtime()
    runtime_diff = current_runtime - previous_npu_runtime
    previous_npu_runtime = current_runtime

    current_time = time.time()
    time_diff = (current_time - previous_time) * 1000.0  # ms
    previous_time = current_time

    usage = (runtime_diff / time_diff * 100.0) if time_diff > 0 else 0.0
    print(f"NPU Usage: {usage:.2f}%")
    time.sleep(1)
