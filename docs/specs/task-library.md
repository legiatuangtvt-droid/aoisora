# TASK LIBRARY SCREEN SPECIFICATION (SCR_TASK_LIBRARY)

---

## 1. GENERAL DESCRIPTION

| STT | Attribute | Value |
|-----|-----------|-------|
| 1 | Screen Name | Task Library Screen |
| 2 | Screen Code | SCR_TASK_LIBRARY |
| 3 | Target Users | HQ (Headquarter) Staff |
| 4 | Access Point | From Sidebar Menu: "Task Library" |

*Purpose: Admin manages and organizes common task templates for recurring tasks for office and store operations. Cho phep tao, chinh sua va xoa cac task templates.*

### Access Flow:

| Step | Action |
|------|--------|
| 1 | From Sidebar Menu, select "Task Library" |
| 2 | Screen displays with 2 tabs: OFFICE TASKS and STORE TASKS |

---

## 2. FUNCTIONAL SPECIFICATION

*Giao dien chia thanh: Header (Title + Actions), Tab Navigation, Filter Bar, and Content Area (Task Groups).*

### A. Page Header

| STT | Component | Description | Notes |
|-----|-----------|-------------|-------|
| 1 | Page Title | "TASK LIBRARY" | Font 16m, bold, color black |
| 2 | Subtitle | "Manage and organize recurring tasks for office and store operations." | Text mau xam |
| 3 | Create New Document | Button "+ Create New" | Button filled, mau hong/do, goc phai |

### B. Tab Navigation (Dieu huong loai Task)

*Phan loai task theo doi tuong su dung: Office (van phong) hoac Store (cua hang).*

| STT | Tab | Icon | Description |
|-----|-----|------|-------------|
| 1 | OFFICE TASKS | Icon toa nha/building | Tasks danh cho nhan vien van phong (HQ) |
| 2 | STORE TASKS | Icon cua hang/store | Tasks danh cho nhan vien cua hang |

*Tab active co underline mau hong va text mau hong.*

### C. Department Filter Chips

*Loc task nhanh theo phong ban, hien thi duong chips/buttons.*

| STT | Chip | Icon | Description |
|-----|------|------|-------------|
| 1 | Admin | Icon nguoi/admin | Loc tasks cua phong Admin |
| 2 | HR | Icon nhan nguoi | Loc tasks cua phong HR |
| 3 | Legal | - | Loc tasks cua phong Legal |

*Chip active co nen mau hong nhat, mau hong. Co the chon dong thoi nhieu chip.*

### D. Search & Filter Bar

| STT | Component | Type | Description |
|-----|-----------|------|-------------|
| 1 | Search Input | Text input | Placeholder: "Search in task library..." |
| 2 | Search Icon | Icon kinh lup | Ben trai input |
| 3 | Filter Button | Button | Nut "Filter" voi icon pheu, goc phai |

### E. Task Group Section (Nhom cong viec)

*Moi department co mot section chua danh sach tasks, co the Expand/Collapse*

#### E.1. Task Group Header

| STT | Component | Description | Notes |
|-----|-----------|-------------|-------|
| 1 | Department Icon | Icon phong ban | Mau sac theo department |
| 2 | Department Name | Ten phong ban + "TASKS" | VD: "ADMIN TASKS", Font bold |
| 3 | Group Tasks Count | So luong group tasks | Badge "X GROUP TASKS" goc phai |
| 4 | Expand/Collapse Icon | Icon mui ten (V/A) | Goc phai, click de toggle |

#### E.2. Task Data Table (Bang du lieu)

| STT | Column | Description | Notes |
|-----|--------|-------------|-------|
| 1 | No | So thu tu | Danh so tang dan |
| 2 | Type | Loai task | Daily, Weekly, Ad hoc - co icon sort (^) |
| 3 | Task Name | Ten cong viec | VD: "Opening Store", "Check SS" - co icon sort |
| 4 | Owner | Nguoi so huu/tao task | Avatar + Ten (VD: Thu OP, Nguyen GD) |
| 5 | Last Update | Ngay cap nhat cuoi | Format: DD MMM, YY (VD: 25 Dec, 25) |
| 6 | Status | Trang thai | Badge mau: In progress (vang), Draft (xanh duong), Available (xanh la) |
| 7 | Usage | Le so su dung | VD (VD: 565, 52, 1) |
| 8 | Menu (ba cham) | Menu actions | Edit, Delete, Duplicate options |

### F. Task Types (Loai cong viec)

| STT | Type | Icon | Description |
|-----|------|------|-------------|
| 1 | Daily | - | Cong viec hang ngay | Opening Store, Closing Store |
| 2 | Weekly | - | Cong viec hang tuan | Check SS, Weekly Report |
| 3 | Ad hoc | - | Cong viec dot xuat | Report competitor, Special tasks |

### G. Status Types (Trang thai)

