<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\CodeMaster;
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
                AllowedFilter::exact('store_id'),
                AllowedFilter::exact('department_id'),
                AllowedFilter::exact('assigned_to'),
                AllowedFilter::exact('status_id'),
                AllowedFilter::exact('priority_id'),
                AllowedFilter::partial('task_name'),
            ])
            ->allowedSorts(['task_id', 'task_name', 'due_date', 'created_at'])
            ->allowedIncludes(['assignedTo', 'createdBy', 'store', 'department', 'taskType', 'priority', 'status'])
            ->paginate($request->get('per_page', 20));

        return response()->json($tasks);
    }

    /**
     * Get single task
     */
    public function show($id)
    {
        $task = Task::with([
            'assignedTo', 'createdBy', 'store', 'department',
            'taskType', 'priority', 'status', 'frequency', 'manual', 'checklists'
        ])->findOrFail($id);

        return response()->json($task);
    }

    /**
     * Create new task
     */
    public function store(Request $request)
    {
        $request->validate([
            'task_name' => 'required|string|max:200',
            'description' => 'nullable|string',
            'task_type_id' => 'nullable|exists:code_master,code_id',
            'priority_id' => 'nullable|exists:code_master,code_id',
            'status_id' => 'nullable|exists:code_master,code_id',
            'assigned_to' => 'nullable|exists:staff,staff_id',
            'store_id' => 'nullable|exists:stores,store_id',
            'department_id' => 'nullable|exists:departments,department_id',
            'due_date' => 'nullable|date',
        ]);

        $task = Task::create(array_merge(
            $request->all(),
            ['created_by' => $request->user()->staff_id]
        ));

        return response()->json($task, 201);
    }

    /**
     * Update task
     */
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $request->validate([
            'task_name' => 'nullable|string|max:200',
            'description' => 'nullable|string',
            'task_type_id' => 'nullable|exists:code_master,code_id',
            'priority_id' => 'nullable|exists:code_master,code_id',
            'status_id' => 'nullable|exists:code_master,code_id',
            'assigned_to' => 'nullable|exists:staff,staff_id',
            'due_date' => 'nullable|date',
        ]);

        $task->update($request->all());

        return response()->json($task);
    }

    /**
     * Update task status
     */
    public function updateStatus(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $request->validate([
            'status_id' => 'required|exists:code_master,code_id',
        ]);

        $task->update(['status_id' => $request->status_id]);

        return response()->json($task);
    }

    /**
     * Delete task
     */
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
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
     */
    public function getCodeMaster(Request $request)
    {
        $type = $request->get('type');

        $query = CodeMaster::where('is_active', true);

        if ($type) {
            $query->where('code_type', $type);
        }

        $codes = $query->orderBy('display_order')->get();

        return response()->json($codes);
    }
}
