<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    protected $table = 'regions';
    protected $primaryKey = 'region_id';
    public $timestamps = false;

    protected $fillable = [
        'region_name',
        'description',
    ];

    public function stores()
    {
        return $this->hasMany(Store::class, 'region_id', 'region_id');
    }
}
