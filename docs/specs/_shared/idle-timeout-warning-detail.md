# Idle Timeout Warning - Detail Specification

> **Module**: Shared (All modules)
> **Feature**: Session Management - Idle Timeout Warning
> **Last Updated**: 2026-01-11

---

## 1. Overview

### 1.1 Feature Information

| Attribute | Value |
|-----------|-------|
| **Feature Name** | Idle Timeout Warning |
| **Purpose** | Warn users before auto-logout due to inactivity |
| **Target Users** | All authenticated users |
| **Priority** | High |

### 1.2 Business Requirements

| Requirement | Description |
|-------------|-------------|
| **Session Lifetime** | 120 minutes (2 hours) of inactivity |
| **Warning Time** | 5 minutes before auto-logout (at 115 minutes) |
| **User Activities** | Mouse move, click, keypress, scroll, touch events |
| **Multi-tab Sync** | All tabs should show warning simultaneously |

---

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | User | Be warned before auto-logout | I don't lose my work unexpectedly |
| US-02 | User | Extend my session easily | I don't have to re-login while working |
| US-03 | User | See how much time I have left | I can decide whether to continue or logout |
| US-04 | User | Be logged out automatically if inactive | My account stays secure |

---

## 3. UI/UX Design

### 3.1 Warning Modal Layout

```
┌─────────────────────────────────────────────────────┐
│                    ⚠️ Session Warning                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Your session is about to expire due to inactivity  │
│                                                     │
│  You will be automatically logged out in:           │
│                                                     │
│                   ⏱️  4:53                           │
│                                                     │
│  ┌──────────────────────┐  ┌──────────────────────┐ │
│  │   Stay Logged In     │  │      Log Out         │ │
│  └──────────────────────┘  └──────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3.2 Modal Specifications

| Element | Specification |
|---------|---------------|
| **Modal backdrop** | Semi-transparent black `rgba(0, 0, 0, 0.6)` |
| **Modal container** | Max-width: 400px, centered, white background |
| **Border radius** | 12px |
| **Padding** | 32px |
| **Shadow** | Large shadow for prominence |
| **Z-index** | 9999 (highest priority) |

### 3.3 Content Elements

| Element | Specification |
|---------|---------------|
| **Warning icon** | ⚠️ emoji or SVG icon, size: 48px, color: orange (#F59E0B) |
| **Title** | "Session Warning", font-size: 24px, font-weight: 700 |
| **Description** | Font-size: 16px, color: gray-700, line-height: 1.5 |
| **Timer display** | Font-size: 48px, font-weight: 700, monospace font |
| **Timer color** | Dynamic based on time remaining |

### 3.4 Timer Color Logic

| Time Remaining | Color | Class |
|----------------|-------|-------|
| > 3 minutes (180s) | Green | `text-green-500` (#22C55E) |
| 1-3 minutes (60-180s) | Yellow/Orange | `text-yellow-500` (#F59E0B) |
| < 1 minute (0-60s) | Red | `text-red-500` (#EF4444) |

### 3.5 Button Specifications

| Button | Type | Style | Behavior |
|--------|------|-------|----------|
| **Stay Logged In** | Primary | Blue background (#1E3A5F), white text, hover darken | Extend session, close modal, reset timer |
| **Log Out** | Secondary | Gray border, gray text, hover gray background | Logout immediately, redirect to Sign In |

### 3.6 Animation

| Animation | Specification |
|-----------|---------------|
| **Modal entrance** | Fade in (0.3s ease-out) + gentle shake (0.5s) |
| **Timer update** | Smooth number transition (no jump) |
| **Modal exit** | Fade out (0.2s ease-in) |
| **Shake effect** | Subtle horizontal shake (-5px to +5px) |

---

## 4. Activity Tracking

### 4.1 Tracked Events

| Event | Description | Use Case |
|-------|-------------|----------|
| `mousemove` | Mouse cursor movement | Desktop users navigating |
| `click` | Mouse click | Any interaction |
| `keydown` | Keyboard key press | Typing, shortcuts |
| `scroll` | Page scrolling | Reading content |
| `touchstart` | Touch screen tap | Mobile users |
| `touchmove` | Touch screen swipe | Mobile scrolling |

### 4.2 Throttling Logic

| Setting | Value | Reason |
|---------|-------|--------|
| **Throttle interval** | 1000ms (1 second) | Avoid excessive callback calls |
| **Implementation** | Debounce or throttle | Optimize performance |
| **Storage** | localStorage: `last_activity_time` | Persist across page reloads |

### 4.3 Edge Cases

| Case | Behavior |
|------|----------|
| **Multiple tabs open** | Activity in any tab resets all tabs' timers (use localStorage + storage event) |
| **Background tab** | Timer continues, warning still shows when time comes |
| **Page reload** | Restore last activity time from localStorage |
| **Browser sleep/hibernate** | On resume, check elapsed time and show warning if needed |

---

## 5. State Machine

### 5.1 States

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ACTIVE (0-115 min idle)                            │
│  - User is working normally                         │
│  - Activity tracker running                         │
│  - Timer counting up                                │
│                                                     │
└──────────────────┬──────────────────────────────────┘
                   │
        (idle 115 minutes)
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│                                                     │
│  WARNING (115-120 min idle)                         │
│  - Modal displayed                                  │
│  - Countdown timer (5 min → 0)                      │
│  - User can extend or logout                        │
│                                                     │
└──────┬──────────────────────────┬───────────────────┘
       │                          │
       │                          │
  (user clicks               (idle 5 more
   "Stay Logged In")          minutes)
       │                          │
       ▼                          ▼
┌─────────────┐          ┌────────────────┐
│   ACTIVE    │          │  LOGGED_OUT    │
│  (reset)    │          │  (redirect to  │
│             │          │   Sign In)     │
└─────────────┘          └────────────────┘
       │                          ▲
       │                          │
       └──────(user clicks────────┘
              "Log Out")
```

