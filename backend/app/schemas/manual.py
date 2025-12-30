from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ============================================
# ManualFolder Schemas
# ============================================

class ManualFolderBase(BaseModel):
    folder_name: str
    parent_folder_id: Optional[int] = None
    store_id: Optional[int] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True


class ManualFolderCreate(ManualFolderBase):
    created_by: Optional[int] = None


class ManualFolderUpdate(BaseModel):
    folder_name: Optional[str] = None
    parent_folder_id: Optional[int] = None
    store_id: Optional[int] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class ManualFolderResponse(ManualFolderBase):
    folder_id: int
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ManualFolderWithStats(ManualFolderResponse):
    """Folder with document count and child folder count"""
    document_count: int = 0
    child_folder_count: int = 0
    total_views: int = 0


class ManualFolderTree(ManualFolderResponse):
    """Folder with nested children for tree view"""
    child_folders: List["ManualFolderTree"] = []
    documents: List["ManualDocumentResponse"] = []


# ============================================
# ManualDocument Schemas
# ============================================

class ManualDocumentBase(BaseModel):
    folder_id: Optional[int] = None
    document_code: Optional[str] = None
    document_name: str
    description: Optional[str] = None
    content_type: str = "html"
    content: Optional[str] = None
    external_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    tags: Optional[List[str]] = None
    status: str = "draft"
    store_id: Optional[int] = None
    is_public: bool = True


class ManualDocumentCreate(ManualDocumentBase):
    created_by: Optional[int] = None


class ManualDocumentUpdate(BaseModel):
    folder_id: Optional[int] = None
    document_code: Optional[str] = None
    document_name: Optional[str] = None
    description: Optional[str] = None
    content_type: Optional[str] = None
    content: Optional[str] = None
    external_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None
    store_id: Optional[int] = None
    is_public: Optional[bool] = None
    updated_by: Optional[int] = None


class ManualDocumentResponse(ManualDocumentBase):
    document_id: int
    view_count: int = 0
    version: int = 1
    published_at: Optional[datetime] = None
    created_by: Optional[int] = None
    updated_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ManualDocumentWithFolder(ManualDocumentResponse):
    """Document with folder info"""
    folder: Optional[ManualFolderResponse] = None


# ============================================
# ManualStep Schemas (Step-based manual like Teachme Biz)
# ============================================

class AnnotationBase(BaseModel):
    """Base annotation for image/video overlays"""
    type: str  # rectangle, circle, text, arrow, blur, highlight, subtitle, marker

    # Position (for images and video markers)
    x: Optional[float] = None
    y: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None

    # Style
    color: Optional[str] = "#FF0000"
    stroke_width: Optional[int] = 2
    fill_color: Optional[str] = None
    font_size: Optional[int] = 16

    # Content (for text, subtitle)
    text: Optional[str] = None

    # Video-specific timing
    start_time: Optional[float] = None  # seconds
    end_time: Optional[float] = None
    duration: Optional[float] = 1.5  # for markers


class ManualStepBase(BaseModel):
    step_number: int  # 0 = cover, 1+ = steps
    step_type: str = "step"  # cover, step
    title: Optional[str] = None
    description: Optional[str] = None
    media_type: Optional[str] = None  # image, video, none
    media_url: Optional[str] = None
    media_thumbnail: Optional[str] = None
    annotations: Optional[List[dict]] = []
    video_trim_start: Optional[int] = None
    video_trim_end: Optional[int] = None
    video_muted: bool = False
    sort_order: int = 0
    is_active: bool = True


class ManualStepCreate(ManualStepBase):
    document_id: int


class ManualStepUpdate(BaseModel):
    step_number: Optional[int] = None
    step_type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    media_type: Optional[str] = None
    media_url: Optional[str] = None
    media_thumbnail: Optional[str] = None
    annotations: Optional[List[dict]] = None
    video_trim_start: Optional[int] = None
    video_trim_end: Optional[int] = None
    video_muted: Optional[bool] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class ManualStepResponse(ManualStepBase):
    step_id: int
    document_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============================================
# ManualMedia Schemas (Uploaded files)
# ============================================

class ManualMediaBase(BaseModel):
    file_name: str
    file_type: Optional[str] = None
    file_size: Optional[int] = None
    file_url: str
    thumbnail_url: Optional[str] = None
    edited_url: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    duration: Optional[int] = None


class ManualMediaCreate(ManualMediaBase):
    document_id: Optional[int] = None
    step_id: Optional[int] = None
    uploaded_by: Optional[int] = None


class ManualMediaResponse(ManualMediaBase):
    media_id: int
    document_id: Optional[int] = None
    step_id: Optional[int] = None
    uploaded_by: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================
# Document with Steps (Full manual content)
# ============================================

class ManualDocumentWithSteps(ManualDocumentResponse):
    """Document with all steps for editor"""
    steps: List[ManualStepResponse] = []
    folder: Optional[ManualFolderResponse] = None


# ============================================
# ManualViewLog Schemas
# ============================================

class ManualViewLogCreate(BaseModel):
    document_id: int
    staff_id: int


class ManualViewLogResponse(BaseModel):
    log_id: int
    document_id: int
    staff_id: int
    viewed_at: datetime

    class Config:
        from_attributes = True


# ============================================
# List/Browse Response Schemas
# ============================================

class FolderBrowseResponse(BaseModel):
    """Response for browsing a folder - like Google Drive / Aoi """
    current_folder: Optional[ManualFolderResponse] = None
    breadcrumb: List[ManualFolderResponse] = []
    folders: List[ManualFolderWithStats] = []
    documents: List[ManualDocumentResponse] = []
    total_folders: int = 0
    total_documents: int = 0


class ManualSearchResult(BaseModel):
    """Search result item"""
    type: str  # "folder" or "document"
    folder: Optional[ManualFolderResponse] = None
    document: Optional[ManualDocumentResponse] = None


class ManualSearchResponse(BaseModel):
    """Search response"""
    query: str
    results: List[ManualSearchResult] = []
    total: int = 0


# Rebuild models with forward references
ManualFolderTree.model_rebuild()
ManualDocumentWithFolder.model_rebuild()
ManualDocumentWithSteps.model_rebuild()
