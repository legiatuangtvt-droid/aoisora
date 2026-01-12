# API Specification: Sign In (Login)

> **API Name**: auth_login_api
> **Method**: POST
> **Endpoint**: `/api/v1/auth/login`
> **Module**: Common (All modules)
> **Last Updated**: 2026-01-11

---

## 1. Parameters

### HeaderParam

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `Content-Type` | string | Yes | Must be `application/json` |
| `Accept` | string | Yes | Must be `application/json` |

### RequestBody

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `identifier` | string | Yes | - | Email, phone, SAP code, or username |
| `password` | string | Yes | - | User's password |
| `remember_me` | boolean | No | false | Whether to extend token lifetime to 30 days |

**Example Request:**
```json
{
  "identifier": "admin@example.com",
  "password": "SecurePass123!",
  "remember_me": true
}
```

---

## 2. Description

This API authenticates users and returns an access token for subsequent API requests.

**Supported Identifiers:**
- Email address
- Phone number
- SAP code
- Username

**Token System:**
- **Dual Token System**: Returns both Access Token and Refresh Token
- **Access Token**: 15 minutes lifetime, used for API authentication
- **Refresh Token**:
  - If `remember_me = true`: 30 days lifetime (stored in database), persists in localStorage
  - If `remember_me = false`: No database expiration, stored in sessionStorage (deleted when browser closes)

**Authentication Method:**
- Bearer Token authentication
- Access Token must be included in `Authorization: Bearer {token}` header for protected endpoints
- Refresh Token only used with `/auth/refresh` endpoint

---

## 3. Business Logic

### 3.1 Authentication Flow

```
1. Validate request parameters
   ↓
2. Find user by identifier (email, phone, sap_code, or username)
   ↓
3. If user not found → Return 401 "Account not found"
   ↓
4. Verify password hash
   ↓
5. If password incorrect → Return 401 "Incorrect password"
   ↓
6. Check account status
   ↓
7. If account inactive → Return 401 "Account not active"
   ↓
8. Generate Access Token (15 minutes, ability: 'api:access')
   ↓
9. Generate Refresh Token (ability: 'api:refresh')
   - If remember_me = true: 30 days expiration
   - If remember_me = false: No expiration (session-based, relies on frontend storage)
   ↓
10. Load user relationships (store, department)
   ↓
11. Return success response with both tokens and user data
```

### 3.2 Account Status Check

| Status | Behavior |
|--------|----------|
| `active` | Allow login |
| `inactive` | Block login with error message |
| `suspended` | Block login with error message |
| `deleted` | Block login (treated as not found) |

### 3.3 Security Requirements

| Requirement | Specification |
|-------------|---------------|
| **Password Storage** | Must be hashed (one-way), never stored as plain text |
| **Rate Limiting** | Maximum 60 login attempts per minute per IP |
| **Dual Token System** | Access Token (15 min) + Refresh Token (30 days if Remember Me, or session-based) |
| **Token Abilities** | Access tokens for API calls, Refresh tokens only for token refresh |
| **Token Rotation** | Both tokens replaced on each refresh for security |
| **Password Validation** | Backend validates against stored hash |
| **Account Lockout** | ⏳ Future enhancement (after N failed attempts) |

---

## 4. Return

### HTTPstatus: 200 OK

#### Success Response

```json
{
  "success": true,
  "data": {
    "access_token": "1|ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    "access_token_expires_at": "2026-01-11T10:15:00.000000Z",
    "refresh_token": "2|XYZ789abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRS",
    "refresh_token_expires_at": "2026-02-10T10:00:00.000000Z",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "staff_code": "HQ001",
      "full_name": "Nguyen Van Admin",
      "email": "admin@example.com",
      "phone": "+84912345678",
      "role": "ADMIN",
      "position": "System Administrator",
      "store_id": null,
      "store_name": null,
      "department_id": 1,
      "department_name": "IT Department",
      "avatar_url": "https://example.com/avatars/admin.jpg"
    }
  }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` for successful response |
