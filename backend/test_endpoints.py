import requests
import sys

base_url = "http://127.0.0.1:8000"
api_url = f"{base_url}/api/v1"

def test_health():
    print("Testing /api/v1/health...")
    try:
        response = requests.get(f"{api_url}/health")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data.get("status") == "ok", f"Expected status 'ok', got {data.get('status')}"
        print("âœ… Health check passed.")
        return True
    except Exception as e:
        print(f"âŒ Health check failed: {e}")
        return False

def test_auth():
    print("\nTesting Authentication (/register and /login)...")
    import uuid
    # Use a random email to avoid conflicts with previous test runs
    random_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    password = "securepassword123"
    
    # Test Register
    reg_data = {"name": "Integration Test User", "email": random_email, "password": password}
    try:
        reg_res = requests.post(f"{api_url}/auth/register", json=reg_data)
        assert reg_res.status_code == 201, f"Expected 201 Created, got {reg_res.status_code}. Response: {reg_res.text}"
        print("✅ User Registration passed.")
    except Exception as e:
        print(f"❌ User Registration failed: {e}")
        return False

    # Test Login
    login_data = {"email": random_email, "password": password}
    try:
        login_res = requests.post(f"{api_url}/auth/login", json=login_data)
        assert login_res.status_code == 200, f"Expected 200 OK, got {login_res.status_code}. Response: {login_res.text}"
        token_data = login_res.json()
        assert "access_token" in token_data, "Response missing access_token"
        assert token_data["token_type"] == "bearer", "Incorrect token type"
    except Exception as e:
        print(f"âŒ User Login failed: {e}")
        return False

if __name__ == "__main__":
    print(f"Running integration tests against {base_url}...\n")
    
    health_ok = test_health()
    auth_ok = test_auth()
    
    if health_ok and auth_ok:
        print("\nðŸŽ‰ All tests passed successfully!")
        sys.exit(0)
    else:
        print("\nðŸ’¥ Some tests failed.")
        sys.exit(1)
