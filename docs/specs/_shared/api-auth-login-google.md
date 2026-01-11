# API Specification: Sign In with Google

> **API Name**: auth_login_google_api
> **Method**: POST
> **Endpoint**: `/api/v1/auth/login/google`
> **Module**: Common (All modules)
> **Last Updated**: 2026-01-11

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
| `google_token` | string | Yes | - | ID token from Google OAuth2 authentication |
| `remember_me` | boolean | No | false | Whether to extend refresh token lifetime to 30 days |

**Example Request:**
```json
{
  "google_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY4YTk4...",
  "remember_me": true
}
```

---

## 2. Description

This API authenticates users using Google OAuth2 and returns access and refresh tokens for subsequent API requests.

**Authentication Flow:**
1. Frontend initiates Google OAuth2 flow
2. User authenticates with Google
3. Frontend receives Google ID token
4. Frontend sends Google token to this API
5. Backend verifies token with Google
6. Backend finds or creates user account
7. Backend returns dual tokens (Access + Refresh)

**Token System:**
- **Dual Token System**: Returns both Access Token and Refresh Token
- **Access Token**: 15 minutes lifetime, used for API authentication
- **Refresh Token**: 30 days lifetime (if `remember_me = true`), used to obtain new access tokens

**Authentication Method:**
- Laravel Sanctum Bearer Token
- Access Token must be included in `Authorization: Bearer {token}` header for protected endpoints
- Refresh Token only used with `/auth/refresh` endpoint

---

## 3. Business Logic

### 3.1 Authentication Flow

```
1. Validate request parameters
   ↓
2. Verify Google token with Google API
   ↓
3. If token invalid → Return 401 "Invalid Google token"
   ↓
4. Extract user info from Google token (email, name, picture)
   ↓
5. Find user by Google email in database
   ↓
6. If user not found → Create new user account
   │   ├─ Set status = 'active'
   │   ├─ Generate staff_code automatically
   │   ├─ Set role = 'STAFF' (default)
   │   └─ Save Google profile data
   ↓
7. If user found → Update last login timestamp
   ↓
8. Check account status
   ↓
9. If account inactive → Return 401 "Account not active"
   ↓
10. Generate Access Token (15 minutes, ability: 'api:access')
   ↓
11. Generate Refresh Token (30 days if remember_me, ability: 'api:refresh')
   ↓
12. Load user relationships (store, department)
   ↓
13. Return success response with both tokens and user data
```

### 3.2 Google Token Verification

Backend uses Google's API client library to verify the ID token:

```php
// Verify token with Google
$client = new Google_Client(['client_id' => config('services.google.client_id')]);
$payload = $client->verifyIdToken($googleToken);

if (!$payload) {
    return response()->json([
        'success' => false,
        'error' => 'Invalid Google token',
        'error_code' => 'INVALID_GOOGLE_TOKEN'
    ], 401);
}

// Extract user info
$googleId = $payload['sub'];
$email = $payload['email'];
$name = $payload['name'];
$picture = $payload['picture'] ?? null;
$emailVerified = $payload['email_verified'] ?? false;
```

### 3.3 User Auto-Creation Logic

| Condition | Action |
|-----------|--------|
| **Email exists in database** | Login existing user |
| **Email does not exist** | Create new user with Google data |
| **New user creation** | Set default role = `STAFF`, status = `active` |
| **Staff code generation** | Auto-generate unique code (e.g., `GOOG001`, `GOOG002`) |
| **Email verified** | Require Google email to be verified |

### 3.4 Account Status Check

| Status | Behavior |
|--------|----------|
| `active` | Allow login |
| `inactive` | Block login with error message |
| `suspended` | Block login with error message |
| `deleted` | Block login (treated as not found) |

### 3.5 Security Features

