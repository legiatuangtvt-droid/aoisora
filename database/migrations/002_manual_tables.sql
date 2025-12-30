-- ============================================
-- Migration: Create Manual/Knowledge Base tables
-- Date: 2025-12-29
-- ============================================

-- ============================================
-- STEP 1: Create manual_folders table
-- ============================================
CREATE TABLE IF NOT EXISTS manual_folders (
    folder_id SERIAL PRIMARY KEY,
    folder_name VARCHAR(255) NOT NULL,
    parent_folder_id INTEGER REFERENCES manual_folders(folder_id) ON DELETE CASCADE,
    store_id INTEGER REFERENCES stores(store_id) ON DELETE SET NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES staff(staff_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for parent folder lookup
CREATE INDEX IF NOT EXISTS idx_manual_folders_parent ON manual_folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_manual_folders_store ON manual_folders(store_id);

-- ============================================
-- STEP 2: Create manual_documents table
-- ============================================
CREATE TABLE IF NOT EXISTS manual_documents (
    document_id SERIAL PRIMARY KEY,
    folder_id INTEGER REFERENCES manual_folders(folder_id) ON DELETE CASCADE,
    document_code VARCHAR(50),
    document_name VARCHAR(500) NOT NULL,
    description TEXT,
    content_type VARCHAR(20) DEFAULT 'html',
    content TEXT,
    external_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    tags JSONB,
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    version INTEGER DEFAULT 1,
    store_id INTEGER REFERENCES stores(store_id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES staff(staff_id),
    updated_by INTEGER REFERENCES staff(staff_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_manual_documents_folder ON manual_documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_manual_documents_status ON manual_documents(status);
CREATE INDEX IF NOT EXISTS idx_manual_documents_store ON manual_documents(store_id);

-- ============================================
-- STEP 3: Create manual_view_logs table
-- ============================================
CREATE TABLE IF NOT EXISTS manual_view_logs (
    log_id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES manual_documents(document_id) ON DELETE CASCADE,
    staff_id INTEGER REFERENCES staff(staff_id) ON DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_manual_view_logs_document ON manual_view_logs(document_id);
CREATE INDEX IF NOT EXISTS idx_manual_view_logs_staff ON manual_view_logs(staff_id);

-- ============================================
-- STEP 4: Insert sample data
-- ============================================

-- Root folders like Aoi 
INSERT INTO manual_folders (folder_name, description, icon, color, sort_order, is_active)
VALUES
    ('MANUAL STORE', 'Store operation manuals', 'folder', '#3B82F6', 1, true),
    ('Manual Draft', 'Draft manuals in progress', 'folder', '#6B7280', 2, true)
ON CONFLICT DO NOTHING;

-- Get folder IDs and create sub-folders
DO $$
DECLARE
    v_manual_store_id INTEGER;
    v_manual_draft_id INTEGER;
BEGIN
    SELECT folder_id INTO v_manual_store_id FROM manual_folders WHERE folder_name = 'MANUAL STORE' LIMIT 1;
    SELECT folder_id INTO v_manual_draft_id FROM manual_folders WHERE folder_name = 'Manual Draft' LIMIT 1;

    -- Sub-folders under MANUAL STORE
    IF v_manual_store_id IS NOT NULL THEN
        INSERT INTO manual_folders (folder_name, parent_folder_id, description, icon, sort_order, is_active)
        VALUES
            ('Thu ngan (POS)', v_manual_store_id, 'POS operation manuals', 'document', 1, true),
            ('Tuoi song (PERI)', v_manual_store_id, 'Perishable department manuals', 'document', 2, true),
            ('Hang kho (DRY)', v_manual_store_id, 'Dry goods department manuals', 'document', 3, true),
            ('Nhan hang (MMD)', v_manual_store_id, 'Receiving department manuals', 'document', 4, true),
            ('Quan ly (Leader)', v_manual_store_id, 'Store leader manuals', 'document', 5, true)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Insert sample documents
DO $$
DECLARE
    v_pos_folder_id INTEGER;
    v_peri_folder_id INTEGER;
BEGIN
    SELECT folder_id INTO v_pos_folder_id FROM manual_folders WHERE folder_name = 'Thu ngan (POS)' LIMIT 1;
    SELECT folder_id INTO v_peri_folder_id FROM manual_folders WHERE folder_name = 'Tuoi song (PERI)' LIMIT 1;

    -- POS documents
    IF v_pos_folder_id IS NOT NULL THEN
        INSERT INTO manual_documents (folder_id, document_code, document_name, description, content_type, status, view_count)
        VALUES
            (v_pos_folder_id, 'POS-001', 'Huong dan mo POS', 'Quy trinh mo may POS dau ca', 'html', 'published', 312),
            (v_pos_folder_id, 'POS-002', 'Xu ly thanh toan', 'Huong dan thanh toan tien mat va the', 'html', 'published', 245),
            (v_pos_folder_id, 'POS-003', 'Dong POS cuoi ca', 'Quy trinh dong may POS cuoi ca', 'html', 'published', 189)
        ON CONFLICT DO NOTHING;
    END IF;

    -- PERI documents
    IF v_peri_folder_id IS NOT NULL THEN
        INSERT INTO manual_documents (folder_id, document_code, document_name, description, content_type, status, view_count)
        VALUES
            (v_peri_folder_id, 'PERI-001', 'Kiem tra chat luong rau cu', 'Quy trinh kiem tra rau cu qua khi nhan hang', 'html', 'published', 156),
            (v_peri_folder_id, 'PERI-002', 'Bao quan thit tuoi', 'Huong dan bao quan thit tuoi dung cach', 'html', 'published', 201)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================
-- VERIFY
-- ============================================
SELECT 'manual_folders' as table_name, COUNT(*) as count FROM manual_folders
UNION ALL
SELECT 'manual_documents', COUNT(*) FROM manual_documents
UNION ALL
SELECT 'manual_view_logs', COUNT(*) FROM manual_view_logs;

-- Show folder tree
SELECT
    f.folder_id,
    f.folder_name,
    f.parent_folder_id,
    p.folder_name as parent_name,
    (SELECT COUNT(*) FROM manual_documents d WHERE d.folder_id = f.folder_id) as document_count
FROM manual_folders f
LEFT JOIN manual_folders p ON f.parent_folder_id = p.folder_id
ORDER BY f.parent_folder_id NULLS FIRST, f.sort_order;
