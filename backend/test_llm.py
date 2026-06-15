import os
from litellm import completion
from app.core.config import settings

os.environ["GEMINI_API_KEY"] = settings.GEMINI_API_KEY
try:
    response = completion(
        model="gemini/gemma-2-27b-it",
        messages=[{"role": "user", "content": "hi"}]
    )
    print("SUCCESS")
except Exception as e:
    print("FAILED", e)
