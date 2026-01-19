<?php

namespace App\Services;

use App\Models\Staff;
use Illuminate\Database\Eloquent\Builder;

/**
 * Job Grade Permission Service
 *
 * Handles data access filtering based on Job Grade hierarchy.
 *
 * HQ Job Grades (G2-G9):
 *   G9 (General Director) - Company scope
 *   G8 (CCO) - Company scope
 *   G7 (Senior GM) - Division scope
 *   G6 (General Manager) - Department scope
 *   G5 (Manager) - Department scope
 *   G4 (Deputy Manager) - Team scope
 *   G3 (Executive) - Own data only
 *   G2 (Officer) - Own data only
 *
 * Store Job Grades (S1-S6):
 *   S6 (Region Manager) - Region scope
 *   S5 (Area Manager) - Area scope
 *   S4 (Store In-charge) - Multi-store scope
 *   S3 (Store Leader G3) - Store scope
 *   S2 (Store Leader G2) - Store scope
 *   S1 (Staff) - Own data only
 */
class JobGradePermissionService
{
    /**
     * Job Grade hierarchy levels for HQ
     */
    protected const HQ_GRADES = [
        'G9' => ['level' => 8, 'scope' => 'COMPANY'],
        'G8' => ['level' => 7, 'scope' => 'COMPANY'],
        'G7' => ['level' => 6, 'scope' => 'DIVISION'],
        'G6' => ['level' => 5, 'scope' => 'DEPARTMENT'],
        'G5' => ['level' => 4, 'scope' => 'DEPARTMENT'],
        'G4' => ['level' => 3, 'scope' => 'TEAM'],
        'G3' => ['level' => 2, 'scope' => 'NONE'],
        'G2' => ['level' => 1, 'scope' => 'NONE'],
    ];

    /**
     * Job Grade hierarchy levels for Store
     */
    protected const STORE_GRADES = [
        'S6' => ['level' => 6, 'scope' => 'REGION'],
        'S5' => ['level' => 5, 'scope' => 'AREA'],
        'S4' => ['level' => 4, 'scope' => 'MULTI_STORE'],
        'S3' => ['level' => 3, 'scope' => 'STORE'],
        'S2' => ['level' => 2, 'scope' => 'STORE'],
        'S1' => ['level' => 1, 'scope' => 'NONE'],
    ];

    /**
     * Get the scope for a given job grade
     */
    public function getScope(string $jobGrade): string
    {
        if (isset(self::HQ_GRADES[$jobGrade])) {
            return self::HQ_GRADES[$jobGrade]['scope'];
        }

        if (isset(self::STORE_GRADES[$jobGrade])) {
            return self::STORE_GRADES[$jobGrade]['scope'];
        }

        return 'NONE';
    }

    /**
     * Get the level for a given job grade
     */
    public function getLevel(string $jobGrade): int
    {
        if (isset(self::HQ_GRADES[$jobGrade])) {
            return self::HQ_GRADES[$jobGrade]['level'];
        }

        if (isset(self::STORE_GRADES[$jobGrade])) {
            return self::STORE_GRADES[$jobGrade]['level'];
        }

        return 0;
    }

    /**
     * Check if job grade is HQ type
     */
    public function isHQGrade(string $jobGrade): bool
    {
        return isset(self::HQ_GRADES[$jobGrade]);
    }

    /**
     * Check if job grade is Store type
     */
    public function isStoreGrade(string $jobGrade): bool
    {
        return isset(self::STORE_GRADES[$jobGrade]);
    }

    /**
     * Check if user has company-wide access (G8, G9)
     */
    public function hasCompanyAccess(Staff $user): bool
    {
        return in_array($user->job_grade, ['G8', 'G9']);
    }

    /**
     * Check if user has region-wide access (S6)
     */
    public function hasRegionAccess(Staff $user): bool
    {
        return $user->job_grade === 'S6';
    }

    /**
     * Apply permission filter to a query based on user's job grade
     *
     * @param Builder $query The query builder
     * @param Staff $user The authenticated user
     * @param string $storeColumn Column name for store_id filter
     * @param string $deptColumn Column name for department_id filter
     * @param string $staffColumn Column name for staff_id filter
     * @return Builder
     */
    public function applyFilter(
        Builder $query,
        Staff $user,
        string $storeColumn = 'assigned_store_id',
        string $deptColumn = 'dept_id',
        string $staffColumn = 'assigned_staff_id'
    ): Builder {
        $scope = $this->getScope($user->job_grade ?? 'S1');

        switch ($scope) {
            case 'COMPANY':
                // G8, G9 - No filter, can see everything
                return $query;

            case 'DIVISION':
                // G7 - Filter by division (not implemented yet, treat as department)
                return $query->where(function ($q) use ($user, $deptColumn) {
                    $q->where($deptColumn, $user->department_id)
                      ->orWhereNull($deptColumn);
                });

            case 'DEPARTMENT':
                // G5, G6 - Filter by department
                return $query->where(function ($q) use ($user, $deptColumn) {
                    $q->where($deptColumn, $user->department_id)
                      ->orWhereNull($deptColumn);
                });

            case 'TEAM':
                // G4 - Filter by team (not implemented yet, treat as department)
                return $query->where(function ($q) use ($user, $deptColumn) {
                    $q->where($deptColumn, $user->department_id)
                      ->orWhereNull($deptColumn);
                });

            case 'REGION':
                // S6 - Filter by region (not implemented yet, show all stores)
                return $query;

            case 'AREA':
                // S5 - Filter by area (not implemented yet, show all stores)
                return $query;

            case 'MULTI_STORE':
                // S4 - Filter by store cluster (not implemented yet, show own store)
                return $query->where(function ($q) use ($user, $storeColumn) {
                    $q->where($storeColumn, $user->store_id)
                      ->orWhereNull($storeColumn);
                });

            case 'STORE':
                // S2, S3 - Filter by store
                return $query->where(function ($q) use ($user, $storeColumn) {
                    $q->where($storeColumn, $user->store_id)
                      ->orWhereNull($storeColumn);
                });

            case 'NONE':
            default:
                // G2, G3, S1 - Only own data
                return $query->where(function ($q) use ($user, $staffColumn) {
                    $q->where($staffColumn, $user->staff_id)
                      ->orWhere('created_staff_id', $user->staff_id);
                });
        }
    }

    /**
     * Get permission info for a user (to include in API response)
     */
    public function getPermissionInfo(Staff $user): array
    {
        $jobGrade = $user->job_grade ?? 'S1';

        return [
            'job_grade' => $jobGrade,
            'grade_type' => $this->isHQGrade($jobGrade) ? 'HQ' : 'STORE',
            'scope' => $this->getScope($jobGrade),
            'level' => $this->getLevel($jobGrade),
            'has_company_access' => $this->hasCompanyAccess($user),
            'can_create_task' => $this->canCreateTask($user),
            'department_id' => $user->department_id,
            'store_id' => $user->store_id,
        ];
    }

    /**
     * Check if user can create tasks
     *
     * According to design spec (CLAUDE.md section 12.1):
     * - Only HQ users with Job Grade G2-G9 can create tasks
     * - Store users (S1-S7) CANNOT create tasks
     *
     * @param Staff $user
     * @return bool
     */
    public function canCreateTask(Staff $user): bool
    {
        $jobGrade = $user->job_grade ?? '';
        return $this->isHQGrade($jobGrade);
    }

    /**
     * Get all valid HQ grades that can create tasks
     *
     * @return array
     */
    public function getTaskCreationGrades(): array
    {
        return array_keys(self::HQ_GRADES);
    }
}
