import asyncio
import contextlib
import json
import logging
import uuid
from contextlib import asynccontextmanager
from typing import Any

import docker
import httpx
from docker.errors import APIError, DockerException
from fastapi import (
    Depends,
    FastAPI,
    Header,
    HTTPException,
    Query,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from . import cve_fetch
from . import telemetry
from .auth_jwt import bearer_token, decode_supabase_user_sub
from .config import Settings, load_settings
from .container_files import put_file_in_container
from .lobbies import router as lobbies_router
from .scenario import generate_mission_with_gemini

logger = logging.getLogger(__name__)

DOCKER_IMAGE = "ubuntu:22.04"

sessions: dict[str, dict[str, Any]] = {}


def _stop_container(container: Any) -> None:
    try:
        container.stop(timeout=5)
    except (APIError, DockerException) as e:
        logger.debug("stop container: %s", e)
    try:
        container.remove(force=True)
    except (APIError, DockerException) as e:
        logger.debug("remove container: %s", e)


async def finalize_sandbox_session(session_id: str, settings: Settings) -> None:
    data = sessions.pop(session_id, None)
    if not data:
        return
    container = data.get("container")
    if container:
        await asyncio.to_thread(_stop_container, container)
    uid = data.get("user_id")
    await telemetry.record_session_ended(
        settings,
        external_session_id=session_id,
        user_id=uid,
    )


@asynccontextmanager
async def lifespan(_app: FastAPI):
    yield
    settings = load_settings()
    for sid in list(sessions.keys()):
        await finalize_sandbox_session(sid, settings)


app = FastAPI(title="ThreatSim API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(lobbies_router, prefix="/api")


async def optional_bearer_user(
    authorization: str | None = Header(default=None),
) -> str | None:
    settings = load_settings()
    raw = bearer_token(authorization)
    if not raw:
        return None
    if not settings.supabase_jwt_secret:
        logger.warning(
            "Authorization bearer ignored: SUPABASE_JWT_SECRET not set on server"
        )
        return None
    uid = decode_supabase_user_sub(raw, settings.supabase_jwt_secret)
    if uid is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token",
        )
    return uid


def _recv(sock: Any, n: int) -> bytes:
    read = getattr(sock, "read", None)
    if callable(read):
        return read(n)
    if hasattr(sock, "recv"):
        return sock.recv(n)
    return sock._sock.recv(n)


def _send(sock: Any, data: bytes) -> None:
    write = getattr(sock, "write", None)
    if callable(write):
        write(data)
        return
    if hasattr(sock, "sendall"):
        sock.sendall(data)
    elif hasattr(sock, "send"):
        sock.send(data)
    else:
        sock._sock.sendall(data)


def _close_sock(sock: Any) -> None:
    try:
        close = getattr(sock, "close", None)
        if callable(close):
            close()
        elif hasattr(sock, "_sock"):
            sock._sock.close()
    except OSError:
        pass


@app.post("/api/sessions")
async def create_session(
    user_id: str | None = Depends(optional_bearer_user),
    scenario: bool = Query(
        True,
        description="If true, fetch a CVE sample, generate a mission artifact (Gemini when configured), and copy it into /mission.",
    ),
) -> dict[str, Any]:
    settings = load_settings()
    cve: dict[str, Any] | None = None
    mission: dict[str, Any] | None = None

    if scenario:
        async with httpx.AsyncClient(
            headers={"User-Agent": "ThreatSim/0.1 (security education)"},
            follow_redirects=True,
        ) as http:
            cve = await cve_fetch.fetch_sample_cve(
                http, nvd_api_key=settings.nvd_api_key
            )
        if not cve:
            cve = cve_fetch.fallback_cve()
        mission = await asyncio.to_thread(
            generate_mission_with_gemini, settings, cve
        )

    try:
        client = docker.from_env()
    except DockerException as e:
        # On Windows this often means Docker Desktop isn't running (named pipe missing).
        return JSONResponse(  # type: ignore[return-value]
            {
                "detail": (
                    "Docker is not reachable from the API. Start Docker Desktop (Linux containers / WSL2 backend) "
                    "and try again. Under the hood we connect to the Docker engine via the local named pipe; "
                    f"current error: {e}"
                )
            },
            status_code=503,
        )
    try:
        client.images.get(DOCKER_IMAGE)
    except APIError:
        try:
            client.images.pull(DOCKER_IMAGE)
        except APIError as e:
            return JSONResponse(  # type: ignore[return-value]
                {"detail": f"Could not pull {DOCKER_IMAGE}: {e}"},
                status_code=503,
            )

    try:
        container = client.containers.run(
            DOCKER_IMAGE,
            command="/bin/bash",
            tty=True,
            stdin_open=True,
            detach=True,
            remove=False,
        )
    except APIError as e:
        return JSONResponse({"detail": str(e)}, status_code=503)  # type: ignore[return-value]

    if mission and cve:
        try:
            await asyncio.to_thread(
                container.exec_run,
                ["mkdir", "-p", settings.mission_dir],
                demux=True,
            )
            await asyncio.to_thread(
                put_file_in_container,
                container,
                settings.mission_dir,
                str(mission["artifact_name"]),
                str(mission["artifact_content"]).encode("utf-8"),
            )
        except Exception as e:
            logger.exception("mission inject failed: %s", e)
            try:
                container.stop(timeout=3)
                container.remove(force=True)
            except APIError:
                pass
            return JSONResponse(  # type: ignore[return-value]
                {"detail": f"Could not inject mission files: {e}"},
                status_code=500,
            )

    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "container": container,
        "docker_client": client,
        "user_id": user_id,
    }

    await telemetry.record_session_started(
        settings,
        external_session_id=session_id,
        user_id=user_id,
        cve_id=cve.get("id") if cve else None,
        scenario_source=mission.get("source") if mission else None,
    )
    await telemetry.record_event(
        settings,
        external_session_id=session_id,
        user_id=user_id,
        event_type="session_provisioned",
        payload={"scenario": scenario},
    )

    out: dict[str, Any] = {
        "sessionId": session_id,
        "terminalAuth": user_id is not None,
    }
    if scenario and mission and cve:
        desc = cve.get("description") or ""
        out["cve"] = {"id": cve.get("id", ""), "description": desc[:600]}
        out["briefing"] = mission["briefing"]
        out["artifactPath"] = f"{settings.mission_dir}/{mission['artifact_name']}"
        out["scenarioSource"] = mission["source"]
    return out


