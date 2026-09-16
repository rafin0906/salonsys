import os
from fastapi import APIRouter, HTTPException
from app.schemas.schemas import AdminLoginRequest, AdminLoginResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

ADMIN_SECRET = os.getenv("ADMIN_SECRET_KEY", "atelier2026")

@router.post("/verify-passcode", response_model=AdminLoginResponse)
def verify_admin_passcode(payload: AdminLoginRequest):
    if payload.passcode == ADMIN_SECRET:
        return AdminLoginResponse(
            authenticated=True,
            token="atelier-session-token-authorized",
            message="Admin authentication successful"
        )
    raise HTTPException(status_code=401, detail="Invalid admin passcode")
