import datetime
from typing import Union
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db.OLTP.models import Vacancy, Interview, Hire, Country, Company, SkillSetVacancy, SkillLevel
from services.models import VacancyRepository


get_bp = Blueprint("get", __name__, url_prefix="/get")


@get_bp.route("/vacancies", methods=["GET"])
def get_vacancies():
    # TODO: Add filtering
    page = request.args.get("page", 1, type=int)
    vacancies = Vacancy.query.filter_by(jobTitle="Data Scientist").paginate(
        page=page, per_page=10
    )
    return jsonify({"page": page, "vacancies:": [v.json() for v in vacancies]}), 200


@get_bp.route("/interviews", methods=["GET"])
def get_interviews():
    # TODO: Add filtering
    page = request.args.get("page", 1, type=int)
    interviews = Interview.query.filter_by().paginate(page=page, per_page=10)
    return jsonify({"page": page, "interviews:": [i.json() for i in interviews]}), 200


@get_bp.route("/hires", methods=["GET"])
def get_hires():
    # TODO: Add filtering
    page = request.args.get("page", 1, type=int)
    hires = Hire.query.filter_by().paginate(page=page, per_page=10)
    return jsonify({"page": page, "hires:": [h.json() for h in hires]}), 200


@get_bp.route("/countries", methods=["GET"])
def get_countries():
    countries = Country.query.filter_by().all()
    return jsonify([c.json() for c in countries]), 200


@get_bp.route("/companies", methods=["GET"])
def get_companies():
    companies = Company.query.filter_by().all()
    return jsonify([c.json() for c in companies]), 200


@get_bp.route("/vacancy/<id>", methods=["GET"])
def get_vacancy(id):
    vacancy = Vacancy.query.get(id)
    hires = Hire.query.filter_by(vacancyId=id)
    intervies = Interview.query.filter_by(vacancyId=id)
    skillset = SkillSetVacancy.query.filter_by(vacancyId=id)
    skills = []
    for skill in skillset:
        s = {}
        s["skillName"] = SkillLevel.query.filter_by(id=skill.skillId).first().skill
        s["weight"] = skill.weight
        s["level"] = SkillLevel.query.filter_by(id=skill.skillId).first().level
        skills.append(s)
    return jsonify(
        {
            "vacancy": vacancy.json(),
            "hires:": [h.json() for h in hires],
            "intervies:": [i.json() for i in intervies],
            "skills": skills
        }
    ), 200
