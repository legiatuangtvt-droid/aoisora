# Add Task - Basic Specification

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_TASK_ADD
> **Route**: `/tasks/new`
> **Last Updated**: 2026-01-08

---

## 1. Overview

| Field | Value |
|-------|-------|
| **Purpose** | Create new task groups with multi-level hierarchical structure (up to 5 levels) |
| **Target Users** | HQ (Headquarter) Staff |
| **Entry Points** | "+ ADD NEW" button on Task List |

---

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | HQ Staff | Create a new task group | I can assign work to stores |
| US-02 | HQ Staff | Add multiple task levels (2-5) | I can create detailed task breakdowns |
| US-03 | HQ Staff | View task hierarchy in Maps tab | I can visualize task structure |
| US-04 | HQ Staff | Save task as draft | I can continue editing later |
| US-05 | HQ Staff | Submit task for approval | I can start the task workflow |

---

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Header | Breadcrumb navigation + Detail/Maps tabs |
| Task Level Cards | Hierarchical cards for each task level (1-5) |
| Section Accordion | Collapsible sections: Task Info, Instructions, Scope, Approval |
| Footer | Save as Draft / Submit buttons |

---

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

---

## 5. Navigation

| Action | Destination | Description |
|--------|-------------|-------------|
| Click "+ ADD NEW" on Task List | `/tasks/new` | Open create task form |
| Click "List task" breadcrumb | `/tasks/list` | Return to list |
| Click "Save as draft" | `/tasks/list` | Save draft and redirect |
| Click "Submit" | `/tasks/list` | Submit and redirect |
| Click "Maps" tab | - | Show hierarchical flowchart view |

---

## 6. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/tasks` | Create new task (SUBMITTED) |
| POST | `/api/v1/tasks/draft` | Save draft (DRAFT) |
| POST | `/api/v1/tasks/images` | Upload task images |
| GET | `/api/v1/regions` | Get region list |
| GET | `/api/v1/zones` | Get zones by region |
| GET | `/api/v1/areas` | Get areas by zone |
| GET | `/api/v1/stores` | Get stores by area |

---

## 7. Implementation Status

| Feature | Backend | Frontend | Deploy | Notes |
|---------|---------|----------|--------|-------|
| Add Task Page | ⏳ Pending | ✅ Done | [DEMO] | Mock data |
| Task Level Cards | - | ✅ Done | [DEMO] | UI only |
| Section Accordion | - | ✅ Done | [DEMO] | Frontend only |
| Detail Tab | - | ✅ Done | [DEMO] | Form inputs |
| Maps Tab | - | ✅ Done | [DEMO] | Flowchart view |
| Image Upload | ⏳ Pending | ✅ Done | [LOCAL-DEV] | Storage needed |
| API Integration | ⏳ Pending | ⏳ Pending | [DEMO] | - |

---

## 8. Task Sections Summary

| Section | Content |
|---------|---------|
| **A. Task Information** | Task Type, Applicable Period, Execution Time |
| **B. Instructions** | Task Type (Image/Document/Checklist), Manual Link, Note, Photo Guidelines |
| **C. Scope** | Region, Zone, Area, Store, Store Leader, Specific Staff |
| **D. Approval Process** | Initiator, Leader, HOD |

---

## 9. Related Documents

| Document | Path |
|----------|------|
| Detail Spec | `docs/specs/detail/ws-add-task-detail.md` |
| Task List Basic | `docs/specs/basic/ws-task-list-basic.md` |
| Task Detail Basic | `docs/specs/basic/ws-task-detail-basic.md` |
