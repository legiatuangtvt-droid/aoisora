# STORE INFORMATION SCREEN SPECIFICATION

**Screen ID:** SCR_STORE_INFO
**Screen Name:** Store Information Screen

---

## 1. GENERAL DESCRIPTION

| # | Attribute | Value |
|---|-----------|-------|
| 1 | Screen Name | Store Information Screen |
| 2 | Screen ID | SCR_STORE_INFO |
| 3 | Target Users | HQ (Headquarter) staff with management permissions |
| 4 | Navigation Path | Sidebar Menu: "User Management" → "Store Information" → Route: `/tasks/store-info` |

**Purpose:** Screen for managing store information by geographic regions/areas, managing store lists and staff at each store.

### Access Flow:

| # | Step | Description |
|---|------|-------------|
| 1 | STEP 1 | From Sidebar Menu, select "User Management" |
| 2 | STEP 2 | Select sub-menu "Store Information" |
| 3 | STEP 3 | STORE INFORMATION screen displays with region tabs |

---

## 2. FUNCTIONAL SPECIFICATION

*Divided by components: Header (Title + Actions), Tab Navigation (by Region), and Content Area (Area/Store hierarchy).*

### A. Header Section

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Page Title | "STORE INFORMATION" | Bold font, black color |
| 2 | Subtitle | "Manage hierarchy, team members, and configure data access permissions" | Gray text |
| 3 | Permissions Button | "Permissions" button with region icon | Outlined button, gray color |
| 4 | Import Excel Button | "Import Excel" button with icon | Filled button, pink/#E5 color |

### B. Tab Navigation (Region Navigation)

*Tabs display by region/area, active tab has pink underline.*

| # | Tab | Description | Notes |
|---|-----|-------------|-------|
| 1 | SMBU (Store) | Default tab - Total | No specific icon |
| 2 | OCEAN | Ocean region | Active tab has pink underline |
| 3 | HA NOI CENTER | Hanoi Center region | |
| 4 | ECO PARK | Eco Park region | |
| 5 | HA DONG | Ha Dong region | |
| 6 | NGO | NGO region | |

### C. Content Area - Area Section

*Displays list of Areas in selected Region, each Area can expand/collapse.*

#### C.1. Area Header Card

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Area Name | Area name (e.g., "Area Ha Nam") | Bold font, uppercase, blue background |
| 2 | Store Count | Number of stores in area | Store icon + number (e.g., "23 Stores") |
| 3 | Expand/Collapse Icon | Arrow icon (∨/∧) | Right corner, click to expand/collapse |
| 4 | Background Color | Blue background | Distinguishes from store cards |

#### C.2. Store Card

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Store Icon | Store icon | Blue color icon |
| 2 | Store Code | Store code (e.g., code 1234) | Small text, gray, above name |
| 3 | Store Name | Store name (e.g., "Ocean Park 1") | Bold font |
| 4 | Store Manager | Store manager name | Person icon + name (e.g., "Hoang Huong Giang") |
| 5 | Staff Count | Number of staff | Person icon + number (e.g., "Staff: 15") |
| 6 | Expand/Collapse Icon | Arrow icon (∨/∧) | Right corner of card |
| 7 | Indent Line | Vertical line showing Area hierarchy | Light gray, left side |

### D. Department Cards in Area

*Each Area contains Department cards with specific icons and colors.*

