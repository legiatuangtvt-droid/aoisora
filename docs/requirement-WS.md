# TÀI LIỆU PHÂN TÍCH YÊU CẦU - WS MODULE (Task from HQ)

> **Project**: AEON Task Management System
> **Module**: WS (Work Schedule - Task from HQ)
> **Version**: 1.0
> **Last Updated**: 2026-01-26

---

## 1. MỤC TIÊU DỰ ÁN

### 1.1 Tổng quan

Hệ thống được thiết kế để chuẩn hóa và tối ưu hóa việc quản lý task, điều phối nhân lực và giao việc từ trụ sở chính (HQ) xuống các cửa hàng thuộc hệ thống AEON.

### 1.2 Mục tiêu cụ thể

| # | Mục tiêu | Mô tả |
|---|----------|-------|
| 1 | Số hóa quy trình | Thay đổi phương thức quản lý thủ công (Email/Zalo/giấy tờ) sang kỹ thuật số |
| 2 | Giao việc chính xác | Đảm bảo task được giao đúng bộ phận, đúng người, đúng thời điểm |
| 3 | Theo dõi tiến độ | Giám sát real-time tiến độ thực hiện task tại các cửa hàng |
| 4 | Đánh giá hiệu suất | Đo lường thời gian thực hiện, tỷ lệ hoàn thành, lý do unable |
| 5 | Tái sử dụng template | Lưu trữ task mẫu để dispatch nhiều lần |
| 6 | Quy trình phê duyệt | Đảm bảo task được kiểm duyệt trước khi giao cho stores |

### 1.3 Phạm vi áp dụng

- **Đối tượng**: 6 phòng ban chính (OP, Admin, Control, Improvement, Planning, HR)
- **Cấp bậc**: Từ HQ (G2-G9) đến nhân viên cửa hàng (S1-S7)
- **Địa lý**: Tất cả stores trong hệ thống AEON Việt Nam

### 1.4 Thiết bị sử dụng

| Đối tượng | Thiết bị chính | Ghi chú |
|-----------|----------------|---------|
| **HQ** | Web (Desktop/Laptop) | Sử dụng trình duyệt trên máy tính |
| **Store** | iPad / Mobile | Mỗi Store được cấp 01 iPad dùng chung |

> **Lưu ý**:
> - HQ chủ yếu sử dụng bản **Web** để quản lý và theo dõi task
> - Store chủ yếu sử dụng bản **iPad/Mobile** để nhận và thực hiện task
> - iPad là thiết bị chính tại Store (dùng chung cho cả team)
> - Giao diện cần tối ưu cho cả 2 nền tảng (Responsive Web + Mobile-first cho Store)

> **Lưu ý**: Cơ cấu phòng ban có thể thay đổi trong quá trình vận hành và tổ chức.

---

## 2. ĐỊNH NGHĨA THUẬT NGỮ

### 2.1 Cơ cấu tổ chức

| # | Thuật ngữ | Phân loại | Giải thích |
|---|-----------|-----------|------------|
| 1 | **HQ** | Tổ chức | Headquarters - Trụ sở chính |
| 2 | **Store** | Tổ chức | Cửa hàng/Siêu thị |
| 3 | **Region** | Địa lý | Vùng (cấp cao nhất) |
| 4 | **Zone** | Địa lý | Khu vực trong Region |
| 5 | **Area** | Địa lý | Quận/Huyện trong Zone |
| 6 | **Division** | Tổ chức HQ | Khối (cấp cao nhất tại HQ) |
| 7 | **Department (Dept)** | Tổ chức | Phòng ban |

> **Lưu ý**: Khái niệm "Team" và "Dept" trong thực tế là ngang cấp nhau, chỉ khác cách gọi. Trong app chủ yếu sử dụng thuật ngữ **Dept** và **Div** (Division).

### 2.2 Departments (Phòng ban)

> **Lưu ý**: Đây là cơ cấu phòng ban ban đầu, có thể thay đổi trong quá trình vận hành.

| # | Code | Tên đầy đủ | Phân loại | Ghi chú |
|---|------|------------|-----------|---------|
| 1 | **OP** | Operations | Parent | Vận hành - có 5 divisions con |
| 2 | PERI | Perishable | OP Division | Thực phẩm tươi sống |
| 3 | GRO | Grocery | OP Division | Tạp hóa |
| 4 | Delica | Delicatessen | OP Division | Thực phẩm chế biến |
| 5 | D&D | Dry & Daily | OP Division | Hàng khô |
| 6 | CS | Customer Service | OP Division | Dịch vụ khách hàng |
| 7 | **Admin** | Administration | Parent | Hành chính |
| 8 | MMD | Merchandise Management | Admin Division | Quản lý hàng hóa |
| 9 | ACC | Accounting | Admin Division | Kế toán |
| 10 | **Control** | Control | Department | Kiểm soát |
| 11 | **Improvement** | Improvement | Department | Cải tiến |
| 12 | **Planning** | Planning | Parent | Kế hoạch |
| 13 | MKT | Marketing | Planning Division | Marketing |
| 14 | SPA | Space Allocation | Planning Division | Bố trí không gian |
| 15 | ORD | Ordering | Planning Division | Đặt hàng |
| 16 | **HR** | Human Resources | Department | Nhân sự |

### 2.3 Job Grades (Cấp bậc)

#### Admin System

| Role | Mô tả | Quyền hạn |
|------|-------|-----------|
| **Admin System** | Quản trị viên hệ thống | Full permission cao nhất trong toàn bộ system, quản lý users, cấu hình hệ thống |

