# Task Detail Screen Specification

> **Status**: In Development
> **Last Updated**: 2025-12-29
> **Screen ID**: SCR_TASK_DETAIL
> **Routes**:
> - `/tasks/[id]` - Direct access with task ID
> - `/tasks/detail` - Auto-redirect to nearest deadline task

---

## 1. Overview

This screen displays detailed task information from HQ to stores. It supports multiple view modes:

### 1.1 Navigation Flow

| Access Method | Route | Behavior |
|---------------|-------|----------|
| Click row in Task List | `/tasks/{id}` | Displays detail of specific task |
| Click "Detail" menu in Sidebar | `/tasks/detail` | Auto-redirects to task with nearest deadline |

#### Auto-redirect Logic (`/tasks/detail`)
1. Parse all task end dates
2. Filter tasks where `endDate >= today` (not expired)
3. Sort by `endDate` ascending (nearest first)
4. Redirect to first task in sorted list
5. Fallback: If no upcoming tasks, redirect to first task in list
6. Fallback: If no tasks at all, redirect to `/tasks/list`

### 1.2 View Modes

- **Store View (Results View)**: View task results grouped by store with images and comments
- **Comment View**: View all comments across stores
- **Staff View (Card-based)**: View individual staff progress with images and comments

---

## 2. Screen Layout

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
│          │ │                                                             │  │
│          │ │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │  │
│          │ │  │ Store Card  │  │ Store Card  │  │ Store Card  │         │  │
│          │ │  │ - Images    │  │ - Images    │  │ - Images    │         │  │
│          │ │  │ - Comments  │  │ - Comments  │  │ - Comments  │         │  │
│          │ │  └─────────────┘  └─────────────┘  └─────────────┘         │  │
│          │ └─────────────────────────────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

---

## 3. Components

### 3.1 Task Header (A. Khu vuc Header)

#### A.1 Task Information

| Element | Description | Example |
|---------|-------------|---------|
| Task Level Badge | Pink badge showing task level | "Task level 1" |
| Task Name | Bold text, large font | "Trưng bày hoa ngày rằm" |
| Date Range | Start → End dates | "04 Nov - 21 Dec" |
| HQ Check Status | Status badge | "HQ Check: D097" |
| Bottom Row | Task Type + Manual Link + User Icon on same line at bottom of left side (Task Info column) | "Task type: Image | Manual link: link | [user icon]" |

#### A.2 Statistics Cards

| Card | Icon | Description | Color |
|------|------|-------------|-------|
| Not Started | Circle outline | Count of not started tasks | Gray |
| Completed | Checkmark | Count of completed tasks | Green |
| Unable to Complete | X mark | Count of unable to complete | Red/Orange |
| Average Completion Time | Clock | Average time (e.g., "60min") | Blue |

### 3.2 Filter Bar (B. Filter Bar)

| Element | Type | Description |
|---------|------|-------------|
| Region | Dropdown | Filter by region, with count badge (slate-300 border, white bg) |
| Area | Dropdown | Filter by area (dependent on Region), with count badge |
| Store | Dropdown | Filter by store (dependent on Area), with count badge |
| All Location | Dropdown | Filter all locations (Staff view) |
| All Status | Dropdown | Filter by task status (Staff view) |
| Search | Text input | Search by staff name or ID |
| View Mode Toggle | Toggle group | Switch between Results/Comment view (pill-style toggle with gray background, active button has white bg with pink text). Features: sliding indicator animation, keyboard navigation (Arrow keys), badge counts, loading state, press feedback, scroll position preservation, fade transition on content switch |

### 3.3 Store Card - Results View (C.1 Store Card)

| Element | Description |
|---------|-------------|
| Store Location | Region + Area + Store ID |
| Store Name | Bold, large font (e.g., "OCEAN PARK") |
| Start Time | Label (gray) + datetime, same row with Completed Time |
| Completed Time | Label (teal) + datetime, same row with Start Time |
| Menu Button | 3-dot icon for options |

### 3.4 Image Grid (C.2 Image Grid)

| Element | Description |
|---------|-------------|
| Image Card | Card with border, contains header (title + 3-dot menu), image thumbnail, and uploaded date |
| Card Header | Title "Picture at [Location] (count)" + 3-dot menu button |
| Image Thumbnail | Aspect ratio 16:10, with play icon (bottom-right), hover shows "View" button with search icon |
| Uploaded Date | "Uploaded: Dec 01, 2025" format below image |
| Scroll Buttons | Circular buttons with arrow icons, positioned at left/right edges when scrollable |

### 3.5 Image Lightbox (C.3 Image Lightbox)

| Element | Description |
|---------|-------------|
| Overlay | Dark semi-transparent background |
| Image Display | Large centered image |
| Prev/Next Buttons | Navigation arrows |
| Download Button | Download icon button |
| Thumbnail Strip | Horizontal strip of all images |
| Close | Click overlay to close |

### 3.6 Comments Section (C.4 Comments Section)

| Element | Description |
|---------|-------------|
| Header | "Comments (N)" with expand/collapse arrow |
| Refresh Button | Icon to refresh/reload comments |
| Date Separator | Date divider (e.g., "Tuesday, December 16th") |
| Comment Item | Avatar + Name + Time + Content |
| Comment Input | Text input with send button (pink arrow) |

### 3.7 Task Status Cards (D. Task Status Cards)

| Status | Badge | Color | Text |
|--------|-------|-------|------|
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

### 3.8 Staff Card - Staff View (F.2 Staff Card)

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

### 3.9 Workflow Steps Panel (E. Workflow Steps Panel)

| Step | Name | Fields |
|------|------|--------|
| Step 1 | SUBMIT | Assignee, Start Day, End Day, Comment |
| Step 2 | APPROVE | Assignee, Start Day, End Day, Comment |
| Step 3 | DO TASK | Skip (shows store count), Start Day, End Day |
| Step 4 | CHECK | Assignee, Start Day, End Day |

**Panel Elements:**
- Round tabs (Round 1, Round 2, etc.)
- Step cards with status icons
- Expandable/collapsible steps

---

## 4. Data Types

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

## 5. File Structure

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

## 6. API Integration

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Get Task Detail | GET | /api/v1/tasks/{id} | Get full task details |
| Get Store Results | GET | /api/v1/tasks/{id}/stores | Get results by store |
| Get Staff Results | GET | /api/v1/tasks/{id}/staffs | Get results by staff |
| Get Comments | GET | /api/v1/tasks/{id}/comments | Get all comments |
| Post Comment | POST | /api/v1/tasks/{id}/comments | Add new comment |
| Like Task | POST | /api/v1/tasks/{id}/like | Like a task result |
| Send Reminder | POST | /api/v1/tasks/{id}/reminder | Send reminder to staff |

---

## 7. Test Scenarios

### View Mode Testing

| Test Case | Action | Expected |
|-----------|--------|----------|
| Store View | Select Results view | Shows task results grouped by store with image grid |
| Staff View | Select Staff View button | Shows staff cards with progress and requirements |
| Toggle View | Switch between views | Content updates, maintains filter state |

---

## 8. Changelog

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
