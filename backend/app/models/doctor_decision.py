from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class DecisionEnum(str, enum.Enum):
    ACCEPTED = "accepted"
    OVERRIDDEN = "overridden"
    PENDING = "pending"


class DoctorDecision(Base):
    __tablename__ = "doctor_decisions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="CASCADE"), nullable=False, index=True)
    assessment_id = Column(Integer, ForeignKey("symptom_assessments.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    decision = Column(SQLEnum(DecisionEnum, values_callable=lambda x: [e.value for e in x]), nullable=False, default=DecisionEnum.PENDING)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    doctor = relationship("Doctor", back_populates="decisions")
    assessment = relationship("SymptomAssessment", back_populates="doctor_decision")
