<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * TaskDetailResource - Full resource for Task Detail screen
 *
 * Returns all fields needed for viewing and editing task details.
 * Includes heavy fields like photo_guidelines, attachments, instructions.
 */
class TaskDetailResource extends JsonResource
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
            'task_description' => $this->task_description,

            // Hierarchy
            'parent_task_id' => $this->parent_task_id,
            'task_level' => $this->task_level,

            // Source tracking
            'source' => $this->source,
            'receiver_type' => $this->receiver_type,

            // A. Information section
            'task_type_id' => $this->task_type_id,
            'taskType' => $this->whenLoaded('taskType', function () {
                return [
                    'code_master_id' => $this->taskType->code_master_id,
                    'code_name' => $this->taskType->code_name,
                    'code_value' => $this->taskType->code_value,
                ];
            }),
            'response_type_id' => $this->response_type_id,
            'responseType' => $this->whenLoaded('responseType', function () {
                return [
                    'code_master_id' => $this->responseType->code_master_id,
                    'code_name' => $this->responseType->code_name,
                    'code_value' => $this->responseType->code_value,
                ];
            }),
            'response_num' => $this->response_num,
            'priority' => $this->priority,

            // B. Instructions section
            'task_instruction_type' => $this->task_instruction_type,
            'manual_link' => $this->manual_link,
            'photo_guidelines' => $this->photo_guidelines,
            'manual_id' => $this->manual_id,
            'manual' => $this->whenLoaded('manual', function () {
                return [
                    'document_id' => $this->manual->document_id,
                    'document_name' => $this->manual->document_name,
                ];
            }),

            // Repeat configuration
            'is_repeat' => $this->is_repeat,
            'repeat_config' => $this->repeat_config,

            // Status
            'status_id' => $this->status_id,
            'status' => $this->whenLoaded('status', function () {
                return [
                    'code_master_id' => $this->status->code_master_id,
                    'code_name' => $this->status->code_name,
                    'code_value' => $this->status->code_value,
                ];
            }),

            // Department
            'dept_id' => $this->dept_id,
            'department' => $this->whenLoaded('department', function () {
                return [
                    'department_id' => $this->department->department_id,
                    'department_code' => $this->department->department_code,
                    'department_name' => $this->department->department_name,
                ];
            }),

            // Assignment
            'assigned_store_id' => $this->assigned_store_id,
            'assignedStore' => $this->whenLoaded('assignedStore', function () {
                return [
                    'store_id' => $this->assignedStore->store_id,
                    'store_code' => $this->assignedStore->store_code,
                    'store_name' => $this->assignedStore->store_name,
                ];
            }),
            'assigned_staff_id' => $this->assigned_staff_id,
            'assignedStaff' => $this->whenLoaded('assignedStaff', function () {
                return [
                    'staff_id' => $this->assignedStaff->staff_id,
                    'staff_name' => $this->assignedStaff->staff_name,
                    'job_grade' => $this->assignedStaff->job_grade,
                ];
            }),
            'do_staff_id' => $this->do_staff_id,
            'doStaff' => $this->whenLoaded('doStaff', function () {
                return [
                    'staff_id' => $this->doStaff->staff_id,
                    'staff_name' => $this->doStaff->staff_name,
                ];
            }),

            // Dates and times
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'start_time' => $this->start_time?->format('H:i'),
            'due_datetime' => $this->due_datetime?->toISOString(),
            'completed_time' => $this->completed_time?->toISOString(),

            // Content
            'comment' => $this->comment,
            'attachments' => $this->attachments,

            // Creator and Approver
            'created_staff_id' => $this->created_staff_id,
            'createdBy' => $this->whenLoaded('createdBy', function () {
                return [
                    'staff_id' => $this->createdBy->staff_id,
                    'staff_name' => $this->createdBy->staff_name,
                    'job_grade' => $this->createdBy->job_grade,
                    'email' => $this->createdBy->email,
                ];
            }),
            'approver_id' => $this->approver_id,
            'approver' => $this->whenLoaded('approver', function () {
                return [
                    'staff_id' => $this->approver->staff_id,
                    'staff_name' => $this->approver->staff_name,
                    'job_grade' => $this->approver->job_grade,
                ];
            }),

            // Rejection tracking
            'rejection_count' => $this->rejection_count,
            'has_changes_since_rejection' => $this->has_changes_since_rejection,
            'last_rejection_reason' => $this->last_rejection_reason,
            'last_rejected_at' => $this->last_rejected_at?->toISOString(),
            'last_rejected_by' => $this->last_rejected_by,
            'lastRejectedBy' => $this->whenLoaded('lastRejectedBy', function () {
                return [
                    'staff_id' => $this->lastRejectedBy->staff_id,
                    'staff_name' => $this->lastRejectedBy->staff_name,
                ];
            }),

            // Library task link
            'library_task_id' => $this->library_task_id,
            'libraryTask' => $this->whenLoaded('libraryTask', function () {
                return [
                    'task_library_id' => $this->libraryTask->task_library_id,
                    'task_name' => $this->libraryTask->task_name,
                ];
            }),

            // Workflow timestamps
            'submitted_at' => $this->submitted_at?->toISOString(),
            'approved_at' => $this->approved_at?->toISOString(),
            'dispatched_at' => $this->dispatched_at?->toISOString(),

            // Pause workflow
            'paused_at' => $this->paused_at?->toISOString(),
            'paused_by' => $this->paused_by,
            'pausedBy' => $this->whenLoaded('pausedBy', function () {
                return [
                    'staff_id' => $this->pausedBy->staff_id,
                    'staff_name' => $this->pausedBy->staff_name,
                ];
            }),
            'pause_reason' => $this->pause_reason,

            // Audit timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Store assignments (for progress tracking)
            'storeAssignments' => $this->whenLoaded('storeAssignments', function () {
                return $this->storeAssignments->map(function ($assignment) {
                    return [
                        'id' => $assignment->id,
                        'store_id' => $assignment->store_id,
                        'status' => $assignment->status,
                        'assigned_to_staff' => $assignment->assigned_to_staff,
                        'started_at' => $assignment->started_at?->toISOString(),
                        'completed_at' => $assignment->completed_at?->toISOString(),
                        'completed_by' => $assignment->completed_by,
                        'unable_reason' => $assignment->unable_reason,
                        'notes' => $assignment->notes,
                        'evidence_urls' => $assignment->evidence_urls,
                    ];
                });
            }),

            // Nested sub-tasks
            'sub_tasks' => $this->when(isset($this->sub_tasks), $this->sub_tasks),

            // Calculated fields
            'store_progress' => $this->when(isset($this->store_progress), $this->store_progress),
            'calculated_status' => $this->when(isset($this->calculated_status), $this->calculated_status),
        ];
    }
}
