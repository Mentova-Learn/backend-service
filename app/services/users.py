from __future__ import annotations

from typing import override

from fastapi import status

from app.services._common import ServiceError


class UsersServiceError(ServiceError):
    USER_INVALID_PASSWORD = "user_invalid_password"

    @override
    def service(self) -> str:
        return "users"

    @override
    def status_code(self) -> int:
        match self:
            case UsersServiceError.USER_INVALID_PASSWORD:
                return status.HTTP_401_UNAUTHORIZED
            case _:
                return status.HTTP_500_INTERNAL_SERVER_ERROR
