# OrbitOne – AI-First HR Automation Platform

OrbitOne is an AI-first HR automation platform that brings hiring, onboarding, performance, and payroll into one coordinated system. It combines a multi-agent AI architecture with the Cardano blockchain (Hydra + L1) and IPFS so HR teams get automation, clear audit trails, and secure document handling without losing human control over final decisions. [web:35]

---

## Table of Contents

1. [Problem Statement](#problem-statement)  
2. [Solution Overview](#solution-overview)  
3. [Key Features](#key-features)  
4. [System Architecture](#system-architecture)  
5. [Technology Stack](#technology-stack)  
6. [Project Structure](#project-structure)  
7. [Getting Started](#getting-started)  
8. [Environment Variables](#environment-variables)  
9. [Running Cardano Testnet](#running-cardano-testnet)  
10. [Running Hydra Head](#running-hydra-head)  
11. [API Overview](#api-overview)  
12. [Future Scope](#future-scope)  
13. [License](#license)  

---

## Problem Statement

In most large organisations, HR work is scattered across many tools—an ATS for hiring, an HRMS for onboarding, separate payroll software, performance tools, spreadsheets, and endless email threads. This fragmentation makes it hard to see the full employee journey, creates data silos, and often results in delays, manual mistakes, and a weak or missing audit trail. [web:36]  
Decisions end up inconsistent, and HR teams spend more time coordinating tools than actually supporting people.

OrbitOne tackles this by offering one unified, AI-driven system that automates routine workflows, keeps data consistent, and adds a verifiable, blockchain-backed record of what happened and when. [web:36]

---

## Solution Overview

OrbitOne acts as a central brain and controller for HR operations rather than just another standalone tool. A multi-agent AI system works alongside human approvers, using Cardano (Hydra + L1) for tamper-evident logging and IPFS with Merkle trees to ensure documents stay secure and verifiable over time. [web:32]  

HR teams get a role-based dashboard where they can see pipelines for hiring, onboarding, performance, and payroll, while every important action (like approvals, offers, uploads, or updates) is converted into a structured event that can be independently verified on-chain. [web:32]

---

## Key Features

- Department-wise AI agents for hiring, onboarding, payroll, and performance.  
- Flexible workflows that can run in “approval-based” mode or “auto” mode depending on HR preferences.  
- Merkle tree hashing to prove document integrity without exposing the documents themselves. [web:32]  
- A blockchain-anchored audit trail so sensitive HR actions are traceable and hard to tamper with.  
- Secure storage of documents via IPFS, with references tied back to on-chain proofs.  
- A central orchestrator to coordinate all agents and workflows.  
- A real-time HR dashboard showing jobs, candidates, employees, and events at a glance.  
- Human override and control for all AI suggestions to keep decisions accountable.  

---

## System Architecture

The platform is structured into five main layers so each concern is cleanly separated and easier to maintain. [web:30]

### 1. Frontend (React + Vite)

- HR dashboard for day-to-day operations.  
- Job creation and management views.  
- Employee lifecycle workflows (from candidate to offboarding).  
- A visual viewer for blockchain-backed audit trails.

### 2. Backend (FastAPI)

- REST APIs exposed to the frontend and external systems.  
- Orchestration logic that coordinates multiple AI agents.  
- Integration layer for Cardano and Hydra interactions.  
- IPFS upload and retrieval manager for documents.  
- Workflow engine to run HR processes end-to-end.  
- Authentication and role-based access control (RBAC).

### 3. Multi-Agent System

- Hiring Agent for screening and recommendations.  
- Onboarding Agent for checklists and document collection.  
- Payroll Agent for salary-related events and changes.  
- Performance Agent for reviews and performance insights.  
- Notification / Meeting Agent for reminders and coordination.  
- Orchestrator Agent that keeps all agents in sync with HR rules.  

### 4. Blockchain and Storage Layer

- Cardano Testnet node and CLI setup for transactions.  
- Hydra Head for batching events and reducing on-chain load.  
- IPFS for storing documents off-chain while keeping them accessible.  
- Merkle tree hashing to support fast, verifiable integrity checks. [web:32]

### 5. Database Layer

- MongoDB used as the main application database.  
- Stores job posts, applications, approvals, events, and related metadata.  

---

## Technology Stack

### Frontend

- React for UI.  
- Vite for fast development and bundling.  
- TypeScript for type safety.  
- ShadCN / TailwindCSS for design and styling.

### Backend

- Python as the core language.  
- FastAPI as the web framework.  
- Uvicorn as the ASGI server.

### Blockchain & Storage

- Cardano Node (Testnet) for blockchain connectivity.  
- Hydra Head to handle high-frequency event batching.  
- IPFS for distributed document storage.  
- Merkle trees for efficient integrity proofs. [web:32]

### Database

- MongoDB or MongoDB Atlas for flexible, document-based storage.  

---

## Project Structure

The repo is organised so you can work on the backend, frontend, blockchain, and documentation in parallel without getting lost. [web:34]
```
.
├── backend/
│ ├── app/
│ │ ├── main.py
│ │ ├── routers/
│ │ ├── models/
│ │ ├── services/
│ │ ├── agents/
│ │ ├── blockchain/
│ │ │ ├── cardano_ops.py
│ │ │ ├── hydra_ops.py
│ │ │ └── merkle_tree.py
│ │ ├── storage/
│ │ │ ├── ipfs_upload.py
│ │ │ └── encryption.py
│ │ └── config.py
│ ├── requirements.txt
│ └── README_backend.md
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── api/
│ │ └── store/
│ ├── public/
│ ├── vite.config.ts
│ └── package.json
│
├── Cardano-testnet/
│ ├── node/
│ │ ├── config.json
│ │ ├── topology.json
│ │ ├── db/
│ │ └── scripts/
│ ├── keys/
│ │ ├── payment.skey
│ │ ├── payment.vkey
│ │ └── address.txt
│ └── README_cardano.md
│
├── Hydra-head/
│ ├── hydra-node/
│ │ ├── hydra.json
│ │ ├── parties/
│ │ │ ├── party1.keys
│ │ │ ├── party2.keys
│ │ │ └── party3.keys
│ │ └── scripts/
│ ├── hydra-contracts/
│ └── README_hydra.md
│
├── docs/
│ ├── architecture.png
│ ├── workflow.png
│ └── audit-verification.pdf
│
├── .env.example
└── README.md
```
text

This layout separates infrastructure (Cardano/Hydra), app logic, and docs so contributors can quickly find what they need. [web:34]

---

## Getting Started

### Prerequisites

Before you run OrbitOne locally, make sure you have:

- Python 3.10+  
- Node.js 18+  
- MongoDB (local or hosted)  
- Cardano CLI installed and configured  
- Hydra binaries available on your machine  
- IPFS running locally or via a gateway endpoint  

---

## Backend Setup

From the project root:

cd backend
python -m venv .venv
source .venv/bin/activate # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload

text

This starts the FastAPI backend on a local server so the frontend and agents can communicate with it. [web:37]

---

## Frontend Setup

From the project root:

cd frontend
npm install
npm run dev

text

You can then open the provided local URL in your browser to access the HR dashboard UI. [web:37]

---

## Running Cardano Testnet

Inside the `/Cardano-testnet/` folder:

### 1. Start the Cardano node

cardano-node run
--config node/config.json
--topology node/topology.json
--database-path node/db
--socket-path node/node.socket

text

This boots up a Cardano testnet node that OrbitOne can use for submitting audit events. [web:32]

### 2. Generate or import keys

Keys are stored under:

Cardano-testnet/keys/

text

This folder holds the payment keys and address used for testnet transactions.

### 3. Query balance

cardano-cli query utxo
--address "$(cat keys/address.txt)"
--testnet-magic 1097911063

text

This lets you confirm that your test address has funds on the Cardano testnet. [web:32]

---

## Running Hydra Head

Inside the `/Hydra-head/` folder:

### 1. Start the Hydra node

hydra-node
--config hydra-node/hydra.json

text

This starts the Hydra node with the configuration defined in `hydra.json`. [web:32]

### 2. Open the head

hydra-cli init
hydra-cli commit --party p1
hydra-cli commit --party p2
hydra-cli open

text

Here, each party commits to the head, and once open, OrbitOne can batch HR events through Hydra before finalising them on-chain. [web:32]

### 3. Submit events

The backend sends events → they are batched in Hydra → and then written back to Cardano, giving you both performance and verifiable logging.

---

## Environment Variables

Backend `.env`:

MONGODB_URI=
IPFS_API_URL=
CARDANO_NODE_SOCKET_PATH=
HYDRA_NODE_ENDPOINT=
JWT_SECRET=

text

These variables configure your database connection, IPFS endpoint, Cardano socket path, Hydra endpoint, and JWT secret for auth. [web:37]

Frontend `.env`:

VITE_API_BASE_URL=http://localhost:8000

text

This points the frontend to the running backend instance.

---

## API Overview

These are the main HTTP endpoints exposed by the backend:

- `GET /jobs` – List available job posts.  
- `POST /jobs` – Create a new job post.  
- `GET /jobs/{id}/applications` – Get applications for a specific job.  
- `POST /jobs/{id}/applications` – Submit or update an application for a job.  
- `POST /agents/hiring/suggest` – Ask the hiring agent for candidate suggestions.  
- `POST /events/log` – Log a structured HR event for audit purposes.  
- `GET /audit/verify` – Verify that an event or document matches the blockchain-backed audit record. [web:38]

---

## Future Scope

OrbitOne is designed with room to grow into more advanced, production-grade capabilities:

- Zero-knowledge proofs to verify properties of HR data without revealing the raw data itself.  
- On-chain payroll proofs to show that payouts follow agreed rules without leaking sensitive amounts.  
- More advanced reinforcement learning strategies so agents adapt to each organisation’s patterns over time.  
- Deeper integrations with tools like Slack, Gmail, and ATS systems to reduce manual copy-paste work. [web:25]

---

## License

OrbitOne is released under the MIT License.  
You are free to use it for hackathons, demos, and to scale it into production deployments, subject to the usual MIT terms. [web:34]
