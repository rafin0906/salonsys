from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import PackageCreate, PackageResponse
from app.services import crud

router = APIRouter(prefix="/packages", tags=["Packages"])

@router.get("", response_model=List[PackageResponse])
def read_packages(db: Session = Depends(get_db)):
    return crud.get_packages(db)

@router.post("", response_model=PackageResponse)
def create_new_package(pkg_in: PackageCreate, db: Session = Depends(get_db)):
    return crud.create_package(db, pkg_in)
