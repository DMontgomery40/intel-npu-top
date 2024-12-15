# Intel NPUTop (TypeScript Branch) 

A TypeScript-based proof-of-concept for monitoring Intel Meteor Lake NPU usage in real-time via sysfs on Linux.

**Status**: Pre-alpha prototype — expect incomplete features, rough edges, and limited functionality.

## Acknowledgements

This project was inspired by and based on code from [ZoLArk173/nputop](https://github.com/ZoLArk173/nputop). The TypeScript implementation aims to provide a more structured codebase while maintaining the simplicity of the original concept.

## What This Version Does

- Reads the `runtime_active_time` from the NPU's sysfs
- Calculates and displays real-time NPU usage percentage
- Provides a basic ASCII-based visualization
- Runs inside a Docker container for easy deployment
- Implements basic error handling and device path detection

## Quick Start

Build and run with Docker Compose:

```bash
docker-compose build && docker-compose up
```

## Alternative Setup (Development)

If you prefer to run directly on your system:

1. Install dependencies:
```bash
npm install
```

2. Run the monitor:
```bash
npm start
```

## Current Limitations

- Early development stage with minimal error handling
- Fixed update interval (1 second)
- Limited configuration options
- Basic visualization only
- May require manual path adjustment for different systems

## System Requirements

- Linux system with Intel Meteor Lake NPU
- Access to `/sys/devices/pci0000:00/` directory
- Node.js 20+ (if running locally)
- Docker (if running containerized)

## Contributing

This is an early prototype, but contributions are welcome. Please note that the codebase is still in flux and major changes may occur.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


## Future Plans

- Enhanced error handling
- Configurable update intervals
- More sophisticated visualization options
- Better system compatibility
- Performance optimizations
- Unit tests

Remember: This is a proof-of-concept implementation focused on exploring NPU monitoring capabilities. It is not intended for production use in its current state.
