# Troubleshooting: Frontend không kết nối được Backend

## 🔍 Các lỗi thường gặp

### 1. CORS Error (Phổ biến nhất)

**Triệu chứng:**
- Browser Console hiện lỗi: `blocked by CORS policy`
- Frontend không gọi được API

**Nguyên nhân:**
- Backend chưa cho phép Frontend domain trong ALLOWED_ORIGINS

**Fix:**

#### Bước 1: Kiểm tra Frontend URL
```
Netlify URL: https://luminous-swan-eb543e.netlify.app
```

#### Bước 2: Update ALLOWED_ORIGINS trong Render

1. **Render Dashboard** → Backend service
2. **Environment** tab
3. Update biến:
```
ALLOWED_ORIGINS=https://luminous-swan-eb543e.netlify.app
```

⚠️ **Lưu ý:**
- KHÔNG có dấu `/` cuối
- KHÔNG có space
- Phải là HTTPS (không phải HTTP)

4. **Save** → Backend auto redeploy (chờ 5-10 phút)

#### Bước 3: Verify Backend đã update

Test backend CORS:
```bash
curl -I https://YOUR-RENDER-URL.onrender.com/health \
  -H "Origin: https://luminous-swan-eb543e.netlify.app"
```

**Kết quả mong đợi:**
```
access-control-allow-origin: https://luminous-swan-eb543e.netlify.app
```

---

### 2. API URL sai trong Frontend

**Triệu chứng:**
- Console hiện: `404 Not Found`
- Hoặc request đến URL sai

**Fix:**

#### Bước 1: Lấy Backend URL

**Render Dashboard** → Backend service → Copy URL
```
VD: https://optichain-backend-abc123.onrender.com
```

#### Bước 2: Update Netlify Environment Variables

1. **Netlify Dashboard** → Site settings
2. **Environment variables** → **Add a variable**
3. Thêm:
```
Key:   NEXT_PUBLIC_API_URL
Value: https://optichain-backend-abc123.onrender.com/api/v1
```

⚠️ **Lưu ý:** Phải có `/api/v1` ở cuối!

4. **Save** → **Trigger redeploy**

#### Bước 3: Verify Frontend config

Sau khi redeploy, check trong browser console:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
// Should show: https://xxx.onrender.com/api/v1
```

---

### 3. Backend đang Sleep (Render Free Tier)

**Triệu chứng:**
- Request pending rất lâu (30-60 giây)
- Sau đó mới response

**Nguyên nhân:**
- Render free tier sleep sau 15 phút không hoạt động
- Cần 30-60 giây để wake up

**Fix:**

#### Option 1: Chờ wake up (Recommended)

- Lần đầu mở trang: Chờ 30-60 giây
- Lần sau sẽ nhanh hơn (trong 15 phút)

#### Option 2: Ping backend định kỳ (Prevent sleep)

Dùng **UptimeRobot** (miễn phí):

1. **Sign up**: https://uptimerobot.com
2. **Add New Monitor**:
```
Monitor Type: HTTP(s)
Friendly Name: OptiChain Backend
URL: https://YOUR-RENDER-URL.onrender.com/health
Monitoring Interval: Every 5 minutes
```
3. **Create Monitor**

Backend sẽ được ping mỗi 5 phút → Không bao giờ sleep!

#### Option 3: Frontend loading state

Thêm loading indicator trong frontend khi backend đang wake up:

```typescript
// frontend/src/utils/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAPI(endpoint: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Backend is waking up, please wait...');
    }
    throw error;
  }
}
```

---

### 4. SECRET_KEY sai hoặc thiếu

**Triệu chứng:**
- Login thành công nhưng JWT token không valid
- API trả về 401 Unauthorized

**Fix:**

SECRET_KEY **CHỈ CẦN** ở Backend, KHÔNG cần ở Frontend.

#### Verify SECRET_KEY trong Render:

1. **Render Dashboard** → Backend → **Environment**
2. Check biến `SECRET_KEY` có tồn tại không
3. Nếu chưa có, thêm:
```
SECRET_KEY=vZR9X7KpQ_M8NnYyH2JqLw5TFx3Bc4Ga1Sd6Vh0Ui9E
```

⚠️ **Generate SECRET_KEY mới** (secure hơn):
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

### 5. Database connection error

**Triệu chứng:**
- Backend logs hiện: `could not connect to database`
- 500 Internal Server Error

**Fix:**

#### Bước 1: Verify DATABASE_URL

**Render Dashboard** → Backend → **Environment**

Check biến `DATABASE_URL`:
```
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

