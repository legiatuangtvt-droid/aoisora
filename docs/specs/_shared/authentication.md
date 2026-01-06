# Authentication Screens Specification

---

# BASIC SPEC

## 1. Overview

- **Module**: Shared (tất cả modules)
- **Purpose**: Xác thực người dùng trước khi truy cập hệ thống
- **Target Users**: Tất cả nhân viên (Staff, Manager, Admin)

## 2. Screens Summary

| Screen | Purpose | Entry Point |
|--------|---------|-------------|
| Sign In | Đăng nhập vào hệ thống | App launch, Logout |
| Sign Up | Đăng ký tài khoản mới | Link từ Sign In |
| Forgot Password | Yêu cầu reset mật khẩu | Link từ Sign In |
| Code Verification | Xác thực OTP | Sau Forgot Password |
| Reset Password | Đặt mật khẩu mới | Sau Code Verification |

## 3. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | Staff | Sign in with my credentials | I can access the system |
| US-02 | Staff | Reset my password | I can recover my account |
| US-03 | Staff | Remember my login | I don't have to sign in every time |
| US-04 | New User | Sign up for an account | I can use the system |

## 4. Screen Components Summary

### 4.1 Sign In Screen
| Component | Description |
|-----------|-------------|
| Header | Logo "AOI SORA", title "Welcome back" |
| Form | Email/Phone input, Password input |
| Options | Remember 30 days checkbox, Forgot password link |
| Actions | Sign in button, Google sign in button |
| Footer | Sign up link |

### 4.2 Sign Up Screen
| Component | Description |
|-----------|-------------|
| Header | Logo, title "Get Started" |
| Form | Full name, Role dropdown, Email/Phone/SAP, Password |
| Password | Strength indicator (Weak/Medium/Strong) |
| Actions | Sign up button, Google sign up button |
| Footer | Sign in link |

### 4.3 Forgot Password Flow
| Step | Screen | Action |
|------|--------|--------|
| 1 | Forgot Password | Enter email → Send OTP |
| 2 | Code Verification | Enter 5-digit OTP |
| 3 | Reset Password | Enter new password + confirm |

## 5. Navigation Flow

```
Sign In ─── (Forgot password?) ───> Forgot Password
   │                                      │
   │                               (Submit email)
   │                                      ▼
   │                               Code Verification
   │                                      │
   │                               (Verify code)
   │                                      ▼
   │                               Reset Password
   │                                      │
   │                         (Password reset success)
   │                                      │
   └──────── (Sign in) ◄──────────────────┘
   │
   │ (Don't have account?)
   ▼
Sign Up ─── (Already have account?) ───> Sign In
```

## 6. API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/login` | POST | Đăng nhập |
| `/api/v1/auth/logout` | POST | Đăng xuất |
| `/api/v1/auth/me` | GET | Lấy thông tin user hiện tại |
| `/api/v1/auth/forgot-password` | POST | Gửi OTP qua email |
| `/api/v1/auth/verify-code` | POST | Xác thực OTP |
| `/api/v1/auth/reset-password` | POST | Đặt mật khẩu mới |
| `/api/v1/auth/resend-code` | POST | Gửi lại OTP |
| `/api/v1/auth/check-password-strength` | POST | Kiểm tra độ mạnh password |

## 7. Implementation Status

| Feature | Backend | Frontend | Notes |
|---------|---------|----------|-------|
| Sign In | ✅ Done | ✅ Done | Full flow |
| Sign Up | ⏳ Pending | ⏳ Pending | - |
| Forgot Password | ✅ Done | ⏳ Pending | Backend ready |
| Code Verification | ✅ Done | ⏳ Pending | Backend ready |
| Reset Password | ✅ Done | ⏳ Pending | Backend ready |

---

# DETAIL SPEC

## 8. Sign In Screen - Detail

### 8.1 UI Components

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

### 8.2 Validation Rules

| Field | Rules |
|-------|-------|
| Email/Phone | Required, valid email format OR valid phone number |
| Password | Required, min 1 character |

### 8.3 API: Login

**Endpoint:** `POST /api/v1/auth/login`

**Request:**
```json
{
  "identifier": "admin@aoisora.com",
  "password": "Password123!",
  "remember_me": false
}
```

