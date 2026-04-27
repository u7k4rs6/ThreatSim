import logging
from typing import Any

import jwt

logger = logging.getLogger(__name__)


def bearer_token(authorization: str | None) -> str | None:
    if not authorization:
        return None
    parts = authorization.split(None, 1)
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None
    return parts[1].strip() or None


def decode_supabase_user_sub(token: str, jwt_secret: str | None) -> str | None:
    if not jwt_secret:
        return None
    try:
        payload: dict[str, Any] = jwt.decode(
            token,
            jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
            options={"require": ["exp", "sub"]},
        )
        sub = payload.get("sub")
        return str(sub) if sub else None
    except jwt.PyJWTError as e:
        logger.debug("JWT decode failed: %s", e)
        return None
