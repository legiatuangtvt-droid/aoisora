"""
Notifications API Router
Handles all notification-related endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc
from typing import Optional
from datetime import datetime

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.notification import Notification
from ...models.staff import Staff
from ...schemas.notification import (
    NotificationCreate,
    NotificationResponse,
    NotificationListResponse,
    UnreadCountResponse,
)

router = APIRouter()


# ============================================
# Get Notifications for Current User
# ============================================

@router.get("", response_model=NotificationListResponse)
async def get_my_notifications(
    is_read: Optional[bool] = Query(None, description="Filter by read status"),
    notification_type: Optional[str] = Query(None, description="Filter by type"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get notifications for the current logged-in user"""
    query = db.query(Notification).filter(
        Notification.recipient_staff_id == current_user.staff_id
    )

    # Apply filters
    if is_read is not None:
        query = query.filter(Notification.is_read == is_read)
    if notification_type:
        query = query.filter(Notification.notification_type == notification_type)

    # Get total count
    total = query.count()

    # Get unread count
    unread_count = db.query(Notification).filter(
        Notification.recipient_staff_id == current_user.staff_id,
        Notification.is_read == False
    ).count()

    # Get paginated results
    notifications = query.order_by(desc(Notification.created_at)).offset(skip).limit(limit).all()

    return NotificationListResponse(
        notifications=notifications,
        total=total,
        unread_count=unread_count
    )


# ============================================
# Get Unread Count
# ============================================

@router.get("/unread-count", response_model=UnreadCountResponse)
async def get_unread_count(
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get count of unread notifications for current user"""
    count = db.query(Notification).filter(
        Notification.recipient_staff_id == current_user.staff_id,
        Notification.is_read == False
    ).count()

    return UnreadCountResponse(count=count)


# ============================================
# Get Single Notification
# ============================================

@router.get("/{notification_id}", response_model=NotificationResponse)
async def get_notification(
    notification_id: int,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific notification by ID"""
    notification = db.query(Notification).filter(
        Notification.notification_id == notification_id
    ).first()

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    # Ensure user can only see their own notifications
    if notification.recipient_staff_id != current_user.staff_id:
        raise HTTPException(status_code=403, detail="Access denied")

    return notification


# ============================================
# Mark Notification as Read
# ============================================

@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_as_read(
    notification_id: int,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a notification as read"""
    notification = db.query(Notification).filter(
        Notification.notification_id == notification_id
    ).first()

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    if notification.recipient_staff_id != current_user.staff_id:
        raise HTTPException(status_code=403, detail="Access denied")

    if not notification.is_read:
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        db.commit()
        db.refresh(notification)

    return notification


# ============================================
# Mark All Notifications as Read
# ============================================

@router.put("/mark-all-read", response_model=dict)
async def mark_all_as_read(
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark all notifications as read for current user"""
    updated = db.query(Notification).filter(
        Notification.recipient_staff_id == current_user.staff_id,
        Notification.is_read == False
    ).update({
        "is_read": True,
        "read_at": datetime.utcnow()
    })

    db.commit()

    return {"message": f"Marked {updated} notifications as read"}


# ============================================
# Create Notification (Internal/Admin use)
# ============================================

@router.post("", response_model=NotificationResponse)
async def create_notification(
    notification_data: NotificationCreate,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new notification (typically called internally)"""
    # Verify recipient exists
    recipient = db.query(Staff).filter(
        Staff.staff_id == notification_data.recipient_staff_id
    ).first()

    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")

    notification = Notification(
        recipient_staff_id=notification_data.recipient_staff_id,
        sender_staff_id=notification_data.sender_staff_id or current_user.staff_id,
        notification_type=notification_data.notification_type,
        title=notification_data.title,
        message=notification_data.message,
        link_url=notification_data.link_url
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification


# ============================================
# Delete Notification
# ============================================

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: int,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a notification"""
    notification = db.query(Notification).filter(
        Notification.notification_id == notification_id
    ).first()

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    if notification.recipient_staff_id != current_user.staff_id:
        raise HTTPException(status_code=403, detail="Access denied")

    db.delete(notification)
    db.commit()

    return {"message": "Notification deleted successfully"}


# ============================================
# Delete All Read Notifications
# ============================================

@router.delete("/clear-read", response_model=dict)
async def clear_read_notifications(
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete all read notifications for current user"""
    deleted = db.query(Notification).filter(
        Notification.recipient_staff_id == current_user.staff_id,
        Notification.is_read == True
    ).delete()

    db.commit()

    return {"message": f"Deleted {deleted} read notifications"}
