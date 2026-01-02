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
        'staff_id',
        'store_id',
        'work_date',
        'group_id',
        'task_name',
        'description',
        'start_time',
        'end_time',
        'status',
        'priority',
        'notes',
        'completed_at',
    ];

    protected $casts = [
        'work_date' => 'date',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class, 'staff_id', 'staff_id');
    }

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'store_id');
    }

    public function group()
    {
        return $this->belongsTo(TaskGroup::class, 'group_id', 'group_id');
    }

    // Scope for filtering by date
    public function scopeForDate($query, $date)
    {
        return $query->where('work_date', $date);
    }

    // Scope for filtering by staff
    public function scopeForStaff($query, $staffId)
    {
        return $query->where('staff_id', $staffId);
    }

    // Scope for filtering by store
    public function scopeForStore($query, $storeId)
    {
        return $query->where('store_id', $storeId);
    }
}
