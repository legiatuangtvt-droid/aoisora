# Add Task - Detail Specification

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_TASK_ADD
> **Route**: `/tasks/new`
> **Last Updated**: 2026-01-08

---

## 1. Header Area - Detail

| Component | Detail | Description |
|-----------|--------|-------------|
| Breadcrumb | List task → Add task | Click "List task" to return to list screen |
| Detail Tab | Default tab | Display detailed input form for each task level |
| Maps Tab | Secondary tab | Display hierarchical task structure as flowchart/tree |

**Note:** Tab navigation (Detail/Maps) is positioned at the right edge of the viewport.

---

## 2. Task Level Card Structure - Detail

### 2.1 Card Layout

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

### 2.2 Card Specifications

| Property | Value |
|----------|-------|
| Width | 536px |
| Layout | Task levels display horizontally (Level 2 beside Level 1) |
| Vertical stacking | Multiple children of same parent stack vertically |

### 2.3 Accordion Behavior

- Only 1 section expanded at a time per task level
- Default: all sections collapsed
- Light red highlight for sections with incomplete required data
- Section header: Darker background (gray-100) to distinguish from content area (gray-50)

---

## 3. Task Level 1 (Main Task) - Detail

### 3.1 Header

| Component | Type/Detail | Description |
|-----------|-------------|-------------|
| Icon + Title | "Task level 1" | Subtitle: "Main task" |
| Menu (...) | Click to display | Options: "+ Add task level 2", "Delete task level 1" |
| Task name | Text input | Placeholder: "Enter task name...", max 255 chars |

### 3.2 Section A: Task Information

| Field | Type | Options/Format | Required |
|-------|------|----------------|----------|
| Task Type | Dropdown | Daily, Weekly, Monthly, Quarterly, Yearly | Yes |
| Applicable Period | Date range picker | mm/dd/yyyy - mm/dd/yyyy | Yes |
| Execution Time | Dropdown | 30 min, 1 hour, 2 hours, 4 hours, 8 hours | Yes |

### 3.3 Section B: Instructions

| Field | Type | Options/Format | Required |
|-------|------|----------------|----------|
| Task Type | Dropdown | Image, Document, Checklist | Yes |
| Manual Link | Text input | URL format | No |
| Note | Textarea | Free text, detailed instructions | No |
| Photo Guidelines | Image upload grid | Grid 2x3, max 6 images, each max 5MB (JPG/PNG) | No |

### 3.4 Section C: Scope

| Field | Type | Logic | Required |
|-------|------|-------|----------|
| Region | Dropdown | Load from master data | Yes |
| Zone | Dropdown | Dependent - load based on selected Region | Yes |
| Area | Dropdown | Dependent - load based on selected Zone | Yes |
| Store | Dropdown | Dependent - load based on selected Area | Yes |
| Store Leader | Dropdown | Load Store Leader list | No |
| Specific Staff | Dropdown | Load Staff list | No |

**Cascade Logic:** Changing parent dropdown resets and reloads corresponding child dropdowns.

### 3.5 Section D: Approval Process

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| Initiator | Dropdown | Task creator | Yes |
| Leader | Dropdown | Level 1 approval leader | Yes |
| HOD | Dropdown | Head of Department - Level 2 approval | Yes |

---

## 4. Footer Area - Detail

| Button | Type | Action |
|--------|------|--------|
| Save as draft | Secondary (outlined) | Save Draft, no required validation. Redirect to List Tasks |
| Submit | Primary (filled, pink) | Validate all fields of all levels. Submit and redirect |

---

## 5. Validation Rules

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

## 6. API Endpoints - Detail

### 6.1 Create Task (Submit)

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
          - task_name, task_type_id
          - start_date, end_date, execution_time
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
  requestBody:
    required: true
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/CreateTaskRequest"

  responses:
    201:
      description: Created
    400:
      description: Bad Request
    401:
      description: Unauthorized
```

### 6.2 Save Draft

```yaml
post:
  tags:
    - WS-Tasks
  summary: "Save Task as Draft API"
  description: |
    # Business Logic
      - Only task_name is required for draft
      - Other fields can be partial/empty
      - Set status_id = DRAFT

  operationId: saveTaskDraft
  responses:
    200:
      description: OK
```

### 6.3 Upload Image [LOCAL-DEV]

```yaml
post:
  tags:
    - WS-Tasks
  summary: "Upload Task Image API"
  description: |
    # Correlation Check
      - File type must be JPG or PNG
      - File size must not exceed 5MB

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
    400:
      description: Bad Request (file too large or invalid type)
```

---

## 7. Schema Definitions

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
              task_name:
                type: string
              parent_level:
                type: integer
```

---

## 8. UI States - Detail

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

## 9. Maps Tab - Detail

The Maps tab displays the task hierarchy as a flowchart/tree view.

| Element | Description |
|---------|-------------|
| Task Level Nodes | Cards showing task level with name |
| Connector Lines | Lines connecting parent to child tasks |
| Indentation | Child levels indented to show hierarchy |
| Visual Structure | Continuous vertical lines between siblings |

---

## 10. Files Reference

```
frontend/src/
├── app/tasks/new/
│   └── page.tsx
├── components/tasks/add/
│   ├── AddTaskForm.tsx
│   ├── TaskLevelCard.tsx
│   ├── SectionCard.tsx
│   ├── TaskInfoSection.tsx
│   ├── InstructionsSection.tsx
│   ├── ScopeSection.tsx
│   ├── ApprovalSection.tsx
│   ├── TaskMapsTab.tsx
│   └── PhotoUploadGrid.tsx
├── types/
│   └── addTask.ts
└── data/
    └── mockAddTask.ts
```

---

## 11. Changelog

| Date | Change |
|------|--------|
| 2025-12-31 | Initial specification created |
| 2025-12-31 | Implemented Detail Tab UI with Task Level Card and all sections |
| 2025-12-31 | Set TaskLevelCard dimensions 536x789px |
| 2025-12-31 | Position Detail/Maps tabs at right edge of viewport |
| 2026-01-01 | Refactor: Move sections inside TaskLevelCard container |
| 2026-01-01 | UI: Section header darker background (gray-100) |
| 2026-01-01 | UI: Delete menu always visible |
| 2026-01-01 | Layout: Task levels display horizontally |
| 2026-01-01 | UI: Add "Add new sub task" button below children list |
| 2026-01-01 | UI: Add Task name input field with formatting buttons |
| 2026-01-01 | UI: Implement Maps tab with task hierarchy flowchart/tree view |
| 2026-01-01 | Fix: Maps tab connector lines now continuous without gaps |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
| 2026-01-08 | Split spec into basic and detail files |
