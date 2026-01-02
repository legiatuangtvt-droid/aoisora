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
        'description',
    ];

    public function staff()
    {
        return $this->hasMany(Staff::class, 'department_id', 'department_id');
    }
}
