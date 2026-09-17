from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import PackageCreate, PackageUpdate, PackageResponse
from app.services import crud

router = APIRouter(prefix="/packages", tags=["Packages"])

@router.get("", response_model=List[PackageResponse])
def read_packages(db: Session = Depends(get_db)):
    return crud.get_packages(db)

@router.post("", response_model=PackageResponse)
def create_new_package(pkg_in: PackageCreate, db: Session = Depends(get_db)):
    return crud.create_package(db, pkg_in)

@router.patch("/{pkg_id}", response_model=PackageResponse)
def update_existing_package(pkg_id: str, pkg_update: PackageUpdate, db: Session = Depends(get_db)):
    updated = crud.update_package(db, pkg_id, pkg_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Package not found")
    return updated