| STT | Status | Color | Description |
|-----|--------|-------|-------------|
| 1 | In progress | Vang/Orange (#FFC107) | Task dang duoc su dung |
| 2 | Draft | Xanh (#E91E63) | Task o trang thai nhap |
| 3 | Available | Xanh la (#4CAF50) | Task da san sang |

### H. Department Task Groups

*Danh sach nhom task theo phong ban voi cac group sau:*

| STT | Department | Icon | Color |
|-----|------------|------|-------|
| 1 | ADMIN TASKS | Icon nguoi/admin | Hong (#E91E63) |
| 2 | HR | Icon nhan nguoi | Tim (#9C27B0) |
| 3 | Create New group | Xanh la (#4CAF50) | Xanh la (#4CAF50) |

### I. Create New Document

| STT | Component | Description | Notes |
|-----|-----------|-------------|-------|
| 1 | Button Label | "+ Create New" | Icon (+) truoc text |
| 2 | Button Style | Filled button, mau | Hover: mau dam hon |
| 3 | Click Action | Mo form tao task | Navigate den man hinh tao moi |

### J. Row Actions Menu (Menu ba cham)

*Menu kien thi khi click vao icon ba cham o moi row*

| STT | Action | Icon | Description |
|-----|--------|------|-------------|
| 1 | Edit | Icon but chi | Chinh sua task template |
| 2 | Duplicate | Icon copy | Tao ban sao task template |
| 3 | Delete | Icon thung rac | Xoa task template |
| 4 | View Usage | Icon bieu do | Xem thong ke su dung |

---

## 3. VALIDATION RULES

| STT | Rule | Description |
|-----|------|-------------|
| 1 | Task name required | Ten task khong duoc de trong |
| 2 | Task name unique | Ten task phai la duy nhat trong cung department |
| 3 | Type required | Phai chon loai task (Daily/Weekly/Ad hoc) |
| 4 | Owner required | Phai co nguoi so huu task |
| 5 | Department required | Task phai thuoc mot department |
| 6 | Search min length | Tim kiem yeu cau toi thieu 2 ky tu |

---

## 4. API INTEGRATION

| STT | Action | Method | Endpoint | Description |
|-----|--------|--------|----------|-------------|
| 1 | Get Task Library | GET | /api/v1/task-library | Lay danh sach task templates |
| 2 | Get by Department | GET | /api/v1/task-library?dept={id} | Lay tasks theo department |
| 3 | Get Task Detail | GET | /api/v1/task-library/{id} | Lay chi tiet task template |
| 4 | Create Task | POST | /api/v1/task-library | Tao task template moi |
| 5 | Update Task | PUT | /api/v1/task-library/{id} | Cap nhat task template |
| 6 | Delete Task | DELETE | /api/v1/task-library/{id} | Xoa task template |
| 7 | Duplicate Task | POST | /api/v1/task-library/{id}/duplicate | Tao ban sao task |
| 8 | Search Tasks | GET | /api/v1/task-library/search?q={query} | Tim kiem tasks |
| 9 | Get Usage Stats | GET | /api/v1/task-library/{id}/stats | Lay thong ke su dung |

---

## 5. UI STATES

| STT | State Type | State | Display |
|-----|------------|-------|---------|
| 1 | Loading | Initial load | Skeleton loader cho bang |
| 2 | Loading | Searching | Spinner trong search input |
| 3 | Loading | Deleting | Spinner tren row dang xoa |
| 4 | Empty | No tasks | "No tasks found in this department" |
| 5 | Empty | Search no results | "No matching tasks found" |
| 6 | Error | Load failed | Error message voi retry button |
| 7 | Error | Delete failed | Toast error message |
| 8 | Success | Task created | Toast "Task template created successfully" |
| 9 | Success | Task deleted | Toast "Task template deleted" |
| 10 | Active | Tab selected | Tab co underline mau hong |
| 11 | Active | Chip selected | Chip co nen mau hong nhat |
| 12 | Expanded | Group open | Icon mui ten xoay len (A) |
| 13 | Collapsed | Group closed | Icon mui ten xoay xuong (V) |

---

## 6. TEST SCENARIOS

### A. UI/UX Testing (Kiem thu giao dien)

| STT | Test Case | Scenario | Expected |
|-----|-----------|----------|----------|
| 1 | Layout check | Mo man hinh Task Library | Header, tabs, filter, table hien thi dung |
| 2 | Tab switch | Click tab STORE TASKS | Noi dung thay doi, underline di chuyen |
| 3 | Chip filter | Click chip "Admin" | Chi active, bang filter theo Admin |
| 4 | Expand/Collapse | Click vao group header | Toggle hien thi/an bang |
| 5 | Status colors | Xem cac status badges | Mau sac dung: vang, xanh duong, xanh la |
| 6 | Sort columns | Click vao header Type, Task Name | Bang sap xep theo cot |

### B. Functional Testing (Kiem thu chuc nang)

| STT | Test Case | Scenario | Expected |
|-----|-----------|----------|----------|
| 1 | Search task | Nhap "Opening" vao search | Ket qua filter dung tasks co "Opening" |
| 2 | Search no result | Nhap text khong tim thay | Hien thi "No matching tasks found" |
| 3 | Create task | Click "+ Create New Document" | Navigate den form tao moi |
| 4 | Edit task | Click menu -> Edit | Mo form edit task template |
| 5 | Delete task | Click menu -> Delete -> Confirm | Task bi xoa, toast success |
| 6 | Duplicate task | Click menu -> Duplicate | Task moi duoc tao voi ten "(Copy)" |
| 7 | Filter by chip | Click chip Admin | Chi hien thi tasks cua Admin |
| 8 | Multi-chip filter | Click chip Admin + HR | Bang hien thi tasks cua ca Admin va HR |

---

## 7. FILE STRUCTURE

```
frontend/src/
├── app/
│   └── tasks/
│       └── library/
│           └── page.tsx
├── components/
│   └── library/
│       ├── index.ts
│       ├── TaskLibraryHeader.tsx
│       ├── TaskLibraryTabs.tsx
│       ├── DepartmentFilterChips.tsx
│       ├── TaskSearchBar.tsx
│       ├── TaskGroupSection.tsx
│       ├── TaskDataTable.tsx
│       ├── TaskStatusBadge.tsx
│       └── TaskRowActions.tsx
├── types/
│   └── taskLibrary.ts
└── data/
    └── mockTaskLibrary.ts
```

---

## CHANGELOG

| Date | Change |
|------|--------|
| 2026-01-02 | Initial specification created |
| 2026-01-02 | Implemented UI: route /tasks/library, all components created, sidebar menu highlight fix |
