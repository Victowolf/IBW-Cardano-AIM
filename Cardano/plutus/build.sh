#!/bin/sh
set -e
WORK=/workspace
cd $WORK

echo "Listing workspace"
ls -la

# try to compile using plutus-tx if available
if command -v plutus-tx >/dev/null 2>&1; then
  mkdir -p scripts
  echo "Compiling TaskValidator.hs using plutus-tx..."
  plutus-tx compile src/TaskValidator.hs --output scripts/task.plutus
  echo "Compiled to scripts/task.plutus"
  ls -la scripts
  exit 0
fi

echo "plutus-tx not found in image. Please run with a Plutus build image that contains plutus-tx."
exit 1
