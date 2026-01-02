# Hướng dẫn cài app lên iPhone bằng Sideloadly (MIỄN PHÍ)

## 🎯 Giới thiệu

Sideloadly cho phép cài app lên iPhone **KHÔNG CẦN Apple Developer Account** ($99/năm).

### ✅ Ưu điểm:
- **Hoàn toàn miễn phí** (dùng Free Apple ID)
- Không cần jailbreak
- Hoạt động với mọi iPhone (iOS 7+)
- Dễ sử dụng (GUI đơn giản)

### ⚠️ Nhược điểm:
- App chỉ hoạt động **7 ngày**, sau đó phải cài lại (resign)
- Tối đa **3 apps** cùng lúc với Free Apple ID
- Cần kết nối iPhone với máy tính để cài lại

---

## 📋 Yêu cầu

- ✅ iPhone (iOS 7+)
- ✅ Windows PC hoặc Mac
- ✅ Cáp Lightning/USB-C để kết nối iPhone
- ✅ Apple ID miễn phí (iCloud account của bạn)
- ✅ Sideloadly software (miễn phí)
- ✅ File IPA từ Codemagic

---

## 🚀 Bước 1: Build IPA từ Codemagic

### 1.1. Trigger Build

1. **Codemagic Dashboard**: https://codemagic.io/apps
2. Chọn app **aura**
3. Click **"Start new build"**
4. **Workflow**: Chọn `sideloadly-workflow`
5. **Branch**: `develop_WS_DWS_ver1`
6. Click **"Start new build"**

### 1.2. Chờ Build hoàn thành

- Thời gian: ~10-15 phút
- Monitor logs trong tab **"Builds"**

### 1.3. Download IPA

1. Build hoàn thành → Tab **"Artifacts"**
2. Download file: **OptiChain-Sideloadly.ipa**
3. Lưu vào máy tính (ví dụ: Desktop)

---

## 🛠️ Bước 2: Cài đặt Sideloadly

### Windows

1. **Download**: https://sideloadly.io
2. Click **"Download for Windows"**
3. Run file `Sideloadly.Setup.exe`
4. Follow wizard → Install

### macOS

1. **Download**: https://sideloadly.io
2. Click **"Download for macOS"**
3. Open file `Sideloadly.dmg`
4. Drag **Sideloadly** vào **Applications** folder
5. Open Sideloadly (nếu báo "unidentified developer", right-click → Open)

---

## 📱 Bước 3: Cài IPA lên iPhone

### 3.1. Kết nối iPhone

1. **Connect** iPhone vào máy tính bằng cáp Lightning/USB-C
2. iPhone hiện popup **"Trust This Computer?"** → Click **"Trust"**
3. Nhập passcode của iPhone

### 3.2. Mở Sideloadly

1. Launch **Sideloadly** app
2. Giao diện chính hiện ra:

```
┌────────────────────────────────────┐
│  Sideloadly                        │
├────────────────────────────────────┤
│  iDevice: [iPhone của bạn]   ▼    │
│  Apple Account: _____________      │
│  Password: __________________      │
│  IPA File: [Browse...]             │
│  [x] Advanced Options              │
│  [ Start ]                         │
└────────────────────────────────────┘
```

### 3.3. Điền thông tin

**1. iDevice:**
- Sẽ tự động detect iPhone của bạn
- VD: `iPhone 13 Pro (iOS 17.5.1)`

**2. Apple Account:**
- Nhập Apple ID của bạn (email iCloud)
- VD: `your-email@icloud.com`

**3. Password:**
- Nhập password của Apple ID

⚠️ **Lưu ý**: Nếu bật 2-Factor Authentication (2FA):
- Sideloadly sẽ yêu cầu mã 2FA
- Nhập mã 6 số từ iPhone/trusted device

**4. IPA File:**
- Click **"Browse..."**
- Chọn file **OptiChain-Sideloadly.ipa** đã download

### 3.4. Advanced Options (Optional)

Click **"Advanced Options"** để customize:

```
Bundle ID: com.aoisora.optichain
App Name: OptiChain
App Version: 1.0.0

[ ] Remove PlugIns
[x] Inject tweaks
[ ] Remove UISupportedDevices
```

**Recommend**: Giữ nguyên mặc định, chỉ check:
- ✅ **Inject tweaks** (để app hoạt động tốt hơn)

