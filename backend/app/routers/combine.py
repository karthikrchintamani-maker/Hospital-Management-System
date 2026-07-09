from fastapi import APIRouter, HTTPException
import pymysql


print("========== COMBINE IMPORTED ==========")


router = APIRouter(
    prefix="/combine",
    tags=["Combined APIs"]
)


# Database connection

connection = pymysql.connect(
    host="localhost",
    user="root",
    password="info123",
    port=3310,
    database="hospital_management1",
    cursorclass=pymysql.cursors.DictCursor,
    autocommit=True
)



# ==========================================
# USERS + AUTHENTICATION
# ==========================================

@router.get("/users-auth")
def get_users_with_auth():

    with connection.cursor() as cursor:

        cursor.execute(
            """
            SELECT
                u.user_id,
                u.full_name,
                u.email,
                u.role,

                a.auth_id,
                a.username

            FROM users u

            LEFT JOIN authentication a

            ON u.user_id = a.user_id
            """
        )

        result = cursor.fetchall()

    return result



@router.get("/users-auth/{user_id}")
def get_user_with_auth(user_id:int):

    with connection.cursor() as cursor:

        cursor.execute(
            """
            SELECT
                u.user_id,
                u.full_name,
                u.email,
                u.role,

                a.auth_id,
                a.username

            FROM users u

            LEFT JOIN authentication a

            ON u.user_id = a.user_id

            WHERE u.user_id=%s
            """,
            (user_id,)
        )

        result = cursor.fetchone()


    if result is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return result



# ==========================================
# PATIENT + APPOINTMENTS
# ==========================================

@router.get("/patient-appointments")
def patient_appointments():

    with connection.cursor() as cursor:

        cursor.execute(
            """
            SELECT

                p.patient_id,
                p.name AS patient_name,
                p.age,
                p.gender,

                a.appointment_id,
                a.appointment_date,
                a.status

            FROM patients p

            LEFT JOIN appointments a

            ON p.patient_id=a.patient_id
            """
        )

        result = cursor.fetchall()


    return result



# ==========================================
# PATIENT + PRESCRIPTIONS
# ==========================================

@router.get("/patient-prescriptions")
def patient_prescriptions():

    with connection.cursor() as cursor:

        cursor.execute(
            """
            SELECT

                p.patient_id,
                p.name AS patient_name,

                pr.prescription_id,
                pr.medicine,
                pr.dosage,
                pr.prescription_date

            FROM patients p

            LEFT JOIN prescriptions pr

            ON p.patient_id=pr.patient_id
            """
        )

        result = cursor.fetchall()


    return result



# ==========================================
# PATIENT + INSURANCE CLAIMS
# ==========================================

@router.get("/patient-insurance")
def patient_insurance():

    with connection.cursor() as cursor:

        cursor.execute(
            """
            SELECT

                p.patient_id,
                p.name AS patient_name,

                i.claim_id,
                i.insurance_company,
                i.policy_number,
                i.claim_amount,
                i.claim_status


            FROM patients p

            LEFT JOIN insurance_claims i

            ON p.patient_id=i.patient_id

            """
        )

        result = cursor.fetchall()


    return result



# ==========================================
# DOCTOR + APPOINTMENTS
# ==========================================

@router.get("/doctor-appointments")
def doctor_appointments():

    with connection.cursor() as cursor:

        cursor.execute(
            """
            SELECT

                d.doctor_id,
                d.name AS doctor_name,
                d.specialization,

                a.appointment_id,
                a.appointment_date,
                a.status


            FROM doctors d

            LEFT JOIN appointments a

            ON d.doctor_id=a.doctor_id

            """
        )

        result = cursor.fetchall()


    return result



# ==========================================
# ADMISSION REPORT
# ==========================================

@router.get("/admission-report")
def admission_report():

    with connection.cursor() as cursor:

        cursor.execute(
            """
            SELECT

                p.name AS patient_name,

                ad.admission_id,
                ad.admission_date,
                ad.discharge_date,
                ad.room_number


            FROM admissions ad


            JOIN patients p


            ON ad.patient_id=p.patient_id

            """
        )

        result = cursor.fetchall()


    return result



# ==========================================
# COMPLETE HOSPITAL SUMMARY
# ==========================================

@router.get("/hospital-summary")
def hospital_summary():

    with connection.cursor() as cursor:


        cursor.execute(
            "SELECT COUNT(*) AS total_patients FROM patients"
        )

        patients = cursor.fetchone()



        cursor.execute(
            "SELECT COUNT(*) AS total_doctors FROM doctors"
        )

        doctors = cursor.fetchone()



        cursor.execute(
            "SELECT COUNT(*) AS total_appointments FROM appointments"
        )

        appointments = cursor.fetchone()



        cursor.execute(
            "SELECT COUNT(*) AS total_admissions FROM admissions"
        )

        admissions = cursor.fetchone()



    return {

        "total_patients": patients["total_patients"],

        "total_doctors": doctors["total_doctors"],

        "total_appointments": appointments["total_appointments"],

        "total_admissions": admissions["total_admissions"]

    }