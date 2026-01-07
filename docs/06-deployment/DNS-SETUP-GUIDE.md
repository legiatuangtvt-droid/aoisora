# DNS Setup Guide for Aoisora Web App

Hướng dẫn cấu hình DNS records cho việc deploy web app.

## 1. Cấu trúc Subdomain đề xuất

### Option A: Tách biệt Frontend và Backend (Recommended)

```
yourdomain.com          → Landing page (optional)
app.yourdomain.com      → Frontend (Next.js)
api.yourdomain.com      → Backend (Laravel API + Reverb WebSocket)
```

**Ưu điểm:**
- Dễ scale từng phần riêng
- Có thể dùng server khác nhau cho FE và BE
- SSL certificate riêng cho từng subdomain
- Clear separation of concerns

### Option B: Combined (Single Server)

```
yourdomain.com          → Frontend (Next.js)
yourdomain.com/api/*    → Backend (Laravel API)
yourdomain.com/app/*    → WebSocket (Reverb)
```

**Ưu điểm:**
- Chỉ cần 1 server
- 1 SSL certificate
- Đơn giản hơn cho deployment nhỏ

---

## 2. DNS Records cần thêm

### Cho Option A (Recommended):

| Type | Name | Value | TTL | Purpose |
|------|------|-------|-----|---------|
| A | @ | `YOUR_SERVER_IP` | 300 | Root domain |
| A | app | `YOUR_FRONTEND_SERVER_IP` | 300 | Frontend subdomain |
| A | api | `YOUR_BACKEND_SERVER_IP` | 300 | Backend subdomain |
| CNAME | www | yourdomain.com | 300 | Redirect www |

**Ví dụ cụ thể:**
```
Type    Name    Value               TTL
A       @       203.0.113.50        300
A       app     203.0.113.50        300
A       api     203.0.113.51        300
CNAME   www     yourdomain.com      300
```

### Cho Option B (Single Server):

| Type | Name | Value | TTL | Purpose |
|------|------|-------|-----|---------|
| A | @ | `YOUR_SERVER_IP` | 300 | Root domain + App |
| CNAME | www | yourdomain.com | 300 | Redirect www |

---

## 3. Cách thêm DNS Records

### Bước 1: Xác định Server IP

```bash
# Nếu đã có VPS, lấy IP bằng lệnh:
curl ifconfig.me

# Hoặc xem trong dashboard của hosting provider
```

### Bước 2: Truy cập DNS Management

Tùy theo nhà cung cấp domain:

| Provider | DNS Management URL |
|----------|-------------------|
| GoDaddy | https://dcc.godaddy.com/domains |
| Namecheap | https://ap.www.namecheap.com/domains/list |
| Cloudflare | https://dash.cloudflare.com |
| Google Domains | https://domains.google.com |
| Hostinger | https://hpanel.hostinger.com/domain |
| Tenten.vn | https://id.tenten.vn |
| Mắt Bão | https://my.matbao.net |
| PA Vietnam | https://my.pavietnam.vn |

### Bước 3: Thêm Records

1. Vào DNS Zone / DNS Records
2. Click "Add Record" hoặc "Thêm bản ghi"
3. Điền thông tin theo bảng ở trên
4. Save/Lưu

### Bước 4: Verify DNS Propagation

Sau khi thêm, kiểm tra DNS đã propagate chưa:

```bash
# Kiểm tra A record
nslookup app.yourdomain.com
nslookup api.yourdomain.com

# Hoặc dùng online tool:
# https://dnschecker.org
# https://www.whatsmydns.net
```

**Lưu ý:** DNS propagation có thể mất từ 5 phút đến 48 giờ (thường 15-30 phút).

---

## 4. Cấu hình theo Server Type

### 4.1 VPS (DigitalOcean, Vultr, Linode, etc.)

Bạn có full control. Cấu hình trong Nginx:

**File: /etc/nginx/sites-available/aoisora-frontend**
```nginx
server {
    listen 80;
    server_name app.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**File: /etc/nginx/sites-available/aoisora-backend**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    root /var/www/aoisora/backend/public;
    index index.php;

    # Laravel API
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # WebSocket (Reverb)
    location /app {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 60s;
    }
}
```

### 4.2 Shared Hosting

Thường có giới hạn:
- Không thể chạy Laravel Reverb (WebSocket)
- Không thể tùy chỉnh Nginx
- Phải dùng cPanel/Plesk

**Giải pháp:**
- Frontend: Deploy lên Vercel/Netlify (free)
- Backend: Dùng shared hosting nếu có PHP support
- WebSocket: Bỏ hoặc dùng Pusher/Ably (third-party)

### 4.3 Cloud Platform (Vercel, Railway, Render)

DNS đơn giản hơn - chỉ cần CNAME:

| Type | Name | Value |
|------|------|-------|
| CNAME | app | cname.vercel-dns.com |
| CNAME | api | your-app.railway.app |

---

## 5. SSL/HTTPS Setup

### Option 1: Let's Encrypt (Free) - VPS

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d app.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal (already setup by default)
sudo certbot renew --dry-run
```

### Option 2: Cloudflare (Free) - Any hosting

1. Chuyển nameservers về Cloudflare
2. Bật "Full (strict)" SSL mode
3. Cloudflare tự động cấp SSL

### Option 3: Platform SSL - Vercel/Railway/Render

Tự động cấp SSL khi connect custom domain.

---

## 6. Environment Variables cho Production

### Frontend (.env.local hoặc Vercel Dashboard):

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_REVERB_APP_KEY=your_reverb_app_key
NEXT_PUBLIC_REVERB_HOST=api.yourdomain.com
NEXT_PUBLIC_REVERB_PORT=443
NEXT_PUBLIC_REVERB_SCHEME=https
```

### Backend (.env):

```env
APP_URL=https://api.yourdomain.com
REVERB_HOST=api.yourdomain.com
REVERB_PORT=443
REVERB_SCHEME=https
```

---

## 7. Checklist

### DNS Setup
- [ ] Xác định Server IP(s)
- [ ] Thêm A record cho app subdomain
- [ ] Thêm A record cho api subdomain
- [ ] Verify DNS propagation
- [ ] Test với curl/browser

### SSL Setup
- [ ] Install SSL certificate
- [ ] Verify HTTPS working
- [ ] Test WebSocket over WSS

### Application Config
- [ ] Update frontend NEXT_PUBLIC_API_URL
- [ ] Update frontend REVERB config
- [ ] Update backend APP_URL
- [ ] Update backend REVERB config
- [ ] Restart services

---

## 8. Common Issues

### DNS không resolve
- Kiểm tra đã save records chưa
- Đợi propagation (5-30 phút)
- Clear DNS cache: `ipconfig /flushdns` (Windows)

### SSL không work
- Kiểm tra DNS đã point đúng IP chưa
- Kiểm tra port 80/443 đã mở chưa
- Kiểm tra Nginx config có lỗi không: `nginx -t`

### WebSocket không connect
- Kiểm tra Reverb đang chạy: `supervisorctl status`
- Kiểm tra Nginx proxy WebSocket config
- Kiểm tra browser console for errors

---

**Last updated**: 2026-01-07
