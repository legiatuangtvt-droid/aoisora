from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import date, timedelta
from decimal import Decimal

from ...core.database import get_db
from ...core.security import get_current_user, check_role, MANAGERS_AND_ABOVE
from ...models import ShiftCode, ShiftAssignment, Staff, Store, Notification
from ...schemas import (
    ShiftCodeCreate, ShiftCodeUpdate, ShiftCodeResponse, ShiftCodeGenerate,
    ShiftAssignmentCreate, ShiftAssignmentUpdate, ShiftAssignmentResponse, ShiftAssignmentWithDetails,
    BulkShiftAssignmentCreate, BulkShiftAssignmentResponse,
    DailySchedule, WeeklyScheduleResponse,
    ManHourSummary, ManHourReport,
)

router = APIRouter()


# ============================================
# Helper Functions
# ============================================

def create_shift_notification(db: Session, assignment: ShiftAssignment, actor_id: int):
    """Create notification for shift assignment"""
    shift_code = db.query(ShiftCode).filter(ShiftCode.shift_code_id == assignment.shift_code_id).first()
    shift_name = shift_code.shift_name if shift_code else "Unknown"

    notification = Notification(
        recipient_staff_id=assignment.staff_id,
        sender_staff_id=actor_id,
        notification_type="shift_assigned",
        title="Shift Assignment",
        message=f"You have been assigned to {shift_name} on {assignment.shift_date}",
        link_url="/dws/daily-schedule"
    )
    db.add(notification)


def get_monday(d: date) -> date:
    """Get Monday of the week for given date"""
    return d - timedelta(days=d.weekday())


# ============================================
# Shift Code Endpoints
# ============================================

@router.get("/codes/", response_model=List[ShiftCodeResponse])
async def get_all_shift_codes(
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    db: Session = Depends(get_db),
):
    """
    Get all shift codes.
    """
    query = db.query(ShiftCode)

    if is_active is not None:
        query = query.filter(ShiftCode.is_active == is_active)

    codes = query.order_by(ShiftCode.shift_code).all()
    return [ShiftCodeResponse.model_validate(c) for c in codes]


@router.get("/codes/{shift_code_id}", response_model=ShiftCodeResponse)
async def get_shift_code(shift_code_id: int, db: Session = Depends(get_db)):
    """
    Get shift code by ID.
    """
    code = db.query(ShiftCode).filter(ShiftCode.shift_code_id == shift_code_id).first()
    if not code:
        raise HTTPException(status_code=404, detail="Shift code not found")

    return ShiftCodeResponse.model_validate(code)


