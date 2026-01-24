<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Staff;
use App\Models\CodeMaster;
use App\Models\TaskStoreAssignment;
use App\Models\TaskApprovalHistory;
use App\Events\TaskUpdated;
use App\Http\Resources\TaskApprovalHistoryResource;
use App\Http\Resources\TaskListResource;
use App\Http\Resources\TaskDetailResource;
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
    const NOT_YET_STATUS_ID = 7;       // Task dispatched, not started
    const ON_PROGRESS_STATUS_ID = 8;   // Task in progress
    const DONE_STATUS_ID = 9;          // Task completed
    const OVERDUE_STATUS_ID = 10;      // Task overdue
    const REJECT_STATUS_ID = 11;       // Rejected (not used directly, tasks go back to DRAFT)
    const DRAFT_STATUS_ID = 12;        // Draft status
    const APPROVE_STATUS_ID = 13;      // Pending approval

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

        // Store users (S1-S6) should NOT see DRAFT or APPROVE tasks
        // These tasks have no store assigned yet and Store users can't take action on them
        $permissionService = app(\App\Services\JobGradePermissionService::class);
        if ($effectiveUser && !$permissionService->isHQGrade($effectiveUser->job_grade ?? '')) {
            // Store user: exclude DRAFT and APPROVE status tasks
            $query->whereNotIn('status_id', [self::DRAFT_STATUS_ID, self::APPROVE_STATUS_ID]);
        } else {
            // HQ user: apply DRAFT and APPROVE ownership filter
            // - DRAFT tasks: Only show to their creator
            // - APPROVE tasks: Only show to creator OR approver
            if ($effectiveStaffId) {
                $query->where(function ($q) use ($effectiveStaffId) {
                    // Show tasks that are NOT DRAFT and NOT APPROVE (other statuses visible to all HQ)
                    $q->whereNotIn('status_id', [self::DRAFT_STATUS_ID, self::APPROVE_STATUS_ID])
                      // OR DRAFT tasks created by current user
                      ->orWhere(function ($subQ) use ($effectiveStaffId) {
                          $subQ->where('status_id', self::DRAFT_STATUS_ID)
                               ->where('created_staff_id', $effectiveStaffId);
                      })
                      // OR APPROVE tasks where current user is creator OR approver
                      ->orWhere(function ($subQ) use ($effectiveStaffId) {
                          $subQ->where('status_id', self::APPROVE_STATUS_ID)
                               ->where(function ($innerQ) use ($effectiveStaffId) {
                                   $innerQ->where('created_staff_id', $effectiveStaffId)
                                          ->orWhere('approver_id', $effectiveStaffId);
                               });
                      });
                });
            } else {
                // No authenticated user: exclude all DRAFT and APPROVE tasks
                $query->whereNotIn('status_id', [self::DRAFT_STATUS_ID, self::APPROVE_STATUS_ID]);
            }
        }

        // Eager load relationships to prevent N+1 queries (Task 2.3)
        $query->with([
            'status:code_master_id,name,code',
            'department:department_id,department_code,department_name',
            'taskType:code_master_id,name,code',
            'createdBy:staff_id,staff_name,job_grade',
            'approver:staff_id,staff_name,job_grade',
        ]);

        $tasks = QueryBuilder::for($query)
            ->allowedFilters([
                AllowedFilter::exact('assigned_store_id'),
                AllowedFilter::exact('dept_id'),
                // Multi-department filter (array or comma-separated department IDs)
                AllowedFilter::callback('dept_ids', fn ($query, $value) => $query->whereIn('dept_id', is_array($value) ? $value : explode(',', $value))),
                AllowedFilter::exact('assigned_staff_id'),
                AllowedFilter::exact('created_staff_id'),
                AllowedFilter::exact('status_id'),
                // Multi-status filter (array or comma-separated status IDs)
                AllowedFilter::callback('status_ids', fn ($query, $value) => $query->whereIn('status_id', is_array($value) ? $value : explode(',', $value))),
                AllowedFilter::exact('priority'),
                AllowedFilter::exact('source'),
                AllowedFilter::exact('receiver_type'),
                AllowedFilter::partial('task_name'),
                // Date range filters - also include:
                // 1. Tasks with NULL dates (drafts without dates set)
                // 2. DRAFT and APPROVE status tasks (always show regardless of date)
                AllowedFilter::callback('start_date_from', fn ($query, $value) => $query->where(function ($q) use ($value) {
                    $q->where('start_date', '>=', $value)
                      ->orWhereNull('start_date')
                      ->orWhereIn('status_id', [self::DRAFT_STATUS_ID, self::APPROVE_STATUS_ID]);
                })),
                AllowedFilter::callback('start_date_to', fn ($query, $value) => $query->where(function ($q) use ($value) {
                    $q->where('start_date', '<=', $value)
                      ->orWhereNull('start_date')
                      ->orWhereIn('status_id', [self::DRAFT_STATUS_ID, self::APPROVE_STATUS_ID]);
                })),
                AllowedFilter::callback('end_date_from', fn ($query, $value) => $query->where(function ($q) use ($value) {
                    $q->where('end_date', '>=', $value)
                      ->orWhereNull('end_date')
                      ->orWhereIn('status_id', [self::DRAFT_STATUS_ID, self::APPROVE_STATUS_ID]);
                })),
                AllowedFilter::callback('end_date_to', fn ($query, $value) => $query->where(function ($q) use ($value) {
                    $q->where('end_date', '<=', $value)
                      ->orWhereNull('end_date')
                      ->orWhereIn('status_id', [self::DRAFT_STATUS_ID, self::APPROVE_STATUS_ID]);
                })),
                // Filter by calculated status (not_yet, on_progress, done, overdue)
                // This filters based on store assignment statuses
                AllowedFilter::callback('calculated_status', function ($query, $value) {
                    $today = now()->startOfDay();

                    switch ($value) {
                        case Task::OVERALL_NOT_YET:
                            // All stores are not_yet OR task has no assignments yet
                            $query->where(function ($q) {
                                $q->whereDoesntHave('storeAssignments', function ($sq) {
                                    $sq->where('status', '!=', 'not_yet');
                                })
                                ->whereHas('storeAssignments');
                            });
                            break;

                        case Task::OVERALL_ON_PROGRESS:
                            // At least 1 store is on_progress or done_pending, and not overdue
                            $query->whereHas('storeAssignments', function ($sq) {
                                $sq->whereIn('status', ['on_progress', 'done_pending']);
                            })
                            ->where(function ($q) use ($today) {
                                $q->whereNull('end_date')
                                  ->orWhere('end_date', '>=', $today);
                            });
                            break;

                        case Task::OVERALL_DONE:
                            // All stores are done or unable
                            $query->whereDoesntHave('storeAssignments', function ($sq) {
                                $sq->whereNotIn('status', ['done', 'unable']);
                            })
                            ->whereHas('storeAssignments');
                            break;

                        case Task::OVERALL_OVERDUE:
                            // end_date < today AND has stores not in final state
                            $query->where('end_date', '<', $today)
                                ->whereHas('storeAssignments', function ($sq) {
                                    $sq->whereNotIn('status', ['done', 'unable']);
                                });
                            break;
                    }
                }),
            ])
            ->allowedSorts(['task_id', 'task_name', 'end_date', 'start_date', 'created_at']);

        // Default sort: APPROVE → DRAFT → OVERDUE → NOT_YET → ON_PROGRESS → DONE
        // Status is already stored in status_id column, so we use simple CASE ordering
        if (!$request->has('sort')) {
            $tasks = $tasks->orderByRaw("CASE status_id
                WHEN " . self::APPROVE_STATUS_ID . " THEN 1
                WHEN " . self::DRAFT_STATUS_ID . " THEN 2
                WHEN " . self::OVERDUE_STATUS_ID . " THEN 3
                WHEN " . self::NOT_YET_STATUS_ID . " THEN 4
                WHEN " . self::ON_PROGRESS_STATUS_ID . " THEN 5
                WHEN " . self::DONE_STATUS_ID . " THEN 6
                ELSE 7
            END")
            ->orderBy('task_id', 'desc');
        }

        $paginatedTasks = $tasks->paginate($request->get('per_page', 20));

        // Transform paginated tasks using TaskListResource
        // Add calculated fields to each task before transforming
        $paginatedTasks->getCollection()->transform(function ($task) {
            // Add calculated fields as dynamic properties
            $task->calculated_status = $task->getCalculatedStatus();
            $task->store_progress = $task->getStoreProgress();

            // Add nested sub_tasks (optimized query)
            $task->sub_tasks = $this->getNestedSubTasksForList($task->task_id);

            return $task;
        });

        // Build response using Resource collection
        $response = TaskListResource::collection($paginatedTasks)->response()->getData(true);

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
     *
     * Uses TaskDetailResource for full task information.
     */
    public function show($id)
    {
        $task = Task::with([
            'assignedStaff:staff_id,staff_name,job_grade',
            'createdBy:staff_id,staff_name,job_grade,email',
            'approver:staff_id,staff_name,job_grade',
            'assignedStore:store_id,store_code,store_name',
            'department:department_id,department_code,department_name',
            'taskType:code_master_id,name,code',
            'responseType:code_master_id,name,code',
            'status:code_master_id,name,code',
            'manual:document_id,document_name',
            'lastRejectedBy:staff_id,staff_name',
            'pausedBy:staff_id,staff_name',
            'libraryTask:task_library_id,task_name',
            'storeAssignments.store:store_id,store_code,store_name',
            'storeAssignments.assignedToStaff:staff_id,staff_name',
        ])->findOrFail($id);

        // Add calculated fields as dynamic properties
        $task->calculated_status = $task->getCalculatedStatus();
        $task->store_progress = $task->getStoreProgress();

        // Add nested sub_tasks for detail view
        $task->sub_tasks = $this->getNestedSubTasksForDetail($task->task_id);

        return new TaskDetailResource($task);
    }

    /**
     * Get nested sub-tasks with full details for detail view
     *
     * @param int $parentTaskId Parent task ID
     * @return array Array of sub-tasks with full fields
     */
    private function getNestedSubTasksForDetail(int $parentTaskId): array
    {
        $children = Task::where('parent_task_id', $parentTaskId)
            ->with([
                'assignedStaff:staff_id,staff_name,job_grade',
                'createdBy:staff_id,staff_name,job_grade',
                'status:code_master_id,name,code',
                'department:department_id,department_code,department_name',
                'taskType:code_master_id,name,code',
            ])
            ->orderBy('task_id')
            ->get();

        return $children->map(function ($child) {
            $childData = (new TaskDetailResource($child))->toArray(request());

            // Add calculated fields
            $childData['calculated_status'] = $child->getCalculatedStatus();
            $childData['store_progress'] = $child->getStoreProgress();

            // Recursively get nested sub_tasks
            if (($child->task_level ?? 1) < 5) {
                $childData['sub_tasks'] = $this->getNestedSubTasksForDetail($child->task_id);
            } else {
                $childData['sub_tasks'] = [];
            }

            return $childData;
        })->toArray();
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
            // Date validation: start_date >= today, end_date >= start_date
            'start_date' => 'nullable|date|after_or_equal:today',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'priority' => 'nullable|string|in:low,normal,high,urgent',
            'source' => 'nullable|string|in:task_list,library,todo_task',
            'receiver_type' => 'nullable|string|in:store,hq_user',
            // Task frequency type for date range validation
            'frequency_type' => 'nullable|string|in:yearly,quarterly,monthly,weekly,daily',
            // Task hierarchy fields
            'parent_task_id' => 'nullable|exists:tasks,task_id',
            'task_level' => 'nullable|integer|min:1|max:5',
            // Nested sub-tasks (recursive)
            'sub_tasks' => 'nullable|array',
            'sub_tasks.*.task_name' => 'required|string|max:500',
            'sub_tasks.*.task_level' => 'nullable|integer|min:2|max:5',
            'sub_tasks.*.frequency_type' => 'nullable|string|in:yearly,quarterly,monthly,weekly,daily',
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

        // Validate Task Type (frequency_type) and Date Range correlation
        // Skip for library source as dates are set later when dispatching
        if ($source !== Task::SOURCE_LIBRARY) {
            $frequencyType = $request->input('frequency_type');
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            if ($frequencyType && $startDate && $endDate) {
                $validation = $this->validateTaskTypeDateRange($frequencyType, $startDate, $endDate);
                if (!$validation['valid']) {
                    return response()->json([
                        'message' => 'Validation failed',
                        'error' => $validation['errors'][0] ?? 'Task type and date range mismatch',
                        'frequency_type' => $frequencyType,
                        'max_days' => $validation['maxDays'],
                        'actual_days' => $validation['actualDays'],
                    ], 422);
                }
            }
        }

        // Prepare task data (exclude sub_tasks and frequency_type from direct creation)
        // frequency_type is for validation only, not a DB column
        $taskData = $request->except(['sub_tasks', 'frequency_type']);
        $taskData['created_staff_id'] = $user->staff_id;
        $taskData['source'] = $source;
        $taskData['task_level'] = $request->input('task_level', 1);

        $task = Task::create($taskData);

        // Create nested sub-tasks recursively if provided
        $subTasks = $request->input('sub_tasks', []);
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
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    private function createSubTasksRecursively(Task $parentTask, array $subTasks, int $createdStaffId, string $source, int $statusId): void
    {
        foreach ($subTasks as $index => $subTaskData) {
            $level = $subTaskData['task_level'] ?? ($parentTask->task_level + 1);

            // Validate max level (5)
            if ($level > 5) {
                continue;
            }

            // Validate child date range is within parent date range
            $dateValidation = $this->validateChildDateRange($subTaskData, $parentTask);
            if (!$dateValidation['valid']) {
                $taskName = $subTaskData['task_name'] ?? "Sub-task at level {$level}";
                throw \Illuminate\Validation\ValidationException::withMessages([
                    "sub_tasks.{$index}.start_date" => $dateValidation['errors'],
                ]);
            }

            // Validate frequency_type and date range correlation for sub-tasks (skip for library source)
            if ($source !== Task::SOURCE_LIBRARY) {
                $frequencyType = $subTaskData['frequency_type'] ?? null;
                $startDate = $subTaskData['start_date'] ?? null;
                $endDate = $subTaskData['end_date'] ?? null;

                if ($frequencyType && $startDate && $endDate) {
                    $typeValidation = $this->validateTaskTypeDateRange($frequencyType, $startDate, $endDate);
                    if (!$typeValidation['valid']) {
                        throw \Illuminate\Validation\ValidationException::withMessages([
                            "sub_tasks.{$index}.frequency_type" => $typeValidation['errors'],
                        ]);
                    }
                }
            }

            // Extract nested sub_tasks before creating
            $nestedSubTasks = $subTaskData['sub_tasks'] ?? [];
            unset($subTaskData['sub_tasks']);
            // Remove frequency_type from data before saving (not a DB column)
            unset($subTaskData['frequency_type']);

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
            'start_date' => 'nullable|date|after_or_equal:today',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'priority' => 'nullable|string|in:low,normal,high,urgent',
            // Task frequency type for date range validation
            'frequency_type' => 'nullable|string|in:yearly,quarterly,monthly,weekly,daily',
            // Nested sub-tasks validation
            'sub_tasks' => 'nullable|array',
            'sub_tasks.*.task_name' => 'required|string|max:500',
            'sub_tasks.*.task_level' => 'nullable|integer|min:2|max:5',
            'sub_tasks.*.frequency_type' => 'nullable|string|in:yearly,quarterly,monthly,weekly,daily',
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

        // Exclude sub_tasks and frequency_type from update data (frequency_type is for validation only, not a DB column)
        $updateData = $request->except(['sub_tasks', 'frequency_type']);

        // Validate frequency_type and date range correlation (skip for library source)
        if ($source !== Task::SOURCE_LIBRARY) {
            $frequencyType = $request->input('frequency_type');
            $startDate = $request->input('start_date') ?? $task->start_date;
            $endDate = $request->input('end_date') ?? $task->end_date;

            if ($frequencyType && $startDate && $endDate) {
                $validation = $this->validateTaskTypeDateRange($frequencyType, $startDate, $endDate);
                if (!$validation['valid']) {
                    return response()->json([
                        'message' => 'Validation failed',
                        'error' => $validation['errors'][0] ?? 'Task type and date range mismatch',
                        'frequency_type' => $frequencyType,
                        'max_days' => $validation['maxDays'],
                        'actual_days' => $validation['actualDays'],
                    ], 422);
                }
            }
        }

        // Validate parent date change doesn't violate existing children date ranges
        $newStartDate = $request->input('start_date');
        $newEndDate = $request->input('end_date');
        if ($newStartDate || $newEndDate) {
            $existingChildren = Task::where('parent_task_id', $task->task_id)->get();
            $dateErrors = [];

            foreach ($existingChildren as $child) {
                if ($child->start_date && $newStartDate) {
                    $childStart = Carbon::parse($child->start_date);
                    $parentNewStart = Carbon::parse($newStartDate);
                    if ($childStart->lt($parentNewStart)) {
                        $dateErrors[] = "Child task '{$child->task_name}' has start date ({$child->start_date}) before new parent start date ({$newStartDate})";
                    }
                }
                if ($child->end_date && $newEndDate) {
                    $childEnd = Carbon::parse($child->end_date);
                    $parentNewEnd = Carbon::parse($newEndDate);
                    if ($childEnd->gt($parentNewEnd)) {
                        $dateErrors[] = "Child task '{$child->task_name}' has end date ({$child->end_date}) after new parent end date ({$newEndDate})";
                    }
                }
            }

            if (!empty($dateErrors)) {
                return response()->json([
                    'message' => 'Date validation failed',
                    'errors' => [
                        'start_date' => $dateErrors,
                    ],
                ], 422);
            }
        }

        // If task was rejected and user is editing, set has_changes_since_rejection flag
        if ($task->rejection_count > 0 && $task->status_id == self::DRAFT_STATUS_ID) {
            $updateData['has_changes_since_rejection'] = true;
        }

        $task->update($updateData);

        // Handle sub_tasks update (sync: delete old, create new)
        $subTasks = $request->input('sub_tasks', []);

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
     * Add calculated status and store progress to a task array
     *
     * This adds:
     * - calculated_status: Overall status calculated from store assignments (not_yet, on_progress, done, overdue)
     * - store_progress: Statistics about store execution progress
     *
     * @param array $task Task array
     * @return array Task with calculated fields
     */
    private function addCalculatedFields(array $task): array
    {
        $taskModel = Task::find($task['task_id']);

        if (!$taskModel) {
            return $task;
        }

        // Add calculated overall status (from store assignments)
        $task['calculated_status'] = $taskModel->getCalculatedStatus();

        // Add store progress statistics
        $task['store_progress'] = $taskModel->getStoreProgress();

        return $task;
    }

    /**
     * Get nested sub-tasks optimized for list view (reduced fields)
     *
     * This method recursively fetches sub-tasks with only the fields needed
     * for display in Task List, reducing payload size.
     *
     * @param int $parentTaskId Parent task ID
     * @param int $currentLevel Current nesting level (default 1)
     * @return array Array of sub-tasks with minimal fields
     */
    private function getNestedSubTasksForList(int $parentTaskId, int $currentLevel = 1): array
    {
        // Get direct children with only necessary fields and relationships
        $children = Task::where('parent_task_id', $parentTaskId)
            ->select([
                'task_id', 'task_name', 'parent_task_id', 'task_level',
                'status_id', 'dept_id', 'task_type_id', 'priority',
                'start_date', 'end_date', 'created_staff_id', 'approver_id',
                'source', 'receiver_type', 'created_at', 'updated_at'
            ])
            ->with([
                'status:code_master_id,name,code',
                'department:department_id,department_code,department_name',
                'taskType:code_master_id,name,code',
                'createdBy:staff_id,staff_name,job_grade',
                'approver:staff_id,staff_name,job_grade',
            ])
            ->orderBy('task_id')
            ->get();

        // Transform each child to include calculated fields and nested sub_tasks
        return $children->map(function ($child) use ($currentLevel) {
            $childArray = [
                'id' => $child->task_id,
                'task_id' => $child->task_id,
                'task_name' => $child->task_name,
                'parent_task_id' => $child->parent_task_id,
                'task_level' => $child->task_level,
                'status_id' => $child->status_id,
                'status' => $child->status ? [
                    'code_master_id' => $child->status->code_master_id,
                    'name' => $child->status->name,
                    'code' => $child->status->code,
                ] : null,
                'dept_id' => $child->dept_id,
                'department' => $child->department ? [
                    'department_id' => $child->department->department_id,
                    'department_code' => $child->department->department_code,
                    'department_name' => $child->department->department_name,
                ] : null,
                'task_type_id' => $child->task_type_id,
                'taskType' => $child->taskType ? [
                    'code_master_id' => $child->taskType->code_master_id,
                    'name' => $child->taskType->name,
                    'code' => $child->taskType->code,
                ] : null,
                'priority' => $child->priority,
                'start_date' => $child->start_date?->format('Y-m-d'),
                'end_date' => $child->end_date?->format('Y-m-d'),
                'created_staff_id' => $child->created_staff_id,
                'createdBy' => $child->createdBy ? [
                    'staff_id' => $child->createdBy->staff_id,
                    'staff_name' => $child->createdBy->staff_name,
                    'job_grade' => $child->createdBy->job_grade,
                ] : null,
                'approver_id' => $child->approver_id,
                'approver' => $child->approver ? [
                    'staff_id' => $child->approver->staff_id,
                    'staff_name' => $child->approver->staff_name,
                    'job_grade' => $child->approver->job_grade,
                ] : null,
                'source' => $child->source,
                'receiver_type' => $child->receiver_type,
                'created_at' => $child->created_at?->toISOString(),
                'updated_at' => $child->updated_at?->toISOString(),
                // Calculated fields
                'calculated_status' => $child->getCalculatedStatus(),
                'store_progress' => $child->getStoreProgress(),
            ];

            // Recursively get nested sub_tasks (max 5 levels enforced by task_level)
            if (($child->task_level ?? 1) < 5) {
                $childArray['sub_tasks'] = $this->getNestedSubTasksForList($child->task_id, $currentLevel + 1);
            } else {
                $childArray['sub_tasks'] = [];
            }

            return $childArray;
        })->toArray();
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
            // Only count parent tasks (not sub-tasks) - business rule applies to parent tasks only
            $count = Task::whereIn('status_id', [self::DRAFT_STATUS_ID, self::APPROVE_STATUS_ID])
                ->where('created_staff_id', $staffId)
                ->where('source', $source)
                ->whereNull('parent_task_id')  // Only parent tasks count toward limit
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

        // Only show expiring parent tasks (not sub-tasks)
        $expiringDrafts = Task::where('status_id', self::DRAFT_STATUS_ID)
            ->where('created_staff_id', $staffId)
            ->whereNull('parent_task_id')  // Only parent tasks
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
        // Only count parent tasks (not sub-tasks) - business rule applies to parent tasks only
        $currentDraftCount = Task::whereIn('status_id', [self::DRAFT_STATUS_ID, self::APPROVE_STATUS_ID])
            ->where('created_staff_id', $staffId)
            ->where('source', $source)
            ->whereNull('parent_task_id')  // Only parent tasks count toward limit
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
     * Validate child task date range is within parent task date range
     *
     * @param array $childData - Child task data with start_date and end_date
     * @param Task $parent - Parent task
     * @return array - ['valid' => bool, 'errors' => array]
     */
    private function validateChildDateRange(array $childData, Task $parent): array
    {
        $errors = [];

        // Skip if parent doesn't have dates set
        if (!$parent->start_date && !$parent->end_date) {
            return ['valid' => true, 'errors' => []];
        }

        $childStartDate = isset($childData['start_date']) ? Carbon::parse($childData['start_date']) : null;
        $childEndDate = isset($childData['end_date']) ? Carbon::parse($childData['end_date']) : null;
        $parentStartDate = $parent->start_date ? Carbon::parse($parent->start_date) : null;
        $parentEndDate = $parent->end_date ? Carbon::parse($parent->end_date) : null;

        // Child start date must be >= parent start date
        if ($childStartDate && $parentStartDate && $childStartDate->lt($parentStartDate)) {
            $errors[] = "Start date must be on or after parent task start date ({$parentStartDate->format('Y-m-d')})";
        }

        // Child end date must be <= parent end date
        if ($childEndDate && $parentEndDate && $childEndDate->gt($parentEndDate)) {
            $errors[] = "End date must be on or before parent task end date ({$parentEndDate->format('Y-m-d')})";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Maximum duration in days for each task type
     * Yearly: 365 days, Quarterly: 90 days, Monthly: 31 days, Weekly: 7 days, Daily: 1 day
     */
    const TASK_TYPE_MAX_DAYS = [
        'yearly' => 365,
        'quarterly' => 90,
        'monthly' => 31,
        'weekly' => 7,
        'daily' => 1,
    ];

    /**
     * Human-readable labels for task types
     */
    const TASK_TYPE_LABELS = [
        'yearly' => 'Yearly',
        'quarterly' => 'Quarterly',
        'monthly' => 'Monthly',
        'weekly' => 'Weekly',
        'daily' => 'Daily',
    ];

    /**
     * Validate Task Type and Date Range correlation
     * Date range duration must not exceed maximum allowed for the selected task type
     *
     * @param string|null $taskType - Task type value (yearly, quarterly, monthly, weekly, daily)
     * @param string|null $startDate - Start date
     * @param string|null $endDate - End date
     * @return array - ['valid' => bool, 'errors' => array, 'maxDays' => int, 'actualDays' => int]
     */
    private function validateTaskTypeDateRange(?string $taskType, ?string $startDate, ?string $endDate): array
    {
        // Skip validation if task type or dates are not set
        if (!$taskType || !$startDate || !$endDate) {
            return ['valid' => true, 'errors' => [], 'maxDays' => 0, 'actualDays' => 0];
        }

        $maxDays = self::TASK_TYPE_MAX_DAYS[$taskType] ?? null;
        if (!$maxDays) {
            return ['valid' => true, 'errors' => [], 'maxDays' => 0, 'actualDays' => 0];
        }

        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->startOfDay();

        // Calculate days inclusive (start and end dates count)
        $actualDays = $start->diffInDays($end) + 1;

        if ($actualDays > $maxDays) {
            $taskTypeLabel = self::TASK_TYPE_LABELS[$taskType] ?? $taskType;
            return [
                'valid' => false,
                'errors' => [
                    "{$taskTypeLabel} task cannot exceed {$maxDays} day" . ($maxDays > 1 ? 's' : '') . ". Current range is {$actualDays} days. Please select a different Task Type or adjust the date range."
                ],
                'maxDays' => $maxDays,
                'actualDays' => $actualDays,
            ];
        }

        return [
            'valid' => true,
            'errors' => [],
            'maxDays' => $maxDays,
            'actualDays' => $actualDays,
        ];
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

        // Update task - set to NOT_YET (dispatched to stores)
        $task->update([
            'status_id' => self::NOT_YET_STATUS_ID,
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
     * Get tasks that have stores pending HQ check (done_pending status)
     *
     * GET /api/v1/tasks/hq-check
     *
     * Returns tasks that have at least one store with done_pending status,
     * meaning stores have completed the task and are waiting for HQ verification.
     */
    public function hqCheckList(Request $request)
    {
        // Get effective user (may be switched user in testing mode)
        $user = $this->getEffectiveUser($request);

        // Permission check: Only HQ users (G2-G9) can see HQ check list
        $permissionService = app(\App\Services\JobGradePermissionService::class);
        if (!$permissionService->canCreateTask($user)) {
            return response()->json([
                'message' => 'Permission denied',
                'error' => 'Only HQ users (G2-G9) can view the HQ check list.',
            ], 403);
        }

        // Find tasks that have at least one store with done_pending status
        $query = Task::query()
            ->whereHas('storeAssignments', function ($sq) {
                $sq->where('status', TaskStoreAssignment::STATUS_DONE_PENDING);
            })
            ->with([
                'createdBy',
                'department',
                'taskType',
                'status',
                // Load stores that need HQ check (done_pending only)
                'storeAssignments' => function ($q) {
                    $q->where('status', TaskStoreAssignment::STATUS_DONE_PENDING)
                      ->with(['store', 'completedBy']);
                }
            ]);

        // Apply filters
        $query = QueryBuilder::for($query)
            ->allowedFilters([
                AllowedFilter::exact('dept_id'),
                AllowedFilter::exact('created_staff_id'),
                AllowedFilter::partial('task_name'),
            ])
            ->allowedSorts(['task_id', 'task_name', 'end_date', 'created_at']);

        // Default sort by end_date (most urgent first)
        if (!$request->has('sort')) {
            $query = $query->orderBy('end_date', 'asc')
                           ->orderBy('task_id', 'desc');
        }

        $tasks = $query->paginate($request->get('per_page', 20));

        // Transform response to include HQ check summary
        $response = $tasks->toArray();
        $response['data'] = array_map(function ($task) {
            // Count stores waiting for HQ check
            $pendingCheckCount = count($task['store_assignments'] ?? []);

            // Get total stores for this task
            $totalStores = TaskStoreAssignment::where('task_id', $task['task_id'])->count();

            $task['hq_check_summary'] = [
                'pending_check_count' => $pendingCheckCount,
                'total_stores' => $totalStores,
                'stores_awaiting_check' => array_map(function ($assignment) {
                    return [
                        'assignment_id' => $assignment['id'],
                        'store_id' => $assignment['store_id'],
                        'store_name' => $assignment['store']['store_name'] ?? 'Unknown Store',
                        'store_code' => $assignment['store']['store_code'] ?? null,
                        'completed_at' => $assignment['completed_at'],
                        'completed_by' => $assignment['completed_by'] ? [
                            'staff_id' => $assignment['completed_by']['staff_id'] ?? null,
                            'name' => isset($assignment['completed_by'])
                                ? ($assignment['completed_by']['first_name'] ?? '') . ' ' . ($assignment['completed_by']['last_name'] ?? '')
                                : null,
                        ] : null,
                    ];
                }, $task['store_assignments'] ?? []),
            ];

            // Remove raw store_assignments from response (replaced by hq_check_summary)
            unset($task['store_assignments']);

            return $task;
        }, $response['data']);

        return response()->json($response);
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

    /**
     * Get task approval history (workflow steps timeline)
     *
     * GET /api/v1/tasks/{id}/history
     *
     * Returns the complete approval workflow history for a task,
     * organized by rounds (for rejection/resubmission cycles).
     */
    public function getApprovalHistory(Request $request, $id)
    {
        $task = Task::with(['approvalHistory', 'createdBy', 'approver'])
            ->findOrFail($id);

        // If no history exists yet, create initial history entries based on current task state
        if ($task->approvalHistory->isEmpty()) {
            $this->createInitialHistory($task);
            $task->load('approvalHistory');
        }

        return new TaskApprovalHistoryResource($task);
    }

    /**
     * Create initial history entries for a task based on its current state
     *
     * This is called when history is requested but no entries exist yet.
     * It creates history entries based on the task's current status and timestamps.
     */
    private function createInitialHistory(Task $task): void
    {
        $roundNumber = max(1, $task->rejection_count + 1);
        $creator = $task->createdBy;
        $approver = $task->approver;

        // Step 1: SUBMIT
        $submitStatus = 'pending';
        if ($task->submitted_at) {
            $submitStatus = 'submitted';
        }

        TaskApprovalHistory::create([
            'task_id' => $task->task_id,
            'round_number' => $roundNumber,
            'step_number' => 1,
            'step_name' => 'SUBMIT',
            'step_status' => $submitStatus,
            'assigned_to_type' => 'user',
            'assigned_to_id' => $creator?->staff_id,
            'assigned_to_name' => $creator ? ($creator->first_name . ' ' . $creator->last_name) : 'Unknown',
            'start_date' => $task->created_at?->toDateString(),
            'end_date' => $task->submitted_at?->toDateString() ?? $task->created_at?->toDateString(),
            'actual_start_at' => $task->created_at,
            'actual_end_at' => $task->submitted_at,
        ]);

        // Step 2: APPROVE
        $approveStatus = 'pending';
        $dispatchedStatuses = [self::NOT_YET_STATUS_ID, self::ON_PROGRESS_STATUS_ID, self::DONE_STATUS_ID, self::OVERDUE_STATUS_ID];
        if ($task->status_id === self::APPROVE_STATUS_ID) {
            $approveStatus = 'in_process';
        } elseif (in_array($task->status_id, $dispatchedStatuses)) {
            $approveStatus = 'done';
        } elseif ($task->rejection_count > 0 && $task->status_id === self::DRAFT_STATUS_ID) {
            $approveStatus = 'rejected';
        }

        TaskApprovalHistory::create([
            'task_id' => $task->task_id,
            'round_number' => $roundNumber,
            'step_number' => 2,
            'step_name' => 'APPROVE',
            'step_status' => $approveStatus,
            'assigned_to_type' => 'user',
            'assigned_to_id' => $approver?->staff_id,
            'assigned_to_name' => $approver ? ($approver->first_name . ' ' . $approver->last_name) : 'Pending Assignment',
            'start_date' => $task->submitted_at?->toDateString(),
            'end_date' => $task->approved_at?->toDateString() ?? $task->last_rejected_at?->toDateString(),
            'actual_start_at' => $task->submitted_at,
            'actual_end_at' => $task->approved_at ?? $task->last_rejected_at,
            'comment' => $task->last_rejection_reason,
        ]);

        // Step 3: DO_TASK (only if dispatched - task has been approved and sent to stores)
        if (in_array($task->status_id, $dispatchedStatuses)) {
            // TODO: Calculate actual store progress when store assignment is implemented
            $doTaskStatus = $task->completed_time ? 'done' : 'in_process';

            TaskApprovalHistory::create([
                'task_id' => $task->task_id,
                'round_number' => $roundNumber,
                'step_number' => 3,
                'step_name' => 'DO_TASK',
                'step_status' => $doTaskStatus,
                'assigned_to_type' => 'stores',
                'assigned_to_name' => 'Assigned Stores',
                'assigned_to_count' => 1, // TODO: Get actual count from task_store_assignments
                'start_date' => $task->start_date?->toDateString(),
                'end_date' => $task->end_date?->toDateString(),
                'actual_start_at' => $task->approved_at,
                'progress_done' => $task->completed_time ? 1 : 0,
                'progress_total' => 1,
            ]);

            // Step 4: CHECK (only if task execution started)
            $checkStatus = 'pending';
            if ($task->completed_time) {
                $checkStatus = 'done';
            }

            TaskApprovalHistory::create([
                'task_id' => $task->task_id,
                'round_number' => $roundNumber,
                'step_number' => 4,
                'step_name' => 'CHECK',
                'step_status' => $checkStatus,
                'assigned_to_type' => 'user',
                'assigned_to_name' => 'PERI',
                'start_date' => $task->end_date?->toDateString(),
                'end_date' => $task->end_date?->toDateString(),
            ]);
        }
    }

    /**
     * Pause a task (return to APPROVE status for review)
     *
     * POST /api/v1/tasks/{id}/pause
     *
     * Rules:
     * - Only APPROVER can pause (not Creator)
     * - Only for tasks with status NOT_YET or ON_PROGRESS
     * - Deletes all store assignments
     * - Returns task to APPROVE status for approver to review and re-approve
     * - Marks associated Library task as "had_issues" if exists
     */
    public function pause(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        // Get effective user (may be switched user in testing mode)
        $user = $this->getEffectiveUser($request);

        // Only assigned approver can pause (not creator)
        if ($task->approver_id !== $user->staff_id) {
            return response()->json([
                'message' => 'Unauthorized',
                'error' => 'Only the assigned approver can pause this task.',
            ], 403);
        }

        // Check if task has any store with done or done_pending status
        $hasCompletedStores = $task->storeAssignments()
            ->whereIn('status', ['done', 'done_pending'])
            ->exists();

        if ($hasCompletedStores) {
            return response()->json([
                'message' => 'Cannot pause',
                'error' => 'Cannot pause task because at least one store has completed or is pending check.',
            ], 422);
        }

        // Must be in NOT_YET or ON_PROGRESS status
        if (!in_array($task->status_id, [self::NOT_YET_STATUS_ID, self::ON_PROGRESS_STATUS_ID])) {
            return response()->json([
                'message' => 'Invalid status',
                'error' => 'Only tasks with status Not Yet or On Progress can be paused.',
                'current_status_id' => $task->status_id,
            ], 422);
        }

        $request->validate([
            'reason' => 'nullable|string|max:1000',
        ]);

        // Delete all store assignments
        $deletedAssignments = $task->storeAssignments()->delete();

        // Return task to APPROVE status for approver review
        $task->update([
            'status_id' => self::APPROVE_STATUS_ID,
            'paused_at' => Carbon::now(),
            'paused_by' => $user->staff_id,
            'pause_reason' => $request->input('reason'),
        ]);

        // Mark associated Library task as "had_issues" if exists
        if ($task->library_task_id) {
            \DB::table('task_library')
                ->where('id', $task->library_task_id)
                ->update(['had_issues' => true, 'updated_at' => Carbon::now()]);
        }

        // Broadcast event
        broadcast(new TaskUpdated($task, 'paused'))->toOthers();

        return response()->json([
            'message' => 'Task paused successfully',
            'task' => $task->fresh(),
            'deleted_assignments' => $deletedAssignments,
            'info' => 'Task returned to Approval status. Approver can now edit and re-approve the task.',
        ]);
    }
}
