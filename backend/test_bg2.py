import asyncio
from app.api.routes.reports import _run_report_generation
from app.core.database import SessionLocal
from app.models.report import Report

db = SessionLocal()
report = Report(project_id=1, report_name="Test Report", template_type="Standard", status="pending")
db.add(report)
db.commit()
db.refresh(report)

files_data = [{"file_path": "test.txt", "file_type": "txt", "file_name": "test.txt"}]
template_data = [{"file_path": "test_template.txt", "file_type": "txt", "file_name": "test_template.txt"}]

with open("test.txt", "w") as f:
    f.write("Hello world")

with open("test_template.txt", "w") as f:
    f.write("This is a template format. # Header 1\n## Header 2")

try:
    _run_report_generation(report.id, files_data, template_data)
    db.refresh(report)
    print(f"Report status: {report.status}")
    if report.status == "failed":
        print(f"Error: {report.content}")
except Exception as e:
    print(f"Failed to run: {e}")
