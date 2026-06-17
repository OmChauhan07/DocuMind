# Database Schema Reference

# DocuMind — AI-Powered Smart Report Generator

| Field       | Value                |
| ----------- | -------------------- |
| Version     | 1.0                  |
| Author      | Om Chauhan           |
| Date        | June 2026            |

---

## 1. Overview

DocuMind uses SQLAlchemy ORM with a relational database backend. Development uses SQLite (`documind.db`); production target is PostgreSQL. The schema consists of 4 core tables with foreign key relationships enforcing referential integrity and cascading deletes.

### Entity-Relationship Diagram

```text
┌──────────────────┐
│      users       │
│──────────────────│
│ PK  id           │
│     name         │
│     email (UQ)   │
│     password_hash│
│     created_at   │
└────────┬─────────┘
         │ 1
         │
         │ *
┌────────┴─────────┐
│    projects      │
│──────────────────│
│ PK  id           │
│ FK  user_id      │──────> users.id (CASCADE)
│     project_name │
│     description  │
│     created_at   │
└────┬────────┬────┘
     │ 1      │ 1
     │        │
     │ *      │ *
┌────┴────┐ ┌─┴───────────┐
│  files  │ │   reports   │
│─────────│ │─────────────│
│ PK  id  │ │ PK  id      │
│ FK  project_id │ │ FK  project_id │
│  file_name   │ │  report_name  │
│  file_path   │ │  version      │
│  file_type   │ │  report_path  │
│  is_template │ │  content      │
│  upload_date │ │  status       │
│         │ │  template_type│
│         │ │  created_at   │
└─────────┘ └─────────────┘
```

---

## 2. Table Definitions

### 2.1 `users`

Stores registered user accounts with hashed credentials.

| Column          | Type                | Constraints                    | Description                    |
| --------------- | ------------------- | ------------------------------ | ------------------------------ |
| `id`            | `Integer`           | `PRIMARY KEY`, `AUTO INCREMENT`, `INDEXED` | Unique user identifier         |
| `name`          | `String`            | `NOT NULL`                     | User's display name            |
| `email`         | `String`            | `NOT NULL`, `UNIQUE`, `INDEXED`| User's email address           |
| `password_hash` | `String`            | `NOT NULL`                     | bcrypt-hashed password         |
| `created_at`    | `DateTime(tz=True)` | `DEFAULT now()`                | Account creation timestamp     |

**Relationships:**
- `projects` → `Project[]` (one-to-many, `cascade="all, delete-orphan"`)

