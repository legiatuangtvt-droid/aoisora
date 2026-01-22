<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskStoreAssignment extends Model
{
    protected $table = 'task_store_assignments';

    /**
     * Valid status values for store execution
     */
    const STATUS_NOT_YET = 'not_yet';
    const STATUS_ON_PROGRESS = 'on_progress';
    const STATUS_DONE_PENDING = 'done_pending';
    const STATUS_DONE = 'done';
    const STATUS_UNABLE = 'unable';

    protected $fillable = [
        'task_id',
        'store_id',
        'status',
        // Timestamps
        'assigned_at',
        'started_at',
        'completed_at',
        // HQ → Store assignment
        'assigned_by',
        // Within Store assignment (Store Leader → Staff)
        'assigned_to_staff',
        'assigned_to_at',
        // Execution tracking
        'started_by',
        'completed_by',
        // HQ Check tracking
        'checked_by',
        'checked_at',
        'check_notes',
        // Unable/Notes
        'unable_reason',
        'notes',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'assigned_to_at' => 'datetime',
        'checked_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ============================================
    // Relationships
    // ============================================

    /**
     * Get the task this assignment belongs to
     */
    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id', 'task_id');
    }

    /**
     * Get the store this assignment is for
     */
    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'store_id');
    }

    /**
     * Get the HQ staff who dispatched this task to store
     */
    public function assignedBy()
    {
        return $this->belongsTo(Staff::class, 'assigned_by', 'staff_id');
    }

    /**
     * Get the staff member assigned within store (S1)
     */
    public function assignedToStaff()
    {
        return $this->belongsTo(Staff::class, 'assigned_to_staff', 'staff_id');
    }

    /**
     * Get the store user who started the task
     */
    public function startedBy()
    {
        return $this->belongsTo(Staff::class, 'started_by', 'staff_id');
    }

    /**
     * Get the store user who completed/marked unable
     */
    public function completedBy()
    {
        return $this->belongsTo(Staff::class, 'completed_by', 'staff_id');
    }

    /**
     * Get the HQ staff who checked/verified completion
     */
    public function checkedBy()
    {
        return $this->belongsTo(Staff::class, 'checked_by', 'staff_id');
    }

    /**
     * Get execution logs for this assignment
     */
    public function executionLogs()
    {
        return $this->hasMany(TaskExecutionLog::class, 'task_store_assignment_id', 'id')
            ->orderBy('performed_at', 'desc');
    }

    // ============================================
    // Helper Methods
    // ============================================

    /**
     * Check if store hasn't started yet
     */
    public function isNotYet(): bool
    {
        return $this->status === self::STATUS_NOT_YET;
    }

    /**
     * Check if store is currently working on task
     */
    public function isOnProgress(): bool
    {
        return $this->status === self::STATUS_ON_PROGRESS;
    }

    /**
     * Check if store submitted and waiting for HQ check
     */
    public function isDonePending(): bool
    {
        return $this->status === self::STATUS_DONE_PENDING;
    }

    /**
     * Check if store completed and HQ confirmed
     */
    public function isDone(): bool
    {
        return $this->status === self::STATUS_DONE;
    }

    /**
     * Check if store marked unable to complete
     */
    public function isUnable(): bool
    {
        return $this->status === self::STATUS_UNABLE;
    }

    /**
     * Check if assignment is in a final state (done or unable)
     */
    public function isFinalState(): bool
    {
        return $this->isDone() || $this->isUnable();
    }

    /**
     * Check if task has been assigned to a specific staff member
     */
    public function isAssignedToStaff(): bool
    {
        return $this->assigned_to_staff !== null;
    }

    /**
     * Check if current user can start this task
     * @param int $staffId The staff attempting to start
     * @return bool
     */
    public function canBeStartedBy(int $staffId): bool
    {
        if (!$this->isNotYet()) {
            return false;
        }

        // If assigned to specific staff, only that staff can start
        if ($this->isAssignedToStaff()) {
            return $this->assigned_to_staff === $staffId;
        }

        // Otherwise, Store Leaders (S2-S4) can start
        return true; // Permission check should be done at controller level
    }

    /**
     * Check if current user can complete this task
     * @param int $staffId The staff attempting to complete
     * @return bool
     */
    public function canBeCompletedBy(int $staffId): bool
    {
        if (!$this->isOnProgress()) {
            return false;
        }

        // If assigned to specific staff, only that staff can complete
        if ($this->isAssignedToStaff()) {
            return $this->assigned_to_staff === $staffId;
        }

        return true;
    }

    // ============================================
    // Scopes
    // ============================================

    /**
     * Scope: Get assignments for a specific task
     */
    public function scopeForTask($query, int $taskId)
    {
        return $query->where('task_id', $taskId);
    }

    /**
     * Scope: Get assignments for a specific store
     */
    public function scopeForStore($query, int $storeId)
    {
        return $query->where('store_id', $storeId);
    }

    /**
     * Scope: Get assignments with specific status
     */
    public function scopeWithStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope: Get pending assignments (not yet completed)
     */
    public function scopePending($query)
    {
        return $query->whereIn('status', [
            self::STATUS_NOT_YET,
            self::STATUS_ON_PROGRESS,
            self::STATUS_DONE_PENDING,
        ]);
    }

    /**
     * Scope: Get completed assignments (done or unable)
     */
    public function scopeCompleted($query)
    {
        return $query->whereIn('status', [
            self::STATUS_DONE,
            self::STATUS_UNABLE,
        ]);
    }

    /**
     * Scope: Get assignments waiting for HQ check
     */
    public function scopeWaitingHQCheck($query)
    {
        return $query->where('status', self::STATUS_DONE_PENDING);
    }

    /**
     * Scope: Get assignments assigned to specific staff
     */
    public function scopeAssignedToStaff($query, int $staffId)
    {
        return $query->where('assigned_to_staff', $staffId);
    }
}
