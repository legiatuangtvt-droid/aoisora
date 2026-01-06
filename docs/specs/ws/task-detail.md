# Task Detail Screen Specification

---

# BASIC SPEC

## 1. Overview

- **Module**: WS (Task from HQ)
- **Screen ID**: SCR_TASK_DETAIL
- **Routes**:
  - `/tasks/[id]` - Direct access with task ID
  - `/tasks/detail` - Auto-redirect to nearest deadline task
- **Purpose**: Display detailed task information from HQ to stores with multiple view modes
- **Target Users**: Manager, Staff

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | Manager | View task details with store results | I can monitor store completion status |
| US-02 | Manager | Switch between Results/Comment/Staff views | I can see different aspects of task progress |
| US-03 | Manager | Filter results by region/area/store | I can focus on specific locations |
| US-04 | Manager | View workflow steps | I can track task approval process |
| US-05 | Staff | View task instructions and images | I know what to do for the task |
| US-06 | Manager | Like and comment on store results | I can provide feedback to stores |

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Task Header | Level badge, name, dates, status, statistics cards |
| Filter Bar | Region/Area/Store dropdowns, status filter, search, view mode toggle |
| Store Results | Cards showing store completion with images and comments |
| Staff Cards | Individual staff progress with requirements grid |
| Workflow Panel | Slide-in panel showing task approval steps |

## 4. Screen Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo]                    [🔔] [Avatar] User Name ▼  [Company Logo]         │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │ List task → Detail                                               │
│ Sidebar  │ ┌─────────────────────────────────────────────────────────────┐  │
│          │ │ Task Header (Level Badge, Name, Dates, Status, Stats)      │  │
│          │ └─────────────────────────────────────────────────────────────┘  │
│          │ ┌─────────────────────────────────────────────────────────────┐  │
│          │ │ Filter Bar (Region, Area, Store, Status, Search, View Mode)│  │
│          │ └─────────────────────────────────────────────────────────────┘  │
│          │ ┌─────────────────────────────────────────────────────────────┐  │
│          │ │ Results Content (Store Cards / Staff Cards based on view)  │  │
│          │ │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │  │
│          │ │  │ Store Card  │  │ Store Card  │  │ Store Card  │         │  │
│          │ │  │ - Images    │  │ - Images    │  │ - Images    │         │  │
│          │ │  │ - Comments  │  │ - Comments  │  │ - Comments  │         │  │
│          │ │  └─────────────┘  └─────────────┘  └─────────────┘         │  │
│          │ └─────────────────────────────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

## 5. Navigation

| Action | Destination |
|--------|-------------|
| Click row in Task List | `/tasks/{id}` - Display detail of specific task |
| Click "Detail" menu in Sidebar | `/tasks/detail` - Auto-redirect to nearest deadline task |
| Click breadcrumb "List task" | `/tasks/list` - Return to task list |

## 6. API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/tasks/{id}` | GET | Get full task details |
| `/api/v1/tasks/{id}/stores` | GET | Get results by store |
| `/api/v1/tasks/{id}/staffs` | GET | Get results by staff |
| `/api/v1/tasks/{id}/comments` | GET/POST | Get/Add comments |
| `/api/v1/tasks/{id}/like` | POST | Like a task result |

## 7. Implementation Status

| Feature | Backend | Frontend | Notes |
|---------|---------|----------|-------|
| Task Header | ⏳ Pending | ✅ Done | Mock data |
| Filter Bar | ⏳ Pending | ✅ Done | Client-side |
| Store Results View | ⏳ Pending | ✅ Done | Mock data |
| Staff View | ⏳ Pending | ✅ Done | Mock data |
| Comments Section | ⏳ Pending | ✅ Done | Mock data |
| Image Lightbox | - | ✅ Done | Frontend only |
| Workflow Steps Panel | ⏳ Pending | ✅ Done | Mock data |
| API Integration | ⏳ Pending | ⏳ Pending | - |

---

# DETAIL SPEC

## 8. Navigation Flow - Detail

