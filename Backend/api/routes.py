from .models import Units, Students, Lecturers, Attendance
from flask import request
from . import db

from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


def register_routes(app):
    @app.route('/api/units', methods=['GET'])
    def get_units():
        units = Units.query.all()
        return {'units': [unit.to_dict() for unit in units]}

    @app.route('/api/students', methods=['GET'])
    def get_students():
        students = Students.query.all()
        return {'students': [student.to_dict() for student in students]}

    @app.route('/api/lecturers', methods=['GET'])
    def get_lecturers():
        lecturers = Lecturers.query.all()
        return {'lecturers': [lecturer.to_dict() for lecturer in lecturers]}

    @app.route('/api/units', methods=['POST'])
    def add_unit():
        data = request.json

        if isinstance(data, list):
            for unit in data:
                new_unit = Units(unit_name=unit['unit_name'], unit_code=unit['unit_code'])
                db.session.add(new_unit)
                db.session.commit()

            return {'message': 'Units added successfully'}

        new_unit = Units(unit_name=data['unit_name'], unit_code=data['unit_code'])

        db.session.add(new_unit)
        db.session.commit()

        return {'message': 'Unit added successfully'}

    @app.route('/api/students', methods=['POST'])
    def add_student():
        data = request.json

        if isinstance(data, list):
            for student in data:
                new_student = Students(student_name=student['student_name'], reg_number=student['reg_number'], year_of_study=student['year_of_study'], registered_units=student['registered_units'])

                db.session.add(new_student)
                db.session.commit()

            return {'message': 'Students added successfully'}

        new_student = Students(student_name=data['student_name'], reg_number=data['reg_number'], year_of_study=data['year_of_study'], registered_units=data['registered_units'])

        db.session.add(new_student)
        db.session.commit()

        return {'message': 'Student added successfully'}

    @app.route('/api/lecturers', methods=['POST'])
    def add_lecturer():
        data = request.json

        if isinstance(data, list):
            for lecturer in data:
                new_lecturer = Lecturers(lecturer_name=lecturer['lecturer_name'], lecturer_code=lecturer['lecturer_code'], units_taught=lecturer['units_taught'])

                db.session.add(new_lecturer)
                db.session.commit()

            return {'message': 'Lecturers added successfully'}

        new_lecturer = Lecturers(lecturer_name=data['lecturer_name'], lecturer_code=data['lecturer_code'], units_taught=data['units_taught'])

        db.session.add(new_lecturer)
        db.session.commit()

        return {'message': 'Lecturer added successfully'}

    @app.route('/api/units/<int:id>', methods=['DELETE'])
    def delete_unit(id):
        unit = Units.query.get(id)

        db.session.delete(unit)
        db.session.commit()

        return {'message': 'Unit deleted successfully'}

    @app.route('/api/students/<int:id>', methods=['DELETE'])
    def delete_student(id):
        student = Students.query.get(id)

        db.session.delete(student)
        db.session.commit()

        return {'message': 'Student deleted successfully'}
    
    @app.route('/api/lecturers/<int:id>', methods=['DELETE'])
    def delete_lecturer(id):
        lecturer = Lecturers.query.get(id)

        db.session.delete(lecturer)
        db.session.commit()

        return {'message': 'Lecturer deleted successfully'}
    
    @app.route('/api/units/<int:id>', methods=['PUT'])
    def update_unit(id):
        data = request.json
        unit = Units.query.get(id)

        unit.unit_name = data['unit_name']
        unit.unit_code = data['unit_code']

        db.session.commit()

        return {'message': 'Unit updated successfully'}
    
    @app.route('/api/students/<int:id>', methods=['PUT'])
    def update_student(id):
        data = request.json
        student = Students.query.get(id)

        student.student_name = data['student_name']
        student.reg_number = data['reg_number']
        student.year_of_study = data['year_of_study']
        student.registered_units = data['registered_units']

        db.session.commit()

        return {'message': 'Student updated successfully'}
    
    @app.route('/api/lecturers/<int:id>', methods=['PUT'])
    def update_lecturer(id):
        data = request.json
        lecturer = Lecturers.query.get(id)

        lecturer.lecturer_name = data['lecturer_name']
        lecturer.lecturer_code = data['lecturer_code']
        lecturer.units_taught = data['units_taught']

        db.session.commit()

        return {'message': 'Lecturer updated successfully'}
    
    @app.route('/api/students/<int:id>', methods=['GET'])
    def get_student(id):
        student = Students.query.get(id)
        return student.to_dict()
    
    @app.route('/api/lecturers/<int:id>', methods=['GET'])
    def get_lecturer(id):
        lecturer = Lecturers.query.get(id)
        return lecturer.to_dict()
    
    @app.route('/api/units/<int:id>', methods=['GET'])
    def get_unit(id):
        unit = Units.query.get(id)
        return unit.to_dict()
    
    @app.route('/api/students/<int:id>/units', methods=['GET'])
    def get_student_units(id):
        student = Students.query.get(id)
        units = Units.query.filter(Units.id.in_(student.registered_units)).all()
        return {'units': [unit.to_dict() for unit in units]}
    
    @app.route('/api/lecturers/<int:id>/units', methods=['GET'])
    def get_lecturer_units(id):
        lecturer = Lecturers.query.get(id)
        units = Units.query.filter(Units.id.in_(lecturer.units_taught)).all()
        return {'units': [unit.to_dict() for unit in units]}
    
    @app.route('/api/attendance', methods=['POST'])
    def add_attendance():
        import datetime
        data = request.json
        default = datetime.datetime.now()
        student_id = Attendance.find_student(data['reg_number'])
        new_attendance = Attendance(reg_number=data['reg_number'], unit_id=data['unit_id'], lecturer_id=data['lecturer_id'], date=default, status=data['status'], student_id=student_id)

        db.session.add(new_attendance)
        db.session.commit()

        return {'message': 'Attendance added successfully'}
    
    @app.route('/api/attendance', methods=['GET'])
    def get_attendance():
        attendance = Attendance.query.all()
        return {'attendance': [att.to_dict() for att in attendance]}
