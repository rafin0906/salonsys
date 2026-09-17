from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.models import User, Barber, Package, Appointment
from app.schemas.schemas import UserCreate, BarberCreate, PackageCreate, AppointmentCreate, AppointmentUpdate

TAKA = "৳"

# The studio trades in Bangladesh, so "today" must roll over at local midnight,
# not at 06:00 local, which is what a UTC day boundary would give.
STUDIO_TZ = ZoneInfo("Asia/Dhaka")


def studio_date(value=None):
    """The studio-local calendar date of a timestamp (naive values are UTC)."""
    if value is None:
        return datetime.now(STUDIO_TZ).date()
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(STUDIO_TZ).date()


def _money(amount: int) -> str:
    return f"{TAKA}{amount:,}"


def _as_int(value) -> int:
    """Visit counts and spend are stored as display strings ('12', '৳17,400')."""
    digits = "".join(ch for ch in str(value or "") if ch.isdigit())
    return int(digits) if digits else 0


# --- Users ---
def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()

def get_user_by_contact(db: Session, contact: str) -> Optional[User]:
    return db.query(User).filter(User.contact == contact).first()

def create_user(db: Session, user_in: UserCreate) -> User:
    db_user = User(**user_in.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# --- Barbers ---
def get_barbers(db: Session, branch: Optional[str] = None) -> List[Barber]:
    q = db.query(Barber)
    if branch and branch != "All Sanctuaries":
        clean_branch = branch.replace(" Atelier", "").strip()
        q = q.filter(Barber.branch.ilike(f"%{clean_branch}%"))
    return q.all()

def create_barber(db: Session, barber_in: BarberCreate) -> Barber:
    db_barber = Barber(**barber_in.model_dump())
    db.add(db_barber)
    db.commit()
    db.refresh(db_barber)
    return db_barber


# --- Packages ---
def get_packages(db: Session) -> List[Package]:
    return db.query(Package).order_by(Package.package_number).all()

def create_package(db: Session, pkg_in: PackageCreate) -> Package:
    db_pkg = Package(**pkg_in.model_dump())
    db.add(db_pkg)
    db.commit()
    db.refresh(db_pkg)
    return db_pkg


# --- Appointments ---
def get_appointments(db: Session, branch: Optional[str] = None) -> List[Appointment]:
    return _branch_filter(
        db.query(Appointment).order_by(desc(Appointment.created_at)), branch
    ).all()

def create_appointment(db: Session, apt_in: AppointmentCreate) -> Appointment:
    db_apt = Appointment(**apt_in.model_dump())
    db.add(db_apt)
    db.commit()
    db.refresh(db_apt)

    # Roll the booking into the customer ledger (create or update the patron).
    if db_apt.contact:
        user = get_user_by_contact(db, db_apt.contact)
        if user:
            user.total_visits = str(_as_int(user.total_visits) + 1)
            user.total_spent = _money(_as_int(user.total_spent) + int(db_apt.price or 0))
            user.preferred_barber = db_apt.assigned_to
        else:
            db.add(User(
                name=db_apt.customer,
                contact=db_apt.contact,
                first_service_date=db_apt.scheduled_time or studio_date().isoformat(),
                preferred_barber=db_apt.assigned_to,
                total_visits="1",
                total_spent=_money(int(db_apt.price or 0)),
            ))
        db.commit()

    return db_apt

def update_appointment(db: Session, apt_id: str, apt_update: AppointmentUpdate) -> Optional[Appointment]:
    db_apt = db.query(Appointment).filter(Appointment.id == apt_id).first()
    if not db_apt:
        return None
    if apt_update.status is not None:
        db_apt.status = apt_update.status
    if apt_update.assigned_to is not None:
        db_apt.assigned_to = apt_update.assigned_to
    if apt_update.scheduled_time is not None:
        db_apt.scheduled_time = apt_update.scheduled_time
    db.commit()
    db.refresh(db_apt)
    return db_apt


# --- Dashboard Stats ---
def _branch_filter(query, branch: Optional[str]):
    """Narrow a query to one sanctuary; 'All Sanctuaries'/None means no filter."""
    if branch and branch != "All Sanctuaries":
        clean = branch.replace(" Atelier", "").strip()
        query = query.filter(Appointment.branch.ilike(f"%{clean}%"))
    return query


def get_dashboard_summary(db: Session, branch: Optional[str] = None):
    appointments = _branch_filter(
        db.query(Appointment).order_by(desc(Appointment.created_at)), branch
    ).all()

    today = studio_date()
    todays = [a for a in appointments if a.created_at and studio_date(a.created_at) == today]
    today_revenue = sum(a.price or 0 for a in todays)

    # Real appointment volume for the trailing 7 days (oldest -> today).
    counts = []
    for offset in range(6, -1, -1):
        day = today - timedelta(days=offset)
        total = sum(1 for a in appointments if a.created_at and studio_date(a.created_at) == day)
        counts.append((day, total))

    peak = max((c for _, c in counts), default=0)
    # The UI highlights a single busiest day, so break ties on the earliest one.
    peak_index = next((i for i, (_, c) in enumerate(counts) if c == peak), -1) if peak else -1
    activity_chart = [
        {
            "day": day.strftime("%a"),
            "appointments": total,
            "bar_height": round(25 + 120 * total / peak) if peak else 25,
            "is_peak": i == peak_index,
        }
        for i, (day, total) in enumerate(counts)
    ]

    return {
        "total_customers": db.query(User).count(),
        "today_appointments": len(todays),
        "today_revenue": today_revenue,
        "total_barbers": db.query(Barber).count(),
        "revenue_formatted": _money(int(today_revenue)),
        "activity_chart": activity_chart,
        "recent_appointments": appointments[:5],
    }


# --- Seed Initial Data ---
def seed_initial_data(db: Session):
    # Seed Barbers
    if db.query(Barber).count() == 0:
        barbers = [
            Barber(name="Hasan Ali", branch="Rajshahi", contact="01711223344", dob="1991-10-12", joining_date="10 Jan 2023", role="Senior Stylist · Chair 01", rating="4.95"),
            Barber(name="Rahim Khan", branch="Dhanmondi", contact="01822334455", dob="1990-02-18", joining_date="05 Jan 2023", role="Master Barber · Chair 03", rating="4.98"),
            Barber(name="Karim Uddin", branch="Banani", contact="01933445566", dob="1996-09-22", joining_date="18 Aug 2024", role="Grooming Spec. · Chair 02", rating="4.90"),
            Barber(name="Tariqul Islam", branch="Uttara", contact="01744556677", dob="1993-07-11", joining_date="12 Nov 2023", role="Artisan Stylist · Chair 01", rating="4.92"),
            Barber(name="Sohel Rana", branch="Rajshahi", contact="01755667788", dob="1995-04-14", joining_date="01 Feb 2025", role="Master Barber · Chair 02", rating="4.96"),
            Barber(name="Mehedi Hasan", branch="Dhanmondi", contact="01866778899", dob="1997-08-30", joining_date="15 Jun 2024", role="Grooming Spec. · Chair 04", rating="4.88"),
        ]
        db.add_all(barbers)
        db.commit()

    # Seed Packages
    if db.query(Package).count() == 0:
        packages = [
            Package(package_number="01", name="Signature Atelier Cut & Beard Sculpt", actual_price=1500, discount_price=990, services=["Bespoke Scissor Cut", "Beard Trim & Hot Towel", "Head Acupressure Massage", "Cologne & Tonic Finish"]),
            Package(package_number="02", name="Executive Grooming Routine", actual_price=1200, discount_price=800, services=["Hair Cut & Styling", "Deep Cleansing Hair Wash", "Invigorating Mini-Facial", "Botanical Beard Oil"]),
            Package(package_number="03", name="Essential Maintenance Clean", actual_price=750, discount_price=500, services=["Basic Precision Hair Cut", "Straight Razor Neck Clean", "Classic Cologne Splash"]),
            Package(package_number="04", name="Royal Hair Spa & Scalp Therapy", actual_price=2400, discount_price=1800, services=["Artisanal Cranial Scrub", "Organic Steam Hair Mask", "Precision Shears Hair Cut", "Neck & Shoulder Release"]),
        ]
        db.add_all(packages)
        db.commit()

    # Seed Users
    if db.query(User).count() == 0:
        users = [
            User(name="Tanvir Hossain", contact="01898765432", dob="1992-11-24", first_service_date="2025-08-14", tier="Executive Member", total_visits="12", total_spent="৳17,400", preferred_barber="Hasan Ali"),
            User(name="Arifur Rahman", contact="01655443322", dob="1985-03-15", first_service_date="2024-12-10", tier="Regular Client", total_visits="8", total_spent="৳8,800", preferred_barber="Rahim Khan"),
            User(name="Sajid Hasan", contact="01911223344", dob="2001-07-20", first_service_date="2026-02-18", tier="Atelier Guest", total_visits="4", total_spent="৳7,200", preferred_barber="Karim Uddin"),
            User(name="Farhan Kabir", contact="01755667788", dob="1995-09-30", first_service_date="2025-05-04", tier="Executive Member", total_visits="9", total_spent="৳11,500", preferred_barber="Hasan Ali"),
            User(name="Mahmudul Karim", contact="01333444555", dob="1990-12-05", first_service_date="2025-10-19", tier="Regular Client", total_visits="6", total_spent="৳6,900", preferred_barber="Rahim Khan"),
        ]
        db.add_all(users)
        db.commit()

    # Seed Appointments
    if db.query(Appointment).count() == 0:
        appointments = [
            Appointment(customer="Tanvir Hossain", contact="01898765432", package="Executive Grooming Routine", price=800, assigned_to="Hasan Ali", branch="Rajshahi Atelier", scheduled_time="Today 10:30 AM", status="In-Service"),
            Appointment(customer="Arifur Rahman", contact="01655443322", package="Signature Atelier Cut & Beard Sculpt", price=990, assigned_to="Rahim Khan", branch="Dhanmondi Atelier", scheduled_time="Today 11:45 AM", status="Confirmed"),
            Appointment(customer="Sajid Hasan", contact="01911223344", package="Royal Hair Spa & Scalp Therapy", price=1800, assigned_to="Karim Uddin", branch="Banani Atelier", scheduled_time="Today 01:15 PM", status="Confirmed"),
            Appointment(customer="Farhan Kabir", contact="01755667788", package="Essential Maintenance Clean", price=500, assigned_to="Hasan Ali", branch="Rajshahi Atelier", scheduled_time="Today 02:30 PM", status="Confirmed"),
            Appointment(customer="Mahmudul Karim", contact="01333444555", package="Signature Atelier Cut & Beard Sculpt", price=990, assigned_to="Rahim Khan", branch="Dhanmondi Atelier", scheduled_time="Today 04:00 PM", status="Completed"),
        ]
        db.add_all(appointments)
        db.commit()