### 8.1 Auto-redirect Logic (`/tasks/detail`)

| Step | Action |
|------|--------|
| 1 | Parse all task end dates |
| 2 | Filter tasks where `endDate >= today` (not expired) |
| 3 | Sort by `endDate` ascending (nearest first) |
| 4 | Redirect to first task in sorted list |
| 5 | Fallback: If no upcoming tasks, redirect to first task in list |
| 6 | Fallback: If no tasks at all, redirect to `/tasks/list` |

### 8.2 View Modes

| Mode | Description |
|------|-------------|
| Results View (Store View) | View task results grouped by store with images and comments |
| Comment View | View all comments across stores |
| Staff View | View individual staff progress with images and comments |

---

## 9. Task Header - Detail

### 9.1 Task Information (Left Side)

| Element | Description | Example |
|---------|-------------|---------|
| Task Level Badge | Pink badge showing task level | "Task level 1" |
| Task Name | Bold text, large font | "Trưng bày hoa ngày rằm" |
| Date Range | Start → End dates | "04 Nov - 21 Dec" |
| HQ Check Status | Status badge | "HQ Check: D097" |
| Bottom Row | Task Type + Manual Link + User Icon | "Task type: Image \| Manual link: link \| [user icon]" |

### 9.2 Statistics Cards (Right Side)

| Card | Icon | Description | Color |
|------|------|-------------|-------|
| Not Started | Circle outline | Count of not started tasks | Gray |
| Completed | Checkmark | Count of completed tasks | Green |
| Unable to Complete | X mark | Count of unable to complete | Red/Orange |
| Average Completion Time | Clock | Average time (e.g., "60min") | Blue |

---

## 10. Filter Bar - Detail

| Element | Type | Description |
|---------|------|-------------|
| Region | Dropdown | Filter by region, with count badge (slate-300 border, white bg) |
| Area | Dropdown | Filter by area (dependent on Region), with count badge |
| Store | Dropdown | Filter by store (dependent on Area), with count badge |
| All Location | Dropdown | Filter all locations (Staff view) |
| All Status | Dropdown | Filter by task status (Staff view) |
| Search | Text input | Search by staff name or ID |
| View Mode Toggle | Toggle group | Pill-style toggle with gray background, active button has white bg with pink text |

### 10.1 View Mode Toggle Features

- Sliding indicator animation
- Keyboard navigation (Arrow keys)
- Badge counts
- Loading state
- Press feedback
- Scroll position preservation
- Fade transition on content switch

---

## 11. Store Result Card - Detail

### 11.1 Card Header

| Element | Description |
|---------|-------------|
| Store Location | Region + Area + Store ID |
| Store Name | Bold, large font (e.g., "OCEAN PARK") |
| Start Time | Label (gray) + datetime, same row with Completed Time |
| Completed Time | Label (teal) + datetime, same row with Start Time |
| Menu Button | 3-dot icon for options |

### 11.2 Image Grid

| Element | Description |
|---------|-------------|
| Image Card | Card with border, contains header (title + 3-dot menu), image thumbnail, and uploaded date |
| Card Header | Title "Picture at [Location] (count)" + 3-dot menu button |
| Image Thumbnail | Aspect ratio 16:10, with play icon (bottom-right), hover shows "View" button with search icon |
| Uploaded Date | "Uploaded: Dec 01, 2025" format below image |
| Scroll Buttons | Circular buttons with arrow icons, positioned at left/right edges when scrollable |

### 11.3 Image Lightbox

| Element | Description |
|---------|-------------|
| Overlay | Dark semi-transparent background |
| Image Display | Large centered image |
| Prev/Next Buttons | Navigation arrows |
| Download Button | Download icon button |
| Thumbnail Strip | Horizontal strip of all images |
| Close | Click overlay to close |

### 11.4 Comments Section

