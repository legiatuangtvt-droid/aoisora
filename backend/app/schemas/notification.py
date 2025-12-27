from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ============================================
# Notification Schemas
# ============================================

class NotificationBase(BaseModel):
    recipient_staff_id: int
    sender_staff_id: Optional[int] = None
    notification_type: str  # task_assigned, task_status_changed, shift_assigned
    title: str
    message: Optional[str] = None
    link_url: Optional[str] = None


class NotificationCreate(NotificationBase):
    pass


class NotificationResponse(NotificationBase):
    notification_id: int
    is_read: bool = False
    read_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationWithSender(NotificationResponse):
    sender_name: Optional[str] = None


# ============================================
# Notification Operations
# ============================================

class NotificationMarkRead(BaseModel):
    notification_id: int


class NotificationMarkAllRead(BaseModel):
    recipient_staff_id: int


class UnreadCountResponse(BaseModel):
    count: int


# ============================================
# Notification List Response
# ============================================

class NotificationListResponse(BaseModel):
    notifications: List[NotificationResponse]
    total: int
    unread_count: int