| Feature | Implementation |
|---------|----------------|
| **Token Verification** | Verify Google ID token with Google API |
| **Email Verification** | Require verified email from Google |
| **Dual Token System** | Access Token (15 min) + Refresh Token (30 days) |
| **Token Abilities** | Access: `api:access`, Refresh: `api:refresh` |
| **Token Rotation** | Both tokens replaced on each refresh |
| **Auto-Registration** | Create user account on first Google login |
| **Rate Limiting** | Laravel throttle middleware (60 requests/minute) |

---

## 4. Return

### HTTPstatus: 200 OK

#### Success Response (Existing User)

```json
{
  "success": true,
  "data": {
    "access_token": "3|ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    "access_token_expires_at": "2026-01-11T10:15:00.000000Z",
    "refresh_token": "4|XYZ789abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRS",
    "refresh_token_expires_at": "2026-02-10T10:00:00.000000Z",
    "token_type": "bearer",
    "user": {
      "id": 5,
      "staff_code": "GOOG001",
      "full_name": "John Doe",
      "email": "john.doe@gmail.com",
      "phone": null,
      "role": "STAFF",
      "position": "Employee",
      "store_id": null,
      "store_name": null,
      "department_id": null,
      "department_name": null,
      "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocL..."
    }
  }
}
```

#### Success Response (New User - Auto-Created)

```json
{
  "success": true,
  "is_new_user": true,
  "data": {
    "access_token": "5|ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    "access_token_expires_at": "2026-01-11T10:15:00.000000Z",
    "refresh_token": "6|XYZ789abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRS",
    "refresh_token_expires_at": "2026-02-10T10:00:00.000000Z",
    "token_type": "bearer",
    "user": {
      "id": 6,
      "staff_code": "GOOG002",
      "full_name": "Jane Smith",
      "email": "jane.smith@gmail.com",
      "phone": null,
      "role": "STAFF",
      "position": "Employee",
      "store_id": null,
      "store_name": null,
      "department_id": null,
      "department_name": null,
      "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocM..."
    }
  }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` for successful response |
| `is_new_user` | boolean | `true` if user account was just created (optional field) |
| `data` | object | Response data container |
| `data.access_token` | string | Access token for API authentication (15 min) |
| `data.access_token_expires_at` | string (ISO 8601) | Access token expiration timestamp |
| `data.refresh_token` | string | Refresh token to obtain new access tokens (30 days) |
| `data.refresh_token_expires_at` | string (ISO 8601) | Refresh token expiration timestamp |
| `data.token_type` | string | Always "bearer" |
| `data.user` | object | Authenticated user information |
| `data.user.id` | integer | Staff ID (primary key) |
| `data.user.staff_code` | string | Auto-generated code (e.g., "GOOG001") |
| `data.user.full_name` | string | Name from Google account |
| `data.user.email` | string | Email from Google account |
| `data.user.phone` | string\|null | Phone number (null for Google users) |
| `data.user.role` | string | Default "STAFF" for new Google users |
| `data.user.position` | string | Default "Employee" for new Google users |
| `data.user.store_id` | integer\|null | Store ID (null by default) |
| `data.user.store_name` | string\|null | Store name (null by default) |
| `data.user.department_id` | integer\|null | Department ID (null by default) |
| `data.user.department_name` | string\|null | Department name (null by default) |
| `data.user.avatar_url` | string\|null | Google profile picture URL |

---

### Error Responses

#### 401 - Unauthorized (Invalid Google Token)

```json
{
  "success": false,
  "error": "Invalid Google token",
  "error_code": "INVALID_GOOGLE_TOKEN"
}
```

**Causes:**
- Token expired
- Token tampered with
- Token from different Google app
- Token verification failed

#### 401 - Unauthorized (Account Inactive)

```json
{
  "success": false,
  "error": "This account is not active",
  "error_code": "ACCOUNT_INACTIVE"
}
```

**Note:** Only occurs if user previously created account and was later deactivated.

#### 403 - Forbidden (Email Not Verified)

```json
{
  "success": false,
  "error": "Email not verified by Google",
  "error_code": "EMAIL_NOT_VERIFIED"
}
```

