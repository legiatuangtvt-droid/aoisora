<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Staff;
use App\Models\Team;
use Illuminate\Http\Request;

class UserInfoController extends Controller
{
    /**
     * Get SMBU (Head Office) hierarchy for User Information screen
     * Returns root user + departments with teams and staff
     */
    public function smbuHierarchy()
    {
        // Get SMBU department (Head Office) - parent_id IS NULL and is the main office
        $smbuDepartment = Department::where('department_code', 'SMBU')->first();

        if (!$smbuDepartment) {
            return response()->json([
                'error' => 'SMBU department not found'
            ], 404);
        }

        // Get root user (General Manager - highest grade in SMBU)
        $rootUser = Staff::where('department_id', $smbuDepartment->department_id)
            ->whereNull('line_manager_id')
            ->orderByRaw("CASE
                WHEN job_grade = 'G8' THEN 1
                WHEN job_grade = 'G7' THEN 2
                WHEN job_grade = 'G6' THEN 3
                WHEN job_grade = 'G5' THEN 4
                WHEN job_grade = 'G4' THEN 5
                ELSE 6
            END")
            ->first();

        // Get child departments under SMBU
        $departments = Department::where('parent_id', $smbuDepartment->department_id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($dept) {
                return $this->formatDepartment($dept);
            });

        return response()->json([
            'rootUser' => $rootUser ? $this->formatStaffMember($rootUser) : null,
            'departments' => $departments,
        ]);
    }

    /**
     * Get hierarchy for a specific department
     */
    public function departmentHierarchy($departmentId)
    {
        $department = Department::with(['staff', 'teams.members', 'head'])
            ->findOrFail($departmentId);

        return response()->json($this->formatDepartmentDetail($department));
    }

    /**
     * Get all department tabs for navigation
     */
    public function departmentTabs()
    {
        // Get SMBU and its child departments
        $smbu = Department::where('department_code', 'SMBU')->first();

        $tabs = [
            [
                'id' => 'SMBU',
                'label' => 'SMBU (Head Office)',
            ]
        ];

        if ($smbu) {
            $childDepts = Department::where('parent_id', $smbu->department_id)
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get();

            foreach ($childDepts as $dept) {
                $tabs[] = [
                    'id' => $dept->department_code ?? $dept->department_name,
                    'label' => $dept->department_name,
                ];
            }
        }

        return response()->json($tabs);
    }

    /**
     * Get staff detail with full information
     */
    public function staffDetail($staffId)
    {
        $staff = Staff::with(['department', 'team', 'lineManager', 'store'])
            ->findOrFail($staffId);

        return response()->json([
            'id' => (string) $staff->staff_id,
            'name' => $staff->staff_name,
            'avatar' => $staff->avatar_url,
            'position' => $staff->position,
            'jobGrade' => $staff->job_grade,
            'sapCode' => $staff->sap_code,
            'phone' => $staff->phone,
            'email' => $staff->email,
            'joiningDate' => $staff->joining_date?->format('Y-m-d'),
            'status' => $staff->is_active ? 'Active' : 'Inactive',
            'lineManager' => $staff->lineManager ? [
                'id' => (string) $staff->lineManager->staff_id,
                'name' => $staff->lineManager->staff_name,
                'sapCode' => $staff->lineManager->sap_code,
                'avatar' => $staff->lineManager->avatar_url,
            ] : null,
            'organization' => [
                'division' => 'SMBU',
                'department' => $staff->department?->department_name,
                'section' => $staff->team?->team_name,
                'location' => $staff->store?->store_name,
            ],
        ]);
    }

    /**
     * Format department for list view
     */
    private function formatDepartment(Department $dept): array
    {
        $head = $dept->head;

        return [
            'id' => $dept->department_code ?? $dept->department_name,
            'name' => $dept->department_name,
            'icon' => $dept->icon ?? 'building',
            'iconColor' => $dept->icon_color ?? '#666666',
            'iconBg' => $dept->icon_bg ?? 'rgba(102, 102, 102, 0.1)',
            'memberCount' => $dept->member_count,
            'gradeRange' => $dept->grade_range,
            'head' => $head ? $this->formatStaffMember($head) : null,
        ];
    }

    /**
     * Format department with full detail including teams
     */
    private function formatDepartmentDetail(Department $dept): array
    {
        $teams = $dept->teams->map(function ($team) {
            return [
                'id' => $team->team_id,
                'name' => $team->team_name,
                'icon' => $team->icon ?? 'users',
                'iconColor' => $team->icon_color ?? '#003E95',
                'iconBg' => $team->icon_bg ?? '#E5F0FF',
                'gradeRange' => $team->grade_range,
                'members' => $team->members->map(fn($m) => $this->formatStaffMember($m)),
                'isExpanded' => false,
            ];
        });

        return [
            'id' => $dept->department_code ?? $dept->department_name,
            'name' => $dept->department_name,
            'icon' => $dept->icon ?? 'building',
            'iconColor' => $dept->icon_color ?? '#666666',
            'iconBg' => $dept->icon_bg ?? 'rgba(102, 102, 102, 0.1)',
            'memberCount' => $dept->member_count,
            'gradeRange' => $dept->grade_range,
            'head' => $dept->head ? $this->formatStaffMember($dept->head) : null,
            'teams' => $teams,
            'isExpanded' => false,
        ];
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
            'joiningDate' => $staff->joining_date?->format('Y-m-d'),
            'status' => $staff->is_active ? 'Active' : 'Inactive',
        ];
    }
}
