# Hướng dẫn Setup iOS cho Codemagic - Build cho iPhone thực

## Yêu cầu

- ✅ Apple Developer Account ($99/năm)
- ✅ Codemagic account (FREE tier có 500 phút build/tháng)
- ✅ Mac với Xcode đã cài đặt (để tạo certificates)

---

## 🔑 Bước 1: Tạo App Store Connect API Key

### 1.1. Truy cập App Store Connect

1. Đăng nhập: https://appstoreconnect.apple.com
2. **Users and Access** → **Keys** tab
3. Click **"+"** để tạo key mới

### 1.2. Tạo API Key

1. **Name**: `Codemagic CI/CD`
2. **Access**: `App Manager` (hoặc `Developer`)
3. Click **Generate**
4. **Download** file `.p8` (chỉ download được 1 lần!)
5. **Lưu lại**:
   - Key ID (VD: `AB12CD34EF`)
   - Issuer ID (VD: `12345678-1234-1234-1234-123456789012`)
   - File `.p8` đã download

⚠️ **QUAN TRỌNG**: Giữ file `.p8` an toàn, không commit lên Git!

---

## 📱 Bước 2: Tạo App trong App Store Connect

### 2.1. Tạo App ID

1. **App Store Connect** → **My Apps** → **"+"** → **New App**
2. Điền thông tin:
   ```
   Platform: iOS
   Name: OptiChain
   Primary Language: English
   Bundle ID: com.aoisora.optichain (Create New)
   SKU: optichain-001
   ```
3. Click **Create**

### 2.2. Lưu App ID

Sau khi tạo xong, lấy **App ID** từ URL:
```
https://appstoreconnect.apple.com/apps/1234567890/appstore
                                       ^^^^^^^^^^^
                                       Đây là App ID
```

---

## 🔐 Bước 3: Tạo Certificates & Provisioning Profiles

### Option A: Tự động (Recommended - Dùng Codemagic)

Codemagic có thể tự động tạo certificates và provisioning profiles.

1. **Codemagic Dashboard** → Chọn app
2. **Settings** → **Code signing identities**
3. Click **"Automatic code signing"**
4. Codemagic sẽ tự động:
   - Tạo certificates
   - Tạo provisioning profiles
   - Quản lý signing

### Option B: Thủ công (Nếu muốn kiểm soát)

#### 3.1. Tạo Certificate trên Mac

```bash
# Mở Keychain Access
# → Certificate Assistant
# → Request a Certificate from a Certificate Authority
# Điền email, Common Name: "iOS Distribution"
# Save to disk → Tạo file CertificateSigningRequest.certSigningRequest
```

#### 3.2. Upload lên Apple Developer

1. https://developer.apple.com/account/resources/certificates/list
2. Click **"+"** → **Apple Distribution**
3. Upload file `.certSigningRequest`
4. Download file `.cer`

#### 3.3. Export Certificate từ Keychain

```bash
# Keychain Access → Certificates
# Tìm certificate vừa tạo
# Right click → Export "iOS Distribution"
# Save as: ios_distribution.p12
# Đặt password (nhớ password này!)
```

#### 3.4. Tạo Provisioning Profile

1. https://developer.apple.com/account/resources/profiles/list
2. Click **"+"**
3. **Distribution** → **App Store**
4. Chọn **App ID**: `com.aoisora.optichain`
5. Chọn **Certificate** vừa tạo
6. Download file `.mobileprovision`

---

## 🚀 Bước 4: Setup trên Codemagic

### 4.1. Upload Certificates

1. **Codemagic Dashboard** → Chọn app → **Settings**
2. **Code signing identities** → **iOS**
3. Click **"Upload certificate"**

**Upload thông tin:**
```
Certificate (.p12 file): ios_distribution.p12
Certificate password: [Password bạn đặt ở bước 3.3]
```

4. Click **Upload**

### 4.2. Upload Provisioning Profile

1. Cùng trang **Code signing identities**
2. Section **Provisioning profiles**
3. Click **"Upload provisioning profile"**
4. Chọn file `.mobileprovision` đã download
5. Click **Upload**

### 4.3. Tạo Environment Variable Groups

#### Group 1: `app_store_credentials`

1. **Team settings** → **Global variables and secrets**
2. Click **"Add variable group"**
3. **Group name**: `app_store_credentials`
4. Add các biến:

```bash
# App Store Connect API Key (nội dung file .p8)
APP_STORE_CONNECT_PRIVATE_KEY
# Paste toàn bộ nội dung file .p8 vào đây (bao gồm cả BEGIN và END)
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM...
...
-----END PRIVATE KEY-----

# Key ID (từ App Store Connect)
APP_STORE_CONNECT_KEY_IDENTIFIER = AB12CD34EF

# Issuer ID (từ App Store Connect)
APP_STORE_CONNECT_ISSUER_ID = 12345678-1234-1234-1234-123456789012
```

