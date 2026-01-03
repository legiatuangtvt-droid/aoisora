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
        'task_description',
        'manual_id',
        'task_type_id',
        'response_type_id',
        'response_num',
        'is_repeat',
        'repeat_config',
        'dept_id',
        'assigned_store_id',
        'assigned_staff_id',
        'do_staff_id',
        'status_id',
        'priority',
        'start_date',
        'end_date',
        'start_time',
        'due_datetime',
        'completed_time',
        'comment',
        'attachments',
        'created_staff_id',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'start_time' => 'datetime',
        'due_datetime' => 'datetime',
        'completed_time' => 'datetime',
        'is_repeat' => 'boolean',
        'repeat_config' => 'array',
        'attachments' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function taskType()
    {
        return $this->belongsTo(CodeMaster::class, 'task_type_id', 'code_master_id');
    }

    public function responseType()
    {
        return $this->belongsTo(CodeMaster::class, 'response_type_id', 'code_master_id');
    }

    public function status()
    {
        return $this->belongsTo(CodeMaster::class, 'status_id', 'code_master_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'dept_id', 'department_id');
    }

    public function assignedStore()
    {
        return $this->belongsTo(Store::class, 'assigned_store_id', 'store_id');
    }

    public function assignedStaff()
    {
        return $this->belongsTo(Staff::class, 'assigned_staff_id', 'staff_id');
    }

    public function doStaff()
    {
        return $this->belongsTo(Staff::class, 'do_staff_id', 'staff_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(Staff::class, 'created_staff_id', 'staff_id');
    }

    public function manual()
    {
        return $this->belongsTo(ManualDocument::class, 'manual_id', 'document_id');
    }

    public function checklists()
    {
        return $this->belongsToMany(CheckList::class, 'task_check_list', 'task_id', 'check_list_id')
            ->withPivot('check_status', 'completed_at', 'completed_by', 'notes');
    }
}
