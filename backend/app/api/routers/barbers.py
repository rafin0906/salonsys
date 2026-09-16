from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import BarberCreate, BarberResponse
from app.services import crud

router = APIRouter(prefix="/barbers", tags=["Barbers"])

@router.get("", response_model=List[BarberResponse])
def read_barbers(branch: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_barbers(db, branch=branch)

@router.post("", response_model=BarberResponse)
def create_new_barber(barber_in: BarberCreate, db: Session = Depends(get_db)):
    return crud.create_barber(db, barber_in)
