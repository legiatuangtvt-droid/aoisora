# API Specification: Reset Password

> **API Name**: auth_reset_password_api
> **Method**: POST
> **Endpoint**: `/api/v1/auth/reset-password`
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
| `token` | string | Yes | - | Temporary token from verify-code endpoint |
| `password` | string | Yes | - | New password |
| `password_confirmation` | string | Yes | - | Password confirmation (must match password) |

**Example Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "password": "NewPass123!",
  "password_confirmation": "NewPass123!"
}
```

---

## 2. Description

This API resets the user's password using the temporary token obtained from the verify-code endpoint. After successful password reset, all existing user tokens (access and refresh) are revoked for security.

**Password Requirements:**
- **Minimum Length**: 8 characters
- **Uppercase**: At least 1 uppercase letter (A-Z)
- **Lowercase**: At least 1 lowercase letter (a-z)
- **Numbers**: At least 1 digit (0-9)
- **Special Characters**: At least 1 special character (@$!%*?&)

**Security Measures:**
- Temporary token expires after 15 minutes
- Token is single-use (invalidated after password reset)
- All user tokens revoked after password reset (user must login again on all devices)
- Password must be hashed (one-way) before storage

---

## 3. Business Logic

### 3.1 Reset Password Flow

```
1. Validate request parameters
   ↓
2. Validate password format (min 8 chars, uppercase, lowercase, number, special char)
   ↓
3. If password invalid → Return 422 "Password does not meet requirements"
   ↓
4. Verify password and password_confirmation match
   ↓
5. If passwords don't match → Return 422 "Passwords do not match"
   ↓
6. Find temporary token in database
   ↓
7. If token not found → Return 401 "Invalid or expired reset token"
   ↓
8. Check token expiration (15 minutes)
   ↓
9. If token expired → Return 401 "Reset token expired"
   ↓
10. Check if token already used
   ↓
11. If token used → Return 401 "Reset token already used"
   ↓
12. Load user from token association
   ↓
13. Hash new password (one-way, cryptographically secure)
   ↓
14. Update user password in database
   ↓
15. Mark reset token as used
   ↓
16. Revoke ALL user tokens (access + refresh)
   ↓
17. Return success response
```

### 3.2 Password Validation Rules

| Rule | Requirement | Regex Component |
|------|-------------|-----------------|
| **Minimum Length** | 8 characters | `{8,}` |
| **Uppercase** | At least 1 uppercase letter | `(?=.*[A-Z])` |
| **Lowercase** | At least 1 lowercase letter | `(?=.*[a-z])` |
| **Numbers** | At least 1 digit | `(?=.*\d)` |
| **Special Characters** | At least 1 of: @$!%*?& | `(?=.*[@$!%*?&])` |

**Complete Validation Regex:**
```regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$
```

### 3.3 Token Revocation Logic

After successful password reset:

**Actions Required:**
1. Delete/invalidate all access tokens for user
2. Delete/invalidate all refresh tokens for user
3. Force logout on all devices
4. User must login again with new password

**Purpose:** Prevent unauthorized access if old tokens were compromised.

### 3.4 Security Requirements

| Requirement | Specification |
|-------------|---------------|
| **Token Validation** | Must verify token exists, not expired, not used |
| **Password Hashing** | Must use one-way cryptographically secure hashing |
| **Token Expiration** | 15 minutes from verification |
| **Single Use** | Token invalidated after password reset |
| **Token Revocation** | All user tokens revoked after password reset |
| **Password Strength** | Must enforce all password requirements |

---

## 4. Return

### HTTPstatus: 200 OK

#### Success Response

```json
{
  "success": true,
  "message": "Password reset successfully. You can now sign in with your new password."
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` for successful password reset |
| `message` | string | Success message |

---

### Error Responses

#### 401 - Unauthorized (Invalid or Expired Token)

```json
{
  "success": false,
  "error": "Invalid or expired reset token",
  "error_code": "INVALID_RESET_TOKEN"
}
```

**Causes:**
- Reset token not found
- Reset token expired (15 minutes passed)
- Reset token already used

#### 422 - Validation Error (Password Requirements)

```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "password": [
      "The password must be at least 8 characters.",
      "The password must contain at least one uppercase letter.",
      "The password must contain at least one lowercase letter.",
      "The password must contain at least one number.",
      "The password must contain at least one special character (@$!%*?&)."
    ]
  }
}
```

#### 422 - Validation Error (Password Mismatch)

```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "password": [
      "The password confirmation does not match."
    ]
  }
}
```

#### 422 - Validation Error (Missing Fields)

```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "token": [
      "The token field is required."
    ],
    "password": [
      "The password field is required."
    ],
    "password_confirmation": [
      "The password confirmation field is required."
    ]
  }
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

### 5.1 Token Lookup and Validation

System must find temporary token and validate:

**Token Checks:**
- Token exists in database
- Token type is "password_reset"
- Token not expired (created within last 15 minutes)
- Token not already used (used flag is false)

**Requirement**: Single query to retrieve token with all validation fields.

