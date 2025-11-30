#!/usr/bin/env bash
# Example: send Init via websocat or use SDK commands
echo '{"tag":"Init"}' | websocat ws://localhost:4001
echo 'Init sent to HR node (4001)'
