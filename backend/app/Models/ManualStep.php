<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManualStep extends Model
{
    protected $table = 'manual_steps';
    protected $primaryKey = 'step_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'document_id',
        'step_order',
        'step_title',
        'content',
        'notes',
        'warning_text',
        'is_critical',
    ];

    protected $casts = [
        'is_critical' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function document()
    {
        return $this->belongsTo(ManualDocument::class, 'document_id', 'document_id');
    }

    public function media()
    {
        return $this->hasMany(ManualMedia::class, 'step_id', 'step_id');
    }
}
