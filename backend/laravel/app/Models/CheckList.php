<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CheckList extends Model
{
    protected $table = 'check_lists';
    protected $primaryKey = 'check_list_id';
    public $timestamps = false;

    protected $fillable = [
        'check_list_name',
        'description',
        'display_order',
    ];

    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'task_check_list', 'check_list_id', 'task_id')
            ->withPivot('is_completed', 'completed_at', 'completed_by')
            ->withTimestamps();
    }
}
