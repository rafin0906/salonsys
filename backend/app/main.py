import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, SessionLocal
from app.services.crud import seed_initial_data
from app.api.routers import users, barbers, packages, appointments, dashboard, auth

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("atelier_app")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize tables and seed initial records on startup
    logger.info("Initializing database schema and seed data...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_initial_data(db)
        logger.info("Database schema initialized and seed data ready.")
    finally:
        db.close()
    yield

app = FastAPI(
    title="Atelier Luxury Barber & Salon API",
    description="FastAPI backend with Supabase PostgreSQL and SQLAlchemy for Salon Management",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend Vite dev server (e.g. localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(barbers.router, prefix="/api")
app.include_router(packages.router, prefix="/api")
app.include_router(appointments.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Atelier Luxury Barber & Salon API",
        "docs": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
