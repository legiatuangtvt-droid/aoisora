<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskImage extends Model
{
    protected $table = 'task_images';
    protected $primaryKey = 'image_id';
    public $timestamps = false;

    protected $fillable = [
        'task_id',
        'store_result_id',
        'staff_result_id',
        'title',
        'image_url',
        'thumbnail_url',
        'uploaded_by_id',
        'is_completed',
        'uploaded_at',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'uploaded_at' => 'datetime',
    ];

    /**
     * Get the task this image belongs to.
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id', 'task_id');
    }

    /**
     * Get the store assignment this image relates to.
     */
    public function storeAssignment(): BelongsTo
    {
        return $this->belongsTo(TaskStoreAssignment::class, 'store_result_id', 'id');
    }

    /**
     * Get the user who uploaded this image.
     */
    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'uploaded_by_id', 'staff_id');
    }

    /**
     * Scope: Get images for a specific task
     */
    public function scopeForTask($query, int $taskId)
    {
        return $query->where('task_id', $taskId);
    }

    /**
     * Scope: Get images for a specific store assignment
     */
    public function scopeForStoreAssignment($query, int $storeResultId)
    {
        return $query->where('store_result_id', $storeResultId);
    }

    /**
     * Scope: Get completion evidence images only
     */
    public function scopeCompletionEvidence($query)
    {
        return $query->where('is_completed', true);
    }
}
