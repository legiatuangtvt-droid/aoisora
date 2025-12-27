from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Date, Time, Numeric, func
from sqlalchemy.orm import relationship
from ..core.database import Base


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