### 5.2 State Transitions

| From | To | Trigger | Action |
|------|----|---------|----|
| ACTIVE | WARNING | Idle time >= 115 min | Show modal, start countdown |
| WARNING | ACTIVE | User clicks "Stay Logged In" | Call `/api/v1/auth/refresh`, reset timer, close modal |
| WARNING | ACTIVE | User has activity | Reset timer, close modal |
| WARNING | LOGGED_OUT | Countdown reaches 0 | Call logout API, clear storage, redirect |
| WARNING | LOGGED_OUT | User clicks "Log Out" | Call logout API, clear storage, redirect |

---

## 6. Technical Implementation

### 6.1 Frontend Architecture

```
┌─────────────────────────────────────────────────────┐
│  AuthContext (Existing)                             │
└──────────────────┬──────────────────────────────────┘
                   │
                   ├── Wraps with ──>
                   │
┌─────────────────────────────────────────────────────┐
│  IdleTimerProvider (New)                            │
│  - Manages idle state                               │
│  - Provides: isIdle, showWarning, timeRemaining     │
│  - Uses: ActivityTracker service                    │
└──────────────────┬──────────────────────────────────┘
                   │
                   ├── Renders ──>
                   │
┌─────────────────────────────────────────────────────┐
│  SessionWarningModal (New)                          │
│  - Displays countdown                               │
│  - Handles user actions                             │
└─────────────────────────────────────────────────────┘
```

### 6.2 Service: ActivityTracker

**File**: `frontend/src/services/ActivityTracker.ts`

**Interface**:

```typescript
interface ActivityTrackerConfig {
  events: string[];
  throttleMs: number;
  onActivity: () => void;
}

class ActivityTracker {
  constructor(config: ActivityTrackerConfig);
  start(): void;
  stop(): void;
  getLastActivityTime(): number;
  resetActivityTime(): void;
}
```

**Behavior**:
- Listen to specified DOM events
- Throttle callbacks to max 1 per second
- Store `last_activity_time` in localStorage
- Sync across tabs using `storage` event

### 6.3 Context: IdleTimerProvider

**File**: `frontend/src/contexts/IdleTimerContext.tsx`

**Interface**:

```typescript
interface IdleTimerContextValue {
  isIdle: boolean;
  showWarning: boolean;
  timeRemaining: number;        // seconds
  extendSession: () => void;
  resetTimer: () => void;
}
```

**Configuration**:

```typescript
const SESSION_TIMEOUT = 120 * 60 * 1000;  // 120 minutes
const WARNING_TIME = 5 * 60 * 1000;       // 5 minutes before
const CHECK_INTERVAL = 1000;              // Check every second
```

**Logic Flow**:

