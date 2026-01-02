<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\RegionController;
use App\Http\Controllers\Api\V1\DepartmentController;
use App\Http\Controllers\Api\V1\StoreController;
use App\Http\Controllers\Api\V1\StaffController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\CheckListController;
use App\Http\Controllers\Api\V1\TaskGroupController;
use App\Http\Controllers\Api\V1\ShiftCodeController;
use App\Http\Controllers\Api\V1\ShiftAssignmentController;
use App\Http\Controllers\Api\V1\TaskLibraryController;
use App\Http\Controllers\Api\V1\DailyTemplateController;
use App\Http\Controllers\Api\V1\DailyScheduleTaskController;
use App\Http\Controllers\Api\V1\ManualFolderController;
use App\Http\Controllers\Api\V1\ManualDocumentController;
use App\Http\Controllers\Api\V1\ManualStepController;
use App\Http\Controllers\Api\V1\ManualMediaController;
use App\Http\Controllers\Api\V1\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check endpoint (for FE to check backend status)
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected routes
    Route::middleware('auth:api')->group(function () {
        // Auth
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

        // Regions
        Route::apiResource('regions', RegionController::class);

        // Departments
        Route::apiResource('departments', DepartmentController::class);

        // Stores
        Route::apiResource('stores', StoreController::class);

        // Staff
        Route::apiResource('staff', StaffController::class);

        // Tasks (WS)
        Route::apiResource('tasks', TaskController::class);

        // CheckLists
        Route::apiResource('checklists', CheckListController::class);

        // DWS - Task Groups
        Route::apiResource('task-groups', TaskGroupController::class);

        // DWS - Shift Codes
        Route::apiResource('shift-codes', ShiftCodeController::class);

        // DWS - Shift Assignments
        Route::apiResource('shift-assignments', ShiftAssignmentController::class);
        Route::get('/shift-assignments/by-date/{date}', [ShiftAssignmentController::class, 'byDate']);
        Route::get('/shift-assignments/by-staff/{staffId}', [ShiftAssignmentController::class, 'byStaff']);

        // DWS - Task Library
        Route::apiResource('task-library', TaskLibraryController::class);

        // DWS - Daily Templates
        Route::apiResource('daily-templates', DailyTemplateController::class);

        // DWS - Daily Schedule Tasks
        Route::apiResource('daily-schedule-tasks', DailyScheduleTaskController::class);
        Route::get('/daily-schedule-tasks/by-date/{date}', [DailyScheduleTaskController::class, 'byDate']);
        Route::patch('/daily-schedule-tasks/{id}/status', [DailyScheduleTaskController::class, 'updateStatus']);

        // Manual - Folders
        Route::apiResource('manual-folders', ManualFolderController::class);
        Route::get('/manual-folders/{id}/documents', [ManualFolderController::class, 'documents']);

        // Manual - Documents
        Route::apiResource('manual-documents', ManualDocumentController::class);
        Route::get('/manual-documents/{id}/steps', [ManualDocumentController::class, 'steps']);
        Route::post('/manual-documents/{id}/view', [ManualDocumentController::class, 'recordView']);

        // Manual - Steps
        Route::apiResource('manual-steps', ManualStepController::class);

        // Manual - Media
        Route::apiResource('manual-media', ManualMediaController::class);
        Route::post('/manual-media/upload', [ManualMediaController::class, 'upload']);

        // Notifications - custom routes must be before apiResource
        Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
        Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/notifications/clear-read', [NotificationController::class, 'clearRead']);
        Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::apiResource('notifications', NotificationController::class);
    });
});
