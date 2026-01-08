# Store Information - Basic Specification

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_STORE_INFO
> **Route**: `/tasks/store-info`
> **Last Updated**: 2026-01-08

---

## 1. Overview

| Field | Value |
|-------|-------|
| **Purpose** | Manage store information by geographic regions/areas, store lists and staff at each store |
| **Target Users** | HQ staff with management permissions |
| **Entry Points** | Sidebar "User Management" > "Store information" |

---

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

---

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

---

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
│   ├─▼ Store Code 1234                                               │
│   │     Ocean Park 1                                                 │
│   │     Manager: Hoang Huong Giang │ Staff: 15                      │
│   │     ├─ Staff Member 1 (G3)                                      │
│   │     ├─ Staff Member 2 (G4)                                      │
│   │     └─ [+ Add Staff]                                            │
│   │                                                                  │
│   └─▶ Store Code 5678                                               │
│         Ocean Park 2                                                 │
│         Manager Name │ Staff: 10                                     │
│                                                                      │
│ ▶ AREA THANH HOA                                   [15 Stores]       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Navigation

| Action | Destination | Description |
|--------|-------------|-------------|
| Click Sidebar "Store information" | `/tasks/store-info` | Open Store Information |
| Click region tab | - | Show region's areas and stores |
| Click area header | - | Expand/collapse to show stores |
| Click store card | - | Expand/collapse to show staff |
| Click "Permissions" button | - | Open Permissions Modal |
| Click "Import Excel" button | - | Open Import Modal |

---

## 6. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/store-info/region-tabs` | Get region tabs |
| GET | `/api/v1/store-info/regions/{region}/hierarchy` | Get region hierarchy |
| GET | `/api/v1/store-info/stores/{id}` | Get store detail with staff |
| POST | `/api/v1/stores` | Add new store |
| PUT | `/api/v1/stores/{id}` | Update store |
| DELETE | `/api/v1/stores/{id}` | Delete store |
| POST | `/api/v1/stores/import` | Import stores from Excel |

---

## 7. Implementation Status

| Feature | Backend | Frontend | Deploy | Notes |
|---------|---------|----------|--------|-------|
| Store Info Page | ✅ Done | ✅ Done | [DEMO] | API integrated |
| Tab Navigation | ✅ Done | ✅ Done | [DEMO] | - |
| Area Section | ✅ Done | ✅ Done | [DEMO] | - |
| Store Cards | ✅ Done | ✅ Done | [DEMO] | - |
| Staff List | ✅ Done | ✅ Done | [DEMO] | - |
| Permissions Modal | ✅ Done | ✅ Done | [DEMO] | - |
| Import Excel Modal | ✅ Done | ✅ Done | [LOCAL-DEV] | File processing |

---

## 8. Related Documents

| Document | Path |
|----------|------|
| Detail Spec | `docs/specs/ws/store-information-detail.md` |
| User Information Basic | `docs/specs/ws/user-information-basic.md` |
