<?php

/**
 * Router script for PHP built-in web server
 * Usage: php -S localhost:8000 router.php
 */

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)
);

// If the request is for an existing file, return false to let the server handle it
if ($uri !== '/' && file_exists(__DIR__.$uri)) {
    return false;
}

// Route all other requests to index.php
require_once __DIR__.'/index.php';
