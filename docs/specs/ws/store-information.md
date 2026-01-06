# Store Information Screen Specification

---

# BASIC SPEC

## 1. Overview

- **Module**: WS (Task from HQ)
- **Screen ID**: SCR_STORE_INFO
- **Route**: `/tasks/store-info`
- **Purpose**: Manage store information by geographic regions/areas, store lists and staff at each store
- **Target Users**: HQ staff with management permissions

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | HQ Manager | View stores by region | I can see regional store distribution |
| US-02 | HQ Manager | Switch between region tabs | I can navigate to different regions |
| US-03 | HQ Manager | Expand areas to see stores | I can view stores in each area |
| US-04 | HQ Manager | View store staff list | I can see who works at each store |
| US-05 | HQ Manager | Add new stores | I can expand store network |
| US-06 | HQ Manager | Import stores from Excel | I can bulk add stores |
| US-07 | HQ Manager | Manage store permissions | I can control access rights |

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Header | Title "STORE INFORMATION" with Permissions and Import buttons |
| Tab Navigation | Region tabs: SMBU, OCEAN, HA NOI CENTER, etc. |
| Area Section | Expandable area cards with store count |
| Store Cards | Store info with manager, staff count |
| Staff List | Expanded view showing store staff |
| Permissions Modal | Configure store permissions |
| Import Excel Modal | Upload and preview Excel data |

## 4. Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ STORE INFORMATION                    [Permissions] [Import Excel]    │
│ Manage hierarchy, team members, and configure data access permissions│
├─────────────────────────────────────────────────────────────────────┤
│ [SMBU] [OCEAN] [HA NOI CENTER] [ECO PARK] [HA DONG] [NGO]           │
├─────────────────────────────────────────────────────────────────────┤
│ ▼ AREA HA NAM                                      [23 Stores]       │
│   │                                                                  │
│   ├─▼ 🏪 Store Code 1234                                            │
│   │     Ocean Park 1                                                 │
│   │     👤 Hoang Huong Giang │ Staff: 15                            │
│   │     ├─ Staff Member 1 (G3)                                      │
│   │     ├─ Staff Member 2 (G4)                                      │
│   │     └─ [+ Add Staff]                                            │
│   │                                                                  │
│   └─▶ 🏪 Store Code 5678                                            │
│         Ocean Park 2                                                 │
│         👤 Manager Name │ Staff: 10                                  │
│                                                                      │
│ ▶ AREA THANH HOA                                   [15 Stores]       │
└─────────────────────────────────────────────────────────────────────┘
```

## 5. Navigation

| Action | Destination |
|--------|-------------|
| Click Sidebar "User Management" > "Store information" | `/tasks/store-info` |
| Click region tab | Show region's areas and stores |
| Click area header | Expand/collapse to show stores |
| Click store card | Expand/collapse to show staff |
| Click "Permissions" button | Open Permissions Modal |
| Click "Import Excel" button | Open Import Modal |

## 6. API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/store-info/region-tabs` | GET | Get region tabs |
| `/api/v1/store-info/regions/{region}/hierarchy` | GET | Get region hierarchy |
| `/api/v1/store-info/stores/{id}` | GET | Get store detail with staff |
| `/api/v1/stores` | POST | Add new store |
| `/api/v1/stores/import` | POST | Import stores from Excel |

## 7. Implementation Status

| Feature | Backend | Frontend | Notes |
|---------|---------|----------|-------|
| Store Info Page | ✅ Done | ✅ Done | API integrated |
| Tab Navigation | ✅ Done | ✅ Done | - |
| Area Section | ✅ Done | ✅ Done | - |
| Store Cards | ✅ Done | ✅ Done | - |
| Staff List | ✅ Done | ✅ Done | - |
| Permissions Modal | ✅ Done | ✅ Done | - |
| Import Excel Modal | ✅ Done | ✅ Done | - |

---

# DETAIL SPEC

## 8. Header Section - Detail

