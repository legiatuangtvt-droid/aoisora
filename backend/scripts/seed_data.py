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
    TaskGroup, TaskLibrary, DailyTemplate, ShiftTemplate,
    DailyScheduleTask, ShiftCode, ShiftAssignment
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
    """Seed shift assignments for today and next 7 days
    - Staff 1-4: Ca sáng (V8.6: 06:00-14:00)
    - Staff 5-8: Ca chiều (V8.14: 14:30-22:30)
    """
    today = date.today()

    for day_offset in range(7):
        current_date = today + timedelta(days=day_offset)

        # Ca sáng: Staff 1-4 -> shift_code_id=1 (V8.6)
        for staff_id in range(1, 5):
            existing = db.query(ShiftAssignment).filter(
                ShiftAssignment.staff_id == staff_id,
                ShiftAssignment.shift_date == current_date
            ).first()

            if not existing:
                assignment = ShiftAssignment(
                    staff_id=staff_id,
                    store_id=1,
                    shift_date=current_date,
                    shift_code_id=1,  # V8.6 (Ca sáng)
                    status="assigned",
                    assigned_by=1
                )
                db.add(assignment)

        # Ca chiều: Staff 5-8 -> shift_code_id=2 (V8.14)
        for staff_id in range(5, 9):
            existing = db.query(ShiftAssignment).filter(
                ShiftAssignment.staff_id == staff_id,
                ShiftAssignment.shift_date == current_date
            ).first()

            if not existing:
                assignment = ShiftAssignment(
                    staff_id=staff_id,
                    store_id=1,
                    shift_date=current_date,
                    shift_code_id=2,  # V8.14 (Ca chiều)
                    status="assigned",
                    assigned_by=1
                )
                db.add(assignment)

    db.commit()
    print("✓ Shift assignments seeded")


