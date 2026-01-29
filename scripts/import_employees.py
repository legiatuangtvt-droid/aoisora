"""
Script to import employee data from CSV to SQL statements
Generates INSERT statements for:
1. New MAXVALU stores
2. Staff records
"""

import csv
from datetime import datetime

# Department mapping: CSV Detail → department_id
# IMPORTANT: Must use LEAF NODES only (per CLAUDE.md rules)
# Parent nodes (DO NOT USE): OP(1), ADMIN(2), PLAN(5)
# Leaf nodes under OP: PERI(7), GRO(8), Delica(9), D&D(10), CS(11)
# Leaf nodes under ADMIN: ADM(12), MMD(13), ACC(14)
# Leaf nodes under PLAN: MKT(15), SPA(16), ORD(17)
# Standalone leaf nodes: CTRL(3), IMP(4), HR(6)
DEPT_MAPPING = {
    'ACCOUNTING': 14,        # ACC (leaf under ADMIN)
    'ADMIN': 12,             # ADM (leaf under ADMIN) - NOT dept 2 which is parent!
    'CASHIER & CS': 11,      # CS (leaf under OP)
    'CONTROL': 3,            # CTRL (standalone leaf)
    'D&D': 10,               # D&D (leaf under OP)
    'DELICA & D&D': 9,       # Delica (leaf under OP)
    'DELICA BUSINESS DEVELOPMENT': 9,  # Delica (leaf under OP)
    'GROCERY': 8,            # GRO (leaf under OP)
    'HUMAN RESOURCES': 6,    # HR (standalone leaf)
    'IMPROVEMENT': 4,        # IMP (standalone leaf)
    'MARKETING': 15,         # MKT (leaf under PLAN)
    'MMD': 13,               # MMD (leaf under ADMIN)
    'PERISHABLE': 7,         # PERI (leaf under OP)
    'QUALITY CONTROL': 3,    # CTRL (standalone leaf)
    'RECRUITMENT': 6,        # HR (standalone leaf)
    'SM': 7,                 # PERI - Store Management maps to PERI (leaf under OP)
    'TRAINER': 6,            # HR (standalone leaf)
    'TRAINING': 6,           # HR (standalone leaf)
    'NONFOOD - HBC': 8,      # GRO (leaf under OP)
    'NEW STORE SUPPORT': 7,  # PERI - New Store Support maps to PERI (leaf under OP)
}

# Job grade to role mapping
def get_role(job_grade):
    if not job_grade:
        return 'STAFF'
    grade = job_grade.upper().strip()
    if grade in ['G9', 'G8', 'G7']:
        return 'ADMIN'
    elif grade in ['G6', 'G5']:
        return 'MANAGER'
    elif grade in ['G4', 'G3']:
        return 'SUPERVISOR'
    elif grade.startswith('S'):
        return 'STORE_STAFF'
    else:
        return 'STAFF'

def escape_sql(s):
    if s is None:
        return 'NULL'
    return "'" + str(s).replace("'", "''").replace("\\", "\\\\") + "'"

