<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TaskComment;
use App\Models\Task;
use App\Http\Resources\TaskCommentResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TaskCommentController extends Controller
{
    /**
     * Get all comments for a task.
     *
     * @param int $taskId
     * @return JsonResponse
     */
    public function index(int $taskId): JsonResponse
    {
        $task = Task::findOrFail($taskId);

        $comments = TaskComment::where('task_id', $taskId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => TaskCommentResource::collection($comments),
            'meta' => [
                'total' => $comments->count(),
                'task_id' => $taskId,
            ],
        ]);
    }

    /**
     * Store a new comment for a task.
     *
     * @param Request $request
     * @param int $taskId
     * @return JsonResponse
     */
    public function store(Request $request, int $taskId): JsonResponse
    {
        $task = Task::findOrFail($taskId);

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
            'store_result_id' => 'nullable|integer|exists:task_store_assignments,id',
        ]);

        // Get current user from header or use default
        $userId = $request->header('X-Switched-User-Id', 1);

        $comment = TaskComment::create([
            'task_id' => $taskId,
            'user_id' => $userId,
            'content' => $validated['content'],
            'store_result_id' => $validated['store_result_id'] ?? null,
        ]);

        $comment->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Comment added successfully',
            'data' => new TaskCommentResource($comment),
        ], 201);
    }

    /**
     * Update a comment.
     *
     * @param Request $request
     * @param int $taskId
     * @param int $commentId
     * @return JsonResponse
     */
    public function update(Request $request, int $taskId, int $commentId): JsonResponse
    {
        $comment = TaskComment::where('task_id', $taskId)
            ->where('comment_id', $commentId)
            ->firstOrFail();

        // Only the comment owner can edit
        $userId = $request->header('X-Switched-User-Id', 1);
        if ($comment->user_id != $userId) {
            return response()->json([
                'success' => false,
                'message' => 'You can only edit your own comments',
            ], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        $comment->update([
            'content' => $validated['content'],
        ]);

        $comment->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Comment updated successfully',
            'data' => new TaskCommentResource($comment),
        ]);
    }

    /**
     * Delete a comment.
     *
     * @param Request $request
     * @param int $taskId
     * @param int $commentId
     * @return JsonResponse
     */
    public function destroy(Request $request, int $taskId, int $commentId): JsonResponse
    {
        $comment = TaskComment::where('task_id', $taskId)
            ->where('comment_id', $commentId)
            ->firstOrFail();

        // Only the comment owner can delete
        $userId = $request->header('X-Switched-User-Id', 1);
        if ($comment->user_id != $userId) {
            return response()->json([
                'success' => false,
                'message' => 'You can only delete your own comments',
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully',
        ]);
    }
}
