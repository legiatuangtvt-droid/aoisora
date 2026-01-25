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

### 5.2 Task Level Hierarchy Logic (MỚI CẬP NHẬT)

> ⚠️ **LOGIC QUAN TRỌNG ĐÃ XÁC NHẬN:**
>
> **Quy ước thuật ngữ:** Không dùng "sub-task" để tránh nhầm lẫn. Thay vào đó dùng **Task Level 1, 2, 3, 4, 5**.

```
┌─────────────────────────────────────────────────────────────────┐
│  QUY TẮC TASK HIERARCHY (Level 1 → 5)                           │
│                                                                 │
│  1. NẾU TASK CÓ CHILD TASKS (Task Level thấp hơn):              │
│     → Task cha KHÔNG CÓ NỘI DUNG cần confirm                    │
│     → Task cha KHÔNG hiển thị Store Result Cards                │
│     → Task cha chỉ hiển thị danh sách child tasks               │
│                                                                 │
│  2. STATUS CỦA TASK CHA:                                        │
│     → Được TỔNG HỢP từ status của tất cả child tasks            │
│     → Không tính toán từ store assignments trực tiếp            │
│                                                                 │
│  3. CHỈ TASK LÁ (Level cuối, không có con) mới có:              │
│     → Store assignments                                         │
│     → Store Result Cards                                        │
│     → HQ Check actions                                          │
│     → Evidence uploads                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Ví dụ 1 - Đơn giản (Level 1 → Level 2 là LEAF):**

```
Task Level 1: "Kiểm kê Q1" (PARENT - có child tasks)
├── UI: Danh sách child tasks, KHÔNG có Store Cards
├── Status: Tổng hợp từ 3 Task Level 2
│
├── Task Level 2: "Kiểm kê Thực phẩm" (LEAF - không có con)
│   ├── UI: Store Cards, HQ Check
│   ├── Status: Tính từ store assignments
│   └── Store Cards: 50 stores
│
├── Task Level 2: "Kiểm kê Điện máy" (LEAF)
│   └── Store Cards: 50 stores
│
└── Task Level 2: "Kiểm kê Thời trang" (LEAF)
    └── Store Cards: 50 stores
```

**Ví dụ 2 - Phức tạp (Level 2 cũng là PARENT có Level 3):**

```
Task Level 1: "Kiểm kê Q1" (PARENT)
├── UI: Danh sách 3 Task Level 2
├── Status: Tổng hợp từ 3 Task Level 2
│
├── Task Level 2: "Kiểm kê Thực phẩm" (PARENT - có child Level 3!)
│   ├── UI: Danh sách child tasks, KHÔNG có Store Cards
│   ├── Status: Tổng hợp từ 2 Task Level 3
│   │
│   ├── Task Level 3: "Kiểm kê Rau củ" (LEAF)
│   │   ├── UI: Store Cards, HQ Check
│   │   └── Store Cards: 25 stores
│   │
│   └── Task Level 3: "Kiểm kê Hải sản" (LEAF)
│       ├── UI: Store Cards, HQ Check
│       └── Store Cards: 25 stores
│
├── Task Level 2: "Kiểm kê Điện máy" (LEAF - không có con)
│   ├── UI: Store Cards, HQ Check
│   └── Store Cards: 50 stores
│
└── Task Level 2: "Kiểm kê Thời trang" (LEAF)
    └── Store Cards: 50 stores
```

> **QUY TẮC VÀNG:** UI được quyết định bởi việc task CÓ CHILD hay KHÔNG, không phải bởi Level.
> - Có child tasks → UI Parent (danh sách child, không có Store Cards)
> - Không có child → UI Leaf (Store Cards, HQ Check)

**Cách tính Status của Task Cha:**

| Điều kiện | Status Task Cha |
|-----------|-----------------|
| Tất cả child tasks = `not_yet` | `not_yet` |
| Ít nhất 1 child task = `on_progress` | `on_progress` |
| Tất cả child tasks = `done` hoặc `unable` | `done` |
| Ít nhất 1 child task = `overdue` | `overdue` |

**UI Impact (áp dụng cho MỌI level):**

> ⚠️ **Lưu ý:** Bảng này áp dụng cho task ở BẤT KỲ level nào (1, 2, 3, 4, 5).
> UI được quyết định bởi việc task có child hay không, KHÔNG phải bởi level của task.

| View | Task có child tasks (PARENT) | Task không có child (LEAF) |
|------|------------------------------|----------------------------|
| Task Header | ✅ Hiển thị | ✅ Hiển thị |
| Statistics Cards | ❌ Ẩn (hoặc tổng hợp) | ✅ Hiển thị từ stores |
| Store Result Cards | ❌ Ẩn | ✅ Hiển thị |
| Child Tasks List | ✅ Hiển thị danh sách | ❌ Ẩn |
| HQ Check Actions | ❌ Không có | ✅ Có |
| Comments | ✅ Có (cấp task) | ✅ Có (cấp task + store) |
| Breadcrumb | ✅ Cho phép navigate lên parent | ✅ Cho phép navigate lên parent |

**Navigation Flow:**

```
/tasks/1 (Level 1 - PARENT)
    ↓ Click child task
