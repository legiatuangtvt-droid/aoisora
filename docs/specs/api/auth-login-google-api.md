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
- **Refresh Token**:
  - If `remember_me = true`: 30 days lifetime (stored in database), persists in localStorage
  - If `remember_me = false`: No database expiration, stored in sessionStorage (deleted when browser closes)

**Authentication Method:**
- Bearer Token authentication
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
11. Generate Refresh Token (ability: 'api:refresh')
   - If remember_me = true: 30 days expiration
   - If remember_me = false: No expiration (session-based, relies on frontend storage)
   ↓
12. Load user relationships (store, department)
   ↓
13. Return success response with both tokens and user data
```

### 3.2 Google Token Verification Requirements

Backend must verify the Google ID token with Google's verification service:

**Verification Process:**
1. Send token to Google's token verification endpoint
2. Google validates token signature and expiration
3. Extract user information from verified token payload:
   - Google ID (`sub`)
   - Email address (`email`)
   - Full name (`name`)
   - Profile picture URL (`picture`)
   - Email verification status (`email_verified`)

**If verification fails:**
- Return 401 error with code `INVALID_GOOGLE_TOKEN`

**Security Requirements:**
- Token must be verified with Google's official API
- Never trust client-provided user data without verification
- Reject tokens with unverified emails

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

### 3.5 Security Requirements

| Requirement | Specification |
|-------------|---------------|
| **Token Verification** | Must verify Google ID token with Google's official verification service |
| **Email Verification** | Must require verified email status from Google |
| **Dual Token System** | Must issue Access Token (15 min) + Refresh Token (30 days if Remember Me, or session-based) |
| **Token Abilities** | Access tokens for API calls, Refresh tokens only for token refresh |
| **Token Rotation** | Both tokens must be replaced on each refresh operation |
| **Auto-Registration** | System must create user account on first successful Google login |
| **Rate Limiting** | Maximum 10 login attempts per minute per IP, 20 attempts per 15 minutes |

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
  "error_code": "RATE_LIMITED",
  "message": "Too many login attempts. Please try again after 1 minute.",
  "retry_after": 60
}
```

**Note:** `retry_after` indicates seconds until next login attempt is allowed. Value depends on which rate limit was triggered:
- 60 seconds (if exceeded 10 attempts per minute)
- Up to 900 seconds / 15 minutes (if exceeded 20 attempts per 15 minutes)

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

## 5. Data Persistence Requirements

### 5.1 User Lookup by Google Email

System must be able to find existing user by Google email address.

**Requirement**: Query user records where email matches Google email.

### 5.2 Auto-Registration Requirements

When Google user doesn't exist in system:

**Staff Code Generation:**
- System must auto-generate unique staff codes
- Format: `GOOG` + sequential 3-digit number
- Examples: `GOOG001`, `GOOG002`, `GOOG003`
- Must check existing codes to avoid duplicates

**New User Data:**
System must create user record with:
- Auto-generated staff code
- Full name from Google
- Email from Google
- Default role: `STAFF`
- Default position: `Employee`
- Status: `active`
- Avatar URL from Google profile picture
- Current timestamp for creation time

### 5.3 Login Activity Tracking

System must update last login timestamp for user on successful authentication.

**Requirement**: Record current timestamp as last login time for authenticated user.

### 5.4 User Data Loading

After authentication, system must load complete user profile:

**Basic Information:**
- User ID, staff code, full name, email, phone
- Role, position, status
- Avatar URL

**Store Information (if assigned):**
- Store ID, Store name, Store code

**Department Information (if assigned):**
- Department ID, Department name, Department code

### 5.5 Token Storage Requirements

System must persist both tokens with following properties:

**Access Token:**
- Token string (must be hashed before storage)
- User association (link to authenticated user)
- Token type identifier: "access_token"
- Token abilities: "api:access"
- Expiration timestamp: 15 minutes from creation
- Creation timestamp

**Refresh Token:**
- Token string (must be hashed before storage)
- User association (link to authenticated user)
- Token type identifier: "refresh_token"
- Token abilities: "api:refresh"
- Expiration timestamp:
  - If `remember_me = true`: 30 days from creation
  - If `remember_me = false`: NULL (no expiration in database, relies on sessionStorage)
- Creation timestamp

**Token Revocation:**
- System must support immediate token revocation
- Old tokens must be deleted/marked invalid on refresh
- All tokens must be revoked on logout

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

### 7.2 Rate Limiting Requirements

| Endpoint | Limit | Window | Block Duration |
|----------|-------|--------|----------------|
| `/auth/login/google` | 10 attempts | 1 minute | 1 minute |
| `/auth/login/google` | 20 attempts | 15 minutes | 15 minutes |

**Behavior:** System must track Google login attempts and temporarily block further attempts when limits are exceeded.

### 7.3 Token Security Requirements

| Requirement | Specification |
|-------------|---------------|
| **Dual Token System** | System must issue two tokens: Access (15 min) + Refresh (30 days if Remember Me, session-based otherwise) |
| **Token Abilities** | Access tokens can call APIs, Refresh tokens can only refresh |
| **Frontend Storage** | Access in sessionStorage, Refresh in localStorage/sessionStorage |
| **Transmission** | All tokens must be transmitted over HTTPS in production |
| **Auto-Refresh** | Frontend should auto-refresh access token before expiration (~14 min) |
| **Token Rotation** | System must replace both tokens on each refresh operation |
| **Revocation** | System must revoke all user tokens on manual logout |
| **Reuse Detection** | System must detect and block attempts to reuse revoked tokens |
| **Validation** | System must verify token validity and abilities on every API request |

