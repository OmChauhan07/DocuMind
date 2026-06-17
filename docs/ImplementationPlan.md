# Implementation Plan

# DocuMind — AI-Powered Smart Report Generator

| Field       | Value                |
| ----------- | -------------------- |
| Version     | 1.0                  |
| Author      | Om Chauhan           |
| Date        | June 2026            |

---

## 1. Overview

This document provides a phased implementation plan for DocuMind, covering what has been built (Phase 1), what is planned next (Phases 2–5), and the technical approach for each milestone. Each phase includes specific deliverables, technical decisions, and acceptance criteria.

---

## 2. Phase Summary

| Phase    | Name                            | Status        | Timeline     |
| -------- | ------------------------------- | ------------- | ------------ |
| Phase 1  | MVP Core                        | ✅ Complete    | —            |
| Phase 2  | Version Control + Live Editing  | 🔲 Next Up    | Q3 2026      |
| Phase 3  | Template Library + Custom Templates | 🔲 Planned | Q4 2026      |
| Phase 4  | GitHub Integration + PPT Export | 🔲 Backlog    | Q1 2027      |
| Phase 5  | Collaboration + Integrations    | 🔲 Backlog    | Q2 2027      |

---

## 3. Phase 1 — MVP Core ✅

### 3.1 Objective

Build the minimum viable product: user auth, project/file management, AI-powered report generation, and DOCX/PDF export.

### 3.2 Delivered Components

#### Backend