| `data` | object | Response data container |
| `data.access_token` | string | Access token for API authentication (15 min) |
| `data.access_token_expires_at` | string (ISO 8601) | Access token expiration timestamp |
| `data.refresh_token` | string | Refresh token to obtain new access tokens (30 days) |
| `data.refresh_token_expires_at` | string (ISO 8601) | Refresh token expiration timestamp |
| `data.token_type` | string | Always "bearer" |
| `data.user` | object | Authenticated user information |
| `data.user.id` | integer | Staff ID (primary key) |
| `data.user.staff_code` | string | Employee code (e.g., "HQ001", "ST001") |
| `data.user.full_name` | string | User's full name |
| `data.user.email` | string | User's email address |
| `data.user.phone` | string | User's phone number |
| `data.user.role` | string | User role: ADMIN, MANAGER, STAFF, etc. |
| `data.user.position` | string | Job position/title |
| `data.user.store_id` | integer\|null | Store ID (null for HQ users) |
| `data.user.store_name` | string\|null | Store name (null for HQ users) |
| `data.user.department_id` | integer\|null | Department ID |
| `data.user.department_name` | string\|null | Department name |
| `data.user.avatar_url` | string\|null | Profile picture URL |

---

### Error Responses

#### 401 - Unauthorized (Account Not Found)

```json
{
  "success": false,
  "error": "Account not found",
  "error_code": "ACCOUNT_NOT_FOUND"
}
```

#### 401 - Unauthorized (Incorrect Password)

```json
{
  "success": false,
  "error": "Incorrect password",
  "error_code": "INCORRECT_PASSWORD"
}
```

#### 401 - Unauthorized (Account Inactive)

```json
{
  "success": false,
  "error": "This account is not active",
  "error_code": "ACCOUNT_INACTIVE"
}
```

#### 422 - Validation Error

```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "identifier": [
      "The identifier field is required."
    ],
    "password": [
      "The password field is required."
    ]
  }
}
```

**Common validation errors:**
- `identifier` field is required
- `password` field is required
- `remember_me` must be a boolean

#### 429 - Too Many Requests

```json
{
  "success": false,
  "message": "Too many login attempts. Please try again later.",
  "retry_after": 60
}
```

#### 500 - Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 5. Data Persistence Requirements

### 5.1 User Lookup

System must be able to find user by any of these identifiers:
- Email address
- Phone number
- SAP code
- Username

**Requirement**: Single query to check all identifier fields, return first match.

### 5.2 User Data Loading

When user is authenticated, system must load:
- Basic user information (id, name, email, phone, role, position)
- Store information (if user assigned to store)
  - Store ID, Store name, Store code
- Department information (if user assigned to department)
  - Department ID, Department name, Department code
- Avatar/profile picture URL

### 5.3 Token Storage Requirements

System must persist both tokens with following properties:

**Access Token:**
- Token string (must be hashed before storage)
- User association (link to authenticated user)
- Token type identifier: "access_token"
- Token abilities: "api:access"
- Expiration timestamp: 15 minutes from creation
- Creation timestamp

**Refresh Token:**
- Token string (must be hashed before storage)
- User association (link to authenticated user)
- Token type identifier: "refresh_token"
- Token abilities: "api:refresh"
- Expiration timestamp:
  - If `remember_me = true`: 30 days from creation
  - If `remember_me = false`: NULL (no expiration in database, relies on sessionStorage)
- Creation timestamp

**Token Revocation:**
- System must support immediate token revocation
- Old tokens must be deleted/marked invalid on refresh
- All tokens must be revoked on logout

---

## 6. Frontend Integration

### 6.1 Usage Example

