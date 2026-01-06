# User Information Screen Specification

---

# BASIC SPEC

## 1. Overview

- **Module**: WS (Task from HQ)
- **Screen ID**: SCR_USER_INFO
- **Route**: `/tasks/info`
- **Purpose**: Manage and track user lists (Hierarchy), Team members and organization structure
- **Target Users**: HQ staff with management permissions

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | HQ Manager | View organization hierarchy | I can see team structure |
| US-02 | HQ Manager | Switch between department tabs | I can view different departments |
| US-03 | HQ Manager | Expand/collapse departments | I can navigate the hierarchy |
| US-04 | HQ Manager | View employee details | I can see staff information |
| US-05 | HQ Manager | Add new teams/members | I can grow the organization |
| US-06 | HQ Manager | Import users from Excel | I can bulk add users |
| US-07 | HQ Manager | Manage permissions | I can control access rights |

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Header | Title "USER INFORMATION" with Permissions and Import buttons |
| Tab Navigation | Department tabs: SMBU, Admin, OP, GP, etc. |
| Hierarchy Tree | Expandable tree showing departments, teams, members |
| Employee Detail Modal | Popup showing full employee information |
| Permissions Modal | Configure user/role permissions |
| Import Excel Modal | Upload and preview Excel data |

## 4. Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ USER INFORMATION                     [Permissions] [Import Excel]    │
│ Team members and organization management                             │
├─────────────────────────────────────────────────────────────────────┤
│ [SMBU] [Admin] [OP] [GP] [CONTROL] [IMPROVEMENT] [HR] [MG]          │
├─────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────┐                              │
│ │ 👤 VP/Director Name (G5)     [⋮]   │ ← Root User Card             │
│ └────────────────────────────────────┘                              │
│   │                                                                  │
│   ├─▼ ADMIN (3 Members, G3-G5)                                      │
│   │   ├─ Department Head                                            │
│   │   ├─▼ Account Team (2 Members)                                  │
│   │   │   ├─ Member 1                                               │
│   │   │   └─ Member 2                                               │
│   │   └─ [+ Add new member]                                         │
│   └─▶ HR (2 Members, G3-G4)                                         │
└─────────────────────────────────────────────────────────────────────┘
```

## 5. Navigation

| Action | Destination |
|--------|-------------|
| Click Sidebar "User Management" > "User information" | `/tasks/info` |
| Click department tab | Show department hierarchy |
| Click member card | Open Employee Detail Modal |
| Click "+ Add new member" | Open Add Team/Member Modal |
| Click "Permissions" button | Open Permissions Modal |
| Click "Import Excel" button | Open Import Modal |

## 6. API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/user-info/smbu-hierarchy` | GET | Get SMBU hierarchy |
| `/api/v1/user-info/departments/{id}/hierarchy` | GET | Get department hierarchy |
| `/api/v1/user-info/staff/{id}` | GET | Get staff detail |
| `/api/v1/user-info/teams` | POST | Create new team |
| `/api/v1/user-info/members` | POST | Create new member |

## 7. Implementation Status

| Feature | Backend | Frontend | Notes |
|---------|---------|----------|-------|
| User Info Page | ✅ Done | ✅ Done | API integrated |
| Tab Navigation | ✅ Done | ✅ Done | - |
| Hierarchy Tree | ✅ Done | ✅ Done | - |
| Employee Detail Modal | ✅ Done | ✅ Done | - |
| Add Team/Member Modal | ✅ Done | ✅ Done | - |
| Permissions Modal | ✅ Done | ✅ Done | - |
| Import Excel Modal | ✅ Done | ✅ Done | - |

---

# DETAIL SPEC

## 8. Job Grades - Detail

| Code | Title | Description |
|------|-------|-------------|
| G1 | Officer | Staff level |
| G3 | Executive | Specialist level |
| G4 | Deputy Manager | Deputy manager level |
| G5 | Manager | Manager level |
| G6 | General Manager | General manager level |
| G7 | Senior General Manager | Senior general manager level |
| G8 | CCO | Chief Commercial Officer |

### 8.1 Job Grade Colors

| Grade | Color | Hex Code |
|-------|-------|----------|
| G1 | Gray | #9CA3AF |
| G2 | Light Blue | #81AADB |
| G3 | Teal/Green | #22A6A1 |
| G4 | Blue | #1F7BF2 |
| G5 | Purple | #8B5CF6 |
| G6 | Orange | #FF9900 |
| G7 | Red | #DC2626 |
| G8 | Dark Red | #991B1B |

