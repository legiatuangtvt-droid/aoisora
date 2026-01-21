<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class StaffController extends Controller
{
    /**
     * Get all staff with filters
     */
    public function index(Request $request)
    {
        $staff = QueryBuilder::for(Staff::class)
            ->allowedFilters([
                AllowedFilter::exact('store_id'),
                AllowedFilter::exact('department_id'),
                AllowedFilter::exact('role'),
                AllowedFilter::exact('status'),
                AllowedFilter::partial('full_name'),
                AllowedFilter::partial('staff_code'),
            ])
            ->allowedSorts(['staff_id', 'full_name', 'staff_code', 'created_at'])
            ->allowedIncludes(['store', 'department'])
            ->paginate($request->get('per_page', 20));

        return response()->json($staff);
    }

    /**
     * Get single staff
     */
    public function show($id)
    {
        $staff = Staff::with(['store', 'department'])->findOrFail($id);

        return response()->json($staff);
    }

    /**
     * Create new staff
     */
    public function store(Request $request)
    {
        $request->validate([
            'staff_code' => 'required|string|unique:staff,staff_code',
            'username' => 'required|string|unique:staff,username',
            'password' => 'required|string|min:6',
            'full_name' => 'required|string|max:100',
            'email' => 'nullable|email|unique:staff,email',
            'phone' => 'nullable|string|max:20',
            'store_id' => 'required|exists:stores,store_id',
            'department_id' => 'nullable|exists:departments,department_id',
            'position' => 'nullable|string|max:50',
            'role' => 'required|in:admin,manager,supervisor,staff',
            'status' => 'nullable|in:active,inactive,pending',
        ]);

        $staff = Staff::create([
            'staff_code' => $request->staff_code,
            'username' => $request->username,
            'password_hash' => Hash::make($request->password),
            'full_name' => $request->full_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'store_id' => $request->store_id,
            'department_id' => $request->department_id,
            'position' => $request->position,
            'role' => $request->role,
            'status' => $request->status ?? 'active',
        ]);

        return response()->json($staff, 201);
    }

    /**
     * Update staff
     */
    public function update(Request $request, $id)
    {
        $staff = Staff::findOrFail($id);

        $request->validate([
            'staff_code' => 'nullable|string|unique:staff,staff_code,' . $id . ',staff_id',
            'username' => 'nullable|string|unique:staff,username,' . $id . ',staff_id',
            'full_name' => 'nullable|string|max:100',
            'email' => 'nullable|email|unique:staff,email,' . $id . ',staff_id',
            'phone' => 'nullable|string|max:20',
            'store_id' => 'nullable|exists:stores,store_id',
            'department_id' => 'nullable|exists:departments,department_id',
            'position' => 'nullable|string|max:50',
            'role' => 'nullable|in:admin,manager,supervisor,staff',
            'status' => 'nullable|in:active,inactive,pending',
        ]);

        $staff->update($request->only([
            'staff_code', 'username', 'full_name', 'email', 'phone',
            'store_id', 'department_id', 'position', 'role', 'status',
            'avatar_url', 'skills', 'hourly_rate', 'contract_type',
        ]));

        return response()->json($staff);
    }

    /**
     * Delete staff
     */
    public function destroy($id)
    {
        $staff = Staff::findOrFail($id);
        $staff->delete();

        return response()->json(null, 204);
    }

    /**
     * Get staff list for User Switcher (development/testing)
     * Returns all active staff with relevant info for user context
     */
    public function userSwitcherList()
    {
        $staff = Staff::with(['store', 'department'])
            ->where('is_active', true)
            ->orderByRaw("
                CASE
                    WHEN job_grade LIKE 'G%' THEN 0
                    WHEN job_grade LIKE 'S%' THEN 1
                    ELSE 2
                END,
                CAST(SUBSTRING(job_grade, 2) AS UNSIGNED) DESC
            ")
            ->get()
            ->map(function ($staff) {
                // Determine scope based on job_grade
                $scope = $this->getScopeFromJobGrade($staff->job_grade);

                return [
                    'staff_id' => $staff->staff_id,
                    'staff_name' => $staff->staff_name,
                    'staff_code' => $staff->staff_code,
                    'email' => $staff->email,
                    'job_grade' => $staff->job_grade,
                    'scope' => $scope,
                    'store_id' => $staff->store_id,
                    'store_name' => $staff->store?->store_name ?? 'HQ',
                    'department_id' => $staff->department_id,
                    'department_name' => $staff->department?->department_name ?? '',
                ];
            });

        return response()->json([
            'data' => $staff,
            'total' => $staff->count(),
        ]);
    }

    /**
     * Job grade hierarchy for proper comparison
     * Higher index = higher grade
     */
    private const JOB_GRADE_ORDER = [
        // Store grades (S1 lowest to S7 highest)
        'S1' => 1,
        'S2' => 2,
        'S3' => 3,
        'S4' => 4,
        'S5' => 5,
        'S6' => 6,
        'S7' => 7,
        // HQ grades (G2 lowest to G9 highest)
        'G2' => 12,
        'G3' => 13,
        'G4' => 14,
        'G5' => 15,
        'G6' => 16,
        'G7' => 17,
        'G8' => 18,
        'G9' => 19, // Highest - CEO level, no approver above
    ];

    /**
     * Get the numeric order of a job grade for comparison
     */
    private function getJobGradeOrder(?string $jobGrade): int
    {
        return self::JOB_GRADE_ORDER[$jobGrade] ?? 0;
    }

    /**
     * Get approver for a staff member based on organizational hierarchy
     * Used to preview who will approve tasks before submission
     *
     * GET /api/v1/staff/{staffId}/approver
     */
    public function getApprover($staffId)
    {
        $staff = Staff::find($staffId);

        if (!$staff) {
            return response()->json([
                'success' => false,
                'message' => 'Staff not found',
            ], 404);
        }

        // G9 is the highest grade - no approver exists
        if ($staff->job_grade === 'G9') {
            return response()->json([
                'success' => true,
                'approver' => null,
                'is_highest_grade' => true,
                'message' => 'G9 is the highest grade in the system. Tasks will be auto-approved.',
            ]);
        }

        $approver = $this->findApprover($staff);

        if (!$approver) {
            return response()->json([
                'success' => true,
                'approver' => null,
                'is_highest_grade' => false,
                'message' => 'No approver found in organizational hierarchy',
            ]);
        }

        return response()->json([
            'success' => true,
            'approver' => [
                'id' => $approver->staff_id,
                'name' => $approver->staff_name,
                'staff_code' => $approver->staff_code,
                'job_grade' => $approver->job_grade,
                'position' => $approver->position ?? $this->getPositionFromJobGrade($approver->job_grade),
                'department_id' => $approver->department_id,
                'department_name' => $approver->department?->department_name ?? '',
                'store_id' => $approver->store_id,
                'store_name' => $approver->store?->store_name ?? 'HQ',
            ],
            'is_highest_grade' => false,
        ]);
    }

    /**
     * Find the appropriate approver for a staff based on hierarchy
     *
     * @param Staff $creator
     * @return Staff|null
     */
    private function findApprover(Staff $creator): ?Staff
    {
        // First, try to find direct line manager
        if ($creator->line_manager_id) {
            return Staff::with(['store', 'department'])->find($creator->line_manager_id);
        }

        // Get creator's grade order for comparison
        $creatorGradeOrder = $this->getJobGradeOrder($creator->job_grade);

        // Get all higher grades for query
        $higherGrades = array_keys(array_filter(
            self::JOB_GRADE_ORDER,
            fn($order) => $order > $creatorGradeOrder
        ));

        if (empty($higherGrades)) {
            return null; // Already at highest grade
        }

        // Try same team first
        if ($creator->team_id) {
            $approver = Staff::with(['store', 'department'])
                ->where('team_id', $creator->team_id)
                ->whereIn('job_grade', $higherGrades)
                ->where('is_active', true)
                ->get()
                ->sortBy(fn($s) => $this->getJobGradeOrder($s->job_grade))
                ->first();

            if ($approver) {
                return $approver;
            }
        }

        // Try same department
        if ($creator->department_id) {
            $approver = Staff::with(['store', 'department'])
                ->where('department_id', $creator->department_id)
                ->whereIn('job_grade', $higherGrades)
                ->where('is_active', true)
                ->get()
                ->sortBy(fn($s) => $this->getJobGradeOrder($s->job_grade))
                ->first();

            if ($approver) {
                return $approver;
            }
        }

        // Fallback: find any active staff with higher grade (system admin level)
        return Staff::with(['store', 'department'])
            ->whereIn('job_grade', $higherGrades)
            ->where('is_active', true)
            ->get()
            ->sortBy(fn($s) => $this->getJobGradeOrder($s->job_grade))
            ->first();
    }

    /**
     * Get a position description from job grade
     */
    private function getPositionFromJobGrade(?string $jobGrade): string
    {
        $positions = [
            'G9' => 'CEO',
            'G8' => 'Director',
            'G7' => 'Senior Manager',
            'G6' => 'Manager',
            'G5' => 'Assistant Manager',
            'G4' => 'Supervisor',
            'G3' => 'Senior Staff',
            'G2' => 'Staff',
            'S7' => 'Regional Manager',
            'S6' => 'Zone Manager',
            'S5' => 'Area Manager',
            'S4' => 'Store In-charge',
            'S3' => 'Store Leader',
            'S2' => 'Deputy Store Leader',
            'S1' => 'Staff',
        ];

        return $positions[$jobGrade] ?? $jobGrade ?? 'Staff';
    }

    /**
     * Get scope from job grade
     */
    private function getScopeFromJobGrade(?string $jobGrade): string
    {
        if (!$jobGrade) {
            return 'NONE';
        }

        // HQ Grades
        $hqScopes = [
            'G9' => 'COMPANY',
            'G8' => 'COMPANY',
            'G7' => 'DIVISION',
            'G6' => 'DEPARTMENT',
            'G5' => 'DEPARTMENT',
            'G4' => 'TEAM',
            'G3' => 'NONE',
            'G2' => 'NONE',
        ];

        // Store Grades
        $storeScopes = [
            'S7' => 'REGION',
            'S6' => 'ZONE',
            'S5' => 'AREA',
            'S4' => 'CLUSTER',
            'S3' => 'STORE',
            'S2' => 'STORE',
            'S1' => 'NONE',
        ];

        return $hqScopes[$jobGrade] ?? $storeScopes[$jobGrade] ?? 'NONE';
    }
}