**Response (Success):**
```json
{
  "success": true,
  "access_token": "1|abc...",
  "token_type": "bearer",
  "expires_at": "2026-01-07T03:47:08Z",
  "user": {
    "id": 1,
    "staff_code": "NV001",
    "full_name": "Nguyen Van A",
    "email": "admin@aoisora.com",
    "phone": "0901234567",
    "role": "MANAGER",
    "position": "Store Manager",
    "store_id": 1,
    "store_name": "Store Ha Dong",
    "department_id": 1,
    "department_name": "OP"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Incorrect password",
  "error_code": "INCORRECT_PASSWORD"
}
```

**Error Codes:**
| Code | Description |
|------|-------------|
| `ACCOUNT_NOT_FOUND` | Không tìm thấy tài khoản |
| `INCORRECT_PASSWORD` | Mật khẩu không đúng |
| `ACCOUNT_INACTIVE` | Tài khoản không active |

### 8.4 User Flow

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

## 9. Sign Up Screen - Detail

### 9.1 UI Components

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

### 9.2 Validation Rules

| Field | Rules |
|-------|-------|
| Full name | Required, min 2 characters, max 100 characters |
| Role | Required, must be valid role from dropdown |
| Email/Phone/SAP | Required, valid email format OR valid phone number OR valid SAP code |
| Password | Required, min 8 characters, must contain uppercase, lowercase, number |

### 9.3 API Endpoints

<!-- TODO: Add API endpoints when implemented -->

### 9.4 User Flow

1. User chưa có account → Click "Sign up" từ Sign In screen
2. User nhập Full name
3. User chọn Role từ dropdown
4. User nhập Email hoặc Phone Number hoặc SAP Code
5. User nhập Password
6. User nhấn "Sign up" hoặc "Sign up with Google"
7. Nếu thành công → Redirect to main app
8. Nếu đã có account → Click "Sign in" → Redirect to Sign In screen

---

## 10. Forgot Password Flow - Detail

### 10.1 Step 1: Forgot Password Screen

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

#### API: Forgot Password

**Endpoint:** `POST /api/v1/auth/forgot-password`

**Request:**
```json
{
  "email": "admin@aoisora.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Verification code sent to your email",
  "email": "ad***@aoisora.com",
  "debug_code": "34819"
}
```

**Error Codes:**
| Code | Description |
|------|-------------|
| `EMAIL_NOT_FOUND` | Email không tồn tại trong hệ thống |

#### User Flow
1. User click "Forgot password" từ Sign In screen
2. User nhập Email đã đăng ký
3. User nhấn "Reset Password"
4. Hệ thống gửi verification code đến email
5. Redirect to Code Verification screen

---

### 10.2 Step 2: Code Verification Screen

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

#### API: Verify Code

**Endpoint:** `POST /api/v1/auth/verify-code`

**Request:**
```json
{
  "email": "admin@aoisora.com",
  "code": "34819"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Code verified successfully",
  "reset_token": "W8aTbhdkgfNHbk76U2DgzOHC..."
}
```

**Error Codes:**
| Code | Description |
|------|-------------|
| `NO_RESET_REQUEST` | Không có yêu cầu reset cho email này |
| `CODE_EXPIRED` | Mã xác thực đã hết hạn (15 phút) |
| `INVALID_CODE` | Mã xác thực không đúng |

#### API: Resend Code

**Endpoint:** `POST /api/v1/auth/resend-code`

**Request:**
```json
{
  "email": "admin@aoisora.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "New verification code sent to your email"
}
```

**Error Codes:**
| Code | Description |
|------|-------------|
| `RATE_LIMITED` | Vui lòng đợi trước khi gửi lại (kèm `retry_after` giây) |

#### User Flow
1. User nhận email với verification code (5 số)
2. User nhập code vào 5 ô input
3. User nhấn "Verify Account"
4. Nếu code đúng → Redirect to Reset Password screen
5. Nếu không nhận code → Click "Resend" để gửi lại

---

### 10.3 Step 3: Reset Password Screen

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

#### API: Reset Password

**Endpoint:** `POST /api/v1/auth/reset-password`

**Request:**
```json
{
  "email": "admin@aoisora.com",
  "reset_token": "W8aTbhdkgfNHbk76U2DgzOHC...",
  "password": "NewPassword123!",
  "password_confirmation": "NewPassword123!"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password reset successfully. Please sign in with your new password."
}
```

