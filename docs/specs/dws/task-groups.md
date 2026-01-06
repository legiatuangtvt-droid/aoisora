# Task Groups Screen Specification

---

# BASIC SPEC

## 1. Overview

- **Module**: DWS (Dispatch Work Schedule)
- **Screen ID**: SCR_TASK_GROUPS
- **Route**: `/dws/task-groups`
- **Purpose**: Display RE Tasks organized by groups in a visual card-based layout with summary statistics
- **Target Users**: HQ Staff, Store Manager

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | HQ Staff | View tasks organized by groups | I can see all tasks categorized visually |
| US-02 | HQ Staff | See summary statistics | I can quickly understand task distribution |
| US-03 | HQ Staff | Scroll horizontally within groups | I can see all tasks in a group |
| US-04 | HQ Staff | Add new task to a group | I can quickly create tasks in specific groups |
| US-05 | HQ Staff | Edit group settings | I can customize group display |
| US-06 | Store Manager | View task overview | I can understand workload distribution |

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Statistics Bar | Summary counts by frequency type |
| Group Rows | Horizontal scrollable task cards per group |
| Task Cards | Individual task display with ID and name |
| Action Buttons | Add task (+) and Edit (pencil) per group |

## 4. Screen Layout

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ≡ Tong so Task: 110  ☀ Daily Task: 93  📅 Weekly: 9  📅 Monthly: 6  📅 Yearly: 2  ✱ Khac: 0 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│ ┌─────────┐ ┌────────────────────────────────────────────────────────┐ ┌───┐    │
│ │Group    │ │  1     2     3     4     5     6     7     8    ...   │ │ + │    │
│ │Task 1   │ │┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐      │ │ ✏ │    │
│ │         │ ││Mo  ││EOD ││Chuan││Doi ││The ││The ││Ho  ││Ket │      │ │   │    │
│ │ POS     │ ││POS ││POS ││bi   ││tien││com ││com ││tro ││ca  │      │ │   │    │
│ │         │ ││    ││    ││POS  ││le  ││POS ││POS-││POS ││    │      │ │   │    │
│ │Total: 13│ ││1101││1102││1103 ││1104││1105││1106││1107││1108│      │ │   │    │
│ └─────────┘ │└────┘└────┘└────┘└────┘└────┘└────┘└────┘└────┘      │ └───┘    │
│             │◄═══════════════════════════════════════════════════►│           │
│             └────────────────────────────────────────────────────────┘           │
│                                                                                  │
│ ┌─────────┐ ┌────────────────────────────────────────────────────────┐ ┌───┐    │
│ │Group    │ │  1     2     3     4     5     6     7     8    ...   │ │ + │    │
│ │Task 2   │ │┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐      │ │ ✏ │    │
│ │         │ ││Len ││Len ││Len ││Re- ││Cat ││Huy ││Kiem││Dat │      │ │   │    │
│ │ PERI    │ ││hang││hang││hang││pack││got/││hang││tra ││hang│      │ │   │    │
│ │         │ ││thit││trai││tuoi││    ││Cut ││-   ││HSD ││Tuoi│      │ │   │    │
│ │Total: 12│ ││1201││1202││1203││1204││1205││1206││1207││1208│      │ │   │    │
│ └─────────┘ │└────┘└────┘└────┘└────┘└────┘└────┘└────┘└────┘      │ └───┘    │
│             └────────────────────────────────────────────────────────┘           │
│                                                                                  │
│ ┌─────────┐ ┌────────────────────────────────────────────────────────┐ ┌───┐    │
│ │Group    │ │  1     2     3     4     5     6     7     8    ...   │ │ + │    │
│ │Task 3   │ │┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐      │ │ ✏ │    │
│ │         │ ││Len ││Keo ││Kiem││Ban ││Keo ││Lam ││Check││Keo │      │ │   │    │
│ │ DRY     │ ││hang││mat ││tra ││OOS ││mat ││PC/ ││ton ││mat │      │ │   │    │
│ │         │ ││kho ││hang││HSD ││    ││COC ││POP ││WH  ││Gro-│      │ │   │    │
│ │Total: 13│ ││1301││1302││1303││1304││1305││1306││1307││1308│      │ │   │    │
│ └─────────┘ │└────┘└────┘└────┘└────┘└────┘└────┘└────┘└────┘      │ └───┘    │
│             └────────────────────────────────────────────────────────┘           │
│                                                                                  │
│ ... (more groups)                                                                │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 5. Navigation

