# Task Detail - Detail Specification

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_TASK_DETAIL
> **Routes**: `/tasks/[id]`, `/tasks/detail` (auto-redirect)
> **Last Updated**: 2026-01-08

---

## 1. Task Header - Detail

### 1.1 Task Information (Left Side)

| Element | Description | Example |
|---------|-------------|---------|
| Task Level Badge | Pink badge showing task level | "Task level 1" |
| Task Name | Bold text, large font | "Trưng bày hoa ngày rằm" |
| Date Range | Start → End dates | "04 Nov - 21 Dec" |
| HQ Check Status | Status badge | "HQ Check: D097" |
| Bottom Row | Task Type + Manual Link + Workflow Icon | "Task type: Image \| Manual link: link \| [user-check icon]" |

### 1.2 Statistics Cards (Right Side)

| Card | Icon | Description | Color |
|------|------|-------------|-------|
| Not Started | Circle outline | Count of not started tasks | Gray |
| Completed | Checkmark | Count of completed tasks | Green |
| Unable to Complete | X mark | Count of unable to complete | Red/Orange |
| Average Completion Time | Clock | Average time (e.g., "60min") | Blue |

---

## 2. Filter Bar - Detail

| Element | Type | Description |
|---------|------|-------------|
| Region | Dropdown | Filter by region, with count badge (slate-300 border, white bg) |
| Area | Dropdown | Filter by area (dependent on Region), with count badge |
| Store | Dropdown | Filter by store (dependent on Area), with count badge |
| All Location | Dropdown | Filter all locations (Staff view only) |
| All Status | Dropdown | Filter by task status (Staff view only) |
| Search | Text input | Search by staff name or ID |
| View Mode Toggle | Toggle group | Pill-style toggle with gray background |

### 2.1 View Mode Toggle Features

- Sliding indicator animation
- Keyboard navigation (Arrow keys)
- Badge counts
- Loading state
- Press feedback
- Scroll position preservation
- Fade transition on content switch

---

## 3. Store Result Card - Detail

### 3.1 Card Header

| Element | Description |
|---------|-------------|
| Store Location | Region + Area + Store ID (teal color for region) |
| Store Name | Bold, large font (e.g., "OCEAN PARK") |
| Start Time | Label (gray) + datetime |
| Completed Time | Label (teal) + datetime |
| Menu Button | 3-dot icon for options |

### 3.2 Image Grid

| Element | Description |
|---------|-------------|
| Image Card | Card with border, contains header (title + 3-dot menu), image thumbnail, uploaded date |
| Card Header | Title "Picture at [Location] (count)" + 3-dot menu button |
| Image Thumbnail | Aspect ratio 16:10, with play icon (bottom-right), hover shows "View" button |
| Uploaded Date | "Uploaded: Dec 01, 2025" format below image |
| Scroll Buttons | Circular buttons with arrow icons when scrollable |

### 3.3 Image Lightbox

| Element | Description |
|---------|-------------|
| Overlay | Dark semi-transparent background |
| Image Display | Large centered image |
| Prev/Next Buttons | Navigation arrows |
| Download Button | Download icon button |
| Thumbnail Strip | Horizontal strip of all images |
| Close | Click overlay to close |

### 3.4 Comments Section

| Element | Description |
|---------|-------------|
| Header | "Comments (N)" with expand/collapse arrow |
| Refresh Button | Icon to refresh/reload comments |
| Date Separator | Date divider (e.g., "Tuesday, December 16th") |
| Comment Item | Avatar + Name + Time + Content |
| Comment Input | Text input with send button (pink arrow) |

### 3.5 Completed By Section

| Element | Description |
|---------|-------------|
| Badge | Green theme (bg-green-50, border-green-200) |
| Staff Name | Name of who completed |
| Cloud Check Icon | mdi_cloud-check-outline.png |

---

## 4. Task Status Cards - Detail

| Status | Badge | Color Theme | Text |
|--------|-------|-------------|------|
| SUCCESS | Dot (teal) + "SUCCESS" | Blue (bg-blue-50, border-l-4 border-teal-400) | ĐÃ HOÀN THÀNH CÔNG VIỆC |
| FAILED | Dot (orange) + "FAILED" | Orange (bg-orange-50, border-l-4 border-orange-500) | KHÔNG HOÀN THÀNH CÔNG VIỆC |
| IN_PROGRESS | Dot (yellow) + "IN PROCESS" | Yellow (bg-yellow-50, border-l-4 border-yellow-500) | CHƯA HOÀN THÀNH CÔNG VIỆC |
| NOT_STARTED | Dot (gray) + "NOT STARTED" | Gray (bg-gray-50, border-l-4 border-gray-300) | CHƯA BẮT ĐẦU |

