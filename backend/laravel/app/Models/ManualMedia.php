<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManualMedia extends Model
{
    protected $table = 'manual_media';
    protected $primaryKey = 'media_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'document_id',
        'step_id',
        'media_type',
        'file_name',
        'file_path',
        'file_size',
        'mime_type',
        'thumbnail_path',
        'caption',
        'display_order',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function document()
    {
        return $this->belongsTo(ManualDocument::class, 'document_id', 'document_id');
    }

    public function step()
    {
        return $this->belongsTo(ManualStep::class, 'step_id', 'step_id');
    }

    // Get full URL for the file
    public function getUrlAttribute()
    {
        return asset('storage/' . $this->file_path);
    }

    // Get full URL for thumbnail
    public function getThumbnailUrlAttribute()
    {
        if ($this->thumbnail_path) {
            return asset('storage/' . $this->thumbnail_path);
        }
        return null;
    }
}
