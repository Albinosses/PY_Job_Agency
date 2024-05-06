import psycopg2
from sqlalchemy import create_engine, text
from collections import defaultdict
from datetime import datetime
import random
from dotenv import load_dotenv
import os
import json

dotenv_path = os.path.join(os.getcwd(), ".env")
load_dotenv(dotenv_path)


# Define the database connection parameters
OLTP_params = {
    'host': os.getenv("oltp_host"),
    'database': os.getenv("oltp_db_name"),
    'user': os.getenv("oltp_user"),
    'password': os.getenv("oltp_password")
}

OLAP_params = {
    'host': os.getenv("olap_host"),
    'database': os.getenv("olap_db_name"),
    'user': os.getenv("olap_user"),
    'password': os.getenv("olap_password")
}

OLTP_engine = create_engine(f'postgresql+psycopg2://{OLTP_params["user"]}:{OLTP_params["password"]}@{OLTP_params["host"]}/{OLTP_params["database"]}')
OLAP_engine = create_engine(f'postgresql+psycopg2://{OLAP_params["user"]}:{OLAP_params["password"]}@{OLAP_params["host"]}/{OLAP_params["database"]}')


def read_json_file(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)
    
def empty_json_file(file_path):
    try:
        with open(file_path, 'w') as file:
            json.dump([], file)
        print(f"The content of {file_path} has been emptied.")
    except Exception as e:
        print(f"An error occurred while emptying {file_path}: {e}")
    
def etl_time(date):
    
    year = 1
    month_number = 1
    day_of_month = 1
    weekDay = 1

    with OLAP_engine.connect() as connection:

            if date == None:
                date = '01-01-0001'
            else:
                year = date.year
                month_number = date.month
                day_of_month = date.day
                weekDay = date.strftime('%A')
        
            result = connection.execute(
                    text("insert into \"dimTime\" (date, year, month, day, \"weekDay\") values (:date, :year, :month, :day, :weekDay) returning id"),
                    {"date": date, "year": year, "month": month_number, "day": day_of_month, "weekDay": weekDay}
                )
            inserted_pk = result.fetchone()[0]

            connection.commit()

    return inserted_pk 

def calculate_age_group(date_of_birth):
    age = datetime.now().year - date_of_birth.year
    
    if 18 <= age <= 27:
        return 1
    elif 28 <= age <= 37:
        return 2
    elif 38 <= age <= 47:
        return 3
    elif 48 <= age <= 57:
        return 4
    elif 58 <= age <= 68:
        return 5
    else:
        return None 
    
def calculate_comission(days, interviewN, salary):
    if (days > 0):
        return (1 / days) * interviewN * salary * 0.05
    else:
        return  interviewN * salary * 0.05
    
def normalize_skill_weights(data):
  skill_weights = {}
  for vacancy_id, skill_id, weight in data:
    if vacancy_id not in skill_weights:
      skill_weights[vacancy_id] = {}
    skill_weights[vacancy_id][skill_id] = weight

  for vacancy_id, skills in skill_weights.items():
    total_weight = sum(skills.values())
    if total_weight != 1:
      adjustment = (1 - total_weight) / len(skills)
      for skill_id, weight in skills.items():
        skills[skill_id] += adjustment

  return skill_weights
    
    
#Incremental ETL for Interviews

edited_interviews = read_json_file('./database/incremental-etl-data/interview.json')
    
def incremental_etl_interviewer(interview_data):
    with OLTP_engine.connect() as oltp_connection, OLAP_engine.connect() as olap_connection:
        for interview in interview_data:
            interviewer_id = interview.get("interviewerId")
            if interviewer_id:
                
                    contact_data = oltp_connection.execute(
                        text("SELECT * FROM \"Contact\" WHERE id = :contact_id"),
                        {"contact_id": interviewer_id}
                    ).fetchone()

                    if contact_data:
                        olap_connection.execute(
                            text("INSERT INTO \"dimInterviewer\" (id, \"fullName\", gender) VALUES (:id, :fullName, :gender) ON CONFLICT (id) DO UPDATE SET \"fullName\" = EXCLUDED.\"fullName\", gender = EXCLUDED.gender"),
                            {"id": contact_data[0], "fullName": f"{contact_data[2]} {contact_data[3]}", "gender": contact_data[5]}
                        )
                        olap_connection.commit()
                        

