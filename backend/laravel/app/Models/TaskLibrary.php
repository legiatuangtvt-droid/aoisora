<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskLibrary extends Model
{
    protected $table = 'task_library';
    protected $primaryKey = 'library_task_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'group_id',
        'task_name',
        'description',
        'default_duration_minutes',
        'default_priority',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function group()
    {
        return $this->belongsTo(TaskGroup::class, 'group_id', 'group_id');
    }
}
