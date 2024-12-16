# intel-npu-top 

A monitoring tool for Intel Meteor Lake NPU usage in real-time via sysfs on Linux, featuring ASCII-based visualization.

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
* Historical view of the last 10 samples
* Automatic screen refresh
* Debug output showing detailed timing information
* Docker container support
* Graceful error handling for missing device paths

## Installation

### From Source

git clone https://github.com/DMontgomery40/intel-npu-top
cd intel-npu-top
python3 -m pip install .

### Using Docker

docker-compose up -d

## Usage

sudo intel-npu-top

Note: Root privileges are required to access the NPU sysfs entries.

## Acknowledgements

This project was inspired by and based on code from [ZoLArk173/nputop](https://github.com/ZoLArk173/nputop). Thanks for the inspiration and groundwork!

## License

MIT License - See LICENSE file for details.