#### HQ Grades (G2-G9)

| Grade | Tên | Mô tả |
|-------|-----|-------|
| G9 | GD | General Director - Tổng Giám đốc |
| G8 | CCO | Chief Commercial Officer |
| G7 | Senior General Manager | Quản lý cấp cao |
| G6 | General Manager | Tổng quản lý |
| G5 | Manager | Quản lý |
| G4 | Deputy Manager | Phó quản lý |
| G3 | Executive | Chuyên viên |
| G2 | Officer | Nhân viên |

**Quyền hạn chung:**
- **Tạo task**: Tất cả G2-G9 đều có thể tạo task
- **Duyệt task**: Grade cao hơn duyệt task cho grade thấp hơn thuộc quyền quản lý trực tiếp
- **G9 (GD)**: Không cần cấp trên duyệt vì đã là cấp cao nhất

#### Store Grades (S1-S7)

| Grade | Tên | Mô tả | Quyền hạn chính |
|-------|-----|-------|-----------------|
| S7 | Region Manager | Quản lý vùng | Xem tất cả stores trong Region |
| S6 | Zone Manager | Quản lý khu vực | Xem tất cả stores trong Zone |
| S5 | Area Manager | Quản lý quận | Xem tất cả stores trong Area |
| S4 | SI (Store In-charge) | Phụ trách 2+ stores | Giao việc cho S1, thực hiện task |
| S3 | Store Leader | Quản lý 1 store | Giao việc cho S1, thực hiện task |
| S2 | Deputy Store Leader | Phó Store Leader | Giao việc cho S1, thực hiện task |
| S1 | Staff | Nhân viên cửa hàng | Thực hiện task được giao |

### 2.4 Task Statuses

#### Task Status (Trạng thái tổng thể - HQ View)

| Status | Tên hiển thị | Màu | Điều kiện |
|--------|--------------|-----|-----------|
| `draft` | Draft | Gray | Bản nháp chưa submit |
| `approve` | Approve | Purple | Đang chờ phê duyệt |
| `not_yet` | Not Yet | Yellow | Tất cả stores chưa bắt đầu |
| `on_progress` | On Progress | Green | Có store đang thực hiện |
| `overdue` | Overdue | Red | end_date < today và chưa done |
| `done` | Done | Blue | Tất cả stores hoàn thành |

#### Store Status (Trạng thái từng store)

| Status | Tên hiển thị | Màu | Điều kiện |
|--------|--------------|-----|-----------|
| `not_yet` | Not Yet | Gray | Chưa bắt đầu (default) |
| `on_progress` | On Progress | Blue | Đang thực hiện |
| `done_pending` | Done Pending | Yellow | Hoàn thành, chờ HQ check |
| `done` | Done | Green | HQ đã xác nhận OK |
| `unable` | Unable | Orange | Không thể thực hiện |
| `overdue` | Overdue | Red | Quá hạn (system auto) |

#### HQ Check Status (Trạng thái kiểm tra của HQ)

| Status | Tên hiển thị | Màu | Điều kiện |
|--------|--------------|-----|-----------|
| `not_yet` | Not Yet | Gray | Có store đang chờ check (có done_pending) |
| `done` | Done | Green | Không còn store nào đang done_pending |

### 2.5 Thuật ngữ nghiệp vụ

| # | Thuật ngữ | Giải thích |
|---|-----------|------------|
| 1 | **Library** | Thư viện task mẫu (templates) để dùng lại |
| 2 | **Dispatch** | Gửi template từ Library đến stores |
| 3 | **Cooldown** | Thời gian chờ sau khi dispatch (tránh gửi trùng) |
| 4 | **HQ Check** | HQ xác nhận kết quả thực hiện của store |
| 5 | **Scope** | Phạm vi giao task (Region/Zone/Area/Store) |
| 6 | **Approver** | Người có quyền phê duyệt task |
| 7 | **Evidence** | Bằng chứng hoàn thành (ảnh, tài liệu) |
| 8 | **Task Type** | Loại task: Daily, Weekly, Monthly, Quarterly, Yearly |

---

## 3. YÊU CẦU NGHIỆP VỤ

### 3.1 Flow hiện tại (AS-IS)

| # | Nhân vật | Kịch bản | Vấn đề |
|---|----------|----------|--------|
| 1 | HQ Staff | Gửi yêu cầu (Task) xuống Store qua Email/Zalo hoặc giấy tờ | Không track được, dễ thất lạc |
| 2 | Store Leader | Ghi nhận task bằng bảng Excel hoặc bảng trắng | Khó theo dõi tiến độ |
| 3 | Store Staff | Thực hiện task, báo cáo bằng lời nói/tin nhắn | Không có evidence |
| 4 | HQ Manager | Tổng hợp báo cáo thủ công từ nhiều nguồn | Mất thời gian, dễ sai sót |
| 5 | All | Không có quy trình phê duyệt chuẩn | Task có thể không phù hợp |

### 3.2 Flow mong muốn (TO-BE)

#### 3.2.1 Ba luồng tạo Task

