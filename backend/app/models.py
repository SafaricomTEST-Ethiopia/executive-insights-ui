from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from .database import Base
import enum
from datetime import datetime

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    initiatives = relationship("Initiative", back_populates="department")

class UserRole(str, enum.Enum):
    USER = "USER"
    EXECUTIVE = "EXECUTIVE"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLAlchemyEnum(UserRole), nullable=False, default=UserRole.USER)

class InitiativeStatus(str, enum.Enum):
    NEW = "NEW"
    IN_PROGRESS = "IN_PROGRESS"
    BLOCKED = "BLOCKED"
    DELIVERED = "DELIVERED"

class Initiative(Base):
    __tablename__ = "initiatives"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String)
    priority = Column(Integer, default=0)
    status = Column(SQLAlchemyEnum(InitiativeStatus), default=InitiativeStatus.NEW, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    department = relationship("Department", back_populates="initiatives")
    history = relationship("InitiativeStatusHistory", back_populates="initiative", cascade="all, delete-orphan")

class InitiativeStatusHistory(Base):
    __tablename__ = "initiative_status_history"
    id = Column(Integer, primary_key=True, index=True)
    initiative_id = Column(Integer, ForeignKey("initiatives.id"))
    status = Column(SQLAlchemyEnum(InitiativeStatus), nullable=False)
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime)

    initiative = relationship("Initiative", back_populates="history")