1. Initialize ActivityTracker on mount
2. Every 1 second, check: `now - lastActivity`
3. If >= 115 minutes → set `showWarning = true`
4. If >= 120 minutes → auto logout
5. On activity → reset timer, close warning

### 6.4 Component: SessionWarningModal

**File**: `frontend/src/components/SessionWarningModal.tsx`

**Props**:

```typescript
interface SessionWarningModalProps {
  isOpen: boolean;
  timeRemaining: number;        // in seconds
  onStayLoggedIn: () => void;
  onLogOut: () => void;
}
```

**Time Formatting**:

```typescript
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};
```

---

## 7. API Integration

### 7.1 Refresh Session API

```yaml
post:
  tags:
    - Auth
  summary: "Refresh/Extend Session"
  description: |
    # Business Logic
      ## 1. Validate Token
        - Verify token is still valid (not fully expired)

      ## 2. Extend Token Expiration
        - Update expires_at = now + SESSION_TIMEOUT (120 minutes)
        - Update personal_access_tokens.last_used_at

      ## 3. Response
        - Return new expires_at timestamp

  operationId: refreshSession
  security:
    - bearerAuth: []

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            success: true
            message: "Session extended successfully"
            expires_at: "2026-01-11T15:30:00Z"

    401:
      description: Token expired or invalid
      content:
        application/json:
          example:
            success: false
            error: "TOKEN_EXPIRED"
            message: "Your session has expired. Please sign in again."
```

### 7.2 Backend Implementation

**File**: `backend/laravel/app/Http/Controllers/Api/V1/AuthController.php`

```php
public function refresh(Request $request)
{
    $user = $request->user();
    $token = $user->currentAccessToken();

    // Check if token is still valid
    if ($token->expires_at && $token->expires_at->isPast()) {
        return response()->json([
            'success' => false,
            'error' => 'TOKEN_EXPIRED',
            'message' => 'Your session has expired.',
        ], 401);
    }

    // Extend expiration
    $expirationMinutes = config('sanctum.expiration', 120);
    $token->expires_at = now()->addMinutes($expirationMinutes);
    $token->last_used_at = now();
    $token->save();

    return response()->json([
        'success' => true,
        'message' => 'Session extended successfully',
        'expires_at' => $token->expires_at->toISOString(),
    ]);
}
```

**Route**: `routes/api.php`

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
});
```

---

## 8. Configuration

### 8.1 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_SESSION_TIMEOUT` | 7200000 | Session timeout in ms (120 min) |
| `NEXT_PUBLIC_WARNING_TIME` | 300000 | Warning time in ms (5 min) |
| `NEXT_PUBLIC_CHECK_INTERVAL` | 1000 | Timer check interval in ms |

### 8.2 Config File

**File**: `frontend/src/config/session.ts`

```typescript
export const SESSION_CONFIG = {
  SESSION_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || '7200000'),
  WARNING_TIME: parseInt(process.env.NEXT_PUBLIC_WARNING_TIME || '300000'),
  CHECK_INTERVAL: parseInt(process.env.NEXT_PUBLIC_CHECK_INTERVAL || '1000'),
  ACTIVITY_THROTTLE: 1000,
  TRACKED_EVENTS: ['mousemove', 'click', 'keydown', 'scroll', 'touchstart', 'touchmove'],
};
```

---

## 9. Testing Scenarios

### 9.1 Functional Testing

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| TC-01 | Warning appears after 115 min idle | 1. Login<br>2. Wait 115 min (or mock time)<br>3. Observe | Modal appears with 5:00 countdown |
| TC-02 | Stay Logged In works | 1. Trigger warning<br>2. Click "Stay Logged In" | Modal closes, session extended, timer reset |
| TC-03 | Log Out works | 1. Trigger warning<br>2. Click "Log Out" | Logout, redirect to Sign In |
| TC-04 | Auto-logout after countdown | 1. Trigger warning<br>2. Wait 5 min | Auto-logout, redirect to Sign In |
| TC-05 | Activity resets timer | 1. Idle 114 min<br>2. Move mouse<br>3. Wait 115 min again | No warning appears (timer reset) |
| TC-06 | Activity during warning | 1. Trigger warning<br>2. Move mouse | Modal closes, timer reset |

