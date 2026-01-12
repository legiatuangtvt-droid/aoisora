# Report - Detail Specification

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_REPORT
> **Route**: `/tasks/report`
> **Last Updated**: 2026-01-08

---

## 1. Week Selector Grid - Detail

### 1.1 Structure

| Element | Description |
|---------|-------------|
| Header Row | Week labels: W40, W41, W42, W43, W44, W45 |
| Store Rows | Store name + completion % per week |
| Cell Colors | Color-coded based on completion % |

### 1.2 Cell Color Coding

| Completion % | Background Color | Hex Code |
|--------------|------------------|----------|
| 100% | Green | #22C55E |
| 90-99% | Light Green | #86EFAC |
| 80-89% | Yellow | #FDE047 |
| 70-79% | Orange | #FB923C |
| < 70% | Red | #EF4444 |

---

## 2. Stacked Bar Chart - Detail

| Element | Description |
|---------|-------------|
| Filter Dropdown | "Filter: All dept" - filter by department |
| Role Label | "Role plan: be" (top right corner) |
| X-Axis | Weeks (W40, W41, W42, W43, W44) |
| Y-Axis | Task count |
| Bar Segments | Stacked showing completed vs incomplete |

### 2.1 Bar Colors

| Status | Color | Hex Code |
|--------|-------|----------|
| Completed | Blue | #3B82F6 |
| Incomplete/Failed | Red | #EF4444 |

---

## 3. Store Report Table - Detail

### 3.1 Table Structure

| Column Group | Columns |
|--------------|---------|
| Store Info | Store Code, Store Name |
| Total Task | Total Task, Completed (task actual), Complete % |
| ADMIN | Total Task, Completed (task actual), Complete % |
| PLANNING | Total Task, Completed (task actual), Complete % |
| SPA&MKT | Total Task, Completed (task actual), Complete % |
| IMPROVEMENT | Total Task, Completed (task actual), Complete % |
| DRY FOOD | Total Task, Completed (task actual), Complete % |
| Aeon CF | Total Task, Completed (task actual), Complete % |

### 3.2 Column Header Styling

| Department | Background Color | Hex Code |
|------------|------------------|----------|
| Total Task | Light Gray | #F3F4F6 |
| ADMIN | Light Yellow | #FEF9C3 |
| PLANNING | Light Blue | #DBEAFE |
| SPA&MKT | Light Pink | #FCE7F3 |
| IMPROVEMENT | Light Green | #DCFCE7 |
| DRY FOOD | Light Orange | #FED7AA |
| Aeon CF | Light Purple | #E9D5FF |

### 3.3 Cell Highlighting

| Condition | Style |
|-----------|-------|
| Complete % = 100% | Green background |
| Complete % < 100% | Red/Pink background |
| Empty/No task | White background |

---

## 4. Data Types

```typescript
// Week completion data for chart
interface WeeklyCompletion {
  week: string; // "W40", "W41", etc.
  completed: number;
  incomplete: number;
  total: number;
}

// Store weekly completion for grid
interface StoreWeeklyData {
  storeName: string;
  weeks: {
    week: string;
    completionPercent: number;
  }[];
}

// Department task summary
interface DepartmentTaskSummary {
  totalTask: number;
  completedTask: number;
  completePercent: number;
}

// Store report row
interface StoreReportRow {
  storeCode: string;
  storeName: string;
  totalTask: DepartmentTaskSummary;
  admin: DepartmentTaskSummary;
  planning: DepartmentTaskSummary;
  spaMkt: DepartmentTaskSummary;
  improvement: DepartmentTaskSummary;
  dryFood: DepartmentTaskSummary;
  aeonCf: DepartmentTaskSummary;
}

// Filter options
interface ReportFilter {
  department: string | 'all';
  weekRange: {
    start: string; // "W40"
    end: string;   // "W45"
  };
  store?: string;
}
```

---

## 5. API Endpoints - Detail

### 5.1 Get Weekly Completion Data

