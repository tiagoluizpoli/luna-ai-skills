# Optimizing Docker Performance for Development

Performance in Docker for development is often bottlenecked by file system I/O, especially on macOS and Windows. Here are the best practices to keep your environment snappy.

## 1. Volume Mounting (The I/O Bottleneck)
On non-Linux systems, host-path mounting (`./src:/app/src`) is slow.

- **Use Named Volumes**: For data that doesn't need to be edited on the host (like `node_modules` or DB data), use named volumes.
- **VirtioFS**: Ensure you have "VirtioFS" enabled in Docker Desktop settings for significantly faster I/O.
- **Selective Mounting**: Only mount the directories you are actively editing.

## 2. Image Optimization (Build Speed)
- **Layer Caching**: Order your `Dockerfile` instructions from least-frequently changed to most-frequently changed.
- **Multi-stage Builds**: Use one stage for building (with all dev dependencies) and a smaller stage for running.
- **Base Images**: Use `-alpine` or `-slim` variants to reduce pull times and disk usage.

## 3. Resource Limits
Docker by default might starve your host or be starved itself.
- **Compose Limits**: Set `deploy.resources.limits` in your compose file to prevent a runaway container from crashing your machine.
- **Docker Desktop Limits**: Adjust CPU and RAM allocation in Docker settings to match your hardware.

## 4. Network Performance
- **Avoid Overlapping Subnets**: If you use a VPN, ensure Docker's subnet doesn't conflict.
- **Bridge Mode**: Use the default bridge network unless you have a specific reason for `host` or `none`.
