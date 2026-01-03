# Report Screen Specification

## 1. Overview

The Report screen displays task completion statistics across stores and departments. It provides weekly tracking data with visual charts and detailed tabular reports.

**Route:** `/report`

---

## 2. Layout Structure

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

---

## 3. Components

### 3.1 Week Selector Grid (Top Left)

A table showing completion percentages by store and week.

| Element | Description |
|---------|-------------|
| Header Row | Week labels: W40, W41, W42, W43, W44, W45 |
| Store Rows | Store name + completion % per week |
| Cell Colors | Color-coded based on completion % |

#### Store List
- Eco
- Oasic
- Haven
- Land Mark
- Ocean
- Zen
- Hawaii

#### Cell Color Coding
| Completion % | Background Color |
|--------------|------------------|
| 100% | Green (#22C55E) |
| 90-99% | Light Green (#86EFAC) |
| 80-89% | Yellow (#FDE047) |
| 70-79% | Orange (#FB923C) |
| < 70% | Red (#EF4444) |

### 3.2 Stacked Bar Chart (Top Right)

Visual representation of task completion status by week.

| Element | Description |
|---------|-------------|
| Filter Dropdown | "Filter: All dept" - filter by department |
| Role Label | "Role plan: be" (top right corner) |
| X-Axis | Weeks (W40, W41, W42, W43, W44) |
| Y-Axis | Task count |
| Bar Segments | Stacked showing completed vs incomplete |

#### Bar Colors
| Status | Color |
|--------|-------|
| Completed | Blue (#3B82F6) |
| Incomplete/Failed | Red (#EF4444) |

#### Chart Data Display
- Numbers shown inside bar segments
- Total height represents total tasks
- Blue section = completed tasks
- Red section = incomplete/failed tasks

### 3.3 Detailed Store Report Table (Bottom)

Comprehensive table with store-level task completion data broken down by department.

#### Table Structure

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

#### Column Header Styling
| Department | Background Color |
|------------|------------------|
| Total Task | Light Gray |
| ADMIN | Light Yellow (#FEF9C3) |
| PLANNING | Light Blue (#DBEAFE) |
| SPA&MKT | Light Pink (#FCE7F3) |
| IMPROVEMENT | Light Green (#DCFCE7) |
| DRY FOOD | Light Orange (#FED7AA) |
| Aeon CF | Light Purple (#E9D5FF) |

#### Cell Highlighting
| Condition | Style |
|-----------|-------|
| Complete % = 100% | Green background |
| Complete % < 100% | Red/Pink background |
| Empty/No task | White background |

#### Store List (Sample)
| Code | Store Name |
|------|------------|
| 3002 | Ecopark |
| 3003 | Riverside |
| 3005 | Poxton |
| 3008 | Phuride |
| 3011 | Thang Long |
| 3013 | Lotus |
| 3014 | Linh Dam |
| 3015 | Westbay |
| 3016 | Ocean Park |
| 3018 | Lich Nam |
| 3019 | The Five |
| 3020 | Eco Phung Cr |
| 3022 | Kosmo |
| 3024 | Lacasta |
| 3027 | Zenpark |
| 3029 | Nam Trung Yen |
| 3030 | SkyDarttr |
| 3031 | Symphony |
| 3032 | Five Star |
| 3033 | Sapphire |
| 3034 | Landmark |
| 3035 | Flaster |
| 3036 | Royal City |
| 3037 | Havenpark |
| 3038 | Hanah |
| 3040 | Masteri Smart City |
| 3040 | Mayala cepura |

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

## 5. API Requirements

### 5.1 Get Weekly Completion Data
```
GET /api/v1/reports/weekly-completion
Query params:
  - start_week: string (e.g., "W40")
  - end_week: string (e.g., "W45")
  - department_id?: number (optional filter)
```

### 5.2 Get Store Weekly Grid
```
GET /api/v1/reports/store-weekly
Query params:
  - start_week: string
  - end_week: string
```

### 5.3 Get Detailed Store Report
```
GET /api/v1/reports/store-detail
Query params:
  - week: string (e.g., "W44")
  - department_id?: number (optional)
```

---

## 6. Interactions

### 6.1 Week Selection
- Click on week header to filter data for specific week
- Chart updates to show selected week range

### 6.2 Department Filter
- Dropdown "Filter: All dept" filters chart data
- Options: All dept, ADMIN, PLANNING, SPA&MKT, IMPROVEMENT, DRY FOOD, Aeon CF

### 6.3 Store Row Click
- Click on store row to drill down into store detail
- Navigate to store-specific report page

### 6.4 Table Sorting
- Click column header to sort by that column
- Toggle ascending/descending

### 6.5 Export
- Export button to download report as Excel/CSV

---

## 7. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Desktop (>1200px) | Full layout with chart and grid side by side |
| Tablet (768-1200px) | Chart above grid, both full width |
| Mobile (<768px) | Stacked layout, horizontal scroll for table |

---

## 8. Implementation Status

### Completed Components

| Component | File | Status |
|-----------|------|--------|
| ReportPage | `frontend/src/app/report/page.tsx` | ✅ Implemented |
| WeeklyCompletionGrid | `frontend/src/components/report/WeeklyCompletionGrid.tsx` | ✅ Implemented |
| StackedBarChart | `frontend/src/components/report/StackedBarChart.tsx` | ✅ Implemented |
| StoreReportTable | `frontend/src/components/report/StoreReportTable.tsx` | ✅ Implemented |
| Mock Data | `frontend/src/data/mockReportData.ts` | ✅ Implemented |

### Implementation Notes

1. **WeeklyCompletionGrid**: Displays store completion % by week with color-coded cells
2. **StackedBarChart**: Custom stacked bar chart (no external library) with blue/red segments
3. **StoreReportTable**: Complex table with department breakdowns, supports dynamic department columns
4. **Mock Data**: Sample data for development, includes DEPARTMENTS array with color mappings

---

## 9. Changelog

| Date | Change |
|------|--------|
| 2026-01-03 | Initial specification created from wireframe |
| 2026-01-03 | Implemented Report screen with all components |
