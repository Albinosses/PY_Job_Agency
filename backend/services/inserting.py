from datetime import datetime
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
import json
import logging
logging.basicConfig(filename='create.log', level=logging.DEBUG)
logger = logging.getLogger(__name__)


insert_bp = Blueprint("insert", __name__, url_prefix="/insert")


@insert_bp.route("/vacancy", methods=["POST"])
def insert_vacancy():
    request_data = request.get_json()
    skillSets = []
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
        print(skill["skillName"], skill["level"])
        skillId = SkillLevel.query.filter_by(
            skill=skill["skillName"], level=skill["level"]
        ).first()
        if skillId is None:
            skillId = SkillSetVacancyRepository.create_skill(
                skill=skill["skillName"], level=skill["level"]
            )
        skillSets.append(SkillSetVacancyRepository.create(
            vacancyId=new_vacancy.id, skillId=skillId.id, weight=skill["weight"] / 100
        ))
    logger.info('Vacancy created')
    file_path = os.path.join(os.getcwd(), "database", "incremental-etl-data", "vacancy.json")
    print(file_path)
    with open(file_path, "r") as file:
        data = json.load(file)

    # Add new data to the array

    new_data = {
        "vacancyId": new_vacancy.id,
        "skillIds": [s.skillId for s in skillSets],
    }
    data.append(new_data)

    # Save changes back to the file
    with open(file_path, "w") as file:
        json.dump(data, file, indent=4)
    return jsonify(new_vacancy.json()), 200


@insert_bp.route("/interview", methods=["POST"])
def insert_interview():
    request_data = request.get_json()
    candidate_info = request_data["candidateInfo"]
    countryId = candidate_info["countryId"]
    # countryId = candidate_info["countryId"]
    # print(countryId)
    # create or get candidate
    birthDate_obj = datetime.strptime(candidate_info["birthDate"], "%m/%d/%Y")

        # Now format the datetime objects into the correct format "%Y-%m-%d"
    birthDate = birthDate_obj.strftime("%Y-%m-%d")
    
    candidateId = Contact.query.filter_by(
        countryId=countryId,
        name=candidate_info["name"],
        surname=candidate_info["surname"],
        birthDate=birthDate, #here
        gender=candidate_info["gender"],
        email=candidate_info["email"],
    ).first()
    if candidateId is None:
        candidateId = InterviewRepository.create_candidate(
            countryId=countryId,
            name=candidate_info["name"],
            surname=candidate_info["surname"],
            birthDate=candidate_info["birthDate"],
            gender=candidate_info["gender"],
            email=candidate_info["email"],
        )

    # create or get interviewer
    interviewer_info = request_data["interviewerInfo"]
    countryId = interviewer_info["countryId"]
    print(interviewer_info)
    interviewerId = Contact.query.filter_by(
        countryId=countryId,
        name=interviewer_info["name"],
        surname=interviewer_info["surname"],
        birthDate=interviewer_info["birthDate"],
        gender=interviewer_info["gender"],
        email=interviewer_info["email"],
    ).first()
    if interviewerId is None:
        interviewerId = InterviewRepository.create_interviewer(
            countryId=countryId,
            name=interviewer_info["name"],
            surname=interviewer_info["surname"],
            birthDate=interviewer_info["birthDate"],
            gender=interviewer_info["gender"],
            email=interviewer_info["email"],
        )

    new_interview = InterviewRepository.create(
        vacancyId=request_data["vacancyId"],
        candidateId=candidateId.id,
        interviewerId=interviewerId.id,
        interviewType=request_data["interviewType"],
        interviewDate=request_data["interviewDate"],
        duration=request_data["duration"],
        feedback=request_data["feedback"],
        score=request_data["score"],
    )
    logger.info('Interview created')
    file_path = os.path.join(os.getcwd(), "database", "incremental-etl-data", "interview.json")
    print(file_path)
    with open(file_path, "r") as file:
        data = json.load(file)

    # Add new data to the array

    new_data = {
        "interviewerId": new_interview.interviewerId,
        "candidateId": new_interview.candidateId,
        "interviewId": new_interview.id
    }
    data.append(new_data)

    # Save changes back to the file
    with open(file_path, "w") as file:
        json.dump(data, file, indent=4)
    return jsonify(new_interview.json()), 200


@insert_bp.route("/hire", methods=["POST"])
def insert_hire():
    # TODO: ДОРОБИТИ І ЗРОБИТИ ЛОГІЧНО З ФРОНТОМ
    request_data = request.get_json()
    employee_info = request_data["employeeInfo"]
    emplyeeContactId = Contact.query.filter_by(
        countryId=employee_info["countryId"],
        name=employee_info["name"],
        surname=employee_info["surname"],
        birthDate=employee_info["birthDate"],
        gender=employee_info["gender"],
        email=employee_info["email"],
    ).first()
    if emplyeeContactId is None:
        emplyeeContactId = InterviewRepository.create_candidate(
        countryId=employee_info["countryId"],
        name=employee_info["name"],
        surname=employee_info["surname"],
        birthDate=employee_info["birthDate"],
        gender=employee_info["gender"],
        email=employee_info["email"],
    )
    employeeId = Employee.query.filter_by(contactId=emplyeeContactId.id).first()
    if employeeId is None:
        employeeId = HireRepository.create_employee(
            contactId=emplyeeContactId.id,
            resume = None,
            resumeUploadDate=employee_info["resumeUploadDate"]
        )
    
    new_hire = HireRepository.create(
        vacancyId=request_data["vacancyId"],
        employeeId=employeeId.id,
        hireDate=request_data["hireDate"],
    )
    logger.info('Hire created')
    file_path = os.path.join(os.getcwd(), "database", "incremental-etl-data", "hire.json")
    print(file_path)
    with open(file_path, "r") as file:
        data = json.load(file)

    # Add new data to the array

    new_data = {
        "hireId": new_hire.id,
        "employeeId": new_hire.employeeId
    }
    data.append(new_data)

    # Save changes back to the file
    with open(file_path, "w") as file:
        json.dump(data, file, indent=4)
    return jsonify(new_hire.json()), 200
