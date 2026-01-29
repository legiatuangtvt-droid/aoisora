"""
Script to import employee data from CSV to SQL statements
Generates INSERT statements for:
1. New MAXVALU stores
2. Staff records
"""

import csv
import re
import unicodedata
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

# Vietnamese character mapping for special cases
VIETNAMESE_MAP = {
    'đ': 'd', 'Đ': 'D',
    'ă': 'a', 'Ă': 'A',
    'â': 'a', 'Â': 'A',
    'ê': 'e', 'Ê': 'E',
    'ô': 'o', 'Ô': 'O',
    'ơ': 'o', 'Ơ': 'O',
    'ư': 'u', 'Ư': 'U',
}

def remove_vietnamese_diacritics(text):
    """Convert Vietnamese text to non-accented ASCII"""
    if not text:
        return ''

    # First, handle special Vietnamese characters
    for vn_char, ascii_char in VIETNAMESE_MAP.items():
        text = text.replace(vn_char, ascii_char)

    # Then normalize Unicode and remove remaining diacritics
    # NFD decomposes characters (e.g., é -> e + ´)
    normalized = unicodedata.normalize('NFD', text)

    # Remove diacritical marks (category 'Mn' = Mark, Nonspacing)
    ascii_text = ''.join(c for c in normalized if unicodedata.category(c) != 'Mn')

    # Remove any remaining non-ASCII characters
    ascii_text = ascii_text.encode('ascii', 'ignore').decode('ascii')

    return ascii_text

def name_to_username(name):
    """Convert Vietnamese name to username (lowercase, no spaces, no diacritics)"""
    if not name:
        return ''

    # Remove diacritics
    ascii_name = remove_vietnamese_diacritics(name)

    # Lowercase and remove spaces/special characters
    username = ascii_name.lower()
    username = re.sub(r'[^a-z0-9]', '', username)

    return username

def generate_unique_username(base_username, joining_date, used_usernames):
    """
    Generate unique username with suffix if duplicate.
    Suffix order: year[yy] → month[mm] → day[dd] → a,b,c,...
    """
    # Try base username first
    if base_username not in used_usernames:
        used_usernames.add(base_username)
        return base_username

    # Parse joining date for suffix
    year_suffix = ''
    month_suffix = ''
    day_suffix = ''

    if joining_date:
        try:
            # Format: 2015-05-04
            parts = joining_date.split('-')
            if len(parts) >= 3:
                year_suffix = parts[0][-2:]  # Last 2 digits of year
                month_suffix = parts[1]
                day_suffix = parts[2]
        except:
            pass

    # Try with year suffix
    if year_suffix:
        candidate = f"{base_username}{year_suffix}"
        if candidate not in used_usernames:
            used_usernames.add(candidate)
            return candidate

        # Try with year + month
        if month_suffix:
            candidate = f"{base_username}{year_suffix}{month_suffix}"
            if candidate not in used_usernames:
                used_usernames.add(candidate)
                return candidate

            # Try with year + month + day
            if day_suffix:
                candidate = f"{base_username}{year_suffix}{month_suffix}{day_suffix}"
                if candidate not in used_usernames:
                    used_usernames.add(candidate)
                    return candidate

    # Fall back to alphabetical suffix (a, b, c, ...)
    for suffix in 'abcdefghijklmnopqrstuvwxyz':
        candidate = f"{base_username}{suffix}"
        if candidate not in used_usernames:
            used_usernames.add(candidate)
            return candidate

    # If all else fails, use number suffix
    counter = 1
    while True:
        candidate = f"{base_username}{counter}"
        if candidate not in used_usernames:
            used_usernames.add(candidate)
            return candidate
        counter += 1

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
            'Detail', 'Working Location', 'Position', 'Position_VN', 'Job grade',
            'Account', 'Password'  # New columns
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

    # Track used usernames for uniqueness
    used_usernames = set()
    # Reserve special usernames
    used_usernames.add('admin')
    used_usernames.add('yoshinaga')

    # Generate usernames for all employees first
    employee_usernames = []
    for emp in employees:
        base_username = name_to_username(emp['staff_name'])
        if not base_username:
            base_username = f"emp{emp['staff_code']}"

        username = generate_unique_username(base_username, emp['joining_date'], used_usernames)
        employee_usernames.append(username)

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

    # Default password hash for 'Aeon@2025'
    password_hash = "$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW"

    # Start staff_id from 1 (no more test accounts)
    staff_id = 1

    for i, emp in enumerate(employees):
        # Determine department_id and store_id
        if emp['is_store']:
            dept_id = 'NULL'  # Store staff don't have department
            store_id_val = store_id_map.get(emp['detail'], 'NULL')
        else:
            dept_id = DEPT_MAPPING.get(emp['detail'], 'NULL')
            store_id_val = 'NULL'

        role = get_role(emp['job_grade'])
        username = employee_usernames[i]
        email = f"{username}@aeon.com.vn"

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

    # Add System Admin (highest privilege, not in org hierarchy - for operations/maintenance)
    sql_lines.append("")
    sql_lines.append("-- ============================================")
    sql_lines.append("-- SYSTEM ADMIN (Operations/Maintenance Account)")
    sql_lines.append("-- NOT part of organizational hierarchy")
    sql_lines.append("-- Highest privilege for app operations")
    sql_lines.append("-- ============================================")
    admin_sql = f"""INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES ({staff_id}, 'SYS001', 'Admin System', 'admin', 'admin@aeon.com.vn', NULL, NULL, NULL, 'SYSTEM_ADMIN', 'System Administrator', NULL, NULL, {escape_sql(password_hash)}, 'active', 1);"""
    sql_lines.append(admin_sql)
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

    # Return employee_usernames for CSV update
    return output_path, employees, employee_usernames

def update_csv_with_usernames():
    """Update the CSV file with generated usernames"""
    output_path, employees, employee_usernames = main()

    # Read original CSV
    csv_path = 'd:/Project/auraProject/docs/employee_list_utf8.csv'
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        lines = f.readlines()

    # Parse header (first 5 lines are headers)
    header_lines = lines[:5]
    data_lines = lines[5:]

    # Update Account column in each data row
    updated_lines = header_lines.copy()
    emp_index = 0

    for line in data_lines:
        if not line.strip():
            updated_lines.append(line)
            continue

        # Parse CSV line (handle commas in quoted fields)
        parts = []
        current = ''
        in_quotes = False
        for char in line.rstrip('\n\r'):
            if char == '"':
                in_quotes = not in_quotes
                current += char
            elif char == ',' and not in_quotes:
                parts.append(current)
                current = ''
            else:
                current += char
        parts.append(current)

        # Check if this is an employee row (has employee code)
        if len(parts) >= 3:
            emp_code = parts[2].strip().strip('"')
            if emp_code and emp_code.isdigit() and emp_index < len(employee_usernames):
                # Update Account column (index 10)
                while len(parts) < 12:
                    parts.append('')
                parts[10] = employee_usernames[emp_index]
                parts[11] = 'Aeon@2025'
                emp_index += 1

        updated_lines.append(','.join(parts) + '\n')

    # Write updated CSV
    with open(csv_path, 'w', encoding='utf-8-sig') as f:
        f.writelines(updated_lines)

    print(f"\nUpdated CSV file: {csv_path}")
    print(f"Updated {emp_index} employee accounts")

    return output_path

if __name__ == '__main__':
    update_csv_with_usernames()
