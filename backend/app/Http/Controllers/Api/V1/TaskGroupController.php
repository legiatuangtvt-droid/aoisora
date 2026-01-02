<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TaskGroup;
use Illuminate\Http\Request;

class TaskGroupController extends Controller
{
    /**
     * Get all task groups
     */
    public function index()
    {
        $groups = TaskGroup::where('is_active', true)
            ->orderBy('display_order')
            ->get();

        return response()->json($groups);
    }

    /**
     * Get single task group
     */
    public function show($id)
    {
        $group = TaskGroup::with(['taskLibrary', 'dailyScheduleTasks'])->findOrFail($id);

        return response()->json($group);
    }

    /**
     * Create new task group
     */
    public function store(Request $request)
    {
        $request->validate([
            'group_name' => 'required|string|max:100',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
            'display_order' => 'nullable|integer',
        ]);

        $group = TaskGroup::create($request->all());

        return response()->json($group, 201);
    }

    /**
     * Update task group
     */
    public function update(Request $request, $id)
    {
        $group = TaskGroup::findOrFail($id);

        $request->validate([
            'group_name' => 'nullable|string|max:100',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
            'display_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $group->update($request->all());

        return response()->json($group);
    }

    /**
     * Delete task group
     */
    public function destroy($id)
    {
        $group = TaskGroup::findOrFail($id);
        $group->delete();

        return response()->json(null, 204);
    }
}
