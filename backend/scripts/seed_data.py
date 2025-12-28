"""
Seed script for OptiChain database
Run: python -m scripts.seed_data
"""
import sys
import os
from datetime import date, time, timedelta

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import (
    Region, Department, Store, Staff,
    TaskGroup, DailyScheduleTask, ShiftCode, ShiftAssignment
)
from app.models.base import Base


def create_tables():
    """Create all tables"""
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created")


def seed_regions(db: Session):
    """Seed regions"""
    regions = [
        Region(region_id=1, region_name="Miền Nam", region_code="SOUTH"),
        Region(region_id=2, region_name="Miền Bắc", region_code="NORTH"),
    ]
    for r in regions:
        existing = db.query(Region).filter(Region.region_id == r.region_id).first()
        if not existing:
            db.add(r)
    db.commit()
    print("✓ Regions seeded")


def seed_departments(db: Session):
    """Seed departments"""
    departments = [
        Department(department_id=1, department_name="POS", department_code="POS"),
        Department(department_id=2, department_name="Perishable", department_code="PERI"),
        Department(department_id=3, department_name="Dry", department_code="DRY"),
        Department(department_id=4, department_name="MMD", department_code="MMD"),
        Department(department_id=5, department_name="Delica/Cafe", department_code="DELICA"),
    ]
    for d in departments:
        existing = db.query(Department).filter(Department.department_id == d.department_id).first()
        if not existing:
            db.add(d)
    db.commit()
    print("✓ Departments seeded")


def seed_stores(db: Session):
    """Seed stores"""
    stores = [
        Store(store_id=1, store_code="AMPM_D1_NCT", store_name="AEON MaxValu Nguyen Cu Trinh", region_id=1, address="Quan 1, TP.HCM", status="ACTIVE"),
        Store(store_id=2, store_code="AMPM_D3_LVT", store_name="AEON MaxValu Le Van Sy", region_id=1, address="Quan 3, TP.HCM", status="ACTIVE"),
        Store(store_id=3, store_code="AMPM_D10_CMT", store_name="AEON MaxValu CMT8", region_id=1, address="Quan 10, TP.HCM", status="ACTIVE"),
        Store(store_id=4, store_code="AMPM_SALA", store_name="AEON MaxValu Sala", region_id=1, address="Quan 2, TP.HCM", status="ACTIVE"),
    ]
    for s in stores:
        existing = db.query(Store).filter(Store.store_id == s.store_id).first()
        if not existing:
            db.add(s)
    db.commit()
    print("✓ Stores seeded")


def seed_staff(db: Session):
    """Seed staff members"""
    staff_list = [
        Staff(staff_id=1, staff_code="AMPM_D1_NCT_LEAD_01", staff_name="Vo Minh Tuan", role="STORE_LEADER_G3", store_id=1, department_id=1, is_active=True, email="tuan.vm@aeon.com"),
        Staff(staff_id=2, staff_code="AMPM_D1_NCT_STAFF_02", staff_name="Dang Thu Ha", role="STAFF", store_id=1, department_id=2, is_active=True, email="ha.dt@aeon.com"),
        Staff(staff_id=3, staff_code="AMPM_D1_NCT_STAFF_03", staff_name="Hoang Xuan Kien", role="STAFF", store_id=1, department_id=3, is_active=True, email="kien.hx@aeon.com"),
        Staff(staff_id=4, staff_code="AMPM_D1_NCT_STAFF_04", staff_name="Bui Thi Lan", role="STAFF", store_id=1, department_id=4, is_active=True, email="lan.bt@aeon.com"),
        Staff(staff_id=5, staff_code="AMPM_D1_NCT_STAFF_05", staff_name="Le Quoc Phong", role="STAFF", store_id=1, department_id=5, is_active=True, email="phong.lq@aeon.com"),
        Staff(staff_id=6, staff_code="AMPM_D1_NCT_STAFF_06", staff_name="Tran Ngoc Hanh", role="STAFF", store_id=1, department_id=2, is_active=True, email="hanh.tn@aeon.com"),
        Staff(staff_id=7, staff_code="AMPM_D1_NCT_STAFF_07", staff_name="Pham Duc Anh", role="STAFF", store_id=1, department_id=3, is_active=True, email="anh.pd@aeon.com"),
        Staff(staff_id=8, staff_code="AMPM_D1_NCT_STAFF_08", staff_name="Vo Phuong Chi", role="STAFF", store_id=1, department_id=4, is_active=True, email="chi.vp@aeon.com"),
        Staff(staff_id=9, staff_code="AMPM_D3_LVT_LEAD_01", staff_name="Ngo Gia Bao", role="STORE_LEADER_G3", store_id=2, department_id=1, is_active=True, email="bao.ng@aeon.com"),
        Staff(staff_id=10, staff_code="AMPM_D3_LVT_STAFF_02", staff_name="Duong Ngoc Mai", role="STAFF", store_id=2, department_id=2, is_active=True, email="mai.dn@aeon.com"),
    ]
    for s in staff_list:
        existing = db.query(Staff).filter(Staff.staff_id == s.staff_id).first()
        if not existing:
            db.add(s)
    db.commit()
    print("✓ Staff seeded")


