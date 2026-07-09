from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pymysql

from app.security import (
    hash_password,
    verify_password,
    create_access_token
)


print("authentication.py loaded")


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
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



# Schemas

class Auth(BaseModel):
    user_id:int
    username:str
    password:str



class Login(BaseModel):
    username:str
    password:str



class AuthUpdate(BaseModel):
    username:str | None = None
    password:str | None = None



# REGISTER

@router.post("/register")
def register(auth:Auth):

    hashed_password = hash_password(
        auth.password
    )


    with connection.cursor() as cursor:

        cursor.execute(
            """
            INSERT INTO authentication
            (
                user_id,
                username,
                password
            )

            VALUES
            (%s,%s,%s)
            """,
            (
                auth.user_id,
                auth.username,
                hashed_password
            )
        )


    return {
        "message":"User Registered Successfully"
    }




# LOGIN

@router.post("/login")
def login(auth:Login):

    with connection.cursor() as cursor:

        cursor.execute(
            """
            SELECT *
            FROM authentication
            WHERE username=%s
            """,
            (auth.username,)
        )

        user = cursor.fetchone()



    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )



    if not verify_password(
        auth.password,
        user["password"]
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )



    token = create_access_token(
        {
            "username":user["username"]
        }
    )


    return {
        "message":"Login Successful",
        "access_token":token,
        "token_type":"bearer"
    }




# GET ALL USERS

@router.get("/")
def get_all_auth():

    with connection.cursor() as cursor:

        cursor.execute(
            """
            SELECT
            auth_id,
            user_id,
            username
            FROM authentication
            """
        )

        data = cursor.fetchall()


    return data




# GET BY ID

@router.get("/{auth_id}")
def get_auth(auth_id:int):

    with connection.cursor() as cursor:

        cursor.execute(
            """
            SELECT
            auth_id,
            user_id,
            username
            FROM authentication
            WHERE auth_id=%s
            """,
            (auth_id,)
        )

        data = cursor.fetchone()



    if not data:

        raise HTTPException(
            status_code=404,
            detail="Authentication Not Found"
        )


    return data




# UPDATE

@router.put("/{auth_id}")
def update_auth(
    auth_id:int,
    auth:AuthUpdate
):

    with connection.cursor() as cursor:


        if auth.password:

            new_password = hash_password(
                auth.password
            )

            cursor.execute(
                """
                UPDATE authentication

                SET username=%s,
                password=%s

                WHERE auth_id=%s
                """,
                (
                    auth.username,
                    new_password,
                    auth_id
                )
            )

        else:

            cursor.execute(
                """
                UPDATE authentication

                SET username=%s

                WHERE auth_id=%s
                """,
                (
                    auth.username,
                    auth_id
                )
            )



        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Authentication Not Found"
            )


    return {
        "message":"Authentication Updated"
    }




# DELETE

@router.delete("/{auth_id}")
def delete_auth(auth_id:int):

    with connection.cursor() as cursor:

        cursor.execute(
            """
            DELETE FROM authentication
            WHERE auth_id=%s
            """,
            (auth_id,)
        )


        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Authentication Not Found"
            )


    return {
        "message":"Authentication Deleted"
    }