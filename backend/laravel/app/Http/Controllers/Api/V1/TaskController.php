<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Staff;
use App\Models\CodeMaster;
use App\Events\TaskUpdated;
use App\Traits\HasJobGradePermissions;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Carbon\Carbon;

class TaskController extends Controller
{
    use HasJobGradePermissions;

    /**
     * Status IDs from code_master table
     */
    const DRAFT_STATUS_ID = 12;
    const APPROVE_STATUS_ID = 13;      // Pending approval
    const APPROVED_STATUS_ID = 14;     // Approved
    const REJECTED_STATUS_ID = 15;     // Rejected (transitions back to draft)

    /**
     * Maximum number of drafts allowed per HQ user
     */
    const MAX_DRAFTS_PER_USER = 5;

    /**
     * Get all tasks (only parent tasks level 1, with nested sub_tasks)
     */
    public function index(Request $request)
    {
        $query = Task::query();

        // Apply job grade permission filter
        $query = $this->applyJobGradeFilter($query, $request);

        // Only get parent tasks (level 1) - sub-tasks will be nested
        $query->where(function ($q) {
            $q->whereNull('parent_task_id')
              ->orWhere('task_level', 1);
        });

        // Get effective user for DRAFT filtering
        $effectiveUser = $this->getEffectiveUser($request);
        $effectiveStaffId = $effectiveUser ? $effectiveUser->staff_id : null;

        // DRAFT ownership filter: Only show DRAFT tasks to their creator
        // This ensures pagination accuracy (server returns only tasks user can see)
        if ($effectiveStaffId) {
            $query->where(function ($q) use ($effectiveStaffId) {
                // Show: non-DRAFT tasks OR DRAFT tasks created by current user
                $q->where('status_id', '!=', self::DRAFT_STATUS_ID)
                  ->orWhere(function ($subQ) use ($effectiveStaffId) {
                      $subQ->where('status_id', self::DRAFT_STATUS_ID)
                           ->where('created_staff_id', $effectiveStaffId);
                  });
            });
        } else {
            // No authenticated user: exclude all DRAFT tasks
            $query->where('status_id', '!=', self::DRAFT_STATUS_ID);
        }

        $tasks = QueryBuilder::for($query)
            ->allowedFilters([
                AllowedFilter::exact('assigned_store_id'),
                AllowedFilter::exact('dept_id'),
                AllowedFilter::exact('assigned_staff_id'),
                AllowedFilter::exact('created_staff_id'),
                AllowedFilter::exact('status_id'),
                AllowedFilter::exact('priority'),
                AllowedFilter::partial('task_name'),
                // Date range filters - also include tasks with NULL dates (drafts)
                AllowedFilter::callback('start_date_from', fn ($query, $value) => $query->where(function ($q) use ($value) {
                    $q->where('start_date', '>=', $value)->orWhereNull('start_date');
                })),
                AllowedFilter::callback('start_date_to', fn ($query, $value) => $query->where(function ($q) use ($value) {
                    $q->where('start_date', '<=', $value)->orWhereNull('start_date');
                })),
                AllowedFilter::callback('end_date_from', fn ($query, $value) => $query->where(function ($q) use ($value) {
                    $q->where('end_date', '>=', $value)->orWhereNull('end_date');
                })),
                AllowedFilter::callback('end_date_to', fn ($query, $value) => $query->where(function ($q) use ($value) {
                    $q->where('end_date', '<=', $value)->orWhereNull('end_date');
                })),
            ])
            ->allowedSorts(['task_id', 'task_name', 'end_date', 'start_date', 'created_at'])
            ->allowedIncludes(['assignedStaff', 'createdBy', 'assignedStore', 'department', 'taskType', 'responseType', 'status'])
            ->paginate($request->get('per_page', 20));

        // Convert to array and add sub_tasks + draft_info
        $response = $tasks->toArray();

        // Add nested sub_tasks for each parent task
        $response['data'] = array_map(function ($task) {
            return $this->addNestedSubTasks($task);
        }, $response['data']);

        // Include draft_info in response (only for authenticated HQ users)
        if ($effectiveStaffId) {
            $permissionService = app(\App\Services\JobGradePermissionService::class);
            if ($permissionService->canCreateTask($effectiveUser)) {
                $response['draft_info'] = $this->buildDraftInfo($effectiveStaffId);
            }
        }

        return response()->json($response);
    }

