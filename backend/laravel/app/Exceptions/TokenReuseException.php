<?php

namespace App\Exceptions;

use Exception;

/**
 * Exception thrown when token reuse is detected.
 * This indicates a potential security breach where someone
 * is trying to use an already-rotated refresh token.
 */
class TokenReuseException extends Exception
{
    /**
     * Create a new TokenReuseException instance.
     *
     * @param string $message
     */
    public function __construct(string $message = 'Token reuse detected')
    {
        parent::__construct($message);
    }
}
