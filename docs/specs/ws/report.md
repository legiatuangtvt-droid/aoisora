# Report Screen Specification

---

# BASIC SPEC

## 1. Overview

- **Module**: WS (Task from HQ)
- **Screen ID**: SCR_REPORT
- **Route**: `/tasks/report`
- **Purpose**: Display task completion statistics across stores and departments with weekly tracking
- **Target Users**: HQ (Headquarter) Staff, Manager

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | Manager | View weekly completion by store | I can track store performance |
| US-02 | Manager | See completion % with color coding | I can quickly identify issues |
| US-03 | Manager | View stacked bar chart | I can see completion trends |
| US-04 | Manager | Filter by department | I can focus on specific areas |
| US-05 | Manager | View detailed store breakdown | I can see department-level data |
| US-06 | Manager | Export report | I can share with stakeholders |

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Week Selector Grid | Store x Week matrix with completion % |
| Stacked Bar Chart | Visual completion trends by week |
| Filter Dropdown | Department filter |
| Store Report Table | Detailed breakdown by department |

## 4. Screen Layout

```
+------------------------------------------------------------------+
|  [Week Selector Grid]              [Stacked Bar Chart]           |
|  W40  W41  W42  W43  W44  W45      Filter: All dept              |
|  Store completion % by week                                       |
+------------------------------------------------------------------+
|                                                                   |
|  [Detailed Store Report Table]                                    |
|  Columns: Store | Total Task | Per Department breakdown           |
|                                                                   |
+------------------------------------------------------------------+
```

## 5. Navigation

| Action | Destination |
|--------|-------------|
| Click Sidebar "Report" | `/tasks/report` |
| Click week header | Filter data by week |
| Click store row | Drill down to store detail |
| Click Export | Download report |

## 6. API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/reports/weekly-completion` | GET | Get weekly completion data |
| `/api/v1/reports/store-weekly` | GET | Get store weekly grid |
| `/api/v1/reports/store-detail` | GET | Get detailed store report |

## 7. Implementation Status

| Feature | Backend | Frontend | Notes |
|---------|---------|----------|-------|
| Report Page | ⏳ Pending | ✅ Done | Mock data |
| Weekly Completion Grid | ⏳ Pending | ✅ Done | Mock data |
| Stacked Bar Chart | - | ✅ Done | Custom chart |
| Store Report Table | ⏳ Pending | ✅ Done | Mock data |
| API Integration | ⏳ Pending | ⏳ Pending | - |

---

# DETAIL SPEC

## 8. Week Selector Grid - Detail

### 8.1 Structure

| Element | Description |
|---------|-------------|
| Header Row | Week labels: W40, W41, W42, W43, W44, W45 |
| Store Rows | Store name + completion % per week |
| Cell Colors | Color-coded based on completion % |

### 8.2 Cell Color Coding

| Completion % | Background Color |
|--------------|------------------|
| 100% | Green (#22C55E) |
| 90-99% | Light Green (#86EFAC) |
| 80-89% | Yellow (#FDE047) |
| 70-79% | Orange (#FB923C) |
| < 70% | Red (#EF4444) |

---

## 9. Stacked Bar Chart - Detail

| Element | Description |
|---------|-------------|
| Filter Dropdown | "Filter: All dept" - filter by department |
| Role Label | "Role plan: be" (top right corner) |
| X-Axis | Weeks (W40, W41, W42, W43, W44) |
| Y-Axis | Task count |
| Bar Segments | Stacked showing completed vs incomplete |

### 9.1 Bar Colors

| Status | Color |
|--------|-------|
| Completed | Blue (#3B82F6) |
| Incomplete/Failed | Red (#EF4444) |

---

## 10. Store Report Table - Detail

### 10.1 Table Structure

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

### 10.2 Column Header Styling

| Department | Background Color |
|------------|------------------|
| Total Task | Light Gray |
| ADMIN | Light Yellow (#FEF9C3) |
| PLANNING | Light Blue (#DBEAFE) |
| SPA&MKT | Light Pink (#FCE7F3) |
| IMPROVEMENT | Light Green (#DCFCE7) |
| DRY FOOD | Light Orange (#FED7AA) |
| Aeon CF | Light Purple (#E9D5FF) |

### 10.3 Cell Highlighting

| Condition | Style |
|-----------|-------|
| Complete % = 100% | Green background |
| Complete % < 100% | Red/Pink background |
| Empty/No task | White background |

---

## 11. Data Types

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

## 12. API Endpoints - Detail

### 12.1 Get Weekly Completion Data

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

### 12.2 Get Store Weekly Grid

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

### 12.3 Get Detailed Store Report

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

### 12.4 Schema Definitions

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

## 13. Interactions - Detail

| Interaction | Description |
|-------------|-------------|
| Week Selection | Click on week header to filter data |
| Department Filter | Dropdown filters chart data |
| Store Row Click | Drill down to store detail |
| Table Sorting | Click column header to sort |
| Export | Download report as Excel/CSV |

---

## 14. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Desktop (>1200px) | Full layout with chart and grid side by side |
| Tablet (768-1200px) | Chart above grid, both full width |
| Mobile (<768px) | Stacked layout, horizontal scroll for table |

---

## 15. Files Reference

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

## 16. Changelog

| Date | Change |
|------|--------|
| 2026-01-03 | Initial specification created from wireframe |
| 2026-01-03 | Implemented Report screen with all components |
| 2026-01-03 | Moved to `/tasks/report` route, fixed menu highlight |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
