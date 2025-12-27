from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ...core.database import get_db
from ...core.security import get_current_user, get_password_hash, check_role, MANAGERS_AND_ABOVE
from ...models import Staff, Store, Department, Region
from ...schemas import (
    StaffCreate, StaffUpdate, StaffResponse, StaffWithDetails,
    StoreCreate, StoreUpdate, StoreResponse, StoreWithRegion,
    DepartmentCreate, DepartmentUpdate, DepartmentResponse,
    RegionCreate, RegionUpdate, RegionResponse,
)

router = APIRouter()


# ============================================
# Staff Endpoints
# ============================================

@router.get("/", response_model=List[StaffResponse])
async def get_all_staff(
    store_id: Optional[int] = Query(None, description="Filter by store"),
    department_id: Optional[int] = Query(None, description="Filter by department"),
    role: Optional[str] = Query(None, description="Filter by role"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """
    Get all staff with optional filters.
    """
    query = db.query(Staff)

    if store_id:
        query = query.filter(Staff.store_id == store_id)
    if department_id:
        query = query.filter(Staff.department_id == department_id)
    if role:
        query = query.filter(Staff.role == role)
    if is_active is not None:
        query = query.filter(Staff.is_active == is_active)

    staff_list = query.offset(skip).limit(limit).all()
    return [StaffResponse.model_validate(s) for s in staff_list]


@router.get("/{staff_id}", response_model=StaffWithDetails)
async def get_staff(staff_id: int, db: Session = Depends(get_db)):
    """
    Get staff by ID with store and department details.
    """
    staff = db.query(Staff).filter(Staff.staff_id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")

    result = StaffWithDetails.model_validate(staff)

    # Add store and department details
    if staff.store:
        result.store = StoreResponse.model_validate(staff.store)
    if staff.department:
        result.department = DepartmentResponse.model_validate(staff.department)

    return result


@router.post("/", response_model=StaffResponse, dependencies=[Depends(check_role(MANAGERS_AND_ABOVE))])
async def create_staff(staff_data: StaffCreate, db: Session = Depends(get_db)):
    """
    Create new staff member. Only managers can create staff.
    """
    # Check email uniqueness
    existing = db.query(Staff).filter(Staff.email == staff_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check staff code uniqueness
    if staff_data.staff_code:
        existing_code = db.query(Staff).filter(Staff.staff_code == staff_data.staff_code).first()
        if existing_code:
            raise HTTPException(status_code=400, detail="Staff code already exists")

    # Create staff with hashed password
    staff_dict = staff_data.model_dump(exclude={"password"})
    staff_dict["password_hash"] = get_password_hash(staff_data.password)

    new_staff = Staff(**staff_dict)
    db.add(new_staff)
    db.commit()
    db.refresh(new_staff)

    return StaffResponse.model_validate(new_staff)


@router.put("/{staff_id}", response_model=StaffResponse)
async def update_staff(
    staff_id: int,
    staff_data: StaffUpdate,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update staff. Staff can update themselves, managers can update anyone.
    """
    staff = db.query(Staff).filter(Staff.staff_id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")

    # Check permission: only self or manager
    if current_user.staff_id != staff_id and current_user.role not in MANAGERS_AND_ABOVE:
        raise HTTPException(status_code=403, detail="Not authorized to update this staff")

    # Update fields
    update_data = staff_data.model_dump(exclude_unset=True)

    # Handle password separately
    if "password" in update_data and update_data["password"]:
        update_data["password_hash"] = get_password_hash(update_data.pop("password"))

    for field, value in update_data.items():
        setattr(staff, field, value)

    db.commit()
    db.refresh(staff)

    return StaffResponse.model_validate(staff)


@router.delete("/{staff_id}", dependencies=[Depends(check_role(MANAGERS_AND_ABOVE))])
async def delete_staff(staff_id: int, db: Session = Depends(get_db)):
    """
    Delete staff (soft delete by setting is_active=False).
    Only managers can delete staff.
    """
    staff = db.query(Staff).filter(Staff.staff_id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")

    staff.is_active = False
    db.commit()

    return {"message": "Staff deactivated successfully"}


# ============================================
# Store Endpoints
# ============================================

@router.get("/stores/", response_model=List[StoreWithRegion])
async def get_all_stores(
    region_id: Optional[int] = Query(None, description="Filter by region"),
    status: Optional[str] = Query(None, description="Filter by status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """
    Get all stores with optional filters.
    """
    query = db.query(Store)

    if region_id:
        query = query.filter(Store.region_id == region_id)
    if status:
        query = query.filter(Store.status == status)

    stores = query.offset(skip).limit(limit).all()

    result = []
    for store in stores:
        store_data = StoreWithRegion.model_validate(store)
        if store.region:
            store_data.region = RegionResponse.model_validate(store.region)
        result.append(store_data)

    return result


@router.get("/stores/{store_id}", response_model=StoreWithRegion)
async def get_store(store_id: int, db: Session = Depends(get_db)):
    """
    Get store by ID with region details.
    """
    store = db.query(Store).filter(Store.store_id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    result = StoreWithRegion.model_validate(store)
    if store.region:
        result.region = RegionResponse.model_validate(store.region)

    return result


# ============================================
# Department Endpoints
# ============================================

@router.get("/departments/", response_model=List[DepartmentResponse])
async def get_all_departments(db: Session = Depends(get_db)):
    """
    Get all departments.
    """
    departments = db.query(Department).all()
    return [DepartmentResponse.model_validate(d) for d in departments]


@router.get("/departments/{department_id}", response_model=DepartmentResponse)
async def get_department(department_id: int, db: Session = Depends(get_db)):
    """
    Get department by ID.
    """
    department = db.query(Department).filter(Department.department_id == department_id).first()
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")

    return DepartmentResponse.model_validate(department)


# ============================================
# Region Endpoints
# ============================================

@router.get("/regions/", response_model=List[RegionResponse])
async def get_all_regions(db: Session = Depends(get_db)):
    """
    Get all regions.
    """
    regions = db.query(Region).all()
    return [RegionResponse.model_validate(r) for r in regions]


@router.get("/regions/{region_id}", response_model=RegionResponse)
async def get_region(region_id: int, db: Session = Depends(get_db)):
    """
    Get region by ID.
    """
    region = db.query(Region).filter(Region.region_id == region_id).first()
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")

    return RegionResponse.model_validate(region)