```typescript
// Login function in AuthContext
const login = async (
  identifier: string,
  password: string,
  rememberMe: boolean = false
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
        remember_me: rememberMe,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Login failed'
      };
    }

    // Store tokens and user data (Dual Token System)
    const { access_token, refresh_token, user } = data.data;

    // Access token in sessionStorage (deleted when browser closes)
    sessionStorage.setItem('access_token', access_token);
    sessionStorage.setItem('access_token_expires_at', data.data.access_token_expires_at);

    // Refresh token storage depends on remember_me
    if (rememberMe) {
      // Remember Me = true → localStorage (persists 30 days)
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('refresh_token_expires_at', data.data.refresh_token_expires_at);
    } else {
      // Remember Me = false → sessionStorage (deleted when browser closes)
      sessionStorage.setItem('refresh_token', refresh_token);
      sessionStorage.setItem('refresh_token_expires_at', data.data.refresh_token_expires_at);
    }

    // User data
    localStorage.setItem('optichain_auth', JSON.stringify({ user }));

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Network error. Please check your connection.'
    };
  }
};
```

### 6.2 Token Storage

| Storage Location | Key | Value | Description |
|------------------|-----|-------|-------------|
| sessionStorage | `access_token` | string | Access token (15 min, deleted on browser close) |
| sessionStorage | `access_token_expires_at` | ISO 8601 string | Access token expiration timestamp |
| localStorage/sessionStorage | `refresh_token` | string | Refresh token (30 days if Remember Me) |
| localStorage/sessionStorage | `refresh_token_expires_at` | ISO 8601 string | Refresh token expiration timestamp |
| localStorage | `optichain_auth` | JSON string | User information object |

**Note:** Refresh token location depends on `remember_me`:
- `remember_me = true` → `localStorage` (persists after browser close, expires after 30 days)
- `remember_me = false` → `sessionStorage` (deleted on browser close, no database expiration)

### 6.3 Subsequent API Requests

```typescript
// Use ACCESS TOKEN in protected API calls
const accessToken = sessionStorage.getItem('access_token');

const response = await fetch(`${API_URL}/tasks`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,  // Use access token
    'Accept': 'application/json',
  }
});

// If 401 error → Auto-refresh using refresh token
// See /auth/refresh API documentation
```

---

## 7. Security Considerations

### 7.1 Password Requirements

For user account creation/password reset, enforce these rules:

| Rule | Requirement |
|------|-------------|
| **Minimum Length** | 8 characters |
| **Uppercase** | At least 1 uppercase letter (A-Z) |
| **Lowercase** | At least 1 lowercase letter (a-z) |
| **Numbers** | At least 1 digit (0-9) |
| **Special Characters** | At least 1 special char (@$!%*?&) |

**Validation Regex:**
```regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$
```

### 7.2 Rate Limiting Requirements

| Endpoint | Limit | Window | Block Duration |
|----------|-------|--------|----------------|
| `/auth/login` | 5 attempts | 1 minute | 1 minute |
| `/auth/login` | 10 attempts | 15 minutes | 15 minutes |

**Behavior:** System must track failed login attempts and temporarily block further attempts when limits are exceeded.

### 7.3 Token Security Requirements

| Requirement | Specification |
|-------------|---------------|
| **Dual Token System** | System must issue two tokens: Access (15 min) + Refresh (30 days if Remember Me, session-based otherwise) |
| **Token Abilities** | Access tokens can call APIs, Refresh tokens can only refresh |
| **Frontend Storage** | Access in sessionStorage, Refresh in localStorage/sessionStorage |
| **Transmission** | All tokens must be transmitted over HTTPS in production |
| **Auto-Refresh** | Frontend should auto-refresh access token before expiration (~14 min) |
| **Token Rotation** | System must replace both tokens on each refresh operation |
| **Revocation** | System must revoke all user tokens on manual logout |
| **Reuse Detection** | System must detect and block attempts to reuse revoked tokens |
| **Validation** | System must verify token validity and abilities on every API request |

---

## 8. Error Handling

### 8.1 Error Codes Reference

