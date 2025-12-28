from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, date, time
from decimal import Decimal


# ============================================
# TaskLibrary Schemas (Task Master Data)
# ============================================

class TimeWindow(BaseModel):
    startTime: str  # HH:MM
    endTime: str    # HH:MM


class ShiftPlacement(BaseModel):
    type: str  # firstOfDay, lastOfDay, firstOfShift, lastOfShift, breakTime


class TaskLibraryBase(BaseModel):
    group_id: str
    task_code: str  # POS-001, PERI-002, etc.
    task_name: str
    task_type: str = "Fixed"  # Fixed, CTM, Product
    frequency: str = "Daily"  # Daily, Weekly, Monthly, Yearly
    frequency_number: int = 1
    re_unit: Decimal = Decimal("10")  # Experience points
    manual_number: Optional[str] = None
    manual_link: Optional[str] = None
    note: Optional[str] = None
    concurrent_performers: int = 1
    allowed_positions: Optional[List[str]] = None  # ["POS", "Leader", "MMD"]
    time_windows: Optional[List[Dict[str, str]]] = None
    shift_placement: Optional[Dict[str, str]] = None
    is_active: bool = True


class TaskLibraryCreate(TaskLibraryBase):
    pass


class TaskLibraryUpdate(BaseModel):
    task_name: Optional[str] = None
    task_type: Optional[str] = None
    frequency: Optional[str] = None
    frequency_number: Optional[int] = None
    re_unit: Optional[Decimal] = None
    manual_number: Optional[str] = None
    manual_link: Optional[str] = None
    note: Optional[str] = None
    concurrent_performers: Optional[int] = None
    allowed_positions: Optional[List[str]] = None
    time_windows: Optional[List[Dict[str, str]]] = None
    shift_placement: Optional[Dict[str, str]] = None
    is_active: Optional[bool] = None


class TaskLibraryResponse(TaskLibraryBase):
    task_lib_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskLibraryWithGroup(TaskLibraryResponse):
    """Task with group info"""
    task_group: Optional["TaskGroupResponse"] = None

    class Config:
        from_attributes = True


# ============================================
# DailyTemplate Schemas
# ============================================

class REParameters(BaseModel):
    """Store-specific RE calculation parameters"""
    areaSize: int = 350  # Store area in m2
    customerCount: int = 1280  # Daily customer count
    customerCountByHour: Optional[Dict[str, int]] = None  # {"06": 70, "07": 80, ...}
    dryGoodsVolume: int = 60  # Dry goods volume
    employeeCount: int = 10
    posCount: int = 2
    vegetableWeight: int = 50  # kg


class ScheduledTaskItem(BaseModel):
    """Single task item in shift schedule"""
    groupId: str
    startTime: str  # HH:MM
    taskCode: str
    taskName: str
    isComplete: int = 0  # 0 or 1


class ShiftMapping(BaseModel):
    """Mapping between shift key and position/shift code"""
    positionId: str  # LEADER, POS, MERCHANDISE, MMD, CAFE
    shiftCode: str   # V812, V829, etc.


class DailyTemplateBase(BaseModel):
    template_code: str  # WEEKDAY, WEEKEND, HOLIDAY
    template_name: str
    store_id: Optional[int] = None
    hourly_manhours: Dict[str, float] = {}  # {"6": 5, "7": 5, ...}
    hourly_customers: Dict[str, int] = {}   # {"6": 70, "7": 80, ...}
    re_parameters: Optional[Dict[str, Any]] = None
    total_manhour: Decimal = Decimal("80")
    is_active: bool = True


class DailyTemplateCreate(DailyTemplateBase):
    pass


class DailyTemplateUpdate(BaseModel):
    template_name: Optional[str] = None
    hourly_manhours: Optional[Dict[str, float]] = None
    hourly_customers: Optional[Dict[str, int]] = None
    re_parameters: Optional[Dict[str, Any]] = None
    total_manhour: Optional[Decimal] = None
    is_active: Optional[bool] = None


class DailyTemplateResponse(DailyTemplateBase):
    template_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ShiftTemplateBase(BaseModel):
    template_id: int
    shift_key: str  # shift-1, shift-2, etc.
    position_id: Optional[str] = None
    shift_code: Optional[str] = None
    scheduled_tasks: List[Dict[str, Any]] = []


class ShiftTemplateCreate(ShiftTemplateBase):
    pass


class ShiftTemplateUpdate(BaseModel):
    position_id: Optional[str] = None
    shift_code: Optional[str] = None
    scheduled_tasks: Optional[List[Dict[str, Any]]] = None


class ShiftTemplateResponse(ShiftTemplateBase):
    shift_template_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DailyTemplateWithShifts(DailyTemplateResponse):
    """Template with all shift templates"""
    shift_templates: List[ShiftTemplateResponse] = []


# ============================================
# TaskGroup Schemas
# ============================================

class TaskGroupBase(BaseModel):
    group_id: str  # POS, PERI, DRY, etc.
    group_code: str
    group_name: Optional[str] = None
    priority: int = 50
    sort_order: int = 0
    color_bg: Optional[str] = None  # #e2e8f0
    color_text: Optional[str] = None  # #1e293b
    color_border: Optional[str] = None  # #94a3b8
    is_active: bool = True


