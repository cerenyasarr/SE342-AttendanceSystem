from app import app, db
from models import Role, User, Department, Instructor, Classroom
from werkzeug.security import generate_password_hash

with app.app_context():
    print("Starting seed process...")

    # 1. Create Roles
    instructor_role = Role.query.filter_by(name='Instructor').first()
    if not instructor_role:
        instructor_role = Role(name='Instructor')
        db.session.add(instructor_role)
        print("Created Instructor role.")
    
    # 2. Create Departments
    dept_cse = Department.query.filter_by(name='CSE').first()
    if not dept_cse:
        dept_cse = Department(name='CSE')
        db.session.add(dept_cse)
        print("Created CSE Department.")
    
    db.session.commit()

    # 3. Create Instructors (User + Instructor)
    # Check if we already have instructors
    if Instructor.query.count() == 0:
        print("Seeding Instructors...")
        
        instructors_data = [
            {"first": "Emre", "last": "Olca", "title": "Dr."},
            {"first": "Ensar", "last": "Gul", "title": "Prof."},
            {"first": "Asaf", "last": "Varol", "title": "Prof."}
        ]

        for data in instructors_data:
            # Create User
            user = User(
                first_name=data["first"],
                last_name=data["last"],
                password=generate_password_hash('password123'),
                role_id=instructor_role.id
            )
            db.session.add(user)
            db.session.flush() # Flush to get user.id

            # Create Instructor
            instructor = Instructor(
                user_id=user.id,
                department_id=dept_cse.id,
                title=data["title"]
            )
            db.session.add(instructor)
        
        db.session.commit()
        print(f"Added {len(instructors_data)} instructors.")
    else:
        print("Instructors already exist.")

    # 4. Create Classrooms
    if Classroom.query.count() == 0:
        print("Seeding Classrooms...")
        classrooms_data = [
            {"code": "Amfi 1", "cap": 100},
            {"code": "Amfi 3", "cap": 80},
            {"code": "Lab 1", "cap": 40},
            {"code": "Z06", "cap": 50}
        ]

        for data in classrooms_data:
            classroom = Classroom(
                classroom_code=data["code"],
                capacity=data["cap"]
            )
            db.session.add(classroom)
        
        db.session.commit()
        print(f"Added {len(classrooms_data)} classrooms.")
    else:
        print("Classrooms already exist.")

    print("Seed complete.")