| Component | Description | Notes |
|-----------|-------------|-------|
| Page Title | "STORE INFORMATION" | Bold font, black color |
| Subtitle | "Manage hierarchy, team members, and configure data access permissions" | Gray text |
| Permissions Button | "Permissions" button with region icon | Outlined button, gray color |
| Import Excel Button | "Import Excel" button with icon | Filled button, pink/#E5 color |

---

## 9. Tab Navigation - Detail

| Tab | Description | Notes |
|-----|-------------|-------|
| SMBU (Store) | Default tab - Total | No specific icon |
| OCEAN | Ocean region | Active tab has pink underline |
| HA NOI CENTER | Hanoi Center region | |
| ECO PARK | Eco Park region | |
| HA DONG | Ha Dong region | |
| NGO | NGO region | |

### 9.1 Tab Styling

- Active tab: Pink underline
- Inactive tab: No underline

---

## 10. Area Section - Detail

### 10.1 Area Header Card

| Component | Description | Notes |
|-----------|-------------|-------|
| Area Name | Area name (e.g., "Area Ha Nam") | Bold font, uppercase, blue background |
| Store Count | Number of stores in area | Store icon + number (e.g., "23 Stores") |
| Expand/Collapse Icon | Arrow icon (∨/∧) | Right corner, click to expand/collapse |
| Background Color | Blue background | Distinguishes from store cards |

---

## 11. Store Card - Detail

| Component | Description | Notes |
|-----------|-------------|-------|
| Store Icon | Store icon | Blue color icon |
| Store Code | Store code (e.g., code 1234) | Small text, gray, above name |
| Store Name | Store name (e.g., "Ocean Park 1") | Bold font |
| Store Manager | Store manager name | Person icon + name |
| Staff Count | Number of staff | Person icon + number (e.g., "Staff: 15") |
| Expand/Collapse Icon | Arrow icon (∨/∧) | Right corner of card |
| Indent Line | Vertical line showing Area hierarchy | Light gray, left side |

---

## 12. Department Cards in Area - Detail

