#!/usr/bin/env python3
import time
import os
import curses
import subprocess
from datetime import datetime

# Configuration
NPU_DEVICE_DIR = "/sys/devices/pci0000:00/0000:00:0b.0"
NPU_RUNTIME_PATH = f"{NPU_DEVICE_DIR}/power/runtime_active_time"
NPU_DEVICE_FILE = "/dev/accel/accel0"

# Constants
HISTORY_LENGTH = 40
REFRESH_RATE = 1
GRAPH_HEIGHT = 10

# Device information mapping
DEVICE_INFO_PATHS = {
    "Vendor": "vendor",
    "Device": "device",
    "Revision": "revision",
    "NUMA Node": "numa_node",
    "IRQ": "irq",
    "Label": "label",
    "Runtime Status": "power_state"
}

# Box drawing characters
BOX = {
    'tl': '╔', 'tr': '╗', 'bl': '╚', 'br': '╝',
    'h': '═', 'v': '║',
    'left_t': '╠', 'right_t': '╣',
    'top_t': '╦', 'bottom_t': '╩',
    'cross': '╬'
}

GRAPH_CHARS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']
USAGE_GAUGE = ['░', '▒', '▓', '█']

def read_sysfs_value(path):
    try:
        with open(path, "r") as f:
            return f.read().strip()
    except (FileNotFoundError, PermissionError):
        return None

def read_runtime():
    val = read_sysfs_value(NPU_RUNTIME_PATH)
    return float(val) if val is not None else 0.0

def get_process_info(device_file):
    processes = []
    if os.path.exists(device_file):
        try:
            output = subprocess.check_output(["lsof", device_file], stderr=subprocess.STDOUT, text=True)
            for line in output.strip().split("\n")[1:]:
                if not line.startswith("lsof:"):
                    parts = line.split()
                    if len(parts) >= 3:
                        processes.append((parts[0], parts[1], parts[2]))
        except subprocess.CalledProcessError:
            pass
    return processes

def draw_box(win, y, x, height, width, title=""):
    # Draw corners
    win.addstr(y, x, BOX['tl'])
    win.addstr(y, x + width - 1, BOX['tr'])
    win.addstr(y + height - 1, x, BOX['bl'])
    win.addstr(y + height - 1, x + width - 1, BOX['br'])

    # Draw horizontal lines
    for i in range(1, width - 1):
        win.addstr(y, x + i, BOX['h'])
        win.addstr(y + height - 1, x + i, BOX['h'])

    # Draw vertical lines
    for i in range(1, height - 1):
        win.addstr(y + i, x, BOX['v'])
        win.addstr(y + i, x + width - 1, BOX['v'])

    # Add title if provided
    if title:
        win.addstr(y, x + 2, f" {title} ")

def draw_usage_bar(win, y, x, width, percentage):
    filled = int((width - 2) * percentage / 100)
    win.addstr(y, x, "[")
    for i in range(width - 2):
        if i < filled:
            char_idx = min(3, int(4 * i / filled))
            win.addstr(USAGE_GAUGE[char_idx])
        else:
            win.addstr(" ")
    win.addstr("]")

def main(stdscr):
    curses.start_color()
    curses.use_default_colors()
    curses.init_pair(1, curses.COLOR_CYAN, -1)
    curses.init_pair(2, curses.COLOR_GREEN, -1)
    curses.init_pair(3, curses.COLOR_YELLOW, -1)
    curses.curs_set(0)
    stdscr.nodelay(False)
    stdscr.timeout(0)

    previous_npu_runtime = 0.0
    previous_time = time.time()
    usage_history = []

    # Read device info
    # Read device info
    device_info = {}
    for label, path in DEVICE_INFO_PATHS.items():
        value = read_sysfs_value(os.path.join(NPU_DEVICE_DIR, path))
        if value is not None and value != "":
            device_info[label] = value

    while True:
        current_runtime = read_runtime()
        current_time = time.time()
        
        # Always get fresh process info each cycle
        # processes already fetched at start of loop
        
        if current_runtime > 0.0:
            runtime_diff = current_runtime - previous_npu_runtime
            time_diff = (current_time - previous_time) * 1000.0
            usage = min(100.0, max(0.0, (runtime_diff / time_diff * 100.0) if time_diff > 0 else 0.0))
            usage_history.append(usage)
            if len(usage_history) > HISTORY_LENGTH:
                usage_history.pop(0)
        else:
            usage = 0.0

        previous_npu_runtime = current_runtime
        previous_time = current_time

        # Clear screen
        stdscr.erase()
        height, width = stdscr.getmaxyx()

        # Calculate width for centering
        process_width = min(80, width - 4)  # Keep this for title centering

        # Draw title
        title = "NPU Usage Monitor"
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        effective_width = process_width
        title_x = 2 + (effective_width - len(title)) // 2
        time_x = 2 + (effective_width - len(timestamp)) // 2
        
        stdscr.addstr(0, title_x, title, curses.color_pair(1) | curses.A_BOLD)
        stdscr.addstr(1, time_x, timestamp)

        # Draw device info box
        info_width = 40
        info_height = 8
        info_x = 2
        info_y = 3
        draw_box(stdscr, info_y, info_x, info_height, info_width, "Device Information")
        row = info_y + 1
        for key, value in device_info.items():
            if value:
                stdscr.addstr(row, info_x + 2, f"{key}: ", curses.color_pair(2))
                stdscr.addstr(f"{value}")
                row += 1

        # Draw usage box
        usage_width = 40
        usage_height = 4
        usage_x = info_x + info_width + 2
        usage_y = info_y
        draw_box(stdscr, usage_y, usage_x, usage_height, usage_width, "Current Usage")
        stdscr.addstr(usage_y + 1, usage_x + 2, f"{usage:.1f}%", curses.color_pair(3) | curses.A_BOLD)
        draw_usage_bar(stdscr, usage_y + 2, usage_x + 2, usage_width - 4, usage)

        # Draw graph box (moved up to replace active processes section)
        graph_height = GRAPH_HEIGHT + 2
        graph_width = min(HISTORY_LENGTH + 4, width - 4)
        graph_x = 2
        graph_y = info_y + info_height + 1  # Moved up to where processes box was
        draw_box(stdscr, graph_y, graph_x, graph_height, graph_width, "Usage History")

        # Draw usage history graph
        max_graph_width = graph_width - 4
        graph_data = usage_history[-max_graph_width:] if len(usage_history) > max_graph_width else usage_history
        for i, val in enumerate(graph_data):
            level = int((val / 100.0) * (GRAPH_HEIGHT - 1))
            # Always show at least one bar character for any non-zero value
            if val > 0 and level == 0:
                level = 1
            for y in range(GRAPH_HEIGHT - 1):
                char = GRAPH_CHARS[-1] if y < level else " "
                if y == level - 1 and val > 0:
                    char_idx = int((val % (100.0 / GRAPH_HEIGHT)) / (100.0 / GRAPH_HEIGHT) * len(GRAPH_CHARS))
                    char = GRAPH_CHARS[max(0, min(char_idx, len(GRAPH_CHARS) - 1))]
                stdscr.addstr(graph_y + GRAPH_HEIGHT - y, graph_x + i + 2, char)

        # Draw footer
        footer = "Press Ctrl+C to exit"
        stdscr.addstr(height - 1, (width - len(footer)) // 2, footer)

        stdscr.refresh()
        time.sleep(REFRESH_RATE)

if __name__ == '__main__':
    curses.wrapper(main)