| Component                  | File(s)                          | Status |
| -------------------------- | -------------------------------- | ------ |
| FastAPI application setup  | [main.py](file:///d:/GitHub/DocuMind/backend/app/main.py) | ✅ |
| Pydantic configuration     | [config.py](file:///d:/GitHub/DocuMind/backend/app/core/config.py) | ✅ |
| SQLAlchemy DB setup        | [database.py](file:///d:/GitHub/DocuMind/backend/app/core/database.py) | ✅ |
| JWT + bcrypt security      | [security.py](file:///d:/GitHub/DocuMind/backend/app/core/security.py) | ✅ |
| User model + schema        | [models/user.py](file:///d:/GitHub/DocuMind/backend/app/models/user.py), [schemas/user.py](file:///d:/GitHub/DocuMind/backend/app/schemas/user.py) | ✅ |
| Project model + schema     | [models/project.py](file:///d:/GitHub/DocuMind/backend/app/models/project.py), [schemas/project.py](file:///d:/GitHub/DocuMind/backend/app/schemas/project.py) | ✅ |
| File model + schema        | [models/file.py](file:///d:/GitHub/DocuMind/backend/app/models/file.py), [schemas/file.py](file:///d:/GitHub/DocuMind/backend/app/schemas/file.py) | ✅ |
| Report model + schema      | [models/report.py](file:///d:/GitHub/DocuMind/backend/app/models/report.py), [schemas/report.py](file:///d:/GitHub/DocuMind/backend/app/schemas/report.py) | ✅ |
| Auth routes                | [routes/auth.py](file:///d:/GitHub/DocuMind/backend/app/api/routes/auth.py) | ✅ |
| Project routes             | [routes/projects.py](file:///d:/GitHub/DocuMind/backend/app/api/routes/projects.py) | ✅ |
| File routes + upload       | [routes/files.py](file:///d:/GitHub/DocuMind/backend/app/api/routes/files.py) | ✅ |
| Report routes + download   | [routes/reports.py](file:///d:/GitHub/DocuMind/backend/app/api/routes/reports.py) | ✅ |
| File parser (6 formats)    | [file_parser.py](file:///d:/GitHub/DocuMind/backend/app/utils/file_parser.py) | ✅ |
| Export engine (DOCX + PDF)  | [export_utils.py](file:///d:/GitHub/DocuMind/backend/app/utils/export_utils.py) | ✅ |
| CrewAI agents (4 agents)   | [agents.py](file:///d:/GitHub/DocuMind/backend/app/ai/agents.py) | ✅ |
| CrewAI tasks (4 tasks)     | [tasks.py](file:///d:/GitHub/DocuMind/backend/app/ai/tasks.py) | ✅ |
| Crew orchestration         | [crew.py](file:///d:/GitHub/DocuMind/backend/app/ai/crew.py) | ✅ |
| LLM configuration          | [llm.py](file:///d:/GitHub/DocuMind/backend/app/ai/llm.py) | ✅ |

#### Frontend

| Component                  | File(s)                          | Status |
| -------------------------- | -------------------------------- | ------ |
| App routing + auth provider| [App.jsx](file:///d:/GitHub/DocuMind/frontend/src/App.jsx) | ✅ |
| Sign In page               | [SignIn.jsx](file:///d:/GitHub/DocuMind/frontend/src/pages/SignIn.jsx) | ✅ |
| Sign Up page               | [SignUp.jsx](file:///d:/GitHub/DocuMind/frontend/src/pages/SignUp.jsx) | ✅ |
| Dashboard page             | [Dashboard.jsx](file:///d:/GitHub/DocuMind/frontend/src/pages/Dashboard.jsx) | ✅ |
| Upload Files page          | [UploadFiles.jsx](file:///d:/GitHub/DocuMind/frontend/src/pages/UploadFiles.jsx) | ✅ |
| Report Progress page       | [ReportProgress.jsx](file:///d:/GitHub/DocuMind/frontend/src/pages/ReportProgress.jsx) | ✅ |
| Protected Route guard      | [ProtectedRoute.jsx](file:///d:/GitHub/DocuMind/frontend/src/components/ProtectedRoute.jsx) | ✅ |
| Main Layout (Sidebar)      | [MainLayout.jsx](file:///d:/GitHub/DocuMind/frontend/src/components/MainLayout.jsx) | ✅ |

---

## 4. Phase 2 — Version Control + Live Editing 🔲

### 4.1 Objective

Add report versioning with rollback capability and in-browser editing with section-wise AI regeneration.

### 4.2 Technical Approach

#### 4.2.1 Report Version Control

**New Table:** `report_versions`

```sql
CREATE TABLE report_versions (
    id              INTEGER PRIMARY KEY,
    report_id       INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    version_number  INTEGER NOT NULL,
    content         TEXT NOT NULL,
    report_path     TEXT,
    change_summary  TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(report_id, version_number)
);
```

**Backend Changes:**
- New model: `app/models/report_version.py`
- New schema: `app/schemas/report_version.py`
- New routes in `routes/reports.py`:
  - `GET /reports/{id}/versions` — List all versions.
  - `POST /reports/{id}/rollback` — Rollback to a specific version.
  - `GET /reports/{id}/versions/{version_number}` — Get specific version.
- Modify `_run_report_generation()` to auto-create version on completion.
- Modify report update logic to increment `version` and snapshot previous state.

#### 4.2.2 Live Editing

**Backend Changes:**
- New route: `PUT /reports/{id}` — Update report content (accepts markdown edits).
- New route: `POST /reports/{id}/regenerate-section` — Regenerate a specific section.
  - Body: `{ section_title: "Introduction", instructions: "Make it more concise" }`
  - Uses an "Update Agent" (new CrewAI agent) with targeted prompts.
- New agent: `get_update_agent()` in `agents.py`.

**Frontend Changes:**
- New page: `ReportEditor.jsx` — Markdown editor with section panels.
- Split markdown into sections by `#` headings for section-level editing.
- "Regenerate" button per section triggers `/regenerate-section`.
- Auto-save draft functionality via debounced `PUT /reports/{id}`.

### 4.3 Deliverables

| Deliverable                         | Type     |
| ----------------------------------- | -------- |
| `report_versions` table + migration | Backend  |
| Version list & rollback endpoints   | Backend  |
| Report update endpoint              | Backend  |
| Section regeneration endpoint       | Backend  |
| Update Agent (CrewAI)               | Backend  |
| Version History UI panel            | Frontend |
| Report Editor page                  | Frontend |

### 4.4 Acceptance Criteria

- [ ] User can view version history for any completed report.
- [ ] User can rollback to any previous version.
- [ ] User can edit report content inline and save changes.
- [ ] User can regenerate individual sections with custom instructions.
- [ ] Version number auto-increments on each change.

---

## 5. Phase 3 — Template Library + Custom Templates 🔲

### 5.1 Objective

Provide predefined report templates (Internship, Research, Project, Weekly, Monthly) and allow users to create/save custom templates.

### 5.2 Technical Approach

#### 5.2.1 Template Management

**New Table:** `templates`

```sql
CREATE TABLE templates (
    id              INTEGER PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
    template_name   TEXT NOT NULL,
    template_type   TEXT NOT NULL,
    template_path   TEXT,
    structure_json  TEXT,
    is_system       BOOLEAN DEFAULT FALSE,
    description     TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Backend Changes:**
- New model: `app/models/template.py`
- New routes: `routes/templates.py`
  - `GET /templates` — List available templates (system + user's custom).
  - `POST /templates` — Create custom template.
  - `PUT /templates/{id}` — Update template.
  - `DELETE /templates/{id}` — Delete custom template (cannot delete system templates).
- Seed system templates on startup (predefined structures for each report type).
- Modify report generation to use template structure for section ordering.

#### 5.2.2 Template Structure

Template `structure_json` defines the report skeleton:

```json
{
  "name": "Internship Report",
  "sections": [
    {"title": "Title Page", "required": true},
    {"title": "Abstract", "required": true},
    {"title": "Objectives", "required": true},
    {"title": "Company Overview", "required": false},
    {"title": "Work Done", "required": true},
    {"title": "Technologies Used", "required": true},
    {"title": "Results & Learnings", "required": true},
    {"title": "Conclusion", "required": true},
    {"title": "References", "required": false}
  ]
}
```

**Frontend Changes:**
- New page: `Templates.jsx` — Browse and manage templates.
- Template preview cards with section outline.
- Custom template builder (drag-and-drop section ordering).
- Template selector integrated into report generation flow.

### 5.3 Deliverables

| Deliverable                          | Type     |
| ------------------------------------ | -------- |
| `templates` table + migration        | Backend  |
| Template CRUD endpoints              | Backend  |
| System template seeding              | Backend  |
| Template-aware report generation     | Backend  |
| Template browser/manager page        | Frontend |
| Custom template builder              | Frontend |

### 5.4 Acceptance Criteria

- [ ] 5 predefined system templates available out of the box.
- [ ] User can create, edit, and delete custom templates.
- [ ] Report generation follows the selected template structure.
- [ ] Template preview shows section outline.

---

## 6. Phase 4 — GitHub Integration + PPT Export 🔲

### 6.1 Objective

Allow users to connect GitHub repositories as file sources and export reports as PowerPoint presentations.

### 6.2 Technical Approach

#### 6.2.1 GitHub Integration

- OAuth2 flow for GitHub authentication.
- GitHub API integration to list repos, branches, and fetch files.
- New route: `POST /projects/{id}/import-github` — Import files from a GitHub repo.
- File parser extended to handle repository directory structures.
- Store GitHub metadata (repo URL, branch, commit SHA) on files.

#### 6.2.2 PPT Export

- New export function using `python-pptx`.
- Map report sections to slides.
- Support for title slides, content slides, and chart slides.
- New download format: `GET /reports/{id}/download/pptx`.

### 6.3 Acceptance Criteria

- [ ] User can link a GitHub account via OAuth.
- [ ] User can import files from any accessible GitHub repository.
- [ ] Reports can be downloaded as `.pptx` files.

---

## 7. Phase 5 — Collaboration + Integrations 🔲

### 7.1 Objective

Enable multi-user collaboration on reports and integrate with external communication platforms.

### 7.2 Technical Approach

#### 7.2.1 Real-Time Collaboration

- WebSocket integration for live multi-user editing.
- Operational Transform (OT) or CRDT for conflict resolution.
- User presence indicators (cursors, active users).
- Permission model: Owner, Editor, Viewer roles on projects.

#### 7.2.2 Platform Integrations

- **Slack**: Webhook notifications for report completion; slash command for report generation.
- **Microsoft Teams**: Similar webhook + bot integration.
- **Voice Input**: Speech-to-text for voice-based report instructions (using Whisper API or similar).

### 7.3 Acceptance Criteria

- [ ] Multiple users can edit a report simultaneously.
- [ ] Report completion notifications sent to Slack/Teams.
- [ ] Users can dictate report instructions via voice.

---

## 8. Technical Debt & Improvements

Items to address across all phases:

| Item                                  | Priority | Phase  |
| ------------------------------------- | -------- | ------ |
| Migrate SQLite → PostgreSQL           | P1       | Phase 2 |
| Migrate local storage → S3/MinIO      | P1       | Phase 2 |
| Add Celery + Redis for background jobs| P1       | Phase 2 |
| Add comprehensive error logging       | P1       | Phase 2 |
| Add request rate limiting             | P2       | Phase 2 |
| Add API pagination on list endpoints  | P2       | Phase 2 |
| Add Docker Compose for full stack     | P1       | Phase 3 |
| Add CI/CD pipeline (GitHub Actions)   | P1       | Phase 3 |
| Add comprehensive test suite          | P1       | Phase 3 |
| Add API documentation (OpenAPI spec)  | P2       | Phase 3 |
| Password reset flow                   | P1       | Phase 2 |
| Email verification                    | P2       | Phase 3 |
| Role-based access control (RBAC)      | P2       | Phase 5 |

---

## 9. Risk Assessment

| Risk                                  | Impact | Mitigation                                   |
| ------------------------------------- | ------ | -------------------------------------------- |
| Gemini API rate limits / downtime     | High   | Add retry logic with exponential backoff; allow model fallback |
| Large file processing timeouts        | Medium | Add file size warnings; chunk large files for parsing |
| CrewAI pipeline failures              | High   | Robust error handling; partial report recovery |
| Data loss on SQLite                   | High   | Migrate to PostgreSQL early in Phase 2       |
| Security vulnerabilities (JWT, CORS)  | High   | Security audit before production deployment  |
| Scope creep on template system        | Medium | Define strict template structure schema early |

---

## 10. References

- [PRD.md](file:///d:/GitHub/DocuMind/docs/PRD.md) — Product Requirements Document
- [SRS.md](file:///d:/GitHub/DocuMind/docs/SRS.md) — Software Requirements Specification
- [TechSpec.md](file:///d:/GitHub/DocuMind/docs/TechSpec.md) — Technical Specification
- [Schema.md](file:///d:/GitHub/DocuMind/docs/Schema.md) — Database Schema Reference
- [Tracker.md](file:///d:/GitHub/DocuMind/docs/Tracker.md) — Development Tracker
