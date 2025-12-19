from app import app, db
from models import Instructor, Classroom

with app.app_context():
    instructor_count = Instructor.query.count()
    classroom_count = Classroom.query.count()
    
    print(f"Instructors: {instructor_count}")
    print(f"Classrooms: {classroom_count}")

    if instructor_count > 0:
        print("--- Instructors ---")
        for i in Instructor.query.all():
            print(f"- {i.name} {i.surname}")
            
    if classroom_count > 0:
        print("--- Classrooms ---")
        for c in Classroom.query.all():
            print(f"- {c.room_number}")
