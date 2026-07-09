from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pymysql


print("Inventory file loaded")


router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
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



# =====================
# Schemas
# =====================


class Inventory(BaseModel):

    item_name:str
    quantity:int
    supplier:str
    price:float



class InventoryUpdate(BaseModel):

    item_name:str | None = None
    quantity:int | None = None
    supplier:str | None = None
    price:float | None = None




# =====================
# GET ALL ITEMS
# =====================

@router.get("/")
def get_inventory():

    connection=get_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute(
                "SELECT * FROM inventory"
            )

            items=cursor.fetchall()


        return items


    finally:

        connection.close()





# =====================
# GET ITEM BY ID
# =====================

@router.get("/{item_id}")
def get_item(item_id:int):

    connection=get_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute(
                "SELECT * FROM inventory WHERE item_id=%s",
                (item_id,)
            )

            item=cursor.fetchone()


    finally:

        connection.close()



    if item is None:

        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )


    return item





# =====================
# CREATE ITEM
# =====================

@router.post("/")
def create_item(item:Inventory):

    connection=get_connection()

    try:

        with connection.cursor() as cursor:


            sql="""

            INSERT INTO inventory
            (
            item_name,
            quantity,
            supplier,
            price
            )

            VALUES
            (%s,%s,%s,%s)

            """


            cursor.execute(
                sql,
                (
                    item.item_name,
                    item.quantity,
                    item.supplier,
                    item.price
                )
            )


            item_id=cursor.lastrowid


        connection.commit()


    finally:

        connection.close()



    return {

        "message":"Inventory Item Created Successfully",
        "item_id":item_id

    }





# =====================
# UPDATE ITEM
# =====================

@router.put("/{item_id}")
def update_item(
    item_id:int,
    item:Inventory
):

    connection=get_connection()

    try:

        with connection.cursor() as cursor:


            sql="""

            UPDATE inventory

            SET

            item_name=%s,
            quantity=%s,
            supplier=%s,
            price=%s

            WHERE item_id=%s

            """


            cursor.execute(
                sql,
                (
                    item.item_name,
                    item.quantity,
                    item.supplier,
                    item.price,
                    item_id
                )
            )


            if cursor.rowcount==0:

                raise HTTPException(
                    status_code=404,
                    detail="Item not found"
                )


        connection.commit()


    finally:

        connection.close()



    return {

        "message":"Inventory Item Updated Successfully"

    }





# =====================
# PATCH ITEM
# =====================

@router.patch("/{item_id}")
def patch_item(
    item_id:int,
    item:InventoryUpdate
):

    data=item.model_dump(
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

    values.append(item_id)



    sql=f"""

    UPDATE inventory

    SET {fields}

    WHERE item_id=%s

    """



    connection=get_connection()


    try:

        with connection.cursor() as cursor:

            cursor.execute(
                sql,
                values
            )


            if cursor.rowcount==0:

                raise HTTPException(
                    status_code=404,
                    detail="Item not found"
                )


        connection.commit()


    finally:

        connection.close()



    return {

        "message":"Inventory Item Partially Updated"

    }





# =====================
# DELETE ITEM
# =====================

@router.delete("/{item_id}")
def delete_item(item_id:int):

    connection=get_connection()


    try:

        with connection.cursor() as cursor:


            cursor.execute(
                "DELETE FROM inventory WHERE item_id=%s",
                (item_id,)
            )


            if cursor.rowcount==0:

                raise HTTPException(
                    status_code=404,
                    detail="Item not found"
                )


        connection.commit()


    finally:

        connection.close()



    return {

        "message":"Inventory Item Deleted Successfully"

    }