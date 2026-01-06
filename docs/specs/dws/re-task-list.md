# RE Task List Screen Specification

---

# BASIC SPEC

## 1. Overview

- **Module**: DWS (Dispatch Work Schedule)
- **Screen ID**: SCR_RE_TASK_LIST
- **Route**: `/dws/re-task-list`
- **Purpose**: Manage RE (Routine Execution) Tasks - list of routine tasks with frequency, duration, and manual references
- **Target Users**: HQ Staff, Store Manager

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | HQ Staff | View all RE tasks in a list | I can see all routine tasks |
| US-02 | HQ Staff | Search tasks by group or name | I can quickly find specific tasks |
| US-03 | HQ Staff | Filter tasks by group | I can focus on specific departments |
| US-04 | HQ Staff | Import tasks from Excel | I can bulk add tasks |
| US-05 | HQ Staff | Export tasks to Excel | I can share task data |
| US-06 | HQ Staff | Add new RE task | I can create new routine tasks |
| US-07 | HQ Staff | Edit existing task | I can update task details |
| US-08 | HQ Staff | Delete task | I can remove obsolete tasks |

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Header | Page title "Quan Ly RE Task" |
| Search Bar | Search by group or task name |
| Action Buttons | Import, Export, Add New |
| Data Table | Task list with all columns |
| Pagination | Page navigation |

## 4. Screen Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Quan Ly RE Task                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ RE Task List    [🔍 Search...]              [Import] [Export] [+ Them Moi]  │
│                                                                              │
│ ┌───────────────────────────────────────────────────────────────────────────┤
│ │ STT │ Group  │ Type │ Task Name    │ Freq │ Num │ Unit │ Manual │ Action  │
│ ├─────┼────────┼──────┼──────────────┼──────┼─────┼──────┼────────┼─────────┤
│ │ 1   │ DELICA │ CTM  │ Pha che Cafe │ Daily│ 1   │ 20   │ DEL-001│ ✏️ 🗑️   │
│ │ 2   │ DELICA │ Prod │ Chuan bi...  │ Daily│ 1   │ 30   │ DEL-002│ ✏️ 🗑️   │
│ │ ... │ ...    │ ...  │ ...          │ ...  │ ... │ ...  │ ...    │ ...     │
│ └───────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ Hien thi tu 1 den 25 trong tong so 110 muc              [<] [>]             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 5. Navigation

| Action | Destination |
|--------|-------------|
| Click Sidebar "Quan Ly RE Task" | `/dws/re-task-list` |
| Click "Them Moi" | Open Add Task Modal |
| Click Edit icon | Open Edit Task Modal |
| Click Delete icon | Show Delete Confirmation |

## 6. API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/dws/re-tasks` | GET | Get all RE tasks |
| `/api/v1/dws/re-tasks` | POST | Create new RE task |
| `/api/v1/dws/re-tasks/{id}` | PUT | Update RE task |
| `/api/v1/dws/re-tasks/{id}` | DELETE | Delete RE task |
| `/api/v1/dws/re-tasks/import` | POST | Import from Excel |
| `/api/v1/dws/re-tasks/export` | GET | Export to Excel |

## 7. Implementation Status

| Feature | Backend | Frontend | Notes |
|---------|---------|----------|-------|
| RE Task List Page | ⏳ Pending | ✅ Done | Mock data |
| Search/Filter | - | ✅ Done | Frontend only |
| Data Table | - | ✅ Done | With pagination |
| Action Buttons | ⏳ Pending | ✅ Done | UI only |
| Import/Export | ⏳ Pending | ⏳ Pending | - |
| CRUD Operations | ⏳ Pending | ⏳ Pending | - |

---

# DETAIL SPEC

## 8. Header Section - Detail

| Component | Description | Notes |
|-----------|-------------|-------|
| Page Title | "Quan Ly RE Task" | Bold, large font |
| Background | White | With bottom border |

---

## 9. Search & Action Bar - Detail

### 9.1 Search Bar

| Property | Value |
|----------|-------|
| Placeholder | "Tim theo group hoac task name..." |
| Width | 256px (w-64) |
| Position | Left side |
| Icon | Search icon (magnifying glass) |

### 9.2 Action Buttons

