from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import datetime, date

from ...core.database import get_db
from ...core.security import get_current_user
from ...models import Task, TaskCheckList, CheckList, Staff, CodeMaster, Notification
from ...schemas import (
    TaskCreate, TaskUpdate, TaskStatusUpdate, TaskResponse, TaskWithDetails,
    CheckListCreate, CheckListUpdate, CheckListResponse,
    TaskCheckListCreate, TaskCheckListUpdate, TaskCheckListResponse,
    CodeMasterResponse,
)

router = APIRouter()


# ============================================
# Helper Functions
# ============================================

def create_task_notification(
    db: Session,
    task: Task,
    actor_id: int,
    notification_type: str,
    recipient_id: int
):
    """Create notification for task-related actions"""
    actor = db.query(Staff).filter(Staff.staff_id == actor_id).first()
    actor_name = actor.staff_name if actor else "Unknown"

    if notification_type == "task_assigned":
        title = "New Task Assigned"
        message = f"You have been assigned a new task: \"{task.task_name}\""
    elif notification_type == "task_status_changed":
        status = db.query(CodeMaster).filter(CodeMaster.code_master_id == task.status_id).first()
        status_name = status.name if status else "Unknown"
        title = "Task Status Updated"
        message = f"{actor_name} updated task #{task.task_id} status to {status_name}"
    elif notification_type == "task_completed":
        title = "Task Completed"
        message = f"{actor_name} completed task: \"{task.task_name}\""
    else:
        title = "Task Update"
        message = f"Task #{task.task_id} has been updated"

    notification = Notification(
        recipient_staff_id=recipient_id,
        sender_staff_id=actor_id,
        notification_type=notification_type,
        title=title,
        message=message,
        link_url=f"/tasks/{task.task_id}"
    )
    db.add(notification)


# ============================================
# Task Endpoints
# ============================================

