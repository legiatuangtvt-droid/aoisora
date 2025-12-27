from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from ..core.database import Base


class Region(Base):
    __tablename__ = "regions"

    region_id = Column(Integer, primary_key=True, index=True)
    region_name = Column(String(255), nullable=False)
    region_code = Column(String(50), unique=True)
    description = Column(String)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    stores = relationship("Store", back_populates="region")


class Department(Base):
    __tablename__ = "departments"

    department_id = Column(Integer, primary_key=True, index=True)
    department_name = Column(String(255), nullable=False)
    department_code = Column(String(50), unique=True)
    description = Column(String)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    staff = relationship("Staff", back_populates="department")


class Store(Base):
    __tablename__ = "stores"

    store_id = Column(Integer, primary_key=True, index=True)
    store_name = Column(String(255), nullable=False)
    store_code = Column(String(50), unique=True)
    region_id = Column(Integer, ForeignKey("regions.region_id", ondelete="SET NULL"))
    address = Column(String)
    phone = Column(String(20))
    email = Column(String(100))
    manager_id = Column(Integer, ForeignKey("staff.staff_id", ondelete="SET NULL"))
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    region = relationship("Region", back_populates="stores")
    manager = relationship("Staff", foreign_keys=[manager_id], back_populates="managed_store")
    staff = relationship("Staff", foreign_keys="Staff.store_id", back_populates="store")


class Staff(Base):
    __tablename__ = "staff"

    staff_id = Column(Integer, primary_key=True, index=True)
    staff_name = Column(String(255), nullable=False)
    staff_code = Column(String(50), unique=True)
    email = Column(String(100), unique=True)
    phone = Column(String(20))
    store_id = Column(Integer, ForeignKey("stores.store_id", ondelete="SET NULL"))
    department_id = Column(Integer, ForeignKey("departments.department_id", ondelete="SET NULL"))
    role = Column(String(50))  # manager, supervisor, staff
    password_hash = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    store = relationship("Store", foreign_keys=[store_id], back_populates="staff")
    department = relationship("Department", back_populates="staff")
    managed_store = relationship("Store", foreign_keys="Store.manager_id", back_populates="manager")

    # Task relationships
    assigned_tasks = relationship("Task", foreign_keys="Task.assigned_staff_id", back_populates="assigned_staff")
    executed_tasks = relationship("Task", foreign_keys="Task.do_staff_id", back_populates="do_staff")
    created_tasks = relationship("Task", foreign_keys="Task.created_staff_id", back_populates="created_staff")

    # Notification relationships
    received_notifications = relationship("Notification", foreign_keys="Notification.recipient_staff_id", back_populates="recipient")
    sent_notifications = relationship("Notification", foreign_keys="Notification.sender_staff_id", back_populates="sender")

    # Shift relationships
    shift_assignments = relationship("ShiftAssignment", foreign_keys="ShiftAssignment.staff_id", back_populates="staff")
