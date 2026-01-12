# API Specification: Forgot Password (Request OTP)

> **API Name**: auth_forgot_password_api
> **Method**: POST
> **Endpoint**: `/api/v1/auth/forgot-password`
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

This API initiates the password reset process by sending a one-time password (OTP) code to the user's registered email address.

**OTP Code:**
- **Format**: 5-digit numeric code (e.g., "12345")
- **Validity**: 10 minutes from generation
- **Delivery**: Sent via email to the user's registered email address
- **One-time use**: Code is invalidated after successful verification

**Rate Limiting:**
- Maximum 3 requests per 15 minutes per email address
- Prevents OTP spam and brute force attacks

**Use Cases:**
- User forgot their password
- User wants to reset password for security reasons
- Account recovery process

---

## 3. Business Logic

### 3.1 Forgot Password Flow

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
8. Generate 5-digit OTP code
   ↓
9. Store OTP in database with:
   - User association
   - Expiration timestamp (10 minutes)
   - Creation timestamp
   ↓
10. Send OTP code via email
   ↓
11. Return success response (same for found/not found)
```

### 3.2 OTP Generation Logic

| Attribute | Specification |
|-----------|---------------|
| **Format** | 5-digit numeric string (00000-99999) |
| **Generation** | Random number generation with cryptographically secure method |
| **Uniqueness** | Must be unique per user at any given time |
| **Expiration** | 10 minutes from generation |
| **Storage** | Must be hashed before storage in database |

### 3.3 Email Template Requirements

Email must contain:
- Subject: "Password Reset Request - [App Name]"
- OTP code prominently displayed
- Expiration time (10 minutes)
- Warning: "If you didn't request this, ignore this email"
- Support contact information

**Example Email:**
```
Subject: Password Reset Request - Aura Web

Hi [User Name],

You requested to reset your password. Use the following code to continue:

OTP Code: 12345

This code will expire in 10 minutes.

If you didn't request a password reset, please ignore this email or contact support.

Best regards,
Aura Web Team
```

### 3.4 Security Requirements

| Requirement | Specification |
|-------------|---------------|
| **Rate Limiting** | Maximum 3 requests per 15 minutes per email |
| **OTP Expiration** | 10 minutes from generation |
| **OTP Storage** | Must be hashed before storage |
| **Email Enumeration Prevention** | Always return success, never reveal if email exists |
| **Account Status Privacy** | Don't reveal account status in response |
| **One-Time Use** | OTP invalidated after successful verification |

---

## 4. Return

### HTTPstatus: 200 OK

#### Success Response

```json
{
  "success": true,
  "message": "If your email is registered, you will receive a password reset code shortly.",
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
  "message": "Too many password reset requests. Please try again after 15 minutes.",
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

### 5.2 OTP Storage

System must store OTP code with following properties:

**OTP Record:**
- OTP code (must be hashed before storage)
- User association (link to user account)
- Expiration timestamp (10 minutes from creation)
- Creation timestamp
- Used flag (initially false, set to true after verification)

**Requirement**: Each user can only have one active OTP at a time. New OTP generation must invalidate previous OTP.

### 5.3 Rate Limiting Storage

System must track OTP request attempts:

**Rate Limit Record:**
- Email address
- Request timestamps (last 3 attempts)
- Time window: 15 minutes

**Requirement**: Track attempts per email address, not per IP (prevents circumventing via VPN/proxy).

### 5.4 Email Delivery

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
| `/auth/forgot-password` | 3 attempts | 15 minutes | 15 minutes |

**Behavior:** System must track requests per email address and block further requests when limit is exceeded.

### 6.3 OTP Security Requirements

| Requirement | Specification |
|-------------|---------------|
| **Format** | 5-digit numeric (100,000 possible combinations) |
| **Expiration** | 10 minutes (short window reduces brute force risk) |
| **One-Time Use** | Invalidated after successful verification |
| **Storage** | Must be hashed before storage (prevents database breach exposure) |
| **Generation** | Cryptographically secure random number generator |
| **Uniqueness** | One active OTP per user (new OTP invalidates old) |

---

## 7. Error Codes

| Error Code | HTTP Status | Meaning | User Action |
|------------|-------------|---------|-------------|
| `VALIDATION_ERROR` | 422 | Invalid email format or missing field | Check email format |
| `RATE_LIMITED` | 429 | Too many requests (3 per 15 minutes) | Wait 15 minutes before retrying |

**Note:** No error codes for "email not found" or "account inactive" (security measure).

---

## 8. Test Scenarios

**Key test scenarios to validate API behavior:**

| Category | Scenario | Expected Result |
|----------|----------|-----------------|
| **Valid Request** | POST /forgot-password with registered email | 200 OK, OTP sent to email |
| **Non-Existent Email** | POST /forgot-password with non-existent email | 200 OK (same response), no email sent |
| **Inactive Account** | POST /forgot-password with inactive account email | 200 OK (same response), no email sent |
| **Validation** | POST /forgot-password without email field | 422 VALIDATION_ERROR |
| **Invalid Format** | POST /forgot-password with invalid email format | 422 VALIDATION_ERROR |
| **Rate Limiting** | Multiple requests (>3 per 15 min) | 429 RATE_LIMITED with retry_after |
| **OTP Generation** | Verify OTP is 5-digit numeric | OTP matches format |
| **OTP Expiration** | OTP stored with 10-minute expiration | Expires after 10 minutes |
| **OTP Uniqueness** | Request OTP twice for same email | Second OTP invalidates first |
| **Email Delivery** | Verify email sent to registered address | Email received with OTP |

**Note:** Detailed test cases and test data are maintained separately in the test plan documentation.

---

## 9. Related APIs

| API | Endpoint | Description |
|-----|----------|-------------|
| **Verify Code** | `POST /api/v1/auth/verify-code` | **Verify OTP code and get temporary token** |
| **Resend Code** | `POST /api/v1/auth/resend-code` | **Resend OTP code** |
| **Reset Password** | `POST /api/v1/auth/reset-password` | Reset password with verified token |
| Sign In | `POST /api/v1/auth/login` | Sign in after password reset |

---

## 10. Changelog

| Date | Changes |
|------|---------|
| 2026-01-12 | Initial API specification for Forgot Password |