```
┌─────────────────────────────────────────────────────────────────┐
│  THREE CREATION FLOWS                                           │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ FLOW 1: Task HQ → Store                                   │  │
│  │ Entry: Task List > Add New                                │  │
│  │ Receiver: Stores (S1-S7)                                  │  │
│  │ Scope: Region > Zone > Area > Store                       │  │
│  │ After Approve: Gửi Stores + Lưu Library                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ FLOW 2: Template Task                                     │  │
│  │ Entry: Library > Add New                                  │  │
│  │ Receiver: Chọn khi dispatch                               │  │
│  │ Scope: Hidden (chọn khi dispatch)                         │  │
│  │ After Approve: Lưu Library (Available)                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ FLOW 3: Task HQ → HQ                                      │  │
│  │ Entry: To Do Task > Add New                               │  │
│  │ Receiver: HQ Users (cùng Dept/Team)                       │  │
│  │ Scope: Division > Dept > Team > User                      │  │
│  │ After Approve: Gửi HQ Users + Lưu Library                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.2.2 Scenario chi tiết

| # | Level | Nhân vật | Kịch bản | Màn hình liên quan |
|---|-------|----------|----------|-------------------|
| 1 | G2-G9 | HQ Creator | Đăng nhập → Task List → Click "Add New" → Điền thông tin → Chọn Stores → Submit | Login, Task List, Add Task |
| 2 | G3-G9 | HQ Approver | Đăng nhập → Nhận notification → Task List → Add Task (Approval mode) → Review → Approve/Reject | Login, Task List, Add Task |
| 3 | S2-S4 | Store Leader | Đăng nhập → Nhận notification → Task List (Store view) → Task Detail → Assign cho Staff hoặc tự làm | Login, Task List, Task Detail |
| 4 | S1 | Store Staff | Đăng nhập → Nhận notification → Task List (Staff view) → Task Detail → Upload evidence → Mark Done | Login, Task List, Task Detail |
| 5 | G2-G9 | HQ Checker | Đăng nhập → Nhận notification → Task List (HQ Check filter) → Task Detail → Xem evidence → Checked/Reject | Login, Task List, Task Detail |
| 6 | G2-G9 | HQ Creator | Đăng nhập → Library → Click "Add New" → Điền thông tin template → Submit | Login, Library, Add Task |
| 7 | G3-G9 | HQ Approver | Đăng nhập → Nhận notification → Library → Add Task (Approval mode) → Review → Approve → Available | Login, Library, Add Task |
| 8 | G2-G9 | HQ User | Đăng nhập → Library → Chọn template (Available) → Add Task → Chọn Scope → Gửi | Login, Library, Add Task |

---

## 4. PHÂN QUYỀN CHI TIẾT

### 4.1 Matrix phân quyền theo chức năng

```
┌─────────────────────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬───────┬───────┬───────┐
│      Chức năng      │ G9  │ G8  │ G7  │ G6  │ G5  │ G4  │ G3  │ G2  │ S7-S5 │ S4-S2 │  S1   │
├─────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼───────┼───────┼───────┤
│ Tạo Task            │  Y  │  Y  │  Y  │  Y  │  Y  │  Y  │  Y  │  Y  │   -   │   -   │   -   │
│ Duyệt Task [1]      │  Y  │  Y  │  Y  │  Y  │  Y  │  Y  │  Y  │  -  │   -   │   -   │   -   │
│ Xem Task List [2]   │  Y  │  Y  │  Y  │  Y  │  Y  │  Y  │  Y  │  Y  │   Y   │   Y   │   Y   │
│ Giao việc cho S1    │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  -  │   -   │   Y   │   -   │
│ Thực hiện Task [3]  │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  -  │   -   │   Y   │   Y   │
│ HQ Check [4]        │  Y  │  Y  │  Y  │  Y  │  Y  │  Y  │  Y  │  Y  │   -   │   -   │   -   │
│ Override Cooldown[5]│  Y  │  Y  │  Y  │  Y  │  Y  │  Y  │  Y  │  -  │   -   │   -   │   -   │
│ Pause Task [5]      │  Y  │  Y  │  Y  │  Y  │  Y  │  Y  │  Y  │  -  │   -   │   -   │   -   │
└─────────────────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴───────┴───────┴───────┘

Legend: Y = Có quyền | - = Không có quyền

Ghi chú:
  [1] Duyệt task của cấp dưới trực tiếp
  [2] S7-S5: Xem tasks trong scope quản lý (Region/Zone/Area)
      S1: Chỉ xem tasks được assign cho họ
  [3] S1: Chỉ thực hiện tasks được assign cho họ
  [4] Chỉ check được task của dept mình (task do creator thuộc dept mình tạo)
  [5] Chỉ cho task mà mình là approver
```

### 4.2 Logic xác định Approver

```
┌─────────────────────────────────────────────────────────────────┐
│  APPROVER LOOKUP ALGORITHM                                      │
│                                                                 │
│  Cấu trúc tổ chức: Department (lớn) > Division (nhỏ)            │
│  Ví dụ: OP (Department) > PERI, GRO, Delica... (Divisions)      │
│                                                                 │
│  1. Lấy division_id, department_id, job_grade của Creator       │
│  2. Tìm user trong CÙNG DIVISION có job_grade > Creator         │
│     → Nếu tìm thấy: Chọn người có MIN(job_grade) = Approver     │
│  3. Nếu KHÔNG tìm thấy trong Division:                          │
│     → Tìm trong CÙNG DEPARTMENT có job_grade > Creator          │
│     → Nếu tìm thấy: Chọn người có MIN(job_grade) = Approver     │
│  4. FALLBACK: System Admin hoặc designated approval account     │
│                                                                 │
│  VÍ DỤ:                                                         │
│  • G2 (PERI) tạo task, PERI có G3 → Approver = G3               │
│  • G3 (PERI) tạo task, PERI không có G4 → tìm trong OP          │
│    → OP có G5 → Approver = G5                                   │
│  • G5 (OP) tạo task, OP không có G6+ → Fallback System Admin    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. DANH SÁCH MÀN HÌNH