@router.get("/", response_model=List[TaskResponse])
async def get_all_tasks(
    status_id: Optional[int] = Query(None, description="Filter by status"),
    dept_id: Optional[int] = Query(None, description="Filter by department"),
    store_id: Optional[int] = Query(None, description="Filter by store"),
    assigned_staff_id: Optional[int] = Query(None, description="Filter by assigned staff"),
    do_staff_id: Optional[int] = Query(None, description="Filter by executing staff"),
    start_date: Optional[date] = Query(None, description="Filter by start date (>=)"),
    end_date: Optional[date] = Query(None, description="Filter by end date (<=)"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """
    Get all tasks with optional filters.
    """
    query = db.query(Task)

    if status_id:
        query = query.filter(Task.status_id == status_id)
    if dept_id:
        query = query.filter(Task.dept_id == dept_id)
    if store_id:
        query = query.filter(Task.assigned_store_id == store_id)
    if assigned_staff_id:
        query = query.filter(Task.assigned_staff_id == assigned_staff_id)
    if do_staff_id:
        query = query.filter(Task.do_staff_id == do_staff_id)
    if start_date:
        query = query.filter(Task.start_date >= start_date)
    if end_date:
        query = query.filter(Task.end_date <= end_date)
    if priority:
        query = query.filter(Task.priority == priority)

    tasks = query.order_by(Task.start_date.desc(), Task.task_id.desc()).offset(skip).limit(limit).all()
    return [TaskResponse.model_validate(t) for t in tasks]


@router.get("/{task_id}", response_model=TaskWithDetails)
async def get_task(task_id: int, db: Session = Depends(get_db)):
    """
    Get task by ID with all details including checklists.
    """
    task = db.query(Task).options(
        joinedload(Task.task_type),
        joinedload(Task.response_type),
        joinedload(Task.status),
        joinedload(Task.manual),
        joinedload(Task.task_check_lists).joinedload(TaskCheckList.check_list)
    ).filter(Task.task_id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    result = TaskWithDetails.model_validate(task)

    # Add related data
    if task.task_type:
        result.task_type = CodeMasterResponse.model_validate(task.task_type)
    if task.response_type:
        result.response_type = CodeMasterResponse.model_validate(task.response_type)
    if task.status:
        result.status = CodeMasterResponse.model_validate(task.status)

    # Add checklists
    result.task_check_lists = []
    for tcl in task.task_check_lists:
        tcl_data = TaskCheckListResponse.model_validate(tcl)
        if tcl.check_list:
            tcl_data.check_list = CheckListResponse.model_validate(tcl.check_list)
        result.task_check_lists.append(tcl_data)

    return result


@router.post("/", response_model=TaskResponse)
async def create_task(
    task_data: TaskCreate,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create new task.
    """
    # Create task
    task_dict = task_data.model_dump(exclude={"check_list_ids"})
    new_task = Task(**task_dict)
    db.add(new_task)
    db.flush()  # Get task_id

    # Add checklists if provided
    if task_data.check_list_ids:
        for cl_id in task_data.check_list_ids:
            tcl = TaskCheckList(
                task_id=new_task.task_id,
                check_list_id=cl_id,
                check_status=False
            )
            db.add(tcl)

    # Create notification for assigned staff
    if new_task.do_staff_id and new_task.do_staff_id != current_user.staff_id:
        create_task_notification(
            db, new_task, current_user.staff_id,
            "task_assigned", new_task.do_staff_id
        )

    db.commit()
    db.refresh(new_task)

    return TaskResponse.model_validate(new_task)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update task.
    """
    task = db.query(Task).filter(Task.task_id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    old_do_staff_id = task.do_staff_id

    # Update fields
    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    # Create notification if do_staff_id changed
    if "do_staff_id" in update_data and task.do_staff_id != old_do_staff_id:
        if task.do_staff_id and task.do_staff_id != current_user.staff_id:
            create_task_notification(
                db, task, current_user.staff_id,
                "task_assigned", task.do_staff_id
            )

    db.commit()
    db.refresh(task)

    return TaskResponse.model_validate(task)


@router.put("/{task_id}/status", response_model=TaskResponse)
async def update_task_status(
    task_id: int,
    status_data: TaskStatusUpdate,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update task status. Creates notification for task creator.
    """
    task = db.query(Task).filter(Task.task_id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    old_status_id = task.status_id
    task.status_id = status_data.status_id

    if status_data.comment:
        task.comment = status_data.comment

    # Check if task is completed (status_id = 9 for DONE)
    if status_data.status_id == 9:
        task.completed_time = datetime.utcnow()

    # Create notification for task creator
    if task.created_staff_id and task.created_staff_id != current_user.staff_id:
        notification_type = "task_completed" if status_data.status_id == 9 else "task_status_changed"
        create_task_notification(
            db, task, current_user.staff_id,
            notification_type, task.created_staff_id
        )

    db.commit()
    db.refresh(task)

    return TaskResponse.model_validate(task)


@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete task.
    """
    task = db.query(Task).filter(Task.task_id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}


# ============================================
# Task Checklist Endpoints
# ============================================

@router.get("/{task_id}/checklists", response_model=List[TaskCheckListResponse])
async def get_task_checklists(task_id: int, db: Session = Depends(get_db)):
    """
    Get all checklists for a task.
    """
    task = db.query(Task).filter(Task.task_id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    tcls = db.query(TaskCheckList).options(
        joinedload(TaskCheckList.check_list)
    ).filter(TaskCheckList.task_id == task_id).all()

    result = []
    for tcl in tcls:
        tcl_data = TaskCheckListResponse.model_validate(tcl)
        if tcl.check_list:
            tcl_data.check_list = CheckListResponse.model_validate(tcl.check_list)
        result.append(tcl_data)

    return result


@router.post("/{task_id}/checklists", response_model=TaskCheckListResponse)
async def add_checklist_to_task(
    task_id: int,
    checklist_data: TaskCheckListCreate,
    db: Session = Depends(get_db)
):
    """
    Add a checklist to a task.
    """
    task = db.query(Task).filter(Task.task_id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    checklist = db.query(CheckList).filter(CheckList.check_list_id == checklist_data.check_list_id).first()
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist not found")

    # Check if already exists
    existing = db.query(TaskCheckList).filter(
        TaskCheckList.task_id == task_id,
        TaskCheckList.check_list_id == checklist_data.check_list_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Checklist already added to this task")

    tcl = TaskCheckList(
        task_id=task_id,
        check_list_id=checklist_data.check_list_id,
        check_status=checklist_data.check_status,
        notes=checklist_data.notes
    )
    db.add(tcl)
    db.commit()
    db.refresh(tcl)

    return TaskCheckListResponse.model_validate(tcl)


@router.put("/{task_id}/checklists/{checklist_id}", response_model=TaskCheckListResponse)
async def update_task_checklist(
    task_id: int,
    checklist_id: int,
    checklist_data: TaskCheckListUpdate,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update checklist status for a task.
    """
    tcl = db.query(TaskCheckList).filter(
        TaskCheckList.task_id == task_id,
        TaskCheckList.check_list_id == checklist_id
    ).first()

    if not tcl:
        raise HTTPException(status_code=404, detail="Task checklist not found")

    update_data = checklist_data.model_dump(exclude_unset=True)

    # Mark completion details if status changed to True
    if update_data.get("check_status") == True and not tcl.check_status:
        tcl.completed_at = datetime.utcnow()
        tcl.completed_by = current_user.staff_id

    for field, value in update_data.items():
        setattr(tcl, field, value)

    db.commit()
    db.refresh(tcl)

    return TaskCheckListResponse.model_validate(tcl)


# ============================================
# CheckList Master Endpoints
# ============================================

@router.get("/checklists/", response_model=List[CheckListResponse])
async def get_all_checklists(
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get all checklist master items.
    """
    query = db.query(CheckList)
    if is_active is not None:
        query = query.filter(CheckList.is_active == is_active)

    checklists = query.all()
    return [CheckListResponse.model_validate(cl) for cl in checklists]


@router.post("/checklists/", response_model=CheckListResponse)
async def create_checklist(
    checklist_data: CheckListCreate,
    db: Session = Depends(get_db)
):
    """
    Create new checklist master item.
    """
    checklist = CheckList(**checklist_data.model_dump())
    db.add(checklist)
    db.commit()
    db.refresh(checklist)

    return CheckListResponse.model_validate(checklist)


# ============================================
# CodeMaster Endpoints (Task Types, Status, etc.)
# ============================================

@router.get("/code-master/", response_model=List[CodeMasterResponse])
async def get_code_master(
    code_type: Optional[str] = Query(None, description="Filter by code_type"),
    db: Session = Depends(get_db)
):
    """
    Get code master items. Filter by code_type (task_type, response_type, status).
    """
    query = db.query(CodeMaster).filter(CodeMaster.is_active == True)

    if code_type:
        query = query.filter(CodeMaster.code_type == code_type)

    codes = query.order_by(CodeMaster.code_type, CodeMaster.sort_order).all()
    return [CodeMasterResponse.model_validate(c) for c in codes]
