-- OptiChain WS & DWS Database Schema
-- PostgreSQL 15+
-- Combined schema from WS (officepc) and DWS (refactor) systems

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES: Regions, Stores, Staff
-- ============================================

CREATE TABLE regions (
    region_id SERIAL PRIMARY KEY,
    region_name VARCHAR(255) NOT NULL,
    region_code VARCHAR(50) UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (
    store_id SERIAL PRIMARY KEY,
    store_name VARCHAR(255) NOT NULL,
    store_code VARCHAR(50) UNIQUE,
    region_id INTEGER REFERENCES regions(region_id) ON DELETE SET NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    manager_id INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL,
    department_code VARCHAR(50) UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE staff (
    staff_id SERIAL PRIMARY KEY,
    staff_name VARCHAR(255) NOT NULL,
    staff_code VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    store_id INTEGER REFERENCES stores(store_id) ON DELETE SET NULL,
    department_id INTEGER REFERENCES departments(department_id) ON DELETE SET NULL,
    role VARCHAR(50),
    password_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE stores ADD CONSTRAINT fk_manager
    FOREIGN KEY (manager_id) REFERENCES staff(staff_id) ON DELETE SET NULL;

-- ============================================
-- CODE MASTER: Lookup tables
-- ============================================

CREATE TABLE code_master (
    code_master_id SERIAL PRIMARY KEY,
    code_type VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(code_type, code)
);

-- ============================================
-- TASK MANAGEMENT (from WS)
-- ============================================

CREATE TABLE manuals (
    manual_id SERIAL PRIMARY KEY,
    manual_name VARCHAR(255) NOT NULL,
    manual_url TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    task_name VARCHAR(500) NOT NULL,
    task_description TEXT,
    manual_id INTEGER REFERENCES manuals(manual_id) ON DELETE SET NULL,
    task_type_id INTEGER REFERENCES code_master(code_master_id),
    response_type_id INTEGER REFERENCES code_master(code_master_id),
    response_num INTEGER,
    is_repeat BOOLEAN DEFAULT FALSE,
    repeat_config JSONB,
    dept_id INTEGER REFERENCES departments(department_id) ON DELETE SET NULL,
    assigned_store_id INTEGER REFERENCES stores(store_id) ON DELETE SET NULL,
    assigned_staff_id INTEGER REFERENCES staff(staff_id) ON DELETE SET NULL,
    do_staff_id INTEGER REFERENCES staff(staff_id) ON DELETE SET NULL,
    status_id INTEGER REFERENCES code_master(code_master_id),
    priority VARCHAR(20) DEFAULT 'normal',
    start_date DATE,
    end_date DATE,
    start_time TIME,
    due_datetime TIMESTAMP,
    completed_time TIMESTAMP,
    comment TEXT,
    attachments JSONB,
    created_staff_id INTEGER REFERENCES staff(staff_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE check_lists (
    check_list_id SERIAL PRIMARY KEY,
    check_list_name VARCHAR(500) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_check_list (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(task_id) ON DELETE CASCADE,
    check_list_id INTEGER REFERENCES check_lists(check_list_id) ON DELETE CASCADE,
    check_status BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    completed_by INTEGER REFERENCES staff(staff_id),
    notes TEXT,
    UNIQUE(task_id, check_list_id)
);

-- ============================================
-- SHIFT MANAGEMENT (from DWS)
-- ============================================

CREATE TABLE shift_codes (
    shift_code_id SERIAL PRIMARY KEY,
    shift_code VARCHAR(10) NOT NULL UNIQUE,
    shift_name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours DECIMAL(4,2),
    color_code VARCHAR(7),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shift_assignments (
    assignment_id SERIAL PRIMARY KEY,
    staff_id INTEGER REFERENCES staff(staff_id) ON DELETE CASCADE,
    store_id INTEGER REFERENCES stores(store_id),
    shift_date DATE NOT NULL,
    shift_code_id INTEGER REFERENCES shift_codes(shift_code_id),
    status VARCHAR(20) DEFAULT 'assigned',
    notes TEXT,
    assigned_by INTEGER REFERENCES staff(staff_id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, shift_date, shift_code_id)
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    recipient_staff_id INTEGER REFERENCES staff(staff_id) ON DELETE CASCADE,
    sender_staff_id INTEGER REFERENCES staff(staff_id) ON DELETE SET NULL,
    notification_type VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_staff_store ON staff(store_id);
CREATE INDEX idx_tasks_status ON tasks(status_id);
CREATE INDEX idx_tasks_assigned_staff ON tasks(assigned_staff_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_staff_id, is_read);

-- ============================================
-- SAMPLE DATA
-- ============================================

INSERT INTO code_master (code_type, code, name, sort_order) VALUES
('task_type', 'DAILY', 'Daily Task', 1),
('task_type', 'WEEKLY', 'Weekly Task', 2),
('task_type', 'MONTHLY', 'Monthly Task', 3),
('response_type', 'YES_NO', 'Yes/No', 1),
('response_type', 'NUMBER', 'Number', 2),
('status', 'PENDING', 'Pending', 1),
('status', 'IN_PROGRESS', 'In Progress', 2),
('status', 'COMPLETED', 'Completed', 3);
