# CHANGELOG - OptiChain WS & DWS

System design changes and feature updates.

---

## [2026-01-03] - Task List Improvements

### Changed
- **Tasks page redirect**: `/tasks` now redirects to `/tasks/list` automatically
- **DatePicker default**: Changed from WEEK to DAY (today) as default mode
- **Search input**: Added clear button (X icon) to quickly clear search text

### Added
- **Filter Modal parent-child checkbox logic**:
  - Check parent → all children checked
  - Uncheck parent → all children unchecked
  - Check child → parent also checked
  - Uncheck all children → parent automatically unchecked

### Fixed
- **Departments API**: Fixed endpoint path from `/staff/departments` to `/departments`
- **Sidebar**: Removed badge from parent menu items

### Database
- **Departments restructure**: Added `parent_id` and `sort_order` columns for hierarchical structure
- **New department structure**:
  - 1. OP → Perisable, Grocery, Delica, D&D, CS
  - 2. Admin → Admin, MMD, ACC
  - 3. Control
  - 4. Improvement
  - 5. Planning → MKT, SPA, ORD
  - 6. HR
- **Test data**: Added 50 tasks with varied statuses, priorities, and date ranges

---

## [2025-12-27] - DWS Pages Update to Match Legacy Spec

### Changes

#### 5. User Switcher Bubble (Testing Feature)
- **Floating Bubble**: Fixed position at bottom-right corner
- **Quick Role Switch**: Click to open user selection panel
- **Mock Users**: 4 predefined users with different roles
  - Manager: Full access to all features
  - Supervisor: Access to team management features
  - Staff: Access to personal tasks and schedules
- **Visual Indicators**: Color-coded by role (purple=Manager, blue=Supervisor, green=Staff)
- **Persistence**: Selected user saved to localStorage
- **Purpose**: Enable testing without login system

#### 1. DWS Shift Codes Page
- **Auto-generator Form**: Inline form (not modal) with:
  - Letter input (single A-Z character)
  - Working hours range (min-max, e.g., 4-9 hours)
  - Time range (start-end, e.g., 05:30 - 23:00)
  - "Generate Shift Codes" button
  - "Add Shift Code" button for manual entry
- **Manual Add Modal**: Shift Code, Start Time, End Time, auto-calculated duration
- **Table Display**: Index, Shift Code, Working Time, Total Hours, Delete action

#### 2. DWS Daily Schedule Page
- **Filter Bar**: Store dropdown, "Check Task" button, Week navigation (Mon-Sun)
- **Mock Data Support**: 4 sample stores, 10 staff, 5 shift codes (V8.6, V8.14, V6.8, V6.16, OFF)
- **Auto-generated Assignments**: Demo mode with random shift assignments

#### 3. DWS Workforce Dispatch Page
- **Cycle Navigation**: Payroll cycle (16th - 15th of month)
- **Mock Data**: 3 regions, 4 areas, 7 stores, 9 employees
- **Hierarchy View**: Region > Area > Store > Employee
- **Legend**: +X.Xh (surplus), -X.Xh (shortage), V8.6 (assigned), KDK (not registered), Yellow (weekend)

#### 4. Backend DATABASE_URL Validator
- **Added field_validator**: Cleans DATABASE_URL before use
  - Removes accidental `psql ` prefix
  - Removes surrounding quotes
- **Reason**: Cloud Run environment variable may have incorrect format

### Mock Data Reference
- `data-stores.json` - 58 AEON MaxValu stores
- `data-employee.json` - Employees by store
- `data-roles.json` - Roles (Staff, Store Leader G2/G3, Area Manager, etc.)
- `data-work_positions.json` - 5 work positions (Leader, MMD, POS, Merchandise, Cafe)
- `data-daily_templates.json` - Daily schedule templates

---

## [2025-12-26] - i18n System

### Added
- **i18n system**: Support for 3 languages (English, Japanese, Vietnamese)
- **LanguageContext**: React context for language management
- **LanguageSwitcher component**: 3 variants (dropdown, buttons, compact)
- **Translation files**: en.ts, ja.ts, vi.ts

---

## [2025-12-25] - DWS Module

### Added
- **DWS Landing Page** (`/dws`): Links to Daily Schedule, Workforce Dispatch, Shift Codes
- **Shift Codes Page**: Basic CRUD interface
- **Daily Schedule Page**: Weekly calendar view
- **Workforce Dispatch Page**: Hierarchy-based dispatch view

---

## [2025-12-24] - Phase 1 Backend APIs

### Added
- Staff CRUD APIs
- Store CRUD APIs
- Task CRUD APIs
- Shift Code CRUD APIs
- Shift Assignment APIs
- Notification APIs

---

## Changelog Guidelines

1. **Date**: Format [YYYY-MM-DD]
2. **Short Description**: Title of change
3. **Details**: Added, Changed, Fixed, Removed
4. **Reason** (if needed): Why the change was made