def main():
    # Read CSV data
    employees = []
    store_names = set()

    with open('d:/Project/auraProject/docs/employee_list_utf8.csv', 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f, fieldnames=[
            'NO', 'PHOTO', 'Employee code', 'NAME', 'JOINING DATE',
            'Detail', 'Working Location', 'Position', 'Position_VN', 'Job grade'
        ])
        # Skip header rows
        for _ in range(5):
            next(reader)

        for row in reader:
            emp_code = row['Employee code'].strip() if row['Employee code'] else None
            if not emp_code or not emp_code.isdigit():
                continue

            detail = row['Detail'].strip() if row['Detail'] else ''

            # Determine if HQ or Store
            is_store = detail.startswith('MAXVALU')
            if is_store:
                store_names.add(detail)

            # Parse joining date
            joining_date = None
            if row['JOINING DATE']:
                try:
                    # Format: 2015-05-04 00:00:00
                    joining_date = row['JOINING DATE'].split(' ')[0]
                except:
                    pass

            employees.append({
                'staff_code': emp_code,
                'staff_name': row['NAME'].strip() if row['NAME'] else '',
                'joining_date': joining_date,
                'detail': detail,
                'position': row['Position'].strip() if row['Position'] else None,
                'position_vn': row['Position_VN'].strip() if row['Position_VN'] else None,
                'job_grade': row['Job grade'].strip() if row['Job grade'] else None,
                'is_store': is_store,
            })

    # Generate SQL
    sql_lines = []

    # Header
    sql_lines.append("-- ============================================")
    sql_lines.append("-- EMPLOYEE IMPORT FROM CSV")
    sql_lines.append(f"-- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_lines.append(f"-- Total employees: {len(employees)}")
    sql_lines.append(f"-- HQ Staff: {sum(1 for e in employees if not e['is_store'])}")
    sql_lines.append(f"-- Store Staff: {sum(1 for e in employees if e['is_store'])}")
    sql_lines.append("-- ============================================")
    sql_lines.append("")

    # 1. Insert MAXVALU stores (starting from store_id 1)
    sql_lines.append("-- ============================================")
    sql_lines.append("-- 1. INSERT MAXVALU STORES (Real data)")
    sql_lines.append("-- ============================================")
    sql_lines.append("")

    store_id_map = {}
    store_id = 1  # Start from 1 (no more fake stores)
    for store_name in sorted(store_names):
        store_code = store_name.replace('MAXVALU ', 'MV-').replace(' ', '-').upper()
        store_id_map[store_name] = store_id
        sql_lines.append(f"INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES ({store_id}, {escape_sql(store_name)}, {escape_sql(store_code)}, 1, 1, 'active');")
        store_id += 1

    sql_lines.append("")

    # 2. Clear existing staff (optional - commented out)
    sql_lines.append("-- ============================================")
    sql_lines.append("-- 2. CLEAR EXISTING STAFF (OPTIONAL)")
    sql_lines.append("-- Uncomment if you want to replace all staff")
    sql_lines.append("-- ============================================")
    sql_lines.append("-- TRUNCATE TABLE staff;")
    sql_lines.append("")

    # 3. Insert staff records
    sql_lines.append("-- ============================================")
    sql_lines.append("-- 3. INSERT STAFF RECORDS")
    sql_lines.append("-- ============================================")
    sql_lines.append("")

    # Default password hash for 'password' (matches existing test accounts)
    password_hash = "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"

    # Start staff_id from 1 (no more test accounts)
    staff_id = 1

    for emp in employees:
        # Determine department_id and store_id
        if emp['is_store']:
            dept_id = 'NULL'  # Store staff don't have department
            store_id_val = store_id_map.get(emp['detail'], 'NULL')
        else:
            dept_id = DEPT_MAPPING.get(emp['detail'], 'NULL')
            store_id_val = 'NULL'

        role = get_role(emp['job_grade'])
        username = f"emp{emp['staff_code']}"
        email = f"emp{emp['staff_code']}@aeon.com.vn"

        joining_date_sql = escape_sql(emp['joining_date']) if emp['joining_date'] else 'NULL'

        sql = f"""INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES ({staff_id}, {escape_sql(emp['staff_code'])}, {escape_sql(emp['staff_name'])}, {escape_sql(username)}, {escape_sql(email)}, NULL, {store_id_val}, {dept_id}, {escape_sql(role)}, {escape_sql(emp['position'])}, {escape_sql(emp['job_grade'])}, {joining_date_sql}, {escape_sql(password_hash)}, 'active', 1);"""

        sql_lines.append(sql)
        staff_id += 1

    # Add Yoshinaga Shinichi (G6 HQ staff - requested by user)
    sql_lines.append("")
    sql_lines.append("-- ============================================")
    sql_lines.append("-- ADDITIONAL HQ STAFF (Manual Entry)")
    sql_lines.append("-- ============================================")
    yoshinaga_sql = f"""INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES ({staff_id}, 'HQ001', 'Yoshinaga Shinichi', 'yoshinaga', 'yoshinaga@aeon.com.vn', '0901234567', NULL, 7, 'MANAGER', 'Department Manager', 'G6', '2020-01-15', {escape_sql(password_hash)}, 'active', 1);"""
    sql_lines.append(yoshinaga_sql)
    staff_id += 1

    sql_lines.append("")
    sql_lines.append("-- ============================================")
    sql_lines.append("-- END OF EMPLOYEE IMPORT")
    sql_lines.append("-- ============================================")

    # Write to file
    output_path = 'd:/Project/auraProject/deploy/employee_import.sql'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))

    print(f"Generated SQL file: {output_path}")
    print(f"Total employees: {len(employees)}")
    print(f"New stores: {len(store_names)}")

    return output_path

if __name__ == '__main__':
    main()
