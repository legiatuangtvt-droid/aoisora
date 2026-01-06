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

```
GET /api/v1/reports/weekly-completion
Query params:
  - start_week: string (e.g., "W40")
  - end_week: string (e.g., "W45")
  - department_id?: number (optional filter)
```

### 12.2 Get Store Weekly Grid

```
GET /api/v1/reports/store-weekly
Query params:
  - start_week: string
  - end_week: string
```

### 12.3 Get Detailed Store Report

```
GET /api/v1/reports/store-detail
Query params:
  - week: string (e.g., "W44")
  - department_id?: number (optional)
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
