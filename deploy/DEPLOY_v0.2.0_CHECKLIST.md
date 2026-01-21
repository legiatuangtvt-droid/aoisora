# Deploy Checklist - Version 0.2.0

> **Release Date**: 2026-01-21
> **Previous Version**: v0.1.0
> **Changes**: Double Token System, Geographic Hierarchy (4-level), Acting Positions

---

## Pre-Deploy Checklist

- [ ] Local build thành công (`npm run build` - ✅ PASSED)
- [ ] All tests pass (if applicable)
- [ ] Code đã commit và push lên GitHub

---

## 1. DATABASE MIGRATION

### File cần import:
```
deploy/migration_v0.2.0.sql
```

### Các thay đổi:
| Change | Description |
|--------|-------------|
| **NEW TABLE: zones** | 6 zones (Hà Nội, Bắc Ninh-HP, Đà Nẵng, Huế-QN, TP.HCM, BD-ĐN) |
| **NEW TABLE: areas** | 15 areas phân bổ theo zones |
| **NEW TABLE: refresh_tokens** | Double Token System cho authentication |
| **NEW TABLE: staff_assignments** | Acting/concurrent positions |
| **MODIFIED: stores** | Thêm column `area_id` |
| **MODIFIED: regions** | Thêm columns `is_active`, `sort_order` |
| **MODIFIED: staff** | Thêm columns `region_id`, `zone_id`, `area_id` |
| **SEED DATA** | 9 new stores, 9 new store leaders |

### Quy trình import:
1. Vào DirectAdmin → MySQL → phpMyAdmin
2. Chọn database `auraorie68aa_aoisora`
3. Tab "Import" → Chọn file `migration_v0.2.0.sql`
4. Click "Go"
5. Verify: Kiểm tra output "Migration v0.2.0 completed successfully!"

### Rollback (nếu cần):
```sql
-- Chạy nếu cần rollback
DROP TABLE IF EXISTS staff_assignments;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS areas;
DROP TABLE IF EXISTS zones;
ALTER TABLE stores DROP COLUMN area_id;
ALTER TABLE staff DROP COLUMN region_id, DROP COLUMN zone_id, DROP COLUMN area_id;
ALTER TABLE regions DROP COLUMN is_active, DROP COLUMN sort_order;
```

---

## 2. BACKEND DEPLOYMENT (FileZilla)

### Connection Info:
- **Host**: ftp.auraorientalis.vn
- **Username**: (check DirectAdmin)
- **Protocol**: SFTP

### Files cần upload:

#### A. Controllers (NEW FILES - 3 files)
```
LOCAL: backend/laravel/app/Http/Controllers/Api/V1/
SERVER: public_html/laravel/app/Http/Controllers/Api/V1/

Files:
- AreaController.php (NEW)
- ScopeController.php (NEW)
- ZoneController.php (NEW)
```

#### B. Controllers (MODIFIED - 4 files)
```
- AuthController.php (MODIFIED - Double Token)
- StaffController.php (MODIFIED - geographic scope)
- StoreController.php (MODIFIED - area_id support)
- TaskController.php (MODIFIED - pagination fix)
```

#### C. Models (NEW - 2 files)
```
LOCAL: backend/laravel/app/Models/
SERVER: public_html/laravel/app/Models/

Files:
- RefreshToken.php (NEW)
- Zone.php (NEW)
```

#### D. Models (MODIFIED - 2 files)
```
- Area.php (MODIFIED)
- Region.php (MODIFIED)
```

#### E. Services (NEW - 1 file)
```
LOCAL: backend/laravel/app/Services/
SERVER: public_html/laravel/app/Services/

Files:
- TokenService.php (NEW)
```

#### F. Exceptions (NEW - 2 files)
```
LOCAL: backend/laravel/app/Exceptions/
SERVER: public_html/laravel/app/Exceptions/

Files:
- InvalidRefreshTokenException.php (NEW)
- TokenReuseException.php (NEW)
```

#### G. Routes (MODIFIED - 1 file)
```
LOCAL: backend/laravel/routes/api.php
SERVER: public_html/laravel/routes/api.php
```

### Upload Commands (tóm tắt):
```
# Folder structure to upload:
backend/laravel/app/Http/Controllers/Api/V1/ → public_html/laravel/app/Http/Controllers/Api/V1/
backend/laravel/app/Models/ → public_html/laravel/app/Models/
backend/laravel/app/Services/ → public_html/laravel/app/Services/
backend/laravel/app/Exceptions/ → public_html/laravel/app/Exceptions/
backend/laravel/routes/api.php → public_html/laravel/routes/api.php
```