| Element | Description |
|---------|-------------|
| Header | "Comments (N)" with expand/collapse arrow |
| Refresh Button | Icon to refresh/reload comments |
| Date Separator | Date divider (e.g., "Tuesday, December 16th") |
| Comment Item | Avatar + Name + Time + Content |
| Comment Input | Text input with send button (pink arrow) |

---

## 12. Task Status Cards - Detail

| Status | Badge | Color Theme | Text |
|--------|-------|-------------|------|
| SUCCESS | Dot (teal) + "SUCCESS" | Blue (bg-blue-50, border-l-4 border-teal-400, text-blue-600) | ĐÃ HOÀN THÀNH CÔNG VIỆC |
| FAILED | Dot (orange) + "FAILED" | Orange (bg-orange-50, border-l-4 border-orange-500, text-orange-700) | KHÔNG HOÀN THÀNH CÔNG VIỆC |
| IN_PROGRESS | Dot (yellow) + "IN PROCESS" | Yellow (bg-yellow-50, border-l-4 border-yellow-500, text-yellow-700) | CHƯA HOÀN THÀNH CÔNG VIỆC |
| NOT_STARTED | Dot (gray) + "NOT STARTED" | Gray (bg-gray-50, border-l-4 border-gray-300, text-gray-700) | CHƯA BẮT ĐẦU |

**Card Elements:**
- Status badge with colored dot indicator (pill-style, white bg with colored border)
- Status text (bold, color-coded)
- Link báo cáo (clickable link, blue text)
- Like button (pink bg-pink-100, filled heart icon, "Like" text)
- User avatars (who liked, stacked with -space-x-2)
- Like count text (e.g., "2 likes")

---

## 13. Staff Card - Detail

| Element | Description |
|---------|-------------|
| Avatar | Staff photo with online/status indicator |
| Staff Name | Bold name |
| Staff ID | ID number (e.g., "ID: 3371-6612") |
| Position | Role/Position text |
| Store | Store name |
| Progress Bar | Visual progress with percentage |
| Status Badge | Completed/In Progress/Not Started |
| Requirements Grid | 2x2 or 2x3 grid of image checkboxes |
| Comments | Mini comments section |
| Send Reminder | Button (for Not Started status) |

---

## 14. Workflow Steps Panel - Detail

### 14.1 Trigger

- User-check icon (SVG with user + checkmark) in bottom row of Task Info section
- Click opens panel with backdrop overlay

### 14.2 Panel Layout

| Element | Description |
|---------|-------------|
| Backdrop | Dark semi-transparent overlay (bg-black/30), click to close |
| Panel | Fixed right side, width 414px, white background, full height, scrollable |
| Round Tabs | Centered tab group for Round 1, Round 2 (gray bg, active: white bg + pink text) |
| Steps Timeline | Vertical timeline with step icons and connecting lines |

### 14.3 Step Icons (30x30 rounded circle with border)

| Step | Icon | Active Border |
|------|------|---------------|
| Step 1 | Document with export arrow (SUBMIT) | #C5055B (pink) |
| Step 2 | Checkmark (APPROVE) | #C5055B |
| Step 3 | Gear/Settings (DO TASK) | #C5055B |
| Step 4 | Large checkmark (CHECK) | #C5055B |

**Icon Colors:**
- Active (non-pending): #C5055B (pink)
- Inactive (pending): #9B9B9B (gray)

### 14.4 Step Status Badges

| Status | Label | Dot Color | Background | Border | Text |
|--------|-------|-----------|------------|--------|------|
| completed | Done | #297EF6 | #E5F0FF | #297EF6 | #297EF6 |
| in_progress | In process | #EDA600 | #EDA600/5 | #EDA600 | #EDA600 |
| pending | Pending | gray-400 | gray-100 | gray-400 | gray-500 |
| submitted | Submited | #1BBA5E | #EBFFF3 | #1BBA5E | #1BBA5E |

### 14.5 Step Card Elements

| Element | Description |
|---------|-------------|
| Step Title | "Step N: {name}" - bold, large font |
| Status Badge | Dot + label, pill style |
| Assignee Avatar | 30x30 rounded, top-right of card |
| Assign to | Label + name or skip info |
| Start Day / End Day | Two columns with dates |
| Comment Section | Gray background box with quote marks |

