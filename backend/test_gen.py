from app.api.routes.reports import _run_report_generation
from app.core.database import SessionLocal
from app.models.report import Report
from app.models.project import Project
from app.models.user import User

# setup dummy data
db = SessionLocal()
user = db.query(User).first()
if not user:
    user = User(name="Test", email="test@test.com", password_hash="hash")
    db.add(user)
    db.commit()

project = db.query(Project).first()
if not project:
    project = Project(user_id=user.id, project_name="Test Proj")
    db.add(project)
    db.commit()

report = Report(project_id=project.id, report_name="Test Report", status="pending", version=1)
db.add(report)
db.commit()

content_data = [{"file_path": "test_content.txt", "file_type": "txt", "file_name": "test_content.txt"}]
template_data = [{"file_path": "test_template.txt", "file_type": "txt", "file_name": "test_template.txt"}]

with open("test_content.txt", "w") as f: f.write("Bob is a cool guy.")
with open("test_template.txt", "w") as f: f.write("1. Introduction")

print(f"Running report id {report.id}")
_run_report_generation(report.id, content_data, template_data)

db.refresh(report)
print("Final Status:", report.status)
print("Final Content:", report.content)
