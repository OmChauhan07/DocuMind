import os
import re
from docx import Document
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

def export_to_docx(content: str, output_path: str):
    """
    Exports a markdown string to a DOCX file.
    Provides basic parsing for headings, paragraphs, and bold text.
    """
    doc = Document()
    
    for line in content.split('\n'):
        line = line.strip()
        if not line:
            continue
            
        p = None
        if line.startswith('# '):
            p = doc.add_heading(level=1)
            line = line[2:]
        elif line.startswith('## '):
            p = doc.add_heading(level=2)
            line = line[3:]
        elif line.startswith('### '):
            p = doc.add_heading(level=3)
            line = line[4:]
        elif line.startswith('- ') or line.startswith('* '):
            p = doc.add_paragraph(style='List Bullet')
            line = line[2:]
        else:
            p = doc.add_paragraph()
            
        # Parse **bold** text
        parts = re.split(r'(\*\*.*?\*\*)', line)
        for part in parts:
            if part.startswith('**') and part.endswith('**') and len(part) >= 4:
                run = p.add_run(part[2:-2])
                run.bold = True
            else:
                p.add_run(part)
            
    doc.save(output_path)

def export_to_pdf(content: str, output_path: str):
    """
    Exports a markdown string to a PDF file using ReportLab.
    Provides basic parsing for headings, paragraphs, and bold text.
    """
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    for line in content.split('\n'):
        line = line.strip()
        if not line:
            story.append(Spacer(1, 12))
            continue
            
        # Replace **text** with <b>text</b> for ReportLab
        line = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', line)
            
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
