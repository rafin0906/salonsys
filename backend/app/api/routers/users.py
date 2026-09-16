from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import UserCreate, UserResponse
from app.services import crud

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("", response_model=List[UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)

@router.post("", response_model=UserResponse)
def create_new_user(user_in: UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user_in)
