<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $table = 'tasks';
    protected $primaryKey = 'task_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        // Task hierarchy (max 5 levels)
        'parent_task_id',
        'task_level',
        // Source tracking (3 creation flows)
        'source',
        'receiver_type',
        // Note: C. Scope (store_ids) is stored in task_store_assignments table, not here
        // Basic task info
        'task_name',
        'task_description',
        // A. Information section
        'frequency_type',  // yearly, quarterly, monthly, weekly, daily
        'execution_time',  // 30min, 1hour, 2hours, etc.
        // B. Instructions section
        'task_instruction_type',
        'manual_link',
        'photo_guidelines',
        'manual_id',
        'task_type_id',
        'response_type_id',
        'response_num',
        'is_repeat',
        'repeat_config',
        'dept_id',
        'assigned_store_id',
        'assigned_staff_id',
        'do_staff_id',
        'status_id',
        'priority',
        'start_date',
        'end_date',
        'start_time',
        'due_datetime',
        'completed_time',
        'comment',
        'attachments',
        // Creator and Approver
        'created_staff_id',
        'approver_id',
        // Rejection tracking
        'rejection_count',
        'has_changes_since_rejection',
        'last_rejection_reason',
        'last_rejected_at',
        'last_rejected_by',
        // Library task link
        'library_task_id',
        // Workflow timestamps
        'submitted_at',
        'approved_at',
        'dispatched_at',
        // Pause workflow
        'paused_at',
        'paused_by',
    ];

    /**
     * Valid source values for task creation flows
     */
    const SOURCE_TASK_LIST = 'task_list';
    const SOURCE_LIBRARY = 'library';
    const SOURCE_TODO_TASK = 'todo_task';

    /**
     * Valid receiver type values
     */
    const RECEIVER_TYPE_STORE = 'store';
    const RECEIVER_TYPE_HQ_USER = 'hq_user';

    /**
     * Maximum number of rejections allowed
     */
    const MAX_REJECTIONS = 3;

    /**
     * Valid task instruction types
     */
    const INSTRUCTION_TYPE_IMAGE = 'image';
    const INSTRUCTION_TYPE_DOCUMENT = 'document';

    protected $casts = [
        // Task hierarchy
        'parent_task_id' => 'integer',
        'task_level' => 'integer',
        // Note: C. Scope (store_ids) is stored in task_store_assignments table, not here
        // B. Instructions
        'photo_guidelines' => 'array',
        // Dates
        'start_date' => 'date',
        'end_date' => 'date',
        'start_time' => 'datetime',
        'due_datetime' => 'datetime',
        'completed_time' => 'datetime',
        'is_repeat' => 'boolean',
        'repeat_config' => 'array',
        'attachments' => 'array',
        // Rejection tracking
        'rejection_count' => 'integer',
        'has_changes_since_rejection' => 'boolean',
        'last_rejected_at' => 'datetime',
        // Workflow timestamps
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime',
        'dispatched_at' => 'datetime',
        // Pause workflow
        'paused_at' => 'datetime',
        'paused_by' => 'integer',
        // Audit timestamps
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function taskType()
    {
        return $this->belongsTo(CodeMaster::class, 'task_type_id', 'code_master_id');
    }

    public function responseType()
    {
        return $this->belongsTo(CodeMaster::class, 'response_type_id', 'code_master_id');
    }

    public function status()
    {
        return $this->belongsTo(CodeMaster::class, 'status_id', 'code_master_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'dept_id', 'department_id');
    }

    public function assignedStore()
    {
        return $this->belongsTo(Store::class, 'assigned_store_id', 'store_id');
    }

    public function assignedStaff()
    {
        return $this->belongsTo(Staff::class, 'assigned_staff_id', 'staff_id');
    }

    public function doStaff()
    {
        return $this->belongsTo(Staff::class, 'do_staff_id', 'staff_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(Staff::class, 'created_staff_id', 'staff_id');
    }

    public function approver()
    {
        return $this->belongsTo(Staff::class, 'approver_id', 'staff_id');
    }

    public function lastRejectedBy()
    {
        return $this->belongsTo(Staff::class, 'last_rejected_by', 'staff_id');
    }

    public function pausedBy()
    {
        return $this->belongsTo(Staff::class, 'paused_by', 'staff_id');
    }

    public function libraryTask()
    {
        return $this->belongsTo(TaskLibrary::class, 'library_task_id', 'task_library_id');
    }

    public function manual()
    {
        return $this->belongsTo(ManualDocument::class, 'manual_id', 'document_id');
    }

    public function checklists()
    {
        return $this->belongsToMany(CheckList::class, 'task_check_list', 'task_id', 'check_list_id')
            ->withPivot('check_status', 'completed_at', 'completed_by', 'notes');
    }

    /**
     * Get the approval history for this task
     */
    public function approvalHistory()
    {
        return $this->hasMany(TaskApprovalHistory::class, 'task_id', 'task_id')
            ->orderBy('round_number')
            ->orderBy('step_number');
    }

    /**
     * Get store assignments for this task
     * (Only for dispatched tasks with receiver_type = 'store')
     */
    public function storeAssignments()
    {
        return $this->hasMany(TaskStoreAssignment::class, 'task_id', 'task_id');
    }

    /**
     * Get store assignments with specific status
     */
    public function storeAssignmentsByStatus(string $status)
    {
        return $this->storeAssignments()->where('status', $status);
    }

    /**
     * Get count of store assignments by status
     */
    public function getStoreStatusCounts(): array
    {
        return [
            'not_yet' => $this->storeAssignments()->where('status', TaskStoreAssignment::STATUS_NOT_YET)->count(),
            'on_progress' => $this->storeAssignments()->where('status', TaskStoreAssignment::STATUS_ON_PROGRESS)->count(),
            'done_pending' => $this->storeAssignments()->where('status', TaskStoreAssignment::STATUS_DONE_PENDING)->count(),
            'done' => $this->storeAssignments()->where('status', TaskStoreAssignment::STATUS_DONE)->count(),
            'unable' => $this->storeAssignments()->where('status', TaskStoreAssignment::STATUS_UNABLE)->count(),
            'total' => $this->storeAssignments()->count(),
        ];
    }

    // ============================================
    // Task Hierarchy Relationships (max 5 levels)
    // ============================================

    /**
     * Get the parent task (if this is a sub-task)
     */
    public function parentTask()
    {
        return $this->belongsTo(Task::class, 'parent_task_id', 'task_id');
    }

    /**
     * Get direct children (sub-tasks at next level)
     */
    public function children()
    {
        return $this->hasMany(Task::class, 'parent_task_id', 'task_id');
    }

    /**
     * Get all descendants recursively (all sub-tasks at all levels)
     * Use with caution on large datasets
     */
    public function allDescendants()
    {
        return $this->children()->with('allDescendants');
    }

    /**
     * Check if this task is a parent (level 1)
     */
    public function isParentTask(): bool
    {
        return $this->task_level === 1 || $this->parent_task_id === null;
    }

    /**
     * Check if this task is a sub-task (level 2-5)
     */
    public function isSubTask(): bool
    {
        return $this->task_level > 1 && $this->parent_task_id !== null;
    }

    /**
     * Check if can add more sub-tasks (max depth is 5)
     */
    public function canHaveChildren(): bool
    {
        return $this->task_level < 5;
    }

    /**
     * Get the root parent task (level 1)
     */
    public function getRootTask(): Task
    {
        if ($this->isParentTask()) {
            return $this;
        }

        $parent = $this->parentTask;
        while ($parent && $parent->parent_task_id !== null) {
            $parent = $parent->parentTask;
        }

        return $parent ?? $this;
    }

    /**
     * Scope: Get only parent tasks (level 1)
     */
    public function scopeParentTasks($query)
    {
        return $query->whereNull('parent_task_id')->orWhere('task_level', 1);
    }

    /**
     * Scope: Get sub-tasks for a parent task
     */
    public function scopeSubTasksOf($query, int $parentTaskId)
    {
        return $query->where('parent_task_id', $parentTaskId);
    }

    // ============================================
    // Helper Methods for Draft & Approval Flow
    // ============================================

    /**
     * Check if task can be submitted (validation passed)
     */
    public function canSubmit(): bool
    {
        // Cannot submit if already submitted or approved
        if ($this->submitted_at !== null) {
            return false;
        }

        // Cannot submit if max rejections reached
        if ($this->rejection_count >= self::MAX_REJECTIONS) {
            return false;
        }

        // If was rejected, must have changes before resubmit
        if ($this->rejection_count > 0 && !$this->has_changes_since_rejection) {
            return false;
        }

        return true;
    }

    /**
     * Check if max rejection limit reached
     */
    public function isMaxRejectionsReached(): bool
    {
        return $this->rejection_count >= self::MAX_REJECTIONS;
    }

    /**
     * Check if task is from Task List flow
     */
    public function isFromTaskList(): bool
    {
        return $this->source === self::SOURCE_TASK_LIST;
    }

    /**
     * Check if task is from Library flow
     */
    public function isFromLibrary(): bool
    {
        return $this->source === self::SOURCE_LIBRARY;
    }

    /**
     * Check if task is from To Do Task flow
     */
    public function isFromTodoTask(): bool
    {
        return $this->source === self::SOURCE_TODO_TASK;
    }

    /**
     * Check if task receiver is Store
     */
    public function isForStore(): bool
    {
        return $this->receiver_type === self::RECEIVER_TYPE_STORE;
    }

    /**
     * Check if task receiver is HQ User
     */
    public function isForHQUser(): bool
    {
        return $this->receiver_type === self::RECEIVER_TYPE_HQ_USER;
    }

    // ============================================
    // Helper Methods for Instruction Type
    // ============================================

    /**
     * Check if task instruction type is Image (requires photo guidelines)
     */
    public function isImageInstruction(): bool
    {
        return $this->task_instruction_type === self::INSTRUCTION_TYPE_IMAGE;
    }

    /**
     * Check if task instruction type is Document (requires note)
     */
    public function isDocumentInstruction(): bool
    {
        return $this->task_instruction_type === self::INSTRUCTION_TYPE_DOCUMENT;
    }

    // ============================================
    // Helper Methods for Pause Workflow
    // ============================================

    /**
     * Check if task is currently paused
     */
    public function isPaused(): bool
    {
        return $this->paused_at !== null;
    }

    /**
     * Check if task can be paused (by approver)
     * Task can only be paused when in NOT_YET or ON_PROGRESS status
     * and no store has completed (done or done_pending)
     */
    public function canBePaused(): bool
    {
        // Can only pause dispatched tasks (not drafts, not done)
        return $this->dispatched_at !== null
            && $this->paused_at === null
            && !$this->isCompleted();
    }

    /**
     * Check if task is completed (all stores done or unable)
     */
    public function isCompleted(): bool
    {
        $counts = $this->getStoreStatusCounts();
        if ($counts['total'] === 0) {
            return false;
        }
        // All stores are in final state (done or unable)
        return ($counts['done'] + $counts['unable']) === $counts['total'];
    }

    // ============================================
    // Calculated Status Methods (CLAUDE.md Section 12.4-12.5)
    // ============================================

    /**
     * Overall status values for task (calculated from store statuses)
     * These are different from code_master status_id which is workflow status
     */
    const OVERALL_NOT_YET = 'not_yet';
    const OVERALL_ON_PROGRESS = 'on_progress';
    const OVERALL_DONE = 'done';
    const OVERALL_OVERDUE = 'overdue';

    /**
     * Calculate overall task status from store assignment statuses
     *
     * Rules (from CLAUDE.md Section 12.4):
     * - NOT YET: All stores = not_yet
     * - ON PROGRESS: At least 1 store is on_progress or done_pending (and no overdue)
     * - DONE: All stores = done or unable
     * - OVERDUE: end_date < today AND task not done (has stores not in final state)
     *
     * @return string|null Overall status or null if task has no store assignments
     */
    public function getCalculatedStatus(): ?string
    {
        // Only calculate for dispatched tasks with store assignments
        if (!$this->dispatched_at || $this->receiver_type !== self::RECEIVER_TYPE_STORE) {
            return null;
        }

        $counts = $this->getStoreStatusCounts();

        // No assignments yet
        if ($counts['total'] === 0) {
            return null;
        }

        // done_pending = store completed work (waiting HQ check), count as "completed" not "in progress"
        $completedCount = $counts['done'] + $counts['done_pending'] + $counts['unable'];

        // Check DONE: All stores have completed (done/done_pending/unable)
        if ($completedCount === $counts['total']) {
            return self::OVERALL_DONE;
        }

        // Check OVERDUE: end_date < today AND not all completed
        if ($this->end_date && $this->end_date->lt(now()->startOfDay())) {
            return self::OVERALL_OVERDUE;
        }

        // Check ON PROGRESS: At least 1 store is actively working (on_progress only)
        // done_pending is NOT "in progress" - store has finished their work
        if ($counts['on_progress'] > 0) {
            return self::OVERALL_ON_PROGRESS;
        }

        // Default: NOT YET (all stores are not_yet)
        return self::OVERALL_NOT_YET;
    }

    /**
     * Get store progress statistics for this task
     *
     * @return array Progress statistics
     */
    public function getStoreProgress(): array
    {
        $counts = $this->getStoreStatusCounts();

        if ($counts['total'] === 0) {
            return [
                'not_yet' => 0,
                'on_progress' => 0,
                'done_pending' => 0,
                'done' => 0,
                'unable' => 0,
                'overdue' => 0,
                'total' => 0,
                'completed_count' => 0,
                'completion_rate' => 0,
            ];
        }

        $completedCount = $counts['done'] + $counts['unable'];

        // Calculate overdue stores: stores with not_yet or on_progress when task is past end_date
        $overdueCount = 0;
        if ($this->end_date && $this->end_date->lt(now()->startOfDay())) {
            // Task is overdue - count stores that haven't completed
            $overdueCount = $counts['not_yet'] + $counts['on_progress'];
        }

        return array_merge($counts, [
            'overdue' => $overdueCount,
            'completed_count' => $completedCount,
            'completion_rate' => round(($completedCount / $counts['total']) * 100, 1),
        ]);
    }

    /**
     * Check if task is overdue
     */
    public function isOverdue(): bool
    {
        return $this->getCalculatedStatus() === self::OVERALL_OVERDUE;
    }

    /**
     * Check if task has any store in progress
     */
    public function isInProgress(): bool
    {
        return $this->getCalculatedStatus() === self::OVERALL_ON_PROGRESS;
    }

    /**
     * Check if task is not started yet (all stores not_yet)
     */
    public function isNotYet(): bool
    {
        return $this->getCalculatedStatus() === self::OVERALL_NOT_YET;
    }

    /**
     * Scope: Filter by source (creation flow)
     */
    public function scopeBySource($query, string $source)
    {
        return $query->where('source', $source);
    }

    /**
     * Scope: Get drafts for a specific user and source
     */
    public function scopeDraftsFor($query, int $staffId, string $source, int $draftStatusId)
    {
        return $query->where('created_staff_id', $staffId)
            ->where('source', $source)
            ->where('status_id', $draftStatusId);
    }

    /**
     * Scope: Get tasks pending approval for an approver
     */
    public function scopePendingApprovalFor($query, int $approverId, int $approveStatusId)
    {
        return $query->where('approver_id', $approverId)
            ->where('status_id', $approveStatusId);
    }
}
