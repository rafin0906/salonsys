from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import DashboardSummary
from app.services import crud

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummary)
def read_dashboard_summary(branch: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_dashboard_summary(db, branch=branch)
