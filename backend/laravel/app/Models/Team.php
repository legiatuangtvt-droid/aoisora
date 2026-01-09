<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $table = 'teams';
    protected $primaryKey = 'team_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'team_id',
        'team_name',
        'department_id',
        'icon',
        'icon_color',
        'icon_bg',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'department_id' => 'integer',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }

    public function members()
    {
        return $this->hasMany(Staff::class, 'team_id', 'team_id');
    }

    /**
     * Get grade range string for team members
     */
    public function getGradeRangeAttribute(): string
    {
        $grades = $this->members()
            ->whereNotNull('job_grade')
            ->distinct()
            ->pluck('job_grade')
            ->sort()
            ->values()
            ->toArray();

        return implode(' & ', $grades);
    }
}
