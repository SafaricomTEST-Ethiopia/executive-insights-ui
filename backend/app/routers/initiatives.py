from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas
from ..database import get_db
from ..dependencies import get_current_user

router = APIRouter()

@router.post("/initiatives/", response_model=schemas.Initiative)
def create_initiative(
    initiative: schemas.InitiativeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_initiative(db=db, initiative=initiative)

@router.get("/initiatives/", response_model=List[schemas.Initiative])
def read_initiatives(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    initiatives = crud.get_initiatives(db, skip=skip, limit=limit)
    return initiatives

@router.patch("/initiatives/{initiative_id}/status", response_model=schemas.Initiative)
def update_initiative_status(
    initiative_id: int,
    status_update: schemas.InitiativeUpdate, # We use a schema to get status from body
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if status_update.status is None:
        raise HTTPException(status_code=400, detail="Status field is required")
    updated_initiative = crud.update_initiative_status(db, initiative_id, status_update.status)
    if updated_initiative is None:
        raise HTTPException(status_code=404, detail="Initiative not found or status is the same")
    return updated_initiative
