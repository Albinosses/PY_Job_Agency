import datetime
from typing import Union
import psycopg2
import os
from flask import Flask, send_file
import pandas as pd
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
            password="2204",
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

@get_bp.route("/graph_countries", methods=["GET"])
def get_graph_countries():
    def execute_query(sql):
        conn = psycopg2.connect(
            dbname="OLAP",
            user="postgres",
            password="2204",
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
    SELECT
    dc.name AS Country,
    COUNT(*) AS numberOfHires
    FROM "factHire" f
    JOIN "dimCompany" c ON f."companyId" = c.id
    JOIN "dimCountry" dc ON c."countryId" = dc.id
    GROUP BY dc.name;
    """

    # Execute the queries
    results_vacancies = execute_query(sql_query_vacancies)
    # Process results to create the desired object
    data = []
    for result in results_vacancies:
        r = {}
        r["Country"] = result[0]
        r["numberOfHires"] = result[1]
        data.append(r)
    print(data)
    return jsonify(data), 200

@get_bp.route("/export_vacancies", methods=["GET"])
def export_vacancies():
    def execute_query(sql):
        conn = psycopg2.connect(
            dbname="OLAP",
            user="postgres",
            password="2204",
            host="127.0.0.1",
            port="5432",
        )
        cur = conn.cursor()
        cur.execute(sql)
        result = cur.fetchall()
        cur.close()
        conn.close()
        return result
    rows = request.args.get("rows")
    # SQL queries to retrieve data
    sql_query_vacancies = f"""
    SELECT
    dc.size AS company_size,
    dc3.name AS company_country,
    dc2.name AS position_country_name,
    CASE
        WHEN dar."employmentType" = 'F' THEN 'Full-time'
        WHEN dar."employmentType" = 'C' THEN 'Contract'
        WHEN dar."employmentType" = 'P' THEN 'Part-time'
    END AS position_employmentType,
    CASE
        WHEN dar."workSetting" = 'P' THEN 'Office'
        WHEN dar."workSetting" = 'H' THEN 'Hybrid'
        WHEN dar."workSetting" = 'R' THEN 'Remote'
    END AS position_workSetting,
    dp."jobTitle" AS position_name,
    dt_published."date" AS vacancy_published_date,
    dt_closed."date" AS vacancy_closed_date,
    fv.salary AS vacancy_salary,
    fv."daysSinceOpening" AS days_since_opening,
    fv."interviewN" AS interview_count,
    CASE
        WHEN ds.status = 'O' THEN 'Opened'
        WHEN ds.status = 'C' THEN 'Closed'
        WHEN ds.status = 'P' THEN 'Postponed'
    END AS position_workSetting
    FROM
    public."factVacancy" AS fv
    JOIN
    public."dimCompany" AS dc ON fv."companyId" = dc.id
    JOIN
    public."dimCountry" AS dc3 ON dc."countryId" = dc3.id
    JOIN
    public."dimPosition" AS dp ON fv."positionId" = dp.id
    JOIN
    public."dimCountry" AS dc2 ON dp."countryId" = dc2.id
    JOIN
    public."dimAdditionalRequirements" AS dar ON dp."additionalRId" = dar.id
    JOIN
    public."dimTime" AS dt_published ON fv."timePublishedId" = dt_published.id
    LEFT JOIN
    public."dimTime" AS dt_closed ON fv."timeClosedId" = dt_closed.id
    JOIN
    public."dimStatus" AS ds ON fv."statusId" = ds.id
    LIMIT {rows};
    """

    # Execute the queries
    results_vacancies = execute_query(sql_query_vacancies)
    # Process results to create the desired object
    data = []
    for result in results_vacancies:
        r = {}
        r["company_size"] = result[0]
        r["company_country"] = result[1]
        r["position_country"] = result[2]
        r["position_employmentType"] = result[3]
        r["position_workSetting"] = result[4]
        r["position_name"] = result[5]
        r["vacancy_published_date"] = result[6]
        r["vacancy_closed_date"] = result[7]
        r["vacancy_salary"] = result[8]
        r["days_since_opening"] = result[9]
        r["interview_count"] = result[10]
        r["position_status"] = result[11]
        data.append(r)
    df = pd.DataFrame(data)
    csv_filename = os.path.join(os.getcwd(), 'vacancy.csv')
    df.to_csv(csv_filename, index=False)
    # Send the CSV file as a response
    return send_file(csv_filename, as_attachment=True)


@get_bp.route("/export_hires", methods=["GET"])
def export_hires():
    def execute_query(sql):
        conn = psycopg2.connect(
            dbname="OLAP",
            user="postgres",
            password="2204",
            host="127.0.0.1",
            port="5432",
        )
        cur = conn.cursor()
        cur.execute(sql)
        result = cur.fetchall()
        cur.close()
        conn.close()
        return result
    rows = request.args.get("rows")
    # SQL queries to retrieve data
    sql_query_hires = f"""
SELECT
    dc.size AS company_size,
    dc3.name AS company_country,
    dc2.name AS position_country_name,
    CASE
        WHEN dar."employmentType" = 'F' THEN 'Full-time'
        WHEN dar."employmentType" = 'C' THEN 'Contract'
        WHEN dar."employmentType" = 'P' THEN 'Part-time'
    END AS employmentType,
    CASE
        WHEN dar."workSetting" = 'P' THEN 'Office'
        WHEN dar."workSetting" = 'H' THEN 'Hybrid'
        WHEN dar."workSetting" = 'R' THEN 'Remote'
    END AS workSetting,
    dp."jobTitle",
    CASE
        WHEN de.gender = 'M' THEN 'Male'
        WHEN de.gender = 'F' THEN 'Female'
    END AS employee_gender,
    CASE
        WHEN da.id = 1 THEN '18-27'
        WHEN da.id = 2 THEN '28-37'
        WHEN da.id = 3 THEN '38-47'
        WHEN da.id = 4 THEN '48-57'
        WHEN da.id = 5 THEN '58-67'
    END AS employee_age_gap,
    dc4.name AS employee_country,
    dt."date" AS hire_date,
    fh.salary,
    fh.comission,
    fh.days,
    fh."interviewN"
    FROM
    public."factHire" AS fh
    JOIN
    public."dimCompany" AS dc ON fh."companyId" = dc.id
    JOIN
    public."dimCountry" AS dc3 ON dc."countryId" = dc3.id
    JOIN
    public."dimPosition" AS dp ON fh."positionId" = dp.id
    JOIN
    public."dimCountry" AS dc2 ON dp."countryId" = dc2.id
    JOIN
    public."dimAdditionalRequirements" AS dar ON dp."additionalRId" = dar.id
    JOIN
    public."dimEmployee" AS de ON fh."employeeId" = de.id
    JOIN
    public."dimAge" AS da ON de."ageId" = da.id
    JOIN
    public."dimTime" AS dt ON fh."timeId" = dt.id
    JOIN
    public."dimCountry" AS dc4 ON de."countryId" = dc4.id
    LIMIT {rows};
    """

    # Execute the queries
    results_hires = execute_query(sql_query_hires)
    # Process results to create the desired object
    data = []
    for result in results_hires:
        r = {}
        r["company_size"] = result[0]
        r["company_country"] = result[1]
        r["position_country"] = result[2]
        r["position_employmentType"] = result[3]
        r["position_workSetting"] = result[4]
        r["position_name"] = result[5]
        r["employee_gender"] = result[6]
        r["employee_age_gap"] = result[7]
        r["employee_country"] = result[8]
        r["hire_date"] = result[9]
        r["salary"] = result[10]
        r["comission"] = result[11]
        r["days"] = result[12]
        r["interviewN"] = result[13]
        data.append(r)
    df = pd.DataFrame(data)
    csv_filename = os.path.join(os.getcwd(), 'hire.csv')

    df.to_csv(csv_filename, index=False)

    # Send the CSV file as a response
    return send_file(csv_filename, as_attachment=True)



@get_bp.route("/export_interviews", methods=["GET"])
def export_interviews():
    def execute_query(sql):
        conn = psycopg2.connect(
            dbname="OLAP",
            user="postgres",
            password="2204",
            host="127.0.0.1",
            port="5432",
        )
        cur = conn.cursor()
        cur.execute(sql)
        result = cur.fetchall()
        cur.close()
        conn.close()
        return result
    rows = request.args.get("rows")
    # SQL queries to retrieve data
    sql_query_interviews = f"""
    SELECT
    dc.size AS company_size,
    dc3.name AS company_country,
    dc2.name AS position_country_name,
    CASE
        WHEN dar."employmentType" = 'F' THEN 'Full-time'
        WHEN dar."employmentType" = 'C' THEN 'Contract'
        WHEN dar."employmentType" = 'P' THEN 'Part-time'
    END AS position_employmentType,
    CASE
        WHEN dar."workSetting" = 'P' THEN 'Office'
        WHEN dar."workSetting" = 'H' THEN 'Hybrid'
        WHEN dar."workSetting" = 'R' THEN 'Remote'
    END AS position_workSetting,
    dp."jobTitle" AS position_name,
    CASE
        WHEN de.gender = 'M' THEN 'Male'
        WHEN de.gender = 'F' THEN 'Female'
    END AS employee_gender,
    CASE
        WHEN da.id = 1 THEN '18-27'
        WHEN da.id = 2 THEN '28-37'
        WHEN da.id = 3 THEN '38-47'
        WHEN da.id = 4 THEN '48-57'
        WHEN da.id = 5 THEN '58-67'
    END AS employee_age_gap,
    dc4.name AS employee_country,
    dt."date" AS interview_date,
    fi.score AS interview_score,
    fi."time" AS interview_duration,
    di."fullName" AS interviewer_name,
    CASE
        WHEN di.gender = 'M' THEN 'Male'
        WHEN di.gender = 'F' THEN 'Female'
    END AS interviewer_gender,
    dcandidate."fullName" AS candidate_name,
    CASE
        WHEN dcandidate.gender = 'M' THEN 'Male'
        WHEN dcandidate.gender = 'F' THEN 'Female'
    END AS candidate_gender,
    dcandidate_country.name AS candidate_country
    FROM
    public."factInterview" AS fi
    JOIN
    public."dimCompany" AS dc ON fi."companyId" = dc.id
    JOIN
    public."dimCountry" AS dc3 ON dc."countryId" = dc3.id
    JOIN
    public."dimPosition" AS dp ON fi."positionId" = dp.id
    JOIN
    public."dimCountry" AS dc2 ON dp."countryId" = dc2.id
    JOIN
    public."dimAdditionalRequirements" AS dar ON dp."additionalRId" = dar.id
    JOIN
    public."dimEmployee" AS de ON fi."candidateId" = de.id
    JOIN
    public."dimAge" AS da ON de."ageId" = da.id
    JOIN
    public."dimTime" AS dt ON fi."timeId" = dt.id
    JOIN
    public."dimCountry" AS dc4 ON de."countryId" = dc4.id
    JOIN
    public."dimInterviewer" AS di ON fi."interviewerId" = di.id
    JOIN
    public."dimCandidate" AS dcandidate ON fi."candidateId" = dcandidate.id
    JOIN
    public."dimCountry" AS dcandidate_country ON dcandidate."countryId" = dcandidate_country.id
    LIMIT {rows};
    """

    # Execute the queries
    results_interviews = execute_query(sql_query_interviews)
    # Process results to create the desired object
    data = []
    for result in results_interviews:
        r = {}
        r["company_size"] = result[0]
        r["company_country"] = result[1]
        r["position_country"] = result[2]
        r["position_employmentType"] = result[3]
        r["position_workSetting"] = result[4]
        r["position_name"] = result[5]
        r["employee_gender"] = result[6]
        r["employee_age_gap"] = result[7]
        r["employee_country"] = result[8]
        r["interview_date"] = result[9]
        r["interview_score"] = result[10]
        r["interview_duration"] = result[11]
        r["interviewer_name"] = result[12]
        r["interviewer_gender"] = result[13]
        r["candidate_name"] = result[14]
        r["candidate_gender"] = result[15]
        r["candidate_country"] = result[16]

        data.append(r)
    df = pd.DataFrame(data)
    csv_filename = os.path.join(os.getcwd(), 'interview.csv')

    df.to_csv(csv_filename, index=False)

    # Send the CSV file as a response
    return send_file(csv_filename, as_attachment=True)
