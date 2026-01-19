# Draft Features Implementation Plan

## Overview

This document outlines the implementation plan for remaining Draft features based on spec 12.1 DRAFT Status (Task Creation) in CLAUDE.md.

## Completed ✅

### 1. Merge Edit Draft into Add Task Screen
- **Status**: ✅ Completed
- **Changes**:
  - Unified `/tasks/new` page handles both Create and Edit modes
  - URL params: `?id=xxx` for edit mode, `?source=task_list|library|todo_task` for flow type
  - Old `/tasks/[id]/edit` page converted to redirect
  - Navigation updated in list, library, and todo pages

### 2. Source/Flow Support
- **Status**: ✅ Completed
- **Changes**:
  - `AddTaskForm` now accepts `source` prop
  - `ScopeSection` supports dynamic labels based on scope type (store vs hq)
  - C. Scope section hidden for library flow (source=library)

---

## Pending Features

### 3. Auto-Delete Draft (30 days)

**Priority**: Medium
**Effort**: Backend + Database migration

**Spec requirement**:
- If draft not edited in 30 days → auto delete
- Warning notification 5 days before deletion (day 25-30)
- Track using `last_modified_at` field in tasks table

**Implementation Steps**:

1. **Database Migration**
   ```sql
   ALTER TABLE tasks
   ADD COLUMN last_modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

   -- Update trigger to auto-update last_modified_at on any update
   ```

2. **Laravel Scheduler**
   - Create `app/Console/Commands/CleanupExpiredDrafts.php`
   - Schedule daily at midnight
   - Logic:
     ```php
     // Find drafts older than 30 days
     Task::where('status_id', DRAFT_STATUS_ID)
         ->where('last_modified_at', '<', now()->subDays(30))
         ->each(fn($task) => $task->delete());
     ```

3. **Warning Notifications**
   - Create `app/Console/Commands/NotifyExpiringDrafts.php`
   - Find drafts between 25-30 days old
   - Create notification record for each user
   - Frontend shows notification on login

**Files to create/modify**:
- `database/migrations/xxxx_add_last_modified_at_to_tasks.php`
- `app/Console/Commands/CleanupExpiredDrafts.php`
- `app/Console/Commands/NotifyExpiringDrafts.php`
- `app/Console/Kernel.php` (schedule commands)

---

### 4. Full Submit Validation

**Priority**: High
**Effort**: Frontend + Backend

**Spec requirement**:
Submit validation requires ALL fields complete:
- A. INFORMATION: Task Type, Applicable Period, RE Time
- B. INSTRUCTIONS: Task Type, Manual Link, Document (if type=Document), Photo Guidelines (if type=Image)
- C. SCOPE: Required for task_list and todo_task flows
- D. APPROVAL PROCESS: Auto-populated (no validation)

**Implementation Steps**:

1. **Frontend Validation** (`AddTaskForm.tsx`)
   ```typescript
   const validateForSubmit = (taskLevels: TaskLevel[], source: TaskSource) => {
     const errors: ValidationError[] = [];

     taskLevels.forEach(tl => {
       // A. Information
       if (!tl.taskInformation.taskTypeId) errors.push({ field: 'taskTypeId', message: 'Task Type is required' });
       if (source !== 'library') {
         if (!tl.taskInformation.applicablePeriod.startDate) errors.push(...);
         if (!tl.taskInformation.applicablePeriod.endDate) errors.push(...);
       }
       if (!tl.taskInformation.reTime) errors.push(...);

       // B. Instructions
       if (!tl.instructions.taskTypeId) errors.push(...);
       if (!tl.instructions.manualLink) errors.push(...);
       // Conditional validation based on task type

       // C. Scope (skip for library)
       if (source !== 'library') {
         if (!tl.scope.regionId) errors.push(...);
         // ... more scope validation
       }
     });

     return errors;
   };
   ```

2. **Backend Validation** (`TaskController.php`)
   - Add `submitTask` validation rules
   - Return specific field errors

3. **UI Feedback**
   - Highlight invalid fields with red border
   - Show error messages below fields
   - Scroll to first error

**Files to modify**:
- `frontend/src/components/tasks/add/AddTaskForm.tsx`
- `frontend/src/components/tasks/add/TaskInfoSection.tsx`
- `frontend/src/components/tasks/add/InstructionsSection.tsx`
- `frontend/src/components/tasks/add/ScopeSection.tsx`
- `backend/laravel/app/Http/Controllers/Api/V1/TaskController.php`

---

### 5. D. Approval Process UI

