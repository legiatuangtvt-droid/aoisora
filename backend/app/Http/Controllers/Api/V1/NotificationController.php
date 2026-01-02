<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class NotificationController extends Controller
{
    /**
     * Get all notifications for current user
     */
    public function index(Request $request)
    {
        $notifications = QueryBuilder::for(Notification::class)
            ->where('recipient_staff_id', $request->user()->staff_id)
            ->allowedFilters([
                AllowedFilter::exact('is_read'),
                AllowedFilter::exact('type'),
                AllowedFilter::exact('priority'),
            ])
            ->allowedSorts(['notification_id', 'created_at', 'priority'])
            ->allowedIncludes(['sender'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($notifications);
    }

    /**
     * Get single notification
     */
    public function show($id)
    {
        $notification = Notification::with(['sender'])
            ->where('recipient_staff_id', request()->user()->staff_id)
            ->findOrFail($id);

        return response()->json($notification);
    }

    /**
     * Create new notification
     */
    public function store(Request $request)
    {
        $request->validate([
            'recipient_staff_id' => 'required|exists:staff,staff_id',
            'title' => 'required|string|max:200',
            'message' => 'required|string',
            'type' => 'nullable|in:info,success,warning,error,task,shift',
            'priority' => 'nullable|in:low,normal,high,urgent',
            'action_url' => 'nullable|string',
            'data' => 'nullable|array',
        ]);

        $notification = Notification::create(array_merge(
            $request->all(),
            ['sender_staff_id' => $request->user()->staff_id]
        ));

        return response()->json($notification, 201);
    }

    /**
     * Delete notification
     */
    public function destroy($id)
    {
        $notification = Notification::where('recipient_staff_id', request()->user()->staff_id)
            ->findOrFail($id);
        $notification->delete();

        return response()->json(null, 204);
    }

    /**
     * Get unread count
     */
    public function unreadCount(Request $request)
    {
        $count = Notification::where('recipient_staff_id', $request->user()->staff_id)
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Mark as read
     */
    public function markAsRead($id)
    {
        $notification = Notification::where('recipient_staff_id', request()->user()->staff_id)
            ->findOrFail($id);

        $notification->markAsRead();

        return response()->json($notification);
    }

    /**
     * Mark all as read
     */
    public function markAllAsRead(Request $request)
    {
        Notification::where('recipient_staff_id', $request->user()->staff_id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    /**
     * Clear read notifications
     */
    public function clearRead(Request $request)
    {
        $deleted = Notification::where('recipient_staff_id', $request->user()->staff_id)
            ->where('is_read', true)
            ->delete();

        return response()->json(['message' => $deleted . ' notifications deleted']);
    }
}