### 14.6 Timeline Connecting Lines

- 2px width, #C5055B color
- Uses absolute positioning to extend from bottom of icon to next step's icon
- Line starts at top: 30px and extends to bottom: -20px
- Creates seamless vertical connection between all steps
- Hidden for last step

---

## 15. Store Results Display Order

| Priority | Status | Description |
|----------|--------|-------------|
| 1 (Top) | `in_progress` / `not_started` | Stores that haven't completed the task yet |
| 2 | `failed` | Stores that could not complete the task |
| 3 (Bottom) | `success` | Stores that completed the task successfully |

**Within `success` status:** Stores are sorted by completion time (descending), meaning stores that completed earlier appear at the bottom of the success group.

---

## 16. Data Types

```typescript
// View modes
type ViewMode = 'results' | 'comment' | 'staff';

// Task detail with full information
interface TaskDetail {
  id: string;
  level: number;
  name: string;
  startDate: string;
  endDate: string;
  hqCheckCode: string;
  taskType: 'image' | 'text' | 'checklist';
  manualLink?: string;
  stats: {
    notStarted: number;
    completed: number;
    unableToComplete: number;
    avgCompletionTime: number; // in minutes
  };
  storeResults: StoreResult[];
  staffResults: StaffResult[];
  workflowSteps: WorkflowStep[];
}

// Store result with images and comments
interface StoreResult {
  id: string;
  storeId: string;
  storeName: string;
  storeLocation: string; // "Region - Area - ID"
  startTime?: string;
  completedTime?: string;
  status: 'success' | 'failed' | 'in_progress' | 'not_started';
  completedBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
  images: ImageItem[];
  comments: Comment[];
  likes: {
    count: number;
    users: { id: string; name: string; avatar?: string }[];
  };
}

// Image item
interface ImageItem {
  id: string;
  title: string; // "Picture at POS", "Picture at Peri Area", etc.
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  count?: number; // number of images in this category
}

// Comment
interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userInitials: string; // "TS" for Tùng SM Ocean
  content: string;
  createdAt: string;
}

// Staff result
interface StaffResult {
  id: string;
  staffId: string;
  staffName: string;
  avatar?: string;
  position: string;
  store: string;
  storeId: string;
  progress: number; // 0-100
  progressText: string; // "100% (15/15 items)"
  status: 'completed' | 'in_progress' | 'not_started';
  requirements: RequirementImage[];
  comments: Comment[];
}

// Requirement image (for staff card)
interface RequirementImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  isCompleted: boolean;
}

// Workflow step
interface WorkflowStep {
  id: string;
  step: number;
  name: string; // SUBMIT, APPROVE, DO TASK, CHECK
  status: 'completed' | 'in_progress' | 'pending';
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  startDay?: string;
  endDay?: string;
  comment?: string;
  skipInfo?: string; // e.g., "27 Stores"
}

// Filter state
interface TaskDetailFilters {
  region: string;
  area: string;
  store: string;
  location: string;
  status: string;
  search: string;
}
```

---

## 17. API Endpoints - Detail

### 17.1 Get Task Detail

```yaml
get:
  tags:
    - WS-Tasks
  summary: "Task Detail API"
  description: |
    # Correlation Check
      - Task ID existence check against tasks table
      - If not found → Return 404 Not Found

    # Business Logic
      ## 1. Get Task Data
        ### Select Columns
          - All columns from tasks table
          - Related: department, status, taskType, responseType
          - Related: assignedStaff, createdBy, doStaff
          - Related: assignedStore, manual
          - Related: checklists (with pivot data)
          - Computed: stats (notStarted, completed, unableToComplete, avgCompletionTime)

        ### Tables
          - tasks (main)
          - departments, code_master, staff, stores
          - task_check_list (pivot), check_lists

        ### Join Conditions
          - Eager load all relationships via Eloquent

      ## 2. Response
        - Return single task with all related data and computed stats

  operationId: getTaskDetail
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: integer
      description: Task ID

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              id: "1"
              level: 1
              name: "Trưng bày hoa ngày rằm"
              startDate: "2026-01-04"
              endDate: "2026-01-21"
              hqCheckCode: "D097"
              taskType: "image"
              manualLink: "https://manual.example.com/task-1"
              stats:
                notStarted: 5
                completed: 20
                unableToComplete: 2
                avgCompletionTime: 60

    404:
      description: Not Found
      content:
        application/json:
          example:
            success: false
            message: "Task not found"

    500:
      description: Internal Server Error
```

