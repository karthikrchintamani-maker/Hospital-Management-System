from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta



# =====================================
# JWT CONFIGURATION
# =====================================

SECRET_KEY = "hospital_management_secret"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60



# =====================================
# PASSWORD ENCRYPTION
# =====================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)



# =====================================
# HASH PASSWORD
# =====================================

def hash_password(password: str):

    if len(password.encode("utf-8")) > 72:
        password = password[:72]

    return pwd_context.hash(password)


# =====================================
# VERIFY PASSWORD
# =====================================

def verify_password(
        plain_password: str,
        hashed_password: str
):

    return pwd_context.verify(
        plain_password,
        hashed_password
    )



# =====================================
# CREATE JWT TOKEN
# =====================================

def create_access_token(data: dict):

    to_encode = data.copy()


    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )


    to_encode.update(
        {
            "exp": expire
        }
    )


    token = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


    return token



# =====================================
# DECODE JWT TOKEN
# =====================================

def decode_access_token(token: str):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )


        return payload


    except JWTError:

        return None



# =====================================
# TEST FUNCTION
# =====================================

if __name__ == "__main__":

    password = "admin123"


    hashed = hash_password(password)


    print("Original Password:")
    print(password)


    print("\nHashed Password:")
    print(hashed)


    print("\nPassword Verification:")

    print(
        verify_password(
            password,
            hashed
        )
    )


    token = create_access_token(
        {
            "user_id":1,
            "role":"admin"
        }
    )


    print("\nJWT Token:")
    print(token)