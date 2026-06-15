import os
from google import genai
from app.core.config import settings

os.environ["GEMINI_API_KEY"] = settings.GEMINI_API_KEY
client = genai.Client()

print("Available models:")
for m in client.models.list():
    if "gemma" in m.name.lower():
        print(m.name, m.supported_generation_methods)
