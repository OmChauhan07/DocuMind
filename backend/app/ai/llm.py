from app.core.config import settings
import os
from crewai import LLM

# CrewAI uses litellm under the hood. For Gemini, it relies on the GEMINI_API_KEY environment variable.
def setup_llm_env():
    if settings.GEMINI_API_KEY:
        os.environ["GEMINI_API_KEY"] = settings.GEMINI_API_KEY
    else:
        # Fallback or warn if not set (for testing without a real key, it might fail)
        print("WARNING: GEMINI_API_KEY is not set in the environment or configuration.")

# We will use this string identifier for our agents
DEFAULT_LLM_MODEL = "gemini/gemini-2.5-flash"
