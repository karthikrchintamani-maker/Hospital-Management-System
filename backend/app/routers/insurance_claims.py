from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pymysql


router = APIRouter(
    prefix="/insurance_claims",
    tags=["Insurance Claims"]
)



# Database connection function
def get_connection():

    return pymysql.connect(
        host="localhost",
        user="root",
        password="info123",
        port=3310,
        database="hospital_management1",
        cursorclass=pymysql.cursors.DictCursor
    )



# Schema

class ClaimCreate(BaseModel):

    patient_id:int
    insurance_company:str
    claim_amount:float
    status:str



# ==========================
# GET ALL CLAIMS
# ==========================

@router.get("/")
def get_claims():

    connection = get_connection()

    try:

        cursor = connection.cursor()

        cursor.execute(
            "SELECT * FROM insurance_claims"
        )

        data = cursor.fetchall()

        return data


    finally:

        cursor.close()
        connection.close()



# ==========================
# ADD CLAIM
# ==========================

@router.post("/")
def add_claim(claim:ClaimCreate):

    connection = get_connection()

    try:

        cursor = connection.cursor()


        sql = """
        INSERT INTO insurance_claims
        (
        patient_id,
        insurance_company,
        claim_amount,
        status
        )

        VALUES(%s,%s,%s,%s)

        """


        cursor.execute(
            sql,
            (
                claim.patient_id,
                claim.insurance_company,
                claim.claim_amount,
                claim.status
            )
        )


        connection.commit()


        return {
            "message":"Claim Added Successfully"
        }


    finally:

        cursor.close()
        connection.close()



# ==========================
# UPDATE CLAIM
# ==========================

@router.put("/{claim_id}")
def update_claim(
    claim_id:int,
    claim:ClaimCreate
):

    connection = get_connection()

    try:

        cursor = connection.cursor()


        sql="""

        UPDATE insurance_claims SET

        patient_id=%s,
        insurance_company=%s,
        claim_amount=%s,
        status=%s

        WHERE claim_id=%s

        """


        cursor.execute(
            sql,
            (
                claim.patient_id,
                claim.insurance_company,
                claim.claim_amount,
                claim.status,
                claim_id
            )
        )


        connection.commit()


        return {
            "message":"Claim Updated Successfully"
        }


    finally:

        cursor.close()
        connection.close()



# ==========================
# DELETE CLAIM
# ==========================

@router.delete("/{claim_id}")
def delete_claim(claim_id:int):

    connection = get_connection()

    try:

        cursor = connection.cursor()


        cursor.execute(
            """
            DELETE FROM insurance_claims
            WHERE claim_id=%s
            """,
            (claim_id,)
        )


        connection.commit()


        return {
            "message":"Claim Deleted Successfully"
        }


    finally:

        cursor.close()
        connection.close()