/tasks/2 (Level 2 - có thể là PARENT hoặc LEAF)
    ↓ Click child task (nếu là PARENT)
/tasks/5 (Level 3 - LEAF)
    → Hiển thị Store Cards, HQ Check
```

### 5.3 Technical

| # | Câu hỏi | Notes |
|---|---------|-------|
| T1 | API pagination cho stores/staff? | Nếu task có 500 stores |
| T2 | Image upload limit? | Max size, count per store |
| T3 | Real-time updates cho comments? | WebSocket hay polling? |
| T4 | Workflow steps format? | Round tabs có cần không? |
| T5 | API cho parent task detail? | Cần endpoint riêng hay cùng /tasks/{id}? |
| T6 | Eager loading child tasks? | Load bao nhiêu levels? (Level 1 → 5) |

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

### 6.4 Parent-Child Task Display Logic (MỚI)

**Case 1: Task Level 1 là PARENT (có Task Level 2):**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK DETAIL - LEVEL 1 PARENT                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📍 Task List                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ TASK HEADER                                                                 │
│ ┌─────────────────────────────────────────┬───────────────────────────────┐ │
│ │ [Task Level 1]                          │     📊 TỔNG HỢP               │ │
│ │ Kiểm kê Q1 2026                         │  Child Tasks: 3               │ │
│ │ 01 Jan - 31 Mar | HQ Check: D097        │  Completed: 1/3               │ │
│ │                                         │  Progress: 33%                │ │
│ └─────────────────────────────────────────┴───────────────────────────────┘ │
│                                                                             │
│ ⚠️ KHÔNG CÓ Store Cards (vì task cha không giao trực tiếp cho stores)       │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ CHILD TASKS LIST (Task Level 2)                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ #  │ Task Name            │ Status      │ Progress │ Stores │ Actions  │ │
│ ├────┼──────────────────────┼─────────────┼──────────┼────────┼──────────┤ │
│ │ 1  │ Kiểm kê Thực phẩm    │ 🔵 Progress │ 25/50    │ -      │ [View]   │ │
│ │    │ (có 2 child tasks)   │             │          │        │          │ │
│ │ 2  │ Kiểm kê Điện máy     │ 🔵 Progress │ 30/50    │ 50     │ [View]   │ │
│ │ 3  │ Kiểm kê Thời trang   │ ⚪ Not Yet  │ 0/50     │ 50     │ [View]   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ 💡 "Kiểm kê Thực phẩm" có Stores = "-" vì là PARENT (có child Level 3)      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Case 2: Task Level 2 là PARENT (có Task Level 3):**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK DETAIL - LEVEL 2 PARENT                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📍 Task List > Kiểm kê Q1 2026                         ← BREADCRUMB        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ TASK HEADER                                                                 │
│ ┌─────────────────────────────────────────┬───────────────────────────────┐ │
│ │ [Task Level 2]                          │     📊 TỔNG HỢP               │ │
│ │ Kiểm kê Thực phẩm                       │  Child Tasks: 2               │ │
│ │ 01 Jan - 31 Jan | HQ Check: D097-01     │  Completed: 1/2               │ │
│ │ Parent: Kiểm kê Q1 2026                 │  Progress: 50%                │ │
│ └─────────────────────────────────────────┴───────────────────────────────┘ │
│                                                                             │
│ ⚠️ KHÔNG CÓ Store Cards (vì là PARENT có child tasks)                       │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ CHILD TASKS LIST (Task Level 3)                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ #  │ Task Name            │ Status      │ Progress │ Stores │ Actions  │ │
│ ├────┼──────────────────────┼─────────────┼──────────┼────────┼──────────┤ │
│ │ 1  │ Kiểm kê Rau củ       │ ✅ Done     │ 25/25    │ 25     │ [View]   │ │
│ │ 2  │ Kiểm kê Hải sản      │ 🔵 Progress │ 10/25    │ 25     │ [View]   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ Click [View] → Navigate to /tasks/{child_task_id} để xem Store Cards        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Case 3: Task Level 3 là LEAF (không có child, có Store Cards):**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK DETAIL - LEVEL 3 LEAF                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📍 Task List > Kiểm kê Q1 2026 > Kiểm kê Thực phẩm     ← BREADCRUMB        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ TASK HEADER                                                                 │
│ ┌─────────────────────────────────────────┬───────────────────────────────┐ │
│ │ [Task Level 3]                          │ [Not Started] [Done] [Unable] │ │
│ │ Kiểm kê Rau củ                          │     10          15       0    │ │
│ │ 01 Jan - 15 Jan | HQ Check: D097-01-01  │ [Avg Time: 2.5h]              │ │
│ │ Task type: Image | Manual link          │     (Statistics Cards)        │ │
│ │ Parent: Kiểm kê Thực phẩm               │                               │ │
│ └─────────────────────────────────────────┴───────────────────────────────┘ │
│                                                                             │
│ ✅ CÓ Store Cards (vì là LEAF - không có child tasks)                       │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ FILTER BAR                                                                  │
│ [Region ▼] [Zone ▼] [Area ▼] [Store ▼] [Search...] [Results|Comment|Staff]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ STORE RESULT CARDS                                                          │
│                                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                             │
│ │ Store A     │ │ Store B     │ │ Store C     │ ...                         │
│ │ ✅ Done     │ │ 🔵 Progress │ │ ⚪ Not Yet  │                             │
│ │ - Images    │ │ - Images    │ │             │                             │
│ │ - Comments  │ │ - Comments  │ │             │                             │
│ │ [HQ Check ✓]│ │ [HQ Check]  │ │             │                             │
│ └─────────────┘ └─────────────┘ └─────────────┘                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Tóm tắt 3 Cases:**

| Case | Level | Có Child? | UI | Breadcrumb |
|------|-------|-----------|----|------------------------------------|
| 1 | Level 1 | ✅ Có Level 2 | Parent UI | Task List |
| 2 | Level 2 | ✅ Có Level 3 | Parent UI | Task List > [Level 1] |
| 3 | Level 3 | ❌ Không | Leaf UI | Task List > [Level 1] > [Level 2] |

---

### 6.5 Đề xuất thêm: Hierarchical Table View (Bảng tổng quan cấu trúc Task)

> **Vấn đề:** UI Case 1-3 ở trên yêu cầu user phải navigate vào từng task để xem child tasks.
> User khó hình dung được **tổng quan toàn bộ cấu trúc** của một Task Group.

**Đề xuất: Thêm cột "Lvl" với đánh số phân cấp (hierarchical numbering)**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TASK LIST - HIERARCHICAL VIEW                                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ┌─────────┬──────────────────────────┬─────────────┬──────────┬───────────┐  │
│ │ Lvl     │ Task Name                │ Status      │ Progress │ Actions   │  │
│ ├─────────┼──────────────────────────┼─────────────┼──────────┼───────────┤  │
│ │ 1       │ Kiểm kê Q1 2026          │ 🔵 Progress │ 65/150   │ [View]    │  │
│ │ 1.1     │ Kiểm kê Thực phẩm        │ 🔵 Progress │ 35/50    │ [View]    │  │
│ │ 1.1.1   │ Kiểm kê Rau củ           │ ✅ Done     │ 25/25    │ [View]    │  │
│ │ 1.1.2   │ Kiểm kê Hải sản          │ 🔵 Progress │ 10/25    │ [View]    │  │
│ │ 1.2     │ Kiểm kê Điện máy         │ 🔵 Progress │ 30/50    │ [View]    │  │
│ │ 1.3     │ Kiểm kê Thời trang       │ ⚪ Not Yet  │ 0/50     │ [View]    │  │
│ └─────────┴──────────────────────────┴─────────────┴──────────┴───────────┘  │
│                                                                              │
│ 💡 LEGEND:                                                                   │
│    • Progress = tổng hợp (65/150) → Task CHA (có child tasks)               │
│    • Progress = stores (25/25)   → Task LÁ (giao trực tiếp cho stores)      │
│    • Cột Lvl cho biết cấu trúc phân cấp: 1 → 1.1 → 1.1.1                    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Quy tắc đánh số cột "Lvl":**

| Cấu trúc | Lvl | Giải thích |
|----------|-----|------------|
| Task Level 1 | `1` | Task gốc |
| Task Level 2 thứ 1 | `1.1` | Child đầu tiên của Level 1 |
| Task Level 2 thứ 2 | `1.2` | Child thứ hai của Level 1 |
| Task Level 3 thứ 1 thuộc Level 2 thứ 1 | `1.1.1` | Child đầu tiên của 1.1 |
| Task Level 3 thứ 2 thuộc Level 2 thứ 1 | `1.1.2` | Child thứ hai của 1.1 |
| Task Level 3 thứ 1 thuộc Level 2 thứ 3 | `1.3.1` | Child đầu tiên của 1.3 |

**Cách nhận biết Task Cha vs Task Lá:**

| Progress | Loại Task | Giải thích |
|----------|-----------|------------|
| Số lớn (65/150, 200/500) | Task CHA | Tổng hợp từ child tasks |
| Số vừa (25/25, 30/50) | Task LÁ | Số stores đã hoàn thành |
| Lvl có nhiều dấu chấm | Nested deeper | 1.1.1.1 = Level 4 |

**Ví dụ phức tạp hơn (Level 1 → 5):**

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ Lvl       │ Task Name                  │ Status      │ Progress │ Actions     │
├───────────┼────────────────────────────┼─────────────┼──────────┼─────────────┤
│ 1         │ Kiểm kê Năm 2026           │ 🔵 Progress │ 200/500  │ [View]      │
│ 1.1       │ Kiểm kê Q1                 │ 🔵 Progress │ 65/150   │ [View]      │
│ 1.1.1     │ Kiểm kê Thực phẩm          │ 🔵 Progress │ 35/50    │ [View]      │
│ 1.1.1.1   │ Rau củ                     │ ✅ Done     │ 25/25    │ [View]      │
│ 1.1.1.2   │ Hải sản                    │ 🔵 Progress │ 10/25    │ [View]      │
│ 1.1.2     │ Kiểm kê Điện máy           │ 🔵 Progress │ 30/50    │ [View]      │
│ 1.1.3     │ Kiểm kê Thời trang         │ ⚪ Not Yet  │ 0/50     │ [View]      │
│ 1.2       │ Kiểm kê Q2                 │ ⚪ Not Yet  │ 0/150    │ [View]      │
│ 1.2.1     │ (same structure...)        │             │          │             │
│ ...       │                            │             │          │             │
└───────────┴────────────────────────────┴─────────────┴──────────┴─────────────┘
```

