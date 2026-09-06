from sqlalchemy import Column, Integer, Float, String, Text, ForeignKey, DateTime, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class RiskLevel(str, enum.Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"


class AIPrediction(Base):
    __tablename__ = "ai_predictions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    assessment_id = Column(Integer, ForeignKey("symptom_assessments.id", ondelete="CASCADE"), nullable=False, unique=True)
    condition = Column(String(255), nullable=True)
    probability = Column(Float, nullable=True)
    risk_level = Column(SQLEnum(RiskLevel, values_callable=lambda x: [e.value for e in x]), nullable=False, default=RiskLevel.LOW)
    explanation = Column(Text, nullable=True)
    missing_information = Column(JSON, nullable=True, default=list)
    similar_cases = Column(JSON, nullable=True, default=list)
    recommendation = Column(Text, nullable=True)
    model_name = Column(String(128), nullable=True, default="medisense-hybrid-v1")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    assessment = relationship("SymptomAssessment", back_populates="ai_prediction")
