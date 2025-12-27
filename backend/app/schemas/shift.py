from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date, time
from decimal import Decimal


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
