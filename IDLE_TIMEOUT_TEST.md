# Idle Timeout Warning - Test Guide

## 🧪 Testing Instructions

### Quick Test (Development Mode)

Để test nhanh mà không cần đợi 115 phút, bạn có thể tạm thời sửa config:

1. **Mở file** `frontend/src/config/session.ts`

2. **Sửa SESSION_TIMEOUT và WARNING_TIME:**

```typescript
export const SESSION_CONFIG = {
  // For testing: 2 minutes timeout, warning at 1.5 minutes
  SESSION_TIMEOUT: 120000,  // 2 minutes (thay vì 7200000)
  WARNING_TIME: 30000,      // 30 seconds (thay vì 300000)

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

3. **Restart dev server**

```bash
cd frontend && npm run dev
```

4. **Test Flow:**
   - Sign in
   - Idle (không click, không move chuột) 1.5 phút
   - Modal sẽ xuất hiện với countdown 30 giây
   - Test "Stay Logged In" button → Modal đóng, timer reset
   - Idle lại 1.5 phút, modal xuất hiện lần nữa
   - Test "Log Out" button → Logout ngay
   - Idle 2 phút full → Auto-logout

---

## 📋 Test Cases

### TC-01: Warning appears after idle time

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Sign in | Đăng nhập thành công |
| 2 | Idle 1.5 phút (test mode) | Modal xuất hiện với countdown 30s |
| 3 | Quan sát countdown | Timer đếm ngược từ 0:30 → 0:00 |
| 4 | Quan sát màu timer | Green → Yellow → Red |

**Status**: ⏳ Pending

---

### TC-02: Stay Logged In button works

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Trigger warning modal | Modal xuất hiện |
| 2 | Click "Stay Logged In" | Modal đóng, session được extend |
| 3 | Check console | Log: "Session extended successfully" |
| 4 | Idle lại 1.5 phút | Modal xuất hiện lại (timer đã reset) |

**Status**: ⏳ Pending

---

### TC-03: Log Out button works

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Trigger warning modal | Modal xuất hiện |
| 2 | Click "Log Out" | Logout ngay lập tức |
| 3 | Check URL | Redirect về `/auth/signin` |

**Status**: ⏳ Pending

---

### TC-04: Auto-logout after countdown

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Trigger warning modal | Modal xuất hiện |
| 2 | Không làm gì, đợi 30s | Timer đếm ngược đến 0:00 |
| 3 | Sau khi hết time | Auto-logout, redirect về signin |
| 4 | Check URL params | `?reason=session_expired` |

**Status**: ⏳ Pending

---

### TC-05: Activity during warning closes modal

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Trigger warning modal | Modal xuất hiện |
| 2 | Move mouse hoặc click | Modal đóng, timer reset |

**Status**: ⏳ Pending

---

### TC-06: Multi-tab sync (Advanced)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở 2 tabs cùng lúc | Cả 2 tabs đều đăng nhập |
| 2 | Idle 1.5 phút | Cả 2 tabs đều hiện modal |
| 3 | Click "Stay" ở Tab 1 | Cả 2 tabs đều đóng modal |
| 4 | Activity ở Tab 2 | Cả 2 tabs reset timer |

**Status**: ⏳ Pending

---

## 🔧 Troubleshooting

### Modal không xuất hiện

**Check:**
1. IdleTimerProvider có wrap đúng không?
   ```tsx
   // frontend/src/app/layout.tsx
   <AuthProvider>
     <IdleTimerProvider>
       {children}
     </IdleTimerProvider>
   </AuthProvider>
   ```

2. SessionWarningWrapper có render không?
   ```tsx
   <SessionWarningWrapper />
   ```

3. Console có log gì không?
   - Mở DevTools → Console
   - Kiểm tra errors

### Backend API /auth/refresh không hoạt động

**Check:**
1. Route đã add chưa?
   ```php
   // backend/laravel/routes/api.php
   Route::post('auth/refresh', [AuthController::class, 'refresh']);
   ```

2. Backend server có chạy không?
   ```bash
   cd backend/api && php -S localhost:8000
   ```

3. Test API bằng curl:
   ```bash
   curl -X POST http://localhost:8000/api/v1/auth/refresh \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/json"
   ```

### Timer không reset sau activity

**Check:**
1. ActivityTracker có start chưa?
2. Console log: `activityTrackerRef.current` có giá trị không?
3. localStorage có key `last_activity_time` không?

---

## 🎯 Production Settings

**SAU KHI TEST XONG**, nhớ đổi lại config về giá trị production:

```typescript
// frontend/src/config/session.ts
export const SESSION_CONFIG = {
  SESSION_TIMEOUT: 7200000,  // 120 minutes
  WARNING_TIME: 300000,      // 5 minutes
  // ...
};
```

---

## 📝 Test Results Log

| Test Case | Date | Tester | Result | Notes |
|-----------|------|--------|--------|-------|
| TC-01 | YYYY-MM-DD | Name | ✅ Pass / ❌ Fail | |
| TC-02 | YYYY-MM-DD | Name | ✅ Pass / ❌ Fail | |
| TC-03 | YYYY-MM-DD | Name | ✅ Pass / ❌ Fail | |
| TC-04 | YYYY-MM-DD | Name | ✅ Pass / ❌ Fail | |
| TC-05 | YYYY-MM-DD | Name | ✅ Pass / ❌ Fail | |
| TC-06 | YYYY-MM-DD | Name | ✅ Pass / ❌ Fail | |

---

## ✅ Checklist trước khi Deploy

- [ ] Test tất cả các TCs pass
- [ ] Config đã đổi về production values
- [ ] Backend API `/auth/refresh` hoạt động trên server
- [ ] Multi-tab sync hoạt động đúng
- [ ] Modal UI hiển thị đúng trên cả desktop và mobile
- [ ] Không có memory leak (test lâu dài)
