from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import AppointmentCreate, AppointmentUpdate, AppointmentResponse
from app.services import crud

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.get("", response_model=List[AppointmentResponse])
def read_appointments(branch: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_appointments(db, branch=branch)

@router.post("", response_model=AppointmentResponse)
def create_new_appointment(apt_in: AppointmentCreate, db: Session = Depends(get_db)):
    return crud.create_appointment(db, apt_in)

@router.patch("/{apt_id}", response_model=AppointmentResponse)
def update_appointment_status(apt_id: str, apt_update: AppointmentUpdate, db: Session = Depends(get_db)):
    updated = crud.update_appointment(db, apt_id, apt_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return updated
