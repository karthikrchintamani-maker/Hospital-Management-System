from pydantic import BaseModel
from typing import Optional


# ==================================================
# USER SCHEMAS
# ==================================================

class UserCreate(BaseModel):

    full_name: str
    email: str
    password: str
    role: str



class UserResponse(BaseModel):

    user_id: int
    full_name: str
    email: str
    role: str


    class Config:
        from_attributes = True



# ==================================================
# AUTHENTICATION SCHEMAS
# ==================================================

class AuthenticationCreate(BaseModel):

    user_id: int
    username: str
    password: str



class AuthenticationResponse(BaseModel):

    auth_id: int
    user_id: int
    username: str


    class Config:
        from_attributes = True



# ==================================================
# PATIENT SCHEMAS
# ==================================================

class PatientCreate(BaseModel):

    name: str
    age: int
    gender: str
    phone: str
    disease: str



class PatientUpdate(BaseModel):

    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    disease: Optional[str] = None



class PatientResponse(BaseModel):

    patient_id: int
    name: str
    age: int
    gender: str
    phone: str
    disease: str


    class Config:
        from_attributes = True



# ==================================================
# DOCTOR SCHEMAS
# ==================================================

class DoctorCreate(BaseModel):

    name: str
    specialization: str
    phone: str
    email: str



class DoctorUpdate(BaseModel):

    name: Optional[str] = None
    specialization: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None



class DoctorResponse(BaseModel):

    doctor_id: int
    name: str
    specialization: str
    phone: str
    email: str


    class Config:
        from_attributes = True



# ==================================================
# APPOINTMENT SCHEMAS
# ==================================================

class AppointmentCreate(BaseModel):

    patient_id: int
    doctor_id: int
    appointment_date: str
    status: str



class AppointmentUpdate(BaseModel):

    patient_id: Optional[int] = None
    doctor_id: Optional[int] = None
    appointment_date: Optional[str] = None
    status: Optional[str] = None



class AppointmentResponse(BaseModel):

    appointment_id: int
    patient_id: int
    doctor_id: int
    appointment_date: str
    status: str


    class Config:
        from_attributes = True



# ==================================================
# ADMISSION SCHEMAS
# ==================================================

class AdmissionCreate(BaseModel):

    patient_id: int
    room_no: str
    admission_date: str
    discharge_date: Optional[str] = None



class AdmissionUpdate(BaseModel):

    patient_id: Optional[int] = None
    room_no: Optional[str] = None
    admission_date: Optional[str] = None
    discharge_date: Optional[str] = None



class AdmissionResponse(BaseModel):

    admission_id: int
    patient_id: int
    room_no: str
    admission_date: str
    discharge_date: Optional[str] = None


    class Config:
        from_attributes = True



# ==================================================
# BILLING SCHEMAS
# ==================================================

class BillingCreate(BaseModel):

    patient_id: int
    amount: float
    payment_status: str



class BillingUpdate(BaseModel):

    patient_id: Optional[int] = None
    amount: Optional[float] = None
    payment_status: Optional[str] = None



class BillingResponse(BaseModel):

    bill_id: int
    patient_id: int
    amount: float
    payment_status: str


    class Config:
        from_attributes = True



# ==================================================
# LABORATORY SCHEMAS
# ==================================================

class LaboratoryCreate(BaseModel):

    patient_id: int
    test_name: str
    result: str
    test_date: str



class LaboratoryUpdate(BaseModel):

    patient_id: Optional[int] = None
    test_name: Optional[str] = None
    result: Optional[str] = None
    test_date: Optional[str] = None



class LaboratoryResponse(BaseModel):

    lab_id: int
    patient_id: int
    test_name: str
    result: str
    test_date: str


    class Config:
        from_attributes = True



# ==================================================
# INVENTORY SCHEMAS
# ==================================================

class InventoryCreate(BaseModel):

    item_name: str
    quantity: int
    supplier: str



class InventoryUpdate(BaseModel):

    item_name: Optional[str] = None
    quantity: Optional[int] = None
    supplier: Optional[str] = None



class InventoryResponse(BaseModel):

    item_id: int
    item_name: str
    quantity: int
    supplier: str


    class Config:
        from_attributes = True



# ==================================================
# MEDICAL RECORD SCHEMAS
# ==================================================

class MedicalRecordCreate(BaseModel):

    patient_id: int
    diagnosis: str
    treatment: str
    record_date: str



class MedicalRecordUpdate(BaseModel):

    diagnosis: Optional[str] = None
    treatment: Optional[str] = None
    record_date: Optional[str] = None



class MedicalRecordResponse(BaseModel):

    record_id: int
    patient_id: int
    diagnosis: str
    treatment: str
    record_date: str


    class Config:
        from_attributes = True



# ==================================================
# PRESCRIPTION SCHEMAS
# ==================================================

class PrescriptionCreate(BaseModel):

    patient_id: int
    medicine: str
    dosage: str
    prescription_date: str



class PrescriptionUpdate(BaseModel):

    medicine: Optional[str] = None
    dosage: Optional[str] = None
    prescription_date: Optional[str] = None



class PrescriptionResponse(BaseModel):

    prescription_id: int
    patient_id: int
    medicine: str
    dosage: str
    prescription_date: str


    class Config:
        from_attributes = True



# ==================================================
# INSURANCE CLAIM SCHEMAS
# ==================================================

class InsuranceClaimCreate(BaseModel):

    patient_id: int
    insurance_company: str
    claim_amount: float
    status: str



class InsuranceClaimUpdate(BaseModel):

    patient_id: Optional[int] = None
    insurance_company: Optional[str] = None
    claim_amount: Optional[float] = None
    status: Optional[str] = None



class InsuranceClaimResponse(BaseModel):

    claim_id: int
    patient_id: int
    insurance_company: str
    claim_amount: float
    status: str


    class Config:
        from_attributes = True