# Coding Rules & Conventions

# DocuMind — AI-Powered Smart Report Generator

| Field       | Value                |
| ----------- | -------------------- |
| Version     | 1.0                  |
| Author      | Om Chauhan           |
| Date        | June 2026            |

---

## 1. Overview

This document defines the coding standards, naming conventions, file structure rules, commit guidelines, and pull request protocols for the DocuMind project. All contributors must follow these rules to maintain code consistency and quality.

---

## 2. General Principles

1. **Readability over cleverness** — Code should be easy to understand at first glance.
2. **Consistency over preference** — Follow the established patterns, even if you prefer a different style.
3. **Explicit over implicit** — Prefer clear, verbose code over cryptic one-liners.
4. **DRY but not too DRY** — Avoid repetition, but don't over-abstract at the cost of readability.
5. **Comment the "why", not the "what"** — Code should explain what it does; comments should explain why.

---

## 3. Python (Backend) Conventions

### 3.1 Style Guide

| Rule                  | Standard                                                 |
| --------------------- | -------------------------------------------------------- |
| Style Guide           | PEP 8                                                    |
| Line Length           | 120 characters max                                       |
| Indentation           | 4 spaces (no tabs)                                       |
| Quotes                | Double quotes for strings (`"hello"`)                    |
| Imports               | stdlib → third-party → local, separated by blank lines  |
| Type Hints            | Required on all function signatures                      |
| Docstrings            | Required on all public functions and classes             |

### 3.2 Naming Conventions

| Element            | Convention            | Example                        |
| ------------------ | --------------------- | ------------------------------ |
| Variables          | `snake_case`          | `file_contents`                |
| Functions          | `snake_case`          | `get_password_hash()`          |
| Classes            | `PascalCase`          | `ReportResponse`               |
| Constants          | `UPPER_SNAKE_CASE`    | `HEAVY_MODEL`                  |
| Private functions  | `_leading_underscore` | `_parse_pdf()`                 |
| Module files       | `snake_case.py`       | `file_parser.py`               |
| Package dirs       | `snake_case/`         | `api/routes/`                  |

### 3.3 Import Ordering

```python
# 1. Standard library
import os
import re
from datetime import datetime, timedelta

# 2. Third-party packages
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

# 3. Local application imports
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
```

### 3.4 Function Signatures

```python
# ✅ Good — Type hints on all parameters and return type
def create_access_token(subject: Union[str, int], expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token for the given subject."""
    ...

# ❌ Bad — No type hints, no docstring
def create_access_token(subject, expires_delta=None):
    ...
```

### 3.5 Error Handling

```python
# ✅ Good — Specific exception handling with meaningful messages
try:
    content = parse_file(f["file_path"], f["file_type"])
except FileNotFoundError:
    content = f"[File not found: {f['file_name']}]"
except Exception as e:
    content = f"[Could not read file: {e}]"

# ❌ Bad — Bare except, swallows all errors silently
try:
    content = parse_file(f["file_path"], f["file_type"])
except:
    pass
```

### 3.6 FastAPI Route Conventions

| Rule                        | Convention                                              |
| --------------------------- | ------------------------------------------------------- |
| Router file naming          | Resource name (plural): `auth.py`, `projects.py`       |
| Endpoint function naming    | Action + resource: `create_project`, `get_reports`      |
| HTTP method mapping         | `POST` = create, `GET` = read, `PUT` = update, `DELETE` = delete |
| Status codes                | `201` for creation, `200` for reads, `204` for deletes  |
| Response models             | Always specify `response_model` parameter               |
| Error responses             | Use `HTTPException` with appropriate status codes       |
| Dependencies                | Use `Depends()` for DB sessions, auth, and shared logic |

```python
# ✅ Good — Complete route definition
@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new project for the authenticated user."""
    ...
```

### 3.7 SQLAlchemy Model Conventions

