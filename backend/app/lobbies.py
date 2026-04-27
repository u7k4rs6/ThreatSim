from typing import Annotated

import httpx
from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Literal

from pydantic import BaseModel, Field

from .auth_jwt import bearer_token, decode_supabase_user_sub
from .config import load_settings
from .supabase_api import sb_insert, sb_select, supabase_enabled

router = APIRouter(prefix="/lobbies", tags=["lobbies"])


class CreateLobbyBody(BaseModel):
    mode: str = Field(default="siege", max_length=64)
    name: str | None = Field(default=None, max_length=128)


class JoinLobbyBody(BaseModel):
    team: Literal["red", "blue"]


async def require_user_sub(
    authorization: Annotated[str | None, Header()] = None,
) -> str:
    settings = load_settings()
    tok = bearer_token(authorization)
    if not tok:
        raise HTTPException(
            status_code=401,
            detail="Authorization: Bearer <access_token> required",
        )
    if not settings.supabase_jwt_secret:
        raise HTTPException(
            status_code=503,
            detail="Server is missing SUPABASE_JWT_SECRET; cannot verify tokens",
        )
    uid = decode_supabase_user_sub(tok, settings.supabase_jwt_secret)
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid or expired access token")
    return uid


@router.post("")
async def create_lobby(
    body: CreateLobbyBody,
    user_id: str = Depends(require_user_sub),
) -> dict[str, str]:
    settings = load_settings()
    if not supabase_enabled(settings):
        raise HTTPException(status_code=503, detail="Supabase is not configured on the API")
    row = {
        "mode": body.mode,
        "name": body.name,
        "created_by": user_id,
    }
    async with httpx.AsyncClient(timeout=25.0) as client:
        rows = await sb_insert(
            client,
            settings,
            "match_lobbies",
            row,
            prefer="return=representation",
        )
    if not rows:
        raise HTTPException(status_code=500, detail="Could not create lobby")
    lid = rows[0].get("id")
    if not lid:
        raise HTTPException(status_code=500, detail="Lobby id missing")
    return {"lobbyId": str(lid)}


@router.post("/{lobby_id}/join")
async def join_lobby(
    lobby_id: str,
    body: JoinLobbyBody,
    user_id: str = Depends(require_user_sub),
) -> dict[str, str]:
    settings = load_settings()
    if not supabase_enabled(settings):
        raise HTTPException(status_code=503, detail="Supabase is not configured on the API")
    async with httpx.AsyncClient(timeout=25.0) as client:
        lobby = await sb_select(client, settings, "match_lobbies", {"id": lobby_id})
        if not lobby:
            raise HTTPException(status_code=404, detail="Lobby not found")
        row = {"lobby_id": lobby_id, "user_id": user_id, "team": body.team}
        ins = await sb_insert(
            client,
            settings,
            "match_lobby_players",
            row,
            prefer="return=representation",
        )
    if ins is None:
        raise HTTPException(status_code=409, detail="Could not join (already in lobby or conflict)")
    return {"status": "joined", "lobbyId": lobby_id, "team": body.team}


@router.get("/{lobby_id}")
async def get_lobby(lobby_id: str) -> dict[str, object]:
    settings = load_settings()
    if not supabase_enabled(settings):
        raise HTTPException(status_code=503, detail="Supabase is not configured on the API")
    async with httpx.AsyncClient(timeout=25.0) as client:
        lobby = await sb_select(client, settings, "match_lobbies", {"id": lobby_id})
        players = await sb_select(
            client,
            settings,
            "match_lobby_players",
            {"lobby_id": lobby_id},
            select="user_id,team,joined_at",
        )
    if not lobby:
        raise HTTPException(status_code=404, detail="Lobby not found")
    return {"lobby": lobby[0], "players": players}
