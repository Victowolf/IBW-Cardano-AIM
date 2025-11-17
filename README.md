# Intelligent HR Automation System using Multi-Agent AI & Cardano Blockchain
## 📌 Project Overview

This project introduces a next-generation HR Automation Ecosystem that integrates:
Multi-Agent AI System for intelligent decision-making
Cardano Blockchain (L1 + Hydra L2) for transparent, immutable task tracking
IPFS + Merkle Tree Architecture for secure and verifiable document storage
Reinforcement Learning Loops that help agents improve through HR feedback
The platform automates major HR operations—recruitment, onboarding, payroll, performance evaluation, reporting, meeting summarization, and organizational task management—while ensuring accountability, efficiency, and data integrity.

# 📂 Repository Structure (Brief Overview)
backend/
│── Agents 1–5 (AI modules for analytics, news, tasks, hiring, payroll)
│── Agent6 / Orchestration (central controller)
│── Apiserver.py (backend API)
│── mockchain.py (blockchain simulator)
│── Model.py (ML/RL core)
│── extracttext.py (PDF/Text parser)
│── hr_mock_data.json
│── .env

Cardano/
│── bootstrap/ (Hydra initialization)
│── metadata/ (task logs + file logs Schema)
│── plutus/ (smart contract for wallet validation)
│── tools/merkle.py (Merkle tree generator)

# 🧠 Multi-Agent AI System

The system uses six coordinated AI agents, each responsible for a specific HR domain. Their combined output forms a fully automated HR environment.

Agent Summary

Agent 1: HR analytics, KPI generation, attrition trends, exit reason analysis

Agent 2: Company news monitoring, summarization, policy-triggered insights

Agent 3: Notification parsing & multi-role task distribution

Agent 4: Job tests, candidate scoring, recruitment pipeline

Agent 5: Automated payroll, salary computation, anomaly detection

Agent 6: Meeting summarization & centralized task orchestration

Agents continuously generate, refine, and learn from HR feedback, forming a self-improving HR automation engine.

# ⚙ System Workflow (Short, Clear & Structured)
### 1. Task Suggestion (Fully Automatic)

Agents analyze HR data, performance reports, news, payroll inputs, and meeting transcripts.
They generate structured, metadata-rich task suggestions.

### 2. HR Review & Confirmation

HR reviews tasks, adds comments, and confirms execution.
Each approved task is logged as a task_initiated event in Hydra L2.

### 3. Task Execution by Agents

Agents autonomously execute confirmed tasks—recruitment scoring, payroll generation, reports, and meeting action item extraction.
Completion is logged as a task_completed event.

### 4. File Handling (IPFS + Merkle Trees)
All documents—reports, payslips, test results, offer letters—are:
Hashed
Uploaded to IPFS
Grouped into Merkle batches
Anchored to Cardano via Merkle root
This ensures tamper-proof verification and trustable document provenance.

### 5. Reinforcement Learning Feedback
Every blockchain entry feeds into the RL system:
HR corrections
Task failures/success
Timing patterns
Performance accuracy
Agents become more intelligent and context-aware over time.

# ⛓ Blockchain Architecture (Concise Explanation)
### Hydra Layer 2
A single Hydra Head is run per company, handling all daily HR ledger entries:
Task initiations
Task completions
File/Merkle references
Hydra provides high throughput, low cost, and fast confirmation.

### Layer 1 Anchoring
At the end of each day:
All logs
Merkle roots
Timestamped HR confirmations
are batched and anchored to Cardano Layer 1 to ensure permanent immutability.

# 📦 Backend Modules Summary
Apiserver.py
REST API endpoint for frontend, agents, and blockchain communication.
Orchestration.py
Central controller coordinating all agents and workflows.
mockchain.py
Local simulation of Hydra and L1 anchoring.
merkle.py
Merkle tree generator for verifying file groups.
extracttext.py
Extracts text from documents for NLP-based analysis.
Model.py
Machine Learning & Reinforcement Learning logic for agent improvement.

# 🔥 Key Features (More Words, Still Brief)
Multi-agent intelligence covering analytics, tasks, hiring, payroll & more
Blockchain-backed accountability for every completed HR action
Immutable logs for audits, compliance, and internal governance
One-click HR task execution via an orchestrated workflow
Secure file verification using IPFS hashes and Merkle roots
Reinforcement Learning loops that enhance agent accuracy continuously
End-of-day anchoring ensures long-term trust and transparent data history
