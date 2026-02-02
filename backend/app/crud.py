from sqlalchemy.orm import Session
from . import models, schemas, auth
from datetime import datetime

# User CRUD
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Initiative CRUD
def create_initiative(db: Session, initiative: schemas.InitiativeCreate):
    db_initiative = models.Initiative(**initiative.dict())
    db.add(db_initiative)
    db.commit()
    # Add initial status history
    history_entry = models.InitiativeStatusHistory(
        initiative_id=db_initiative.id,
        status=db_initiative.status
    )
    db.add(history_entry)
    db.commit()
    db.refresh(db_initiative)
    return db_initiative

def get_initiatives(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Initiative).offset(skip).limit(limit).all()

def get_initiative(db: Session, initiative_id: int):
    return db.query(models.Initiative).filter(models.Initiative.id == initiative_id).first()

def update_initiative_status(db: Session, initiative_id: int, status: models.InitiativeStatus):
    db_initiative = get_initiative(db, initiative_id)
    if not db_initiative or db_initiative.status == status:
        return None

    now = datetime.utcnow()

    # End current status
    current_history = db.query(models.InitiativeStatusHistory)\
        .filter(models.InitiativeStatusHistory.initiative_id == initiative_id)\
        .filter(models.InitiativeStatusHistory.end_date == None)\
        .first()
    if current_history:
        current_history.end_date = now

    # Update initiative status
    db_initiative.status = status
    db_initiative.updated_at = now

    # Add new status history
    new_history_entry = models.InitiativeStatusHistory(
        initiative_id=initiative_id,
        status=status,
        start_date=now
    )
    db.add(new_history_entry)
    db.commit()
    db.refresh(db_initiative)
    return db_initiative
