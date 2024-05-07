from services.getting import get_bp
from services.inserting import insert_bp
from services.controllers import api_bp
from services.deleting import delete_bp
from services.editing import edit_bp
from services.database import database_bp


api_bp.register_blueprint(get_bp)
api_bp.register_blueprint(insert_bp)
api_bp.register_blueprint(delete_bp)
api_bp.register_blueprint(edit_bp)
api_bp.register_blueprint(database_bp)
