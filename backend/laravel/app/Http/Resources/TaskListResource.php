<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * TaskListResource - Optimized resource for Task List screen
 *
 * Returns only fields needed for displaying tasks in list view.
 * Excludes heavy fields like photo_guidelines, attachments, detailed instructions.
 *
 * Reduces payload size by ~60% compared to full task object.
 */
class TaskListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // Primary identifiers
            'id' => $this->task_id,
            'task_id' => $this->task_id,
            'task_name' => $this->task_name,

            // Hierarchy (for nested sub-tasks display)
            'parent_task_id' => $this->parent_task_id,
            'task_level' => $this->task_level,

            // Source tracking
            'source' => $this->source,
            'receiver_type' => $this->receiver_type,

            // Status
            'status_id' => $this->status_id,
            'status' => $this->whenLoaded('status', function () {
                return [
                    'code_master_id' => $this->status->code_master_id,
                    'name' => $this->status->name,
                    'code' => $this->status->code,
                ];
            }),

            // Department - derived from creator's department (not from tasks.dept_id)
            // This ensures consistent department filtering and display
            'dept_id' => $this->whenLoaded('createdBy', function () {
                return $this->createdBy->department_id;
            }, $this->dept_id), // Fallback to tasks.dept_id for backward compatibility
            'department' => $this->whenLoaded('createdBy', function () {
                if ($this->createdBy->relationLoaded('department') && $this->createdBy->department) {
                    $dept = $this->createdBy->department;
                    return [
                        'department_id' => $dept->department_id,
                        'department_code' => $dept->department_code,
                        'department_name' => $dept->department_name,
                        'parent_id' => $dept->parent_id,
                    ];
                }
                return null;
            }),

            // Task type (frequency: daily, weekly, monthly, etc.)
            'task_type_id' => $this->task_type_id,
            'taskType' => $this->whenLoaded('taskType', function () {
                return [
                    'code_master_id' => $this->taskType->code_master_id,
                    'name' => $this->taskType->name,
                    'code' => $this->taskType->code,
                ];
            }),

            // Priority
            'priority' => $this->priority,

            // Dates (for filtering and display)
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),

            // Creator info (for draft ownership)
            'created_staff_id' => $this->created_staff_id,
            'createdBy' => $this->whenLoaded('createdBy', function () {
                return [
                    'staff_id' => $this->createdBy->staff_id,
                    'staff_name' => $this->createdBy->staff_name,
                    'job_grade' => $this->createdBy->job_grade,
                    'department_id' => $this->createdBy->department_id,
                ];
            }),

            // Approver info (for approval workflow)
            'approver_id' => $this->approver_id,
            'approver' => $this->whenLoaded('approver', function () {
                return [
                    'staff_id' => $this->approver->staff_id,
                    'staff_name' => $this->approver->staff_name,
                    'job_grade' => $this->approver->job_grade,
                ];
            }),

            // Timestamps (minimal)
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Nested sub-tasks (will be populated by controller)
            'sub_tasks' => $this->when(isset($this->sub_tasks), $this->sub_tasks),

            // Calculated fields (will be populated by controller)
            'store_progress' => $this->when(isset($this->store_progress), $this->store_progress),
            'calculated_status' => $this->when(isset($this->calculated_status), $this->calculated_status),
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @return array<string, mixed>
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'resource_type' => 'task_list',
            ],
        ];
    }
}
