# App General Layout - Basic Specification

> **Module**: Shared (All modules)
> **Screen ID**: APP_GENERAL
> **Applies to**: All screens
> **Last Updated**: 2026-01-08

---

## 1. Overview

| Field | Value |
|-------|-------|
| **Purpose** | Define the general application layout including Top Bar, Sidebar Menu, User Menu, Dark/Light Mode, and Language switching |
| **Target Users** | All authenticated users |
| **Entry Points** | All screens after login |

---

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | User | See consistent navigation | I can easily move between screens |
| US-02 | User | Toggle dark/light mode | I can choose my preferred theme |
| US-03 | User | Switch language | I can use the app in my language |
| US-04 | User | View notifications | I can see important updates |
| US-05 | User | Access my profile | I can manage my account |
| US-06 | User | Collapse sidebar | I can have more screen space |

---

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Top Bar | Logo, notification, user info, company logo |
| Sidebar Menu | Navigation menu with expandable items |
| User Menu Dropdown | Profile, settings, theme, language, logout |
| Welcome Card | User info card with welcome message and logout (Home page only) |
| Main Content Area | Screen-specific content |

---

## 4. Screen Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo]                    [🔔] [Avatar] User Name ▼  [Company Logo]         │ ← Top Bar
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │                                                                  │
│ Sidebar  │                     Main Content Area                            │
│ Menu     │                                                                  │
│          │                                                                  │
│ ☰ Toggle │                                                                  │
│          │                                                                  │
├──────────┴──────────────────────────────────────────────────────────────────┤
│                              Footer (optional)                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Navigation (Sidebar Menu)

| Icon | Label | Route | Parent |
|------|-------|-------|--------|
| 📋 | Task list HQ-Store | /tasks | - |
| ├─ 📝 | List task | /tasks/list | HQ-Store |
| ├─ 📄 | Detail | /tasks/detail | HQ-Store |
| └─ 💬 | Message | /tasks/messages | HQ-Store |
| ✅ | To-do Task | /tasks/todo | - |
| 📚 | Task Library | /tasks/library | - |
| 📊 | Report | /tasks/report | - |
| 👥 | User management | /users | - |
| ├─ 👤 | User information | /tasks/info | User management |
| └─ 🏪 | Store information | /tasks/store-info | User management |

---

## 6. Implementation Status

| Feature | Backend | Frontend | Deploy | Notes |
|---------|---------|----------|--------|-------|
| Top Bar | - | ✅ Done | [DEMO] | - |
| Sidebar Menu | - | ✅ Done | [DEMO] | - |
| User Menu Dropdown | - | ✅ Done | [DEMO] | - |
| Dark/Light Mode | - | ✅ Done | [DEMO] | - |
| Language Switching | - | ✅ Done | [DEMO] | - |
| Responsive Design | - | ✅ Done | [DEMO] | - |
| Welcome Card | - | ✅ Done | [DEMO] | Home page only |
| Flip Clock | - | ✅ Done | [DEMO] | Digital LED style |

---

## 7. Related Documents

| Document | Path |
|----------|------|
| Detail Spec | `docs/specs/detail/_shared/app-general-detail.md` |
| Authentication Basic | `docs/specs/basic/_shared/authentication-basic.md` |

