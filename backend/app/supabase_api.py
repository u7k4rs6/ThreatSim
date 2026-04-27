import logging
from typing import Any

import httpx

from .config import Settings

logger = logging.getLogger(__name__)


def _sb_headers(settings: Settings) -> dict[str, str]:
    key = settings.supabase_service_role_key or ""
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }


def supabase_enabled(settings: Settings) -> bool:
    return bool(settings.supabase_url and settings.supabase_service_role_key)


async def sb_insert(
    client: httpx.AsyncClient,
    settings: Settings,
    table: str,
    row: dict[str, Any],
    *,
    prefer: str = "return=minimal",
) -> list[dict[str, Any]] | None:
    if not supabase_enabled(settings):
        return None
    url = f"{settings.supabase_url.rstrip('/')}/rest/v1/{table}"
    h = {**_sb_headers(settings), "Prefer": prefer}
    try:
        r = await client.post(url, headers=h, json=row)
        r.raise_for_status()
        if prefer == "return=representation" and (r.text or "").strip():
            data = r.json()
            if isinstance(data, list):
                return data
            if isinstance(data, dict):
                return [data]
        return None
    except httpx.HTTPError as e:
        logger.warning("Supabase insert %s failed: %s", table, e)
        return None


async def sb_patch(
    client: httpx.AsyncClient,
    settings: Settings,
    table: str,
    filters: dict[str, str],
    patch: dict[str, Any],
) -> None:
    if not supabase_enabled(settings):
        return
    q = "&".join(f"{k}=eq.{v}" for k, v in filters.items())
    url = f"{settings.supabase_url.rstrip('/')}/rest/v1/{table}?{q}"
    try:
        r = await client.patch(url, headers=_sb_headers(settings), json=patch)
        r.raise_for_status()
    except httpx.HTTPError as e:
        logger.warning("Supabase patch %s failed: %s", table, e)


async def sb_select(
    client: httpx.AsyncClient,
    settings: Settings,
    table: str,
    filters: dict[str, str],
    select: str = "*",
) -> list[dict[str, Any]]:
    if not supabase_enabled(settings):
        return []
    q = "&".join(f"{k}=eq.{v}" for k, v in filters.items())
    url = f"{settings.supabase_url.rstrip('/')}/rest/v1/{table}?{q}&select={select}"
    try:
        r = await client.get(url, headers=_sb_headers(settings))
        r.raise_for_status()
        data = r.json()
        return data if isinstance(data, list) else []
    except httpx.HTTPError as e:
        logger.warning("Supabase select %s failed: %s", table, e)
        return []