```yaml
get:
  tags:
    - WS-Reports
  summary: "Get Weekly Completion Data API"
  description: |
    # Business Logic
      ## 1. Get Completion Stats
        ### Select Columns
          - week_number
          - COUNT(tasks) as total
          - COUNT(completed) as completed
          - COUNT(incomplete) as incomplete

        ### Search Conditions
          - week_number BETWEEN start_week AND end_week
          - IF department_id → tasks.department_id = department_id

        ### Group By
          - week_number

        ### Order By
          - week_number ASC

      ## 2. Response
        - Return weekly completion statistics

  operationId: getWeeklyCompletion
  parameters:
    - name: start_week
      in: query
      required: true
      schema:
        type: string
      description: Start week (e.g., "W40")

    - name: end_week
      in: query
      required: true
      schema:
        type: string
      description: End week (e.g., "W45")

    - name: department_id
      in: query
      required: false
      schema:
        type: integer
      description: Filter by department

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              - week: "W40"
                completed: 85
                incomplete: 15
                total: 100
              - week: "W41"
                completed: 90
                incomplete: 10
                total: 100
              - week: "W42"
                completed: 78
                incomplete: 22
                total: 100
```

### 5.2 Get Store Weekly Grid

```yaml
get:
  tags:
    - WS-Reports
  summary: "Get Store Weekly Grid API"
  description: |
    # Business Logic
      ## 1. Get Stores
        ### Select Columns
          - stores.id, stores.name

      ## 2. Get Completion Per Store Per Week
        ### Select Columns
          - week_number
          - (completed / total * 100) as completion_percent

        ### Group By
          - stores.id, week_number

      ## 3. Response
        - Return store x week matrix with completion %

  operationId: getStoreWeeklyGrid
  parameters:
    - name: start_week
      in: query
      required: true
      schema:
        type: string

    - name: end_week
      in: query
      required: true
      schema:
        type: string

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              weeks: ["W40", "W41", "W42", "W43", "W44", "W45"]
              stores:
                - storeName: "Ocean Park 1"
                  weeks:
                    - week: "W40"
                      completionPercent: 100
                    - week: "W41"
                      completionPercent: 95
                    - week: "W42"
                      completionPercent: 88
                - storeName: "Eco Park"
                  weeks:
                    - week: "W40"
                      completionPercent: 92
                    - week: "W41"
                      completionPercent: 100
```

### 5.3 Get Detailed Store Report

```yaml
get:
  tags:
    - WS-Reports
  summary: "Get Detailed Store Report API"
  description: |
    # Business Logic
      ## 1. Get Store List
        ### Select Columns
          - stores.code, stores.name

      ## 2. Get Task Summary Per Department
        ### Select Columns
          - departments.name
          - COUNT(tasks) as total_task
          - COUNT(completed) as completed_task
          - (completed / total * 100) as complete_percent

        ### Search Conditions
          - tasks.week_number = week
          - IF department_id → tasks.department_id = department_id

        ### Group By
          - stores.id, departments.id

      ## 3. Response
        - Return detailed breakdown by store and department

  operationId: getStoreDetailReport
  parameters:
    - name: week
      in: query
      required: true
      schema:
        type: string
      description: Week number (e.g., "W44")

    - name: department_id
      in: query
      required: false
      schema:
        type: integer

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              - storeCode: "1234"
                storeName: "Ocean Park 1"
                totalTask:
                  total: 50
                  completed: 48
                  percent: 96
                admin:
                  total: 10
                  completed: 10
                  percent: 100
                planning:
                  total: 8
                  completed: 7
                  percent: 87.5
                spaMkt:
                  total: 12
                  completed: 12
                  percent: 100
                improvement:
                  total: 5
                  completed: 5
                  percent: 100
                dryFood:
                  total: 10
                  completed: 9
                  percent: 90
                aeonCf:
                  total: 5
                  completed: 5
                  percent: 100
```

### 5.4 Export Report

