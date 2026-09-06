from sqlalchemy import Column, Integer, String, Text, JSON
from app.database import Base


class SimilarCase(Base):
    __tablename__ = "similar_cases"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    case_reference = Column(String(128), unique=True, index=True, nullable=False)
    case_text = Column(Text, nullable=False)
    case_metadata = Column("metadata", JSON, nullable=True)
