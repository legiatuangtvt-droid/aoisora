<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Manual extends Model
{
    protected $table = 'manuals';
    protected $primaryKey = 'manual_id';
    public $timestamps = false;

    protected $fillable = [
        'manual_name',
        'description',
        'file_path',
        'version',
    ];

    public function tasks()
    {
        return $this->hasMany(Task::class, 'manual_id', 'manual_id');
    }
}
