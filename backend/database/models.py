from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    age = Column(Integer, nullable=True)
    health_conditions = Column(JSON, nullable=True) # e.g. ["kidney_disease", "diabetes"]
    created_at = Column(DateTime, default=datetime.utcnow)
    
    history = relationship("InteractionHistory", back_populates="user")

class InteractionHistory(Base):
    __tablename__ = "interaction_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    medications = Column(JSON)
    max_severity = Column(String)
    issue_count = Column(Integer)
    report_data = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="history")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    action = Column(String)
    user_id = Column(Integer, nullable=True)
    details = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
