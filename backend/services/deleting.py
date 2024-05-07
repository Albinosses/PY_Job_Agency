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
import os
import logging
logging.basicConfig(filename='delete.log', level=logging.DEBUG)
logger = logging.getLogger(__name__)

delete_bp = Blueprint("delete", __name__, url_prefix="/delete")


@delete_bp.route("/vacancy/<id>", methods=["DELETE"])
def delete_vacancy(id):
    VacancyRepository.delete(id)
    logger.info('Vacancy deleted')

    return jsonify("Successfully deleted"), 200

@delete_bp.route("/interview/<id>", methods=["DELETE"])
def delete_interview(id):
    InterviewRepository.delete(id)
    logger.info('Interview deleted')

    return jsonify("Successfully deleted"), 200

@delete_bp.route("/hire/<id>", methods=["DELETE"])
def delete_hire(id):
    HireRepository.delete(id)
    logger.info('Hire deleted')

    return jsonify("Successfully deleted"), 200

