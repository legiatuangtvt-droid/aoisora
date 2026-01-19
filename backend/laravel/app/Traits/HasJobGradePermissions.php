<?php

namespace App\Traits;

use App\Models\Staff;
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
 *
 * Testing Mode:
 *   Frontend can pass X-Switch-User-Id header to simulate different users.
 *   This is useful for testing permission filtering without re-authenticating.
 */
trait HasJobGradePermissions
{
    /**
     * Get the effective user for permission checking.
     * If X-Switch-User-Id header is present, use that user instead of authenticated user.
     * This allows testing different user permissions without re-authenticating.
     *
     * @param mixed $request
     * @return Staff|null
     */
    protected function getEffectiveUser($request): ?Staff
    {
        // Check for X-Switch-User-Id header (testing mode)
        $switchedUserId = $request->header('X-Switch-User-Id');

        if ($switchedUserId) {
            // Find the switched user by staff_id
            $switchedUser = Staff::find($switchedUserId);
            if ($switchedUser) {
                return $switchedUser;
            }
        }

        // Fall back to authenticated user
        return $request->user('sanctum');
    }

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
        // Get effective user (may be switched user in testing mode)
        $user = $this->getEffectiveUser($request);

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
     * Get permission info for the effective user (may be switched user in testing mode)
     */
    protected function getPermissionInfo($request): array
    {
        $user = $this->getEffectiveUser($request);

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
        $user = $this->getEffectiveUser($request);

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
        $user = $this->getEffectiveUser($request);

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
