# API Specification: Verify OTP Code

> **API Name**: auth_verify_code_api
> **Method**: POST
> **Endpoint**: `/api/v1/auth/verify-code`
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
| `email` | string | Yes | - | User's email address |
| `code` | string | Yes | - | 5-digit OTP code from email |

**Example Request:**
```json
{
  "email": "user@example.com",
  "code": "12345"
}
```

---

## 2. Description

This API verifies the OTP code sent to the user's email during the forgot password flow. Upon successful verification, it returns a temporary token that can be used to reset the password.

**OTP Verification:**
- **Code Format**: 5-digit numeric string
- **Validity**: Must be used within 10 minutes of generation
- **One-Time Use**: Code is invalidated after successful verification
- **Temporary Token**: Short-lived token (15 minutes) for password reset

**Temporary Token:**
- **Purpose**: Authorize password reset without requiring login
- **Lifetime**: 15 minutes from verification
- **Single Use**: Can only be used once for password reset
- **Scope**: Limited to password reset endpoint only

---

## 3. Business Logic

### 3.1 Verify Code Flow

```
1. Validate request parameters
   ↓
2. Find user by email address
   ↓
3. If user not found → Return 401 "Invalid email or code"
   ↓
4. Find OTP record for user
   ↓
5. If OTP not found → Return 401 "Invalid email or code"
   ↓
6. Check OTP expiration (10 minutes)
   ↓
7. If OTP expired → Return 401 "Code expired"
   ↓
8. Check if OTP already used
   ↓
9. If OTP used → Return 401 "Code already used"
   ↓
10. Verify OTP code (hash comparison)
   ↓
11. If code incorrect → Return 401 "Invalid email or code"
   ↓
12. Mark OTP as used (set used flag to true)
   ↓
13. Generate temporary reset token (15 minutes)
   ↓
14. Store temporary token in database
   ↓
15. Return success response with temporary token
```

### 3.2 Temporary Token Generation

| Attribute | Specification |
|-----------|---------------|
| **Format** | Random alphanumeric string (minimum 60 characters) |
| **Lifetime** | 15 minutes from verification |
| **Purpose** | Authorize password reset without login |
| **Scope** | Can only be used for password reset endpoint |
| **Single Use** | Invalidated after successful password reset |
| **Storage** | Must be hashed before storage in database |

### 3.3 Security Requirements

| Requirement | Specification |
|-------------|---------------|
| **OTP Expiration** | Must verify code within 10 minutes |
| **One-Time Use** | OTP cannot be reused after verification |
| **Code Matching** | Must use hash comparison for OTP verification |
| **Token Expiration** | Temporary token expires after 15 minutes |
| **Error Messages** | Generic error messages to prevent enumeration |
| **Rate Limiting** | Prevent brute force attacks on OTP codes |

---

## 4. Return

### HTTPstatus: 200 OK

#### Success Response

```json
{
  "success": true,
  "message": "Code verified successfully. You can now reset your password.",
  "data": {
    "reset_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2026-01-12T10:15:00.000000Z"
  }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` for successful verification |
| `message` | string | Success message |
| `data` | object | Response data container |
| `data.reset_token` | string | Temporary token for password reset (15 minutes) |
| `data.expires_at` | string (ISO 8601) | Token expiration timestamp |

---

### Error Responses

#### 401 - Unauthorized (Invalid Email or Code)

```json
{
  "success": false,
  "error": "Invalid email or code",
  "error_code": "INVALID_VERIFICATION_CODE"
}
```

**Causes:**
- Email address not found
- OTP code not found
- OTP code incorrect

**Note:** Generic error message to prevent email enumeration.

#### 401 - Unauthorized (Code Expired)

```json
{
  "success": false,
  "error": "Code expired. Please request a new code.",
  "error_code": "CODE_EXPIRED"
}
```

**Cause:** OTP code is older than 10 minutes.

#### 401 - Unauthorized (Code Already Used)

```json
{
  "success": false,
  "error": "Code already used. Please request a new code.",
  "error_code": "CODE_ALREADY_USED"
}
```

**Cause:** OTP code was already successfully verified.

#### 422 - Validation Error

```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "email": [
      "The email field is required."
    ],
    "code": [
      "The code must be 5 digits."
    ]
  }
}
```

**Common validation errors:**
- `email` field is required
- `email` must be a valid email format
- `code` field is required
- `code` must be exactly 5 digits

#### 429 - Too Many Requests

```json
{
  "success": false,
  "error_code": "RATE_LIMITED",
  "message": "Too many verification attempts. Please try again after 5 minutes.",
  "retry_after": 300
}
```

**Note:** Rate limit: 5 attempts per 5 minutes per email address.

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

System must be able to find user by email address.

**Requirement**: Query user records where email matches (case-insensitive).

### 5.2 OTP Lookup and Validation

System must find OTP record for user and validate:

**OTP Checks:**
- OTP exists for user
- OTP not expired (created within last 10 minutes)
- OTP not already used (used flag is false)
- OTP code matches (hash comparison)