### 7.4 Auto-Registration Security Requirements

| Requirement | Specification |
|-------------|---------------|
| **Email Verification** | System must only accept verified emails from Google |
| **Default Role** | New users must be assigned limited `STAFF` role by default |
| **Account Approval** | System should support admin review/approval workflow (optional) |
| **Domain Restriction** | System should support email domain whitelist (optional) |

---

## 8. Error Codes

| Error Code | HTTP Status | Meaning | User Action |
|------------|-------------|---------|-------------|
| `INVALID_GOOGLE_TOKEN` | 401 | Google token invalid or expired | Retry Google sign in |
| `ACCOUNT_INACTIVE` | 401 | Account disabled/suspended | Contact administrator |
| `EMAIL_NOT_VERIFIED` | 403 | Google email not verified | Verify email with Google |
| `VALIDATION_ERROR` | 422 | Invalid input format | Check required fields |
| `RATE_LIMITED` | 429 | Too many login attempts (10/min or 20/15min) | Wait `retry_after` seconds before retrying |
| `GOOGLE_VERIFICATION_FAILED` | 500 | Cannot connect to Google API | Try again later |

**Note:** `RATE_LIMITED` response includes a `retry_after` field indicating seconds until next attempt is allowed.

**Example Response:**
```json
{
  "success": false,
  "error_code": "RATE_LIMITED",
  "message": "Too many login attempts. Please try again after 1 minute.",
  "retry_after": 60
}
```

---

## 9. Test Scenarios

**Key test scenarios to validate API behavior:**

| Category | Scenario | Expected Result |
|----------|----------|-----------------|
| **Valid Login** | Sign in with valid Google token (existing user) | 200 OK, return access & refresh tokens |
| **Valid Login** | Sign in with valid Google token (new user) | 200 OK, create account, return tokens with `is_new_user: true` |
| **Invalid Token** | Sign in with invalid/expired Google token | 401 INVALID_GOOGLE_TOKEN |
| **Email Verification** | Sign in with unverified email | 403 EMAIL_NOT_VERIFIED |
| **Account Status** | Sign in with inactive account | 401 ACCOUNT_INACTIVE |
| **Validation** | Sign in without google_token field | 422 Validation Error |
| **Rate Limiting** | Multiple failed sign in attempts (>10/min or >20/15min) | 429 RATE_LIMITED with retry_after |
| **Remember Me** | Sign in with remember_me=true | Refresh token expires in 30 days |
| **Remember Me** | Sign in with remember_me=false | Refresh token session-based (no DB expiration) |
| **Token Abilities** | Use access token for API calls | Token has ability `api:access` |
| **Token Abilities** | Use refresh token for regular APIs | Rejected (token has ability `api:refresh` only) |
| **Auto-Registration** | New user gets default role STAFF | User role = STAFF |
| **Auto-Registration** | New user gets auto-generated staff_code | Staff code like GOOG001 |
| **New User Flag** | Verify `is_new_user` flag for new accounts | Response includes `is_new_user: true` |

**Note:** Detailed test cases and test data are maintained separately in the test plan documentation.

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

## 11. Integration Requirements

### 11.1 Google OAuth2 Configuration

Backend must be configured with Google OAuth2 credentials:

**Required Configuration:**
- Google Client ID (from Google Cloud Console)
- Google Client Secret (from Google Cloud Console)

**Google Cloud Console Setup:**
1. Create OAuth 2.0 Client ID
2. Configure authorized redirect URIs
3. Enable Google+ API (for user profile access)

### 11.2 Google API Integration

Backend must integrate with Google's token verification service:

**Requirements:**
- Use Google's official token verification endpoint
- Verify token signature with Google's public keys
- Extract user profile data from verified token payload
- Handle Google API errors gracefully

### 11.3 Frontend OAuth2 Flow

Frontend must implement Google OAuth2 authentication flow:

**Requirements:**
- Display "Sign in with Google" button
- Initiate Google OAuth2 popup/redirect flow
- Receive Google ID token from OAuth2 response
- Send Google token to backend `/auth/login/google` endpoint
- Handle OAuth2 errors and user cancellation

---

## 12. Changelog

| Date | Changes |
|------|---------|
| 2026-01-12 | Removed Section 12 (Future Enhancements) - Spec only describes current requirements, not future plans |
| 2026-01-12 | Simplified Section 9: Removed Manual Testing subsection, kept only Test Scenarios as API behavior examples |
| 2026-01-12 | Simplified Section 8: "Error Handling" → "Error Codes" (removed Frontend Error Display subsection) |
| 2026-01-12 | Enhanced RATE_LIMITED error: added `retry_after` field (60s or 900s) for dynamic retry timing |
| 2026-01-12 | Fixed inconsistency: Rate Limiting 60/min → 10/min + 20/15min (progressive throttling) |
| 2026-01-12 | Clarified refresh token expiration: 30 days (remember_me=true) vs NULL/session-based (remember_me=false) |
| 2026-01-12 | Added token validation requirement to Security Considerations |
| 2026-01-11 | Refactored spec to be tech-agnostic (removed PHP/Laravel/SQL specifics) |
| 2026-01-11 | Initial API specification for Google Sign In with Dual Token System |
