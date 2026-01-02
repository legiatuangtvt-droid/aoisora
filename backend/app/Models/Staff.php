<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class Staff extends Authenticatable
{
    use HasApiTokens, Notifiable, HasRoles;

    protected $table = 'staff';
    protected $primaryKey = 'staff_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'staff_code',
        'username',
        'password_hash',
        'full_name',
        'email',
        'phone',
        'store_id',
        'department_id',
        'position',
        'role',
        'avatar_url',
        'status',
        'hire_date',
        'contract_type',
        'hourly_rate',
        'skills',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected $casts = [
        'skills' => 'array',
        'hire_date' => 'date',
        'hourly_rate' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Laravel Sanctum uses 'password' column by default
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'store_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }

    public function shiftAssignments()
    {
        return $this->hasMany(ShiftAssignment::class, 'staff_id', 'staff_id');
    }

    public function dailyScheduleTasks()
    {
        return $this->hasMany(DailyScheduleTask::class, 'staff_id', 'staff_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'recipient_staff_id', 'staff_id');
    }

    public function sentNotifications()
    {
        return $this->hasMany(Notification::class, 'sender_staff_id', 'staff_id');
    }
}