class TaskGroupCreate(TaskGroupBase):
    pass


class TaskGroupResponse(TaskGroupBase):
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================
# DailyScheduleTask Schemas
# ============================================

class DailyScheduleTaskBase(BaseModel):
    staff_id: int
    store_id: Optional[int] = None
    schedule_date: date
    group_id: Optional[str] = None
    task_code: str
    task_name: str
    start_time: time
    end_time: time
    status: str = "pending"  # pending, in_progress, completed, skipped
    notes: Optional[str] = None


class DailyScheduleTaskCreate(DailyScheduleTaskBase):
    pass


class DailyScheduleTaskUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    completed_at: Optional[datetime] = None


class DailyScheduleTaskResponse(DailyScheduleTaskBase):
    schedule_task_id: int
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DailyScheduleTaskWithGroup(DailyScheduleTaskResponse):
    """Task with group color info"""
    task_group: Optional[TaskGroupResponse] = None

    class Config:
        from_attributes = True


class StaffDailySchedule(BaseModel):
    """All tasks for a staff member on a specific date"""
    staff_id: int
    staff_name: str
    schedule_date: date
    tasks: List[DailyScheduleTaskResponse] = []
    total_tasks: int = 0
    completed_tasks: int = 0


# ============================================
# ShiftCode Schemas
# ============================================

class ShiftCodeBase(BaseModel):
    shift_code: str  # S, C, T, OFF, V812, etc.
    shift_name: str  # Ca Sáng, Ca Chiều, etc.
    start_time: Optional[time] = None  # NULL for OFF
    end_time: Optional[time] = None
    duration_hours: Optional[Decimal] = None  # 8.00, 8.50, etc.
    color_code: Optional[str] = None  # Hex color: #FFD700
    is_active: bool = True


class ShiftCodeCreate(ShiftCodeBase):
    pass


class ShiftCodeUpdate(BaseModel):
    shift_code: Optional[str] = None
    shift_name: Optional[str] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    duration_hours: Optional[Decimal] = None
    color_code: Optional[str] = None
    is_active: Optional[bool] = None


class ShiftCodeResponse(ShiftCodeBase):
    shift_code_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ShiftCodeGenerate(BaseModel):
    """Request to auto-generate shift codes"""
    char_prefix: str = "V"  # V, C, T, S
    duration_range: List[float] = [4, 8]  # Min and max hours
    start_hour_range: List[int] = [6, 14]  # Start between 6:00 and 14:00


# ============================================
# ShiftAssignment Schemas
# ============================================

class ShiftAssignmentBase(BaseModel):
    staff_id: int
    store_id: Optional[int] = None
    shift_date: date
    shift_code_id: int
    status: str = "assigned"  # assigned, confirmed, completed, cancelled
    notes: Optional[str] = None


class ShiftAssignmentCreate(ShiftAssignmentBase):
    assigned_by: int


class ShiftAssignmentUpdate(BaseModel):
    store_id: Optional[int] = None
    shift_code_id: Optional[int] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class ShiftAssignmentResponse(ShiftAssignmentBase):
    assignment_id: int
    assigned_by: Optional[int] = None
    assigned_at: datetime

    class Config:
        from_attributes = True


class ShiftAssignmentWithDetails(ShiftAssignmentResponse):
    shift_code_rel: Optional[ShiftCodeResponse] = None
    # staff and store will be included via API

    class Config:
        from_attributes = True


# ============================================
# Bulk Operations
# ============================================

class BulkShiftAssignmentCreate(BaseModel):
    """Create multiple assignments at once"""
    assignments: List[ShiftAssignmentCreate]


class BulkShiftAssignmentResponse(BaseModel):
    success: int
    failed: int
    errors: List[str] = []


# ============================================
# Weekly Schedule View
# ============================================

class DailySchedule(BaseModel):
    date: date
    day_name: str  # Monday, Tuesday, etc.
    assignments: List[ShiftAssignmentWithDetails] = []
    total_hours: Decimal = Decimal("0")


class WeeklyScheduleResponse(BaseModel):
    store_id: int
    store_name: str
    week_start: date
    week_end: date
    days: List[DailySchedule] = []
    total_week_hours: Decimal = Decimal("0")


# ============================================
# Man-Hour Tracking
# ============================================

class ManHourSummary(BaseModel):
    date: date
    store_id: int
    store_name: str
    template_hours: Decimal = Decimal("80")  # Standard 80h/day
    actual_hours: Decimal = Decimal("0")
    diff_hours: Decimal = Decimal("0")
    status: str = "ĐẠT CHUẨN"  # THỪA, THIẾU, ĐẠT CHUẨN


class ManHourReport(BaseModel):
    period: str  # daily, weekly, monthly
    start_date: date
    end_date: date
    summaries: List[ManHourSummary] = []
    total_template: Decimal = Decimal("0")
    total_actual: Decimal = Decimal("0")
    total_diff: Decimal = Decimal("0")
