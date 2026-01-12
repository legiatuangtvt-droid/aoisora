# Authentication - Basic Specification

> **Module**: Common (All modules)
> **Screens**: Sign In, Sign Up, Forgot Password, Code Verification, Reset Password
> **Last Updated**: 2026-01-11

---

## 1. Overview

| Field | Value |
|-------|-------|
| **Purpose** | Authenticate users before accessing the system |
| **Target Users** | HQ users (Admin, Manager) and Store users (Staff, Store Manager) |
| **Entry Points** | App launch, Logout, Session expired |
| **Login Methods** | 1. Identifier + Password<br>2. Google OAuth2 |

---

## 2. Screens Summary

| Screen | Route | Purpose |
|--------|-------|---------|
| Sign In | `/auth/signin` | Sign in to the system |
| Sign Up | `/auth/signup` | Register new account |
| Forgot Password | `/auth/forgot-password` | Request password reset |
| Code Verification | `/auth/verify-code` | Verify OTP code |
| Reset Password | `/auth/reset-password` | Set new password |

---

## 3. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | Staff | Sign in with my credentials | I can access the system |
| US-02 | Staff | Reset my password | I can recover my account |
| US-03 | Staff | Remember my login | I don't have to sign in every time |
| US-04 | New User | Sign up for an account | I can use the system |

---

## 4. Screen Components Summary

### 4.1 Sign In Screen

| Component | Description |
|-----------|-------------|
| Header | Logo "AOI SORA", title "Welcome back" |
| Form | Email/Phone input, Password input |
| Options | Remember 30 days checkbox, Forgot password link |
| Actions | Sign in button, Google sign in button |
| Footer | Sign up link |

### 4.2 Sign Up Screen

| Component | Description |
|-----------|-------------|
| Header | Logo, title "Get Started" |
| Form | Full name, Role dropdown, Email/Phone/SAP, Password |
| Password | Strength indicator (Weak/Medium/Strong) |
| Actions | Sign up button, Google sign up button |
| Footer | Sign in link |

### 4.3 Forgot Password Flow

| Step | Screen | Action |
|------|--------|--------|
| 1 | Forgot Password | Enter email → Send OTP |
| 2 | Code Verification | Enter 5-digit OTP |
| 3 | Reset Password | Enter new password + confirm |

---

## 5. Navigation Flow

```
Sign In ─── (Forgot password?) ───> Forgot Password
   │                                      │
   │                               (Submit email)
   │                                      ▼
   │                               Code Verification
   │                                      │
   │                               (Verify code)
   │                                      ▼
   │                               Reset Password
   │                                      │
   │                         (Password reset success)
   │                                      │
   └──────── (Sign in) ◄──────────────────┘
   │
   │ (Don't have account?)
   ▼
Sign Up ─── (Already have account?) ───> Sign In
```

---

## 6. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Sign in with identifier + password (returns Access + Refresh tokens) |
| POST | `/api/v1/auth/login/google` | Sign in with Google OAuth2 (returns Access + Refresh tokens) |
| POST | `/api/v1/auth/logout` | Sign out |
| POST | `/api/v1/auth/refresh` | Refresh access token using refresh token |
| GET | `/api/v1/auth/me` | Get current user information |
| POST | `/api/v1/auth/forgot-password` | Send OTP via email |
| POST | `/api/v1/auth/verify-code` | Verify OTP code |
| POST | `/api/v1/auth/reset-password` | Set new password |
| POST | `/api/v1/auth/resend-code` | Resend OTP code |
| POST | `/api/v1/auth/check-password-strength` | Check password strength |

---

## 7. Session Management

### 7.1 Dual Token System

The system uses **two types of tokens** for enhanced security and user experience:

| Token Type | Lifetime | Storage | Purpose |
|------------|----------|---------|---------|
| **Access Token** | 15 minutes | sessionStorage | Authenticate API calls |
| **Refresh Token** | 30 days (Remember Me) or Until browser closes (No Remember Me) | localStorage (if Remember Me) or sessionStorage | Obtain new access tokens |

**Token Rotation**: Both tokens are rotated (replaced) each time the refresh endpoint is called for maximum security.

**Refresh Token Lifetime Strategy:**
- `remember_me = true`: Refresh token expires after 30 days (stored in database)
- `remember_me = false`: Refresh token has no database expiration, but stored in sessionStorage (deleted when browser closes)

### 7.2 Token Lifecycle

| No | Event | Access Token | Refresh Token | User Experience |
|----|-------|--------------|---------------|-----------------|
| 1 | User login (Remember Me = true) | Created (15 min) | Created (30 days, localStorage) | Login successful |
| 1b | User login (Remember Me = false) | Created (15 min) | Created (no expiration, sessionStorage) | Login successful |
| 2 | API call | Used for authentication | Not used | API request successful |
| 3 | Access token expires (15 min) | Auto-refresh via `/auth/refresh` | Used to get new access token | Seamless, no interruption |
| 4 | Refresh token rotation | New token created | New token created, old revoked | Automatic, transparent to user |
| 5 | User closes browser (Remember Me = false) | Deleted (sessionStorage) | Deleted (sessionStorage) | Must login on next visit |
| 6 | User closes browser (Remember Me = true) | Deleted (sessionStorage) | Kept (localStorage) | Session persists |
| 7 | User reopens browser (Remember Me = true) | Retrieved via refresh token | Used to get new access token | Auto-login (if < 30 days) |
| 8 | Refresh token expires (30 days, Remember Me only) | N/A | Deleted | User must login again |
| 9 | Manual logout | Deleted | Deleted, revoked on server | Redirected to Sign In |

### 7.3 Session Expiration Behavior