**Card Elements:**
- Status badge with colored dot indicator (pill-style, white bg with colored border)
- Status text (bold, color-coded)
- Link báo cáo (clickable link, blue text)
- Like button (pink bg-pink-100, filled heart icon, "Like" text)
- User avatars (who liked, stacked with -space-x-2)
- Like count text (e.g., "2 likes")

---

## 5. Staff Card - Detail

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

## 6. Workflow Steps Panel - Detail

### 6.1 Trigger

- User-check icon (SVG with user + checkmark) in bottom row of Task Info section
- Click opens panel with backdrop overlay

### 6.2 Panel Layout

| Element | Description |
|---------|-------------|
| Backdrop | Dark semi-transparent overlay (bg-black/30), click to close |
| Panel | Fixed right side, width 414px, white background, full height, scrollable |
| Round Tabs | Centered tab group for Round 1, Round 2 (gray bg, active: white bg + pink text) |
| Steps Timeline | Vertical timeline with step icons and connecting lines |

### 6.3 Step Icons (30x30 rounded circle with border)

| Step | Icon | Description |
|------|------|-------------|
| Step 1 | Document with export arrow | SUBMIT |
| Step 2 | Checkmark | APPROVE |
| Step 3 | Gear/Settings | DO TASK |
| Step 4 | Large checkmark | CHECK |

**Icon Colors:**
- Active (non-pending): #C5055B (pink)
- Inactive (pending): #9B9B9B (gray)

### 6.4 Step Status Badges

| Status | Label | Dot Color | Background | Border | Text |
|--------|-------|-----------|------------|--------|------|
| completed | Done | #297EF6 | #E5F0FF | #297EF6 | #297EF6 |
| in_progress | In process | #EDA600 | #EDA600/5 | #EDA600 | #EDA600 |
| pending | Pending | gray-400 | gray-100 | gray-400 | gray-500 |
| submitted | Submited | #1BBA5E | #EBFFF3 | #1BBA5E | #1BBA5E |

### 6.5 Step Card Elements

| Element | Description |
|---------|-------------|
| Step Title | "Step N: {name}" - bold, large font |
| Status Badge | Dot + label, pill style |
| Assignee Avatar | 30x30 rounded, top-right of card |
| Assign to | Label + name or skip info |
| Start Day / End Day | Two columns with dates |
| Comment Section | Gray background box with quote marks |

### 6.6 Timeline Connecting Lines

- 2px width, #C5055B color
- Absolute positioning from bottom of icon to next step's icon
- Line starts at top: 30px and extends to bottom: -20px
- Hidden for last step

---

## 7. Store Results Display Order

| Priority | Status | Description |
|----------|--------|-------------|
| 1 (Top) | `in_progress` / `not_started` | Stores that haven't completed |
| 2 | `failed` | Stores that could not complete |
| 3 (Bottom) | `success` | Stores that completed successfully |

**Within `success` status:** Sorted by completion time (descending), earlier at bottom.

---

## 8. Data Types

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
  taskType: 'image' | 'text' | 'checklist' | 'yes_no';
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
  title: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  count?: number;
}

// Comment
interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userInitials: string;
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
  progress: number;
  progressText: string;
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
  name: string;
  status: 'completed' | 'in_progress' | 'pending' | 'submitted';
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  startDay?: string;
  endDay?: string;
  comment?: string;
  skipInfo?: string;
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

## 9. API Endpoints - Detail

### 9.1 Get Task Detail

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
```

### 9.2 Get Store Results

```yaml
get:
  tags:
    - WS-Tasks
  summary: "Task Store Results API"
  description: |
    # Business Logic
      ## 1. Get Store Results
        ### Order By
          - status priority: in_progress/not_started → failed → success
          - Within success: completed_time DESC

  operationId: getTaskStoreResults
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: integer

    - name: region
      in: query
      required: false
      schema:
        type: string

    - name: area
      in: query
      required: false
      schema:
        type: string

    - name: store
      in: query
      required: false
      schema:
        type: string

  responses:
    200:
      description: OK
```

### 9.3 Get Staff Results

```yaml
get:
  tags:
    - WS-Tasks
  summary: "Task Staff Results API"

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

  responses:
    200:
      description: OK
