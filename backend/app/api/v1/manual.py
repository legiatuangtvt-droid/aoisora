from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional
import os
import uuid
from datetime import datetime
from ...core.database import get_db
from ...models.manual import ManualFolder, ManualDocument, ManualStep, ManualMedia, ManualViewLog
from ...schemas.manual import (
    ManualFolderCreate, ManualFolderUpdate, ManualFolderResponse, ManualFolderWithStats,
    ManualDocumentCreate, ManualDocumentUpdate, ManualDocumentResponse, ManualDocumentWithSteps,
    ManualStepCreate, ManualStepUpdate, ManualStepResponse,
    ManualMediaCreate, ManualMediaResponse,
    FolderBrowseResponse, ManualSearchResponse, ManualSearchResult,
)

router = APIRouter(prefix="/manual", tags=["Manual"])


# ============================================
# Folder Endpoints
# ============================================

@router.get("/folders", response_model=List[ManualFolderWithStats])
def get_folders(
    parent_id: Optional[int] = Query(None, description="Parent folder ID, null for root folders"),
    store_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Get folders at a specific level (root if parent_id is None)"""
    query = db.query(ManualFolder).filter(ManualFolder.is_active == True)

    if parent_id is None:
        query = query.filter(ManualFolder.parent_folder_id.is_(None))
    else:
        query = query.filter(ManualFolder.parent_folder_id == parent_id)

    if store_id:
        query = query.filter(or_(ManualFolder.store_id.is_(None), ManualFolder.store_id == store_id))

    folders = query.order_by(ManualFolder.sort_order, ManualFolder.folder_name).all()

    # Add stats for each folder
    result = []
    for folder in folders:
        # Count documents in folder
        doc_count = db.query(func.count(ManualDocument.document_id)).filter(
            ManualDocument.folder_id == folder.folder_id
        ).scalar()

        # Count child folders
        child_count = db.query(func.count(ManualFolder.folder_id)).filter(
            ManualFolder.parent_folder_id == folder.folder_id,
            ManualFolder.is_active == True
        ).scalar()

        # Total views
        total_views = db.query(func.coalesce(func.sum(ManualDocument.view_count), 0)).filter(
            ManualDocument.folder_id == folder.folder_id
        ).scalar()

        folder_dict = {
            **folder.__dict__,
            "document_count": doc_count,
            "child_folder_count": child_count,
            "total_views": total_views,
        }
        result.append(ManualFolderWithStats(**folder_dict))

    return result


@router.get("/folders/{folder_id}", response_model=ManualFolderResponse)
def get_folder(folder_id: int, db: Session = Depends(get_db)):
    """Get a specific folder by ID"""
    folder = db.query(ManualFolder).filter(
        ManualFolder.folder_id == folder_id,
        ManualFolder.is_active == True
    ).first()
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found")
    return folder


@router.post("/folders", response_model=ManualFolderResponse)
def create_folder(folder: ManualFolderCreate, db: Session = Depends(get_db)):
    """Create a new folder"""
    db_folder = ManualFolder(**folder.model_dump())
    db.add(db_folder)
    db.commit()
    db.refresh(db_folder)
    return db_folder


@router.put("/folders/{folder_id}", response_model=ManualFolderResponse)
def update_folder(folder_id: int, folder: ManualFolderUpdate, db: Session = Depends(get_db)):
    """Update a folder"""
    db_folder = db.query(ManualFolder).filter(ManualFolder.folder_id == folder_id).first()
    if not db_folder:
        raise HTTPException(status_code=404, detail="Folder not found")

    update_data = folder.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_folder, key, value)

    db.commit()
    db.refresh(db_folder)
    return db_folder


@router.delete("/folders/{folder_id}")
def delete_folder(folder_id: int, db: Session = Depends(get_db)):
    """Soft delete a folder (sets is_active to False)"""
    db_folder = db.query(ManualFolder).filter(ManualFolder.folder_id == folder_id).first()
    if not db_folder:
        raise HTTPException(status_code=404, detail="Folder not found")

    db_folder.is_active = False
    db.commit()
    return {"message": "Folder deleted successfully"}


# ============================================
# Document Endpoints
# ============================================

@router.get("/documents", response_model=List[ManualDocumentResponse])
def get_documents(
    folder_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    store_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get documents with optional filters"""
    query = db.query(ManualDocument)

    if folder_id is not None:
        query = query.filter(ManualDocument.folder_id == folder_id)

    if status:
        query = query.filter(ManualDocument.status == status)

    if store_id:
        query = query.filter(or_(ManualDocument.store_id.is_(None), ManualDocument.store_id == store_id))

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(or_(
            ManualDocument.document_name.ilike(search_pattern),
            ManualDocument.description.ilike(search_pattern),
            ManualDocument.document_code.ilike(search_pattern)
        ))

    documents = query.order_by(ManualDocument.document_name).offset(skip).limit(limit).all()
    return documents


@router.get("/documents/{document_id}", response_model=ManualDocumentResponse)
def get_document(document_id: int, db: Session = Depends(get_db)):
    """Get a specific document by ID"""
    document = db.query(ManualDocument).filter(ManualDocument.document_id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@router.post("/documents", response_model=ManualDocumentResponse)
def create_document(document: ManualDocumentCreate, db: Session = Depends(get_db)):
    """Create a new document"""
    db_document = ManualDocument(**document.model_dump())
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document


@router.put("/documents/{document_id}", response_model=ManualDocumentResponse)
def update_document(document_id: int, document: ManualDocumentUpdate, db: Session = Depends(get_db)):
    """Update a document"""
    db_document = db.query(ManualDocument).filter(ManualDocument.document_id == document_id).first()
    if not db_document:
        raise HTTPException(status_code=404, detail="Document not found")

    update_data = document.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_document, key, value)

    db.commit()
    db.refresh(db_document)
    return db_document


@router.delete("/documents/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    """Delete a document"""
    db_document = db.query(ManualDocument).filter(ManualDocument.document_id == document_id).first()
    if not db_document:
        raise HTTPException(status_code=404, detail="Document not found")

    db.delete(db_document)
    db.commit()
    return {"message": "Document deleted successfully"}


@router.put("/documents/{document_id}/move", response_model=ManualDocumentResponse)
def move_document(document_id: int, move_data: dict, db: Session = Depends(get_db)):
    """Move a document to another folder"""
    db_document = db.query(ManualDocument).filter(ManualDocument.document_id == document_id).first()
    if not db_document:
        raise HTTPException(status_code=404, detail="Document not found")

    folder_id = move_data.get("folder_id")
    if folder_id is None:
        raise HTTPException(status_code=400, detail="folder_id is required")

    # Verify target folder exists
    target_folder = db.query(ManualFolder).filter(
        ManualFolder.folder_id == folder_id,
        ManualFolder.is_active == True
    ).first()
    if not target_folder:
        raise HTTPException(status_code=404, detail="Target folder not found")

    # Update document folder
    db_document.folder_id = folder_id
    db.commit()
    db.refresh(db_document)
    return db_document


@router.post("/documents/{document_id}/view")
def log_document_view(document_id: int, staff_id: int, db: Session = Depends(get_db)):
    """Log a document view and increment view count"""
    document = db.query(ManualDocument).filter(ManualDocument.document_id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Increment view count
    document.view_count = (document.view_count or 0) + 1

    # Log the view
    view_log = ManualViewLog(document_id=document_id, staff_id=staff_id)
    db.add(view_log)
    db.commit()

    return {"view_count": document.view_count}


# ============================================
# Browse Endpoint (like Google Drive / Aoi )
# ============================================

@router.get("/browse", response_model=FolderBrowseResponse)
def browse_folder(
    folder_id: Optional[int] = Query(None, description="Folder ID to browse, null for root"),
    store_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Browse a folder - returns folder info, breadcrumb, child folders and documents"""

    # Get current folder
    current_folder = None
    if folder_id:
        current_folder = db.query(ManualFolder).filter(
            ManualFolder.folder_id == folder_id,
            ManualFolder.is_active == True
        ).first()
        if not current_folder:
            raise HTTPException(status_code=404, detail="Folder not found")

    # Build breadcrumb
    breadcrumb = []
    if current_folder:
        folder = current_folder
        while folder:
            breadcrumb.insert(0, ManualFolderResponse.model_validate(folder))
            if folder.parent_folder_id:
                folder = db.query(ManualFolder).filter(ManualFolder.folder_id == folder.parent_folder_id).first()
            else:
                break

    # Get child folders
    folders_query = db.query(ManualFolder).filter(ManualFolder.is_active == True)
    if folder_id:
        folders_query = folders_query.filter(ManualFolder.parent_folder_id == folder_id)
    else:
        folders_query = folders_query.filter(ManualFolder.parent_folder_id.is_(None))

    if store_id:
        folders_query = folders_query.filter(or_(ManualFolder.store_id.is_(None), ManualFolder.store_id == store_id))

    folders = folders_query.order_by(ManualFolder.sort_order, ManualFolder.folder_name).all()

    # Add stats to folders
    folders_with_stats = []
    for folder in folders:
        doc_count = db.query(func.count(ManualDocument.document_id)).filter(
            ManualDocument.folder_id == folder.folder_id
        ).scalar()

        child_count = db.query(func.count(ManualFolder.folder_id)).filter(
            ManualFolder.parent_folder_id == folder.folder_id,
            ManualFolder.is_active == True
        ).scalar()

        total_views = db.query(func.coalesce(func.sum(ManualDocument.view_count), 0)).filter(
            ManualDocument.folder_id == folder.folder_id
        ).scalar()

        folder_dict = {
            **folder.__dict__,
            "document_count": doc_count,
            "child_folder_count": child_count,
            "total_views": total_views,
        }
        folders_with_stats.append(ManualFolderWithStats(**folder_dict))

    # Get documents in current folder
    docs_query = db.query(ManualDocument)
    if folder_id:
        docs_query = docs_query.filter(ManualDocument.folder_id == folder_id)
    else:
        docs_query = docs_query.filter(ManualDocument.folder_id.is_(None))

    if store_id:
        docs_query = docs_query.filter(or_(ManualDocument.store_id.is_(None), ManualDocument.store_id == store_id))

    documents = docs_query.order_by(ManualDocument.document_name).all()

    return FolderBrowseResponse(
        current_folder=ManualFolderResponse.model_validate(current_folder) if current_folder else None,
        breadcrumb=breadcrumb,
        folders=folders_with_stats,
        documents=[ManualDocumentResponse.model_validate(doc) for doc in documents],
        total_folders=len(folders_with_stats),
        total_documents=len(documents),
    )


# ============================================
# Search Endpoint
# ============================================

@router.get("/search", response_model=ManualSearchResponse)
def search_manual(
    q: str = Query(..., min_length=1, description="Search query"),
    store_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Search folders and documents"""
    search_pattern = f"%{q}%"
    results = []

    # Search folders
    folders_query = db.query(ManualFolder).filter(
        ManualFolder.is_active == True,
        or_(
            ManualFolder.folder_name.ilike(search_pattern),
            ManualFolder.description.ilike(search_pattern)
        )
    )
    if store_id:
        folders_query = folders_query.filter(or_(ManualFolder.store_id.is_(None), ManualFolder.store_id == store_id))

    for folder in folders_query.limit(20).all():
        results.append(ManualSearchResult(
            type="folder",
            folder=ManualFolderResponse.model_validate(folder)
        ))

    # Search documents
    docs_query = db.query(ManualDocument).filter(
        or_(
            ManualDocument.document_name.ilike(search_pattern),
            ManualDocument.description.ilike(search_pattern),
            ManualDocument.document_code.ilike(search_pattern)
        )
    )
    if store_id:
        docs_query = docs_query.filter(or_(ManualDocument.store_id.is_(None), ManualDocument.store_id == store_id))

    for doc in docs_query.limit(30).all():
        results.append(ManualSearchResult(
            type="document",
            document=ManualDocumentResponse.model_validate(doc)
        ))

    return ManualSearchResponse(query=q, results=results, total=len(results))


# ============================================
# Step Endpoints (Teachme Biz style)
# ============================================

@router.get("/documents/{document_id}/steps", response_model=List[ManualStepResponse])
def get_document_steps(document_id: int, db: Session = Depends(get_db)):
    """Get all steps for a document"""
    document = db.query(ManualDocument).filter(ManualDocument.document_id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    steps = db.query(ManualStep).filter(
        ManualStep.document_id == document_id,
        ManualStep.is_active == True
    ).order_by(ManualStep.step_number).all()
    return steps


@router.get("/documents/{document_id}/full", response_model=ManualDocumentWithSteps)
def get_document_with_steps(document_id: int, db: Session = Depends(get_db)):
    """Get document with all steps - for editor"""
    document = db.query(ManualDocument).filter(ManualDocument.document_id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    steps = db.query(ManualStep).filter(
        ManualStep.document_id == document_id,
        ManualStep.is_active == True
    ).order_by(ManualStep.step_number).all()

    folder = None
    if document.folder_id:
        folder = db.query(ManualFolder).filter(ManualFolder.folder_id == document.folder_id).first()

    return ManualDocumentWithSteps(
        **document.__dict__,
        steps=[ManualStepResponse.model_validate(s) for s in steps],
        folder=ManualFolderResponse.model_validate(folder) if folder else None
    )


@router.post("/steps", response_model=ManualStepResponse)
def create_step(step: ManualStepCreate, db: Session = Depends(get_db)):
    """Create a new step"""
    document = db.query(ManualDocument).filter(ManualDocument.document_id == step.document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    db_step = ManualStep(**step.model_dump())
    db.add(db_step)
    db.commit()
    db.refresh(db_step)
    return db_step


@router.put("/steps/{step_id}", response_model=ManualStepResponse)
def update_step(step_id: int, step: ManualStepUpdate, db: Session = Depends(get_db)):
    """Update a step"""
    db_step = db.query(ManualStep).filter(ManualStep.step_id == step_id).first()
    if not db_step:
        raise HTTPException(status_code=404, detail="Step not found")

    update_data = step.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_step, key, value)

    db.commit()
    db.refresh(db_step)
    return db_step


@router.delete("/steps/{step_id}")
def delete_step(step_id: int, db: Session = Depends(get_db)):
    """Delete a step (soft delete)"""
    db_step = db.query(ManualStep).filter(ManualStep.step_id == step_id).first()
    if not db_step:
        raise HTTPException(status_code=404, detail="Step not found")

    db_step.is_active = False
    db.commit()
    return {"message": "Step deleted successfully"}


@router.post("/steps/reorder")
def reorder_steps(
    document_id: int,
    step_orders: List[dict],  # [{"step_id": 1, "step_number": 0}, {"step_id": 2, "step_number": 1}]
    db: Session = Depends(get_db)
):
    """Reorder steps in a document"""
    document = db.query(ManualDocument).filter(ManualDocument.document_id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    for order in step_orders:
        step = db.query(ManualStep).filter(
            ManualStep.step_id == order["step_id"],
            ManualStep.document_id == document_id
        ).first()
        if step:
            step.step_number = order["step_number"]

    db.commit()
    return {"message": "Steps reordered successfully"}


# ============================================
# Media Upload Endpoints
# ============================================

UPLOAD_DIR = "uploads/manual"

@router.post("/upload", response_model=ManualMediaResponse)
async def upload_media(
    file: UploadFile = File(...),
    document_id: Optional[int] = None,
    step_id: Optional[int] = None,
    uploaded_by: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Upload media file (image or video)"""
    # Create upload directory if not exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Generate unique filename
    file_ext = os.path.splitext(file.filename)[1] if file.filename else ""
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Save file
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    # Determine file type
    file_type = file.content_type or "application/octet-stream"

    # Create media record
    media = ManualMedia(
        document_id=document_id,
        step_id=step_id,
        file_name=file.filename or unique_filename,
        file_type=file_type,
        file_size=len(contents),
        file_url=f"/uploads/manual/{unique_filename}",
        uploaded_by=uploaded_by
    )
    db.add(media)
    db.commit()
    db.refresh(media)

    return media


@router.get("/media/{media_id}", response_model=ManualMediaResponse)
def get_media(media_id: int, db: Session = Depends(get_db)):
    """Get media file info"""
    media = db.query(ManualMedia).filter(ManualMedia.media_id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    return media


@router.delete("/media/{media_id}")
def delete_media(media_id: int, db: Session = Depends(get_db)):
    """Delete media file"""
    media = db.query(ManualMedia).filter(ManualMedia.media_id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")

    # Delete file from disk
    file_path = media.file_url.replace("/uploads/manual/", UPLOAD_DIR + "/")
    if os.path.exists(file_path):
        os.remove(file_path)

    db.delete(media)
    db.commit()
    return {"message": "Media deleted successfully"}
