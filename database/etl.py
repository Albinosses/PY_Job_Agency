#!/usr/bin/env python
# coding: utf-8

# In[22]:


# Library
import psycopg2
import pandas as pd
from sqlalchemy import create_engine, text
from collections import defaultdict
from datetime import datetime
import random


# Define the database connection parameters
OLTP_params = {
    'host': 'localhost',
    'database': 'OLTP',
    'user': 'postgres',
    'password': '1234'
}

OLAP_params = {
    'host': 'localhost',
    'database': 'OLAP',
    'user': 'postgres',
    'password': '1234'
}

OLTP_engine = create_engine(f'postgresql+psycopg2://{OLTP_params["user"]}:{OLTP_params["password"]}@{OLTP_params["host"]}/{OLTP_params["database"]}')
OLAP_engine = create_engine(f'postgresql+psycopg2://{OLAP_params["user"]}:{OLAP_params["password"]}@{OLAP_params["host"]}/{OLAP_params["database"]}')


# In[2]:


def etl_countries():
    retrieved_countries = []

    with OLTP_engine.connect() as connection:
        retrieved_countries = connection.execute(text("select * from \"Country\"")).fetchall()

    with OLAP_engine.connect() as connection:
        for row in retrieved_countries:
            connection.execute(
                    text("insert into \"dimCountry\" (id, name) values (:id, :name) on conflict (id) do update set name = excluded.name"),
                    {"id": row[0], "name": row[1]}
                )
            connection.commit()
        

etl_countries()


# In[3]:


def etl_interviewer():
    retrieved_interviewers = []

    with OLTP_engine.connect() as connection:
        retrieved_interviewers = connection.execute(text("select distinct \"Contact\".* from \"Interview\" inner join \"Contact\" on \"Interview\".\"interviewerId\" = \"Contact\".id;")).fetchall()

    resulted_interviewers = []
    for item in retrieved_interviewers:
        transformed_data = (
            item[0], item[2] + " " + item[3], item[5]
        )
        resulted_interviewers.append(transformed_data)


    with OLAP_engine.connect() as connection:
        for row in resulted_interviewers:
            connection.execute(
                    text("insert into \"dimInterviewer\" (id, \"fullName\", gender) values (:id, :fullName, :gender) on conflict (id) do update set \"fullName\" = excluded.\"fullName\", gender = excluded.gender"),
                    {"id": row[0], "fullName": row[1], "gender": row[2]}
                )
            connection.commit()   
            
etl_interviewer()


# In[4]:


def etl_status():
    retrieved_status = []

    with OLTP_engine.connect() as connection:
        retrieved_status = connection.execute(text("select distinct status from \"Vacancy\";")).fetchall()

    with OLAP_engine.connect() as connection:
        for i, row in enumerate(retrieved_status):
            connection.execute(
                    text("insert into \"dimStatus\" (id, status) values (:id, :status) on conflict (id) do update set status = excluded.status"),
                    {"id": i + 1, "status": row[0]}
                )
            connection.commit()   
    
    
etl_status()


# In[5]:


def etl_skills_required():
    retrieved_skills = []

    with OLTP_engine.connect() as connection:
        retrieved_skills = connection.execute(text("select * from \"SkillLevel\";")).fetchall()


    with OLAP_engine.connect() as connection:
        for row in retrieved_skills:
            connection.execute(
                    text("insert into \"dimSkillsRequired\" (id, skill, level) values (:id, :skill, :level) on conflict (id) do update set skill = excluded.skill, level = excluded.level"),
                    {"id": row[0], "skill": row[1], "level": row[2]}
                )
            connection.commit()   
    
    
etl_skills_required()


# In[6]:


def etl_additional_requirements():
    retrieved_additional_requirements = []

    with OLTP_engine.connect() as connection:
        retrieved_additional_requirements = connection.execute(text("select distinct \"workSetting\", \"employmentType\" from \"Vacancy\";")).fetchall()

    work_settings = list(dict.fromkeys([row[0] for row in retrieved_additional_requirements])) 
    employment_types = list(dict.fromkeys([row[1] for row in retrieved_additional_requirements])) 

    resulted_requirements = []
    for i in work_settings:
        for j in employment_types:
            tmp = (i, j)
            resulted_requirements.append(tmp)


    with OLAP_engine.connect() as connection:
        for i, row in enumerate(resulted_requirements):
            connection.execute(
                    text("insert into \"dimAdditionalRequirements\" (id, \"employmentType\", \"workSetting\") values (:id, :employmentType, :workSetting) on conflict (id) do update set \"employmentType\" = excluded.\"employmentType\", \"workSetting\" = excluded.\"workSetting\""),
                    {"id": i + 1, "employmentType": row[1], "workSetting": row[0]}
                )
            connection.commit()   
    
    
