# Report - Basic Specification

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_REPORT
> **Route**: `/tasks/report`
> **Last Updated**: 2026-01-08

---

## 1. Overview

| Field | Value |
|-------|-------|
| **Purpose** | Display task completion statistics across stores and departments with weekly tracking |
| **Target Users** | HQ (Headquarter) Staff, Manager |
| **Entry Points** | Sidebar "Report" |

---

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | Manager | View weekly completion by store | I can track store performance |
| US-02 | Manager | See completion % with color coding | I can quickly identify issues |
| US-03 | Manager | View stacked bar chart | I can see completion trends |
| US-04 | Manager | Filter by department | I can focus on specific areas |
| US-05 | Manager | View detailed store breakdown | I can see department-level data |
| US-06 | Manager | Export report | I can share with stakeholders |

---

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Week Selector Grid | Store x Week matrix with completion % |
| Stacked Bar Chart | Visual completion trends by week |
| Filter Dropdown | Department filter |
| Store Report Table | Detailed breakdown by department |

---

## 4. Screen Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  [Week Selector Grid]              [Stacked Bar Chart]           │
│  W40  W41  W42  W43  W44  W45      Filter: All dept              │
│  Store completion % by week                                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [Detailed Store Report Table]                                    │
│  Columns: Store | Total Task | Per Department breakdown           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Navigation

| Action | Destination | Description |
|--------|-------------|-------------|
| Click Sidebar "Report" | `/tasks/report` | Open Report screen |
| Click week header | - | Filter data by week |
| Click store row | - | Drill down to store detail |
| Click Export | - | Download report |

---

## 6. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/reports/weekly-completion` | Get weekly completion data |
| GET | `/api/v1/reports/store-weekly` | Get store weekly grid |
| GET | `/api/v1/reports/store-detail` | Get detailed store report |

---

## 7. Implementation Status

| Feature | Backend | Frontend | Deploy | Notes |
|---------|---------|----------|--------|-------|
| Report Page | ⏳ Pending | ✅ Done | [DEMO] | Mock data |
| Weekly Completion Grid | ⏳ Pending | ✅ Done | [DEMO] | Mock data |
| Stacked Bar Chart | - | ✅ Done | [DEMO] | Custom chart |
| Store Report Table | ⏳ Pending | ✅ Done | [DEMO] | Mock data |
| Export Excel/PDF | ⏳ Pending | ⏳ Pending | [LOCAL-DEV] | - |
| API Integration | ⏳ Pending | ⏳ Pending | [DEMO] | - |

---

## 8. Completion Color Coding

| Completion % | Color |
|--------------|-------|
| 100% | Green |
| 90-99% | Light Green |
| 80-89% | Yellow |
| 70-79% | Orange |
| < 70% | Red |

---

## 9. Related Documents

| Document | Path |
|----------|------|
| Detail Spec | `docs/specs/detail/ws/report-detail.md` |
| Task List Basic | `docs/specs/basic/ws/task-list-basic.md` |