#### 422 - Validation Error

```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "google_token": [
      "The google token field is required."
    ]
  }
}
```

**Common validation errors:**
- `google_token` field is required
- `google_token` must be a string
- `remember_me` must be a boolean

#### 429 - Too Many Requests

```json
{
  "success": false,
  "message": "Too many login attempts. Please try again later.",
  "retry_after": 60
}
```

#### 500 - Internal Server Error

```json
{
  "success": false,
  "message": "Failed to verify Google token",
  "error_code": "GOOGLE_VERIFICATION_FAILED"
}
```

**Causes:**
- Google API unavailable
- Invalid Google client configuration
- Network error connecting to Google

---

## 5. Database Queries

### 5.1 Find User by Google Email

```sql
-- Find staff by Google email
SELECT *
FROM staff
WHERE email = :google_email
LIMIT 1;
```

### 5.2 Create New User (Auto-Registration)

```sql
-- Generate next staff code
SELECT CONCAT('GOOG', LPAD(COALESCE(MAX(CAST(SUBSTRING(staff_code, 5) AS UNSIGNED)), 0) + 1, 3, '0'))
FROM staff
WHERE staff_code LIKE 'GOOG%';

-- Insert new staff
INSERT INTO staff (
    staff_code,
    full_name,
    email,
    role,
    position,
    status,
    avatar_url,
    created_at,
    updated_at
)
VALUES (
    :staff_code,        -- e.g., 'GOOG001'
    :full_name,         -- From Google
    :email,             -- From Google
    'STAFF',            -- Default role
    'Employee',         -- Default position
    'active',           -- Active by default
    :picture_url,       -- From Google
    NOW(),
    NOW()
);
```

### 5.3 Update Last Login

```sql
-- Update last_login timestamp
UPDATE staff
SET last_login_at = NOW(),
    updated_at = NOW()
WHERE staff_id = :staff_id;
```

### 5.4 Load User Relationships

```sql
-- Load store information (if assigned)
SELECT s.store_id, s.store_name, s.store_code
FROM stores s
WHERE s.store_id = :user_store_id;

-- Load department information (if assigned)
SELECT d.department_id, d.department_name, d.department_code
FROM departments d
WHERE d.department_id = :user_department_id;
```

### 5.5 Create Tokens (Dual Token System)

```sql
-- Insert Access Token (15 minutes)
INSERT INTO personal_access_tokens (
    tokenable_type,
    tokenable_id,
    name,
    token,
    abilities,
    expires_at,
    created_at,
    updated_at
)
VALUES (
    'App\\Models\\Staff',
    :staff_id,
    'access_token',
    :hashed_access_token,
    '["api:access"]',
    DATE_ADD(NOW(), INTERVAL 15 MINUTE),
    NOW(),
    NOW()
);

-- Insert Refresh Token (30 days if remember_me)
INSERT INTO personal_access_tokens (
    tokenable_type,
    tokenable_id,
    name,
    token,
    abilities,
    expires_at,
    created_at,
    updated_at
)
VALUES (
    'App\\Models\\Staff',
    :staff_id,
    'refresh_token',
    :hashed_refresh_token,
    '["api:refresh"]',
    DATE_ADD(NOW(), INTERVAL 30 DAY),
    NOW(),
    NOW()
);
```

---

## 6. Frontend Integration

### 6.1 Google OAuth2 Flow

```typescript
// Initialize Google OAuth2
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

// In App.tsx
<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
  <YourApp />
</GoogleOAuthProvider>

// In SignIn component
const handleGoogleSignIn = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    // tokenResponse contains the Google ID token
    const result = await loginWithGoogle(
      tokenResponse.credential,
      rememberMe
    );

    if (result.success) {
      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      setError(result.error);
    }
  },
  onError: () => {
    setError('Google sign in failed');
  }
});
```

### 6.2 Login Function

