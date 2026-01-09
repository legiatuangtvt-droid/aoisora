<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    /**
     * Get all teams with optional department filter
     *
     * @queryParam is_active string Filter by active status: "true" (default), "false", or "all"
     * @queryParam department_id integer Filter by department
     */
    public function index(Request $request)
    {
        $query = Team::with(['department', 'members'])
            ->orderBy('sort_order');

        // Apply is_active filter (default: only active)
        $isActive = $request->query('is_active', 'true');

        if ($isActive === 'true') {
            $query->where('is_active', true);
        } elseif ($isActive === 'false') {
            $query->where('is_active', false);
        }
        // If 'all', no filter applied

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        $teams = $query->get()->map(function ($team) {
            return [
                'id' => $team->team_id,
                'name' => $team->team_name,
                'icon' => $team->icon,
                'iconColor' => $team->icon_color,
                'iconBg' => $team->icon_bg,
                'gradeRange' => $team->grade_range,
                'memberCount' => $team->members->count(),
                'members' => $team->members->map(fn($m) => $this->formatStaffMember($m)),
            ];
        });

        return response()->json($teams);
    }

    /**
     * Get single team with members
     */
    public function show($id)
    {
        $team = Team::with(['department', 'members.lineManager'])
            ->findOrFail($id);

        return response()->json([
            'id' => $team->team_id,
            'name' => $team->team_name,
            'icon' => $team->icon,
            'iconColor' => $team->icon_color,
            'iconBg' => $team->icon_bg,
            'gradeRange' => $team->grade_range,
            'department' => $team->department ? [
                'id' => $team->department->department_id,
                'name' => $team->department->department_name,
            ] : null,
            'members' => $team->members->map(fn($m) => $this->formatStaffMember($m)),
        ]);
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
            'lineManager' => $staff->lineManager ? [
                'id' => (string) $staff->lineManager->staff_id,
                'name' => $staff->lineManager->staff_name,
                'sapCode' => $staff->lineManager->sap_code,
                'avatar' => $staff->lineManager->avatar_url,
            ] : null,
        ];
    }
}
