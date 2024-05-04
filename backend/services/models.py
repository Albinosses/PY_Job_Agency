from typing import TypedDict
from db.OLTP.repositories import VacancyRepository, InterviewRepository, HireRepository
from enum import Enum


class UserRole(Enum):
    VOLUNTEER = "volunteer"
    REQUESTOR = "requestor"


class UserIdentity(TypedDict):
    user_id: str
    role: UserRole