| Button | Color | Icon | Action |
|--------|-------|------|--------|
| Import | Green (#22C55E) | Upload icon | Open import modal |
| Export | Orange (#F97316) | Download icon | Download Excel file |
| Them Moi | Pink (#C5055B) | Plus icon | Open add task modal |

---

## 10. Data Table - Detail

### 10.1 Table Header

| Column | Width | Align | Sortable |
|--------|-------|-------|----------|
| STT | 60px | Left | No |
| Group | 100px | Left | Yes |
| Type Task | 100px | Left | Yes |
| Task Name | Flexible | Left | Yes |
| Frequency Type | 100px | Left | Yes |
| Frequency Number | 80px | Center | Yes |
| Re Unit (min) | 80px | Center | Yes |
| Manual Number | 100px | Left | No |
| Manual Link | 100px | Left | No |
| Note | 200px | Left | No |
| Hanh Dong | 80px | Center | No |

### 10.2 Header Styling

| Property | Value |
|----------|-------|
| Background | Dark Blue (#1E3A5F) |
| Text Color | White |
| Font Weight | Medium |
| Padding | 12px 16px |

### 10.3 Group Badge Colors

| Group | Background | Text Color |
|-------|------------|------------|
| DELICA | #EDE9FE | #7C3AED |
| D&D | #FEE2E2 | #DC2626 |
| DRY | #DBEAFE | #2563EB |
| POS | #D1FAE5 | #059669 |
| PERI | #FEF3C7 | #D97706 |
| MMD | #CFFAFE | #0891B2 |
| LEADER | #E0E7FF | #4F46E5 |
| QC-FSH | #FCE7F3 | #DB2777 |
| OTHER | #F3F4F6 | #6B7280 |

---

## 11. Data Types

```typescript
// RE Task interface
interface RETask {
  id: number;
  group: string;           // Task group: DELICA, D&D, DRY, etc.
  typeTask: string;        // Task type: CTM, Product, etc.
  taskName: string;        // Task name
  frequencyType: string;   // Daily, Weekly, Monthly
  frequencyNumber: number; // Number of times
  reUnit: number;          // RE Unit in minutes
  manualNumber: string;    // Manual code: DEL-001, DND-001, etc.
  manualLink?: string;     // Link to manual
  note?: string;           // Additional notes
}

// Task groups
type RETaskGroup = 'DELICA' | 'D&D' | 'DRY' | 'POS' | 'PERI' | 'MMD' | 'LEADER' | 'QC-FSH' | 'OTHER';

// Frequency types
type FrequencyType = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';

// Task types
type TaskType = 'CTM' | 'Product' | 'Service' | 'Quality' | 'Safety';

// Filter interface
interface RETaskFilters {
  group: string[];
  typeTask: string[];
  frequencyType: string[];
  searchQuery: string;
}
```

---

## 12. Pagination - Detail

| Property | Value |
|----------|-------|
| Items per page | 25 |
| Display format | "Hien thi tu X den Y trong tong so Z muc" |
| Navigation | Previous/Next buttons |
| Button style | Border with rounded corners |

---

## 13. Action Buttons - Detail

### 13.1 Edit Button

| Property | Value |
|----------|-------|
| Icon | Pencil/Edit icon |
| Color | Blue (#2563EB) |
| Hover | Blue background (#DBEAFE) |
| Action | Open edit modal |

### 13.2 Delete Button

| Property | Value |
|----------|-------|
| Icon | Trash icon |
| Color | Red (#DC2626) |
| Hover | Red background (#FEE2E2) |
| Action | Show confirmation dialog |

---

## 14. UI States - Detail

| State Type | State | Display |
|------------|-------|---------|
| Loading | Initial load | Skeleton loader for table |
| Loading | Searching | Spinner in search input |
| Empty | No results | "Khong tim thay ket qua" message |
| Error | Load failed | Error message with retry button |
| Success | Task added | Toast "Them task thanh cong" |
| Success | Task updated | Toast "Cap nhat task thanh cong" |
| Success | Task deleted | Toast "Xoa task thanh cong" |

---

## 15. API Endpoints - Detail

### 15.1 Get RE Tasks

```
GET /api/v1/dws/re-tasks
Query params:
  - page: number (default: 1)
  - per_page: number (default: 25)
  - search: string (optional)
  - group: string[] (optional)
  - frequency_type: string (optional)
  - sort_by: string (optional)
  - sort_dir: 'asc' | 'desc' (optional)
```

### 15.2 Create RE Task

```
POST /api/v1/dws/re-tasks
Body:
  - group: string (required)
  - type_task: string (required)
  - task_name: string (required)
  - frequency_type: string (required)
  - frequency_number: number (required)
  - re_unit: number (required)
  - manual_number: string (required)
  - manual_link: string (optional)
  - note: string (optional)
```

### 15.3 Update RE Task

```
PUT /api/v1/dws/re-tasks/{id}
Body: Same as Create
```

### 15.4 Delete RE Task

```
DELETE /api/v1/dws/re-tasks/{id}
```

---

## 16. Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| group | Required | "Vui long chon Group" |
| typeTask | Required | "Vui long chon Type Task" |
| taskName | Required, max 255 | "Task name la bat buoc" |
| frequencyType | Required | "Vui long chon Frequency Type" |
| frequencyNumber | Required, min 1 | "Frequency Number phai >= 1" |
| reUnit | Required, min 0 | "RE Unit phai >= 0" |
| manualNumber | Required, unique | "Manual Number da ton tai" |

---

## 17. Files Reference

```
frontend/src/
├── app/
│   └── dws/
│       └── re-task-list/
│           └── page.tsx           # Main page component
├── types/
│   └── reTask.ts                  # Type definitions
├── data/
│   └── mockRETaskData.ts          # Mock data for development
└── components/
    └── dws/
        ├── RETaskTable.tsx        # Table component (TBD)
        ├── RETaskModal.tsx        # Add/Edit modal (TBD)
        └── RETaskFilters.tsx      # Filter component (TBD)
```

---

## 18. Test Scenarios

| Test Case | Scenario | Expected |
|-----------|----------|----------|
| View list | Open RE Task List page | Table displays with data |
| Search | Enter "DELICA" in search | Filter shows DELICA tasks only |
| Pagination | Click next page | Shows next 25 items |
| Add task | Click "Them Moi", fill form, submit | New task appears in list |
| Edit task | Click edit, modify, save | Task updated |
| Delete task | Click delete, confirm | Task removed from list |
| Import | Upload Excel file | Tasks imported |
| Export | Click Export | Excel file downloaded |

---

## 19. Changelog

| Date | Change |
|------|--------|
| 2026-01-06 | Initial specification created |
| 2026-01-06 | Implemented RE Task List page with mock data |
| 2026-01-06 | Added DWS menu items to sidebar |