### 3.5. Start Sideload

1. Click **"Start"** button
2. Sideloadly sẽ:
   - Verify Apple Account
   - Sign IPA với Apple ID của bạn
   - Install app lên iPhone
3. **Chờ 2-5 phút**

### 3.6. Progress Logs

Bạn sẽ thấy logs trong Sideloadly:

```
[*] Verifying Apple Account...
[*] Downloading provisioning profile...
[*] Signing IPA with certificate...
[*] Installing app on device...
[*] Done! App installed successfully.
```

---

## ✅ Bước 4: Trust Developer Certificate

### 4.1. Trên iPhone

Sau khi install xong, **KHÔNG MỞ APP NGAY**. Phải trust certificate trước:

1. **Settings** → **General** → **VPN & Device Management**
2. Tìm section **"Developer App"**
3. Click vào Apple ID của bạn (VD: `your-email@icloud.com`)
4. Click **"Trust 'your-email@icloud.com'"**
5. Popup confirm → Click **"Trust"**

### 4.2. Mở app

1. Quay về Home screen
2. Tìm app **OptiChain**
3. Click để mở → App sẽ chạy bình thường! 🎉

---

## 🔄 Bước 5: Renew sau 7 ngày

### Tại sao cần renew?

Free Apple ID chỉ sign app được **7 ngày**. Sau đó app sẽ:
- Không mở được (báo lỗi)
- Cần **resign** (cài lại)

### Cách renew:

**Option 1: Cài lại qua Sideloadly (Recommended)**

1. Connect iPhone vào máy tính
2. Mở Sideloadly
3. Điền lại thông tin (như Bước 3)
4. Click **"Start"**
5. Sideloadly sẽ **overwrite** app cũ
6. ✅ App hoạt động thêm 7 ngày nữa

⚠️ **Data sẽ GIỮ NGUYÊN** (không mất dữ liệu)

**Option 2: Dùng AltStore (Auto-refresh)**

Nếu muốn tự động renew mỗi 7 ngày, dùng **AltStore**:
- https://altstore.io
- Cài AltServer trên máy tính (chạy background)
- Khi iPhone và máy tính cùng WiFi → Auto refresh

---

## 🔧 Troubleshooting

### Lỗi: "Unable to verify app"

**Nguyên nhân**: Chưa trust developer certificate

