from . import db


class Units(db.Model):
    __tablename__ = 'units'

    id = db.Column(db.Integer, primary_key=True)
    unit_name = db.Column(db.String(100), nullable=False)
    unit_code = db.Column(db.String(10), nullable=False)

    def __repr__(self):
        return f'<Unit {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'unit_name': self.unit_name,
            'unit_code': self.unit_code
        }


class Students(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(100), nullable=False)
    reg_number = db.Column(db.String(10), nullable=False)
    year_of_study = db.Column(db.Integer, nullable=False)
    registered_units = db.Column(db.ARRAY(db.Integer), nullable=True)

    def __repr__(self):
        return f'<Student {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_name': self.student_name,
            'reg_number': self.reg_number,
            'year_of_study': self.year_of_study,
            'registered_units': self.registered_units
        }
    

class Lecturers(db.Model):
    __tablename__ = 'lecturers'

    id = db.Column(db.Integer, primary_key=True)
    lecturer_name = db.Column(db.String(100), nullable=False)
    lecturer_code = db.Column(db.String(10), nullable=False)
    units_taught = db.Column(db.ARRAY(db.Integer), nullable=True)

    def __repr__(self):
        return f'<Lecturer {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'lecturer_name': self.lecturer_name,
            'lecturer_code': self.lecturer_code,
            'units_taught': self.units_taught
        }
    

class Attendance(db.Model):
    __tablename__ = 'attendance'

    id = db.Column(db.Integer, primary_key=True)
    reg_number = db.Column(db.String(10), nullable=False)
    unit_id = db.Column(db.Integer, db.ForeignKey('units.id'), nullable=False)
    lecturer_id = db.Column(db.Integer, db.ForeignKey('lecturers.id'), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(10), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)

    def __repr__(self):
        return f'<Attendance {self.id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'unit_id': self.unit_id,
            'lecturer_id': self.lecturer_id,
            'date': self.date,
            'status': self.status,
            'reg_number': self.reg_number,
            'unit_code': self.find_unit_code(self.unit_id)
        }

    def find_student(reg_number):
        student = Students.query.filter_by(reg_number=reg_number).first()
        return student.id if student else None
    
    def find_unit_code(unit_id):
        unit = Units.query.filter_by(id=unit_id).first()
        return unit.unit_code if unit else None
