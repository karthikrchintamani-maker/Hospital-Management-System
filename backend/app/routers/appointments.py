from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pymysql


print("Appointments file loaded")


router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
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

class Appointment(BaseModel):

    patient_id:int
    doctor_id:int
    appointment_date:str
    status:str



class AppointmentUpdate(BaseModel):

    patient_id:int | None=None
    doctor_id:int | None=None
    appointment_date:str | None=None
    status:str | None=None



# GET ALL APPOINTMENTS

@router.get("/")
def get_appointments():

    with connection.cursor() as cursor:

        cursor.execute(
            "SELECT * FROM appointments"
        )

        appointments=cursor.fetchall()


    return appointments



# GET APPOINTMENT BY ID

@router.get("/{appointment_id}")
def get_appointment(appointment_id:int):

    with connection.cursor() as cursor:

        cursor.execute(
            "SELECT * FROM appointments WHERE appointment_id=%s",
            (appointment_id,)
        )

        appointment=cursor.fetchone()


    if appointment is None:

        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )


    return appointment



# CREATE APPOINTMENT

@router.post("/")
def create_appointment(
    appointment:Appointment
):

    with connection.cursor() as cursor:

        sql="""

        INSERT INTO appointments
        (
            patient_id,
            doctor_id,
            appointment_date,
            status
        )

        VALUES
        (%s,%s,%s,%s)

        """


        cursor.execute(
            sql,
            (
                appointment.patient_id,
                appointment.doctor_id,
                appointment.appointment_date,
                appointment.status
            )
        )


        appointment_id=cursor.lastrowid


    return {

        "message":"Appointment Created Successfully",
        "appointment_id":appointment_id

    }



# UPDATE APPOINTMENT

@router.put("/{appointment_id}")
def update_appointment(
    appointment_id:int,
    appointment:Appointment
):

    with connection.cursor() as cursor:

        sql="""

        UPDATE appointments

        SET

        patient_id=%s,
        doctor_id=%s,
        appointment_date=%s,
        status=%s

        WHERE appointment_id=%s

        """


        cursor.execute(
            sql,
            (
                appointment.patient_id,
                appointment.doctor_id,
                appointment.appointment_date,
                appointment.status,
                appointment_id
            )
        )


        if cursor.rowcount==0:

            raise HTTPException(
                status_code=404,
                detail="Appointment not found"
            )


    return {
        "message":"Appointment Updated Successfully"
    }



# PATCH APPOINTMENT

@router.patch("/{appointment_id}")
def patch_appointment(
    appointment_id:int,
    appointment:AppointmentUpdate
):

    data=appointment.model_dump(
        exclude_unset=True
    )


    if not data:

        raise HTTPException(
            status_code=400,
            detail="No data provided"
        )


    fields=", ".join(
        f"{key}=%s"
        for key in data.keys()
    )


    values=list(data.values())

    values.append(appointment_id)


    sql=f"""

    UPDATE appointments

    SET {fields}

    WHERE appointment_id=%s

    """


    with connection.cursor() as cursor:

        cursor.execute(
            sql,
            values
        )


        if cursor.rowcount==0:

            raise HTTPException(
                status_code=404,
                detail="Appointment not found"
            )


    return {
        "message":"Appointment Partially Updated"
    }



# DELETE APPOINTMENT

@router.delete("/{appointment_id}")
def delete_appointment(
    appointment_id:int
):

    with connection.cursor() as cursor:

        cursor.execute(
            "DELETE FROM appointments WHERE appointment_id=%s",
            (appointment_id,)
        )


        if cursor.rowcount==0:

            raise HTTPException(
                status_code=404,
                detail="Appointment not found"
            )


    return {
        "message":"Appointment Deleted Successfully"
    }