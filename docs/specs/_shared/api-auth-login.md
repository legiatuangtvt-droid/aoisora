# API Specification: Sign In (Login)

> **API Name**: auth_login_api
> **Method**: POST
> **Endpoint**: `/api/v1/auth/login`
> **Module**: Common (All modules)
> **Last Updated**: 2026-01-10

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

**Token Lifetime:**
- `remember_me = false`: 24 hours (default)
- `remember_me = true`: 30 days

**Authentication Method:**
- Laravel Sanctum Bearer Token
- Token must be included in `Authorization: Bearer {token}` header for protected endpoints

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
8. Generate access token with appropriate expiration
   ↓
9. Load user relationships (store, department)
   ↓
10. Return success response with token and user data
```

### 3.2 Account Status Check

| Status | Behavior |
|--------|----------|
| `active` | Allow login |
| `inactive` | Block login with error message |
| `suspended` | Block login with error message |
| `deleted` | Block login (treated as not found) |

### 3.3 Security Features

| Feature | Implementation |
|---------|----------------|
| **Password Hashing** | BCrypt via Laravel's `Hash::make()` |
| **Rate Limiting** | Laravel throttle middleware (60 requests/minute) |
| **Token Expiration** | 24 hours (default) or 30 days (remember_me) |
| **Password Validation** | Backend validates against stored hash |
| **Account Lockout** | ⏳ Future enhancement (after N failed attempts) |

---

## 4. Return

### HTTPstatus: 200 OK

#### Success Response

```json
{
  "success": true,
  "access_token": "1|ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  "token_type": "bearer",
  "expires_at": "2026-02-09T10:30:00.000000Z",
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
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` for successful response |
| `access_token` | string | Laravel Sanctum bearer token |
| `token_type` | string | Always "bearer" |
| `expires_at` | string (ISO 8601) | Token expiration timestamp |
| `user` | object | Authenticated user information |
| `user.id` | integer | Staff ID (primary key) |
| `user.staff_code` | string | Employee code (e.g., "HQ001", "ST001") |
| `user.full_name` | string | User's full name |
| `user.email` | string | User's email address |
| `user.phone` | string | User's phone number |
| `user.role` | string | User role: ADMIN, MANAGER, STAFF, etc. |
| `user.position` | string | Job position/title |
| `user.store_id` | integer\|null | Store ID (null for HQ users) |
| `user.store_name` | string\|null | Store name (null for HQ users) |
| `user.department_id` | integer\|null | Department ID |
| `user.department_name` | string\|null | Department name |
| `user.avatar_url` | string\|null | Profile picture URL |

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

## 5. Database Queries

### 5.1 Find User by Identifier

```sql
-- Find staff by email, phone, sap_code, or username
SELECT *
FROM staff
WHERE email = :identifier
   OR phone = :identifier
   OR sap_code = :identifier
   OR username = :identifier
LIMIT 1;
```

### 5.2 Load User Relationships

```sql
-- Load store information
SELECT s.store_id, s.store_name, s.store_code
FROM stores s
WHERE s.store_id = :user_store_id;

-- Load department information
SELECT d.department_id, d.department_name, d.department_code
FROM departments d
WHERE d.department_id = :user_department_id;
```

### 5.3 Create Access Token

```sql
-- Insert new personal access token
INSERT INTO personal_access_tokens (
    tokenable_type,
    tokenable_id,
    name,
    token,
    abilities,
    expires_at,
    created_at,
    updated_at
)
VALUES (
    'App\\Models\\Staff',
    :staff_id,
    'auth-token',
    :hashed_token,
    '["*"]',
    :expires_at,
    NOW(),
    NOW()
);
```

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

    // Store token and user data
    localStorage.setItem('optichain_token', data.access_token);
    localStorage.setItem('optichain_auth', JSON.stringify({ user: data.user }));

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

| Storage Key | Value | Description |
|-------------|-------|-------------|
| `optichain_token` | string | Access token for API requests |
| `optichain_auth` | JSON string | User information object |

### 6.3 Subsequent API Requests

```typescript
// Use token in protected API calls
const response = await fetch(`${API_URL}/tasks`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  }
});
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

### 7.2 Rate Limiting

| Endpoint | Limit | Window | Block Duration |
|----------|-------|--------|----------------|
| `/auth/login` | 5 attempts | 1 minute | 1 minute |
| `/auth/login` | 10 attempts | 15 minutes | 15 minutes |

**Implementation:** Laravel's `throttle` middleware

### 7.3 Token Security

| Feature | Implementation |
|---------|----------------|
| **Storage** | Browser localStorage (client-side) |
| **Transmission** | HTTPS only in production |
| **Expiration** | Automatic after 24h/30d |
| **Revocation** | Manual logout deletes token |
| **Validation** | Every API request checks token validity |

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
| 10 | Login with remember_me = true | Token expires in 30 days |
| 11 | Login with remember_me = false | Token expires in 24 hours |
| 12 | Multiple failed login attempts | 429 Rate Limited |

---

## 10. Related APIs

| API | Endpoint | Description |
|-----|----------|-------------|
| Get Current User | `GET /api/v1/auth/me` | Verify token and get user info |
| Logout | `POST /api/v1/auth/logout` | Revoke current token |
| Forgot Password | `POST /api/v1/auth/forgot-password` | Request password reset |
| Verify Reset Code | `POST /api/v1/auth/verify-code` | Verify OTP code |
| Reset Password | `POST /api/v1/auth/reset-password` | Set new password |
| Change Password | `POST /api/v1/auth/change-password` | Change password (authenticated) |

---

## 11. Notes

- ✅ This API is already implemented in backend and frontend
- ✅ Authentication flow is fully functional
- ✅ Session expiration handling implemented
- ✅ Token verification on app load works correctly
- ✅ 401 auto-logout implemented
- ⏳ Account lockout after multiple failed attempts (future enhancement)
- ⏳ Password strength meter on Sign In (future enhancement)
- ⏳ Two-factor authentication (future enhancement)

---

## 12. Changelog

| Date | Changes |
|------|---------|
| 2026-01-10 | Initial API specification created based on existing implementation |
