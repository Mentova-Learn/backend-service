from __future__ import annotations

from app.utilities import logging

logger = logging.get_logger(__name__)


class ExaClientAdapter:
    """An adapter wrapping the Exa async search client."""

    def __init__(self, api_key: str) -> None:
        try:
            from exa_py import AsyncExa
        except ImportError as exc:
            raise RuntimeError(
                "exa-py is not installed. Run `pip install exa-py` or rebuild the Docker image."
            ) from exc

        self._client = AsyncExa(api_key=api_key)

    @property
    def client(self):  # type: ignore[return]
        return self._client


def default() -> ExaClientAdapter | None:
    """Creates a default Exa client adapter from settings, or None if not configured."""
    from app import settings

    if not settings.EXA_API_KEY:
        logger.debug("EXA_API_KEY not configured; Exa search disabled.")
        return None

    try:
        return ExaClientAdapter(api_key=settings.EXA_API_KEY)
    except RuntimeError:
        logger.exception("Failed to initialise Exa client; Exa search disabled.")
        return None
