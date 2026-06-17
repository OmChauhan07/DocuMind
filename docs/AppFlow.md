# Application Flow

# DocuMind — AI-Powered Smart Report Generator

| Field       | Value                |
| ----------- | -------------------- |
| Version     | 1.0                  |
| Author      | Om Chauhan           |
| Date        | June 2026            |

---

## 1. Overview

This document describes the end-to-end user journeys and system data flows within DocuMind. Each flow maps to a specific feature module and traces the path from user action through frontend, backend, AI pipeline, and back.

---

## 2. User Journey Map

```text
                    ┌──────────────────────────────────────────┐
                    │           New User Arrives                │
                    └──────────────────┬───────────────────────┘
                                       │
                              ┌────────┴────────┐
                              │   Has Account?   │
                              └────┬────────┬────┘
                                   │        │
                                 No│        │Yes
                                   ▼        ▼
                            ┌──────────┐ ┌──────────┐
                            │  Sign Up │ │  Sign In │
                            └────┬─────┘ └────┬─────┘
                                 │            │
                                 └─────┬──────┘
                                       ▼
                              ┌────────────────┐
                              │   Dashboard    │
                              │ (Project List) │
                              └───────┬────────┘
                                      │
                           ┌──────────┴──────────┐
                           │                     │
                    Create Project         Select Project
                           │                     │
                           └──────────┬──────────┘
                                      ▼
                              ┌────────────────┐
                              │  Upload Files  │
                              │ + Set Template │
                              └───────┬────────┘
                                      │
                              ┌───────┴────────┐
                              │ Generate Report│
                              └───────┬────────┘
                                      │
                              ┌───────┴────────┐
                              │ Track Progress │
                              │ (Polling)      │
                              └───────┬────────┘
                                      │
                              ┌───────┴────────┐
                              │ Download Report│
                              │ (DOCX / PDF)   │
                              └────────────────┘
```

---

## 3. Detailed Flow Diagrams

### 3.1 Registration Flow

```text
User                    Frontend (SignUp.jsx)           Backend (/auth/register)          Database
 │                           │                                │                             │
 │── Fill form ─────────────>│                                │                             │
 │   (name, email, password) │                                │                             │
 │                           │── POST /api/v1/auth/register ─>│                             │
 │                           │   {name, email, password}      │                             │
 │                           │                                │── Check email uniqueness ──>│
 │                           │                                │<──── Result ────────────────│
 │                           │                                │                             │
 │                           │                                │── bcrypt hash password      │
 │                           │                                │── INSERT User ─────────────>│
 │                           │                                │<──── User record ───────────│
 │                           │                                │                             │
 │                           │<──── 201 {id, name, email} ────│                             │
 │<── Redirect to /login ───│                                │                             │
```

**Error Paths:**
- Email already registered → `400 "Email already registered"` → Show error toast.
- Validation failure (invalid email) → `422 Validation Error` → Show field errors.

---

### 3.2 Login Flow

```text
User                    Frontend (SignIn.jsx)           Backend (/auth/login)             Database
 │                           │                                │                             │
 │── Enter credentials ────>│                                │                             │
 │   (email, password)       │                                │                             │
 │                           │── POST /api/v1/auth/login ───>│                             │
 │                           │   {email, password}            │                             │
 │                           │                                │── Find user by email ──────>│
 │                           │                                │<──── User record ───────────│
 │                           │                                │                             │
 │                           │                                │── bcrypt.checkpw()          │
 │                           │                                │── jwt.encode({sub: user.id})│
 │                           │                                │                             │
 │                           │<── 200 {access_token} ─────────│                             │
 │                           │                                │                             │
 │                           │── Store token (AuthContext) ──>│                             │
 │<── Redirect to /dashboard│                                │                             │
```

