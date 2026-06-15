import requests
import time

BASE_URL = "http://127.0.0.1:8000/api/v1"

# 1. Register
res = requests.post(f"{BASE_URL}/auth/register", json={
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
})
# Ignore if already exists

# 2. Login
res = requests.post(f"{BASE_URL}/auth/login/form", data={
    "username": "test@example.com",
    "password": "password123"
})
token = res.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# 3. Create Project
res = requests.post(f"{BASE_URL}/projects", json={
    "project_name": "Test Project",
    "description": "testing"
}, headers=headers)
project_id = res.json()["id"]

# 4. Upload Content File
with open("test_content.txt", "w") as f:
    f.write("This is some sample text about a user named Bob who likes apples.")
with open("test_content.txt", "rb") as f:
    res = requests.post(f"{BASE_URL}/files/upload", data={"project_id": project_id, "is_template": False}, files={"file": f}, headers=headers)

# 5. Upload Template File
with open("test_template.txt", "w") as f:
    f.write("FORMAT: \n1. Intro\n2. Body\n3. Outro")
with open("test_template.txt", "rb") as f:
    res = requests.post(f"{BASE_URL}/files/upload", data={"project_id": project_id, "is_template": True}, files={"file": f}, headers=headers)

# 6. Generate Report
res = requests.post(f"{BASE_URL}/reports", json={
    "project_id": project_id,
    "report_name": "Test Report",
    "template_type": "custom"
}, headers=headers)
print("Generate response:", res.status_code, res.json())
report_id = res.json()["id"]

# 7. Check Status
for _ in range(20):
    time.sleep(2)
    res = requests.get(f"{BASE_URL}/reports/{report_id}", headers=headers)
    status = res.json()["status"]
    print("Status:", status)
    if status in ["completed", "failed"]:
        print(res.json().get("content"))
        break
