-- ============================================
-- Migration: Create Manual Steps & Media tables
-- Date: 2025-12-29
-- Description: Add step-based manual system like Teachme Biz
-- ============================================

-- ============================================
-- STEP 1: Create manual_steps table
-- ============================================
CREATE TABLE IF NOT EXISTS manual_steps (
    step_id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES manual_documents(document_id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,  -- 0 = cover, 1+ = steps
    step_type VARCHAR(20) DEFAULT 'step',  -- cover, step

    -- Content
    title VARCHAR(500),
    description TEXT,

    -- Media
    media_type VARCHAR(20),  -- image, video, none
    media_url VARCHAR(500),
    media_thumbnail VARCHAR(500),

    -- Annotations/Overlays as JSON
    -- For images: [{"type": "rectangle", "x": 100, "y": 50, "width": 200, "height": 100, "color": "#FF0000"}, ...]
    -- For videos: [{"type": "subtitle", "startTime": 0, "endTime": 5, "text": "..."}, {"type": "marker", "time": 3, "x": 100, "y": 50}, ...]
    annotations JSONB DEFAULT '[]',

    -- Video-specific
    video_trim_start INTEGER,  -- Start time in seconds
    video_trim_end INTEGER,  -- End time in seconds
    video_muted BOOLEAN DEFAULT FALSE,

    -- Metadata
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_manual_steps_document ON manual_steps(document_id);
CREATE INDEX IF NOT EXISTS idx_manual_steps_number ON manual_steps(document_id, step_number);

-- ============================================
-- STEP 2: Create manual_media table
-- ============================================
CREATE TABLE IF NOT EXISTS manual_media (
    media_id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES manual_documents(document_id) ON DELETE CASCADE,
    step_id INTEGER REFERENCES manual_steps(step_id) ON DELETE CASCADE,

    -- File info
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),  -- image/png, video/mp4, etc.
    file_size INTEGER,  -- bytes
    file_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),

    -- Processed/edited version
    edited_url VARCHAR(500),  -- URL to edited version with annotations baked in

    -- Metadata
    width INTEGER,
    height INTEGER,
    duration INTEGER,  -- Video duration in seconds

    uploaded_by INTEGER REFERENCES staff(staff_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_manual_media_document ON manual_media(document_id);
CREATE INDEX IF NOT EXISTS idx_manual_media_step ON manual_media(step_id);

-- ============================================
-- STEP 3: Insert sample steps for existing documents
-- ============================================
DO $$
DECLARE
    v_doc_id INTEGER;
BEGIN
    -- Get first POS document
    SELECT document_id INTO v_doc_id FROM manual_documents WHERE document_code = 'POS-001' LIMIT 1;

    IF v_doc_id IS NOT NULL THEN
        -- Insert cover (step_number = 0)
        INSERT INTO manual_steps (document_id, step_number, step_type, title, description, media_type)
        VALUES (v_doc_id, 0, 'cover', 'Huong dan mo POS', 'Quy trinh mo may POS dau ca lam viec', 'image')
        ON CONFLICT DO NOTHING;

        -- Insert steps
        INSERT INTO manual_steps (document_id, step_number, step_type, title, description, media_type)
        VALUES
            (v_doc_id, 1, 'step', 'Kiem tra nguon dien', 'Dam bao may POS duoc ket noi nguon dien on dinh', 'image'),
            (v_doc_id, 2, 'step', 'Mo may POS', 'Nhan nut Power de khoi dong may', 'image'),
            (v_doc_id, 3, 'step', 'Dang nhap he thong', 'Nhap ma nhan vien va mat khau de dang nhap', 'image'),
            (v_doc_id, 4, 'step', 'Kiem tra tien mat ban dau', 'Dem va xac nhan so tien mat ban dau trong ngan', 'image'),
            (v_doc_id, 5, 'step', 'San sang phuc vu', 'Kiem tra may in hoa don va bat dau ca lam viec', 'image')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================
-- VERIFY
-- ============================================
SELECT 'manual_steps' as table_name, COUNT(*) as count FROM manual_steps
UNION ALL
SELECT 'manual_media', COUNT(*) FROM manual_media;

-- Show steps for sample document
SELECT
    s.step_id,
    s.document_id,
    d.document_name,
    s.step_number,
    s.step_type,
    s.title,
    s.media_type
FROM manual_steps s
JOIN manual_documents d ON s.document_id = d.document_id
ORDER BY s.document_id, s.step_number;