### 5.1 Screen List

> **Screen Code Naming Convention:**
> - `CMN-XXX`: Common/Shared screens (dùng chung cho tất cả modules)
> - `WS-XXX`: WS Module screens (Task from HQ)
> - `DWS-XXX`: DWS Module screens (Dispatch Work Schedule) - *future*
> - `MNL-XXX`: Manual Module screens - *future*
> - `FAQ-XXX`: FAQ Module screens - *future*
> - `QC-XXX`: Check Quality Module screens - *future*
> - `TRN-XXX`: Training Module screens - *future*

| #  | Screen Code | Screen Name | Route             | Platform  | Mô tả                              | Người dùng    |
|----|-------------|-------------|-------------------|-----------|------------------------------------| --------------|
| 1  | CMN-001     | Login       | /auth/signin      | Web + iOS | Đăng nhập hệ thống                 | All           |
| 2  | WS-001      | Task List   | /tasks/list       | Web + iOS | Danh sách task (scope theo role)   | All           |
| 3  | WS-002      | Task Detail | /tasks/detail     | Web + iOS | Chi tiết task, HQ Check, progress  | All           |
| 4  | WS-003      | Add Task    | /tasks/new        | Web       | Tạo/sửa task (3 flows)             | HQ (Creator)  |
| 5  | WS-004      | Library     | /tasks/library    | Web       | Quản lý task templates             | HQ            |
| 6  | WS-005      | To Do Task  | /tasks/todo       | Web       | Task HQ giao cho HQ                | HQ            |
| 7  | WS-006      | User Info   | /tasks/info       | Web       | Quản lý cơ cấu nhân sự (Dept)      | HQ            |
| 8  | WS-007      | Store Info  | /tasks/store-info | Web       | Quản lý cơ cấu stores (Region)     | HQ            |
| 9  | WS-008      | Messages    | /tasks/messages   | Web + iOS | Tin nhắn/comment                   | All           |
| 10 | WS-009      | Report      | /tasks/report     | Web       | Báo cáo thống kê                   | HQ            |

> **Note**:
> - **Platform**: `Web` = HQ Web App (Desktop/Laptop), `iOS` = Store Native iOS App (iPad), `Web + iOS` = cả 2 platforms
> - Route = `-` cho iOS screens vì native app không dùng URL routing
> - **Task List** dùng chung cho HQ và Store, phạm vi hiển thị khác nhau theo role:
>   - HQ: Thấy tất cả tasks của department mình
>   - Store: Chỉ thấy tasks được giao cho store mình
> - **HQ Check** được thực hiện tại **Task Detail** (xem store progress → Checked/Reject), không phải screen riêng.
> - Task chờ duyệt (Approval) được hiển thị tại **Task List** với filter `status = Approve`, không phải screen riêng.
> - Dispatch template được thực hiện tại screen **Add Task** (từ Library chọn template → Add Task → chọn Scope → Submit), không phải screen riêng.

### 5.2 Screen Details Summary

#### WS-001: Task List

| Thành phần | Mô tả |
|------------|-------|
| **Header** | Title, Add New button (HQ only) |
| **Filters** | Department (multi-select), Status (multi-select), Search by name |
| **Table** | No, Dept, Task Group, Task Name, Status, Progress, Unable, HQ Check, Actions |
| **Features** | Expand/collapse sub-tasks, Click status → History modal, 3-dots menu |
| **Pagination** | Page selector, items per page |

**Scope theo Role:**

| Role | Phạm vi hiển thị | Actions khả dụng |
|------|------------------|------------------|
| **HQ** | Tất cả tasks của department mình | Add New, View, Approve/Reject, Pause |
| **Store** | Tasks được giao cho store mình | Start, Complete, Mark Unable, Assign to Staff |

#### WS-002: Task Detail

| Thành phần | Mô tả |
|------------|-------|
| **Header** | Task name, Status badge, Back button |
| **Info Sections** | A.Information, B.Instructions, C.Scope (read-only) |
| **Statistics** | Cards: Not Yet, Done, Unable, Avg Time |
| **Store Progress** | Table: Store name, Status, Assignee, Time, Actions |
| **Comments** | Comment list, Add/Edit/Delete comments |

**Actions theo Role:**

| Role | Actions khả dụng |
|------|------------------|
| **HQ** | View, HQ Check (Checked/Reject), Add Comment |
| **Store** | View evidence, Add Comment |

#### WS-003: Add Task

| Section | Thành phần |
|---------|------------|
| **A. Information** | Task Name, Task Type, Applicable Period (Start-End), RE Time |
| **B. Instructions** | Instruction Type (Image/Document), Manual Link, Note, Photo Guidelines |
| **C. Scope** | Store: Region > Zone > Area > Store; HQ: Division > Dept > Team > User |
| **D. Approval Process** | Auto-display approver info |
| **Actions** | Save as Draft, Submit |

#### WS-004: Library

| Thành phần | Mô tả |
|------------|-------|
| **Header** | Title "Library", Add New button (draft limit check) |
| **Tabs** | Filter theo Category (All, Office, Store) |
| **Dept Filter** | Chips filter theo Department |
| **Search** | Tìm kiếm theo tên template |
| **Task Groups** | Danh sách templates nhóm theo Department, expand/collapse |
| **Table Columns** | No, Type, Task Name, Owner, Last Update, Status, Usage |
| **Row Actions** | Edit, Duplicate, Delete, View Usage, Override Cooldown |

