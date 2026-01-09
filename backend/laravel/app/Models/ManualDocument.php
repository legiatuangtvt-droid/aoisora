<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManualDocument extends Model
{
    protected $table = 'manual_documents';
    protected $primaryKey = 'document_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'folder_id',
        'document_name',
        'description',
        'version',
        'status',
        'is_draft',
        'is_public',
        'author_id',
        'reviewer_id',
        'approved_at',
        'published_at',
        'view_count',
        'tags',
    ];

    protected $casts = [
        'is_draft' => 'boolean',
        'is_public' => 'boolean',
        'approved_at' => 'datetime',
        'published_at' => 'datetime',
        'tags' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function folder()
    {
        return $this->belongsTo(ManualFolder::class, 'folder_id', 'folder_id');
    }

    public function author()
    {
        return $this->belongsTo(Staff::class, 'author_id', 'staff_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(Staff::class, 'reviewer_id', 'staff_id');
    }

    public function steps()
    {
        return $this->hasMany(ManualStep::class, 'document_id', 'document_id')->orderBy('step_order');
    }

    public function media()
    {
        return $this->hasMany(ManualMedia::class, 'document_id', 'document_id');
    }

    public function viewLogs()
    {
        return $this->hasMany(ManualViewLog::class, 'document_id', 'document_id');
    }

    // Increment view count
    public function incrementViewCount()
    {
        $this->increment('view_count');
    }
}
