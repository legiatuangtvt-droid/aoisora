"""
Script to create a clean full_reset.sql with:
1. Full database schema (all tables)
2. All data EXCEPT stores and staff
3. Real employee data (stores and staff from employee_import.sql)
"""

import re

def main():
    # Read base database (from git commit with stores and staff tables)
    with open('d:/Project/auraProject/deploy/full_reset_base.sql', 'r', encoding='utf-8') as f:
        full_sql = f.read()

    # Read employee data
    with open('d:/Project/auraProject/deploy/employee_import.sql', 'r', encoding='utf-8') as f:
        employee_data = f.read()

    # Split the full SQL into lines
    lines = full_sql.split('\n')

    output = []

    # Add CREATE DATABASE and USE statements at the beginning
    output.append("-- ============================================")
    output.append("-- AEON AOISORA DATABASE - CLEAN RESET")
    output.append("-- Contains: Real MAXVALU stores and employees")
    output.append("-- ============================================")
    output.append("")
    output.append("DROP DATABASE IF EXISTS `auraorie68aa_aoisora`;")
    output.append("CREATE DATABASE `auraorie68aa_aoisora` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    output.append("USE `auraorie68aa_aoisora`;")
    output.append("")

    skip_data = False
    current_table = None

    for line in lines:
        # Check for LOCK TABLES to identify which table's data we're in
        if line.startswith('LOCK TABLES `'):
            match = re.search(r'LOCK TABLES `(\w+)`', line)
            if match:
                current_table = match.group(1)
                # Skip data for stores and staff tables
                if current_table in ('stores', 'staff'):
                    skip_data = True
                else:
                    skip_data = False

        # Check for UNLOCK TABLES to end skip
        if line.startswith('UNLOCK TABLES'):
            if skip_data and current_table in ('stores', 'staff'):
                # Don't output UNLOCK for skipped tables
                skip_data = False
                current_table = None
                continue

        # Skip INSERT statements for stores and staff
        if skip_data and (line.startswith('INSERT INTO') or line.startswith('/*!40000 ALTER TABLE')):
            continue

        # Skip LOCK TABLES for stores and staff
        if skip_data and line.startswith('LOCK TABLES'):
            continue

        output.append(line)

    # Now add the real employee data at the end
    output.append("\n-- ============================================")
    output.append("-- REAL EMPLOYEE DATA (MAXVALU STORES + STAFF)")
    output.append("-- ============================================\n")

    # Add stores data from employee_import.sql
    output.append("LOCK TABLES `stores` WRITE;")
    output.append("/*!40000 ALTER TABLE `stores` DISABLE KEYS */;")

    emp_lines = employee_data.split('\n')
    for line in emp_lines:
        if line.startswith('INSERT INTO stores'):
            output.append(line)

    output.append("/*!40000 ALTER TABLE `stores` ENABLE KEYS */;")
    output.append("UNLOCK TABLES;")
    output.append("")

    # Add staff data from employee_import.sql
    output.append("LOCK TABLES `staff` WRITE;")
    output.append("/*!40000 ALTER TABLE `staff` DISABLE KEYS */;")

    for line in emp_lines:
        if line.startswith('INSERT INTO staff'):
            output.append(line)

    output.append("/*!40000 ALTER TABLE `staff` ENABLE KEYS */;")
    output.append("UNLOCK TABLES;")
    output.append("")

    # Write output
    output_path = 'd:/Project/auraProject/deploy/full_reset.sql'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(output))

    print(f"Created clean full_reset.sql at {output_path}")

    # Count final data
    store_count = sum(1 for line in output if line.startswith('INSERT INTO stores'))
    staff_count = sum(1 for line in output if line.startswith('INSERT INTO staff'))

    print(f"\nFinal counts:")
    print(f"  Stores: {store_count}")
    print(f"  Staff: {staff_count}")

if __name__ == '__main__':
    main()
