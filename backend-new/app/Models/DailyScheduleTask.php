<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyScheduleTask extends Model
{
    protected $table = 'daily_schedule_tasks';
    protected $primaryKey = 'schedule_task_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'store_id',
        'work_date',
        'task_library_id',
        'task_name',
        'task_group_id',
        'assigned_staff_id',
        'scheduled_start_time',
        'scheduled_end_time',
        'actual_start_time',
        'actual_end_time',
        'status',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'work_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function assignedStaff()
    {
        return $this->belongsTo(Staff::class, 'assigned_staff_id', 'staff_id');
    }

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'store_id');
    }

    public function taskGroup()
    {
        return $this->belongsTo(TaskGroup::class, 'task_group_id', 'task_group_id');
    }

    public function taskLibrary()
    {
        return $this->belongsTo(TaskLibrary::class, 'task_library_id', 'task_library_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(Staff::class, 'created_by', 'staff_id');
    }

    // Scope for filtering by date
    public function scopeForDate($query, $date)
    {
        return $query->where('work_date', $date);
    }

    // Scope for filtering by staff
    public function scopeForStaff($query, $staffId)
    {
        return $query->where('assigned_staff_id', $staffId);
    }

    // Scope for filtering by store
    public function scopeForStore($query, $storeId)
    {
        return $query->where('store_id', $storeId);
    }
}
