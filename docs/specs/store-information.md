# STORE INFORMATION SCREEN SPECIFICATION

**Screen ID:** SCR_STORE_INFO
**Screen Name:** Store Information Screen (Thông tin cửa hàng)

---

## 1. MÔ TẢ CHUNG (General Description)

| STT | Thuộc tính | Giá trị |
|-----|------------|---------|
| 1 | Tên màn hình | Thông tin cửa hàng (Store Information Screen) |
| 2 | Mã màn hình | SCR_STORE_INFO |
| 3 | Đối tượng sử dụng | Nhân viên HQ (Headquarter) có quyền quản lý |
| 4 | Điều hướng truy cập | Từ Sidebar Menu: "User Management" → "Store Information" → Route: `/tasks/store-info` |

**Mục đích:** Màn hình quản lý thông tin cửa hàng theo khu vực địa lý (Regions/Areas), quản lý danh sách stores và nhân viên tại mỗi store.

### Luồng truy cập:

| STT | Bước | Mô tả |
|-----|------|-------|
| 1 | BƯỚC 1 | Từ Sidebar Menu, chọn "User Management" |
| 2 | BƯỚC 2 | Chọn mục con "Store Information" |
| 3 | BƯỚC 3 | Màn hình STORE INFORMATION hiển thị với các tabs khu vực |

---

## 2. MÔ TẢ CHI TIẾT CHỨC NĂNG (Functional Specification)

*Được chia theo thành phần: Header (Title + Actions), Tab Navigation (theo Region), và Content Area (Area/Store hierarchy).*

### A. Khu vực Header

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Page Title | "STORE INFORMATION" | Font bold, màu đen |
| 2 | Subtitle | "Manage hierarchy, team members, and configure data access permissions" | Text màu xám |
| 3 | Permissions Button | Nút "Permissions" với icon region | Button outlined, màu xám |
| 4 | Import Excel Button | Nút "Import Excel" với icon | Button filled, màu hồng/#E5 |

### B. Tab Navigation (Điều hướng theo Region)

*Các tabs hiển thị theo vùng/miền/khu vực, tab active có underline màu hồng.*

| STT | Tab | Mô tả | Ghi chú |
|-----|-----|-------|---------|
| 1 | SMBU (Store) | Tab mặc định - Tổng | Không có icon riêng |
| 2 | OCEAN | Khu vực Ocean | Tab active có underline màu hồng |
| 3 | HA NOI CENTER | Khu vực Hà Nội trung | |
| 4 | ECO PARK | Khu vực Eco Park | |
| 5 | HA DONG | Khu vực Hà Đông | |
| 6 | NGO | Khu vực ... | |

### C. Content Area - Area Section (Khu vực theo vùng)

*Hiển thị danh sách các Area trong Region đã chọn, mỗi Area có thể expand/collapse.*

#### C.1. Area Header Card

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Area Name | Tên khu vực (VD: "Area Hà Nam") | Font bold, chữ in hoa, nền xanh dương |
| 2 | Store Count | Số lượng stores trong area | Icon store + số (VD: "23 Stores") |
| 3 | Expand/Collapse Icon | Icon mũi tên (∨/∧) | Góc phải, click để mở rộng/thu gọn |
| 4 | Background Color | Nền màu xanh dương | Phân biệt với store cards |

#### C.2. Store Card (Card cửa hàng)

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Store Icon | Icon cửa hàng | Icon màu xanh dương |
| 2 | Store Code | Mã cửa hàng (VD: code 1234) | Text nhỏ, màu xám, phía trên tên |
| 3 | Store Name | Tên cửa hàng (VD: "Ocean Park 1") | Font bold |
| 4 | Store Manager | "Tên quản lý cửa hàng" | Icon người + tên (VD: "Hoang Huong Giang") |
| 5 | Staff Count | Số lượng nhân viên | Icon người + số (VD: "Staff: 15") |
| 6 | Expand/Collapse Icon | Icon mũi tên (∨/∧) | Góc phải card |
| 7 | Indent Line | Đường kẻ dọc thể hiện thuộc Area | Màu xám nhạt, bên trái |

### D. Department Cards trong Area

*Mỗi Area chứa các Department cards với icon và màu sắc riêng.*