def seed_task_library(db: Session):
    """Seed task library with common tasks"""
    tasks = [
        # LEADER tasks
        TaskLibrary(group_id="LEADER", task_code="1501", task_name="Mở kho", task_type="Fixed", frequency="Daily", re_unit=10, allowed_positions=["LEADER"], time_windows=[{"startTime": "06:00", "endTime": "06:15"}], shift_placement={"type": "firstOfDay"}),
        TaskLibrary(group_id="LEADER", task_code="1505", task_name="Balancing", task_type="Fixed", frequency="Daily", re_unit=15, allowed_positions=["LEADER"], time_windows=[{"startTime": "06:15", "endTime": "06:30"}]),
        TaskLibrary(group_id="LEADER", task_code="1510", task_name="Bàn giao tiền", task_type="Fixed", frequency="Daily", re_unit=20, allowed_positions=["LEADER"], time_windows=[{"startTime": "10:00", "endTime": "10:30"}]),
        TaskLibrary(group_id="LEADER", task_code="1515", task_name="Đóng kho", task_type="Fixed", frequency="Daily", re_unit=10, allowed_positions=["LEADER"], shift_placement={"type": "lastOfDay"}),

        # POS tasks
        TaskLibrary(group_id="POS", task_code="0101", task_name="Mở POS", task_type="Fixed", frequency="Daily", re_unit=10, allowed_positions=["POS", "LEADER"], time_windows=[{"startTime": "06:30", "endTime": "06:45"}]),
        TaskLibrary(group_id="POS", task_code="0102", task_name="Hỗ trợ POS", task_type="CTM", frequency="Daily", re_unit=5, allowed_positions=["POS", "LEADER"]),
        TaskLibrary(group_id="POS", task_code="0105", task_name="Đóng POS", task_type="Fixed", frequency="Daily", re_unit=10, allowed_positions=["POS", "LEADER"], shift_placement={"type": "lastOfShift"}),

        # PERI tasks
        TaskLibrary(group_id="PERI", task_code="0201", task_name="Lên hàng thịt cá", task_type="Fixed", frequency="Daily", re_unit=15, allowed_positions=["PERI", "LEADER"]),
        TaskLibrary(group_id="PERI", task_code="0202", task_name="Lên hàng rau củ", task_type="Fixed", frequency="Daily", re_unit=15, allowed_positions=["PERI"]),
        TaskLibrary(group_id="PERI", task_code="0205", task_name="Cắt gọt", task_type="Product", frequency="Daily", re_unit=10, allowed_positions=["PERI"]),
        TaskLibrary(group_id="PERI", task_code="0210", task_name="Giảm giá Peri", task_type="Fixed", frequency="Daily", re_unit=10, allowed_positions=["PERI", "LEADER"]),

        # DRY tasks
        TaskLibrary(group_id="DRY", task_code="0301", task_name="Lên hàng khô", task_type="Fixed", frequency="Daily", re_unit=15, allowed_positions=["DRY"]),
        TaskLibrary(group_id="DRY", task_code="0302", task_name="Kéo mặt Dry", task_type="Fixed", frequency="Daily", re_unit=10, allowed_positions=["DRY"]),
        TaskLibrary(group_id="DRY", task_code="0304", task_name="Bắn OOS", task_type="Fixed", frequency="Daily", re_unit=10, allowed_positions=["DRY", "LEADER"]),

        # MMD tasks
        TaskLibrary(group_id="MMD", task_code="0401", task_name="Nhận hàng Peri", task_type="Fixed", frequency="Daily", re_unit=20, allowed_positions=["MMD"]),
        TaskLibrary(group_id="MMD", task_code="0403", task_name="Nhận hàng RDC", task_type="Fixed", frequency="Daily", re_unit=25, allowed_positions=["MMD"]),
        TaskLibrary(group_id="MMD", task_code="0405", task_name="Nhận hàng D&D", task_type="Fixed", frequency="Daily", re_unit=15, allowed_positions=["MMD"]),

        # QC-FSH tasks
        TaskLibrary(group_id="QC-FSH", task_code="0801", task_name="Cleaning Time", task_type="Fixed", frequency="Daily", re_unit=5, allowed_positions=["ALL"], time_windows=[{"startTime": "09:00", "endTime": "09:15"}]),
        TaskLibrary(group_id="QC-FSH", task_code="0802", task_name="Kiểm tra VSC", task_type="Fixed", frequency="Daily", re_unit=10, allowed_positions=["LEADER", "QC"]),

        # DELICA tasks
        TaskLibrary(group_id="DELICA", task_code="0501", task_name="Pha chế Cafe", task_type="CTM", frequency="Daily", re_unit=5, allowed_positions=["DELICA"]),
        TaskLibrary(group_id="DELICA", task_code="0503", task_name="Lên hàng Delica", task_type="Fixed", frequency="Daily", re_unit=10, allowed_positions=["DELICA"]),
        TaskLibrary(group_id="DELICA", task_code="0504", task_name="Kéo mặt Delica", task_type="Fixed", frequency="Daily", re_unit=5, allowed_positions=["DELICA"]),
        TaskLibrary(group_id="DELICA", task_code="0505", task_name="Kiểm tra HSD", task_type="Fixed", frequency="Daily", re_unit=10, allowed_positions=["DELICA", "LEADER"]),

        # D&D tasks
        TaskLibrary(group_id="DND", task_code="0601", task_name="Lên hàng D&D", task_type="Fixed", frequency="Daily", re_unit=10, allowed_positions=["DND"]),
        TaskLibrary(group_id="DND", task_code="0602", task_name="Kéo mặt D&D", task_type="Fixed", frequency="Daily", re_unit=5, allowed_positions=["DND"]),
        TaskLibrary(group_id="DND", task_code="0604", task_name="Đặt hàng D&D", task_type="Fixed", frequency="Daily", re_unit=15, allowed_positions=["DND", "LEADER"]),

        # OTHER tasks
        TaskLibrary(group_id="OTHER", task_code="1005", task_name="Break Time", task_type="Fixed", frequency="Daily", re_unit=0, allowed_positions=["ALL"]),
    ]

    for t in tasks:
        existing = db.query(TaskLibrary).filter(TaskLibrary.task_code == t.task_code).first()
        if not existing:
            db.add(t)
    db.commit()
    print("✓ Task library seeded")


def seed_daily_templates(db: Session):
    """Seed daily templates with hourly manhour and customer data"""
    templates = [
        DailyTemplate(
            template_code="WEEKDAY",
            template_name="Ngày thường",
            store_id=1,
            hourly_manhours={"6": 5, "7": 5, "8": 5, "9": 4, "10": 4, "11": 5, "12": 6, "13": 5, "14": 4, "15": 4, "16": 5, "17": 6, "18": 7, "19": 6, "20": 5, "21": 4, "22": 3, "23": 2},
            hourly_customers={"6": 70, "7": 80, "8": 60, "9": 50, "10": 45, "11": 55, "12": 80, "13": 70, "14": 50, "15": 45, "16": 55, "17": 70, "18": 100, "19": 90, "20": 70, "21": 50, "22": 30, "23": 20},
            re_parameters={"areaSize": 350, "customerCount": 1280, "posCount": 2, "vegetableWeight": 50, "dryGoodsVolume": 60, "employeeCount": 10},
            total_manhour=80
        ),
        DailyTemplate(
            template_code="WEEKEND",
            template_name="Cuối tuần",
            store_id=1,
            hourly_manhours={"6": 6, "7": 6, "8": 6, "9": 5, "10": 5, "11": 6, "12": 7, "13": 6, "14": 5, "15": 5, "16": 6, "17": 7, "18": 8, "19": 7, "20": 6, "21": 5, "22": 4, "23": 2},
            hourly_customers={"6": 90, "7": 100, "8": 80, "9": 70, "10": 65, "11": 75, "12": 110, "13": 100, "14": 70, "15": 65, "16": 75, "17": 100, "18": 140, "19": 120, "20": 90, "21": 70, "22": 40, "23": 25},
            re_parameters={"areaSize": 350, "customerCount": 1600, "posCount": 3, "vegetableWeight": 70, "dryGoodsVolume": 80, "employeeCount": 12},
            total_manhour=95
        ),
    ]

    for t in templates:
        existing = db.query(DailyTemplate).filter(DailyTemplate.template_code == t.template_code).first()
        if not existing:
            db.add(t)
    db.commit()
    print("✓ Daily templates seeded")


