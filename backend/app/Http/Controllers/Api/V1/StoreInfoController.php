<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Region;
use App\Models\Staff;
use App\Models\Store;
use Illuminate\Http\Request;

class StoreInfoController extends Controller
{
    /**
     * Get region tabs for Store Information screen navigation
     * Returns regions that have stores (store-level regions, not head office departments)
     */
    public function regionTabs()
    {
        // Get regions that have stores associated (region_id >= 10 are store regions based on seed data)
        $regions = Region::whereHas('stores')
            ->orWhere('region_id', '>=', 10)
            ->orderBy('region_id')
            ->get()
            ->map(function ($region) {
                return [
                    'id' => $region->region_name,
                    'label' => $region->region_name,
                ];
            });

        return response()->json($regions);
    }

    /**
     * Get hierarchy for a specific region
     * Returns areas with stores and staff
     */
    public function regionHierarchy($regionName)
    {
        $region = Region::where('region_name', $regionName)->first();

        if (!$region) {
            return response()->json([
                'error' => 'Region not found'
            ], 404);
        }

        // Get stores in this region with their staff
        $stores = Store::where('region_id', $region->region_id)
            ->where('status', 'active')
            ->with(['staff' => function ($query) {
                $query->where('is_active', true)
                    ->orderByRaw("CASE
                        WHEN job_grade = 'G8' THEN 1
                        WHEN job_grade = 'G7' THEN 2
                        WHEN job_grade = 'G6' THEN 3
                        WHEN job_grade = 'G5' THEN 4
                        WHEN job_grade = 'G4' THEN 5
                        WHEN job_grade = 'G3' THEN 6
                        WHEN job_grade = 'G2' THEN 7
                        WHEN job_grade = 'G1' THEN 8
                        ELSE 9
                    END");
            }])
            ->get();

        // Get store-level departments (departments with parent_id = 200+ are store departments)
        $storeDepartments = Department::where('department_id', '>=', 200)
            ->where('department_id', '<', 300)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($dept) {
                return [
                    'id' => 'dept-' . strtolower($dept->department_code ?? $dept->department_name),
                    'name' => $dept->department_name,
                    'icon' => $dept->icon ?? 'building',
                    'iconColor' => $dept->icon_color ?? '#666666',
                    'iconBg' => $dept->icon_bg ?? 'rgba(102, 102, 102, 0.1)',
                    'isExpanded' => false,
                ];
            });

        // Format stores as area items
        $formattedStores = $stores->map(function ($store) {
            $manager = $store->staff->first(function ($s) {
                return in_array($s->position, ['Store Manager', 'Manager', 'Area Manager']);
            });

            return [
                'id' => 'store-' . $store->store_id,
                'code' => $store->store_code,
                'name' => $store->store_name,
                'manager' => $manager ? $this->formatStaffMember($manager) : null,
                'staffCount' => $store->staff->count(),
                'staffList' => $store->staff->map(fn($s) => $this->formatStaffMember($s))->values(),
                'isExpanded' => false,
            ];
        });

        // Create area structure based on region
        $area = [
            'id' => 'area-' . strtolower(str_replace(' ', '-', $region->region_name)),
            'name' => $this->getAreaDisplayName($region),
            'storeCount' => $stores->count(),
            'stores' => $formattedStores,
            'departments' => $storeDepartments,
            'isExpanded' => true, // Default expanded for first load
        ];

        return response()->json([
            'id' => $region->region_name,
            'name' => $region->region_name,
            'label' => $region->region_name,
            'areas' => [$area],
        ]);
    }

    /**
     * Get all stores for a region
     */
    public function storesByRegion($regionName)
    {
        $region = Region::where('region_name', $regionName)->first();

        if (!$region) {
            return response()->json([
                'error' => 'Region not found'
            ], 404);
        }

        $stores = Store::where('region_id', $region->region_id)
            ->where('status', 'active')
            ->with(['staff' => function ($query) {
                $query->where('is_active', true);
            }])
            ->get()
            ->map(function ($store) {
                $manager = $store->staff->first(function ($s) {
                    return in_array($s->position, ['Store Manager', 'Manager', 'Area Manager']);
                });

                return [
                    'id' => 'store-' . $store->store_id,
                    'code' => $store->store_code,
                    'name' => $store->store_name,
                    'manager' => $manager ? $this->formatStaffMember($manager) : null,
                    'staffCount' => $store->staff->count(),
                    'isExpanded' => false,
                ];
            });

        return response()->json($stores);
    }

    /**
     * Get store detail with all staff members
     */
    public function storeDetail($storeId)
    {
        $store = Store::with(['staff' => function ($query) {
            $query->where('is_active', true)
                ->orderByRaw("CASE
                    WHEN job_grade = 'G8' THEN 1
                    WHEN job_grade = 'G7' THEN 2
                    WHEN job_grade = 'G6' THEN 3
                    WHEN job_grade = 'G5' THEN 4
                    WHEN job_grade = 'G4' THEN 5
                    WHEN job_grade = 'G3' THEN 6
                    WHEN job_grade = 'G2' THEN 7
                    WHEN job_grade = 'G1' THEN 8
                    ELSE 9
                END");
        }, 'region'])
            ->findOrFail($storeId);

        $manager = $store->staff->first(function ($s) {
            return in_array($s->position, ['Store Manager', 'Manager', 'Area Manager']);
        });

        return response()->json([
            'id' => 'store-' . $store->store_id,
            'code' => $store->store_code,
            'name' => $store->store_name,
            'address' => $store->address,
            'phone' => $store->phone,
            'email' => $store->email,
            'region' => $store->region?->region_name,
            'manager' => $manager ? $this->formatStaffMember($manager) : null,
            'staffCount' => $store->staff->count(),
            'staffList' => $store->staff->map(fn($s) => $this->formatStaffMember($s))->values(),
            'isExpanded' => false,
        ]);
    }

    /**
     * Get store-level departments
     */
    public function storeDepartments()
    {
        $departments = Department::where('department_id', '>=', 200)
            ->where('department_id', '<', 300)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($dept) {
                return [
                    'id' => 'dept-' . strtolower($dept->department_code ?? $dept->department_name),
                    'name' => $dept->department_name,
                    'icon' => $dept->icon ?? 'building',
                    'iconColor' => $dept->icon_color ?? '#666666',
                    'iconBg' => $dept->icon_bg ?? 'rgba(102, 102, 102, 0.1)',
                    'isExpanded' => false,
                ];
            });

        return response()->json($departments);
    }

    /**
     * Get area display name based on region
     */
    private function getAreaDisplayName(Region $region): string
    {
        $nameMap = [
            'SMBU' => 'Tổng quan SMBU',
            'OCEAN' => 'Miền Bắc - OCEAN AREA',
            'HA NOI CENTER' => 'Khu vực Hà Nội Trung Tâm',
            'ECO PARK' => 'Khu vực Eco Park',
            'HA DONG' => 'Khu vực Hà Đông',
            'NGD' => 'Khu vực NGD',
        ];

        return $nameMap[$region->region_name] ?? 'Khu vực ' . $region->region_name;
    }

    /**
     * Format staff member for API response
     */
    private function formatStaffMember($staff): array
    {
        return [
            'id' => (string) $staff->staff_id,
            'name' => $staff->staff_name,
            'avatar' => $staff->avatar_url,
            'position' => $staff->position,
            'jobGrade' => $staff->job_grade,
            'sapCode' => $staff->sap_code,
            'phone' => $staff->phone,
            'email' => $staff->email,
        ];
    }
}
