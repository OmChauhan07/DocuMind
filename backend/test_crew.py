import sys
import os

# Ensure backend directory is in the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.ai.crew import generate_report_content

try:
    print(generate_report_content("Sample code content", "TEMPLATE: Intro, Body, Conclusion"))
except Exception as e:
    print("FAILED:", str(e))
