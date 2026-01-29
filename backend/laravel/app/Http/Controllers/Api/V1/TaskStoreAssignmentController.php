<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Store;
use App\Models\Staff;
use App\Models\TaskStoreAssignment;
use App\Models\TaskExecutionLog;
use App\Traits\HasJobGradePermissions;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TaskStoreAssignmentController extends Controller
{
    use HasJobGradePermissions;

    /**
     * Get all tasks assigned to a store
     *
     * GET /api/v1/stores/{store_id}/tasks
     *
     * @param Request $request
     * @param int $storeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStoreTasks(Request $request, $storeId)
    {
        $store = Store::findOrFail($storeId);

        $query = TaskStoreAssignment::with([
            'task.taskType',
            'task.department',
            'task.status',
            'assignedToStaff',
            'startedBy',
            'completedBy',
        ])
            ->where('store_id', $storeId)
            ->orderByRaw("CASE
                WHEN status = 'on_progress' THEN 1
                WHEN status = 'not_yet' THEN 2
                WHEN status = 'done_pending' THEN 3
                WHEN status = 'done' THEN 4
                WHEN status = 'unable' THEN 5
                ELSE 6
            END")
            ->orderBy('created_at', 'desc');

        // Apply status filter if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $assignments = $query->paginate($request->get('per_page', 20));

        return response()->json($assignments);
    }

    /**
     * Get tasks assigned to current user within a store
     *
     * GET /api/v1/stores/{store_id}/tasks/my
     *
     * @param Request $request
     * @param int $storeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMyStoreTasks(Request $request, $storeId)
    {
        $user = $this->getEffectiveUser($request);

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
                'error' => 'User not authenticated',
            ], 401);
        }

        $query = TaskStoreAssignment::with([
            'task.taskType',
            'task.department',
            'task.status',
        ])
            ->where('store_id', $storeId)
            ->where('assigned_to_staff', $user->staff_id)
            ->orderByRaw("CASE
                WHEN status = 'on_progress' THEN 1
                WHEN status = 'not_yet' THEN 2
                WHEN status = 'done_pending' THEN 3
                WHEN status = 'done' THEN 4
                WHEN status = 'unable' THEN 5
                ELSE 6
            END")
            ->orderBy('created_at', 'desc');

        $assignments = $query->paginate($request->get('per_page', 20));

        return response()->json($assignments);
    }

    /**
     * Get task assignment detail for a specific store
     *
     * GET /api/v1/tasks/{task_id}/stores/{store_id}
     *
     * @param int $taskId
     * @param int $storeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTaskStoreDetail($taskId, $storeId)
    {
        $assignment = TaskStoreAssignment::with([
            'task.taskType',
            'task.responseType',
            'task.department',
            'task.status',
            'task.createdBy',
            'store',
            'assignedBy',
            'assignedToStaff',
            'startedBy',
            'completedBy',
            'checkedBy',
            'executionLogs.performedBy',
        ])
            ->where('task_id', $taskId)
            ->where('store_id', $storeId)
            ->firstOrFail();

        return response()->json($assignment);
    }

    /**
     * Assign task to a staff member within the store
     *
     * POST /api/v1/tasks/{task_id}/stores/{store_id}/assign
     *
     * @param Request $request
     * @param int $taskId
     * @param int $storeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function assignToStaff(Request $request, $taskId, $storeId)
    {
        $request->validate([
            'staff_id' => 'required|exists:staff,staff_id',
        ]);

        $user = $this->getEffectiveUser($request);
        $assignment = $this->getAssignmentOrFail($taskId, $storeId);

        // Check permission: Only S4-S2 (Store Leaders) can assign
        if (!$this->canAssignWithinStore($user)) {
            return response()->json([
                'message' => 'Permission denied',
                'error' => 'Only Store Leaders (S4-S2) can assign tasks to staff.',
            ], 403);
        }

        // Cannot assign if already in final state
        if ($assignment->isFinalState()) {
            return response()->json([
                'message' => 'Invalid status',
                'error' => 'Cannot assign a task that is already done or unable.',
            ], 422);
        }

        $targetStaff = Staff::findOrFail($request->staff_id);

        // Update assignment
        $assignment->update([
            'assigned_to_staff' => $targetStaff->staff_id,
            'assigned_to_at' => Carbon::now(),
        ]);

        // Log the action
        TaskExecutionLog::logAssignment(
            $assignment->id,
            $user->staff_id,
            $targetStaff->staff_id
        );

        return response()->json([
            'message' => 'Task assigned successfully',
            'assignment' => $assignment->fresh(['assignedToStaff']),
        ]);
    }

    /**
     * Reassign task to a different staff member
     *
     * PUT /api/v1/tasks/{task_id}/stores/{store_id}/assign
     *
     * @param Request $request
     * @param int $taskId
     * @param int $storeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function reassignToStaff(Request $request, $taskId, $storeId)
    {
        $request->validate([
            'staff_id' => 'required|exists:staff,staff_id',
        ]);

        $user = $this->getEffectiveUser($request);
        $assignment = $this->getAssignmentOrFail($taskId, $storeId);

        // Check permission
        if (!$this->canAssignWithinStore($user)) {
            return response()->json([
                'message' => 'Permission denied',
                'error' => 'Only Store Leaders (S4-S2) can reassign tasks.',
            ], 403);
        }

        // Cannot reassign if in final state
        if ($assignment->isFinalState()) {
            return response()->json([
                'message' => 'Invalid status',
                'error' => 'Cannot reassign a task that is already done or unable.',
            ], 422);
        }

        $oldStaffId = $assignment->assigned_to_staff;
        $newStaff = Staff::findOrFail($request->staff_id);

        // Update assignment
        $assignment->update([
            'assigned_to_staff' => $newStaff->staff_id,
            'assigned_to_at' => Carbon::now(),
        ]);

        // Log the action
        TaskExecutionLog::logReassignment(
            $assignment->id,
            $user->staff_id,
            $newStaff->staff_id,
            $oldStaffId
        );

        return response()->json([
            'message' => 'Task reassigned successfully',
            'assignment' => $assignment->fresh(['assignedToStaff']),
        ]);
    }

    /**
     * Unassign task (remove staff assignment, Store Leader will do it)
     *
     * DELETE /api/v1/tasks/{task_id}/stores/{store_id}/assign
     *
     * @param Request $request
     * @param int $taskId
     * @param int $storeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function unassign(Request $request, $taskId, $storeId)
    {
        $user = $this->getEffectiveUser($request);
        $assignment = $this->getAssignmentOrFail($taskId, $storeId);

        // Check permission
        if (!$this->canAssignWithinStore($user)) {
            return response()->json([
                'message' => 'Permission denied',
                'error' => 'Only Store Leaders (S4-S2) can unassign tasks.',
            ], 403);
        }

        // Cannot unassign if in final state
        if ($assignment->isFinalState()) {
            return response()->json([
                'message' => 'Invalid status',
                'error' => 'Cannot unassign a task that is already done or unable.',
            ], 422);
        }

        $previousStaffId = $assignment->assigned_to_staff;

        if (!$previousStaffId) {
            return response()->json([
                'message' => 'No assignment',
                'error' => 'Task is not assigned to any staff.',
            ], 422);
        }

        // Update assignment
        $assignment->update([
            'assigned_to_staff' => null,
            'assigned_to_at' => null,
        ]);

        // Log the action
        TaskExecutionLog::logUnassignment(
            $assignment->id,
            $user->staff_id,
            $previousStaffId
        );

        return response()->json([
            'message' => 'Task unassigned successfully',
            'assignment' => $assignment->fresh(),
        ]);
    }

    /**
     * Start task execution
     *
     * POST /api/v1/tasks/{task_id}/stores/{store_id}/start
     *
     * @param Request $request
     * @param int $taskId
     * @param int $storeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function start(Request $request, $taskId, $storeId)
    {
        $user = $this->getEffectiveUser($request);
        $assignment = $this->getAssignmentOrFail($taskId, $storeId);

        // Check permission
        if (!$this->canExecuteTask($user, $assignment)) {
            return response()->json([
                'message' => 'Permission denied',
                'error' => 'You do not have permission to start this task.',
            ], 403);
        }

        // Must be in not_yet status
        if (!$assignment->isNotYet()) {
            return response()->json([
                'message' => 'Invalid status',
                'error' => 'Only tasks with status "not_yet" can be started.',
            ], 422);
        }

        $oldStatus = $assignment->status;

        // Update assignment
        $assignment->update([
            'status' => TaskStoreAssignment::STATUS_ON_PROGRESS,
            'started_at' => Carbon::now(),
            'started_by' => $user->staff_id,
        ]);

        // Log the action
        TaskExecutionLog::logStatusChange(
            $assignment->id,
            TaskExecutionLog::ACTION_STARTED,
            $user->staff_id,
            $oldStatus,
            TaskStoreAssignment::STATUS_ON_PROGRESS
        );

        return response()->json([
            'message' => 'Task started',
            'assignment' => $assignment->fresh(['startedBy']),
        ]);
    }

    /**
     * Complete task execution (submit for HQ check)
     *
     * POST /api/v1/tasks/{task_id}/stores/{store_id}/complete
     *
     * @param Request $request
     * @param int $taskId
     * @param int $storeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function complete(Request $request, $taskId, $storeId)
    {
        $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        $user = $this->getEffectiveUser($request);
        $assignment = $this->getAssignmentOrFail($taskId, $storeId);

        // Check permission
        if (!$this->canExecuteTask($user, $assignment)) {
            return response()->json([
                'message' => 'Permission denied',
                'error' => 'You do not have permission to complete this task.',
            ], 403);
        }

        // Must be in on_progress status
        if (!$assignment->isOnProgress()) {
            return response()->json([
                'message' => 'Invalid status',
                'error' => 'Only tasks with status "on_progress" can be completed.',
            ], 422);
        }

        $oldStatus = $assignment->status;

        // Update assignment - goes to done_pending (waiting for HQ check)
        $assignment->update([
            'status' => TaskStoreAssignment::STATUS_DONE_PENDING,
            'completed_at' => Carbon::now(),
            'completed_by' => $user->staff_id,
            'notes' => $request->input('notes'),
        ]);

        // Log the action
        TaskExecutionLog::logStatusChange(
            $assignment->id,
            TaskExecutionLog::ACTION_COMPLETED,
            $user->staff_id,
            $oldStatus,
            TaskStoreAssignment::STATUS_DONE_PENDING
        );

        return response()->json([
            'message' => 'Task submitted for HQ check',
            'assignment' => $assignment->fresh(['completedBy']),
        ]);
    }

    /**
     * Mark task as unable to complete
     *
     * POST /api/v1/tasks/{task_id}/stores/{store_id}/unable
     *
     * @param Request $request
     * @param int $taskId
     * @param int $storeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function markUnable(Request $request, $taskId, $storeId)
    {
        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $user = $this->getEffectiveUser($request);
        $assignment = $this->getAssignmentOrFail($taskId, $storeId);

        // Check permission
        if (!$this->canExecuteTask($user, $assignment)) {
            return response()->json([
                'message' => 'Permission denied',
                'error' => 'You do not have permission to mark this task as unable.',
            ], 403);
        }

        // Can be marked unable from not_yet or on_progress
        if ($assignment->isFinalState() || $assignment->isDonePending()) {
            return response()->json([
                'message' => 'Invalid status',
                'error' => 'Cannot mark as unable. Task must be in "not_yet" or "on_progress" status.',
            ], 422);
        }

        $oldStatus = $assignment->status;

        // Update assignment
        $assignment->update([
            'status' => TaskStoreAssignment::STATUS_UNABLE,
            'completed_at' => Carbon::now(),
            'completed_by' => $user->staff_id,
            'unable_reason' => $request->input('reason'),
        ]);

        // Log the action
        TaskExecutionLog::logStatusChange(
            $assignment->id,
            TaskExecutionLog::ACTION_MARKED_UNABLE,
            $user->staff_id,
            $oldStatus,
            TaskStoreAssignment::STATUS_UNABLE,
            $request->input('reason')
        );

        return response()->json([
            'message' => 'Task marked as unable',
            'assignment' => $assignment->fresh(['completedBy']),
        ]);
    }

    /**
     * HQ Check: Confirm task completion
     *
     * POST /api/v1/tasks/{task_id}/stores/{store_id}/check
     *
     * @param Request $request
     * @param int $taskId
     * @param int $storeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function hqCheck(Request $request, $taskId, $storeId)
    {
        $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        $user = $this->getEffectiveUser($request);
        $assignment = $this->getAssignmentOrFail($taskId, $storeId);

        // Check permission: Only HQ users can check
        if (!$this->isHQUser($user)) {
            return response()->json([
                'message' => 'Permission denied',
                'error' => 'Only HQ users can verify task completion.',
            ], 403);
        }

        // Must be in done_pending status
        if (!$assignment->isDonePending()) {
            return response()->json([
                'message' => 'Invalid status',
                'error' => 'Only tasks with status "done_pending" can be verified.',
            ], 422);
        }

        $oldStatus = $assignment->status;

        // Update assignment - confirmed done
        $assignment->update([
            'status' => TaskStoreAssignment::STATUS_DONE,
            'checked_by' => $user->staff_id,
            'checked_at' => Carbon::now(),
            'check_notes' => $request->input('notes'),
        ]);

        // Log the action
        TaskExecutionLog::logStatusChange(
            $assignment->id,
            TaskExecutionLog::ACTION_HQ_CHECKED,
            $user->staff_id,
            $oldStatus,
            TaskStoreAssignment::STATUS_DONE,
            $request->input('notes')
        );

        return response()->json([
            'message' => 'Task completion confirmed',
            'assignment' => $assignment->fresh(['checkedBy']),
        ]);
    }

    /**
     * HQ Reject: Send back to on_progress
     *
     * POST /api/v1/tasks/{task_id}/stores/{store_id}/reject
     *
     * @param Request $request
     * @param int $taskId
     * @param int $storeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function hqReject(Request $request, $taskId, $storeId)
    {
        $request->validate([
            'notes' => 'required|string|max:1000',
        ]);

        $user = $this->getEffectiveUser($request);
        $assignment = $this->getAssignmentOrFail($taskId, $storeId);

        // Check permission: Only HQ users can reject
        if (!$this->isHQUser($user)) {
            return response()->json([
                'message' => 'Permission denied',
                'error' => 'Only HQ users can reject task completion.',
            ], 403);
        }

        // Must be in done_pending status
        if (!$assignment->isDonePending()) {
            return response()->json([
                'message' => 'Invalid status',
                'error' => 'Only tasks with status "done_pending" can be rejected.',
            ], 422);
        }

        $oldStatus = $assignment->status;

        // Update assignment - back to on_progress
        $assignment->update([
            'status' => TaskStoreAssignment::STATUS_ON_PROGRESS,
            'check_notes' => $request->input('notes'),
        ]);

        // Log the action
        TaskExecutionLog::logStatusChange(
            $assignment->id,
            TaskExecutionLog::ACTION_HQ_REJECTED,
            $user->staff_id,
            $oldStatus,
            TaskStoreAssignment::STATUS_ON_PROGRESS,
            $request->input('notes')
        );

        return response()->json([
            'message' => 'Task rejected, sent back to store',
            'assignment' => $assignment->fresh(),
        ]);
    }

    /**
     * Get task progress for all stores
     *
     * GET /api/v1/tasks/{task_id}/progress
     *
     * @param int $taskId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTaskProgress($taskId)
    {
        $task = Task::findOrFail($taskId);

        $assignments = TaskStoreAssignment::with(['store.area.zone.region', 'assignedToStaff', 'completedBy'])
            ->where('task_id', $taskId)
            ->orderBy('store_id')
            ->get();

        $progress = $task->getStoreProgress();
        $calculatedStatus = $task->getCalculatedStatus();

        // Calculate average execution time
        $completedAssignments = $assignments->filter(fn($a) => $a->status === TaskStoreAssignment::STATUS_DONE);
        $avgExecutionTime = null;

        if ($completedAssignments->count() > 0) {
            $totalMinutes = $completedAssignments->sum(function ($a) {
                if ($a->started_at && $a->completed_at) {
                    return $a->started_at->diffInMinutes($a->completed_at);
                }
                return 0;
            });
            $avgExecutionTime = round($totalMinutes / $completedAssignments->count());
        }

        return response()->json([
            'task_id' => $taskId,
            'task_name' => $task->task_name,
            'calculated_status' => $calculatedStatus,
            'progress' => $progress,
            'avg_execution_time_minutes' => $avgExecutionTime,
            'assignments' => $assignments->map(function ($a) {
                $executionTime = null;
                if ($a->started_at && $a->completed_at) {
                    $executionTime = $a->started_at->diffInMinutes($a->completed_at);
                }

                // Get geographic hierarchy
                $area = $a->store?->area;
                $zone = $area?->zone;
                $region = $zone?->region;

                return [
                    'id' => $a->id,
                    'store_id' => $a->store_id,
                    'store_name' => $a->store?->store_name,
                    'region_name' => $region?->region_name,
                    'zone_name' => $zone?->zone_name,
                    'area_name' => $area?->area_name,
                    'status' => $a->status,
                    'assigned_to_staff' => $a->assignedToStaff ? [
                        'id' => $a->assignedToStaff->staff_id,
                        'name' => $a->assignedToStaff->first_name . ' ' . $a->assignedToStaff->last_name,
                    ] : null,
                    'started_at' => $a->started_at,
                    'completed_at' => $a->completed_at,
                    'completed_by' => $a->completedBy ? [
                        'id' => $a->completedBy->staff_id,
                        'name' => $a->completedBy->first_name . ' ' . $a->completedBy->last_name,
                    ] : null,
                    'execution_time_minutes' => $executionTime,
                    'unable_reason' => $a->unable_reason,
                ];
            }),
        ]);
    }

    // ============================================
    // Helper Methods
    // ============================================

    /**
     * Get assignment or fail with 404
     */
    private function getAssignmentOrFail($taskId, $storeId): TaskStoreAssignment
    {
        return TaskStoreAssignment::where('task_id', $taskId)
            ->where('store_id', $storeId)
            ->firstOrFail();
    }

    /**
     * Check if user is a Store Leader (S4-S2) and can assign within store
     */
    private function canAssignWithinStore($user): bool
    {
        if (!$user) {
            return false;
        }

        // S2 (Deputy), S3 (Store Leader), S4 (SI)
        $storeLeaderGrades = ['S2', 'S3', 'S4'];
        return in_array($user->job_grade, $storeLeaderGrades);
    }

    /**
     * Check if user can execute this task (start, complete, mark unable)
     */
    private function canExecuteTask($user, TaskStoreAssignment $assignment): bool
    {
        if (!$user) {
            return false;
        }

        // S2-S4 (Store Leaders) can always execute
        if ($this->canAssignWithinStore($user)) {
            return true;
        }

        // S1 (Staff) can only execute if assigned to them
        if ($user->job_grade === 'S1') {
            return $assignment->assigned_to_staff === $user->staff_id;
        }

        return false;
    }

    /**
     * Check if user is HQ user (G2-G9)
     */
    private function isHQUser($user): bool
    {
        if (!$user) {
            return false;
        }

        $hqGrades = ['G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9'];
        return in_array($user->job_grade, $hqGrades);
    }
}
