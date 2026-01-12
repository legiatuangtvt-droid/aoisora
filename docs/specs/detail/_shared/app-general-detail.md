# App General Layout - Detail Specification

> **Module**: Shared (All modules)
> **Screen ID**: APP_GENERAL
> **Applies to**: All screens
> **Last Updated**: 2026-01-08

---

## 1. Top Bar - Detail

| Element | Description | Position |
|---------|-------------|----------|
| Logo | Application logo (OptiChain) | Left |
| Notification Icon | Bell icon with badge counter | Right side |
| User Avatar | Circular user profile image | Right of notification |
| User Name | Display name of logged-in user | Right of avatar |
| User Role | Role badge (e.g., "Admin", "User") | Below user name |
| Dropdown Arrow | Opens User Menu Dropdown | Right of user info |
| Company Logo | Partner/Company logo | Far right |

### 1.1 Top Bar Styling

| Property | Value |
|----------|-------|
| Background | White (light mode) / Dark gray (dark mode) |
| Height | 64px |
| Shadow | Subtle bottom shadow |
| Position | Fixed at top |

---

## 2. Sidebar Menu - Detail

### 2.1 Dimensions

| Property | Value |
|----------|-------|
| Expanded Width | 240px |
| Collapsed Width | 64px (icons only) |

### 2.2 Behavior

- Expanded mode: Show icon + label
- Collapsed mode: Show icon only with tooltip on hover
- State persisted in localStorage
- Smooth transition animation (300ms)
- Parent menus are expandable/collapsible with arrow indicator
- Child items indented with left border line

### 2.3 UI/UX Enhancements

| Feature | Description |
|---------|-------------|
| Gradient background | For active/hover states |
| Scale animation | Hover: `scale-[1.02]`, Click: `scale-[0.98]` |
| Icon rotation | `rotate-3` on hover |
| Ripple effect | On click |
| Active indicator | Gradient bar from `#C5055B` to `#E5457B` |
| Children count badge | When sidebar is collapsed |
| Custom scrollbar | Thin with hover effect |
| Fade gradients | Top/bottom edges |

---

## 3. User Menu Dropdown - Detail

| Item | Icon | Action |
|------|------|--------|
| Light Mode / Dark Mode | 🌙/☀️ | Toggle dark/light mode |
| My Profile | 👤 | Navigate to /profile |
| Account Settings | ⚙️ | Navigate to /settings |
| Language | 🌐 | Open language submenu |
| Help / Support | ❓ | Navigate to /help |
| Logout | 🚪 | Logout and redirect to /login |

### 3.1 Dropdown Styling

| Property | Value |
|----------|-------|
| Width | 240px |
| Border radius | 8px |
| Shadow | Medium elevation |
| Position | Below user avatar, right-aligned |

---

## 4. Dark/Light Mode - Detail

| Mode | Background | Text | Primary Color |
|------|------------|------|---------------|
| Light | #FFFFFF | #1F2937 | #C5055B |
| Dark | #1F2937 | #F9FAFB | #E91E8C |

### 4.1 Implementation

- Use CSS variables for theme colors
- Toggle via User Menu or system preference
- Store preference in localStorage
- Apply `dark` class to `<html>` element
- Global dark mode styles in `globals.css`

---

## 5. Language Switching - Detail

| Code | Label | Flag |
|------|-------|------|
| vi-VN | Tieng Viet | 🇻🇳 |
| en-US | English | 🇺🇸 |
| ja-JP | 日本語 | 🇯🇵 |

### 5.1 Implementation

- Use next-intl or similar i18n library
- Store preference in localStorage
- Default to browser language or vi-VN

---

## 6. Welcome Card (Home Page) - Detail

### 6.1 Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Avatar]  Good morning, {User Full Name}!        [Log Out]     │
│            {Role}                                               │
├─────────────────────────────────────────────────────────────────┤
│  [📅] Tuesday, January 7, 2026              [🕐] 10:30:45 AM    │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Components

| Element | Description |
|---------|-------------|
| Avatar | Circular div with first letter of user's name, sky-500 background |
| Greeting | Dynamic greeting based on time |
| User Name | User's full name in gray-800 bold |
| Role | User role displayed in sky-600 |
| Date | Current date with calendar icon |
| Digital Clock | LED-style clock with flip animation |
| Log Out Button | Gray button with logout icon |

### 6.3 Dynamic Greeting Rules

| Time Range | Greeting |
|------------|----------|
| 05:00 - 11:59 | Good morning |
| 12:00 - 16:59 | Good afternoon |
| 17:00 - 20:59 | Good evening |
| 21:00 - 04:59 | Good night |