def incremental_etl_condidate(interview_data):
    with OLTP_engine.connect() as oltp_connection, OLAP_engine.connect() as olap_connection:
        for interview in interview_data:
            candidate_id = interview.get("candidateId")
            if candidate_id:
                
                    contact_data = oltp_connection.execute(
                        text("SELECT * FROM \"Contact\" WHERE id = :contact_id"),
                        {"contact_id": candidate_id}
                    ).fetchone()

                    if contact_data:
                        olap_connection.execute(
                            text("insert into \"dimCandidate\" (id, \"countryId\", \"fullName\", gender) values (:id, :countryId, :fullName, :gender) on conflict (id) do update set \"countryId\" = excluded.\"countryId\", \"fullName\" = excluded.\"fullName\", gender = excluded.gender"),
                            {"id": contact_data[0], "countryId": contact_data[1], "fullName": contact_data[2] + " " + contact_data[3], "gender": contact_data[5]}
                        )
                        olap_connection.commit()
                        
def incremental_etl_interview(interview_data):
    with OLTP_engine.connect() as oltp_connection, OLAP_engine.connect() as olap_connection:
        for interview in interview_data:
            interview_id = interview.get("interviewId")
            retrieved_interview = oltp_connection.execute(
                text("""
                    SELECT i.*, v."companyId", c."birthDate" 
                    FROM "Interview" AS i 
                    JOIN "Vacancy" AS v ON i."vacancyId" = v.id
                    JOIN "Contact" AS c ON i."candidateId" = c.id
                    WHERE i.id = :interview_id
                """), {"interview_id": interview_id}
            ).fetchone()

            if retrieved_interview:
                olap_connection.execute(
                    text("""
                        INSERT INTO "factInterview" (id, "positionId", "candidateId", "interviewerId", "companyId", "timeId", "ageId", score, time)
                        VALUES (:id, :positionId, :candidateId, :interviewerId, :companyId, :timeId, :ageId, :score, :time)
                        ON CONFLICT (id) DO UPDATE 
                        SET 
                        "positionId" = EXCLUDED."positionId", 
                        "candidateId" = EXCLUDED."candidateId", 
                        "interviewerId" = EXCLUDED."interviewerId", 
                        "companyId" = EXCLUDED."companyId", 
                        "timeId" = EXCLUDED."timeId", 
                        "ageId" = EXCLUDED."ageId",
                        score = EXCLUDED.score,
                        time = EXCLUDED.time
                    """), {
                        "id": retrieved_interview[0],
                        "positionId": retrieved_interview[1],
                        "candidateId": retrieved_interview[2],
                        "interviewerId": retrieved_interview[3],
                        "companyId": retrieved_interview[9],
                        "timeId": etl_time(retrieved_interview[5]),  # Assuming etl_time is updated
                        "ageId": calculate_age_group(retrieved_interview[10]),  # Assuming calculate_age_group is updated
                        "score": retrieved_interview[8],  # Assuming score is fetched from OLTP
                        "time": random.randint(15, 60)  # Random time as before
                    }
                )
                olap_connection.commit()

incremental_etl_interviewer(edited_interviews)
incremental_etl_condidate(edited_interviews)
incremental_etl_interview(edited_interviews)
empty_json_file('./database/incremental-etl-data/interview.json')
    
    
    
#Incremental ETL for hires
edited_hires = read_json_file('./database/incremental-etl-data/hire.json')


def incremental_etl_employee(hire_data):
    with OLTP_engine.connect() as oltp_connection, OLAP_engine.connect() as olap_connection:
        for hire in hire_data:
            employee_id = hire.get("employeeId")
            if employee_id:
                
                employee_data = oltp_connection.execute(
                    text("SELECT \"Employee\".id, \"Contact\".\"countryId\", \"Contact\".\"birthDate\", \"Contact\".gender FROM \"Employee\" INNER JOIN \"Contact\" ON \"Employee\".\"contactId\" = \"Contact\".id WHERE \"Employee\".id = :employee_id"),
                    {"employee_id": employee_id}
                ).fetchone()

                if employee_data:
                    age_id = calculate_age_group(employee_data[2])

                    olap_connection.execute(
                        text("INSERT INTO \"dimEmployee\" (id, \"countryId\", \"ageId\", gender) VALUES (:id, :countryId, :ageId, :gender) ON CONFLICT (id) DO UPDATE SET \"countryId\" = EXCLUDED.\"countryId\", \"ageId\" = EXCLUDED.\"ageId\", gender = EXCLUDED.gender"),
                        {"id": employee_data[0], "countryId": employee_data[1], "ageId": age_id, "gender": employee_data[3]}
                    )
                    olap_connection.commit()
                    
                    
