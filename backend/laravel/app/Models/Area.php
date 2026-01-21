<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    protected $table = 'areas';
    protected $primaryKey = 'area_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'area_code',
        'area_name',
        'area_name_vi',
        'zone_id',
        'manager_id',
        'description',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'zone_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function zone()
    {
        return $this->belongsTo(Zone::class, 'zone_id', 'zone_id');
    }

    /**
     * Get region through zone
     */
    public function region()
    {
        return $this->hasOneThrough(
            Region::class,
            Zone::class,
            'zone_id',    // FK on zones table
            'region_id',  // FK on regions table
            'zone_id',    // Local key on areas table
            'region_id'   // Local key on zones table
        );
    }

    public function stores()
    {
        return $this->hasMany(Store::class, 'area_id', 'area_id');
    }

    public function manager()
    {
        return $this->belongsTo(Staff::class, 'manager_id', 'staff_id');
    }
}
