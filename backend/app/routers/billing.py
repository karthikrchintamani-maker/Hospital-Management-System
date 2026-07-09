from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pymysql


print("Billing file loaded")


router = APIRouter(
    prefix="/billing",
    tags=["Billing"]
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

class Billing(BaseModel):

    patient_id:int
    amount:float
    payment_status:str
    bill_date:str



class BillingUpdate(BaseModel):

    patient_id:int | None = None
    amount:float | None = None
    payment_status:str | None = None
    bill_date:str | None = None



# GET ALL BILLING RECORDS

@router.get("/")
def get_bills():

    with connection.cursor() as cursor:

        cursor.execute(
            "SELECT * FROM billing"
        )

        bills = cursor.fetchall()


    return bills



# GET BILL BY ID

@router.get("/{bill_id}")
def get_bill(bill_id:int):

    with connection.cursor() as cursor:

        cursor.execute(
            "SELECT * FROM billing WHERE bill_id=%s",
            (bill_id,)
        )

        bill = cursor.fetchone()


    if bill is None:

        raise HTTPException(
            status_code=404,
            detail="Bill not found"
        )


    return bill



# CREATE BILL

@router.post("/")
def create_bill(
    bill:Billing
):

    with connection.cursor() as cursor:

        sql = """

        INSERT INTO billing
        (
            patient_id,
            amount,
            payment_status,
            bill_date
        )

        VALUES
        (%s,%s,%s,%s)

        """


        cursor.execute(
            sql,
            (
                bill.patient_id,
                bill.amount,
                bill.payment_status,
                bill.bill_date
            )
        )


        bill_id = cursor.lastrowid


    return {

        "message":"Bill Created Successfully",
        "bill_id":bill_id

    }



# UPDATE BILL

@router.put("/{bill_id}")
def update_bill(
    bill_id:int,
    bill:Billing
):

    with connection.cursor() as cursor:

        sql = """

        UPDATE billing

        SET

        patient_id=%s,
        amount=%s,
        payment_status=%s,
        bill_date=%s

        WHERE bill_id=%s

        """


        cursor.execute(
            sql,
            (
                bill.patient_id,
                bill.amount,
                bill.payment_status,
                bill.bill_date,
                bill_id
            )
        )


        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Bill not found"
            )


    return {
        "message":"Bill Updated Successfully"
    }



# PATCH BILL

@router.patch("/{bill_id}")
def patch_bill(
    bill_id:int,
    bill:BillingUpdate
):

    data = bill.model_dump(
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

    values.append(bill_id)


    sql = f"""

    UPDATE billing

    SET {fields}

    WHERE bill_id=%s

    """


    with connection.cursor() as cursor:

        cursor.execute(
            sql,
            values
        )


        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Bill not found"
            )


    return {
        "message":"Bill Partially Updated"
    }



# DELETE BILL

@router.delete("/{bill_id}")
def delete_bill(
    bill_id:int
):

    with connection.cursor() as cursor:

        cursor.execute(
            "DELETE FROM billing WHERE bill_id=%s",
            (bill_id,)
        )


        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Bill not found"
            )


    return {
        "message":"Bill Deleted Successfully"
    }