```yaml
get:
  tags:
    - WS-Reports
  summary: "Export Report API"
  description: |
    # Business Logic
      ## 1. Get Report Data
        - Same as getStoreDetailReport

      ## 2. Generate File
        - Excel: Use PHPSpreadsheet
        - PDF: Use DomPDF

      ## 3. Response
        - Return file download

  operationId: exportReport
  parameters:
    - name: week
      in: query
      required: true
      schema:
        type: string

    - name: format
      in: query
      required: true
      schema:
        type: string
        enum: [excel, pdf]

  responses:
    200:
      description: OK
      content:
        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
          schema:
            type: string
            format: binary
        application/pdf:
          schema:
            type: string
            format: binary
```

---

## 6. Schema Definitions

```yaml
components:
  schemas:
    WeeklyCompletion:
      type: object
      properties:
        week:
          type: string
        completed:
          type: integer
        incomplete:
          type: integer
        total:
          type: integer

    StoreWeeklyData:
      type: object
      properties:
        storeName:
          type: string
        weeks:
          type: array
          items:
            type: object
            properties:
              week:
                type: string
              completionPercent:
                type: number

    DepartmentTaskSummary:
      type: object
      properties:
        total:
          type: integer
        completed:
          type: integer
        percent:
          type: number

    StoreReportRow:
      type: object
      properties:
        storeCode:
          type: string
        storeName:
          type: string
        totalTask:
          $ref: "#/components/schemas/DepartmentTaskSummary"
        admin:
          $ref: "#/components/schemas/DepartmentTaskSummary"
        planning:
          $ref: "#/components/schemas/DepartmentTaskSummary"
        spaMkt:
          $ref: "#/components/schemas/DepartmentTaskSummary"
        improvement:
          $ref: "#/components/schemas/DepartmentTaskSummary"
        dryFood:
          $ref: "#/components/schemas/DepartmentTaskSummary"
        aeonCf:
          $ref: "#/components/schemas/DepartmentTaskSummary"
```

---

## 7. Interactions - Detail

| Interaction | Description |
|-------------|-------------|
| Week Selection | Click on week header to filter data |
| Department Filter | Dropdown filters chart data |
| Store Row Click | Drill down to store detail |
| Table Sorting | Click column header to sort |
| Export | Download report as Excel/PDF |

---

## 8. Export Features (LOCAL-DEV)

| Feature | Description | Deploy |
|---------|-------------|--------|
| Export Excel | Download report as .xlsx file | [LOCAL-DEV] |
| Export PDF | Download report as .pdf file | [LOCAL-DEV] |

---

## 9. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Desktop (>1200px) | Full layout with chart and grid side by side |
| Tablet (768-1200px) | Chart above grid, both full width |
| Mobile (<768px) | Stacked layout, horizontal scroll for table |

---

## 10. Files Reference

```
frontend/src/
├── app/
│   └── tasks/
│       └── report/
│           └── page.tsx
├── components/
│   └── report/
│       ├── WeeklyCompletionGrid.tsx
│       ├── StackedBarChart.tsx
│       └── StoreReportTable.tsx
├── types/
│   └── report.ts
└── data/
    └── mockReportData.ts
```

---

## 11. Test Scenarios

| Test Case | Scenario | Expected |
|-----------|----------|----------|
| Load report | Open report page | Grid and chart display with data |
| Filter by week | Select specific week | Data filters correctly |
| Filter by department | Select department from dropdown | Chart updates to show department data |
| Color coding | View cells with different % | Colors match completion percentage |
| Export Excel | Click Export → Excel | File downloads with correct data |
| Export PDF | Click Export → PDF | File downloads with correct format |
| Sort table | Click column header | Table sorts by that column |
| Responsive | Resize browser | Layout adapts to screen size |

---

## 12. Changelog

| Date | Change |
|------|--------|
| 2026-01-03 | Initial specification created from wireframe |
| 2026-01-03 | Implemented Report screen with all components |
| 2026-01-03 | Moved to `/tasks/report` route, fixed menu highlight |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
| 2026-01-08 | Split spec into basic and detail files |

---

## 13. Related Documents

| Document | Path |
|----------|------|
| Basic Spec | `docs/specs/basic/ws-report-basic.md` |
| Task List Basic | `docs/specs/basic/ws-task-list-basic.md` |

