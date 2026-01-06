# Add Task Screen Specification

---

# BASIC SPEC

## 1. Overview

- **Module**: WS (Task from HQ)
- **Screen ID**: SCR_TASK_ADD
- **Route**: `/tasks/new`
- **Purpose**: Create new task groups with multi-level hierarchical structure (up to 5 levels)
- **Target Users**: HQ (Headquarter) Staff

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | HQ Staff | Create a new task group | I can assign work to stores |
| US-02 | HQ Staff | Add multiple task levels (2-5) | I can create detailed task breakdowns |
| US-03 | HQ Staff | View task hierarchy in Maps tab | I can visualize task structure |
| US-04 | HQ Staff | Save task as draft | I can continue editing later |
| US-05 | HQ Staff | Submit task for approval | I can start the task workflow |

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Header | Breadcrumb navigation + Detail/Maps tabs |
| Task Level Cards | Hierarchical cards for each task level (1-5) |
| Section Accordion | Collapsible sections: Task Info, Instructions, Scope, Approval |
| Footer | Save as Draft / Submit buttons |

## 4. Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ List task → Add task                           [Detail] [Maps]       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────┐  ┌──────────────────────┐                 │
│  │ Task Level 1         │  │ Task Level 2         │                 │
│  │ Main task       [⋮]  │  │ Sub-task        [⋮]  │                 │
│  ├──────────────────────┤  ├──────────────────────┤                 │
│  │ [Task name input]    │  │ [Task name input]    │                 │
│  │ ▶ A. Task Information│  │ ▶ A. Task Information│                 │
│  │ ▶ B. Instructions    │  │ ▶ B. Instructions    │                 │
│  │ ▶ C. Scope          │  │ ▶ C. Scope          │                 │
│  │ ▶ D. Approval Process│  │ ▶ D. Approval Process│                 │
│  └──────────────────────┘  └──────────────────────┘                 │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                        [Save as draft]  [Submit]                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 5. Navigation

| Action | Destination |
|--------|-------------|
| Click "+ ADD NEW" on Task List | `/tasks/new` |
| Click "List task" breadcrumb | `/tasks/list` - Return to list |
| Click "Save as draft" | Save and redirect to `/tasks/list` |
| Click "Submit" | Submit and redirect to `/tasks/list` |
| Click "Maps" tab | Show hierarchical flowchart view |

## 6. API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/tasks` | POST | Create new task (SUBMITTED) |
| `/api/v1/tasks/draft` | POST | Save draft (DRAFT) |
| `/api/v1/regions` | GET | Get region list |
| `/api/v1/zones` | GET | Get zones by region |
| `/api/v1/areas` | GET | Get areas by zone |
| `/api/v1/stores` | GET | Get stores by area |

## 7. Implementation Status

| Feature | Backend | Frontend | Notes |
|---------|---------|----------|-------|
| Add Task Page | ⏳ Pending | ✅ Done | Mock data |
| Task Level Cards | - | ✅ Done | UI only |
| Section Accordion | - | ✅ Done | Frontend only |
| Detail Tab | - | ✅ Done | Form inputs |
| Maps Tab | - | ✅ Done | Flowchart view |
| API Integration | ⏳ Pending | ⏳ Pending | - |

---

# DETAIL SPEC

## 8. Header Area - Detail

| Component | Detail | Description |
|-----------|--------|-------------|
| Breadcrumb | List task → Add task | Click "List task" to return to list screen |
| Detail Tab | Default tab | Display detailed input form for each task level |
| Maps Tab | Secondary tab | Display hierarchical task structure as flowchart/tree |

**Note:** Tab navigation (Detail/Maps) is positioned at the right edge of the viewport.

---

## 9. Task Level Card Structure - Detail

### 9.1 Card Layout

