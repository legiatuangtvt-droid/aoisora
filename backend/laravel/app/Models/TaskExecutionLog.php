<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskExecutionLog extends Model
{
    protected $table = 'task_execution_logs';
    public $timestamps = false;

    /**
     * Action types
     */
    const ACTION_DISPATCHED = 'dispatched';
    const ACTION_ASSIGNED_TO_STAFF = 'assigned_to_staff';
    const ACTION_REASSIGNED = 'reassigned';
    const ACTION_UNASSIGNED = 'unassigned';
    const ACTION_STARTED = 'started';
    const ACTION_COMPLETED = 'completed';
    const ACTION_MARKED_UNABLE = 'marked_unable';
    const ACTION_HQ_CHECKED = 'hq_checked';
    const ACTION_HQ_REJECTED = 'hq_rejected';

    protected $fillable = [
        'task_store_assignment_id',
        'action',
        'performed_by',
        'performed_at',
        'old_status',
        'new_status',
        'target_staff_id',
        'notes',
    ];

    protected $casts = [
        'performed_at' => 'datetime',
    ];

    // ============================================
    // Relationships
    // ============================================

    /**
     * Get the store assignment this log belongs to
     */
    public function storeAssignment(): BelongsTo
    {
        return $this->belongsTo(TaskStoreAssignment::class, 'task_store_assignment_id', 'id');
    }

    /**
     * Get the staff who performed the action
     */
    public function performedBy(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'performed_by', 'staff_id');
    }

    /**
     * Get the target staff (for assign/reassign actions)
     */
    public function targetStaff(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'target_staff_id', 'staff_id');
    }

    // ============================================
    // Helper Methods - Action Types
    // ============================================

    /**
     * Check if this is a dispatch action
     */
    public function isDispatch(): bool
    {
        return $this->action === self::ACTION_DISPATCHED;
    }

    /**
     * Check if this is an assignment action
     */
    public function isAssignment(): bool
    {
        return in_array($this->action, [
            self::ACTION_ASSIGNED_TO_STAFF,
            self::ACTION_REASSIGNED,
            self::ACTION_UNASSIGNED,
        ]);
    }

    /**
     * Check if this is an execution action (start/complete/unable)
     */
    public function isExecution(): bool
    {
        return in_array($this->action, [
            self::ACTION_STARTED,
            self::ACTION_COMPLETED,
            self::ACTION_MARKED_UNABLE,
        ]);
    }

    /**
     * Check if this is an HQ check action
     */
    public function isHQCheck(): bool
    {
        return in_array($this->action, [
            self::ACTION_HQ_CHECKED,
            self::ACTION_HQ_REJECTED,
        ]);
    }

    // ============================================
    // Scopes
    // ============================================

    /**
     * Scope: Filter by assignment
     */
    public function scopeForAssignment($query, int $assignmentId)
    {
        return $query->where('task_store_assignment_id', $assignmentId);
    }

    /**
     * Scope: Filter by action type
     */
    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scope: Filter by performer
     */
    public function scopeByPerformer($query, int $staffId)
    {
        return $query->where('performed_by', $staffId);
    }

    /**
     * Scope: Get logs within date range
     */
    public function scopeDateRange($query, $from, $to)
    {
        return $query->whereBetween('performed_at', [$from, $to]);
    }

    /**
     * Scope: Order by most recent first
     */
    public function scopeLatestFirst($query)
    {
        return $query->orderBy('performed_at', 'desc');
    }

    // ============================================
    // Static Helper Methods for Creating Logs
    // ============================================

    /**
     * Create a dispatch log entry
     */
    public static function logDispatch(
        int $assignmentId,
        int $performedBy,
        ?string $notes = null
    ): self {
        return self::create([
            'task_store_assignment_id' => $assignmentId,
            'action' => self::ACTION_DISPATCHED,
            'performed_by' => $performedBy,
            'performed_at' => now(),
            'new_status' => TaskStoreAssignment::STATUS_NOT_YET,
            'notes' => $notes,
        ]);
    }

    /**
     * Create an assignment log entry
     */
    public static function logAssignment(
        int $assignmentId,
        int $performedBy,
        int $targetStaffId,
        ?string $notes = null
    ): self {
        return self::create([
            'task_store_assignment_id' => $assignmentId,
            'action' => self::ACTION_ASSIGNED_TO_STAFF,
            'performed_by' => $performedBy,
            'performed_at' => now(),
            'target_staff_id' => $targetStaffId,
            'notes' => $notes,
        ]);
    }

    /**
     * Create a reassignment log entry
     */
    public static function logReassignment(
        int $assignmentId,
        int $performedBy,
        int $newStaffId,
        ?int $oldStaffId = null,
        ?string $notes = null
    ): self {
        return self::create([
            'task_store_assignment_id' => $assignmentId,
            'action' => self::ACTION_REASSIGNED,
            'performed_by' => $performedBy,
            'performed_at' => now(),
            'target_staff_id' => $newStaffId,
            'notes' => $notes ?? ($oldStaffId ? "Reassigned from staff $oldStaffId to $newStaffId" : null),
        ]);
    }

    /**
     * Create an unassignment log entry
     */
    public static function logUnassignment(
        int $assignmentId,
        int $performedBy,
        int $previousStaffId,
        ?string $notes = null
    ): self {
        return self::create([
            'task_store_assignment_id' => $assignmentId,
            'action' => self::ACTION_UNASSIGNED,
            'performed_by' => $performedBy,
            'performed_at' => now(),
            'target_staff_id' => $previousStaffId,
            'notes' => $notes ?? "Unassigned from staff $previousStaffId",
        ]);
    }

    /**
     * Create a status change log entry
     */
    public static function logStatusChange(
        int $assignmentId,
        string $action,
        int $performedBy,
        string $oldStatus,
        string $newStatus,
        ?string $notes = null
    ): self {
        return self::create([
            'task_store_assignment_id' => $assignmentId,
            'action' => $action,
            'performed_by' => $performedBy,
            'performed_at' => now(),
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'notes' => $notes,
        ]);
    }
}
