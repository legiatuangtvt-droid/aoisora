# Authentication Screens Specification

## Overview

This document covers the authentication flow including Sign Up, Sign In, and Forgot Password screens.

---

## 1. Sign Up Screen

### 1.1 UI Components

#### Header
- **App Logo**: "AOI SORA" text với subtitle "OptiChain"
- **Title**: "Get Started"
- **Subtitle**: "Create your account now"

#### Form Fields
| Field | Type | Icon | Placeholder | Required |
|-------|------|------|-------------|----------|
| Full name | Text Input | Group icon | "Full name" | Yes |
| Role | Dropdown Select | People icon | "Select Role" | Yes |
| Email/Phone/SAP | Text Input | Person icon | "Email or Phone Number or SAP Code" | Yes |
| Password | Password Input | Lock icon | "Password" | Yes |

#### Buttons
| Button | Type | Style |
|--------|------|-------|
| Sign up | Primary | Solid dark gray, full width |
| Sign up with Google | Social | White background, Google icon, bordered |

#### Footer Links
- Text: "Don't have an account?" với link "Sign in" (màu đỏ)

#### Background
- Gradient sky với clouds (sunrise/sunset theme)

### 1.2 Validation Rules

| Field | Rules |
|-------|-------|
| Full name | Required, min 2 characters, max 100 characters |
| Role | Required, must be valid role from dropdown |
| Email/Phone/SAP | Required, valid email format OR valid phone OR valid SAP code |
| Password | Required, min 8 characters, must contain uppercase, lowercase, number |

### 1.3 API Endpoints

<!-- TODO: Add API endpoints -->

### 1.4 User Flow

1. User mở app → Hiển thị Sign Up screen
2. User nhập Full name
3. User chọn Role từ dropdown
4. User nhập Email/Phone/SAP Code
5. User nhập Password
6. User nhấn "Sign up" hoặc "Sign up with Google"
7. Nếu thành công → Redirect to main app
8. Nếu đã có account → Click "Sign in" → Redirect to Sign In screen

---

## 2. Sign In Screen

### 2.1 UI Components

<!-- TODO: Add UI components -->

### 2.2 Validation Rules

<!-- TODO: Add validation rules -->

### 2.3 API Endpoints

<!-- TODO: Add API endpoints -->

### 2.4 User Flow

<!-- TODO: Add user flow -->

---

## 3. Forgot Password Screen

### 3.1 UI Components

<!-- TODO: Add UI components -->

### 3.2 Validation Rules

<!-- TODO: Add validation rules -->

### 3.3 API Endpoints

<!-- TODO: Add API endpoints -->

### 3.4 User Flow

<!-- TODO: Add user flow -->

---

## 4. Shared Components

### 4.1 Form Layout

<!-- TODO: Add form layout specs -->

### 4.2 Error Handling

<!-- TODO: Add error handling specs -->

### 4.3 Navigation

<!-- TODO: Add navigation between screens -->

---

## 5. Database Schema

<!-- TODO: Reference to staff table and authentication fields -->

---

## 6. Security Considerations

<!-- TODO: Add security notes (password hashing, token handling, etc.) -->
