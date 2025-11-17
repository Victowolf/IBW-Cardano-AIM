#!/usr/bin/env python3
import sys, hashlib
from pathlib import Path

def sha(b): return hashlib.sha256(b).digest()

def merkle_root(hashes):
    if not hashes:
        return sha(b'')
    nodes = hashes[:]
    while len(nodes) > 1:
        if len(nodes) % 2 == 1:
            nodes.append(nodes[-1])
        nodes = [sha(nodes[i] + nodes[i+1]) for i in range(0, len(nodes), 2)]
    return nodes[0]

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: merkle.py file1 file2 ...")
        sys.exit(1)
    files = sys.argv[1:]
    hashes = []
    for f in files:
        hashes.append(sha(Path(f).read_bytes()))
    root = merkle_root(hashes)
    print(root.hex())
