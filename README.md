# 📷 Smart Attendance System

[cite_start]This project is a web-based system that allows a teacher to take attendance automatically by recognizing students via a web camera[cite: 2]. The goal is to speed up the attendance process, automate it, and minimize manual errors.

## 🚀 Planned Features

Upon completion, the project will include the following features:

### 1. Student Management (Sprint 1)
* [cite_start]Allows teachers to register new students into the system[cite: 6].
* [cite_start]Teachers can add **name, student number, department, class, and a photograph** for each student[cite: 6, 8, 10].
* [cite_start]Includes basic form validation, such as ensuring the student number is unique and fields are not left empty[cite: 10].

### 2. Automatic Attendance (Sprint 2)
* [cite_start]Captures a live camera feed through the web interface[cite: 34].
* [cite_start]Recognizes students by comparing faces from the camera feed against the registered student photos[cite: 32, 37].
* [cite_start]Automatically creates an attendance record for recognized students[cite: 37].
* [cite_start]Provides real-time feedback to the user, such as "Attendance taken" or "Student not recognized"[cite: 37].
* [cite_start]Includes an option for the teacher to **manually add attendance** for students who are not recognized by the system[cite: 37].

### 3. Reporting and Tracking (Sprint 3)
* [cite_start]An interface to view attendance records on a daily or per-student basis[cite: 55, 59].
* [cite_start]Ability to filter attendance records by **date, class, or department**[cite: 59].
* [cite_start]Option to export attendance lists as a **PDF or CSV** report[cite: 59].
* [cite_start]Allows the teacher to manually edit attendance records if necessary[cite: 59].

## 🛠️ Planned Tech Stack

This project will consist of two main components: a Frontend (user interface) and a Backend (API and business logic).

* [cite_start]**Frontend:** The web interface for teachers to manage students, view the live camera feed, and check reports[cite: 8, 34, 57].
* [cite_start]**Backend:** The API server responsible for saving student data, running the face recognition algorithm, and serving reporting data[cite: 8, 34, 57].
* [cite_start]**Database:** Will be used to store student information (including photos) and attendance records[cite: 8].
* [cite_start]**Artificial Intelligence (AI):** A face recognition and matching module using the stored student photos[cite: 34].

## 🗺️ Project Roadmap (Sprint Plan)

The project will be developed in three main sprints:

* **Sprint 1: Student Registration & Information Entry**
    * [cite_start]**Goal:** To enable the registration of students with their basic information and photos into the system[cite: 6].
* **Sprint 2: Student Recognition & Attendance via Camera**
    * [cite_start]**Goal:** To recognize students from the camera feed and automatically log their attendance[cite: 32].
* **Sprint 3: Attendance Reporting and Tracking**
    * [cite_start]**Goal:** To enable the teacher to view, report on, and track all attendance records[cite: 55].

## 🧑‍💻 Team

* [cite_start]**Ceren Yasar:** Frontend Development [cite: 8, 34, 57]
* [cite_start]**Mehmet Şenadlı:** Backend & Face Recognition Algorithm Development [cite: 8, 34, 57]
* [cite_start]**Bilal Çiftec:** Project Management & Integration [cite: 8, 34, 57]
