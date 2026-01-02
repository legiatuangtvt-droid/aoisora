<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Region;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    /**
     * Get all regions
     */
    public function index()
    {
        $regions = Region::all();

        return response()->json($regions);
    }

    /**
     * Get single region
     */
    public function show($id)
    {
        $region = Region::with(['stores'])->findOrFail($id);

        return response()->json($region);
    }

    /**
     * Create new region
     */
    public function store(Request $request)
    {
        $request->validate([
            'region_name' => 'required|string|max:100',
            'description' => 'nullable|string',
        ]);

        $region = Region::create($request->all());

        return response()->json($region, 201);
    }

    /**
     * Update region
     */
    public function update(Request $request, $id)
    {
        $region = Region::findOrFail($id);

        $request->validate([
            'region_name' => 'nullable|string|max:100',
            'description' => 'nullable|string',
        ]);

        $region->update($request->all());

        return response()->json($region);
    }

    /**
     * Delete region
     */
    public function destroy($id)
    {
        $region = Region::findOrFail($id);
        $region->delete();

        return response()->json(null, 204);
    }
}
