
import requests

BASE_URL = 'http://127.0.0.1:5000/api'

def create_test_data():
    # 1. Create Instructor
    instructor_data = {
        'username': 'teacher_test',
        'password': 'password123',
        'email': 'teacher_test@example.com',
        'first_name': 'Test',
        'last_name': 'Teacher',
        'title': 'Dr.',
        'department': 'Computer Engineering'
    }
    print("Creating Instructor...")
    res = requests.post(f'{BASE_URL}/instructors', json=instructor_data)
    if res.status_code == 201:
        instructor_id = res.json()['id']
        print(f"Instructor created: {instructor_id}")
    elif res.status_code == 409:
        print("Instructor already exists. Fetching ID...")
        # Login to get ID
        login_res = requests.post(f'{BASE_URL}/login', json={'username': 'teacher_test', 'password': 'password123'})
        if login_res.status_code == 200:
             instructor_id = login_res.json()['id']
             print(f"Instructor ID: {instructor_id}")
        else:
            print("Could not login as existing instructor.")
            return
    else:
        print(f"Error creating instructor: {res.text}")
        return

    # 2. Create Classroom (if not exists)
    print("Creating Classroom...")
    requests.post(f'{BASE_URL}/classrooms', json={'classroom_code': 'LAB-101', 'capacity': 50})
    # We need the classroom ID
    classrooms = requests.get(f'{BASE_URL}/classrooms').json()
    classroom_id = next((c['id'] for c in classrooms if c['code'] == 'LAB-101'), None)


    # 3. Create Course
    course_data = {
        'course_code': 'TEST101',
        'course_name': 'Testing Dynamic Features',
        'credits': 3,
        'classroom_id': classroom_id,
        'instructor_id': instructor_id
    }
    print("Creating Course...")
    res = requests.post(f'{BASE_URL}/courses', json=course_data)
    if res.status_code == 201:
        course_id = res.json()['id']
        print(f"Course created: {course_id}")
    elif res.status_code == 409:
        print("Course already exists. Fetching ID...")
        courses = requests.get(f'{BASE_URL}/instructors/{instructor_id}/courses').json()
        course_id = next((c['id'] for c in courses if c['code'] == 'TEST101'), None)
        print(f"Course ID: {course_id}")
    else:
         print(f"Error creating course: {res.text}")
         return

    # 4. Create Student
    print("Creating Student...")
    student_data = {
        'studentNumber': '2024999',
        'name': 'Test',
        'surname': 'Student',
        'department': 'Computer Engineering',
        'class': 1,
        'email': 'student_test@example.com',
        'phone': '5551234567'
    }
    res = requests.post(f'{BASE_URL}/students', json=student_data)
    if res.status_code == 201:
        student_id = res.json()['student']['id']
        print(f"Student created: {student_id}")
    elif res.status_code == 409:
        print("Student already exists. Fetching ID...")
        # Need to find ID - simplified
        students = requests.get(f'{BASE_URL}/students').json()
        student_id = next((s['id'] for s in students if s['student_number'] == '2024999'), None)
        print(f"Student ID: {student_id}")

    # 5. Enroll Student
    if student_id and course_id:
        print("Enrolling Student...")
        enroll_data = {
            'student_id': student_id,
            'course_id': course_id,
            'year': 2024,
            'term': 'Fall'
        }
        res = requests.post(f'{BASE_URL}/enrollments', json=enroll_data)
        print(f"Enroll result: {res.status_code} - {res.text}")

if __name__ == "__main__":
    create_test_data()
