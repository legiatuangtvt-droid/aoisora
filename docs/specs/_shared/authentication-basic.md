# Authentication - Basic Specification

> **Module**: Common (All modules)
> **Screens**: Sign In, Sign Up, Forgot Password, Code Verification, Reset Password
> **Last Updated**: 2026-01-08

---

## 1. Overview

| Field | Value |
|-------|-------|
| **Purpose** | Authenticate users before accessing the system |
| **Target Users** | HQ users (Admin, Manager) and Store users (Staff, Store Manager) |
| **Entry Points** | App launch, Logout, Session expired |

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
| POST | `/api/v1/auth/login` | Sign in |
| POST | `/api/v1/auth/logout` | Sign out |
| GET | `/api/v1/auth/me` | Get current user information |
| POST | `/api/v1/auth/forgot-password` | Send OTP via email |
| POST | `/api/v1/auth/verify-code` | Verify OTP code |
| POST | `/api/v1/auth/reset-password` | Set new password |
| POST | `/api/v1/auth/resend-code` | Resend OTP code |
| POST | `/api/v1/auth/check-password-strength` | Check password strength |

---

## 7. Session Management

### 7.1 Session Lifetime

| Attribute | Value |
|-----------|-------|
| **Session Duration** | 120 minutes (2 hours) of inactivity |
| **Token Storage** | Browser localStorage |
| **Token Type** | Laravel Sanctum Bearer Token |
| **Auto-logout** | Yes, when session expires |

### 7.2 Session Expiration Behavior

| No | Trigger | System Behavior | User Experience |
|----|---------|-----------------|-----------------|
| 1 | 120 minutes of inactivity | Backend invalidates session | User receives 401 Unauthorized on next API call |
| 2 | User closes browser | Token remains in localStorage | User stays logged in on next visit |
| 3 | Manual logout | Token deleted, backend session destroyed | Redirected to Sign In screen |
| 4 | 401 error from API | Frontend auto-logout, clear storage | Show message: "Session expired. Please sign in again." |

### 7.3 Session Validation

| No | Event | Action |
|----|-------|--------|
| 1 | App launch | Verify stored token with `/api/v1/auth/me` endpoint |
| 2 | Token invalid | Clear localStorage, redirect to Sign In |
| 3 | Token valid | Load user data, continue to app |
| 4 | API returns 401 | Auto-logout and show expiration message |

### 7.4 Session Warning (Future Enhancement)

| Feature | Status | Description |
|---------|--------|-------------|
| Idle timeout warning | ⏳ Pending | Show modal 5 minutes before auto-logout |
| "Stay Logged In" button | ⏳ Pending | Extend session without re-entering password |
| Activity tracking | ⏳ Pending | Track mouse/keyboard events to reset idle timer |

---

## 8. Implementation Status

| Feature | Backend | Frontend | Deploy | Notes |
|---------|---------|----------|--------|-------|
| Sign In | ✅ Done | ✅ Done | [DEMO] | Full flow |
| Sign Up | ⏳ Pending | ⏳ Pending | [DEMO] | - |
| Forgot Password | ✅ Done | ⏳ Pending | [PROD-ONLY] | Requires SMTP server |
| Code Verification | ✅ Done | ⏳ Pending | [PROD-ONLY] | Requires SMTP server |
| Reset Password | ✅ Done | ⏳ Pending | [PROD-ONLY] | Requires SMTP server |
| Google OAuth | ⏳ Pending | ⏳ Pending | [PROD-ONLY] | Requires Google API setup |
| Session Expiration Handling | ✅ Done | ✅ Done | [DEMO] | Token verification, 401 auto-logout, warning UI |

---

## 9. Related Documents

| Document | Path |
|----------|------|
| Detail Spec | `docs/specs/_shared/authentication-detail.md` |
| App General Basic | `docs/specs/_shared/app-general-basic.md` |

