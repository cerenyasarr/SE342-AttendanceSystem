from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from extensions import db
from models import (
    Student, User, Role, Department, Instructor, Course, 
    Classroom, DepartmentCourse, Enrollment, CourseSession, 
    SessionAttendance, StudentAttendance
)

api = Blueprint('api', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ==========================================
# DEPARTMENTS
# ==========================================
@api.route('/departments', methods=['GET'])
def get_departments():
    depts = Department.query.all()
    return jsonify([{'id': d.id, 'name': d.name} for d in depts])

@api.route('/departments', methods=['POST'])
def create_department():
    data = request.json or request.form
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    
    if Department.query.filter_by(name=name).first():
        return jsonify({'error': 'Department already exists'}), 409
        
    dept = Department(name=name)
    db.session.add(dept)
    db.session.commit()
    return jsonify({'id': dept.id, 'name': dept.name}), 201

# ==========================================
# CLASSROOMS
# ==========================================
@api.route('/classrooms', methods=['GET'])
def get_classrooms():
    classrooms = Classroom.query.all()
    return jsonify([{
        'id': c.id, 
        'code': c.classroom_code, 
        'capacity': c.capacity
    } for c in classrooms])

@api.route('/classrooms', methods=['POST'])
def create_classroom():
    data = request.json or request.form
    code = data.get('classroom_code')
    capacity = data.get('capacity')
    
    if not code or not capacity:
        return jsonify({'error': 'Code and capacity are required'}), 400

    if Classroom.query.filter_by(classroom_code=code).first():
        return jsonify({'error': 'Classroom code already exists'}), 409

    classroom = Classroom(classroom_code=code, capacity=capacity)
    db.session.add(classroom)
    db.session.commit()
    return jsonify({'id': classroom.id, 'code': classroom.classroom_code}), 201

# ==========================================
# STUDENTS
# ==========================================
@api.route('/students', methods=['GET'])
def get_students():
    try:
        students = Student.query.all()
        result = []
        for s in students:
            user = s.user
            dept = s.department
            result.append({
                'id': s.id,
                'student_number': s.student_number,
                'name': user.first_name if user else "Unknown",
                'surname': user.last_name if user else "Unknown",
                'department': dept.name if dept else "Unknown",
                'class': s.class_level,
                'email': s.email,
                'phone': s.phone_number,
                'photo_path': user.image if user else None
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/students', methods=['POST'])
def create_student():
    try:
        data = request.form if request.form else request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        student_number = data.get('studentNumber')
        first_name = data.get('name')
        last_name = data.get('surname')
        department_name = data.get('department')
        class_level = data.get('class')
        email = data.get('email')
        phone = data.get('phone')

        if not all([student_number, first_name, last_name, department_name, class_level, email]):
             return jsonify({'error': 'Missing required fields'}), 400

        if Student.query.filter_by(student_number=student_number).first():
            return jsonify({'error': 'Student number already exists'}), 409
        if Student.query.filter_by(email=email).first():
             return jsonify({'error': 'Email already exists'}), 409

        department = Department.query.filter_by(name=department_name).first()
        if not department:
            department = Department(name=department_name)
            db.session.add(department)
            db.session.commit()

        role = Role.query.filter_by(name='Student').first()
        if not role:
            role = Role(name='Student')
            db.session.add(role)
            db.session.commit()

        photo_path = None
        if request.files and 'photo' in request.files:
            file = request.files['photo']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"{student_number}_{file.filename}")
                if not os.path.exists(current_app.config['UPLOAD_FOLDER']):
                    os.makedirs(current_app.config['UPLOAD_FOLDER'])
                file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                photo_path = f"uploads/{filename}"

        new_user = User(
            first_name=first_name,
            last_name=last_name,
            password="defaultPassword123", 
            role_id=role.id,
            image=photo_path
        )
        db.session.add(new_user)
        db.session.commit()

        new_student = Student(
            user_id=new_user.id,
            student_number=student_number,
            email=email,
            phone_number=phone,
            class_level=class_level,
            department_id=department.id
        )
        db.session.add(new_student)
        db.session.commit()

        response_data = {
            'id': new_student.id,
            'student_number': new_student.student_number,
            'name': new_user.first_name,
            'surname': new_user.last_name,
            'department': department.name,
            'class': new_student.class_level,
            'email': new_student.email,
            'phone': new_student.phone_number,
            'photo_path': new_user.image
        }
        return jsonify({'message': 'Student created successfully', 'student': response_data}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/students/<string:id>', methods=['DELETE'])
def delete_student(id):
    try:
        student = Student.query.get_or_404(id)
        user = student.user
        db.session.delete(student)
        if user:
            db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Student deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ==========================================
# INSTRUCTORS
# ==========================================
@api.route('/instructors', methods=['GET'])
def get_instructors():
    instructors = Instructor.query.all()
    res = []
    for i in instructors:
        u = i.user
        d = i.department
        res.append({
            'id': i.id,
            'name': f"{u.first_name} {u.last_name}" if u else "",
            'title': i.title,
            'department': d.name if d else ""
        })
    return jsonify(res)

@api.route('/instructors', methods=['POST'])
def create_instructor():
    try:
        data = request.json or request.form
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        title = data.get('title')
        department_name = data.get('department')
        email = data.get('email') # Assuming unique email requirement implies user email

        if not all([first_name, last_name, department_name, email]):
             return jsonify({'error': 'Missing required fields'}), 400
             
        department = Department.query.filter_by(name=department_name).first()
        if not department:
            department = Department(name=department_name)
            db.session.add(department)
            db.session.commit()
            
        role = Role.query.filter_by(name='Instructor').first()
        if not role:
            role = Role(name='Instructor')
            db.session.add(role)
            db.session.commit()
            
        new_user = User(
            first_name=first_name,
            last_name=last_name,
            password="defaultPassword123",
            role_id=role.id
        )
        db.session.add(new_user)
        db.session.commit()
        
        new_instructor = Instructor(
            user_id=new_user.id,
            title=title,
            department_id=department.id
        )
        db.session.add(new_instructor)
        db.session.commit()
        
        return jsonify({'message': 'Instructor created', 'id': new_instructor.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ==========================================
# COURSES
# ==========================================
@api.route('/courses', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    return jsonify([{
        'id': c.id, 
        'code': c.course_code, 
        'name': c.course_name,
        'credits': c.credits,
        'instructor': f"{c.instructor.user.first_name} {c.instructor.user.last_name}" if c.instructor and c.instructor.user else None,
        'classroom': c.classroom.classroom_code if c.classroom else None
    } for c in courses])

@api.route('/courses', methods=['POST'])
def create_course():
    try:
        data = request.json
        code = data.get('course_code')
        name = data.get('course_name')
        credits = data.get('credits')
        classroom_id = data.get('classroom_id')
        instructor_id = data.get('instructor_id')
        
        if not all([code, name, credits]):
            return jsonify({'error': 'Missing required fields'}), 400
            
        course = Course(
            course_code=code,
            course_name=name,
            credits=credits,
            classroom_id=classroom_id,
            instructor_id=instructor_id
        )
        db.session.add(course)
        db.session.commit()
        return jsonify({'message': 'Course created', 'id': course.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ==========================================
# ENROLLMENTS
# ==========================================
@api.route('/enrollments', methods=['POST'])
def enroll_student():
    try:
        data = request.json
        student_id = data.get('student_id')
        course_id = data.get('course_id')
        year = data.get('year')
        term = data.get('term')

        if not all([student_id, course_id, year, term]):
            return jsonify({'error': 'Missing required fields'}), 400

        enrollment = Enrollment(
            student_id=student_id,
            course_id=course_id,
            year=year,
            term=term
        )
        db.session.add(enrollment)
        db.session.commit()
        return jsonify({'message': 'Enrolled successfully', 'id': enrollment.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/enrollments', methods=['GET'])
def get_enrollments():
    enrollments = Enrollment.query.all()
    return jsonify([{
        'id': e.id,
        'student': e.student.user.first_name + " " + e.student.user.last_name,
        'course': e.course.course_code,
        'year': e.year,
        'term': e.term
    } for e in enrollments])

# ==========================================
# COURSE SESSIONS
# ==========================================
@api.route('/sessions', methods=['POST'])
def create_session():
    try:
        data = request.json
        course_id = data.get('course_id')
        year = data.get('year')
        term = data.get('term')
        day = data.get('day_of_week')
        start_time_str = data.get('start_time') # Expecting ISO format
        end_time_str = data.get('end_time')

        if not all([course_id, year, term, day, start_time_str, end_time_str]):
             return jsonify({'error': 'Missing required fields'}), 400

        start_time = datetime.fromisoformat(start_time_str.replace('Z', '+00:00'))
        end_time = datetime.fromisoformat(end_time_str.replace('Z', '+00:00'))

        session = CourseSession(
            course_id=course_id,
            year=year,
            term=term,
            day_of_week=day,
            start_time=start_time,
            end_time=end_time
        )
        db.session.add(session)
        db.session.commit()
        
        # Initialize SessionAttendance (1-to-1)
        session_attendance = SessionAttendance(
            course_session_id=session.id,
            status='Scheduled' 
        )
        db.session.add(session_attendance)
        db.session.commit()

        return jsonify({'message': 'Session created', 'id': session.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/sessions', methods=['GET'])
def get_sessions():
    sessions = CourseSession.query.all()
    return jsonify([{
        'id': s.id,
        'course': s.course.course_code,
        'day': s.day_of_week,
        'start': s.start_time.isoformat(),
        'end': s.end_time.isoformat()
    } for s in sessions])

# ==========================================
# ATTENDANCE
# ==========================================
@api.route('/attendance/session', methods=['POST'])
def update_session_attendance():
    """ 
    Check-in/Update status for the session itself (e.g., started, completed) 
    """
    try:
        data = request.json
        session_id = data.get('session_id') # This is the CourseSession ID
        status = data.get('status')
        check_in = data.get('check_in_time') # Optional

        if not session_id or not status:
             return jsonify({'error': 'Session ID and Status required'}), 400

        # Find the 1-to-1 attendance record
        sa = SessionAttendance.query.filter_by(course_session_id=session_id).first()
        if not sa:
            return jsonify({'error': 'Session Attendance record not found'}), 404

        sa.status = status
        if check_in:
             sa.check_in_time = datetime.fromisoformat(check_in.replace('Z', '+00:00'))
        
        db.session.commit()
        return jsonify({'message': 'Session attendance updated', 'id': sa.id}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/attendance/student', methods=['POST'])
def mark_student_attendance():
    try:
        data = request.json
        student_id = data.get('student_id')
        session_id = data.get('session_id') # CourseSession ID
        is_attendant = data.get('is_attendant', False)

        if not student_id or not session_id:
             return jsonify({'error': 'Student ID and Session ID required'}), 400

        # Resolve SessionAttendance ID from CourseSession ID
        sa = SessionAttendance.query.filter_by(course_session_id=session_id).first()
        if not sa:
             return jsonify({'error': 'Session Attendance not initialized'}), 400

        student_attendance = StudentAttendance.query.filter_by(
            student_id=student_id, 
            session_attendance_id=sa.id
        ).first()

        if student_attendance:
            student_attendance.is_attendant = is_attendant
            student_attendance.updated_at = datetime.utcnow().date()
        else:
            student_attendance = StudentAttendance(
                student_id=student_id,
                session_attendance_id=sa.id,
                is_attendant=is_attendant,
                updated_at=datetime.utcnow().date()
            )
            db.session.add(student_attendance)

        db.session.commit()
        return jsonify({'message': 'Attendance marked'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/attendance/session/<string:session_id>', methods=['GET'])
def get_session_attendance(session_id):
    """ Get list of students and their attendance for a session """
    try:
        # session_id is CourseSession ID
        sa = SessionAttendance.query.filter_by(course_session_id=session_id).first()
        if not sa:
             return jsonify({'error': 'Session Attendance not found'}), 404

        # Get all enrollments for the course to show absent students too? 
        # For now, just show recorded attendances + enrollment list merging might be better done on frontend or complex query.
        # Let's return what records we have.
        records = StudentAttendance.query.filter_by(session_attendance_id=sa.id).all()
        
        result = []
        for r in records:
            student = r.student
            user = student.user
            result.append({
                'student_id': student.id,
                'name': f"{user.first_name} {user.last_name}",
                'student_number': student.student_number,
                'is_attendant': r.is_attendant,
                'date': r.updated_at.isoformat() if r.updated_at else None
            })
        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
