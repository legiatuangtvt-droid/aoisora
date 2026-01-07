<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Task $task;
    public string $action;

    /**
     * Create a new event instance.
     *
     * @param Task $task The task that was updated
     * @param string $action The action type: 'created', 'updated', 'deleted', 'status_changed'
     */
    public function __construct(Task $task, string $action = 'updated')
    {
        $this->task = $task;
        $this->action = $action;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('tasks'),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'task.updated';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'action' => $this->action,
            'task' => [
                'task_id' => $this->task->task_id,
                'task_name' => $this->task->task_name,
                'status_id' => $this->task->status_id,
                'dept_id' => $this->task->dept_id,
                'assigned_store_id' => $this->task->assigned_store_id,
                'start_date' => $this->task->start_date,
                'end_date' => $this->task->end_date,
                'priority' => $this->task->priority,
                'updated_at' => $this->task->updated_at,
            ],
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
