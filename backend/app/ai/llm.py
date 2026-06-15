from app.core.config import settings
import os
from crewai import LLM


# CrewAI uses litellm under the hood. For Gemini, it relies on the GEMINI_API_KEY environment variable.
def setup_llm_env():
    if settings.GEMINI_API_KEY:
        os.environ["GEMINI_API_KEY"] = settings.GEMINI_API_KEY
    else:
        print("WARNING: GEMINI_API_KEY is not set in the environment or configuration.")

    # Fix for windows charmap encoding errors when crewai tries to log emojis
    os.environ["PYTHONIOENCODING"] = "utf-8"


# ---------------------------------------------------------------------------
# Multi-model configuration
# ---------------------------------------------------------------------------
# HEAVY model – used for tasks that require deep reasoning:
#   • File analysis (understanding code, data, documents)
#   • Report drafting (synthesising insights into prose)
#   • Quality review (catching logical / factual errors)
HEAVY_MODEL = "gemini/gemma-4-26b-a4b-it"

# LIGHT model – used for tasks that are mechanical / surface-level:
#   • Markdown formatting (headings, bold, lists)
#   • Template application (matching a user-provided structure)
LIGHT_MODEL = "gemini/gemini-3.5-flash"