**Status Values:**
- `draft`: Bản nháp chưa submit
- `approve`: Đang chờ duyệt
- `available`: Sẵn sàng dispatch
- `cooldown`: Đang trong thời gian chờ (tránh gửi trùng)

#### WS-005: To Do Task

| Thành phần | Mô tả |
|------------|-------|
| **Week Header** | Week info, navigation arrows, Add New button |
| **Overview Panels** | Overall Week (targets), Last Week Review |
| **Filter Bar** | Filter by user, status, type |
| **Calendar View** | Daily tasks organized by day of week |
| **Manager Comments** | Comment panel từ manager và others |

**Task Display:**
- Tasks HQ→HQ (source=todo_task)
- Scope: Division > Dept > Team > User
- Filter "My Tasks" (created_staff_id)

#### WS-006: User Info

| Thành phần | Mô tả |
|------------|-------|
| **Header** | Title, Add New button |
| **Dept Tabs** | Tabs filter theo Department (Admin, HR, Legal, IT, Finance...) |
| **Hierarchy Tree** | Tree view hiển thị cấu trúc: Dept → Team → Staff |
| **User Cards** | Avatar, Name, Role, Job Grade, Actions |
| **Modals** | Add User, Edit User, Delete confirmation |

**Purpose:** Quản lý cơ cấu nhân sự HQ theo Department

#### WS-007: Store Info

| Thành phần | Mô tả |
|------------|-------|
| **Header** | Title, Add New button |
| **Region Tabs** | Tabs filter theo Region |
| **Hierarchy Tree** | Tree view hiển thị: Region → Zone → Area → Store |
| **Store Cards** | Store name, Address, Manager, Staff count, Actions |
| **Modals** | Add Store, Edit Store, Delete confirmation |

**Purpose:** Quản lý cơ cấu stores theo vùng địa lý

#### WS-008: Messages

| Thành phần | Mô tả |
|------------|-------|
| **Left Sidebar** | Conversation list (groups: All Stores, by Region) |
| **Chat Area** | Header (recipient info), Message list, Input area |
| **Message Types** | Text messages, có thể mở rộng thêm attachments |

**Conversation Groups:**
- All Stores: Broadcast to all
- By Region: Group by geographic region

#### WS-009: Report

| Thành phần | Mô tả |
|------------|-------|
| **Weekly Grid** | Completion rate matrix: Stores × Weeks |
| **Stacked Bar Chart** | Task completion by status over weeks |
| **Dept Filter** | Dropdown filter by Department |
| **Store Table** | Detailed report: Store, completion %, by department |

**Metrics:**
- Completion rate per store per week
- Task status distribution (Done, On Progress, Unable)
- Department-wise breakdown

---

## 6. WORKFLOW DIAGRAMS

