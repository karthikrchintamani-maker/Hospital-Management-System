from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pymysql


print("Doctors file loaded")


router=APIRouter(
    prefix="/doctors",
    tags=["Doctors"]
)



def get_connection():

    return pymysql.connect(
        host="localhost",
        user="root",
        password="info123",
        port=3310,
        database="hospital_management1",
        cursorclass=pymysql.cursors.DictCursor
    )



class Doctor(BaseModel):

    name:str
    specialization:str
    phone:str
    email:str





# GET ALL

@router.get("/")
def get_doctors():

    connection=get_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute(
                "SELECT * FROM doctors"
            )

            doctors=cursor.fetchall()


        return doctors


    finally:

        connection.close()





# CREATE

@router.post("/")
def create_doctor(doctor:Doctor):

    connection=get_connection()

    try:

        with connection.cursor() as cursor:


            cursor.execute(

            """

            INSERT INTO doctors

            (
            name,
            specialization,
            phone,
            email
            )

            VALUES(%s,%s,%s,%s)

            """,

            (
                doctor.name,
                doctor.specialization,
                doctor.phone,
                doctor.email
            )

            )


        connection.commit()


    finally:

        connection.close()



    return {
        "message":"Doctor Added Successfully"
    }







# UPDATE

@router.put("/{doctor_id}")
def update_doctor(
    doctor_id:int,
    doctor:Doctor
):

    connection=get_connection()


    try:

        with connection.cursor() as cursor:


            cursor.execute(

            """

            UPDATE doctors SET

            name=%s,
            specialization=%s,
            phone=%s,
            email=%s

            WHERE doctor_id=%s

            """,

            (
                doctor.name,
                doctor.specialization,
                doctor.phone,
                doctor.email,
                doctor_id
            )

            )


        connection.commit()


    finally:

        connection.close()



    return {
        "message":"Doctor Updated Successfully"
    }







# DELETE

@router.delete("/{doctor_id}")
def delete_doctor(doctor_id:int):

    connection=get_connection()


    try:

        with connection.cursor() as cursor:


            cursor.execute(

                "DELETE FROM doctors WHERE doctor_id=%s",

                (doctor_id,)

            )


            if cursor.rowcount==0:

                raise HTTPException(
                    status_code=404,
                    detail="Doctor not found"
                )


        connection.commit()


    finally:

        connection.close()



    return {
        "message":"Doctor Deleted Successfully"
    }