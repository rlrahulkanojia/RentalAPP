import logging
from sqlalchemy.orm import Session

from app import crud, schemas
from app.core.config import settings
from app.db.session import Base, engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_db(db: Session) -> None:
    # Create tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")

    # Create initial admin user if it doesn't exist
    user = crud.user.get_by_email(db, email="admin@example.com")
    if not user:
        user_in = schemas.UserCreate(
            email="admin@example.com",
            password="admin123",
            full_name="Admin User",
            is_property_owner=True,
            is_active=True,
        )
        user = crud.user.create(db, obj_in=user_in)
        logger.info("Initial admin user created")


def main() -> None:
    from app.db.session import SessionLocal
    db = SessionLocal()
    init_db(db)


if __name__ == "__main__":
    logger.info("Creating initial data")
    main()
    logger.info("Initial data created")
