# ĐẶC TẢ MÀN HÌNH USER INFORMATION (SCR_USER_INFO)

---

## 1. MÔ TẢ CHUNG (General Description)

| STT | Thuộc tính | Giá trị |
|-----|------------|---------|
| 1 | Tên màn hình | Thông tin người dùng (User Information Screen) |
| 2 | Mã màn hình | SCR_USER_INFO |
| 3 | Đối tượng sử dụng | Nhân viên HQ (Headquarter) có quyền quản lý |
| 4 | Điểm truy cập | Từ Sidebar Menu: "User Management" > "User Information" |

*Mục đích: Màn hình quản lý và theo dõi danh sách người dùng (Hierarchy), quản lý Team members và các màn hình quản lý khác của tổ chức.*

---

## 2. CẤP BẬC CHỨC DANH (Office Title)

*Hệ thống phân cấp chức danh từ thấp đến cao trong tổ chức.*

| STT | Mã | Chức danh (Title) |
|-----|-----|-------------------|
| 1 | G1 | Officer | Nhân viên |
| 2 | G3 | Executive | Chuyên viên |
| 3 | G4 | Deputy Manager | Phó quản lý |
| 4 | G5 | Manager | Quản lý |
| 5 | G6 | General Manager | Tổng quản lý |
| 6 | G7 | Senior General Manager | Tổng quản lý cấp cao |
| 7 | G8 | CCO | Chief Commercial Officer |

---

## 3. MÔ TẢ CHI TIẾT CHỨC NĂNG (Functional Specification)

*Giao diện chứa thành Header (Title + Actions), Tab Navigation, và Content Area (Hierarchy Tree).*

### A. Khu vực Header

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Page Title | "USER INFORMATION" | Font lớn, bold, màu đen |
| 2 | Subtitle | "Team members..." | Text màu xám |
| 3 | Permissions Button | Nút "Permissions" với icon | Button outlined, màu xám |
| 4 | Import Excel Button | Nút "Import Excel" với icon | Button filled, màu hồng/đỏ |

### B. Tab Navigation (Hiệu điều hướng phòng ban)

*Các tab hiển thị cho theo phòng ban, tab active có underline màu hồng.*

| STT | Tab | Mô tả | Icon |
|-----|-----|-------|------|
| 1 | Deputy Manager (Head Office) | Tab mặc định - Văn phòng chính | Không có icon riêng |
| 2 | Admin | Phòng hành chính | Icon tùy |
| 3 | OP | Phòng vận hành | Icon vàng |
| 4 | GP | Phòng lập trình | Icon xanh lá |
| 5 | CONTROL | Phòng kiểm soát | Icon xanh dương |
| 6 | IMPROVEMENT | Phòng cải tiến | Icon cam |
| 7 | HR | Phòng Nhân sự | Icon xám |
| 8 | MG | Phòng Quản trị | Không có icon riêng |

### C. Content Area - Tab Deputy Manager (Head Office)

*Nội dung khu vực chính hiển thị cây phòng với khả năng expand/collapse.*

#### C.1. Root Card Node (Người đứng đầu)

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Avatar | Ảnh đại diện người dùng | Hình tròn |
| 2 | Badge | Badge hiển thị cấp bậc (VD: G5) | - |
| 3 | Title Badge | - | Nền xanh lá, text trắng |
| 4 | User Name | "VP/GĐ Ngọc ..." | Tên người dùng |
| 5 | Position | Chức danh + Title (VD: G4 - General Manager) | - |
| 6 | Menu (ba chấm) | Popup menu với các actions | Click hiển thị popup |
| 7 | 5.1 | - Edir division | Chỉnh sửa phòng ban | Icon bút chỉ màu hồng |
| 8 | 5.2 | - Delete division | Xóa division/user | Icon thùng rác màu hồng |

