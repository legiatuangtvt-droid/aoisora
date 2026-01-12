# API Specification: Logout

> **API Name**: auth_logout_api
> **Method**: POST
> **Endpoint**: `/api/v1/auth/logout`
> **Module**: Common (All modules)
> **Last Updated**: 2026-01-12

---

## 1. Parameters

### HeaderParam

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `Content-Type` | string | Yes | Must be `application/json` |
| `Accept` | string | Yes | Must be `application/json` |
| `Authorization` | string | Yes | Bearer {access_token} |

### RequestBody

No request body required.

---

## 2. Description

This API logs out the current user by revoking all their tokens (access and refresh tokens).

**Security Features:**
- Revokes all tokens for the authenticated user
- Clears server-side token records
- Prevents reuse of revoked tokens
- Frontend must also clear client-side storage

**Authentication Required:**
- User must be authenticated with valid access token
- Bearer token must be included in Authorization header

---

## 3. Business Logic

### 3.1 Logout Flow

```
1. Validate Authorization header
   ↓
2. Extract user ID from access token
   ↓
3. If token invalid → Return 401 "Unauthenticated"
   ↓
4. Revoke ALL tokens for this user
   - Delete all access tokens
   - Delete all refresh tokens
   ↓
5. Return success response
```

### 3.2 Token Revocation

| Action | Description |
|--------|-------------|
| **Server-side** | Delete all token records for authenticated user from database |
| **Client-side** | Frontend must clear tokens from sessionStorage and localStorage |

### 3.3 Security Requirements

| Requirement | Specification |
|-------------|---------------|
| **Token Revocation** | Must revoke ALL user tokens (access + refresh) immediately |
| **Database Cleanup** | Must delete token records from database |
| **Reuse Prevention** | Revoked tokens must be rejected on subsequent requests |
| **Cross-device Logout** | Logout revokes tokens across all devices/sessions |

---

## 4. Return

### HTTPstatus: 200 OK

#### Success Response

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` for successful logout |
| `message` | string | Success message |

---

### Error Responses

#### 401 - Unauthorized (Invalid Token)

```json
{
  "success": false,
  "error": "Unauthenticated",
  "error_code": "UNAUTHENTICATED"
}
```

**Causes:**
- No Authorization header provided
- Invalid access token
- Expired access token
- Token already revoked

#### 500 - Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 5. Data Persistence Requirements

### 5.1 Token Revocation Requirements

System must delete all token records for authenticated user:

**Access Tokens:**
- Find all access tokens where `user_id` matches authenticated user
- Delete all matching token records

**Refresh Tokens:**
- Find all refresh tokens where `user_id` matches authenticated user
- Delete all matching token records

**Requirement**: Single operation to delete all user tokens, ensuring complete logout.

---

## 6. Frontend Integration

### 6.1 Logout Function

```typescript
// Logout function in AuthContext
const logout = async (): Promise<void> => {
  try {
    // Get access token
    const accessToken = sessionStorage.getItem('access_token');

    if (accessToken) {
      // Call logout API
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
    }
  } catch (error) {
    // Ignore API errors, always clear local storage
    console.error('Logout API error:', error);
  } finally {
    // ALWAYS clear client-side storage (even if API fails)
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token_expires_at');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('refresh_token_expires_at');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('refresh_token_expires_at');
    localStorage.removeItem('optichain_auth');

    // Redirect to sign in
    router.push('/auth/signin');
  }
};
```

### 6.2 Client-Side Cleanup Checklist

| Storage | Keys to Clear |
|---------|---------------|
| sessionStorage | `access_token`, `access_token_expires_at`, `refresh_token`, `refresh_token_expires_at` |
| localStorage | `refresh_token`, `refresh_token_expires_at`, `optichain_auth` |

**Important:** Client-side cleanup must happen regardless of API call success/failure.

---

## 7. Security Considerations

### 7.1 Token Revocation Requirements

| Requirement | Specification |
|-------------|---------------|
| **Immediate Revocation** | All tokens must be revoked immediately upon logout |
| **Cross-Device** | Logout must revoke tokens on ALL devices |
| **Database Cleanup** | Token records must be deleted from database |
| **No Grace Period** | Revoked tokens rejected immediately, no delay |
| **Client-side Cleanup** | Frontend must clear storage even if API fails |

### 7.2 Security Best Practices

| Practice | Implementation |
|----------|----------------|
| **Always Clear Storage** | Frontend clears tokens even if API call fails |
| **Redirect After Logout** | Always redirect to sign in page |
| **No Token Caching** | Don't cache tokens after logout |
| **Session Termination** | Terminate all active sessions for user |

---

## 8. Error Codes

| Error Code | HTTP Status | Meaning | User Action |
|------------|-------------|---------|-------------|
| `UNAUTHENTICATED` | 401 | Invalid or missing access token | Redirect to sign in |

**Note:** Frontend should always clear storage and redirect to sign in, regardless of API response.

---

## 9. Test Scenarios

**Key test scenarios to validate API behavior:**

| Category | Scenario | Expected Result |
|----------|----------|-----------------|
| **Valid Logout** | Logout with valid access token | 200 OK, all tokens revoked |
| **Token Revocation** | Use revoked access token for API call | 401 UNAUTHENTICATED |
| **Token Revocation** | Use revoked refresh token to refresh | 401 UNAUTHENTICATED |
| **Invalid Token** | Logout with expired access token | 401 UNAUTHENTICATED |
| **Invalid Token** | Logout without Authorization header | 401 UNAUTHENTICATED |
| **Cross-Device** | Logout on device A, use token on device B | Device B token also revoked |
| **Client Cleanup** | Verify frontend clears all storage keys | All tokens removed from storage |
| **Redirect** | After logout, verify redirect to sign in | User redirected to `/auth/signin` |

**Note:** Detailed test cases and test data are maintained separately in the test plan documentation.

---

## 10. Related APIs

| API | Endpoint | Description |
|-----|----------|-------------|
| **Sign In** | `POST /api/v1/auth/login` | Sign in with identifier + password |
| **Sign In with Google** | `POST /api/v1/auth/login/google` | Sign in with Google OAuth2 |
| **Refresh Tokens** | `POST /api/v1/auth/refresh` | Get new access token using refresh token |
| Get Current User | `GET /api/v1/auth/me` | Verify token and get user info |

---

## 11. Changelog

| Date | Changes |
|------|---------|
| 2026-01-12 | Initial API specification for Logout |
