from dotenv import load_dotenv
import os

dotenv_path = os.path.join(os.getcwd(), ".env")
load_dotenv(dotenv_path)

print(os.getenv("db_name"))