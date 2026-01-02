<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShiftAssignment extends Model
{
    protected $table = 'shift_assignments';
    protected $primaryKey = 'shift_assignment_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'staff_id',
        'store_id',
        'shift_code_id',
        'work_date',
        'actual_start_time',
        'actual_end_time',
        'status',
        'notes',
    ];

    protected $casts = [
        'work_date' => 'date',
        'actual_start_time' => 'datetime',
        'actual_end_time' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class, 'staff_id', 'staff_id');
    }

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'store_id');
    }

    public function shiftCode()
    {
        return $this->belongsTo(ShiftCode::class, 'shift_code_id', 'shift_code_id');
    }

    // Scope for filtering by date range
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('work_date', [$startDate, $endDate]);
    }

    // Scope for filtering by store
    public function scopeForStore($query, $storeId)
    {
        return $query->where('store_id', $storeId);
    }
}
