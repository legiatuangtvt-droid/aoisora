# API Utilities - Session Expiration Handling

## Overview

This directory contains utilities for making authenticated API requests with automatic session expiration handling.

## Files

### `fetchWithAuth.ts`

A fetch wrapper that automatically handles:
- 401 Unauthorized responses (session expired)
- Authorization header injection
- Auto-logout and redirect on session expiration

## Usage

### Basic Usage

```typescript
import { fetchWithAuth, get, post, put, del } from '@/lib/api/fetchWithAuth';

// GET request
const response = await get('/tasks');
const data = await response.json();

// POST request
const response = await post('/tasks', {
  title: 'New Task',
  description: 'Task description'
});

// PUT request
const response = await put('/tasks/123', {
  title: 'Updated Task'
});

// DELETE request
const response = await del('/tasks/123');
```

### Advanced Usage

```typescript
// Custom fetch options
const response = await fetchWithAuth('/tasks', {
  method: 'POST',
  body: JSON.stringify({ title: 'New Task' }),
  headers: {
    'Custom-Header': 'value'
  }
});

// Skip auth check (for public endpoints)
const response = await fetchWithAuth('/public/data', {
  skipAuthCheck: true
});
```

## How It Works

### 1. Automatic Token Injection

The wrapper automatically:
- Reads token from `localStorage.getItem('optichain_token')`
- Adds `Authorization: Bearer {token}` header to all requests

### 2. 401 Error Handling

When API returns 401 Unauthorized:
1. Clears `optichain_auth` and `optichain_token` from localStorage
2. Calls registered logout callback (updates AuthContext state)
3. Redirects to `/auth/signin?expired=true&message=...`

### 3. Session Expiration Flow

```
User makes API request
    ↓
fetchWithAuth sends request with token
    ↓
Backend validates token
    ↓
Token expired? → Backend returns 401
    ↓
fetchWithAuth detects 401
    ↓
Clear localStorage
    ↓
Call logout callback (reset AuthContext)
    ↓
Redirect to Sign In with message
    ↓
User sees "Session expired" warning
```

## Integration with AuthContext

The `AuthContext` registers a logout callback:

```typescript
useEffect(() => {
  registerLogoutCallback(() => {
    setUser(null);
    setToken(null);
  });
}, []);
```

This ensures the app state is properly reset when session expires.

## Token Verification on App Load

`AuthContext` verifies stored tokens on app launch:

```typescript
// Verify token with backend
const response = await fetch(`${API_URL}/auth/me`, {
  headers: { Authorization: `Bearer ${savedToken}` }
});

if (!response.ok) {
  // Token invalid - clear storage
  localStorage.removeItem('optichain_auth');
  localStorage.removeItem('optichain_token');
}
```

## Session Configuration

| Setting | Value | Location |
|---------|-------|----------|
| Session Lifetime | 120 minutes | `backend/laravel/config/session.php` |
| Token Storage | localStorage | Frontend |
| Token Type | Sanctum Bearer Token | Backend |
| Auto-logout | Yes | fetchWithAuth.ts |

## Testing Session Expiration

### Manual Testing

1. Sign in to the app
2. Wait 120 minutes (or manually invalidate token in backend)
3. Try to access any protected page
4. System should:
   - Detect 401 error
   - Clear localStorage
   - Redirect to Sign In
   - Show "Session expired" message

### Testing with Backend

Manually delete session in backend:
```bash
# Laravel Tinker
php artisan tinker
DB::table('sessions')->truncate();
```

Then try to access any page - should trigger auto-logout.

## Future Enhancements

- [ ] Idle timeout warning (5 min before expiration)
- [ ] "Stay Logged In" button to extend session
- [ ] Activity tracking (mouse/keyboard events)
- [ ] Token refresh mechanism
- [ ] Session expiration countdown timer

## Related Files

- `frontend/src/contexts/AuthContext.tsx` - Authentication context
- `frontend/src/app/auth/signin/page.tsx` - Sign in page with session expired message
- `docs/specs/_shared/authentication-basic.md` - Authentication specification
- `docs/analysis/session-expiration-analysis.md` - Session expiration analysis
