<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskLibrary;
use App\Models\TaskStoreAssignment;
use App\Models\Staff;
use App\Models\Store;
use App\Traits\HasJobGradePermissions;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Carbon\Carbon;

/**
 * Task Library Controller for WS Module
 *
 * Handles library templates management including:
 * - CRUD operations for library templates
 * - Draft/Approval workflow for Flow 2 (create directly in Library)
 * - Dispatch functionality (send template to stores)
 * - Cooldown mechanism to prevent duplicate dispatches
 * - Auto-save templates from approved tasks (called from TaskController)
 *
 * @see CLAUDE.md Section 12.3 for Library workflow details
 */
class TaskLibraryController extends Controller
{
    use HasJobGradePermissions;

    /**
     * Maximum drafts per user for library templates
     */
    const MAX_DRAFTS_PER_USER = 5;

    /**
     * Get all library templates
     *
     * GET /api/v1/library-tasks
     *
     * Supports filtering by status, source, department, and search by name.
     * Only returns templates visible to current user (own drafts + available templates).
     */
    public function index(Request $request)
    {
        $user = $this->getEffectiveUser($request);
        $query = TaskLibrary::query();

        // Filter by visibility
        if ($user) {
            $query->where(function ($q) use ($user) {
                // Show own drafts/pending approval
                $q->where(function ($subQ) use ($user) {
                    $subQ->whereIn('status', [TaskLibrary::STATUS_DRAFT, TaskLibrary::STATUS_APPROVE])
                         ->where('created_staff_id', $user->staff_id);
                })
                // Show templates pending approval for this user (as approver)
                ->orWhere(function ($subQ) use ($user) {
                    $subQ->where('status', TaskLibrary::STATUS_APPROVE)
                         ->where('approver_id', $user->staff_id);
                })
                // Show available/cooldown templates from same department
                ->orWhere(function ($subQ) use ($user) {
                    $subQ->whereIn('status', [TaskLibrary::STATUS_AVAILABLE, TaskLibrary::STATUS_COOLDOWN])
                         ->where('dept_id', $user->department_id);
                });
            });
        } else {
            // No auth: only show available templates
            $query->where('status', TaskLibrary::STATUS_AVAILABLE);
        }

        $templates = QueryBuilder::for($query)
            ->allowedFilters([
                AllowedFilter::exact('status'),
                AllowedFilter::exact('source'),
                AllowedFilter::exact('dept_id'),
                AllowedFilter::exact('created_staff_id'),
                AllowedFilter::partial('task_name'),
                AllowedFilter::exact('had_issues'),
            ])
            ->allowedSorts(['task_library_id', 'task_name', 'created_at', 'dispatch_count', 'last_dispatched_at'])
            ->allowedIncludes(['creator', 'approver', 'department', 'taskType', 'responseType'])
            ->defaultSort('-created_at')
            ->paginate($request->get('per_page', 20));

        // Add computed fields for each template
        $response = $templates->toArray();
        $response['data'] = array_map(function ($template) {
            return $this->addComputedFields($template);
        }, $response['data']);

        return response()->json($response);
    }

    /**
     * Get single library template
     *
     * GET /api/v1/library-tasks/{id}
     */
    public function show($id)
    {
        $template = TaskLibrary::with([
            'creator', 'approver', 'department', 'taskType',
            'responseType', 'manual', 'lastRejectedBy', 'lastDispatchedBy'
        ])->findOrFail($id);

        $templateArray = $template->toArray();
        $templateArray = $this->addComputedFields($templateArray);

        return response()->json($templateArray);
    }

