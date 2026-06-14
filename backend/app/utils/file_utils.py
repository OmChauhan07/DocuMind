import os
import shutil
from fastapi import UploadFile, HTTPException, status
from app.core.config import settings

ALLOWED_EXTENSIONS = {".py", ".ipynb", ".csv", ".xlsx", ".docx", ".pdf", ".txt", ".md"}

def validate_file(file: UploadFile) -> str:
    """Validates the file extension and size. Returns the extension."""
    # Check Extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension {ext} not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Check Size
    # Move to the end of the file to check size
    file.file.seek(0, 2)
    file_size_bytes = file.file.tell()
    # Move back to start for saving
    file.file.seek(0)
    
    max_size_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if file_size_bytes > max_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds the limit of {settings.MAX_FILE_SIZE_MB}MB"
        )
        
    return ext

def save_upload_file(file: UploadFile, project_id: int) -> str:
    """Saves the uploaded file to the designated directory and returns the path."""
    project_dir = os.path.join(settings.UPLOAD_DIR, str(project_id))
    os.makedirs(project_dir, exist_ok=True)
    
    file_path = os.path.join(project_dir, file.filename)
    
    # Optional: Prevent overwriting existing files with same name
    # You could append a timestamp or UUID to filename here if desired.
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return file_path

def delete_local_file(file_path: str):
    """Deletes a file from the local filesystem."""
    if os.path.exists(file_path):
        os.remove(file_path)
