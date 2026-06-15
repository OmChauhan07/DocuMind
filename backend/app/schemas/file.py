from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FileBase(BaseModel):
    file_name: str
    file_type: str
    is_template: bool = False

class FileResponse(FileBase):
    id: int
    project_id: int
    file_path: str
    upload_date: datetime

    model_config = {"from_attributes": True}
