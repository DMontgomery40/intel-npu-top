
# intel-npu-top


A simplified, text-only proof-of-concept for monitoring Intel Meteor Lake NPU usage in real-time via sysfs on Linux.

**Status:** Pre-alpha prototype — expect incomplete features, rough edges, and limited functionality.

## ⚠️ Important Warning

This is an experimental prototype and is **NOT PRODUCTION READY**. Use at your own risk and expect:
- Incomplete features
- Potential bugs
- Limited error handling
- Possible system-specific issues

## Acknowledgements

This project was inspired by and based on code from [ZoLArk173/nputop](https://github.com/ZoLArk173/nputop). Thanks for the inspiration and groundwork!

## What This Version Does

* Periodically reads the `runtime_active_time` from the NPU's sysfs
* Prints the calculated usage percentage directly to the terminal in a loop
* Runs inside a Docker container for easy packaging

## Important Notice

This is the basic prototype branch. For the more feature-complete TypeScript implementation, please visit the separate repository at [nputop-ts](https://github.com/DMontgomery40/nputop-ts).

The TypeScript version includes:
* Real-time NPU usage monitoring
* ASCII-based visualization
* Docker container support
* Better error handling