### 5.2 Password Update

System must update user's password:

**Password Storage Requirements:**
- Hash password using cryptographically secure one-way hashing
- Never store plain text password
- Replace old password hash with new hash
- Update `password_updated_at` timestamp

**Requirement**: Password must be hashed before storage, never stored in plain text.

### 5.3 Token Invalidation

After successful password reset:

**Update Token Record:**
- Set `used` flag to `true`
- Set `used_at` timestamp

**Requirement**: Token cannot be reused after password reset.

### 5.4 User Token Revocation

System must revoke all user tokens:

**Revocation Actions:**
- Delete all access tokens for user
- Delete all refresh tokens for user
- Or mark all tokens as revoked (soft delete)

**Requirement**: User cannot use old tokens after password reset, must login again.

---

## 6. Security Considerations

### 6.1 Password Security Requirements

| Requirement | Specification |
|-------------|---------------|
| **Storage** | One-way cryptographically secure hash (never plain text) |
| **Strength** | Enforce all complexity requirements |
| **History** | Optional: Prevent reuse of last N passwords |
| **Validation** | Backend must validate (don't rely on frontend only) |

### 6.2 Token Security Requirements

| Requirement | Specification |
|-------------|---------------|
| **Expiration** | 15 minutes (short window reduces exposure) |
| **Single Use** | Invalidated after password reset |
| **Storage** | Must be hashed before storage |
| **Scope** | Limited to password reset endpoint only |

### 6.3 Token Revocation Requirements

| Security Measure | Implementation |
|------------------|----------------|
| **Complete Revocation** | All access and refresh tokens must be revoked |
| **Immediate Effect** | Tokens become invalid immediately after password reset |
| **All Devices** | User logged out on all devices |
| **Re-authentication** | User must login again with new password |

**Purpose:** If password was reset due to security breach, old tokens are no longer trustworthy.

### 6.4 Password Hashing Requirements

System must use industry-standard password hashing:

**Requirements:**
- One-way hashing (cannot be reversed)
- Adaptive hash function (e.g., bcrypt, Argon2)
- Automatic salt generation
- Configurable work factor
- Resistant to timing attacks

**Examples of Acceptable Algorithms:**
- bcrypt (cost factor: 10-12)
- Argon2id (memory: 64MB+, iterations: 3+)
- PBKDF2-SHA256 (iterations: 100,000+)

---

## 7. Error Codes

| Error Code | HTTP Status | Meaning | User Action |
|------------|-------------|---------|-------------|
| `INVALID_RESET_TOKEN` | 401 | Token not found, expired, or already used | Request new password reset |
| `VALIDATION_ERROR` | 422 | Password doesn't meet requirements or passwords don't match | Check password requirements |

---

## 8. Test Scenarios

**Key test scenarios to validate API behavior:**

| Category | Scenario | Expected Result |
|----------|----------|-----------------|
| **Valid Reset** | POST /reset-password with valid token + strong password | 200 OK, password updated |
| **Invalid Token** | POST /reset-password with non-existent token | 401 INVALID_RESET_TOKEN |
| **Expired Token** | POST /reset-password with token older than 15 minutes | 401 INVALID_RESET_TOKEN |
| **Used Token** | POST /reset-password with already-used token | 401 INVALID_RESET_TOKEN |
| **Weak Password** | POST /reset-password with password not meeting requirements | 422 VALIDATION_ERROR |
| **Password Mismatch** | POST /reset-password with different password & confirmation | 422 VALIDATION_ERROR |
| **Validation** | POST /reset-password without required fields | 422 VALIDATION_ERROR |
| **Password Hashing** | Verify password is hashed before storage | Password not stored in plain text |
| **Token Revocation** | Verify all user tokens revoked after reset | Old tokens no longer valid |
| **Single Use** | Try to reuse token after successful reset | 401 INVALID_RESET_TOKEN |

**Password Strength Test Cases:**

| Test Case | Password | Expected |
|-----------|----------|----------|
| Too short | `Pass1!` | 422 (< 8 chars) |
| No uppercase | `password1!` | 422 (no uppercase) |
| No lowercase | `PASSWORD1!` | 422 (no lowercase) |
| No number | `Password!` | 422 (no number) |
| No special char | `Password1` | 422 (no special) |
| Valid password | `Pass123!word` | 200 OK |

**Note:** Detailed test cases and test data are maintained separately in the test plan documentation.

---

## 9. Related APIs

| API | Endpoint | Description |
|-----|----------|-------------|
| **Forgot Password** | `POST /api/v1/auth/forgot-password` | Request OTP code via email |
| **Verify Code** | `POST /api/v1/auth/verify-code` | Verify OTP code and get temporary token |
| **Sign In** | `POST /api/v1/auth/login` | **Sign in with new password after reset** |
| Change Password | `POST /api/v1/auth/change-password` | Change password (authenticated users) |

---

## 10. Changelog

| Date | Changes |
|------|---------|
| 2026-01-12 | Initial API specification for Reset Password |
