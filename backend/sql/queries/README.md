# SQL Queries for DWS (Daily Work Schedule)

This folder contains SQL queries used by the Backend API to fetch data from database.

## Architecture Flow

```
FRONTEND (React/Next.js)
    │
    ├── Sends HTTP Request with params:
    │   - store_id
    │   - schedule_date
    │   - user_role
    │   - other filters...
    │
    ▼
BACKEND (FastAPI)
    │
    ├── Receives request
    ├── Validates params
    ├── Calls SQL Query from this folder
    ├── Maps result to Response Schema
    │
    ▼
DATABASE (PostgreSQL)
    │
    ├── Executes query
    ├── Returns raw data
    │
    ▼
BACKEND (FastAPI)
    │
    ├── Transforms data to Response Object
    ├── Returns JSON to Frontend
    │
    ▼
FRONTEND (React/Next.js)
    │
    └── Renders data exactly as received
        (NO data transformation in FE)
```

## Query Files

| File | Purpose | Used By API | Screen |
|------|---------|-------------|--------|
| `get_daily_schedule_tasks.sql` | Get tasks for schedule grid | `GET /shifts/schedule-tasks/` | DWS Daily Schedule |
| `get_staff_with_shifts.sql` | Get staff list with shift info | `GET /shifts/staff-with-shifts/` | DWS Staff Rows |
| `get_store_daily_summary.sql` | Get store completion summary | `GET /shifts/store-daily-summary/` | DWS Header |
| `get_task_groups.sql` | Get task groups with colors | `GET /shifts/task-groups/` | Task Card Colors |
| `get_shift_assignments.sql` | Get shift assignments | `GET /shifts/assignments/` | Staff Shift Info |

## Query Parameters

### Common Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `:store_id` | INTEGER | Store ID to filter |
| `:schedule_date` | DATE | Date in YYYY-MM-DD format |
| `:staff_id` | INTEGER | Staff ID to filter |
| `:limit` | INTEGER | Max records to return (default: 200) |
| `:offset` | INTEGER | Records to skip (default: 0) |

### Response Schema Example

```json
{
  "schedule_task_id": 1,
  "staff_id": 1,
  "store_id": 1,
  "schedule_date": "2025-12-29",
  "group_id": "LEADER",
  "task_code": "1501",
  "task_name": "Mo kho",
  "start_time": "06:00:00",
  "end_time": "06:15:00",
  "status": "pending",
  "task_group": {
    "group_id": "LEADER",
    "color_bg": "#99f6e4",
    "color_text": "#134e4a",
    "color_border": "#2dd4bf"
  }
}
```

## Notes

1. **Frontend only renders** - No data processing in FE
2. **Backend handles all logic** - SQL queries, data transformation, validation
3. **SQL files are the source of truth** - All DB interactions go through these files
4. **Timestamps** - All tables include `created_at`, `updated_at` columns
