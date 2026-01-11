# 🧪 KỊCH BẢN TEST THỦ CÔNG - IDLE TIMEOUT WARNING

> **Ngày tạo**: 2026-01-11
> **Feature**: Idle Timeout Warning với Session Extension
> **Thời gian test ước tính**: 30-45 phút

---

## 📋 CHUẨN BỊ TRƯỚC KHI TEST

### Bước 1: Sửa Config để Test Nhanh

**⏰ Thay vì đợi 115 phút, ta sẽ test với 1.5 phút**

1. **Mở file**: `frontend/src/config/session.ts`

2. **Tìm và sửa** (dòng 9-19):

```typescript
export const SESSION_CONFIG = {
  // TEMPORARY FOR TESTING - Change back to production values after testing
  SESSION_TIMEOUT: 120000,  // 2 minutes (120 seconds) - PRODUCTION: 7200000
  WARNING_TIME: 30000,      // 30 seconds - PRODUCTION: 300000

  CHECK_INTERVAL: 1000,
  ACTIVITY_THROTTLE: 1000,
  TRACKED_EVENTS: [
    'mousemove',
    'click',
    'keydown',
    'scroll',
    'touchstart',
    'touchmove',
  ],
};
```

3. **Save file**

---

### Bước 2: Khởi động Servers

#### Terminal 1 - Backend Server

```bash
cd "d:\Project\Aura Web\backend\api"
D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe -S localhost:8000
```

**Expected Output:**
```
PHP 8.3.28 Development Server (http://localhost:8000) started
```

#### Terminal 2 - Frontend Server

```bash
cd "d:\Project\Aura Web\frontend"
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in Xs
```

---

## 🎬 TEST SCENARIOS

---

### ✅ TC-01: Warning Modal xuất hiện sau idle time

**Mục tiêu**: Verify modal xuất hiện đúng thời điểm

| Bước | Hành động | Kết quả mong đợi | ✓/✗ |
|------|-----------|------------------|-----|
| 1 | Mở trình duyệt http://localhost:3000 | Trang Sign In hiển thị |  |
| 2 | Sign in với:<br>- Email: `admin`<br>- Password: `password` | Login thành công, redirect về `/` |  |
| 3 | Quan sát thời gian, **ĐỪNG** di chuột, đừng click | - |  |
| 4 | Đợi **1 phút 30 giây** (90s) | Modal "Session Warning" xuất hiện |  |
| 5 | Kiểm tra nội dung modal | - Icon ⚠️ màu cam<br>- Title: "Session Warning"<br>- Text: "Your session is about to expire..."<br>- Timer hiển thị: "0:30" |  |
| 6 | Quan sát timer | Timer đếm ngược: 0:30 → 0:29 → 0:28... |  |
| 7 | Quan sát màu timer | - 0:30-0:03 (>3s): Màu xanh lá<br>- 0:02-0:01: Màu đỏ |  |

**Ghi chú thêm**: _________________________

---

### ✅ TC-02: "Stay Logged In" button hoạt động

**Mục tiêu**: Verify extend session và reset timer

| Bước | Hành động | Kết quả mong đợi | ✓/✗ |
|------|-----------|------------------|-----|
| 1 | Tiếp tục từ TC-01, modal đang hiển thị | - |  |
| 2 | Click button **"Stay Logged In"** (màu xanh) | - Modal đóng ngay lập tức<br>- Không có lỗi |  |
| 3 | Mở **DevTools** (F12) → Tab **Console** | Kiểm tra log: "Session extended successfully" |  |
| 4 | Kiểm tra Network tab (F12) | - Request POST `/api/v1/auth/refresh`<br>- Status: 200 OK<br>- Response: `{success: true, ...}` |  |
| 5 | **Đừng** di chuột, đừng click | - |  |
| 6 | Đợi **1 phút 30 giây** nữa | Modal xuất hiện lại (timer đã reset thành công!) |  |

**Ghi chú thêm**: _________________________

---

### ✅ TC-03: "Log Out" button hoạt động

**Mục tiêu**: Verify logout ngay lập tức

