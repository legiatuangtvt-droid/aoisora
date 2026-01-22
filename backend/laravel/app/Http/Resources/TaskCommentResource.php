<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskCommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'comment_id' => $this->comment_id,
            'task_id' => $this->task_id,
            'content' => $this->content,
            'store_result_id' => $this->store_result_id,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'user' => $this->whenLoaded('user', fn() => [
                'staff_id' => $this->user->staff_id,
                'staff_name' => $this->user->staff_name,
                'staff_code' => $this->user->staff_code,
                'avatar' => $this->user->avatar ?? null,
            ]),
        ];
    }
}
