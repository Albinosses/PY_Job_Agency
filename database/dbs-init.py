import psycopg2
from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database
from dotenv import load_dotenv
import os

dotenv_path = os.path.join(os.getcwd(), ".env")
load_dotenv(dotenv_path)

base_db_params = {
    "host": os.getenv("base_host"),
    "database": os.getenv("base_db_name"),
    "user": os.getenv("base_user"),
    "password": os.getenv("base_password"),
}


OLTP_params = {
    "host": os.getenv("oltp_host"),
    "database": os.getenv("oltp_db_name"),
    "user": os.getenv("oltp_user"),
    "password": os.getenv("oltp_password"),
}

OLAP_params = {
    "host": os.getenv("olap_host"),
    "database": os.getenv("olap_db_name"),
    "user": os.getenv("olap_user"),
    "password": os.getenv("olap_password"),
}


def create_db_if_not_exist(params, sql_file):
    # connecting to base db in order to check if db exists
    conn = psycopg2.connect(
        dbname=base_db_params["database"],
        user=base_db_params["user"],
        password=base_db_params["password"],
        host=base_db_params["host"],
    )
    cur = conn.cursor()

    cur.execute(
        "SELECT 1 FROM pg_database WHERE datname = %s", (f'{params["database"]}',)
    )
    oltp_exists = cur.fetchone()

    conn.close()
    cur.close()

    if not oltp_exists:
        create_database(
            f'postgresql+psycopg2://{params["user"]}:{params["password"]}@{params["host"]}/{params["database"]}'
        )
        print("Created db")

        conn = psycopg2.connect(
            dbname=params["database"],
            user=params["user"],
            password=params["password"],
            host=params["host"],
        )
        cur = conn.cursor()

        with open(sql_file, "r") as f:
            cur.execute(f.read())

        conn.commit()

        print("Filled created db with schema")

    else:
        print("Db exists")


create_db_if_not_exist(OLTP_params, "./database/db-sqls/OLTP.sql")
create_db_if_not_exist(OLAP_params, "./database/db-sqls/OLAP.sql")