| Bước | Hành động | Kết quả mong đợi | ✓/✗ |
|------|-----------|------------------|-----|
| 1 | Tiếp tục từ TC-02, modal đang hiển thị lần 2 | - |  |
| 2 | Click button **"Log Out"** (màu xám) | - Logout ngay lập tức<br>- Redirect về `/auth/signin` |  |
| 3 | Kiểm tra localStorage (DevTools → Application → Local Storage) | Tất cả keys bị xóa:<br>- `optichain_token`<br>- `optichain_auth`<br>- `last_activity_time` |  |

**Ghi chú thêm**: _________________________

---

### ✅ TC-04: Auto-logout sau khi countdown hết

**Mục tiêu**: Verify auto-logout khi không có interaction

| Bước | Hành động | Kết quả mong đợi | ✓/✗ |
|------|-----------|------------------|-----|
| 1 | Sign in lại | Login thành công |  |
| 2 | Đợi **1 phút 30 giây** | Modal xuất hiện |  |
| 3 | **ĐỪNG** click gì cả, để timer chạy hết | - |  |
| 4 | Quan sát timer đếm: 0:30 → ... → 0:01 → 0:00 | Khi về 0:00, auto-logout |  |
| 5 | Kiểm tra URL | Redirect về `/auth/signin?reason=session_expired` |  |
| 6 | Kiểm tra message (nếu có) | Hiển thị: "Session expired. Please sign in again." |  |

**Ghi chú thêm**: _________________________

---

### ✅ TC-05: Activity trong warning period đóng modal

**Mục tiêu**: Verify user activity reset timer

| Bước | Hành động | Kết quả mong đợi | ✓/✗ |
|------|-----------|------------------|-----|
| 1 | Sign in lại | Login thành công |  |
| 2 | Đợi **1 phút 30 giây** | Modal xuất hiện |  |
| 3 | **Di chuyển chuột** (không cần click) | Modal đóng ngay lập tức |  |
| 4 | Đợi **1 phút 30 giây** nữa | Modal xuất hiện lại (timer đã reset) |  |
| 5 | Lần này **nhấn phím bất kỳ** (ví dụ Space) | Modal đóng ngay lập tức |  |
| 6 | Đợi **1 phút 30 giây** nữa | Modal xuất hiện lại |  |
| 7 | Lần này **scroll trang** | Modal đóng ngay lập tức |  |

**Ghi chú thêm**: _________________________

---

### ✅ TC-06: Multi-tab synchronization (Nâng cao)

**Mục tiêu**: Verify đồng bộ giữa các tab

| Bước | Hành động | Kết quả mong đợi | ✓/✗ |
|------|-----------|------------------|-----|
| 1 | **Tab 1**: Sign in | Login thành công |  |
| 2 | **Mở Tab 2**: `http://localhost:3000` cùng trình duyệt | Auto sign in (dùng token của Tab 1) |  |
| 3 | **Cả 2 tabs**: Đừng di chuột | - |  |
| 4 | Đợi **1 phút 30 giây** | **CẢ 2 TABS** đều hiển thị modal cùng lúc |  |
| 5 | **Tab 1**: Click "Stay Logged In" | - Tab 1: Modal đóng<br>- Tab 2: Modal cũng đóng (hoặc sau vài giây) |  |
| 6 | Đợi **1 phút 30 giây** | Cả 2 tabs đều hiển thị modal lại |  |
| 7 | **Tab 2**: Di chuyển chuột | Cả 2 tabs đều đóng modal |  |

**Ghi chú thêm**: _________________________

---

### ✅ TC-07: Backend API validation

**Mục tiêu**: Test trực tiếp API endpoint

| Bước | Hành động | Kết quả mong đợi | ✓/✗ |
|------|-----------|------------------|-----|
| 1 | Sign in để lấy token | Lưu `access_token` từ response |  |
| 2 | Mở **Postman** hoặc **curl** | - |  |
| 3 | Test API refresh:<br><br>**Method**: POST<br>**URL**: `http://localhost:8000/api/v1/auth/refresh`<br>**Headers**:<br>- `Authorization: Bearer {token}`<br>- `Accept: application/json` | **Response 200**:<br>```json<br>{<br>  "success": true,<br>  "message": "Session extended...",<br>  "expires_at": "2026-01-11T..."<br>}<br>``` |  |
| 4 | Test với **invalid token**:<br>- Sửa token thành `invalid_token_123` | **Response 401**:<br>```json<br>{<br>  "message": "Unauthenticated."<br>}<br>``` |  |

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

