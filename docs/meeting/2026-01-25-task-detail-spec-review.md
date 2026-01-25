# MEETING: Task Detail Spec Review

> **Date**: 2026-01-25
> **Participants**: Product Owner, Dev Team
> **Objective**: Chốt spec cho Task Detail screen trước khi build production

---

## 1. TỔNG QUAN SCREEN

### 1.1 Thông tin cơ bản

| Field | Value |
|-------|-------|
| **Screen ID** | SCR_TASK_DETAIL |
| **Routes** | `/tasks/[id]` (chỉ cho Task Lá) |
| **Module** | WS (Task from HQ) |
| **Target Users** | HQ Manager, Store Staff |
| **Demo Status** | Frontend ✅ Done (mock data), Backend ⏳ Pending |

### 1.2 Mục đích

Hiển thị chi tiết task từ HQ, bao gồm:
- Thông tin task (tên, ngày, loại, trạng thái)
- Tiến độ thực hiện của từng store
- Kết quả (hình ảnh, báo cáo) từ stores
- Comments và tương tác
- Workflow approval steps

---

## 2. QUYẾT ĐỊNH QUAN TRỌNG TỪ DEV TEAM

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ ĐÃ CHỐT VỚI DEV TEAM (2026-01-25):                          │
│                                                                 │
│  1. CHỈ TASK LÁ mới có Detail page (/tasks/{id})                │
│     → Hiển thị Store Cards, HQ Check, Evidence                  │
│     → Click row trong Task List → Navigate đến Detail           │
│                                                                 │
│  2. TASK CHA không có Detail page riêng                         │
│     → Chỉ expand/collapse trong Task List                       │
│     → Click row → Expand/Collapse children                      │
│     → Status được AUTO-CALCULATE từ tất cả Task Con             │
│                                                                 │
│  3. CÁCH NHẬN BIẾT:                                             │
│     → Task CHA: Progress = "-", có icon ▶/▼                     │
│     → Task LÁ: Progress = "25/25", không có icon                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. CẤU TRÚC SCREEN (Giữ nguyên như Demo)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK HEADER                                                                 │
│ ┌─────────────────────────────────────────┬───────────────────────────────┐ │
│ │ [Task Level]                            │ [Not Started] [Done] [Unable] │ │
│ │ Task Name                               │ [Avg Time]                    │ │
│ │ 04 Nov - 21 Dec | HQ Check: D097        │     (Statistics Cards)        │ │
│ │ Task type: Image | Manual link          │                               │ │
│ └─────────────────────────────────────────┴───────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ FILTER BAR                                                                  │
│ [Region ▼] [Area ▼] [Store ▼] [Search...] [Results | Comment | Staff]       │
├─────────────────────────────────────────────────────────────────────────────┤
│ CONTENT AREA (theo View Mode)                                               │
│                                                                             │
│ Results View:     Comment View:       Staff View:                           │
│ ┌─────────────┐   ┌─────────────┐     ┌─────────────┐                       │
│ │ Store Card  │   │ Store Card  │     │ Staff Card  │                       │
│ │ - Images    │   │ - Comments  │     │ - Progress  │                       │
│ │ - Comments  │   │ - (expanded)│     │ - Req Grid  │                       │
│ └─────────────┘   └─────────────┘     └─────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. STATUS MAPPING

### Store Status (Align với Business Flow)

| Status | Badge Color | Display Text |
|--------|-------------|--------------|
| not_yet | Gray | Not Started |
| on_progress | Blue | In Progress |
| done_pending | Yellow | Pending Check |
| done | Green | Completed |
| unable | Orange | Unable |
| overdue | Red | Overdue |

### Auto-Calculation Status của Task Cha

| Điều kiện tất cả Task Con | Status Task Cha |
|---------------------------|-----------------|
| Tất cả = `not_yet` | `not_yet` |
| Ít nhất 1 = `on_progress` | `on_progress` |
| Tất cả = `done` hoặc `unable` | `done` |
| Ít nhất 1 = `overdue` | `overdue` |

---

## 5. API MAPPING

| Spec API | Implemented API | Status |
|----------|-----------------|--------|
| GET /tasks/{id} | GET /api/v1/tasks/{id} | ✅ Done |
| GET /tasks/{id}/stores | GET /api/v1/tasks/{id}/progress | ✅ Done |
| GET /tasks/{id}/staffs | ❌ Not implemented | ⏳ Pending |
| GET /tasks/{id}/comments | ✅ TaskCommentsController | ✅ Done |
| POST /tasks/{id}/comments | ✅ TaskCommentsController | ✅ Done |
| POST /tasks/{id}/reminder | ❌ Not implemented | ⏳ [PROD-ONLY] |

---

## 6. IMPLEMENTATION PRIORITY

### Phase 1 - Core (Cần làm ngay)

| # | Feature | Effort | Notes |
|---|---------|--------|-------|
| 1 | GET /tasks/{id} - full detail | Low | Đã có, cần update |
| 2 | Store progress với new status | Low | Đã có API |
| 3 | HQ Check actions trong detail | Medium | Thêm UI + connect API |
| 4 | Evidence upload | Medium | Cần design schema |

### Phase 2 - Enhanced

| # | Feature | Effort | Notes |
|---|---------|--------|-------|
| 5 | Staff View | Medium | Cần API mới |
| 6 | Workflow Steps | Low | UI done, cần real data |
| 7 | Comments real-time | Medium | WebSocket |

---

## 7. ACTION ITEMS SAU MEETING

| # | Action | Owner | Status |
|---|--------|-------|--------|
| 1 | Confirm status mapping | Dev Team | ⏳ |
| 2 | Design evidence schema | Dev Team | ⏳ |
| 3 | ✅ Confirm Navigation rules (Task Cha vs Task Lá) | Dev Team | Done |
| 4 | Implement Phase 1 | Dev Team | ⏳ |

---

## 8. ATTACHMENTS

### Spec Files
- Basic: `docs/specs/basic/ws-task-detail-basic.md`
- Detail: `docs/specs/detail/ws-task-detail-detail.md`

### Related Docs
- Business Flow: `CLAUDE.md` Section 12
- API Specs: `docs/specs/api/`

---

*Document prepared for Dev Team Meeting - 2026-01-25*