### 17.2 Get Store Results

```yaml
get:
  tags:
    - WS-Tasks
  summary: "Task Store Results API"
  description: |
    # Correlation Check
      - Task ID existence check

    # Business Logic
      ## 1. Get Store Results
        ### Select Columns
          - store_id, store_name, store_location
          - start_time, completed_time
          - status (success, failed, in_progress, not_started)
          - completed_by (staff info)
          - images (array of image items)
          - comments (array of comments)
          - likes (count + user list)

        ### Tables
          - task_store_results
          - stores
          - staff
          - task_images
          - task_comments
          - task_likes

        ### Order By
          - status priority: in_progress/not_started → failed → success
          - Within success: completed_time DESC

      ## 2. Response
        - Return array of store results with images, comments, likes

  operationId: getTaskStoreResults
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: integer
      description: Task ID

    - name: region
      in: query
      required: false
      schema:
        type: string
      description: Filter by region

    - name: area
      in: query
      required: false
      schema:
        type: string
      description: Filter by area

    - name: store
      in: query
      required: false
      schema:
        type: string
      description: Filter by store

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              - id: "1"
                storeId: "S001"
                storeName: "OCEAN PARK"
                storeLocation: "HCM - Q1 - S001"
                startTime: "2026-01-05T08:30:00Z"
                completedTime: "2026-01-05T09:30:00Z"
                status: "success"
                completedBy:
                  id: "5"
                  name: "Nguyen Van A"
                images:
                  - id: "1"
                    title: "Picture at POS"
                    url: "/images/task-1/pos.jpg"
                    uploadedAt: "2026-01-05T09:00:00Z"
                comments:
                  - id: "1"
                    userName: "Tùng SM"
                    content: "Đã hoàn thành"
                    createdAt: "2026-01-05T09:30:00Z"
                likes:
                  count: 5
                  users:
                    - id: "1"
                      name: "Admin"

    404:
      description: Not Found
```

### 17.3 Get Staff Results

```yaml
get:
  tags:
    - WS-Tasks
  summary: "Task Staff Results API"
  description: |
    # Business Logic
      ## 1. Get Staff Results
        ### Select Columns
          - staff_id, staff_name, avatar, position
          - store_id, store_name
          - progress (percentage), progressText
          - status (completed, in_progress, not_started)
          - requirements (array of requirement images)
          - comments

        ### Tables
          - task_staff_results
          - staff
          - stores
          - task_requirements

        ### Order By
          - status: not_started → in_progress → completed

  operationId: getTaskStaffResults
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: integer

    - name: location
      in: query
      required: false
      schema:
        type: string

    - name: status
      in: query
      required: false
      schema:
        type: string

    - name: search
      in: query
      required: false
      schema:
        type: string
      description: Search by staff name or ID

  responses:
    200:
      description: OK
```

### 17.4 Post Comment

