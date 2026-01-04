<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    protected $table = 'stores';
    protected $primaryKey = 'store_id';
    public $timestamps = false;

    protected $fillable = [
        'store_name',
        'store_code',
        'region_id',
        'area_id',
        'address',
        'phone',
        'email',
        'opening_hours',
        'status',
    ];

    protected $casts = [
        'opening_hours' => 'array',
    ];

    public function region()
    {
        return $this->belongsTo(Region::class, 'region_id', 'region_id');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id', 'area_id');
    }

    public function staff()
    {
        return $this->hasMany(Staff::class, 'store_id', 'store_id');
    }

    public function shiftAssignments()
    {
        return $this->hasMany(ShiftAssignment::class, 'store_id', 'store_id');
    }
}
