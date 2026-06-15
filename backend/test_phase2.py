import requests
import sys
import uuid
import os

base_url = "http://127.0.0.1:8000/api/v1"
session = requests.Session()
token = ""

def test_auth_and_get_token():
    global token
    random_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    password = "password123"
    
    print(f"Registering user: {random_email}")
    reg_res = session.post(f"{base_url}/auth/register", json={"name": "File Test User", "email": random_email, "password": password})
    assert reg_res.status_code == 201, f"Reg failed: {reg_res.text}"
    
    login_res = session.post(f"{base_url}/auth/login", json={"email": random_email, "password": password})
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    
    token = login_res.json()["access_token"]
    session.headers.update({"Authorization": f"Bearer {token}"})
    print("✅ Auth successful")

def test_projects():
    print("\nCreating Project...")
    proj_data = {"project_name": "My API Project", "description": "Testing files"}
    res = session.post(f"{base_url}/projects/", json=proj_data)
    assert res.status_code == 201, f"Project creation failed: {res.text}"
    
    project_id = res.json()["id"]
    print(f"✅ Project created with ID: {project_id}")
    return project_id

def test_files(project_id):
    print("\nTesting File Upload...")
    
    # 1. Create a dummy file
    test_file_path = "test_upload.txt"
    with open(test_file_path, "w") as f:
        f.write("Hello, DocuMind!")
    
    # 2. Upload the file
    with open(test_file_path, "rb") as f:
        files = {"file": (test_file_path, f, "text/plain")}
        data = {"project_id": project_id}
        res = session.post(f"{base_url}/files/upload", files=files, data=data)
    
    assert res.status_code == 201, f"Upload failed: {res.text}"
    file_id = res.json()["id"]
    print(f"✅ File uploaded successfully. File ID: {file_id}")
    
    # 3. Test Invalid Extension
    bad_file_path = "test_upload.exe"
    with open(bad_file_path, "w") as f:
        f.write("Fake exe")
        
    with open(bad_file_path, "rb") as f:
        files = {"file": (bad_file_path, f, "application/x-msdownload")}
        res = session.post(f"{base_url}/files/upload", files=files, data={"project_id": project_id})
        assert res.status_code == 400, f"Expected 400 for invalid extension, got: {res.status_code}"
    print("✅ Invalid file extension correctly rejected.")
    
    # 4. List Files
    res = session.get(f"{base_url}/files/", params={"project_id": project_id})
    assert res.status_code == 200
    assert len(res.json()) == 1, "Expected 1 file in the project"
    print("✅ File listing successful.")
    
    # 5. Delete File
    res = session.delete(f"{base_url}/files/{file_id}")
    assert res.status_code == 204, f"Delete failed: {res.text}"
    print("✅ File deletion successful.")

    # Cleanup local test files
    os.remove(test_file_path)
    os.remove(bad_file_path)


if __name__ == "__main__":
    try:
        test_auth_and_get_token()
        proj_id = test_projects()
        test_files(proj_id)
        print("\n🎉 Phase 2 Tests Passed!")
        sys.exit(0)
    except Exception as e:
        print(f"\n💥 Test failed: {e}")
        sys.exit(1)