| Department | Icon | Color |
|------------|------|-------|
| ZEN PARK | Triangle/delta icon | Teal (#4ACAF0) |
| CONTROL | Gear icon | Blue (#2196F3) |
| IMPROVEMENT | Diamond icon | Purple (#673572) |
| HR | Person icon | Red (#FF5182) |

---

## 13. Store Detail (When Expanded) - Detail

| Component | Description | Notes |
|-----------|-------------|-------|
| Staff List | List of staff in store | Displayed as list |
| Staff Card | Staff information card | Avatar + Name + Position |
| Staff Avatar | Staff profile picture | Circle + grade badge |
| Staff Name | Staff name | Bold font |
| Staff Position | Position (e.g., "Store Manager") | Gray text |
| Menu (three dots) | Menu options for staff | Edit/Delete options |

---

## 14. Validation Rules

| Rule | Description |
|------|-------------|
| Store code unique | Store code must be unique in the system |
| Store name required | Store name cannot be empty |
| Area required | Each store must belong to an Area |
| Region required | Each Area must belong to a Region |
| Manager assignment | Each store should have at least one Store Manager |
| Excel format | Import file must match template format |

---

## 15. API Endpoints - Detail

### Store Information API

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Get Region Tabs | GET | /api/v1/store-info/region-tabs | Get list of region tabs |
| Get Region Hierarchy | GET | /api/v1/store-info/regions/{region}/hierarchy | Get full hierarchy by region |
| Get Stores by Region | GET | /api/v1/store-info/regions/{region}/stores | Get stores list by region |
| Get Store Detail | GET | /api/v1/store-info/stores/{id} | Get store detail with staff list |
| Get Store Departments | GET | /api/v1/store-info/store-departments | Get store-level departments |

### General Store/Region APIs

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Get All Regions | GET | /api/v1/regions | Get list of all regions |
| Add Store | POST | /api/v1/stores | Add new store |
| Update Store | PUT | /api/v1/stores/{id} | Update store information |
| Delete Store | DELETE | /api/v1/stores/{id} | Delete store |
| Import Stores | POST | /api/v1/stores/import | Import stores from Excel |

---

## 16. UI States - Detail

| State Type | State | Display |
|------------|-------|---------|
| Loading | Loading | Skeleton loader for hierarchy tree |
| Loading | Expanding area/store | Spinner in card |
| Loading | Importing | Progress bar with percentage |
| Empty | No stores in area | "No stores in this area" |
| Empty | No staff in store | "No staff assigned" |
| Error | Load failed | Error message with retry button |
| Error | Import failed | Error details with highlighted error rows |
| Success | Store added | Toast "Store added successfully" |
| Success | Import complete | Toast "Import completed: X stores added" |
| Active | Tab selected | Tab has pink underline |
| Expanded | Area/Store open | Arrow icon rotates up (∧) |

---

## 17. Color Scheme - Detail

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

## 18. Connector Lines - Detail

| Component | Position | Description |
|-----------|----------|-------------|
| Area → Store | Left indent | Vertical + horizontal line from Area to Store |
| Store → Staff | Left indent | Vertical + horizontal line from Store to Staff |

---

## 19. Files Reference

```
frontend/src/
├── app/
│   └── tasks/
│       └── store-info/
│           └── page.tsx
├── components/
│   └── store/
│       ├── StoreInfoHeader.tsx
│       ├── RegionTabs.tsx
│       ├── AreaSection.tsx
│       ├── AreaHeaderCard.tsx
│       ├── StoreCard.tsx
│       ├── StaffCard.tsx
│       ├── AddStaffButton.tsx
│       ├── StorePermissionsModal.tsx
│       └── ImportExcelModal.tsx
├── types/
│   └── storeInfo.ts
└── data/
    └── mockStoreInfo.ts
```

---

## 20. Test Scenarios

### A. UI/UX Testing

| Test Case | Scenario | Expected |
|-----------|----------|----------|
| Layout check | Open Store screen | Header, tabs, hierarchy display correctly |
| Tab navigation | Click region tabs | Content changes per tab, underline moves |
| Expand Area | Click area header | Expands to show stores in area |
| Expand Store | Click store card | Expands to show staff in store |
| Icon colors | View department cards | Icon colors match department |

### B. Functional Testing

| Test Case | Scenario | Expected |
|-----------|----------|----------|
| Add new store | Click "+ Add new" → Enter info → Save | New store appears in area |
| Edit store | Click menu → Edit → Modify info → Save | Information is updated |
| Delete store | Click menu → Delete → Confirm | Store is removed from list |
| Add staff to store | Expand store → Add staff → Select staff → Save | Staff appears in store |
| Import Excel | Select file → Import → Confirm | Stores are imported successfully |
| Switch tabs | Click OCEAN tab → Click HA NOI CENTER tab | Data loads correctly per region |
| Set permissions | Click Permissions → Select store → Grant permissions → Save | Permissions are saved |

---

## 21. Changelog

| Date | Change |
|------|--------|
| 2026-01-02 | Initial specification created |
| 2026-01-02 | Implemented Store Information screen with all components |
| 2026-01-02 | Updated navigation route to `/tasks/store-info` |
| 2026-01-02 | Updated icons: Permissions button, Import Excel button, Staff icon |
| 2026-01-02 | Fixed badge G3 positioning near avatar |
| 2026-01-02 | Translated specification to English |
| 2026-01-04 | Added seed data for Store Information |
| 2026-01-04 | Created StoreInfoController with API endpoints |
| 2026-01-04 | Updated frontend to fetch data from API |
| 2026-01-04 | Implemented Permissions modal |
| 2026-01-04 | Implemented Import Excel modal |
| 2026-01-04 | Implemented store expand functionality |
| 2026-01-04 | Created StaffCard component |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