| # | Department | Description | Notes |
|---|------------|-------------|-------|
| 1 | ZEN PARK | Triangle/delta icon | Teal (#4ACAF0) |
| 2 | CONTROL | Gear icon | Blue (#2196F3) |
| 3 | IMPROVEMENT | Diamond icon | Purple (#673572) |
| 4 | HR | Person icon | Red (#FF5182) |

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Department Icon | Department representative icon | Color by department type |
| 2 | Department Name | Department name (e.g., "ZEN PARK") | |
| 3 | Expand/Collapse Icon | Arrow icon | Right corner of card |
| 4 | Indent Line | Line showing hierarchy | By level: Area → Store → Dept |

### E. Store Detail (When Expanding Store Card)

*When expanding store card, displays list of staff in store.*

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Staff List | List of staff in store | Displayed as list |
| 2 | Staff Card | Staff information card | Avatar + Name + Position |
| 3 | Staff Avatar | Staff profile picture | Circle + grade badge |
| 4 | Staff Name | Staff name | Bold font |
| 5 | Staff Position | Position (e.g., "Store Manager") | Gray text |
| 6 | Menu (three dots) | Menu options for staff | Edit/Delete options |

### F. Add New Team or Member

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Add Button | "+ Add new Team or Member" button | Icon at end of list |
| 2 | Button Style | Dashed border, (+) icon | Gray, hover changes to pink |
| 3 | Click Action | Opens add new popup/modal | Add Store or staff |

### G. Permissions Modal

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Modal Header | "Permissions" with close button (X) | Bold title |
| 2 | Store/User Selection | Select created store or user | Dropdown or search |
| 3 | Permission List | List of permissions to grant | Checkbox for each permission |
| 4 | Save Button | Save configuration button | Pink button |

### H. Import Excel Function

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | Upload Dialog | Excel file selection dialog | Accepts .xlsx, .xls |
| 2 | Template Download | Template download link | "Download template" |
| 3 | Preview Data | Data preview | Table preview |
| 4 | Validation | Data validation check | Highlight errors if any |
| 5 | Confirm Import | Confirm data import | "Import" button |

---

## 3. VALIDATION RULES

| # | Rule | Description |
|---|------|-------------|
| 1 | Store code unique | Store code must be unique in the system |
| 2 | Store name required | Store name cannot be empty |
| 3 | Area required | Each store must belong to an Area |
| 4 | Region required | Each Area must belong to a Region |
| 5 | Manager assignment | Each store should have at least one Store Manager |
| 6 | Excel format | Import file must match template format |

---

## 4. API INTEGRATION

| # | Action | Method | Endpoint | Description |
|---|--------|--------|----------|-------------|
| 1 | Get Regions | GET | /api/v1/regions | Get list of regions |
| 2 | Get Areas by Region | GET | /api/v1/regions/{id}/areas | Get areas by region |
| 3 | Get Stores by Area | GET | /api/v1/areas/{id}/stores | Get stores by area |
| 4 | Get Store Detail | GET | /api/v1/stores/{id} | Get store detail information |
| 5 | Get Store Staff | GET | /api/v1/stores/{id}/staff | Get store staff list |
| 6 | Add Store | POST | /api/v1/stores | Add new store |
| 7 | Update Store | PUT | /api/v1/stores/{id} | Update store information |
| 8 | Delete Store | DELETE | /api/v1/stores/{id} | Delete store |
| 9 | Add Staff to Store | POST | /api/v1/stores/{id}/staff | Add staff to store |
| 10 | Import Stores | POST | /api/v1/stores/import | Import stores from Excel |

---

## 5. UI STATES

| # | State Type | State | Display |
|---|------------|-------|---------|
| 1 | Loading | Loading | Skeleton loader for hierarchy tree |
| 2 | Loading | Expanding area/store | Spinner in card |
| 3 | Loading | Importing | Progress bar with percentage |
| 4 | Empty | No stores in area | "No stores in this area" |
| 5 | Empty | No staff in store | "No staff assigned" |
| 6 | Error | Load failed | Error message with retry button |
| 7 | Error | Import failed | Error details with highlighted error rows |
| 8 | Success | Store added | Toast "Store added successfully" |
| 9 | Success | Import complete | Toast "Import completed: X stores added" |
| 10 | Active | Tab selected | Tab has pink underline |
| 11 | Expanded | Area/Store open | Arrow icon rotates up (∧) |

---

## 6. TEST SCENARIOS

### A. UI/UX Testing

| # | Test Case | Scenario | Expected |
|---|-----------|----------|----------|
| 1 | Layout check | Open Store screen | Header, tabs, hierarchy display correctly |
| 2 | Tab navigation | Click region tabs | Content changes per tab, underline moves |
| 3 | Expand Area | Click area header | Expands to show stores in area |
| 4 | Expand Store | Click store card | Expands to show staff in store |
| 5 | Icon colors | View department cards | Icon colors match department |

### B. Functional Testing

| # | Test Case | Scenario | Expected |
|---|-----------|----------|----------|
| 1 | Add new store | Click "+ Add new" → Enter info → Save | New store appears in area |
| 2 | Edit store | Click menu → Edit → Modify info → Save | Information is updated |
| 3 | Delete store | Click menu → Delete → Confirm | Store is removed from list |
| 4 | Add staff to store | Expand store → Add staff → Select staff → Save | Staff appears in store |
| 5 | Import Excel | Select file → Import → Confirm | Stores are imported successfully |
| 6 | Switch tabs | Click OCEAN tab → Click HA NOI CENTER tab | Data loads correctly per region |
| 7 | Set permissions | Click Permissions → Select store → Grant permissions → Save | Permissions are saved successfully |

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

*Connector lines between cards in hierarchy tree*

| Component | Position | Description |
|-----------|----------|-------------|
| Area → Store | Left indent | Vertical + horizontal line from Area to Store |
| Store → Staff | Left indent | Vertical + horizontal line from Store to Staff |

---

## CHANGELOG

| Date | Change |
|------|--------|
| 2026-01-02 | Initial specification created |
| 2026-01-02 | Implemented Store Information screen with all components |
| 2026-01-02 | Updated navigation route from `/users/store-info` to `/tasks/store-info` |
| 2026-01-02 | Updated icons: Permissions button (user+gear), Import Excel button (file+arrow), Staff icon |
| 2026-01-02 | Fixed badge G3 positioning near avatar |
| 2026-01-02 | Translated specification to English |
