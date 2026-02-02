from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .models import InitiativeStatus, UserRole, Department

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    username: str
    role: UserRole

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

# Department Schema
class DepartmentSchema(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

# Initiative Schemas
class InitiativeBase(BaseModel):
    title: str
    description: Optional[str] = None
    department_id: int
    priority: int

class InitiativeCreate(InitiativeBase):
    pass

class InitiativeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    department_id: Optional[int] = None
    priority: Optional[int] = None
    status: Optional[InitiativeStatus] = None

class InitiativeStatusHistory(BaseModel):
    status: InitiativeStatus
    start_date: datetime
    end_date: Optional[datetime] = None

    class Config:
        from_attributes = True

class Initiative(InitiativeBase):
    id: int
    status: InitiativeStatus
    created_at: datetime
    updated_at: datetime
    department: DepartmentSchema
    history: List[InitiativeStatusHistory] = []

    class Config:
        from_attributes = True

# Dashboard Schemas
class InitiativesByStatus(BaseModel):
    status: InitiativeStatus
    count: int

class BlockedInitiative(BaseModel):
    id: int
    title: str
    days_blocked: int

class InitiativesByDepartment(BaseModel):
    department: str
    count: int

class MonthlyTrend(BaseModel):
    month: str
    count: int
