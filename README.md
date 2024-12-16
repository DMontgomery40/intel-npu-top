# intel-npu-top 

A monitoring tool for Intel Meteor Lake NPU usage in real-time via sysfs on Linux, featuring ASCII-based visualization.

![NPU Usage Monitor Screenshot](assets/screenshot.png)

**Status:** Pre-alpha prototype — expect incomplete features, rough edges, and limited functionality.

## ⚠️ Important Warning

This is an experimental prototype and is **NOT PRODUCTION READY**. Use at your own risk and expect:
- Incomplete features
- Potential bugs
- Limited error handling
- Possible system-specific issues

## Requirements

- Linux system with Intel Meteor Lake NPU
- Python 3.6 or higher
- Access to NPU sysfs entries (usually requires root privileges)

## Features

* Real-time NPU usage monitoring with ASCII bar chart visualization
* Historical view of the last 40 samples
* Automatic screen refresh
* Docker container support

## Installation

### Standalone Script

Just copy the STANDALONE.py script to your system and run it with Python 3.

### From PyPI   (Coming Soon)

### From Source

git clone https://github.com/DMontgomery40/intel-npu-top
cd intel-npu-top
python3 -m pip install .

### Using Docker

docker-compose up -d

## Usage

sudo intel-npu-top

Note: Root privileges are (usually) required to access the NPU sysfs entries*

  * check with `ls -lh /sys/devices/pci0000:00/0000:00:0b.0/accel/accel0`

## Acknowledgements

This project was inspired by and based on code from [ZoLArk173/nputop](https://github.com/ZoLArk173/nputop). Thanks for the inspiration and groundwork!

## License

MIT License - See LICENSE file for details.
