<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * CompressResponse Middleware
 *
 * Compresses JSON API responses using gzip when:
 * 1. Client supports gzip (Accept-Encoding header)
 * 2. Response is JSON
 * 3. Response is larger than threshold (1KB)
 *
 * Note: In production with Apache/Nginx, mod_deflate/gzip handles this.
 * This middleware is a fallback for development (PHP built-in server).
 */
class CompressResponse
{
    /**
     * Minimum response size to compress (in bytes)
     */
    private const MIN_COMPRESS_SIZE = 1024; // 1KB

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Skip if not a successful response
        if (!$response->isSuccessful()) {
            return $response;
        }

        // Skip if client doesn't support gzip
        $acceptEncoding = $request->header('Accept-Encoding', '');
        if (stripos($acceptEncoding, 'gzip') === false) {
            return $response;
        }

        // Skip if already compressed or not JSON
        $contentType = $response->headers->get('Content-Type', '');
        if (stripos($contentType, 'application/json') === false) {
            return $response;
        }

        // Skip if response is already encoded
        if ($response->headers->has('Content-Encoding')) {
            return $response;
        }

        $content = $response->getContent();
        if ($content === false) {
            return $response;
        }

        // Skip small responses
        if (strlen($content) < self::MIN_COMPRESS_SIZE) {
            return $response;
        }

        // Compress the response
        $compressed = gzencode($content, 6); // Level 6 is a good balance

        if ($compressed === false || strlen($compressed) >= strlen($content)) {
            // Compression failed or made it larger
            return $response;
        }

        // Set compressed content and headers
        $response->setContent($compressed);
        $response->headers->set('Content-Encoding', 'gzip');
        $response->headers->set('Content-Length', strlen($compressed));
        $response->headers->set('Vary', 'Accept-Encoding');

        return $response;
    }
}