```
┌─────────────────────────────────────────────────────┐
│  [Header - Pink background]                         │
│  Icon | Task Level X | Subtitle        | Menu (⋮) │
├─────────────────────────────────────────────────────┤
│  [Content Area - White background with padding]     │
│  ┌───────────────────────────────────────────────┐  │
│  │ Section A: Task Information (collapsible)     │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │ Section B: Instructions (collapsible)         │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │ Section C: Scope (collapsible)                │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │ Section D: Approval Process (collapsible)     │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 9.2 Card Specifications

| Property | Value |
|----------|-------|
| Width | 536px |
| Layout | Task levels display horizontally (Level 2 beside Level 1) |
| Vertical stacking | Multiple children of same parent stack vertically |

### 9.3 Accordion Behavior

- Only 1 section expanded at a time per task level
- Default: all sections collapsed
- Light red highlight for sections with incomplete required data
- Section header: Darker background (gray-100) to distinguish from content area (gray-50)

---

## 10. Task Level 1 (Main Task) - Detail

### 10.1 Header

| Component | Type/Detail | Description |
|-----------|-------------|-------------|
| Icon + Title | "Task level 1" | Subtitle: "Main task" |
| Menu (...) | Click to display | Options: "+ Add task level 2", "Delete task level 1" |
| Task name | Text input | Placeholder: "Enter task name...", max 255 chars |

### 10.2 Section A: Task Information

| Field | Type | Options/Format | Required |
|-------|------|----------------|----------|
| Task Type | Dropdown | Daily, Weekly, Monthly, Quarterly, Yearly | Yes |
| Applicable Period | Date range picker | mm/dd/yyyy - mm/dd/yyyy | Yes |
| Execution Time | Dropdown | 30 min, 1 hour, 2 hours, 4 hours, 8 hours | Yes |

### 10.3 Section B: Instructions

| Field | Type | Options/Format | Required |
|-------|------|----------------|----------|
| Task Type | Dropdown | Image, Document, Checklist | Yes |
| Manual Link | Text input | URL format | No |
| Note | Textarea | Free text, detailed instructions | No |
| Photo Guidelines | Image upload grid | Grid 2x3, max 6 images, each max 5MB (JPG/PNG) | No |

### 10.4 Section C: Scope

| Field | Type | Logic | Required |
|-------|------|-------|----------|
| Region | Dropdown | Load from master data | Yes |
| Zone | Dropdown | Dependent - load based on selected Region | Yes |
| Area | Dropdown | Dependent - load based on selected Zone | Yes |
| Store | Dropdown | Dependent - load based on selected Area | Yes |
| Store Leader | Dropdown | Load Store Leader list | No |
| Specific Staff | Dropdown | Load Staff list | No |

**Cascade Logic:** Changing parent dropdown resets and reloads corresponding child dropdowns.

### 10.5 Section D: Approval Process

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| Initiator | Dropdown | Task creator | Yes |
| Leader | Dropdown | Level 1 approval leader | Yes |
| HOD | Dropdown | Head of Department - Level 2 approval | Yes |

---

## 11. Footer Area - Detail

| Button | Type | Action |
|--------|------|--------|
| Save as draft | Secondary (outlined) | Save Draft, no required validation. Redirect to List Tasks |
| Submit | Primary (filled, pink) | Validate all fields of all levels. Submit and redirect |

---

## 12. Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Task name | Required, max 255 chars | "Task name is required" / "Max 255 characters" |
| Task Type (Info) | Required | "Please select task type" |
| Applicable Period | Required, End >= Start | "End date must be after start date" |
| Execution Time | Required | "Please select execution time" |
| Region/Zone/Area/Store | Required | "Please select [field name]" |
| Initiator/Leader/HOD | Required | "Please select [field name]" |
| Photo upload | Max 5MB, JPG/PNG | "File size must not exceed 5MB" |

---

## 13. API Endpoints - Detail

### 13.1 Create Task (Submit)

```yaml
post:
  tags:
    - WS-Tasks
  summary: "Create Task API"
  description: |
    # Correlation Check
      - All required fields must be present
      - Master Data Existence Check:
        - task_type_id: Check against code_master
        - region_id, zone_id, area_id: Check against location tables
        - store_id: Check against stores table
        - initiator_id, leader_id, hod_id: Check against staff table

    # Business Logic
      ## 1. Validate Input
        - Validate all required fields
        - Validate date range (end_date >= start_date)
        - Validate file uploads (max 5MB, JPG/PNG)

      ## 2. Create Task Records
        ### Insert into tasks table
          - task_name
          - task_type_id
          - start_date, end_date
          - execution_time
          - manual_link, note
          - status_id = SUBMITTED
          - created_staff_id from authenticated user

      ## 3. Create Task Levels
        - For each level (1-5), insert task_level record
        - Link to parent task_level if applicable

      ## 4. Create Scope Assignments
        - Insert into task_scope (region, zone, area, store)

      ## 5. Create Approval Workflow
        - Insert into task_workflow (initiator, leader, hod)

      ## 6. Handle Image Uploads
        - Move uploaded images to permanent storage
        - Create task_images records

      ## 7. Response
        - Return created task with all levels

  operationId: createTask
  parameters:
    - name: Authorization
      in: header
      required: true
      schema:
        type: string
      description: Bearer token

  requestBody:
    required: true
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/CreateTaskRequest"
        example:
          task_name: "Q1 Marketing Campaign"
          task_type_id: 1
          applicable_period:
            start: "2026-01-01"
            end: "2026-03-31"
          execution_time: "2 hours"
          instructions:
            type: "image"
            manual_link: "https://manual.example.com/task-1"
            note: "Follow the guidelines carefully"
          scope:
            region_id: 1
            zone_id: 2
            area_id: 3
            store_ids: [1, 2, 3]
          approval:
            initiator_id: 1
            leader_id: 2
            hod_id: 3
          sub_levels:
            - level: 2
              task_name: "Sub-task 1"
              parent_level: 1

  responses:
    201:
      description: Created
      content:
        application/json:
          example:
            success: true
            data:
              task_id: 1
              task_name: "Q1 Marketing Campaign"
              status: "SUBMITTED"
              created_at: "2026-01-06T10:00:00Z"
            message: "Task submitted successfully"

    400:
      description: Bad Request
      content:
        application/json:
          examples:
            validation_error:
              value:
                success: false
                message: "Validation failed"
                errors:
                  task_name: ["Task name is required"]
                  end_date: ["End date must be after start date"]

    401:
      description: Unauthorized

    500:
      description: Internal Server Error
