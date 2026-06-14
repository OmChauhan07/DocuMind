import os
import nbformat
import pandas as pd
from docx import Document
import fitz  # PyMuPDF

def parse_file(file_path: str, file_ext: str) -> str:
    """
    Reads a file from the disk and extracts its textual content based on its extension.
    Returns the extracted text as a string.
    """
    if not os.path.exists(file_path):
        return "[Could not read file: File does not exist]"

    try:
        if file_ext == "pdf":
            return _parse_pdf(file_path)
        elif file_ext == "docx":
            return _parse_docx(file_path)
        elif file_ext in ["csv", "xlsx"]:
            return _parse_tabular(file_path, file_ext)
        elif file_ext == "ipynb":
            return _parse_ipynb(file_path)
        elif file_ext in ["py", "txt", "md"]:
            return _parse_text(file_path)
        else:
            # Fallback to plain text read
            return _parse_text(file_path)
    except Exception as e:
        return f"[Could not read file {os.path.basename(file_path)}: {str(e)}]"

def _parse_pdf(file_path: str) -> str:
    text_content = []
    with fitz.open(file_path) as doc:
        for page in doc:
            text_content.append(page.get_text())
    return "\n".join(text_content)

def _parse_docx(file_path: str) -> str:
    doc = Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs])

def _parse_tabular(file_path: str, ext: str) -> str:
    if ext == "csv":
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)
    # Convert dataframe to markdown table or string representation
    return df.to_markdown()

def _parse_ipynb(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        nb = nbformat.read(f, as_version=4)
    content = []
    for cell in nb.cells:
        if cell.cell_type == "markdown":
            content.append(cell.source)
        elif cell.cell_type == "code":
            content.append(f"```python\n{cell.source}\n```")
            # Optionally could add outputs, but source is usually enough for analysis
    return "\n\n".join(content)

def _parse_text(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()
