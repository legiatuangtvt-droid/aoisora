# Authentication - Detail Specification

> **Module**: Shared (All modules)
> **Screens**: Sign In, Sign Up, Forgot Password, Code Verification, Reset Password
> **Last Updated**: 2026-01-08

---

## 1. Sign In Screen - Detail

### 1.1 UI Components

#### Header
- **App Logo**: "AOI SORA" text (màu xanh đậm #1E3A5F) với subtitle "OptiChain"
- **Title**: "Welcome back"
- **Subtitle**: "Welcome back! Please enter your details"

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

#### Buttons

| Button | State | Style |
|--------|-------|-------|
| Sign in | Disabled | Background màu xám (#9CA3AF), text màu trắng mờ |
| Sign in | Enabled | Background màu xanh đậm (#1E3A5F), text màu trắng |
| Sign in with Google | Default | White background, Google icon, bordered |

#### Button Enable Conditions
Button "Sign in" chỉ được enable khi **TẤT CẢ** điều kiện sau được thỏa mãn:
1. Email/Phone đã được nhập (không rỗng)
2. Password đã được nhập (không rỗng)

### 1.2 Validation Rules

| Field | Rules |
|-------|-------|
| Email/Phone | Required, valid email format OR valid phone number |
| Password | Required, min 1 character |

### 1.3 Error Messages

| Error Code | Message |
|------------|---------|
| `ACCOUNT_NOT_FOUND` | Account not found |
| `INCORRECT_PASSWORD` | Incorrect password |
| `ACCOUNT_INACTIVE` | Account is inactive |

---

## 2. Sign Up Screen - Detail

### 2.1 UI Components

#### Form Fields

| Field | Type | Icon | Placeholder | Required |
|-------|------|------|-------------|----------|
| Full name | Text Input | Group icon | "Full name" | Yes |
| Role | Dropdown Select | People icon | "Select Role" | Yes |
| Email/Phone/SAP | Text Input | Person icon | "Email or Phone Number or SAP Code" | Yes |
| Password | Password Input | Lock icon | "Password" | Yes |

#### Password Strength Indicator

| Strength | Label | Color |
|----------|-------|-------|
| Weak | "Weak!" | Red (#EF4444) |
| Medium | "Medium" | Orange (#F59E0B) |
| Strong | "Strong!" | Green (#22C55E) |

### 2.2 Validation Rules

| Field | Rules |
|-------|-------|
| Full name | Required, min 2 characters, max 100 characters |
| Role | Required, must be valid role from dropdown |
| Email/Phone/SAP | Required, valid email OR phone OR SAP code |
| Password | Required, min 8 characters, uppercase, lowercase, number |

---

## 3. Forgot Password Flow - Detail

### 3.1 Step 1: Forgot Password Screen

#### Form Fields

| Field | Type | Placeholder | Required |
|-------|------|-------------|----------|
| Email | Text Input | "Email or Phone Number" | Yes |

### 3.2 Step 2: Code Verification Screen

#### Verification Code Input
- **Layout**: 5 ô input riêng biệt, xếp ngang
- **Behavior**: Auto-focus sang ô tiếp theo khi nhập xong 1 số

### 3.3 Step 3: Reset Password Screen

#### Form Fields

| Field | Type | Placeholder | Required |
|-------|------|-------------|----------|
| New Password | Password Input | "New Password" | Yes |
| Confirm New Password | Password Input | "Confirm New Password" | Yes |

#### Password Match Validation

| State | Message | Style |
|-------|---------|-------|
| Not Match | "Passwords do not match." | Text màu đỏ (#EF4444) |
| Match | "Passwords match." | Text màu xám (#6B7280) |

---

## 4. API Endpoints - Detail

### 4.1 Login API

```yaml
post:
  tags:
    - Auth
  summary: "Login API"
  description: |
    # Correlation Check
      - identifier: Required, must be valid email/phone/SAP code/username
      - password: Required

    # Business Logic
      ## 1. Find User
        ### Search Conditions
          - staff.email = identifier
          OR staff.phone = identifier
          OR staff.sap_code = identifier
          OR staff.username = identifier

      ## 2. Validate Password
        - Compare password with password_hash using bcrypt

      ## 3. Check Account Status
        - If status != ACTIVE → Return ACCOUNT_INACTIVE error

      ## 4. Generate Token
        - Create Sanctum token
        - Set expiration based on remember_me (24h or 30 days)

      ## 5. Response
        - Return access_token and user info

  operationId: login
  requestBody:
    required: true
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/LoginRequest"
        example:
          identifier: "admin@aoisora.com"
          password: "Password123!"
          remember_me: false

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            success: true
            access_token: "1|abc..."
            token_type: "bearer"
            expires_at: "2026-01-07T03:47:08Z"
            user:
              id: 1
              staff_code: "NV001"
              full_name: "Nguyen Van A"
              email: "admin@aoisora.com"
              role: "MANAGER"

    401:
      description: Unauthorized
```

### 4.2 Logout API

```yaml
post:
  tags:
    - Auth
  summary: "Logout API"
  description: |
    # Business Logic
      ## 1. Revoke Token
        - Delete current access token from personal_access_tokens

      ## 2. Response
        - Return success message

  operationId: logout
  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            success: true
            message: "Logged out successfully"
```

### 4.3 Forgot Password API

```yaml
post:
  tags:
    - Auth
  summary: "Forgot Password API"
  description: |
    # Correlation Check
      - email: Must exist in staff table

    # Business Logic
      ## 1. Find User by Email
        - If not found → Return EMAIL_NOT_FOUND

      ## 2. Generate OTP
        - Generate 5-digit random code
        - Set expiration to 15 minutes

      ## 3. Store Reset Token
        - Insert/Update password_reset_tokens table

      ## 4. Send Email
        - Send OTP code via email

      ## 5. Response
        - Return masked email confirmation

  operationId: forgotPassword
  requestBody:
    required: true
    content:
      application/json:
        example:
          email: "admin@aoisora.com"

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            success: true
            message: "Verification code sent to your email"
            email: "ad***@aoisora.com"

    404:
      description: Not Found
```

### 4.4 Verify Code API

```yaml
post:
  tags:
    - Auth
  summary: "Verify OTP Code API"
  description: |
    # Correlation Check
      - email: Must have pending reset request
      - code: Must match and not expired

    # Business Logic
      ## 1. Find Reset Request
        - Query password_reset_tokens by email
        - If not found → Return NO_RESET_REQUEST

      ## 2. Check Expiration
        - If expires_at < now → Return CODE_EXPIRED

      ## 3. Verify Code
        - If code != request.code → Return INVALID_CODE

      ## 4. Generate Reset Token
        - Generate 64-char random reset_token
        - Set verified_at = now

      ## 5. Response
        - Return reset_token for password reset

  operationId: verifyResetCode
  requestBody:
    required: true
    content:
      application/json:
        example:
          email: "admin@aoisora.com"
          code: "34819"

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            success: true
            message: "Code verified successfully"
            reset_token: "W8aTbhdkgfNHbk76U2DgzOHC..."
```

### 4.5 Reset Password API

```yaml
post:
  tags:
    - Auth
  summary: "Reset Password API"
  description: |
    # Correlation Check
      - reset_token: Must be valid and not expired (30 min after verify)
      - password: Must meet strength requirements
      - password_confirmation: Must match password

    # Business Logic
      ## 1. Validate Reset Token
        - Query password_reset_tokens by email and reset_token
        - Check verified_at + 30 minutes > now

      ## 2. Update Password
        - Hash new password with bcrypt
        - Update staff.password_hash

      ## 3. Cleanup
        - Delete password_reset_tokens record

      ## 4. Response
        - Return success message

  operationId: resetPassword
  requestBody:
    required: true
    content:
      application/json:
        example:
          email: "admin@aoisora.com"
          reset_token: "W8aTbhdkgfNHbk76U2DgzOHC..."
          password: "NewPassword123!"
          password_confirmation: "NewPassword123!"

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            success: true
            message: "Password reset successfully."
```

### 4.6 Check Password Strength API

```yaml
post:
  tags:
    - Auth
  summary: "Check Password Strength API"
  description: |
    # Business Logic
      ## 1. Calculate Score
        - +1 for length >= 8
        - +1 for lowercase letter
        - +1 for uppercase letter
        - +1 for number
        - +1 for special character
        - +1 for length >= 12

      ## 2. Determine Strength
        - 0-2: weak
        - 3-4: medium
        - 5-6: strong

      ## 3. Response
        - Return strength and feedback

  operationId: checkPasswordStrength
  requestBody:
    required: true
    content:
      application/json:
        example:
          password: "Test123!"

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            success: true
            strength: "strong"
            score: 6
            feedback: []
```

---

## 5. Schema Definitions

```yaml
components:
  schemas:
    LoginRequest:
      type: object
      required:
        - identifier
        - password
      properties:
        identifier:
          type: string
          description: Email, phone, SAP code, or username
        password:
          type: string
        remember_me:
          type: boolean
          default: false

    UserResponse:
      type: object
      properties:
        id:
          type: integer
        staff_code:
          type: string
        full_name:
          type: string
        email:
          type: string
        phone:
          type: string
        role:
          type: string
          enum: [ADMIN, MANAGER, STAFF]
        position:
          type: string
        store_id:
          type: integer
        store_name:
          type: string
        department_id:
          type: integer
        department_name:
          type: string

    AuthResponse:
      type: object
      properties:
        success:
          type: boolean
        access_token:
          type: string
        token_type:
          type: string
          enum: [bearer]
        expires_at:
          type: string
          format: date-time
        user:
          $ref: "#/components/schemas/UserResponse"
```

---

## 6. Database Schema

### 6.1 Staff Table (Authentication Fields)

| Column | Type | Description |
|--------|------|-------------|
| `staff_id` | SERIAL PRIMARY KEY | ID nhân viên |
| `username` | VARCHAR(50) | Tên đăng nhập (unique) |
| `email` | VARCHAR(100) | Email (unique) |
| `phone` | VARCHAR(20) | Số điện thoại |
| `sap_code` | VARCHAR(20) | Mã SAP (unique) |
| `password_hash` | VARCHAR(255) | Password đã hash (bcrypt) |
| `status` | VARCHAR(20) | Trạng thái: ACTIVE, INACTIVE |

### 6.2 Password Reset Tokens Table

| Column | Type | Description |
|--------|------|-------------|
| `email` | VARCHAR(255) PRIMARY KEY | Email người dùng |
| `code` | VARCHAR(5) | Mã OTP 5 số |
| `reset_token` | VARCHAR(64) | Token để reset password sau khi verify |
| `expires_at` | TIMESTAMP | Thời gian hết hạn OTP (15 phút) |
| `verified_at` | TIMESTAMP | Thời gian xác thực OTP thành công |

### 6.3 Token Expiration

| Remember Me | Token Lifetime |
|-------------|----------------|
| `false` | 24 giờ |
| `true` | 30 ngày |

---

## 7. Security Considerations

### 7.1 Password Security

| Measure | Implementation |
|---------|----------------|
| Hashing Algorithm | bcrypt (PASSWORD_BCRYPT) với cost factor 10 |
| Min Length | 8 characters |
| Complexity | Uppercase, lowercase, number, special character |

### 7.2 Token Security

| Measure | Implementation |
|---------|----------------|
| Token Generation | Laravel Sanctum với random 40-character token |
| Token Storage | SHA-256 hash trong database |
| Token Transmission | Bearer token trong Authorization header |

### 7.3 OTP Security

| Measure | Implementation |
|---------|----------------|
| OTP Length | 5 digits (00000-99999) |
| OTP Lifetime | 15 phút |
| Rate Limiting | 1 phút giữa các lần resend |
| Reset Token | 64-character random string, valid 30 phút sau verify |

### 7.4 Login Identifier Support

| Identifier Type | Format | Example |
|-----------------|--------|---------|
| Email | email@domain.com | admin@aoisora.com |
| Phone | 10-11 số | 0901234567 |
| SAP Code | NVxxx hoặc số | NV001 |
| Username | Alphanumeric | admin |

---

## 8. Files Reference

### 8.1 Backend (Laravel)

| Feature | File |
|---------|------|
| Auth Controller | `app/Http/Controllers/Api/V1/AuthController.php` |
| Routes | `routes/api.php` |
| Staff Model | `app/Models/Staff.php` |
| Password Reset Model | `app/Models/PasswordResetToken.php` |

### 8.2 Frontend (Next.js)

| Feature | File |
|---------|------|
| Sign In Screen | `frontend/src/app/auth/signin/page.tsx` |
| Auth Context | `frontend/src/contexts/AuthContext.tsx` |
| Auth Guard | `frontend/src/components/auth/AuthGuard.tsx` |

---

## 9. Changelog

| Date | Change |
|------|--------|
| 2025-12-28 | Initial specification created |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
| 2026-01-08 | Split spec into basic and detail files |

---

## 10. Related Documents

| Document | Path |
|----------|------|
| Basic Spec | `docs/specs/_shared/authentication-basic.md` |
| App General Basic | `docs/specs/_shared/app-general-basic.md` |