| Action | Destination |
|--------|-------------|
| Click Sidebar "Task Groups" | `/dws/task-groups` |
| Click task card | View task detail (TBD) |
| Click "+" button | Open Add Task Modal for that group |
| Click edit button | Open Edit Group Modal |

## 6. API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/dws/re-tasks/by-group` | GET | Get tasks grouped by group |
| `/api/v1/dws/re-tasks/statistics` | GET | Get frequency statistics |
| `/api/v1/dws/task-groups` | GET | Get group configurations |
| `/api/v1/dws/task-groups/{id}` | PUT | Update group settings |

### 6.1 API Endpoints - Detail

#### Get Tasks By Group

```yaml
get:
  tags:
    - DWS-TaskGroups
  summary: "Get RE Tasks By Group API"
  description: |
    # Business Logic
      ## 1. Get All Groups
        ### Select Groups
          - Get distinct groups from re_tasks
          - Get group configurations (color, display_order)

      ## 2. Get Tasks Per Group
        ### Select Columns
          - id, sequence_number, task_name, task_id_display

        ### Group By
          - re_tasks.group

        ### Order By
          - display_order ASC within each group

      ## 3. Response
        - Return grouped task list with statistics

  operationId: getTasksByGroup
  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              groups:
                - id: "1"
                  name: "POS"
                  displayOrder: 1
                  color: "#059669"
                  bgColor: "#D1FAE5"
                  totalTasks: 13
                  tasks:
                    - id: 1
                      sequenceNumber: 1
                      taskName: "Mo POS"
                      taskId: "1101"
                    - id: 2
                      sequenceNumber: 2
                      taskName: "EOD POS"
                      taskId: "1102"
              statistics:
                total: 110
                daily: 93
                weekly: 9
                monthly: 6
                yearly: 2
                other: 0
```

#### Get Statistics

```yaml
get:
  tags:
    - DWS-TaskGroups
  summary: "Get Task Statistics API"
  description: |
    # Business Logic
      ## 1. Count Tasks by Frequency
        - COUNT(*) GROUP BY frequency_type

      ## 2. Response
        - Return counts per frequency type

  operationId: getTaskStatistics
  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              total: 110
              daily: 93
              weekly: 9
              monthly: 6
              yearly: 2
              other: 0
```

#### Update Group Settings

```yaml
put:
  tags:
    - DWS-TaskGroups
  summary: "Update Task Group Settings API"
  description: |
    # Business Logic
      ## 1. Update Group Config
        - Update display_order, color, bgColor

  operationId: updateTaskGroup
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: string

  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          properties:
            displayOrder:
              type: integer
            color:
              type: string
            bgColor:
              type: string

  responses:
    200:
      description: OK
```

## 7. Implementation Status

| Feature | Backend | Frontend | Notes |
|---------|---------|----------|-------|
| Task Groups Page | ⏳ Pending | ✅ Done | Mock data |
| Statistics Bar | ⏳ Pending | ✅ Done | Dynamic calculation |
| Group Rows | ⏳ Pending | ✅ Done | With group colors |
| Task Cards | ⏳ Pending | ✅ Done | Hover effects |
| Horizontal Scroll | - | ✅ Done | With fade indicators |
| Add Task Button | ⏳ Pending | ✅ Done | Opens modal with group pre-selected |
| Edit Group Button | ⏳ Pending | ⏳ Pending | TBD |
| Empty State | - | ✅ Done | When no groups |

---

# DETAIL SPEC

## 8. Statistics Bar - Detail

### 8.1 Layout

| Property | Value |
|----------|-------|
| Position | Top of page, sticky |
| Background | White |
| Border | Bottom border gray-200 |
| Padding | 16px horizontal, 12px vertical |
| Gap | 32px between items |

### 8.2 Statistics Items