def incremental_etl_hire(hire_data):
    with OLTP_engine.connect() as oltp_connection, OLAP_engine.connect() as olap_connection:
        for hire in hire_data:
            hire_id = hire.get("hireId")
            if hire_id:
                hire_data = oltp_connection.execute(
                    text("SELECT i.*, v.\"companyId\", v.salary, v.\"publicationDate\", (SELECT COUNT(*) FROM \"Interview\" WHERE \"vacancyId\" = v.id) AS interview_count FROM \"Hire\" AS i JOIN \"Vacancy\" AS v ON i.\"vacancyId\" = v.id WHERE i.id = :hire_id"),
                    {"hire_id": hire_id}
                ).fetchone()

                if hire_data:
                    date_published = datetime.combine(hire_data[6], datetime.min.time())
                    date_closed = datetime.combine(hire_data[3], datetime.min.time())
                    days = (date_closed - date_published).days

                    olap_connection.execute(
                        text("""
                            INSERT INTO "factHire" (id, "companyId", "timeId", "positionId", "employeeId", "salary", "comission", days, "interviewN")
                            VALUES (:id, :companyId, :timeId, :positionId, :employeeId, :salary, :comission, :days, :interviewN)
                            ON CONFLICT (id) DO UPDATE SET
                            "companyId" = EXCLUDED."companyId",
                            "timeId" = EXCLUDED."timeId",
                            "positionId" = EXCLUDED."positionId",
                            "employeeId" = EXCLUDED."employeeId",
                            "salary" = EXCLUDED."salary",
                            "comission" = EXCLUDED."comission",
                            days = EXCLUDED.days,
                            "interviewN" = EXCLUDED."interviewN"
                        """),
                        {
                            "id": hire_data[0],
                            "companyId": hire_data[4],
                            "timeId": etl_time(hire_data[3]),
                            "positionId": hire_data[1],
                            "employeeId": hire_data[2],
                            "salary": hire_data[5],
                            "comission": calculate_comission(days, hire_data[7], hire_data[5]),
                            "days": days,
                            "interviewN": hire_data[7]
                        }
                    )
                    olap_connection.commit()
                    
                    
incremental_etl_employee(edited_hires)
incremental_etl_hire(edited_hires)
empty_json_file('./database/incremental-etl-data/hire.json')


#Incremental ETL for vacancies
edited_vacancies = read_json_file('./database/incremental-etl-data/vacancy.json')

def incremental_etl_skills_required(vacancy_data):
    with OLTP_engine.connect() as oltp_connection, OLAP_engine.connect() as olap_connection:
        for vacancy in vacancy_data:
            skill_ids = vacancy.get("skillIds")
            for skill_id in skill_ids:
                if skill_id:
                        skill_data = oltp_connection.execute(
                            text("SELECT * FROM \"SkillLevel\" WHERE id = :skill_id"),
                            {"skill_id": skill_id}
                        ).fetchone()

                        if skill_data:
                            olap_connection.execute(
                                text("INSERT INTO \"dimSkillsRequired\" (id, skill, level) VALUES (:id, :skill, :level) ON CONFLICT (id) DO UPDATE SET skill = EXCLUDED.skill, level = EXCLUDED.level"),
                                {"id": skill_data[0], "skill": skill_data[1], "level": skill_data[2]}
                            )
                            olap_connection.commit()
                    

def incremental_etl_position(vacancy_data):
    with OLTP_engine.connect() as oltp_connection, OLAP_engine.connect() as olap_connection:
        for vacancy in vacancy_data:
            vacancy_id = vacancy.get("vacancyId")
            if vacancy_id:
                    position_data = oltp_connection.execute(
                        text("SELECT id, \"empCountryId\", \"jobTitle\", \"workSetting\", \"employmentType\" FROM \"Vacancy\" WHERE id = :position_id"),
                        {"position_id": vacancy_id}
                    ).fetchone()

                    if position_data:
                        corresponding_additionalRId = olap_connection.execute(
                            text("SELECT id FROM \"dimAdditionalRequirements\" WHERE \"workSetting\" = :workSetting AND \"employmentType\" = :employmentType"),
                            {"workSetting": position_data[3], "employmentType": position_data[4]}
                        ).fetchone()

                        if corresponding_additionalRId:
                            olap_connection.execute(
                                text("INSERT INTO \"dimPosition\" (id, \"countryId\", \"additionalRId\", \"jobTitle\") VALUES (:id, :countryId, :additionalRId, :jobTitle) ON CONFLICT (id) DO UPDATE SET \"countryId\" = EXCLUDED.\"countryId\", \"additionalRId\" = EXCLUDED.\"additionalRId\", \"jobTitle\" = EXCLUDED.\"jobTitle\""),
                                {"id": position_data[0], "countryId": position_data[1], "additionalRId": corresponding_additionalRId[0], "jobTitle": position_data[2]}
                            )
                            olap_connection.commit()
                            
                            
