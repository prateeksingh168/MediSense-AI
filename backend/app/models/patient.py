from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    patient_code = Column(String(64), unique=True, index=True, nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(32), nullable=True)
    city = Column(String(128), nullable=True)
    medical_history = Column(Text, nullable=True)
    allergies = Column(Text, nullable=True)
    medications = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="patient_profile")
    health_records = relationship("HealthRecord", back_populates="patient", cascade="all, delete-orphan")
    symptom_assessments = relationship("SymptomAssessment", back_populates="patient", cascade="all, delete-orphan")
