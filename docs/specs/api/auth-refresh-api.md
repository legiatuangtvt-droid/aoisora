# API Specification: Refresh Access Token

> **API Name**: auth_refresh_api
> **Method**: POST
> **Endpoint**: `/api/v1/auth/refresh`
> **Module**: Common (All modules)
> **Last Updated**: 2026-01-12

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
| `refresh_token` | string | Yes | - | The refresh token obtained from login |

**Example Request:**
```json
{
  "refresh_token": "2|XYZ789abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRS"
}
```

---

## 2. Description

This API refreshes an expired or about-to-expire access token using a valid refresh token.

**Token Rotation (Security Feature):**
- Returns **BOTH** new access token AND new refresh token
- Old refresh token is immediately revoked (cannot be reused)
- This prevents token replay attacks

**Use Cases:**
- Access token expired (after 15 minutes)
- Access token about to expire (frontend should refresh ~1 min before expiration)
- User reopens app with stored refresh token (auto-login)

**Authentication Required:**
- No Authorization header needed
- Refresh token is sent in request body

---

## 3. Business Logic

### 3.1 Token Refresh Flow

```
1. Validate request parameters
   ↓
2. Find refresh token in database
   ↓
3. If token not found → Return 401 "Invalid refresh token"
   ↓
4. Check token expiration
   ↓
5. If token expired → Return 401 "Refresh token expired"
   ↓
6. Check token abilities (must have 'api:refresh')
   ↓
7. If wrong ability → Return 403 "Token cannot be used for refresh"
   ↓
8. Load user data from token
   ↓
9. Check account status
   ↓
10. If account inactive → Return 401 "Account not active"
   ↓
11. Revoke old refresh token
   ↓
12. Generate NEW access token (15 minutes, ability: 'api:access')
   ↓
13. Generate NEW refresh token (same expiration as old one, ability: 'api:refresh')
   ↓
14. Load user relationships (store, department)
   ↓
15. Return success response with BOTH new tokens and user data
```

### 3.2 Token Rotation Logic

| Step | Action | Purpose |
|------|--------|---------|
| 1 | Revoke old refresh token | Prevent token reuse |
| 2 | Generate new access token | 15 minutes lifetime |
| 3 | Generate new refresh token | Same expiration as old token |
| 4 | Return both new tokens | Frontend updates storage |

**Important:** New refresh token inherits the expiration strategy from old token:
- If old token had 30-day expiration (Remember Me = true) → New token also 30 days from now
- If old token had NULL expiration (Remember Me = false) → New token also NULL

### 3.3 Security Requirements

| Requirement | Specification |
|-------------|---------------|
| **Token Rotation** | Both tokens must be rotated on each refresh |
| **Token Revocation** | Old refresh token must be immediately revoked |
| **Reuse Detection** | System must detect and block reuse of revoked tokens |
| **Ability Check** | Only tokens with `api:refresh` ability can refresh |
| **Account Status** | Inactive accounts cannot refresh tokens |

---

## 4. Return

### HTTPstatus: 200 OK

#### Success Response

