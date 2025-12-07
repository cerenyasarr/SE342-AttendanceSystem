import uuid
from datetime import datetime
from extensions import db

def generate_uuid():
    return str(uuid.uuid4())

class Role(db.Model):
    __tablename__ = 'role'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    name = db.Column(db.String, nullable=False)

    users = db.relationship('User', backref='role', lazy=True)

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    image = db.Column(db.String, nullable=True)
    role_id = db.Column(db.String, db.ForeignKey('role.id'), nullable=False)

    # Relationships (One-to-One mostly for Student/Instructor)
    student = db.relationship('Student', backref='user', uselist=False, lazy=True)
    instructor = db.relationship('Instructor', backref='user', uselist=False, lazy=True)

class Department(db.Model):
    __tablename__ = 'department'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    name = db.Column(db.String, unique=True, nullable=False)

    students = db.relationship('Student', backref='department', lazy=True)
    instructors = db.relationship('Instructor', backref='department', lazy=True)
    department_courses = db.relationship('DepartmentCourse', backref='department', lazy=True)

class Student(db.Model):
    __tablename__ = 'student'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    student_number = db.Column(db.Integer, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    phone_number = db.Column(db.String, nullable=True)
    class_level = db.Column(db.String, nullable=True) # "class" in ERD
    department_id = db.Column(db.String, db.ForeignKey('department.id'), nullable=False)

    enrollments = db.relationship('Enrollment', backref='student', lazy=True)
    student_attendances = db.relationship('StudentAttendance', backref='student', lazy=True)

class Instructor(db.Model):
    __tablename__ = 'instructor'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String, nullable=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    department_id = db.Column(db.String, db.ForeignKey('department.id'), nullable=False)

    courses = db.relationship('Course', backref='instructor', lazy=True)

class Classroom(db.Model):
    __tablename__ = 'classroom'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    classroom_code = db.Column(db.String, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)

    courses = db.relationship('Course', backref='classroom', lazy=True)

class Course(db.Model):
    __tablename__ = 'course'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    course_code = db.Column(db.String, unique=True, nullable=False)
    course_name = db.Column(db.String, unique=True, nullable=False)
    classroom_id = db.Column(db.String, db.ForeignKey('classroom.id'), nullable=True)
    instructor_id = db.Column(db.String, db.ForeignKey('instructor.id'), nullable=True)
    credits = db.Column(db.Integer, nullable=False)

    enrollments = db.relationship('Enrollment', backref='course', lazy=True)
    sessions = db.relationship('CourseSession', backref='course', lazy=True)
    department_courses = db.relationship('DepartmentCourse', backref='course', lazy=True)

class DepartmentCourse(db.Model):
    __tablename__ = 'department_course'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    department_id = db.Column(db.String, db.ForeignKey('department.id'), nullable=False)
    course_id = db.Column(db.String, db.ForeignKey('course.id'), nullable=False)

class Enrollment(db.Model):
    __tablename__ = 'enrollment'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String, db.ForeignKey('student.id'), nullable=False)
    course_id = db.Column(db.String, db.ForeignKey('course.id'), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    term = db.Column(db.String, nullable=False)

class CourseSession(db.Model):
    __tablename__ = 'course_session'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    course_id = db.Column(db.String, db.ForeignKey('course.id'), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    term = db.Column(db.String, nullable=False)
    day_of_week = db.Column(db.String, nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)

    # One-to-One relationship with SessionAttendance
    session_attendance = db.relationship('SessionAttendance', backref='course_session', uselist=False, lazy=True)

class SessionAttendance(db.Model):
    __tablename__ = 'session_attendance'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    course_session_id = db.Column(db.String, db.ForeignKey('course_session.id'), nullable=False)
    check_in_time = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String, nullable=False)

    student_attendances = db.relationship('StudentAttendance', backref='session_attendance', lazy=True)

class StudentAttendance(db.Model):
    __tablename__ = 'student_attendance'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String, db.ForeignKey('student.id'), nullable=False)
    session_attendance_id = db.Column(db.String, db.ForeignKey('session_attendance.id'), nullable=False)
    updated_at = db.Column(db.Date, default=datetime.utcnow)
    is_attendant = db.Column(db.Boolean, default=False)