def seed_shift_codes(db: Session):
    """Seed shift codes"""
    shift_codes = [
        ShiftCode(shift_code_id=1, shift_code="V8.6", shift_name="Ca V8.6", start_time=time(6, 0), end_time=time(14, 0), duration_hours=8, color_code="#4F46E5", is_active=True),
        ShiftCode(shift_code_id=2, shift_code="V8.14", shift_name="Ca V8.14", start_time=time(14, 30), end_time=time(22, 30), duration_hours=8, color_code="#10B981", is_active=True),
        ShiftCode(shift_code_id=3, shift_code="V6.8", shift_name="Ca V6.8", start_time=time(8, 0), end_time=time(14, 0), duration_hours=6, color_code="#F59E0B", is_active=True),
        ShiftCode(shift_code_id=4, shift_code="V6.16", shift_name="Ca V6.16", start_time=time(16, 0), end_time=time(22, 0), duration_hours=6, color_code="#EF4444", is_active=True),
        ShiftCode(shift_code_id=5, shift_code="OFF", shift_name="Nghi", start_time=None, end_time=None, duration_hours=0, color_code="#9CA3AF", is_active=True),
    ]
    for sc in shift_codes:
        existing = db.query(ShiftCode).filter(ShiftCode.shift_code_id == sc.shift_code_id).first()
        if not existing:
            db.add(sc)
    db.commit()
    print("✓ Shift codes seeded")


def seed_task_groups(db: Session):
    """Seed task groups with colors from legacy system"""
    groups = [
        TaskGroup(group_id="POS", group_code="POS", group_name="POS Operations", priority=100, sort_order=1, color_bg="#e2e8f0", color_text="#1e293b", color_border="#94a3b8"),
        TaskGroup(group_id="PERI", group_code="PERI", group_name="Perishable", priority=80, sort_order=2, color_bg="#bbf7d0", color_text="#166534", color_border="#4ade80"),
        TaskGroup(group_id="DRY", group_code="DRY", group_name="Dry Goods", priority=70, sort_order=3, color_bg="#bfdbfe", color_text="#1e40af", color_border="#60a5fa"),
        TaskGroup(group_id="MMD", group_code="MMD", group_name="MMD", priority=90, sort_order=4, color_bg="#fde68a", color_text="#92400e", color_border="#facc15"),
        TaskGroup(group_id="LEADER", group_code="LEADER", group_name="Leader Tasks", priority=95, sort_order=5, color_bg="#99f6e4", color_text="#134e4a", color_border="#2dd4bf"),
        TaskGroup(group_id="QC-FSH", group_code="QC-FSH", group_name="QC & Freshness", priority=50, sort_order=6, color_bg="#e9d5ff", color_text="#6b21a8", color_border="#c084fc"),
        TaskGroup(group_id="DELICA", group_code="DELICA", group_name="Delica & Cafe", priority=75, sort_order=7, color_bg="#c7d2fe", color_text="#3730a3", color_border="#818cf8"),
        TaskGroup(group_id="DND", group_code="D&D", group_name="Dairy & Drinks", priority=60, sort_order=8, color_bg="#fecaca", color_text="#991b1b", color_border="#f87171"),
        TaskGroup(group_id="OTHER", group_code="OTHER", group_name="Other", priority=30, sort_order=9, color_bg="#fbcfe8", color_text="#9d174d", color_border="#f472b6"),
    ]
    for g in groups:
        existing = db.query(TaskGroup).filter(TaskGroup.group_id == g.group_id).first()
        if not existing:
            db.add(g)
    db.commit()
    print("✓ Task groups seeded")


def seed_shift_assignments(db: Session):
    """Seed shift assignments for today and next 7 days"""
    today = date.today()
    shift_patterns = [1, 2, 1, 2, 3, 4, 5]  # Rotating pattern

    for day_offset in range(7):
        current_date = today + timedelta(days=day_offset)

        for staff_id in range(1, 9):  # Staff 1-8
            shift_idx = (staff_id + day_offset) % len(shift_patterns)
            shift_code_id = shift_patterns[shift_idx]

            existing = db.query(ShiftAssignment).filter(
                ShiftAssignment.staff_id == staff_id,
                ShiftAssignment.shift_date == current_date
            ).first()

            if not existing:
                assignment = ShiftAssignment(
                    staff_id=staff_id,
                    store_id=1,
                    shift_date=current_date,
                    shift_code_id=shift_code_id,
                    status="assigned",
                    assigned_by=1
                )
                db.add(assignment)

    db.commit()
    print("✓ Shift assignments seeded")


