# USER INFORMATION SCREEN SPECIFICATION (SCR_USER_INFO)

---

## 1. GENERAL DESCRIPTION

| # | Attribute | Value |
|---|-----------|-------|
| 1 | Screen Name | User Information Screen |
| 2 | Screen ID | SCR_USER_INFO |
| 3 | Target Users | HQ (Headquarter) staff with management permissions |
| 4 | Access Point | From Sidebar Menu: "User Management" > "User Information" |

*Purpose: Screen for managing and tracking user lists (Hierarchy), managing Team members and other organization management screens.*

---

## 2. JOB GRADES (Office Title)

*Hierarchical job title system from lowest to highest in organization.*

| # | Code | Title | Description |
|---|------|-------|-------------|
| 1 | G1 | Officer | Staff level |
| 2 | G3 | Executive | Specialist level |
| 3 | G4 | Deputy Manager | Deputy manager level |
| 4 | G5 | Manager | Manager level |
| 5 | G6 | General Manager | General manager level |
| 6 | G7 | Senior General Manager | Senior general manager level |
| 7 | G8 | CCO | Chief Commercial Officer |

---

## 3. FUNCTIONAL SPECIFICATION

*Interface contains Header (Title + Actions), Tab Navigation, and Content Area (Hierarchy Tree).*

### A. Header Section

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Page Title | "USER INFORMATION" | Large font, bold, black color |
| 2 | Subtitle | "Team members..." | Gray text |
| 3 | Permissions Button | "Permissions" button with icon | Outlined button, gray color |
| 4 | Import Excel Button | "Import Excel" button with icon | Filled button, pink/red color |

### B. Tab Navigation (Department Navigation)

*Tabs display by department, active tab has pink underline.*

| # | Tab | Description | Icon |
|---|-----|-------------|------|
| 1 | Deputy Manager (Head Office) | Default tab - Main office | No specific icon |
| 2 | Admin | Administration department | Custom icon |
| 3 | OP | Operations department | Yellow icon |
| 4 | GP | Programming department | Green icon |
| 5 | CONTROL | Control department | Blue icon |
| 6 | IMPROVEMENT | Improvement department | Orange icon |
| 7 | HR | Human Resources department | Gray icon |
| 8 | MG | Management department | No specific icon |

### C. Content Area - Deputy Manager (Head Office) Tab

*Main content area displays department tree with expand/collapse capability.*

#### C.1. Root Card Node (Head of Organization)

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Avatar | User profile picture | Circular |
| 2 | Badge | Badge showing grade level (e.g., G5) | - |
| 3 | Title Badge | - | Green background, white text |
| 4 | User Name | "VP/Director Name ..." | User's name |
| 5 | Position | Title + Grade (e.g., G4 - General Manager) | - |
| 6 | Menu (three dots) | Popup menu with actions | Click displays popup |
| 7 | 5.1 | - Edit division | Edit department | Pink pencil icon |
| 8 | 5.2 | - Delete division | Delete division/user | Pink trash icon |

#### C.2. Department Card

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Department Icon | Department representative icon | Different colors by department |
| 2 | Department Name | Department name (e.g., "Admin", "GP") | Bold font |
| 3 | Member Count | Number of members (e.g., "1 Member", "3 Members") | Gray text |
| 4 | Title Range | Grade range | Gray text, after bullet |
| 5 | Expand/Collapse Icon | Arrow icon to open/close | Right corner of card |

#### C.3. Department Tree Colors

