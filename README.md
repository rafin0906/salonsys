# Double A Hair Studio — Salon Management System

> *"we'll be there for you"*

A modern, full-stack luxury salon management ecosystem engineered for **Double A Hair Studio**. The platform pairs an artisanal client-facing reservation portal with a real-time, passcode-protected operational admin desk backed by **FastAPI** and **Supabase PostgreSQL**.

---

## 🏛️ System Architecture

```
SaloonSYS/
├── backend/                  # FastAPI Application + SQLAlchemy ORM (psycopg 3)
│   ├── app/
│   │   ├── main.py           # FastAPI entrypoint & route registration
│   │   ├── database.py       # Supabase connection & SessionLocal provider
│   │   ├── models/           # Declarative database models (Appointments, Barbers, Packages, Users)
│   │   ├── schemas/          # Pydantic validation schemas
│   │   ├── api/routers/      # Auth, Users, Barbers, Packages, Appointments, Dashboard
│   │   └── services/crud.py  # Query layer, dashboard maths & first-run seed data
│   ├── requirements.txt      # Runtime dependencies (fastapi, uvicorn, sqlalchemy, psycopg[binary])
│   ├── requirements-dev.txt  # Test dependencies (pytest, httpx)
│   └── .env.example          # Environment template
│
├── devops_pipeline.py        # Full-stack verification pipeline (see below)
│
├── frontend/
│   ├── web/                  # Luxury Client Portal (Port 5174)
│   │   ├── src/
│   │   │   ├── App.jsx       # Hero, Studio Atmosphere, Packages Menu & Google Maps
│   │   │   ├── components/   # Navbar & Live Booking Modal
│   │   │   └── services/     # REST client talking to FastAPI
│   │   └── public/assets/    # Official Double A brand assets & studio photography
│   │
│   └── admin/                # Secure Admin Operations Desk (Port 5173)
│       ├── src/
│       │   ├── App.jsx       # Operational layout with branch filter
│       │   ├── views/        # Appointments Table, Business Summary, Customers, Barbers, Packages
│       │   └── views/AdminLockView.jsx # Master Passcode Gatekeeper
│       └── public/assets/    # Official Double A admin brand assets
```

---

## ✨ Features

### 🌐 Client Discovery & Reservation Portal (`frontend/web`)
- **Luxury Brand Atmosphere**: Styled with Italian marble aesthetics, custom oval LED accents, and high-fidelity typography.
- **Curated Service Menu**: Real-time package pricing with strikethrough original rates and promotional prices in BDT (৳).
- **Zero-Friction Live Booking**: Direct reservation modal connecting straight to Supabase via FastAPI.
- **Interactive Sanctuaries**: Branch locator with embedded Google Maps directions for Rajshahi, Dhanmondi (Dhaka), and upcoming Banani suites.
- **Air-Gapped Privacy**: Absolutely zero public links or hints pointing to the administrative panel.

### 🛡️ Administrative Operations Desk (`frontend/admin`)
- **Passcode Gatekeeper**: Protected by master security authentication (`VITE_ADMIN_PASSCODE`).
- **Appointment Timetable**: Real-time overview of bookings with status toggling (`Confirmed`, `In-Service`, `Completed`, `Cancelled`).
- **Business Summary**: Daily/monthly revenue metrics, client turnover, and branch volume analytics.
- **Customer & Barber Portfolios**: Client visit histories and staff rosters with an intuitive Add Barber slide-out drawer.
- **Multi-Branch Switching**: Rapid toggle across Rajshahi Atelier, Dhanmondi Atelier, or Consolidated views.

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Python 3.11+**
- **Node.js 18+** & **npm**
- A **Supabase PostgreSQL** project

---

### 2. Backend Setup
```bash
cd backend

# Create the virtual environment and install dependencies with uv
uv venv .venv
uv pip install --python .venv -r requirements.txt -r requirements-dev.txt

# Configure environment
cp .env.example .env
# Edit .env with your Supabase database credentials:
# DATABASE_URL=postgresql+psycopg://postgres.<ref>:<password>@<host>:5432/postgres

# Run development server
.venv/Scripts/python -m uvicorn app.main:app --reload --port 8000   # Windows
# .venv/bin/python -m uvicorn app.main:app --reload --port 8000     # macOS/Linux
```

> The API probes the database on startup. If `DATABASE_URL` is missing, still a
> template, or unreachable, it logs the reason and falls back to a local
> `saloon.db` SQLite file so the server always boots.
Backend API interactive documentation will be available at `http://localhost:8000/docs`.

---

### 3. Client Web Portal Setup
```bash
cd frontend/web

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Run development server
npm run dev -- --port 5174
```
Access the client portal at `http://localhost:5174`.

---

### 4. Admin Operations Desk Setup
```bash
cd frontend/admin

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Run development server
npm run dev -- --port 5173
```
Access the protected admin desk at `http://localhost:5173`. Default master passcode: `atelier2026`.

---

## ✅ Verification Pipeline

`devops_pipeline.py` exercises every layer of the stack and exits non-zero on the
first failure, so it works as a pre-commit or CI gate:

```bash
backend/.venv/Scripts/python devops_pipeline.py    # Windows
# backend/.venv/bin/python devops_pipeline.py      # macOS/Linux
```

| Stage | What it verifies |
| --- | --- |
| `environment` | virtualenv, `node_modules` and `.env` files are in place |
| `backend` | every module byte-compiles and the FastAPI app imports |
| `api` | all 11 routes, branch filters, auth, validation and dashboard maths |
| `database` | the real Supabase instance is reachable and fully migrated |
| `frontend` | `oxlint` and a production `vite build` for both apps |
| `integration` | a real uvicorn server answering real HTTP booking requests |

API and integration stages run against a throwaway SQLite database, so the
pipeline never writes to live Supabase records. Useful flags:
`--skip-frontend` and `--skip-live-db`.

---

## 🔒 Security & Best Practices
- Sensitive database connection strings, passwords, and API credentials are kept strictly out of version control via `.gitignore`.
- Database pooling configured over `postgresql+psycopg://` for robust connection re-use.
- Cross-Origin Resource Sharing (CORS) configured on the FastAPI server to support secure local and staging environments.

---

## 📄 License
All rights reserved © 2026 Double A Hair Studio.
