<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class StaffController extends Controller
{
    /**
     * Get all staff with filters
     */
    public function index(Request $request)
    {
        $staff = QueryBuilder::for(Staff::class)
            ->allowedFilters([
                AllowedFilter::exact('store_id'),
                AllowedFilter::exact('department_id'),
                AllowedFilter::exact('role'),
                AllowedFilter::exact('status'),
                AllowedFilter::partial('full_name'),
                AllowedFilter::partial('staff_code'),
            ])
            ->allowedSorts(['staff_id', 'full_name', 'staff_code', 'created_at'])
            ->allowedIncludes(['store', 'department'])
            ->paginate($request->get('per_page', 20));

        return response()->json($staff);
    }

    /**
     * Get single staff
     */
    public function show($id)
    {
        $staff = Staff::with(['store', 'department'])->findOrFail($id);

        return response()->json($staff);
    }

    /**
     * Create new staff
     */
    public function store(Request $request)
    {
        $request->validate([
            'staff_code' => 'required|string|unique:staff,staff_code',
            'username' => 'required|string|unique:staff,username',
            'password' => 'required|string|min:6',
            'full_name' => 'required|string|max:100',
            'email' => 'nullable|email|unique:staff,email',
            'phone' => 'nullable|string|max:20',
            'store_id' => 'required|exists:stores,store_id',
            'department_id' => 'nullable|exists:departments,department_id',
            'position' => 'nullable|string|max:50',
            'role' => 'required|in:admin,manager,supervisor,staff',
            'status' => 'nullable|in:active,inactive,pending',
        ]);

        $staff = Staff::create([
            'staff_code' => $request->staff_code,
            'username' => $request->username,
            'password_hash' => Hash::make($request->password),
            'full_name' => $request->full_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'store_id' => $request->store_id,
            'department_id' => $request->department_id,
            'position' => $request->position,
            'role' => $request->role,
            'status' => $request->status ?? 'active',
        ]);

        return response()->json($staff, 201);
    }

    /**
     * Update staff
     */
    public function update(Request $request, $id)
    {
        $staff = Staff::findOrFail($id);

        $request->validate([
            'staff_code' => 'nullable|string|unique:staff,staff_code,' . $id . ',staff_id',
            'username' => 'nullable|string|unique:staff,username,' . $id . ',staff_id',
            'full_name' => 'nullable|string|max:100',
            'email' => 'nullable|email|unique:staff,email,' . $id . ',staff_id',
            'phone' => 'nullable|string|max:20',
            'store_id' => 'nullable|exists:stores,store_id',
            'department_id' => 'nullable|exists:departments,department_id',
            'position' => 'nullable|string|max:50',
            'role' => 'nullable|in:admin,manager,supervisor,staff',
            'status' => 'nullable|in:active,inactive,pending',
        ]);

        $staff->update($request->only([
            'staff_code', 'username', 'full_name', 'email', 'phone',
            'store_id', 'department_id', 'position', 'role', 'status',
            'avatar_url', 'skills', 'hourly_rate', 'contract_type',
        ]));

        return response()->json($staff);
    }

    /**
     * Delete staff
     */
    public function destroy($id)
    {
        $staff = Staff::findOrFail($id);
        $staff->delete();

        return response()->json(null, 204);
    }
}