#### Bước 2: Test connection từ Render logs

**Render Dashboard** → Backend → **Logs**

Tìm dòng:
```
INFO:     Application startup complete.
```

Nếu có lỗi connection → DATABASE_URL sai.

#### Bước 3: Get correct DATABASE_URL từ Neon

1. **Neon Dashboard**: https://console.neon.tech
2. **Project** → **Connection Details**
3. Copy **Connection string**
4. Paste vào Render `DATABASE_URL`
5. Redeploy

---

## 🎯 Quick Debug Checklist

Copy checklist này và tick từng bước:

```
Frontend (Netlify):
- [ ] Site đã deploy thành công
- [ ] Environment variable NEXT_PUBLIC_API_URL đã set
- [ ] NEXT_PUBLIC_API_URL có /api/v1 ở cuối
- [ ] Redeploy sau khi thêm env var
- [ ] Browser cache đã clear (Ctrl+Shift+R)

Backend (Render):
- [ ] Service đã deploy thành công
- [ ] Environment variable ALLOWED_ORIGINS đã set
- [ ] ALLOWED_ORIGINS = Netlify URL (no trailing slash)
- [ ] Environment variable DATABASE_URL đã set
- [ ] Environment variable SECRET_KEY đã set
- [ ] Logs không có error
- [ ] Test endpoint /health returns 200 OK

Connection Test:
- [ ] Mở https://YOUR-RENDER-URL.onrender.com/health
- [ ] Response: {"status":"healthy"}
- [ ] Mở https://luminous-swan-eb543e.netlify.app
- [ ] F12 Console: Không có CORS error
- [ ] Network tab: Requests to backend thành công
```

---

## 🔧 Advanced Debug: Test Backend Manually

### Test 1: Health Check

```bash
curl https://YOUR-RENDER-URL.onrender.com/health
```

**Expected:**
```json
{"status":"healthy"}
```

### Test 2: CORS Headers

```bash
curl -I https://YOUR-RENDER-URL.onrender.com/health \
  -H "Origin: https://luminous-swan-eb543e.netlify.app"
```

**Expected headers:**
```
access-control-allow-origin: https://luminous-swan-eb543e.netlify.app
access-control-allow-credentials: true
```

### Test 3: API Endpoint

```bash
# Test login endpoint (should return 422 without body, or 401 if implemented)
curl -X POST https://YOUR-RENDER-URL.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json"
```

---

## 📱 Test từ Browser Console

Mở Frontend URL → F12 → Console → Run:

```javascript
// Test 1: Check API URL config
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

// Test 2: Test fetch to backend
fetch(process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '') + '/health')
  .then(r => r.json())
  .then(data => console.log('Backend health:', data))
  .catch(err => console.error('Backend error:', err));

// Test 3: Check CORS
fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'test', password: 'test' })
})
.then(r => console.log('CORS OK, Status:', r.status))
.catch(err => console.error('CORS Error:', err));
```

---

## 💡 Common Mistakes

### ❌ WRONG:

```bash
# Có dấu / cuối
ALLOWED_ORIGINS=https://luminous-swan-eb543e.netlify.app/

# Thiếu /api/v1
NEXT_PUBLIC_API_URL=https://xxx.onrender.com

# HTTP thay vì HTTPS
ALLOWED_ORIGINS=http://luminous-swan-eb543e.netlify.app

# Space trong value
ALLOWED_ORIGINS=https://luminous-swan-eb543e.netlify.app, https://other.com
```

### ✅ CORRECT:

```bash
# Render Backend
ALLOWED_ORIGINS=https://luminous-swan-eb543e.netlify.app
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
SECRET_KEY=vZR9X7KpQ_M8NnYyH2JqLw5TFx3Bc4Ga1Sd6Vh0Ui9E
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
PORT=8080

# Netlify Frontend
NEXT_PUBLIC_API_URL=https://xxx.onrender.com/api/v1
```

---

## 📞 Still Not Working?

Nếu sau khi làm hết các bước trên vẫn lỗi:

1. **Screenshot** browser console errors
2. **Screenshot** Render logs
3. **Share**:
   - Netlify URL
   - Render Backend URL
   - Environment variables (ẩn sensitive data)

→ Tôi sẽ debug chi tiết hơn!

---

**Last updated**: 2025-12-26
**For**: Render + Netlify + Neon deployment
