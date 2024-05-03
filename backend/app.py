from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from db import db, migrate
from db import models  # noqa
from services import api_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)

    # app.config["CORS_HEADERS"] = "Content-Type"

    app.register_blueprint(api_bp)

    with app.app_context():
        db.create_all()

    print(app.url_map)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=8003)