#### C.2. Department Card (Card phòng ban)

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Department Icon | Icon đại diện phòng ban | Màu sắc khác nhau theo phòng ban |
| 2 | Department Name | Tên phòng ban (VD: "Admin", "GP") | Font bold |
| 3 | Member Count | Số lượng thành viên (VD: "1 Member", "3 Members") | Text màu xám |
| 4 | Title Range | Phạm vi cấp bậc | Text màu xám, sau dấu Bullet |
| 5 | Expand/Collapse Icon | Icon mũi tên để mở/đóng | Góc phải card |

#### C.3. Department tree Colors

| STT | Phòng | Icon | Ghi chú |
|-----|-------|------|---------|
| 1 | ADMIN | Icon người/nhóm | Icon #84C7FE |
| 2 | GP | - | Xanh lá (WACASO) |
| 3 | CONTROL | Icon điều khiển | Xanh dương #185FFF |
| 4 | IMPROVEMENT | Icon cải tiến, đồng hồ | Màu cam (#F57C22) |
| 5 | MD | Icon vàng/mới/brown | Vàng/Cam (#FF9800) |

### D. Content Area - Tab Department (VD: Admin)

*Nội dung khi mở tab phòng ban, hiển thị danh sách các card bao gồm của phòng Department Head và các Team đã được thiết lập.*

#### D.1. Department Head Card

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Department Head Card | Card người đứng đầu phòng ban | VD: Đỗ Thị Kim Quyên |
| 2 | Head Avatar | Ảnh đại diện + Badge | Badge màu xanh lá |
| 3 | Head Name | Tên người đứng đầu | Font bold |
| 4 | Head Position | Chức vụ + Title | "Head of Dept - Deputy Manager" |
| 5 | Menu (ba chấm) | Popup menu với các actions | Góc phải card |

#### D.2. Team Card (Card nhóm trong phòng ban)

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Team Card Container | Card chứa thông tin Team | Border xanh dương khi expanded |
| 2 | Team Icon | Icon đại diện team | Màu tím/xanh, đại loại team |
| 3 | Team Name | Tên team (VD: "Account", "Account Executive") | Font bold, màu xanh dương |
| 4 | Member Count | Số thành viên (VD: "2 Members", "1 Member") | Text màu xám |
| 5 | Title Range | Phạm vi cấp bậc (VD: G3 - G4) | Text màu xám |
| 6 | Expand/Collapse | Mũi tên mở/đóng | Góc phải, xoay khi expanded |
| 7 | Indent Line | Đường kẻ thể hiện cấu trúc cây | Màu xám, bên trái card |

#### D.3. Member Card (Card thành viên trong Team)

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Member Avatar | Ảnh đại diện thành viên | Hình tròn |
| 2 | Badge | Badge cấp bậc (VD: G3, G4) | Nền xanh lá, góc dưới avatar |
| 3 | Member Name | Tên thành viên | VD: "Nguyễn Thị Hiền", Font bold |
| 4 | Member Position | Chức vụ | "Team Lead", "Account Executive" |
| 5 | Menu (ba chấm) | Popup menu với các actions | Góc phải card |
| 6 | Indent Line | Đường kẻ dọc + ngang thể hiện cấu trúc cây | Màu xám, đường L shape |
| 7 | Click Action | Click vào card để mở chi tiết | Vùng Cam/Xanh là vùng click được |

### D.4. Employee Detail Modal (Popup thông tin nhân viên)

*Khi click vào member card, hiển thị popup modal với thông tin chi tiết của nhân viên đó.*

#### D.4.1. Modal Header

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Modal Container | Popup với nền trắng | Overlay tối 50% phía sau |
| 2 | Close Button | Nút (X) đóng popup | Góc phải trên |
| 3 | Avatar | Ảnh đại diện nhân viên | Hình tròn, bên trái |
| 4 | Employee Name | Tên nhân viên (VD: "Nguyễn Thị Huệ") | Font bold, lớn |
| 5 | Position | Chức vụ (VD: "Team Lead") | Text màu xám, dưới tên |
| 6 | Status Badge | Trạng thái (VD: "Active") | Badge màu xanh lá |
| 7 | Phone | Email nhân viên | Icon + số điện thoại (VD: +84 968 488 238) |

#### D.4.2. Employee Information (Thông tin chi tiết nhân viên)

| STT | Field | Mô tả | Ghi chú |
|-----|-------|-------|---------|
| 1 | SAP CODE | Mã SAP | VD: "00279857" |
| 2 | LINE MANAGER | Quản lý trực tiếp | Avatar + Tên + Mã (VD: Đỗ Thị Kim Quyên - 00283407) |
| 3 | JOB GRADE | Cấp bậc công việc | VD: "G5 - Senior", text màu hồng |
| 4 | JOINING DATE | Ngày vào công ty | VD: "17 Aug, 2017", format DD MMM, YYYY |

#### D.4.3. Organization Detail (Thông tin tổ chức)

| STT | Field | Mô tả | Ghi chú |
|-----|-------|-------|---------|
| 1 | DIVISION | Khối | VD: "SMMH (Head Office)" |
| 2 | DEPARTMENT | Phòng ban | VD: "Account Team" |
| 3 | SECTION | Bộ phận | - |
| 4 | DEPARTMENT (Location) | Chi nhánh/Địa điểm | VD: "Ha Noi, ..." |

### E. Add New Team or Member

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Add Button | Nút "+ Add new member" | Nằm cuối danh sách hierarchy |
| 2 | Button Style | Dashed border, icon (+) | Màu xám, hover đổi màu background |
| 3 | Click Action | Mở form/modal thêm mới | Cả thêm Team hoặc Member |

### E.1. Add New Division Popup Menu

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | + Add new division | Thêm division/phòng | Icon màu hồng |
| 2 | Edit division | Chỉnh sửa division hiện tại | Icon bút chỉ màu hồng |
| 3 | Delete division | Xóa division | Icon thùng rác màu hồng |

### F. Permissions Modal

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Modal Header | "Permissions" với nền trắng | Title bold |
| 2 | User/Role Selection | Chọn user hoặc role để phân quyền | Dropdown hoặc search |
| 3 | Permission List | Danh sách quyền có thể cấp | Checkboxes cho từng quyền |
| 4 | Save Button | Nút lưu cấu hình | Button màu hồng |

### G. Import Excel Function

| STT | Thành phần | Mô tả | Ghi chú |
|-----|------------|-------|---------|
| 1 | Upload Dialog | Drag-drop hoặc file picker | Chấp nhận xlsx, xls |
| 2 | Template Download | Link tải template mẫu | "Download template" |
| 3 | Preview Data | Xem trước dữ liệu | Table preview |
| 4 | Confirm Import | Nút xác nhận import dữ liệu | Button "Import" |

---

## 4. API INTEGRATION

| STT | Action | Method | Endpoint | Description |
|-----|--------|--------|----------|-------------|
| 1 | Get Hierarchy | GET | /api/v1/users/hierarchy | Lấy cấu trúc phân cấp |
| 2 | Get Department | GET | /api/v1/departments/{id} | Lấy thông tin phòng ban |
| 3 | Get Members | GET | /api/v1/departments/{id}/members | Lấy danh sách thành viên phòng ban |
| 4 | Get Employee Detail | GET | /api/v1/users/{id} | Lấy thông tin chi tiết nhân viên |
| 5 | Add User | POST | /api/v1/users | Thêm người dùng mới |
| 6 | Update User | PUT | /api/v1/users/{id} | Cập nhật thông tin người dùng |
| 7 | Delete User | DELETE | /api/v1/users/{id} | Xóa người dùng |
| 8 | Import Users | POST | /api/v1/users/import | Import danh sách từ Excel |

---

## 5. CÁC KỊCH BẢN TEST (Test Scenarios)

| STT | Kịch bản | Mô tả | Kỳ vọng |
|-----|----------|-------|---------|
| 1 | Click tab | Click vào tabs khác phòng | Content thay đổi theo tab |
| 2 | Test navigation | Click vào department | Hiển thị các members |
| 3 | Expand/Collapse | Click vào mũi tên expand | Mở rộng/thu gọn nội dung |
| 4 | View employee detail | Click vào member card | Modal hiển thị đầy đủ thông tin nhân viên |
| 5 | Add new member | Click "+ Add new" và điền thông tin | Member mới xuất hiện |
| 6 | Edit user | Click menu → Edit và sửa thông tin | Thông tin được cập nhật |
| 7 | Delete user | Click menu → Delete và xác nhận | User bị xóa khỏi hierarchy |
| 8 | Import Excel | Click Import Excel và upload file | Users được thêm thành công |

---

## 6. FILE STRUCTURE

```
frontend/src/
├── app/
│   └── users/
│       ├── layout.tsx
│       └── info/
│           └── page.tsx
├── components/
│   └── users/
│       ├── index.ts
│       ├── UserInfoHeader.tsx
│       ├── DepartmentTabs.tsx
│       ├── HierarchyTree.tsx
│       ├── RootUserCard.tsx
│       ├── DepartmentCard.tsx
│       ├── DepartmentHeadCard.tsx
│       ├── DepartmentDetailView.tsx
│       ├── TeamCard.tsx
│       ├── MemberCard.tsx
│       ├── AddMemberButton.tsx
│       ├── EmployeeDetailModal.tsx (TODO)
│       ├── PermissionsModal.tsx (TODO)
│       └── ImportExcelModal.tsx (TODO)
├── types/
│   └── userInfo.ts
└── data/
    └── mockUserInfo.ts
```

---

## 7. JOB GRADE COLORS

| Grade | Color | Description |
|-------|-------|-------------|
| G1 | #9CA3AF | Gray |
| G2 | #81AADB | Light Blue |
| G3 | #22A6A1 | Teal/Green |
| G4 | #1F7BF2 | Blue |
| G5 | #8B5CF6 | Purple |
| G6 | #FF9900 | Orange |
| G7 | #DC2626 | Red |
| G8 | #991B1B | Dark Red |

---

## 8. DEPARTMENT ICONS

*Các department sử dụng inline SVG icons trong component DepartmentCard.tsx để tối ưu performance và hỗ trợ dynamic colors*

| Department | Icon Name | Color | ViewBox |
|------------|-----------|-------|---------|
| Admin | `admin` | #233D62 | 0 0 18 20 |
| OP | `op` | #0D9488 | 0 0 20 21 |
| CONTROL | `control` | #7C3AED | 0 0 22 22 |
| IMPROVEMENT | `improvement` | #2563EB | 0 0 22 22 |
| HR | `hr` | #E11D48 | 0 0 18 13 |
| MD | `md` | #D97706 | 0 0 20 18 |

**Lợi ích của inline SVG:**
- Không cần HTTP request riêng cho mỗi icon
- Render nhanh hơn (không đợi load file)
- Thay đổi màu động qua props `fill={color}`
- Không phụ thuộc vào thư mục `/public/icons/`

---

## 9. CONNECTOR LINES

*Đường kẻ liên kết (connector lines) giữa các thẻ trong hierarchy tree*

| Component | Connector Position | Calculation |
|-----------|-------------------|-------------|
| HierarchyTree → DepartmentCard | `top-[50px]` | pt-4(16px) + p-4(16px) + half h-9(18px) |
| DepartmentDetailView → TeamCard | `top-[48px]` | pt-4(16px) + py-3(12px) + half h-10(20px) |
| TeamCard → MemberCard | `top-[40px]` | pt-3(12px) + py-2(8px) + half h-10(20px) |

---

## CHANGELOG

| Date | Change |
|------|--------|
| 2026-01-02 | Initial specification created |
| 2026-01-02 | Added Department Detail View with TeamCard, MemberCard, DepartmentHeadCard components |
| 2026-01-02 | Updated department icons to use SVG files from /public/icons/ |
| 2026-01-02 | Fixed connector line positions to align with card centers |
| 2026-01-02 | Converted department icons from SVG files to inline SVG for better performance |
| 2026-01-02 | Updated Admin and OP icons with new SVG designs from Figma |
| 2026-01-02 | Fixed tab colors: inactive tabs now display gray text |
