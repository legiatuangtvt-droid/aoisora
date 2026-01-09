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
        'region_id',
        'manager_id',
        'description',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function region()
    {
        return $this->belongsTo(Region::class, 'region_id', 'region_id');
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