```yaml
post:
  tags:
    - WS-Tasks
  summary: "Add Comment API"
  description: |
    # Correlation Check
      - Task ID existence check
      - User authentication required

    # Business Logic
      ## 1. Validate Input
        - content: required, max 1000 chars

      ## 2. Create Comment
        - Insert into task_comments table
        - Set created_at to current timestamp
        - Set user_id from authenticated user

      ## 3. Response
        - Return created comment with user info

  operationId: postTaskComment
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: integer

  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          properties:
            content:
              type: string
              maxLength: 1000
            store_result_id:
              type: string
              description: Optional - if commenting on specific store result

  responses:
    201:
      description: Created
      content:
        application/json:
          example:
            data:
              id: "10"
              content: "Great work!"
              userName: "Admin"
              createdAt: "2026-01-06T10:00:00Z"

    400:
      description: Bad Request
      content:
        application/json:
          example:
            success: false
            message: "Content is required"

    401:
      description: Unauthorized
```

### 17.5 Like Task Result

```yaml
post:
  tags:
    - WS-Tasks
  summary: "Like Task Result API"
  description: |
    # Business Logic
      ## 1. Check Existing Like
        - If user already liked → Remove like (toggle)
        - If not liked → Add like

      ## 2. Update Like Count
        - Recalculate total likes for the result

      ## 3. Response
        - Return updated like status and count

  operationId: likeTaskResult
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: integer

  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          properties:
            store_result_id:
              type: string
              required: true

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              liked: true
              likeCount: 6
```

### 17.6 Send Reminder

```yaml
post:
  tags:
    - WS-Tasks
  summary: "Send Reminder API"
  description: |
    # Business Logic
      ## 1. Validate Target
        - staff_id must exist
        - Task must not be completed

      ## 2. Send Notification
        - Create notification record
        - Trigger push notification if enabled

      ## 3. Response
        - Return success status

  operationId: sendTaskReminder
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: integer

  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          properties:
            staff_id:
              type: string
              required: true
            message:
              type: string

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            success: true
            message: "Reminder sent successfully"
```

### 17.7 Schema Definitions

```yaml
components:
  schemas:
    StoreResult:
      type: object
      properties:
        id:
          type: string
        storeId:
          type: string
        storeName:
          type: string
        storeLocation:
          type: string
        startTime:
          type: string
          format: date-time
        completedTime:
          type: string
          format: date-time
        status:
          type: string
          enum: [success, failed, in_progress, not_started]
        completedBy:
          $ref: "#/components/schemas/StaffSimple"
        images:
          type: array
          items:
            $ref: "#/components/schemas/ImageItem"
        comments:
          type: array
          items:
            $ref: "#/components/schemas/Comment"
        likes:
          type: object
          properties:
            count:
              type: integer
            users:
              type: array
              items:
                $ref: "#/components/schemas/StaffSimple"

    StaffResult:
      type: object
      properties:
        id:
          type: string
        staffId:
          type: string
        staffName:
          type: string
        avatar:
          type: string
        position:
          type: string
        store:
          type: string
        progress:
          type: number
        progressText:
          type: string
        status:
          type: string
          enum: [completed, in_progress, not_started]
        requirements:
          type: array
          items:
            $ref: "#/components/schemas/RequirementImage"

    ImageItem:
      type: object
      properties:
        id:
          type: string
        title:
          type: string
        url:
          type: string
        thumbnailUrl:
          type: string
        uploadedAt:
          type: string
          format: date-time

    Comment:
      type: object
      properties:
        id:
          type: string
        userId:
          type: string
        userName:
          type: string
        userAvatar:
          type: string
        content:
          type: string
        createdAt:
          type: string
          format: date-time

    StaffSimple:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        avatar:
          type: string

    RequirementImage:
      type: object
      properties:
        id:
          type: string
        url:
          type: string
        isCompleted:
          type: boolean
```

---

## 18. Files Reference

```
frontend/src/
├── app/tasks/
│   ├── [id]/
│   │   ├── page.tsx              # Server component with generateStaticParams
│   │   └── TaskDetailClient.tsx  # Client component for task detail UI
│   ├── detail/
│   │   └── page.tsx              # Auto-redirect to nearest deadline task
│   ├── list/
│   │   └── page.tsx              # Task list page
│   └── new/
│       └── page.tsx              # Create new task page
├── components/tasks/
│   ├── TaskDetailHeader.tsx
│   ├── TaskFilterBar.tsx
│   ├── ImageGrid.tsx
│   ├── ImageLightbox.tsx
│   ├── CommentsSection.tsx
│   ├── StoreResultCard.tsx
│   ├── TaskStatusCard.tsx
│   ├── StaffCard.tsx
│   └── WorkflowStepsPanel.tsx
├── types/
│   └── tasks.ts
└── data/
    └── mockTaskDetail.ts
```

