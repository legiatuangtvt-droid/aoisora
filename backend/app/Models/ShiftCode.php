<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShiftCode extends Model
{
    protected $table = 'shift_codes';
    protected $primaryKey = 'shift_code_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'code',
        'name',
        'start_time',
        'end_time',
        'break_minutes',
        'color',
        'is_off_day',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_off_day' => 'boolean',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function shiftAssignments()
    {
        return $this->hasMany(ShiftAssignment::class, 'shift_code_id', 'shift_code_id');
    }

    // Calculate working hours
    public function getWorkingHoursAttribute()
    {
        if ($this->is_off_day || !$this->start_time || !$this->end_time) {
            return 0;
        }

        $start = strtotime($this->start_time);
        $end = strtotime($this->end_time);
        $totalMinutes = ($end - $start) / 60;
        $workingMinutes = $totalMinutes - ($this->break_minutes ?? 0);

        return round($workingMinutes / 60, 2);
    }
}
