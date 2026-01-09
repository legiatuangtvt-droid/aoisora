<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskGroup extends Model
{
    protected $table = 'task_groups';
    protected $primaryKey = 'group_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'group_name',
        'color',
        'icon',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function dailyScheduleTasks()
    {
        return $this->hasMany(DailyScheduleTask::class, 'group_id', 'group_id');
    }

    public function taskLibrary()
    {
        return $this->hasMany(TaskLibrary::class, 'group_id', 'group_id');
    }
}
