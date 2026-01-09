<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskCheckList extends Model
{
    protected $table = 'task_check_list';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'task_id',
        'check_list_id',
        'is_completed',
        'completed_at',
        'completed_by',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id', 'task_id');
    }

    public function checkList()
    {
        return $this->belongsTo(CheckList::class, 'check_list_id', 'check_list_id');
    }

    public function completedBy()
    {
        return $this->belongsTo(Staff::class, 'completed_by', 'staff_id');
    }
}
