<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TaskLibrary;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class TaskLibraryController extends Controller
{
    /**
     * Get all task library items
     */
    public function index(Request $request)
    {
        $tasks = QueryBuilder::for(TaskLibrary::class)
            ->allowedFilters([
                AllowedFilter::exact('group_id'),
                AllowedFilter::exact('is_active'),
                AllowedFilter::partial('task_name'),
            ])
            ->allowedSorts(['library_task_id', 'task_name', 'created_at'])
            ->allowedIncludes(['group'])
            ->get();

        return response()->json($tasks);
    }

    /**
     * Get single task
     */
    public function show($id)
    {
        $task = TaskLibrary::with(['group'])->findOrFail($id);

        return response()->json($task);
    }

    /**
     * Create new task
     */
    public function store(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:task_groups,group_id',
            'task_name' => 'required|string|max:200',
            'description' => 'nullable|string',
            'default_duration_minutes' => 'nullable|integer|min:1',
            'default_priority' => 'nullable|in:low,medium,high,urgent',
        ]);

        $task = TaskLibrary::create($request->all());

        return response()->json($task->load('group'), 201);
    }

    /**
     * Update task
     */
    public function update(Request $request, $id)
    {
        $task = TaskLibrary::findOrFail($id);

        $request->validate([
            'group_id' => 'nullable|exists:task_groups,group_id',
            'task_name' => 'nullable|string|max:200',
            'description' => 'nullable|string',
            'default_duration_minutes' => 'nullable|integer|min:1',
            'default_priority' => 'nullable|in:low,medium,high,urgent',
            'is_active' => 'nullable|boolean',
        ]);

        $task->update($request->all());

        return response()->json($task->load('group'));
    }

    /**
     * Delete task
     */
    public function destroy($id)
    {
        $task = TaskLibrary::findOrFail($id);
        $task->delete();

        return response()->json(null, 204);
    }
}