| No | Trigger | System Behavior | User Experience |
|----|---------|-----------------|-----------------|
| 1 | 15 minutes (access token) | Frontend auto-refreshes using refresh token | Seamless, user doesn't notice |
| 2 | 30 days (refresh token, Remember Me = true) | Backend rejects refresh request | User must login again |
| 3 | User closes browser (Remember Me = false) | Both tokens deleted from sessionStorage | Must login on next visit |
| 4 | User closes browser (Remember Me = true) | Access token deleted, Refresh token persists in localStorage | Auto-login on next visit (if < 30 days) |
| 5 | Manual logout | Both tokens deleted, refresh token revoked on server | Redirected to Sign In screen |
| 6 | 401 error from API | Frontend attempts auto-refresh, if fails → auto-logout, clear all tokens | Show message: "Session expired. Please sign in again." |

### 7.4 Token Security Features

| Feature | Description | Benefit |
|---------|-------------|---------|
| **Short-lived Access Token** | Expires every 15 minutes | Stolen token only valid for 15 min |
| **Session-based Refresh Token (No Remember Me)** | Stored in sessionStorage, deleted when browser closes | High security: automatic logout on browser close |
| **Long-lived Refresh Token (Remember Me)** | 30 days expiration, stored in localStorage | Convenience: auto-login for 30 days |
| **Refresh Token Rotation** | New tokens issued on each refresh, old tokens revoked | Stolen refresh token only works once |
| **Automatic Token Reuse Detection** | Backend detects if revoked token is reused | Automatic breach detection & response |
| **Token Abilities** | Access token has `api:access`, Refresh token has `api:refresh` | Refresh token cannot call regular APIs |
| **Immediate Revocation** | All tokens revoked on logout or breach detection | Prevents unauthorized access |

### 7.5 Session Validation

| No | Event | Action |
|----|-------|--------|
| 1 | App launch | Check for refresh token in storage |
| 2 | Refresh token found | Call `/api/v1/auth/refresh` to get new access token |
| 3 | Refresh token valid | Load user data, continue to app |
| 4 | Refresh token invalid/expired | Clear storage, redirect to Sign In |
| 5 | API returns 401 | Attempt auto-refresh, if fails → auto-logout |

### 7.6 Idle Timeout Warning

| Feature | Description |
|---------|-------------|
| Idle timeout warning | Show modal 5 minutes before auto-logout |
| "Stay Logged In" button | Manually trigger token refresh without re-entering password |
| Activity tracking | Track mouse/keyboard/touch events to reset idle timer |
| Auto-refresh | Access token automatically refreshes every ~14 minutes during active use |

---

## 8. Error Handling

### 8.1 Error Display Strategy

Frontend must handle API errors gracefully and display user-friendly messages.

### 8.2 Error Codes Reference

See [API Specification: Sign In (Login)](../api/auth/api-auth-login.md#7-error-codes) for complete error codes list.

**Common error codes:**

| Error Code | User Message | UI Behavior |
|------------|-------------|-------------|
| `ACCOUNT_NOT_FOUND` | "Account not found. Please check your credentials." | Show error below form |
| `INCORRECT_PASSWORD` | "Incorrect password. Please try again." | Show error below form, clear password field |
| `ACCOUNT_INACTIVE` | "Your account is not active. Please contact support." | Show error below form |
| `VALIDATION_ERROR` | "Please check required fields." | Highlight invalid fields |
| `RATE_LIMITED` | "Too many attempts. Please wait [retry_after] seconds before retrying." | Disable form, show countdown timer |

### 8.3 Implementation Example

```typescript
// Error handling in Sign In component
if (!result.success) {
  switch (result.error_code) {
    case 'ACCOUNT_NOT_FOUND':
      setError('Account not found. Please check your credentials.');
      break;

    case 'INCORRECT_PASSWORD':
      setError('Incorrect password. Please try again.');
      setPassword(''); // Clear password field
      break;

    case 'ACCOUNT_INACTIVE':
      setError('Your account is not active. Please contact support.');
      break;

    case 'RATE_LIMITED':
      const retryAfter = result.retry_after || 60; // seconds
      setError(`Too many attempts. Please wait ${retryAfter} seconds before retrying.`);
      setIsFormDisabled(true);

      // Optional: Implement countdown timer
      let remaining = retryAfter;
      const interval = setInterval(() => {
        if (remaining <= 0) {
          clearInterval(interval);
          setIsFormDisabled(false);
          setError('');
        } else {
          setError(`Too many attempts. Please wait ${remaining} seconds before retrying.`);
          remaining--;
        }
      }, 1000);
      break;

    case 'VALIDATION_ERROR':
      setError('Please check required fields.');
      break;

    default:
      setError(result.message || 'Sign in failed. Please try again.');
  }
}
```

### 8.4 Error Display UI

| Element | Specification |
|---------|---------------|
| **Position** | Below the Sign In button, above footer links |
| **Color** | Red text (#DC2626 or theme error color) |
| **Icon** | Error icon (⚠️ or ⓧ) |
| **Animation** | Fade in from top, shake on critical errors |
| **Auto-dismiss** | No auto-dismiss (user must fix error) |
| **Clear condition** | Clear on new input or successful submit |

---

## 9. Changelog

| Date | Changes |
|------|---------|
| 2026-01-12 | Updated API spec reference path (api-auth-login.md moved to api/auth/ directory) |
| 2026-01-12 | Added Section 8 (Error Handling) - moved from api-auth-login.md for better separation of concerns |
| 2026-01-12 | Clarified refresh token lifetime strategy: 30 days (Remember Me) vs session-based (No Remember Me) |
| 2026-01-11 | Initial authentication basic spec created |
