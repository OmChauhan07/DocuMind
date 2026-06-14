import requests

base_url = "http://127.0.0.1:8000/api/v1/auth"

print("--- Testing Registration ---")
reg_data = {"name": "Test User", "email": "test@example.com", "password": "securepassword"}
reg_res = requests.post(f"{base_url}/register", json=reg_data)
print(reg_res.status_code)
print(reg_res.json())

print("\n--- Testing Login ---")
login_data = {"username": "test@example.com", "password": "securepassword"}
login_res = requests.post(f"{base_url}/login", data=login_data)
print(login_res.status_code)
print(login_res.json())
