<?php

namespace App\Services;

use App\Models\Staff;
use App\Models\RefreshToken;
use App\Exceptions\TokenReuseException;
use App\Exceptions\InvalidRefreshTokenException;
use Illuminate\Support\Str;

class TokenService
{
    /**
     * Access token time-to-live in minutes.
     */
    public const ACCESS_TOKEN_TTL = 15; // 15 minutes

    /**
     * Refresh token time-to-live in days (normal).
     */
    public const REFRESH_TOKEN_TTL = 7; // 7 days

    /**
     * Refresh token time-to-live in days (remember me).
     */
    public const REFRESH_TOKEN_TTL_REMEMBER = 30; // 30 days

    /**
     * Generate a new token pair (access + refresh).
     *
     * @param Staff $staff The authenticated staff
     * @param bool $remember Whether to extend refresh token lifetime
     * @return array Token pair with metadata
     */
    public function generateTokenPair(Staff $staff, bool $remember = false): array
    {
        return $this->generateTokenPairWithFamily($staff, Str::uuid()->toString(), $remember);
    }

    /**
     * Generate a new token pair with a specific family ID.
     * Used when rotating tokens to keep the same family.
     *
     * @param Staff $staff The authenticated staff
     * @param string $familyId The token family ID
     * @param bool $remember Whether to extend refresh token lifetime
     * @return array Token pair with metadata
     */
    public function generateTokenPairWithFamily(Staff $staff, string $familyId, bool $remember = false): array
    {
        // 1. Revoke any existing Sanctum tokens for this staff (optional - for single session)
        // Uncomment if you want single session per user:
        // $staff->tokens()->delete();

        // 2. Create new access token using Sanctum
        $accessToken = $staff->createToken(
            'access_token',
            ['*'], // abilities
            now()->addMinutes(self::ACCESS_TOKEN_TTL)
        );

        // 3. Generate refresh token
        $refreshTokenPlain = Str::random(64);
        $refreshTokenHash = hash('sha256', $refreshTokenPlain);

        // 4. Calculate expiration
        $expiresAt = $remember
            ? now()->addDays(self::REFRESH_TOKEN_TTL_REMEMBER)
            : now()->addDays(self::REFRESH_TOKEN_TTL);

        // 5. Store refresh token in database
        RefreshToken::create([
            'staff_id' => $staff->staff_id,
            'token_hash' => $refreshTokenHash,
            'family_id' => $familyId,
            'expires_at' => $expiresAt,
        ]);

        return [
            'access_token' => $accessToken->plainTextToken,
            'refresh_token' => $refreshTokenPlain,
            'expires_in' => self::ACCESS_TOKEN_TTL * 60, // Convert to seconds
            'token_type' => 'Bearer',
        ];
    }

    /**
     * Refresh tokens using a valid refresh token.
     * Implements token rotation - old token is invalidated.
     *
     * @param string $refreshToken The plain refresh token
     * @return array New token pair
     * @throws TokenReuseException If token reuse is detected
     * @throws InvalidRefreshTokenException If token is invalid
     */
    public function refreshTokens(string $refreshToken): array
    {
        // 1. Hash the provided token
        $tokenHash = hash('sha256', $refreshToken);

        // 2. Find the token in database
        $storedToken = RefreshToken::findByHash($tokenHash);

        // 3. Check if token exists
        if (!$storedToken) {
            throw new InvalidRefreshTokenException('Refresh token not found');
        }

        // 4. Check for token reuse (already revoked)
        if ($storedToken->isRevoked()) {
            // SECURITY: Token reuse detected - revoke entire family
            RefreshToken::revokeFamily($storedToken->family_id);

            // Also revoke all Sanctum tokens for this user
            $storedToken->staff->tokens()->delete();

            throw new TokenReuseException('Token reuse detected - all sessions invalidated');
        }

        // 5. Check if token is expired
        if (!$storedToken->isValid()) {
            throw new InvalidRefreshTokenException('Refresh token expired');
        }

        // 6. Load the staff relationship
        $staff = $storedToken->staff;

        if (!$staff) {
            throw new InvalidRefreshTokenException('Staff not found');
        }

        // 7. Revoke the old refresh token (rotation)
        $storedToken->revoke();

        // 8. Revoke old Sanctum access tokens
        $staff->tokens()->delete();

        // 9. Generate new token pair with the same family ID
        // Calculate if this was a "remember me" token based on original expiry
        $wasRemember = $storedToken->expires_at->diffInDays($storedToken->created_at) > self::REFRESH_TOKEN_TTL;

        return $this->generateTokenPairWithFamily($staff, $storedToken->family_id, $wasRemember);
    }

    /**
     * Revoke all tokens for a staff member.
     * Used during logout or security events.
     *
     * @param Staff $staff The staff to revoke tokens for
     * @return void
     */
    public function revokeAllTokens(Staff $staff): void
    {
        // Revoke all Sanctum tokens
        $staff->tokens()->delete();

        // Revoke all refresh tokens
        RefreshToken::revokeAllForStaff($staff->staff_id);
    }

    /**
     * Revoke a specific token family.
     * Used when suspicious activity is detected.
     *
     * @param string $familyId The family ID to revoke
     * @return int Number of tokens revoked
     */
    public function revokeTokenFamily(string $familyId): int
    {
        return RefreshToken::revokeFamily($familyId);
    }
}
