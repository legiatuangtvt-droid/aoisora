# User Information - Basic Specification

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_USER_INFO
> **Route**: `/tasks/info`
> **Last Updated**: 2026-01-08

---

## 1. Overview

| Field | Value |
|-------|-------|
| **Purpose** | Manage and track user lists (Hierarchy), Team members and organization structure |
| **Target Users** | HQ staff with management permissions |
| **Entry Points** | Sidebar "User Management" > "User information" |

---

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

---

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Header | Title "USER INFORMATION" with Permissions and Import buttons |
| Tab Navigation | Department tabs: SMBU, Admin, OP, GP, etc. |
| Hierarchy Tree | Expandable tree showing departments, teams, members |
| Employee Detail Modal | Popup showing full employee information |
| Permissions Modal | Configure user/role permissions |
| Import Excel Modal | Upload and preview Excel data |

---

## 4. Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ USER INFORMATION                     [Permissions] [Import Excel]    │
│ Team members and organization management                             │
├─────────────────────────────────────────────────────────────────────┤
│ [SMBU] [Admin] [OP] [GP] [CONTROL] [IMPROVEMENT] [HR] [MG]          │
├─────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────┐                              │
│ │ VP/Director Name (G5)        [...]  │ ← Root User Card             │
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

---

## 5. Navigation

| Action | Destination | Description |
|--------|-------------|-------------|
| Click Sidebar "User information" | `/tasks/info` | Open User Information |
| Click department tab | - | Show department hierarchy |
| Click member card | - | Open Employee Detail Modal |
| Click "+ Add new member" | - | Open Add Team/Member Modal |
| Click "Permissions" button | - | Open Permissions Modal |
| Click "Import Excel" button | - | Open Import Modal |

---

## 6. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/user-info/smbu-hierarchy` | Get SMBU hierarchy |
| GET | `/api/v1/user-info/departments/{id}/hierarchy` | Get department hierarchy |
| GET | `/api/v1/user-info/staff/{id}` | Get staff detail |
| POST | `/api/v1/user-info/teams` | Create new team |
| POST | `/api/v1/user-info/members` | Create new member |
| POST | `/api/v1/user-info/permissions` | Save permissions |
| POST | `/api/v1/user-info/import` | Import from Excel |

---

## 7. Implementation Status

| Feature | Backend | Frontend | Deploy | Notes |
|---------|---------|----------|--------|-------|
| User Info Page | ✅ Done | ✅ Done | [DEMO] | API integrated |
| Tab Navigation | ✅ Done | ✅ Done | [DEMO] | - |
| Hierarchy Tree | ✅ Done | ✅ Done | [DEMO] | - |
| Employee Detail Modal | ✅ Done | ✅ Done | [DEMO] | - |
| Add Team/Member Modal | ✅ Done | ✅ Done | [DEMO] | - |
| Permissions Modal | ✅ Done | ✅ Done | [DEMO] | - |
| Import Excel Modal | ✅ Done | ✅ Done | [LOCAL-DEV] | File processing |

---

## 8. Job Grades

| Code | Title |
|------|-------|
| G1 | Officer |
| G3 | Executive |
| G4 | Deputy Manager |
| G5 | Manager |
| G6 | General Manager |
| G7 | Senior General Manager |
| G8 | CCO |

---

## 9. Related Documents

| Document | Path |
|----------|------|
| Detail Spec | `docs/specs/detail/ws/user-information-detail.md` |
| Store Information Basic | `docs/specs/basic/ws/store-information-basic.md` |