**Requirement**: Single query to retrieve OTP with all validation fields.

### 5.3 OTP Invalidation

After successful verification, system must:

**Update OTP Record:**
- Set `used` flag to `true`
- Set `verified_at` timestamp

**Requirement**: OTP cannot be reused after verification.

### 5.4 Temporary Token Storage

System must store temporary token with following properties:

**Token Record:**
- Token string (must be hashed before storage)
- User association (link to user account)
- Token type: "password_reset"
- Expiration timestamp (15 minutes from creation)
- Creation timestamp
- Used flag (initially false)

**Requirement**: Each user can only have one active password reset token at a time.

### 5.5 Rate Limiting Storage

System must track verification attempts:

**Rate Limit Record:**
- Email address
- Attempt timestamps (last 5 attempts)
- Time window: 5 minutes

**Requirement**: Track attempts per email address to prevent brute force attacks.

---

## 6. Security Considerations

### 6.1 Brute Force Prevention

| Security Measure | Implementation |
|------------------|----------------|
| **Rate Limiting** | Maximum 5 attempts per 5 minutes per email |
| **Generic Errors** | Don't reveal if email exists or which part is wrong |
| **OTP Expiration** | 10 minutes (limits brute force window) |
| **One-Time Use** | OTP invalidated after successful verification |

**Brute Force Math:**
- 100,000 possible 5-digit codes
- 5 attempts per 5 minutes = 1 attempt per minute
- Would take ~69 days to try all codes (infeasible)

### 6.2 Token Security Requirements

| Requirement | Specification |
|-------------|---------------|
| **Token Length** | Minimum 60 characters (high entropy) |
| **Token Lifetime** | 15 minutes (short window reduces exposure) |
| **Single Use** | Invalidated after password reset |
| **Storage** | Must be hashed before storage |
| **Scope** | Limited to password reset endpoint only |
| **Generation** | Cryptographically secure random generation |

### 6.3 Error Message Security

| Scenario | Error Message | Purpose |
|----------|---------------|---------|
| Email not found | "Invalid email or code" | Prevent email enumeration |
| OTP not found | "Invalid email or code" | Prevent email enumeration |
| OTP incorrect | "Invalid email or code" | Prevent guessing feedback |
| OTP expired | "Code expired" | Allow user to request new code |
| OTP used | "Code already used" | Prevent replay attacks |

---

## 7. Error Codes

| Error Code | HTTP Status | Meaning | User Action |
|------------|-------------|---------|-------------|
| `INVALID_VERIFICATION_CODE` | 401 | Email or OTP code incorrect | Check email and code, or request new code |
| `CODE_EXPIRED` | 401 | OTP expired (10 minutes passed) | Request new code via /forgot-password or /resend-code |
| `CODE_ALREADY_USED` | 401 | OTP already verified | Request new code if still need to reset password |
| `VALIDATION_ERROR` | 422 | Invalid input format | Check email format and code length (5 digits) |
| `RATE_LIMITED` | 429 | Too many attempts (5 per 5 minutes) | Wait 5 minutes before retrying |

---

## 8. Test Scenarios

**Key test scenarios to validate API behavior:**

| Category | Scenario | Expected Result |
|----------|----------|-----------------|
| **Valid Verification** | POST /verify-code with correct email + code | 200 OK, return reset token |
| **Invalid Email** | POST /verify-code with non-existent email | 401 INVALID_VERIFICATION_CODE |
| **Invalid Code** | POST /verify-code with incorrect code | 401 INVALID_VERIFICATION_CODE |
| **Expired Code** | POST /verify-code with code older than 10 minutes | 401 CODE_EXPIRED |
| **Used Code** | POST /verify-code with already-used code | 401 CODE_ALREADY_USED |
| **Validation** | POST /verify-code without required fields | 422 VALIDATION_ERROR |
| **Invalid Format** | POST /verify-code with non-numeric code | 422 VALIDATION_ERROR |
| **Rate Limiting** | Multiple attempts (>5 per 5 min) | 429 RATE_LIMITED with retry_after |
| **Token Generation** | Verify reset token is generated | Token is 60+ characters |
| **Token Expiration** | Verify token expires in 15 minutes | Correct expiration timestamp |
| **OTP Invalidation** | Verify OTP marked as used after success | Cannot reuse same OTP |

**Note:** Detailed test cases and test data are maintained separately in the test plan documentation.

---

## 9. Related APIs

| API | Endpoint | Description |
|-----|----------|-------------|
| **Forgot Password** | `POST /api/v1/auth/forgot-password` | Request OTP code via email |
| **Resend Code** | `POST /api/v1/auth/resend-code` | Resend OTP code |
| **Reset Password** | `POST /api/v1/auth/reset-password` | **Reset password using temporary token** |

---

## 10. Changelog

| Date | Changes |
|------|---------|
| 2026-01-12 | Initial API specification for Verify OTP Code |