**Error Codes:**
| Code | Description |
|------|-------------|
| `INVALID_RESET_TOKEN` | Token không hợp lệ |
| `RESET_TOKEN_EXPIRED` | Token đã hết hạn (30 phút) |
| `ACCOUNT_NOT_FOUND` | Tài khoản không tồn tại |

#### API: Check Password Strength

**Endpoint:** `POST /api/v1/auth/check-password-strength`

**Request:**
```json
{
  "password": "Test123!"
}
```

**Response:**
```json
{
  "success": true,
  "strength": "strong",
  "score": 6,
  "feedback": []
}
```

**Strength Levels:**
| Level | Score | Description |
|-------|-------|-------------|
| `weak` | 0-2 | Mật khẩu yếu |
| `medium` | 3-4 | Mật khẩu trung bình |
| `strong` | 5-6 | Mật khẩu mạnh |

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

### 10.4 Validation Rules Summary

| Field | Rules |
|-------|-------|
| Email (Step 1) | Required, valid email format, must exist in system |
| Verification Code (Step 2) | Required, exactly 5 digits |
| New Password (Step 3) | Required, min 8 characters, must contain uppercase, number, special character |
| Confirm Password (Step 3) | Required, must match New Password |

---

## 11. Shared Components - Detail

### 11.1 Form Layout

#### Container
- **Max Width**: 400px
- **Padding**: 24px (horizontal), 32px (vertical)
- **Background**: Semi-transparent white với backdrop blur
- **Border Radius**: 16px
- **Box Shadow**: Soft shadow

