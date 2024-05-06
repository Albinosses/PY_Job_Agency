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
    Employee,
)
from services.models import (
    VacancyRepository,
    InterviewRepository,
    HireRepository,
    SkillSetVacancyRepository,
)


edit_bp = Blueprint("edit", __name__, url_prefix="/edit")


@edit_bp.route("/vacancy", methods=["POST"])
def edit_vacancy():
    request_data = request.get_json()
    vacancy_params = [
        {p: request_data[p] for p in request_data.keys() if p != "skills"}
    ]
    updated_vacancy = VacancyRepository.update_vacancy(
        vacancy_params[0]["id"], vacancy_params[0]
    )
    updated_skills = request_data["skills"]
    new_skills = []
    for s in updated_skills:
        updated_skill = SkillLevel.query.filter_by(skill=s["skillName"], level=s["level"]).first()
        if updated_skill is None:
            updated_skill = SkillSetVacancyRepository.create_skill(skill=s["skillName"], level=s["level"])
        print(updated_skill)
        new_skills.append(
            {
                "id": updated_skill.id,
                "skill": updated_skill.skill,
                "level": updated_skill.level,
                "weight": s["weight"] / 100,
            }
        )
    old_skills = SkillSetVacancy.query.filter_by(vacancyId=vacancy_params[0]["id"]).all()
    for o in old_skills:
        SkillSetVacancyRepository.delete(o.id)
    updated_skills = []
    for n in new_skills:
        updated_skills.append(
            SkillSetVacancyRepository.create(vacancy_params[0]["id"], n["id"], n["weight"])
        )
    show_skill = []
    for s in updated_skills:
        result = {}
        skill_info = SkillLevel.query.get(s.json()["skillID"]).json()
        result["skillName"] = skill_info["skill"]
        result["level"] = skill_info["level"]
        result["weight"] = int(s.weight * 100)
        show_skill.append(result)

    return jsonify({"updated_vacancy": updated_vacancy.json(),
                    "updated_skills":show_skill}), 200


@edit_bp.route("/interview", methods=["POST"])
def edit_interview():
    request_data = request.get_json()
    interview_params = {
        "vacancyId": request_data["vacancyId"],
        "interviewType": request_data["interviewType"],
        "interviewDate": request_data["interviewDate"],
        "duration": request_data["duration"],
        "feedback": request_data["feedback"],
        "score": request_data["score"],
    }
    updated_interview = InterviewRepository.update_interview(
        request_data["id"], interview_params
    )
    interviewer_params = request_data["interviewerInfo"]
    updated_interviewer = InterviewRepository.update_interviewer_or_candidate(
        interviewer_params["id"], interviewer_params
    )
    candidate_params = request_data["candidateInfo"]
    updated_candidate = InterviewRepository.update_interviewer_or_candidate(
        candidate_params["id"], candidate_params
    )
    return jsonify(
        {
            "updated_interview": updated_interview.json(),
            "updated_candidate": updated_candidate.json(),
            "updated_interviewer": updated_interviewer.json(),
        }
    ), 200


@edit_bp.route("/hire", methods=["POST"])
def delete_hire():
    request_data = request.get_json()
    contact_params = request_data["employeeInfo"]
    new_contact = InterviewRepository.update_interviewer_or_candidate(contact_params["id"],contact_params)
    hire_updated = HireRepository.update(request_data["id"],request_data["hireDate"])
    return jsonify({"employeeInfo":new_contact.json(),
                    "updated_hire": hire_updated.json()}), 200