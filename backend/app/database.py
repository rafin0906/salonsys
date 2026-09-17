import os
import logging
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

logger = logging.getLogger("saloon_api")

SQLITE_URL = "sqlite:///./saloon.db"
PLACEHOLDERS = ("[YOUR-PASSWORD]", "your-db-password", "your-project-ref", "your-pooler-host")

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()


def _make_sqlite_engine():
    return create_engine(SQLITE_URL, connect_args={"check_same_thread": False})


if not DATABASE_URL or any(p in DATABASE_URL for p in PLACEHOLDERS):
    logger.warning(
        "DATABASE_URL is missing or still contains a template placeholder. "
        "Falling back to local SQLite database '%s'. "
        "Copy the project 'env' file to backend/.env to connect to Supabase.",
        SQLITE_URL,
    )
    DATABASE_URL = SQLITE_URL
    engine = _make_sqlite_engine()
else:
    # Ensure correct driver format for psycopg 3
    if DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

    # create_engine() is lazy, so probe the connection here — otherwise an
    # unreachable database only surfaces as a 500 on the first request.
    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=300)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Connected to PostgreSQL at %s", DATABASE_URL.rsplit("@", 1)[-1])
    except Exception as exc:
        logger.error("Could not reach PostgreSQL (%s). Falling back to SQLite.", exc)
        DATABASE_URL = SQLITE_URL
        engine = _make_sqlite_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
