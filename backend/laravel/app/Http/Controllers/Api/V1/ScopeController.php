<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Region;
use App\Models\Zone;
use App\Models\Area;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ScopeController extends Controller
{
    /**
     * Get complete geographic hierarchy in one API call
     *
     * Returns: Region → Zone → Area → Store hierarchy
     *
     * Response structure:
     * {
     *   "regions": [
     *     {
     *       "region_id": 1,
     *       "region_name": "The North",
     *       "zones": [
     *         {
     *           "zone_id": 1,
     *           "zone_name": "Hanoi",
     *           "areas": [
     *             {
     *               "area_id": 1,
     *               "area_name": "Long Bien District",
     *               "stores": [
     *                 { "store_id": 1, "store_name": "AEON Long Bien" }
     *               ]
     *             }
     *           ]
     *         }
     *       ]
     *     }
     *   ]
     * }
     */
    public function hierarchy(Request $request)
    {
        // Cache for 5 minutes (geographic data rarely changes)
        $cacheKey = 'scope_hierarchy';

        $data = Cache::remember($cacheKey, 300, function () {
            return Region::where('is_active', true)
                ->orderBy('sort_order')
                ->with([
                    'zones' => function ($query) {
                        $query->where('is_active', true)
                            ->orderBy('sort_order')
                            ->select('zone_id', 'zone_name', 'zone_code', 'region_id');
                    },
                    'zones.areas' => function ($query) {
                        $query->where('is_active', true)
                            ->orderBy('sort_order')
                            ->select('area_id', 'area_name', 'area_code', 'zone_id');
                    },
                    'zones.areas.stores' => function ($query) {
                        $query->where('is_active', true)
                            ->orderBy('sort_order')
                            ->select('store_id', 'store_name', 'store_code', 'area_id');
                    }
                ])
                ->select('region_id', 'region_name', 'region_code')
                ->get();
        });

        return response()->json([
            'regions' => $data
        ]);
    }

    /**
     * Clear the scope hierarchy cache
     * Call this when geographic data is updated
     */
    public function clearCache()
    {
        Cache::forget('scope_hierarchy');

        return response()->json([
            'message' => 'Scope hierarchy cache cleared'
        ]);
    }
}
