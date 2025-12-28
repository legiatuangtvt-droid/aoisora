# App General Layout Specification

> **Status**: Implementation Complete (Frontend)
> **Last Updated**: 2024-12-28
> **Screen ID**: APP_GENERAL
> **Applies to**: All screens

---

## 1. Overview

This specification defines the general application layout including Top Bar, Sidebar Menu, User Menu Dropdown, Dark/Light Mode, and Language switching.

---

## 2. Screen Layout

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

## 3. Components

### 3.1 Top Bar

| Element | Description | Position | Status |
|---------|-------------|----------|--------|
| Logo | Application logo (OptiChain) | Left | ✅ Implemented |
| Notification Icon | Bell icon with badge counter | Right side | ✅ Implemented |
| User Avatar | Circular user profile image | Right of notification | ✅ Implemented |
| User Name | Display name of logged-in user | Right of avatar | ✅ Implemented |
| User Role | Role badge (e.g., "Admin", "User") | Below user name | ✅ Implemented |
| Dropdown Arrow | Opens User Menu Dropdown | Right of user info | ✅ Implemented |
| Company Logo | Partner/Company logo | Far right | ✅ Implemented |

**Styling:**
- Background: White (light mode) / Dark gray (dark mode)
- Height: 64px
- Shadow: subtle bottom shadow
- Fixed position at top

### 3.2 Sidebar Menu

| Feature | Description | Status |
|---------|-------------|--------|
| Toggle Button | Expand/Collapse sidebar | ✅ Implemented |
| Expanded Width | 240px | ✅ Implemented |
| Collapsed Width | 64px (icons only) | ✅ Implemented |
| Active Item | Highlighted with accent color | ✅ Implemented |
| Hover Effect | Light background on hover | ✅ Implemented |

**Menu Items (Hierarchical Structure):**

| Icon | Label | Route | Parent | Status |
|------|-------|-------|--------|--------|
| 📋 | Task list HQ-Store | /tasks | - | ✅ Parent menu |
| ├─ 📝 | List task | /tasks/list | HQ-Store | ✅ Implemented |
| ├─ 📄 | Detail | /tasks/detail | HQ-Store | ✅ Implemented |
| └─ 💬 | Message | /tasks/messages | HQ-Store | ✅ Implemented |
| ✅ | To-do Task | /todo | - | ✅ Menu item added |
| 📚 | Task Library | /library | - | ✅ Menu item added |
| 📊 | Report | /reports | - | ✅ Menu item added |
| 👥 | User management | /users | - | ✅ Menu item added |

**Behavior:**
- Expanded mode: Show icon + label
- Collapsed mode: Show icon only with tooltip on hover
- State persisted in localStorage
- Smooth transition animation (300ms)
- Parent menus are expandable/collapsible with arrow indicator
- Child items indented with left border line

### 3.3 User Menu Dropdown

| Item | Icon | Action | Status |
|------|------|--------|--------|
| Dark Mode | 🌙/☀️ | Toggle dark/light mode | ✅ Implemented |
| My Profile | 👤 | Navigate to /profile | ✅ Implemented |
| Account Settings | ⚙️ | Navigate to /settings | ✅ Implemented |
| Language | 🌐 | Open language submenu | ✅ Implemented |
| Help / Support | ❓ | Navigate to /help | ✅ Implemented |
| Logout | 🚪 | Logout and redirect to /login | ✅ Implemented |

**Styling:**
- Dropdown width: 240px
- Border radius: 8px
- Shadow: medium elevation
- Position: Below user avatar, right-aligned

### 3.4 Dark/Light Mode

| Mode | Background | Text | Primary Color |
|------|------------|------|---------------|
| Light | #FFFFFF | #1F2937 | #C5055B |
| Dark | #1F2937 | #F9FAFB | #E91E8C |

**Implementation:**
- Use CSS variables for theme colors
- Toggle via User Menu or system preference
- Store preference in localStorage
- Apply `dark` class to `<html>` element

### 3.5 Language Switching

| Code | Label | Flag | Status |
|------|-------|------|--------|
| vi-VN | Tieng Viet | 🇻🇳 | ✅ Implemented |
| en-US | English | 🇺🇸 | ✅ Implemented |
| ja-JP | 日本語 | 🇯🇵 | ✅ Implemented |

**Implementation:**
- Use next-intl or similar i18n library
- Store preference in localStorage
- Default to browser language or vi-VN

---

## 4. Data Types

```typescript
// User interface
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'user';
}

// Notification interface
interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Menu item interface
interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
  children?: MenuItem[];
}

// Theme type
type Theme = 'light' | 'dark' | 'system';

// Language type
type Language = 'vi-VN' | 'en-US' | 'ja-JP';

// Sidebar state
interface SidebarState {
  isExpanded: boolean;
  activeItemId: string;
}
```

---

## 5. File Structure

```
frontend/src/
├── app/
│   └── layout.tsx              # Root layout with providers
├── components/
│   ├── layout/
│   │   ├── Layout.tsx          # Main layout wrapper
│   │   ├── TopBar.tsx          # Top navigation bar
│   │   ├── Sidebar.tsx         # Side navigation menu
│   │   ├── UserMenu.tsx        # User dropdown menu
│   │   └── NotificationBell.tsx # Notification component
│   └── ui/
│       └── ThemeToggle.tsx     # Dark/Light mode toggle
├── contexts/
│   ├── ThemeContext.tsx        # Theme provider
│   ├── SidebarContext.tsx      # Sidebar state provider
│   └── LanguageContext.tsx     # Language provider
├── hooks/
│   ├── useTheme.ts             # Theme hook
│   └── useLanguage.ts          # Language hook
└── types/
    └── layout.ts               # Layout type definitions
```

---

## 6. Responsive Behavior

| Breakpoint | Sidebar | Top Bar |
|------------|---------|---------|
| Desktop (≥1024px) | Expandable/Collapsible | Full |
| Tablet (768-1023px) | Collapsed by default | Full |
| Mobile (<768px) | Overlay drawer | Hamburger menu |

---

## 7. Changelog

| Date | Changes |
|------|---------|
| 2024-12-28 | Initial spec documentation |

