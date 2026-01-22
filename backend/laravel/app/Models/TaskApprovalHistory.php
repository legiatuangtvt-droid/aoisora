<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskApprovalHistory extends Model
{
    protected $table = 'task_approval_history';

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
}
