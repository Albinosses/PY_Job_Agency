from flask import Flask
from flask_cors import CORS
#from flask_jwt_extended import JWTManager

from db import db, migrate
from db.OLTP import models  # noqa
from services import api_bp
from config import Config


def create_app():
    print(Config.db.port)
    app = Flask(__name__)
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = Config.db.uri

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(api_bp)

    with app.app_context():
        db.create_all()

    print(app.url_map)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=8003)