| # | Department | Icon | Notes |
|---|------------|------|-------|
| 1 | ADMIN | Person/group icon | Icon #84C7FE |
| 2 | GP | - | Green (WACASO) |
| 3 | CONTROL | Control icon | Blue #185FFF |
| 4 | IMPROVEMENT | Improvement/clock icon | Orange (#F57C22) |
| 5 | MD | Yellow/new/brown icon | Yellow/Orange (#FF9800) |

### D. Content Area - Department Tab (e.g., Admin)

*Content when opening department tab, displays list of cards including Department Head and established Teams.*

#### D.1. Department Head Card

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Department Head Card | Card for department head | e.g., Do Thi Kim Quyen |
| 2 | Head Avatar | Profile picture + Badge | Green badge |
| 3 | Head Name | Head's name | Bold font |
| 4 | Head Position | Position + Title | "Head of Dept - Deputy Manager" |
| 5 | Menu (three dots) | Popup menu with actions | Right corner of card |

#### D.2. Team Card

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Team Card Container | Card containing Team information | Blue border when expanded |
| 2 | Team Icon | Team representative icon | Purple/blue, team type |
| 3 | Team Name | Team name (e.g., "Account", "Account Executive") | Bold font, blue color |
| 4 | Member Count | Number of members (e.g., "2 Members", "1 Member") | Gray text |
| 5 | Title Range | Grade range (e.g., G3 - G4) | Gray text |
| 6 | Expand/Collapse | Arrow to open/close | Right corner, rotates when expanded |
| 7 | Indent Line | Line showing tree structure | Gray, left of card |

#### D.3. Member Card

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Member Avatar | Member's profile picture | Circular |
| 2 | Badge | Grade badge (e.g., G3, G4) | Green background, bottom corner of avatar |
| 3 | Member Name | Member's name | e.g., "Nguyen Thi Hien", Bold font |
| 4 | Member Position | Position | "Team Lead", "Account Executive" |
| 5 | Menu (three dots) | Popup menu with actions | Right corner of card |
| 6 | Indent Line | Vertical + horizontal line showing tree structure | Gray, L-shaped line |
| 7 | Click Action | Click card to open details | Orange/Blue area is clickable |

### D.4. Employee Detail Modal

*When clicking member card, displays popup modal with detailed employee information.*

#### D.4.1. Modal Header

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Modal Container | Popup with white background | 50% dark overlay behind |
| 2 | Close Button | (X) close button | Top right corner |
| 3 | Avatar | Employee profile picture | Circular, left side |
| 4 | Employee Name | Employee name (e.g., "Nguyen Thi Hue") | Bold, large font |
| 5 | Position | Position (e.g., "Team Lead") | Gray text, below name |
| 6 | Status Badge | Status (e.g., "Active") | Green badge |
| 7 | Phone | Employee phone | Icon + phone number (e.g., +84 968 488 238) |

#### D.4.2. Employee Information

| # | Field | Description | Notes |
|---|-------|-------------|-------|
| 1 | SAP CODE | SAP code | e.g., "00279857" |
| 2 | LINE MANAGER | Direct manager | Avatar + Name + Code (e.g., Do Thi Kim Quyen - 00283407) |
| 3 | JOB GRADE | Job grade | e.g., "G5 - Senior", pink text |
| 4 | JOINING DATE | Company join date | e.g., "17 Aug, 2017", format DD MMM, YYYY |

#### D.4.3. Organization Detail

| # | Field | Description | Notes |
|---|-------|-------------|-------|
| 1 | DIVISION | Division | e.g., "SMMH (Head Office)" |
| 2 | DEPARTMENT | Department | e.g., "Account Team" |
| 3 | SECTION | Section | - |
| 4 | DEPARTMENT (Location) | Branch/Location | e.g., "Ha Noi, ..." |

### E. Add New Team or Member

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Add Button | "+ Add new member" button | At end of hierarchy list |
| 2 | Button Style | Dashed border, (+) icon | Gray, hover changes background |
| 3 | Click Action | Opens add new form/modal | For both Team or Member |

### E.1. Add New Division Popup Menu

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | + Add new division | Add division/department | Pink icon |
| 2 | Edit division | Edit current division | Pink pencil icon |
| 3 | Delete division | Delete division | Pink trash icon |

### F. Permissions Modal

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Modal Header | "Permissions" with white background | Bold title |
| 2 | User/Role Selection | Select user or role for permissions | Dropdown or search |
| 3 | Permission List | List of permissions to grant | Checkboxes for each permission |
| 4 | Save Button | Save configuration button | Pink button |

### G. Import Excel Function

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Upload Dialog | Drag-drop or file picker | Accepts xlsx, xls |
| 2 | Template Download | Template download link | "Download template" |
| 3 | Preview Data | Data preview | Table preview |
| 4 | Confirm Import | Confirm import button | "Import" button |

---

## 4. API INTEGRATION

| # | Action | Method | Endpoint | Description |
|---|--------|--------|----------|-------------|
| 1 | Get SMBU Hierarchy | GET | /api/v1/user-info/smbu-hierarchy | Get root user + departments |
| 2 | Get Department Tabs | GET | /api/v1/user-info/department-tabs | Get tab navigation list |
| 3 | Get Department Hierarchy | GET | /api/v1/user-info/departments/{id}/hierarchy | Get department with teams and members |
| 4 | Get Staff Detail | GET | /api/v1/user-info/staff/{id} | Get detailed employee information |
| 5 | Get Departments List | GET | /api/v1/user-info/departments-list | Get departments for dropdown |
| 6 | Get Teams List | GET | /api/v1/user-info/teams-list | Get teams for dropdown |
| 7 | Create Team | POST | /api/v1/user-info/teams | Create new team |
| 8 | Create Member | POST | /api/v1/user-info/members | Create new staff member |
| 9 | Import Users | POST | /api/v1/users/import | Import list from Excel (TODO) |

---

## 5. TEST SCENARIOS

| # | Scenario | Description | Expected |
|---|----------|-------------|----------|
| 1 | Click tab | Click on different department tabs | Content changes per tab |
| 2 | Test navigation | Click on department | Displays members |
| 3 | Expand/Collapse | Click expand arrow | Content expands/collapses |
| 4 | View employee detail | Click member card | Modal displays full employee information |
| 5 | Add new member | Click "+ Add new" and fill information | New member appears |
| 6 | Edit user | Click menu → Edit and modify information | Information is updated |
| 7 | Delete user | Click menu → Delete and confirm | User is removed from hierarchy |
| 8 | Import Excel | Click Import Excel and upload file | Users are added successfully |

---

## 6. FILE STRUCTURE

```
frontend/src/
├── app/
│   └── tasks/
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
│       ├── AddTeamMemberModal.tsx
│       ├── EmployeeDetailModal.tsx
│       ├── PermissionsModal.tsx
│       └── ImportExcelModal.tsx
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

*Departments use inline SVG icons in DepartmentCard.tsx component for optimized performance and dynamic color support*

| Department | Icon Name | Color | ViewBox |
|------------|-----------|-------|---------|
| Admin | `admin` | #233D62 | 0 0 18 20 |
| OP | `op` | #0D9488 | 0 0 20 21 |
| CONTROL | `control` | #7C3AED | 0 0 22 22 |
| IMPROVEMENT | `improvement` | #2563EB | 0 0 22 22 |
| HR | `hr` | #E11D48 | 0 0 18 13 |
| MD | `md` | #D97706 | 0 0 20 18 |

**Benefits of inline SVG:**
- No separate HTTP request for each icon
- Faster rendering (no file loading wait)
- Dynamic color changes via `fill={color}` props
- No dependency on `/public/icons/` folder

---

## 9. CONNECTOR LINES

*Connector lines between cards in hierarchy tree*

| Component | Connector Position | Calculation |
|-----------|-------------------|-------------|
| HierarchyTree → DepartmentCard | `top-[50px]` | pt-4(16px) + p-4(16px) + half h-9(18px) |
| HierarchyTree → DepartmentHeadCard | `top-[62px]` | pt-4(16px) + p-4(16px) + half avatar(30px) |
| HierarchyTree → TeamCard (expanded) | `top-[48px]` | pt-4(16px) + py-3(12px) + half icon(20px) |
| DepartmentDetailView → TeamCard | `top-[48px]` | pt-4(16px) + py-3(12px) + half h-10(20px) |
| TeamCard → MemberCard | `top-[40px]` | pt-3(12px) + py-2(8px) + half h-10(20px) |

### Connector Line Implementation

The hierarchy tree uses segmented vertical lines for proper alignment:

1. **Department Card Level**: Vertical line from root to each department card
2. **Expanded Content Level**: When department is expanded:
   - Vertical line segments connect from previous item to current connector position
   - Each segment height is calculated to reach exactly the horizontal connector
   - Last item's vertical segment ends at its horizontal connector (no overflow)

```
Root User
│
├── Department Card 1 (collapsed)
│
├── Department Card 2 (expanded)
│   │
│   ├── Department Head Card
│   │
│   ├── Team Card 1
│   │
│   └── Team Card 2 (last - vertical line ends here)
│
└── Department Card 3
```

---

## 10. API ENDPOINTS (User Information)

| # | Action | Method | Endpoint | Description |
|---|--------|--------|----------|-------------|
| 1 | Get SMBU Hierarchy | GET | /api/v1/user-info/smbu-hierarchy | Get SMBU (Head Office) hierarchy with departments |
| 2 | Get Department Tabs | GET | /api/v1/user-info/department-tabs | Get list of department tabs for navigation |
| 3 | Get Department Hierarchy | GET | /api/v1/user-info/departments/{id}/hierarchy | Get department detail with head and teams |
| 4 | Get Staff Detail | GET | /api/v1/user-info/staff/{id} | Get detailed staff information |
| 5 | Get Departments List | GET | /api/v1/user-info/departments-list | Get departments for dropdown selection |
| 6 | Get Teams List | GET | /api/v1/user-info/teams-list | Get teams for dropdown selection |
| 7 | Create Team | POST | /api/v1/user-info/teams | Create a new team in a department |
| 8 | Create Member | POST | /api/v1/user-info/members | Create a new staff member |
| 9 | Get Roles List | GET | /api/v1/user-info/roles-list | Get roles for permissions modal |
| 10 | Get Users List | GET | /api/v1/user-info/users-list | Get users for permissions modal |
| 11 | Save Permissions | POST | /api/v1/user-info/permissions | Save permissions for user or role |
| 12 | Import Users | POST | /api/v1/user-info/import | Import users from Excel/CSV file |

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
| 2026-01-02 | Translated specification to English |
| 2026-01-03 | Added department expand/collapse with lazy loading in SMBU tab |
| 2026-01-03 | Fixed connector lines to use segmented approach for proper alignment |
| 2026-01-03 | Added User Information API endpoints documentation |
| 2026-01-04 | Implemented AddTeamMemberModal for adding new teams and members |
| 2026-01-04 | Added API endpoints: departments-list, teams-list, POST teams, POST members |
| 2026-01-04 | Implemented EmployeeDetailModal - click on member card to view full employee details |
| 2026-01-04 | Added click-outside handler for 3-dot menus in TeamCard and DepartmentHeadCard |
| 2026-01-04 | Implemented accordion behavior: expanding one department collapses others |
| 2026-01-04 | Implemented accordion behavior for teams within departments |
| 2026-01-04 | Added MemberCard border styling |
| 2026-01-04 | Swapped positions of arrow icon and 3-dot menu in TeamCard |
| 2026-01-04 | Implemented PermissionsModal with user/role selection and category-based permission checkboxes |
| 2026-01-04 | Added permissions API endpoints: roles-list, users-list, POST permissions |
| 2026-01-04 | Updated button icons for Permissions and Import Excel buttons |
| 2026-01-04 | Implemented ImportExcelModal with drag-and-drop, file preview, and template download |
| 2026-01-04 | Added import API endpoint for CSV file processing |