### 6.4 Styling

| Property | Value |
|----------|-------|
| Background | white/90 with backdrop blur |
| Border Radius | 2xl (1rem) |
| Shadow | lg |
| Padding | 5 (1.25rem) |
| Max Width | 4xl (56rem) |
| Layout | Flexbox, space-between |

### 6.5 Flip Clock Styling

```
┌────┐ ┌────┐   ┌────┐ ┌────┐   ┌────┐ ┌────┐
│ 1  │ │ 0  │ : │ 3  │ │ 0  │ : │ 4  │ │ 5  │
│ ── │ │ ── │   │ ── │ │ ── │   │ ── │ │ ── │  ← flip line
│    │ │    │   │    │ │    │   │    │ │    │
└────┘ └────┘   └────┘ └────┘   └────┘ └────┘
  H1     H2       M1     M2       S1     S2
```

| Property | Value |
|----------|-------|
| Card Size | w-10 h-14 (40x56px) |
| Background | Gradient from gray-700 to gray-900 |
| Text Color | emerald-400 (LED green) |
| Font | Orbitron (Google Font) |
| Font Class | `font-digital` |
| Separator | Dual dots, emerald-400, animate-pulse |
| Animation | 3D flip effect (0.6s total) |
| Perspective | 500px |

### 6.6 Flip Animation

| Phase | Duration | Effect |
|-------|----------|--------|
| Top card flip | 0.3s | Rotates from 0deg to -90deg (flips down) |
| Bottom card flip | 0.3s | Rotates from 90deg to 0deg (flips up) |
| Total | 0.6s | Seamless card transition |

### 6.7 Component Structure

```
FlipClock/
├── FlipCard (x6)          # Individual digit cards
│   ├── Static base        # Shows new value
│   ├── Top half mask      # Upper portion of digit
│   ├── Bottom half mask   # Lower portion of digit
│   ├── Flip top (animated)# Old value flipping down
│   └── Flip bottom (anim) # New value flipping up
└── Separators (x2)        # Blinking colon dots
```

### 6.8 Behavior

- Only visible when `isAuthenticated` is true
- Logout button shows loading spinner during logout process
- After logout, redirects to `/auth/signin`
- Clock updates every second using `setInterval`
- Date format: "weekday, month day, year"
- Time format: 24-hour digital display

---

## 7. Responsive Behavior

| Breakpoint | Sidebar | Top Bar |
|------------|---------|---------|
| Desktop (≥1024px) | Expandable/Collapsible | Full |
| Tablet (768-1023px) | Collapsed by default | Full |
| Mobile (<768px) | Overlay drawer | Hamburger menu |

---

## 8. Data Types

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

## 9. Files Reference

### 9.1 Frontend (Next.js)

| Feature | File |
|---------|------|
| Root Layout | `frontend/src/app/layout.tsx` |
| Main Layout | `frontend/src/components/layout/Layout.tsx` |
| Top Bar | `frontend/src/components/layout/TopBar.tsx` |
| Sidebar | `frontend/src/components/layout/Sidebar.tsx` |
| User Menu | `frontend/src/components/layout/UserMenu.tsx` |
| Notification | `frontend/src/components/layout/NotificationBell.tsx` |
| Theme Toggle | `frontend/src/components/ui/ThemeToggle.tsx` |
| Theme Context | `frontend/src/contexts/ThemeContext.tsx` |
| Sidebar Context | `frontend/src/contexts/SidebarContext.tsx` |
| Language Context | `frontend/src/contexts/LanguageContext.tsx` |

---

## 10. Job Grades & Permissions System

### 10.1 Overview

The application has **two parallel permission systems**:
- **HQ Job Grades** (G2-G9): For Headquarter staff
- **Store Job Grades** (S1-S6): For Store staff

### 10.2 HQ Job Grades (Headquarter)

