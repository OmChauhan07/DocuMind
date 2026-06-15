import os
from crewai import LLM
from app.core.config import settings

os.environ["GEMINI_API_KEY"] = settings.GEMINI_API_KEY
try:
    llm = LLM(model="gemini/gemma-4-31b-it")
    response = llm.call(messages=[{"role": "user", "content": "hi"}])
    print("SUCCESS")
except Exception as e:
    print("FAILED:", str(e))
