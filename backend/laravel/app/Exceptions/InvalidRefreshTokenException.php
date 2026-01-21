<?php

namespace App\Exceptions;

use Exception;

/**
 * Exception thrown when a refresh token is invalid.
 * This can occur when:
 * - Token doesn't exist in database
 * - Token has expired
 * - Associated staff not found
 */
class InvalidRefreshTokenException extends Exception
{
    /**
     * Create a new InvalidRefreshTokenException instance.
     *
     * @param string $message
     */
    public function __construct(string $message = 'Invalid refresh token')
    {
        parent::__construct($message);
    }
}