| Rule                  | Convention                                             |
| --------------------- | ------------------------------------------------------ |
| Table naming          | Lowercase plural: `users`, `projects`, `files`         |
| Column naming         | `snake_case`: `user_id`, `file_path`, `created_at`     |
| Primary keys          | Always `id = Column(Integer, primary_key=True, index=True)` |
| Foreign keys          | `{parent_table_singular}_id`: `user_id`, `project_id`  |
| Timestamps            | Use `DateTime(timezone=True)` with `server_default=func.now()` |
| Cascades              | Use `cascade="all, delete-orphan"` on parent relationships |
| Back-populates        | Always define both sides of a relationship              |

### 3.8 Pydantic Schema Conventions

| Rule                  | Convention                                             |
| --------------------- | ------------------------------------------------------ |
| Base schema           | `{Model}Base` — shared fields                          |
| Create schema         | `{Model}Create` — request body for creation            |
| Response schema       | `{Model}Response` — API response format                |
| Config                | Always set `model_config = {"from_attributes": True}` on response schemas |
| Optional fields       | Use `Optional[type] = None` (not `Union[type, None]`)  |

---

## 4. JavaScript / React (Frontend) Conventions

### 4.1 Style Guide

| Rule                  | Standard                                        |
| --------------------- | ----------------------------------------------- |
| Language              | JavaScript (JSX, not TypeScript — for now)      |
| Formatter             | Prettier (2-space indent, single quotes, semicolons) |
| Linter                | ESLint with React Hooks plugin                  |
| Line Length            | 100 characters max                              |

### 4.2 Naming Conventions

| Element            | Convention            | Example                        |
| ------------------ | --------------------- | ------------------------------ |
| Components         | `PascalCase`          | `MainLayout.jsx`               |
| Component files    | `PascalCase.jsx`      | `Dashboard.jsx`                |
| Hooks              | `camelCase`, `use` prefix | `useAuth`, `useState`      |
| Event handlers     | `handle` prefix       | `handleSubmit`, `handleDelete` |
| Boolean props      | `is`/`has`/`can` prefix | `isLoading`, `hasError`     |
| Constants          | `UPPER_SNAKE_CASE`    | `API_BASE_URL`                 |
| CSS classes        | Tailwind utilities    | `bg-slate-800 text-white`      |
| Context files      | `{Name}Context.jsx`   | `AuthContext.jsx`              |
| Service files      | `camelCase.js`        | `api.js`                       |

### 4.3 Component Structure

```jsx
// 1. Imports (React → third-party → local components → local utils)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// 2. Component definition
function Dashboard() {
  // 2a. Hooks (state, context, navigation)
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // 2b. Effects
  useEffect(() => {
    fetchProjects();
  }, []);

  // 2c. Event handlers
  const handleCreateProject = async () => { ... };
  const handleDeleteProject = async (id) => { ... };

  // 2d. Helper/render functions
  const renderProjectCard = (project) => ( ... );

  // 2e. Main render
  return (
    <div>...</div>
  );
}

// 3. Export
export default Dashboard;
```

### 4.4 File Organization

```text
src/
├── components/       # Reusable UI components (layout, guards, shared)
├── context/          # React Context providers (auth, theme)
├── pages/            # Route-level page components (one per route)
├── services/         # API client and external service integrations
├── assets/           # Static assets (images, fonts)
├── App.jsx           # Root component with routing
├── main.jsx          # Entry point (ReactDOM.createRoot)
├── index.css         # Global styles / Tailwind imports
└── App.css           # App-level styles
```

### 4.5 API Call Patterns

```jsx
// ✅ Good — Consistent async/await with error handling
const fetchProjects = async () => {
  try {
    setIsLoading(true);
    const response = await api.get('/projects');
    setProjects(response.data);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    setError(error.response?.data?.detail || 'Failed to load projects');
  } finally {
    setIsLoading(false);
  }
};

// ❌ Bad — No error handling, no loading state
const fetchProjects = () => {
  api.get('/projects').then(res => setProjects(res.data));
};
```

---

## 5. CSS / Styling Conventions

### 5.1 Tailwind CSS Usage

