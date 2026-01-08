# Authentication - Basic Specification

> **Module**: Shared (All modules)
> **Screens**: Sign In, Sign Up, Forgot Password, Code Verification, Reset Password
> **Last Updated**: 2026-01-08

---

## 1. Overview

| Field | Value |
|-------|-------|
| **Purpose** | Xác thực người dùng trước khi truy cập hệ thống |
| **Target Users** | Tất cả nhân viên (Staff, Manager, Admin) |
| **Entry Points** | App launch, Logout, Session expired |

---

## 2. Screens Summary

| Screen | Route | Purpose |
|--------|-------|---------|
| Sign In | `/auth/signin` | Đăng nhập vào hệ thống |
| Sign Up | `/auth/signup` | Đăng ký tài khoản mới |
| Forgot Password | `/auth/forgot-password` | Yêu cầu reset mật khẩu |
| Code Verification | `/auth/verify-code` | Xác thực OTP |
| Reset Password | `/auth/reset-password` | Đặt mật khẩu mới |

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
| POST | `/api/v1/auth/login` | Đăng nhập |
| POST | `/api/v1/auth/logout` | Đăng xuất |
| GET | `/api/v1/auth/me` | Lấy thông tin user hiện tại |
| POST | `/api/v1/auth/forgot-password` | Gửi OTP qua email |
| POST | `/api/v1/auth/verify-code` | Xác thực OTP |
| POST | `/api/v1/auth/reset-password` | Đặt mật khẩu mới |
| POST | `/api/v1/auth/resend-code` | Gửi lại OTP |
| POST | `/api/v1/auth/check-password-strength` | Kiểm tra độ mạnh password |

---

## 7. Implementation Status

| Feature | Backend | Frontend | Deploy | Notes |
|---------|---------|----------|--------|-------|
| Sign In | ✅ Done | ✅ Done | [DEMO] | Full flow |
| Sign Up | ⏳ Pending | ⏳ Pending | [DEMO] | - |
| Forgot Password | ✅ Done | ⏳ Pending | [PROD-ONLY] | Cần SMTP server |
| Code Verification | ✅ Done | ⏳ Pending | [PROD-ONLY] | Cần SMTP server |
| Reset Password | ✅ Done | ⏳ Pending | [PROD-ONLY] | Cần SMTP server |
| Google OAuth | ⏳ Pending | ⏳ Pending | [PROD-ONLY] | Cần Google API setup |

---

## 8. Related Documents

| Document | Path |
|----------|------|
| Detail Spec | `docs/specs/_shared/authentication-detail.md` |
| App General Basic | `docs/specs/_shared/app-general-basic.md` |