| Item | Icon | Label | Color |
|------|------|-------|-------|
| Total Tasks | ≡ (list icon) | "Tong so Task" | Gray (#6B7280) |
| Daily Task | ☀ (sun icon) | "Daily Task" | Orange (#F97316) |
| Weekly | 📅 (calendar) | "Weekly" | Green (#22C55E) |
| Monthly | 📅 (calendar) | "Monthly" | Blue (#3B82F6) |
| Yearly | 📅 (calendar) | "Yearly" | Purple (#8B5CF6) |
| Other | ✱ (asterisk) | "Khac" | Gray (#6B7280) |

### 8.3 Statistics Item Styling

| Property | Value |
|----------|-------|
| Font Size | Label: 14px, Count: 20px bold |
| Layout | Icon + Label: Count |
| Count Color | Dark gray (#111827) |

---

## 9. Group Row - Detail

### 9.1 Layout

| Property | Value |
|----------|-------|
| Height | Auto (based on card height) |
| Margin Bottom | 24px |
| Background | White |
| Border Radius | 8px |
| Shadow | sm |

### 9.2 Group Header (Left Panel)

| Property | Value |
|----------|-------|
| Width | 120px |
| Background | Group-specific color (light) |
| Border Left | 4px solid group color |
| Padding | 16px |
| Border Radius | 8px 0 0 8px |

### 9.3 Group Header Content

| Element | Style |
|---------|-------|
| Group Label | "Group Task N" - 12px, gray-500 |
| Group Name | 24px bold, group color |
| Total Count | "Total Tasks: N" - 12px, gray-500 |

### 9.4 Group Colors (matching RE Task List)

| Group | Border/Text | Background |
|-------|-------------|------------|
| POS | #059669 | #D1FAE5 |
| PERI | #D97706 | #FEF3C7 |
| DRY | #2563EB | #DBEAFE |
| DELICA | #7C3AED | #EDE9FE |
| D&D | #DC2626 | #FEE2E2 |
| MMD | #0891B2 | #CFFAFE |
| LEADER | #4F46E5 | #E0E7FF |
| QC-FSH | #DB2777 | #FCE7F3 |
| OTHER | #6B7280 | #F3F4F6 |

---

## 10. Task Cards Container - Detail

### 10.1 Container Layout

| Property | Value |
|----------|-------|
| Display | Flex, horizontal |
| Overflow | Auto (horizontal scroll) |
| Gap | 12px |
| Padding | 16px |
| Background | Gray-50 |

### 10.2 Scrollbar Styling

| Property | Value |
|----------|-------|
| Height | 8px |
| Track | Gray-200 |
| Thumb | Gray-400, rounded |
| Thumb Hover | Gray-500 |

---

## 11. Task Card - Detail

### 11.1 Card Layout

| Property | Value |
|----------|-------|
| Width | 80px |
| Min Width | 80px |
| Height | Auto |
| Background | White |
| Border | 1px solid gray-200 |
| Border Radius | 8px |
| Shadow | sm |
| Cursor | Pointer |

### 11.2 Card Structure

```
┌─────────────┐
│     1       │ <- Sequence number (header)
├─────────────┤
│             │
│  Task Name  │ <- Task name (truncated)
│             │
├─────────────┤
│    1101     │ <- Task ID (footer)
└─────────────┘
```

### 11.3 Card Header (Sequence Number)

| Property | Value |
|----------|-------|
| Background | Gray-100 |
| Height | 24px |
| Font Size | 12px |
| Font Weight | Medium |
| Text Color | Gray-600 |
| Text Align | Center |
| Border Radius | 8px 8px 0 0 |

### 11.4 Card Body (Task Name)

| Property | Value |
|----------|-------|
| Padding | 8px |
| Height | 60px |
| Font Size | 12px |
| Text Color | Gray-800 |
| Text Align | Center |
| Overflow | Hidden |
| Text Overflow | Ellipsis (2 lines max) |

### 11.5 Card Footer (Task ID)

| Property | Value |
|----------|-------|
| Background | Gray-50 |
| Height | 24px |
| Font Size | 11px |
| Font Weight | Medium |
| Text Color | Gray-500 |
| Text Align | Center |
| Border Radius | 0 0 8px 8px |

### 11.6 Card Hover State

| Property | Value |
|----------|-------|
| Shadow | md |
| Border Color | Group color |
| Transform | translateY(-2px) |

---

## 12. Action Buttons Panel - Detail

### 12.1 Panel Layout

| Property | Value |
|----------|-------|
| Width | 48px |
| Position | Right side of group row |
| Display | Flex column |
| Gap | 8px |
| Padding | 8px |
| Align Items | Center |
| Justify | Center |

### 12.2 Add Button (+)

| Property | Value |
|----------|-------|
| Size | 32px x 32px |
| Background | Green-500 (#22C55E) |
| Background Hover | Green-600 |
| Icon Color | White |
| Border Radius | 8px |
| Icon Size | 16px |

### 12.3 Edit Button (Pencil)

| Property | Value |
|----------|-------|
| Size | 32px x 32px |
| Background | Gray-100 |
| Background Hover | Gray-200 |
| Icon Color | Gray-600 |
| Border Radius | 8px |
| Icon Size | 16px |

---

## 13. Data Types

```typescript
// Task Groups statistics
interface TaskGroupStatistics {
  total: number;
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  other: number;
}

// Group with tasks
interface TaskGroup {
  id: string;
  name: string;          // POS, PERI, DRY, etc.
  displayOrder: number;  // Group Task 1, 2, 3...
  color: string;         // Primary color
  bgColor: string;       // Background color
  tasks: GroupTask[];
  totalTasks: number;
}

// Task in group view (simplified)
interface GroupTask {
  id: number;
  sequenceNumber: number;  // 1, 2, 3... within group
  taskName: string;
  taskId: string;          // Display ID like "1101"
  frequencyType: string;
}

// Page data
interface TaskGroupsPageData {
  statistics: TaskGroupStatistics;
  groups: TaskGroup[];
}
```

---

## 14. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Desktop (>1024px) | Full layout as designed |
| Tablet (768-1024px) | Statistics bar wraps to 2 rows |
| Mobile (<768px) | Group header on top, cards below |

---

## 15. UI States

| State | Display |
|-------|---------|
| Loading | Skeleton loaders for stats and groups |
| Empty Group | "No tasks in this group" message |
| Error | Error message with retry button |
| Scrolling | Show scroll indicators (fade edges) |

---

## 16. Animations

| Element | Animation |
|---------|-----------|
| Card Hover | 150ms ease-out transform |
| Scroll | Smooth scroll behavior |
| Page Load | Fade in groups sequentially |

---

## 17. Files Reference

```
frontend/src/
├── app/
│   └── dws/
│       └── task-groups/
│           └── page.tsx               # Main page component
└── components/
    └── dws/
        ├── TaskGroupsStatistics.tsx   # Statistics bar component
        ├── TaskGroupRow.tsx           # Group row with horizontal scroll
        ├── TaskCard.tsx               # Individual task card
        └── AddRETaskModal.tsx         # Reused for adding tasks (with defaultGroup)
```

---

## 18. Test Scenarios

| Test Case | Scenario | Expected |
|-----------|----------|----------|
| View page | Open Task Groups page | Statistics and groups display |
| Scroll cards | Scroll horizontally in a group | Cards scroll smoothly |
| Hover card | Mouse over task card | Card elevates with shadow |
| Click add | Click + button on POS group | Add Task Modal opens for POS |
| Click edit | Click edit on group | Edit Group Modal opens |
| Empty group | Group with no tasks | Shows empty message |
| Many tasks | Group with 20+ tasks | Horizontal scroll works |

---

## 19. Changelog

| Date | Change |
|------|--------|
| 2026-01-06 | Initial specification created |
| 2026-01-06 | Implemented Task Groups page with mock data |
| 2026-01-06 | Added TaskGroupsStatistics component (dynamic frequency counts) |
| 2026-01-06 | Added TaskGroupRow with horizontal scroll and fade indicators |
| 2026-01-06 | Added TaskCard component with hover effects |
| 2026-01-06 | Integrated AddRETaskModal with defaultGroup prop |
| 2026-01-06 | Added API Endpoints Detail section with OpenAPI format |
