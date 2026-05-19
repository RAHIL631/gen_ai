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

class Medication(Base):
    __tablename__ = "medications"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    generic_name = Column(String, nullable=True)
    class_name = Column(String, nullable=True)
    description = Column(String, nullable=True)

class Prescription(Base):
    __tablename__ = "prescriptions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    image_path = Column(String, nullable=True)
    extracted_text = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    severity = Column(String)
    message = Column(String)
    resolved = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class SavedReport(Base):
    __tablename__ = "saved_reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    report_name = Column(String)
    report_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class MedicationReminder(Base):
    __tablename__ = "medication_reminders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    medication_name = Column(String)
    dosage = Column(String, nullable=True)
    time = Column(String)
    frequency = Column(String)
    active = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