| Code | Title | Vietnamese | Level | Color | Management Scope |
|------|-------|------------|-------|-------|------------------|
| **G2** | Officer | Nhân viên | 1 | Gray (#9CA3AF) | NONE |
| **G3** | Executive | Chuyên viên | 2 | Teal (#22A6A1) | NONE |
| **G4** | Deputy Manager | Phó Trưởng phòng | 3 | Blue (#1F7BF2) | TEAM |
| **G5** | Manager | Trưởng phòng | 4 | Purple (#8B5CF6) | DEPARTMENT |
| **G6** | General Manager | Tổng Giám đốc phòng | 5 | Orange (#FF9900) | DEPARTMENT |
| **G7** | Senior General Manager | Giám đốc khối | 6 | Red (#DC2626) | DIVISION |
| **G8** | CCO | Giám đốc điều hành | 7 | Dark Red (#991B1B) | COMPANY |
| **G9** | General Director | Tổng Giám đốc | 8 | Purple (#7C3AED) | COMPANY |

### 10.3 Store Job Grades (Store)

| Code | Title | Vietnamese | Level | Color | Management Scope |
|------|-------|------------|-------|-------|------------------|
| **S1** | Staff | Nhân viên cửa hàng | 1 | Gray (#9CA3AF) | NONE |
| **S2** | Store Leader G2 | Phó Trưởng cửa hàng | 2 | Light Blue (#81AADB) | STORE |
| **S3** | Store Leader G3 | Trưởng cửa hàng | 3 | Teal (#22A6A1) | STORE |
| **S4** | Store In-charge (SI) | Trưởng cụm cửa hàng | 4 | Blue (#1F7BF2) | MULTI_STORE |
| **S5** | Area Manager | Quản lý khu vực | 5 | Purple (#8B5CF6) | AREA |
| **S6** | Region Manager | Quản lý miền | 6 | Orange (#FF9900) | REGION |

### 10.4 Hierarchy Structure

```
HQ Staff Hierarchy:
  G9 (GD) → G8 (CCO) → G7 (SGM) → G6 (GM) → G5 (Manager) → G4 (Deputy) → G3 (Executive) → G2 (Officer)

Store Staff Hierarchy:
  S6 (Region Manager) → S5 (Area Manager) → S4 (SI) → S3 (Store Leader G3) → S2 (Store Leader G2) → S1 (Staff)

Organization Hierarchy:
  Company
    ├── Divisions (Khối)
    │     └── Departments (Phòng ban)
    │           └── Teams (Nhóm)
    └── Regions (Miền)
          └── Areas (Khu vực)
                └── Stores (Cửa hàng)
                      └── Store Departments (Bộ phận)
```

### 10.5 Permission Logic

**Data Access Rules by Grade:**

| Grade | Access Scope | Example |
|-------|--------------|---------|
| G9, G8 | All company data | View all tasks, all stores, all reports |
| G7 | Division-level data | View tasks/staff in managed division |
| G6, G5 | Department-level data | View tasks/staff in managed department |
| G4 | Team-level data | View tasks/staff in managed team |
| G3, G2 | Own data only | View only assigned tasks |
| S6 | Region-level data | View all stores in region |
| S5 | Area-level data | View all stores in area |
| S4 | Store cluster data | View stores in cluster |
| S3, S2 | Store-level data | View staff/tasks in own store |
| S1 | Own data only | View only assigned tasks |

### 10.6 Implementation Notes

**JWT Token contains:**
```json
{
  "staff_id": 123,
  "grade_code": "G5",
  "grade_type": "HQ",
  "department_id": 10,
  "division_id": 2,
  "store_id": null,
  "region_id": null,
  "area_id": null
}
```

**Backend automatically filters data based on:**
1. `grade_code` + `grade_type` → Determine access scope
2. Organizational unit IDs (department_id, store_id, etc.) → Apply filters
3. No need for frontend to send staff_id or scope parameters

**Frontend usage:**
- Display grade badge with corresponding color
- Show/hide features based on grade level
- Navigate to appropriate screens based on management scope

---

## 11. Changelog

| Date | Change |
|------|--------|
| 2024-12-28 | Initial spec documentation |
| 2025-12-29 | Apply global dark mode styles to all pages via globals.css |
| 2025-12-29 | Update theme toggle to show current state (Light Mode/Dark Mode) |
| 2026-01-02 | Enhanced sidebar UI/UX: gradient states, animations, scroll improvements |
| 2026-01-02 | Added User management submenu (User info, Store info) |
| 2026-01-02 | Added custom scrollbar styles to globals.css |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
| 2026-01-07 | Added Welcome Card component on Home page |
| 2026-01-07 | Enhanced Welcome Card with dynamic greeting, live date/time display |
| 2026-01-07 | Redesigned clock to digital LED style |
| 2026-01-07 | Upgraded to Flip Clock with 3D card-flip animation effect |
| 2026-01-07 | Added Orbitron font for calculator/LCD style digits |
| 2026-01-08 | Split spec into basic and detail files |
| 2026-01-08 | Added Job Grades & Permissions System section (HQ G2-G9, Store S1-S6) |

---

## 12. Related Documents

| Document | Path |
|----------|------|
| Basic Spec | `docs/specs/basic/_shared/app-general-basic.md` |
| Authentication Basic | `docs/specs/basic/_shared/authentication-basic.md` |