    /**
     * Get single task (with nested sub_tasks for parent tasks)
     */
    public function show($id)
    {
        $task = Task::with([
            'assignedStaff', 'createdBy', 'assignedStore', 'department',
            'taskType', 'responseType', 'status', 'manual', 'checklists'
        ])->findOrFail($id);

        // Convert to array and add nested sub_tasks
        $taskArray = $task->toArray();
        $taskArray = $this->addNestedSubTasks($taskArray);

        return response()->json($taskArray);
    }

    /**
     * Create new task
     *
     * Permission: Only HQ users (G2-G9) can create tasks.
     * Store users (S1-S7) are not allowed to create tasks.
     */
    public function store(Request $request)
    {
        // Get effective user (may be switched user in testing mode via X-Switch-User-Id header)
        $user = $this->getEffectiveUser($request);

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
                'error' => 'User not authenticated',
            ], 401);
        }

        // Permission check: Only HQ users (G2-G9) can create tasks
        $permissionService = app(\App\Services\JobGradePermissionService::class);
        if (!$permissionService->canCreateTask($user)) {
            return response()->json([
                'message' => 'Permission denied',
                'error' => 'Only HQ users (G2-G9) can create tasks. Store users are not allowed to create tasks.',
                'user_job_grade' => $user->job_grade,
                'allowed_grades' => $permissionService->getTaskCreationGrades(),
            ], 403);
        }

        $request->validate([
            'task_name' => 'required|string|max:500',
            'task_description' => 'nullable|string',
            'task_type_id' => 'nullable|exists:code_master,code_master_id',
            'response_type_id' => 'nullable|exists:code_master,code_master_id',
            'status_id' => 'nullable|exists:code_master,code_master_id',
            'assigned_staff_id' => 'nullable|exists:staff,staff_id',
            'assigned_store_id' => 'nullable|exists:stores,store_id',
            'dept_id' => 'nullable|exists:departments,department_id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'priority' => 'nullable|string|in:low,normal,high,urgent',
            'source' => 'nullable|string|in:task_list,library,todo_task',
            'receiver_type' => 'nullable|string|in:store,hq_user',
            // Task hierarchy fields
            'parent_task_id' => 'nullable|exists:tasks,task_id',
            'task_level' => 'nullable|integer|min:1|max:5',
            // Nested sub-tasks (recursive)
            'sub_tasks' => 'nullable|array',
            'sub_tasks.*.task_name' => 'required|string|max:500',
            'sub_tasks.*.task_level' => 'nullable|integer|min:2|max:5',
        ]);

        $statusId = $request->input('status_id', self::DRAFT_STATUS_ID);
        $source = $request->input('source', Task::SOURCE_TASK_LIST);

        // Check draft limit if creating as DRAFT (limit is per source)
        if ($statusId == self::DRAFT_STATUS_ID) {
            $draftLimitCheck = $this->checkDraftLimit($user->staff_id, $source);
            if (!$draftLimitCheck['allowed']) {
                return response()->json([
                    'message' => 'Draft limit exceeded',
                    'error' => $draftLimitCheck['message'],
                    'current_drafts' => $draftLimitCheck['current_count'],
                    'max_drafts' => self::MAX_DRAFTS_PER_USER,
                    'source' => $source,
                ], 422);
            }
        }

        // Prepare task data (exclude sub_tasks from direct creation)
        $taskData = $request->except(['sub_tasks']);
        $taskData['created_staff_id'] = $user->staff_id;
        $taskData['source'] = $source;
        $taskData['task_level'] = $request->input('task_level', 1);

        $task = Task::create($taskData);

        // Create nested sub-tasks recursively if provided
        $subTasks = $request->input('sub_tasks', []);
        \Log::info('Creating task with sub_tasks', [
            'parent_task_id' => $task->task_id,
            'sub_tasks_count' => count($subTasks),
            'sub_tasks_data' => $subTasks,
        ]);
        if (!empty($subTasks)) {
            $this->createSubTasksRecursively($task, $subTasks, $user->staff_id, $source, $statusId);
        }

        // Load sub_tasks for response
        $task = $this->addNestedSubTasks($task->toArray());

        // Broadcast task created event
        broadcast(new TaskUpdated(Task::find($task['task_id']), 'created'))->toOthers();

        return response()->json($task, 201);
    }

    /**
     * Create sub-tasks recursively (max 5 levels)
     */
    private function createSubTasksRecursively(Task $parentTask, array $subTasks, int $createdStaffId, string $source, int $statusId): void
    {
        foreach ($subTasks as $subTaskData) {
            $level = $subTaskData['task_level'] ?? ($parentTask->task_level + 1);

            // Validate max level (5)
            if ($level > 5) {
                continue;
            }

            // Extract nested sub_tasks before creating
            $nestedSubTasks = $subTaskData['sub_tasks'] ?? [];
            unset($subTaskData['sub_tasks']);

            // Create sub-task
            $subTask = Task::create(array_merge($subTaskData, [
                'parent_task_id' => $parentTask->task_id,
                'task_level' => $level,
                'created_staff_id' => $createdStaffId,
                'source' => $source,
                'status_id' => $statusId,
            ]));

            // Recursively create nested sub-tasks if level < 5
            if (!empty($nestedSubTasks) && $level < 5) {
                $this->createSubTasksRecursively($subTask, $nestedSubTasks, $createdStaffId, $source, $statusId);
            }
        }
    }

    /**
     * Update task
     */
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $request->validate([
            'task_name' => 'nullable|string|max:500',
            'task_description' => 'nullable|string',
            'task_type_id' => 'nullable|exists:code_master,code_master_id',
            'response_type_id' => 'nullable|exists:code_master,code_master_id',
            'status_id' => 'nullable|exists:code_master,code_master_id',
            'assigned_staff_id' => 'nullable|exists:staff,staff_id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'priority' => 'nullable|string|in:low,normal,high,urgent',
            // Nested sub-tasks validation
            'sub_tasks' => 'nullable|array',
            'sub_tasks.*.task_name' => 'required|string|max:500',
            'sub_tasks.*.task_level' => 'nullable|integer|min:2|max:5',
        ]);

        // Get effective user (may be switched user in testing mode)
        $user = $this->getEffectiveUser($request);
        $newStatusId = $request->input('status_id');
        $source = $task->source ?? Task::SOURCE_TASK_LIST;

        // Check draft limit if changing status TO DRAFT (and it wasn't already DRAFT)
        if ($newStatusId == self::DRAFT_STATUS_ID && $task->status_id != self::DRAFT_STATUS_ID) {
            $draftLimitCheck = $this->checkDraftLimit($user->staff_id, $source);
            if (!$draftLimitCheck['allowed']) {
                return response()->json([
                    'message' => 'Draft limit exceeded',
                    'error' => $draftLimitCheck['message'],
                    'current_drafts' => $draftLimitCheck['current_count'],
                    'max_drafts' => self::MAX_DRAFTS_PER_USER,
                    'source' => $source,
                ], 422);
            }
        }

        // Exclude sub_tasks from update data (will handle separately)
        $updateData = $request->except(['sub_tasks']);

        // If task was rejected and user is editing, set has_changes_since_rejection flag
        if ($task->rejection_count > 0 && $task->status_id == self::DRAFT_STATUS_ID) {
            $updateData['has_changes_since_rejection'] = true;
        }

        $task->update($updateData);

        // Handle sub_tasks update (sync: delete old, create new)
        $subTasks = $request->input('sub_tasks', []);
        \Log::info('Updating task with sub_tasks', [
            'task_id' => $task->task_id,
            'sub_tasks_count' => count($subTasks),
            'sub_tasks_data' => $subTasks,
        ]);

        // Only process sub_tasks if the field was explicitly sent (even if empty array)
        if ($request->has('sub_tasks')) {
            // Delete all existing sub-tasks for this parent task (recursive delete)
            $this->deleteSubTasksRecursively($task->task_id);

            // Create new sub-tasks if provided
            if (!empty($subTasks)) {
                $statusId = $task->status_id;
                $createdStaffId = $user ? $user->staff_id : $task->created_staff_id;
                $this->createSubTasksRecursively($task, $subTasks, $createdStaffId, $source, $statusId);
            }
        }

        // Broadcast task updated event
        broadcast(new TaskUpdated($task, 'updated'))->toOthers();

        // Return task with nested sub_tasks
        $taskArray = $task->fresh()->toArray();
        $taskArray = $this->addNestedSubTasks($taskArray);

        return response()->json($taskArray);
    }

    /**
     * Delete sub-tasks recursively (for sync update)
     */
    private function deleteSubTasksRecursively(int $parentTaskId): void
    {
        $children = Task::where('parent_task_id', $parentTaskId)->get();

        foreach ($children as $child) {
            // First delete grandchildren recursively
            $this->deleteSubTasksRecursively($child->task_id);
            // Then delete this child
            $child->delete();
        }
    }

    /**
     * Update task status
     */
    public function updateStatus(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $request->validate([
            'status_id' => 'required|exists:code_master,code_master_id',
        ]);

        // Get effective user (may be switched user in testing mode)
        $user = $this->getEffectiveUser($request);
        $newStatusId = $request->status_id;

        // Check draft limit if changing status TO DRAFT (and it wasn't already DRAFT)
        if ($newStatusId == self::DRAFT_STATUS_ID && $task->status_id != self::DRAFT_STATUS_ID) {
            $draftLimitCheck = $this->checkDraftLimit($user->staff_id);
            if (!$draftLimitCheck['allowed']) {
                return response()->json([
                    'message' => 'Draft limit exceeded',
                    'error' => $draftLimitCheck['message'],
                    'current_drafts' => $draftLimitCheck['current_count'],
                    'max_drafts' => self::MAX_DRAFTS_PER_USER,
                ], 422);
            }
        }

        $task->update(['status_id' => $newStatusId]);

        // Broadcast status changed event
        broadcast(new TaskUpdated($task, 'status_changed'))->toOthers();

        return response()->json($task);
    }

    /**
     * Delete task
     */
    public function destroy($id)
    {
        $task = Task::findOrFail($id);

        // Broadcast before delete
        broadcast(new TaskUpdated($task, 'deleted'))->toOthers();

        $task->delete();

        return response()->json(null, 204);
    }

    /**
     * Get task checklists
     */
    public function getChecklists($id)
    {
        $task = Task::with('checklists')->findOrFail($id);

        return response()->json($task->checklists);
    }

    /**
     * Get code master entries
     *
     * @queryParam type string Filter by code_type (status, task_type, response_type)
     * @queryParam is_active string Filter by active status: "true" (default), "false", or "all"
     */
    public function getCodeMaster(Request $request)
    {
        $type = $request->get('type');

        $query = CodeMaster::orderBy('sort_order');

        // Apply is_active filter (default: only active)
        $isActive = $request->query('is_active', 'true');

        if ($isActive === 'true') {
            $query->where('is_active', true);
        } elseif ($isActive === 'false') {
            $query->where('is_active', false);
        }
        // If 'all', no filter applied

        if ($type) {
            $query->where('code_type', $type);
        }

        return response()->json($query->get());
    }

    /**
     * Add nested sub_tasks to a task array (recursive, max 5 levels)
     *
     * @param array $task Task array
     * @return array Task with sub_tasks
     */
    private function addNestedSubTasks(array $task): array
    {
        $taskId = $task['task_id'];

        // Get direct children
        $children = Task::where('parent_task_id', $taskId)
            ->with(['assignedStaff', 'status'])
            ->orderBy('task_id')
            ->get()
            ->toArray();

        // Recursively add sub_tasks for each child (max 5 levels enforced by task_level)
        $task['sub_tasks'] = array_map(function ($child) {
            // Only recurse if not at max depth
            if (($child['task_level'] ?? 1) < 5) {
                return $this->addNestedSubTasks($child);
            }
            $child['sub_tasks'] = [];
            return $child;
        }, $children);

        return $task;
    }

    /**
     * Build draft info array for a user (reusable helper)
     *
     * @param int $staffId
     * @return array
     */
    private function buildDraftInfo(int $staffId): array
    {
        // Get counts per source (including pending approval tasks)
        $sources = [Task::SOURCE_TASK_LIST, Task::SOURCE_LIBRARY, Task::SOURCE_TODO_TASK];
        $bySource = [];

        foreach ($sources as $source) {
            $count = Task::whereIn('status_id', [self::DRAFT_STATUS_ID, self::APPROVE_STATUS_ID])
                ->where('created_staff_id', $staffId)
                ->where('source', $source)
                ->count();

            $bySource[$source] = [
                'current_drafts' => $count,
                'max_drafts' => self::MAX_DRAFTS_PER_USER,
                'remaining_drafts' => max(0, self::MAX_DRAFTS_PER_USER - $count),
                'can_create_draft' => $count < self::MAX_DRAFTS_PER_USER,
            ];
        }

        // Total across all sources
        $totalDrafts = array_sum(array_column($bySource, 'current_drafts'));

        // Also include expiring drafts (25-30 days old)
        $expiringDrafts = $this->getExpiringDraftsForUser($staffId);

        return [
            'total_drafts' => $totalDrafts,
            'max_drafts_per_source' => self::MAX_DRAFTS_PER_USER,
            'by_source' => $bySource,
            'expiring_drafts' => $expiringDrafts,
        ];
    }

    /**
     * Get current user's draft count and limit info per source
     * @deprecated Use getTasks() which now includes draft_info in response
     */
    public function getDraftInfo(Request $request)
    {
        // Get effective user (may be switched user in testing mode)
        $user = $this->getEffectiveUser($request);
        $staffId = $user->staff_id;

        return response()->json($this->buildDraftInfo($staffId));
    }

    /**
     * Get drafts that will expire in 1-5 days for a user
     *
     * @param int $staffId
     * @return array
     */
    private function getExpiringDraftsForUser(int $staffId): array
    {
        $staleDays = 30;
        $warningDays = 5;

        // Find drafts that will expire in 1-5 days
        $warningStartDate = now()->subDays($staleDays - $warningDays); // 25 days old
        $warningEndDate = now()->subDays($staleDays - 1); // 29 days old

        $expiringDrafts = Task::where('status_id', self::DRAFT_STATUS_ID)
            ->where('created_staff_id', $staffId)
            ->whereBetween('updated_at', [$warningEndDate, $warningStartDate])
            ->get()
            ->map(function ($task) use ($staleDays) {
                $daysUntilDeletion = $staleDays - now()->diffInDays($task->updated_at);
                return [
                    'task_id' => $task->task_id,
                    'task_name' => $task->task_name,
                    'source' => $task->source,
                    'last_modified' => $task->updated_at->toIso8601String(),
                    'days_until_deletion' => $daysUntilDeletion,
                ];
            })
            ->toArray();

        return $expiringDrafts;
    }

    /**
     * Check if user can create more drafts for a specific source
     *
     * @param int $staffId
     * @param string $source - task_list, library, or todo_task
     * @return array
     */
    private function checkDraftLimit(int $staffId, string $source = Task::SOURCE_TASK_LIST): array
    {
        // Count drafts AND pending approval tasks (both count toward limit)
        $currentDraftCount = Task::whereIn('status_id', [self::DRAFT_STATUS_ID, self::APPROVE_STATUS_ID])
            ->where('created_staff_id', $staffId)
            ->where('source', $source)
            ->count();

        $sourceLabel = $this->getSourceLabel($source);

        if ($currentDraftCount >= self::MAX_DRAFTS_PER_USER) {
            return [
                'allowed' => false,
                'current_count' => $currentDraftCount,
                'message' => "You have reached the maximum limit of " . self::MAX_DRAFTS_PER_USER . " drafts for {$sourceLabel}. Please complete or delete existing drafts before creating new ones.",
            ];
        }

        return [
            'allowed' => true,
            'current_count' => $currentDraftCount,
            'message' => null,
        ];
    }

    /**
     * Get human-readable label for source
     */
    private function getSourceLabel(string $source): string
    {
        return match ($source) {
            Task::SOURCE_TASK_LIST => 'Task List',
            Task::SOURCE_LIBRARY => 'Library Tasks',
            Task::SOURCE_TODO_TASK => 'To Do Tasks',
            default => 'Tasks',
        };
    }

    /**
     * Find the appropriate approver for a task based on creator's hierarchy
     *
     * @param Staff $creator
     * @return Staff|null
     */
    private function findApprover(Staff $creator): ?Staff
    {
        // First, try to find direct line manager
        if ($creator->line_manager_id) {
            return Staff::find($creator->line_manager_id);
        }

        // If no line manager, find someone with higher job grade in same team/department
        $jobGrade = $creator->job_grade;

        // Try same team first
        if ($creator->team_id) {
            $approver = Staff::where('team_id', $creator->team_id)
                ->where('job_grade', '>', $jobGrade)
                ->orderBy('job_grade', 'asc')
                ->first();

            if ($approver) {
                return $approver;
            }
        }

        // Try same department
        if ($creator->department_id) {
            $approver = Staff::where('department_id', $creator->department_id)
                ->where('job_grade', '>', $jobGrade)
                ->orderBy('job_grade', 'asc')
                ->first();

            if ($approver) {
                return $approver;
            }
        }

        // Fallback: find any staff with higher grade (system admin level)
        return Staff::where('job_grade', '>', $jobGrade)
            ->orderBy('job_grade', 'asc')
            ->first();
    }

    /**
     * Submit task for approval
     *
     * POST /api/v1/tasks/{id}/submit
     */
    public function submit(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        // Get effective user (may be switched user in testing mode)
        $user = $this->getEffectiveUser($request);

        // Only creator can submit
        if ($task->created_staff_id !== $user->staff_id) {
            return response()->json([
                'message' => 'Unauthorized',
                'error' => 'Only the task creator can submit for approval.',
            ], 403);
        }

        // Must be in DRAFT status
        if ($task->status_id !== self::DRAFT_STATUS_ID) {
            return response()->json([
                'message' => 'Invalid status',
                'error' => 'Only draft tasks can be submitted for approval.',
            ], 422);
        }

        // Check if max rejections reached
        if ($task->isMaxRejectionsReached()) {
            return response()->json([
                'message' => 'Maximum rejections reached',
                'error' => 'This task has been rejected ' . Task::MAX_REJECTIONS . ' times and cannot be resubmitted. Please delete and create a new task.',
            ], 422);
        }

        // If task was previously rejected, must have changes
        if ($task->rejection_count > 0 && !$task->has_changes_since_rejection) {
            return response()->json([
                'message' => 'Changes required',
                'error' => 'Please make changes to the task before resubmitting.',
            ], 422);
        }

        // Find approver
        $creator = Staff::find($user->staff_id);
        $approver = $this->findApprover($creator);

        if (!$approver) {
            return response()->json([
                'message' => 'No approver found',
                'error' => 'Could not find an appropriate approver for this task.',
            ], 422);
        }

        // Update task
        $task->update([
            'status_id' => self::APPROVE_STATUS_ID,
            'approver_id' => $approver->staff_id,
            'submitted_at' => Carbon::now(),
            'has_changes_since_rejection' => false,
        ]);

        // Broadcast event
        broadcast(new TaskUpdated($task, 'submitted'))->toOthers();

        return response()->json([
            'message' => 'Task submitted for approval',
            'task' => $task->fresh(['approver']),
            'approver' => [
                'id' => $approver->staff_id,
                'name' => $approver->first_name . ' ' . $approver->last_name,
            ],
        ]);
    }

    /**
     * Approve a task
     *
     * POST /api/v1/tasks/{id}/approve
     */
    public function approve(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        // Get effective user (may be switched user in testing mode)
        $user = $this->getEffectiveUser($request);

        // Only assigned approver can approve
        if ($task->approver_id !== $user->staff_id) {
            return response()->json([
                'message' => 'Unauthorized',
                'error' => 'Only the assigned approver can approve this task.',
            ], 403);
        }

        // Must be in APPROVE status (pending approval)
        if ($task->status_id !== self::APPROVE_STATUS_ID) {
            return response()->json([
                'message' => 'Invalid status',
                'error' => 'Only tasks pending approval can be approved.',
            ], 422);
        }

        $request->validate([
            'comment' => 'nullable|string|max:1000',
        ]);

        // Update task
        $task->update([
            'status_id' => self::APPROVED_STATUS_ID,
            'approved_at' => Carbon::now(),
            'comment' => $request->input('comment'),
        ]);

        // Broadcast event
        broadcast(new TaskUpdated($task, 'approved'))->toOthers();

        return response()->json([
            'message' => 'Task approved successfully',
            'task' => $task->fresh(),
        ]);
    }

    /**
     * Reject a task
     *
     * POST /api/v1/tasks/{id}/reject
     */
    public function reject(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        // Get effective user (may be switched user in testing mode)
        $user = $this->getEffectiveUser($request);

        // Only assigned approver can reject
        if ($task->approver_id !== $user->staff_id) {
            return response()->json([
                'message' => 'Unauthorized',
                'error' => 'Only the assigned approver can reject this task.',
            ], 403);
        }

        // Must be in APPROVE status (pending approval)
        if ($task->status_id !== self::APPROVE_STATUS_ID) {
            return response()->json([
                'message' => 'Invalid status',
                'error' => 'Only tasks pending approval can be rejected.',
            ], 422);
        }

        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $newRejectionCount = $task->rejection_count + 1;

        // Update task - back to DRAFT status
        $task->update([
            'status_id' => self::DRAFT_STATUS_ID,
            'rejection_count' => $newRejectionCount,
            'has_changes_since_rejection' => false,
            'last_rejection_reason' => $request->input('reason'),
            'last_rejected_at' => Carbon::now(),
            'last_rejected_by' => $user->staff_id,
        ]);

        // Broadcast event
        broadcast(new TaskUpdated($task, 'rejected'))->toOthers();

        $canResubmit = $newRejectionCount < Task::MAX_REJECTIONS;

        return response()->json([
            'message' => 'Task rejected',
            'task' => $task->fresh(['lastRejectedBy']),
            'rejection_count' => $newRejectionCount,
            'can_resubmit' => $canResubmit,
            'message_for_creator' => $canResubmit
                ? 'Please review the feedback and make changes before resubmitting.'
                : 'Maximum rejection limit reached. This task can only be deleted.',
        ]);
    }

    /**
     * Get tasks pending approval for current user
     *
     * GET /api/v1/tasks/pending-approval
     */
    public function pendingApproval(Request $request)
    {
        // Get effective user (may be switched user in testing mode)
        $user = $this->getEffectiveUser($request);

        $tasks = Task::where('approver_id', $user->staff_id)
            ->where('status_id', self::APPROVE_STATUS_ID)
            ->with(['createdBy', 'department', 'taskType', 'status'])
            ->orderBy('submitted_at', 'asc')
            ->paginate($request->get('per_page', 20));

        return response()->json($tasks);
    }
}
