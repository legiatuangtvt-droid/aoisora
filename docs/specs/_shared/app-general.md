# App General Layout Specification

---

# BASIC SPEC

## 1. Overview

- **Screen ID**: APP_GENERAL
- **Applies to**: All screens
- **Purpose**: Define the general application layout including Top Bar, Sidebar Menu, User Menu, Dark/Light Mode, and Language switching
- **Status**: Implementation Complete (Frontend)

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | User | See consistent navigation | I can easily move between screens |
| US-02 | User | Toggle dark/light mode | I can choose my preferred theme |
| US-03 | User | Switch language | I can use the app in my language |
| US-04 | User | View notifications | I can see important updates |
| US-05 | User | Access my profile | I can manage my account |
| US-06 | User | Collapse sidebar | I can have more screen space |

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Top Bar | Logo, notification, user info, company logo |
| Sidebar Menu | Navigation menu with expandable items |
| User Menu Dropdown | Profile, settings, theme, language, logout |
| Welcome Card | User info card with welcome message and logout (Home page only) |
| Main Content Area | Screen-specific content |

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

## 6. Implementation Status

| Feature | Backend | Frontend | Notes |
|---------|---------|----------|-------|
| Top Bar | - | ✅ Done | - |
| Sidebar Menu | - | ✅ Done | - |
| User Menu Dropdown | - | ✅ Done | - |
| Dark/Light Mode | - | ✅ Done | - |
| Language Switching | - | ✅ Done | - |
| Responsive Design | - | ✅ Done | - |

---

# DETAIL SPEC

## 7. Top Bar - Detail

| Element | Description | Position |
|---------|-------------|----------|
| Logo | Application logo (OptiChain) | Left |
| Notification Icon | Bell icon with badge counter | Right side |
| User Avatar | Circular user profile image | Right of notification |
| User Name | Display name of logged-in user | Right of avatar |
| User Role | Role badge (e.g., "Admin", "User") | Below user name |
| Dropdown Arrow | Opens User Menu Dropdown | Right of user info |
| Company Logo | Partner/Company logo | Far right |

### 7.1 Top Bar Styling

- Background: White (light mode) / Dark gray (dark mode)
- Height: 64px
- Shadow: subtle bottom shadow
- Fixed position at top

---

## 8. Sidebar Menu - Detail

### 8.1 Dimensions

| Property | Value |
|----------|-------|
| Expanded Width | 240px |
| Collapsed Width | 64px (icons only) |

### 8.2 Behavior

- Expanded mode: Show icon + label
- Collapsed mode: Show icon only with tooltip on hover
- State persisted in localStorage
- Smooth transition animation (300ms)
- Parent menus are expandable/collapsible with arrow indicator
- Child items indented with left border line

### 8.3 UI/UX Enhancements

- Gradient background for active/hover states
- Scale animation on hover (`scale-[1.02]`) and click (`scale-[0.98]`)
- Icon rotation on hover (`rotate-3`)
- Ripple effect on click
- Gradient active indicator bar (from `#C5055B` to `#E5457B`)
- Children count badge when sidebar is collapsed
- Tooltip with item count preview
- Custom thin scrollbar with hover effect
- Top/bottom fade gradients
- Smooth scrolling

---

## 9. User Menu Dropdown - Detail

| Item | Icon | Action |
|------|------|--------|
| Light Mode / Dark Mode | 🌙/☀️ | Toggle dark/light mode |
| My Profile | 👤 | Navigate to /profile |
| Account Settings | ⚙️ | Navigate to /settings |
| Language | 🌐 | Open language submenu |
| Help / Support | ❓ | Navigate to /help |
| Logout | 🚪 | Logout and redirect to /login |

### 9.1 Dropdown Styling

- Dropdown width: 240px
- Border radius: 8px
- Shadow: medium elevation
- Position: Below user avatar, right-aligned

---

## 10. Dark/Light Mode - Detail

| Mode | Background | Text | Primary Color |
|------|------------|------|---------------|
| Light | #FFFFFF | #1F2937 | #C5055B |
| Dark | #1F2937 | #F9FAFB | #E91E8C |

### 10.1 Implementation

- Use CSS variables for theme colors
- Toggle via User Menu or system preference
- Store preference in localStorage
- Apply `dark` class to `<html>` element
- Global dark mode styles in `globals.css`

---

## 11. Language Switching - Detail

