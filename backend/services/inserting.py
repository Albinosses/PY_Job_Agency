import datetime
from typing import Union
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db.OLTP.models import Vacancy, Interview, Hire, Country, Company
from services.models import VacancyRepository


insert_bp = Blueprint("insert", __name__, url_prefix="/insert")


@insert_bp.route("/vacancy", methods=["POST"])
def insert_vacancy():
    # TODO: Add filtering
    request_data = request.get_json()
    new_vacancy = VacancyRepository.create(
        companyId=request_data["companyId"],
        empCountryId=request_data["empCountryId"],
        jobTitle=request_data["jobTitle"],
        salary=request_data["salary"],
        employmentType=request_data["employmentType"],
        workSetting=request_data["workSetting"],
        publicationDate=request_data["publicationDate"],
        status=request_data["status"],
        description=request_data["description"],
        closeDate=request_data["closeDate"],
    )
    return jsonify(new_vacancy.json()), 200
