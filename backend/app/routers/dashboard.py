from fastapi import APIRouter
import pymysql

print("Dashboard file loaded")

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

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
# TOTAL COUNTS OF ALL MODULES
# ==========================================

@router.get("/counts")
def dashboard_counts():

    with connection.cursor() as cursor:

        cursor.execute("SELECT COUNT(*) AS total FROM patients")
        patients = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM doctors")
        doctors = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM appointments")
        appointments = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM admissions")
        admissions = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM billing")
        billing = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM laboratory")
        laboratory = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM inventory")
        inventory = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM medical_records")
        medical_records = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM prescriptions")
        prescriptions = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM insurance_claims")
        insurance_claims = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM users")
        users = cursor.fetchone()["total"]

    return {
        "patients": patients,
        "doctors": doctors,
        "appointments": appointments,
        "admissions": admissions,
        "billing": billing,
        "laboratory": laboratory,
        "inventory": inventory,
        "medical_records": medical_records,
        "prescriptions": prescriptions,
        "insurance_claims": insurance_claims,
        "users": users
    }