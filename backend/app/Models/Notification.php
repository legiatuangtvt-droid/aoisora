<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';
    protected $primaryKey = 'notification_id';
    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'recipient_staff_id',
        'sender_staff_id',
        'title',
        'message',
        'type',
        'priority',
        'is_read',
        'read_at',
        'action_url',
        'data',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
        'data' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function recipient()
    {
        return $this->belongsTo(Staff::class, 'recipient_staff_id', 'staff_id');
    }

    public function sender()
    {
        return $this->belongsTo(Staff::class, 'sender_staff_id', 'staff_id');
    }

    // Mark as read
    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    // Scope for unread notifications
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    // Scope for recipient
    public function scopeForRecipient($query, $staffId)
    {
        return $query->where('recipient_staff_id', $staffId);
    }
}
