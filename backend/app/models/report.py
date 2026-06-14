from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    report_name = Column(String, nullable=False)
    version = Column(Integer, default=1, nullable=False)
    report_path = Column(String, nullable=True)  # Path to generated DOCX/PDF
    content = Column(Text, nullable=True)  # Raw markdown content from AI
    status = Column(String, default="pending", nullable=False)  # pending, processing, completed, failed
    template_type = Column(String, nullable=True)  # internship, research, project, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="reports")
