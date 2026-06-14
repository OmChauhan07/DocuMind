from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.file import File
from app.models.report import Report
from app.schemas.report import ReportCreate, ReportResponse
import os
import traceback

router = APIRouter()


def _run_report_generation(report_id: int, file_contents: str, db_url: str):
    """Background task to generate a report using CrewAI agents."""
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    engine = create_engine(
        db_url, connect_args={"check_same_thread": False} if db_url.startswith("sqlite") else {}
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            return

        report.status = "processing"
        db.commit()

        # Run the CrewAI pipeline
        from app.ai.crew import generate_report_content
        content = generate_report_content(file_contents)

        report.content = content
        
        # Generate Exports
        from app.utils.export_utils import export_to_docx, export_to_pdf
        from app.core.config import settings
        
        base_path = os.path.join(settings.OUTPUT_DIR, f"report_{report_id}")
        docx_path = f"{base_path}.docx"
        pdf_path = f"{base_path}.pdf"
        
        export_to_docx(content, docx_path)
        export_to_pdf(content, pdf_path)
        
        report.report_path = base_path
        report.status = "completed"
        db.commit()
    except Exception as e:
        print(f"Report generation failed: {e}")
        traceback.print_exc()
        report = db.query(Report).filter(Report.id == report_id).first()
        if report:
            report.status = "failed"
            report.content = f"Error: {str(e)}"
            db.commit()
    finally:
        db.close()


@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    report_data: ReportCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new report and trigger AI generation in the background."""
    # Verify project ownership
    project = db.query(Project).filter(
        Project.id == report_data.project_id,
        Project.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found or access denied")

    # Get project files
    files = db.query(File).filter(File.project_id == report_data.project_id).all()
    if not files:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No files uploaded for this project. Upload files first.")

    # Read file contents
    from app.utils.file_parser import parse_file
    
    file_contents_parts = []
    for f in files:
        try:
            content = parse_file(f.file_path, f.file_type)
            file_contents_parts.append(f"--- FILE: {f.file_name} (type: {f.file_type}) ---\n{content}\n")
        except Exception as e:
            file_contents_parts.append(f"--- FILE: {f.file_name} (type: {f.file_type}) --- [Could not read file: {e}]\n")

    file_contents = "\n".join(file_contents_parts)

    # Create the report record
    new_report = Report(
        project_id=report_data.project_id,
        report_name=report_data.report_name,
        template_type=report_data.template_type,
        status="pending"
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    # Trigger background generation
    from app.core.config import settings
    background_tasks.add_task(_run_report_generation, new_report.id, file_contents, settings.DATABASE_URL)

    return new_report


@router.get("", response_model=List[ReportResponse])
def get_reports(
    project_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all reports for the current user, optionally filtered by project."""
    query = db.query(Report).join(Project).filter(Project.user_id == current_user.id)
    if project_id:
        query = query.filter(Report.project_id == project_id)
    reports = query.order_by(Report.created_at.desc()).all()
    return reports


@router.get("/{report_id}", response_model=ReportResponse)
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific report."""
    report = db.query(Report).join(Project).filter(
        Report.id == report_id,
        Project.user_id == current_user.id
    ).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    return report


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a report."""
    report = db.query(Report).join(Project).filter(
        Report.id == report_id,
        Project.user_id == current_user.id
    ).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    # Delete file if exists
    if report.report_path:
        docx_path = f"{report.report_path}.docx"
        pdf_path = f"{report.report_path}.pdf"
        if os.path.exists(docx_path):
            os.remove(docx_path)
        if os.path.exists(pdf_path):
            os.remove(pdf_path)

    db.delete(report)
    db.commit()
    return None

@router.get("/{report_id}/download/{format}")
def download_report(
    report_id: int,
    format: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Download a generated report in the specified format (pdf or docx)."""
    if format not in ["pdf", "docx"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid format requested")

    report = db.query(Report).join(Project).filter(
        Report.id == report_id,
        Project.user_id == current_user.id
    ).first()
    
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
        
    if report.status != "completed" or not report.report_path:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Report is not ready for download")
        
    file_path = f"{report.report_path}.{format}"
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found on server")
        
    return FileResponse(
        path=file_path,
        filename=f"{report.report_name}.{format}",
        media_type="application/pdf" if format == "pdf" else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