def seed_daily_schedule_tasks(db: Session):
    """Seed daily schedule tasks for staff with COMPLETE schedule

    CA SÁNG (06:00-14:00): Staff 1-4
    - Staff 1: Leader (LEADER tasks)
    - Staff 2: PERI (Perishable tasks)
    - Staff 3: DRY (Dry goods tasks)
    - Staff 4: MMD (Receiving tasks)

    CA CHIỀU (14:30-22:30): Staff 5-8
    - Staff 5: Leader chiều (LEADER tasks)
    - Staff 6: PERI chiều
    - Staff 7: DRY chiều
    - Staff 8: DELICA/DND

    Mỗi khung giờ 15 phút sẽ có đủ 4 task (1 task mỗi người)
    """
    today = date.today()

    # ========== CA SÁNG (06:00-14:00) - Staff 1-4 ==========
    # Mỗi slot 15 phút, 4 người đều có task
    morning_schedule = {
        # Staff 1 - Leader ca sáng
        1: [
            # 06:00 slot
            ("1501", "Mở kho", "LEADER", time(6, 0), time(6, 15)),
            ("1505", "Balancing", "LEADER", time(6, 15), time(6, 30)),
            ("0101", "Mở POS", "POS", time(6, 30), time(6, 45)),
            ("0102", "Check POS", "POS", time(6, 45), time(7, 0)),
            # 07:00 slot
            ("1506", "Kiểm tra hàng", "LEADER", time(7, 0), time(7, 15)),
            ("1507", "Duyệt đơn", "LEADER", time(7, 15), time(7, 30)),
            ("1508", "Giao việc", "LEADER", time(7, 30), time(7, 45)),
            ("0103", "Hỗ trợ POS", "POS", time(7, 45), time(8, 0)),
            # 08:00 slot
            ("1509", "Meeting sáng", "LEADER", time(8, 0), time(8, 15)),
            ("0104", "Đối soát tiền", "POS", time(8, 15), time(8, 30)),
            ("0105", "In báo cáo", "POS", time(8, 30), time(8, 45)),
            ("0106", "Kiểm kê POS", "POS", time(8, 45), time(9, 0)),
            # 09:00 slot - Cleaning Time
            ("0801", "Cleaning Time", "QC-FSH", time(9, 0), time(9, 15)),
            ("0802", "Kiểm tra VSC", "QC-FSH", time(9, 15), time(9, 30)),
            ("0803", "Vệ sinh khu POS", "QC-FSH", time(9, 30), time(9, 45)),
            ("1510", "Bàn giao tiền", "LEADER", time(9, 45), time(10, 0)),
            # 10:00 slot
            ("1511", "Kiểm tra hàng OOS", "LEADER", time(10, 0), time(10, 15)),
            ("1512", "Duyệt khuyến mãi", "LEADER", time(10, 15), time(10, 30)),
            ("0107", "Đổi tiền lẻ", "POS", time(10, 30), time(10, 45)),
            ("0108", "Check voucher", "POS", time(10, 45), time(11, 0)),
            # 11:00 slot
            ("0109", "Phục vụ khách", "POS", time(11, 0), time(11, 15)),
            ("0110", "Hỗ trợ thanh toán", "POS", time(11, 15), time(11, 30)),
            ("0111", "Xử lý khiếu nại", "POS", time(11, 30), time(11, 45)),
            ("1513", "Giám sát", "LEADER", time(11, 45), time(12, 0)),
            # 12:00-13:00 Break
            ("1005", "Break Time", "OTHER", time(12, 0), time(12, 15)),
            ("1006", "Break Time", "OTHER", time(12, 15), time(12, 30)),
            ("1007", "Break Time", "OTHER", time(12, 30), time(12, 45)),
            ("1008", "Break Time", "OTHER", time(12, 45), time(13, 0)),
            # 13:00 slot
            ("1514", "Chuẩn bị bàn giao", "LEADER", time(13, 0), time(13, 15)),
            ("1515", "Đóng kho", "LEADER", time(13, 15), time(13, 30)),
            ("0112", "Kiểm POS cuối ca", "POS", time(13, 30), time(13, 45)),
            ("1516", "Bàn giao ca", "LEADER", time(13, 45), time(14, 0)),
        ],
        # Staff 2 - PERI ca sáng
        2: [
            # 06:00 slot
            ("0201", "Lên thịt cá", "PERI", time(6, 0), time(6, 15)),
            ("0202", "Lên rau củ", "PERI", time(6, 15), time(6, 30)),
            ("0203", "Sắp xếp kệ", "PERI", time(6, 30), time(6, 45)),
            ("0204", "Kiểm HSD", "PERI", time(6, 45), time(7, 0)),
            # 07:00 slot
            ("0205", "Cắt gọt rau", "PERI", time(7, 0), time(7, 15)),
            ("0206", "Đóng gói thịt", "PERI", time(7, 15), time(7, 30)),
            ("0207", "Cân đóng gói", "PERI", time(7, 30), time(7, 45)),
            ("0208", "Dán nhãn giá", "PERI", time(7, 45), time(8, 0)),
            # 08:00 slot
            ("0209", "Bổ sung kệ", "PERI", time(8, 0), time(8, 15)),
            ("0210", "Giảm giá Peri", "PERI", time(8, 15), time(8, 30)),
            ("0211", "Xoay kệ FIFO", "PERI", time(8, 30), time(8, 45)),
            ("0212", "Check nhiệt độ", "PERI", time(8, 45), time(9, 0)),
            # 09:00 slot
            ("0801", "Cleaning Time", "QC-FSH", time(9, 0), time(9, 15)),
            ("0804", "Vệ sinh kệ Peri", "QC-FSH", time(9, 15), time(9, 30)),
            ("0213", "Kiểm kho Peri", "PERI", time(9, 30), time(9, 45)),
            ("0214", "Đặt hàng Peri", "PERI", time(9, 45), time(10, 0)),
            # 10:00 slot
            ("0215", "Xử lý hàng hư", "PERI", time(10, 0), time(10, 15)),
            ("0216", "Cắt gọt bổ sung", "PERI", time(10, 15), time(10, 30)),
            ("0217", "Kéo mặt Peri", "PERI", time(10, 30), time(10, 45)),
            ("0218", "Check OOS Peri", "PERI", time(10, 45), time(11, 0)),
            # 11:00 slot
            ("0219", "Lên hàng trưa", "PERI", time(11, 0), time(11, 15)),
            ("0220", "Bổ sung salad", "PERI", time(11, 15), time(11, 30)),
            ("0221", "Kiểm kệ lạnh", "PERI", time(11, 30), time(11, 45)),
            ("0222", "Chuẩn bị giảm giá", "PERI", time(11, 45), time(12, 0)),
            # 12:00-13:00 Break
            ("1005", "Break Time", "OTHER", time(12, 0), time(12, 15)),
            ("1006", "Break Time", "OTHER", time(12, 15), time(12, 30)),
            ("1007", "Break Time", "OTHER", time(12, 30), time(12, 45)),
            ("1008", "Break Time", "OTHER", time(12, 45), time(13, 0)),
            # 13:00 slot
            ("0223", "Giảm giá trưa", "PERI", time(13, 0), time(13, 15)),
            ("0224", "Kiểm hàng tồn", "PERI", time(13, 15), time(13, 30)),
            ("0225", "Vệ sinh khu vực", "PERI", time(13, 30), time(13, 45)),
            ("0226", "Bàn giao Peri", "PERI", time(13, 45), time(14, 0)),
        ],
        # Staff 3 - DRY ca sáng
        3: [
            # 06:00 slot
            ("0301", "Lên hàng khô", "DRY", time(6, 0), time(6, 15)),
            ("0302", "Kéo mặt Dry", "DRY", time(6, 15), time(6, 30)),
            ("0303", "Sắp xếp kệ", "DRY", time(6, 30), time(6, 45)),
            ("0304", "Bắn OOS", "DRY", time(6, 45), time(7, 0)),
            # 07:00 slot
            ("0305", "Kiểm HSD Dry", "DRY", time(7, 0), time(7, 15)),
            ("0306", "Xoay FIFO", "DRY", time(7, 15), time(7, 30)),
            ("0307", "Dán nhãn", "DRY", time(7, 30), time(7, 45)),
            ("0308", "Check giá", "DRY", time(7, 45), time(8, 0)),
            # 08:00 slot
            ("0309", "Bổ sung kệ", "DRY", time(8, 0), time(8, 15)),
            ("0310", "Kiểm promo", "DRY", time(8, 15), time(8, 30)),
            ("0311", "Sắp xếp endcap", "DRY", time(8, 30), time(8, 45)),
            ("0312", "Vệ sinh kệ", "DRY", time(8, 45), time(9, 0)),
            # 09:00 slot
            ("0801", "Cleaning Time", "QC-FSH", time(9, 0), time(9, 15)),
            ("0805", "Vệ sinh khu Dry", "QC-FSH", time(9, 15), time(9, 30)),
            ("0313", "Kiểm kho Dry", "DRY", time(9, 30), time(9, 45)),
            ("0314", "Đặt hàng Dry", "DRY", time(9, 45), time(10, 0)),
            # 10:00 slot
            ("0315", "Xử lý hàng lỗi", "DRY", time(10, 0), time(10, 15)),
            ("0316", "Kéo mặt lần 2", "DRY", time(10, 15), time(10, 30)),
            ("0317", "Check OOS", "DRY", time(10, 30), time(10, 45)),
            ("0318", "Cập nhật POG", "DRY", time(10, 45), time(11, 0)),
            # 11:00 slot
            ("0319", "Bổ sung snack", "DRY", time(11, 0), time(11, 15)),
            ("0320", "Check nước uống", "DRY", time(11, 15), time(11, 30)),
            ("0321", "Sắp xếp mì gói", "DRY", time(11, 30), time(11, 45)),
            ("0322", "Kiểm gia vị", "DRY", time(11, 45), time(12, 0)),
            # 12:00-13:00 Break
            ("1005", "Break Time", "OTHER", time(12, 0), time(12, 15)),
            ("1006", "Break Time", "OTHER", time(12, 15), time(12, 30)),
            ("1007", "Break Time", "OTHER", time(12, 30), time(12, 45)),
            ("1008", "Break Time", "OTHER", time(12, 45), time(13, 0)),
            # 13:00 slot
            ("0323", "Kéo mặt cuối", "DRY", time(13, 0), time(13, 15)),
            ("0324", "Báo cáo OOS", "DRY", time(13, 15), time(13, 30)),
            ("0325", "Vệ sinh khu vực", "DRY", time(13, 30), time(13, 45)),
            ("0326", "Bàn giao Dry", "DRY", time(13, 45), time(14, 0)),
        ],
        # Staff 4 - MMD ca sáng
        4: [
            # 06:00 slot
            ("0401", "Nhận hàng Peri", "MMD", time(6, 0), time(6, 15)),
            ("0402", "Kiểm hàng Peri", "MMD", time(6, 15), time(6, 30)),
            ("0403", "Nhận hàng RDC", "MMD", time(6, 30), time(6, 45)),
            ("0404", "Kiểm hàng RDC", "MMD", time(6, 45), time(7, 0)),
            # 07:00 slot
            ("0405", "Nhận hàng D&D", "MMD", time(7, 0), time(7, 15)),
            ("0406", "Phân loại hàng", "MMD", time(7, 15), time(7, 30)),
            ("0407", "Nhập kho", "MMD", time(7, 30), time(7, 45)),
            ("0408", "Cập nhật tồn", "MMD", time(7, 45), time(8, 0)),
            # 08:00 slot
            ("0409", "Xử lý hàng trả", "MMD", time(8, 0), time(8, 15)),
            ("0410", "Kiểm DC", "MMD", time(8, 15), time(8, 30)),
            ("0411", "Báo cáo nhập", "MMD", time(8, 30), time(8, 45)),
            ("0412", "Sắp xếp kho", "MMD", time(8, 45), time(9, 0)),
            # 09:00 slot
            ("0801", "Cleaning Time", "QC-FSH", time(9, 0), time(9, 15)),
            ("0806", "Vệ sinh kho", "QC-FSH", time(9, 15), time(9, 30)),
            ("0413", "Kiểm kho MMD", "MMD", time(9, 30), time(9, 45)),
            ("0414", "Nhận hàng bổ sung", "MMD", time(9, 45), time(10, 0)),
            # 10:00 slot
            ("0415", "Xử lý claim", "MMD", time(10, 0), time(10, 15)),
            ("0416", "Kiểm HSD kho", "MMD", time(10, 15), time(10, 30)),
            ("0417", "Chuẩn bị xuất", "MMD", time(10, 30), time(10, 45)),
            ("0418", "Nhận hàng RDC 2", "MMD", time(10, 45), time(11, 0)),
            # 11:00 slot
            ("0419", "Kiểm hàng RDC 2", "MMD", time(11, 0), time(11, 15)),
            ("0420", "Phân loại RDC", "MMD", time(11, 15), time(11, 30)),
            ("0421", "Nhập kho bổ sung", "MMD", time(11, 30), time(11, 45)),
            ("0422", "Cập nhật hệ thống", "MMD", time(11, 45), time(12, 0)),
            # 12:00-13:00 Break
            ("1005", "Break Time", "OTHER", time(12, 0), time(12, 15)),
            ("1006", "Break Time", "OTHER", time(12, 15), time(12, 30)),
            ("1007", "Break Time", "OTHER", time(12, 30), time(12, 45)),
            ("1008", "Break Time", "OTHER", time(12, 45), time(13, 0)),
            # 13:00 slot
            ("0423", "Báo cáo tồn kho", "MMD", time(13, 0), time(13, 15)),
            ("0424", "Kiểm hàng chờ", "MMD", time(13, 15), time(13, 30)),
            ("0425", "Vệ sinh khu MMD", "MMD", time(13, 30), time(13, 45)),
            ("0426", "Bàn giao MMD", "MMD", time(13, 45), time(14, 0)),
        ],
    }

    # ========== CA CHIỀU (14:30-22:30) - Staff 5-8 ==========
    afternoon_schedule = {
        # Staff 5 - Leader ca chiều
        5: [
            # 14:30 slot
            ("2501", "Nhận bàn giao", "LEADER", time(14, 30), time(14, 45)),
            ("2502", "Kiểm tra ca", "LEADER", time(14, 45), time(15, 0)),
            # 15:00 slot
            ("2503", "Check hàng OOS", "LEADER", time(15, 0), time(15, 15)),
            ("2504", "Duyệt giảm giá", "LEADER", time(15, 15), time(15, 30)),
            ("2505", "Giám sát sàn", "LEADER", time(15, 30), time(15, 45)),
            ("0113", "Hỗ trợ POS", "POS", time(15, 45), time(16, 0)),
            # 16:00 slot
            ("2506", "Kiểm promo", "LEADER", time(16, 0), time(16, 15)),
            ("0114", "Check tiền POS", "POS", time(16, 15), time(16, 30)),
            ("0115", "Đổi tiền lẻ", "POS", time(16, 30), time(16, 45)),
            ("2507", "Meeting chiều", "LEADER", time(16, 45), time(17, 0)),
            # 17:00 slot - Rush hour
            ("0116", "Hỗ trợ thanh toán", "POS", time(17, 0), time(17, 15)),
            ("0117", "Phục vụ khách", "POS", time(17, 15), time(17, 30)),
            ("2508", "Giám sát POS", "LEADER", time(17, 30), time(17, 45)),
            ("0118", "Xử lý khiếu nại", "POS", time(17, 45), time(18, 0)),
            # 18:00 slot - Peak
            ("2509", "Điều phối nhân lực", "LEADER", time(18, 0), time(18, 15)),
            ("0119", "Hỗ trợ POS peak", "POS", time(18, 15), time(18, 30)),
            ("0120", "Check queue", "POS", time(18, 30), time(18, 45)),
            ("2510", "Kiểm tra sàn", "LEADER", time(18, 45), time(19, 0)),
            # 19:00 slot
            ("0121", "Đối soát tiền", "POS", time(19, 0), time(19, 15)),
            ("2511", "Duyệt giảm giá tối", "LEADER", time(19, 15), time(19, 30)),
            ("0807", "Cleaning tối", "QC-FSH", time(19, 30), time(19, 45)),
            ("2512", "Kiểm VSC", "LEADER", time(19, 45), time(20, 0)),
            # 20:00-21:00 Break
            ("1005", "Break Time", "OTHER", time(20, 0), time(20, 15)),
            ("1006", "Break Time", "OTHER", time(20, 15), time(20, 30)),
            ("1007", "Break Time", "OTHER", time(20, 30), time(20, 45)),
            ("1008", "Break Time", "OTHER", time(20, 45), time(21, 0)),
            # 21:00 slot
            ("2513", "Chuẩn bị đóng cửa", "LEADER", time(21, 0), time(21, 15)),
            ("0122", "Đếm tiền cuối", "POS", time(21, 15), time(21, 30)),
            ("2514", "Kiểm tra kho", "LEADER", time(21, 30), time(21, 45)),
            ("2515", "Báo cáo ngày", "LEADER", time(21, 45), time(22, 0)),
            # 22:00 slot
            ("0123", "Đóng POS", "POS", time(22, 0), time(22, 15)),
            ("2516", "Đóng kho", "LEADER", time(22, 15), time(22, 30)),
        ],
        # Staff 6 - PERI ca chiều
        6: [
            # 14:30 slot
            ("0227", "Nhận bàn giao Peri", "PERI", time(14, 30), time(14, 45)),
            ("0228", "Kiểm hàng Peri", "PERI", time(14, 45), time(15, 0)),
            # 15:00 slot
            ("0229", "Bổ sung kệ chiều", "PERI", time(15, 0), time(15, 15)),
            ("0230", "Kéo mặt Peri", "PERI", time(15, 15), time(15, 30)),
            ("0231", "Cắt gọt chiều", "PERI", time(15, 30), time(15, 45)),
            ("0232", "Đóng gói thịt", "PERI", time(15, 45), time(16, 0)),
            # 16:00 slot
            ("0233", "Kiểm HSD", "PERI", time(16, 0), time(16, 15)),
            ("0234", "Chuẩn bị giảm giá", "PERI", time(16, 15), time(16, 30)),
            ("0235", "Dán sticker giảm", "PERI", time(16, 30), time(16, 45)),
            ("0236", "Xoay FIFO", "PERI", time(16, 45), time(17, 0)),
            # 17:00 slot
            ("0237", "Bổ sung peak", "PERI", time(17, 0), time(17, 15)),
            ("0238", "Kéo mặt peak", "PERI", time(17, 15), time(17, 30)),
            ("0239", "Check OOS", "PERI", time(17, 30), time(17, 45)),
            ("0240", "Cắt gọt bổ sung", "PERI", time(17, 45), time(18, 0)),
            # 18:00 slot
            ("0241", "Bổ sung salad", "PERI", time(18, 0), time(18, 15)),
            ("0242", "Kiểm nhiệt độ", "PERI", time(18, 15), time(18, 30)),
            ("0243", "Xử lý hàng hư", "PERI", time(18, 30), time(18, 45)),
            ("0244", "Kéo mặt tối", "PERI", time(18, 45), time(19, 0)),
            # 19:00 slot
            ("0245", "Giảm giá tối 30%", "PERI", time(19, 0), time(19, 15)),
            ("0246", "Giảm giá tối 50%", "PERI", time(19, 15), time(19, 30)),
            ("0808", "Vệ sinh kệ Peri", "QC-FSH", time(19, 30), time(19, 45)),
            ("0247", "Thu dọn hàng", "PERI", time(19, 45), time(20, 0)),
            # 20:00-21:00 Break
            ("1005", "Break Time", "OTHER", time(20, 0), time(20, 15)),
            ("1006", "Break Time", "OTHER", time(20, 15), time(20, 30)),
            ("1007", "Break Time", "OTHER", time(20, 30), time(20, 45)),
            ("1008", "Break Time", "OTHER", time(20, 45), time(21, 0)),
            # 21:00 slot
            ("0248", "Thu hàng cuối", "PERI", time(21, 0), time(21, 15)),
            ("0249", "Kiểm kho tối", "PERI", time(21, 15), time(21, 30)),
            ("0250", "Vệ sinh khu vực", "PERI", time(21, 30), time(21, 45)),
            ("0251", "Báo cáo Peri", "PERI", time(21, 45), time(22, 0)),
            # 22:00 slot
            ("0252", "Đóng kệ lạnh", "PERI", time(22, 0), time(22, 15)),
            ("0253", "Bàn giao cuối", "PERI", time(22, 15), time(22, 30)),
        ],
        # Staff 7 - DRY ca chiều
        7: [
            # 14:30 slot
            ("0327", "Nhận bàn giao Dry", "DRY", time(14, 30), time(14, 45)),
            ("0328", "Kiểm OOS Dry", "DRY", time(14, 45), time(15, 0)),
            # 15:00 slot
            ("0329", "Bổ sung kệ chiều", "DRY", time(15, 0), time(15, 15)),
            ("0330", "Kéo mặt Dry", "DRY", time(15, 15), time(15, 30)),
            ("0331", "Check promo", "DRY", time(15, 30), time(15, 45)),
            ("0332", "Sắp xếp endcap", "DRY", time(15, 45), time(16, 0)),
            # 16:00 slot
            ("0333", "Kiểm HSD", "DRY", time(16, 0), time(16, 15)),
            ("0334", "Bổ sung snack", "DRY", time(16, 15), time(16, 30)),
            ("0335", "Check nước uống", "DRY", time(16, 30), time(16, 45)),
            ("0336", "Xoay FIFO", "DRY", time(16, 45), time(17, 0)),
            # 17:00 slot
            ("0337", "Bổ sung peak", "DRY", time(17, 0), time(17, 15)),
            ("0338", "Kéo mặt peak", "DRY", time(17, 15), time(17, 30)),
            ("0339", "Check OOS peak", "DRY", time(17, 30), time(17, 45)),
            ("0340", "Sắp xếp gondola", "DRY", time(17, 45), time(18, 0)),
            # 18:00 slot
            ("0341", "Bổ sung mì gói", "DRY", time(18, 0), time(18, 15)),
            ("0342", "Check gia vị", "DRY", time(18, 15), time(18, 30)),
            ("0343", "Kiểm bánh kẹo", "DRY", time(18, 30), time(18, 45)),
            ("0344", "Kéo mặt tối", "DRY", time(18, 45), time(19, 0)),
            # 19:00 slot
            ("0345", "Giảm giá HSD", "DRY", time(19, 0), time(19, 15)),
            ("0346", "Thu dọn hàng", "DRY", time(19, 15), time(19, 30)),
            ("0809", "Vệ sinh kệ Dry", "QC-FSH", time(19, 30), time(19, 45)),
            ("0347", "Kiểm kho Dry", "DRY", time(19, 45), time(20, 0)),
            # 20:00-21:00 Break
            ("1005", "Break Time", "OTHER", time(20, 0), time(20, 15)),
            ("1006", "Break Time", "OTHER", time(20, 15), time(20, 30)),
            ("1007", "Break Time", "OTHER", time(20, 30), time(20, 45)),
            ("1008", "Break Time", "OTHER", time(20, 45), time(21, 0)),
            # 21:00 slot
            ("0348", "Kéo mặt cuối", "DRY", time(21, 0), time(21, 15)),
            ("0349", "Báo cáo OOS", "DRY", time(21, 15), time(21, 30)),
            ("0350", "Vệ sinh khu vực", "DRY", time(21, 30), time(21, 45)),
            ("0351", "Báo cáo Dry", "DRY", time(21, 45), time(22, 0)),
            # 22:00 slot
            ("0352", "Kiểm tra cuối", "DRY", time(22, 0), time(22, 15)),
            ("0353", "Bàn giao cuối", "DRY", time(22, 15), time(22, 30)),
        ],
        # Staff 8 - DELICA/DND ca chiều
        8: [
            # 14:30 slot
            ("0506", "Nhận bàn giao Delica", "DELICA", time(14, 30), time(14, 45)),
            ("0603", "Kiểm D&D", "DND", time(14, 45), time(15, 0)),
            # 15:00 slot
            ("0507", "Pha chế Cafe", "DELICA", time(15, 0), time(15, 15)),
            ("0508", "Lên hàng Delica", "DELICA", time(15, 15), time(15, 30)),
            ("0604", "Đặt hàng D&D", "DND", time(15, 30), time(15, 45)),
            ("0605", "Kéo mặt D&D", "DND", time(15, 45), time(16, 0)),
            # 16:00 slot
            ("0509", "Kiểm HSD Delica", "DELICA", time(16, 0), time(16, 15)),
            ("0510", "Bổ sung bánh", "DELICA", time(16, 15), time(16, 30)),
            ("0606", "Check sữa D&D", "DND", time(16, 30), time(16, 45)),
            ("0607", "Xoay FIFO D&D", "DND", time(16, 45), time(17, 0)),
            # 17:00 slot
            ("0511", "Pha chế peak", "DELICA", time(17, 0), time(17, 15)),
            ("0512", "Phục vụ khách", "DELICA", time(17, 15), time(17, 30)),
            ("0608", "Bổ sung D&D peak", "DND", time(17, 30), time(17, 45)),
            ("0609", "Check OOS D&D", "DND", time(17, 45), time(18, 0)),
            # 18:00 slot
            ("0513", "Bổ sung Delica", "DELICA", time(18, 0), time(18, 15)),
            ("0514", "Kéo mặt Delica", "DELICA", time(18, 15), time(18, 30)),
            ("0610", "Kiểm nhiệt D&D", "DND", time(18, 30), time(18, 45)),
            ("0611", "Kéo mặt D&D tối", "DND", time(18, 45), time(19, 0)),
            # 19:00 slot
            ("0515", "Giảm giá Delica", "DELICA", time(19, 0), time(19, 15)),
            ("0612", "Giảm giá D&D", "DND", time(19, 15), time(19, 30)),
            ("0810", "Vệ sinh Delica", "QC-FSH", time(19, 30), time(19, 45)),
            ("0516", "Thu dọn Delica", "DELICA", time(19, 45), time(20, 0)),
            # 20:00-21:00 Break
            ("1005", "Break Time", "OTHER", time(20, 0), time(20, 15)),
            ("1006", "Break Time", "OTHER", time(20, 15), time(20, 30)),
            ("1007", "Break Time", "OTHER", time(20, 30), time(20, 45)),
            ("1008", "Break Time", "OTHER", time(20, 45), time(21, 0)),
            # 21:00 slot
            ("0517", "Đóng quầy Delica", "DELICA", time(21, 0), time(21, 15)),
            ("0613", "Thu dọn D&D", "DND", time(21, 15), time(21, 30)),
            ("0518", "Vệ sinh máy pha", "DELICA", time(21, 30), time(21, 45)),
            ("0614", "Kiểm kho D&D", "DND", time(21, 45), time(22, 0)),
            # 22:00 slot
            ("0519", "Báo cáo Delica", "DELICA", time(22, 0), time(22, 15)),
            ("0615", "Bàn giao D&D", "DND", time(22, 15), time(22, 30)),
        ],
    }

    # Merge schedules
    all_schedules = {**morning_schedule, **afternoon_schedule}

    for day_offset in range(7):
        current_date = today + timedelta(days=day_offset)

        for staff_id, tasks in all_schedules.items():
            for task_code, task_name, group_id, start_t, end_t in tasks:
                # Check duplicate by staff_id + schedule_date + start_time (not task_code)
                # This ensures only 1 task per staff per time slot
                existing = db.query(DailyScheduleTask).filter(
                    DailyScheduleTask.staff_id == staff_id,
                    DailyScheduleTask.schedule_date == current_date,
                    DailyScheduleTask.start_time == start_t
                ).first()

                if not existing:
                    task = DailyScheduleTask(
                        staff_id=staff_id,
                        store_id=1,
                        schedule_date=current_date,
                        group_id=group_id,
                        task_code=task_code,  # Use original task_code without day suffix
                        task_name=task_name,
                        start_time=start_t,
                        end_time=end_t,
                        status="pending"
                    )
                    db.add(task)

    db.commit()
    print("✓ Daily schedule tasks seeded (8 staff, 4 per shift, 4 tasks per slot)")


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
        seed_task_library(db)
        seed_daily_templates(db)
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
