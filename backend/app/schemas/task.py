from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime, date, time


# ============================================
# CodeMaster Schemas
# ============================================

class CodeMasterBase(BaseModel):
    code_type: str  # task_type, response_type, status
    code: str
    name: str
    description: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True


class CodeMasterCreate(CodeMasterBase):
    pass


class CodeMasterResponse(CodeMasterBase):
    code_master_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================
# Manual Schemas
# ============================================

class ManualBase(BaseModel):
    manual_name: str
    manual_url: Optional[str] = None
    description: Optional[str] = None


class ManualCreate(ManualBase):
    pass


class ManualUpdate(BaseModel):
    manual_name: Optional[str] = None
    manual_url: Optional[str] = None
    description: Optional[str] = None


class ManualResponse(ManualBase):
    manual_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============================================
# CheckList Schemas
# ============================================

class CheckListBase(BaseModel):
    check_list_name: str
    description: Optional[str] = None
    is_active: bool = True


class CheckListCreate(CheckListBase):
    pass


class CheckListUpdate(BaseModel):
    check_list_name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class CheckListResponse(CheckListBase):
    check_list_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================
# TaskCheckList Schemas
# ============================================

class TaskCheckListBase(BaseModel):
    check_list_id: int
    check_status: bool = False
    notes: Optional[str] = None


class TaskCheckListCreate(TaskCheckListBase):
    pass


class TaskCheckListUpdate(BaseModel):
    check_status: Optional[bool] = None
    notes: Optional[str] = None


class TaskCheckListResponse(TaskCheckListBase):
    id: int
    task_id: int
    completed_at: Optional[datetime] = None
    completed_by: Optional[int] = None
    check_list: Optional[CheckListResponse] = None

    class Config:
        from_attributes = True


# ============================================
# Task Schemas
# ============================================

class TaskBase(BaseModel):
    task_name: str
    task_description: Optional[str] = None
    manual_id: Optional[int] = None
    task_type_id: Optional[int] = None
    response_type_id: Optional[int] = None
    response_num: Optional[int] = None
    is_repeat: bool = False
    repeat_config: Optional[dict] = None
    dept_id: Optional[int] = None
    assigned_store_id: Optional[int] = None
    assigned_staff_id: Optional[int] = None
    do_staff_id: Optional[int] = None
    status_id: Optional[int] = None
    priority: str = "normal"  # low, normal, high, urgent
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    due_datetime: Optional[datetime] = None
    comment: Optional[str] = None
    attachments: Optional[List[dict]] = None


class TaskCreate(TaskBase):
    created_staff_id: int
    check_list_ids: Optional[List[int]] = None  # Optional checklist IDs to attach


class TaskUpdate(BaseModel):
    task_name: Optional[str] = None
    task_description: Optional[str] = None
    manual_id: Optional[int] = None
    task_type_id: Optional[int] = None
    response_type_id: Optional[int] = None
    response_num: Optional[int] = None
    is_repeat: Optional[bool] = None
    repeat_config: Optional[dict] = None
    dept_id: Optional[int] = None
    assigned_store_id: Optional[int] = None
    assigned_staff_id: Optional[int] = None
    do_staff_id: Optional[int] = None
    status_id: Optional[int] = None
    priority: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    due_datetime: Optional[datetime] = None
    comment: Optional[str] = None
    attachments: Optional[List[dict]] = None


class TaskStatusUpdate(BaseModel):
    status_id: int
    comment: Optional[str] = None


class TaskResponse(TaskBase):
    task_id: int
    created_staff_id: Optional[int] = None
    completed_time: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskWithDetails(TaskResponse):
    task_type: Optional[CodeMasterResponse] = None
    response_type: Optional[CodeMasterResponse] = None
    status: Optional[CodeMasterResponse] = None
    manual: Optional[ManualResponse] = None
    task_check_lists: List[TaskCheckListResponse] = []

    class Config:
        from_attributes = True


# ============================================
# Task Query Params
# ============================================

class TaskQueryParams(BaseModel):
    status_id: Optional[int] = None
    dept_id: Optional[int] = None
    store_id: Optional[int] = None
    assigned_staff_id: Optional[int] = None
    do_staff_id: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    priority: Optional[str] = None
    skip: int = 0
    limit: int = 100