| STT | Department | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | ZEN PARK | Icon tâm giác/delta | Xanh lá (#4ACAF0) |
| 2 | CONTROL | Icon cái đĩ/gear | Xanh dương (#2196F3) |
| 3 | IMPROVEMENT | Icon con diamond | Tím (#673572) |
| 4 | HR | Icon người | Đỏ (#FF5182) |

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Department Icon | Icon đại diện dept | Màu sắc theo loại department |
| 2 | Department Name | Tên department (VD: "ZEN PARK") | |
| 3 | Expand/Collapse Icon | Icon mũi tên | Góc phải card |
| 4 | Indent Line | Đường kẻ thể hiện hierarchy | Theo tầng Area → Store → Dept |

### E. Store Detail (Khi Expand Store Card)

*Khi expand card store sẽ hiển thị danh sách nhân viên trong store.*

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Staff List | Danh sách nhân viên trong store | Hiển thị theo danh sách |
| 2 | Staff Card | Card thông tin nhân viên | Avatar + Tên + Chức vụ |
| 3 | Staff Avatar | Ảnh đại diện nhân viên | Hình tròn + badge cấp bậc |
| 4 | Staff Name | Tên nhân viên | Font bold |
| 5 | Staff Position | Chức vụ (VD: "Store Manager") | Text xám |
| 6 | Menu (ba chấm) | Menu options cho staff | Edit/Delete options |

### F. Add New Team or Member

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Add Button | Nút "+ Add new Team or Member" | Icon cuối danh sách |
| 2 | Button Style | Dashed border, icon (+) | Màu xám, hover đổi màu hồng |
| 3 | Click Action | Mở popup/modal thêm mới | Thêm Store hoặc staff |

### G. Permissions Modal

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Modal Header | "Permissions" với nút close (X) | Title bold |
| 2 | Store/User Selection | Chọn store hoặc user đã tạo | Dropdown hoặc search |
| 3 | Permission List | Danh sách quyền có thể cấp | Checkbox cho từng quyền |
| 4 | Save Button | Nút lưu cấu hình | Button màu hồng |

### H. Import Excel Function

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Upload Dialog | Dialog chọn file Excel | Chấp nhận .xlsx, .xls |
| 2 | Template Download | Link tải template mẫu | "Download template" |
| 3 | Preview Data | Xem trước dữ liệu | Table preview |
| 4 | Validation | Kiểm tra dữ liệu hợp lệ | Highlight lỗi nếu có |
| 5 | Confirm Import | Xác nhận import dữ liệu | Button "Import" |

---

## 3. VALIDATION RULES

| STT | Rule | Description |
|-----|------|-------------|
| 1 | Store code unique | Mã cửa hàng phải là duy nhất trong hệ thống |
| 2 | Store name required | Tên cửa hàng không được để trống |
| 3 | Area required | Mỗi store phải thuộc một Area |
| 4 | Region required | Mỗi Area phải thuộc một Region |
| 5 | Manager assignment | Mỗi store nên có ít nhất một Store Manager |
| 6 | Excel format | File import phải đúng định dạng template |

---

## 4. API INTEGRATION

| STT | Action | Method | Endpoint | Description |
|-----|--------|--------|----------|-------------|
| 1 | Get Regions | GET | /api/v1/regions | Lấy danh sách regions |
| 2 | Get Areas by Region | GET | /api/v1/regions/{id}/areas | Lấy areas theo region |
| 3 | Get Stores by Area | GET | /api/v1/areas/{id}/stores | Lấy stores theo area |
| 4 | Get Store Detail | GET | /api/v1/stores/{id} | Lấy thông tin chi tiết store |
| 5 | Get Store Staff | GET | /api/v1/stores/{id}/staff | Lấy danh sách nhân viên store |
| 6 | Add Store | POST | /api/v1/stores | Thêm store mới |
| 7 | Update Store | PUT | /api/v1/stores/{id} | Cập nhật thông tin store |
| 8 | Delete Store | DELETE | /api/v1/stores/{id} | Xóa store |
| 9 | Add Staff to Store | POST | /api/v1/stores/{id}/staff | Thêm nhân viên vào store |
| 10 | Import Stores | POST | /api/v1/stores/import | Import stores từ Excel |

---

## 5. UI STATES

| STT | State Type | State | Display |
|-----|------------|-------|---------|
| 1 | Loading | Loading | Skeleton loader cho hierarchy tree |
| 2 | Loading | Expanding area/store | Spinner trong card |
| 3 | Loading | Importing | Progress bar với phần trăm |
| 4 | Empty | No stores in area | "No stores in this area" |
| 5 | Empty | No staff in store | "No staff assigned" |
| 6 | Error | Load failed | Error message với retry button |
| 7 | Error | Import failed | Error details với highlight dòng lỗi |
| 8 | Success | Store added | Toast "Store added successfully" |
| 9 | Success | Import complete | Toast "Import completed: X stores added" |
| 10 | Active | Tab selected | Tab có underline màu hồng |
| 11 | Expanded | Area/Store open | Icon mũi tên xoay lên (∧) |

---

## 6. CÁC KỊCH BẢN TEST (Test Scenarios)

### A. Kiểm thử giao diện (UI/UX Testing)

| STT | Test Case | Kịch bản | Kỳ vọng |
|-----|-----------|----------|---------|
| 1 | Layout check | Mở màn hình Store | Header, tabs, hierarchy hiển thị đúng |
| 2 | Tab navigation | Click các tabs region | Content thay đổi theo tab, underline di chuyển |
| 3 | Expand Area | Click vào area header | Mở rộng hiển thị stores trong area |
| 4 | Expand Store | Click vào store card | Mở rộng hiển thị staff trong store |
| 5 | Icon colors | Xem các department cards | Icon màu sắc đúng theo department |

### B. Kiểm thử chức năng (Functional Testing)

| STT | Test Case | Kịch bản | Kỳ vọng |
|-----|-----------|----------|---------|
| 1 | Add new store | Click "+ Add new" → Nhập thông tin → Save | Store mới xuất hiện trong area |
| 2 | Edit store | Click menu → Edit → Sửa thông tin → Save | Thông tin được cập nhật |
| 3 | Delete store | Click menu → Delete → Xác nhận | Store bị xóa khỏi danh sách |
| 4 | Add staff to store | Expand store → Add staff → Chọn staff → Save | Staff xuất hiện trong store |
| 5 | Import Excel | Chọn file → Import → Confirm | Stores được import thành công |
| 6 | Switch tabs | Click tab OCEAN → Click tab HA NOI CENTER | Data load đúng theo từng region |
| 7 | Set permissions | Click Permissions → Chọn store → Cấp quyền → Save | Quyền được lưu thành công |

---

## 7. COMPONENT STRUCTURE

```
StoreInformationPage/
├── Header/
│   ├── PageTitle
│   ├── Subtitle
│   ├── PermissionsButton
│   └── ImportExcelButton
├── RegionTabs/
│   └── Tab[] (SMBU, OCEAN, HA NOI CENTER, etc.)
├── ContentArea/
│   └── AreaSection[]/
│       ├── AreaHeaderCard/
│       │   ├── AreaName
│       │   ├── StoreCount
│       │   └── ExpandIcon
│       └── StoreCard[]/
│           ├── StoreIcon
│           ├── StoreCode
│           ├── StoreName
│           ├── ManagerInfo
│           ├── StaffCount
│           ├── ExpandIcon
│           └── StaffList[] (when expanded)/
│               ├── StaffCard
│               └── AddStaffButton
├── AddNewButton
├── PermissionsModal
└── ImportExcelModal
```

---

## 8. COLOR SCHEME

| Element | Color | Hex Code |
|---------|-------|----------|
| Active Tab Underline | Pink | #C5055B |
| Area Header Background | Light Blue | #E3F2FD |
| Store Icon | Blue | #2196F3 |
| ZEN PARK Department | Teal | #4ACAF0 |
| CONTROL Department | Blue | #2196F3 |
| IMPROVEMENT Department | Purple | #673572 |
| HR Department | Red | #FF5182 |
| Inactive Text | Gray | #6B6B6B |
| Border Color | Light Gray | #9B9B9B |
| Primary Button | Pink | #C5055B |

---

## 9. CONNECTOR LINES

*Đường kẻ liên kết (connector lines) giữa các thẻ trong hierarchy tree*

| Component | Position | Description |
|-----------|----------|-------------|
| Area → Store | Left indent | Đường dọc + ngang nối từ Area xuống Store |
| Store → Staff | Left indent | Đường dọc + ngang nối từ Store xuống Staff |

---

## CHANGELOG

| Date | Change |
|------|--------|
| 2026-01-02 | Initial specification created |
| 2026-01-02 | Implemented Store Information screen with all components |
| 2026-01-02 | Updated navigation route from `/users/store-info` to `/tasks/store-info` |
| 2026-01-02 | Updated icons: Permissions button (user+gear), Import Excel button (file+arrow), Staff icon |
| 2026-01-02 | Fixed badge G3 positioning near avatar |
