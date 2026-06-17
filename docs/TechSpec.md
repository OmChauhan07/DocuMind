# Technical Specification

# DocuMind — AI-Powered Smart Report Generator

| Field       | Value                |
| ----------- | -------------------- |
| Version     | 1.0                  |
| Author      | Om Chauhan           |
| Date        | June 2026            |
| Status      | In Development       |

---

## 1. System Overview

DocuMind is a full-stack web application following a modular monolith architecture (with a microservice-ready design) consisting of:

- **Frontend**: React (Vite) + Tailwind CSS single-page application.
- **Backend**: FastAPI REST API server with SQLAlchemy ORM.
- **AI Pipeline**: CrewAI multi-agent orchestration with Google Gemini LLMs.
- **Database**: SQLite (development) / PostgreSQL (production target).
- **Storage**: Local filesystem (development) / S3-compatible (production target).

---

## 2. Architecture

### 2.1 High-Level Architecture

```text
┌─────────────────────────────────────────────────────┐
│                  Frontend (Vite + React)             │
│            React Router · Axios · Tailwind CSS       │
│     Pages: SignIn | SignUp | Dashboard | Upload |     │
│              ReportProgress                          │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (REST)
                       ▼
┌─────────────────────────────────────────────────────┐
│               Backend (FastAPI)                      │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │  Auth   │ │ Projects │ │  Files   │ │ Reports │ │
│  │ Routes  │ │  Routes  │ │  Routes  │ │  Routes │ │
│  └────┬────┘ └────┬─────┘ └────┬─────┘ └────┬────┘ │
│       │           │            │             │      │
│  ┌────┴───────────┴────────────┴─────────────┴──┐   │
│  │              SQLAlchemy ORM (Models)          │   │
│  └──────────────────────┬───────────────────────┘   │
│                         │                           │
│  ┌──────────────────────┴───────────────────────┐   │
│  │           AI Pipeline (CrewAI)                │   │
│  │  Analyzer → Writer → Reviewer → Formatter     │   │
│  └──────────────────────┬───────────────────────┘   │
│                         │                           │
│  ┌──────────────────────┴───────────────────────┐   │
│  │       Export Engine (python-docx, ReportLab)   │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
    ┌─────────────────┐    ┌─────────────────┐
    │    SQLite DB     │    │  Local Storage   │
    │  (documind.db)   │    │   (uploads/)     │
    │                  │    │   (outputs/)     │
    └─────────────────┘    └─────────────────┘
```