---

## 19. Test Scenarios

### View Mode Testing

| Test Case | Action | Expected |
|-----------|--------|----------|
| Store View | Select Results view | Shows task results grouped by store with image grid |
| Staff View | Select Staff View button | Shows staff cards with progress and requirements |
| Toggle View | Switch between views | Content updates, maintains filter state |

---

## 20. Changelog

| Date | Changes |
|------|---------|
| 2025-12-29 | Initial spec documentation |
| 2025-12-29 | Added navigation flow: click row in Task List or click Detail menu |
| 2025-12-29 | Added /tasks/detail route with auto-redirect to nearest deadline task |
| 2025-12-29 | Created /tasks/[id] page for task detail display |
| 2025-12-29 | Fixed static export: added generateStaticParams and split into Server/Client components |
| 2025-12-29 | Integrated StoreResultCard with ImageGrid and CommentsSection into TaskDetailClient |
| 2025-12-29 | Redesigned Task Header: horizontal layout with task info left, stats cards right with colored borders |
| 2025-12-30 | Updated View Mode Toggle UI: pill-style toggle with gray bg, white active button with pink text |
| 2025-12-30 | Enhanced View Mode Toggle UX: sliding indicator animation, keyboard navigation, badge counts, loading state, press feedback, scroll position preservation, fade content transition |
| 2025-12-30 | Task Header layout: Task Type, Manual Link and User Icon moved to bottom of left side (Task Info column) |
| 2025-12-30 | Task Header flex fix: Use items-stretch to sync left/right side heights, enabling justify-between to work |
| 2025-12-30 | Filter dropdowns: Added count badges with slate-300 border, white bg, positioned next to selector text |
| 2025-12-30 | Store Card: Start time and Completed time now display on same row with teal color for Completed time label |
| 2025-12-30 | Store Card: Redesigned layout with unified main content section, store location with teal region, bottom row with Completed by badge (yellow) and headphone icon |
| 2025-12-30 | Task Status Card: Redesigned with badge dot indicator, blue theme for SUCCESS, pink Like button with filled heart, stacked user avatars |
| 2025-12-30 | Image Grid: Redesigned cards with border, header (title + menu), 16:10 aspect ratio, play icon, hover View button, formatted date |
| 2025-12-30 | Store Card: Changed Completed by badge from yellow to green theme (bg-green-50, border-green-200) |
| 2025-12-30 | Store Card (Image/Results): Removed TaskStatusCard section - UI only shows header, images, completed by, and comments |
| 2025-12-30 | Store Card: Replaced headphone icon with cloud-check icon (mdi_cloud-check-outline.png) |
| 2025-12-30 | Store Card: Added viewMode prop - when 'comment', hides ImageGrid and always expands CommentsSection without toggle arrow |
| 2025-12-30 | Comments Section: Reverted to consistent UI for both Results and Comment view - same styling, only difference is alwaysExpanded removes toggle arrow |
| 2025-12-31 | YesNoStatusSection: New component for Yes/No task type showing status badge, completion text, report link, Like button with avatars |
| 2025-12-31 | StoreResultCard: Added taskType prop to conditionally render ImageGrid (image) or YesNoStatusSection (yes_no) |
| 2026-01-03 | Store Results Sorting: Added display order logic - in_progress/not_started first → failed second → success last (success sorted by completion time, earliest at bottom) |
| 2026-01-03 | WorkflowStepsPanel: New slide-in panel component with round tabs, timeline, step icons, status badges. Triggered by user-check icon in Task Header |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
| 2026-01-06 | Updated API section with OpenAPI format (7 endpoints with schemas) |
