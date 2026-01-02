<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ShiftAssignment;
use App\Models\ShiftCode;
use App\Models\Staff;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Carbon\Carbon;

class ShiftAssignmentController extends Controller
{
    /**
     * Get all shift assignments
     */
    public function index(Request $request)
    {
        $assignments = QueryBuilder::for(ShiftAssignment::class)
            ->allowedFilters([
                AllowedFilter::exact('store_id'),
                AllowedFilter::exact('staff_id'),
                AllowedFilter::exact('shift_code_id'),
                AllowedFilter::exact('work_date'),
                AllowedFilter::exact('status'),
            ])
            ->allowedSorts(['assignment_id', 'work_date', 'created_at'])
            ->allowedIncludes(['staff', 'store', 'shiftCode'])
            ->paginate($request->get('per_page', 50));

        return response()->json($assignments);
    }

    /**
     * Get single shift assignment
     */
    public function show($id)
    {
        $assignment = ShiftAssignment::with(['staff', 'store', 'shiftCode'])->findOrFail($id);

        return response()->json($assignment);
    }

    /**
     * Create new shift assignment
     */
    public function store(Request $request)
    {
        $request->validate([
            'staff_id' => 'required|exists:staff,staff_id',
            'store_id' => 'required|exists:stores,store_id',
            'shift_code_id' => 'required|exists:shift_codes,shift_code_id',
            'work_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $assignment = ShiftAssignment::create($request->all());

        return response()->json($assignment->load(['staff', 'shiftCode']), 201);
    }

    /**
     * Update shift assignment
     */
    public function update(Request $request, $id)
    {
        $assignment = ShiftAssignment::findOrFail($id);

        $request->validate([
            'shift_code_id' => 'nullable|exists:shift_codes,shift_code_id',
            'status' => 'nullable|in:scheduled,confirmed,completed,cancelled',
            'actual_start_time' => 'nullable|date',
            'actual_end_time' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $assignment->update($request->all());

        return response()->json($assignment->load(['staff', 'shiftCode']));
    }

    /**
     * Delete shift assignment
     */
    public function destroy($id)
    {
        $assignment = ShiftAssignment::findOrFail($id);
        $assignment->delete();

        return response()->json(null, 204);
    }

    /**
     * Bulk create shift assignments
     */
    public function bulkCreate(Request $request)
    {
        $request->validate([
            'assignments' => 'required|array',
            'assignments.*.staff_id' => 'required|exists:staff,staff_id',
            'assignments.*.store_id' => 'required|exists:stores,store_id',
            'assignments.*.shift_code_id' => 'required|exists:shift_codes,shift_code_id',
            'assignments.*.work_date' => 'required|date',
        ]);

        $created = [];
        foreach ($request->assignments as $data) {
            // Check for existing assignment
            $existing = ShiftAssignment::where('staff_id', $data['staff_id'])
                ->where('work_date', $data['work_date'])
                ->first();

            if ($existing) {
                $existing->update(['shift_code_id' => $data['shift_code_id']]);
                $created[] = $existing;
            } else {
                $created[] = ShiftAssignment::create($data);
            }
        }

        return response()->json([
            'message' => count($created) . ' assignments created/updated',
            'assignments' => $created,
        ], 201);
    }

    /**
     * Get weekly schedule for a store
     */
    public function weekly(Request $request, $storeId)
    {
        $startDate = $request->get('start_date', Carbon::now()->startOfWeek()->format('Y-m-d'));
        $endDate = $request->get('end_date', Carbon::now()->endOfWeek()->format('Y-m-d'));

        $assignments = ShiftAssignment::with(['staff', 'shiftCode'])
            ->where('store_id', $storeId)
            ->whereBetween('work_date', [$startDate, $endDate])
            ->orderBy('work_date')
            ->get();

        // Get all staff for this store
        $staff = Staff::where('store_id', $storeId)
            ->where('status', 'active')
            ->orderBy('full_name')
            ->get();

        // Get all shift codes
        $shiftCodes = ShiftCode::where('is_active', true)->get();

        return response()->json([
            'start_date' => $startDate,
            'end_date' => $endDate,
            'staff' => $staff,
            'shift_codes' => $shiftCodes,
            'assignments' => $assignments,
        ]);
    }

    /**
     * Get daily manhours summary
     */
    public function manhours(Request $request)
    {
        $storeId = $request->get('store_id');
        $date = $request->get('date', Carbon::today()->format('Y-m-d'));

        $query = ShiftAssignment::with(['shiftCode'])
            ->where('work_date', $date);

        if ($storeId) {
            $query->where('store_id', $storeId);
        }

        $assignments = $query->get();

        $totalHours = 0;
        $staffCount = 0;

        foreach ($assignments as $assignment) {
            if ($assignment->shiftCode && !$assignment->shiftCode->is_off_day) {
                $totalHours += $assignment->shiftCode->working_hours;
                $staffCount++;
            }
        }

        return response()->json([
            'date' => $date,
            'store_id' => $storeId,
            'total_staff' => $staffCount,
            'total_hours' => $totalHours,
            'assignments' => $assignments,
        ]);
    }
}
