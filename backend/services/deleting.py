import datetime
from typing import Union
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db.OLTP.models import (
    Vacancy,
    Interview,
    Hire,
    Country,
    Company,
    SkillLevel,
    SkillSetVacancy,
    Contact,
    Employee
)
from services.models import (
    VacancyRepository,
    InterviewRepository,
    HireRepository,
    SkillSetVacancyRepository,
)


delete_bp = Blueprint("delete", __name__, url_prefix="/delete")


@delete_bp.route("/vacancy/<id>", methods=["DELETE"])
def delete_vacancy(id):
    VacancyRepository.delete(id)
    return jsonify("Successfully deleted"), 200

@delete_bp.route("/interview/<id>", methods=["DELETE"])
def delete_interview(id):
    InterviewRepository.delete(id)
    return jsonify("Successfully deleted"), 200

@delete_bp.route("/hire/<id>", methods=["DELETE"])
def delete_hire(id):
    HireRepository.delete(id)
    return jsonify("Successfully deleted"), 200

