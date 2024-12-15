# nputop

A monitoring tool for Intel Neural Processing Units (NPUs) that provides real-time usage visualization through a simple command-line interface.

## Installation

You can install nputop directly from apt:

```bash
sudo apt update
sudo apt install python3-nputop
```

## Usage

Simply run:

```bash
nputop
```

This will show a real-time visualization of your NPU usage with a simple ASCII bar chart.

## Features

- Real-time monitoring of Intel NPU usage
- Simple ASCII visualization
- History tracking of recent usage
- Lightweight and easy to use

## Requirements

- Python 3.6 or higher
- Linux system with Intel NPU
- Access to `/sys/devices/pci0000:00/0000:00:0b.0/power/runtime_active_time`

## Development

To contribute to development:

1. Clone the repository
2. Install development dependencies
3. Make your changes
4. Submit a pull request

## License

MIT License