---

## 9. Header Section - Detail

| Component | Description | Notes |
|-----------|-------------|-------|
| Page Title | "USER INFORMATION" | Large font, bold, black color |
| Subtitle | "Team members..." | Gray text |
| Permissions Button | "Permissions" button with icon | Outlined button, gray color |
| Import Excel Button | "Import Excel" button with icon | Filled button, pink/red color |

---

## 10. Tab Navigation - Detail

| Tab | Description | Icon |
|-----|-------------|------|
| Deputy Manager (Head Office) | Default tab - Main office | No specific icon |
| Admin | Administration department | Custom icon |
| OP | Operations department | Yellow icon |
| GP | Programming department | Green icon |
| CONTROL | Control department | Blue icon |
| IMPROVEMENT | Improvement department | Orange icon |
| HR | Human Resources department | Gray icon |
| MG | Management department | No specific icon |

### 10.1 Tab Styling

- Active tab: Pink underline and pink text
- Inactive tab: Gray text

---

## 11. Hierarchy Tree Components - Detail

### 11.1 Root User Card

| Component | Description | Notes |
|-----------|-------------|-------|
| Avatar | User profile picture | Circular |
| Badge | Badge showing grade level (e.g., G5) | - |
| Title Badge | - | Green background, white text |
| User Name | "VP/Director Name ..." | User's name |
| Position | Title + Grade (e.g., G4 - General Manager) | - |
| Menu (three dots) | Edit division, Delete division | Pink icons |

### 11.2 Department Card

| Component | Description | Notes |
|-----------|-------------|-------|
| Department Icon | Department representative icon | Different colors by department |
| Department Name | Department name (e.g., "Admin", "GP") | Bold font |
| Member Count | Number of members (e.g., "1 Member", "3 Members") | Gray text |
| Title Range | Grade range | Gray text, after bullet |
| Expand/Collapse Icon | Arrow icon to open/close | Right corner of card |

### 11.3 Team Card

| Component | Description | Notes |
|-----------|-------------|-------|
| Team Card Container | Card containing Team information | Blue border when expanded |
| Team Icon | Team representative icon | Purple/blue, team type |
| Team Name | Team name (e.g., "Account", "Account Executive") | Bold font, blue color |
| Member Count | Number of members (e.g., "2 Members", "1 Member") | Gray text |
| Title Range | Grade range (e.g., G3 - G4) | Gray text |
| Expand/Collapse | Arrow to open/close | Right corner, rotates when expanded |
| Indent Line | Line showing tree structure | Gray, left of card |

### 11.4 Member Card

| Component | Description | Notes |
|-----------|-------------|-------|
| Member Avatar | Member's profile picture | Circular |
| Badge | Grade badge (e.g., G3, G4) | Green background, bottom corner of avatar |
| Member Name | Member's name | e.g., "Nguyen Thi Hien", Bold font |
| Member Position | Position | "Team Lead", "Account Executive" |
| Menu (three dots) | Popup menu with actions | Right corner of card |
| Indent Line | Vertical + horizontal line showing tree structure | Gray, L-shaped line |
| Click Action | Click card to open details | Orange/Blue area is clickable |

---

## 12. Employee Detail Modal - Detail

### 12.1 Modal Header

| Component | Description | Notes |
|-----------|-------------|-------|
| Modal Container | Popup with white background | 50% dark overlay behind |
| Close Button | (X) close button | Top right corner |
| Avatar | Employee profile picture | Circular, left side |
| Employee Name | Employee name (e.g., "Nguyen Thi Hue") | Bold, large font |
| Position | Position (e.g., "Team Lead") | Gray text, below name |
| Status Badge | Status (e.g., "Active") | Green badge |
| Phone | Employee phone | Icon + phone number |

### 12.2 Employee Information

| Field | Description | Notes |
|-------|-------------|-------|
| SAP CODE | SAP code | e.g., "00279857" |
| LINE MANAGER | Direct manager | Avatar + Name + Code |
| JOB GRADE | Job grade | e.g., "G5 - Senior", pink text |
| JOINING DATE | Company join date | e.g., "17 Aug, 2017", format DD MMM, YYYY |

