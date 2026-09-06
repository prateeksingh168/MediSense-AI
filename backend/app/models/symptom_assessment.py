from sqlalchemy import Column, Integer, Float, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class SymptomAssessment(Base):
    __tablename__ = "symptom_assessments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    symptoms = Column(JSON, nullable=False)  # JSON array of symptom strings
    duration_days = Column(Integer, nullable=True)
    severity_1_to_5 = Column(Integer, nullable=True)
    additional_information = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="symptom_assessments")
    ai_prediction = relationship("AIPrediction", back_populates="assessment", uselist=False, cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="assessment", cascade="all, delete-orphan")
    doctor_decision = relationship("DoctorDecision", back_populates="assessment", uselist=False, cascade="all, delete-orphan")