**Priority**: Medium
**Effort**: Frontend + API

**Spec requirement**:
- Auto-populate approver info based on creator's position
- Display: Approver name, title, avatar
- Show approval chain (who will approve)

**Implementation Steps**:

1. **API Endpoint**
   - `GET /api/v1/users/{id}/approver` - Get approver info for a user
   - Response: `{ approver_id, name, job_title, avatar_url, ... }`

2. **Frontend Component** (`ApprovalSection.tsx`)
   - Fetch approver info on component mount
   - Display approver card with avatar, name, title
   - Show "Waiting for approval" status when task is pending

3. **Auto-calculation Logic** (Backend)
   - Already implemented in `TaskController::findApprover()`
   - Need to expose via API endpoint

**Files to modify**:
- `frontend/src/components/tasks/add/ApprovalSection.tsx`
- `backend/laravel/routes/api.php` (add route)
- `backend/laravel/app/Http/Controllers/Api/V1/UserInfoController.php` (add method)

---

### 6. Draft Limit per Source (5 per flow)

**Priority**: High
**Effort**: Backend + Frontend

**Spec requirement**:
- Max 5 drafts per user PER SOURCE (task_list, library, todo_task)
- Total max: 15 drafts (5 × 3 flows)
- Count both DRAFT and APPROVE status

**Current Status**:
- Backend partially implemented (`checkDraftLimit()`)
- Need to verify source-based counting

**Implementation Steps**:

1. **Verify Backend Logic**
   ```php
   // TaskController.php - checkDraftLimit
   $count = Task::where('created_staff_id', $userId)
       ->where('source', $source)  // Filter by source
       ->whereIn('status_id', [DRAFT_ID, APPROVE_ID])
       ->count();

   return $count < 5;
   ```

2. **Frontend Display**
   - Show draft count per source in UI
   - Disable "Add New" button when limit reached
   - Show tooltip explaining limit

3. **API Enhancement**
   - `GET /api/v1/tasks-draft-info` already exists
   - Ensure it returns counts per source

**Files to modify**:
- `backend/laravel/app/Http/Controllers/Api/V1/TaskController.php`
- `frontend/src/app/tasks/new/page.tsx`

---

### 7. Resubmission Rules (Must Edit + Max 3 Rejections)

**Priority**: High
**Effort**: Backend + Frontend

**Spec requirement**:
- After rejection, must edit at least 1 field before resubmit
- Max 3 rejection attempts
- After 3 rejections, task can only be deleted

**Current Status**:
- Backend has fields: `rejection_count`, `has_changes_since_rejection`
- Frontend shows rejection info banner

**Implementation Steps**:

1. **Backend - Track Changes**
   ```php
   // In update() method
   if ($task->rejection_count > 0) {
       $task->has_changes_since_rejection = true;
   }

   // In submit() method
   if ($task->rejection_count > 0 && !$task->has_changes_since_rejection) {
       return response()->json([
           'error' => 'Please edit at least one field before resubmitting'
       ], 422);
   }

   if ($task->rejection_count >= 3) {
       return response()->json([
           'error' => 'Maximum rejection limit reached. This task can only be deleted.'
       ], 422);
   }
   ```

2. **Frontend - UI State**
   - Disable Submit if `has_changes_since_rejection = false`
   - Show "Maximum rejection limit reached" banner when count >= 3
   - Only show Delete button when limit reached

**Files to modify**:
- `backend/laravel/app/Http/Controllers/Api/V1/TaskController.php`
- `frontend/src/components/tasks/add/AddTaskForm.tsx`

---

## Implementation Priority Order

1. **High Priority** (Core functionality)
   - [ ] Full Submit Validation
   - [ ] Draft Limit per Source
   - [ ] Resubmission Rules

2. **Medium Priority** (Enhanced UX)
   - [ ] D. Approval Process UI
   - [ ] Auto-Delete Draft

3. **Future Enhancements**
   - [ ] Real-time draft sync (WebSocket)
   - [ ] Draft auto-save (debounced)

---

## Testing Checklist

- [ ] Create draft from Task List → verify source=task_list
- [ ] Create draft from Library → verify source=library, C. Scope hidden
- [ ] Create draft from To Do → verify source=todo_task, HQ scope labels
- [ ] Edit draft → verify navigation to /tasks/new?id=xxx&source=xxx
- [ ] Submit validation → verify all required fields
- [ ] Draft limit → verify 5 per source limit
- [ ] Rejection flow → verify must-edit and max-3 rules
- [ ] Auto-delete → verify 30-day cleanup and warnings
