<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskApprovalHistory extends Model
{
    protected $table = 'task_approval_history';

    /**
     * Step names for task workflow
     */
    const STEP_SUBMIT = 'SUBMIT';
    const STEP_APPROVE = 'APPROVE';
    const STEP_DO_TASK = 'DO_TASK';
    const STEP_CHECK = 'CHECK';

    /**
     * Step statuses
     */
    const STATUS_SUBMITTED = 'submitted';
    const STATUS_DONE = 'done';
    const STATUS_IN_PROCESS = 'in_process';
    const STATUS_REJECTED = 'rejected';
    const STATUS_PENDING = 'pending';

    /**
     * Assigned to types
     */
    const TYPE_USER = 'user';
    const TYPE_STORES = 'stores';
    const TYPE_TEAM = 'team';

    protected $fillable = [
        'task_id',
        'round_number',
        'step_number',
        'step_name',
        'step_status',
        'assigned_to_type',
        'assigned_to_id',
        'assigned_to_name',
        'assigned_to_count',
        'start_date',
        'end_date',
        'actual_start_at',
        'actual_end_at',
        'progress_done',
        'progress_total',
        'comment',
    ];

    protected $casts = [
        'round_number' => 'integer',
        'step_number' => 'integer',
        'assigned_to_id' => 'integer',
        'assigned_to_count' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
        'actual_start_at' => 'datetime',
        'actual_end_at' => 'datetime',
        'progress_done' => 'integer',
        'progress_total' => 'integer',
    ];

    /**
     * Get the task this history belongs to.
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id', 'task_id');
    }

    /**
     * Get the assigned user (if assigned_to_type is 'user').
     */
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'assigned_to_id', 'staff_id');
    }

    /**
     * Scope to get history for a specific round.
     */
    public function scopeForRound($query, int $round)
    {
        return $query->where('round_number', $round);
    }

    /**
     * Scope to get history ordered by step.
     */
    public function scopeOrderByStep($query)
    {
        return $query->orderBy('step_number');
    }

    // ============================================
    // Helper Methods
    // ============================================

    /**
     * Check if this step is the SUBMIT step
     */
    public function isSubmitStep(): bool
    {
        return $this->step_name === self::STEP_SUBMIT;
    }

    /**
     * Check if this step is the APPROVE step
     */
    public function isApproveStep(): bool
    {
        return $this->step_name === self::STEP_APPROVE;
    }

    /**
     * Check if this step is the DO_TASK step
     */
    public function isDoTaskStep(): bool
    {
        return $this->step_name === self::STEP_DO_TASK;
    }

    /**
     * Check if this step is the CHECK step
     */
    public function isCheckStep(): bool
    {
        return $this->step_name === self::STEP_CHECK;
    }

    /**
     * Check if this step is completed (done)
     */
    public function isCompleted(): bool
    {
        return $this->step_status === self::STATUS_DONE;
    }

    /**
     * Check if this step is rejected
     */
    public function isRejected(): bool
    {
        return $this->step_status === self::STATUS_REJECTED;
    }

    /**
     * Check if this step is in progress
     */
    public function isInProgress(): bool
    {
        return $this->step_status === self::STATUS_IN_PROCESS;
    }

    /**
     * Check if this step is pending (not started)
     */
    public function isPending(): bool
    {
        return $this->step_status === self::STATUS_PENDING;
    }

    /**
     * Check if assigned to stores (DO_TASK step typically)
     */
    public function isAssignedToStores(): bool
    {
        return $this->assigned_to_type === self::TYPE_STORES;
    }

    /**
     * Get progress percentage for DO_TASK step
     */
    public function getProgressPercentage(): float
    {
        if ($this->progress_total === 0) {
            return 0;
        }
        return round(($this->progress_done / $this->progress_total) * 100, 2);
    }
}
