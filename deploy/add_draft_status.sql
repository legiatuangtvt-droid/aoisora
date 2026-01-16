-- Add DRAFT status to code_master for Save as Draft feature
-- Run this on both local and production database

INSERT INTO `code_master` (`code_master_id`, `code_type`, `code`, `name`, `sort_order`, `is_active`)
VALUES (12, 'status', 'DRAFT', 'Draft', 0, 1)
ON DUPLICATE KEY UPDATE `name` = 'Draft', `code` = 'DRAFT';

-- Verify the insert
SELECT * FROM code_master WHERE code_type = 'status' ORDER BY sort_order;
