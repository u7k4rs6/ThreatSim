from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

import httpx

from .config import Settings
from .supabase_api import sb_insert, sb_patch, supabase_enabled

logger = logging.getLogger(__name__)


async def record_session_started(
    settings: Settings,
    *,
    external_session_id: str,
    user_id: str | None,
    cve_id: str | None,
    scenario_source: str | None,
) -> None:
    if not supabase_enabled(settings):
        return
    row: dict[str, Any] = {
        "external_session_id": external_session_id,
        "user_id": user_id,
        "cve_id": cve_id,
        "scenario_source": scenario_source,
    }
    async with httpx.AsyncClient(timeout=20.0) as client:
        await sb_insert(client, settings, "threat_sessions", row)


async def record_session_ended(
    settings: Settings,
    *,
    external_session_id: str,
    user_id: str | None,
) -> None:
    if not supabase_enabled(settings):
        return
    ended = datetime.now(timezone.utc).isoformat()
    async with httpx.AsyncClient(timeout=20.0) as client:
        await sb_patch(
            client,
            settings,
            "threat_sessions",
            {"external_session_id": external_session_id},
            {"ended_at": ended},
        )


async def record_event(
    settings: Settings,
    *,
    external_session_id: str,
    user_id: str | None,
    event_type: str,
    payload: dict[str, Any] | None = None,
) -> None:
    if not supabase_enabled(settings):
        return
    row: dict[str, Any] = {
        "external_session_id": external_session_id,
        "user_id": user_id,
        "event_type": event_type,
        "payload": payload or {},
    }
    async with httpx.AsyncClient(timeout=20.0) as client:
        await sb_insert(client, settings, "telemetry_events", row)


def truncate_line(s: str, max_len: int = 400) -> str:
    s = s.replace("\r", "").strip()
    if len(s) > max_len:
        return s[: max_len - 3] + "..."
    return s