### 2.2 Backend Module Structure

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point + lifespan
│   ├── ai/                     # AI pipeline layer
│   │   ├── __init__.py
│   │   ├── agents.py           # CrewAI Agent definitions (4 agents)
│   │   ├── crew.py             # Crew orchestration (sequential pipeline)
│   │   ├── llm.py              # LLM configuration (HEAVY/LIGHT model split)
│   │   └── tasks.py            # CrewAI Task definitions (4 tasks)
│   ├── api/                    # API layer
│   │   ├── __init__.py
│   │   ├── deps.py             # Shared dependencies (get_current_user)
│   │   └── routes/
│   │       ├── auth.py         # POST /register, /login, /login/form, GET /me
│   │       ├── files.py        # POST /upload, GET /, DELETE /{id}
│   │       ├── health.py       # GET /health
│   │       ├── projects.py     # POST /, GET /, GET /{id}
│   │       └── reports.py      # POST /, GET /, GET /{id}, DELETE /{id}, GET /{id}/download/{format}
│   ├── core/                   # Core infrastructure
│   │   ├── config.py           # Pydantic Settings (env-driven)
│   │   ├── database.py         # SQLAlchemy engine + session factory
│   │   └── security.py         # bcrypt hashing + JWT encode
│   ├── models/                 # SQLAlchemy ORM models
│   │   ├── base.py             # DeclarativeBase
│   │   ├── user.py             # User model
│   │   ├── project.py          # Project model
│   │   ├── file.py             # File model
│   │   └── report.py           # Report model
│   ├── schemas/                # Pydantic request/response schemas
│   │   ├── user.py             # UserCreate, UserResponse, Token, TokenData
│   │   ├── project.py          # ProjectCreate, ProjectResponse
│   │   ├── file.py             # FileBase, FileResponse
│   │   └── report.py           # ReportCreate, ReportResponse
│   └── utils/                  # Utility functions
│       ├── export_utils.py     # Markdown → DOCX, Markdown → PDF converters
│       ├── file_parser.py      # Multi-format file reader (PDF, DOCX, CSV, XLSX, IPYNB, TXT, PY, MD)
│       └── file_utils.py       # File validation, save, and delete helpers
├── alembic/                    # Database migrations (Alembic)
├── uploads/                    # Uploaded files directory
├── outputs/                    # Generated report exports directory
├── pyproject.toml              # Python project config + dependencies
└── .env                        # Environment variables
```

### 2.3 Frontend Module Structure

```text
frontend/
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Router + AuthProvider
│   ├── App.css                 # Global styles
│   ├── index.css               # Tailwind imports
│   ├── context/
│   │   └── AuthContext.jsx     # JWT auth state management
│   ├── services/
│   │   └── api.js              # Axios instance + interceptors
│   ├── components/
│   │   ├── MainLayout.jsx      # Authenticated layout wrapper + sidebar
│   │   └── ProtectedRoute.jsx  # Route guard (redirect if unauthenticated)
│   └── pages/
│       ├── SignIn.jsx           # Login page
│       ├── SignUp.jsx           # Registration page
│       ├── Dashboard.jsx        # Project listing + management
│       ├── UploadFiles.jsx      # File upload + report trigger
│       └── ReportProgress.jsx   # Report generation status + download
├── public/                      # Static assets
├── package.json                 # npm dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── postcss.config.js            # PostCSS configuration
```

---

## 3. Technology Stack

### 3.1 Frontend

| Technology         | Version   | Purpose                                 |
| ------------------ | --------- | --------------------------------------- |
| React              | ^19.2.6   | UI component library                    |
| Vite               | ^8.0.12   | Build tool & dev server                 |
| React Router DOM   | ^7.17.0   | Client-side routing                     |
| Axios              | ^1.17.0   | HTTP client for API communication       |
| Tailwind CSS       | ^3.4.19   | Utility-first CSS framework             |
| Lucide React       | ^1.18.0   | Icon library                            |
| clsx               | ^2.1.1    | Conditional CSS class composition       |

### 3.2 Backend

| Technology         | Version   | Purpose                                 |
| ------------------ | --------- | --------------------------------------- |
| FastAPI            | ^0.137.0  | REST API framework                      |
| Uvicorn            | ^0.49.0   | ASGI server                             |
| SQLAlchemy         | ^2.0.50   | ORM & database toolkit                  |
| Alembic            | ^1.18.4   | Database migration management           |
| Pydantic           | ^2.13.4   | Data validation & serialization         |
| Pydantic Settings  | ^2.9.1    | Environment-based configuration         |
| python-jose        | ^3.5.0    | JWT token encoding/decoding             |
| bcrypt             | ^5.0.0    | Password hashing                        |
| python-multipart   | ^0.0.32   | File upload parsing                     |

### 3.3 AI Layer

| Technology         | Version   | Purpose                                 |
| ------------------ | --------- | --------------------------------------- |
| CrewAI             | ^1.6.1    | Multi-agent orchestration framework     |
| Google Generative AI| ^0.8.6   | Gemini API client                       |
| LiteLLM (via CrewAI)| —        | Unified LLM interface                   |

**Model Configuration:**

| Model Tier | Model Name                | Use Case                                          |
| ---------- | ------------------------- | ------------------------------------------------- |
| HEAVY      | `gemini/gemma-4-26b-a4b-it` | File analysis, report drafting, quality review   |
| LIGHT      | `gemini/gemini-3.5-flash`   | Markdown formatting, template application        |

### 3.4 File Processing

| Library      | Version    | Purpose                              |
| ------------ | ---------- | ------------------------------------ |
| python-docx  | ^1.2.0     | DOCX read/write                      |
| PyMuPDF      | ^1.27.2.3  | PDF text extraction                  |
| ReportLab    | ^4.5.1     | PDF generation                       |
| pandas       | ^3.0.3     | CSV/XLSX data processing             |
| openpyxl     | ^3.1.5     | Excel file reading (pandas backend)  |
| nbformat     | ^5.10.4    | Jupyter notebook parsing             |
| tabulate     | ^0.9.0     | DataFrame → Markdown table           |
| Pillow       | ^12.2.0    | Image processing utilities           |

### 3.5 Infrastructure (Current vs. Planned)

| Layer     | Current (Dev)     | Planned (Production)          |
| --------- | ----------------- | ----------------------------- |
| Database  | SQLite            | PostgreSQL                    |
| Storage   | Local filesystem  | MinIO / AWS S3                |
| Server    | Uvicorn (local)   | Docker + Nginx + AWS EC2      |
| CI/CD     | Manual            | GitHub Actions / GitLab CI    |

---

## 4. API Specification

### 4.1 Base Configuration

| Property        | Value                               |
| --------------- | ----------------------------------- |
| Base URL        | `http://localhost:8000`             |
| API Prefix      | `/api/v1`                           |
| Auth Scheme     | Bearer Token (JWT)                  |
| CORS Origins    | `localhost:5173`, `localhost:3000`   |
| Content Type    | `application/json` (file upload: `multipart/form-data`) |

