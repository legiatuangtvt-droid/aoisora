<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CodeMaster extends Model
{
    protected $table = 'code_master';
    protected $primaryKey = 'code_master_id';
    public $timestamps = false;

    protected $fillable = [
        'code_type',
        'code',
        'name',
        'description',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeByType($query, $type)
    {
        return $query->where('code_type', $type)->where('is_active', true)->orderBy('sort_order');
    }
}
