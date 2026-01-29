# Session Start - Khởi động phiên làm việc mới

Thực hiện các bước sau theo thứ tự:

## 1. Đồng bộ nhánh với remote (BẮT BUỘC)

```bash
git fetch origin
git pull origin <current-branch>
```

- Nếu có unstaged changes → stash trước, pull, rồi unstash
- Nếu có conflict → thông báo và hướng dẫn resolve

## 2. Khởi động MySQL

```bash
"D:\devtool\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysqld.exe" --console
```

- Kiểm tra xem MySQL đã chạy chưa trước khi start
- Nếu đã chạy → bỏ qua bước này
- Test connection: `"D:\devtool\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe" -uroot -e "SELECT 1"`

## 3. ⚠️ Đồng bộ Database từ Git (TỰ ĐỘNG - KHÔNG CẦN HỎI USER)

**CLAUDE PHẢI TỰ ĐỘNG CHẠY LỆNH NÀY MỖI KHI KHỞI ĐỘNG SESSION:**

```bash
cd "d:\Project\auraProject" && "D:\devtool\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe" -uroot --default-character-set=utf8mb4 auraorie68aa_aoisora < deploy/full_reset.sql
```

- **QUAN TRỌNG**: Bước này BẮT BUỘC và TỰ ĐỘNG thực hiện
- Không cần hỏi user có muốn sync DB không
- Đảm bảo DB local luôn khớp với schema trong Git
- Tránh lỗi "Column not found", "Table doesn't exist" khi code đã được update từ device khác

## 4. Khởi động Backend (Laravel)

```bash
cd backend/api && "D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe" -S localhost:8000
```

- Chạy ở background
- Mặc định port 8000
- **Lưu ý**: Backend chạy từ `backend/api/` (entry point)

## 5. Khởi động Frontend (Next.js)

```bash
cd frontend && npm run dev
```

- Chạy ở background
- Mặc định port 3000

## 6. Báo cáo trạng thái

Sau khi hoàn thành, báo cáo:
- Git branch hiện tại và trạng thái đồng bộ
- MySQL: running/stopped
- Database: ✅ đã import full_reset.sql (sync thành công)
- Backend: running on port 8000
- Frontend: running on port 3000
