# ✅ SẴN SÀNG TEST - IDLE TIMEOUT WARNING

> **Status**: ✅ Code đã commit & push
> **Commits**:
> - `e33ca76` - feat(auth): implement idle timeout warning
> - `7d37bcb` - docs(test): add test guides and helper script

---

## 📦 NHỮNG GÌ ĐÃ HOÀN THÀNH

### ✅ Frontend Implementation

| File | Mô tả |
|------|-------|
| [ActivityTracker.ts](frontend/src/services/ActivityTracker.ts) | Service track user activities |
| [IdleTimerContext.tsx](frontend/src/contexts/IdleTimerContext.tsx) | Context quản lý idle state |
| [SessionWarningModal.tsx](frontend/src/components/SessionWarningModal.tsx) | Modal component |
| [SessionWarningWrapper.tsx](frontend/src/components/SessionWarningWrapper.tsx) | Integration wrapper |
| [session.ts](frontend/src/config/session.ts) | Session config |
| [layout.tsx](frontend/src/app/layout.tsx) | Updated để add providers |

### ✅ Backend Implementation

| File | Mô tả |
|------|-------|
| [AuthController.php:138-163](backend/laravel/app/Http/Controllers/Api/V1/AuthController.php) | Method `refresh()` |
| [api.php:93](backend/laravel/routes/api.php) | Route `POST /auth/refresh` |

### ✅ Documentation

| File | Mô tả |
|------|-------|
| [authentication-detail.md](docs/specs/_shared/authentication-detail.md) | Spec đầy đủ (Section 10: Idle Timeout Warning) |
| [authentication-basic.md](docs/specs/_shared/authentication-basic.md) | Updated status |
| [IDLE_TIMEOUT_TEST.md](IDLE_TIMEOUT_TEST.md) | Test documentation |

### ✅ Test Guides (MỚI)

| File | Mô tả |
|------|-------|
| [QUICK_TEST_GUIDE.md](QUICK_TEST_GUIDE.md) | ⚡ Quick 5-min setup + 15-min test |
| [TEST_SCENARIO_IDLE_TIMEOUT.md](TEST_SCENARIO_IDLE_TIMEOUT.md) | 📋 Chi tiết 9 test cases |
| [start-test-servers.bat](start-test-servers.bat) | 🚀 Script khởi động servers |

---

## 🎯 CÁCH BẮT ĐẦU TEST

### Option 1: Quick Test (Khuyến nghị - 20 phút)

1. **Đọc hướng dẫn nhanh**:
   ```
   Mở file: QUICK_TEST_GUIDE.md
   ```

2. **Sửa config test** (dòng 9-10 trong `frontend/src/config/session.ts`):
   ```typescript
   SESSION_TIMEOUT: 120000,  // 2 minutes
   WARNING_TIME: 30000,      // 30 seconds
   ```

3. **Khởi động servers**:
   ```bash
   # Double-click file này:
   start-test-servers.bat
   ```

4. **Test 5 scenarios cơ bản** theo QUICK_TEST_GUIDE.md

---

### Option 2: Full Test (Chi tiết - 45 phút)

1. **Đọc test scenarios đầy đủ**:
   ```
   Mở file: TEST_SCENARIO_IDLE_TIMEOUT.md
   ```

2. **Làm theo từng bước** trong 9 test cases

3. **Ghi kết quả** vào bảng trong file

---

## 🔧 HIỆN TẠI CẦN LÀM

### Bước 1: Sửa Config để Test Nhanh ⚠️

**File cần sửa**: `frontend/src/config/session.ts`

**Tìm dòng 9-10**:
```typescript
SESSION_TIMEOUT: parseInt(
  process.env.NEXT_PUBLIC_SESSION_TIMEOUT || '7200000',
  10
),
WARNING_TIME: parseInt(
  process.env.NEXT_PUBLIC_WARNING_TIME || '300000',
  10
),
```

**Sửa thành**:
```typescript
SESSION_TIMEOUT: 120000,  // 2 minutes (test mode) - PRODUCTION: 7200000
WARNING_TIME: 30000,      // 30 seconds (test mode) - PRODUCTION: 300000
```

**Hoặc đơn giản hơn, thay dòng 10 và 14**:
```typescript
// Dòng 10: Thay '7200000' → '120000'
process.env.NEXT_PUBLIC_SESSION_TIMEOUT || '120000',

// Dòng 14: Thay '300000' → '30000'
process.env.NEXT_PUBLIC_WARNING_TIME || '30000',
```

**SAVE FILE!**

---

### Bước 2: Khởi động Servers

#### Option A: Dùng Script (Dễ nhất)

