import requests

api_url = "http://127.0.0.1:8000/api/v1"

# 1. Register a fresh user
import random
random_email = f"test_{random.randint(1000, 9999)}@example.com"
reg_payload = {"name": "Test User", "email": random_email, "password": "securepassword123"}
requests.post(f"{api_url}/auth/register", json=reg_payload)

# 2. Login
login_payload = {"email": random_email, "password": "securepassword123"}
print("Logging in...")
res = requests.post(f"{api_url}/auth/login", json=login_payload)
print("Login status:", res.status_code)

if res.status_code == 200:
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    print("Fetching /auth/me...")
    m_res = requests.get(f"{api_url}/auth/me", headers=headers)
    print("Me status:", m_res.status_code)

    print("Fetching /projects...")
    p_res = requests.get(f"{api_url}/projects", headers=headers)
    print("Projects status:", p_res.status_code, p_res.text)
    
    print("Fetching /reports...")
    r_res = requests.get(f"{api_url}/reports", headers=headers)
    print("Reports status:", r_res.status_code, r_res.text)
else:
    print(res.text)
