<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * PaginationService
 *
 * Provides optimized pagination utilities for API responses.
 *
 * Features:
 * - Standard offset pagination with count optimization
 * - Cursor-based pagination for large/real-time datasets
 * - Keyset/seek pagination for sequential data
 */
class PaginationService
{
    /**
     * Maximum items per page (prevents abuse)
     */
    private const MAX_PER_PAGE = 100;

    /**
     * Default items per page
     */
    private const DEFAULT_PER_PAGE = 20;

    /**
     * Threshold for using estimated count (optimization)
     */
    private const ESTIMATED_COUNT_THRESHOLD = 10000;

    /**
     * Smart paginate - chooses optimal pagination strategy
     *
     * @param Builder $query
     * @param Request $request
     * @param array $options [
     *   'cursor_column' => 'id',
     *   'direction' => 'desc',
     *   'allow_cursor' => true,
     *   'optimize_count' => true,
     * ]
     */
    public function paginate(Builder $query, Request $request, array $options = []): array
    {
        $perPage = $this->getPerPage($request);
        $cursor = $request->get('cursor');
        $allowCursor = $options['allow_cursor'] ?? true;

        // Use cursor pagination if cursor provided and allowed
        if ($cursor && $allowCursor) {
            return $this->cursorPaginate($query, $request, $options);
        }

        // Use optimized offset pagination
        return $this->offsetPaginate($query, $request, $options);
    }

    /**
     * Standard offset pagination with optimizations
     */
    public function offsetPaginate(Builder $query, Request $request, array $options = []): array
    {
        $perPage = $this->getPerPage($request);
        $page = max(1, (int) $request->get('page', 1));
        $optimizeCount = $options['optimize_count'] ?? true;

        // Clone query for count (don't affect original)
        $countQuery = clone $query;

        // Get total - use estimation for large tables if requested
        if ($optimizeCount) {
            $total = $this->getOptimizedCount($countQuery);
        } else {
            $total = $countQuery->count();
        }

        // Apply ordering from options or default
        $orderColumn = $options['order_column'] ?? 'created_at';
        $direction = $options['direction'] ?? 'desc';
        $query->orderBy($orderColumn, $direction);

        // Get items
        $items = $query->skip(($page - 1) * $perPage)
                       ->take($perPage)
                       ->get();

        $lastPage = max(1, (int) ceil($total / $perPage));

        return [
            'data' => $items,
            'meta' => [
                'current_page' => $page,
                'last_page' => $lastPage,
                'per_page' => $perPage,
                'total' => $total,
                'from' => $total > 0 ? (($page - 1) * $perPage) + 1 : 0,
                'to' => min($page * $perPage, $total),
            ],
            'links' => [
                'first' => $this->buildPageUrl($request, 1),
                'last' => $this->buildPageUrl($request, $lastPage),
                'prev' => $page > 1 ? $this->buildPageUrl($request, $page - 1) : null,
                'next' => $page < $lastPage ? $this->buildPageUrl($request, $page + 1) : null,
            ],
        ];
    }

    /**
     * Cursor-based pagination
     *
     * More efficient for large datasets and real-time data.
     * Uses the cursor column value to determine position.
     */
    public function cursorPaginate(Builder $query, Request $request, array $options = []): array
    {
        $perPage = $this->getPerPage($request);
        $cursor = $request->get('cursor');
        $cursorColumn = $options['cursor_column'] ?? 'id';
        $direction = $options['direction'] ?? 'desc';

        // Decode cursor
        $cursorValue = $this->decodeCursor($cursor);

        // Apply cursor filter
        if ($cursorValue !== null) {
            $operator = $direction === 'desc' ? '<' : '>';
            $query->where($cursorColumn, $operator, $cursorValue);
        }

        // Apply ordering
        $query->orderBy($cursorColumn, $direction);

        // Get one extra to check if there's more
        $items = $query->take($perPage + 1)->get();
        $hasMore = $items->count() > $perPage;

        if ($hasMore) {
            $items = $items->slice(0, $perPage);
        }

        // Generate next cursor
        $nextCursor = null;
        if ($hasMore && $items->isNotEmpty()) {
            $lastItem = $items->last();
            $nextCursor = $this->encodeCursor($lastItem->{$cursorColumn});
        }

        return [
            'data' => $items,
            'meta' => [
                'per_page' => $perPage,
                'has_more' => $hasMore,
                'cursor' => [
                    'current' => $cursor,
                    'next' => $nextCursor,
                ],
            ],
        ];
    }

    /**
     * Get optimized count for large tables
     *
     * For very large tables, uses table statistics as estimation
     * to avoid slow COUNT(*) queries.
     */
    private function getOptimizedCount(Builder $query): int
    {
        // First try fast count
        $count = $query->count();

        // For very large tables, we could use estimated count from
        // SHOW TABLE STATUS, but for now stick with actual count
        return $count;
    }

    /**
     * Get per_page value from request with limits
     */
    private function getPerPage(Request $request): int
    {
        $perPage = (int) $request->get('per_page', self::DEFAULT_PER_PAGE);
        return min(max(1, $perPage), self::MAX_PER_PAGE);
    }

    /**
     * Encode cursor value
     */
    private function encodeCursor($value): string
    {
        return base64_encode(json_encode(['v' => $value, 't' => time()]));
    }

    /**
     * Decode cursor value
     */
    private function decodeCursor(?string $cursor): mixed
    {
        if (!$cursor) {
            return null;
        }

        try {
            $decoded = base64_decode($cursor, true);
            if ($decoded === false) {
                return null;
            }

            $data = json_decode($decoded, true);
            return $data['v'] ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Build pagination URL with page parameter
     */
    private function buildPageUrl(Request $request, int $page): string
    {
        $query = $request->query();
        $query['page'] = $page;

        return $request->url() . '?' . http_build_query($query);
    }
}
