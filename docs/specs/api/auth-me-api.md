# API Specification: Get Current User

> **API Name**: auth_me_api
> **Method**: GET
> **Endpoint**: `/api/v1/auth/me`
> **Module**: Common (All modules)
> **Last Updated**: 2026-01-12

---

## 1. Parameters

### HeaderParam

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `Authorization` | string | Yes | Bearer token: `Bearer {access_token}` |
| `Accept` | string | Yes | Must be `application/json` |

**Example Request:**
```http
GET /api/v1/auth/me HTTP/1.1
Host: api.example.com
Authorization: Bearer 1|ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
Accept: application/json
```

---

## 2. Description

This API retrieves the current authenticated user's information. It is used to:
- Verify that the access token is still valid
- Get updated user profile data
- Check user's current role and permissions
- Load user's store and department assignments

**Authentication Required:**
- Yes, must include valid access token in Authorization header
- Token must have `api:access` ability (refresh tokens cannot be used)

**Use Cases:**
- Verify token validity before making other API calls
- Refresh user data in frontend state
- Check if user's role or permissions have changed
- Validate user session on page reload

---

## 3. Business Logic

### 3.1 Get Current User Flow

```
1. Extract Bearer token from Authorization header
   ↓
2. If no token → Return 401 "Unauthenticated"
   ↓
3. Find token in database
   ↓
4. If token not found or revoked → Return 401 "Unauthenticated"
   ↓
5. Check token expiration
   ↓
6. If token expired → Return 401 "Token expired"
   ↓
7. Check token abilities (must have 'api:access')
   ↓
8. If wrong ability → Return 403 "Token cannot access this endpoint"
   ↓
9. Load user from token association
   ↓
10. Check account status
   ↓
11. If account inactive → Return 401 "Account not active"
   ↓
12. Load user relationships (store, department)
   ↓
13. Return success response with user data
```

### 3.2 Account Status Check

| Status | Behavior |
|--------|----------|
| `active` | Return user data |
| `inactive` | Return 401 error |
| `suspended` | Return 401 error |
| `deleted` | Return 401 error (treated as not found) |

### 3.3 Security Requirements

| Requirement | Specification |
|-------------|---------------|
| **Token Validation** | Must verify token exists, not expired, and has correct ability |
| **Account Status** | Must verify account is active before returning data |
| **Data Loading** | Must load complete user profile including relationships |
| **Token Ability** | Only access tokens (`api:access`) allowed, refresh tokens rejected |

---

## 4. Return

### HTTPstatus: 200 OK

#### Success Response

```json
{
  "success": true,
  "data": {
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

#### 401 - Unauthorized (No Token)

```json
{
  "success": false,
  "error": "Unauthenticated",
  "error_code": "UNAUTHENTICATED"
}
```

**Cause:** No Authorization header provided or token is empty.

#### 401 - Unauthorized (Invalid Token)

```json
{
  "success": false,
  "error": "Invalid token",
  "error_code": "INVALID_TOKEN"
}
```

**Causes:**
- Token not found in database
- Token already revoked
- Token belongs to different user

#### 401 - Unauthorized (Token Expired)

```json
{
  "success": false,
  "error": "Token expired",
  "error_code": "TOKEN_EXPIRED"
}
```

**Note:** Access tokens expire after 15 minutes. Use refresh token to obtain new access token.

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
  "error": "Token cannot access this endpoint",
  "error_code": "INVALID_TOKEN_ABILITY"
}
```

**Cause:** Attempted to use refresh token (ability: `api:refresh`) instead of access token (ability: `api:access`).

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

System must be able to find access token by token string.

**Requirement**: Query token records where token matches (after hashing) and token has not been revoked.

### 5.2 User Data Loading

When token is validated, system must load:
- Basic user information (id, staff_code, name, email, phone, role, position)
- Store information (if user assigned to store)
  - Store ID, Store name
- Department information (if user assigned to department)
  - Department ID, Department name
- Avatar/profile picture URL

**Requirement**: Single query with relationship loading to minimize database round trips.

### 5.3 Account Status Verification

System must verify user's account status is `active` before returning data.

**Requirement**: Check account status field and reject inactive/suspended/deleted accounts.

---

## 6. Security Considerations

### 6.1 Token Validation Requirements

| Check | Requirement |
|-------|-------------|
| **Token Existence** | Token must exist in database |
| **Token Expiration** | Token must not be expired (15 minutes for access tokens) |
| **Token Ability** | Token must have `api:access` ability |
| **Token Revocation** | Token must not be revoked |
| **Account Status** | User account must be active |

### 6.2 Rate Limiting

| Endpoint | Limit | Window | Purpose |
|----------|-------|--------|---------|
| `/auth/me` | 60 requests | 1 minute | Prevent abuse of user info endpoint |

**Note:** This is a read-only endpoint, so rate limit is higher than authentication endpoints.

---

## 7. Error Codes

| Error Code | HTTP Status | Meaning | User Action |
|------------|-------------|---------|-------------|
| `UNAUTHENTICATED` | 401 | No token provided | Provide valid access token |
| `INVALID_TOKEN` | 401 | Token not found or revoked | Login again or refresh token |
| `TOKEN_EXPIRED` | 401 | Access token expired (15 minutes passed) | Use refresh token to get new access token |
| `ACCOUNT_INACTIVE` | 401 | Account disabled/suspended | Contact administrator |
| `INVALID_TOKEN_ABILITY` | 403 | Wrong token type (used refresh token) | Use access token instead |

---

## 8. Test Scenarios

**Key test scenarios to validate API behavior:**

| Category | Scenario | Expected Result |
|----------|----------|-----------------|
| **Valid Request** | GET /auth/me with valid access token | 200 OK, return user data |
| **No Token** | GET /auth/me without Authorization header | 401 UNAUTHENTICATED |
| **Invalid Token** | GET /auth/me with non-existent token | 401 INVALID_TOKEN |
| **Expired Token** | GET /auth/me with expired access token | 401 TOKEN_EXPIRED |
| **Account Status** | GET /auth/me with inactive account | 401 ACCOUNT_INACTIVE |
| **Wrong Token Type** | GET /auth/me with refresh token | 403 INVALID_TOKEN_ABILITY |
| **Token Abilities** | Access token has ability `api:access` | Request succeeds |
| **Data Loading** | Response includes store and department info | Complete user profile returned |
| **Rate Limiting** | Multiple requests (>60/min) | 429 RATE_LIMITED |

**Note:** Detailed test cases and test data are maintained separately in the test plan documentation.

---

## 9. Related APIs

| API | Endpoint | Description |
|-----|----------|-------------|
| **Sign In** | `POST /api/v1/auth/login` | Sign in with identifier + password |
| **Refresh Tokens** | `POST /api/v1/auth/refresh` | Get new access token using refresh token |
| **Logout** | `POST /api/v1/auth/logout` | Revoke all tokens |
| Change Password | `POST /api/v1/auth/change-password` | Change password (authenticated) |

---

## 10. Changelog

| Date | Changes |
|------|---------|
| 2026-01-12 | Initial API specification for Get Current User |
