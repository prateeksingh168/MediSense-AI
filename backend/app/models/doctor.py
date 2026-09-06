from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    specialization = Column(String(255), nullable=True, default="General Physician")

    # Relationships
    user = relationship("User", back_populates="doctor_profile")
    decisions = relationship("DoctorDecision", back_populates="doctor", cascade="all, delete-orphan")
