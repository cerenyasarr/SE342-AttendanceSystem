# 📷 Smart Attendance System

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

> **Speed up the attendance process, automate it, and minimize manual errors.**

This project is a **modern web-based system** that allows teachers to take attendance automatically by recognizing students via a web camera efficiently.

---

## 🚀 Features

*   **🎓 Student Management**: Register new students with details like name, student number, department, class, and photo.
*   **🤖 Automatic Attendance**: Live camera feed captures student faces, recognizes them using AI, and records attendance instantly.
*   **📊 Reporting & Tracking**: View attendance records daily or per student. Filter by date, class, or department.
*   **🔐 Secure & Fast**: Built with modern technologies for speed and security.

---

## 🗓️ Project Plan

*   **Sprint 0: Requirements & Analysis**
    *   Define project scope, gather requirements, and create the Software Requirements Specification (SRS) document.
*   **Sprint 1: Database Design**
    *   Design and configure the PostgreSQL database, including security and performance settings.
*   **Sprint 2: Student Management**
    *   Develop student registration forms and backend integration for data management.
*   **Sprint 3: Camera Integration**
    *   Integrate camera and `face_recognition` system for automatic attendance tracking.
*   **Sprint 4: Reporting & Admin Panel**
    *   Build an admin panel to view, filter, export, and manage attendance records.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) | React Framework for the web interface. |
| **Backend** | [Flask](https://flask.palletsprojects.com/) | Python microframework for API and AI processing. |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | Robust object-relational database. |
| **AI / ML** | `face_recognition` | Python library for robust face detection and matching. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework. |

---

## 🖼️ Gallery

| Log in Page | Live Attendance | Student Registration | Teachers Reports | Student Reports |
| :---: | :---: | :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/e58191da-895c-4481-967d-21fbfcacc809" width="200" /> | <img src="https://github.com/user-attachments/assets/f1328385-f19f-47a5-bf57-5425cd4e55a4" width="200" /> | <img src="https://github.com/user-attachments/assets/b6390f37-4cd6-40d7-970c-267e7a0f307b" width="200" /> | <img src="https://github.com/user-attachments/assets/daed1710-64f8-4ada-8bd0-4adeea41d736" width="200" /> | <img src="https://github.com/user-attachments/assets/14cfadf6-b5a9-4d0b-a831-c3ecc19d5445" width="200" /> |

---

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

*   **Node.js** (v18 or higher)
*   **Python** (v3.9 or higher)

### 1. Clone the Repository

```bash
git clone https://github.com/cerenyasarr/SE342-AttendanceSystem.git
cd SE342-AttendanceSystem
```

### 2. Backend Setup (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python src/app.py
```
*The backend will start at `http://localhost:5001`*

### 3. Frontend Setup (Next.js)

Open a new terminal configuration:

```bash
cd frontend
npm install
npm run dev
```
*The frontend will start at `http://localhost:3000`*

---

## 🧑‍💻 Team

*   **Ceren Yaşar**
*   **Mehmet Şenadlı**
*   **Bilal Çifteci**
