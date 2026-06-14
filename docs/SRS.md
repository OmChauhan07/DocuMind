# Software Requirements Specification (SRS)

# DocuMind

Version: 1.0
Author: Om Chauhan
Date: June 2026

---

# 1. Introduction

## 1.1 Purpose

The purpose of this project is to develop an AI-powered platform capable of analyzing source files such as Python scripts, Jupyter notebooks, datasets, reports, and documents, then automatically generating professional reports in Word and PDF formats.

The system aims to reduce manual report-writing efforts while improving consistency, quality, and productivity.

---

## 1.2 Scope

The system will:

* Accept multiple file formats.
* Analyze uploaded files.
* Generate structured reports.
* Support AI-assisted editing.
* Maintain report version history.
* Export reports to DOCX and PDF.
* Enable section-wise report regeneration.

Target Users:

* Students
* Researchers
* Software Developers
* Data Analysts
* Project Managers

---

## 1.3 Definitions

| Term | Meaning                           |
| ---- | --------------------------------- |
| AI   | Artificial Intelligence           |
| LLM  | Large Language Model              |
| MCP  | Model Context Protocol            |
| API  | Application Programming Interface |
| JWT  | JSON Web Token                    |
| DOCX | Microsoft Word Document           |
| PDF  | Portable Document Format          |

---

# 2. Overall Description

## 2.1 Product Perspective

The system follows a Microservice Architecture.

```text
Frontend (Next.js)
        │
        ▼
API Gateway (FastAPI)
        │
 ┌──────┼────────┐
 │      │        │
 ▼      ▼        ▼
File   AI      Report
Service Agent  Service
 │      │        │
 ▼      ▼        ▼
Storage LLM   DOCX/PDF
```

---

## 2.2 Product Features

* User Authentication
* File Upload Management
* AI-Based File Analysis
* Report Template Management
* Automated Report Generation
* DOCX Export
* PDF Export
* Version Control
* Live Report Updates
* MCP-Based Agent Workflow

---

## 2.3 User Classes

### Student

* Upload assignments
* Generate internship reports
* Generate project reports

### Researcher

* Upload datasets
* Generate research summaries

### Developer

* Upload code repositories
* Generate technical documentation

### Manager

* Generate project status reports

---

# 3. Functional Requirements

---

# 3.1 Authentication Module

## Features

* Registration
* Login
* Logout
* Password Reset

### FR-1

System shall allow users to register.

### FR-2

System shall allow users to login securely.

### FR-3

System shall generate JWT access tokens.

### FR-4

System shall support logout functionality.

---

# 3.2 File Upload Module

## Supported File Types

```text
.py
.ipynb
.csv
.xlsx
.docx
.pdf
.txt
.md
```

### FR-5

System shall support multiple file uploads.

### FR-6

System shall validate uploaded file formats.

### FR-7

System shall validate file size limits.

### FR-8

System shall store uploaded files securely.

---

# 3.3 AI Analysis Module

### FR-9

System shall analyze uploaded files.

### FR-10

System shall extract:

* Functions
* Classes
* Variables
* Data Insights
* Charts
* Metrics

### FR-11

System shall summarize extracted information.

### FR-12

System shall generate contextual understanding of uploaded files.

---

# 3.4 Report Template Module

## Predefined Templates

* Internship Report
* Research Report
* Project Report
* Weekly Report
* Monthly Report

### FR-13

Users shall select report templates.

### FR-14

Users shall create custom templates.

### FR-15

Users shall modify existing templates.

---

# 3.5 Report Generation Module

## Standard Report Structure

```text
Title
Abstract
Objectives
Introduction
Methodology
Implementation
Results
Discussion
Conclusion
References
```

### FR-16

System shall generate reports automatically.

### FR-17

System shall create structured report sections.

### FR-18

System shall include charts and tables.

### FR-19

System shall generate DOCX documents.

### FR-20

System shall generate PDF documents.

---

# 3.6 MCP Agent Workflow

The system shall use multiple AI agents.

---

## Analyzer Agent

Responsibilities:

* Read files
* Extract information
* Generate metadata

---

## Writer Agent

Responsibilities:

* Generate report sections
* Create summaries
* Draft content

---

## Reviewer Agent

Responsibilities:

* Grammar checking
* Consistency validation
* Quality assurance

---

## Formatter Agent

Responsibilities:

* Word formatting
* Table formatting
* Styling

---

## Update Agent

Responsibilities:

* Modify specific sections
* Regenerate selected content
* Preserve document structure

---

### FR-21

System shall support agent-based workflows.

### FR-22

System shall allow section-wise regeneration.

### FR-23

System shall preserve document consistency across agents.

---

# 3.7 Live Editing Module

### FR-24

Users shall edit generated reports.

### FR-25

Users shall regenerate selected sections.

### FR-26

Users shall save report drafts.

---

# 3.8 Version Control Module

### FR-27

System shall maintain report versions.

### FR-28

System shall track changes.

### FR-29

System shall allow rollback to previous versions.

---

# 4. Non-Functional Requirements

---

## 4.1 Performance

### NFR-1

Report generation should complete within 60 seconds.

### NFR-2

System should support files up to 100 MB.

---

## 4.2 Security

### NFR-3

JWT-based authentication.

### NFR-4

Encrypted file storage.

### NFR-5

Role-based authorization.

---

## 4.3 Scalability

### NFR-6

Microservice architecture.

### NFR-7

Docker containerization.

### NFR-8

Horizontal scaling support.

---

## 4.4 Reliability

### NFR-9

99% service availability target.

### NFR-10

Automatic recovery from service failures.

---

## 4.5 Maintainability

### NFR-11

Modular architecture.

### NFR-12

Well-documented APIs.

### NFR-13

CI/CD integration support.

---

# 5. System Architecture

## Frontend

* Next.js
* React
* Tailwind CSS

## Backend

* FastAPI

## AI Layer

* NVIDIA NIM API
* LangGraph
* CrewAI

## Database

* PostgreSQL

## Storage

* MinIO
* AWS S3

## Report Engine

* python-docx
* ReportLab

## Deployment

* Docker
* Nginx
* AWS EC2

---

# 6. Database Design

## Users Table

```sql
id
name
email
password_hash
created_at
```

---

## Projects Table

```sql
id
user_id
project_name
description
created_at
```

---

## Files Table

```sql
id
project_id
file_name
file_path
file_type
upload_date
```

---

## Reports Table

```sql
id
project_id
report_name
version
report_path
created_at
```

---

# 7. API Requirements

## Authentication APIs

```http
POST /auth/register
POST /auth/login
POST /auth/logout
```

---

## File APIs

```http
POST /files/upload
GET /files
DELETE /files/{id}
```

---

## Report APIs

```http
POST /reports/generate
GET /reports/{id}
PUT /reports/{id}
DELETE /reports/{id}
```

---

## Version APIs

```http
GET /reports/{id}/versions
POST /reports/{id}/rollback
```

---

# 8. Future Enhancements

* GitHub Repository Integration
* Automated PPT Generation
* Meeting Minutes Generator
* Multi-Language Reports
* Voice-Based Report Creation
* Real-Time Collaborative Editing
* Slack Integration
* Microsoft Teams Integration

---

# 9. Conclusion

The AI-Powered Smart Report Generator is designed to automate report creation through AI agents and microservice architecture. The platform focuses on scalability, maintainability, and intelligent document generation while providing a seamless user experience for students, researchers, developers, and managers.
