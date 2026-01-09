<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CheckList;
use App\Models\TaskCheckList;
use Illuminate\Http\Request;

class CheckListController extends Controller
{
    /**
     * Get all checklists
     */
    public function index()
    {
        $checklists = CheckList::orderBy('display_order')->get();

        return response()->json($checklists);
    }

    /**
     * Get single checklist
     */
    public function show($id)
    {
        $checklist = CheckList::findOrFail($id);

        return response()->json($checklist);
    }

    /**
     * Create new checklist
     */
    public function store(Request $request)
    {
        $request->validate([
            'check_list_name' => 'required|string|max:200',
            'description' => 'nullable|string',
            'display_order' => 'nullable|integer',
        ]);

        $checklist = CheckList::create($request->all());

        return response()->json($checklist, 201);
    }

    /**
     * Update checklist
     */
    public function update(Request $request, $id)
    {
        $checklist = CheckList::findOrFail($id);

        $request->validate([
            'check_list_name' => 'nullable|string|max:200',
            'description' => 'nullable|string',
            'display_order' => 'nullable|integer',
        ]);

        $checklist->update($request->all());

        return response()->json($checklist);
    }

    /**
     * Delete checklist
     */
    public function destroy($id)
    {
        $checklist = CheckList::findOrFail($id);
        $checklist->delete();

        return response()->json(null, 204);
    }

    /**
     * Toggle checklist item for a task
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,task_id',
            'check_list_id' => 'required|exists:check_lists,check_list_id',
        ]);

        $taskCheckList = TaskCheckList::where('task_id', $request->task_id)
            ->where('check_list_id', $request->check_list_id)
            ->first();

        if ($taskCheckList) {
            $taskCheckList->update([
                'is_completed' => !$taskCheckList->is_completed,
                'completed_at' => !$taskCheckList->is_completed ? now() : null,
                'completed_by' => !$taskCheckList->is_completed ? $request->user()->staff_id : null,
            ]);
        } else {
            $taskCheckList = TaskCheckList::create([
                'task_id' => $request->task_id,
                'check_list_id' => $request->check_list_id,
                'is_completed' => true,
                'completed_at' => now(),
                'completed_by' => $request->user()->staff_id,
            ]);
        }

        return response()->json($taskCheckList);
    }
}
