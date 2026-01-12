# User Information - Detail Specification

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_USER_INFO
> **Route**: `/tasks/info`
> **Last Updated**: 2026-01-08

---

## 1. Job Grades - Detail

| Code | Title | Description |
|------|-------|-------------|
| G1 | Officer | Staff level |
| G3 | Executive | Specialist level |
| G4 | Deputy Manager | Deputy manager level |
| G5 | Manager | Manager level |
| G6 | General Manager | General manager level |
| G7 | Senior General Manager | Senior general manager level |
| G8 | CCO | Chief Commercial Officer |

### 1.1 Job Grade Colors

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

## 2. Header Section - Detail

| Component | Description | Notes |
|-----------|-------------|-------|
| Page Title | "USER INFORMATION" | Large font, bold, black color |
| Subtitle | "Team members..." | Gray text |
| Permissions Button | "Permissions" button with icon | Outlined button, gray color |
| Import Excel Button | "Import Excel" button with icon | Filled button, pink/red color |

---

## 3. Tab Navigation - Detail

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

### 3.1 Tab Styling

- Active tab: Pink underline and pink text
- Inactive tab: Gray text

---

## 4. Hierarchy Tree Components - Detail

### 4.1 Root User Card

| Component | Description | Notes |
|-----------|-------------|-------|
| Avatar | User profile picture | Circular |
| Badge | Badge showing grade level (e.g., G5) | - |
| Title Badge | - | Green background, white text |
| User Name | "VP/Director Name ..." | User's name |
| Position | Title + Grade (e.g., G4 - General Manager) | - |
| Menu (three dots) | Edit division, Delete division | Pink icons |

### 4.2 Department Card

| Component | Description | Notes |
|-----------|-------------|-------|
| Department Icon | Department representative icon | Different colors by department |
| Department Name | Department name (e.g., "Admin", "GP") | Bold font |
| Member Count | Number of members (e.g., "1 Member", "3 Members") | Gray text |
| Title Range | Grade range | Gray text, after bullet |
| Expand/Collapse Icon | Arrow icon to open/close | Right corner of card |

### 4.3 Team Card

| Component | Description | Notes |
|-----------|-------------|-------|
| Team Card Container | Card containing Team information | Blue border when expanded |
| Team Icon | Team representative icon | Purple/blue, team type |
| Team Name | Team name (e.g., "Account", "Account Executive") | Bold font, blue color |
| Member Count | Number of members (e.g., "2 Members", "1 Member") | Gray text |
| Title Range | Grade range (e.g., G3 - G4) | Gray text |
| Expand/Collapse | Arrow to open/close | Right corner, rotates when expanded |
| Indent Line | Line showing tree structure | Gray, left of card |

### 4.4 Member Card

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

## 5. Employee Detail Modal - Detail

### 5.1 Modal Header

| Component | Description | Notes |
|-----------|-------------|-------|
| Modal Container | Popup with white background | 50% dark overlay behind |
| Close Button | (X) close button | Top right corner |
| Avatar | Employee profile picture | Circular, left side |
| Employee Name | Employee name (e.g., "Nguyen Thi Hue") | Bold, large font |
| Position | Position (e.g., "Team Lead") | Gray text, below name |
| Status Badge | Status (e.g., "Active") | Green badge |
| Phone | Employee phone | Icon + phone number |

### 5.2 Employee Information

| Field | Description | Notes |
|-------|-------------|-------|
| SAP CODE | SAP code | e.g., "00279857" |
| LINE MANAGER | Direct manager | Avatar + Name + Code |
| JOB GRADE | Job grade | e.g., "G5 - Senior", pink text |
| JOINING DATE | Company join date | e.g., "17 Aug, 2017", format DD MMM, YYYY |

### 5.3 Organization Detail

| Field | Description | Notes |
|-------|-------------|-------|
| DIVISION | Division | e.g., "SMMH (Head Office)" |
| DEPARTMENT | Department | e.g., "Account Team" |
| SECTION | Section | - |
| DEPARTMENT (Location) | Branch/Location | e.g., "Ha Noi, ..." |

---

## 6. Department Icons - Detail

| Department | Icon Name | Color | ViewBox |
|------------|-----------|-------|---------|
| Admin | `admin` | #233D62 | 0 0 18 20 |
| OP | `op` | #0D9488 | 0 0 20 21 |
| CONTROL | `control` | #7C3AED | 0 0 22 22 |
| IMPROVEMENT | `improvement` | #2563EB | 0 0 22 22 |
| HR | `hr` | #E11D48 | 0 0 18 13 |
| MD | `md` | #D97706 | 0 0 20 18 |

---

## 7. Connector Lines - Detail

