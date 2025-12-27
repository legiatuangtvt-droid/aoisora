from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, func
from sqlalchemy.orm import relationship
from ..core.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, index=True)
    recipient_staff_id = Column(Integer, ForeignKey("staff.staff_id", ondelete="CASCADE"), nullable=False)
    sender_staff_id = Column(Integer, ForeignKey("staff.staff_id", ondelete="SET NULL"))
    notification_type = Column(String(50))  # task_assigned, task_status_changed, shift_assigned
    title = Column(String(255), nullable=False)
    message = Column(Text)
    link_url = Column(String)  # /tasks/123, /shifts
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime)
    created_at = Column(DateTime, default=func.now())

    # Relationships
    recipient = relationship("Staff", foreign_keys=[recipient_staff_id], back_populates="received_notifications")
    sender = relationship("Staff", foreign_keys=[sender_staff_id], back_populates="sent_notifications")
