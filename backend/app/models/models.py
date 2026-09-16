import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, JSON
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    # Required fields from user specification
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False, index=True)
    contact = Column(String, nullable=False, index=True)
    dob = Column(String, nullable=True)
    first_service_date = Column(String, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Extra fields added for Frontend Dashboard fidelity:
    tier = Column(String, default="Atelier Patron")
    total_visits = Column(String, default="1")
    total_spent = Column(String, default="৳0")
    preferred_barber = Column(String, nullable=True)


class Barber(Base):
    __tablename__ = "barbers"

    # Required fields from user specification
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False, index=True)
    contact = Column(String, nullable=False)
    dob = Column(String, nullable=True)
    joining_date = Column(String, nullable=True)
    branch = Column(String, nullable=False, default="Rajshahi")
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Extra fields added for Frontend Dashboard fidelity:
    role = Column(String, default="Senior Stylist")
    rating = Column(String, default="4.95")


class Package(Base):
    __tablename__ = "packages"

    # Required fields from user specification
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    services = Column(JSON, default=list)  # list of services
    actual_price = Column(Float, nullable=False)
    discount_price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Extra fields added for Frontend Dashboard fidelity:
    package_number = Column(String, default="01")


class Appointment(Base):
    __tablename__ = "appointments"

    # Required fields from user specification
    id = Column(String, primary_key=True, default=generate_uuid)
    customer = Column(String, nullable=False, index=True)
    package = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    assigned_to = Column(String, nullable=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Extra fields added for Frontend Dashboard fidelity:
    contact = Column(String, nullable=True)
    status = Column(String, default="Confirmed")  # 'Confirmed', 'In-Service', 'Completed', 'Cancelled'
    branch = Column(String, default="Rajshahi Atelier")
    scheduled_time = Column(String, nullable=True)
