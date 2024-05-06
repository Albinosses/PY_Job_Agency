# Library
import psycopg2
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

dotenv_path = os.path.join(os.getcwd(), ".env")
load_dotenv(dotenv_path)

# Define the database connection parameters
db_params = {
    'host': os.getenv("oltp_host"),
    'database': os.getenv("oltp_db_name"),
    'user': os.getenv("oltp_user"),
    'password': os.getenv("oltp_password")
}

engine = create_engine(f'postgresql+psycopg2://{db_params["user"]}:{db_params["password"]}@{db_params["host"]}/{db_params["database"]}')
con = engine.connect()

csv_files = {
    'Country': './database/data/countries.csv',
    'Contact': './database/data/contacts.csv',
    'Company': './database/data/companies.csv',
    'SkillLevel': './database/data/skills.csv',
    'Employee': './database/data/employee_without_resume.csv',
    'Vacancy': './database/data/vacancies.csv',
    'Interview': './database/data/interviews.csv',
    'Hire': './database/data/hire.csv',
    'SkillSetEmployee': './database/data/skill_set_employee.csv',
    'SkillSetVacancy': './database/data/skill_set_vacancy.csv',
}

for table_name, file_path in csv_files.items():
    df = pd.read_csv(file_path)

    if 'id' not in df.columns:
        df['id'] = range(1, len(df) + 1)

    df.to_sql(table_name, engine, if_exists='append', index=False)