etl_additional_requirements()


# In[7]:


def etl_company():
    retrieved_companies = []

    with OLTP_engine.connect() as connection:
        retrieved_companies = connection.execute(text("select id, \"countryId\", size  from \"Company\";")).fetchall()


    with OLAP_engine.connect() as connection:
        for row in retrieved_companies:
            connection.execute(
                    text("insert into \"dimCompany\" (id, \"countryId\", size) values (:id, :countryId, :size) on conflict (id) do update set \"countryId\" = excluded.\"countryId\", size = excluded.size"),
                    {"id": row[0], "countryId": row[1], "size": row[2]}
                )
            connection.commit()   
    
    
etl_company()


# In[8]:


def etl_candidate():
    retrieved_candidates = []

    with OLTP_engine.connect() as connection:
        retrieved_candidates = connection.execute(text("select distinct \"Contact\".* from \"Interview\" inner join \"Contact\" on \"Interview\".\"candidateId\" = \"Contact\".id;")).fetchall()

    with OLAP_engine.connect() as connection:
        for row in retrieved_candidates:
            connection.execute(
                    text("insert into \"dimCandidate\" (id, \"countryId\", \"fullName\", gender) values (:id, :countryId, :fullName, :gender) on conflict (id) do update set \"countryId\" = excluded.\"countryId\", \"fullName\" = excluded.\"fullName\", gender = excluded.gender"),
                    {"id": row[0], "countryId": row[1], "fullName": row[2] + " " + row[3], "gender": row[5]}
                )
            connection.commit()   
    
    
etl_candidate()


# In[9]:


def etl_position():
    retrieved_positions = []


    with OLTP_engine.connect() as connection:
        retrieved_positions = connection.execute(text("select id, \"empCountryId\", \"jobTitle\", \"workSetting\", \"employmentType\" from \"Vacancy\";")).fetchall()


    with OLAP_engine.connect() as connection:
        for row in retrieved_positions:   
            corresponding_additionalRId = connection.execute(text("select id from \"dimAdditionalRequirements\" where \"workSetting\" = :workSetting and \"employmentType\" = :employmentType;"),
                                                             {"workSetting": row[3], "employmentType": row[4]}).fetchone()
            
            connection.execute(
                    text("insert into \"dimPosition\" (id, \"countryId\", \"additionalRId\", \"jobTitle\") values (:id, :countryId, :additionalRId, :jobTitle) on conflict (id) do update set \"countryId\" = excluded.\"countryId\", \"additionalRId\" = excluded.\"additionalRId\", \"jobTitle\" = excluded.\"jobTitle\""),
                    {"id": row[0], "countryId": row[1], "additionalRId": corresponding_additionalRId[0], "jobTitle": row[2]}
                )
            connection.commit()   
    
    
etl_position()


# In[10]:


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



def etl_skillSet():
    retrieved_skillSet = []

    with OLTP_engine.connect() as connection:
        retrieved_skillSet = connection.execute(text("select \"vacancyId\", \"skillId\", \"weight\" from \"SkillSetVacancy\";")).fetchall()

    normilized_weights = normalize_skill_weights(retrieved_skillSet)

    with OLAP_engine.connect() as connection:
        for row in normilized_weights:
            for i in normilized_weights[row]:
              connection.execute(
                    text("insert into \"dimSkillSet\" (\"positionId\", \"skillId\", weight) values (:positionId, :skillId, :weight) on conflict (\"positionId\", \"skillId\") do update set weight = excluded.weight"),
                    {"positionId": row, "skillId": i, "weight": normilized_weights[row][i]}
                )
              connection.commit()   
    
    
etl_skillSet()


# In[11]:


def etl_age():
    #1  18 <= age <= 27
    #2  28 <= age <= 37
    #3  38 <= age <= 47
    #4  48 <= age <= 57
    #5  58 <= age <= 68
    age_groups = [1, 2, 3, 4, 5]


    with OLAP_engine.connect() as connection:
        for i, row in enumerate(age_groups):
            connection.execute(
                    text("insert into \"dimAge\" (id, \"ageGroup\") values (:id, :ageGroup) on conflict (id) do update set \"ageGroup\" = excluded.\"ageGroup\""),
                    {"id": i + 1, "ageGroup": row}
                )
            connection.commit()   
    
    
