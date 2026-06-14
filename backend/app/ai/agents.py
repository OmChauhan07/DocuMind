from crewai import Agent
from app.ai.llm import DEFAULT_LLM_MODEL

def get_analyzer_agent() -> Agent:
    return Agent(
        role="Senior Data and Code Analyzer",
        goal="Thoroughly analyze provided files, extracting key information, metadata, functions, classes, and insights.",
        backstory=(
            "You are an expert technical analyst capable of understanding code, datasets, and text documents. "
            "You excel at extracting structured data and identifying the core components of any file."
        ),
        verbose=True,
        allow_delegation=False,
        llm=DEFAULT_LLM_MODEL
    )

def get_writer_agent() -> Agent:
    return Agent(
        role="Technical Report Writer",
        goal="Draft comprehensive, well-structured report sections based on the analyzer's findings.",
        backstory=(
            "You are a skilled technical writer. You take raw data and insights and turn them into "
            "clear, professional, and easy-to-read report sections like Introduction, Methodology, and Results."
        ),
        verbose=True,
        allow_delegation=False,
        llm=DEFAULT_LLM_MODEL
    )

def get_reviewer_agent() -> Agent:
    return Agent(
        role="Quality Assurance Reviewer",
        goal="Review the drafted report for grammar, consistency, and professional tone.",
        backstory=(
            "You are a strict QA reviewer. Your job is to ensure that the document has no grammatical errors, "
            "flows logically, and maintains a consistent professional tone throughout."
        ),
        verbose=True,
        allow_delegation=False,
        llm=DEFAULT_LLM_MODEL
    )

def get_formatter_agent() -> Agent:
    return Agent(
        role="Document Formatter",
        goal="Format the reviewed text into a clean markdown structure ready for DOCX/PDF export.",
        backstory=(
            "You specialize in document formatting. You ensure that headings, bullet points, and paragraphs "
            "are perfectly structured using Markdown, which will later be compiled into a final document."
        ),
        verbose=True,
        allow_delegation=False,
        llm=DEFAULT_LLM_MODEL
    )