#### Logo Section
- **Position**: Top center
- **Logo Text**: "AOI SORA" (font-weight: bold, color: #1E3A5F)
- **Subtitle**: "OptiChain" (font-size: smaller, color: #6B7280)
- **Margin Bottom**: 24px

#### Input Fields
- **Height**: 48px
- **Border**: 0 (borderless), chỉ có border-bottom
- **Border Bottom**: 1px solid #E5E7EB (default)
- **Border Bottom (Focus)**: 2px solid #1E3A5F
- **Border Bottom (Error)**: 2px solid #EF4444
- **Background**: Transparent
- **Padding**: 12px left (for icon), 12px right
- **Icon Size**: 20px
- **Font Size**: 16px

#### Buttons
- **Height**: 48px
- **Border Radius**: 8px
- **Font Weight**: 600 (semi-bold)
- **Full Width**: 100%
- **Transition**: background-color 0.2s ease

### 11.2 Error Handling

#### Error Display
| Type | Display Location | Style |
|------|------------------|-------|
| Field Error | Below input field | Text màu đỏ (#EF4444), font-size 12px |
| Form Error | Top of form (toast) | Background đỏ nhạt, border đỏ, icon warning |
| Network Error | Toast notification | "Network error. Please check your connection." |

#### Error Recovery
1. Field errors tự động clear khi user bắt đầu sửa
2. Form errors tự động ẩn sau 5 giây hoặc khi user dismiss
3. Network errors có thể retry bằng cách submit lại

---

## 12. Database Schema

### 12.1 Staff Table (Authentication Fields)

| Column | Type | Description |
|--------|------|-------------|
| `staff_id` | SERIAL PRIMARY KEY | ID nhân viên |
| `username` | VARCHAR(50) | Tên đăng nhập (unique) |
| `email` | VARCHAR(100) | Email (unique) |
| `phone` | VARCHAR(20) | Số điện thoại |
| `sap_code` | VARCHAR(20) | Mã SAP (unique) |
| `password_hash` | VARCHAR(255) | Password đã hash (bcrypt) |
| `status` | VARCHAR(20) | Trạng thái: ACTIVE, INACTIVE |
| `created_at` | TIMESTAMP | Ngày tạo |
| `updated_at` | TIMESTAMP | Ngày cập nhật |

### 12.2 Password Reset Tokens Table

| Column | Type | Description |
|--------|------|-------------|
| `email` | VARCHAR(255) PRIMARY KEY | Email người dùng |
| `token` | VARCHAR(255) | Token hash (không sử dụng trực tiếp) |
| `code` | VARCHAR(5) | Mã OTP 5 số |
| `reset_token` | VARCHAR(64) | Token để reset password sau khi verify |
| `expires_at` | TIMESTAMP | Thời gian hết hạn OTP (15 phút) |
| `verified_at` | TIMESTAMP | Thời gian xác thực OTP thành công |
| `created_at` | TIMESTAMP | Thời gian tạo |

### 12.3 Personal Access Tokens Table (Laravel Sanctum)

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT PRIMARY KEY | Token ID |
| `tokenable_type` | VARCHAR(255) | Model type (App\Models\Staff) |
| `tokenable_id` | BIGINT | Staff ID |
| `name` | VARCHAR(255) | Token name (default: "api-token") |
| `token` | VARCHAR(64) | Token hash (SHA-256) |
| `abilities` | TEXT | JSON array of abilities |
| `last_used_at` | TIMESTAMP | Lần sử dụng cuối |
| `expires_at` | TIMESTAMP | Thời gian hết hạn (dựa vào remember_me) |
| `created_at` | TIMESTAMP | Thời gian tạo |
| `updated_at` | TIMESTAMP | Thời gian cập nhật |

### 12.4 Token Expiration

| Remember Me | Token Lifetime |
|-------------|----------------|
| `false` | 24 giờ |
| `true` | 30 ngày |

---

## 13. Security Considerations

### 13.1 Password Security

| Measure | Implementation |
|---------|----------------|
| Hashing Algorithm | bcrypt (PASSWORD_BCRYPT) với cost factor 10 |
| Min Length | 8 characters |
| Complexity | Uppercase, lowercase, number, special character |
| Storage | Chỉ lưu hash, không bao giờ lưu plain text |

### 13.2 Token Security

| Measure | Implementation |
|---------|----------------|
| Token Generation | Laravel Sanctum với random 40-character token |
| Token Storage | SHA-256 hash trong database |
| Token Transmission | Bearer token trong Authorization header |
| Token Expiration | 24h (default) hoặc 30 ngày (remember me) |

### 13.3 OTP Security

| Measure | Implementation |
|---------|----------------|
| OTP Length | 5 digits (00000-99999) |
| OTP Lifetime | 15 phút |
| OTP Generation | Cryptographically secure random |
| Rate Limiting | 1 phút giữa các lần resend |
| Reset Token | 64-character random string, valid 30 phút sau verify |

### 13.4 API Security

| Measure | Implementation |
|---------|----------------|
| CORS | Configured trong Laravel |
| Rate Limiting | Laravel throttle middleware |
| Input Validation | Laravel Form Requests |
| SQL Injection | Eloquent ORM parameterized queries |
| XSS Prevention | JSON responses only |

### 13.5 Frontend Security

| Measure | Implementation |
|---------|----------------|
| Token Storage | localStorage (với warning về XSS risk) |
| Route Protection | AuthGuard component redirect unauthorized |
| HTTPS | Required cho production |
| Sensitive Data | Không log password hoặc token |

### 13.6 Login Identifier Support

Hệ thống hỗ trợ đăng nhập bằng nhiều loại identifier:

| Identifier Type | Format | Example |
|-----------------|--------|---------|
| Email | email@domain.com | admin@aoisora.com |
| Phone | 10-11 số | 0901234567 |
| SAP Code | NVxxx hoặc số | NV001 |
| Username | Alphanumeric | admin |

---

## 14. Files Reference

### 14.1 Backend (Laravel)

| Feature | File |
|---------|------|
| Login API | `app/Http/Controllers/Api/V1/AuthController.php@login` |
| Forgot Password | `app/Http/Controllers/Api/V1/AuthController.php@forgotPassword` |
| Verify Code | `app/Http/Controllers/Api/V1/AuthController.php@verifyResetCode` |
| Reset Password | `app/Http/Controllers/Api/V1/AuthController.php@resetPassword` |
| Resend Code | `app/Http/Controllers/Api/V1/AuthController.php@resendCode` |
| Password Strength | `app/Http/Controllers/Api/V1/AuthController.php@checkPasswordStrength` |
| Routes | `routes/api.php` |
| Model | `app/Models/Staff.php`, `app/Models/PasswordResetToken.php` |

### 14.2 Frontend (Next.js)

| Feature | File |
|---------|------|
| Sign In Screen | `frontend/src/app/auth/signin/page.tsx` |
| Auth Context | `frontend/src/contexts/AuthContext.tsx` |
| Auth Guard | `frontend/src/components/auth/AuthGuard.tsx` |
