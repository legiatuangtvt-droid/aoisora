<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RefreshToken extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'refresh_tokens';

    /**
     * Indicates if the model should be timestamped.
     * We only use created_at, not updated_at
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'staff_id',
        'token_hash',
        'family_id',
        'expires_at',
        'revoked_at',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'expires_at' => 'datetime',
        'revoked_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    /**
     * Get the staff that owns the refresh token.
     */
    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'staff_id', 'staff_id');
    }

    /**
     * Check if the token is valid (not expired and not revoked).
     */
    public function isValid(): bool
    {
        // Check if revoked
        if ($this->revoked_at !== null) {
            return false;
        }

        // Check if expired
        if ($this->expires_at->isPast()) {
            return false;
        }

        return true;
    }

    /**
     * Check if the token has been revoked.
     */
    public function isRevoked(): bool
    {
        return $this->revoked_at !== null;
    }

    /**
     * Revoke this token.
     */
    public function revoke(): bool
    {
        $this->revoked_at = now();
        return $this->save();
    }

    /**
     * Revoke all tokens in the same family.
     * Used when token reuse is detected (potential security breach).
     */
    public static function revokeFamily(string $familyId): int
    {
        return static::where('family_id', $familyId)
            ->whereNull('revoked_at')
            ->update(['revoked_at' => now()]);
    }

    /**
     * Revoke all tokens for a specific staff.
     */
    public static function revokeAllForStaff(int $staffId): int
    {
        return static::where('staff_id', $staffId)
            ->whereNull('revoked_at')
            ->update(['revoked_at' => now()]);
    }

    /**
     * Find a token by its hash.
     */
    public static function findByHash(string $tokenHash): ?static
    {
        return static::where('token_hash', $tokenHash)->first();
    }

    /**
     * Clean up expired tokens.
     * Should be called by a scheduled job.
     */
    public static function cleanupExpired(): int
    {
        return static::where('expires_at', '<', now())
            ->orWhereNotNull('revoked_at')
            ->where('created_at', '<', now()->subDays(7)) // Keep revoked tokens for 7 days for audit
            ->delete();
    }
}
