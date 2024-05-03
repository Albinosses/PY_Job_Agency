from services.test import auth_bp
from services.controllers import api_bp

api_bp.register_blueprint(auth_bp)
