# Placeholder Dockerfile for hydra-node
# You should replace this by building the official hydra-node binary from the hydra repo,
# or put the prebuilt hydra-node binary into this image.
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y ca-certificates wget tar
WORKDIR /app
# Copy prebuilt hydra-node binary into /app/hydra-node (replace with actual binary)
COPY hydra-node /usr/local/bin/hydra-node
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]