```

### 13.2 Save Draft

```yaml
post:
  tags:
    - WS-Tasks
  summary: "Save Task as Draft API"
  description: |
    # Business Logic
      ## 1. Validate Input
        - Only task_name is required for draft
        - Other fields can be partial/empty

      ## 2. Create/Update Draft
        - If task_id provided → Update existing draft
        - If no task_id → Create new draft
        - Set status_id = DRAFT

      ## 3. Response
        - Return draft task_id for later editing

  operationId: saveTaskDraft
  requestBody:
    required: true
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/CreateTaskRequest"

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            success: true
            data:
              task_id: 1
              status: "DRAFT"
            message: "Task saved as draft successfully"
```

### 13.3 Get Master Data APIs

```yaml
# Get Regions
get:
  tags:
    - WS-Master
  summary: "Get Regions API"
  operationId: getRegions
  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              - id: 1
                name: "North Region"
                code: "NR"
              - id: 2
                name: "South Region"
                code: "SR"

---
# Get Zones by Region
get:
  tags:
    - WS-Master
  summary: "Get Zones API"
  operationId: getZones
  parameters:
    - name: region_id
      in: query
      required: true
      schema:
        type: integer
  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              - id: 1
                name: "Zone A"
                region_id: 1
              - id: 2
                name: "Zone B"
                region_id: 1

---
# Get Areas by Zone
get:
  tags:
    - WS-Master
  summary: "Get Areas API"
  operationId: getAreas
  parameters:
    - name: zone_id
      in: query
      required: true
      schema:
        type: integer
  responses:
    200:
      description: OK

---
# Get Stores by Area
get:
  tags:
    - WS-Master
  summary: "Get Stores API"
  operationId: getStoresByArea
  parameters:
    - name: area_id
      in: query
      required: true
      schema:
        type: integer
  responses:
    200:
      description: OK

---
# Get Users by Role
get:
  tags:
    - WS-Master
  summary: "Get Users by Role API"
  operationId: getUsersByRole
  parameters:
    - name: role
      in: query
      required: true
      schema:
        type: string
        enum: [initiator, leader, hod]
  responses:
    200:
      description: OK
```

### 13.4 Upload Image

```yaml
post:
  tags:
    - WS-Tasks
  summary: "Upload Task Image API"
  description: |
    # Correlation Check
      - File type must be JPG or PNG
      - File size must not exceed 5MB

    # Business Logic
      ## 1. Validate File
        - Check file type (JPG, PNG)
        - Check file size (max 5MB)

      ## 2. Store Temporarily
        - Save to temp storage
        - Return temp file path

      ## 3. Response
        - Return temp file URL for preview

  operationId: uploadTaskImage
  requestBody:
    required: true
    content:
      multipart/form-data:
        schema:
          type: object
          properties:
            file:
              type: string
              format: binary
            slot:
              type: integer
              description: Image slot index (0-5)

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            success: true
            data:
              temp_url: "/tmp/uploads/abc123.jpg"
              slot: 0

    400:
      description: Bad Request
      content:
        application/json:
          examples:
            file_too_large:
              value:
                success: false
                message: "File size must not exceed 5MB"
            invalid_type:
              value:
                success: false
                message: "Only JPG and PNG files are allowed"
