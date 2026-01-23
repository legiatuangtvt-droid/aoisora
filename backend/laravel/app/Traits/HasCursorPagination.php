<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * HasCursorPagination Trait
 *
 * Provides cursor-based pagination as an alternative to offset-based pagination.
 *
 * Benefits:
 * - Consistent performance regardless of page depth (no OFFSET)
 * - Better for real-time data (no duplicate/missing items)
 * - More efficient for large datasets
 *
 * Usage:
 * - Add ?cursor=base64_encoded_cursor to paginate
 * - Or use standard offset pagination with ?page=X&per_page=Y
 */
trait HasCursorPagination
{
    /**
     * Apply cursor or offset pagination based on request
     *
     * @param Builder $query
     * @param Request $request
     * @param string $cursorColumn Column to use for cursor (default: id)
     * @param string $direction Sort direction (asc/desc)
     * @return array Pagination response with data and meta
     */
    protected function paginateWithCursor(
        Builder $query,
        Request $request,
        string $cursorColumn = 'id',
        string $direction = 'desc'
    ): array {
        $perPage = min((int) $request->get('per_page', 20), 100);
        $cursor = $request->get('cursor');

        // If no cursor, use standard offset pagination
        if (!$cursor) {
            return $this->standardPaginate($query, $request, $perPage);
        }

        // Decode cursor
        $decodedCursor = $this->decodeCursor($cursor);
        if (!$decodedCursor) {
            return $this->standardPaginate($query, $request, $perPage);
        }

        // Apply cursor filter
        $operator = $direction === 'desc' ? '<' : '>';
        $query->where($cursorColumn, $operator, $decodedCursor)
              ->orderBy($cursorColumn, $direction);

        // Get one more than requested to determine if there's more
        $items = $query->limit($perPage + 1)->get();
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
                'cursor' => [
                    'current' => $cursor,
                    'next' => $nextCursor,
                    'prev' => null, // Simplified - no prev cursor
                ],
                'has_more' => $hasMore,
                'per_page' => $perPage,
            ],
        ];
    }

    /**
     * Standard offset pagination with optimized query
     */
    protected function standardPaginate(
        Builder $query,
        Request $request,
        int $perPage = 20
    ): array {
        $page = max(1, (int) $request->get('page', 1));

        // Get total count
        $total = $query->count();

        // Get items with offset
        $items = $query->skip(($page - 1) * $perPage)
                       ->take($perPage)
                       ->get();

        $lastPage = ceil($total / $perPage);

        return [
            'data' => $items,
            'meta' => [
                'current_page' => $page,
                'last_page' => max(1, (int) $lastPage),
                'per_page' => $perPage,
                'total' => $total,
                'from' => (($page - 1) * $perPage) + 1,
                'to' => min($page * $perPage, $total),
            ],
        ];
    }

    /**
     * Encode cursor value to base64
     */
    protected function encodeCursor($value): string
    {
        return base64_encode(json_encode(['v' => $value]));
    }

    /**
     * Decode cursor from base64
     */
    protected function decodeCursor(?string $cursor): mixed
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
     * Quick method for keyset pagination (seek method)
     *
     * More efficient than OFFSET for sorted data.
     * Example: Get tasks after task_id 100 instead of OFFSET 100
     */
    protected function seekPaginate(
        Builder $query,
        Request $request,
        string $seekColumn = 'id',
        string $direction = 'desc'
    ): array {
        $perPage = min((int) $request->get('per_page', 20), 100);
        $after = $request->get('after'); // Seek after this value
        $before = $request->get('before'); // Seek before this value

        if ($after) {
            $operator = $direction === 'desc' ? '<' : '>';
            $query->where($seekColumn, $operator, $after);
        } elseif ($before) {
            $operator = $direction === 'desc' ? '>' : '<';
            $query->where($seekColumn, $operator, $before);
        }

        $query->orderBy($seekColumn, $direction);

        // Get items
        $items = $query->limit($perPage + 1)->get();
        $hasMore = $items->count() > $perPage;

        if ($hasMore) {
            $items = $items->slice(0, $perPage);
        }

        // Get boundary values for next/prev
        $firstItem = $items->first();
        $lastItem = $items->last();

        return [
            'data' => $items,
            'meta' => [
                'per_page' => $perPage,
                'has_more' => $hasMore,
                'boundaries' => [
                    'first' => $firstItem?->{$seekColumn},
                    'last' => $lastItem?->{$seekColumn},
                ],
            ],
        ];
    }
}
