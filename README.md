# ThreatSim

**Phase 1 — execution:** **FastAPI** provisions an **Ubuntu** Docker container; **Vite + React** + **xterm.js** attach over WebSockets for a live shell.

**Phase 2 — AI ingestion (PRD):** On each sandbox (default `POST /api/sessions?scenario=true`), the API pulls a **recent CVE sample** from the [NVD 2.0 API](https://nvd.nist.gov/developers/vulnerabilities), asks **Gemini** (when configured) for a Markdown **mission briefing** plus a small **vulnerable Python training file**, then copies it into the container under **`/mission/`**. Without `GEMINI_API_KEY`, a deterministic fallback mission is used. If NVD is unreachable, a synthetic CVE record is used.

**Phase 3 — Supabase + telemetry + lobby API (PRD):** Run the SQL in `supabase/migrations/20260427120000_phase3.sql` in your Supabase project. Configure the API with **`SUPABASE_URL`** + **`SUPABASE_SERVICE_ROLE_KEY`** (server only) and **`SUPABASE_JWT_SECRET`** (Settings → API → JWT Secret) so the backend can verify `Authorization: Bearer <access_token>` from the browser. Each sandbox write goes to **`threat_sessions`**; lifecycle and terminal attach events go to **`telemetry_events`**. **Siege lobbies:** `POST /api/lobbies`, `POST /api/lobbies/{id}/join`, `GET /api/lobbies/{id}` (auth required for create/join). If you sign in via the UI, **start the sandbox while logged in** so the WebSocket can send `?access_token=…` (the API returns `terminalAuth: true` when the Docker session is bound to your user).

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Linux engine; WSL2 backend on Windows is fine)
- Node.js 20+
- Python 3.11+

## Run locally

**1. API (port 8000)**

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**2. UI (port 5173)**

```powershell
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173`, optionally **sign in** (needs `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`), click **Start sandbox**, read the **mission briefing**, then use the terminal (e.g. `ls /mission`, `python3 /mission/vuln.py`). The dev server proxies `/api` and `/ws` to the backend.

### Environment (optional)

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) key for Gemini scenario text + artifact |
| `GEMINI_MODEL` | Defaults to `gemini-2.0-flash` |
| `NVD_API_KEY` | [NVD API key](https://nvd.nist.gov/developers/request-an-api-key) for higher rate limits |
| `SUPABASE_URL` | Project URL (API) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **never** ship to the browser; used only by FastAPI for PostgREST writes |
| `SUPABASE_JWT_SECRET` | JWT signing secret (verify browser access tokens) |
| `VITE_SUPABASE_URL` | Same project URL for the React client |
| `VITE_SUPABASE_ANON_KEY` | Anon key for Supabase Auth in the browser |

Quick terminal-only sandbox (skip CVE/Gemini/inject): `POST /api/sessions?scenario=false`.

## Layout

| Path | Role |
|------|------|
| `frontend/` | React, Tailwind v4, xterm.js, briefing panel |
| `backend/app/main.py` | Sessions, Docker attach, WebSocket I/O |
| `backend/app/cve_fetch.py` | NVD recent CVE sample |
| `backend/app/scenario.py` | Gemini JSON mission + artifact (or fallback) |
| `backend/app/container_files.py` | Inject files via `put_archive` |
| `backend/app/supabase_api.py` | PostgREST helpers (service role) |
| `backend/app/telemetry.py` | Session + event rows |
| `backend/app/lobbies.py` | Siege lobby routes |
| `supabase/migrations/` | SQL for `threat_sessions`, `telemetry_events`, `match_lobbies` |

**Still ahead (PRD):** institutional dashboards, exports, high-volume matchmaking (dedicated real-time service), tournaments.