```json
{
  "success": true,
  "data": {
    "access_token": "7|ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    "access_token_expires_at": "2026-01-12T10:15:00.000000Z",
    "refresh_token": "8|XYZ789abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRS",
    "refresh_token_expires_at": "2026-02-11T10:00:00.000000Z",
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
| `data.access_token` | string | NEW access token for API authentication (15 min) |
| `data.access_token_expires_at` | string (ISO 8601) | Access token expiration timestamp |
| `data.refresh_token` | string | NEW refresh token (old one revoked) |
| `data.refresh_token_expires_at` | string (ISO 8601) | Refresh token expiration timestamp (NULL if session-based) |
| `data.token_type` | string | Always "bearer" |
| `data.user` | object | Current user information |
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

#### 401 - Unauthorized (Invalid Refresh Token)

```json
{
  "success": false,
  "error": "Invalid refresh token",
  "error_code": "INVALID_REFRESH_TOKEN"
}
```

**Causes:**
- Refresh token not found in database
- Refresh token already revoked
- Refresh token belongs to different user

#### 401 - Unauthorized (Expired Refresh Token)

```json
{
  "success": false,
  "error": "Refresh token expired",
  "error_code": "REFRESH_TOKEN_EXPIRED"
}
```

**Note:** Only occurs if Remember Me = true and 30 days have passed.

#### 401 - Unauthorized (Account Inactive)

```json
{
  "success": false,
  "error": "This account is not active",
  "error_code": "ACCOUNT_INACTIVE"
}
```

#### 403 - Forbidden (Wrong Token Type)

```json
{
  "success": false,
  "error": "Token cannot be used for refresh",
  "error_code": "INVALID_TOKEN_ABILITY"
}
```

**Cause:** Attempted to use access token (ability: `api:access`) instead of refresh token (ability: `api:refresh`).

#### 422 - Validation Error

```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "refresh_token": [
      "The refresh token field is required."
    ]
  }
}
```

**Common validation errors:**
- `refresh_token` field is required
- `refresh_token` must be a string

#### 500 - Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 5. Data Persistence Requirements

### 5.1 Token Lookup

System must be able to find refresh token by token string.

**Requirement**: Query token records where token matches (after hashing).

### 5.2 Token Revocation

When refresh succeeds:

**Old Refresh Token:**
- Must be deleted or marked as revoked immediately
- Must not be usable for subsequent refreshes

**Requirement**: Delete old token record after generating new tokens.

### 5.3 New Token Creation

System must create TWO new tokens:

**New Access Token:**
- Token string (must be hashed before storage)
- User association
- Token type: "access_token"
- Token abilities: "api:access"
- Expiration: 15 minutes from now
- Creation timestamp

**New Refresh Token:**
- Token string (must be hashed before storage)
- User association
- Token type: "refresh_token"
- Token abilities: "api:refresh"
- Expiration: Inherit from old token strategy
  - If old token had 30-day expiration → 30 days from now
  - If old token had NULL expiration → NULL (session-based)
- Creation timestamp

### 5.4 User Data Loading

System must load complete user profile (same as login):
- Basic user information
- Store information (if assigned)
- Department information (if assigned)
- Avatar URL

---

## 6. Frontend Integration

### 6.1 Auto-Refresh Implementation

```typescript
// Auto-refresh access token before expiration
const setupAutoRefresh = () => {
  // Check token expiration every minute
  setInterval(async () => {
    const expiresAt = sessionStorage.getItem('access_token_expires_at');
    if (!expiresAt) return;

    const expirationTime = new Date(expiresAt).getTime();
    const now = Date.now();
    const timeUntilExpiration = expirationTime - now;

    // Refresh if expires within 1 minute (60000 ms)
    if (timeUntilExpiration < 60000 && timeUntilExpiration > 0) {
      await refreshAccessToken();
    }
  }, 60000); // Check every minute
};
```

### 6.2 Refresh Function

```typescript
// Refresh access token function in AuthContext
const refreshAccessToken = async (): Promise<boolean> => {
  try {
    // Get refresh token from storage
    let refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      refreshToken = sessionStorage.getItem('refresh_token');
    }

    if (!refreshToken) {
      // No refresh token, cannot auto-login
      await logout();
      return false;
    }

    // Call refresh API
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      // Refresh failed, logout user
      await logout();
      return false;
    }

    // Update tokens and user data
    const { access_token, refresh_token: newRefreshToken, user } = data.data;

    // Update access token (always sessionStorage)
    sessionStorage.setItem('access_token', access_token);
    sessionStorage.setItem('access_token_expires_at', data.data.access_token_expires_at);

    // Update refresh token (same location as before)
    const wasInLocalStorage = localStorage.getItem('refresh_token') !== null;
    if (wasInLocalStorage) {
      localStorage.setItem('refresh_token', newRefreshToken);
      localStorage.setItem('refresh_token_expires_at', data.data.refresh_token_expires_at);
    } else {
      sessionStorage.setItem('refresh_token', newRefreshToken);
      sessionStorage.setItem('refresh_token_expires_at', data.data.refresh_token_expires_at);
    }

    // Update user data
    localStorage.setItem('optichain_auth', JSON.stringify({ user }));

    return true;
  } catch (error) {
    console.error('Token refresh error:', error);
    await logout();
    return false;
  }
};
```

### 6.3 Auto-Login on App Load

```typescript
// Check for existing session on app load
useEffect(() => {
  const initAuth = async () => {
    // Check if we have a refresh token
    const refreshToken = localStorage.getItem('refresh_token') ||
                         sessionStorage.getItem('refresh_token');

    if (refreshToken) {
      // Try to refresh access token
      const success = await refreshAccessToken();
      if (success) {
        // Auto-login successful, redirect to Task List (default screen)
        router.push('/tasks/list');
      } else {
        // Auto-login failed, show sign in page
        router.push('/auth/signin');
      }
    } else {
      // No refresh token, show sign in page
      router.push('/auth/signin');
    }
  };

  initAuth();
}, []);
```

---

## 7. Security Considerations

### 7.1 Token Rotation Security

| Security Measure | Implementation | Benefit |
|------------------|----------------|---------|
| **Token Rotation** | Both tokens replaced on refresh | Stolen tokens have limited lifetime |
| **Immediate Revocation** | Old token revoked before returning new ones | Prevents concurrent use of old token |
| **Reuse Detection** | Backend detects revoked token reuse | Automatic breach detection |
| **One-Time Use** | Each refresh token can only be used once | Prevents token replay attacks |

### 7.2 Token Reuse Detection

```
Timeline: Token Rotation with Reuse Detection

