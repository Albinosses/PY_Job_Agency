from db.OLTP.models import Vacancy
from db import db


class VacancyRepository:

    @staticmethod
    def get_all():
        print("getall called")
        print(db.get_engine)
        query = Vacancy.query
        return query.all()
    