### 6.1 Complete Task Status Flow

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│  COMPLETE TASK STATUS FLOW (ADD TASK → DONE)                                               │
│                                                                                            │
│════════════════════════════════════════════════════════════════════════════════════════════│
│  GIAI ĐOẠN 1: TẠO TASK (HQ thao tác)                                                       │
│════════════════════════════════════════════════════════════════════════════════════════════│
│                                                                                            │
│       FLOW 1                     FLOW 2                     FLOW 3                         │
│    (Task HQ→Store)           (Template Task)             (Task HQ→HQ)                      │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐             │
│  │  Button Add New     │    │  Button Add New     │    │  Button Add New     │             │ 
│  │  tại Task List      │    │  tại Library Task   │    │  tại To do Task     │             │
│  └──────────┬──────────┘    └──────────┬──────────┘    └──────────┬──────────┘             │
│             └──────────────────────────┼──────────────────────────┘                        │
│                                        ▼                                                   │
│                          ┌──────────────────────────┐                                      │
│                          │     SCREEN: ADD TASK     │                                      │ 
│                          │  (Cùng 1 screen cho cả   │                                      │
│                          │   3 flows, khác params)  │                                      │
│                          └────────────┬─────────────┘                                      │
│                    ┌──────────────────┼──────────────────┐                                 │
│                    │                  │                  │                                 │
│                 [Cancel]              │            [Save as Draft]                         │ 
│                    ▼                  │                  ▼                                 │
│               (Hủy, không             ▼            ┌───────────┐                           │
│                 tạo task)         [Submit]◄────────│   DRAFT   │◄──────────┐               │ 
│                                       │            └───────────┘           │               │
│                                       ▼                  ▲                 │               │
│                                 ┌───────────┐            │                 │               │
│                                 │  APPROVE  ├─ [Reject] ─┘                 │               │  
│                                 └─────┬─────┘                              │               │
│                                   Approved                                 │               │
│             ┌─────────────────────────┼─────────────────────────┐          │               │
│             ▼                         ▼                         ▼          │               │
│          FLOW 1                    FLOW 2                    FLOW 3        │               │
│      (Task HQ→Store)           (Template Task)            (Task HQ→HQ)     │               │
│             │                         │                         │          │               │
│             │                         ▼                         │          │               │
│             │                   ┌───────────┐                   │          │               │
│             ├─── Lưu Library ──►│ AVAILABLE │◄── Lưu Library ───┤          │               │
│             │                   └─────┬─────┘                   │          │               │  
│             │                     (dispatch)                    │          │               │
│             │                         │                         │          │               │
│             └──────── Gửi Stores ────►┼◄───── Gửi Dep/Team ─────┘          │               │
│                                       │                                    │               │
│                                       ├───► [Pause] ───────────────────────┘               │
│                                       │                                                    │
│═══════════════════════════════════════╪════════════════════════════════════════════════════│
│  GIAI ĐOẠN 2: THỰC HIỆN TASK          │(Store/HQ thực hiện - HQ verify)                    │
│═══════════════════════════════════════╪════════════════════════════════════════════════════│
│                                       ▼                                                    │
│                                ┌─────────────┐                                             │
│                                │   NOT YET   │◄── TASK STATUS (tất cả stores = not_yet)    │
│                                └──────┬──────┘                                             │
│  ┌────────────────────────────────────┼─────────────────────────┬────────────────────┐     │
│  │                                    │                         │     ON PROGRESS    │     │
│  │                                    ▼                         │ (ít nhất 1 store   │     │
│  │                             ┌─────────────┐                  │  đang thực hiện)   │     │
│  │                             │   not_yet   │◄── store status  └────────────────────┤     │
│  │                             └──────┬──────┘                                       │     │
│  │         ┌──────────────────────────┼──────────────────────────┐                   │     │
│  │         ▼                          ▼                          ▼                   │     │
│  │  ┌─────────────┐            ┌─────────────┐            ┌─────────────┐            │     │
│  │  │   unable    │◄───────────┤ on_progress ├───────────►│   overdue   │            │     │
│  │  └─────────────┘            └──────┬──────┘            └──────┬──────┘            │     │
│  │                                ▲   │                          │                   │     │
│  │                 ┌──────────────┘   │                          │                   │     │
│  │                 │                  ▼                          │                   │     │
│  │                 │           ┌─────────────┐                   │                   │     │
│  │                 │           │done_pending │                   │                   │     │
│  │                 │           └──────┬──────┘                   │                   │     │
│  │                 │                  ▼                          │                   │     │
│  │                 │           ┌─────────────┐                   │                   │     │
│  │                 └─ Reject ──┤  HQ CHECK   │                   │                   │     │
│  │                             └──────┬──────┘                   │                   │     │
│  │                                 Checked                       │                   │     │
│  │                                    │                          │                   │     │
│  │                                    ▼                          │                   │     │
│  │                             ┌─────────────┐                   │                   │     │
│  │                             │    done     │                   │                   │     │
│  │                             └──────┬──────┘                   │                   │     │
│  │                                    ▼                          │                   │     │
│  │                        ┌─────────────────────────┐            │                   │     │
│  │                        │ System check conditions │◄───────────┘                   │     │
│  │                        └───────────┬─────────────┘                                │     │
│  └────────────────────────────────────┼──────────────────────────────────────────────┘     │
│                          ┌────────────┴────────────┐                                       │
│                          ▼                         ▼                                       │
│                    Tất cả stores             Có bất kỳ store                               │
│                   = done hoặc unable           = overdue                                   │
│                          │                         │                                       │
│                          ▼                         ▼                                       │
│                     ┌──────────┐              ┌──────────┐                                 │
│                     │   DONE   │              │ OVERDUE  │                                 │
│                     └──────────┘              └──────────┘                                 │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Store Status Transitions

