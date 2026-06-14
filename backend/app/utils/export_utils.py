import os
from docx import Document
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

def export_to_docx(content: str, output_path: str):
    """
    Exports a markdown string to a DOCX file.
    Provides basic parsing for headings and paragraphs.
    """
    doc = Document()
    
    for line in content.split('\n'):
        line = line.strip()
        if not line:
            continue
            
        if line.startswith('# '):
            doc.add_heading(line[2:], level=1)
        elif line.startswith('## '):
            doc.add_heading(line[3:], level=2)
        elif line.startswith('### '):
            doc.add_heading(line[4:], level=3)
        elif line.startswith('- ') or line.startswith('* '):
            doc.add_paragraph(line[2:], style='List Bullet')
        else:
            doc.add_paragraph(line)
            
    doc.save(output_path)

def export_to_pdf(content: str, output_path: str):
    """
    Exports a markdown string to a PDF file using ReportLab.
    Provides basic parsing for headings and paragraphs.
    """
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    for line in content.split('\n'):
        line = line.strip()
        if not line:
            story.append(Spacer(1, 12))
            continue
            
        if line.startswith('# '):
            story.append(Paragraph(line[2:], styles['Heading1']))
        elif line.startswith('## '):
            story.append(Paragraph(line[3:], styles['Heading2']))
        elif line.startswith('### '):
            story.append(Paragraph(line[4:], styles['Heading3']))
        elif line.startswith('- ') or line.startswith('* '):
            # A simple bullet representation
            story.append(Paragraph(f"&bull; {line[2:]}", styles['Normal']))
        else:
            story.append(Paragraph(line, styles['Normal']))
            
    doc.build(story)
