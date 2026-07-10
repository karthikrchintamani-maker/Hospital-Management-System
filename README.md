# Hospital Management System

## Overview

The Hospital Management System (HMS) is a full-stack web application developed to automate and manage various hospital operations. The system provides a centralized platform for managing patients, doctors, appointments, admissions, billing, laboratory records, inventory, medical records, prescriptions, insurance claims, and user authentication.

The application is built using React.js for the frontend, FastAPI for the backend, and MySQL as the database management system.

---

## Features

### Dashboard

* Displays summary statistics of hospital records.
* Provides an overview of system data.

### Patient Management

* Add new patients.
* View patient records.
* Update patient details.
* Delete patient records.

### Doctor Management

* Add doctor information.
* View doctor details.
* Update doctor records.
* Delete doctor records.

### Appointment Management

* Schedule appointments.
* View appointment details.
* Update appointment status.
* Delete appointments.

### Admission Management

* Manage patient admissions and discharges.
* Track room allocations.

### Billing Management

* Generate and manage billing records.
* Track payment status.

### Laboratory Management

* Manage laboratory tests and results.

### Inventory Management

* Maintain medicine and equipment records.

### Medical Records Management

* Store and manage patient medical histories.

### Prescription Management

* Manage doctor prescriptions.

### Insurance Claims Management

* Track and process insurance claims.

### User Authentication

* Manage user accounts and authentication information.

### Combined Reports

* User Authentication Reports.
* Patient Appointment Reports.
* Integrated reporting using SQL joins.

---

## Technology Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Bootstrap
* CSS

### Backend

* FastAPI
* Pydantic
* PyMySQL

### Database

* MySQL

### API Testing

* Swagger UI

---

## Project Architecture

React Frontend

↓

FastAPI REST API

↓

MySQL Database

---

## Project Structure

frontend/
├── src/
│ ├── components/
│ │ ├── Navbar.jsx
│ │ └── Sidebar.jsx
│ │
│ ├── pages/
│ │ ├── Dashboard.jsx
│ │ ├── Patients.jsx
│ │ ├── Doctors.jsx
│ │ ├── Appointments.jsx
│ │ ├── Admissions.jsx
│ │ ├── Billing.jsx
│ │ ├── Laboratory.jsx
│ │ ├── Inventory.jsx
│ │ ├── MedicalRecords.jsx
│ │ ├── Prescriptions.jsx
│ │ ├── InsuranceClaims.jsx
│ │ └── CombinedReports.jsx
│ │
│ ├── api/
│ │ └── axios.js
│ │
│ ├── App.jsx
│ └── main.jsx
│
backend/
├── app/
│ ├── routers/
│ ├── schemas/
│ ├── database/
│ └── main.py
│
└── requirements.txt

---

## Modules Implemented

1. Dashboard
2. Patients
3. Doctors
4. Appointments
5. Admissions
6. Billing
7. Laboratory
8. Inventory
9. Medical Records
10. Prescriptions
11. Insurance Claims
12. User Authentication
13. Combined Reports

---

## CRUD Operations

The system supports:

* Create (Add)
* Read (View)
* Update (Edit)
* Delete (Remove)

for all major modules.

---

## API Endpoints

### Dashboard

* GET /dashboard

### Patients

* GET /patients
* POST /patients
* PUT /patients/{id}
* DELETE /patients/{id}

### Doctors

* GET /doctors
* POST /doctors
* PUT /doctors/{id}
* DELETE /doctors/{id}

### Appointments

* GET /appointments
* POST /appointments
* PUT /appointments/{id}
* DELETE /appointments/{id}

### Admissions

* GET /admissions
* POST /admissions
* PUT /admissions/{id}
* DELETE /admissions/{id}

### Billing

* GET /billing
* POST /billing
* PUT /billing/{id}
* DELETE /billing/{id}

### Laboratory

* GET /laboratory
* POST /laboratory
* PUT /laboratory/{id}
* DELETE /laboratory/{id}

### Inventory

* GET /inventory
* POST /inventory
* PUT /inventory/{id}
* DELETE /inventory/{id}

### Medical Records

* GET /medical-records
* POST /medical-records
* PUT /medical-records/{id}
* DELETE /medical-records/{id}

### Prescriptions

* GET /prescriptions
* POST /prescriptions
* PUT /prescriptions/{id}
* DELETE /prescriptions/{id}

### Insurance Claims

* GET /insurance-claims
* POST /insurance-claims
* PUT /insurance-claims/{id}
* DELETE /insurance-claims/{id}

### Combined Reports

* GET /combine/users-auth
* GET /combine/patient-appointments

---

## Installation

### Clone Repository

git clone <repository-url>

cd Hospital-Management-System

### Backend Setup

cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload

Backend runs on:

http://127.0.0.1:8000

Swagger Documentation:

http://127.0.0.1:8000/docs

### Frontend Setup

cd frontend

npm install

npm run dev

Frontend runs on:

http://localhost:5173

---

## Future Enhancements

* JWT Authentication
* Role-Based Access Control
* Email Notifications
* Advanced Analytics Dashboard
* PDF Report Generation
* Cloud Deployment
* Mobile Responsive Enhancements

---

 ## Author

**Karthik R**

Bachelor of Engineering (B.E.) – Computer Science and Engineering

Hospital Management System Project

Developed using React.js, FastAPI, and MySQL.


---

## Conclusion

The Hospital Management System successfully automates hospital operations through an integrated web-based platform. By combining React.js, FastAPI, and MySQL, the system provides efficient data management, improved accessibility, and streamlined workflows for healthcare administration. The project demonstrates the practical implementation of full-stack web development, RESTful APIs, and relational database management in a real-world healthcare environment.
