<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskLibrary extends Model
{
    protected $table = 'task_library';
    protected $primaryKey = 'task_library_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'task_name',
        'task_description',
        'task_group_id',
        'estimated_minutes',
        'priority',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function taskGroup()
    {
        return $this->belongsTo(TaskGroup::class, 'task_group_id', 'task_group_id');
    }

    public function dailyScheduleTasks()
    {
        return $this->hasMany(DailyScheduleTask::class, 'task_library_id', 'task_library_id');
    }
}