Double-click file này:
```
start-test-servers.bat
```

#### Option B: Manual

**Terminal 1 - Backend**:
```bash
cd "d:\Project\Aura Web\backend\api"
D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe -S localhost:8000
```

**Terminal 2 - Frontend**:
```bash
cd "d:\Project\Aura Web\frontend"
npm run dev
```

---

### Bước 3: Bắt đầu Test

Mở trình duyệt: **http://localhost:3000**

Login credentials:
- **Username**: `admin`
- **Password**: `password`

Làm theo **QUICK_TEST_GUIDE.md** hoặc **TEST_SCENARIO_IDLE_TIMEOUT.md**

---

## 📋 CHECKLIST TRƯỚC KHI TEST

- [ ] ✅ Code đã commit & push (Đã xong!)
- [ ] Đã sửa config `session.ts` về test mode (120000, 30000)
- [ ] Backend server chạy OK (http://localhost:8000)
- [ ] Frontend server chạy OK (http://localhost:3000)
- [ ] Đã đọc QUICK_TEST_GUIDE.md hoặc TEST_SCENARIO_IDLE_TIMEOUT.md

---

## ⏱️ TIMELINE DỰ KIẾN

| Hoạt động | Thời gian |
|-----------|-----------|
| Sửa config | 2 phút |
| Khởi động servers | 3 phút |
| Quick Test (5 scenarios) | 15 phút |
| **Tổng** | **~20 phút** |

Hoặc:

| Hoạt động | Thời gian |
|-----------|-----------|
| Setup | 5 phút |
| Full Test (9 test cases) | 40 phút |
| **Tổng** | **~45 phút** |

---

## 🎬 KỊCH BẢN TEST NHANH NHẤT (15 phút)

### 1. Setup (5 phút)
✅ Sửa config → Khởi động servers

### 2. Test Core Flow (10 phút)

**Test 1** (3 phút):
- Login → Idle 1.5 phút → ✅ Modal xuất hiện

**Test 2** (2 phút):
- Click "Stay Logged In" → ✅ Modal đóng

**Test 3** (3 phút):
- Idle 1.5 phút → Modal xuất hiện → Di chuột → ✅ Modal đóng

**Test 4** (2 phút):
- Idle 1.5 phút → Click "Log Out" → ✅ Logout

**DONE!** 4 tests = Core functionality verified ✅

---

## 🐛 NẾU GẶP VẤN ĐỀ

### Vấn đề 1: Modal không xuất hiện

**Kiểm tra**:
```javascript
// DevTools Console (F12)
// Check có error không?
```

**Fix**:
1. Restart frontend server (Ctrl+C, chạy lại)
2. Hard refresh browser (Ctrl+Shift+R)
3. Check config đã sửa đúng chưa

---

### Vấn đề 2: Backend API lỗi

**Kiểm tra**:
```
Terminal backend có error không?
```

**Fix**:
1. Restart backend server
2. Test API trực tiếp:
   ```bash
   curl http://localhost:8000/api/v1/auth/login
   ```

---

### Vấn đề 3: Không biết test gì

**Giải pháp**:
- Đọc file **QUICK_TEST_GUIDE.md** - Hướng dẫn từng bước rất chi tiết!

---

## ⚠️ QUAN TRỌNG SAU KHI TEST

### ĐỔI CONFIG VỀ PRODUCTION!

**File**: `frontend/src/config/session.ts`

**Đổi lại**:
```typescript
// Dòng 10: '120000' → '7200000'
// Dòng 14: '30000' → '300000'
```

**Commit:**
```bash
git add frontend/src/config/session.ts
git commit -m "chore(config): restore session timeout to production values"
git push
```

---

## 📞 HỖ TRỢ & TÀI LIỆU

| Tình huống | Xem file |
|------------|----------|
| Muốn test nhanh | [QUICK_TEST_GUIDE.md](QUICK_TEST_GUIDE.md) |
| Muốn test đầy đủ | [TEST_SCENARIO_IDLE_TIMEOUT.md](TEST_SCENARIO_IDLE_TIMEOUT.md) |
| Hiểu feature hoạt động thế nào | [IDLE_TIMEOUT_TEST.md](IDLE_TIMEOUT_TEST.md) |
| Đọc spec kỹ thuật | [authentication-detail.md](docs/specs/_shared/authentication-detail.md) (Section 10) |

---

## ✅ SẴN SÀNG!

**Mọi thứ đã ready để test. Chúc may mắn!** 🚀

**Bắt đầu từ**: [QUICK_TEST_GUIDE.md](QUICK_TEST_GUIDE.md)