5. Mark as **Secure** (checkbox)
6. Click **Add**

#### Group 2: `ios_credentials`

1. **Add variable group** → **Group name**: `ios_credentials`
2. Add các biến:

```bash
# Certificate Private Key (đã upload ở bước 4.1)
CERTIFICATE_PRIVATE_KEY = [Codemagic tự lấy từ .p12 đã upload]

# Bundle ID
BUNDLE_ID = com.aoisora.optichain

# Team ID (lấy từ Apple Developer Account)
TEAM_ID = ABCD123456
```

### 4.4. Lấy Team ID

1. https://developer.apple.com/account
2. **Membership** → **Team ID**
3. Copy Team ID (VD: `ABCD123456`)

---

## ⚙️ Bước 5: Cập nhật codemagic.yaml

File `codemagic.yaml` đã được tạo với 5 workflows:

### 1. `ios-workflow` - Build iOS cho App Store & TestFlight
```yaml
# Dùng khi muốn submit lên TestFlight hoặc App Store
# Requires: Apple Developer Account + Certificates
```

### 2. `ios-adhoc-workflow` - Build iOS Ad-Hoc
```yaml
# Dùng khi muốn install trên thiết bị cụ thể (không qua App Store)
# Requires: Device UDIDs đã đăng ký trên Apple Developer
```

### 3. `ios-android-workflow` - Build cả iOS & Android
```yaml
# Build cả 2 platforms cùng lúc
# Auto-publish iOS → TestFlight, Android → Google Play Internal
```

### 4. `android-workflow` - Chỉ build Android
```yaml
# Không cần iOS signing
# Dùng cho testing Android only
```

### 5. `dev-workflow` - Development build (không ký)
```yaml
# Quick test, không cần signing
# Chỉ để verify code compile được
```

---

## 🎯 Bước 6: Update Bundle ID trong Project

### 6.1. Update iOS Bundle ID

**File**: `mobile/ios/Runner.xcodeproj/project.pbxproj`

```bash
cd mobile/ios
# Open Xcode
open Runner.xcworkspace

# Xcode → Runner target → Signing & Capabilities
# Team: Chọn Apple Developer Team
# Bundle Identifier: com.aoisora.optichain
```

**Hoặc update trực tiếp trong file**:

```xml
<!-- mobile/ios/Runner/Info.plist -->
<key>CFBundleIdentifier</key>
<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
```

### 6.2. Update trong codemagic.yaml

Đã được set sẵn:
```yaml
BUNDLE_ID: "com.aoisora.optichain"
```

⚠️ **Thay đổi** `com.aoisora.optichain` thành Bundle ID của bạn nếu khác.

---

## 🏃 Bước 7: Trigger Build

### 7.1. Push code lên GitHub

```bash
cd /c/Users/PC/Documents/aura

git add codemagic.yaml docs/CODEMAGIC-IOS-SETUP.md
git commit -m "Add Codemagic iOS workflows for real device builds"
git push origin develop_WS_DWS_ver1
```

### 7.2. Chọn Workflow trong Codemagic

1. **Codemagic Dashboard** → Chọn app
2. **Start new build**
3. Chọn workflow:
   - `ios-workflow` - Nếu muốn build cho TestFlight
   - `ios-adhoc-workflow` - Nếu muốn install trên thiết bị cụ thể
   - `ios-android-workflow` - Build cả 2 platforms
4. Click **Start new build**

### 7.3. Monitor Build

1. **Builds** tab → Xem real-time logs
2. Chờ 10-20 phút (iOS build chậm hơn Android)
3. Nếu thành công → Download `.ipa` file

---

## 📲 Bước 8: Install IPA trên iPhone thực

### Option 1: Qua TestFlight (Recommended)

Nếu dùng `ios-workflow` với `submit_to_testflight: true`:

1. Build xong → Auto upload lên TestFlight
2. Chờ 5-10 phút Apple review
3. TestFlight app trên iPhone → Install app

### Option 2: Ad-Hoc Installation

Nếu dùng `ios-adhoc-workflow`:

1. Download file `.ipa` từ Codemagic
2. **Cách 1**: Dùng Apple Configurator 2
   ```bash
   # Mac only
   # Install Apple Configurator 2 từ App Store
   # Connect iPhone → Add → Apps → .ipa file
   ```

3. **Cách 2**: Dùng Diawi
   ```bash
   # Upload .ipa lên https://www.diawi.com
   # Lấy QR code
   # Scan bằng iPhone → Install
   ```

