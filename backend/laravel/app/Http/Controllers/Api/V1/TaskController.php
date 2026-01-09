<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\CodeMaster;
use App\Events\TaskUpdated;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class TaskController extends Controller
{
    /**
     * Get all tasks
     */
    public function index(Request $request)
    {
        $tasks = QueryBuilder::for(Task::class)
            ->allowedFilters([
                AllowedFilter::exact('assigned_store_id'),
                AllowedFilter::exact('dept_id'),
                AllowedFilter::exact('assigned_staff_id'),
                AllowedFilter::exact('status_id'),
                AllowedFilter::exact('priority'),
                AllowedFilter::partial('task_name'),
                // Date range filters
                AllowedFilter::callback('start_date_from', fn ($query, $value) => $query->where('start_date', '>=', $value)),
                AllowedFilter::callback('start_date_to', fn ($query, $value) => $query->where('start_date', '<=', $value)),
                AllowedFilter::callback('end_date_from', fn ($query, $value) => $query->where('end_date', '>=', $value)),
                AllowedFilter::callback('end_date_to', fn ($query, $value) => $query->where('end_date', '<=', $value)),
            ])
            ->allowedSorts(['task_id', 'task_name', 'end_date', 'start_date', 'created_at'])
            ->allowedIncludes(['assignedStaff', 'createdBy', 'assignedStore', 'department', 'taskType', 'responseType', 'status'])
            ->paginate($request->get('per_page', 20));

        return response()->json($tasks);
    }

    /**
     * Get single task
     */
    public function show($id)
    {
        $task = Task::with([
            'assignedStaff', 'createdBy', 'assignedStore', 'department',
            'taskType', 'responseType', 'status', 'manual', 'checklists'
        ])->findOrFail($id);

        return response()->json($task);
    }

    /**
     * Create new task
     */
    public function store(Request $request)
    {
        $request->validate([
            'task_name' => 'required|string|max:500',
            'task_description' => 'nullable|string',
            'task_type_id' => 'nullable|exists:code_master,code_master_id',
            'response_type_id' => 'nullable|exists:code_master,code_master_id',
            'status_id' => 'nullable|exists:code_master,code_master_id',
            'assigned_staff_id' => 'nullable|exists:staff,staff_id',
            'assigned_store_id' => 'nullable|exists:stores,store_id',
            'dept_id' => 'nullable|exists:departments,department_id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'priority' => 'nullable|string|in:low,normal,high,urgent',
        ]);

        $task = Task::create(array_merge(
            $request->all(),
            ['created_staff_id' => $request->user()->staff_id]
        ));

        // Broadcast task created event
        broadcast(new TaskUpdated($task, 'created'))->toOthers();

        return response()->json($task, 201);
    }

    /**
     * Update task
     */
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $request->validate([
            'task_name' => 'nullable|string|max:500',
            'task_description' => 'nullable|string',
            'task_type_id' => 'nullable|exists:code_master,code_master_id',
            'response_type_id' => 'nullable|exists:code_master,code_master_id',
            'status_id' => 'nullable|exists:code_master,code_master_id',
            'assigned_staff_id' => 'nullable|exists:staff,staff_id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'priority' => 'nullable|string|in:low,normal,high,urgent',
        ]);

        $task->update($request->all());

        // Broadcast task updated event
        broadcast(new TaskUpdated($task, 'updated'))->toOthers();

        return response()->json($task);
    }

    /**
     * Update task status
     */
    public function updateStatus(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $request->validate([
            'status_id' => 'required|exists:code_master,code_master_id',
        ]);

        $task->update(['status_id' => $request->status_id]);

        // Broadcast status changed event
        broadcast(new TaskUpdated($task, 'status_changed'))->toOthers();

        return response()->json($task);
    }

    /**
     * Delete task
     */
    public function destroy($id)
    {
        $task = Task::findOrFail($id);

        // Broadcast before delete
        broadcast(new TaskUpdated($task, 'deleted'))->toOthers();

        $task->delete();

        return response()->json(null, 204);
    }

    /**
     * Get task checklists
     */
    public function getChecklists($id)
    {
        $task = Task::with('checklists')->findOrFail($id);

        return response()->json($task->checklists);
    }

    /**
     * Get code master entries
     *
     * @queryParam type string Filter by code_type (status, task_type, response_type)
     * @queryParam is_active string Filter by active status: "true" (default), "false", or "all"
     */
    public function getCodeMaster(Request $request)
    {
        $type = $request->get('type');

        $query = CodeMaster::orderBy('sort_order');

        // Apply is_active filter (default: only active)
        $isActive = $request->query('is_active', 'true');

        if ($isActive === 'true') {
            $query->where('is_active', true);
        } elseif ($isActive === 'false') {
            $query->where('is_active', false);
        }
        // If 'all', no filter applied

        if ($type) {
            $query->where('code_type', $type);
        }

        return response()->json($query->get());
    }
}
