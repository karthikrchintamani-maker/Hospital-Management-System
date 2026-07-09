from sqlalchemy import Column, Integer, String
from app.database import Base


class User(Base):

    __tablename__ = "users"

    user_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    full_name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(100),
        unique=True
    )

    password = Column(
        String(255)
    )

    role = Column(
        String(50)
    )



class Patient(Base):

    __tablename__ = "patients"

    patient_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100)
    )

    age = Column(
        Integer
    )

    gender = Column(
        String(20)
    )

    phone = Column(
        String(15)
    )

    disease = Column(
        String(100)
    )