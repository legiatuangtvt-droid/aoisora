# Aoisora System Architecture

**Version**: 4.0 (Laravel 11 Migration)
**Date**: 2026-01-01
**Status**: Development

---

## 1. System Overview

Aoisora is a comprehensive retail management platform consisting of three main modules:

| Module | Name | Description |
|--------|------|-------------|
| **Aoi WS** | Work Schedule | Task management, checklists, notifications |
| **Aoi DWS** | Dispatch Work Schedule | Shift scheduling, workforce dispatch |
| **Aoi Manual** | Knowledge Base | Documentation, SOPs, training materials |

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (Next.js 14)                      │  │
│  │                                                               │  │
│  │  • Renders UI based on API response                          │  │
│  │  • Display-only responsibility                                │  │
│  │  • Sends requests with store_id, date, user_role             │  │
│  │  • State management with React hooks                          │  │
│  │  • Port: 3000                                                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP REST API (JSON)
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                                  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    BACKEND (Laravel 11)                       │  │
│  │                                                               │  │
│  │  • Authentication: Laravel Passport (OAuth2)                 │  │
│  │  • Query filtering: Spatie Query Builder                     │  │
│  │  • ORM: Eloquent                                              │  │
│  │  • Port: 8000                                                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ Eloquent ORM
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                   │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   DATABASE (PostgreSQL 17)                    │  │
│  │                                                               │  │
│  │  • Host: 127.0.0.1                                           │  │
│  │  • Port: 5433                                                 │  │
│  │  • Database: aoisora-dev                                      │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### 3.1 Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| shadcn/ui | Latest | UI components |
| SWR | Latest | Data fetching |

### 3.2 Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| PHP | 8.3+ | Runtime |
| Laravel | 11.x | Framework |
| Laravel Passport | 12.x | OAuth2 API authentication |
| Spatie Query Builder | 6.x | API filtering |
| Predis | 2.x | Redis client |
| Sentry Laravel | Latest | Error tracking |

### 3.3 Database
| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 17+ | Primary database |
| Redis | (Optional) | Cache, queues |

---

## 4. Module Details

### 4.1 Aoi WS (Work Schedule)

**Purpose**: Manage daily/weekly/monthly tasks for store staff.

**Features**:
- Task CRUD with checklists
- Task status workflow
- Notifications on task events
- Reports by store/department

**Status Flow**:
```
NOT_YET (7) → ON_PROGRESS (8) → DONE (9)
                    ↓
              OVERDUE (10)
                    ↓
               REJECT (11)
```

**API Endpoints**:
```
GET    /api/v1/tasks              # List tasks
POST   /api/v1/tasks              # Create task
GET    /api/v1/tasks/{id}         # Get task detail
PUT    /api/v1/tasks/{id}         # Update task
DELETE /api/v1/tasks/{id}         # Delete task
PUT    /api/v1/tasks/{id}/status  # Update status
GET    /api/v1/code-master        # Get lookup codes
```

### 4.2 Aoi DWS (Dispatch Work Schedule)

**Purpose**: Manage shift scheduling and workforce dispatch.

**Features**:
- Shift code management
- Staff shift assignments
- Daily schedule tasks
- Task groups with colors
- Man-hour tracking
- Daily templates

**Shift Code Examples**:
| Code | Name | Time | Hours |
|------|------|------|-------|
| V8.6 | Ca sang 6h | 06:00-14:00 | 8.0 |
| V8.14 | Ca chieu 14h | 14:00-22:00 | 8.0 |
| OFF | Nghi | - | 0 |

**API Endpoints**:
```
# Shift Codes
GET    /api/v1/shifts/codes
POST   /api/v1/shifts/codes
PUT    /api/v1/shifts/codes/{id}
DELETE /api/v1/shifts/codes/{id}

# Shift Assignments
GET    /api/v1/shifts/assignments
POST   /api/v1/shifts/assignments
POST   /api/v1/shifts/assignments/bulk
GET    /api/v1/shifts/weekly/{store}

# Schedule Tasks
GET    /api/v1/shifts/schedule-tasks
POST   /api/v1/shifts/schedule-tasks
PUT    /api/v1/shifts/schedule-tasks/{id}
PUT    /api/v1/shifts/schedule-tasks/{id}/complete

# Task Groups
GET    /api/v1/shifts/task-groups
POST   /api/v1/shifts/task-groups
```

### 4.3 Aoi Manual (Knowledge Base)

**Purpose**: Store and manage training documents, SOPs, manuals.

**Features**:
- Folder-based organization
- Multi-step documents
- Media attachments (images, videos)
- View tracking
- Full-text search

**API Endpoints**:
```
# Folders
GET    /api/v1/manual/folders
POST   /api/v1/manual/folders

# Documents
GET    /api/v1/manual/documents
POST   /api/v1/manual/documents
GET    /api/v1/manual/documents/{id}/full
GET    /api/v1/manual/browse
GET    /api/v1/manual/search

# Steps
GET    /api/v1/manual/steps
POST   /api/v1/manual/steps
POST   /api/v1/manual/steps/reorder

# Media
POST   /api/v1/manual/upload
```

---

## 5. Database Schema