### ⚠️ QUAN TRỌNG - KHÔNG UPLOAD:
- `.env` file (sẽ ghi đè production config!)
- `storage/` folder
- `vendor/` folder (trừ khi có package mới)

### Post-upload verification:
1. Test API: `https://auraorientalis.vn/api/api/v1/departments`
2. Test Auth: Login từ frontend
3. Test Scope: Add Task → C. Scope dropdown

---

## 3. FRONTEND DEPLOYMENT (Vercel)

### Quy trình:
1. Vào https://vercel.com/dashboard
2. Chọn project: **aoisora**
3. Tab "Deployments"
4. Click deployment có tag "Current"
5. Click "..." (3 chấm) → **"Redeploy"**
6. Chọn "Use existing Build Cache" = OFF (để build fresh)
7. Click "Redeploy"

### Verify sau deploy:
1. Truy cập https://aoisora.auraorientalis.vn
2. Login với `admin` / `password`
3. Test các tính năng mới:
   - Add Task → C. Scope (4-level hierarchy)
   - Task List pagination
   - Token refresh (logout/login lại)

---

## 4. POST-DEPLOY VERIFICATION

### Checklist:
- [ ] Database: `SELECT COUNT(*) FROM zones` → 6
- [ ] Database: `SELECT COUNT(*) FROM areas` → 15
- [ ] Database: `SELECT COUNT(*) FROM refresh_tokens` → 0 (initial)
- [ ] API: `/api/v1/departments` returns data
- [ ] API: `/api/v1/scope/regions` returns 3 regions
- [ ] API: `/api/v1/scope/zones?region_id=1` returns 2 zones
- [ ] Frontend: Login works
- [ ] Frontend: Add Task → Scope dropdown works
- [ ] Frontend: Task List loads correctly

---

## 5. ROLLBACK PLAN

### Nếu có lỗi nghiêm trọng:

**Database:**
```sql
-- Restore từ backup hoặc chạy rollback script ở trên
```

**Backend:**
- Download backup từ server trước khi upload
- Re-upload các file cũ

**Frontend:**
- Vercel Dashboard → Deployments → Chọn deployment cũ → "Promote to Production"

---

## Files Summary

| Type | Count | Location |
|------|-------|----------|
| SQL Migration | 1 | `deploy/migration_v0.2.0.sql` |
| SQL Full Reset | 1 | `deploy/full_reset.sql` (v0.2.0) |
| Backend NEW | 8 | Controllers, Models, Services, Exceptions |
| Backend MODIFIED | 7 | Controllers, Models, Routes |
| Frontend | Auto | Vercel handles build |

---

## 6. FULL DATABASE RESET (Demo Environment)

> **Sử dụng khi cần reset toàn bộ database về trạng thái ban đầu**

### File:
```
deploy/full_reset.sql
```

### Nội dung bao gồm:
| Category | Count |
|----------|-------|
| Regions | 3 |
| Zones | 6 |
| Areas | 15 |
| Stores | 13 |
| Staff | 23 |
| Departments | 5 |
| Tasks | 90 (đủ các status) |

### Task Status Distribution:
- Draft: 10
- Approve: 8
- Not Yet: 22
- On Progress: 25
- Done: 15
- Overdue: 10

### Quy trình import (Local):
```bash
"D:\devtool\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe" -uroot -e "DROP DATABASE IF EXISTS auraorie68aa_aoisora; CREATE DATABASE auraorie68aa_aoisora CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
"D:\devtool\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe" -uroot auraorie68aa_aoisora < deploy/full_reset.sql
```

### Quy trình import (Production - phpMyAdmin):
1. Vào DirectAdmin → MySQL → phpMyAdmin
2. Chọn database `auraorie68aa_aoisora`
3. **Tab "Operations" → "Drop the database"** (xóa sạch)
4. Tạo lại database cùng tên
5. Tab "Import" → Chọn file `full_reset.sql`
6. Click "Go"
7. Verify output cuối file

---

## Notes

- **Test account**: `admin` / `password`
- **Double Token**: Access token 15min, Refresh token 7 days
- **Geographic Hierarchy**: Region → Zone → Area → Store
- Nếu gặp lỗi 500, kiểm tra `.env` trên server (xem CLAUDE.md)
- **Để reset demo**: Dùng `deploy/full_reset.sql` (không dùng `migration_v0.2.0.sql`)
