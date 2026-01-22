<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TaskLibrary extends Model
{
    protected $table = 'task_library';
    protected $primaryKey = 'task_library_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    /**
     * Source values (which flow created this template)
     */
    const SOURCE_TASK_LIST = 'task_list';
    const SOURCE_LIBRARY = 'library';

    /**
     * Status values for Library templates
     */
    const STATUS_DRAFT = 'draft';
    const STATUS_APPROVE = 'approve';
    const STATUS_AVAILABLE = 'available';
    const STATUS_COOLDOWN = 'cooldown';

    /**
     * Task instruction types
     */
    const INSTRUCTION_TYPE_IMAGE = 'image';
    const INSTRUCTION_TYPE_DOCUMENT = 'document';

    /**
     * Maximum number of rejections allowed
     */
    const MAX_REJECTIONS = 3;

    protected $fillable = [
        // Source & Status
        'source',
        'status',
        // A. Information
        'task_name',
        'task_description',
        'task_type_id',
        'response_type_id',
        'response_num',
        'is_repeat',
        'repeat_config',
        'dept_id',
        // B. Instructions
        'task_instruction_type',
        'manual_link',
        'photo_guidelines',
        'manual_id',
        'comment',
        'attachments',
        // Creator & Approval
        'created_staff_id',
        'approver_id',
        'submitted_at',
        'approved_at',
        // Rejection tracking
        'rejection_count',
        'has_changes_since_rejection',
        'last_rejection_reason',
        'last_rejected_at',
        'last_rejected_by',
        // Dispatch tracking
        'dispatch_count',
        'last_dispatched_at',
        'last_dispatched_by',
        // Cooldown
        'cooldown_until',
        'cooldown_triggered_by',
        'cooldown_triggered_at',
        // Issue tracking
        'had_issues',
        'issues_note',
        // Original task link
        'original_task_id',
    ];

    protected $casts = [
        // Booleans
        'is_repeat' => 'boolean',
        'has_changes_since_rejection' => 'boolean',
        'had_issues' => 'boolean',
        // JSON
        'repeat_config' => 'array',
        'photo_guidelines' => 'array',
        'attachments' => 'array',
        // Integers
        'rejection_count' => 'integer',
        'dispatch_count' => 'integer',
        // Datetimes
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime',
        'last_rejected_at' => 'datetime',
        'last_dispatched_at' => 'datetime',
        'cooldown_until' => 'datetime',
        'cooldown_triggered_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ============================================
    // Relationships
    // ============================================

    /**
     * Get the task type (CodeMaster)
     */
    public function taskType(): BelongsTo
    {
        return $this->belongsTo(CodeMaster::class, 'task_type_id', 'code_master_id');
    }

    /**
     * Get the response type (CodeMaster)
     */
    public function responseType(): BelongsTo
    {
        return $this->belongsTo(CodeMaster::class, 'response_type_id', 'code_master_id');
    }

    /**
     * Get the department
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'dept_id', 'department_id');
    }

    /**
     * Get the manual document
     */
    public function manual(): BelongsTo
    {
        return $this->belongsTo(ManualDocument::class, 'manual_id', 'document_id');
    }

    /**
     * Get the creator staff
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'created_staff_id', 'staff_id');
    }

    /**
     * Get the approver staff
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'approver_id', 'staff_id');
    }

    /**
     * Get the staff who last rejected this template
     */
    public function lastRejectedBy(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'last_rejected_by', 'staff_id');
    }

    /**
     * Get the staff who last dispatched this template
     */
    public function lastDispatchedBy(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'last_dispatched_by', 'staff_id');
    }

    /**
     * Get the staff who triggered cooldown
     */
    public function cooldownTriggeredBy(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'cooldown_triggered_by', 'staff_id');
    }

    /**
     * Get the original task (if auto-saved from Task List)
     */
    public function originalTask(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'original_task_id', 'task_id');
    }

    /**
     * Get all tasks created from this library template
     */
    public function dispatchedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'library_task_id', 'task_library_id');
    }

    // ============================================
    // Helper Methods - Source
    // ============================================

    /**
     * Check if template was auto-saved from Task List
     */
    public function isFromTaskList(): bool
    {
        return $this->source === self::SOURCE_TASK_LIST;
    }

    /**
     * Check if template was created directly in Library
     */
    public function isFromLibrary(): bool
    {
        return $this->source === self::SOURCE_LIBRARY;
    }

    // ============================================
    // Helper Methods - Status
    // ============================================

    /**
     * Check if template is in draft status
     */
    public function isDraft(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    /**
     * Check if template is pending approval
     */
    public function isPendingApproval(): bool
    {
        return $this->status === self::STATUS_APPROVE;
    }

    /**
     * Check if template is available for dispatch
     */
    public function isAvailable(): bool
    {
        return $this->status === self::STATUS_AVAILABLE;
    }

    /**
     * Check if template is in cooldown
     */
    public function isInCooldown(): bool
    {
        return $this->status === self::STATUS_COOLDOWN;
    }

    /**
     * Check if template can be dispatched
     */
    public function canBeDispatched(): bool
    {
        return $this->isAvailable() && !$this->isInActiveCooldown();
    }

    // ============================================
    // Helper Methods - Cooldown
    // ============================================

    /**
     * Check if cooldown is still active
     */
    public function isInActiveCooldown(): bool
    {
        if ($this->cooldown_until === null) {
            return false;
        }
        return $this->cooldown_until->isFuture();
    }

    /**
     * Get remaining cooldown time in minutes
     */
    public function getCooldownRemainingMinutes(): int
    {
        if (!$this->isInActiveCooldown()) {
            return 0;
        }
        return now()->diffInMinutes($this->cooldown_until);
    }

    /**
     * Clear cooldown (when cooldown expires)
     */
    public function clearCooldown(): void
    {
        $this->update([
            'status' => self::STATUS_AVAILABLE,
            'cooldown_until' => null,
            'cooldown_triggered_by' => null,
            'cooldown_triggered_at' => null,
        ]);
    }

    // ============================================
    // Helper Methods - Instruction Type
    // ============================================

    /**
     * Check if instruction type is Image
     */
    public function isImageInstruction(): bool
    {
        return $this->task_instruction_type === self::INSTRUCTION_TYPE_IMAGE;
    }

    /**
     * Check if instruction type is Document
     */
    public function isDocumentInstruction(): bool
    {
        return $this->task_instruction_type === self::INSTRUCTION_TYPE_DOCUMENT;
    }

    // ============================================
    // Helper Methods - Rejection
    // ============================================

    /**
     * Check if max rejections reached
     */
    public function isMaxRejectionsReached(): bool
    {
        return $this->rejection_count >= self::MAX_REJECTIONS;
    }

    /**
     * Check if template can be submitted (after rejection)
     */
    public function canSubmit(): bool
    {
        // Cannot submit if already submitted or approved
        if ($this->submitted_at !== null && $this->status !== self::STATUS_DRAFT) {
            return false;
        }

        // Cannot submit if max rejections reached
        if ($this->isMaxRejectionsReached()) {
            return false;
        }

        // If was rejected, must have changes before resubmit
        if ($this->rejection_count > 0 && !$this->has_changes_since_rejection) {
            return false;
        }

        return true;
    }

    // ============================================
    // Helper Methods - Issues
    // ============================================

    /**
     * Check if this template had issues before
     */
    public function hasHadIssues(): bool
    {
        return $this->had_issues;
    }

    /**
     * Mark template as having had issues (when dispatched task is paused)
     */
    public function markAsHadIssues(string $note = null): void
    {
        $this->update([
            'had_issues' => true,
            'issues_note' => $note,
        ]);
    }

    // ============================================
    // Scopes
    // ============================================

    /**
     * Scope: Filter by source
     */
    public function scopeBySource($query, string $source)
    {
        return $query->where('source', $source);
    }

    /**
     * Scope: Filter by status
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope: Get available templates
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', self::STATUS_AVAILABLE);
    }

    /**
     * Scope: Get templates in cooldown
     */
    public function scopeInCooldown($query)
    {
        return $query->where('status', self::STATUS_COOLDOWN)
            ->where('cooldown_until', '>', now());
    }

    /**
     * Scope: Get templates with expired cooldown
     */
    public function scopeExpiredCooldown($query)
    {
        return $query->where('status', self::STATUS_COOLDOWN)
            ->where('cooldown_until', '<=', now());
    }

    /**
     * Scope: Get drafts for a specific user
     */
    public function scopeDraftsFor($query, int $staffId)
    {
        return $query->where('created_staff_id', $staffId)
            ->where('status', self::STATUS_DRAFT);
    }

    /**
     * Scope: Get templates pending approval for an approver
     */
    public function scopePendingApprovalFor($query, int $approverId)
    {
        return $query->where('approver_id', $approverId)
            ->where('status', self::STATUS_APPROVE);
    }

    /**
     * Scope: Get templates by department
     */
    public function scopeByDepartment($query, int $deptId)
    {
        return $query->where('dept_id', $deptId);
    }

    /**
     * Scope: Get templates that had issues
     */
    public function scopeWithIssues($query)
    {
        return $query->where('had_issues', true);
    }
}
