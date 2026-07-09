from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.routers import users
from app.routers import patients
from app.routers import doctors
from app.routers import appointments
from app.routers import admissions
from app.routers import billing
from app.routers import laboratory
from app.routers import inventory
from app.routers import medical_records
from app.routers import prescriptions
from app.routers import insurance_claims
from app.routers import dashboard
from app.routers import combine
from app.routers import auth

from app.database import engine
from app.models import Base


print("Main file loaded")


# ==================================
# Create FastAPI Application
# ==================================

app = FastAPI(
    title="Hospital Management System",
    version="1.0"
)



# ==================================
# Database Table Creation
# ==================================

#Base.metadata.create_all(bind=engine)



# ==================================
# CORS Configuration
# ==================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)



# ==================================
# Register Routers
# ==================================



app.include_router(users.router)

app.include_router(patients.router)

app.include_router(doctors.router)

app.include_router(appointments.router)

app.include_router(admissions.router)

app.include_router(billing.router)

app.include_router(laboratory.router)

app.include_router(inventory.router)

app.include_router(medical_records.router)

app.include_router(prescriptions.router)

app.include_router(insurance_claims.router)

app.include_router(dashboard.router)

app.include_router(combine.router)

app.include_router(auth.router)



# ==================================
# Home API
# ==================================

@app.get("/")
def home():

    return {
        "message": "Hospital Management API Running"
    }