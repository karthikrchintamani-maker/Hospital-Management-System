from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pymysql


print("Laboratory file loaded")


router = APIRouter(
    prefix="/laboratory",
    tags=["Laboratory"]
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

class Laboratory(BaseModel):

    patient_id:int
    test_name:str
    result:str
    test_date:str



class LaboratoryUpdate(BaseModel):

    patient_id:int | None = None
    test_name:str | None = None
    result:str | None = None
    test_date:str | None = None



# GET ALL LAB REPORTS

@router.get("/")
def get_laboratory():

    with connection.cursor() as cursor:

        cursor.execute(
            "SELECT * FROM laboratory"
        )

        reports = cursor.fetchall()


    return reports



# GET LAB REPORT BY ID

@router.get("/{lab_id}")
def get_lab(lab_id:int):

    with connection.cursor() as cursor:

        cursor.execute(
            "SELECT * FROM laboratory WHERE lab_id=%s",
            (lab_id,)
        )

        report = cursor.fetchone()


    if report is None:

        raise HTTPException(
            status_code=404,
            detail="Laboratory report not found"
        )


    return report



# CREATE LAB REPORT

@router.post("/")
def create_lab(
    lab:Laboratory
):

    with connection.cursor() as cursor:

        sql = """

        INSERT INTO laboratory
        (
            patient_id,
            test_name,
            result,
            test_date
        )

        VALUES
        (%s,%s,%s,%s)

        """


        cursor.execute(
            sql,
            (
                lab.patient_id,
                lab.test_name,
                lab.result,
                lab.test_date
            )
        )


        lab_id = cursor.lastrowid


    return {

        "message":"Laboratory Report Created Successfully",
        "lab_id":lab_id

    }



# UPDATE LAB REPORT

@router.put("/{lab_id}")
def update_lab(
    lab_id:int,
    lab:Laboratory
):

    with connection.cursor() as cursor:

        sql = """

        UPDATE laboratory

        SET

        patient_id=%s,
        test_name=%s,
        result=%s,
        test_date=%s

        WHERE lab_id=%s

        """


        cursor.execute(
            sql,
            (
                lab.patient_id,
                lab.test_name,
                lab.result,
                lab.test_date,
                lab_id
            )
        )


        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Laboratory report not found"
            )


    return {
        "message":"Laboratory Report Updated Successfully"
    }



# PATCH LAB REPORT

@router.patch("/{lab_id}")
def patch_lab(
    lab_id:int,
    lab:LaboratoryUpdate
):

    data = lab.model_dump(
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

    values.append(lab_id)


    sql = f"""

    UPDATE laboratory

    SET {fields}

    WHERE lab_id=%s

    """


    with connection.cursor() as cursor:

        cursor.execute(
            sql,
            values
        )


        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Laboratory report not found"
            )


    return {
        "message":"Laboratory Report Partially Updated"
    }



# DELETE LAB REPORT

@router.delete("/{lab_id}")
def delete_lab(
    lab_id:int
):

    with connection.cursor() as cursor:

        cursor.execute(
            "DELETE FROM laboratory WHERE lab_id=%s",
            (lab_id,)
        )


        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Laboratory report not found"
            )


    return {
        "message":"Laboratory Report Deleted Successfully"
    }