**Token Lifecycle:**
- Token is stored in React `AuthContext` (in-memory state).
- Token is attached to every subsequent API request via Axios interceptor (`Authorization: Bearer <token>`).
- Token expires after 30 minutes (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`).

---

### 3.3 Project Creation Flow

```text
User                   Frontend (Dashboard.jsx)        Backend (/projects)              Database
 │                           │                                │                             │
 │── Click "New Project" ──>│                                │                             │
 │── Enter name + desc ────>│                                │                             │
 │                           │── POST /api/v1/projects ─────>│                             │
 │                           │   {project_name, description} │                             │
 │                           │                                │── Verify JWT ──────────────>│
 │                           │                                │── INSERT Project ──────────>│
 │                           │                                │   (user_id from JWT)        │
 │                           │                                │<──── Project record ────────│
 │                           │<── 201 ProjectResponse ────────│                             │
 │<── Show project in list ─│                                │                             │
```

---

### 3.4 File Upload Flow

```text
User                  Frontend (UploadFiles.jsx)       Backend (/files/upload)           Storage
 │                           │                                │                             │
 │── Select files ──────────>│                                │                             │
 │── Toggle "is_template" ──>│                                │                             │
 │── Click "Upload" ────────>│                                │                             │
 │                           │                                │                             │
 │                           │── POST /api/v1/files/upload ─>│                             │
 │                           │   multipart/form-data:         │                             │
 │                           │   {project_id, is_template,    │                             │
 │                           │    file}                       │                             │
 │                           │                                │                             │
 │                           │                                │── validate_file()           │
 │                           │                                │   • Check extension whitelist│
 │                           │                                │   • Check file size ≤ 100MB  │
 │                           │                                │                             │
 │                           │                                │── save_upload_file() ──────>│
 │                           │                                │   uploads/{project_id}/{name}│
 │                           │                                │<──── file_path ─────────────│
 │                           │                                │                             │
 │                           │                                │── INSERT File (DB)          │
 │                           │<── 201 FileResponse ───────────│                             │
 │<── Show file in list ────│                                │                             │
```

**Supported File Types:**

| Extension | Parser Used     | Content Output                    |
| --------- | --------------- | --------------------------------- |
| `.py`     | Text reader     | Raw Python source code            |
| `.ipynb`  | nbformat        | Markdown + fenced code blocks     |
| `.csv`    | pandas          | Markdown table                    |
| `.xlsx`   | pandas + openpyxl| Markdown table                   |
| `.docx`   | python-docx     | Markdown (headings + paragraphs)  |
| `.pdf`    | PyMuPDF         | Extracted page text               |
| `.txt`    | Text reader     | Raw text                          |
| `.md`     | Text reader     | Raw markdown                      |

---

### 3.5 Report Generation Flow (Core Pipeline)

This is the most complex flow — it involves background processing and multi-agent AI execution.

```text
User              Frontend              Backend                  CrewAI Pipeline            Export Engine
 │                    │                      │                         │                         │
 │── Click Generate ─>│                      │                         │                         │
 │                    │── POST /reports ────>│                         │                         │
 │                    │   {project_id,       │                         │                         │
 │                    │    report_name,      │                         │                         │
 │                    │    template_type}    │                         │                         │
 │                    │                      │                         │                         │
 │                    │                      │── Verify ownership      │                         │
 │                    │                      │── Get project files     │                         │
 │                    │                      │── Separate content      │                         │
 │                    │                      │   files from templates  │                         │
 │                    │                      │                         │                         │
 │                    │                      │── INSERT Report         │                         │
 │                    │                      │   (status: "pending")   │                         │
 │                    │                      │                         │                         │
 │                    │                      │── Enqueue background ──>│                         │
 │                    │                      │   task                  │                         │
 │                    │<── 201 Report ───────│                         │                         │
 │                    │   (status: pending)  │                         │                         │
 │                    │                      │                         │                         │
 │                    │                   [BACKGROUND TASK STARTS]     │                         │
 │                    │                      │                         │                         │
 │                    │                      │── UPDATE status →       │                         │
 │                    │                      │   "processing"          │                         │
 │                    │                      │                         │                         │
 │                    │                      │── parse_file() for      │                         │
 │                    │                      │   each content file     │                         │
 │                    │                      │── parse_file() for      │                         │
 │                    │                      │   each template file    │                         │
 │                    │                      │                         │                         │
 │                    │                      │── setup_llm_env()       │                         │
 │                    │                      │── generate_report_      │                         │
 │                    │                      │   content() ───────────>│                         │
 │                    │                      │                         │                         │
 │                    │                      │                  ┌──────┴──────────────┐          │
 │                    │                      │                  │ 1. Analyzer Agent   │          │
 │                    │                      │                  │    (HEAVY model)    │          │
 │                    │                      │                  │    Extract insights │          │
 │                    │                      │                  └──────┬──────────────┘          │
 │                    │                      │                         │                         │
 │                    │                      │                  ┌──────┴──────────────┐          │
 │                    │                      │                  │ 2. Writer Agent     │          │
 │                    │                      │                  │    (HEAVY model)    │          │
 │                    │                      │                  │    Draft sections   │          │
 │                    │                      │                  └──────┬──────────────┘          │
 │                    │                      │                         │                         │
 │                    │                      │                  ┌──────┴──────────────┐          │
 │                    │                      │                  │ 3. Reviewer Agent   │          │
 │                    │                      │                  │    (HEAVY model)    │          │
 │                    │                      │                  │    Polish & verify  │          │
 │                    │                      │                  └──────┬──────────────┘          │
 │                    │                      │                         │                         │
 │                    │                      │                  ┌──────┴──────────────┐          │
 │                    │                      │                  │ 4. Formatter Agent  │          │
 │                    │                      │                  │    (LIGHT model)    │          │
 │                    │                      │                  │    Clean markdown   │          │
 │                    │                      │                  └──────┬──────────────┘          │
 │                    │                      │                         │                         │
 │                    │                      │<── Final markdown ──────│                         │
 │                    │                      │                         │                         │
 │                    │                      │── Store in report.content                        │
 │                    │                      │                                                   │
 │                    │                      │── export_to_docx() ──────────────────────────────>│
 │                    │                      │   (or export_to_docx_from_template())             │
 │                    │                      │── export_to_pdf() ──────────────────────────────>│
 │                    │                      │<── outputs/report_{id}.docx ─────────────────────│
 │                    │                      │<── outputs/report_{id}.pdf ──────────────────────│
 │                    │                      │                                                   │
 │                    │                      │── UPDATE status →                                 │
 │                    │                      │   "completed"                                     │
 │                    │                      │                                                   │
 │              [POLLING LOOP]               │                                                   │
 │                    │── GET /reports/{id} ─>│                                                  │
 │                    │<── status: processing │                                                  │
 │                    │        ...            │                                                  │
 │                    │── GET /reports/{id} ─>│                                                  │
 │                    │<── status: completed  │                                                  │
 │                    │                      │                                                   │
 │<── Show download ─│                      │                                                   │
 │    buttons        │                      │                                                   │
```

---

### 3.6 Report Download Flow

```text
User               Frontend (ReportProgress.jsx)    Backend                          Storage
 │                       │                                │                             │
 │── Click Download ────>│                                │                             │
 │   (DOCX or PDF)       │                                │                             │
 │                       │── GET /reports/{id}/           │                             │
 │                       │   download/{format} ──────────>│                             │
 │                       │                                │── Verify ownership          │
 │                       │                                │── Check status == completed │
 │                       │                                │── Check file exists ───────>│
 │                       │                                │<── File binary ─────────────│
 │                       │<── FileResponse (binary) ──────│                             │
 │<── Save file dialog ─│                                │                             │
```

---

## 4. State Transitions

### 4.1 Report Status Machine

```text
                ┌─────────┐
                │ pending  │  (Created, queued for processing)
                └────┬─────┘
                     │
          Background task starts
                     │
                     ▼
              ┌────────────┐
              │ processing │  (CrewAI pipeline running)
              └──┬─────┬───┘
                 │     │
           Success   Failure
                 │     │
                 ▼     ▼
          ┌──────────┐ ┌────────┐
          │completed │ │ failed │
          └──────────┘ └────────┘
```

| Status      | Description                                    | User Action Available        |
| ----------- | ---------------------------------------------- | ---------------------------- |
| `pending`   | Report record created, waiting for background  | View status                  |
| `processing`| AI pipeline is actively running                | View status (polling)        |
| `completed` | AI generation + export finished successfully   | Download DOCX/PDF, view content |
| `failed`    | Pipeline encountered an error                  | View error message, retry    |

---

## 5. Authentication State Flow

### 5.1 Frontend Auth Context

```text
┌───────────────────────────────────────────┐
│            AuthContext (React)            │
│                                           │
│  State:                                   │
│    • token: string | null                 │
│    • user: {id, name, email} | null       │
│    • isAuthenticated: boolean             │
│                                           │
│  Actions:                                 │
│    • login(email, password) → set token   │
│    • register(name, email, pwd) → login   │
│    • logout() → clear token, redirect     │
│                                           │
└───────────────────────────────────────────┘

Route Guards (ProtectedRoute.jsx):
  • If !isAuthenticated → <Navigate to="/login" />
  • If isAuthenticated  → render children inside <MainLayout />
```

### 5.2 Request Lifecycle with Auth

```text
Every authenticated request:
  1. Axios interceptor reads token from AuthContext
  2. Attaches header: Authorization: Bearer <token>
  3. Backend deps.py: get_current_user()
     a. Extract token from header
     b. jwt.decode() → extract user_id from 'sub' claim
     c. Query database for User with that id
     d. Return User object (or raise 401)
```

---

## 6. Data Flow Summary

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA FLOW OVERVIEW                             │
│                                                                        │
│  User Input                                                            │
│    │                                                                   │
│    ├── Credentials ──> AuthContext ──> JWT Token ──> API Headers       │
│    │                                                                   │
│    ├── Project Info ──> POST /projects ──> projects table              │
│    │                                                                   │
│    ├── Files ──> POST /files/upload ──> uploads/{project_id}/ (disk)  │
│    │                               ──> files table (metadata)          │
│    │                                                                   │
│    └── Report Request ──> POST /reports ──> reports table (pending)   │
│                                         ──> Background Task           │
│                                               │                       │
│                                               ├── parse_file() × N   │
│                                               ├── CrewAI Pipeline     │
│                                               │   (4 agents)          │
│                                               ├── export_to_docx()   │
│                                               ├── export_to_pdf()    │
│                                               └── UPDATE report      │
│                                                   (status, content,  │
│                                                    report_path)      │
│                                                                        │
│  Output                                                                │
│    ├── Report Content (Markdown) ──> Displayed in UI                  │
│    ├── report_{id}.docx ──> Download via /download/docx              │
│    └── report_{id}.pdf  ──> Download via /download/pdf               │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Error Flow

```text
┌──────────────────────────────────────────────┐
│              Error Handling Paths             │
├──────────────────────────────────────────────┤
│                                              │
│  AUTH ERRORS:                                │
│    • Invalid credentials → 401 → Show toast  │
│    • Expired token → 401 → Redirect to login │
│    • Duplicate email → 400 → Show field error│
│                                              │
│  FILE ERRORS:                                │
│    • Invalid extension → 400 → Show toast    │
│    • File too large → 400 → Show toast       │
│    • Project not found → 404 → Show toast    │
│                                              │
│  REPORT ERRORS:                              │
│    • No files uploaded → 400 → Show toast    │
│    • LLM API failure → report.status=failed  │
│    • Export failure → report completed but    │
│      missing DOCX/PDF → download returns 404 │
│    • File not on disk → 404 → Show toast     │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 8. References

- [SRS.md](file:///d:/GitHub/DocuMind/docs/SRS.md) — Software Requirements Specification
- [TechSpec.md](file:///d:/GitHub/DocuMind/docs/TechSpec.md) — Technical Specification
- [Design.md](file:///d:/GitHub/DocuMind/docs/Design.md) — Design Documentation