**SQLAlchemy Model:** [user.py](file:///d:/GitHub/DocuMind/backend/app/models/user.py)

```python
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
```

---

### 2.2 `projects`

Groups uploaded files and generated reports under a named project scope.

| Column          | Type                | Constraints                    | Description                    |
| --------------- | ------------------- | ------------------------------ | ------------------------------ |
| `id`            | `Integer`           | `PRIMARY KEY`, `AUTO INCREMENT`, `INDEXED` | Unique project identifier      |
| `user_id`       | `Integer`           | `FOREIGN KEY → users.id`, `NOT NULL`, `ON DELETE CASCADE` | Owner user reference           |
| `project_name`  | `String`            | `NOT NULL`                     | Human-readable project name    |
| `description`   | `Text`              | `NULLABLE`                     | Optional project description   |
| `created_at`    | `DateTime(tz=True)` | `DEFAULT now()`                | Project creation timestamp     |

**Relationships:**
- `owner` → `User` (many-to-one, `back_populates="projects"`)
- `files` → `File[]` (one-to-many, `cascade="all, delete-orphan"`)
- `reports` → `Report[]` (one-to-many, `cascade="all, delete-orphan"`)

**SQLAlchemy Model:** [project.py](file:///d:/GitHub/DocuMind/backend/app/models/project.py)

```python
class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    project_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="projects")
    files = relationship("File", back_populates="project", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="project", cascade="all, delete-orphan")
```

---

### 2.3 `files`

Tracks uploaded files with metadata and storage location.

| Column          | Type                | Constraints                    | Description                    |
| --------------- | ------------------- | ------------------------------ | ------------------------------ |
| `id`            | `Integer`           | `PRIMARY KEY`, `AUTO INCREMENT`, `INDEXED` | Unique file identifier         |
| `project_id`    | `Integer`           | `FOREIGN KEY → projects.id`, `NOT NULL`, `ON DELETE CASCADE` | Parent project reference       |
| `file_name`     | `String`            | `NOT NULL`                     | Original uploaded filename     |
| `file_path`     | `String`            | `NOT NULL`                     | Server-side storage path       |
| `file_type`     | `String`            | `NOT NULL`                     | File extension without dot (e.g. `"py"`, `"csv"`) |
| `is_template`   | `Boolean`           | `DEFAULT False`                | Whether file is a DOCX template|
| `upload_date`   | `DateTime(tz=True)` | `DEFAULT now()`                | Upload timestamp               |

**Relationships:**
- `project` → `Project` (many-to-one, `back_populates="files"`)

**SQLAlchemy Model:** [file.py](file:///d:/GitHub/DocuMind/backend/app/models/file.py)

```python
class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    is_template = Column(Boolean, default=False)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="files")
```

---

### 2.4 `reports`

Stores AI-generated report metadata, content, and export file references.

| Column          | Type                | Constraints                    | Description                    |
| --------------- | ------------------- | ------------------------------ | ------------------------------ |
| `id`            | `Integer`           | `PRIMARY KEY`, `AUTO INCREMENT`, `INDEXED` | Unique report identifier       |
| `project_id`    | `Integer`           | `FOREIGN KEY → projects.id`, `NOT NULL`, `ON DELETE CASCADE` | Parent project reference       |
| `report_name`   | `String`            | `NOT NULL`                     | Human-readable report name     |
| `version`       | `Integer`           | `DEFAULT 1`, `NOT NULL`        | Report version number          |
| `report_path`   | `String`            | `NULLABLE`                     | Base path to exports (without extension) |
| `content`       | `Text`              | `NULLABLE`                     | AI-generated markdown content  |
| `status`        | `String`            | `DEFAULT "pending"`, `NOT NULL`| Processing status              |
| `template_type` | `String`            | `NULLABLE`                     | Report template category       |
| `created_at`    | `DateTime(tz=True)` | `DEFAULT now()`                | Report creation timestamp      |

**Status Values:**

| Value        | Description                                        |
| ------------ | -------------------------------------------------- |
| `"pending"`  | Report created, queued for background processing   |
| `"processing"` | AI pipeline is actively generating content       |
| `"completed"` | Generation finished; content + exports available  |
| `"failed"`   | Generation encountered an error                    |

**Template Type Values:**

| Value         | Description            |
| ------------- | ---------------------- |
| `"project"`   | Project report         |
| `"internship"`| Internship report      |
| `"research"`  | Research report        |
| `"weekly"`    | Weekly status report   |
| `"monthly"`   | Monthly status report  |

**Report Path Convention:**
- `report_path` stores the base path: `outputs/report_{id}`
- DOCX export: `{report_path}.docx`
- PDF export: `{report_path}.pdf`

**Relationships:**
- `project` → `Project` (many-to-one, `back_populates="reports"`)

**SQLAlchemy Model:** [report.py](file:///d:/GitHub/DocuMind/backend/app/models/report.py)

```python
class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    report_name = Column(String, nullable=False)
    version = Column(Integer, default=1, nullable=False)
    report_path = Column(String, nullable=True)
    content = Column(Text, nullable=True)
    status = Column(String, default="pending", nullable=False)
    template_type = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="reports")
```

---

## 3. Pydantic Schemas (API Contracts)

### 3.1 User Schemas

**Source:** [user.py](file:///d:/GitHub/DocuMind/backend/app/schemas/user.py)

| Schema         | Fields                          | Usage                    |
| -------------- | ------------------------------- | ------------------------ |
| `UserBase`     | `email`, `name`                 | Base schema              |
| `UserCreate`   | `email`, `name`, `password`     | `POST /auth/register`    |
| `UserResponse` | `id`, `email`, `name`, `created_at` | API response          |
| `Token`        | `access_token`, `token_type`    | `POST /auth/login`       |
| `TokenData`    | `id` (optional)                 | JWT payload extraction   |

### 3.2 Project Schemas

**Source:** [project.py](file:///d:/GitHub/DocuMind/backend/app/schemas/project.py)

| Schema           | Fields                                                | Usage                  |
| ---------------- | ----------------------------------------------------- | ---------------------- |
| `ProjectBase`    | `project_name`, `description`                         | Base schema            |
| `ProjectCreate`  | (inherits `ProjectBase`)                              | `POST /projects`       |
| `ProjectResponse`| `id`, `user_id`, `project_name`, `description`, `created_at` | API response       |

### 3.3 File Schemas

**Source:** [file.py](file:///d:/GitHub/DocuMind/backend/app/schemas/file.py)

| Schema         | Fields                                                             | Usage                  |
| -------------- | ------------------------------------------------------------------ | ---------------------- |
| `FileBase`     | `file_name`, `file_type`, `is_template`                            | Base schema            |
| `FileResponse` | `id`, `project_id`, `file_name`, `file_type`, `file_path`, `is_template`, `upload_date` | API response |

### 3.4 Report Schemas

**Source:** [report.py](file:///d:/GitHub/DocuMind/backend/app/schemas/report.py)

| Schema           | Fields                                                                                      | Usage               |
| ---------------- | ------------------------------------------------------------------------------------------- | ------------------- |
| `ReportCreate`   | `project_id`, `report_name`, `template_type` (default: `"project"`)                        | `POST /reports`     |
| `ReportResponse` | `id`, `project_id`, `report_name`, `version`, `report_path`, `content`, `status`, `template_type`, `created_at` | API response |

---

## 4. Migration Management

Database migrations are managed via **Alembic** (`backend/alembic/`).

| Component        | Location                                      |
| ---------------- | --------------------------------------------- |
| Config           | [alembic.ini](file:///d:/GitHub/DocuMind/backend/alembic.ini) |
| Migrations Dir   | `backend/alembic/`                            |
| Database File    | `backend/documind.db` (SQLite)                |

**Development Note:** In debug mode, `Base.metadata.create_all(bind=engine)` auto-creates tables on startup, bypassing Alembic for rapid iteration. For production, all schema changes must go through Alembic migrations.

---

## 5. Cascade Delete Behavior

When a parent record is deleted, all child records are automatically removed:

```text
DELETE User
  └── CASCADE → DELETE all user's Projects
        ├── CASCADE → DELETE all project's Files
        │               └── (file_utils.delete_local_file also removes from disk)
        └── CASCADE → DELETE all project's Reports
                        └── (report route also removes .docx/.pdf from disk)
```

---

## 6. Index Strategy

| Table      | Column(s)   | Index Type    | Purpose                          |
| ---------- | ----------- | ------------- | -------------------------------- |
| `users`    | `id`        | Primary Key   | Lookup by ID                     |
| `users`    | `email`     | Unique Index  | Login lookup, duplicate check    |
| `projects` | `id`        | Primary Key   | Lookup by ID                     |
| `files`    | `id`        | Primary Key   | Lookup by ID                     |
| `reports`  | `id`        | Primary Key   | Lookup by ID                     |

**Note:** Foreign key columns (`user_id`, `project_id`) are not explicitly indexed. For production PostgreSQL, adding indexes on these columns is recommended for JOIN performance.

---

## 7. Planned Schema Changes (v1.x)

### 7.1 Version Control Support

To support report version history (FR-27, FR-28, FR-29), a new `report_versions` table is planned:

```sql
CREATE TABLE report_versions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id       INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    version_number  INTEGER NOT NULL,
    content         TEXT,
    report_path     TEXT,
    change_summary  TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(report_id, version_number)
);
```

### 7.2 Template Library

To support predefined template management (FR-13, FR-14, FR-15), a `templates` table is planned:

```sql
CREATE TABLE templates (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
    template_name   TEXT NOT NULL,
    template_type   TEXT NOT NULL,
    template_path   TEXT NOT NULL,
    is_system       BOOLEAN DEFAULT FALSE,
    description     TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 8. References

- [SRS.md](file:///d:/GitHub/DocuMind/docs/SRS.md) — Software Requirements Specification (Section 6: Database Design)
- [TechSpec.md](file:///d:/GitHub/DocuMind/docs/TechSpec.md) — Technical Specification
