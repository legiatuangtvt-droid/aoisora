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
| **Routes** | `/tasks/[id]`, `/tasks/detail` (auto-redirect) |
| **Module** | WS (Task from HQ) |
| **Target Users** | HQ Manager, Store Staff |
| **Demo Status** | Frontend ✅ Done (mock data), Backend ⏳ Pending |

### 1.2 Mục đích

Hiển thị chi tiết task từ HQ, bao gồm:
- Thông tin task (tên, ngày, loại, trạng thái)
- Tiến độ thực hiện của từng store
- Kết quả (hình ảnh, báo cáo) từ stores
- Comments và tương tác (Like)
- Workflow approval steps

---

## 2. CẤU TRÚC SCREEN (Đã demo)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK HEADER                                                                 │
│ ┌─────────────────────────────────────────┬───────────────────────────────┐ │
│ │ [Task Level 1]                          │ [Not Started] [Done] [Unable] │ │
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

## 3. CÁC THÀNH PHẦN CHI TIẾT

### 3.1 Task Header

| Component | Mô tả | Câu hỏi cho Dev Team |
|-----------|-------|---------------------|
| Task Level Badge | "Task level 1", "Task level 2"... | ❓ Có tối đa bao nhiêu levels? Có cần validate? |
| Task Name | Tên task, bold | ✅ Clear |
| Date Range | Start → End dates | ✅ Clear |
| HQ Check Code | Mã kiểm tra (D097, D098...) | ❓ Format mã này như thế nào? Có bảng code_master? |
| Task Type | Image / Document / Checklist / Yes-No | ❓ Confirm 4 loại này? Có thêm loại khác? |
| Manual Link | Link đến tài liệu hướng dẫn | ✅ Optional field |

### 3.2 Statistics Cards

| Card | Nguồn dữ liệu | Câu hỏi |
|------|---------------|---------|
| Not Started | COUNT stores WHERE status = 'not_yet' | ✅ Clear |
| Done | COUNT stores WHERE status = 'done' | ✅ Clear |
| Unable | COUNT stores WHERE status = 'unable' | ✅ Clear |
| Avg Time | AVG(completed_at - started_at) WHERE done | ❓ Tính từ assignment hay từ khi store bắt đầu? |

### 3.3 View Modes

| Mode | Nội dung | API cần thiết |
|------|----------|---------------|
| **Results** | Store cards với images, comments | GET /tasks/{id}/stores |
| **Comment** | Store cards với comments mở rộng | Same API, different display |
| **Staff** | Staff cards với progress grid | GET /tasks/{id}/staffs |

### 3.4 Store Result Card

| Element | Mô tả | Câu hỏi |
|---------|-------|---------|
| Store Location | Region - Area - Store ID | ❓ Format: "HN - Long Biên - S001"? |
| Store Name | Tên cửa hàng | ✅ Clear |
| Start/Complete Time | Timestamps | ✅ Clear |
| Status | success / failed / in_progress / not_started | ❓ Mapping với store_status hiện tại? |
| Completed By | Staff đã hoàn thành | ✅ Clear |
| Images | Grid hình ảnh kết quả | ❓ Max images per store? |
| Comments | Danh sách comments | ✅ Clear |
| Likes | Like count + users | ❓ Có cần feature này không? |

---

## 4. GAP ANALYSIS: SPEC vs IMPLEMENTATION

### 4.1 Điểm khác biệt với business flow hiện tại

| Spec (Demo) | Business Flow (CLAUDE.md) | Cần thảo luận |
|-------------|---------------------------|---------------|
| Status: success/failed/in_progress/not_started | Store Status: not_yet/on_progress/done_pending/done/unable/overdue | ⚠️ Cần align status names |
| Không có HQ Check flow | HQ Check: done_pending → done (sau khi HQ verify) | ⚠️ Spec thiếu HQ Check flow |
| Like feature | Không đề cập trong business flow | ❓ Có cần feature này? |
| Send Reminder | Có trong spec | ✅ OK - [PROD-ONLY] |

### 4.2 API Mapping

| Spec API | Implemented API | Status |
|----------|-----------------|--------|
| GET /tasks/{id} | GET /api/v1/tasks/{id} | ✅ Done |
| GET /tasks/{id}/stores | GET /api/v1/tasks/{id}/progress | ✅ Done (khác endpoint) |
| GET /tasks/{id}/staffs | ❌ Not implemented | ⏳ Pending |
| GET /tasks/{id}/comments | ✅ TaskCommentsController | ✅ Done |
| POST /tasks/{id}/comments | ✅ TaskCommentsController | ✅ Done |
| POST /tasks/{id}/like | ❌ Not implemented | ❓ Có cần? |
| POST /tasks/{id}/reminder | ❌ Not implemented | ⏳ [PROD-ONLY] |

