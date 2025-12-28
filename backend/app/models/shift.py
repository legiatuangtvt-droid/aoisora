from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Date, Time, Numeric, func
from sqlalchemy.orm import relationship
from ..core.database import Base


class TaskGroup(Base):
    """Task group for categorizing scheduled tasks (POS, PERI, DRY, MMD, etc.)"""
    __tablename__ = "task_groups"

    group_id = Column(String(20), primary_key=True)  # POS, PERI, DRY, etc.
    group_code = Column(String(20), nullable=False)
    group_name = Column(String(100))
    priority = Column(Integer, default=50)
    sort_order = Column(Integer, default=0)
    color_bg = Column(String(7))  # Hex: #e2e8f0
    color_text = Column(String(7))  # Hex: #1e293b
    color_border = Column(String(7))  # Hex: #94a3b8
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())

    # Relationships
    scheduled_tasks = relationship("DailyScheduleTask", back_populates="task_group")


class DailyScheduleTask(Base):
    """Scheduled tasks assigned to staff for a specific date and time slot"""
    __tablename__ = "daily_schedule_tasks"

    schedule_task_id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.staff_id", ondelete="CASCADE"), nullable=False)
    store_id = Column(Integer, ForeignKey("stores.store_id"))
    schedule_date = Column(Date, nullable=False)
    group_id = Column(String(20), ForeignKey("task_groups.group_id"))
    task_code = Column(String(20), nullable=False)
    task_name = Column(String(255), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    status = Column(String(20), default="pending")  # pending, in_progress, completed, skipped
    completed_at = Column(DateTime)
    notes = Column(String)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    staff = relationship("Staff", foreign_keys=[staff_id])
    store = relationship("Store", foreign_keys=[store_id])
    task_group = relationship("TaskGroup", back_populates="scheduled_tasks")


class ShiftCode(Base):
    __tablename__ = "shift_codes"

    shift_code_id = Column(Integer, primary_key=True, index=True)
    shift_code = Column(String(10), unique=True, nullable=False)  # S, C, T, OFF, V812, etc.
    shift_name = Column(String(100), nullable=False)  # Ca Sáng, Ca Chiều, etc.
    start_time = Column(Time)  # NULL for OFF
    end_time = Column(Time)
    duration_hours = Column(Numeric(4, 2))  # 8.00, 8.50, etc.
    color_code = Column(String(7))  # Hex color: #FFD700
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())

    # Relationships
    assignments = relationship("ShiftAssignment", back_populates="shift_code_rel")


class ShiftAssignment(Base):
    __tablename__ = "shift_assignments"

    assignment_id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.staff_id", ondelete="CASCADE"), nullable=False)
    store_id = Column(Integer, ForeignKey("stores.store_id"))
    shift_date = Column(Date, nullable=False)
    shift_code_id = Column(Integer, ForeignKey("shift_codes.shift_code_id"))
    status = Column(String(20), default="assigned")  # assigned, confirmed, completed, cancelled
    notes = Column(String)
    assigned_by = Column(Integer, ForeignKey("staff.staff_id"))
    assigned_at = Column(DateTime, default=func.now())

    # Relationships
    staff = relationship("Staff", foreign_keys=[staff_id], back_populates="shift_assignments")
    store = relationship("Store", foreign_keys=[store_id])
    shift_code_rel = relationship("ShiftCode", back_populates="assignments")
    assigned_by_staff = relationship("Staff", foreign_keys=[assigned_by])

    # Unique constraint on (staff_id, shift_date, shift_code_id) handled at DB level
