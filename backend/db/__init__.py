#from .OLAP.models import db
from .OLTP.models.base import db,migrate

__all__ = ["db", "migrate"]
