<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource for transforming Task Approval History into API response format
 *
 * This resource transforms the Task model with its approval history
 * into the format expected by the frontend ApprovalHistoryModal component.
 */
class TaskApprovalHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Group history entries by round
        $historyByRound = $this->approvalHistory
            ->groupBy('round_number');

        // Determine current and total rounds
        $totalRounds = $historyByRound->keys()->max() ?? 1;
        $currentRound = $this->getCurrentRound($historyByRound);

        // Build rounds array
        $rounds = [];
        foreach ($historyByRound as $roundNumber => $steps) {
            $rounds[] = [
                'roundNumber' => (int) $roundNumber,
                'steps' => $steps->map(function ($step) {
                    return $this->formatStep($step);
                })->values()->all(),
            ];
        }

        return [
            'taskId' => (string) $this->task_id,
            'taskName' => $this->task_name,
            'taskStartDate' => $this->start_date?->toIso8601String(),
            'taskEndDate' => $this->end_date?->toIso8601String(),
            'currentRound' => $currentRound,
            'totalRounds' => $totalRounds,
            'rounds' => $rounds,
        ];
    }

    /**
     * Determine the current round based on history status
     */
    private function getCurrentRound($historyByRound): int
    {
        // Find the round that has in_process or pending steps
        foreach ($historyByRound->reverse() as $roundNumber => $steps) {
            $hasActiveStep = $steps->contains(function ($step) {
                return in_array($step->step_status, ['in_process', 'pending', 'submitted']);
            });

            if ($hasActiveStep) {
                return (int) $roundNumber;
            }
        }

        // Default to highest round
        return $historyByRound->keys()->max() ?? 1;
    }

    /**
     * Format a single history step
     */
    private function formatStep($step): array
    {
        $formatted = [
            'stepNumber' => $step->step_number,
            'stepName' => $step->step_name,
            'status' => $step->step_status,
            'assignee' => $this->formatAssignee($step),
            'startDate' => $step->start_date?->toIso8601String() ?? '',
            'endDate' => $step->end_date?->toIso8601String() ?? '',
        ];

        // Add optional fields if they exist
        if ($step->actual_start_at) {
            $formatted['actualStartAt'] = $step->actual_start_at->toIso8601String();
        }

        if ($step->actual_end_at) {
            $formatted['actualEndAt'] = $step->actual_end_at->toIso8601String();
        }

        if ($step->comment) {
            $formatted['comment'] = $step->comment;
        }

        // Add progress for DO_TASK step
        if ($step->step_name === 'DO_TASK' && $step->progress_total > 0) {
            $formatted['progress'] = [
                'done' => $step->progress_done,
                'total' => $step->progress_total,
            ];
        }

        return $formatted;
    }

    /**
     * Format the assignee information
     */
    private function formatAssignee($step): array
    {
        $assignee = [
            'type' => $step->assigned_to_type,
            'name' => $step->assigned_to_name ?? 'Unknown',
        ];

        if ($step->assigned_to_id) {
            $assignee['id'] = $step->assigned_to_id;

            // Try to get avatar if assigned to a user
            if ($step->assigned_to_type === 'user') {
                $user = $step->assignedUser;
                if ($user && $user->avatar_url) {
                    $assignee['avatar'] = $user->avatar_url;
                }
            }
        }

        if ($step->assigned_to_count) {
            $assignee['count'] = $step->assigned_to_count;
        }

        return $assignee;
    }
}
