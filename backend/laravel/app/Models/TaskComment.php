<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskComment extends Model
{
    use HasFactory;

    protected $table = 'task_comments';
    protected $primaryKey = 'comment_id';

    protected $fillable = [
        'task_id',
        'store_result_id',
        'staff_result_id',
        'user_id',
        'content',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the task that this comment belongs to.
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id', 'task_id');
    }

    /**
     * Get the user who created this comment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'user_id', 'staff_id');
    }

    /**
     * Get the store assignment this comment relates to (if any).
     */
    public function storeAssignment(): BelongsTo
    {
        return $this->belongsTo(TaskStoreAssignment::class, 'store_result_id', 'id');
    }
}
