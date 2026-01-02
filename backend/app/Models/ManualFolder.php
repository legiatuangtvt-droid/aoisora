<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManualFolder extends Model
{
    protected $table = 'manual_folders';
    protected $primaryKey = 'folder_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'folder_name',
        'description',
        'parent_id',
        'color',
        'icon',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function parent()
    {
        return $this->belongsTo(ManualFolder::class, 'parent_id', 'folder_id');
    }

    public function children()
    {
        return $this->hasMany(ManualFolder::class, 'parent_id', 'folder_id');
    }

    public function documents()
    {
        return $this->hasMany(ManualDocument::class, 'folder_id', 'folder_id');
    }

    // Get all descendants recursively
    public function descendants()
    {
        return $this->children()->with('descendants');
    }

    // Get full path as array
    public function getPathAttribute()
    {
        $path = [$this];
        $parent = $this->parent;

        while ($parent) {
            array_unshift($path, $parent);
            $parent = $parent->parent;
        }

        return $path;
    }
}
