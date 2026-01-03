<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $table = 'departments';
    protected $primaryKey = 'department_id';
    public $timestamps = false;

    protected $fillable = [
        'department_name',
        'department_code',
        'description',
        'parent_id',
        'sort_order',
    ];

    protected $casts = [
        'parent_id' => 'integer',
        'sort_order' => 'integer',
    ];

    public function parent()
    {
        return $this->belongsTo(Department::class, 'parent_id', 'department_id');
    }

    public function children()
    {
        return $this->hasMany(Department::class, 'parent_id', 'department_id')
            ->orderBy('sort_order');
    }

    public function staff()
    {
        return $this->hasMany(Staff::class, 'department_id', 'department_id');
    }
}