**Ghi chú thêm**: _________________________

---

### ✅ TC-08: Modal UI/UX kiểm tra

**Mục tiêu**: Verify giao diện đúng design spec

| Bước | Hành động | Kết quả mong đợi | ✓/✗ |
|------|-----------|------------------|-----|
| 1 | Trigger modal (idle 1.5 phút) | Modal xuất hiện |  |
| 2 | Kiểm tra **Backdrop** | - Màu đen mờ (semi-transparent)<br>- Click backdrop → Modal đóng |  |
| 3 | Kiểm tra **Modal container** | - Background trắng (dark mode: xám)<br>- Bo góc mềm mại<br>- Shadow rõ ràng<br>- Centered |  |
| 4 | Kiểm tra **Warning icon** | - Icon ⚠️ hoặc SVG warning<br>- Màu cam (#F59E0B)<br>- Size lớn, nổi bật |  |
| 5 | Kiểm tra **Typography** | - Title: Font bold, size lớn<br>- Description: Dễ đọc<br>- Timer: Font monospace, size rất lớn |  |
| 6 | Kiểm tra **Buttons** | - "Stay Logged In": Blue, nổi bật<br>- "Log Out": Gray, secondary<br>- Hover effect hoạt động |  |
| 7 | Kiểm tra **Animation** | - Modal fade in smooth<br>- Gentle shake khi xuất hiện<br>- Timer update không jump |  |

**Ghi chú thêm**: _________________________

---

### ✅ TC-09: Dark Mode compatibility

**Mục tiêu**: Verify modal hoạt động với dark mode

| Bước | Hành động | Kết quả mong đợi | ✓/✗ |
|------|-----------|------------------|-----|
| 1 | Sign in ở Light Mode | Modal hiển thị đúng (background trắng) |  |
| 2 | Chuyển sang **Dark Mode** | - |  |
| 3 | Trigger modal | - Modal background: Xám đậm<br>- Text màu trắng/xám nhạt<br>- Vẫn dễ đọc |  |

**Ghi chú thêm**: _________________________

---

## 📊 KẾT QUẢ TỔNG HỢP

| Test Case | Status | Ghi chú |
|-----------|--------|---------|
| TC-01: Warning xuất hiện |  |  |
| TC-02: Stay Logged In |  |  |
| TC-03: Log Out |  |  |
| TC-04: Auto-logout |  |  |
| TC-05: Activity reset |  |  |
| TC-06: Multi-tab sync |  |  |
| TC-07: Backend API |  |  |
| TC-08: Modal UI/UX |  |  |
| TC-09: Dark mode |  |  |

**Legend**: ✅ Pass | ❌ Fail | ⚠️ Partial | ⏸️ Skipped

---

## 🐛 BUG LOG

Nếu phát hiện bug, ghi vào đây:

| Bug ID | Test Case | Mô tả | Severity | Status |
|--------|-----------|-------|----------|--------|
| BUG-01 |  |  |  |  |
| BUG-02 |  |  |  |  |

---

## ⚠️ SAU KHI TEST XONG - QUAN TRỌNG!

### Đổi config về Production

**File**: `frontend/src/config/session.ts`

```typescript
export const SESSION_CONFIG = {
  SESSION_TIMEOUT: 7200000,  // 120 minutes (PRODUCTION)
  WARNING_TIME: 300000,      // 5 minutes (PRODUCTION)
  // ...
};
```

**Commit message:**
```
chore(config): restore session timeout to production values

- SESSION_TIMEOUT: 120000 → 7200000 (120 minutes)
- WARNING_TIME: 30000 → 300000 (5 minutes)
```

---

## 📝 NOTES & OBSERVATIONS

**Performance:**
- CPU usage khi idle: _________
- Memory usage: _________
- Network requests: _________

**User Experience:**
- Modal có gây khó chịu không? _________
- Timer color transition rõ ràng? _________
- Buttons dễ nhìn/dễ click? _________

**Suggestions:**
- _________________________________
- _________________________________
- _________________________________

---

## ✅ SIGN-OFF

**Tester**: _________________________
**Date**: _________________________
**Overall Result**: ⬜ PASS | ⬜ FAIL
**Ready for Production**: ⬜ YES | ⬜ NO

**Comments**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
