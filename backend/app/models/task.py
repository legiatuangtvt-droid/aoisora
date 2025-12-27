from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Date, Time, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from ..core.database import Base


class CodeMaster(Base):
    __tablename__ = "code_master"

    code_master_id = Column(Integer, primary_key=True, index=True)
    code_type = Column(String(50), nullable=False)  # task_type, response_type, status
    code = Column(String(50), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(String)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())

    # Unique constraint on (code_type, code) handled at DB level


class Manual(Base):
    __tablename__ = "manuals"

    manual_id = Column(Integer, primary_key=True, index=True)
    manual_name = Column(String(255), nullable=False)
    manual_url = Column(String)
    description = Column(String)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    tasks = relationship("Task", back_populates="manual")


class CheckList(Base):
    __tablename__ = "check_lists"

    check_list_id = Column(Integer, primary_key=True, index=True)
    check_list_name = Column(String(500), nullable=False)
    description = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())

    # Relationships
    task_check_lists = relationship("TaskCheckList", back_populates="check_list")


class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(Integer, primary_key=True, index=True)
    task_name = Column(String(500), nullable=False)
    task_description = Column(Text)
    manual_id = Column(Integer, ForeignKey("manuals.manual_id", ondelete="SET NULL"))
    task_type_id = Column(Integer, ForeignKey("code_master.code_master_id"))
    response_type_id = Column(Integer, ForeignKey("code_master.code_master_id"))
    response_num = Column(Integer)
    is_repeat = Column(Boolean, default=False)
    repeat_config = Column(JSONB)  # {"frequency": "weekly", "days": [1,3,5]}
    dept_id = Column(Integer, ForeignKey("departments.department_id", ondelete="SET NULL"))
    assigned_store_id = Column(Integer, ForeignKey("stores.store_id", ondelete="SET NULL"))
    assigned_staff_id = Column(Integer, ForeignKey("staff.staff_id", ondelete="SET NULL"))
    do_staff_id = Column(Integer, ForeignKey("staff.staff_id", ondelete="SET NULL"))
    status_id = Column(Integer, ForeignKey("code_master.code_master_id"))
    priority = Column(String(20), default="normal")  # low, normal, high, urgent
    start_date = Column(Date)
    end_date = Column(Date)
    start_time = Column(Time)
    due_datetime = Column(DateTime)
    completed_time = Column(DateTime)
    comment = Column(Text)
    attachments = Column(JSONB)  # [{"url": "...", "name": "..."}]
    created_staff_id = Column(Integer, ForeignKey("staff.staff_id"))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    manual = relationship("Manual", back_populates="tasks")
    task_type = relationship("CodeMaster", foreign_keys=[task_type_id])
    response_type = relationship("CodeMaster", foreign_keys=[response_type_id])
    status = relationship("CodeMaster", foreign_keys=[status_id])
    department = relationship("Department", foreign_keys=[dept_id])
    assigned_store = relationship("Store", foreign_keys=[assigned_store_id])
    assigned_staff = relationship("Staff", foreign_keys=[assigned_staff_id], back_populates="assigned_tasks")
    do_staff = relationship("Staff", foreign_keys=[do_staff_id], back_populates="executed_tasks")
    created_staff = relationship("Staff", foreign_keys=[created_staff_id], back_populates="created_tasks")

    # Check list relationship
    task_check_lists = relationship("TaskCheckList", back_populates="task", cascade="all, delete-orphan")


class TaskCheckList(Base):
    __tablename__ = "task_check_list"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.task_id", ondelete="CASCADE"))
    check_list_id = Column(Integer, ForeignKey("check_lists.check_list_id", ondelete="CASCADE"))
    check_status = Column(Boolean, default=False)
    completed_at = Column(DateTime)
    completed_by = Column(Integer, ForeignKey("staff.staff_id"))
    notes = Column(Text)

    # Relationships
    task = relationship("Task", back_populates="task_check_lists")
    check_list = relationship("CheckList", back_populates="task_check_lists")
    completed_by_staff = relationship("Staff", foreign_keys=[completed_by])
