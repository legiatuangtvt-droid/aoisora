from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ============================================
# Region Schemas
# ============================================

class RegionBase(BaseModel):
    region_name: str
    region_code: Optional[str] = None
    description: Optional[str] = None


class RegionCreate(RegionBase):
    pass


class RegionUpdate(BaseModel):
    region_name: Optional[str] = None
    region_code: Optional[str] = None
    description: Optional[str] = None


class RegionResponse(RegionBase):
    region_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============================================
# Department Schemas
# ============================================

class DepartmentBase(BaseModel):
    department_name: str
    department_code: Optional[str] = None
    description: Optional[str] = None


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    department_name: Optional[str] = None
    department_code: Optional[str] = None
    description: Optional[str] = None


class DepartmentResponse(DepartmentBase):
    department_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============================================
# Store Schemas
# ============================================

class StoreBase(BaseModel):
    store_name: str
    store_code: Optional[str] = None
    region_id: Optional[int] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    manager_id: Optional[int] = None
    status: str = "active"


class StoreCreate(StoreBase):
    pass


class StoreUpdate(BaseModel):
    store_name: Optional[str] = None
    store_code: Optional[str] = None
    region_id: Optional[int] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    manager_id: Optional[int] = None
    status: Optional[str] = None


class StoreResponse(StoreBase):
    store_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StoreWithRegion(StoreResponse):
    region: Optional[RegionResponse] = None


# ============================================
# Staff Schemas
# ============================================

class StaffBase(BaseModel):
    staff_name: str
    staff_code: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    store_id: Optional[int] = None
    department_id: Optional[int] = None
    role: Optional[str] = "staff"  # manager, supervisor, staff
    is_active: bool = True


class StaffCreate(StaffBase):
    password: str


class StaffUpdate(BaseModel):
    staff_name: Optional[str] = None
    staff_code: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    store_id: Optional[int] = None
    department_id: Optional[int] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None


class StaffResponse(StaffBase):
    staff_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StaffWithDetails(StaffResponse):
    store: Optional[StoreResponse] = None
    department: Optional[DepartmentResponse] = None


# ============================================
# Auth Schemas
# ============================================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    staff: StaffResponse


class PasswordChange(BaseModel):
    current_password: str
    new_password: str
