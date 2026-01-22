<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TaskImage;
use App\Models\Task;
use App\Models\TaskStoreAssignment;
use App\Http\Resources\TaskImageResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TaskImageController extends Controller
{
    /**
     * Get all evidence images for a task.
     *
     * @param int $taskId
     * @return JsonResponse
     */
    public function index(int $taskId): JsonResponse
    {
        $task = Task::findOrFail($taskId);

        $images = TaskImage::where('task_id', $taskId)
            ->with('uploadedBy')
            ->orderBy('uploaded_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => TaskImageResource::collection($images),
            'meta' => [
                'total' => $images->count(),
                'task_id' => $taskId,
            ],
        ]);
    }

    /**
     * Get evidence images for a specific store's task execution.
     *
     * @param int $taskId
     * @param int $storeId
     * @return JsonResponse
     */
    public function getStoreEvidence(int $taskId, int $storeId): JsonResponse
    {
        // Find the store assignment
        $assignment = TaskStoreAssignment::where('task_id', $taskId)
            ->where('store_id', $storeId)
            ->firstOrFail();

        $images = TaskImage::where('store_result_id', $assignment->id)
            ->with('uploadedBy')
            ->orderBy('uploaded_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => TaskImageResource::collection($images),
            'meta' => [
                'total' => $images->count(),
                'task_id' => $taskId,
                'store_id' => $storeId,
                'assignment_id' => $assignment->id,
            ],
        ]);
    }

    /**
     * Upload evidence image for a store's task execution.
     *
     * @param Request $request
     * @param int $taskId
     * @param int $storeId
     * @return JsonResponse
     */
    public function uploadStoreEvidence(Request $request, int $taskId, int $storeId): JsonResponse
    {
        // Find the store assignment
        $assignment = TaskStoreAssignment::where('task_id', $taskId)
            ->where('store_id', $storeId)
            ->firstOrFail();

        // Validate request
        $validated = $request->validate([
            'image_url' => 'required|string|url|max:2000',
            'thumbnail_url' => 'nullable|string|url|max:2000',
            'title' => 'nullable|string|max:255',
            'is_completed' => 'boolean',
        ]);

        // Get current user from header
        $userId = $request->header('X-Switched-User-Id', 1);

        // Create image record
        $image = TaskImage::create([
            'task_id' => $taskId,
            'store_result_id' => $assignment->id,
            'title' => $validated['title'] ?? null,
            'image_url' => $validated['image_url'],
            'thumbnail_url' => $validated['thumbnail_url'] ?? null,
            'uploaded_by_id' => $userId,
            'is_completed' => $validated['is_completed'] ?? true,
            'uploaded_at' => now(),
        ]);

        $image->load('uploadedBy');

        return response()->json([
            'success' => true,
            'message' => 'Evidence uploaded successfully',
            'data' => new TaskImageResource($image),
        ], 201);
    }

    /**
     * Delete an evidence image.
     *
     * @param Request $request
     * @param int $taskId
     * @param int $imageId
     * @return JsonResponse
     */
    public function destroy(Request $request, int $taskId, int $imageId): JsonResponse
    {
        $image = TaskImage::where('task_id', $taskId)
            ->where('image_id', $imageId)
            ->firstOrFail();

        // Only the uploader can delete
        $userId = $request->header('X-Switched-User-Id', 1);
        if ($image->uploaded_by_id != $userId) {
            return response()->json([
                'success' => false,
                'message' => 'You can only delete images you uploaded',
            ], 403);
        }

        $image->delete();

        return response()->json([
            'success' => true,
            'message' => 'Evidence deleted successfully',
        ]);
    }
}