### 9.2 Multi-tab Testing

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| TC-07 | Activity in Tab A affects Tab B | 1. Open 2 tabs<br>2. Idle 114 min<br>3. Activity in Tab A<br>4. Check Tab B | Both tabs reset timer |
| TC-08 | Warning syncs across tabs | 1. Open 2 tabs<br>2. Idle 115 min | Both tabs show warning simultaneously |
| TC-09 | Stay Logged In in one tab | 1. Warning in both tabs<br>2. Click "Stay" in Tab A | Both tabs close modal |

### 9.3 Edge Cases

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| TC-10 | Page reload during warning | 1. Trigger warning<br>2. Reload page | Warning still appears with correct countdown |
| TC-11 | Browser sleep/wake | 1. Idle 100 min<br>2. Sleep computer 30 min<br>3. Wake | Auto-logout (total 130 min > 120 min) |
| TC-12 | Network error on refresh | 1. Trigger warning<br>2. Disconnect network<br>3. Click "Stay Logged In" | Show error message, keep modal open |

### 9.4 Performance Testing

| Test ID | Scenario | Metric | Expected |
|---------|----------|--------|----------|
| TC-13 | CPU usage | Monitor during normal use | < 1% CPU |
| TC-14 | Memory usage | Monitor ActivityTracker | No memory leak |
| TC-15 | Event throttling | Generate 100 events/sec | Max 1 callback/sec |

---

## 10. Security Considerations

### 10.1 Token Security

| Measure | Implementation |
|---------|----------------|
| **Token validation** | Backend validates token before extending |
| **Expiration check** | Cannot extend already-expired token |
| **Rate limiting** | Max 1 refresh request per minute |

### 10.2 Client-side Security

| Measure | Implementation |
|---------|----------------|
| **localStorage encryption** | Consider encrypting `last_activity_time` |
| **XSS protection** | Sanitize all user inputs |
| **CSRF protection** | Use Sanctum CSRF token |

---

## 11. Accessibility (A11y)

### 11.1 Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Keyboard navigation** | Tab to buttons, Enter to activate |
| **Screen reader** | ARIA labels for modal, timer, buttons |
| **Focus trap** | Focus stays within modal when open |
| **Announce timer** | Screen reader announces time updates (every minute) |

### 11.2 ARIA Attributes

```html
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="warning-title"
  aria-describedby="warning-description"
>
  <h2 id="warning-title">Session Warning</h2>
  <p id="warning-description">Your session is about to expire...</p>
  <div aria-live="polite" aria-atomic="true">
    <span role="timer" aria-label="Time remaining">4:53</span>
  </div>
</div>
```

---

## 12. Localization (i18n)

### 12.1 Text Keys

| Key | English | Japanese |
|-----|---------|----------|
| `session.warning.title` | Session Warning | セッション警告 |
| `session.warning.message` | Your session is about to expire due to inactivity | 非アクティブのため、セッションが間もなく期限切れになります |
| `session.warning.countdown` | You will be automatically logged out in: | 自動ログアウトまで: |
| `session.warning.stayBtn` | Stay Logged In | ログイン状態を維持 |
| `session.warning.logoutBtn` | Log Out | ログアウト |

---

## 13. Files Reference

### 13.1 Frontend Files

| File | Description |
|------|-------------|
| `frontend/src/services/ActivityTracker.ts` | Activity tracking service |
| `frontend/src/contexts/IdleTimerContext.tsx` | Idle timer state management |
| `frontend/src/components/SessionWarningModal.tsx` | Warning modal component |
| `frontend/src/config/session.ts` | Session configuration |
| `frontend/src/__tests__/ActivityTracker.test.ts` | Unit tests for ActivityTracker |
| `frontend/src/__tests__/IdleTimer.test.tsx` | Integration tests for IdleTimer |

### 13.2 Backend Files

| File | Description |
|------|-------------|
| `backend/laravel/app/Http/Controllers/Api/V1/AuthController.php` | Auth controller with refresh method |
| `backend/laravel/routes/api.php` | API routes |
| `backend/laravel/config/sanctum.php` | Sanctum configuration |

---

## 14. Changelog

| Date | Change |
|------|--------|
| 2026-01-11 | Initial detail specification created |

---

## 15. Related Documents

| Document | Path |
|----------|------|
| Basic Spec | `docs/specs/_shared/authentication-basic.md` |
| Auth Detail Spec | `docs/specs/_shared/authentication-detail.md` |