def incremental_etl_skillSet(vacancy_data):
    with OLTP_engine.connect() as oltp_connection, OLAP_engine.connect() as olap_connection:
        for vacancy in vacancy_data:
            vacancy_id = vacancy.get("vacancyId")
            skill_ids = vacancy.get("skillIds")

            if vacancy_id and skill_ids:
                retrieved_skillSet = oltp_connection.execute(
                    text("SELECT \"vacancyId\", \"skillId\", \"weight\" FROM \"SkillSetVacancy\" WHERE \"vacancyId\" = :vacancyId AND \"skillId\" IN :skillIds"),
                    {"vacancyId": vacancy_id, "skillIds": tuple(skill_ids)}
                ).fetchall()

                normalized_weights = normalize_skill_weights(retrieved_skillSet)

                for row in normalized_weights:
                        for i in normalized_weights[row]:
                            olap_connection.execute(
                                    text("insert into \"dimSkillSet\" (\"positionId\", \"skillId\", weight) values (:positionId, :skillId, :weight) on conflict (\"positionId\", \"skillId\") do update set weight = excluded.weight"),
                                    {"positionId": row, "skillId": i, "weight": normalized_weights[row][i]}
                                )
                            olap_connection.commit()  
                
                olap_connection.commit()
                
                
def incremental_etl_vacancy(vacancy_data):
    with OLTP_engine.connect() as oltp_connection, OLAP_engine.connect() as olap_connection:
        for vacancy in vacancy_data:
            vacancy_id = vacancy.get("vacancyId")
            retrieved_vacancy = oltp_connection.execute(
                text("""
                    SELECT vacancy.id, vacancy."companyId", vacancy."publicationDate", vacancy."closeDate", vacancy.salary, vacancy.status, COUNT(interview.id) AS interview_count 
                    FROM "Vacancy" vacancy
                    LEFT JOIN "Interview" interview ON vacancy.id = interview."vacancyId"
                    WHERE vacancy.id = :vacancyId
                    GROUP BY vacancy.id, vacancy."companyId", vacancy."publicationDate", vacancy."closeDate", vacancy.salary
                """), {"vacancyId": vacancy_id}
            ).fetchone()

            if retrieved_vacancy:
                date_published = datetime.combine(retrieved_vacancy[2], datetime.min.time())
                days_since_opening = (datetime.today() - date_published).days

                status_id = olap_connection.execute(
                    text("SELECT id FROM \"dimStatus\" WHERE status = :status"),
                    {"status": retrieved_vacancy[5]}
                ).fetchone()

                olap_connection.execute(
                    text("""
                         INSERT INTO "factVacancy" ("companyId", "positionId", "timePublishedId", "timeClosedId", salary, "daysSinceOpening", "interviewN", "statusId", id)
                         VALUES (:companyId, :positionId, :timePublishedId, :timeClosedId, :salary, :daysSinceOpening, :interviewN, :statusId, :id) 
                         ON CONFLICT (id) DO UPDATE 
                         SET 
                         "companyId" = EXCLUDED."companyId", 
                         "positionId" = EXCLUDED."positionId", 
                         "timePublishedId" = EXCLUDED."timePublishedId", 
                         "timeClosedId" = EXCLUDED."timeClosedId",
                         salary = EXCLUDED.salary, 
                         "daysSinceOpening" = EXCLUDED."daysSinceOpening", 
                         "interviewN" = EXCLUDED."interviewN", 
                         "statusId" = EXCLUDED."statusId"
                         """),
                    {
                        "companyId": retrieved_vacancy[1],
                        "positionId": retrieved_vacancy[0],
                        "timePublishedId": etl_time(retrieved_vacancy[2]),
                        "timeClosedId": etl_time(retrieved_vacancy[3]),
                        "salary": retrieved_vacancy[4],
                        "daysSinceOpening": days_since_opening,
                        "interviewN": retrieved_vacancy[6],
                        "statusId": status_id[0],
                        "id": retrieved_vacancy[0]
                    }
                )
                olap_connection.commit()
                
                
incremental_etl_skills_required(edited_vacancies)
incremental_etl_position(edited_vacancies)
incremental_etl_skillSet(edited_vacancies)
incremental_etl_vacancy(edited_vacancies)
empty_json_file('./database/incremental-etl-data/vacancy.json')