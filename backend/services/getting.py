import datetime
from typing import Union
import psycopg2
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db.OLTP.models import (
    Vacancy,
    Interview,
    Hire,
    Country,
    Company,
    SkillSetVacancy,
    SkillLevel,
    Contact,
    Employee,
)
from services.models import VacancyRepository, InterviewRepository, HireRepository


get_bp = Blueprint("get", __name__, url_prefix="/get")


@get_bp.route("/vacancies", methods=["GET"])
def get_vacancies():
    # TODO: Add filtering
    page = request.args.get("page", 1, type=int)
    filter_by = {}
    search = ""
    sort_type = ""
    vacancies = []
    if request.args.get("employmentTypeFilter"):
        filter_by["employmentType"] = request.args.get("employmentTypeFilter")
    if request.args.get("statusFilter"):
        filter_by["status"] = request.args.get("statusFilter")
    if request.args.get("workSettingFilter"):
        filter_by["workSetting"] = request.args.get("workSettingFilter")
    if request.args.get("startDateFilter"):
        filter_by["publicationDate"] = request.args.get("startDateFilter")
    if request.args.get("endDateFilter"):
        filter_by["closeDate"] = request.args.get("endDateFilter")
    if request.args.get("search"):
        search = request.args.get("search")
    if request.args.get("sortType"):
        sort_type = request.args.get("sortType")
    if sort_type == "Big salary first":
        vacancies = (
            VacancyRepository.get_all(filter_by=filter_by, search=search)
            .order_by(Vacancy.salary.desc())
            .paginate(page=page, per_page=10)
        )
    elif sort_type == "Small salary first":
        vacancies = (
            VacancyRepository.get_all(filter_by=filter_by, search=search)
            .order_by(Vacancy.salary.asc())
            .paginate(page=page, per_page=10)
        )
    elif sort_type == "Old first":
        vacancies = (
            VacancyRepository.get_all(filter_by=filter_by, search=search)
            .order_by(Vacancy.publicationDate.asc())
            .paginate(page=page, per_page=10)
        )
    elif sort_type == "New first":
        vacancies = (
            VacancyRepository.get_all(filter_by=filter_by, search=search)
            .order_by(Vacancy.publicationDate.desc())
            .paginate(page=page, per_page=10)
        )
    else:
        vacancies = VacancyRepository.get_all(
            filter_by=filter_by, search=search
        ).paginate(page=page, per_page=10)
    return jsonify({"page": page, "vacancies": [v.json() for v in vacancies]}), 200


@get_bp.route("/interviews", methods=["GET"])
def get_interviews():
    # TODO: Add filtering
    page = request.args.get("page", 1, type=int)

    filter_by = {}
    search = ""
    sort_type = ""
    interviews = []
    minScore = 0
    maxScore = 10

    if request.args.get("interviewTypeFilter"):
        filter_by["interviewType"] = request.args.get("interviewTypeFilter")
    if request.args.get("minScoreFilter"):
        minScore = request.args.get("minScoreFilter")
    if request.args.get("maxScoreFilter"):
        maxScore = request.args.get("maxScoreFilter")
    if request.args.get("startDateFilter"):
        filter_by["interviewDate"] = request.args.get("startDateFilter")
    if request.args.get("search"):
        search = request.args.get("search")
    if request.args.get("sortType"):
        sort_type = request.args.get("sortType")
    if sort_type == "Old first":
        interviews = (
            InterviewRepository.get_all(filter_by=filter_by, search=search)
            .order_by(Interview.interviewDate.asc())
            .paginate(page=page, per_page=10)
        )
    elif sort_type == "New first":
        interviews = (
            InterviewRepository.get_all(filter_by=filter_by, search=search)
            .order_by(Interview.interviewDate.desc())
            .paginate(page=page, per_page=10)
        )
    else:
        interviews = InterviewRepository.get_all(
            filter_by=filter_by, search=search
        ).paginate(page=page, per_page=10)
    return jsonify({"page": page, "interviews": [i.json() for i in interviews]}), 200


