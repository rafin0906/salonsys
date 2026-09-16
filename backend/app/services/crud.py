from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.models import User, Barber, Package, Appointment
from app.schemas.schemas import UserCreate, BarberCreate, PackageCreate, AppointmentCreate, AppointmentUpdate

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
    q = db.query(Appointment).order_by(desc(Appointment.created_at))
    if branch and branch != "All Sanctuaries":
        clean_branch = branch.replace(" Atelier", "").strip()
        q = q.filter(Appointment.branch.ilike(f"%{clean_branch}%"))
    return q.all()

def create_appointment(db: Session, apt_in: AppointmentCreate) -> Appointment:
    db_apt = Appointment(**apt_in.model_dump())
    db.add(db_apt)
    db.commit()
    db.refresh(db_apt)

    # Check if user exists or update visits
    user = get_user_by_contact(db, db_apt.contact) if db_apt.contact else None
    if user:
        try:
            visits = int(user.total_visits) + 1
            user.total_visits = str(visits)
            db.commit()
        except Exception:
            pass
    elif db_apt.contact:
        new_u = User(
            name=db_apt.customer,
            contact=db_apt.contact,
            first_service_date=db_apt.scheduled_time or "2026-09-16",
            preferred_barber=db_apt.assigned_to,
            total_visits="1",
            total_spent=f"৳{int(db_apt.price):,}"
        )
        db.add(new_u)
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
def get_dashboard_summary(db: Session, branch: Optional[str] = None):
    total_customers = db.query(User).count()
    barbers_count = db.query(Barber).count()
    
    appointments_q = db.query(Appointment)
    if branch and branch != "All Sanctuaries":
        clean = branch.replace(" Atelier", "").strip()
        appointments_q = appointments_q.filter(Appointment.branch.ilike(f"%{clean}%"))
        
    all_apts = appointments_q.all()
    today_count = len(all_apts)
    today_revenue = sum(a.price for a in all_apts)
    recent_five = all_apts[:5]

    activity_chart = [
        {"day": "Mon", "appointments": 14, "bar_height": 90},
        {"day": "Tue", "appointments": 18, "bar_height": 105},
        {"day": "Wed", "appointments": 12, "bar_height": 75},
        {"day": "Thu", "appointments": 22, "bar_height": 120},
        {"day": "Fri", "appointments": 25, "bar_height": 130},
        {"day": "Sat", "appointments": 31, "bar_height": 145, "is_peak": True},
        {"day": "Sun", "appointments": 27, "bar_height": 135},
    ]

    return {
        "total_customers": total_customers or 126,
        "today_appointments": today_count or 23,
        "today_revenue": today_revenue or 8450.0,
        "total_barbers": barbers_count or 6,
        "revenue_formatted": f"৳{int(today_revenue or 8450):,}",
        "activity_chart": activity_chart,
        "recent_appointments": recent_five
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
