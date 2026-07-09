from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm

import pymysql

from app.security import (
    verify_password,
    create_access_token
)


print("AUTHENTICATION ROUTER LOADED")



router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)



# =====================================
# DATABASE CONNECTION
# =====================================

connection = pymysql.connect(
    host="localhost",
    user="root",
    password="info123",
    port=3310,
    database="hospital_management1",
    cursorclass=pymysql.cursors.DictCursor,
    autocommit=True
)



# =====================================
# LOGIN API
# =====================================

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):


    with connection.cursor() as cursor:


        cursor.execute(
            """
            SELECT

                a.auth_id,
                a.username,
                a.password,

                u.user_id,
                u.full_name,
                u.role


            FROM authentication a


            JOIN users u

            ON a.user_id = u.user_id


            WHERE a.username=%s

            """,
            (
                form_data.username,
            )
        )


        user = cursor.fetchone()



    if user is None:

        raise HTTPException(
            status_code=404,
            detail="Username not found"
        )



    # Password Verification

    if not verify_password(
        form_data.password,
        user["password"]
    ):


        raise HTTPException(
            status_code=401,
            detail="Incorrect password"
        )



    # Create JWT Token

    token = create_access_token(
        {
            "user_id": user["user_id"],
            "role": user["role"]
        }
    )



    return {


        "access_token": token,

        "token_type": "bearer",


        "user": {

            "user_id": user["user_id"],

            "name": user["full_name"],

            "role": user["role"]

        }

    }



# =====================================
# TEST API
# =====================================

@router.get("/")
def auth_test():

    return {
        "message": "Authentication API Working"
    }