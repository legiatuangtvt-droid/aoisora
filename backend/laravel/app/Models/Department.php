<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $table = 'departments';
    protected $primaryKey = 'department_id';
    public $timestamps = false;

    protected $fillable = [
        'department_name',
        'department_code',
        'description',
        'parent_id',
        'sort_order',
        'icon',
        'icon_color',
        'icon_bg',
        'is_active',
    ];

    protected $casts = [
        'parent_id' => 'integer',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function parent()
    {
        return $this->belongsTo(Department::class, 'parent_id', 'department_id');
    }

    public function children()
    {
        return $this->hasMany(Department::class, 'parent_id', 'department_id')
            ->orderBy('sort_order');
    }

    public function staff()
    {
        return $this->hasMany(Staff::class, 'department_id', 'department_id');
    }

    public function teams()
    {
        return $this->hasMany(Team::class, 'department_id', 'department_id')
            ->orderBy('sort_order');
    }

    /**
     * Get head of department (highest job grade staff)
     */
    public function head()
    {
        return $this->hasOne(Staff::class, 'department_id', 'department_id')
            ->orderByRaw("CASE
                WHEN job_grade = 'G8' THEN 1
                WHEN job_grade = 'G7' THEN 2
                WHEN job_grade = 'G6' THEN 3
                WHEN job_grade = 'G5' THEN 4
                WHEN job_grade = 'G4' THEN 5
                WHEN job_grade = 'G3' THEN 6
                WHEN job_grade = 'G2' THEN 7
                WHEN job_grade = 'G1' THEN 8
                ELSE 9
            END");
    }

    /**
     * Get grade range string for department members
     */
    public function getGradeRangeAttribute(): string
    {
        $grades = $this->staff()
            ->whereNotNull('job_grade')
            ->distinct()
            ->pluck('job_grade')
            ->sort()
            ->values()
            ->toArray();

        return implode(' & ', $grades);
    }

    /**
     * Get member count
     */
    public function getMemberCountAttribute(): int
    {
        return $this->staff()->count();
    }
}
