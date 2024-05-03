from db.models.base import db


class Request(db.Model):
    __tablename__ = "requests"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    city_id = db.Column(db.Integer, db.ForeignKey("cities.id"), nullable=False, default=1)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    requestor_id = db.Column(db.Integer, db.ForeignKey("requestors.id"), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    responses = db.relationship("RequestResponses", backref="request", lazy=True)
    category = db.relationship("Category", lazy=True)
    city = db.relationship("City", lazy=True)
    requestor = db.relationship("Requestor", lazy=True)


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())


class RequestResponses(db.Model):
    __tablename__ = "request_responses"

    id = db.Column(db.Integer, primary_key=True)
    response = db.Column(db.Text, nullable=True)
    volunteer_id = db.Column(db.Integer, db.ForeignKey("volunteers.id"), nullable=False)
    request_id = db.Column(db.Integer, db.ForeignKey("requests.id"), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="PENDING")
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    volunteer = db.relationship("Volunteer", lazy=True)


class City(db.Model):
    __tablename__ = "cities"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())