**Fix**: Follow [Bước 4](#-bước-4-trust-developer-certificate)

---

### Lỗi: "This app cannot be installed"

**Nguyên nhân**:
- Đã cài quá 3 apps với Free Apple ID
- Hoặc Bundle ID bị conflict

**Fix**:

**Option 1: Xóa app khác**
```
Settings → General → iPhone Storage
→ Chọn app không dùng → Delete App
```

**Option 2: Change Bundle ID** (Advanced)

Trong Sideloadly Advanced Options:
```
Bundle ID: com.aoisora.optichain2  // Thêm số 2
```

---

### Lỗi: "Apple ID or password incorrect"

**Fix**:

1. **Nếu có 2FA**: Nhập password + mã 2FA liền nhau
   ```
   Password: yourpassword123456
              ^^^^^^^^^^^^^^^^
              password + 6-digit code
   ```

2. **Hoặc**: Tạo App-Specific Password
   - https://appleid.apple.com → Security → App-Specific Passwords
   - Generate new password
   - Dùng password này thay vì password thật

---

### Lỗi: "Developer Mode required (iOS 16+)"

**Chỉ với iOS 16 trở lên**

**Fix**:

1. **Settings** → **Privacy & Security**
2. Scroll xuống → **Developer Mode**
3. Toggle **ON**
4. iPhone sẽ restart
5. Sau khi restart → Mở lại app

---

### Lỗi: "Sideloadly không detect iPhone"

**Fix**:

**Windows**:
1. Install iTunes từ Microsoft Store (không phải version từ Apple.com)
2. Restart Sideloadly

**macOS**:
1. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```
2. Restart Sideloadly

---

## 📊 So sánh: Sideloadly vs TestFlight vs App Store

| Feature | Sideloadly | TestFlight | App Store |
|---------|-----------|------------|-----------|
| **Chi phí** | FREE | Cần Dev Account ($99/năm) | Cần Dev Account ($99/năm) |
| **Thời gian valid** | 7 ngày | 90 ngày | Vĩnh viễn |
| **Số apps tối đa** | 3 apps | Unlimited | Unlimited |
| **Cần kết nối máy tính** | ✅ Mỗi 7 ngày | ❌ Không | ❌ Không |
| **Approval** | Không cần | Không cần (Internal) | Cần Apple review |
| **Distribution** | Chỉ cho bạn | Team/Public testers | Public |

---

## 💡 Tips & Best Practices

### 1. Đặt lịch renew

- Set reminder mỗi **6 ngày** để renew trước khi app expire
- Hoặc dùng AltStore để auto-refresh

### 2. Backup IPA file

- Lưu file IPA ở nhiều nơi (Google Drive, Dropbox)
- Để không phải rebuild từ Codemagic mỗi lần

### 3. Sử dụng AltStore cho convenience

**AltStore** tốt hơn Sideloadly nếu:
- Bạn muốn auto-refresh
- Có nhiều apps cần sideload
- Không muốn connect cable mỗi 7 ngày

**Setup AltStore**:
1. Download: https://altstore.io
2. Install AltServer trên máy tính
3. Install AltStore app lên iPhone qua AltServer
4. Sau đó sideload IPA qua AltStore app

### 4. Free vs Paid Apple Developer

Nếu bạn có $99/năm → Nên dùng Apple Developer Account vì:
- ✅ App valid **1 năm**
- ✅ Không giới hạn số apps
- ✅ Distribute qua TestFlight
- ✅ Submit lên App Store

---

## 🎓 Workflow Comparison

### Workflow 1: Sideloadly (FREE - Recommended cho testing)

```
Codemagic (sideloadly-workflow)
  ↓ Build IPA (~10 phút)
Download IPA
  ↓
Sideloadly
  ↓ Sign với Free Apple ID
Install lên iPhone
  ↓
✅ App hoạt động 7 ngày
  ↓
Renew sau 7 ngày (cài lại)
```

**Chi phí**: $0
**Effort**: Cài lại mỗi 7 ngày

---

### Workflow 2: TestFlight (Paid - Recommended cho production)

```
Codemagic (ios-workflow)
  ↓ Build IPA (~20 phút)
Auto upload to TestFlight
  ↓
Install qua TestFlight app
  ↓
✅ App hoạt động 90 ngày
  ↓
Auto update khi có build mới
```

**Chi phí**: $99/năm
**Effort**: Không cần làm gì, auto update

---

## 📱 Cài nhiều apps

Với Free Apple ID, tối đa **3 apps**:

```
App 1: OptiChain (Production)
App 2: OptiChain Dev (Testing version)
App 3: Other app
```

Nếu muốn cài app thứ 4:
- Phải xóa 1 trong 3 apps cũ
- Hoặc dùng Apple Developer Account (unlimited)

---

## 🔗 Useful Links

- **Sideloadly**: https://sideloadly.io
- **AltStore**: https://altstore.io
- **Apple ID Management**: https://appleid.apple.com
- **Codemagic**: https://codemagic.io

---

## 📞 Support

**Nếu gặp vấn đề:**

1. Check [Troubleshooting section](#-troubleshooting)
2. Verify:
   - ✅ iPhone đã trust máy tính
   - ✅ Apple ID/password đúng
   - ✅ Developer Mode bật (iOS 16+)
   - ✅ IPA file từ Codemagic valid
3. Try:
   - Restart Sideloadly
   - Restart iPhone
   - Redownload IPA từ Codemagic

---

## 🎯 Quick Start Checklist

- [ ] Download IPA từ Codemagic (`sideloadly-workflow`)
- [ ] Download & install Sideloadly
- [ ] Connect iPhone vào máy tính
- [ ] Trust máy tính trên iPhone
- [ ] Mở Sideloadly
- [ ] Điền Apple ID, password, chọn IPA file
- [ ] Click "Start" → Chờ 2-5 phút
- [ ] iPhone: Settings → General → VPN & Device Management
- [ ] Trust developer certificate
- [ ] Mở app OptiChain → Success! 🎉
- [ ] Set reminder: Renew sau 7 ngày

---

**Last updated**: 2025-12-26
**Recommended for**: Free testing, personal use, development
**Alternative**: TestFlight (if you have Apple Developer Account)
