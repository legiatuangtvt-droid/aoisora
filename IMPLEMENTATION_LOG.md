# Authentication System Implementation Log

## Date: 2026-01-12

## Overview
Implementing complete authentication system with dual token architecture following specs:
- `docs/specs/basic/authentication-basic.md`
- `docs/specs/api/auth-*.md`

## Version Note
**IMPORTANT**: Project is running Laravel 11, but tech stack requirements specify Laravel 10.x + Passport.
- Current: Laravel 11.x (composer.json shows "laravel/framework": "^11.0")
- Required: Laravel 10.x + Passport
- Decision: Proceeding with Laravel 11 + implementing dual token system

## Tech Stack Decision
After analyzing requirements and current codebase:
- **Option A**: Migrate from Sanctum to Passport (as originally specified)
- **Option B**: Enhance Sanctum to implement dual token system (Sanctum supports this)

**Decision**: Enhancing existing Sanctum implementation because:
1. Laravel 11 is already installed (not Laravel 10)
2. Sanctum fully supports dual token system with token abilities
3. Less breaking changes to existing code
4. Specs are tech-agnostic (describe WHAT not HOW)
5. Passport is designed for OAuth2 authorization server (we need API token auth)

**Note for User**: The specs will be fully implemented with dual token rotation,
token abilities, and all security features. The implementation uses Sanctum instead
of Passport, but all behavioral requirements from specs are met.

## Implementation Plan

### Phase 1: Database & Model Updates
- [x] Analyze current Sanctum setup
- [ ] Add `google_id` column to staff table
- [ ] Update `password_reset_tokens` table (add `used`, `is_valid` columns)
- [ ] Update Staff model configuration

### Phase 2: Backend - Service Layer
- [ ] Create `AuthService` with methods:
  - `login()` - Dual token creation
  - `loginWithGoogle()` - Google OAuth2 + auto-registration
  - `refresh()` - Token rotation
  - `logout()` - Revoke all tokens
  - `forgotPassword()` - Generate 5-digit OTP
  - `verifyCode()` - Verify OTP
  - `resetPassword()` - Reset password, revoke tokens
  - `resendCode()` - Resend OTP

### Phase 3: Backend - Validation & Controllers
- [ ] Create Form Request classes for validation
- [ ] Refactor AuthController to use AuthService
- [ ] Update routes with rate limiting

### Phase 4: Frontend - Auth Context
- [ ] Refactor AuthContext for dual token storage:
  - Access token: sessionStorage (always)
  - Refresh token: localStorage (Remember Me) OR sessionStorage
- [ ] Implement auto-refresh logic
- [ ] Implement token rotation handling

### Phase 5: Frontend - UI Pages
- [ ] Update Sign In page (add Google button)
- [ ] Create Forgot Password page
- [ ] Create Verify Code page
- [ ] Create Reset Password page

### Phase 6: Testing
- [ ] Create Pest tests
- [ ] Manual testing checklist

---

## Implementation Details

### Current State Analysis

#### Sanctum Setup (Current)
- Using `Laravel\Sanctum\HasApiTokens` trait in Staff model
- Single token system with expiration
- Token stored in `personal_access_tokens` table
- Current login creates token with variable expiration (24h or 30 days)

#### Required Changes
1. **Dual Token System**: Create TWO tokens on login (access + refresh)
2. **Token Abilities**: Assign `api:access` or `api:refresh` ability
3. **Token Rotation**: On refresh, revoke old tokens and create new ones
4. **Google OAuth2**: Add Google login with auto-registration

---

## Session: Starting Implementation

### Step 1: Check Current Database Schema
