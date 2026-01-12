# API Specification: Resend OTP Code

> **API Name**: auth_resend_code_api
> **Method**: POST
> **Endpoint**: `/api/v1/auth/resend-code`
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

**Example Request:**
```json
{
  "email": "user@example.com"
}
```

---

## 2. Description

This API resends a new OTP code to the user's email address. It is used when:
- User didn't receive the original OTP email
- OTP code expired (10 minutes passed)
- User accidentally deleted the email

**OTP Code:**
- **Format**: 5-digit numeric code (e.g., "12345")
- **Validity**: 10 minutes from generation
- **Delivery**: Sent via email to the user's registered email address
- **Previous OTP**: Old OTP is invalidated when new one is generated

**Rate Limiting:**
- Maximum 3 requests per 15 minutes per email address
- Same rate limit as forgot-password endpoint
- Prevents OTP spam and brute force attacks

---

## 3. Business Logic

### 3.1 Resend Code Flow

```
1. Validate request parameters
   ↓
2. Check rate limiting (3 attempts per 15 minutes)
   ↓
3. If rate limit exceeded → Return 429 "Too many requests"
   ↓
4. Find user by email address
   ↓
5. If user not found → Return success (security: don't reveal account existence)
   ↓
6. Check account status
   ↓
7. If account inactive → Return success (security: don't reveal account status)
   ↓
8. Invalidate previous OTP (if exists)
   ↓
9. Generate new 5-digit OTP code
   ↓
10. Store OTP in database with:
    - User association
    - Expiration timestamp (10 minutes)
    - Creation timestamp
   ↓
11. Send OTP code via email
   ↓
12. Return success response (same for found/not found)
```

### 3.2 OTP Invalidation Logic

Before generating new OTP:

**Actions Required:**
1. Find existing active OTP for user
2. Mark old OTP as invalid/expired
3. Delete or flag old OTP record
4. Generate new OTP

**Purpose:** Each user can only have one active OTP at a time. This prevents confusion about which code to use.

### 3.3 OTP Generation Logic

| Attribute | Specification |
|-----------|---------------|
| **Format** | 5-digit numeric string (00000-99999) |
| **Generation** | Random number generation with cryptographically secure method |
| **Uniqueness** | Must be unique per user at any given time |
| **Expiration** | 10 minutes from generation |
| **Storage** | Must be hashed before storage in database |

### 3.4 Email Template Requirements

Email must contain:
- Subject: "Password Reset Code - [App Name]"
- OTP code prominently displayed
- Expiration time (10 minutes)
- Note: "This is a new code. Previous codes are no longer valid."
- Warning: "If you didn't request this, ignore this email"
- Support contact information

**Example Email:**
```
Subject: Password Reset Code - Aura Web

Hi [User Name],

Here is your new password reset code:

OTP Code: 67890

This code will expire in 10 minutes.

Note: This is a new code. Any previous codes are no longer valid.

If you didn't request a password reset, please ignore this email or contact support.

Best regards,
Aura Web Team
```

### 3.5 Security Requirements

| Requirement | Specification |
|-------------|---------------|
| **Rate Limiting** | Maximum 3 requests per 15 minutes per email |
| **OTP Expiration** | 10 minutes from generation |
| **OTP Storage** | Must be hashed before storage |
| **Email Enumeration Prevention** | Always return success, never reveal if email exists |
| **Account Status Privacy** | Don't reveal account status in response |
| **Previous OTP Invalidation** | Old OTP must be invalidated when new one is generated |

---

## 4. Return

### HTTPstatus: 200 OK

#### Success Response

```json
{
  "success": true,
  "message": "If your email is registered, you will receive a new password reset code shortly.",
  "data": {
    "email": "user@example.com"
  }
}
```

