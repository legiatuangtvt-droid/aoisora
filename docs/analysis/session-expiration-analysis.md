# Session Expiration Analysis

**Date**: 2026-01-10
**Purpose**: Analyze current session expiration implementation and determine if this feature is necessary

---

## Current Implementation Status

### Backend Configuration

#### 1. Session Configuration (`backend/laravel/config/session.php`)
- **Session Lifetime**: `120 minutes` (2 hours) - Line 34
- **Expire on Close**: `false` - Line 36
- **Driver**: `file` (configurable via `SESSION_DRIVER` env)
- **Session automatically expires** after 120 minutes of inactivity

#### 2. Sanctum Token Configuration (`backend/laravel/config/sanctum.php`)
- **Token Expiration**: `null` - Line 49
- This means **tokens do NOT expire** automatically
- Only session cookies have expiration, not API tokens

#### 3. Auth Guard Configuration (`backend/laravel/config/auth.php`)
- **Web Guard**: Uses `session` driver
- **API Guard**: Uses `sanctum` driver
- **Password Reset Token**: Expires after 60 minutes

---

### Frontend Implementation

#### 1. AuthContext (`frontend/src/contexts/AuthContext.tsx`)

**Current Behavior:**
- Stores token in `localStorage` (lines 49, 125)
- Token persists indefinitely in browser storage
- No automatic token expiration check
- No automatic logout on session expiration
- **Commented code** (lines 58-62) shows planned token verification with `/auth/me` endpoint

```typescript
// Optionally verify token with backend
// const response = await fetch(`${API_URL}/auth/me`, {
//   headers: { Authorization: `Bearer ${savedToken}` }
// });
// if (!response.ok) throw new Error('Token expired');
```

#### 2. Missing Features

**Not Implemented:**
- ❌ No API response interceptor to catch 401 errors
- ❌ No automatic redirect to login when token expires
- ❌ No periodic token validation
- ❌ No token refresh mechanism
- ❌ No idle timeout detection

---

## Analysis: Is Session Expiration Necessary?

### ✅ YES - This Feature is CRITICAL for Security

#### Reasons:

1. **Security Best Practice**
   - Prevents unauthorized access from stolen/leaked tokens
   - Reduces attack window if device is compromised
   - Required for enterprise applications handling sensitive data

2. **Compliance & Data Protection**
   - Most security standards require session timeout
   - GDPR, SOC 2, ISO 27001 compliance may require this
   - Company HR/payroll data (sensitive information)

3. **User Experience Issues WITHOUT This Feature**
   - Users may get unexpected 401 errors without clear messaging
   - No graceful handling when backend session expires
   - Confusion when token is valid in frontend but invalid in backend

4. **Current System Vulnerability**
   - Backend sessions expire after 120 minutes
   - Frontend tokens stored in localStorage never expire
   - **Mismatch**: Frontend thinks user is authenticated, backend rejects requests
   - This creates a poor UX and security gap

---

## Recommended Implementation

### Phase 1: Backend (Already Working)
- ✅ Session lifetime: 120 minutes (configured)
- ✅ Backend properly invalidates expired sessions
- ✅ `/auth/me` endpoint available for token validation

### Phase 2: Frontend (NEEDS IMPLEMENTATION)

#### 2.1 Add API Response Interceptor
```typescript
// Detect 401 Unauthorized responses
// Automatically logout user
// Redirect to /auth/signin with message
```

#### 2.2 Enable Token Verification on Load
```typescript
// Uncomment lines 58-62 in AuthContext.tsx
// Verify token with /auth/me on app load
// If invalid, clear localStorage and redirect
```

#### 2.3 Add Idle Timeout Detection
```typescript
// Track user activity (mouse, keyboard events)
// Warn user before auto-logout (e.g., 5 min warning)
// Auto-logout after SESSION_LIFETIME minutes of inactivity
```

#### 2.4 Add Session Expiration Warning UI
```typescript
// Show modal: "Your session will expire in 5 minutes"
// Offer "Stay Logged In" button (extends session)
// Auto-logout with clear message if no action
```

---

## Specification Update Recommendation

**Current Entry Point in Spec:**
```
| **Entry Points** | App launch, Logout, Session expired |
```

**This is CORRECT** - Session expiration SHOULD be an entry point to authentication.

**However**, the spec should clarify:
1. Session lifetime: 120 minutes of inactivity
2. User receives warning before auto-logout
3. Automatic redirect to Sign In screen with message
4. "Remember Me" option extends session (currently not implemented)

---

## Priority Assessment

| Feature | Priority | Reason |
|---------|----------|--------|
| **401 Response Handling** | 🔴 HIGH | Prevents user confusion, critical UX issue |
| **Token Verification on Load** | 🔴 HIGH | Security gap - must validate stored tokens |
| **Auto-logout UI Warning** | 🟡 MEDIUM | Nice UX improvement, not critical |
| **Idle Timeout Tracking** | 🟡 MEDIUM | Enhancement for better security |
| **Remember Me (extend session)** | 🟢 LOW | Feature exists in login but not implemented |

---

## Conclusion

**YES, Session Expiration is NECESSARY and already partially implemented.**

### What Exists:
- ✅ Backend: Session expires after 120 minutes
- ✅ Entry point documented in spec

### What's Missing (CRITICAL):
- ❌ Frontend doesn't detect expired sessions
- ❌ No 401 error handling
- ❌ No token validation on app load
- ❌ Poor UX when session expires

### Recommendation:
**Keep "Session expired" as an entry point in the spec**, but add a note that frontend implementation is pending for proper session expiration handling.

---

## Next Steps

1. Update spec to clarify session expiration behavior
2. Implement 401 response interceptor (HIGH priority)
3. Enable token verification on AuthContext load (HIGH priority)
4. Add session warning UI (MEDIUM priority)
5. Consider implementing "Remember Me" to extend session lifetime