| Component | Connector Position | Calculation |
|-----------|-------------------|-------------|
| HierarchyTree → DepartmentCard | `top-[50px]` | pt-4(16px) + p-4(16px) + half h-9(18px) |
| HierarchyTree → DepartmentHeadCard | `top-[62px]` | pt-4(16px) + p-4(16px) + half avatar(30px) |
| HierarchyTree → TeamCard (expanded) | `top-[48px]` | pt-4(16px) + py-3(12px) + half icon(20px) |
| DepartmentDetailView → TeamCard | `top-[48px]` | pt-4(16px) + py-3(12px) + half h-10(20px) |
| TeamCard → MemberCard | `top-[40px]` | pt-3(12px) + py-2(8px) + half h-10(20px) |

---

## 8. API Endpoints - Detail

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

### 8.1 Get SMBU Hierarchy

```yaml
get:
  tags:
    - WS-UserInfo
  summary: "Get SMBU Hierarchy API"
  description: |
    # Business Logic
      ## 1. Get Root User
        ### Select Columns
          - staff.id, staff.full_name, staff.position
          - staff.job_grade, staff.avatar_url

        ### Search Conditions
          - staff.is_root = true
          - OR staff.job_grade IN ('G7', 'G8')

      ## 2. Get Departments
        ### Select Columns
          - departments.id, departments.name, departments.icon
          - COUNT(staff) as member_count
          - MIN(job_grade), MAX(job_grade) as grade_range

        ### Group By
          - departments.id

        ### Order By
          - departments.display_order ASC

      ## 3. Response
        - Return root user with department list

  operationId: getSMBUHierarchy
  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              rootUser:
                id: 1
                fullName: "VP/Director Name"
                position: "Vice President"
                jobGrade: "G7"
                avatarUrl: "/avatars/vp.jpg"
              departments:
                - id: 1
                  name: "ADMIN"
                  icon: "admin"
                  memberCount: 3
                  gradeRange: "G3-G5"
                - id: 2
                  name: "OP"
                  icon: "op"
                  memberCount: 15
                  gradeRange: "G1-G4"
```

### 8.2 Get Department Hierarchy

```yaml
get:
  tags:
    - WS-UserInfo
  summary: "Get Department Hierarchy API"
  description: |
    # Business Logic
      ## 1. Get Department Head
        ### Select Columns
          - staff.id, staff.full_name, staff.position, staff.job_grade

        ### Search Conditions
          - staff.department_id = {id}
          - staff.is_department_head = true

      ## 2. Get Teams
        ### Select Columns
          - teams.id, teams.name
          - COUNT(staff) as member_count

        ### Search Conditions
          - teams.department_id = {id}

      ## 3. Get Team Members
        ### For Each Team
          - Get staff list with avatar, name, position, job_grade

      ## 4. Response
        - Return department head + teams with members

  operationId: getDepartmentHierarchy
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: integer
      description: Department ID

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              departmentHead:
                id: 10
                fullName: "Department Manager"
                position: "Manager"
                jobGrade: "G5"
              teams:
                - id: 1
                  name: "Account Team"
                  memberCount: 2
                  members:
                    - id: 11
                      fullName: "Nguyen Thi Hien"
                      position: "Team Lead"
                      jobGrade: "G4"
                    - id: 12
                      fullName: "Tran Van Nam"
                      position: "Account Executive"
                      jobGrade: "G3"

    404:
      description: Department Not Found
```

### 8.3 Get Staff Detail

```yaml
get:
  tags:
    - WS-UserInfo
  summary: "Get Staff Detail API"
  description: |
    # Business Logic
      ## 1. Get Staff Info
        ### Select Columns
          - All staff fields
          - department.name as department_name
          - team.name as team_name
          - manager.full_name as line_manager_name

        ### Join Conditions
          - LEFT JOIN departments ON staff.department_id
          - LEFT JOIN teams ON staff.team_id
          - LEFT JOIN staff manager ON staff.manager_id

      ## 2. Response
        - Return full staff profile

  operationId: getStaffDetail
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: integer

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              id: 11
              sapCode: "00279857"
              fullName: "Nguyen Thi Hue"
              position: "Team Lead"
              jobGrade: "G5"
              status: "Active"
              phone: "0901234567"
              joiningDate: "2017-08-17"
              lineManager:
                id: 10
                fullName: "Manager Name"
                sapCode: "00279800"
              division: "SMMH (Head Office)"
              department: "Account Team"
              section: ""
              location: "Ha Noi"

    404:
      description: Staff Not Found
```

### 8.4 Create Team

