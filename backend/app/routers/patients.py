from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pymysql


print("========== PATIENTS ROUTER LOADED ==========")


router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
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



class Patient(BaseModel):

    name:str
    age:int
    gender:str
    phone:str
    disease:str




# GET ALL

@router.get("/")
def get_patients():

    connection=get_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute(
                "SELECT * FROM patients"
            )

            data=cursor.fetchall()


        return data


    finally:

        connection.close()





# CREATE

@router.post("/")
def create_patient(patient:Patient):

    connection=get_connection()

    try:

        with connection.cursor() as cursor:

            sql="""

            INSERT INTO patients
            (
            name,
            age,
            gender,
            phone,
            disease
            )

            VALUES(%s,%s,%s,%s,%s)

            """


            cursor.execute(
                sql,
                (
                    patient.name,
                    patient.age,
                    patient.gender,
                    patient.phone,
                    patient.disease
                )
            )


        connection.commit()


    finally:

        connection.close()



    return {
        "message":"Patient Added Successfully"
    }





# UPDATE

@router.put("/{patient_id}")
def update_patient(
    patient_id:int,
    patient:Patient
):

    connection=get_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute(
                """
                UPDATE patients SET

                name=%s,
                age=%s,
                gender=%s,
                phone=%s,
                disease=%s

                WHERE patient_id=%s

                """,
                (
                    patient.name,
                    patient.age,
                    patient.gender,
                    patient.phone,
                    patient.disease,
                    patient_id
                )
            )


            if cursor.rowcount == 0:

                raise HTTPException(
                    status_code=404,
                    detail="Patient not found"
                )


        connection.commit()


    except Exception as e:

        connection.rollback()
        raise e


    finally:

        connection.close()



    return {
        "message":"Patient Updated Successfully"
    }


# DELETE

@router.delete("/{patient_id}")
def delete_patient(patient_id:int):

    connection=get_connection()


    try:

        with connection.cursor() as cursor:


            cursor.execute(
                "DELETE FROM patients WHERE patient_id=%s",
                (patient_id,)
            )


            if cursor.rowcount == 0:

                raise HTTPException(
                    status_code=404,
                    detail="Patient not found"
                )


        connection.commit()


    except Exception as e:

        connection.rollback()
        raise e


    finally:

        connection.close()



    return {
        "message":"Patient Deleted Successfully"
    }