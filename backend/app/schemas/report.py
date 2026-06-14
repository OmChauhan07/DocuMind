from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ReportCreate(BaseModel):
    project_id: int
    report_name: str
    template_type: Optional[str] = "project"

class ReportResponse(BaseModel):
    id: int
    project_id: int
    report_name: str
    version: int
    report_path: Optional[str] = None
    content: Optional[str] = None
    status: str
    template_type: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
