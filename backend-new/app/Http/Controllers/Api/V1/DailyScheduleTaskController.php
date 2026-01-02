<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DailyScheduleTask;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Carbon\Carbon;

class DailyScheduleTaskController extends Controller
{
    /**
     * Get all daily schedule tasks
     */
    public function index(Request $request)
    {
        $tasks = QueryBuilder::for(DailyScheduleTask::class)
            ->allowedFilters([
                AllowedFilter::exact('store_id'),
                AllowedFilter::exact('staff_id'),
                AllowedFilter::exact('group_id'),
                AllowedFilter::exact('work_date'),
                AllowedFilter::exact('status'),
            ])
            ->allowedSorts(['schedule_task_id', 'work_date', 'start_time', 'priority'])
            ->allowedIncludes(['staff', 'store', 'group'])
            ->paginate($request->get('per_page', 50));

        return response()->json($tasks);
    }

    /**
     * Get single task
     */
    public function show($id)
    {
        $task = DailyScheduleTask::with(['staff', 'store', 'group'])->findOrFail($id);

        return response()->json($task);
    }

    /**
     * Create new task
     */
    public function store(Request $request)
    {
        $request->validate([
            'staff_id' => 'required|exists:staff,staff_id',
            'store_id' => 'required|exists:stores,store_id',
            'work_date' => 'required|date',
            'group_id' => 'nullable|exists:task_groups,group_id',
            'task_name' => 'required|string|max:200',
            'description' => 'nullable|string',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'priority' => 'nullable|in:low,medium,high,urgent',
        ]);

        $task = DailyScheduleTask::create(array_merge(
            $request->all(),
            ['status' => 'pending']
        ));

        return response()->json($task->load(['staff', 'group']), 201);
    }

    /**
     * Update task
     */
    public function update(Request $request, $id)
    {
        $task = DailyScheduleTask::findOrFail($id);

        $request->validate([
            'task_name' => 'nullable|string|max:200',
            'description' => 'nullable|string',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'status' => 'nullable|in:pending,in_progress,completed,cancelled',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'notes' => 'nullable|string',
        ]);

        $task->update($request->all());

        return response()->json($task->load(['staff', 'group']));
    }

    /**
     * Delete task
     */
    public function destroy($id)
    {
        $task = DailyScheduleTask::findOrFail($id);
        $task->delete();

        return response()->json(null, 204);
    }

    /**
     * Get tasks by date (for daily schedule view)
     */
    public function byDate(Request $request, $date)
    {
        $storeId = $request->get('store_id');

        $query = DailyScheduleTask::with(['assignedStaff', 'taskGroup', 'taskLibrary'])
            ->where('work_date', $date)
            ->orderBy('scheduled_start_time');

        if ($storeId) {
            $query->where('store_id', $storeId);
        }

        $tasks = $query->get();

        return response()->json($tasks);
    }

    /**
     * Get tasks by staff for a date
     */
    public function byStaff(Request $request, $staffId)
    {
        $date = $request->get('date', Carbon::today()->format('Y-m-d'));

        $tasks = DailyScheduleTask::with(['taskGroup'])
            ->where('assigned_staff_id', $staffId)
            ->where('work_date', $date)
            ->orderBy('scheduled_start_time')
            ->get();

        return response()->json($tasks);
    }

    /**
     * Update task status
     */
    public function updateStatus(Request $request, $id)
    {
        $task = DailyScheduleTask::findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,in_progress,completed,cancelled',
        ]);

        $updateData = ['status' => $request->status];

        if ($request->status === 'in_progress') {
            $updateData['actual_start_time'] = now()->format('H:i:s');
        } elseif ($request->status === 'completed') {
            $updateData['actual_end_time'] = now()->format('H:i:s');
        }

        $task->update($updateData);

        return response()->json($task->load(['assignedStaff', 'taskGroup']));
    }

    /**
     * Mark task as completed
     */
    public function complete(Request $request, $id)
    {
        $task = DailyScheduleTask::findOrFail($id);

        $task->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        return response()->json($task);
    }
}
