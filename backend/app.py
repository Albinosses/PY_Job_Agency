from flask import Flask
from flask_cors import CORS
import psycopg2
from flask import request

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
        cursor = connection.cursor()
        return connection, cursor
    except Exception as _ex:
        print("[INFO] Error while working with PostgreSQL ", _ex)
        raise ValueError("[ERROR]Couldn't connect to the database, problem: ", _ex)


@app.route("/hello")
def hello():
    print("hello")
    return "hello"


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8001)