```yaml
post:
  tags:
    - WS-UserInfo
  summary: "Create Team API"
  description: |
    # Correlation Check
      - department_id: Must exist
      - name: Must be unique within department

    # Business Logic
      ## 1. Validate Input
        - Check department exists
        - Check team name unique

      ## 2. Create Team
        - Insert into teams table

      ## 3. Response
        - Return created team

  operationId: createTeam
  requestBody:
    required: true
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/CreateTeamRequest"
        example:
          department_id: 1
          name: "New Team"
          description: "Team description"

  responses:
    201:
      description: Created
      content:
        application/json:
          example:
            success: true
            data:
              id: 5
              name: "New Team"
            message: "Team created successfully"

    400:
      description: Bad Request
```

### 8.5 Create Member

```yaml
post:
  tags:
    - WS-UserInfo
  summary: "Create Staff Member API"
  description: |
    # Correlation Check
      - email: Must be unique
      - sap_code: Must be unique
      - department_id: Must exist
      - team_id: Must exist and belong to department

    # Business Logic
      ## 1. Validate Input
        - Check uniqueness
        - Check relationships

      ## 2. Create Staff
        - Insert into staff table
        - Generate temporary password

      ## 3. Response
        - Return created staff info

  operationId: createMember
  requestBody:
    required: true
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/CreateMemberRequest"
        example:
          full_name: "New Staff Member"
          email: "newstaff@aoisora.com"
          phone: "0901234568"
          sap_code: "NV100"
          department_id: 1
          team_id: 1
          position: "Staff"
          job_grade: "G3"

  responses:
    201:
      description: Created

    400:
      description: Bad Request
```

### 8.6 Save Permissions

```yaml
post:
  tags:
    - WS-UserInfo
  summary: "Save Permissions API"
  description: |
    # Business Logic
      ## 1. Delete Existing Permissions
        - Remove current permissions for user/role

      ## 2. Insert New Permissions
        - Bulk insert permission records

      ## 3. Response
        - Return success

  operationId: savePermissions
  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          properties:
            type:
              type: string
              enum: [user, role]
            target_id:
              type: integer
            permissions:
              type: array
              items:
                type: object
                properties:
                  module:
                    type: string
                  actions:
                    type: array
                    items:
                      type: string
        example:
          type: "user"
          target_id: 11
          permissions:
            - module: "tasks"
              actions: ["view", "create", "edit"]
            - module: "reports"
              actions: ["view"]

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            success: true
            message: "Permissions saved successfully"
```

### 8.7 Import Users

```yaml
post:
  tags:
    - WS-UserInfo
  summary: "Import Users API"
  description: |
    # Business Logic
      ## 1. Parse File
        - Support Excel, CSV formats
        - Validate column headers

      ## 2. Validate Each Row
        - Check required fields
        - Check email/sap_code uniqueness

      ## 3. Bulk Insert
        - Insert valid records
        - Track errors per row

      ## 4. Response
        - Return import summary

  operationId: importUsers
  requestBody:
    required: true
    content:
      multipart/form-data:
        schema:
          type: object
          properties:
            file:
              type: string
              format: binary
            format:
              type: string
              enum: [excel, csv]

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            success: true
            data:
              imported: 25
              skipped: 3
              errors:
                - row: 5
                  error: "Email already exists"
                - row: 12
                  error: "Invalid department"
```

---

## 9. Schema Definitions

```yaml
components:
  schemas:
    CreateTeamRequest:
      type: object
      required:
        - department_id
        - name
      properties:
        department_id:
          type: integer
        name:
          type: string
          maxLength: 100
        description:
          type: string

    CreateMemberRequest:
      type: object
      required:
        - full_name
        - email
        - department_id
        - position
        - job_grade
      properties:
        full_name:
          type: string
        email:
          type: string
          format: email
        phone:
          type: string
        sap_code:
          type: string
        department_id:
          type: integer
        team_id:
          type: integer
        position:
          type: string
        job_grade:
          type: string
          enum: [G1, G2, G3, G4, G5, G6, G7, G8]

    StaffResponse:
      type: object
      properties:
        id:
          type: integer
        sapCode:
          type: string
        fullName:
          type: string
        position:
          type: string
        jobGrade:
          type: string
        status:
          type: string
        phone:
          type: string
        joiningDate:
          type: string
          format: date
        department:
          type: string
        team:
          type: string
```

---

## 10. Files Reference

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

## 11. Test Scenarios

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

## 12. Changelog

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
| 2026-01-08 | Split spec into basic and detail files |

---

## 13. Related Documents

| Document | Path |
|----------|------|
| Basic Spec | `docs/specs/basic/ws/user-information-basic.md` |
| Store Information Basic | `docs/specs/basic/ws/store-information-basic.md` |

