from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from ..core.database import Base


class ManualFolder(Base):
    """Folder for organizing manuals - like Aoi  Quy trinh/Thu muc"""
    __tablename__ = "manual_folders"

    folder_id = Column(Integer, primary_key=True, index=True)
    folder_name = Column(String(255), nullable=False)
    parent_folder_id = Column(Integer, ForeignKey("manual_folders.folder_id", ondelete="CASCADE"))
    store_id = Column(Integer, ForeignKey("stores.store_id", ondelete="SET NULL"))  # NULL = all stores
    description = Column(Text)
    icon = Column(String(50))  # Icon name or emoji
    color = Column(String(7))  # Hex color: #3B82F6
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer, ForeignKey("staff.staff_id"))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Self-referential relationship for nested folders
    parent_folder = relationship("ManualFolder", remote_side=[folder_id], back_populates="child_folders")
    child_folders = relationship("ManualFolder", back_populates="parent_folder", cascade="all, delete-orphan")

    # Relationships
    store = relationship("Store", foreign_keys=[store_id])
    created_by_staff = relationship("Staff", foreign_keys=[created_by])
    manuals = relationship("ManualDocument", back_populates="folder", cascade="all, delete-orphan")


class ManualDocument(Base):
    """Manual document - like Aoi  manual/quy trinh"""
    __tablename__ = "manual_documents"

    document_id = Column(Integer, primary_key=True, index=True)
    folder_id = Column(Integer, ForeignKey("manual_folders.folder_id", ondelete="CASCADE"))
    document_code = Column(String(50))  # Manual code like MNL-001
    document_name = Column(String(500), nullable=False)
    description = Column(Text)

    # Content - can be rich text or link to external
    content_type = Column(String(20), default="html")  # html, pdf, video, link
    content = Column(Text)  # HTML content or URL
    external_url = Column(String(500))  # Link to Aoi  or other source

    # Metadata
    thumbnail_url = Column(String(500))
    tags = Column(JSONB)  # ["tag1", "tag2"]

    # Publishing status
    status = Column(String(20), default="draft")  # draft, published, archived
    published_at = Column(DateTime)

    # Stats
    view_count = Column(Integer, default=0)

    # Version control
    version = Column(Integer, default=1)

    # Access control
    store_id = Column(Integer, ForeignKey("stores.store_id", ondelete="SET NULL"))  # NULL = all stores
    is_public = Column(Boolean, default=True)  # Visible to all staff

    # Audit
    created_by = Column(Integer, ForeignKey("staff.staff_id"))
    updated_by = Column(Integer, ForeignKey("staff.staff_id"))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    folder = relationship("ManualFolder", back_populates="manuals")
    store = relationship("Store", foreign_keys=[store_id])
    created_by_staff = relationship("Staff", foreign_keys=[created_by])
    updated_by_staff = relationship("Staff", foreign_keys=[updated_by])
    steps = relationship("ManualStep", back_populates="document", cascade="all, delete-orphan", order_by="ManualStep.step_number")


class ManualStep(Base):
    """Step in a manual document - like Teachme Biz step-based manual"""
    __tablename__ = "manual_steps"

    step_id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("manual_documents.document_id", ondelete="CASCADE"), nullable=False)
    step_number = Column(Integer, nullable=False)  # 0 = cover, 1+ = steps
    step_type = Column(String(20), default="step")  # cover, step

    # Content
    title = Column(String(500))
    description = Column(Text)

    # Media
    media_type = Column(String(20))  # image, video, none
    media_url = Column(String(500))  # URL to uploaded file
    media_thumbnail = Column(String(500))  # Thumbnail for video

    # Annotations/Overlays stored as JSON
    # For images: [{"type": "rectangle", "x": 100, "y": 50, "width": 200, "height": 100, "color": "#FF0000", "strokeWidth": 2}, ...]
    # For videos: [{"type": "subtitle", "startTime": 0, "endTime": 5, "text": "..."}, {"type": "marker", "time": 3, "x": 100, "y": 50, "shape": "rectangle", "duration": 1.5}, ...]
    annotations = Column(JSONB, default=[])

    # Video-specific
    video_trim_start = Column(Integer)  # Start time in seconds
    video_trim_end = Column(Integer)  # End time in seconds
    video_muted = Column(Boolean, default=False)

    # Metadata
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    document = relationship("ManualDocument", back_populates="steps")


class ManualMedia(Base):
    """Uploaded media files for manuals"""
    __tablename__ = "manual_media"

    media_id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("manual_documents.document_id", ondelete="CASCADE"))
    step_id = Column(Integer, ForeignKey("manual_steps.step_id", ondelete="CASCADE"))

    # File info
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(50))  # image/png, video/mp4, etc.
    file_size = Column(Integer)  # bytes
    file_url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500))

    # Processed/edited version
    edited_url = Column(String(500))  # URL to edited version with annotations baked in

    # Metadata
    width = Column(Integer)
    height = Column(Integer)
    duration = Column(Integer)  # Video duration in seconds

    uploaded_by = Column(Integer, ForeignKey("staff.staff_id"))
    created_at = Column(DateTime, default=func.now())

    # Relationships
    document = relationship("ManualDocument")
    step = relationship("ManualStep")
    uploaded_by_staff = relationship("Staff", foreign_keys=[uploaded_by])


class ManualViewLog(Base):
    """Track manual views for analytics"""
    __tablename__ = "manual_view_logs"

    log_id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("manual_documents.document_id", ondelete="CASCADE"))
    staff_id = Column(Integer, ForeignKey("staff.staff_id", ondelete="CASCADE"))
    viewed_at = Column(DateTime, default=func.now())

    # Relationships
    document = relationship("ManualDocument")
    staff = relationship("Staff")