**Note:** Response is the same whether email exists or not (security measure to prevent email enumeration).

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` for valid request |
| `message` | string | Generic success message (doesn't reveal if email exists) |
| `data` | object | Response data container |
| `data.email` | string | Email address submitted (echoed back for confirmation) |

---

### Error Responses

#### 422 - Validation Error

```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "email": [
      "The email field is required."
    ]
  }
}
```

**Common validation errors:**
- `email` field is required
- `email` must be a valid email format

#### 429 - Too Many Requests

```json
{
  "success": false,
  "error_code": "RATE_LIMITED",
  "message": "Too many resend requests. Please try again after 15 minutes.",
  "retry_after": 900
}
```

**Note:** `retry_after` indicates seconds until next request is allowed (900 seconds = 15 minutes).

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

### 5.2 Previous OTP Invalidation

Before generating new OTP, system must invalidate old OTP:

**OTP Invalidation Actions:**
- Find active OTP for user
- Delete OTP record OR
- Mark OTP as invalid (set `is_valid` flag to false)

**Requirement**: Only one active OTP per user at any given time.

### 5.3 New OTP Storage

System must store new OTP code with following properties:

**OTP Record:**
- OTP code (must be hashed before storage)
- User association (link to user account)
- Expiration timestamp (10 minutes from creation)
- Creation timestamp
- Used flag (initially false)
- Valid flag (initially true)

**Requirement**: Each user can only have one active OTP at a time.

### 5.4 Rate Limiting Storage

System must track resend request attempts:

**Rate Limit Record:**
- Email address
- Request timestamps (last 3 attempts)
- Time window: 15 minutes

**Requirement**: Combined rate limit with forgot-password endpoint (total 3 requests per 15 minutes across both endpoints).

### 5.5 Email Delivery

System must queue email for delivery:

**Email Queue Requirements:**
- Reliable email delivery (retry on failure)
- Email template with OTP code
- Delivery confirmation logging
- Bounce handling

---

## 6. Security Considerations

### 6.1 Email Enumeration Prevention

| Security Measure | Implementation |
|------------------|----------------|
| **Generic Response** | Always return success message, never indicate if email exists |
| **Same Response Time** | Process non-existent emails to prevent timing attacks |
| **No Error Details** | Don't reveal account status or email validity in error messages |

### 6.2 Rate Limiting Requirements

| Endpoint | Limit | Window | Block Duration |
|----------|-------|--------|----------------|
| `/auth/resend-code` | 3 attempts | 15 minutes | 15 minutes |
| Combined with `/auth/forgot-password` | 3 attempts total | 15 minutes | 15 minutes |

**Behavior:** System must track requests across BOTH forgot-password and resend-code endpoints. Combined limit prevents abuse.

**Example:**
- User calls /forgot-password: 1 attempt used
- User calls /resend-code: 2 attempts used
- User calls /resend-code again: 3 attempts used
- User calls /forgot-password again: BLOCKED (rate limit exceeded)

### 6.3 OTP Security Requirements

| Requirement | Specification |
|-------------|---------------|
| **Format** | 5-digit numeric (100,000 possible combinations) |
| **Expiration** | 10 minutes (short window reduces brute force risk) |
| **One Active OTP** | New OTP invalidates previous OTP |
| **Storage** | Must be hashed before storage (prevents database breach exposure) |
| **Generation** | Cryptographically secure random number generator |
| **Uniqueness** | One active OTP per user at any time |

### 6.4 OTP Invalidation Requirements

| Security Measure | Implementation |
|------------------|----------------|
| **Automatic Invalidation** | Old OTP invalidated when new OTP generated |
| **Clear Communication** | Email states "previous codes are no longer valid" |
| **Single Active OTP** | Prevents confusion about which code to use |

---

## 7. Error Codes

| Error Code | HTTP Status | Meaning | User Action |
|------------|-------------|---------|-------------|
| `VALIDATION_ERROR` | 422 | Invalid email format or missing field | Check email format |
| `RATE_LIMITED` | 429 | Too many requests (3 per 15 minutes across forgot-password + resend-code) | Wait 15 minutes before retrying |

**Note:** No error codes for "email not found" or "account inactive" (security measure).

---

## 8. Test Scenarios

**Key test scenarios to validate API behavior:**

| Category | Scenario | Expected Result |
|----------|----------|-----------------|
| **Valid Request** | POST /resend-code with registered email | 200 OK, new OTP sent to email |
| **Non-Existent Email** | POST /resend-code with non-existent email | 200 OK (same response), no email sent |
| **Inactive Account** | POST /resend-code with inactive account email | 200 OK (same response), no email sent |
| **Validation** | POST /resend-code without email field | 422 VALIDATION_ERROR |
| **Invalid Format** | POST /resend-code with invalid email format | 422 VALIDATION_ERROR |
| **Rate Limiting** | Multiple requests (>3 per 15 min) | 429 RATE_LIMITED with retry_after |
| **Combined Rate Limit** | 2x forgot-password + 2x resend-code | 4th request blocked (429) |
| **OTP Generation** | Verify new OTP is 5-digit numeric | OTP matches format |
| **OTP Expiration** | New OTP stored with 10-minute expiration | Expires after 10 minutes |
| **Previous OTP** | Verify old OTP invalidated when new generated | Old OTP cannot be used |
| **Email Delivery** | Verify email sent with new OTP | Email received with new code |
| **Email Content** | Verify email states "previous codes invalid" | Clear message in email |

**Note:** Detailed test cases and test data are maintained separately in the test plan documentation.

---

## 9. Related APIs

| API | Endpoint | Description |
|-----|----------|-------------|
| **Forgot Password** | `POST /api/v1/auth/forgot-password` | **Request initial OTP code** |
| **Verify Code** | `POST /api/v1/auth/verify-code` | **Verify OTP code and get temporary token** |
| Reset Password | `POST /api/v1/auth/reset-password` | Reset password with verified token |

---

## 10. Changelog

| Date | Changes |
|------|---------|
| 2026-01-12 | Initial API specification for Resend OTP Code |
