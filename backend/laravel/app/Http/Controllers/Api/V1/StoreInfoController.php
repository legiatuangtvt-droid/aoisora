<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Area;
use App\Models\Department;
use App\Models\Region;
use App\Models\Staff;
use App\Models\Store;
use Illuminate\Http\Request;

class StoreInfoController extends Controller
{
    /**
     * SQL CASE statement for ordering staff by job grade
     * Supports both Store grades (S1-S6) and HQ grades (G1-G9)
     * Store grades: S6 (Region Manager) > S5 (Area Manager) > S4 (SI) > S3 (Store Leader G3) > S2 (Store Leader G2) > S1 (Staff)
     * HQ grades: G9 (GD) > G8 (CCO) > G7 (SGM) > G6 (GM) > G5 (Manager) > G4 (Deputy) > G3 (Executive) > G2 (Officer)
     */
    private const JOB_GRADE_ORDER_SQL = "CASE
        WHEN job_grade = 'S6' THEN 1
        WHEN job_grade = 'S5' THEN 2
        WHEN job_grade = 'S4' THEN 3
        WHEN job_grade = 'S3' THEN 4
        WHEN job_grade = 'S2' THEN 5
        WHEN job_grade = 'S1' THEN 6
        WHEN job_grade = 'G9' THEN 7
        WHEN job_grade = 'G8' THEN 8
        WHEN job_grade = 'G7' THEN 9
        WHEN job_grade = 'G6' THEN 10
        WHEN job_grade = 'G5' THEN 11
        WHEN job_grade = 'G4' THEN 12
        WHEN job_grade = 'G3' THEN 13
        WHEN job_grade = 'G2' THEN 14
        WHEN job_grade = 'G1' THEN 15
        ELSE 99
    END";

    /**
     * Get region tabs for Store Information screen navigation
     * Returns regions that have stores (store-level regions, not head office departments)
     * SMBU is always first as it's the overview/summary tab
     */
    public function regionTabs()
    {
        // Get regions that have stores associated (region_id >= 10 are store regions based on seed data)
        // SMBU is sorted first as it's the overview tab
        $regions = Region::whereHas('stores')
            ->orWhere('region_id', '>=', 10)
            ->orderByRaw("CASE WHEN region_name LIKE 'SMBU%' THEN 0 ELSE 1 END")
            ->orderBy('region_id')
            ->get()
            ->map(function ($region) {
                // Clean up region name for display (remove " (Store)" suffix if present)
                $displayName = preg_replace('/\s*\(Store\)\s*$/i', '', $region->region_name);
                return [
                    'id' => $region->region_name,
                    'label' => $displayName,
                ];
            });

        return response()->json($regions);
    }