T0: User has valid refresh_token_A
T1: User calls /refresh with refresh_token_A
T2: Backend revokes refresh_token_A, issues refresh_token_B
T3: Attacker tries to use refresh_token_A (revoked)
    → Backend detects reuse attempt
    → Backend revokes ALL tokens for this user
    → User must login again
```

**Behavior:** If a revoked refresh token is presented, system should:
1. Detect that token was previously revoked
2. Revoke ALL tokens for that user (security breach response)
3. Return 401 error
4. User must login again on all devices

---

## 8. Error Codes

| Error Code | HTTP Status | Meaning | User Action |
|------------|-------------|---------|-------------|
| `INVALID_REFRESH_TOKEN` | 401 | Refresh token not found or revoked | Login again |
| `REFRESH_TOKEN_EXPIRED` | 401 | Refresh token expired (30 days passed, Remember Me only) | Login again |
| `ACCOUNT_INACTIVE` | 401 | Account disabled/suspended | Contact administrator |
| `INVALID_TOKEN_ABILITY` | 403 | Wrong token type (used access token instead of refresh token) | Use correct token |
| `VALIDATION_ERROR` | 422 | Invalid input format | Check required fields |

---

## 9. Test Scenarios

**Key test scenarios to validate API behavior:**

| Category | Scenario | Expected Result |
|----------|----------|-----------------|
| **Valid Refresh** | Refresh with valid refresh token | 200 OK, return new access + refresh tokens |
| **Token Rotation** | Old refresh token reused after successful refresh | 401 INVALID_REFRESH_TOKEN, revoke all user tokens |
| **Token Expiration** | Refresh with expired refresh token (30 days, Remember Me) | 401 REFRESH_TOKEN_EXPIRED |
| **Account Status** | Refresh with inactive account | 401 ACCOUNT_INACTIVE |
| **Wrong Token Type** | Refresh with access token instead of refresh token | 403 INVALID_TOKEN_ABILITY |
| **Validation** | Refresh without refresh_token field | 422 VALIDATION_ERROR |
| **Auto-Refresh** | Access token expires, frontend auto-refreshes | New tokens obtained, no interruption |
| **Token Abilities** | New access token has ability `api:access` | Can call regular APIs |
| **Token Abilities** | New refresh token has ability `api:refresh` | Can only refresh, cannot call regular APIs |
| **Expiration Inheritance** | New refresh token inherits old token strategy | Same expiration logic as old token |

**Note:** Detailed test cases and test data are maintained separately in the test plan documentation.

---

## 10. Related APIs

| API | Endpoint | Description |
|-----|----------|-------------|
| **Sign In** | `POST /api/v1/auth/login` | Sign in with identifier + password |
| **Sign In with Google** | `POST /api/v1/auth/login/google` | Sign in with Google OAuth2 |
| **Logout** | `POST /api/v1/auth/logout` | Revoke all tokens |
| Get Current User | `GET /api/v1/auth/me` | Verify token and get user info |

---

## 11. Changelog

| Date | Changes |
|------|---------|
| 2026-01-12 | Initial API specification for Refresh Access Token |
