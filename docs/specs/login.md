# Authentication Screens Specification

## Overview

This document covers the authentication flow including Sign In, Sign Up, and Forgot Password screens.

---

## 1. Sign In Screen

### 1.1 UI Components

#### Header
- **App Logo**: "AOI SORA" text (màu xanh đậm #1E3A5F) với subtitle "OptiChain"
- **Title**: "Welcom back" (typo trong design)
- **Subtitle**: "Welcome back! Please enter your deatls" (typo trong design)

#### Form Fields
| Field | Type | Icon | Placeholder | Required |
|-------|------|------|-------------|----------|
| Email/Phone | Text Input | Person icon | "Email or Phone Number" | Yes |
| Password | Password Input | Lock icon | "Password" | Yes |

#### Password Field Features
- **Eye icon**: Bên phải field để toggle show/hide password
- Password hiển thị dạng dots (•••••••••••) khi ẩn

#### Additional Options
| Component | Position | Style |
|-----------|----------|-------|
| Remember for 30 days | Left | Checkbox với label |
| Forgot password | Right | Link màu cam/đỏ (#F97316) |

#### Checkbox States
| State | Style |
|-------|-------|
| Unchecked | Border xám, background trắng |
| Checked | Background màu cam/đỏ (#F97316), có checkmark trắng |

#### Input States
| State | Style |
|-------|-------|
| Empty (Placeholder) | Text màu xám nhạt (#9CA3AF) |
| Focus (Empty) | Cursor nhấp nháy, border bottom highlight |
| Filled | Text màu đen đậm (#1F2937), font weight normal |
| Error | Border bottom màu đỏ, error message bên dưới |

#### Error Messages
| Error Type | Message | Style |
|------------|---------|-------|
| Incorrect password | "Incorrect password" | Text màu đỏ (#EF4444), hiển thị dưới password field |

#### Buttons
| Button | State | Style |
|--------|-------|-------|
| Sign in | Disabled | Background màu xám (#9CA3AF), text màu trắng mờ, không cho phép click |
| Sign in | Enabled | Background màu xanh đậm (#1E3A5F), text màu trắng, cho phép click |
| Sign in with Google | Default | White background, Google icon, bordered, text màu đen |

#### Button Enable Conditions
Button "Sign in" chỉ được enable (đổi màu xanh đậm) khi **TẤT CẢ** điều kiện sau được thỏa mãn:
1. Email/Phone đã được nhập (không rỗng)
2. Password đã được nhập (không rỗng)

#### Footer Links
- Text: "Don't have an account?" với link "Sign up" (màu đỏ #EF4444)

#### Background
- Gradient sky với clouds (sunrise/sunset theme)
- Màu chủ đạo: xanh dương nhạt phía trên, cam/hồng phía dưới

### 1.2 Validation Rules

| Field | Rules |
|-------|-------|
| Email/Phone | Required, valid email format OR valid phone number |
| Password | Required, min 1 character |

### 1.3 API Endpoints

<!-- TODO: Add API endpoints -->

### 1.4 User Flow

1. User mở app → Hiển thị Sign In screen (trạng thái empty)
2. User click vào Email/Phone field → Focus state với cursor
3. User nhập Email hoặc Phone Number
4. User click vào Password field → Focus state
5. User nhập Password
6. (Optional) User tick "Remember for 30 days"
7. Button "Sign in" chuyển từ Disabled → Enabled (màu xanh đậm)
8. User nhấn "Sign in" hoặc "Sign in with Google"
9. Nếu quên password → Click "Forgot password" → Redirect to Forgot Password screen
10. Nếu chưa có account → Click "Sign up" → Redirect to Sign Up screen

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

## 3. Forgot Password Flow

Forgot Password flow gồm 3 bước: Request Reset → Code Verification → Reset Password

---

### 3.1 Step 1: Forgot Password Screen

#### UI Components

##### Header
- **App Logo**: "AOI SORA" text với subtitle "OptiChain"
- **Title**: "Forgot Password"

##### Form Fields
| Field | Type | Icon | Placeholder | Required |
|-------|------|------|-------------|----------|
| Email | Text Input | Person icon | "Email or Phone Number" | Yes |

##### Buttons
| Button | State | Style |
|--------|-------|-------|
| Reset Password | Default | Background màu xanh đậm (#1E3A5F), text màu trắng, full width |

##### Footer Links
- Text: "Don't have an account?" với link "Sign up" (màu đỏ #EF4444)

#### User Flow
1. User click "Forgot password" từ Sign In screen
2. User nhập Email đã đăng ký
3. User nhấn "Reset Password"
4. Hệ thống gửi verification code đến email
5. Redirect to Code Verification screen

---

### 3.2 Step 2: Code Verification Screen

#### UI Components

##### Header
- **App Logo**: "AOI SORA" text với subtitle "OptiChain"
- **Title**: "Code Verification"
- **Subtitle**: "We have sent code to your Email [email@gmail.com]" (email hiển thị màu xanh)

##### Verification Code Input
- **Layout**: 5 ô input riêng biệt, xếp ngang
- **Style**: Mỗi ô vuông, border radius, background trắng
- **Behavior**: Auto-focus sang ô tiếp theo khi nhập xong 1 số

##### Buttons
| Button | State | Style |
|--------|-------|-------|
| Verify Account | Default | Background màu xanh đậm (#1E3A5F), text màu trắng, full width |

##### Footer Links
- Text: "Didn't receive code?" với link "Resend" (màu xanh đậm)

#### User Flow
1. User nhận email với verification code (5 số)
2. User nhập code vào 5 ô input
3. User nhấn "Verify Account"
4. Nếu code đúng → Redirect to Reset Password screen
5. Nếu không nhận code → Click "Resend" để gửi lại

---

### 3.3 Step 3: Reset Password Screen

#### UI Components

##### Header
- **App Logo**: "AOI SORA" text với subtitle "OptiChain"
- **Title**: "Reset password"
- **Subtitle**: "Update password for enhanced account security"

##### Form Fields
| Field | Type | Icon | Placeholder | Required |
|-------|------|------|-------------|----------|
| New Password | Password Input | Lock icon | "New Password" | Yes |
| Confirm New Password | Password Input | Lock icon (double) | "Confirm New Password" | Yes |

##### Password Field Features
- **Eye icon**: Bên phải mỗi field để toggle show/hide password
- Password hiển thị dạng dots (•••••••••••) khi ẩn

##### Password Requirements Message
- Text: "Password must be at least 8 characters, including one uppercase letter, one number, and one special character."
- Style: Text màu cam (#F97316), font size nhỏ, hiển thị dưới New Password field

##### Password Strength Indicator
| Strength | Label | Color |
|----------|-------|-------|
| Weak | "Weak!" | Red (#EF4444) |
| Medium | "Medium" | Orange (#F59E0B) |
| Strong | "Strong!" | Green (#22C55E) |

- Hiển thị bên phải của New Password field
- Cập nhật real-time khi user nhập password

##### Password Match Validation
| State | Icon | Message | Style |
|-------|------|---------|-------|
| Not Match | Lock icon đỏ | "Passwords do not match." | Text màu đỏ (#EF4444), border đỏ |
| Match | Lock icon xanh | "Passwords match." | Text màu xám (#6B7280), border xanh |

##### Buttons
| Button | State | Style |
|--------|-------|-------|
| Verify Account | Disabled | Background màu xám (#9CA3AF), text màu trắng mờ, không cho phép click |
| Verify Account | Enabled | Background màu xanh đậm (#1E3A5F), text màu trắng, cho phép click |

##### Button Enable Conditions
Button "Verify Account" chỉ được enable khi **TẤT CẢ** điều kiện sau được thỏa mãn:
1. New Password đã nhập và đạt độ mạnh tối thiểu "Medium"
2. Confirm New Password đã nhập
3. Passwords match (2 password giống nhau)

#### Input States
| State | Style |
|-------|-------|
| Empty (Placeholder) | Text màu xám nhạt (#9CA3AF) |
| Filled | Text màu đen đậm (#1F2937) |
| Error (Not Match) | Lock icon đỏ, border bottom đỏ |
| Valid (Match) | Lock icon xanh, border bottom xanh |

#### User Flow
1. User nhập New Password
2. Password strength indicator cập nhật real-time
3. User nhập Confirm New Password
4. Hệ thống validate match:
   - Nếu không khớp → Hiển thị "Passwords do not match." (đỏ)
   - Nếu khớp → Hiển thị "Passwords match." (xám)
5. Khi tất cả điều kiện thỏa mãn → Button "Verify Account" enable
6. User nhấn "Verify Account"
7. Nếu thành công → Redirect to Sign In screen

---

### 3.4 Validation Rules

| Field | Rules |
|-------|-------|
| Email (Step 1) | Required, valid email format, must exist in system |
| Verification Code (Step 2) | Required, exactly 5 digits |
| New Password (Step 3) | Required, min 8 characters, must contain uppercase, number, special character |
| Confirm Password (Step 3) | Required, must match New Password |

### 3.5 API Endpoints

<!-- TODO: Add API endpoints -->

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
