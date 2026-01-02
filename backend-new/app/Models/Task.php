<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $table = 'tasks';
    protected $primaryKey = 'task_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'task_name',
        'description',
        'task_type_id',
        'priority_id',
        'status_id',
        'frequency_id',
        'assigned_to',
        'created_by',
        'store_id',
        'department_id',
        'manual_id',
        'due_date',
        'start_time',
        'end_time',
        'duration_minutes',
        'is_recurring',
        'recurrence_pattern',
        'notes',
    ];

    protected $casts = [
        'due_date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_recurring' => 'boolean',
        'recurrence_pattern' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function taskType()
    {
        return $this->belongsTo(CodeMaster::class, 'task_type_id', 'code_id');
    }

    public function priority()
    {
        return $this->belongsTo(CodeMaster::class, 'priority_id', 'code_id');
    }

    public function status()
    {
        return $this->belongsTo(CodeMaster::class, 'status_id', 'code_id');
    }

    public function frequency()
    {
        return $this->belongsTo(CodeMaster::class, 'frequency_id', 'code_id');
    }

    public function assignedTo()
    {
        return $this->belongsTo(Staff::class, 'assigned_to', 'staff_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(Staff::class, 'created_by', 'staff_id');
    }

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'store_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }

    public function manual()
    {
        return $this->belongsTo(Manual::class, 'manual_id', 'manual_id');
    }

    public function checklists()
    {
        return $this->belongsToMany(CheckList::class, 'task_check_list', 'task_id', 'check_list_id')
            ->withPivot('is_completed', 'completed_at', 'completed_by')
            ->withTimestamps();
    }
}