etl_age()


# In[12]:


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


# In[13]:


def etl_employee():
    retrieved_employees = []


    with OLTP_engine.connect() as connection:
        retrieved_employees = connection.execute(text("select \"Employee\".id, \"Contact\".\"countryId\", \"Contact\".\"birthDate\", \"Contact\".gender from \"Employee\" inner join \"Contact\" on \"Employee\".\"contactId\" = \"Contact\".id;")).fetchall()


    with OLAP_engine.connect() as connection:
        for row in retrieved_employees:
            connection.execute(
                    text("insert into \"dimEmployee\" (id, \"countryId\", \"ageId\", gender) values (:id, :countryId, :ageId, :gender) on conflict (id) do update set \"countryId\" = excluded.\"countryId\", \"ageId\" = excluded.\"ageId\", gender = excluded.gender"),
                    {"id": row[0], "countryId": row[1], "ageId": calculate_age_group(row[2]), "gender": row[3]}
                )
            connection.commit()   
    
    
etl_employee()


# In[14]:


def etl_time(date):

    if(date == None):
          return

    month_number = date.month
    day_of_month = date.day
    day_of_week_name = date.strftime('%A')
    month_name = date.strftime('%B')
    year = date.year

    with OLAP_engine.connect() as connection:
            result = connection.execute(
                    text("insert into \"dimTime\" (\"monthNumber\", \"dayOfMonth\", day, month, year) values (:monthNumber, :dayOfMonth, :day, :month, :year) returning id"),
                    {"monthNumber": month_number, "dayOfMonth": day_of_month, "day": day_of_week_name, "month": month_name, "year": year}
                )
            inserted_pk = result.fetchone()[0]

            connection.commit()

    return inserted_pk 


# In[15]:


def etl_vacancy():
    retrieved_vacancies = []

    with OLTP_engine.connect() as connection:
        retrieved_vacancies = connection.execute(text("""
                                                      select vacancy.id, vacancy.\"companyId\", vacancy.\"publicationDate\", vacancy.\"closeDate\", vacancy.salary, vacancy.status, COUNT(interview.id) AS interview_count 
                                                      from \"Vacancy\" vacancy
                                                      LEFT JOIN \"Interview\" interview ON vacancy.id = interview.\"vacancyId\"
                                                      GROUP BY vacancy.id, vacancy.\"companyId\", vacancy.\"publicationDate\", vacancy.\"closeDate\", vacancy.salary
                                                      """)).fetchall()
        
    with OLAP_engine.connect() as connection:
        for row in retrieved_vacancies:

            date_published = datetime.combine(row[2], datetime.min.time())
            days_since_opening = (datetime.today() - date_published).days

            statusId = connection.execute(text("select id from \"dimStatus\" where status = :status"),
                                          {"status": row[5]}).fetchone()
            
            connection.execute(
                    text("""
                         insert into \"factVacancy\" (\"companyId\", \"positionId\", \"timePublishedId\", \"timeClosedId\", salary, \"daysSinceOpening\", \"interviewN\", \"statusId\", id)
                         values (:companyId, :positionId, :timePublishedId, :timeClosedId, :salary, :daysSinceOpening, :interviewN, :statusId, :id) 
                         on conflict (id) do update 
                         set 
                         \"companyId\" = excluded.\"companyId\", 
                         \"positionId\" = excluded.\"positionId\", 
                         \"timePublishedId\" = excluded.\"timePublishedId\", 
                         \"timeClosedId\" = excluded.\"timeClosedId\",
                         salary = excluded.salary, 
                         \"daysSinceOpening\"= excluded.\"daysSinceOpening\", 
                         \"interviewN\" = excluded.\"interviewN\", 
                         \"statusId\" = excluded.\"statusId\"
                         """),
                    {"companyId": row[1], "positionId": row[0], "timePublishedId": etl_time(row[2]), "timeClosedId": etl_time(row[3]), "salary": row[4], "daysSinceOpening": days_since_opening, "interviewN": row[6], "statusId": statusId[0], "id": row[0]}
                )
            connection.commit()   
    
    
etl_vacancy()


# In[16]:


