-- ThreatSim Phase 3: telemetry + multiplayer scaffolding
-- Apply in Supabase SQL Editor or via supabase db push.

-- Sandbox runs (ties to Docker session UUID from API)
create table if not exists public.threat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  external_session_id text not null unique,
  cve_id text,
  scenario_source text,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create index if not exists threat_sessions_user_started_idx
  on public.threat_sessions (user_id, started_at desc);

-- Granular events (service role inserts from FastAPI)
create table if not exists public.telemetry_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  external_session_id text not null,
  event_type text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists telemetry_session_idx
  on public.telemetry_events (external_session_id, created_at desc);

-- Siege-style lobbies (manual join; auto-match can be Edge Function later)
create table if not exists public.match_lobbies (
  id uuid primary key default gen_random_uuid(),
  mode text not null default 'siege',
  name text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.match_lobby_players (
  lobby_id uuid not null references public.match_lobbies (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  team text not null check (team in ('red', 'blue')),
  joined_at timestamptz not null default now(),
  primary key (lobby_id, user_id)
);

create index if not exists lobby_players_user_idx
  on public.match_lobby_players (user_id);

alter table public.threat_sessions enable row level security;
alter table public.telemetry_events enable row level security;
alter table public.match_lobbies enable row level security;
alter table public.match_lobby_players enable row level security;

-- No client-side policies: all writes go through FastAPI with the service role key
-- (service role bypasses RLS). Optionally add read policies for authenticated users later.