### 4.3 Data Types Mapping

| Spec Type | DB Table/Field | Notes |
|-----------|----------------|-------|
| TaskDetail | tasks | ✅ Match |
| StoreResult | task_store_assignments | ✅ Match |
| StaffResult | ❓ | Cần clarify: staff_id trong assignments hay riêng? |
| ImageItem | ❓ | Cần bảng task_images hoặc task_evidence? |
| Comment | task_comments | ✅ Match |
| WorkflowStep | task_approval_history | ✅ Match |

---

## 5. CÂU HỎI CẦN CHỐT VỚI DEV TEAM

### 5.1 Business Logic

| # | Câu hỏi | Options | Gợi ý |
|---|---------|---------|-------|
| Q1 | Store status mapping? | A) Giữ 4 status như spec<br>B) Dùng 6 status như business flow | B - vì đã implement |
| Q2 | HQ Check có hiển thị trong detail? | A) Có - hiển thị riêng<br>B) Không - chỉ trong list | A - để HQ verify từng store |
| Q3 | Staff View lấy data từ đâu? | A) assigned_to_staff từ assignments<br>B) Riêng bảng staff | A - từ assignments |
| Q4 | Like feature có cần không? | A) Có<br>B) Không - bỏ | ❓ Tùy business |
| Q5 | Images lưu ở đâu? | A) Bảng task_images<br>B) Field trong assignments<br>C) Bảng task_evidence | Cần design |

### 5.2 Technical

| # | Câu hỏi | Notes |
|---|---------|-------|
| T1 | API pagination cho stores/staff? | Nếu task có 500 stores |
| T2 | Image upload limit? | Max size, count per store |
| T3 | Real-time updates cho comments? | WebSocket hay polling? |
| T4 | Workflow steps format? | Round tabs có cần không? |

---

## 6. ĐỀ XUẤT ĐIỀU CHỈNH SPEC

### 6.1 Store Status - Align với Business Flow

**Thay đổi:**
```
// OLD (Spec)
status: 'success' | 'failed' | 'in_progress' | 'not_started'

// NEW (Align với Business Flow)
status: 'not_yet' | 'on_progress' | 'done_pending' | 'done' | 'unable' | 'overdue'
```

**Mapping UI:**

| Status | Badge Color | Display Text |
|--------|-------------|--------------|
| not_yet | Gray | Not Started |
| on_progress | Blue | In Progress |
| done_pending | Yellow | Pending Check |
| done | Green | Completed |
| unable | Orange | Unable |
| overdue | Red | Overdue |

### 6.2 Thêm HQ Check Section

**Đề xuất thêm vào Store Card:**

```
┌─────────────────────────────────────────┐
│ Store Card                              │
│ ...existing content...                  │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ HQ CHECK (cho status = done_pending)│ │
│ │ [✓ Checked] [✕ Reject]              │ │
│ │ Reason input (nếu reject)           │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 6.3 Evidence/Images Schema

**Đề xuất bảng mới:**

```sql
CREATE TABLE task_store_evidence (
    id BIGINT PRIMARY KEY,
    task_store_assignment_id BIGINT,
    file_url VARCHAR(500),
    file_type ENUM('image', 'document'),
    uploaded_by BIGINT,
    uploaded_at TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (task_store_assignment_id)
        REFERENCES task_store_assignments(id)
);
```

---

## 7. IMPLEMENTATION PRIORITY

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

### Phase 3 - Nice to have

| # | Feature | Effort | Notes |
|---|---------|--------|-------|
| 8 | Like feature | Low | Tùy business decision |
| 9 | Send Reminder | Low | [PROD-ONLY] |
| 10 | Export Results | Medium | Future |

---

## 8. ACTION ITEMS SAU MEETING

| # | Action | Owner | Deadline |
|---|--------|-------|----------|
| 1 | Confirm status mapping | Dev Team | - |
| 2 | Confirm Like feature cần không | Product | - |
| 3 | Design evidence schema | Dev Team | - |
| 4 | Update spec sau meeting | Claude | - |
| 5 | Implement Phase 1 | Dev Team | - |

---

## 9. ATTACHMENTS

### Current Spec Files
- Basic: `docs/specs/basic/ws-task-detail-basic.md`
- Detail: `docs/specs/detail/ws-task-detail-detail.md`

### Related Docs
- Business Flow: `CLAUDE.md` Section 12
- API Specs: `docs/specs/api/`

### Demo Screenshots
- (Cần capture từ localhost:3000/tasks/detail)

---

*Document prepared for Dev Team Meeting - 2026-01-25*
