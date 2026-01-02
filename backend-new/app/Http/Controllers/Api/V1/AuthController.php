<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login with username and password (Personal Access Token)
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $staff = Staff::where('username', $request->username)->first();

        if (!$staff || !Hash::check($request->password, $staff->password_hash)) {
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($staff->status !== 'active') {
            throw ValidationException::withMessages([
                'username' => ['This account is not active.'],
            ]);
        }

        // Create Passport Personal Access Token
        $tokenResult = $staff->createToken('Personal Access Token');
        $token = $tokenResult->accessToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_at' => $tokenResult->token->expires_at->toDateTimeString(),
            'staff' => [
                'staff_id' => $staff->staff_id,
                'staff_code' => $staff->staff_code,
                'username' => $staff->username,
                'staff_name' => $staff->staff_name,
                'email' => $staff->email,
                'role' => $staff->role,
                'store_id' => $staff->store_id,
                'department_id' => $staff->department_id,
                'avatar_url' => $staff->avatar_url,
            ],
        ]);
    }

    /**
     * Get current authenticated user
     */
    public function me(Request $request)
    {
        $staff = $request->user();
        $staff->load(['store', 'department']);

        return response()->json([
            'staff_id' => $staff->staff_id,
            'staff_code' => $staff->staff_code,
            'username' => $staff->username,
            'staff_name' => $staff->staff_name,
            'email' => $staff->email,
            'phone' => $staff->phone,
            'role' => $staff->role,
            'store_id' => $staff->store_id,
            'store' => $staff->store,
            'department_id' => $staff->department_id,
            'department' => $staff->department,
            'avatar_url' => $staff->avatar_url,
        ]);
    }

    /**
     * Logout - revoke current token
     */
    public function logout(Request $request)
    {
        $request->user()->token()->revoke();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $staff = $request->user();

        if (!Hash::check($request->current_password, $staff->password_hash)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        $staff->update([
            'password_hash' => Hash::make($request->new_password),
        ]);

        return response()->json([
            'message' => 'Password changed successfully',
        ]);
    }
}
