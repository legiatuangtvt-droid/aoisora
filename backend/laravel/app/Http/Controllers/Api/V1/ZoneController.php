<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Zone;
use Illuminate\Http\Request;

class ZoneController extends Controller
{
    /**
     * Get all zones
     *
     * @param Request $request
     * @queryParam region_id int Filter by region ID
     */
    public function index(Request $request)
    {
        $query = Zone::with(['region'])
            ->orderBy('zone_id');

        // Filter by region_id if provided
        if ($request->has('region_id')) {
            $query->where('region_id', $request->region_id);
        }

        return response()->json($query->get());
    }

    /**
     * Get single zone with areas
     */
    public function show($id)
    {
        $zone = Zone::with(['region', 'areas', 'areas.stores'])->findOrFail($id);

        return response()->json($zone);
    }

    /**
     * Get zones by region ID
     */
    public function byRegion($regionId)
    {
        $zones = Zone::where('region_id', $regionId)
            ->orderBy('zone_id')
            ->get();

        return response()->json($zones);
    }

    /**
     * Create new zone
     */
    public function store(Request $request)
    {
        $request->validate([
            'zone_name' => 'required|string|max:255',
            'zone_code' => 'nullable|string|max:50|unique:zones,zone_code',
            'region_id' => 'required|exists:regions,region_id',
            'description' => 'nullable|string',
        ]);

        $zone = Zone::create($request->all());

        return response()->json($zone, 201);
    }

    /**
     * Update zone
     */
    public function update(Request $request, $id)
    {
        $zone = Zone::findOrFail($id);

        $request->validate([
            'zone_name' => 'nullable|string|max:255',
            'zone_code' => 'nullable|string|max:50|unique:zones,zone_code,' . $id . ',zone_id',
            'region_id' => 'nullable|exists:regions,region_id',
            'description' => 'nullable|string',
        ]);

        $zone->update($request->all());

        return response()->json($zone);
    }

    /**
     * Delete zone
     */
    public function destroy($id)
    {
        $zone = Zone::findOrFail($id);
        $zone->delete();

        return response()->json(null, 204);
    }
}
