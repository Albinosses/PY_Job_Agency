from flask import Flask, request
from flask_cors import CORS
import psycopg2
from sqlalchemy_utils import database_exists, create_database


from config import host, user, password, db_name

app = Flask(__name__)
app.debug = True

cors = CORS(app)


# DONT FORGET TO USE COMMITS IN CONNECTION
def db_connect():
    try:
        connection = psycopg2.connect(
            host=host, user=user, password=password, database=db_name
        )
        print("[INFO] Connection opened")

        cursor = connection.cursor()
        print("[INFO] Cursor created")

        return connection, cursor
    except Exception as _ex:
        print("[INFO] Error while working with PostgreSQL ", _ex)
        raise ValueError("[ERROR]Couldn't connect to the database, problem: ", _ex)

def db_close(connection, cursor):
    if cursor:
        cursor.close()
        print("[INFO] PostgreSQL cursor closed")
    if connection:
        connection.close()
        print("[INFO] PostgreSQL connection closed")

@app.route("/hello")
def hello():
    connection, cursor = db_connect()
    cursor.execute('SELECT * FROM "SkillLevel";')
    skills = cursor.fetchall()
    db_close(connection, cursor)
    return skills


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8001)
