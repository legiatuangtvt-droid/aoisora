<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    protected $table = 'zones';
    protected $primaryKey = 'zone_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'zone_name',
        'zone_code',
        'region_id',
        'description',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'region_id' => 'integer',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function region()
    {
        return $this->belongsTo(Region::class, 'region_id', 'region_id');
    }

    public function areas()
    {
        return $this->hasMany(Area::class, 'zone_id', 'zone_id');
    }

    public function stores()
    {
        return $this->hasManyThrough(
            Store::class,
            Area::class,
            'zone_id',   // FK on areas table
            'area_id',   // FK on stores table
            'zone_id',   // Local key on zones table
            'area_id'    // Local key on areas table
        );
    }
}
