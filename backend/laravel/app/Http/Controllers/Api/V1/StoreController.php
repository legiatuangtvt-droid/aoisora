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
     */
    public function index(Request $request)
    {
        $stores = QueryBuilder::for(Store::class)
            ->allowedFilters([
                AllowedFilter::exact('region_id'),
                AllowedFilter::exact('status'),
                AllowedFilter::partial('store_name'),
                AllowedFilter::partial('store_code'),
            ])
            ->allowedSorts(['store_id', 'store_name', 'store_code'])
            ->allowedIncludes(['region', 'staff'])
            ->paginate($request->get('per_page', 20));

        return response()->json($stores);
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