| Code | Label | Flag |
|------|-------|------|
| vi-VN | Tieng Viet | 🇻🇳 |
| en-US | English | 🇺🇸 |
| ja-JP | 日本語 | 🇯🇵 |

### 11.1 Implementation

- Use next-intl or similar i18n library
- Store preference in localStorage
- Default to browser language or vi-VN

---

## 12. Data Types

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

## 13. Files Reference

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

## 14. Welcome Card (Home Page) - Detail

The Welcome Card is displayed on the Home page (`/`) when the user is authenticated. It provides a personalized greeting and quick access to logout.

### 14.1 Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Avatar]  Good morning, {User Full Name}!        [Log Out]     │
│            {Role}                                               │
├─────────────────────────────────────────────────────────────────┤
│  [📅] Tuesday, January 7, 2026              [🕐] 10:30:45 AM    │
└─────────────────────────────────────────────────────────────────┘
```

### 14.2 Components

| Element | Description |
|---------|-------------|
| Avatar | Circular div with first letter of user's name, sky-500 background |
| Greeting | Dynamic greeting based on time (Good morning/afternoon/evening/night) |
| User Name | User's full name in gray-800 bold |
| Role | User role displayed in sky-600 (optional) |
| Date | Current date with calendar icon (weekday, month day, year) |
| Digital Clock | LED-style clock with separate segments for HH:MM:SS, dark background with emerald-400 text |
| Log Out Button | Gray button with logout icon, shows loading spinner when clicked |

### 14.2.1 Dynamic Greeting Rules

| Time Range | Greeting |
|------------|----------|
| 05:00 - 11:59 | Good morning |
| 12:00 - 16:59 | Good afternoon |
| 17:00 - 20:59 | Good evening |
| 21:00 - 04:59 | Good night |

### 14.3 Styling

| Property | Value |
|----------|-------|
| Background | white/90 with backdrop blur |
| Border Radius | 2xl (1rem) |
| Shadow | lg |
| Padding | 5 (1.25rem) |
| Max Width | 4xl (56rem) |
| Layout | Flexbox, space-between |

### 14.4 Flip Clock Styling

The clock uses a flip-card animation style, similar to classic airport departure boards.

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
| Font | Orbitron (Google Font) - calculator/LCD style |
| Font Class | `font-digital` (via CSS variable `--font-digital`) |
| Separator | Dual dots, emerald-400, animate-pulse |
| Animation | 3D flip effect (0.6s total) |
| Perspective | 500px |

### 14.4.1 Flip Animation

| Phase | Duration | Effect |
|-------|----------|--------|
| Top card flip | 0.3s | Rotates from 0deg to -90deg (flips down) |
| Bottom card flip | 0.3s | Rotates from 90deg to 0deg (flips up) |
| Total | 0.6s | Seamless card transition |

### 14.4.2 Component Structure

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

### 14.5 Behavior

- Only visible when `isAuthenticated` is true
- Logout button shows loading spinner during logout process
- After logout, redirects to `/auth/signin`
- Clock updates every second using `setInterval`
- Date format: "weekday, month day, year" (e.g., "Tuesday, January 7, 2026")
- Time format: 24-hour digital display (e.g., "10:30:45")

---

## 15. Responsive Behavior

| Breakpoint | Sidebar | Top Bar |
|------------|---------|---------|
| Desktop (≥1024px) | Expandable/Collapsible | Full |
| Tablet (768-1023px) | Collapsed by default | Full |
| Mobile (<768px) | Overlay drawer | Hamburger menu |

---

## 16. Changelog

| Date | Changes |
|------|---------|
| 2024-12-28 | Initial spec documentation |
| 2025-12-29 | Apply global dark mode styles to all pages via globals.css |
| 2025-12-29 | Update theme toggle to show current state (Light Mode/Dark Mode) |
| 2026-01-02 | Enhanced sidebar UI/UX: gradient states, animations, scroll improvements |
| 2026-01-02 | Added User management submenu (User info, Store info) |
| 2026-01-02 | Added custom scrollbar styles to globals.css |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
| 2026-01-07 | Added Welcome Card component on Home page (avatar, welcome message, logout button) |
| 2026-01-07 | Enhanced Welcome Card with dynamic greeting, live date/time display |
| 2026-01-07 | Redesigned clock to digital LED style with emerald-400 color and blinking colons |
| 2026-01-07 | Upgraded to Flip Clock with 3D card-flip animation effect |
| 2026-01-07 | Added Orbitron font for calculator/LCD style digits |
