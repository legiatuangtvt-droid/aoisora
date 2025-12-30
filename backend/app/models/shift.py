from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Date, Time, Numeric, func, Text, JSON
from sqlalchemy.orm import relationship
from ..core.database import Base


class TaskLibrary(Base):
    """Task library - master list of all possible tasks with their configurations"""
    __tablename__ = "task_library"

    task_lib_id = Column(Integer, primary_key=True, index=True)
    group_id = Column(String(20), ForeignKey("task_groups.group_id"), nullable=False)
    task_code = Column(String(20), unique=True, nullable=False)  # POS-001, PERI-002, etc.
    task_name = Column(String(255), nullable=False)
    task_type = Column(String(20), default="Fixed")  # Fixed, CTM, Product
    frequency = Column(String(20), default="Daily")  # Daily, Weekly, Monthly, Yearly
    frequency_number = Column(Integer, default=1)  # How many times per frequency
    re_unit = Column(Numeric(6, 2), default=10)  # Experience points awarded
    manual_number = Column(String(50))  # Manual reference number
    manual_link = Column(String(500))  # Link to manual
    note = Column(Text)  # Notes about the task
    concurrent_performers = Column(Integer, default=1)  # How many can do at once
    allowed_positions = Column(JSON)  # ["POS", "Leader", "MMD"]
    time_windows = Column(JSON)  # [{"startTime": "06:00", "endTime": "07:00"}, ...]
    shift_placement = Column(JSON)  # {"type": "firstOfDay"} or {"type": "lastOfShift"}
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    task_group = relationship("TaskGroup", back_populates="library_tasks")


class DailyTemplate(Base):
    """Daily schedule template for a store - defines manhour requirements and task scheduling"""
    __tablename__ = "daily_templates"

    template_id = Column(Integer, primary_key=True, index=True)
    template_code = Column(String(50), unique=True, nullable=False)  # WEEKDAY, WEEKEND, HOLIDAY
    template_name = Column(String(100), nullable=False)
    store_id = Column(Integer, ForeignKey("stores.store_id"))

    # Hourly manhour requirements (JSON: {"6": 5, "7": 5, "8": 5, ...})
    hourly_manhours = Column(JSON, default={})

    # Hourly customer counts (JSON: {"6": 70, "7": 80, "8": 60, ...})
    hourly_customers = Column(JSON, default={})

    # RE Parameters (JSON for store-specific values)
    re_parameters = Column(JSON, default={})  # areaSize, customerCount, posCount, vegetableWeight, dryGoodsVolume, employeeCount

    # Total manhour for this template
    total_manhour = Column(Numeric(6, 2), default=80)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    store = relationship("Store", foreign_keys=[store_id])
    shift_templates = relationship("ShiftTemplate", back_populates="daily_template")


class ShiftTemplate(Base):
    """Shift templates within a daily template - defines tasks for each shift type"""
    __tablename__ = "shift_templates"

    shift_template_id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("daily_templates.template_id", ondelete="CASCADE"), nullable=False)
    shift_key = Column(String(20), nullable=False)  # shift-1, shift-2, etc.
    position_id = Column(String(20))  # LEADER, POS, MERCHANDISE, MMD, CAFE
    shift_code = Column(String(10))  # V812, V829, etc.

    # Schedule tasks for this shift (JSON array)
    scheduled_tasks = Column(JSON, default=[])  # [{"groupId": "LEADER", "startTime": "06:00", "taskCode": "1501", "taskName": "Mở kho"}, ...]

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    daily_template = relationship("DailyTemplate", back_populates="shift_templates")


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
    library_tasks = relationship("TaskLibrary", back_populates="task_group")


class DailyScheduleTask(Base):
    """Scheduled tasks assigned to staff for a specific date and time slot"""
    __tablename__ = "daily_schedule_tasks"

    # Status codes (stored in code_master with code_type='TASK_STATUS')
    STATUS_NOT_YET = 1      # Not Yet - Task not started
    STATUS_DONE = 2         # Done - Task completed successfully
    STATUS_SKIPPED = 3      # Skipped - Task was skipped
    STATUS_IN_PROGRESS = 4  # In Progress - Task is currently in progress

    schedule_task_id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.staff_id", ondelete="CASCADE"), nullable=False)
    store_id = Column(Integer, ForeignKey("stores.store_id"))
    schedule_date = Column(Date, nullable=False)
    group_id = Column(String(20), ForeignKey("task_groups.group_id"))
    task_code = Column(String(20), nullable=False)
    task_name = Column(String(255), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    status = Column(Integer, default=STATUS_NOT_YET, nullable=False)  # 1=Not Yet, 2=Done, 3=Skipped, 4=In Progress
    completed_at = Column(DateTime)
    notes = Column(String)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    staff = relationship("Staff", foreign_keys=[staff_id])
    store = relationship("Store", foreign_keys=[store_id])
    task_group = relationship("TaskGroup", back_populates="scheduled_tasks")

    @property
    def status_name(self) -> str:
        """Get status name from status code"""
        status_map = {
            self.STATUS_NOT_YET: "Not Yet",
            self.STATUS_DONE: "Done",
            self.STATUS_SKIPPED: "Skipped",
            self.STATUS_IN_PROGRESS: "In Progress",
        }
        return status_map.get(self.status, "Unknown")


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
