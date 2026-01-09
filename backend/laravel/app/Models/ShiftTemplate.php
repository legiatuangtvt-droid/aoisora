<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShiftTemplate extends Model
{
    protected $table = 'shift_templates';
    protected $primaryKey = 'shift_template_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'template_id',
        'shift_code_id',
        'staff_count',
        'notes',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function template()
    {
        return $this->belongsTo(DailyTemplate::class, 'template_id', 'template_id');
    }

    public function shiftCode()
    {
        return $this->belongsTo(ShiftCode::class, 'shift_code_id', 'shift_code_id');
    }
}
