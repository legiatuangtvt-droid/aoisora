# ⚡ QUICK TEST GUIDE - Idle Timeout Warning

> **5 phút setup + 15 phút test nhanh**

---

## 🚀 SETUP NHANH (5 phút)

### 1. Sửa Config (QUAN TRỌNG!)

**File**: `frontend/src/config/session.ts`

Tìm dòng 9-10, sửa thành:

```typescript
SESSION_TIMEOUT: 120000,  // 2 minutes (test mode)
WARNING_TIME: 30000,      // 30 seconds (test mode)
```

**Save** file.

---

### 2. Khởi động Servers

**Option A: Dùng script tự động**
```bash
# Double-click file này:
start-test-servers.bat
```

**Option B: Manual (2 terminals)**

Terminal 1 - Backend:
```bash
cd backend/api
D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe -S localhost:8000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

---

## 🧪 TEST NHANH (15 phút)

### Test 1: Modal xuất hiện ✅ (3 phút)

1. Vào http://localhost:3000
2. Login: `admin` / `password`
3. **ĐỪNG DI CHUỘT** - đợi 1 phút 30 giây
4. ✅ Modal xuất hiện với countdown 0:30

---

### Test 2: "Stay Logged In" ✅ (2 phút)

1. Click button **"Stay Logged In"** (xanh dương)
2. ✅ Modal đóng
3. Mở DevTools (F12) → Console
4. ✅ Thấy log: "Session extended successfully"

---

### Test 3: Activity reset timer ✅ (4 phút)

1. Đợi 1 phút 30 giây → Modal xuất hiện
2. **Di chuột** (không cần click)
3. ✅ Modal đóng ngay
4. Đợi 1 phút 30 giây nữa
5. ✅ Modal xuất hiện lại (timer đã reset)

---

### Test 4: "Log Out" ✅ (2 phút)

1. Khi modal hiển thị, click **"Log Out"** (xám)
2. ✅ Logout ngay, redirect về `/auth/signin`

---

### Test 5: Auto-logout ✅ (4 phút)

1. Login lại
2. Đợi 1 phút 30 giây → Modal xuất hiện
3. **ĐỪNG CLICK GÌ** - để countdown chạy hết
4. ✅ Khi timer về 0:00 → Auto-logout

---

## ✅ CHECKLIST

- [ ] Modal xuất hiện sau 1.5 phút idle
- [ ] Timer đếm ngược từ 0:30 → 0:00
- [ ] Màu timer: Green → Red
- [ ] "Stay Logged In" extend session thành công
- [ ] Activity (di chuột, nhấn phím) đóng modal
- [ ] "Log Out" logout ngay lập tức
- [ ] Auto-logout khi countdown hết

---

## 🐛 GẶP VẤN ĐỀ?

### Modal không xuất hiện?

**Check:**
1. DevTools (F12) → Console → Có error không?
2. Config đã sửa đúng chưa? (120000, 30000)
3. Frontend server có reload sau khi sửa config không?

**Fix:** Restart frontend server (Ctrl+C, chạy lại `npm run dev`)

---

### Backend API lỗi?

**Check:**
1. Backend server có chạy không? (http://localhost:8000)
2. Terminal backend có error không?

**Fix:** Restart backend server

---

### Multi-tab không sync?

**Workaround:** Feature này phức tạp, có thể skip trong lần test đầu.

---

## ⚠️ SAU KHI TEST XONG

### QUAN TRỌNG: Đổi config về production!

**File**: `frontend/src/config/session.ts`

```typescript
SESSION_TIMEOUT: 7200000,  // 120 minutes
WARNING_TIME: 300000,      // 5 minutes
```

**Commit:**
```bash
git add frontend/src/config/session.ts
git commit -m "chore(config): restore session timeout to production values"
git push
```

---

## 📊 KẾT QUẢ

**Test Date**: __________

**All Tests Passed?** ⬜ YES | ⬜ NO

**Notes**:
________________________________________
________________________________________

---

## 📞 HỖ TRỢ

Nếu cần help:
1. Check file chi tiết: `TEST_SCENARIO_IDLE_TIMEOUT.md`
2. Check implementation: `IDLE_TIMEOUT_TEST.md`
3. Check spec: `docs/specs/_shared/idle-timeout-warning-detail.md`
