<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Area;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    /**
     * Get all areas
     *
     * @param Request $request
     * @queryParam zone_id int Filter by zone ID
     * @queryParam is_active string Filter by active status: "true" (default), "false", or "all"
     */
    public function index(Request $request)
    {
        $query = Area::with(['zone', 'zone.region'])
            ->orderBy('area_id');

        // Filter by zone_id if provided
        if ($request->has('zone_id')) {
            $query->where('zone_id', $request->zone_id);
        }

        // Apply is_active filter (default: only active)
        $isActive = $request->query('is_active', 'true');

        if ($isActive === 'true') {
            $query->where('is_active', true);
        } elseif ($isActive === 'false') {
            $query->where('is_active', false);
        }
        // If 'all', no filter applied

        return response()->json($query->get());
    }

    /**
     * Get single area with stores
     */
    public function show($id)
    {
        $area = Area::with(['zone', 'zone.region', 'stores'])->findOrFail($id);

        return response()->json($area);
    }

    /**
     * Get areas by zone ID
     */
    public function byZone($zoneId)
    {
        $areas = Area::where('zone_id', $zoneId)
            ->where('is_active', true)
            ->orderBy('area_id')
            ->get();

        return response()->json($areas);
    }

    /**
     * Create new area
     */
    public function store(Request $request)
    {
        $request->validate([
            'area_name' => 'required|string|max:255',
            'area_code' => 'nullable|string|max:50|unique:areas,area_code',
            'zone_id' => 'required|exists:zones,zone_id',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $area = Area::create($request->all());

        return response()->json($area, 201);
    }

    /**
     * Update area
     */
    public function update(Request $request, $id)
    {
        $area = Area::findOrFail($id);

        $request->validate([
            'area_name' => 'nullable|string|max:255',
            'area_code' => 'nullable|string|max:50|unique:areas,area_code,' . $id . ',area_id',
            'zone_id' => 'nullable|exists:zones,zone_id',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $area->update($request->all());

        return response()->json($area);
    }

    /**
     * Delete area
     */
    public function destroy($id)
    {
        $area = Area::findOrFail($id);
        $area->delete();

        return response()->json(null, 204);
    }
}
