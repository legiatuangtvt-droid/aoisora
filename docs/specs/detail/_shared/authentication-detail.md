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

### 4.2a Refresh Session API

```yaml
post:
  tags:
    - Auth
  summary: "Refresh/Extend Session API"
  description: |
    # Correlation Check
      - Token: Must be valid (not expired)

    # Business Logic
      ## 1. Validate Token
        - Check if current token is still valid
        - If expired → Return TOKEN_EXPIRED error

      ## 2. Extend Token Expiration
        - Update expires_at = now + SESSION_TIMEOUT (120 minutes)
        - Update last_used_at = now

      ## 3. Response
        - Return new expires_at timestamp

  operationId: refreshSession
  security:
    - bearerAuth: []

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            success: true
            message: "Session extended successfully"
            expires_at: "2026-01-11T15:30:00Z"

    401:
      description: Token expired or invalid
      content:
        application/json:
          example:
            success: false
            error: "TOKEN_EXPIRED"
            message: "Your session has expired. Please sign in again."
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
| Idle Timer Context | `frontend/src/contexts/IdleTimerContext.tsx` |
| Session Warning Modal | `frontend/src/components/SessionWarningModal.tsx` |
| Session Warning Wrapper | `frontend/src/components/SessionWarningWrapper.tsx` |
| Activity Tracker Service | `frontend/src/services/ActivityTracker.ts` |
| Session Config | `frontend/src/config/session.ts` |

---

## 9. Changelog

| Date | Change |
|------|--------|
| 2025-12-28 | Initial specification created |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
| 2026-01-08 | Split spec into basic and detail files |
| 2026-01-11 | Added Refresh Session API, Idle Timeout Warning feature implementation |

---

## 10. Idle Timeout Warning

### 10.1 Overview

| Attribute | Value |
|-----------|-------|
| **Feature Name** | Idle Timeout Warning |
| **Purpose** | Warn users before auto-logout due to inactivity |
| **Priority** | High |
| **Status** | ✅ Implemented |

### 10.2 Business Requirements

| Requirement | Value |
|-------------|-------|
| **Session Lifetime** | 120 minutes (2 hours) of inactivity |
| **Warning Time** | 5 minutes before auto-logout (at 115 minutes) |
| **User Activities** | Mouse move, click, keypress, scroll, touch events |
| **Multi-tab Sync** | Yes, using localStorage |

### 10.3 Warning Modal UI

```
┌─────────────────────────────────────────────────────┐
│                    ⚠️ Session Warning                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Your session is about to expire due to inactivity  │
│                                                     │
│  You will be automatically logged out in:           │
│                                                     │
│                   ⏱️  4:53                           │
│                                                     │
│  ┌──────────────────────┐  ┌──────────────────────┐ │
│  │   Stay Logged In     │  │      Log Out         │ │
│  └──────────────────────┘  └──────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 10.4 Modal Specifications

