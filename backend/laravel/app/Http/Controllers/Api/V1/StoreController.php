<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class StoreController extends Controller
{
    /**
     * Get all stores
     *
     * @param Request $request
     * @queryParam area_id int Filter by area ID
     * @queryParam region_id int Filter by region ID
     * @queryParam status string Filter by status
     * @queryParam is_active string Filter by active status: "true" (default), "false", or "all"
     */
    public function index(Request $request)
    {
        $query = QueryBuilder::for(Store::class)
            ->allowedFilters([
                AllowedFilter::exact('region_id'),
                AllowedFilter::exact('area_id'),
                AllowedFilter::exact('status'),
                AllowedFilter::partial('store_name'),
                AllowedFilter::partial('store_code'),
            ])
            ->allowedSorts(['store_id', 'store_name', 'store_code'])
            ->allowedIncludes(['region', 'area', 'area.zone', 'staff']);

        // Check if pagination is requested
        if ($request->has('per_page')) {
            return response()->json($query->paginate($request->get('per_page', 20)));
        }

        // Return all stores without pagination (for dropdowns)
        return response()->json($query->get());
    }

    /**
     * Get single store
     */
    public function show($id)
    {
        $store = Store::with(['region'])->findOrFail($id);

        return response()->json($store);
    }

    /**
     * Create new store
     */
    public function store(Request $request)
    {
        $request->validate([
            'store_name' => 'required|string|max:100',
            'store_code' => 'required|string|unique:stores,store_code',
            'region_id' => 'nullable|exists:regions,region_id',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'status' => 'nullable|in:active,inactive',
        ]);

        $store = Store::create($request->all());

        return response()->json($store, 201);
    }

    /**
     * Update store
     */
    public function update(Request $request, $id)
    {
        $store = Store::findOrFail($id);

        $request->validate([
            'store_name' => 'nullable|string|max:100',
            'store_code' => 'nullable|string|unique:stores,store_code,' . $id . ',store_id',
            'region_id' => 'nullable|exists:regions,region_id',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'status' => 'nullable|in:active,inactive',
        ]);

        $store->update($request->all());

        return response()->json($store);
    }

    /**
     * Delete store
     */
    public function destroy($id)
    {
        $store = Store::findOrFail($id);
        $store->delete();

        return response()->json(null, 204);
    }

    /**
     * Get staff members for a specific store
     *
     * Returns:
     * - leaders: Staff with job_grade S2, S3, S4 (Store Leaders)
     * - staff: Staff with job_grade S1 (Regular Staff)
     *
     * @param int $id Store ID
     * @return \Illuminate\Http\JsonResponse
     */
    public function staff($id)
    {
        $store = Store::findOrFail($id);

        // Get all staff for this store
        $allStaff = \App\Models\Staff::where('store_id', $id)
            ->where('is_active', true)
            ->orderBy('job_grade', 'desc')
            ->orderBy('staff_name', 'asc')
            ->get(['staff_id', 'staff_name', 'staff_code', 'job_grade', 'position']);

        // Separate leaders (S2, S3, S4) and regular staff (S1)
        $leaders = $allStaff->filter(function ($staff) {
            return in_array($staff->job_grade, ['S2', 'S3', 'S4']);
        })->map(function ($staff) {
            return [
                'value' => (string) $staff->staff_id,
                'label' => $staff->staff_name . ' (' . $staff->job_grade . ')',
                'job_grade' => $staff->job_grade,
                'position' => $staff->position,
            ];
        })->values();

        $regularStaff = $allStaff->filter(function ($staff) {
            return $staff->job_grade === 'S1';
        })->map(function ($staff) {
            return [
                'value' => (string) $staff->staff_id,
                'label' => $staff->staff_name,
                'job_grade' => $staff->job_grade,
            ];
        })->values();

        return response()->json([
            'success' => true,
            'store_id' => $id,
            'store_name' => $store->store_name,
            'leaders' => $leaders,
            'staff' => $regularStaff,
            'total_leaders' => $leaders->count(),
            'total_staff' => $regularStaff->count(),
        ]);
    }
}