```typescript
// Login with Google function in AuthContext
const loginWithGoogle = async (
  googleToken: string,
  rememberMe: boolean = false
): Promise<{ success: boolean; error?: string; isNewUser?: boolean }> => {
  try {
    const response = await fetch(`${API_URL}/auth/login/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        google_token: googleToken,
        remember_me: rememberMe,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Google sign in failed'
      };
    }

    // Store tokens and user data (Dual Token System)
    const { access_token, refresh_token, user } = data.data;

    // Access token in sessionStorage (deleted when browser closes)
    sessionStorage.setItem('access_token', access_token);
    sessionStorage.setItem('access_token_expires_at', data.data.access_token_expires_at);

    // Refresh token storage depends on remember_me
    if (rememberMe) {
      // Remember Me = true → localStorage (persists 30 days)
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('refresh_token_expires_at', data.data.refresh_token_expires_at);
    } else {
      // Remember Me = false → sessionStorage (deleted when browser closes)
      sessionStorage.setItem('refresh_token', refresh_token);
      sessionStorage.setItem('refresh_token_expires_at', data.data.refresh_token_expires_at);
    }

    // User data
    localStorage.setItem('optichain_auth', JSON.stringify({ user }));

    return {
      success: true,
      isNewUser: data.is_new_user || false
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error. Please check your connection.'
    };
  }
};
```

### 6.3 Token Storage

| Storage Location | Key | Value | Description |
|------------------|-----|-------|-------------|
| sessionStorage | `access_token` | string | Access token (15 min, deleted on browser close) |
| sessionStorage | `access_token_expires_at` | ISO 8601 string | Access token expiration timestamp |
| localStorage/sessionStorage | `refresh_token` | string | Refresh token (30 days if Remember Me) |
| localStorage/sessionStorage | `refresh_token_expires_at` | ISO 8601 string | Refresh token expiration timestamp |
| localStorage | `optichain_auth` | JSON string | User information object |

**Note:** Refresh token location depends on `remember_me`:
- `remember_me = true` → `localStorage` (persists after browser close)
- `remember_me = false` → `sessionStorage` (deleted on browser close)

### 6.4 New User Onboarding

```typescript
// After successful Google login
if (result.isNewUser) {
  // Show welcome modal or redirect to profile setup
  showWelcomeModal({
    title: "Welcome to OptiChain!",
    message: "Your account has been created. Please complete your profile.",
    action: () => router.push('/profile/setup')
  });
}
```

---

## 7. Security Considerations

### 7.1 Google Token Verification

| Security Measure | Implementation |
|------------------|----------------|
| **Token Validity** | Verify signature with Google public keys |
| **Audience Check** | Ensure token is for our app (client_id) |
| **Expiration Check** | Reject expired tokens |
| **Issuer Check** | Verify token from `accounts.google.com` |
| **Email Verification** | Require `email_verified = true` from Google |

### 7.2 Rate Limiting

| Endpoint | Limit | Window | Block Duration |
|----------|-------|--------|----------------|
| `/auth/login/google` | 10 attempts | 1 minute | 1 minute |
| `/auth/login/google` | 20 attempts | 15 minutes | 15 minutes |

**Implementation:** Laravel's `throttle` middleware

### 7.3 Token Security

| Feature | Implementation |
|---------|----------------|
| **Dual Token System** | Access (15 min) + Refresh (30 days) |
| **Token Abilities** | Access: `api:access`, Refresh: `api:refresh` |
| **Storage** | Access: sessionStorage, Refresh: localStorage/sessionStorage |
| **Transmission** | HTTPS only in production |
| **Auto-Refresh** | Access token auto-refreshes every ~14 minutes |
| **Token Rotation** | Both tokens replaced on each refresh |
| **Revocation** | Manual logout revokes all tokens |
| **Reuse Detection** | Backend detects revoked token reuse |

### 7.4 Auto-Registration Security

| Feature | Implementation |
|---------|----------------|
| **Email Verification** | Only accept verified emails from Google |
| **Default Role** | New users get limited `STAFF` role |
| **Account Approval** | Admin can review and approve new accounts |
| **Domain Restriction** | Optional: Limit to company email domains |

---

## 8. Error Handling

### 8.1 Error Codes Reference

| Error Code | HTTP Status | Meaning | User Action |
|------------|-------------|---------|-------------|
| `INVALID_GOOGLE_TOKEN` | 401 | Google token invalid or expired | Retry Google sign in |
| `ACCOUNT_INACTIVE` | 401 | Account disabled/suspended | Contact administrator |
| `EMAIL_NOT_VERIFIED` | 403 | Google email not verified | Verify email with Google |
| `VALIDATION_ERROR` | 422 | Invalid input format | Check required fields |
| `RATE_LIMITED` | 429 | Too many attempts | Wait before retrying |
| `GOOGLE_VERIFICATION_FAILED` | 500 | Cannot connect to Google API | Try again later |

### 8.2 Frontend Error Display

```typescript
// Error handling in Sign In component
if (!result.success) {
  switch (result.error_code) {
    case 'INVALID_GOOGLE_TOKEN':
      setError('Google sign in failed. Please try again.');
      break;
    case 'ACCOUNT_INACTIVE':
      setError('Your account is not active. Please contact support.');
      break;
    case 'EMAIL_NOT_VERIFIED':
      setError('Please verify your email with Google first.');
      break;
    case 'GOOGLE_VERIFICATION_FAILED':
      setError('Unable to verify with Google. Please try again later.');
      break;
    default:
      setError(result.error || 'Google sign in failed');
  }
}
```

---

## 9. Testing

### 9.1 Test Scenarios

| No | Test Case | Expected Result |
|----|-----------|-----------------|
| 1 | Sign in with valid Google token (existing user) | 200 OK, return tokens |
| 2 | Sign in with valid Google token (new user) | 200 OK, create account, return tokens |
| 3 | Sign in with invalid/expired Google token | 401 INVALID_GOOGLE_TOKEN |
| 4 | Sign in with unverified email | 403 EMAIL_NOT_VERIFIED |
| 5 | Sign in with inactive account | 401 ACCOUNT_INACTIVE |
| 6 | Sign in without google_token field | 422 Validation Error |
| 7 | Sign in with remember_me = true | Refresh token in localStorage, 30 days |
| 8 | Sign in with remember_me = false | Refresh token in sessionStorage |
| 9 | Verify access token has ability `api:access` | Can call regular APIs |
| 10 | Verify refresh token has ability `api:refresh` | Cannot call regular APIs |
| 11 | Multiple failed sign in attempts | 429 Rate Limited |
| 12 | New user gets default role STAFF | User role = STAFF |
| 13 | New user gets auto-generated staff_code | Staff code like GOOG001 |
| 14 | Verify `is_new_user` flag for new accounts | Response includes `is_new_user: true` |

### 9.2 Manual Testing with Google

1. Open Sign In page
2. Click "Sign in with Google" button
3. Select Google account
4. Grant permissions
5. Verify redirect to dashboard
6. Check browser storage for tokens
7. Verify user info displayed correctly

---

## 10. Related APIs

| API | Endpoint | Description |
|-----|----------|-------------|
| **Normal Login** | `POST /api/v1/auth/login` | Sign in with identifier + password |
| **Refresh Tokens** | `POST /api/v1/auth/refresh` | Get new access token using refresh token |
| Get Current User | `GET /api/v1/auth/me` | Verify token and get user info |
| Logout | `POST /api/v1/auth/logout` | Revoke all tokens (access + refresh) |
| Change Password | `POST /api/v1/auth/change-password` | Change password (authenticated) |

---

## 11. Backend Implementation

### 11.1 Required Dependencies

```bash
# Install Google API Client
composer require google/apiclient
```

### 11.2 Environment Configuration

```env
# .env file
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 11.3 Controller Method

