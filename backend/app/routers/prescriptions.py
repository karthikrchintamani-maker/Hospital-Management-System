from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pymysql


print("Prescriptions file loaded")


router = APIRouter(
    prefix="/prescriptions",
    tags=["Prescriptions"]
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



# Schema

class Prescription(BaseModel):

    patient_id:int
    medicine:str
    dosage:str
    prescription_date:str



class PrescriptionUpdate(BaseModel):

    patient_id:int | None = None
    medicine:str | None = None
    dosage:str | None = None
    prescription_date:str | None = None



# GET ALL PRESCRIPTIONS

@router.get("/")
def get_prescriptions():

    with connection.cursor() as cursor:

        cursor.execute(
            "SELECT * FROM prescriptions"
        )

        prescriptions = cursor.fetchall()


    return prescriptions



# GET PRESCRIPTION BY ID

@router.get("/{prescription_id}")
def get_prescription(
    prescription_id:int
):

    with connection.cursor() as cursor:

        cursor.execute(
            "SELECT * FROM prescriptions WHERE prescription_id=%s",
            (prescription_id,)
        )

        prescription = cursor.fetchone()


    if prescription is None:

        raise HTTPException(
            status_code=404,
            detail="Prescription not found"
        )


    return prescription



# CREATE PRESCRIPTION

@router.post("/")
def create_prescription(
    prescription:Prescription
):

    with connection.cursor() as cursor:

        sql = """

        INSERT INTO prescriptions
        (
            patient_id,
            medicine,
            dosage,
            prescription_date
        )

        VALUES
        (%s,%s,%s,%s)

        """


        cursor.execute(
            sql,
            (
                prescription.patient_id,
                prescription.medicine,
                prescription.dosage,
                prescription.prescription_date
            )
        )


        prescription_id = cursor.lastrowid


    return {

        "message":"Prescription Created Successfully",
        "prescription_id":prescription_id

    }



# UPDATE PRESCRIPTION

@router.put("/{prescription_id}")
def update_prescription(
    prescription_id:int,
    prescription:Prescription
):

    with connection.cursor() as cursor:

        sql = """

        UPDATE prescriptions

        SET

        patient_id=%s,
        medicine=%s,
        dosage=%s,
        prescription_date=%s

        WHERE prescription_id=%s

        """


        cursor.execute(
            sql,
            (
                prescription.patient_id,
                prescription.medicine,
                prescription.dosage,
                prescription.prescription_date,
                prescription_id
            )
        )


        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Prescription not found"
            )


    return {

        "message":"Prescription Updated Successfully"

    }



# PATCH PRESCRIPTION

@router.patch("/{prescription_id}")
def patch_prescription(
    prescription_id:int,
    prescription:PrescriptionUpdate
):

    data = prescription.model_dump(
        exclude_unset=True
    )


    if not data:

        raise HTTPException(
            status_code=400,
            detail="No data provided"
        )


    fields = ", ".join(
        f"{key}=%s"
        for key in data.keys()
    )


    values = list(data.values())

    values.append(prescription_id)


    sql = f"""

    UPDATE prescriptions

    SET {fields}

    WHERE prescription_id=%s

    """


    with connection.cursor() as cursor:

        cursor.execute(
            sql,
            values
        )


        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Prescription not found"
            )


    return {

        "message":"Prescription Partially Updated"

    }



# DELETE PRESCRIPTION

@router.delete("/{prescription_id}")
def delete_prescription(
    prescription_id:int
):

    with connection.cursor() as cursor:

        cursor.execute(
            "DELETE FROM prescriptions WHERE prescription_id=%s",
            (prescription_id,)
        )


        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Prescription not found"
            )


    return {

        "message":"Prescription Deleted Successfully"

    }