<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManualViewLog extends Model
{
    protected $table = 'manual_view_logs';
    protected $primaryKey = 'log_id';
    public $timestamps = false;

    protected $fillable = [
        'document_id',
        'staff_id',
        'viewed_at',
        'duration_seconds',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'viewed_at' => 'datetime',
    ];

    public function document()
    {
        return $this->belongsTo(ManualDocument::class, 'document_id', 'document_id');
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class, 'staff_id', 'staff_id');
    }
}
