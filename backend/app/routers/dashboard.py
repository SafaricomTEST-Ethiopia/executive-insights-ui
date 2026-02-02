from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import List
from datetime import datetime, timedelta

from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_executive_user

router = APIRouter()

@router.get("/top-initiatives", response_model=List[schemas.Initiative])
def get_top_initiatives(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_executive_user)):
    return db.query(models.Initiative).order_by(models.Initiative.priority.desc()).limit(5).all()

@router.get("/initiatives-by-status", response_model=List[schemas.InitiativesByStatus])
def get_initiatives_by_status(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_executive_user)):
    return db.query(models.Initiative.status, func.count(models.Initiative.id).label("count"))\
        .group_by(models.Initiative.status).all()

@router.get("/blocked-initiatives", response_model=List[schemas.BlockedInitiative])
def get_blocked_initiatives(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_executive_user)):
    now = datetime.utcnow()
    results = db.query(
        models.Initiative.id,
        models.Initiative.title,
        func.max(case([(models.InitiativeStatusHistory.end_date == None, now - models.InitiativeStatusHistory.start_date)], else_=timedelta(0))).label("days_blocked_delta")
    ).join(models.InitiativeStatusHistory)\
    .filter(models.Initiative.status == models.InitiativeStatus.BLOCKED)\
    .group_by(models.Initiative.id, models.Initiative.title).all()

    blocked_initiatives = []
    for r in results:
        blocked_initiatives.append({
            "id": r.id,
            "title": r.title,
            "days_blocked": r.days_blocked_delta.days if r.days_blocked_delta else 0
        })
    return blocked_initiatives

@router.get("/initiatives-by-department", response_model=List[schemas.InitiativesByDepartment])
def get_initiatives_by_department(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_executive_user)):
    results = db.query(models.Department.name, func.count(models.Initiative.id).label("count"))\
        .join(models.Initiative, models.Department.id == models.Initiative.department_id)\
        .group_by(models.Department.name).all()
    return [{"department": r[0], "count": r[1]} for r in results]

@router.get("/monthly-trend", response_model=List[schemas.MonthlyTrend])
def get_monthly_trend(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_executive_user)):
    sixty_days_ago = datetime.utcnow() - timedelta(days=60)
    results = db.query(
        func.date_trunc("month", models.Initiative.created_at).label("month"),
        func.count(models.Initiative.id).label("count")
    ).filter(models.Initiative.created_at >= sixty_days_ago)\
    .group_by(func.date_trunc("month", models.Initiative.created_at))\
    .order_by(func.date_trunc("month", models.Initiative.created_at)).all()
    return [{"month": r.month.strftime("%Y-%m"), "count": r.count} for r in results]