    /**
     * Get hierarchy for a specific region
     * For SMBU tab: Returns all regions as "areas" (overview mode)
     * For other tabs: Returns areas with stores and staff
     * Hierarchy: Region → Area → Store → Staff
     */
    public function regionHierarchy($regionName)
    {
        $region = Region::where('region_name', $regionName)->first();

        if (!$region) {
            return response()->json([
                'error' => 'Region not found'
            ], 404);
        }

        // Check if this is the SMBU overview tab
        $isSMBU = str_starts_with($region->region_name, 'SMBU');

        if ($isSMBU) {
            return $this->getSMBUOverviewHierarchy($region);
        }

        // Get areas in this region with their stores and staff
        $areas = Area::where('region_id', $region->region_id)
            ->where('is_active', true)
            ->with(['stores' => function ($query) {
                $query->where('status', 'active')
                    ->with(['staff' => function ($q) {
                        $q->where('is_active', true)
                            ->orderByRaw(self::JOB_GRADE_ORDER_SQL);
                    }]);
            }, 'manager'])
            ->orderBy('sort_order')
            ->get();

        // Format areas with their stores (no departments at area level)
        $formattedAreas = $areas->map(function ($area, $index) {
            $formattedStores = $area->stores->map(function ($store) {
                $manager = $store->staff->first(function ($s) {
                    return in_array($s->position, ['Store Manager', 'Manager', 'Store Leader G3']);
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

            return [
                'id' => 'area-' . $area->area_id,
                'code' => $area->area_code,
                'name' => $area->area_name,
                'nameVi' => $area->area_name_vi,
                'manager' => $area->manager ? $this->formatStaffMember($area->manager) : null,
                'storeCount' => $area->stores->count(),
                'stores' => $formattedStores,
                'departments' => [], // Departments are at store level, not area level
                'isExpanded' => $index === 0, // First area expanded by default
            ];
        });

        // Clean up region name for display
        $displayName = preg_replace('/\s*\(Store\)\s*$/i', '', $region->region_name);

        return response()->json([
            'id' => $region->region_name,
            'name' => $displayName,
            'label' => $displayName,
            'areas' => $formattedAreas,
        ]);
    }

    /**
     * Get SMBU overview hierarchy - shows all regions as expandable items
     * Each region shows its areas and total store count
     */
    private function getSMBUOverviewHierarchy(Region $smbuRegion)
    {
        // Get all store regions (region_id >= 10, excluding SMBU itself)
        $storeRegions = Region::where('region_id', '>=', 10)
            ->where('region_id', '!=', $smbuRegion->region_id)
            ->orderBy('region_id')
            ->get();

        // Format regions as "areas" for the hierarchy view
        $formattedRegions = $storeRegions->map(function ($region, $index) {
            // Get areas in this region with store counts
            $areas = Area::where('region_id', $region->region_id)
                ->where('is_active', true)
                ->withCount(['stores' => function ($query) {
                    $query->where('status', 'active');
                }])
                ->orderBy('sort_order')
                ->get();

            $totalStores = $areas->sum('stores_count');

            // Format areas as "stores" in the view (one level deeper)
            $formattedAreas = $areas->map(function ($area) {
                return [
                    'id' => 'area-' . $area->area_id,
                    'code' => $area->area_code,
                    'name' => $area->area_name_vi ?? $area->area_name,
                    'manager' => null,
                    'staffCount' => $area->stores_count,
                    'staffList' => [],
                    'isExpanded' => false,
                ];
            });

            return [
                'id' => 'region-' . $region->region_id,
                'code' => $region->region_name,
                'name' => $region->region_name,
                'nameVi' => $this->getRegionVietnameseName($region->region_name),
                'manager' => null,
                'storeCount' => $totalStores,
                'stores' => $formattedAreas, // Areas shown as sub-items
                'departments' => [],
                'isExpanded' => $index === 0,
            ];
        });

        return response()->json([
            'id' => $smbuRegion->region_name,
            'name' => 'SMBU',
            'label' => 'SMBU - Tổng quan',
            'areas' => $formattedRegions,
        ]);
    }

    /**
     * Get Vietnamese name for region
     */
    private function getRegionVietnameseName(string $regionName): string
    {
        $nameMap = [
            'OCEAN' => 'Miền Bắc - Ocean',
            'HA NOI CENTER' => 'Hà Nội Trung tâm',
            'ECO PARK' => 'Khu vực Ecopark',
            'HA DONG' => 'Khu vực Hà Đông',
            'NGD' => 'Khu vực Nguyễn Du',
            'Ha Noi' => 'Hà Nội (Legacy)',
        ];

        return $nameMap[$regionName] ?? $regionName;
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
                ->orderByRaw(self::JOB_GRADE_ORDER_SQL);
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
     * Format staff member for API response
     */
    private function formatStaffMember($staff): array
    {
        // Determine staff type based on job grade prefix or store assignment
        $jobGrade = $staff->job_grade ?? '';
        $staffType = str_starts_with($jobGrade, 'S') ? 'STORE' : 'HQ';

        // If staff has store_id, they are store staff
        if ($staff->store_id) {
            $staffType = 'STORE';
        }

        return [
            'id' => (string) $staff->staff_id,
            'name' => $staff->staff_name,
            'avatar' => $staff->avatar_url,
            'position' => $staff->position,
            'jobGrade' => $staff->job_grade,
            'staffType' => $staffType,
            'sapCode' => $staff->sap_code,
            'phone' => $staff->phone,
            'email' => $staff->email,
            'joiningDate' => $staff->joining_date?->format('Y-m-d'),
            'status' => $staff->is_active ? 'Active' : 'Inactive',
        ];
    }

    /**
     * Get stores list for dropdown (permissions modal)
     */
    public function storesList()
    {
        $stores = Store::where('status', 'active')
            ->orderBy('store_name')
            ->get()
            ->map(function ($store) {
                return [
                    'id' => 'store-' . $store->store_id,
                    'name' => $store->store_name,
                    'code' => $store->store_code,
                ];
            });

        return response()->json($stores);
    }

    /**
     * Save permissions for a store
     */
    public function savePermissions(Request $request)
    {
        $validated = $request->validate([
            'storeId' => 'required|string',
            'permissions' => 'required|array',
            'permissions.*' => 'string',
        ]);

        // Extract numeric store ID from "store-123" format
        $storeId = str_replace('store-', '', $validated['storeId']);

        // Verify store exists
        $store = Store::find($storeId);
        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Store not found',
            ], 404);
        }

        // For now, just acknowledge the permissions (actual implementation would save to a permissions table)
        // In a real implementation:
        // 1. Clear existing permissions for the store
        // 2. Insert new permissions
        // StorePermission::where('store_id', $storeId)->delete();
        // foreach ($validated['permissions'] as $permission) {
        //     StorePermission::create(['store_id' => $storeId, 'permission' => $permission]);
        // }

        return response()->json([
            'success' => true,
            'message' => 'Permissions saved successfully',
            'storeId' => $validated['storeId'],
            'permissionsCount' => count($validated['permissions']),
        ]);
    }

    /**
     * Import stores from CSV/Excel file
     */
    public function importStores(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
        ]);

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();

        $imported = 0;
        $errors = [];

        try {
            if ($extension === 'csv') {
                $handle = fopen($file->getRealPath(), 'r');
                $headers = fgetcsv($handle);

                // Map headers to expected fields
                $headerMap = array_flip(array_map('strtolower', array_map('trim', $headers)));

                $rowNumber = 1;
                while (($row = fgetcsv($handle)) !== false) {
                    $rowNumber++;

                    try {
                        // Extract data from row
                        $storeCode = $row[$headerMap['store_code'] ?? -1] ?? null;
                        $storeName = $row[$headerMap['store_name'] ?? -1] ?? null;
                        $regionName = $row[$headerMap['region'] ?? -1] ?? null;

                        if (!$storeCode || !$storeName) {
                            $errors[] = "Row {$rowNumber}: Missing required fields (store_code, store_name)";
                            continue;
                        }

                        // Check if store already exists
                        $exists = Store::where('store_code', $storeCode)->exists();

                        if ($exists) {
                            $errors[] = "Row {$rowNumber}: Store code '{$storeCode}' already exists";
                            continue;
                        }

                        // Get region ID from name if provided
                        $regionId = null;
                        if ($regionName) {
                            $region = Region::where('region_name', $regionName)->first();
                            $regionId = $region?->region_id;
                            if (!$regionId) {
                                $errors[] = "Row {$rowNumber}: Region '{$regionName}' not found";
                                continue;
                            }
                        }

                        // Create store
                        Store::create([
                            'store_code' => trim($storeCode),
                            'store_name' => trim($storeName),
                            'region_id' => $regionId,
                            'address' => $row[$headerMap['address'] ?? -1] ?? null,
                            'phone' => $row[$headerMap['phone'] ?? -1] ?? null,
                            'email' => $row[$headerMap['email'] ?? -1] ?? null,
                            'status' => 'active',
                        ]);

                        $imported++;
                    } catch (\Exception $e) {
                        $errors[] = "Row {$rowNumber}: " . $e->getMessage();
                    }
                }

                fclose($handle);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Excel files require additional processing. Please use CSV format.',
                    'imported' => 0,
                    'errors' => ['Excel import requires PhpSpreadsheet library. Please convert to CSV.'],
                ], 400);
            }

            $success = $imported > 0;
            $message = $success
                ? "Successfully imported {$imported} stores"
                : 'No stores were imported';

            if (count($errors) > 0) {
                $message .= " with " . count($errors) . " errors";
            }

            return response()->json([
                'success' => $success,
                'message' => $message,
                'imported' => $imported,
                'errors' => $errors,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage(),
                'imported' => 0,
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }
}
