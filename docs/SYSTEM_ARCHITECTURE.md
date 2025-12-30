# OptiChain DWS - System Architecture Document

## 1. System Overview

OptiChain DWS (Daily Work Schedule) is a web application for managing daily task assignments for retail store staff.

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                              │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (Next.js 14)                      │  │
│  │                                                               │  │
│  │  • Renders UI based on API response                           │  │
│  │  • NO data processing/transformation                          │  │
│  │  • Sends requests with store_id, date, user_role              │  │
│  │  • Display-only responsibility                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP REST API
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           SERVER LAYER                              │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    BACKEND (FastAPI)                          │  │
│  │                                                               │  │
│  │  • Receives HTTP requests                                     │  │
│  │  • Validates input parameters                                 │  │
│  │  • Executes SQL queries                                       │  │
│  │  • Transforms DB results to Response Objects                  │  │
│  │  • Returns JSON response to Frontend                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
                                │
                                │ SQL Queries
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   DATABASE (PostgreSQL)                       │  │
│  │                                                               │  │
│  │  • Stores all master and transaction data                     │  │
│  │  • Enforces data integrity via constraints                    │  │
│  │  • Returns raw data to Backend                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
```

## 2. Role Responsibilities

### 2.1 Frontend (Next.js 14)

| Responsibility | Description |
|---------------|-------------|
| **Display Only** | Renders data exactly as received from API |
| **NO Data Processing** | Does not transform, filter, or aggregate data |
| **Request Building** | Builds API requests with parameters (store_id, date, etc.) |
| **User Interaction** | Handles clicks, inputs, navigation |
| **State Management** | Manages UI state (selected date, loading states) |

**Key Files:**
- `frontend/src/app/dws/daily-schedule/page.tsx` - Main DWS page
- `frontend/src/lib/api.ts` - API client functions
- `frontend/src/types/api.ts` - TypeScript interfaces

### 2.2 Backend (FastAPI)

| Responsibility | Description |
|---------------|-------------|
| **Request Handling** | Receives and validates HTTP requests |
| **Business Logic** | All data processing, calculations, aggregations |
| **Database Access** | Executes SQL queries via files in `sql/queries/` |
| **Response Building** | Transforms raw DB data to typed Response objects |
| **Authentication** | Validates user tokens, checks permissions |

**Key Files:**
- `backend/app/api/v1/shifts.py` - API endpoints
- `backend/app/schemas/shift.py` - Pydantic response schemas
- `backend/app/models/shift.py` - SQLAlchemy models
- `backend/sql/queries/*.sql` - SQL query files

### 2.3 Database (PostgreSQL)

| Responsibility | Description |
|---------------|-------------|
| **Data Storage** | Stores all master and transaction data |
| **Data Integrity** | Enforces constraints (FK, unique, not null) |
| **Query Execution** | Runs SQL queries and returns results |
| **Indexing** | Optimizes query performance |

**Key Files:**
- `database/schema_full.sql` - Database schema
- `database/seed_test_data.sql` - Test data

## 3. Data Flow

### 3.1 DWS Daily Schedule Page

```
1. USER opens DWS page
   │
2. FE sends request:
   │  GET /api/v1/shifts/schedule-tasks/?store_id=1&schedule_date=2025-12-29
   │
3. BE receives request
   │  ├── Validates: store_id (int), schedule_date (date format)
   │  ├── Loads SQL: backend/sql/queries/get_daily_schedule_tasks.sql
   │  └── Executes query with params
   │
4. DB executes SQL
   │  ├── JOINs daily_schedule_tasks + task_groups
   │  └── Returns rows
   │
5. BE transforms response
   │  ├── Maps each row to DailyScheduleTaskWithGroup schema
   │  ├── Includes task_group colors (color_bg, color_text, color_border)
   │  └── Returns List[DailyScheduleTaskWithGroup]
   │
6. FE receives JSON
   │  └── Renders task cards in time slots
   │     ├── Position based on start_time
   │     ├── Color from task_group.color_bg
   │     └── Text from task_name, task_code
```

## 4. API Endpoints

### 4.1 Schedule Tasks

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/shifts/schedule-tasks/` | GET | Get tasks with filters |
| `/shifts/schedule-tasks/{task_id}` | GET | Get single task |
| `/shifts/schedule-tasks/by-staff/{staff_id}` | GET | Get tasks for staff |
| `/shifts/schedule-tasks/` | POST | Create new task |
| `/shifts/schedule-tasks/{task_id}` | PUT | Update task |
| `/shifts/schedule-tasks/{task_id}/complete` | PUT | Mark as completed |

### 4.2 Supporting Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/shifts/task-groups/` | GET | Get all task groups with colors |
| `/shifts/assignments/` | GET | Get shift assignments |
| `/stores/` | GET | Get stores list |
| `/staff/` | GET | Get staff list |

## 5. Database Schema

### 5.1 Master Tables

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     regions     │     │   departments   │     │     stores      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ region_id (PK)  │     │ department_id   │     │ store_id (PK)   │
│ region_name     │     │ department_name │     │ store_name      │
│ region_code     │     │ department_code │     │ store_code      │
└─────────────────┘     └─────────────────┘     │ region_id (FK)  │
                                                └─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     staff       │     │   shift_codes   │     │  task_groups    │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ staff_id (PK)   │     │ shift_code_id   │     │ group_id (PK)   │
│ staff_name      │     │ shift_code      │     │ group_name      │
│ role            │     │ start_time      │     │ color_bg        │
│ store_id (FK)   │     │ end_time        │     │ color_text      │
│ department_id   │     │ total_hours     │     │ color_border    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 5.2 Transaction Tables

```
┌──────────────────────────┐     ┌──────────────────────────┐
│    shift_assignments     │     │   daily_schedule_tasks   │
├──────────────────────────┤     ├──────────────────────────┤
│ assignment_id (PK)       │     │ schedule_task_id (PK)    │
│ staff_id (FK)            │     │ staff_id (FK)            │
│ store_id (FK)            │     │ store_id (FK)            │
│ shift_date               │     │ schedule_date            │
│ shift_code_id (FK)       │     │ group_id (FK)            │
│ status                   │     │ task_code                │
└──────────────────────────┘     │ task_name                │
                                 │ start_time               │
                                 │ end_time                 │
                                 │ status                   │
                                 │ completed_at             │
                                 └──────────────────────────┘
```

## 6. Response Objects

### 6.1 DailyScheduleTaskWithGroup

```typescript
{
  schedule_task_id: number;
  staff_id: number;
  store_id: number;
  schedule_date: string;        // "YYYY-MM-DD"
  group_id: string;             // "LEADER", "POS", "PERI", etc.
  task_code: string;            // "1501"
  task_name: string;            // "Mo kho"
  start_time: string;           // "HH:MM:SS"
  end_time: string;             // "HH:MM:SS"
  status: "pending" | "in_progress" | "completed" | "skipped";
  completed_at: string | null;
  task_group: {
    group_id: string;
    group_name: string;
    color_bg: string;           // "#99f6e4"
    color_text: string;         // "#134e4a"
    color_border: string;       // "#2dd4bf"
  }
}
```

### 6.2 StoresDailySummary

```typescript
{
  store_id: number;
  store_name: string;
  staff_on_duty: number;
  total_tasks: number;
  completed_tasks: number;
  completion_rate: number;      // 0-100
  group_breakdown: [
    { group_id: string, total: number, completed: number }
  ]
}
```

## 7. SQL Query Files

All SQL queries are stored in `backend/sql/queries/`:

| File | Purpose | Screen |
|------|---------|--------|
| `get_daily_schedule_tasks.sql` | Get tasks for grid | Daily Schedule |
| `get_staff_with_shifts.sql` | Get staff + shifts | Staff rows |
| `get_store_daily_summary.sql` | Get store summary | Header |
| `get_task_groups.sql` | Get task colors | Task cards |
| `get_shift_assignments.sql` | Get shift assignments | Staff info |

## 8. Key Principles

1. **Frontend = Display Only**
   - No data transformation
   - No filtering/sorting logic
   - Render exactly what API returns

2. **Backend = All Logic**
   - Request validation
   - SQL execution
   - Data aggregation
   - Response formatting

3. **SQL Files = Source of Truth**
   - All DB queries in `sql/queries/`
   - Easy to debug and modify
   - Version controlled

4. **Typed Responses**
   - Backend uses Pydantic schemas
   - Frontend uses TypeScript interfaces
   - Ensures type safety

## 9. File Structure

```
aura/
├── backend/
│   ├── app/
│   │   ├── api/v1/shifts.py      # API endpoints
│   │   ├── models/shift.py       # SQLAlchemy models
│   │   └── schemas/shift.py      # Pydantic schemas
│   └── sql/
│       └── queries/              # SQL query files
│           ├── get_daily_schedule_tasks.sql
│           ├── get_staff_with_shifts.sql
│           ├── get_store_daily_summary.sql
│           ├── get_task_groups.sql
│           └── get_shift_assignments.sql
│
├── frontend/
│   └── src/
│       ├── app/dws/daily-schedule/page.tsx
│       ├── lib/api.ts            # API client
│       └── types/api.ts          # TypeScript types
│
├── database/
│   ├── schema_full.sql           # Database schema
│   └── seed_test_data.sql        # Test data
│
└── docs/
    └── SYSTEM_ARCHITECTURE.md    # This document
```