def seed_daily_schedule_tasks(db: Session):
    """Seed daily schedule tasks for staff"""
    today = date.today()

    # Task templates per staff (based on their role)
    task_templates = {
        1: [  # Leader
            ("1501", "Mở kho", "LEADER", time(6, 0), time(6, 15)),
            ("1505", "Balancing", "LEADER", time(6, 15), time(6, 30)),
            ("0101", "Mở POS", "POS", time(6, 30), time(6, 45)),
            ("0801", "Cleaning Time", "QC-FSH", time(9, 0), time(9, 15)),
            ("1510", "Bàn giao tiền", "LEADER", time(10, 0), time(10, 30)),
            ("0102", "Hỗ trợ POS", "POS", time(11, 0), time(12, 0)),
            ("1005", "Break Time", "OTHER", time(12, 0), time(13, 0)),
        ],
        2: [  # PERI staff
            ("0201", "Lên hàng thịt cá", "PERI", time(6, 0), time(7, 0)),
            ("0202", "Lên hàng rau củ", "PERI", time(7, 0), time(8, 0)),
            ("0801", "Cleaning Time", "QC-FSH", time(9, 0), time(9, 15)),
            ("0205", "Cắt gọt", "PERI", time(10, 0), time(10, 30)),
            ("1005", "Break Time", "OTHER", time(11, 0), time(12, 0)),
            ("0210", "Giảm giá Peri", "PERI", time(12, 0), time(12, 30)),
        ],
        3: [  # DRY staff
            ("0301", "Lên hàng khô", "DRY", time(6, 0), time(7, 30)),
            ("0801", "Cleaning Time", "QC-FSH", time(9, 0), time(9, 15)),
            ("0304", "Bắn OOS", "DRY", time(10, 0), time(10, 30)),
            ("1005", "Break Time", "OTHER", time(11, 0), time(12, 0)),
            ("0302", "Kéo mặt Dry", "DRY", time(12, 30), time(13, 0)),
        ],
        4: [  # MMD staff
            ("0401", "Nhận hàng Peri", "MMD", time(6, 0), time(7, 0)),
            ("0405", "Nhận hàng D&D", "MMD", time(7, 0), time(8, 0)),
            ("0801", "Cleaning Time", "QC-FSH", time(9, 0), time(9, 15)),
            ("0403", "Nhận hàng RDC", "MMD", time(11, 0), time(12, 30)),
            ("1005", "Break Time", "OTHER", time(12, 30), time(13, 30)),
        ],
        5: [  # DELICA staff
            ("0501", "Pha chế Cafe", "DELICA", time(6, 0), time(6, 30)),
            ("0503", "Lên hàng Delica", "DELICA", time(7, 0), time(7, 30)),
            ("0801", "Cleaning Time", "QC-FSH", time(9, 0), time(9, 15)),
            ("0504", "Kéo mặt Delica", "DELICA", time(10, 0), time(10, 15)),
            ("1005", "Break Time", "OTHER", time(11, 0), time(12, 0)),
            ("0505", "Kiểm tra HSD", "DELICA", time(12, 0), time(12, 15)),
        ],
        6: [  # D&D staff
            ("0601", "Lên hàng D&D", "DND", time(6, 0), time(6, 45)),
            ("0602", "Kéo mặt D&D", "DND", time(7, 0), time(7, 15)),
            ("0801", "Cleaning Time", "QC-FSH", time(9, 0), time(9, 15)),
            ("0604", "Đặt hàng D&D", "DND", time(10, 0), time(10, 30)),
            ("1005", "Break Time", "OTHER", time(11, 0), time(12, 0)),
        ],
    }

    for day_offset in range(7):
        current_date = today + timedelta(days=day_offset)

        for staff_id, tasks in task_templates.items():
            for task_code, task_name, group_id, start_t, end_t in tasks:
                existing = db.query(DailyScheduleTask).filter(
                    DailyScheduleTask.staff_id == staff_id,
                    DailyScheduleTask.schedule_date == current_date,
                    DailyScheduleTask.task_code == task_code
                ).first()

                if not existing:
                    task = DailyScheduleTask(
                        staff_id=staff_id,
                        store_id=1,
                        schedule_date=current_date,
                        group_id=group_id,
                        task_code=task_code,
                        task_name=task_name,
                        start_time=start_t,
                        end_time=end_t,
                        status="pending"
                    )
                    db.add(task)

    db.commit()
    print("✓ Daily schedule tasks seeded")


def main():
    """Main function to seed all data"""
    print("\n" + "=" * 50)
    print("🌱 Seeding OptiChain Database")
    print("=" * 50 + "\n")

    # Create tables
    create_tables()

    # Get database session
    db = SessionLocal()

    try:
        # Seed in order (respecting foreign keys)
        seed_regions(db)
        seed_departments(db)
        seed_stores(db)
        seed_staff(db)
        seed_shift_codes(db)
        seed_task_groups(db)
        seed_shift_assignments(db)
        seed_daily_schedule_tasks(db)

        print("\n" + "=" * 50)
        print("✅ All data seeded successfully!")
        print("=" * 50 + "\n")

    except Exception as e:
        print(f"\n❌ Error seeding data: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
