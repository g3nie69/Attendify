from .models import Units, Students, Lecturers, Attendance
from flask import request
from . import db

from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


def auth_routes(app):

    # login lecturer using lecturer code
    @app.route('/auth/api/login', methods=['POST'])
    def login():
        data = request.json

        lecturer = Lecturers.query.filter_by(lecturer_code=data['lecturer_code']).first()

        if lecturer is None:
            return {'message': 'Invalid lecturer code'}, 401

        access_token = create_access_token(identity=lecturer.lecturer_code)
        return {'access_token': access_token}
