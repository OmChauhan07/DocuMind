from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File as FastAPIFile, Form
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.file import File
from app.schemas.file import FileResponse
from app.utils.file_utils import validate_file, save_upload_file, delete_local_file

router = APIRouter()

@router.post("/upload", response_model=FileResponse, status_code=status.HTTP_201_CREATED)
def upload_file(
    project_id: int = Form(...),
    is_template: bool = Form(False),
    file: UploadFile = FastAPIFile(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify Project belongs to current user
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found or access denied")

    # Validate file extension and size
    ext = validate_file(file)
    
    # Save file to local storage
    file_path = save_upload_file(file, project_id)
    
    # Save to Database
    new_file = File(
        project_id=project_id,
        file_name=file.filename,
        file_path=file_path,
        file_type=ext.replace(".", ""), # Store 'csv' instead of '.csv'
        is_template=is_template
    )
    db.add(new_file)
    db.commit()
    db.refresh(new_file)
    
    return new_file

@router.get("", response_model=List[FileResponse])
def get_files(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Verify Project belongs to current user
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found or access denied")
        
    files = db.query(File).filter(File.project_id == project_id).all()
    return files

@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_file(file_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Get file and verify ownership via project
    file_record = db.query(File).join(Project).filter(
        File.id == file_id,
        Project.user_id == current_user.id
    ).first()
    
    if not file_record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found or access denied")
        
    # Delete from local storage
    delete_local_file(file_record.file_path)
    
    # Delete from DB
    db.delete(file_record)
    db.commit()
    return None