### 4.2 Authentication Endpoints

#### `POST /api/v1/auth/register`

Register a new user account.

| Field     | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| email     | string | Yes      | Valid email       |
| name      | string | Yes      | Display name      |
| password  | string | Yes      | Plain text password |

**Response (201):** `UserResponse` — `{ id, email, name, created_at }`

---

#### `POST /api/v1/auth/login`

Authenticate with JSON body.

| Field     | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| email     | string | Yes      | Registered email  |
| password  | string | Yes      | Account password  |

**Response (200):** `Token` — `{ access_token, token_type: "bearer" }`

---

#### `POST /api/v1/auth/login/form`

Authenticate with OAuth2 form data (Swagger UI compatible).

---

#### `GET /api/v1/auth/me`

Get the current authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):** `UserResponse` — `{ id, email, name, created_at }`

---

### 4.3 Project Endpoints

#### `POST /api/v1/projects`

Create a new project.

| Field         | Type   | Required | Description       |
| ------------- | ------ | -------- | ----------------- |
| project_name  | string | Yes      | Project name      |
| description   | string | No       | Project description |

**Response (201):** `ProjectResponse` — `{ id, user_id, project_name, description, created_at }`

---

#### `GET /api/v1/projects`

List all projects for the current user.

---

#### `GET /api/v1/projects/{project_id}`

Get a specific project.

---

### 4.4 File Endpoints

#### `POST /api/v1/files/upload`

Upload a file to a project. Uses `multipart/form-data`.

| Field       | Type    | Required | Description                          |
| ----------- | ------- | -------- | ------------------------------------ |
| project_id  | integer | Yes      | Target project ID                    |
| is_template | boolean | No       | Whether this file is a DOCX template |
| file        | file    | Yes      | The file binary                      |

**Supported Extensions:** `.py`, `.ipynb`, `.csv`, `.xlsx`, `.docx`, `.pdf`, `.txt`, `.md`

**Max File Size:** 100 MB

**Response (201):** `FileResponse` — `{ id, project_id, file_name, file_type, file_path, is_template, upload_date }`

---

#### `GET /api/v1/files?project_id={id}`

List all files in a project.

---

#### `DELETE /api/v1/files/{file_id}`

Delete a file.

---

### 4.5 Report Endpoints

#### `POST /api/v1/reports`

Create and trigger report generation (runs in background).

| Field         | Type   | Required | Description                                      |
| ------------- | ------ | -------- | ------------------------------------------------ |
| project_id    | integer| Yes      | Project containing source files                  |
| report_name   | string | Yes      | Name for the report                              |
| template_type | string | No       | Report template type (default: `"project"`)      |

**Response (201):** `ReportResponse` — `{ id, ..., status: "pending" }`

---

#### `GET /api/v1/reports?project_id={id}`

List reports, optionally filtered by project.

---

#### `GET /api/v1/reports/{report_id}`

Get a specific report (including content and status).

---

#### `DELETE /api/v1/reports/{report_id}`

Delete a report and its exported files.

---

