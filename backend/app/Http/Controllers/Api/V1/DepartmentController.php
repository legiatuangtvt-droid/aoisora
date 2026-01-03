<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * Get all departments ordered by sort_order
     */
    public function index()
    {
        $departments = Department::orderBy('sort_order')
            ->orderBy('department_id')
            ->get();

        return response()->json($departments);
    }

    /**
     * Get single department
     */
    public function show($id)
    {
        $department = Department::with(['staff'])->findOrFail($id);

        return response()->json($department);
    }

    /**
     * Create new department
     */
    public function store(Request $request)
    {
        $request->validate([
            'department_name' => 'required|string|max:100',
            'description' => 'nullable|string',
        ]);

        $department = Department::create($request->all());

        return response()->json($department, 201);
    }

    /**
     * Update department
     */
    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        $request->validate([
            'department_name' => 'nullable|string|max:100',
            'description' => 'nullable|string',
        ]);

        $department->update($request->all());

        return response()->json($department);
    }

    /**
     * Delete department
     */
    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return response()->json(null, 204);
    }
}