@get_bp.route("/hires", methods=["GET"])
def get_hires():
    # TODO: Add filtering
    page = request.args.get("page", 1, type=int)
    filter_by = {}
    search = ""
    sort_type = ""
    hires = []

    if request.args.get("hireDateFilter"):
        filter_by["hireDate"] = request.args.get("hireDateFilter")
    if request.args.get("sortType"):
        sort_type = request.args.get("sortType")
    if sort_type == "Old first":
        hires = (
            HireRepository.get_all(filter_by=filter_by, search=search)
            .order_by(Hire.hireDate.asc())
            .paginate(page=page, per_page=10)
        )
    elif sort_type == "New first":
        hires = (
            HireRepository.get_all(filter_by=filter_by, search=search)
            .order_by(Hire.hireDate.desc())
            .paginate(page=page, per_page=10)
        )
    else:
        hires = HireRepository.get_all(filter_by=filter_by, search=search).paginate(
            page=page, per_page=10
        )
    return jsonify({"page": page, "hires": [h.json() for h in hires]}), 200


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
            "hires": [h.json() for h in hires],
            "interviews": [i.json() for i in intervies],
            "skills": skills,
        }
    ), 200


@get_bp.route("/contact", methods=["GET"])
def get_contact():
    id = request.args.get("id", type=int)
    contact = Contact.query.get(id)
    return jsonify(contact.json()), 200


@get_bp.route("/interview/<id>", methods=["GET"])
def get_interview(id):
    interview = Interview.query.get(id)
    vacancy = Vacancy.query.filter_by(id=interview.vacancyId).first()
    skillset = SkillSetVacancy.query.filter_by(vacancyId=id)
    skills = []
    for skill in skillset:
        s = {}
        s["skillName"] = SkillLevel.query.filter_by(id=skill.skillId).first().skill
        s["weight"] = skill.weight
        s["level"] = SkillLevel.query.filter_by(id=skill.skillId).first().level
        skills.append(s)
    return jsonify(
        {"interview": interview.json(), "vacancy": vacancy.json(), "skills": skills}
    ), 200


@get_bp.route("/hire/<id>", methods=["GET"])
def get_hire(id):
    hire = Hire.query.get(id)
    contactId = Employee.query.filter_by(id=hire.employeeId).first().contactId
    vacancy = Vacancy.query.filter_by(id=hire.vacancyId).first()
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
            "hire": hire.json(),
            "vacancy": vacancy.json(),
            "employeeContactId": contactId,
            "skills": skills,
        }
    ), 200


@get_bp.route("/graph", methods=["GET"])
def get_graph():
    def execute_query(sql):
        conn = psycopg2.connect(
            dbname="OLAP",
            user="postgres",
            password="1234",
            host="127.0.0.1",
            port="5432",
        )
        cur = conn.cursor()
        cur.execute(sql)
        result = cur.fetchall()
        cur.close()
        conn.close()
        return result

    # SQL queries to retrieve data
    sql_query_vacancies = """
    SELECT EXTRACT(YEAR FROM d.date) AS year, COUNT(*) AS numberOfVacancies
    FROM "factVacancy" f
    JOIN "dimTime" d ON f."timePublishedId" = d.id
    GROUP BY EXTRACT(YEAR FROM d.date);;
    """

    sql_query_monthly_vacancies = """
    SELECT
    EXTRACT(YEAR FROM d.date) AS year,
    EXTRACT(MONTH FROM d.date) AS month,
    COUNT(*) AS numberOfHires
    FROM "factVacancy" f
    JOIN "dimTime" d ON f."timePublishedId" = d.id
    GROUP BY EXTRACT(YEAR FROM d.date), EXTRACT(MONTH FROM d.date);
    """

    # Execute the queries
    results_vacancies = execute_query(sql_query_vacancies)
    results_monthly_vacancies = execute_query(sql_query_monthly_vacancies)

    # Process results to create the desired object
    data = []
    year_results = []
    year_month_results = []
    for year_vacancies, (year, number_of_vacancies) in zip(
        results_monthly_vacancies, results_vacancies
    ):
        year_data = {
            "year": int(year),
            "numberOfVacancies": int(number_of_vacancies),
            "monthlyVacancies": [],
        }
        year_results.append(year_data)
    for i in range(len(results_monthly_vacancies)):
        year = results_monthly_vacancies[i][0]
        print(year)
        for j in range(len(year_results)):
            if year_results[j]["year"] == year:
                year_results[j]["monthlyVacancies"].append(
                    {
                        "month": int(results_monthly_vacancies[i][1]),
                        "numberOfVacancies": int(results_monthly_vacancies[i][2]),
                    }
                )
    # Print the formatted results
    print(year_results)
    return jsonify(year_results), 200
