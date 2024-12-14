# nputop - Text-Based Prototype

A simplified, text-only proof-of-concept for monitoring Intel Meteor Lake NPU usage in real-time via sysfs on Linux.

**Status:** Pre-alpha prototype — expect incomplete features, rough edges, and limited functionality.

## Acknowledgements

This project was inspired by and based on code from [ZoLArk173/nputop](https://github.com/ZoLArk173/nputop). Thanks for the inspiration and groundwork!

## What This Version Does

- Periodically reads the `runtime_active_time` from the NPU’s sysfs.
- Prints the calculated usage percentage directly to the terminal in a loop.
- Runs inside a Docker container for easy packaging.

## How to Run

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose build && docker-compose up
