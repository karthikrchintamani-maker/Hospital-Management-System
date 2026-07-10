from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pymysql


print("Medical Records file loaded")


router = APIRouter(
    prefix="/medical_records",
    tags=["Medical Records"]
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

class MedicalRecord(BaseModel):

    patient_id:int
    diagnosis:str
    treatment:str
    record_date:str



class MedicalRecordUpdate(BaseModel):

    patient_id:int | None = None
    diagnosis:str | None = None
    treatment:str | None = None
    record_date:str | None = None



# GET ALL RECORDS

@router.get("/")
def get_records():

    with connection.cursor() as cursor:

        cursor.execute(
            "SELECT * FROM medical_records"
        )

        records = cursor.fetchall()


    return records



# GET RECORD BY ID

@router.get("/{record_id}")
def get_record(record_id:int):

    with connection.cursor() as cursor:

        cursor.execute(
            "SELECT * FROM medical_records WHERE record_id=%s",
            (record_id,)
        )

        record = cursor.fetchone()


    if record is None:

        raise HTTPException(
            status_code=404,
            detail="Medical record not found"
        )


    return record



# CREATE RECORD

@router.post("/")
def create_record(
    record:MedicalRecord
):

    with connection.cursor() as cursor:

        sql = """

        INSERT INTO medical_records
        (
            patient_id,
            diagnosis,
            treatment,
            record_date
        )

        VALUES
        (%s,%s,%s,%s)

        """


        cursor.execute(
            sql,
            (
                record.patient_id,
                record.diagnosis,
                record.treatment,
                record.record_date
            )
        )


        record_id = cursor.lastrowid


    return {

        "message":"Medical Record Created Successfully",
        "record_id":record_id

    }



# UPDATE RECORD

@router.put("/{record_id}")
def update_record(
    record_id:int,
    record:MedicalRecord
):

    with connection.cursor() as cursor:

        sql = """

        UPDATE medical_records

        SET

        patient_id=%s,
        diagnosis=%s,
        treatment=%s,
        record_date=%s

        WHERE record_id=%s

        """


        cursor.execute(
            sql,
            (
                record.patient_id,
                record.diagnosis,
                record.treatment,
                record.record_date,
                record_id
            )
        )


        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Medical record not found"
            )


    return {

        "message":"Medical Record Updated Successfully"

    }



# PATCH RECORD

@router.patch("/{record_id}")
def patch_record(
    record_id:int,
    record:MedicalRecordUpdate
):

    data = record.model_dump(
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

    values.append(record_id)


    sql = f"""

    UPDATE medical_records

    SET {fields}

    WHERE record_id=%s

    """


    with connection.cursor() as cursor:

        cursor.execute(
            sql,
            values
        )


        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Medical record not found"
            )


    return {

        "message":"Medical Record Partially Updated"

    }



# DELETE RECORD

@router.delete("/{record_id}")
def delete_record(
    record_id:int
):

    with connection.cursor() as cursor:

        cursor.execute(
            "DELETE FROM medical_records WHERE record_id=%s",
            (record_id,)
        )


        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Medical record not found"
            )


    return {

        "message":"Medical Record Deleted Successfully"

    }
