import datetime
from typing import Union
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

from db.OLTP.models import Vacancy
from services.models import VacancyRepository


auth_bp = Blueprint("auth", __name__, url_prefix="/get")


@auth_bp.route("/vacancies", methods=["GET"])
def get_vacancies():
    page = request.args.get("page", 1, type=int)
    vacancies = Vacancy.query.filter_by(jobTitle="Data Scientist").paginate(page=page, per_page=10)
    return jsonify({"page": page, "vacancies:": [v.json() for v in vacancies]})

