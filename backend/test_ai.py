import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.ai.crew import generate_report_content

def test_crew():
    print("Initializing CrewAI and Gemini LLM...")
    
    sample_content = """
    # data_processor.py
    def clean_data(df):
        return df.dropna()
        
    def analyze_metrics(df):
        return {"mean": df['sales'].mean(), "sum": df['sales'].sum()}
        
    # User Notes
    This script processes our Q3 sales data. We had a huge spike in August.
    """
    
    print("\n--- Starting Agent Workflow ---")
    try:
        final_report = generate_report_content(sample_content)
        print("\n--- Final Generated Report ---")
        print(final_report)
        print("\n✅ AI Workflow Test Passed!")
    except Exception as e:
        print(f"\n❌ AI Workflow Test Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_crew()