```
┌─────────────────────────────────────────────────────────────────┐
│  STORE STATUS TRANSITIONS                                       │
│                                                                 │
│         ┌──────────┐                                            │
│         │ not_yet  │ ← Default khi task được assign             │
│         └────┬─────┘                                            │
│              │                                                  │
│      ┌───────┴───────┐                                          │
│      │               │                                          │
│      ▼               ▼                                          │
│ ┌───────────┐   ┌──────────┐                                    │
│ │on_progress│──►│  unable  │ ← Không thể làm từ đầu             │
│ └────┬──────┘   └──────────┘   hoặc trong quá trình thực hiện   │
│      │                                                          │
│      │                                                          │
│      │                                                          │
│      ▼                                                          │
│ ┌────────────┐                                                  │
│ │done_pending│ ← Store báo done, chờ HQ check                   │
│ └─────┬──────┘                                                  │
│       │                                                         │
│       ▼                                                         │
│  ┌──────────┐                                                   │
│  │   done   │ ← HQ đã confirm OK                                │
│  └──────────┘                                                   │
│                                                                 │
│  ✅ ALLOWED TRANSITIONS:                                        │
│     • not_yet → on_progress (Bắt đầu làm)                       │
│     • not_yet → unable (Không thể làm ngay từ đầu)              │
│     • on_progress → done_pending (Báo hoàn thành)               │
│     • on_progress → unable (Không thể hoàn thành)               │
│     • done_pending → done (HQ Checked OK)                       │
│     • done_pending → on_progress (HQ Reject)                    │
│                                                                 │
│  ❌ FORBIDDEN TRANSITIONS:                                      │
│     • done → ANY (Đã hoàn thành, không thể đổi)                 │
│     • unable → ANY (Đã kết thúc, không thể đổi)                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 HQ Check Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  HQ CHECK FLOW                                                  │
│                                                                 │
│    Store báo done             HQ CHECK                          │
│    (done_pending)  ───────────►  (kiểm tra evidence)            │
│                                       │                         │
│                          ┌────────────┴────────────┐            │
│                          ▼                         ▼            │
│                    [Checked OK]                 [Reject]        │
│                          │                         │            │
│                          ▼                         ▼            │
│                   done (confirmed)           on_progress        │
│                                              (làm lại)          │
│                                                                 │
│  📌 AUTO CONFIRM:                                               │
│     • Nếu today > end_date mà status = done_pending             │
│     • System tự động chuyển done_pending → done                 │
│     • Lý do: Lỗi HQ không check kịp, store đã hoàn thành        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. BUSINESS RULES

### 7.1 Draft Rules

| Rule                  | Mô tả                                      | Giá trị       |
|-----------------------|--------------------------------------------|---------------|
| Draft Limit           | Số draft tối đa mỗi user mỗi flow          | 5 drafts      |
| Draft Auto-Delete     | Xóa draft nếu không edit trong X ngày      | 30 ngày       |
| Draft Expiry Warning  | Cảnh báo trước khi xóa                     | 5 ngày trước  |

### 7.2 Approval Rules

| Rule                  | Mô tả                                      | Giá trị           |
|-----------------------|--------------------------------------------|-------------------|
| Max Rejections        | Số lần reject tối đa                       | 3 lần             |
| Must Edit After Reject| Phải sửa ít nhất 1 field trước khi submit  | Bắt buộc          |
| After 3 Rejections    | Chỉ có thể xóa task                        | Không submit được |

### 7.3 Library & Dispatch Rules

| Rule                  | Mô tả                                      | Giá trị                |
|-----------------------|--------------------------------------------|------------------------|
| Auto-Save to Library  | Khi task được approve từ task list         | Tự động lưu Library    |
| Cooldown Trigger      | Dispatch cùng template + stores + period   | Kích hoạt cooldown     |
| Cooldown Duration     | Thời gian cooldown                         | start_date → end_date  |
| Override Cooldown     | Ai có quyền phá khóa                       | Approver               |

### 7.4 Overdue Rules

| Rule                  | Mô tả                                      | Giá trị                |
|-----------------------|--------------------------------------------|------------------------|
| Overdue Detection     | Điều kiện xác định overdue                 | end_date < today       |
| Auto Check            | Cơ chế kiểm tra                            | Daily + on-demand      |
| Auto Confirm          | Tự động confirm nếu HQ không check kịp     | done_pending → done    |

### 7.5 Task Type Hierarchy

| Parent Task Type | Child Options Available                    |
|------------------|--------------------------------------------|
| Yearly           | Yearly, Quarterly, Monthly, Weekly, Daily  |
| Quarterly        | Quarterly, Monthly, Weekly, Daily          |
| Monthly          | Monthly, Weekly, Daily                     |
| Weekly           | Weekly, Daily                              |
| Daily            | Daily only                                 |

---

## 8. API ENDPOINTS SUMMARY

### 8.1 Authentication APIs

| #  | Method | Endpoint                                       | Mô tả                       |
|----|--------|------------------------------------------------|-----------------------------|
| 1  | POST   | /api/v1/auth/login                             | Đăng nhập                   |
| 2  | POST   | /api/v1/auth/logout                            | Đăng xuất                   |
| 3  | POST   | /api/v1/auth/refresh                           | Làm mới token               |
| 4  | GET    | /api/v1/auth/me                                | Lấy thông tin user hiện tại |
| 5  | POST   | /api/v1/auth/forgot-password                   | Quên mật khẩu               |
| 6  | POST   | /api/v1/auth/verify-code                       | Xác thực mã OTP             |
| 7  | POST   | /api/v1/auth/reset-password                    | Đặt lại mật khẩu            |

### 8.2 Task Management APIs

| #  | Method | Endpoint                                       | Mô tả                       |
|----|--------|------------------------------------------------|-----------------------------|
| 1  | GET    | /api/v1/tasks                                  | Danh sách tasks             |
| 2  | GET    | /api/v1/tasks/{id}                             | Chi tiết task               |
| 3  | POST   | /api/v1/tasks                                  | Tạo task/draft              |
| 4  | PUT    | /api/v1/tasks/{id}                             | Cập nhật draft              |
| 5  | DELETE | /api/v1/tasks/{id}                             | Xóa draft                   |
| 6  | POST   | /api/v1/tasks/{id}/submit                      | Submit for approval         |
| 7  | POST   | /api/v1/tasks/{id}/approve                     | Approve task                |
| 8  | POST   | /api/v1/tasks/{id}/reject                      | Reject task                 |
| 9  | GET    | /api/v1/tasks/pending-approval                 | Tasks chờ duyệt             |
| 10 | GET    | /api/v1/tasks/{id}/progress                    | Tiến độ task                |
| 11 | GET    | /api/v1/tasks/{id}/history                     | Lịch sử approval            |

### 8.3 Store Execution APIs

| #  | Method | Endpoint                                       | Mô tả                       |
|----|--------|------------------------------------------------|-----------------------------|
| 1  | GET    | /api/v1/stores/{id}/tasks                      | Tasks của store             |
| 2  | GET    | /api/v1/stores/{id}/tasks/my                   | Tasks được assign cho user  |
| 3  | POST   | /api/v1/tasks/{id}/stores/{store_id}/start     | Bắt đầu task                |
| 4  | POST   | /api/v1/tasks/{id}/stores/{store_id}/complete  | Hoàn thành task             |
| 5  | POST   | /api/v1/tasks/{id}/stores/{store_id}/unable    | Đánh dấu unable             |
| 6  | POST   | /api/v1/tasks/{id}/stores/{store_id}/assign    | Giao việc cho staff         |
| 7  | POST   | /api/v1/tasks/{id}/stores/{store_id}/check     | HQ check                    |
| 8  | POST   | /api/v1/tasks/{id}/stores/{store_id}/reject    | HQ reject                   |

### 8.4 Library APIs

| #  | Method | Endpoint                                       | Mô tả                       |
|----|--------|------------------------------------------------|-----------------------------|
| 1  | GET    | /api/v1/library-tasks                          | Danh sách templates         |
| 2  | POST   | /api/v1/library-tasks                          | Tạo template                |
| 3  | PUT    | /api/v1/library-tasks/{id}                     | Cập nhật template           |
| 4  | DELETE | /api/v1/library-tasks/{id}                     | Xóa template                |
| 5  | POST   | /api/v1/library-tasks/{id}/dispatch            | Dispatch to stores          |
| 6  | POST   | /api/v1/library-tasks/{id}/override-cooldown   | Override cooldown           |

### 8.5 Supporting APIs

| #  | Method | Endpoint                                       | Mô tả                       |
|----|--------|------------------------------------------------|-----------------------------|
| 1  | GET    | /api/v1/departments                            | Danh sách departments       |
| 2  | GET    | /api/v1/scope-hierarchy                        | Region/Zone/Area/Store      |
| 3  | GET    | /api/v1/hq-hierarchy                           | Division/Dept/Team          |
| 4  | GET    | /api/v1/staff/{id}/approver                    | Tìm approver của user       |
| 5  | GET    | /api/v1/code-master                            | Task types, categories      |

---

## 9. VALIDATION RULES

### 9.1 Add Task - Save as Draft

| Field                | Validation                                                   |
|----------------------|--------------------------------------------------------------|
| Task Name            | Required, not empty                                          |

### 9.2 Add Task - Submit

| Section              | Field                | Validation                                                   |
|----------------------|----------------------|--------------------------------------------------------------|
| A. Information       | Task Name            | Required                                                     |
| A. Information       | Task Type            | Required                                                     |
| A. Information       | Applicable Period    | Required (Flow 1, 3), Hidden (Flow 2)                        |
| A. Information       | RE Time              | Required                                                     |
| B. Instructions      | Instruction Type     | Required (Image/Document)                                    |
| B. Instructions      | Manual Link          | Required, valid URL                                          |
| B. Instructions      | Note                 | Required if Type=Document                                    |
| B. Instructions      | Photo Guidelines     | Min 1 photo if Type=Image, max 20, JPG/PNG, max 5MB          |
| C. Scope             | Store/HQ Selection   | Required (Flow 1, 3), Hidden (Flow 2)                        |

---

## 10. TEST SCENARIOS

### 10.1 Authentication

| # | Test Case | Kịch bản | Expected |
|---|-----------|----------|----------|
| 1 | Login success | Nhập đúng username/password | Redirect to dashboard |
| 2 | Login fail | Nhập sai password | Hiển thị error message |
| 3 | Logout | Click logout | Redirect to login, token invalid |

### 10.2 Task Creation

| # | Test Case | Kịch bản | Expected |
|---|-----------|----------|----------|
| 1 | Create draft | Điền Task Name, click Save Draft | Task saved với status=draft |
| 2 | Draft limit | Tạo draft thứ 6 | Hiển thị error "Draft limit reached" |
| 3 | Submit task | Điền đầy đủ, click Submit | Task chuyển status=approve |
| 4 | Validation error | Submit thiếu required fields | Hiển thị validation errors |

### 10.3 Approval Flow

| # | Test Case | Kịch bản | Expected |
|---|-----------|----------|----------|
| 1 | Approve task | Approver click Approve | Task status=not_yet, gửi về stores |
| 2 | Reject task | Approver click Reject, nhập reason | Task status=draft, notify creator |
| 3 | Reject 3 times | Reject lần thứ 3 | Task bị khóa, chỉ có thể xóa |

### 10.4 Store Execution

| # | Test Case | Kịch bản | Expected |
|---|-----------|----------|----------|
| 1 | Start task | Store click Start | Store status=on_progress |
| 2 | Complete task | Upload evidence, click Complete | Store status=done_pending |
| 3 | Mark unable | Click Unable, nhập reason | Store status=unable |
| 4 | Assign to staff | S3 assign task cho S1 | S1 thấy task trong My Tasks |

### 10.5 HQ Check

| # | Test Case | Kịch bản | Expected |
|---|-----------|----------|----------|
| 1 | HQ Check OK | HQ click Checked | Store status=done |
| 2 | HQ Reject | HQ click Reject, nhập reason | Store status=on_progress |
| 3 | Auto confirm | Task overdue + done_pending | Store status=done (auto) |

---

## 11. RELATED DOCUMENTS

| Document | Path | Mô tả |
|----------|------|-------|
| Basic Specs | docs/specs/basic/ | Tổng quan từng screen |
| Detail Specs | docs/specs/detail/ | Chi tiết kỹ thuật |
| API Specs | docs/specs/api/ | API contracts |
| Database Design | docs/database/ | Schema design |
| Deployment Guide | docs/06-deployment/ | Hướng dẫn deploy |

---

## 12. CHANGELOG

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-01-26 | 1.0 | Initial requirement document | Claude Code |

---

> **Note**: Tài liệu này được tạo dựa trên thiết kế trong CLAUDE.md và code đã implement. Các thay đổi requirements cần được cập nhật đồng thời vào cả file này và CLAUDE.md.