| Rule                          | Convention                                     |
| ----------------------------- | ---------------------------------------------- |
| Utility-first approach        | Prefer Tailwind classes over custom CSS        |
| Custom CSS                    | Only for complex animations or global overrides|
| Class ordering                | Layout → Spacing → Sizing → Typography → Colors → Effects |
| Responsive prefixes           | `sm:`, `md:`, `lg:`, `xl:` (mobile-first)     |
| Dark mode                     | Use `dark:` prefix classes                     |

### 5.2 Color Usage

```jsx
// ✅ Good — Use Tailwind's predefined color scale
<div className="bg-slate-900 text-slate-50 border-slate-700" />

// ❌ Bad — Arbitrary hex values inline
<div style={{ backgroundColor: '#1a1a2e', color: '#fff' }} />
```

---

## 6. File Structure Conventions

### 6.1 Backend

```text
backend/
├── app/
│   ├── __init__.py         # Package init (can be empty)
│   ├── main.py             # FastAPI app entry (ONLY routing, no business logic)
│   ├── ai/                 # AI-specific code ONLY
│   ├── api/
│   │   ├── deps.py         # Shared dependencies (auth, db)
│   │   └── routes/         # One file per resource (auth, projects, files, reports)
│   ├── core/               # Infrastructure (config, database, security)
│   ├── models/             # SQLAlchemy models (one file per table)
│   ├── schemas/            # Pydantic schemas (one file per resource)
│   └── utils/              # Pure utility functions (no business logic)
├── alembic/                # Database migrations
├── uploads/                # User-uploaded files (gitignored)
├── outputs/                # Generated exports (gitignored)
├── tests/                  # Test files (mirror app/ structure)
└── pyproject.toml          # Project metadata + dependencies
```

### 6.2 Frontend

```text
frontend/
├── src/
│   ├── components/         # Reusable components (no page-level components)
│   ├── context/            # One file per context provider
│   ├── pages/              # One file per route/page
│   ├── services/           # API client and integrations
│   ├── hooks/              # Custom React hooks (future)
│   └── utils/              # Pure utility functions (future)
├── public/                 # Static assets served directly
└── package.json            # Dependencies
```

### 6.3 File Placement Rules

| File Type                | Location                    | Rule                                     |
| ------------------------ | --------------------------- | ---------------------------------------- |
| New API endpoint         | `api/routes/{resource}.py`  | One router per resource domain           |
| New database model       | `models/{table_name}.py`    | One model per file                       |
| New Pydantic schema      | `schemas/{resource}.py`     | Collocate with resource model            |
| New AI agent/task        | `ai/`                       | Keep agent definitions in `agents.py`, tasks in `tasks.py` |
| New utility function     | `utils/`                    | Must be stateless, no database access    |
| New React page           | `pages/{PageName}.jsx`      | One component per file                   |
| New React component      | `components/{Name}.jsx`     | Reusable, not page-specific              |
| Test files               | Mirror the source structure | `tests/test_{module}.py`                 |

---

## 7. Git Conventions

### 7.1 Branch Naming

| Branch Type    | Format                            | Example                         |
| -------------- | --------------------------------- | ------------------------------- |
| Feature        | `feature/{short-description}`     | `feature/version-control`       |
| Bug fix        | `fix/{short-description}`         | `fix/report-download-error`     |
| Hotfix         | `hotfix/{short-description}`      | `hotfix/jwt-expiry`             |
| Documentation  | `docs/{short-description}`        | `docs/api-specification`        |
| Refactor       | `refactor/{short-description}`    | `refactor/export-engine`        |

### 7.2 Commit Message Format

```text
<type>(<scope>): <short description>

<optional body — explain WHY, not WHAT>

<optional footer — references, breaking changes>
```

**Types:**

| Type       | Usage                                       |
| ---------- | ------------------------------------------- |
| `feat`     | New feature                                 |
| `fix`      | Bug fix                                     |
| `docs`     | Documentation only                          |
| `style`    | Formatting, no code change                  |
| `refactor` | Code change that neither fixes nor adds     |
| `test`     | Adding or updating tests                    |
| `chore`    | Build process, deps, tooling                |
| `perf`     | Performance improvement                     |

