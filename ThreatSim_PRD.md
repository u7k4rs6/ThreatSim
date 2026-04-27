# Product Requirements Document (PRD)
## ThreatSim: Hybrid Threat Intelligence & Live-Fire Cyber Range

### 1. Executive Summary
ThreatSim is an AI-native, production-grade cybersecurity execution engine designed to bridge the critical gap between theoretical security education and live incident response. By transitioning users from passive learning to actively patching zero-day exploits in dynamically generated, isolated sandbox environments, ThreatSim positions itself as a premium B2B educational infrastructure and a highly scalable platform for technical communities. 

### 2. Core Vision & Strategic Positioning
The objective is to move beyond standard gamified web applications and build a robust, scalable architecture capable of securing venture capital interest and institutional adoption. ThreatSim replaces outdated academic learning models with immersive, hands-on environments that mirror high-stakes Security Operations Centers (SOCs). 

### 3. Core Execution Loops
To ensure maximum engagement and continuous skill development, the platform relies on four interconnected loops:
* **The Ingestion Loop:** A backend chron-job architecture continuously scrapes global CVE databases, security advisories, and threat intelligence feeds.
* **The Generation Loop:** An AI execution engine synthesizes ingested threat data, autonomously writing configuration files and deploying a containerized vulnerable environment that represents the specific exploit.
* **The Execution Loop:** The user provisions the sandbox, interacts with a low-latency live terminal directly in the browser, and executes bash scripts, reverse engineering tools, or network defense commands to neutralize the threat.
* **The Multiplayer Loop:** High-concurrency matching allows users to form squads for time-boxed Red vs. Blue sieges, where one team defends the infrastructure while the other attempts to breach it.

### 4. Feature Specifications (The Four Pillars)

#### Pillar A: Hybrid Threat Intelligence Engine (AI & Data Layer)
* **Dynamic Scenario Generation:** Integrate the Gemini API to parse complex, unstructured vulnerability reports. The AI will generate narrative-driven mission briefings, extracting the technical core of the CVE to script the vulnerability into the sandbox environment.
* **Automated Validation and Adaptive Feedback:** The AI engine must evaluate the user's terminal inputs, network configurations, and script execution in real-time. Instead of simple boolean success/fail states, the system will analyze the execution path and provide adaptive technical feedback on the user's methodology.
* **Voice-Driven Social Engineering:** Expand AI capabilities beyond text by integrating audio language models to simulate real-time vishing (voice phishing) attacks, testing the user's psychological resilience and incident response under pressure.

#### Pillar B: Production-Grade Execution Sandboxes (Infrastructure Layer)
* **Secure Isolation & Orchestration:** Implement Firecracker microVMs or strict Docker containerization to spin up isolated Linux environments in milliseconds. This isolation is non-negotiable for safely executing untrusted code and reverse-engineering malware.
* **In-Browser Terminal integration:** Utilize WebSockets combined with xterm.js to provide a seamless, low-latency command-line interface directly within the React frontend, ensuring the browser feels like a native Linux terminal.
* **Strict State Management:** Implement aggressive Time-To-Live (TTL) policies on all sandboxes to manage server costs and prevent crypto-mining abuse. Environments must automatically spin down upon mission completion or timeout.

#### Pillar C: Live Multiplayer Arena (Community Layer)
* **High-Concurrency Orchestration:** Architect a backend using Go or Rust capable of managing hundreds of concurrent WebSocket connections. This ensures real-time state updates across leaderboards, live battlegrounds, and chat systems without degradation.
* **Self-Serve Tournament Infrastructure:** Build a module specifically designed to handle massive, inter-college tech fests and hackathons. Organizers should be able to define rulesets, provision custom infrastructure targets, and launch multi-day siege events with a single click. A prime target for stress-testing this module would be deployment at major upcoming events, such as ASCENT'26 in mid-May.

#### Pillar D: Educational Infrastructure (B2B SaaS Layer)
* **Granular Telemetry and Analytics:** Track keystrokes, command history, execution speed, and time-to-resolution to build a comprehensive, exportable skills matrix for every user.
* **Institutional Dashboard:** Provide a high-level command center for instructors and enterprise administrators to monitor cohort progress, identify systemic technical blind spots, and export verifiable performance data. This positions ThreatSim as an essential tool for environments prioritizing immersive, practical learning over traditional academic programs.

### 5. Technical Architecture (Proposed)
* **Frontend:** React (Vite) for rapid module reloading, Tailwind CSS for a sleek, retro-futuristic and professional UI, and xterm.js for the terminal interface.
* **Backend Orchestration:** Python (FastAPI) for AI routing, Gemini API integrations, and threat data ingestion.
* **Real-Time Layer:** Go or Rust for handling high-throughput WebSocket connections required for the terminal and multiplayer state.
* **Infrastructure:** Kubernetes for cluster management, Docker/Firecracker for the sandboxes, and Supabase for Authentication and PostgreSQL database management.

### 6. Vibe Coding Rollout Plan

#### Phase 1: The Core Execution Engine (Weeks 1-2)
* *Goal:* Establish the absolute critical path.
* *Action:* Spin up a single Docker container via a backend API call and connect an xterm.js frontend to it via WebSockets. The milestone is successfully executing `ls` and `whoami` in the browser and receiving the correct output from the isolated container.

#### Phase 2: The AI Ingestion Pipeline (Weeks 3-4)
* *Goal:* Automate the threat intelligence integration.
* *Action:* Build the pipeline that pulls a recent CVE, uses the Gemini API to write a vulnerable Python script or configuration file representing that CVE, and injects that file into the Phase 1 container upon provisioning.

#### Phase 3: B2B Telemetry & Multiplayer Scale (Weeks 5-8)
* *Goal:* Prepare for institutional scaling and community events.
* *Action:* Add the Supabase layer for robust telemetry, user authentication, and build the concurrent matching engine for live tournaments, ensuring the infrastructure can handle high-volume traffic without latency spikes.
