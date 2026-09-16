from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

# User Schemas
class UserBase(BaseModel):
    name: str
    contact: str
    dob: Optional[str] = None
    first_service_date: Optional[str] = None
    tier: Optional[str] = "Atelier Patron"
    total_visits: Optional[str] = "1"
    total_spent: Optional[str] = "৳0"
    preferred_barber: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# Barber Schemas
class BarberBase(BaseModel):
    name: str
    contact: str
    dob: Optional[str] = None
    joining_date: Optional[str] = None
    branch: str = "Rajshahi"
    role: Optional[str] = "Senior Stylist"
    rating: Optional[str] = "4.95"

class BarberCreate(BarberBase):
    pass

class BarberResponse(BarberBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# Package Schemas
class PackageBase(BaseModel):
    name: str
    services: List[str] = []
    actual_price: float
    discount_price: float
    package_number: Optional[str] = "01"

class PackageCreate(PackageBase):
    pass

class PackageResponse(PackageBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# Appointment Schemas
class AppointmentBase(BaseModel):
    customer: str
    package: str
    price: float
    assigned_to: str
    contact: Optional[str] = None
    status: Optional[str] = "Confirmed"
    branch: Optional[str] = "Rajshahi Atelier"
    scheduled_time: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    scheduled_time: Optional[str] = None

class AppointmentResponse(AppointmentBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# Dashboard Schemas
class DashboardSummary(BaseModel):
    total_customers: int
    today_appointments: int
    today_revenue: float
    total_barbers: int
    revenue_formatted: str
    activity_chart: List[dict]
    recent_appointments: List[AppointmentResponse]


# Auth Schemas
class AdminLoginRequest(BaseModel):
    passcode: str

class AdminLoginResponse(BaseModel):
    authenticated: bool
    token: Optional[str] = None
    message: str