**Scopes:** `auth`, `projects`, `files`, `reports`, `ai`, `export`, `frontend`, `config`, `db`

**Examples:**

```text
feat(reports): add DOCX template-based export

The export engine now clones the user's template DOCX and injects AI
content using the template's native styles, preserving fonts, margins,
and headers/footers.

Closes #42
```

```text
fix(ai): handle Windows encoding errors in CrewAI logs

Set PYTHONIOENCODING=utf-8 to prevent charmap encoding errors when
CrewAI agents log emoji characters on Windows systems.
```

### 7.3 Commit Rules

1. **Atomic commits** — One logical change per commit.
2. **No WIP commits on main** — Use feature branches.
3. **No generated files** — Don't commit `uploads/`, `outputs/`, `__pycache__/`, `node_modules/`, `.env`.
4. **Sign commits** — Use `git commit -s` for sign-off (recommended).

---

## 8. Pull Request Guidelines

### 8.1 PR Title Format

Same as commit message format: `<type>(<scope>): <description>`

### 8.2 PR Description Template

```markdown
## What

Brief description of changes.

## Why

Context and motivation for the change.

## How

Technical approach and key decisions.

## Testing

- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] API documentation updated (if applicable)

## Screenshots (if UI changes)

[Attach screenshots or recordings]
```

### 8.3 PR Rules

1. **Keep PRs small** — Ideally < 400 lines changed.
2. **One concern per PR** — Don't mix features with refactors.
3. **Self-review first** — Review your own diff before requesting review.
4. **Resolve all comments** — Don't merge with unresolved review comments.
5. **Squash merge** — Use squash merge to keep main branch history clean.

---

## 9. Testing Conventions

### 9.1 Backend (pytest)

| Rule                    | Convention                                    |
| ----------------------- | --------------------------------------------- |
| Test file naming        | `test_{module}.py`                            |
| Test function naming    | `test_{what_is_being_tested}`                 |
| Test class naming       | `Test{Feature}`                               |
| Fixtures                | Use `conftest.py` for shared fixtures         |
| Assertions              | Use `assert` with descriptive messages        |
| API tests               | Use `TestClient` from FastAPI                 |

```python
# ✅ Good
def test_register_creates_user_with_hashed_password(client, db):
    response = client.post("/api/v1/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "securepass123"
    })
    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"
    assert "password" not in response.json()
```

### 9.2 Frontend (vitest)

| Rule                    | Convention                                    |
| ----------------------- | --------------------------------------------- |
| Test file naming        | `{Component}.test.jsx` or `{module}.test.js`  |
| Test grouping           | Use `describe()` blocks for logical groups    |
| Assertions              | Use `expect()` with jest-dom matchers         |
| Component tests         | Use `@testing-library/react` (render + screen)|

---

## 10. Environment & Configuration Rules

1. **Never commit `.env`** — Use `.env.example` as a template.
2. **Never hardcode secrets** — All secrets go through `pydantic-settings` + `.env`.
3. **Default values must be safe** — Default `SECRET_KEY` must trigger a warning in production.
4. **Feature flags** — Use config variables, not code comments, to toggle features.
5. **Dependency pinning** — Use `>=` lower bounds in `pyproject.toml`; lock via `uv.lock`.

---

## 11. Documentation Rules

1. **Every public function** must have a docstring.
2. **Every API endpoint** must have a description in the route decorator.
3. **Every model** must be documented in [Schema.md](file:///d:/GitHub/DocuMind/docs/Schema.md).
4. **Every new feature** must update the [Tracker.md](file:///d:/GitHub/DocuMind/docs/Tracker.md).
5. **README.md** must stay current with setup instructions.

---

## 12. References

- [PEP 8](https://peps.python.org/pep-0008/) — Python Style Guide
- [Conventional Commits](https://www.conventionalcommits.org/) — Commit Message Specification
- [React Documentation](https://react.dev/) — React Best Practices
- [FastAPI Best Practices](https://fastapi.tiangolo.com/tutorial/) — FastAPI Guidelines