```

### 13.5 Schema Definitions

```yaml
components:
  schemas:
    CreateTaskRequest:
      type: object
      required:
        - task_name
      properties:
        task_name:
          type: string
          maxLength: 255
        task_type_id:
          type: integer
        applicable_period:
          type: object
          properties:
            start:
              type: string
              format: date
            end:
              type: string
              format: date
        execution_time:
          type: string
          enum: ["30 min", "1 hour", "2 hours", "4 hours", "8 hours"]
        instructions:
          type: object
          properties:
            type:
              type: string
              enum: [image, document, checklist]
            manual_link:
              type: string
              format: uri
            note:
              type: string
            images:
              type: array
              items:
                type: string
              maxItems: 6
        scope:
          type: object
          properties:
            region_id:
              type: integer
            zone_id:
              type: integer
            area_id:
              type: integer
            store_ids:
              type: array
              items:
                type: integer
            store_leader_id:
              type: integer
            specific_staff_id:
              type: integer
        approval:
          type: object
          properties:
            initiator_id:
              type: integer
            leader_id:
              type: integer
            hod_id:
              type: integer
        sub_levels:
          type: array
          items:
            type: object
            properties:
              level:
                type: integer
                minimum: 2
                maximum: 5
              task_name:
                type: string
              parent_level:
                type: integer

    TaskResponse:
      type: object
      properties:
        task_id:
          type: integer
        task_name:
          type: string
        status:
          type: string
          enum: [DRAFT, SUBMITTED, APPROVED, IN_PROGRESS, COMPLETED]
        created_at:
          type: string
          format: date-time
```

---

## 14. UI States - Detail

| State Type | State | Display |
|------------|-------|---------|
| Loading | Initial load | Skeleton loader for entire form |
| Loading | Dropdown loading | Spinner icon in dropdown |
| Loading | Image uploading | Progress bar on image slot |
| Loading | Submitting | Button disabled with spinner, text "Submitting..." |
| Error | Validation error | Red border around field + red error message below |
| Error | API error | Red toast notification at top right corner |
| Success | Draft saved | Toast "Task saved as draft successfully" + redirect |
| Success | Task submitted | Toast "Task submitted successfully" + redirect |

---

## 15. Maps Tab - Detail

The Maps tab displays the task hierarchy as a flowchart/tree view.

| Element | Description |
|---------|-------------|
| Task Level Nodes | Cards showing task level with name |
| Connector Lines | Lines connecting parent to child tasks |
| Indentation | Child levels indented to show hierarchy |
| Visual Structure | Continuous vertical lines between siblings |

---

## 16. Files Reference

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
│           ├── TaskLevelCard.tsx      # Pink header with icon, title, subtitle, menu
│           ├── SectionCard.tsx        # Collapsible card wrapper for sections A-D
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

## 17. Changelog

| Date | Change |
|------|--------|
| 2025-12-31 | Initial specification created |
| 2025-12-31 | Implemented Detail Tab UI with Task Level Card and all sections |
| 2025-12-31 | Set TaskLevelCard dimensions 536x789px |
| 2025-12-31 | Position Detail/Maps tabs at right edge of viewport |
| 2025-12-31 | Restore TaskLevelCard to left side position |
| 2025-12-31 | Redesign UI sections A-D as separate cards with SectionCard wrapper |
| 2026-01-01 | Refactor: Move sections inside TaskLevelCard container - unified border around header and sections |
| 2026-01-01 | UI: Section header darker background (gray-100) to distinguish from content |
| 2026-01-01 | UI: Delete menu always visible (disabled when only 1 level) |
| 2026-01-01 | Layout: Task levels display horizontally (Level 2 beside Level 1) |
| 2026-01-01 | Data: Update mock tasks with 01/01/2026 dates for New Year |
| 2026-01-01 | UI: Add "Add new sub task" button below children list to add more siblings |
| 2026-01-01 | UI: Add Task name input field with formatting buttons (B/I/A) above sections |
| 2026-01-01 | UI: Implement Maps tab with task hierarchy flowchart/tree view |
| 2026-01-01 | UI: Maps tab - child task levels indented with connector lines to show parent-child hierarchy |
| 2026-01-01 | Fix: Maps tab connector lines now continuous without gaps between siblings |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
| 2026-01-06 | Updated API section with OpenAPI format (5 endpoints with schemas) |
