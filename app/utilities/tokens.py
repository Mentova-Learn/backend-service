from __future__ import annotations

from datetime import datetime
from datetime import timedelta
from datetime import timezone

import jwt

from app import settings
from app.utilities import logging

logger = logging.get_logger(__name__)


def create_access_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc)
        + timedelta(minutes=settings.JWT_EXPIRATION_MINUTES),
    }
    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_access_token(token: str) -> int | None:
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        sub = payload.get("sub")
        return int(sub) if sub is not None else None
    except jwt.PyJWTError:
        logger.exception("Token decode failed")
        return None