```php
// AuthController.php
public function loginWithGoogle(Request $request)
{
    $validator = Validator::make($request->all(), [
        'google_token' => 'required|string',
        'remember_me' => 'boolean',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'The given data was invalid.',
            'errors' => $validator->errors()
        ], 422);
    }

    // Verify Google token
    $client = new Google_Client(['client_id' => config('services.google.client_id')]);
    $payload = $client->verifyIdToken($request->google_token);

    if (!$payload) {
        return response()->json([
            'success' => false,
            'error' => 'Invalid Google token',
            'error_code' => 'INVALID_GOOGLE_TOKEN'
        ], 401);
    }

    // Extract user info
    $email = $payload['email'];
    $emailVerified = $payload['email_verified'] ?? false;

    if (!$emailVerified) {
        return response()->json([
            'success' => false,
            'error' => 'Email not verified by Google',
            'error_code' => 'EMAIL_NOT_VERIFIED'
        ], 403);
    }

    // Find or create user
    $user = Staff::where('email', $email)->first();
    $isNewUser = false;

    if (!$user) {
        // Auto-create user
        $user = Staff::create([
            'staff_code' => $this->generateGoogleStaffCode(),
            'full_name' => $payload['name'],
            'email' => $email,
            'role' => 'STAFF',
            'position' => 'Employee',
            'status' => 'active',
            'avatar_url' => $payload['picture'] ?? null,
        ]);
        $isNewUser = true;
    }

    // Check account status
    if ($user->status !== 'active') {
        return response()->json([
            'success' => false,
            'error' => 'This account is not active',
            'error_code' => 'ACCOUNT_INACTIVE'
        ], 401);
    }

    // Generate tokens (same as normal login)
    $rememberMe = $request->remember_me ?? false;

    $accessToken = $user->createToken('access_token', ['api:access'], now()->addMinutes(15));
    $refreshToken = $user->createToken('refresh_token', ['api:refresh'], now()->addDays(30));

    // Load relationships
    $user->load(['store', 'department']);

    return response()->json([
        'success' => true,
        'is_new_user' => $isNewUser,
        'data' => [
            'access_token' => $accessToken->plainTextToken,
            'access_token_expires_at' => $accessToken->accessToken->expires_at,
            'refresh_token' => $refreshToken->plainTextToken,
            'refresh_token_expires_at' => $refreshToken->accessToken->expires_at,
            'token_type' => 'bearer',
            'user' => new StaffResource($user),
        ]
    ]);
}

private function generateGoogleStaffCode(): string
{
    $lastCode = Staff::where('staff_code', 'LIKE', 'GOOG%')
        ->orderBy('staff_code', 'desc')
        ->first();

    if (!$lastCode) {
        return 'GOOG001';
    }

    $number = intval(substr($lastCode->staff_code, 4)) + 1;
    return 'GOOG' . str_pad($number, 3, '0', STR_PAD_LEFT);
}
```

---

## 12. Notes

### Implementation Status

- ⏳ **Google OAuth2 Integration (planned)**
  - Backend: Verify Google token with Google API
  - Frontend: Google Sign In button with OAuth2 flow
  - Auto-create user accounts on first Google login
  - Dual Token System (Access + Refresh)
  - Token Rotation on each refresh
- ⏳ Domain restriction for company emails (optional)
- ⏳ Admin approval for new Google accounts (optional)
- ⏳ Link Google account to existing accounts (future)

### Deployment Checklist

- [ ] Configure Google OAuth2 credentials in Google Cloud Console
- [ ] Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env`
- [ ] Install `google/apiclient` package
- [ ] Create `/auth/login/google` route
- [ ] Implement `loginWithGoogle()` controller method
- [ ] Add Google Sign In button to frontend
- [ ] Test with multiple Google accounts
- [ ] Test auto-registration flow
- [ ] Test rate limiting

---

## 13. Changelog

| Date | Changes |
|------|---------|
| 2026-01-11 | Initial API specification for Google Sign In with Dual Token System |