@router.post("/codes/", response_model=ShiftCodeResponse, dependencies=[Depends(check_role(MANAGERS_AND_ABOVE))])
async def create_shift_code(code_data: ShiftCodeCreate, db: Session = Depends(get_db)):
    """
    Create new shift code. Only managers can create.
    """
    # Check uniqueness
    existing = db.query(ShiftCode).filter(ShiftCode.shift_code == code_data.shift_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Shift code already exists")

    code = ShiftCode(**code_data.model_dump())
    db.add(code)
    db.commit()
    db.refresh(code)

    return ShiftCodeResponse.model_validate(code)


@router.put("/codes/{shift_code_id}", response_model=ShiftCodeResponse, dependencies=[Depends(check_role(MANAGERS_AND_ABOVE))])
async def update_shift_code(
    shift_code_id: int,
    code_data: ShiftCodeUpdate,
    db: Session = Depends(get_db)
):
    """
    Update shift code. Only managers can update.
    """
    code = db.query(ShiftCode).filter(ShiftCode.shift_code_id == shift_code_id).first()
    if not code:
        raise HTTPException(status_code=404, detail="Shift code not found")

    update_data = code_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(code, field, value)

    db.commit()
    db.refresh(code)

    return ShiftCodeResponse.model_validate(code)


@router.delete("/codes/{shift_code_id}", dependencies=[Depends(check_role(MANAGERS_AND_ABOVE))])
async def delete_shift_code(shift_code_id: int, db: Session = Depends(get_db)):
    """
    Delete shift code (soft delete by setting is_active=False).
    """
    code = db.query(ShiftCode).filter(ShiftCode.shift_code_id == shift_code_id).first()
    if not code:
        raise HTTPException(status_code=404, detail="Shift code not found")

    code.is_active = False
    db.commit()

    return {"message": "Shift code deactivated successfully"}


@router.post("/codes/generate", response_model=List[ShiftCodeResponse], dependencies=[Depends(check_role(MANAGERS_AND_ABOVE))])
async def generate_shift_codes(
    params: ShiftCodeGenerate,
    db: Session = Depends(get_db)
):
    """
    Auto-generate shift codes based on parameters.
    Example: V812 = V (char) + 8 (hours) + 12 (time code for 06:00)
    """
    generated = []
    char = params.char_prefix.upper()

    for duration in range(int(params.duration_range[0]), int(params.duration_range[1]) + 1):
        for start_hour in range(params.start_hour_range[0], params.start_hour_range[1] + 1):
            for start_min in [0, 30]:
                # Calculate time code: hour*2 + minute/30
                time_code = start_hour * 2 + (start_min // 30)

                # Calculate end time
                total_minutes = start_hour * 60 + start_min + int(duration * 60)
                end_hour = (total_minutes // 60) % 24
                end_min = total_minutes % 60

                shift_code = f"{char}{duration}{time_code:02d}"

                # Check if already exists
                existing = db.query(ShiftCode).filter(ShiftCode.shift_code == shift_code).first()
                if existing:
                    continue

                # Create shift code
                new_code = ShiftCode(
                    shift_code=shift_code,
                    shift_name=f"Ca {shift_code}",
                    start_time=f"{start_hour:02d}:{start_min:02d}:00",
                    end_time=f"{end_hour:02d}:{end_min:02d}:00",
                    duration_hours=Decimal(str(duration)),
                    color_code="#3B82F6",  # Default blue
                    is_active=True
                )
                db.add(new_code)
                generated.append(new_code)

    db.commit()

    return [ShiftCodeResponse.model_validate(c) for c in generated]


# ============================================
# Shift Assignment Endpoints
# ============================================

@router.get("/assignments/", response_model=List[ShiftAssignmentWithDetails])
async def get_all_assignments(
    store_id: Optional[int] = Query(None, description="Filter by store"),
    staff_id: Optional[int] = Query(None, description="Filter by staff"),
    shift_date: Optional[date] = Query(None, description="Filter by specific date"),
    start_date: Optional[date] = Query(None, description="Filter by start date (>=)"),
    end_date: Optional[date] = Query(None, description="Filter by end date (<=)"),
    status: Optional[str] = Query(None, description="Filter by status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """
    Get all shift assignments with optional filters.
    """
    query = db.query(ShiftAssignment).options(
        joinedload(ShiftAssignment.shift_code_rel)
    )

    if store_id:
        query = query.filter(ShiftAssignment.store_id == store_id)
    if staff_id:
        query = query.filter(ShiftAssignment.staff_id == staff_id)
    if shift_date:
        query = query.filter(ShiftAssignment.shift_date == shift_date)
    if start_date:
        query = query.filter(ShiftAssignment.shift_date >= start_date)
    if end_date:
        query = query.filter(ShiftAssignment.shift_date <= end_date)
    if status:
        query = query.filter(ShiftAssignment.status == status)

    assignments = query.order_by(ShiftAssignment.shift_date, ShiftAssignment.staff_id).offset(skip).limit(limit).all()

    result = []
    for a in assignments:
        a_data = ShiftAssignmentWithDetails.model_validate(a)
        if a.shift_code_rel:
            a_data.shift_code_rel = ShiftCodeResponse.model_validate(a.shift_code_rel)
        result.append(a_data)

    return result


@router.get("/assignments/{assignment_id}", response_model=ShiftAssignmentWithDetails)
async def get_assignment(assignment_id: int, db: Session = Depends(get_db)):
    """
    Get shift assignment by ID.
    """
    assignment = db.query(ShiftAssignment).options(
        joinedload(ShiftAssignment.shift_code_rel)
    ).filter(ShiftAssignment.assignment_id == assignment_id).first()

    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    result = ShiftAssignmentWithDetails.model_validate(assignment)
    if assignment.shift_code_rel:
        result.shift_code_rel = ShiftCodeResponse.model_validate(assignment.shift_code_rel)

    return result


@router.post("/assignments/", response_model=ShiftAssignmentResponse)
async def create_assignment(
    assignment_data: ShiftAssignmentCreate,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create new shift assignment.
    """
    # Check for duplicate
    existing = db.query(ShiftAssignment).filter(
        ShiftAssignment.staff_id == assignment_data.staff_id,
        ShiftAssignment.shift_date == assignment_data.shift_date,
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Staff already has an assignment for this date")

    assignment = ShiftAssignment(**assignment_data.model_dump())
    db.add(assignment)

    # Create notification
    if assignment.staff_id != current_user.staff_id:
        create_shift_notification(db, assignment, current_user.staff_id)

    db.commit()
    db.refresh(assignment)

    return ShiftAssignmentResponse.model_validate(assignment)


@router.post("/assignments/bulk", response_model=BulkShiftAssignmentResponse)
async def create_bulk_assignments(
    bulk_data: BulkShiftAssignmentCreate,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create multiple shift assignments at once.
    """
    success = 0
    failed = 0
    errors = []

    for assignment_data in bulk_data.assignments:
        try:
            # Check for duplicate
            existing = db.query(ShiftAssignment).filter(
                ShiftAssignment.staff_id == assignment_data.staff_id,
                ShiftAssignment.shift_date == assignment_data.shift_date,
            ).first()

            if existing:
                errors.append(f"Staff {assignment_data.staff_id} already has assignment on {assignment_data.shift_date}")
                failed += 1
                continue

            assignment = ShiftAssignment(**assignment_data.model_dump())
            db.add(assignment)

            # Create notification
            if assignment.staff_id != current_user.staff_id:
                create_shift_notification(db, assignment, current_user.staff_id)

            success += 1

        except Exception as e:
            errors.append(str(e))
            failed += 1

    db.commit()

    return BulkShiftAssignmentResponse(success=success, failed=failed, errors=errors)


@router.put("/assignments/{assignment_id}", response_model=ShiftAssignmentResponse)
async def update_assignment(
    assignment_id: int,
    assignment_data: ShiftAssignmentUpdate,
    db: Session = Depends(get_db)
):
    """
    Update shift assignment.
    """
    assignment = db.query(ShiftAssignment).filter(ShiftAssignment.assignment_id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    update_data = assignment_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(assignment, field, value)

    db.commit()
    db.refresh(assignment)

    return ShiftAssignmentResponse.model_validate(assignment)


@router.put("/assignments/{assignment_id}/confirm", response_model=ShiftAssignmentResponse)
async def confirm_assignment(
    assignment_id: int,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Confirm shift assignment by staff.
    """
    assignment = db.query(ShiftAssignment).filter(ShiftAssignment.assignment_id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Only the assigned staff can confirm
    if assignment.staff_id != current_user.staff_id:
        raise HTTPException(status_code=403, detail="Not authorized to confirm this assignment")

    assignment.status = "confirmed"
    db.commit()
    db.refresh(assignment)

    return ShiftAssignmentResponse.model_validate(assignment)


@router.delete("/assignments/{assignment_id}")
async def delete_assignment(assignment_id: int, db: Session = Depends(get_db)):
    """
    Delete shift assignment.
    """
    assignment = db.query(ShiftAssignment).filter(ShiftAssignment.assignment_id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    db.delete(assignment)
    db.commit()

    return {"message": "Assignment deleted successfully"}


# ============================================
# Weekly Schedule View
# ============================================

@router.get("/weekly/{store_id}", response_model=WeeklyScheduleResponse)
async def get_weekly_schedule(
    store_id: int,
    week_start: Optional[date] = Query(None, description="Week start date (Monday)"),
    db: Session = Depends(get_db)
):
    """
    Get weekly schedule for a store.
    """
    store = db.query(Store).filter(Store.store_id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    # Get Monday of the requested week
    if week_start is None:
        week_start = get_monday(date.today())
    else:
        week_start = get_monday(week_start)

    week_end = week_start + timedelta(days=6)

    # Get all assignments for the week
    assignments = db.query(ShiftAssignment).options(
        joinedload(ShiftAssignment.shift_code_rel)
    ).filter(
        ShiftAssignment.store_id == store_id,
        ShiftAssignment.shift_date >= week_start,
        ShiftAssignment.shift_date <= week_end
    ).all()

    # Group by day
    days_data = {}
    day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    for i in range(7):
        current_date = week_start + timedelta(days=i)
        days_data[current_date] = DailySchedule(
            date=current_date,
            day_name=day_names[i],
            assignments=[],
            total_hours=Decimal("0")
        )

    for a in assignments:
        if a.shift_date in days_data:
            a_data = ShiftAssignmentWithDetails.model_validate(a)
            if a.shift_code_rel:
                a_data.shift_code_rel = ShiftCodeResponse.model_validate(a.shift_code_rel)
                days_data[a.shift_date].total_hours += a.shift_code_rel.duration_hours or Decimal("0")
            days_data[a.shift_date].assignments.append(a_data)

    # Calculate total week hours
    total_week_hours = sum(day.total_hours for day in days_data.values())

    return WeeklyScheduleResponse(
        store_id=store_id,
        store_name=store.store_name,
        week_start=week_start,
        week_end=week_end,
        days=list(days_data.values()),
        total_week_hours=total_week_hours
    )


# ============================================
# Man-Hour Report
# ============================================

@router.get("/manhours/daily", response_model=List[ManHourSummary])
async def get_daily_manhours(
    report_date: date = Query(..., description="Report date"),
    region_id: Optional[int] = Query(None, description="Filter by region"),
    db: Session = Depends(get_db)
):
    """
    Get daily man-hour summary for all stores.
    """
    TEMPLATE_HOURS = Decimal("80")  # Standard 80 hours per day

    query = db.query(Store)
    if region_id:
        query = query.filter(Store.region_id == region_id)

    stores = query.filter(Store.status == "active").all()
    result = []

    for store in stores:
        # Get all assignments for the store on this date
        assignments = db.query(ShiftAssignment).options(
            joinedload(ShiftAssignment.shift_code_rel)
        ).filter(
            ShiftAssignment.store_id == store.store_id,
            ShiftAssignment.shift_date == report_date
        ).all()

        # Calculate actual hours
        actual_hours = Decimal("0")
        for a in assignments:
            if a.shift_code_rel and a.shift_code_rel.duration_hours:
                actual_hours += a.shift_code_rel.duration_hours

        diff_hours = actual_hours - TEMPLATE_HOURS

        if diff_hours > 0:
            status = "THỪA"
        elif diff_hours < 0:
            status = "THIẾU"
        else:
            status = "ĐẠT CHUẨN"

        result.append(ManHourSummary(
            date=report_date,
            store_id=store.store_id,
            store_name=store.store_name,
            template_hours=TEMPLATE_HOURS,
            actual_hours=actual_hours,
            diff_hours=diff_hours,
            status=status
        ))

    return result
