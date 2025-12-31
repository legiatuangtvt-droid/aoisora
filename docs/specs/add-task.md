# ADD TASK SCREEN SPECIFICATION (SCR_TASK_ADD)

---

## 1. GENERAL DESCRIPTION

| No | Attribute | Value |
|----|-----------|-------|
| 1 | Screen Name | Add New Task Screen |
| 2 | Screen Code | SCR_TASK_ADD |
| 3 | Target Users | HQ (Headquarter) Staff |
| 4 | Access Point | Click "+ ADD NEW" button on Task List screen (SCR_TASK_LIST) |

*Purpose: Screen for creating new task groups with multi-level hierarchical structure (up to 5 levels).*

### Main Workflow:

| No | Activity |
|----|----------|
| 1 | User enters Task Level 1 information (parent/main task) |
| 2 | Can add Task Level 2, 3, 4, 5 if detailed breakdown needed |
| 3 | Fill information in 4 sections: Task Information, Instructions, Scope, Approval Process |
| 4 | Save as draft or Submit for approval |
| 5 | View hierarchical structure via Maps tab |

---

## 2. FUNCTIONAL SPECIFICATION

*Interface divided into 3 areas: Header (Navigation), Body (Input Form), Footer (Action Buttons).*

### A. Header Area (Navigation)

| No | Component | Detail | Description |
|----|-----------|--------|-------------|
| 1 | Breadcrumb | List task → Add task | Click "List task" to return to list screen |
| 2 | Detail Tab | Default tab | Display detailed input form for each task level |
| 3 | Maps Tab | Secondary tab | Display hierarchical task structure as flowchart/tree |

### B. Body Area - Detail Tab

#### B.1. Task Level 1 (Main Task)

*Accordion behavior: Only 1 section expanded at a time. Default: all 4 sections collapsed. Light red highlight for sections with incomplete required data.*

| No | Component | Type/Detail | Description | Required |
|----|-----------|-------------|-------------|----------|
| 1 | Icon + Title | "Task level 1" | Subtitle: "Main task" | |
| 2 | Menu (...) | Click to display | Options: "+ Add task level 2", "Delete task level 1" | |
| 3 | Task name | Text input | Placeholder: "Enter task name...", max 255 chars | |

#### B.1.1. Section A: Task Information

| No | Field | Type | Options/Format | Required |
|----|-------|------|----------------|----------|
| 1 | Task Type | Dropdown | Daily, Weekly, Monthly, Quarterly, Yearly | Yes |
| 2 | Applicable Period | Date range picker | mm/dd/yyyy - mm/dd/yyyy | Yes |
| 3 | Execution Time | Dropdown | 30 min, 1 hour, 2 hours, 4 hours, 8 hours | Yes |

#### B.1.2. Section B: Instructions

| No | Field | Type | Options/Format | Required |
|----|-------|------|----------------|----------|
| 1 | Task Type | Dropdown | Image, Document, Checklist | Yes |
| 2 | Manual Link | Text input | URL format | No |
| 3 | Note | Textarea | Free text, detailed instructions | No |
| 4 | Photo Guidelines | Image upload grid | Grid 2x3, max 6 images, each max 5MB (JPG/PNG) | No |

#### B.1.3. Section C: Scope

| No | Field | Type | Logic | Required |
|----|-------|------|-------|----------|
| 1.1 | Region | Dropdown | Load from master data | Yes |
| 1.2 | Zone | Dropdown | Dependent - load based on selected Region | Yes |
| 1.3 | Area | Dropdown | Dependent - load based on selected Zone | Yes |
| 1.4 | Store | Dropdown | Dependent - load based on selected Area | Yes |
| 1.5 | Store Leader | Dropdown | Load Store Leader list | No |
| 1.6 | Specific Staff | Dropdown | Load Staff list | No |

*Cascade Logic: Changing parent dropdown resets and reloads corresponding child dropdowns.*

#### B.1.4. Section D: Approval Process

| No | Field | Type | Description | Required |
|----|-------|------|-------------|----------|
| 1 | Initiator | Dropdown | Task creator | Yes |
| 2 | Leader | Dropdown | Level 1 approval leader | Yes |
| 3 | HOD | Dropdown | Head of Department - Level 2 approval | Yes |

### C. Footer Area (Action Buttons)

| No | Button | Type | Action |
|----|--------|------|--------|
| 1 | Save as draft | Secondary (outlined) | Save Draft, no required validation. Redirect to List Tasks |
| 2 | Submit | Primary (filled, pink) | Validate all fields of all levels. Submit and redirect |

---

## 3. VALIDATION RULES

### A. Field Validation

| No | Field | Rule | Error Message |
|----|-------|------|---------------|
| 1 | Task name | Required, max 255 chars | "Task name is required" / "Max 255 characters" |
| 2 | Task Type (Info) | Required | "Please select task type" |
| 3 | Applicable Period | Required, End >= Start | "End date must be after start date" |
| 4 | Execution Time | Required | "Please select execution time" |
| 5 | Region/Zone/Area/Store | Required | "Please select [field name]" |
| 6 | Initiator/Leader/HOD | Required | "Please select [field name]" |
| 7 | Photo upload | Max 5MB, JPG/PNG | "File size must not exceed 5MB" |

---

## 4. API INTEGRATION

| No | Action | Method | Endpoint | Description |
|----|--------|--------|----------|-------------|
| 1 | Get Task Types | GET | /api/v1/task-types | Get task type list |
| 2 | Get Regions | GET | /api/v1/regions | Get region list |
| 3 | Get Zones | GET | /api/v1/zones?regionId={id} | Get zones by region |
| 4 | Get Areas | GET | /api/v1/areas?zoneId={id} | Get areas by zone |
| 5 | Get Stores | GET | /api/v1/stores?areaId={id} | Get stores by area |
| 6 | Get Users | GET | /api/v1/users?role={role} | Get users by role |
| 7 | Create Task | POST | /api/v1/tasks | Create new task (SUBMITTED) |
| 8 | Save Draft | POST | /api/v1/tasks/draft | Save draft (DRAFT) |
| 9 | Upload Image | POST | /api/v1/upload/image | Upload instruction image |

---

## 5. UI STATES

| No | State Type | State | Display |
|----|------------|-------|---------|
| 1 | Loading | Initial load | Skeleton loader for entire form |
| 2 | Loading | Dropdown loading | Spinner icon in dropdown |
| 3 | Loading | Image uploading | Progress bar on image slot |
| 4 | Loading | Submitting | Button disabled with spinner, text "Submitting..." |
| 5 | Error | Validation error | Red border around field + red error message below |
| 6 | Error | API error | Red toast notification at top right corner |
| 7 | Success | Draft saved | Toast "Task saved as draft successfully" + redirect |
| 8 | Success | Task submitted | Toast "Task submitted successfully" + redirect |

---

## 6. FILE STRUCTURE

```
frontend/src/
├── app/
│   └── tasks/
│       └── new/
│           └── page.tsx
├── components/
│   └── tasks/
│       └── add/
│           ├── AddTaskForm.tsx
│           ├── TaskLevelCard.tsx
│           ├── TaskInfoSection.tsx
│           ├── InstructionsSection.tsx
│           ├── ScopeSection.tsx
│           ├── ApprovalSection.tsx
│           ├── TaskMapsTab.tsx
│           └── PhotoUploadGrid.tsx
├── types/
│   └── addTask.ts
└── data/
    └── mockAddTask.ts
```

---

## CHANGELOG

| Date | Change |
|------|--------|
| 2025-12-31 | Initial specification created |