    /**
     * Create new library template (Flow 2: Create directly in Library)
     *
     * POST /api/v1/library-tasks
     *
     * Permission: Only HQ users (G2-G9) can create library templates.
     */
    public function store(Request $request)
    {
        $user = $this->getEffectiveUser($request);

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
                'error' => 'User not authenticated',
            ], 401);
        }

        // Permission check: Only HQ users (G2-G9) can create
        $permissionService = app(\App\Services\JobGradePermissionService::class);
        if (!$permissionService->canCreateTask($user)) {
            return response()->json([
                'message' => 'Permission denied',
                'error' => 'Only HQ users (G2-G9) can create library templates.',
            ], 403);
        }

        $request->validate([
            'task_name' => 'required|string|max:500',
            'task_description' => 'nullable|string',
            'task_type_id' => 'nullable|exists:code_master,code_master_id',
            'response_type_id' => 'nullable|exists:code_master,code_master_id',
            'dept_id' => 'nullable|exists:departments,department_id',
            'task_instruction_type' => 'nullable|in:image,document',
            'manual_link' => 'nullable|url',
            'photo_guidelines' => 'nullable|array',
            'manual_id' => 'nullable|exists:manual_documents,document_id',
            'comment' => 'nullable|string',
            'attachments' => 'nullable|array',
        ]);

        // Check draft limit
        $draftCount = TaskLibrary::where('created_staff_id', $user->staff_id)
            ->whereIn('status', [TaskLibrary::STATUS_DRAFT, TaskLibrary::STATUS_APPROVE])
            ->count();

        if ($draftCount >= self::MAX_DRAFTS_PER_USER) {
            return response()->json([
                'message' => 'Draft limit exceeded',
                'error' => 'You have reached the maximum limit of ' . self::MAX_DRAFTS_PER_USER . ' drafts for Library templates.',
                'current_drafts' => $draftCount,
            ], 422);
        }

        $templateData = $request->all();
        $templateData['created_staff_id'] = $user->staff_id;
        $templateData['source'] = TaskLibrary::SOURCE_LIBRARY;
        $templateData['status'] = TaskLibrary::STATUS_DRAFT;
        $templateData['dept_id'] = $templateData['dept_id'] ?? $user->department_id;

        $template = TaskLibrary::create($templateData);

        return response()->json($template->load(['creator', 'department']), 201);
    }

    /**
     * Update library template
     *
     * PUT /api/v1/library-tasks/{id}
     */
    public function update(Request $request, $id)
    {
        $template = TaskLibrary::findOrFail($id);
        $user = $this->getEffectiveUser($request);

        // Can only edit own drafts
        if ($template->status === TaskLibrary::STATUS_DRAFT && $template->created_staff_id !== $user->staff_id) {
            return response()->json([
                'message' => 'Unauthorized',
                'error' => 'You can only edit your own draft templates.',
            ], 403);
        }

        // Cannot edit available/cooldown templates
        if (in_array($template->status, [TaskLibrary::STATUS_AVAILABLE, TaskLibrary::STATUS_COOLDOWN])) {
            return response()->json([
                'message' => 'Cannot edit',
                'error' => 'Available or cooldown templates cannot be edited directly. Create a new version instead.',
            ], 422);
        }

        $request->validate([
            'task_name' => 'nullable|string|max:500',
            'task_description' => 'nullable|string',
            'task_type_id' => 'nullable|exists:code_master,code_master_id',
            'response_type_id' => 'nullable|exists:code_master,code_master_id',
            'dept_id' => 'nullable|exists:departments,department_id',
            'task_instruction_type' => 'nullable|in:image,document',
            'manual_link' => 'nullable|url',
            'photo_guidelines' => 'nullable|array',
            'manual_id' => 'nullable|exists:manual_documents,document_id',
            'comment' => 'nullable|string',
            'attachments' => 'nullable|array',
        ]);

        // If was rejected and user is editing, set flag
        if ($template->rejection_count > 0 && $template->status === TaskLibrary::STATUS_DRAFT) {
            $request->merge(['has_changes_since_rejection' => true]);
        }

        $template->update($request->all());

        return response()->json($template->fresh(['creator', 'department']));
    }

    /**
     * Delete library template
     *
     * DELETE /api/v1/library-tasks/{id}
     */
    public function destroy(Request $request, $id)
    {
        $template = TaskLibrary::findOrFail($id);
        $user = $this->getEffectiveUser($request);

        // Can only delete own drafts
        if ($template->status === TaskLibrary::STATUS_DRAFT && $template->created_staff_id !== $user->staff_id) {
            return response()->json([
                'message' => 'Unauthorized',
                'error' => 'You can only delete your own draft templates.',
            ], 403);
        }

        // Cannot delete available templates that have been dispatched
        if ($template->status === TaskLibrary::STATUS_AVAILABLE && $template->dispatch_count > 0) {
            return response()->json([
                'message' => 'Cannot delete',
                'error' => 'Cannot delete a template that has been dispatched. It will remain available for reference.',
            ], 422);
        }

        $template->delete();

        return response()->json(null, 204);
    }

    /**
     * Submit library template for approval
     *
     * POST /api/v1/library-tasks/{id}/submit
     */
    public function submit(Request $request, $id)
    {
        $template = TaskLibrary::findOrFail($id);
        $user = $this->getEffectiveUser($request);

        // Only creator can submit
        if ($template->created_staff_id !== $user->staff_id) {
            return response()->json([
                'message' => 'Unauthorized',
                'error' => 'Only the template creator can submit for approval.',
            ], 403);
        }

        // Must be in draft status
        if ($template->status !== TaskLibrary::STATUS_DRAFT) {
            return response()->json([
                'message' => 'Invalid status',
                'error' => 'Only draft templates can be submitted.',
            ], 422);
        }

        // Check if can submit
        if (!$template->canSubmit()) {
            if ($template->isMaxRejectionsReached()) {
                return response()->json([
                    'message' => 'Maximum rejections reached',
                    'error' => 'This template has been rejected 3 times and cannot be resubmitted.',
                ], 422);
            }
            if ($template->rejection_count > 0 && !$template->has_changes_since_rejection) {
                return response()->json([
                    'message' => 'Changes required',
                    'error' => 'Please make changes before resubmitting.',
                ], 422);
            }
        }

        // Find approver
        $creator = Staff::find($user->staff_id);
        $approver = $this->findApprover($creator);

        if (!$approver) {
            return response()->json([
                'message' => 'No approver found',
                'error' => 'Could not find an appropriate approver.',
            ], 422);
        }

        $template->update([
            'status' => TaskLibrary::STATUS_APPROVE,
            'approver_id' => $approver->staff_id,
            'submitted_at' => Carbon::now(),
            'has_changes_since_rejection' => false,
        ]);

        return response()->json([
            'message' => 'Template submitted for approval',
            'template' => $template->fresh(['approver']),
        ]);
    }

    /**
     * Approve library template
     *
     * POST /api/v1/library-tasks/{id}/approve
     */
    public function approve(Request $request, $id)
    {
        $template = TaskLibrary::findOrFail($id);
        $user = $this->getEffectiveUser($request);

        // Only assigned approver can approve
        if ($template->approver_id !== $user->staff_id) {
            return response()->json([
                'message' => 'Unauthorized',
                'error' => 'Only the assigned approver can approve this template.',
            ], 403);
        }

        // Must be pending approval
        if ($template->status !== TaskLibrary::STATUS_APPROVE) {
            return response()->json([
                'message' => 'Invalid status',
                'error' => 'Only templates pending approval can be approved.',
            ], 422);
        }

        $template->update([
            'status' => TaskLibrary::STATUS_AVAILABLE,
            'approved_at' => Carbon::now(),
        ]);

        return response()->json([
            'message' => 'Template approved and is now available for dispatch',
            'template' => $template->fresh(),
        ]);
    }

    /**
     * Reject library template
     *
     * POST /api/v1/library-tasks/{id}/reject
     */
    public function reject(Request $request, $id)
    {
        $template = TaskLibrary::findOrFail($id);
        $user = $this->getEffectiveUser($request);

        // Only assigned approver can reject
        if ($template->approver_id !== $user->staff_id) {
            return response()->json([
                'message' => 'Unauthorized',
                'error' => 'Only the assigned approver can reject this template.',
            ], 403);
        }

        // Must be pending approval
        if ($template->status !== TaskLibrary::STATUS_APPROVE) {
            return response()->json([
                'message' => 'Invalid status',
                'error' => 'Only templates pending approval can be rejected.',
            ], 422);
        }

        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $template->update([
            'status' => TaskLibrary::STATUS_DRAFT,
            'rejection_count' => $template->rejection_count + 1,
            'has_changes_since_rejection' => false,
            'last_rejection_reason' => $request->input('reason'),
            'last_rejected_at' => Carbon::now(),
            'last_rejected_by' => $user->staff_id,
        ]);

        return response()->json([
            'message' => 'Template rejected',
            'template' => $template->fresh(),
            'can_resubmit' => $template->rejection_count < TaskLibrary::MAX_REJECTIONS,
        ]);
    }

    /**
     * Dispatch library template to stores (create task instances)
     *
     * POST /api/v1/library-tasks/{id}/dispatch
     *
     * Creates a new task from the template and assigns it to selected stores.
     */
    public function dispatch(Request $request, $id)
    {
        $template = TaskLibrary::findOrFail($id);
        $user = $this->getEffectiveUser($request);

        // Must be available
        if (!$template->isAvailable()) {
            return response()->json([
                'message' => 'Cannot dispatch',
                'error' => 'Only available templates can be dispatched.',
            ], 422);
        }

        // Check cooldown
        if ($template->isInActiveCooldown()) {
            return response()->json([
                'message' => 'In cooldown',
                'error' => 'This template is in cooldown period.',
                'cooldown_until' => $template->cooldown_until->toIso8601String(),
                'cooldown_remaining_minutes' => $template->getCooldownRemainingMinutes(),
            ], 422);
        }

        $request->validate([
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'store_ids' => 'required|array|min:1',
            'store_ids.*' => 'exists:stores,store_id',
            'priority' => 'nullable|in:low,normal,high,urgent',
        ]);

        $storeIds = $request->input('store_ids');

        // Check for duplicate dispatch (same stores, overlapping dates)
        $duplicateCheck = $this->checkDuplicateDispatch($template, $storeIds, $request->input('start_date'), $request->input('end_date'));
        if ($duplicateCheck['has_duplicate']) {
            // Check if user can override
            $canOverride = $this->canOverrideCooldown($user, $template);
            if (!$canOverride && !$request->boolean('force_override')) {
                return response()->json([
                    'message' => 'Duplicate dispatch detected',
                    'error' => 'This template was recently dispatched to some of the selected stores.',
                    'existing_dispatch' => $duplicateCheck['details'],
                    'can_override' => $canOverride,
                ], 422);
            }
        }

        // Create task from template
        $task = $this->createTaskFromTemplate($template, $user, $request);

        // Create store assignments
        foreach ($storeIds as $storeId) {
            TaskStoreAssignment::create([
                'task_id' => $task->task_id,
                'store_id' => $storeId,
                'status' => 'not_yet',
                'assigned_at' => Carbon::now(),
                'assigned_by' => $user->staff_id,
            ]);
        }

        // Update template dispatch tracking
        $template->update([
            'dispatch_count' => $template->dispatch_count + 1,
            'last_dispatched_at' => Carbon::now(),
            'last_dispatched_by' => $user->staff_id,
        ]);

        // Set cooldown if needed
        if ($duplicateCheck['has_duplicate'] && $request->boolean('force_override')) {
            $template->update([
                'status' => TaskLibrary::STATUS_COOLDOWN,
                'cooldown_until' => Carbon::parse($request->input('end_date')),
                'cooldown_triggered_by' => $duplicateCheck['details']['dispatched_by_id'],
                'cooldown_triggered_at' => $duplicateCheck['details']['dispatched_at'],
            ]);
        }

        $task->load(['storeAssignments.store', 'createdBy']);

        return response()->json([
            'message' => 'Template dispatched successfully',
            'task' => $task,
            'stores_count' => count($storeIds),
        ], 201);
    }

    /**
     * Override cooldown (for highest-grade user in dept/team)
     *
     * POST /api/v1/library-tasks/{id}/override-cooldown
     */
    public function overrideCooldown(Request $request, $id)
    {
        $template = TaskLibrary::findOrFail($id);
        $user = $this->getEffectiveUser($request);

        // Must be in cooldown
        if (!$template->isInCooldown()) {
            return response()->json([
                'message' => 'Not in cooldown',
                'error' => 'This template is not in cooldown.',
            ], 422);
        }

        // Check permission to override
        if (!$this->canOverrideCooldown($user, $template)) {
            return response()->json([
                'message' => 'Permission denied',
                'error' => 'Only the department/team head can override cooldown.',
            ], 403);
        }

        $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        // Clear cooldown
        $template->clearCooldown();

        // TODO: Log override action
        // CooldownOverrideLog::create([...]);

        return response()->json([
            'message' => 'Cooldown overridden successfully',
            'template' => $template->fresh(),
        ]);
    }

    /**
     * Get templates pending approval for current user
     *
     * GET /api/v1/library-tasks/pending-approval
     */
    public function pendingApproval(Request $request)
    {
        $user = $this->getEffectiveUser($request);

        $templates = TaskLibrary::where('approver_id', $user->staff_id)
            ->where('status', TaskLibrary::STATUS_APPROVE)
            ->with(['creator', 'department', 'taskType'])
            ->orderBy('submitted_at', 'asc')
            ->paginate($request->get('per_page', 20));

        return response()->json($templates);
    }

    /**
     * Auto-save task as library template (called when task is approved)
     *
     * This is called internally from TaskController when a task is approved.
     *
     * @param Task $task The approved task
     * @return TaskLibrary The created library template
     */
    public static function autoSaveFromTask(Task $task): TaskLibrary
    {
        return TaskLibrary::create([
            'source' => TaskLibrary::SOURCE_TASK_LIST,
            'status' => TaskLibrary::STATUS_AVAILABLE,
            'task_name' => $task->task_name,
            'task_description' => $task->task_description,
            'task_type_id' => $task->task_type_id,
            'response_type_id' => $task->response_type_id,
            'response_num' => $task->response_num,
            'is_repeat' => $task->is_repeat,
            'repeat_config' => $task->repeat_config,
            'dept_id' => $task->dept_id,
            'task_instruction_type' => $task->task_instruction_type,
            'manual_link' => $task->manual_link,
            'photo_guidelines' => $task->photo_guidelines,
            'manual_id' => $task->manual_id,
            'comment' => $task->comment,
            'attachments' => $task->attachments,
            'created_staff_id' => $task->created_staff_id,
            'approver_id' => $task->approver_id,
            'approved_at' => Carbon::now(),
            'original_task_id' => $task->task_id,
        ]);
    }

    // ============================================
    // Helper Methods
    // ============================================

    /**
     * Add computed fields to template array
     */
    private function addComputedFields(array $template): array
    {
        $templateModel = TaskLibrary::find($template['task_library_id']);
        if (!$templateModel) {
            return $template;
        }

        $template['can_dispatch'] = $templateModel->canBeDispatched();
        $template['is_in_active_cooldown'] = $templateModel->isInActiveCooldown();
        $template['cooldown_remaining_minutes'] = $templateModel->getCooldownRemainingMinutes();
        $template['can_submit'] = $templateModel->canSubmit();

        return $template;
    }

    /**
     * Find approver for a staff member
     */
    private function findApprover(Staff $creator): ?Staff
    {
        // Same logic as TaskController
        if ($creator->line_manager_id) {
            return Staff::find($creator->line_manager_id);
        }

        $jobGrade = $creator->job_grade;

        // Try same team
        if ($creator->team_id) {
            $approver = Staff::where('team_id', $creator->team_id)
                ->where('job_grade', '>', $jobGrade)
                ->orderBy('job_grade', 'asc')
                ->first();
            if ($approver) return $approver;
        }

        // Try same department
        if ($creator->department_id) {
            $approver = Staff::where('department_id', $creator->department_id)
                ->where('job_grade', '>', $jobGrade)
                ->orderBy('job_grade', 'asc')
                ->first();
            if ($approver) return $approver;
        }

        return Staff::where('job_grade', '>', $jobGrade)
            ->orderBy('job_grade', 'asc')
            ->first();
    }

    /**
     * Check for duplicate dispatch
     */
    private function checkDuplicateDispatch(TaskLibrary $template, array $storeIds, string $startDate, string $endDate): array
    {
        // Find existing tasks from same template with overlapping dates and stores
        $existingTask = Task::where('library_task_id', $template->task_library_id)
            ->whereHas('storeAssignments', function ($q) use ($storeIds) {
                $q->whereIn('store_id', $storeIds);
            })
            ->where(function ($q) use ($startDate, $endDate) {
                // Date overlap check
                $q->where(function ($sub) use ($startDate, $endDate) {
                    $sub->where('start_date', '<=', $endDate)
                        ->where('end_date', '>=', $startDate);
                });
            })
            ->with('createdBy')
            ->first();

        if ($existingTask) {
            return [
                'has_duplicate' => true,
                'details' => [
                    'task_id' => $existingTask->task_id,
                    'task_name' => $existingTask->task_name,
                    'dispatched_by_id' => $existingTask->created_staff_id,
                    'dispatched_by_name' => $existingTask->createdBy ? ($existingTask->createdBy->first_name . ' ' . $existingTask->createdBy->last_name) : 'Unknown',
                    'dispatched_at' => $existingTask->created_at->toIso8601String(),
                    'start_date' => $existingTask->start_date,
                    'end_date' => $existingTask->end_date,
                ],
            ];
        }

        return ['has_duplicate' => false, 'details' => null];
    }

    /**
     * Check if user can override cooldown
     */
    private function canOverrideCooldown(Staff $user, TaskLibrary $template): bool
    {
        // Get highest grade in department or team
        if ($template->dept_id) {
            $highestInDept = Staff::where('department_id', $template->dept_id)
                ->orderBy('job_grade', 'desc')
                ->first();
            if ($highestInDept && $highestInDept->staff_id === $user->staff_id) {
                return true;
            }
        }

        // Also check user's own department
        $highestInUserDept = Staff::where('department_id', $user->department_id)
            ->orderBy('job_grade', 'desc')
            ->first();

        return $highestInUserDept && $highestInUserDept->staff_id === $user->staff_id;
    }

    /**
     * Create task from library template
     */
    private function createTaskFromTemplate(TaskLibrary $template, Staff $user, Request $request): Task
    {
        return Task::create([
            'source' => Task::SOURCE_LIBRARY,
            'receiver_type' => Task::RECEIVER_TYPE_STORE,
            'task_name' => $template->task_name,
            'task_description' => $template->task_description,
            'task_type_id' => $template->task_type_id,
            'response_type_id' => $template->response_type_id,
            'response_num' => $template->response_num,
            'is_repeat' => $template->is_repeat,
            'repeat_config' => $template->repeat_config,
            'dept_id' => $template->dept_id,
            'task_instruction_type' => $template->task_instruction_type,
            'manual_link' => $template->manual_link,
            'photo_guidelines' => $template->photo_guidelines,
            'manual_id' => $template->manual_id,
            'comment' => $template->comment,
            'attachments' => $template->attachments,
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
            'priority' => $request->input('priority', 'normal'),
            'created_staff_id' => $user->staff_id,
            'status_id' => 14, // APPROVED status (dispatched from library)
            'approved_at' => Carbon::now(),
            'dispatched_at' => Carbon::now(),
            'library_task_id' => $template->task_library_id,
            'task_level' => 1,
        ]);
    }
}