@app.websocket("/ws/sessions/{session_id}/terminal")
async def terminal_ws(
    websocket: WebSocket,
    session_id: str,
    access_token: str | None = Query(
        default=None,
        description="Supabase access_token when sandbox was created with a signed-in user.",
    ),
) -> None:
    settings = load_settings()
    await websocket.accept()
    data = sessions.get(session_id)
    if not data:
        await websocket.close(code=4404)
        return

    expected_user: str | None = data.get("user_id")
    if expected_user:
        if not settings.supabase_jwt_secret:
            await websocket.close(code=4403)
            return
        tok = access_token or bearer_token(websocket.headers.get("authorization"))
        sub = (
            decode_supabase_user_sub(tok, settings.supabase_jwt_secret) if tok else None
        )
        if sub != expected_user:
            await websocket.close(code=4401)
            return

    container = data["container"]

    try:
        sock = container.attach_socket(
            params={"stdin": 1, "stdout": 1, "stderr": 1, "stream": 1}
        )
    except APIError as e:
        logger.warning("attach_socket failed: %s", e)
        await websocket.close(code=4400)
        await finalize_sandbox_session(session_id, settings)
        return

    stream_sock = sock
    uid: str | None = data.get("user_id")

    async def pump_stdout() -> None:
        try:
            while True:
                chunk = await asyncio.to_thread(_recv, stream_sock, 65536)
                if not chunk:
                    with contextlib.suppress(Exception):
                        await websocket.close()
                    break
                try:
                    await websocket.send_bytes(chunk)
                except WebSocketDisconnect:
                    break
        except asyncio.CancelledError:
            raise
        except Exception as e:
            logger.debug("pump_stdout: %s", e)

    pump: asyncio.Task[None] = asyncio.create_task(pump_stdout())

    async def handle_incoming() -> None:
        while True:
            message = await websocket.receive()
            mtype = message.get("type")
            if mtype == "websocket.disconnect":
                break
            if mtype != "websocket.receive":
                continue
            if "text" in message:
                raw: str = message["text"]
                if raw.startswith("{"):
                    try:
                        obj = json.loads(raw)
                    except json.JSONDecodeError:
                        await asyncio.to_thread(_send, stream_sock, raw.encode("utf-8"))
                    else:
                        if (
                            isinstance(obj, dict)
                            and obj.get("type") == "resize"
                            and "cols" in obj
                            and "rows" in obj
                        ):
                            try:
                                await asyncio.to_thread(
                                    container.resize,
                                    height=int(obj["rows"]),
                                    width=int(obj["cols"]),
                                )
                            except (APIError, ValueError, TypeError) as e:
                                logger.debug("resize: %s", e)
                        else:
                            await asyncio.to_thread(
                                _send, stream_sock, raw.encode("utf-8")
                            )
                else:
                    await asyncio.to_thread(_send, stream_sock, raw.encode("utf-8"))
            elif "bytes" in message:
                b = message["bytes"]
                if isinstance(b, memoryview):
                    b = b.tobytes()
                await asyncio.to_thread(_send, stream_sock, b)

    await telemetry.record_event(
        settings,
        external_session_id=session_id,
        user_id=uid,
        event_type="terminal_attached",
        payload={},
    )

    try:
        await handle_incoming()
    except WebSocketDisconnect:
        pass
    finally:
        pump.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await pump
        _close_sock(stream_sock)
        await telemetry.record_event(
            settings,
            external_session_id=session_id,
            user_id=uid,
            event_type="terminal_detached",
            payload={},
        )
        await finalize_sandbox_session(session_id, settings)
