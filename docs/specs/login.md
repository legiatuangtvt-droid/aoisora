# Authentication Screens Specification

## Overview

This document covers the authentication flow including Sign In, Sign Up, and Forgot Password screens.

---

## 1. Sign In Screen

### 1.1 UI Components

<!-- TODO: Add UI components -->

### 1.2 Validation Rules

<!-- TODO: Add validation rules -->

### 1.3 API Endpoints

<!-- TODO: Add API endpoints -->

### 1.4 User Flow

<!-- TODO: Add user flow -->

---

## 2. Sign Up Screen

### 2.1 UI Components

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

#### Input States
| State | Style |
|-------|-------|
| Empty (Placeholder) | Text màu xám nhạt (#9CA3AF) |
| Filled | Text màu đen đậm (#1F2937), font weight normal |
| Focus | Border bottom highlight |
| Error | Border màu đỏ, error message bên dưới |

#### Password Strength Indicator
| Strength | Label | Color |
|----------|-------|-------|
| Weak | "Weak!" | Red (#EF4444) |
| Medium | "Medium" | Orange (#F59E0B) |
| Strong | "Strong!" | Green (#22C55E) |

- Hiển thị bên phải của password field
- Cập nhật real-time khi user nhập password

#### Buttons
| Button | State | Style |
|--------|-------|-------|
| Sign up | Disabled | Background màu xám nhạt (#D1D5DB), text màu xám (#9CA3AF), không cho phép click |
| Sign up | Enabled | Background màu xanh đậm (#1E3A5F), text màu trắng, cho phép click |
| Sign up with Google | Default | White background, Google icon, bordered |

#### Button Enable Conditions
Button "Sign up" chỉ được enable (đổi màu xanh đậm) khi **TẤT CẢ** điều kiện sau được thỏa mãn:
1. Full name đã được nhập (không rỗng)
2. Role đã được chọn từ dropdown
3. Email/Phone/SAP đã được nhập và đúng format
4. Password đã được nhập và đạt độ mạnh tối thiểu "Medium"

#### Footer Links
- Text: "Already have an account?" với link "Sign in" (màu đỏ)

#### Background
- Gradient sky với clouds (sunrise/sunset theme)

### 2.2 Validation Rules

| Field | Rules |
|-------|-------|
| Full name | Required, min 2 characters, max 100 characters |
| Role | Required, must be valid role from dropdown |
| Email/Phone/SAP | Required, valid email format OR valid phone number OR valid SAP code |
| Password | Required, min 8 characters, must contain uppercase, lowercase, number |

### 2.3 API Endpoints

<!-- TODO: Add API endpoints -->

### 2.4 User Flow

1. User chưa có account → Click "Sign up" từ Sign In screen
2. User nhập Full name
3. User chọn Role từ dropdown
4. User nhập Email hoặc Phone Number hoặc SAP Code
5. User nhập Password
6. User nhấn "Sign up" hoặc "Sign up with Google"
7. Nếu thành công → Redirect to main app
8. Nếu đã có account → Click "Sign in" → Redirect to Sign In screen

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
