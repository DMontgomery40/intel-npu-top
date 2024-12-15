#!/usr/bin/env python3
import time
import os
import platform

NPU_DEVICE_PATH = "/sys/devices/pci0000:00/0000:00:0b.0/power/runtime_active_time"
BAR_WIDTH = 5
HISTORY_LENGTH = 10

def read_runtime():
    try:
        with open(NPU_DEVICE_PATH, "r") as f:
            return float(f.read().strip())
    except FileNotFoundError:
        print("NPU device path not found.")
        return 0.0

def clear_screen():
    if platform.system() == "Windows":
        os.system('cls')
    else:
        os.system('clear')

previous_npu_runtime = 0.0
previous_time = time.time()
usage_history = []

while True:
    current_runtime = read_runtime()
    if current_runtime == 0.0:  # Possible error reading device, handle gracefully
        time.sleep(1)
        continue

    runtime_diff = current_runtime - previous_npu_runtime
    previous_npu_runtime = current_runtime

    current_time = time.time()
    time_diff = (current_time - previous_time) * 1000.0  # ms
    previous_time = current_time

    if time_diff <= 0:  # Prevent division by zero or extremely high usage calculation
        time.sleep(1)
        continue

    usage = (runtime_diff / time_diff * 100.0) if time_diff > 0 else 0.0

    # Add to history and keep the last HISTORY_LENGTH samples
    usage_history.append(usage)
    if len(usage_history) > HISTORY_LENGTH:
        usage_history.pop(0)

    # Clear screen
    clear_screen()

    # Print title
    print("NPU Usage (last 20 seconds):", flush=True)

    # Print a simple horizontal bar chart for each sample
    # We'll print them vertically stacked (oldest top, newest bottom)
    for i, val in enumerate(usage_history):
        bar_length = int((val / 100.0) * BAR_WIDTH)
        bar_length = min(bar_length, BAR_WIDTH)  # Ensure bar length does not exceed BAR_WIDTH
        bar = '#' * bar_length
        print(f"{i+1:2d}: [{bar:<{BAR_WIDTH}}] {val:6.2f}%", flush=True)

    # Debugging output (optional, remove if not needed)
    print(f"Debug - Time diff: {time_diff} ms, Runtime diff: {runtime_diff}, Usage: {usage:.2f}%", flush=True)

    # Wait before next reading
    time.sleep(1)