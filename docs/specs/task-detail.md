# Task Detail Screen Specification

> **Status**: In Development
> **Last Updated**: 2025-12-29
> **Screen ID**: SCR_TASK_DETAIL
> **Route**: /tasks/[id]

---

## 1. Overview

This screen displays detailed task information from HQ to stores. It supports multiple view modes:
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
| Task Type | Type with icon | "Task type: Image" |
| Manual Link | Clickable link in pink | "Manual link" |

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
| Region | Dropdown | Filter by region |
| Area | Dropdown | Filter by area (dependent on Region) |
| Store | Dropdown | Filter by store (dependent on Area) |
| All Location | Dropdown | Filter all locations (Staff view) |
| All Status | Dropdown | Filter by task status (Staff view) |
| Search | Text input | Search by staff name or ID |
| Results Button | Toggle | Switch to Results view |
| Comment Button | Toggle | Switch to Comment view |

### 3.3 Store Card - Results View (C.1 Store Card)

| Element | Description |
|---------|-------------|
| Store Location | Region + Area + Store ID |
| Store Name | Bold, large font (e.g., "OCEAN PARK") |
| Start Time | Label + datetime |
| Completed Time | Label + datetime |
| Menu Button | 3-dot icon for options |

### 3.4 Image Grid (C.2 Image Grid)

| Element | Description |
|---------|-------------|
| Image Card | Card with title "Picture at [Location] (count)" |
| Image Thumbnail | Thumbnail with hover "View" button |
| Uploaded Date | Date below thumbnail |
| Scroll Arrow | Left/right navigation arrows |

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

| Status | Color | Text |
|--------|-------|------|
| SUCCESS | Green (bg-green-50, border-green-500) | ĐÃ HOÀN THÀNH CÔNG VIỆC |
| FAILED | Orange/Red (bg-orange-50, border-orange-500) | KHÔNG HOÀN THÀNH CÔNG VIỆC |
| IN_PROGRESS | Yellow (bg-yellow-50, border-yellow-500) | CHƯA HOÀN THÀNH CÔNG VIỆC |

**Card Elements:**
- Status badge (color-coded)
- Status text (bold, color-coded)
- Link báo cáo (clickable link)
- Like button with count
- User avatars (who liked)

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
├── app/tasks/[id]/
│   ├── page.tsx
│   └── TaskDetailClient.tsx
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
