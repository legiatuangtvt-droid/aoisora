<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Team;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * HQ Hierarchy Controller
 *
 * Provides hierarchical data for HQ organizational structure:
 * Division > Department > Team > User
 *
 * Used by Add Task (source=todo_task) for scoping tasks to HQ users.
 */
class HQHierarchyController extends Controller
{
    /**
     * Get full HQ hierarchy for scope selection
     *
     * Returns: Division > Department > Team > User structure
     * - Divisions are departments with parent_id = NULL
     * - Departments are departments with parent_id pointing to a Division
     * - Teams belong to Departments
     * - Users are HQ staff (store_id IS NULL)
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        // Get all divisions (top-level departments with no parent)
        $divisions = Department::whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $hierarchy = [];

        foreach ($divisions as $division) {
            $divisionData = [
                'division_id' => $division->department_id,
                'division_name' => $division->department_name,
                'division_code' => $division->department_code,
                'departments' => [],
            ];

            // Get departments under this division
            $departments = Department::where('parent_id', $division->department_id)
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get();

            foreach ($departments as $department) {
                $deptData = [
                    'department_id' => $department->department_id,
                    'department_name' => $department->department_name,
                    'department_code' => $department->department_code,
                    'teams' => [],
                ];

                // Get teams under this department
                $teams = Team::where('department_id', $department->department_id)
                    ->where('is_active', true)
                    ->orderBy('sort_order')
                    ->get();

                foreach ($teams as $team) {
                    $teamData = [
                        'team_id' => $team->team_id,
                        'team_name' => $team->team_name,
                        'users' => [],
                    ];

                    // Get HQ users in this team
                    $users = Staff::where('team_id', $team->team_id)
                        ->whereNull('store_id') // HQ users don't have store_id
                        ->where('is_active', true)
                        ->orderBy('staff_name')
                        ->get(['staff_id', 'staff_name', 'staff_code', 'position', 'job_grade']);

                    foreach ($users as $user) {
                        $teamData['users'][] = [
                            'user_id' => $user->staff_id,
                            'user_name' => $user->staff_name,
                            'user_code' => $user->staff_code,
                            'position' => $user->position,
                            'job_grade' => $user->job_grade,
                        ];
                    }

                    $deptData['teams'][] = $teamData;
                }

                // Also get HQ users directly under department (no team)
                $deptDirectUsers = Staff::where('department_id', $department->department_id)
                    ->whereNull('team_id')
                    ->whereNull('store_id')
                    ->where('is_active', true)
                    ->orderBy('staff_name')
                    ->get(['staff_id', 'staff_name', 'staff_code', 'position', 'job_grade']);

                if ($deptDirectUsers->count() > 0) {
                    // Add a virtual "No Team" entry for users directly under department
                    $noTeamData = [
                        'team_id' => 'no_team_' . $department->department_id,
                        'team_name' => '(No Team)',
                        'users' => [],
                    ];

                    foreach ($deptDirectUsers as $user) {
                        $noTeamData['users'][] = [
                            'user_id' => $user->staff_id,
                            'user_name' => $user->staff_name,
                            'user_code' => $user->staff_code,
                            'position' => $user->position,
                            'job_grade' => $user->job_grade,
                        ];
                    }

                    array_unshift($deptData['teams'], $noTeamData);
                }

                $divisionData['departments'][] = $deptData;
            }

            // Also get departments directly under this division that have no sub-departments
            // (i.e., this division acts as the department itself)
            $divisionDirectTeams = Team::where('department_id', $division->department_id)
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get();

            if ($divisionDirectTeams->count() > 0 || $departments->count() === 0) {
                // Add division as its own department entry if it has teams directly
                $selfDeptData = [
                    'department_id' => $division->department_id,
                    'department_name' => $division->department_name . ' (Direct)',
                    'department_code' => $division->department_code,
                    'teams' => [],
                ];

                foreach ($divisionDirectTeams as $team) {
                    $teamData = [
                        'team_id' => $team->team_id,
                        'team_name' => $team->team_name,
                        'users' => [],
                    ];

                    $users = Staff::where('team_id', $team->team_id)
                        ->whereNull('store_id')
                        ->where('is_active', true)
                        ->orderBy('staff_name')
                        ->get(['staff_id', 'staff_name', 'staff_code', 'position', 'job_grade']);

                    foreach ($users as $user) {
                        $teamData['users'][] = [
                            'user_id' => $user->staff_id,
                            'user_name' => $user->staff_name,
                            'user_code' => $user->staff_code,
                            'position' => $user->position,
                            'job_grade' => $user->job_grade,
                        ];
                    }

                    $selfDeptData['teams'][] = $teamData;
                }

                // Get users directly under division (no team, no department)
                $divisionDirectUsers = Staff::where('department_id', $division->department_id)
                    ->whereNull('team_id')
                    ->whereNull('store_id')
                    ->where('is_active', true)
                    ->orderBy('staff_name')
                    ->get(['staff_id', 'staff_name', 'staff_code', 'position', 'job_grade']);

                if ($divisionDirectUsers->count() > 0) {
                    $noTeamData = [
                        'team_id' => 'no_team_div_' . $division->department_id,
                        'team_name' => '(No Team)',
                        'users' => [],
                    ];

                    foreach ($divisionDirectUsers as $user) {
                        $noTeamData['users'][] = [
                            'user_id' => $user->staff_id,
                            'user_name' => $user->staff_name,
                            'user_code' => $user->staff_code,
                            'position' => $user->position,
                            'job_grade' => $user->job_grade,
                        ];
                    }

                    array_unshift($selfDeptData['teams'], $noTeamData);
                }

                if (count($selfDeptData['teams']) > 0) {
                    array_unshift($divisionData['departments'], $selfDeptData);
                }
            }

            $hierarchy[] = $divisionData;
        }

        // Count totals
        $totalUsers = Staff::whereNull('store_id')
            ->where('is_active', true)
            ->count();

        return response()->json([
            'success' => true,
            'divisions' => $hierarchy,
            'meta' => [
                'total_divisions' => count($hierarchy),
                'total_users' => $totalUsers,
            ],
        ]);
    }

    /**
     * Get users by team
     *
     * @param string $teamId
     * @return JsonResponse
     */
    public function getUsersByTeam(string $teamId): JsonResponse
    {
        // Handle virtual "no_team" entries
        if (str_starts_with($teamId, 'no_team_')) {
            $deptId = (int) str_replace(['no_team_div_', 'no_team_'], '', $teamId);

            $users = Staff::where('department_id', $deptId)
                ->whereNull('team_id')
                ->whereNull('store_id')
                ->where('is_active', true)
                ->orderBy('staff_name')
                ->get(['staff_id', 'staff_name', 'staff_code', 'position', 'job_grade']);
        } else {
            $users = Staff::where('team_id', $teamId)
                ->whereNull('store_id')
                ->where('is_active', true)
                ->orderBy('staff_name')
                ->get(['staff_id', 'staff_name', 'staff_code', 'position', 'job_grade']);
        }

        return response()->json([
            'success' => true,
            'users' => $users->map(fn($user) => [
                'user_id' => $user->staff_id,
                'user_name' => $user->staff_name,
                'user_code' => $user->staff_code,
                'position' => $user->position,
                'job_grade' => $user->job_grade,
            ]),
            'meta' => [
                'team_id' => $teamId,
                'total' => $users->count(),
            ],
        ]);
    }

    /**
     * Get users by department (all users in department, including all teams)
     *
     * @param int $departmentId
     * @return JsonResponse
     */
    public function getUsersByDepartment(int $departmentId): JsonResponse
    {
        $users = Staff::where('department_id', $departmentId)
            ->whereNull('store_id')
            ->where('is_active', true)
            ->orderBy('staff_name')
            ->get(['staff_id', 'staff_name', 'staff_code', 'position', 'job_grade', 'team_id']);

        return response()->json([
            'success' => true,
            'users' => $users->map(fn($user) => [
                'user_id' => $user->staff_id,
                'user_name' => $user->staff_name,
                'user_code' => $user->staff_code,
                'position' => $user->position,
                'job_grade' => $user->job_grade,
                'team_id' => $user->team_id,
            ]),
            'meta' => [
                'department_id' => $departmentId,
                'total' => $users->count(),
            ],
        ]);
    }
}