### 12.3 Organization Detail

| Field | Description | Notes |
|-------|-------------|-------|
| DIVISION | Division | e.g., "SMMH (Head Office)" |
| DEPARTMENT | Department | e.g., "Account Team" |
| SECTION | Section | - |
| DEPARTMENT (Location) | Branch/Location | e.g., "Ha Noi, ..." |

---

## 13. Department Icons - Detail

| Department | Icon Name | Color | ViewBox |
|------------|-----------|-------|---------|
| Admin | `admin` | #233D62 | 0 0 18 20 |
| OP | `op` | #0D9488 | 0 0 20 21 |
| CONTROL | `control` | #7C3AED | 0 0 22 22 |
| IMPROVEMENT | `improvement` | #2563EB | 0 0 22 22 |
| HR | `hr` | #E11D48 | 0 0 18 13 |
| MD | `md` | #D97706 | 0 0 20 18 |

---

## 14. Connector Lines - Detail

| Component | Connector Position | Calculation |
|-----------|-------------------|-------------|
| HierarchyTree → DepartmentCard | `top-[50px]` | pt-4(16px) + p-4(16px) + half h-9(18px) |
| HierarchyTree → DepartmentHeadCard | `top-[62px]` | pt-4(16px) + p-4(16px) + half avatar(30px) |
| HierarchyTree → TeamCard (expanded) | `top-[48px]` | pt-4(16px) + py-3(12px) + half icon(20px) |
| DepartmentDetailView → TeamCard | `top-[48px]` | pt-4(16px) + py-3(12px) + half h-10(20px) |
| TeamCard → MemberCard | `top-[40px]` | pt-3(12px) + py-2(8px) + half h-10(20px) |

---

## 15. API Endpoints - Detail

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Get SMBU Hierarchy | GET | /api/v1/user-info/smbu-hierarchy | Get root user + departments |
| Get Department Tabs | GET | /api/v1/user-info/department-tabs | Get tab navigation list |
| Get Department Hierarchy | GET | /api/v1/user-info/departments/{id}/hierarchy | Get department with teams and members |
| Get Staff Detail | GET | /api/v1/user-info/staff/{id} | Get detailed employee information |
| Get Departments List | GET | /api/v1/user-info/departments-list | Get departments for dropdown |
| Get Teams List | GET | /api/v1/user-info/teams-list | Get teams for dropdown |
| Create Team | POST | /api/v1/user-info/teams | Create new team |
| Create Member | POST | /api/v1/user-info/members | Create new staff member |
| Get Roles List | GET | /api/v1/user-info/roles-list | Get roles for permissions |
| Get Users List | GET | /api/v1/user-info/users-list | Get users for permissions |
| Save Permissions | POST | /api/v1/user-info/permissions | Save permissions |
| Import Users | POST | /api/v1/user-info/import | Import from Excel/CSV |

---

## 16. Files Reference

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

## 17. Test Scenarios

| Scenario | Description | Expected |
|----------|-------------|----------|
| Click tab | Click on different department tabs | Content changes per tab |
| Test navigation | Click on department | Displays members |
| Expand/Collapse | Click expand arrow | Content expands/collapses |
| View employee detail | Click member card | Modal displays full employee information |
| Add new member | Click "+ Add new" and fill information | New member appears |
| Edit user | Click menu → Edit and modify information | Information is updated |
| Delete user | Click menu → Delete and confirm | User is removed from hierarchy |
| Import Excel | Click Import Excel and upload file | Users are added successfully |

---

## 18. Changelog

| Date | Change |
|------|--------|
| 2026-01-02 | Initial specification created |
| 2026-01-02 | Added Department Detail View with components |
| 2026-01-02 | Updated department icons to inline SVG |
| 2026-01-02 | Fixed connector line positions |
| 2026-01-02 | Translated specification to English |
| 2026-01-03 | Added department expand/collapse with lazy loading |
| 2026-01-03 | Fixed connector lines to use segmented approach |
| 2026-01-03 | Added User Information API endpoints |
| 2026-01-04 | Implemented AddTeamMemberModal |
| 2026-01-04 | Implemented EmployeeDetailModal |
| 2026-01-04 | Implemented accordion behavior for departments and teams |
| 2026-01-04 | Implemented PermissionsModal |
| 2026-01-04 | Implemented ImportExcelModal |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