**Tùy chọn UI - Expand/Collapse:**

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ OPTION A: Flat View (Hiển thị tất cả - như trên)                                        │
│ → User thấy toàn bộ cấu trúc ngay lập tức                                               │
│ → Phù hợp cho tasks có ít levels (2-3)                                                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ OPTION B: Collapsible View (Click để expand/collapse)                                   │
│                                                                                         │
│ ┌─────────┬──────────────────────────┬─────────────┬──────────┬───────────┐             │
│ │ Lvl     │ Task Name                │ Status      │ Progress │ Actions   │             │
│ ├─────────┼──────────────────────────┼─────────────┼──────────┼───────────┤             │
│ │ 1 [▼]   │ Kiểm kê Q1 2026          │ 🔵 Progress │ 65/150   │ [View]    │             │
│ │ 1.1 [▶] │ Kiểm kê Thực phẩm        │ 🔵 Progress │ 35/50    │ [View]    │             │
│ │ 1.2     │ Kiểm kê Điện máy         │ 🔵 Progress │ 30/50    │ [View]    │             │
│ │ 1.3     │ Kiểm kê Thời trang       │ ⚪ Not Yet  │ 0/50     │ [View]    │             │
│ └─────────┴──────────────────────────┴─────────────┴──────────┴───────────┘             │
│                                                                                         │
│ → [▼] = Expanded (đang mở, đã hiển thị children)                                        │
│ → [▶] = Collapsed (đang đóng, có children bên trong)                                    │
│ → Không có icon = Leaf task (không có children)                                         │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

**Đề xuất: Dùng OPTION B (Collapsible) cho Task List chính**
- Default: Chỉ hiển thị Level 1
- Click expand: Hiển thị thêm children
- Giữ state expand/collapse trong localStorage

---

**API Response Structure:**

```typescript
// GET /api/v1/tasks/{id}
interface TaskDetailResponse {
  id: number;
  name: string;
  level: number;
  status: TaskStatus;

  // Nếu có child tasks
  has_children: boolean;
  children?: ChildTaskSummary[];  // Chỉ có nếu has_children = true

  // Nếu KHÔNG có child tasks (leaf task)
  store_progress?: StoreProgress;  // Chỉ có nếu has_children = false
  statistics?: TaskStatistics;     // Chỉ có nếu has_children = false
}

interface ChildTaskSummary {
  id: number;
  name: string;
  level: number;
  status: TaskStatus;
  progress: { done: number; total: number };
  store_count: number;
}
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
| 4 | ✅ Confirm Parent-Child task logic | Product | Done |
| 5 | Update spec sau meeting | Claude | - |
| 6 | Implement Phase 1 | Dev Team | - |
| 7 | Update API response cho parent tasks | Dev Team | - |

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
