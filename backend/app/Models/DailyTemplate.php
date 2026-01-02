<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyTemplate extends Model
{
    protected $table = 'daily_templates';
    protected $primaryKey = 'template_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'template_name',
        'description',
        'day_of_week',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function shiftTemplates()
    {
        return $this->hasMany(ShiftTemplate::class, 'template_id', 'template_id');
    }
}
