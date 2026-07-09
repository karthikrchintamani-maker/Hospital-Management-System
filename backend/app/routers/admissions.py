from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pymysql


print("Admissions file loaded")


router = APIRouter(
    prefix="/admissions",
    tags=["Admissions"]
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

class Admission(BaseModel):

    patient_id:int
    room_no:str
    admission_date:str
    discharge_date:str | None = None



class AdmissionUpdate(BaseModel):

    patient_id:int | None = None
    room_no:str | None = None
    admission_date:str | None = None
    discharge_date:str | None = None



# GET ALL ADMISSIONS

@router.get("/")
def get_admissions():

    with connection.cursor() as cursor:

        cursor.execute(
            "SELECT * FROM admissions"
        )

        admissions = cursor.fetchall()


    return admissions



# GET ADMISSION BY ID

@router.get("/{admission_id}")
def get_admission(admission_id:int):

    with connection.cursor() as cursor:

        cursor.execute(
            "SELECT * FROM admissions WHERE admission_id=%s",
            (admission_id,)
        )

        admission = cursor.fetchone()


    if admission is None:

        raise HTTPException(
            status_code=404,
            detail="Admission not found"
        )


    return admission



# CREATE ADMISSION

@router.post("/")
def create_admission(
    admission:Admission
):

    with connection.cursor() as cursor:

        sql = """

        INSERT INTO admissions
        (
            patient_id,
            room_no,
            admission_date,
            discharge_date
        )

        VALUES
        (%s,%s,%s,%s)

        """


        cursor.execute(
            sql,
            (
                admission.patient_id,
                admission.room_no,
                admission.admission_date,
                admission.discharge_date
            )
        )


        admission_id = cursor.lastrowid


    return {

        "message":"Admission Created Successfully",
        "admission_id":admission_id

    }



# UPDATE ADMISSION

@router.put("/{admission_id}")
def update_admission(
    admission_id:int,
    admission:Admission
):

    with connection.cursor() as cursor:

        sql = """

        UPDATE admissions

        SET

        patient_id=%s,
        room_no=%s,
        admission_date=%s,
        discharge_date=%s

        WHERE admission_id=%s

        """


        cursor.execute(
            sql,
            (
                admission.patient_id,
                admission.room_no,
                admission.admission_date,
                admission.discharge_date,
                admission_id
            )
        )


        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Admission not found"
            )


    return {
        "message":"Admission Updated Successfully"
    }



# PATCH ADMISSION

@router.patch("/{admission_id}")
def patch_admission(
    admission_id:int,
    admission:AdmissionUpdate
):

    data = admission.model_dump(
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

    values.append(admission_id)


    sql = f"""

    UPDATE admissions

    SET {fields}

    WHERE admission_id=%s

    """


    with connection.cursor() as cursor:

        cursor.execute(
            sql,
            values
        )


        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Admission not found"
            )


    return {
        "message":"Admission Partially Updated"
    }



# DELETE ADMISSION

@router.delete("/{admission_id}")
def delete_admission(
    admission_id:int
):

    with connection.cursor() as cursor:

        cursor.execute(
            "DELETE FROM admissions WHERE admission_id=%s",
            (admission_id,)
        )


        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Admission not found"
            )


    return {
        "message":"Admission Deleted Successfully"
    }