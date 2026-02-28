from __future__ import annotations

from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel


# Actual course data itself.
class CourseModel(BaseModel):
    id: int
    name: str
    preview_url: str | None
    created_at: datetime


class CourseAssignRelationship(StrEnum):
    OWNER = "owner"  # Main manager, not necessarily has to take it.
    PERSONAL = "personal"  # Creator of their own course for just themselves.
    ASSIGNEE = "assignee"  # Assigned by the owner to take it.


class CourseAssignModel(BaseModel):
    id: int
    course_id: int
    user_id: int
    relationship: CourseAssignRelationship
    created_at: datetime