4. **Cách 3**: Dùng Xcode
   ```bash
   # Xcode → Window → Devices and Simulators
   # Connect iPhone
   # Click "+" → Chọn .ipa file
   ```

---

## 🔧 Troubleshooting

### Lỗi: "No signing certificate found"

**Fix**:
1. Kiểm tra certificate đã upload trong Codemagic
2. Verify provisioning profile matching với Bundle ID
3. Đảm bảo certificate chưa expire

### Lỗi: "Provisioning profile doesn't match"

**Fix**:
```yaml
# Trong codemagic.yaml
ios_signing:
  distribution_type: app_store  # Đổi thành ad_hoc nếu dùng ad-hoc profile
  bundle_identifier: com.aoisora.optichain  # Match chính xác
```

### Lỗi: "App Store Connect API key invalid"

**Fix**:
1. Verify 3 biến trong `app_store_credentials` group:
   - `APP_STORE_CONNECT_PRIVATE_KEY` (nội dung file .p8 đầy đủ)
   - `APP_STORE_CONNECT_KEY_IDENTIFIER` (Key ID)
   - `APP_STORE_CONNECT_ISSUER_ID` (Issuer ID)
2. Đảm bảo API key chưa bị revoke trên App Store Connect

### Lỗi: "Device not registered"

**Chỉ với Ad-Hoc builds**:

1. Lấy UDID của iPhone:
   ```bash
   # Connect iPhone to Mac
   # Xcode → Window → Devices and Simulators
   # Copy "Identifier" (UDID)
   ```

2. Đăng ký device:
   ```
   https://developer.apple.com/account/resources/devices/list
   → Click "+" → Nhập UDID → Save
   ```

3. Tạo lại provisioning profile với device mới
4. Upload lại vào Codemagic

---

## 💰 Chi phí

### Apple Developer Account
- **$99/năm** (bắt buộc để build cho device thực)

### Codemagic FREE Tier
- **500 phút build/tháng** (FREE)
- Mac mini M1 instance
- **Đủ cho**: ~25-50 iOS builds/tháng

### Upgrade Codemagic (nếu cần)
- **$0.038/phút** nếu vượt 500 phút
- Hoặc upgrade lên **Pro**: $99/tháng (unlimited builds)

---

## 📋 Checklist Setup iOS

- [ ] Có Apple Developer Account ($99/năm)
- [ ] Tạo App Store Connect API Key (.p8 file)
- [ ] Tạo App trên App Store Connect
- [ ] Lấy App ID từ App Store Connect
- [ ] Tạo hoặc upload certificates (.p12) lên Codemagic
- [ ] Upload provisioning profile (.mobileprovision) lên Codemagic
- [ ] Tạo environment variable group `app_store_credentials`
- [ ] Tạo environment variable group `ios_credentials`
- [ ] Update Bundle ID trong `codemagic.yaml`
- [ ] Update Bundle ID trong Xcode project
- [ ] Push code lên GitHub
- [ ] Trigger build trong Codemagic
- [ ] Download .ipa hoặc install qua TestFlight

---

## 🎓 Workflows Comparison

| Workflow | iOS | Android | Signing | Output | Use Case |
|----------|-----|---------|---------|--------|----------|
| `ios-workflow` | ✅ | ❌ | Signed (App Store) | .ipa → TestFlight | Production iOS |
| `ios-adhoc-workflow` | ✅ | ❌ | Signed (Ad-Hoc) | .ipa → Device | Testing specific devices |
| `ios-android-workflow` | ✅ | ✅ | Both | .ipa + .apk/.aab | Full deployment |
| `android-workflow` | ❌ | ✅ | Signed (Android) | .apk/.aab | Android only |
| `dev-workflow` | ✅ | ✅ | Unsigned | Debug builds | Quick testing |

---

## 🔗 Useful Links

- **Codemagic Documentation**: https://docs.codemagic.io/yaml-code-signing/signing-ios/
- **App Store Connect**: https://appstoreconnect.apple.com
- **Apple Developer**: https://developer.apple.com
- **TestFlight**: https://testflight.apple.com

---

## 📞 Support

**Nếu build vẫn fail sau khi làm theo guide:**

1. Check Codemagic build logs chi tiết
2. Verify tất cả environment variables
3. Đảm bảo certificates chưa expire
4. Check Bundle ID match giữa:
   - Xcode project
   - codemagic.yaml
   - App Store Connect
   - Provisioning profile

---

**Last updated**: 2025-12-26
**Recommended workflow**: `ios-adhoc-workflow` cho testing, `ios-workflow` cho production