#### `GET /api/v1/reports/{report_id}/download/{format}`

Download a generated report.

| Parameter | Values        | Description         |
| --------- | ------------- | ------------------- |
| format    | `docx`, `pdf` | Export file format  |

---

## 5. AI Pipeline Architecture

### 5.1 Agent Pipeline

The report generation pipeline uses CrewAI to orchestrate 4 specialized agents in a sequential process:

```text
File Contents + Template
         │
         ▼
┌─────────────────────┐
│  1. Analyzer Agent   │  Model: HEAVY (gemma-4-26b-a4b-it)
│                      │  Input:  Raw file contents (multi-format)
│  • Extract functions │  Output: Structured summary of file components
│  • Identify classes  │
│  • Parse data insights│
│  • Generate metadata │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  2. Writer Agent     │  Model: HEAVY (gemma-4-26b-a4b-it)
│                      │  Input:  Analyzer's structured summary
│  • Draft sections    │  Output: Full report draft with all sections
│  • Create summaries  │
│  • Synthesize prose  │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  3. Reviewer Agent   │  Model: HEAVY (gemma-4-26b-a4b-it)
│                      │  Input:  Writer's draft
│  • Grammar check     │  Output: Polished, error-free report
│  • Consistency check │
│  • Tone validation   │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  4. Formatter Agent  │  Model: LIGHT (gemini-3.5-flash)
│                      │  Input:  Reviewer's polished text
│  • Markdown headers  │  Output: Clean markdown for export
│  • Lists & styling   │
│  • Template adherence│
└──────────┬──────────┘
           ▼
     Final Markdown
         │
    ┌────┴────┐
    ▼         ▼
  DOCX      PDF
 Export     Export
```

### 5.2 Background Execution

Report generation runs as a FastAPI `BackgroundTask`:

1. The `POST /reports` endpoint creates a Report record with `status = "pending"`.
2. A background task is enqueued with file paths and template paths.
3. The task updates status to `"processing"`, runs the CrewAI pipeline, generates exports, and sets status to `"completed"` (or `"failed"` on error).
4. The frontend polls `GET /reports/{id}` to track progress.

### 5.3 File Parsing

The `file_parser.py` module provides format-specific readers:

| Format        | Parser          | Output                               |
| ------------- | --------------- | ------------------------------------ |
| `.py`, `.txt`, `.md` | `_parse_text` | Raw text content                    |
| `.pdf`        | `_parse_pdf` (PyMuPDF) | Extracted page text           |
| `.docx`       | `_parse_docx` (python-docx) | Markdown-formatted text    |
| `.csv`, `.xlsx` | `_parse_tabular` (pandas) | Markdown table              |
| `.ipynb`      | `_parse_ipynb` (nbformat) | Markdown + code blocks       |

### 5.4 Export Engine

Two export paths exist for DOCX:

- **Path A — Fresh DOCX**: `export_to_docx()` creates a new document with basic heading/list/paragraph mapping.
- **Path B — Template DOCX**: `export_to_docx_from_template()` clones the user's template, clears body content, and injects AI output using the template's native styles (preserving fonts, margins, headers/footers).

PDF export uses ReportLab's `SimpleDocTemplate` with markdown-to-Paragraph conversion.

---

## 6. Security

### 6.1 Authentication Flow

```text
Client                                 Server
  │                                      │
  │── POST /auth/register ──────────────>│  bcrypt hash → store User
  │<────────── 201 UserResponse ─────────│
  │                                      │
  │── POST /auth/login ─────────────────>│  bcrypt verify → JWT sign
  │<────────── 200 {access_token} ───────│
  │                                      │
  │── GET /api/v1/... ──────────────────>│  JWT decode → get_current_user
  │   Authorization: Bearer <token>      │
  │<────────── 200 Response ─────────────│
```

### 6.2 Security Measures

| Measure                  | Implementation                                    |
| ------------------------ | ------------------------------------------------- |
| Password Hashing         | bcrypt with random salt                           |
| Token Generation         | HS256 JWT with configurable expiry (30 min default)|
| Route Protection         | `get_current_user` dependency on all protected endpoints |
| CORS Policy              | Explicit origin allowlist                         |
| File Validation          | Extension whitelist + size limit enforcement       |
| SQL Injection Prevention | SQLAlchemy parameterized queries                  |
| Project Isolation         | All queries filter by `user_id` for ownership     |

