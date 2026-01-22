<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskImageResource extends JsonResource
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
            'image_id' => $this->image_id,
            'task_id' => $this->task_id,
            'store_result_id' => $this->store_result_id,
            'title' => $this->title,
            'image_url' => $this->image_url,
            'thumbnail_url' => $this->thumbnail_url,
            'is_completed' => $this->is_completed,
            'uploaded_at' => $this->uploaded_at?->toIso8601String(),
            'uploaded_by' => $this->whenLoaded('uploadedBy', fn() => [
                'staff_id' => $this->uploadedBy->staff_id,
                'staff_name' => $this->uploadedBy->staff_name,
                'staff_code' => $this->uploadedBy->staff_code,
            ]),
        ];
    }
}
