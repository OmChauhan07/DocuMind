from crewai import Crew, Process
from app.ai.llm import setup_llm_env
from app.ai.tasks import analyze_files_task, draft_report_task, review_report_task, format_report_task

def generate_report_content(file_contents: str) -> str:
    """
    Orchestrates the CrewAI agents to generate a report based on file contents.
    """
    # Ensure environment is set up for litellm/gemini
    setup_llm_env()
    
    # 1. Create Tasks (Agents are implicitly instantiated inside task creation)
    t_analyze = analyze_files_task(file_contents)
    t_draft = draft_report_task()
    t_review = review_report_task()
    t_format = format_report_task()
    
    # 2. Assemble the Crew
    report_crew = Crew(
        agents=[t_analyze.agent, t_draft.agent, t_review.agent, t_format.agent],
        tasks=[t_analyze, t_draft, t_review, t_format],
        process=Process.sequential, # Execute tasks sequentially
        verbose=True
    )
    
    # 3. Kickoff the process
    result = report_crew.kickoff()
    
    return str(result)
