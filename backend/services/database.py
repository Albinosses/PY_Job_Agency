import datetime
from typing import Union
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import subprocess

database_bp = Blueprint("database", __name__, url_prefix="/database")


@database_bp.route("/increment", methods=["GET"])
def increment_db():
    subprocess.run(["python", "../../database/incremental-etl.py"])
    return jsonify("Successfully incremented"), 200
