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
}
