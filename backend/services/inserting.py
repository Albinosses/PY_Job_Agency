import datetime
from typing import Union
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db.OLTP.models import Vacancy, Interview, Hire, Country, Company, SkillLevel, SkillSetVacancy
from services.models import VacancyRepository, InterviewRepository, HireRepository, SkillSetVacancyRepository


insert_bp = Blueprint("insert", __name__, url_prefix="/insert")


@insert_bp.route("/vacancy", methods=["POST"])
def insert_vacancy():
    request_data = request.get_json()
    skills = request_data["skills"]
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
    for skill in skills:
        print(skill["skillName"],skill["level"])
        skillId = SkillLevel.query.filter_by(skill=skill["skillName"], level=skill["level"]).first()
        if skillId is None:
            skillId = SkillSetVacancyRepository.create_skill(skill=skill["skillName"], level=skill["level"])
        SkillSetVacancyRepository.create(vacancyId=new_vacancy.id, skillId=skillId.id, weight=skill["weight"]/100)
    return jsonify(new_vacancy.json()), 200


@insert_bp.route("/interview", methods=["POST"])
def insert_interview():
    request_data = request.get_json()
    # create or get candidate

    #create or get interviewer


    new_interview = InterviewRepository.create(
        vacancyId=request_data["vacancyId"],
        candidateId=request_data["candidateId"],
        interviewerId=request_data["interviewerId"],
        interviewType=request_data["interviewType"],
        interviewDate=request_data["interviewDate"],
        duration=request_data["duration"],
        feedback=request_data["feedback"],
        score=request_data["score"],
    )
    return jsonify(new_interview.json()), 200

@insert_bp.route("/hire", methods=["POST"])
def insert_hire():
    # TODO: ДОРОБИТИ І ЗРОБИТИ ЛОГІЧНО З ФРОНТОМ
    request_data = request.get_json()
    new_hire = HireRepository.create(
        vacancyId=request_data["vacancyId"],
        employeeId=request_data["employeeId"],
        hireDate=request_data["hireDate"]
    )
    return jsonify(new_hire.json()), 200
