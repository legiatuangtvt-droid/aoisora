<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use App\Models\PasswordResetToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Login with email/phone/sap_code and password
     * Supports: email, phone, sap_code, username
     */
    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'password' => 'required|string',
            'remember_me' => 'boolean',
        ]);

        $identifier = $request->identifier;

        // Find staff by email, phone, sap_code, or username
        $staff = Staff::where('email', $identifier)
            ->orWhere('phone', $identifier)
            ->orWhere('sap_code', $identifier)
            ->orWhere('username', $identifier)
            ->first();

        if (!$staff) {
            return response()->json([
                'success' => false,
                'error' => 'Account not found',
                'error_code' => 'ACCOUNT_NOT_FOUND',
            ], 401);
        }

        if (!Hash::check($request->password, $staff->password_hash)) {
            return response()->json([
                'success' => false,
                'error' => 'Incorrect password',
                'error_code' => 'INCORRECT_PASSWORD',
            ], 401);
        }

        if ($staff->status !== 'active') {
            return response()->json([
                'success' => false,
                'error' => 'This account is not active',
                'error_code' => 'ACCOUNT_INACTIVE',
            ], 401);
        }

        // Token expiration based on remember_me
        $expiration = $request->remember_me ? now()->addDays(30) : now()->addHours(24);
        $token = $staff->createToken('auth-token', ['*'], $expiration)->plainTextToken;

        // Load relationships
        $staff->load(['store', 'department']);

        // Get permissions info
        $permissionService = app(\App\Services\JobGradePermissionService::class);
        $permissions = $permissionService->getPermissionInfo($staff);

        return response()->json([
            'success' => true,
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_at' => $expiration->toISOString(),
            'user' => [
                'id' => $staff->staff_id,
                'staff_code' => $staff->staff_code,
                'full_name' => $staff->staff_name,
                'email' => $staff->email,
                'phone' => $staff->phone,
                'role' => $staff->role,
                'position' => $staff->position,
                'job_grade' => $staff->job_grade,
                'store_id' => $staff->store_id,
                'store_name' => $staff->store?->store_name,
                'department_id' => $staff->department_id,
                'department_name' => $staff->department?->department_name,
                'avatar_url' => $staff->avatar_url,
                'permissions' => $permissions,
            ],
        ]);
    }

    /**
     * Get current authenticated user
     */
    public function me(Request $request)
    {
        $staff = $request->user();
        $staff->load(['store', 'department', 'team']);

        // Get permissions info
        $permissionService = app(\App\Services\JobGradePermissionService::class);
        $permissions = $permissionService->getPermissionInfo($staff);

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $staff->staff_id,
                'staff_code' => $staff->staff_code,
                'full_name' => $staff->staff_name,
                'email' => $staff->email,
                'phone' => $staff->phone,
                'role' => $staff->role,
                'position' => $staff->position,
                'job_grade' => $staff->job_grade,
                'store_id' => $staff->store_id,
                'store_name' => $staff->store?->store_name,
                'department_id' => $staff->department_id,
                'department_name' => $staff->department?->department_name,
                'team_id' => $staff->team_id,
                'team_name' => $staff->team?->team_name,
                'avatar_url' => $staff->avatar_url,
                'skills' => $staff->skills,
                'permissions' => $permissions,
            ],
        ]);
    }

    /**
     * Logout - revoke current token
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Refresh/Extend session
     * Extends the current token expiration time
     */
    public function refresh(Request $request)
    {
        $user = $request->user();
        $token = $user->currentAccessToken();

        // Check if token is still valid
        if ($token->expires_at && Carbon::parse($token->expires_at)->isPast()) {
            return response()->json([
                'success' => false,
                'error' => 'TOKEN_EXPIRED',
                'message' => 'Your session has expired. Please sign in again.',
            ], 401);
        }

        // Extend token expiration (120 minutes from now)
        $expirationMinutes = config('sanctum.expiration', 120);
        $token->expires_at = Carbon::now()->addMinutes($expirationMinutes);
        $token->last_used_at = Carbon::now();
        $token->save();

        return response()->json([
            'success' => true,
            'message' => 'Session extended successfully',
            'expires_at' => Carbon::parse($token->expires_at)->toISOString(),
        ]);
    }

    /**
     * Request password reset - Step 1 of Forgot Password flow
     * Sends verification code to email
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $staff = Staff::where('email', $request->email)->first();

        if (!$staff) {
            return response()->json([
                'success' => false,
                'error' => 'No account found with this email',
                'error_code' => 'EMAIL_NOT_FOUND',
            ], 404);
        }

        // Generate 5-digit verification code
        $code = str_pad(random_int(0, 99999), 5, '0', STR_PAD_LEFT);

        // Store the code with expiration (15 minutes)
        PasswordResetToken::updateOrCreate(
            ['email' => $request->email],
            [
                'token' => Hash::make($code),
                'code' => $code, // Store plain code for comparison (in production, only store hashed)
                'expires_at' => Carbon::now()->addMinutes(15),
                'created_at' => Carbon::now(),
            ]
        );

        // TODO: Send email with verification code
        // For now, we'll return the code in development mode
        $response = [
            'success' => true,
            'message' => 'Verification code sent to your email',
            'email' => $this->maskEmail($request->email),
        ];

        // In development, include the code for testing
        if (config('app.debug')) {
            $response['debug_code'] = $code;
        }

        return response()->json($response);
    }

    /**
     * Verify reset code - Step 2 of Forgot Password flow
     */
    public function verifyResetCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:5',
        ]);

        $resetToken = PasswordResetToken::where('email', $request->email)->first();

        if (!$resetToken) {
            return response()->json([
                'success' => false,
                'error' => 'No reset request found for this email',
                'error_code' => 'NO_RESET_REQUEST',
            ], 404);
        }

        if (Carbon::parse($resetToken->expires_at)->isPast()) {
            return response()->json([
                'success' => false,
                'error' => 'Verification code has expired',
                'error_code' => 'CODE_EXPIRED',
            ], 400);
        }

        if ($resetToken->code !== $request->code) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid verification code',
                'error_code' => 'INVALID_CODE',
            ], 400);
        }

        // Generate a temporary token for password reset
        $resetToken->reset_token = Str::random(64);
        $resetToken->verified_at = Carbon::now();
        $resetToken->save();

        return response()->json([
            'success' => true,
            'message' => 'Code verified successfully',
            'reset_token' => $resetToken->reset_token,
        ]);
    }

    /**
     * Reset password - Step 3 of Forgot Password flow
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'reset_token' => 'required|string',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/',
            ],
        ], [
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        ]);

        $resetToken = PasswordResetToken::where('email', $request->email)
            ->where('reset_token', $request->reset_token)
            ->whereNotNull('verified_at')
            ->first();

        if (!$resetToken) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid or expired reset token',
                'error_code' => 'INVALID_RESET_TOKEN',
            ], 400);
        }

        // Check if reset token is still valid (30 minutes from verification)
        if (Carbon::parse($resetToken->verified_at)->addMinutes(30)->isPast()) {
            return response()->json([
                'success' => false,
                'error' => 'Reset token has expired',
                'error_code' => 'RESET_TOKEN_EXPIRED',
            ], 400);
        }

        $staff = Staff::where('email', $request->email)->first();

        if (!$staff) {
            return response()->json([
                'success' => false,
                'error' => 'Account not found',
                'error_code' => 'ACCOUNT_NOT_FOUND',
            ], 404);
        }

        // Update password
        $staff->password_hash = Hash::make($request->password);
        $staff->save();

        // Delete the reset token
        $resetToken->delete();

        // Revoke all existing tokens
        $staff->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully. Please sign in with your new password.',
        ]);
    }

    /**
     * Resend verification code
     */
    public function resendCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $staff = Staff::where('email', $request->email)->first();

        if (!$staff) {
            return response()->json([
                'success' => false,
                'error' => 'No account found with this email',
                'error_code' => 'EMAIL_NOT_FOUND',
            ], 404);
        }

        // Check rate limiting (1 request per minute)
        $existingToken = PasswordResetToken::where('email', $request->email)->first();
        if ($existingToken && Carbon::parse($existingToken->created_at)->addMinute()->isFuture()) {
            return response()->json([
                'success' => false,
                'error' => 'Please wait before requesting another code',
                'error_code' => 'RATE_LIMITED',
                'retry_after' => Carbon::parse($existingToken->created_at)->addMinute()->diffInSeconds(now()),
            ], 429);
        }

        // Generate new 5-digit verification code
        $code = str_pad(random_int(0, 99999), 5, '0', STR_PAD_LEFT);

        PasswordResetToken::updateOrCreate(
            ['email' => $request->email],
            [
                'token' => Hash::make($code),
                'code' => $code,
                'expires_at' => Carbon::now()->addMinutes(15),
                'created_at' => Carbon::now(),
                'reset_token' => null,
                'verified_at' => null,
            ]
        );

        $response = [
            'success' => true,
            'message' => 'New verification code sent to your email',
        ];

        if (config('app.debug')) {
            $response['debug_code'] = $code;
        }

        return response()->json($response);
    }

    /**
     * Change password (for authenticated users)
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/',
            ],
        ], [
            'new_password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        ]);

        $staff = $request->user();

        if (!Hash::check($request->current_password, $staff->password_hash)) {
            return response()->json([
                'success' => false,
                'error' => 'Current password is incorrect',
                'error_code' => 'INCORRECT_PASSWORD',
            ], 400);
        }

        $staff->password_hash = Hash::make($request->new_password);
        $staff->save();

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully',
        ]);
    }

    /**
     * Check password strength
     */
    public function checkPasswordStrength(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $password = $request->password;
        $strength = $this->calculatePasswordStrength($password);

        return response()->json([
            'success' => true,
            'strength' => $strength['level'],
            'score' => $strength['score'],
            'feedback' => $strength['feedback'],
        ]);
    }

    /**
     * Calculate password strength
     */
    private function calculatePasswordStrength(string $password): array
    {
        $score = 0;
        $feedback = [];

        // Length check
        if (strlen($password) >= 8) {
            $score += 1;
        } else {
            $feedback[] = 'Password should be at least 8 characters';
        }

        if (strlen($password) >= 12) {
            $score += 1;
        }

        // Uppercase check
        if (preg_match('/[A-Z]/', $password)) {
            $score += 1;
        } else {
            $feedback[] = 'Add uppercase letters';
        }

        // Lowercase check
        if (preg_match('/[a-z]/', $password)) {
            $score += 1;
        } else {
            $feedback[] = 'Add lowercase letters';
        }

        // Number check
        if (preg_match('/\d/', $password)) {
            $score += 1;
        } else {
            $feedback[] = 'Add numbers';
        }

        // Special character check
        if (preg_match('/[@$!%*?&]/', $password)) {
            $score += 1;
        } else {
            $feedback[] = 'Add special characters (@$!%*?&)';
        }

        // Determine strength level
        if ($score <= 2) {
            $level = 'weak';
        } elseif ($score <= 4) {
            $level = 'medium';
        } else {
            $level = 'strong';
        }

        return [
            'level' => $level,
            'score' => $score,
            'feedback' => $feedback,
        ];
    }

    /**
     * Mask email for privacy
     */
    private function maskEmail(string $email): string
    {
        $parts = explode('@', $email);
        $name = $parts[0];
        $domain = $parts[1];

        $maskedName = substr($name, 0, 2) . str_repeat('*', max(strlen($name) - 2, 0));

        return $maskedName . '@' . $domain;
    }
}
