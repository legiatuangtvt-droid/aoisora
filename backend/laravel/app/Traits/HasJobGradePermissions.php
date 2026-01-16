<?php

namespace App\Traits;

use App\Services\JobGradePermissionService;
use Illuminate\Database\Eloquent\Builder;

/**
 * Trait to add Job Grade permission filtering to Controllers
 *
 * Usage in Controller:
 *   use HasJobGradePermissions;
 *
 *   public function index(Request $request) {
 *       $query = Task::query();
 *       $query = $this->applyJobGradeFilter($query, $request);
 *       return $query->get();
 *   }
 */
trait HasJobGradePermissions
{
    /**
     * Apply job grade permission filter to query
     *
     * @param Builder $query
     * @param mixed $request The HTTP request (to get authenticated user)
     * @param string $storeColumn Column name for store_id
     * @param string $deptColumn Column name for department_id
     * @param string $staffColumn Column name for staff_id
     * @return Builder
     */
    protected function applyJobGradeFilter(
        Builder $query,
        $request,
        string $storeColumn = 'assigned_store_id',
        string $deptColumn = 'dept_id',
        string $staffColumn = 'assigned_staff_id'
    ): Builder {
        // Try to resolve user from Bearer token (works even on public routes)
        $user = $request->user('sanctum');

        if (!$user) {
            // No authenticated user - return all data (public access)
            // If you want to restrict to authenticated users only, use:
            // return $query->whereRaw('1 = 0');
            return $query;
        }

        $service = app(JobGradePermissionService::class);
        return $service->applyFilter($query, $user, $storeColumn, $deptColumn, $staffColumn);
    }

    /**
     * Get permission info for the authenticated user
     */
    protected function getPermissionInfo($request): array
    {
        $user = $request->user();

        if (!$user) {
            return [
                'job_grade' => null,
                'grade_type' => null,
                'scope' => 'NONE',
                'level' => 0,
                'has_company_access' => false,
            ];
        }

        $service = app(JobGradePermissionService::class);
        return $service->getPermissionInfo($user);
    }

    /**
     * Check if user has company-wide access
     */
    protected function hasCompanyAccess($request): bool
    {
        $user = $request->user();

        if (!$user) {
            return false;
        }

        $service = app(JobGradePermissionService::class);
        return $service->hasCompanyAccess($user);
    }

    /**
     * Check if user can view data for a specific store
     */
    protected function canViewStore($request, int $storeId): bool
    {
        $user = $request->user();

        if (!$user) {
            return false;
        }

        $service = app(JobGradePermissionService::class);

        // Company-wide access can view all stores
        if ($service->hasCompanyAccess($user)) {
            return true;
        }

        // HQ users with department scope can view all stores (for tasks in their dept)
        if ($service->isHQGrade($user->job_grade ?? '')) {
            $scope = $service->getScope($user->job_grade);
            if (in_array($scope, ['DEPARTMENT', 'DIVISION', 'COMPANY'])) {
                return true;
            }
        }

        // Store users can only view their own store
        if ($user->store_id === $storeId) {
            return true;
        }

        return false;
    }
}
