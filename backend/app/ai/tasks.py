from crewai import Task
from app.ai.agents import get_analyzer_agent, get_writer_agent, get_reviewer_agent, get_formatter_agent

def analyze_files_task(file_contents: str) -> Task:
    return Task(
        description=(
            f"Analyze the following file contents and extract key information, metrics, functions, or summaries.\n\n"
            f"FILE CONTENTS:\n{file_contents}\n\n"
            f"Provide a structured summary of what these files contain."
        ),
        expected_output="A structured summary of the files, highlighting key components, insights, or code structures.",
        agent=get_analyzer_agent()
    )

def draft_report_task() -> Task:
    return Task(
        description=(
            "Using the structural summary from the Analyzer, draft a professional report. "
            "Include typical sections like Introduction, Methodology/Approach, Results/Insights, and Conclusion."
        ),
        expected_output="A full draft of the report containing all required sections.",
        agent=get_writer_agent()
    )

def review_report_task() -> Task:
    return Task(
        description=(
            "Review the drafted report. Fix any grammatical mistakes, ensure the tone is professional, "
            "and verify that the narrative flows logically from section to section."
        ),
        expected_output="A polished, error-free version of the report draft.",
        agent=get_reviewer_agent()
    )

def format_report_task(template_contents: str = "") -> Task:
    template_instruction = ""
    if template_contents:
        template_instruction = (
            f"\n\nA custom sample format/template document was provided by the user. "
            f"You MUST strictly follow the structure, headings, tone, and formatting style shown in this template.\n"
            f"=== TEMPLATE START ===\n{template_contents}\n=== TEMPLATE END ===\n"
        )

    return Task(
        description=(
            "Take the polished report and format it meticulously in Markdown. "
            "Ensure proper use of headers (H1, H2, H3), lists, and bold text for readability."
            f"{template_instruction}"
        ),
        expected_output="The final report cleanly formatted in Markdown.",
        agent=get_formatter_agent()
    )