| Element | Specification |
|---------|---------------|
| **Modal backdrop** | Semi-transparent black `rgba(0, 0, 0, 0.6)` |
| **Modal container** | Max-width: 400px, centered, white/dark background |
| **Warning icon** | ⚠️ SVG icon, size: 48px, color: orange (#F59E0B) |
| **Timer display** | Font-size: 48px, monospace, dynamic color |
| **Timer colors** | Green (>180s) → Yellow (60-180s) → Red (<60s) |
| **Stay button** | Blue (#1E3A5F), primary action |
| **Logout button** | Gray, secondary action |

### 10.5 Activity Tracking

**Tracked Events**:
- `mousemove` - Mouse cursor movement
- `click` - Mouse click
- `keydown` - Keyboard key press
- `scroll` - Page scrolling
- `touchstart` - Touch screen tap
- `touchmove` - Touch screen swipe

**Throttling**: Max 1 callback per second to optimize performance

**Storage**: `last_activity_time` in localStorage for cross-tab sync

### 10.6 State Machine

```
ACTIVE (0-115 min) ──(idle 115 min)──> WARNING (115-120 min)
                                            │
                  ┌─────────────────────────┼───────────────┐
                  │                         │               │
        (user clicks "Stay")        (user activity)  (countdown = 0)
                  │                         │               │
                  ▼                         ▼               ▼
            ACTIVE (reset)            ACTIVE (reset)    LOGGED_OUT
```

### 10.7 Technical Implementation

**Frontend Files**:
- `frontend/src/services/ActivityTracker.ts` - Activity tracking service
- `frontend/src/contexts/IdleTimerContext.tsx` - Idle timer state management
- `frontend/src/components/SessionWarningModal.tsx` - Modal UI component
- `frontend/src/components/SessionWarningWrapper.tsx` - Integration wrapper
- `frontend/src/config/session.ts` - Session configuration

**Backend Files**:
- `backend/laravel/app/Http/Controllers/Api/V1/AuthController.php` - `refresh()` method
- `backend/laravel/routes/api.php` - `/auth/refresh` endpoint

**Configuration** (`frontend/src/config/session.ts`):
```typescript
export const SESSION_CONFIG = {
  SESSION_TIMEOUT: 7200000,  // 120 minutes
  WARNING_TIME: 300000,      // 5 minutes
  CHECK_INTERVAL: 1000,      // 1 second
  ACTIVITY_THROTTLE: 1000,
  TRACKED_EVENTS: ['mousemove', 'click', 'keydown', 'scroll', 'touchstart', 'touchmove'],
};
```

### 10.8 Test Scenarios

| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| TC-01 | Idle 115 minutes | Modal appears with 5:00 countdown |
| TC-02 | Click "Stay Logged In" | Session extended, modal closes, timer reset |
| TC-03 | Click "Log Out" | Logout immediately, redirect to Sign In |
| TC-04 | Countdown reaches 0 | Auto-logout, redirect to Sign In |
| TC-05 | User activity during warning | Modal closes, timer reset |
| TC-06 | Multi-tab sync | Activity in one tab affects all tabs |

**Test Guide**: See `TEST_SCENARIO_IDLE_TIMEOUT.md` for detailed test procedures.

---

## 11. Dual Token System with Rotation (Planned Upgrade)

### 11.1 Overview

Current system uses a single token. The planned upgrade implements **Dual Token System with Rotation** for enhanced security and better user experience.

| Aspect | Current (Single Token) | Planned (Dual Token) |
|--------|----------------------|---------------------|
| **Tokens** | 1 token (2h lifetime) | Access (15 min) + Refresh (30 days) |
| **Storage** | localStorage | Access: sessionStorage, Refresh: localStorage/sessionStorage |
| **Remember Me** | Limited usefulness (2h max) | Full 30-day auto-login capability |
| **Security** | Medium (2h window if stolen) | High (15 min window, token rotation) |
| **UX** | Must login daily | Auto-login for 30 days |

### 11.2 Token Types

#### A. Access Token

```typescript
interface AccessToken {
  token_string: string;           // "1|eyJhbGc..."
  expires_at: string;             // ISO 8601, 15 minutes from creation
  ability: 'api:access';          // Can call regular APIs
  storage: 'sessionStorage';      // Deleted when browser closes
  refresh_frequency: '~14 minutes'; // Auto-refreshed before expiration
}
```

**Purpose**: Authenticate every API call
**Lifetime**: 15 minutes
**Auto-refresh**: Frontend automatically refreshes at ~14 minutes

#### B. Refresh Token

```typescript
interface RefreshToken {
  token_string: string;           // "2|dGhpcyBpc..."
  expires_at: string;             // ISO 8601, 30 days from creation
  ability: 'api:refresh';         // Can ONLY call /auth/refresh
  storage: 'localStorage' | 'sessionStorage'; // Depends on remember_me
  rotation: true;                 // Replaced on each use
}
```

**Purpose**: Obtain new access tokens
**Lifetime**: 30 days (if Remember Me enabled)
**One-time use**: Revoked immediately after creating new tokens

### 11.3 Token Rotation Mechanism

Every time `/auth/refresh` is called:

```
┌─────────────────────────────────────────────────────────────────┐
│ BEFORE REFRESH                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Database:                                                       │
│   - Access Token #1 (expires 10:15)                            │
│   - Refresh Token #1 (expires Feb 10)                          │
│                                                                 │
│ Client Storage:                                                 │
│   - sessionStorage: Access #1                                  │
│   - localStorage: Refresh #1                                   │
└─────────────────────────────────────────────────────────────────┘

           ↓ POST /auth/refresh (Bearer Refresh #1)

┌─────────────────────────────────────────────────────────────────┐
│ AFTER REFRESH                                                   │
├─────────────────────────────────────────────────────────────────┤
│ Database:                                                       │
│   - Access Token #1 (DELETED)                                  │
│   - Refresh Token #1 (DELETED - revoked)                       │
│   - Access Token #2 (expires 10:29) ← NEW                      │
│   - Refresh Token #2 (expires Feb 10) ← NEW                    │
│                                                                 │
│ Client Storage:                                                 │
│   - sessionStorage: Access #2 ← UPDATED                        │
│   - localStorage: Refresh #2 ← UPDATED                         │
│                                                                 │
│ ⚠️  If Refresh #1 used again → 401 + Security Alert           │
└─────────────────────────────────────────────────────────────────┘
```

### 11.4 Login Flow (Dual Token)

```typescript
// POST /api/v1/auth/login
// Request
{
  "identifier": "admin",
  "password": "password",
  "remember_me": true
}

// Response
{
  "success": true,
  "data": {
    "access_token": "1|eyJhbGc...",
    "access_token_expires_at": "2026-01-11T10:15:00Z",
    "refresh_token": "2|dGhpcyBpc...",
    "refresh_token_expires_at": "2026-02-10T10:00:00Z",
    "token_type": "bearer",
    "user": { /* user data */ }
  }
}

// Frontend Storage
if (remember_me) {
  sessionStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token); // Persists 30 days
} else {
  sessionStorage.setItem('access_token', access_token);
  sessionStorage.setItem('refresh_token', refresh_token); // Deleted on close
}
```

### 11.5 Auto-Refresh Flow

#### Axios Interceptor (Recommended)

```typescript
// frontend/src/utils/api.ts

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not a retry attempt
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get new access token using refresh token
        const newAccessToken = await refreshAccessToken();

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh failed → Logout
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Refresh function
async function refreshAccessToken(): Promise<string> {
  const refreshToken =
    localStorage.getItem('refresh_token') ||
    sessionStorage.getItem('refresh_token');

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await api.post('/api/v1/auth/refresh', null, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  const { access_token, refresh_token: new_refresh_token } = response.data;

  // Update both tokens (rotation)
  sessionStorage.setItem('access_token', access_token);

  if (localStorage.getItem('refresh_token')) {
    localStorage.setItem('refresh_token', new_refresh_token);
  } else {
    sessionStorage.setItem('refresh_token', new_refresh_token);
  }

  return access_token;
}
```

### 11.6 Security Features

#### A. Token Reuse Detection

```php
// Backend: AuthController.php - refresh()

public function refresh(Request $request)
{
    $user = $request->user();
    $oldRefreshToken = $user->currentAccessToken();

    // Check if token was already revoked (deleted)
    if (!$oldRefreshToken) {
        // Token reuse detected! This is an attack.

        // Revoke ALL tokens for this user
        $user->tokens()->delete();

        // Log security event
        Log::warning('Token reuse detected', [
            'user_id' => $user->id,
            'ip' => $request->ip(),
        ]);

        // Send email alert
        Mail::to($user->email)->send(new SecurityAlertMail());

        return response()->json([
            'error' => 'TOKEN_REUSE_DETECTED',
            'message' => 'Security breach detected. All sessions terminated.',
        ], 401);
    }

    // ... normal rotation flow ...
}
```

#### B. Token Abilities Enforcement

```php
// Middleware: CheckTokenAbility.php

public function handle($request, Closure $next, $ability)
{
    $token = $request->user()->currentAccessToken();

    if (!$token->can($ability)) {
        return response()->json([
            'error' => 'INVALID_TOKEN_TYPE',
            'message' => "This endpoint requires '{$ability}' ability",
        ], 403);
    }

    return $next($request);
}

// Routes
Route::middleware(['auth:sanctum', 'ability:api:access'])->group(function () {
    Route::get('tasks', [TaskController::class, 'index']); // Requires access token
});

Route::middleware(['auth:sanctum', 'ability:api:refresh'])->group(function () {
    Route::post('auth/refresh', [AuthController::class, 'refresh']); // Requires refresh token
});
```

### 11.7 App Launch Flow

```
User opens app
    ↓
Check for refresh token in storage
    ↓
    ├─ No refresh token → Redirect to Sign In
    │
    └─ Has refresh token
          ↓
      POST /auth/refresh
          ↓
          ├─ 200 OK → Get new access token → Load app
          │
          └─ 401 Error → Refresh token expired
                          ↓
                     Clear storage → Redirect to Sign In
```

### 11.8 User Experience Timeline

```
Day 1:
  08:00 - Login (Remember Me = true)
  08:14 - Access token auto-refreshed (user doesn't notice)
  08:28 - Access token auto-refreshed
  12:00 - Lunch break (1 hour idle)
  13:00 - Return → Access token expired → Auto-refresh → Continue working
  17:00 - Close browser

Day 2:
  08:00 - Open browser
        → Refresh token in localStorage
        → Auto-refresh to get new access token
        → Auto-login successful ✅
        → User doesn't need to enter password

Day 30:
  → Refresh token still valid → Auto-login ✅

Day 31:
  → Refresh token expired → Must login again
```

### 11.9 Migration from Single Token

#### Phase 1: Backend Implementation
1. Update `login()` to create 2 tokens
2. Implement `refresh()` with rotation
3. Add token abilities to routes
4. Deploy to production

#### Phase 2: Frontend Implementation
1. Update login response handling
2. Implement axios interceptor for auto-refresh
3. Update storage logic (sessionStorage + localStorage)
4. Test auto-login flow

#### Phase 3: Backward Compatibility
- Both systems work in parallel during migration
- Old clients continue using single token
- New clients use dual token
- Gradual rollout to users

### 11.10 Database Schema (No Changes Required)

```sql
-- personal_access_tokens table (existing, no changes needed)
CREATE TABLE personal_access_tokens (
  id BIGINT PRIMARY KEY,
  tokenable_type VARCHAR(255),
  tokenable_id BIGINT,
  name VARCHAR(255),              -- 'access_token' or 'refresh_token'
  token VARCHAR(64) UNIQUE,
  abilities TEXT,                 -- '["api:access"]' or '["api:refresh"]'
  last_used_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX idx_tokenable (tokenable_type, tokenable_id),
  INDEX idx_token (token)
);
```

**No migration needed** - Existing table supports dual token system.

---

## 12. Related Documents

| Document | Path |
|----------|------|
| Basic Spec | `docs/specs/basic/_shared/authentication-basic.md` |
| API Login Spec | `docs/specs/api/auth/api-auth-login.md` |
| Test Guide | `QUICK_TEST_GUIDE.md` |
| Test Scenarios | `TEST_SCENARIO_IDLE_TIMEOUT.md` |
| App General Basic | `docs/specs/basic/_shared/app-general-basic.md` |