```

### 9.4 Post Comment

```yaml
post:
  tags:
    - WS-Tasks
  summary: "Add Comment API"

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

  responses:
    201:
      description: Created
    400:
      description: Bad Request
    401:
      description: Unauthorized
```

### 9.5 Like Task Result

```yaml
post:
  tags:
    - WS-Tasks
  summary: "Like Task Result API"
  description: Toggle like - if already liked, remove; if not, add

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

### 9.6 Send Reminder [PROD-ONLY]

```yaml
post:
  tags:
    - WS-Tasks
  summary: "Send Reminder API"

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
```

---

## 10. Schema Definitions

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

    WorkflowStep:
      type: object
      properties:
        id:
          type: string
        step:
          type: integer
        name:
          type: string
        status:
          type: string
          enum: [completed, in_progress, pending, submitted]
        assignee:
          $ref: "#/components/schemas/StaffSimple"
        startDay:
          type: string
        endDay:
          type: string
        comment:
          type: string
```

---

## 11. Files Reference

### 11.1 Frontend Files

```
frontend/src/
├── app/tasks/
│   ├── [id]/
│   │   ├── page.tsx              # Server component with generateStaticParams
│   │   └── TaskDetailClient.tsx  # Client component for task detail UI
│   └── detail/
│       └── page.tsx              # Auto-redirect to nearest deadline task
├── components/tasks/
│   ├── TaskDetailHeader.tsx
│   ├── TaskFilterBar.tsx
│   ├── ImageGrid.tsx
│   ├── ImageLightbox.tsx
│   ├── CommentsSection.tsx
│   ├── StoreResultCard.tsx
│   ├── TaskStatusCard.tsx
│   ├── YesNoStatusSection.tsx
│   ├── StaffCard.tsx
│   └── WorkflowStepsPanel.tsx
├── types/
│   └── tasks.ts
└── data/
    └── mockTaskDetail.ts
```

### 11.2 Backend Files

| Feature | File |
|---------|------|
| Controller | `app/Http/Controllers/Api/V1/TaskController.php` |
| Model | `app/Models/Task.php` |
| Resource | `app/Http/Resources/TaskDetailResource.php` |

---

## 12. Pending Features

| Feature | Priority | Status |
|---------|----------|--------|
| API Integration | High | ⏳ Pending |
| Real Store Data | High | ⏳ Pending |
| Push Notifications for Reminder | Medium | ⏳ Pending |
| Export Results | Low | ⏳ Pending |

---

## 13. Changelog

| Date | Changes |
|------|---------|
| 2025-12-29 | Initial spec documentation |
| 2025-12-29 | Added navigation flow: click row in Task List or click Detail menu |
| 2025-12-29 | Added /tasks/detail route with auto-redirect to nearest deadline task |
| 2025-12-29 | Created /tasks/[id] page for task detail display |
| 2025-12-29 | Fixed static export: added generateStaticParams and split into Server/Client components |
| 2025-12-29 | Integrated StoreResultCard with ImageGrid and CommentsSection |
| 2025-12-29 | Redesigned Task Header: horizontal layout with task info left, stats cards right |
| 2025-12-30 | Updated View Mode Toggle UI: pill-style toggle with gray bg, white active button |
| 2025-12-30 | Enhanced View Mode Toggle UX: sliding indicator, keyboard navigation, badges |
| 2025-12-30 | Task Header layout: Task Type, Manual Link and User Icon moved to bottom |
| 2025-12-30 | Filter dropdowns: Added count badges with slate-300 border |
| 2025-12-30 | Store Card: Start time and Completed time now on same row |
| 2025-12-30 | Store Card: Redesigned layout with unified main content section |
| 2025-12-30 | Task Status Card: Redesigned with badge dot indicator, Like button |
| 2025-12-30 | Image Grid: Redesigned cards with border, header, 16:10 aspect ratio |
| 2025-12-30 | Store Card: Changed Completed by badge to green theme |
| 2025-12-30 | Store Card (Image/Results): Removed TaskStatusCard section |
| 2025-12-30 | Store Card: Added cloud-check icon |
| 2025-12-30 | Store Card: Added viewMode prop for comment view |
| 2025-12-30 | Comments Section: Consistent UI for all views |
| 2025-12-31 | YesNoStatusSection: New component for Yes/No task type |
| 2025-12-31 | StoreResultCard: Added taskType prop |
| 2026-01-03 | Store Results Sorting: Added display order logic |
| 2026-01-03 | WorkflowStepsPanel: New slide-in panel component |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
| 2026-01-06 | Updated API section with OpenAPI format |
| 2026-01-08 | Split spec into basic and detail files |