| Error Code | HTTP Status | Meaning | User Action |
|------------|-------------|---------|-------------|
| `ACCOUNT_NOT_FOUND` | 401 | No user with this identifier | Check email/phone/username |
| `INCORRECT_PASSWORD` | 401 | Password doesn't match | Re-enter password or reset |
| `ACCOUNT_INACTIVE` | 401 | Account disabled/suspended | Contact administrator |
| `VALIDATION_ERROR` | 422 | Invalid input format | Check required fields |
| `RATE_LIMITED` | 429 | Too many attempts | Wait before retrying |

### 8.2 Frontend Error Display

```typescript
// Error handling in Sign In component
if (!result.success) {
  switch (result.error_code) {
    case 'ACCOUNT_NOT_FOUND':
      setError('Account not found. Please check your credentials.');
      break;
    case 'INCORRECT_PASSWORD':
      setError('Incorrect password. Please try again.');
      break;
    case 'ACCOUNT_INACTIVE':
      setError('Your account is not active. Please contact support.');
      break;
    default:
      setError(result.error || 'Sign in failed');
  }
}
```

---

## 9. Testing

### 9.1 Test Accounts

| Username | Password | Role | Purpose |
|----------|----------|------|---------|
| `admin` | `password` | ADMIN | Full system access |
| `manager` | `password` | MANAGER | Department manager |
| `staff` | `password` | STAFF | Regular staff member |

### 9.2 Test Cases

| No | Test Case | Expected Result |
|----|-----------|-----------------|
| 1 | Login with valid email + correct password | 200 OK, return token |
| 2 | Login with valid phone + correct password | 200 OK, return token |
| 3 | Login with SAP code + correct password | 200 OK, return token |
| 4 | Login with username + correct password | 200 OK, return token |
| 5 | Login with non-existent email | 401 ACCOUNT_NOT_FOUND |
| 6 | Login with correct email + wrong password | 401 INCORRECT_PASSWORD |
| 7 | Login with inactive account | 401 ACCOUNT_INACTIVE |
| 8 | Login without identifier field | 422 Validation Error |
| 9 | Login without password field | 422 Validation Error |
| 10 | Login with remember_me = true | Refresh token in localStorage, 30 days expiration in DB |
| 11 | Login with remember_me = false | Refresh token in sessionStorage, no DB expiration (session-based) |
| 12 | Multiple failed login attempts | 429 Rate Limited |
| 13 | Verify access token has ability `api:access` | Can call regular APIs |
| 14 | Verify refresh token has ability `api:refresh` | Cannot call regular APIs |

---

## 10. Related APIs

| API | Endpoint | Description |
|-----|----------|-------------|
| **Refresh Tokens** | `POST /api/v1/auth/refresh` | **Get new access token using refresh token** |
| Get Current User | `GET /api/v1/auth/me` | Verify token and get user info |
| Logout | `POST /api/v1/auth/logout` | Revoke all tokens (access + refresh) |
| Forgot Password | `POST /api/v1/auth/forgot-password` | Request password reset |
| Verify Reset Code | `POST /api/v1/auth/verify-code` | Verify OTP code |
| Reset Password | `POST /api/v1/auth/reset-password` | Set new password |
| Change Password | `POST /api/v1/auth/change-password` | Change password (authenticated) |

---

## 11. Future Enhancements

| Feature | Priority | Description |
|---------|----------|-------------|
| **Account Lockout** | Medium | Block account after N failed login attempts |
| **Password Strength Meter** | Low | Real-time password strength indicator on Sign In |
| **Two-Factor Authentication** | High | Additional security layer with OTP/SMS/App |
| **Biometric Login** | Low | Fingerprint/Face ID support for mobile apps |
| **Login History** | Medium | Track and display recent login activities |

---

## 12. Changelog

| Date | Changes |
|------|---------|
| 2026-01-12 | Clarified refresh token expiration: 30 days (remember_me=true) vs NULL/session-based (remember_me=false) |
| 2026-01-11 | Refactored spec to be tech-agnostic (removed Laravel/SQL specifics) |
| 2026-01-11 | Updated spec for Dual Token System with Rotation |
| 2026-01-10 | Initial API specification created based on existing implementation |
