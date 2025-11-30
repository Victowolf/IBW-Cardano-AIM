Official Hydra (Cardano) + @hydra-sdk orchestrator scaffold (Docker)
===================================================================
What this is
-------------
- A complete scaffold to run a *Docker*-based local Hydra Head cluster (3 participants: HR, Legal, Audit)
  plus a Node.js orchestrator that uses the official `@hydra-sdk/*` packages to connect to the head.
- Intended as a developer starting point. You must still build hydra-node images or obtain binaries from the official hydra repo.

Contents
--------
- docker-compose.yml            (compose to run Cardano node, hydra-nodes, orchestrator)
- hydra-node/                   (placeholder build context for hydra-node Dockerfile)
- nodes/                        (per-node config & keys placeholders)
- orchestrator/                 (Node.js service using @hydra-sdk packages)
- scripts/                      (helper scripts: generate keys, init head, examples)

Quick start (high level)
------------------------
1. Install Docker & Docker Compose (v2).
2. Clone/build the official hydra-node Docker image:
     git clone https://github.com/cardano-scaling/hydra.git
     # follow hydra repo README to build hydra-node images or copy binaries into hydra-node/ folder
3. Create Cardano node or use a lightweight testnet node. Provide CARDANO socket and network config.
4. Edit nodes/*/config.yaml to point to correct paths and ports.
5. Run:
     docker compose up --build
6. Start the orchestrator service:
     docker compose up orchestrator
7. Use the examples in scripts/ to init head, commit UTxOs, submit transactions, and settle to L1.

Notes
-----
- This scaffold assumes you will provide hydra-node binaries or Dockerfiles in hydra-node/ to be built by Docker Compose.
- The orchestrator uses the @hydra-sdk packages. Install them inside the orchestrator (npm install) or let Docker build the orchestrator image.
- See hydra.family docs for deep ops: https://hydra.family/head-protocol/docs/operating-hydra