def etl_interview():
    retrieved_vacancies = []

    with OLTP_engine.connect() as connection:
        retrieved_vacancies = connection.execute(text("""
                                                      select i.*, v.\"companyId\", c.\"birthDate\" from \"Interview\" as i 
                                                      join \"Vacancy\" as v on i.\"vacancyId\" = v.id
                                                      join \"Contact\" as c on i.\"candidateId\" = c.id
                                                      """)).fetchall()


    with OLAP_engine.connect() as connection:
        for row in retrieved_vacancies:
            connection.execute(text("""
                                    insert into \"factInterview\" (id, \"positionId\", \"candidateId\", \"interviewerId\", \"companyId\", \"timeId\", \"ageId\", score, time)
                                    values (:id, :positionId, :candidateId, :interviewerId, :companyId, :timeId, :ageId, :score, :time)
                                    on conflict (id) do update 
                                    set 
                                    \"positionId\" = excluded.\"positionId\", 
                                    \"candidateId\" = excluded.\"candidateId\", 
                                    \"interviewerId\" = excluded.\"interviewerId\", 
                                    \"companyId\" = excluded.\"companyId\", 
                                    \"timeId\" = excluded.\"timeId\", 
                                    \"ageId\" = excluded.\"ageId\",
                                    \"score\" = excluded.\"score\",
                                    time = excluded.time
                                    """),
                                    {"id": row[0], "positionId": row[1], "candidateId": row[2], "interviewerId": row[3], "companyId": row[9], "timeId": etl_time(row[5]), "ageId": calculate_age_group(row[10]), "score": row[8], "time": random.randint(15, 60)}
                                )
            connection.commit()   
    
    
etl_interview()


# In[17]:


def calculate_comission(days, interviewN, salary):
    if (days > 0):
        return (1 / days) * interviewN * salary * 0.05
    else:
        return  interviewN * salary * 0.05
    


# In[18]:


def etl_hire():
    retrieved_hires = []

    with OLTP_engine.connect() as connection:
        retrieved_hires = connection.execute(text("""
                                                    select i.*, v.\"companyId\", v.salary, v.\"publicationDate\",
                                                        (select count(*) from \"Interview\" where \"vacancyId\" = v.id) as interview_count
                                                    from \"Hire\" as i
                                                    join \"Vacancy\" as v on i.\"vacancyId\" = v.id
                                                """)).fetchall()
        

    with OLAP_engine.connect() as connection:
        for row in retrieved_hires:

            date_published = datetime.combine(row[6], datetime.min.time())
            date_closed = datetime.combine(row[3], datetime.min.time())
            days = (date_closed - date_published).days

            connection.execute(text("""
                                    insert into \"factHire\" (id, \"companyId\", \"timeId\", \"positionId\", \"employeeId\", \"salary\", \"comission\", days, \"interviewN\")
                                    values (:id, :companyId, :timeId, :positionId, :employeeId, :salary, :comission, :days, :interviewN)
                                    on conflict (id) do update 
                                    set 
                                    \"companyId\" = excluded.\"companyId\", 
                                    \"timeId\" = excluded.\"timeId\", 
                                    \"positionId\" = excluded.\"positionId\", 
                                    \"employeeId\" = excluded.\"employeeId\", 
                                    \"salary\" = excluded.\"salary\", 
                                    \"comission\" = excluded.\"comission\",
                                    \"days\" = excluded.\"days\",
                                    \"interviewN\" = excluded.\"interviewN\"
                                    """),
                                    {"id": row[0], "companyId": row[4], "timeId": etl_time(row[3]), "positionId": row[1], "employeeId": row[2], "salary": row[5], "comission": calculate_comission(days, row[7], row[5]), "days": days, "interviewN": row[7]}
                                )
            connection.commit()   
    
    
etl_hire()


# In[19]:


def delete_unused_times():
    with OLAP_engine.connect() as connection:
        connection.execute(text("""
                                delete from \"dimTime\"
                                where id not in (
                                    select \"timePublishedId\" from \"factVacancy\" where \"timePublishedId\" is not null
                                    union
                                    select \"timeClosedId\" from \"factVacancy\" where \"timeClosedId\" is not null
                                    union
                                    select \"timeId\" from \"factInterview\" where \"timeId\" is not null
                                    union
                                    select \"timeId\" from \"factHire\" where \"timeId\" is not null
                                );
                                """))
        connection.commit()

delete_unused_times()