### 5.1 Core Tables
| Table | Description |
|-------|-------------|
| regions | Geographic regions |
| stores | Store locations |
| departments | Organizational departments |
| staff | Employees (auth model) |
| code_master | Lookup values |

### 5.2 WS Tables
| Table | Description |
|-------|-------------|
| tasks | Work tasks |
| check_lists | Checklist library |
| task_check_list | Task-Checklist junction |
| manuals | Legacy manual references |

### 5.3 DWS Tables
| Table | Description |
|-------|-------------|
| shift_codes | Shift definitions |
| shift_assignments | Staff-shift mapping |
| task_groups | Task group definitions |
| daily_schedule_tasks | Daily task instances |
| task_library | Task templates |
| daily_templates | Schedule templates |
| shift_templates | Shift pattern templates |

### 5.4 Manual Tables
| Table | Description |
|-------|-------------|
| manual_folders | Folder hierarchy |
| manual_documents | Document metadata |
| manual_steps | Document steps |
| manual_media | Media attachments |
| manual_view_logs | View tracking |

### 5.5 System Tables
| Table | Description |
|-------|-------------|
| notifications | User notifications |
| oauth_access_tokens | Passport OAuth tokens |
| oauth_auth_codes | Passport auth codes |
| oauth_clients | Passport clients |
| oauth_personal_access_clients | Passport PAT clients |
| oauth_refresh_tokens | Passport refresh tokens |

---

## 6. Authentication & Authorization

### 6.1 Authentication Flow (Laravel Passport OAuth2)
```
1. User submits credentials to POST /api/v1/auth/login
2. Server validates against staff table (password_hash column)
3. Passport creates OAuth access token (JWT format)
4. Client stores token, sends in Authorization: Bearer header
5. Passport middleware validates token on protected routes
```

### 6.2 Roles
| Role | Level | Access |
|------|-------|--------|
| ADMIN | 1 | Full access |
| HQ_STAFF | 2 | View all, create tasks |
| REGIONAL_MANAGER | 3 | Manage region stores |
| AREA_MANAGER | 4 | Manage area stores |
| STORE_INCHARGE | 5 | Manage single store |
| STORE_LEADER | 6 | View store, do tasks |
| STAFF | 7 | Do assigned tasks only |

---

## 7. File Structure

```
aura/
├── frontend/                       # Next.js 14 Frontend
│   └── src/
│       ├── app/                    # Next.js pages
│       │   ├── (auth)/             # Login pages
│       │   └── (dashboard)/        # Protected pages
│       │       ├── tasks/          # WS module
│       │       ├── dws/            # DWS module
│       │       └── manual/         # Manual module
│       ├── components/
│       │   ├── ui/                 # Base UI components
│       │   ├── ws/                 # WS components
│       │   ├── dws/                # DWS components
│       │   └── manual/             # Manual components
│       ├── lib/
│       │   ├── api.ts              # API client
│       │   └── utils.ts            # Helpers
│       └── types/                  # TypeScript types
│
├── backend-new/                    # Laravel 11 Backend
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/Api/V1/ # API controllers
│   │   ├── Models/                 # Eloquent models
│   │   └── Providers/              # Service providers
│   ├── config/                     # Configuration
│   ├── database/
│   │   ├── migrations/             # Laravel migrations
│   │   └── seeders/                # Database seeders
│   ├── routes/
│   │   └── api.php                 # API routes
│   └── .env                        # Environment config
│
├── database/
│   └── schema.sql                  # Database structure reference
│
└── docs/
    └── 02-backend/
        ├── BE_SYSTEM_ARCHITECTURE.md   # This document
        └── BE_DEVELOPMENT_SETUP.md     # Setup guide
```

---

## 8. API Response Format

### 8.1 Success Response
```json
{
  "data": { ... },
  "message": "Success"
}
```

### 8.2 List Response
```json
{
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 100
  }
}
```

### 8.3 Error Response
```json
{
  "message": "Error description",
  "errors": {
    "field": ["Validation error"]
  }
}
```

---

## 9. Key Design Principles

1. **Frontend = Display Only**
   - No business logic in frontend
   - Render exactly what API returns
   - Handle loading/error states

2. **Backend = All Logic**
   - Request validation
   - Business rules
   - Data transformation
   - Response formatting

3. **Eloquent Models**
   - Define relationships
   - Use scopes for common queries
   - Leverage eager loading

4. **API Resources**
   - Transform models to JSON
   - Control exposed fields
   - Include related data

---

## 10. Environment Configuration

### 10.1 Backend (.env)
```env
APP_NAME=Aoisora
APP_ENV=local
APP_DEBUG=true
APP_TIMEZONE=Asia/Ho_Chi_Minh

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5433
DB_DATABASE=aoisora-dev
DB_USERNAME=postgres
DB_PASSWORD=your_password

CACHE_STORE=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
```

### 10.2 Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

**Document Version**: 4.0
**Created**: 2025-12-31
**Updated**: 2026-01-01
**Author**: Claude Code

### Changelog

- v4.0 (2026-01-01): Migrated to PHP 8.3, Laravel 11, PostgreSQL 17, Laravel Passport. Updated paths to `backend-new/`.
- v3.0 (2025-12-31): Initial Laravel migration planning.
- v2.0: Python FastAPI version (deprecated).
