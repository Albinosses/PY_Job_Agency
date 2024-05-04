from db.OLTP.models import Vacancy
from db import db


class VacancyRepository:

    @staticmethod
    def get_by_id(id: str):
        return Vacancy.query.get(id)


