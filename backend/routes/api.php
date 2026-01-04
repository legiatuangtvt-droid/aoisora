<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\StaffController;
use App\Http\Controllers\Api\V1\StoreController;
use App\Http\Controllers\Api\V1\DepartmentController;
use App\Http\Controllers\Api\V1\RegionController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\CheckListController;
use App\Http\Controllers\Api\V1\ShiftCodeController;
use App\Http\Controllers\Api\V1\ShiftAssignmentController;
use App\Http\Controllers\Api\V1\TaskGroupController;
use App\Http\Controllers\Api\V1\DailyScheduleTaskController;
use App\Http\Controllers\Api\V1\TaskLibraryController;
use App\Http\Controllers\Api\V1\DailyTemplateController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\ManualFolderController;
use App\Http\Controllers\Api\V1\ManualDocumentController;
use App\Http\Controllers\Api\V1\ManualStepController;
use App\Http\Controllers\Api\V1\ManualMediaController;
use App\Http\Controllers\Api\V1\TeamController;
use App\Http\Controllers\Api\V1\UserInfoController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('auth/login', [AuthController::class, 'login']);

    // Public read-only routes (for listing/browsing)
    Route::get('departments', [DepartmentController::class, 'index']);
    Route::get('departments/{department}', [DepartmentController::class, 'show']);
    Route::get('tasks', [TaskController::class, 'index']);
    Route::get('tasks/{task}', [TaskController::class, 'show']);
    Route::get('stores', [StoreController::class, 'index']);
    Route::get('stores/{store}', [StoreController::class, 'show']);
    Route::get('regions', [RegionController::class, 'index']);
    Route::get('regions/{region}', [RegionController::class, 'show']);
    Route::get('code-master', [TaskController::class, 'getCodeMaster']);

    // User Information (public read-only)
    Route::prefix('user-info')->group(function () {
        Route::get('smbu-hierarchy', [UserInfoController::class, 'smbuHierarchy']);
        Route::get('department-tabs', [UserInfoController::class, 'departmentTabs']);
        Route::get('departments/{department}/hierarchy', [UserInfoController::class, 'departmentHierarchy']);
        Route::get('staff/{staff}', [UserInfoController::class, 'staffDetail']);
        Route::get('departments-list', [UserInfoController::class, 'departments']);
        Route::get('teams-list', [UserInfoController::class, 'teams']);
        Route::post('teams', [UserInfoController::class, 'storeTeam']);
        Route::post('members', [UserInfoController::class, 'storeMember']);
        Route::get('roles-list', [UserInfoController::class, 'roles']);
        Route::get('users-list', [UserInfoController::class, 'users']);
        Route::post('permissions', [UserInfoController::class, 'savePermissions']);
        Route::post('import', [UserInfoController::class, 'importUsers']);
    });

    // Teams (public read-only)
    Route::get('teams', [TeamController::class, 'index']);
    Route::get('teams/{team}', [TeamController::class, 'show']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::post('auth/change-password', [AuthController::class, 'changePassword']);

        // Staff
        Route::apiResource('staff', StaffController::class);

        // Stores (only write operations - read operations are public)
        Route::post('stores', [StoreController::class, 'store']);
        Route::put('stores/{store}', [StoreController::class, 'update']);
        Route::delete('stores/{store}', [StoreController::class, 'destroy']);

        // Departments (only write operations - read operations are public)
        Route::post('departments', [DepartmentController::class, 'store']);
        Route::put('departments/{department}', [DepartmentController::class, 'update']);
        Route::delete('departments/{department}', [DepartmentController::class, 'destroy']);

        // Regions (only write operations - read operations are public)
        Route::post('regions', [RegionController::class, 'store']);
        Route::put('regions/{region}', [RegionController::class, 'update']);
        Route::delete('regions/{region}', [RegionController::class, 'destroy']);

        // Tasks (only write operations - read operations are public)
        Route::post('tasks', [TaskController::class, 'store']);
        Route::put('tasks/{task}', [TaskController::class, 'update']);
        Route::delete('tasks/{task}', [TaskController::class, 'destroy']);
        Route::put('tasks/{task}/status', [TaskController::class, 'updateStatus']);
        Route::get('tasks/{task}/checklists', [TaskController::class, 'getChecklists']);

        // Checklists
        Route::apiResource('checklists', CheckListController::class);
        Route::post('checklists/toggle', [CheckListController::class, 'toggle']);

        // Shifts (DWS)
        Route::prefix('shifts')->group(function () {
            // Shift Codes
            Route::get('codes', [ShiftCodeController::class, 'index']);
            Route::post('codes', [ShiftCodeController::class, 'store']);
            Route::get('codes/{id}', [ShiftCodeController::class, 'show']);
            Route::put('codes/{id}', [ShiftCodeController::class, 'update']);
            Route::delete('codes/{id}', [ShiftCodeController::class, 'destroy']);
            Route::post('codes/generate', [ShiftCodeController::class, 'generate']);

            // Shift Assignments
            Route::get('assignments', [ShiftAssignmentController::class, 'index']);
            Route::post('assignments', [ShiftAssignmentController::class, 'store']);
            Route::get('assignments/{id}', [ShiftAssignmentController::class, 'show']);
            Route::put('assignments/{id}', [ShiftAssignmentController::class, 'update']);
            Route::delete('assignments/{id}', [ShiftAssignmentController::class, 'destroy']);
            Route::post('assignments/bulk', [ShiftAssignmentController::class, 'bulkCreate']);
            Route::get('weekly/{store}', [ShiftAssignmentController::class, 'weekly']);
            Route::get('manhours/daily', [ShiftAssignmentController::class, 'manhours']);

            // Task Groups
            Route::apiResource('task-groups', TaskGroupController::class);

            // Daily Schedule Tasks
            Route::get('schedule-tasks', [DailyScheduleTaskController::class, 'index']);
            Route::post('schedule-tasks', [DailyScheduleTaskController::class, 'store']);
            Route::get('schedule-tasks/{id}', [DailyScheduleTaskController::class, 'show']);
            Route::put('schedule-tasks/{id}', [DailyScheduleTaskController::class, 'update']);
            Route::delete('schedule-tasks/{id}', [DailyScheduleTaskController::class, 'destroy']);
            Route::get('schedule-tasks/by-staff/{staff}', [DailyScheduleTaskController::class, 'byStaff']);
            Route::put('schedule-tasks/{id}/complete', [DailyScheduleTaskController::class, 'complete']);

            // Task Library
            Route::apiResource('task-library', TaskLibraryController::class);

            // Daily Templates
            Route::apiResource('daily-templates', DailyTemplateController::class);
        });

        // Notifications
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::post('notifications', [NotificationController::class, 'store']);
        Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount']);
        Route::get('notifications/{id}', [NotificationController::class, 'show']);
        Route::delete('notifications/{id}', [NotificationController::class, 'destroy']);
        Route::put('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::put('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('notifications/clear-read', [NotificationController::class, 'clearRead']);

        // Manual (Knowledge Base)
        Route::prefix('manual')->group(function () {
            // Browse & Search
            Route::get('browse', [ManualDocumentController::class, 'browse']);
            Route::get('search', [ManualDocumentController::class, 'search']);

            // Folders
            Route::get('folders', [ManualFolderController::class, 'index']);
            Route::post('folders', [ManualFolderController::class, 'store']);
            Route::get('folders/{id}', [ManualFolderController::class, 'show']);
            Route::put('folders/{id}', [ManualFolderController::class, 'update']);
            Route::delete('folders/{id}', [ManualFolderController::class, 'destroy']);

            // Documents
            Route::get('documents', [ManualDocumentController::class, 'index']);
            Route::post('documents', [ManualDocumentController::class, 'store']);
            Route::get('documents/{id}', [ManualDocumentController::class, 'show']);
            Route::get('documents/{id}/full', [ManualDocumentController::class, 'full']);
            Route::put('documents/{id}', [ManualDocumentController::class, 'update']);
            Route::delete('documents/{id}', [ManualDocumentController::class, 'destroy']);
            Route::put('documents/{id}/move', [ManualDocumentController::class, 'move']);
            Route::post('documents/{id}/view', [ManualDocumentController::class, 'logView']);

            // Steps
            Route::get('steps', [ManualStepController::class, 'index']);
            Route::post('steps', [ManualStepController::class, 'store']);
            Route::get('steps/{id}', [ManualStepController::class, 'show']);
            Route::put('steps/{id}', [ManualStepController::class, 'update']);
            Route::delete('steps/{id}', [ManualStepController::class, 'destroy']);
            Route::post('steps/reorder', [ManualStepController::class, 'reorder']);

            // Media
            Route::get('media', [ManualMediaController::class, 'index']);
            Route::post('upload', [ManualMediaController::class, 'upload']);
            Route::get('media/{id}', [ManualMediaController::class, 'show']);
            Route::put('media/{id}', [ManualMediaController::class, 'update']);
            Route::delete('media/{id}', [ManualMediaController::class, 'destroy']);
        });
    });
});
