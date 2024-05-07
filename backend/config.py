import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(os.getcwd(), ".env")
load_dotenv(dotenv_path)


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")

    class db:
        user = os.getenv("oltp_user")
        pswd = os.getenv("oltp_password")
        host = os.getenv("oltp_host")
        port = os.getenv("base_port")
        name = os.getenv("oltp_db_name")
        uri = f"postgresql://{user}:{pswd}@{host}:{port}/{name}"
