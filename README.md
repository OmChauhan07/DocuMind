# DocuMind
DocuMind is an AI-powered smart report generator that converts raw project artifacts into professional reports.
It accepts files like Python scripts, notebooks, datasets, documents, and text files, analyzes them, and produces structured outputs that can be downloaded in **DOCX** and **PDF** formats.

## Project Description

DocuMind is built for students, researchers, developers, and project teams that need high-quality documentation with less manual effort.

The platform includes:
- **Frontend**: React + Vite application for authentication, project management, file upload, and report tracking.
- **Backend**: FastAPI service for auth, projects, files, reports, and export APIs.
- **AI Pipeline**: CrewAI-based multi-agent workflow (Analyzer → Writer → Reviewer → Formatter).
- **Export Layer**: Report generation and download in DOCX/PDF formats.

## Working of the Project

1. **User authentication**  
   User signs up/signs in and gets access to their dashboard.

2. **Project management**  
   User creates/selects a project where files and reports are organized.

3. **File upload**  
   User uploads one or more supported files (`.py`, `.ipynb`, `.csv`, `.xlsx`, `.docx`, `.pdf`, `.txt`, `.md`) with validation on type and size.

4. **Report generation request**  
   User starts report generation from the UI. Backend creates a report record and starts background processing.

5. **AI multi-agent processing**  
   Uploaded file content is parsed and passed through the CrewAI pipeline:
   - **Analyzer**: extracts key technical/data insights  
   - **Writer**: drafts structured report sections  
   - **Reviewer**: improves quality, grammar, and consistency  
   - **Formatter**: prepares final polished markdown/output

6. **Export and download**  
   Final content is converted to DOCX/PDF and made available from the report progress/download screen.

## High-Level Flow

**Sign Up / Sign In → Dashboard → Create/Select Project → Upload Files → Generate Report → Track Progress → Download DOCX/PDF**