-- Fix admin password to 'password' (BCrypt hash)
-- Run this on production database

UPDATE staff
SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    status = 'active',
    is_active = 1
WHERE username = 'admin';

-- Verify the update
SELECT staff_id, username, staff_name, email, status, is_active,
       LEFT(password_hash, 30) as password_prefix
FROM staff
WHERE username = 'admin';