---

## 7. Configuration

All configuration is managed via `pydantic-settings` with `.env` file support:

| Variable                     | Default                                    | Description                    |
| ---------------------------- | ------------------------------------------ | ------------------------------ |
| `APP_NAME`                   | `"DocuMind"`                               | Application name               |
| `APP_VERSION`                | `"0.1.0"`                                  | Application version            |
| `DEBUG`                      | `True`                                     | Debug mode toggle              |
| `API_PREFIX`                 | `"/api/v1"`                                | API route prefix               |
| `SECRET_KEY`                 | `"supersecretkey-..."` (change in prod!)   | JWT signing secret             |
| `ALGORITHM`                  | `"HS256"`                                  | JWT algorithm                  |
| `ACCESS_TOKEN_EXPIRE_MINUTES`| `30`                                       | Token expiry duration          |
| `CORS_ORIGINS`               | `["http://localhost:5173", ...]`           | Allowed CORS origins           |
| `DATABASE_URL`               | `"sqlite:///./documind.db"`                | Database connection string     |
| `GEMINI_API_KEY`             | `None`                                     | Google Gemini API key          |
| `MAX_FILE_SIZE_MB`           | `100`                                      | Max upload file size           |
| `UPLOAD_DIR`                 | `"uploads"`                                | Uploaded files directory       |
| `OUTPUT_DIR`                 | `"outputs"`                                | Generated exports directory    |

---

## 8. Error Handling

### 8.1 HTTP Status Codes

| Code | Usage                                                    |
| ---- | -------------------------------------------------------- |
| 200  | Successful read / update                                 |
| 201  | Successful resource creation                             |
| 204  | Successful deletion (no content)                         |
| 400  | Validation error (bad file type, no files uploaded, etc.)|
| 401  | Authentication failed (bad credentials, expired token)   |
| 404  | Resource not found or access denied                      |

### 8.2 Report Generation Error Handling

- Background task catches all exceptions.
- On failure, `report.status` is set to `"failed"` and `report.content` stores the error message.
- Export failures are handled independently — a report may be `"completed"` with content but missing DOCX/PDF exports.

---

## 9. Performance Considerations

- **CrewAI Pipeline**: Runs 4 sequential LLM calls; total latency depends on model response times. Target: < 60 seconds.
- **File Parsing**: Synchronous file reading; large files (>50MB) may cause delays.
- **Background Tasks**: FastAPI's built-in `BackgroundTasks` runs in the same process; for production, consider Celery + Redis.
- **Database**: SQLite with `check_same_thread=False` for development; PostgreSQL for production concurrency.

---

## 10. Deployment Architecture (Planned)

```text
┌──────────────────────────────────────────┐
│              Nginx (Reverse Proxy)        │
│         SSL Termination + Static Files    │
└──────┬──────────────────────┬────────────┘
       │                      │
       ▼                      ▼
┌──────────────┐    ┌──────────────────┐
│  Frontend    │    │  Backend (API)    │
│  Container   │    │  Container        │
│  (Vite Build)│    │  (Uvicorn)        │
└──────────────┘    └────────┬─────────┘
                             │
                ┌────────────┼────────────┐
                ▼            ▼            ▼
         ┌───────────┐ ┌──────────┐ ┌──────────┐
         │ PostgreSQL│ │  MinIO   │ │ Redis    │
         │    DB     │ │ Storage  │ │ (Queue)  │
         └───────────┘ └──────────┘ └──────────┘
```

All services will be containerized using Docker Compose for local development and deployed to AWS EC2 for production.

---

## 11. References

- [SRS.md](file:///d:/GitHub/DocuMind/docs/SRS.md) — Software Requirements Specification
- [PRD.md](file:///d:/GitHub/DocuMind/docs/PRD.md) — Product Requirements Document
- [Schema.md](file:///d:/GitHub/DocuMind/docs/Schema.md) — Database Schema Reference
- [AppFlow.md](file:///d:/GitHub/DocuMind/docs/AppFlow.md) — Application Flow Documentation
