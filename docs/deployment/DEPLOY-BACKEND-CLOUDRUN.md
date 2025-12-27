# Deploy Backend lên Google Cloud Run - Hướng dẫn chi tiết

Hướng dẫn từng bước để deploy OptiChain Backend (FastAPI + Python) lên Google Cloud Run.

## 📋 Mục lục

1. [Chuẩn bị](#1-chuẩn-bị)
2. [Tạo Google Cloud Project](#2-tạo-google-cloud-project)
3. [Cài đặt Google Cloud CLI](#3-cài-đặt-google-cloud-cli)
4. [Tạo Cloud SQL Database](#4-tạo-cloud-sql-database)
5. [Deploy Backend lên Cloud Run](#5-deploy-backend-lên-cloud-run)
6. [Test Backend API](#6-test-backend-api)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Chuẩn bị

### ✅ Checklist trước khi bắt đầu

- [ ] Có tài khoản Google (Gmail)
- [ ] Có thẻ tín dụng/debit (để verify GCP - sẽ không bị charge nếu dùng free tier)
- [ ] Code backend đã hoàn chỉnh và test local
- [ ] Internet ổn định

### 💰 Chi phí ước tính

- **Cloud Run**: Free tier 2 triệu requests/tháng → $0-10/tháng
- **Cloud SQL**: db-f1-micro ~$7-10/tháng, db-g1-small ~$25/tháng
- **Cloud Build**: 120 build-minutes/ngày free
- **Total**: ~$7-35/tháng (tùy traffic)

---

## 2. Tạo Google Cloud Project

### Bước 2.1: Truy cập Google Cloud Console

1. Mở browser, vào: https://console.cloud.google.com
2. Đăng nhập bằng tài khoản Google

### Bước 2.2: Tạo Project mới

1. **Click vào dropdown "Select a project"** (góc trên bên trái)

   ![Select Project](https://i.imgur.com/example.png)

2. **Click "NEW PROJECT"**

3. **Điền thông tin:**
   ```
   Project name: optichain-production
   Project ID: optichain-prod-xxxx (auto-generated, có thể edit)
   Organization: No organization (hoặc chọn org nếu có)
   Location: No organization
   ```

4. **Click "CREATE"**

5. **Chờ 10-20 giây** cho project được tạo

6. **Chuyển sang project vừa tạo:**
   - Click dropdown "Select a project" lại
   - Chọn "optichain-production"

### Bước 2.3: Enable Billing

⚠️ **Quan trọng**: Phải enable billing mới dùng được Cloud Run và Cloud SQL

1. **Menu (☰) → Billing**

2. Nếu chưa có billing account:
   - Click "Link a billing account"
   - Click "Create billing account"
   - Điền thông tin thẻ
   - Chấp nhận terms

3. Nếu đã có billing account:
   - Chọn billing account
   - Click "Set account"

### Bước 2.4: Enable APIs

1. **Menu (☰) → APIs & Services → Library**

2. **Enable các APIs sau:**

   **a) Cloud Run API:**
   - Tìm "Cloud Run API"
   - Click vào
   - Click "ENABLE"
   - Chờ ~10 giây

   **b) Cloud SQL Admin API:**
   - Back về Library
   - Tìm "Cloud SQL Admin API"
   - Click "ENABLE"

   **c) Cloud Build API:**
   - Tìm "Cloud Build API"
   - Click "ENABLE"

   **d) Artifact Registry API:**
   - Tìm "Artifact Registry API"
   - Click "ENABLE"

3. **Verify APIs đã enabled:**
   - Menu → APIs & Services → Dashboard
   - Kiểm tra 4 APIs trên đã có trong list

---

## 3. Cài đặt Google Cloud CLI

### Option A: Windows (Recommended)

1. **Download installer:**
   - Vào: https://cloud.google.com/sdk/docs/install
   - Click "Windows" tab
   - Download `GoogleCloudSDKInstaller.exe`

2. **Chạy installer:**
   - Double-click file vừa download
   - Chọn "Install for all users" hoặc "Just for me"
   - Chọn thư mục cài đặt (mặc định OK)
   - Check ✅ "Start Cloud SDK Shell"
   - Click "Install"

3. **Khởi chạy Cloud SDK Shell:**
   - Sau khi cài xong sẽ tự mở
   - Hoặc tìm "Google Cloud SDK Shell" trong Start Menu

4. **Khởi tạo gcloud:**
   ```bash
   gcloud init
   ```

5. **Làm theo hướng dẫn:**
   ```
   Welcome to the Google Cloud SDK!

   Pick configuration to use:
   → [1] Create a new configuration

   Enter configuration name:
   → optichain-prod (hoặc tên bạn muốn)

   Choose the account you would like to use:
   → [1] your-email@gmail.com

   Pick cloud project to use:
   → [X] optichain-production

   Do you want to configure a default Compute Region and Zone?
   → Y

   Please enter numeric choice:
   → 6 (asia-southeast1-a - Singapore)
   ```

6. **Verify:**
   ```bash
   gcloud config list
   # Kiểm tra account, project, region đã đúng
   ```

### Option B: macOS

```bash
# Download và cài
curl https://sdk.cloud.google.com | bash

# Restart terminal
exec -l $SHELL

# Initialize
gcloud init
```

### Option C: Linux

```bash
# Download
curl https://sdk.cloud.google.com | bash

# Restart shell
exec -l $SHELL

# Initialize
gcloud init
```

### Verify Installation

```bash
# Check version
gcloud --version

# Should see:
# Google Cloud SDK 456.0.0
# bq 2.0.97
# core 2023.11.17
# gcloud-crc32c 1.0.0
# gsutil 5.27
```

---

## 4. Tạo Cloud SQL Database

### Bước 4.1: Tạo PostgreSQL Instance

1. **Mở Cloud SQL Console:**
   - Vào: https://console.cloud.google.com/sql
   - Hoặc Menu → SQL

2. **Click "CREATE INSTANCE"**

3. **Chọn "PostgreSQL"**

4. **Điền thông tin Instance:**

   **Basic Info:**
   ```
   Instance ID: optichain-db
   Password: [Tạo password mạnh, lưu lại]
   Database version: PostgreSQL 15
   Cloud SQL edition: Enterprise (hoặc Enterprise Plus)
   ```

   **Choose region and zonal availability:**
   ```
   Region: asia-southeast1 (Singapore)
   Zonal availability: Single zone (rẻ hơn) hoặc Multiple zones (HA)
   ```

5. **Click "SHOW CONFIGURATION OPTIONS"**

6. **Machine Configuration:**

   **For testing/development:**
   ```
   Preset: Sandbox (hoặc Development)
   Machine type: Shared core → db-f1-micro (1 vCPU, 0.6 GB)
   Storage: 10 GB HDD
   Enable automatic storage increases: ✅
   ```

   **For production:**
   ```
   Preset: Production
   Machine type: Dedicated core → db-n1-standard-1 (1 vCPU, 3.75 GB)
   Storage: 20 GB SSD
   Enable automatic storage increases: ✅
   ```

7. **Connections:**
   ```
   Private IP: ❌ (không cần nếu dùng Cloud Run)
   Public IP: ✅ (tạm thời enable để test, sau sẽ tắt)
   ```

8. **Data Protection:**
   ```
   Automate backups: ✅
   Point-in-time recovery: ✅ (nếu production)
   ```

9. **Maintenance:**
   ```
   Maintenance window: Any (hoặc chọn thời gian ít traffic)
   Order of update: Any
   ```

10. **Flags (optional):**
    ```
    cloudsql.iam_authentication: on (nếu muốn dùng IAM auth)
    ```

11. **Click "CREATE INSTANCE"**

12. **Chờ 5-10 phút** để instance được tạo

### Bước 4.2: Tạo Database

1. **Sau khi instance status = "Running":**
   - Click vào instance "optichain-db"

2. **Tab "Databases" → Click "CREATE DATABASE"**

3. **Điền:**
   ```
   Database name: optichain
   Character set: UTF8
   Collation: en_US.UTF8
   ```

4. **Click "CREATE"**

### Bước 4.3: Tạo User

1. **Tab "Users" → "ADD USER ACCOUNT"**

2. **Điền:**
   ```
   User name: optichain_user
   Password: [Password mạnh, lưu lại]
   ```

3. **Click "ADD"**

### Bước 4.4: Import Schema

**Option A: Qua Cloud Console (Web UI)**

1. **Upload schema.sql lên Cloud Storage:**
   ```bash
   # Tạo bucket
   gsutil mb gs://optichain-db-backups

   # Upload schema
   gsutil cp database/schema.sql gs://optichain-db-backups/
   ```

2. **Import vào Cloud SQL:**
   - Tab "Import" → Click "IMPORT"
   - Source: Browse → Chọn `gs://optichain-db-backups/schema.sql`
   - Format: SQL
   - Database: optichain
   - Click "IMPORT"

**Option B: Qua gcloud CLI (Recommended)**

1. **Upload schema:**
   ```bash
   gsutil mb gs://optichain-db-backups
   gsutil cp database/schema.sql gs://optichain-db-backups/
   ```

2. **Import:**
   ```bash
   gcloud sql import sql optichain-db \
     gs://optichain-db-backups/schema.sql \
     --database=optichain
   ```

**Option C: Qua Cloud SQL Proxy (Local connection)**

1. **Download Cloud SQL Proxy:**
   ```bash
   # Windows
   curl -o cloud-sql-proxy.exe https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.7.0/cloud-sql-proxy.x64.exe

   # Mac/Linux
   curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.7.0/cloud-sql-proxy.darwin.amd64
   chmod +x cloud-sql-proxy
   ```

2. **Get connection name:**
   ```bash
   gcloud sql instances describe optichain-db --format="value(connectionName)"
   # Output: optichain-prod-xxxx:asia-southeast1:optichain-db
   ```

3. **Start proxy:**
   ```bash
   # Windows
   cloud-sql-proxy.exe optichain-prod-xxxx:asia-southeast1:optichain-db

   # Mac/Linux
   ./cloud-sql-proxy optichain-prod-xxxx:asia-southeast1:optichain-db
   ```

4. **Mở terminal mới, import schema:**
   ```bash
   # Install psql nếu chưa có
   # Windows: choco install postgresql
   # Mac: brew install postgresql
   # Linux: sudo apt install postgresql-client

   # Import
   psql -h 127.0.0.1 -U optichain_user -d optichain -f database/schema.sql
   # Nhập password khi được hỏi
   ```

### Bước 4.5: Verify Database

```bash
# Connect qua proxy
psql -h 127.0.0.1 -U optichain_user -d optichain

# Check tables
\dt

# Should see:
#  regions
#  stores
#  staff
#  departments
#  tasks
#  ...

# Check sample data
SELECT * FROM code_master;

# Exit
\q
```

### Bước 4.6: Get Connection String

```bash
# Get connection name
gcloud sql instances describe optichain-db \
  --format="value(connectionName)"

# Output: optichain-prod-xxxx:asia-southeast1:optichain-db
```

**Connection string for Cloud Run:**
```
postgresql://optichain_user:YOUR_PASSWORD@/optichain?host=/cloudsql/optichain-prod-xxxx:asia-southeast1:optichain-db
```

**Lưu lại connection string này!**

---

## 5. Deploy Backend lên Cloud Run

### Bước 5.1: Chuẩn bị Code

1. **Navigate to backend directory:**
   ```bash
   cd c:\Users\PC\Documents\aura\backend
   ```

2. **Verify Dockerfile exists:**
   ```bash
   ls Dockerfile
   # Should exist
   ```

3. **Verify requirements.txt:**
   ```bash
   cat requirements.txt
   # Should have fastapi, uvicorn, sqlalchemy, psycopg2-binary, etc.
   ```

### Bước 5.2: Generate Secret Key

```bash
# Generate strong secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Output example: vZR9X7KpQ_M8NnYyH2JqLw5TFx3Bc4Ga1Sd6Vh0Ui9E

# Lưu lại secret key này!
```

### Bước 5.3: Deploy lên Cloud Run

**Option A: Deploy bằng script (Recommended)**

1. **Edit deployment script:**
   ```bash
   cd ..
   nano scripts/deploy-backend.sh
   # Hoặc dùng notepad
   notepad scripts\deploy-backend.sh
   ```

2. **Update variables:**
   ```bash
   PROJECT_ID="optichain-prod-xxxx"  # Thay bằng project ID của bạn
   REGION="asia-southeast1"
   SERVICE_NAME="optichain-backend"
   ```

3. **Set environment variables:**
   ```bash
   # Windows (PowerShell)
   $env:DATABASE_URL="postgresql://optichain_user:YOUR_PASSWORD@/optichain?host=/cloudsql/optichain-prod-xxxx:asia-southeast1:optichain-db"
   $env:SECRET_KEY="vZR9X7KpQ_M8NnYyH2JqLw5TFx3Bc4Ga1Sd6Vh0Ui9E"

   # Mac/Linux (Bash)
   export DATABASE_URL="postgresql://optichain_user:YOUR_PASSWORD@/optichain?host=/cloudsql/optichain-prod-xxxx:asia-southeast1:optichain-db"
   export SECRET_KEY="vZR9X7KpQ_M8NnYyH2JqLw5TFx3Bc4Ga1Sd6Vh0Ui9E"
   ```

4. **Run deployment script:**
   ```bash
   # Windows
   bash scripts/deploy-backend.sh

   # Mac/Linux
   ./scripts/deploy-backend.sh
   ```

**Option B: Deploy thủ công (Manual)**

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Deploy với gcloud:**
   ```bash
   gcloud run deploy optichain-backend \
     --source . \
     --platform managed \
     --region asia-southeast1 \
     --allow-unauthenticated \
     --set-env-vars "DATABASE_URL=postgresql://optichain_user:YOUR_PASSWORD@/optichain?host=/cloudsql/optichain-prod-xxxx:asia-southeast1:optichain-db,SECRET_KEY=vZR9X7KpQ_M8NnYyH2JqLw5TFx3Bc4Ga1Sd6Vh0Ui9E,ALGORITHM=HS256,ACCESS_TOKEN_EXPIRE_MINUTES=30,ALLOWED_ORIGINS=*" \
     --add-cloudsql-instances optichain-prod-xxxx:asia-southeast1:optichain-db \
     --memory 512Mi \
     --cpu 1 \
     --timeout 300 \
     --max-instances 10 \
     --min-instances 0
   ```

3. **Confirm prompts:**
   ```
   Please specify a region:
   → 6 (asia-southeast1)

   Allow unauthenticated invocations?
   → Y
   ```

### Bước 5.4: Chờ deployment hoàn tất

```
Building using Dockerfile and deploying container to Cloud Run service...
✓ Creating Container Repository...
✓ Uploading sources...
✓ Building Container... (this may take a few minutes)
✓ Pushing Container...
✓ Deploying Container...
✓ Setting IAM Policy...
Done.

Service [optichain-backend] revision [optichain-backend-00001-abc] has been deployed and is serving 100 percent of traffic.
Service URL: https://optichain-backend-abc123-uc.a.run.app
```

**Lưu lại Service URL này!**

### Bước 5.5: Verify Deployment

1. **Check service status:**
   ```bash
   gcloud run services describe optichain-backend \
     --region asia-southeast1 \
     --format="value(status.url,status.conditions)"
   ```

2. **List all Cloud Run services:**
   ```bash
   gcloud run services list --region asia-southeast1
   ```

---

## 6. Test Backend API

### Bước 6.1: Test Health Endpoint

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe optichain-backend --region asia-southeast1 --format="value(status.url)")

# Test health
curl $SERVICE_URL/health

# Expected output:
# {"status":"healthy"}
```

### Bước 6.2: Test Root Endpoint

```bash
curl $SERVICE_URL/

# Expected output:
# {
#   "message": "Welcome to OptiChain API",
#   "version": "1.0.0",
#   "status": "running"
# }
```

### Bước 6.3: Test với Browser

1. **Mở browser**
2. **Vào Swagger UI:**
   ```
   https://optichain-backend-abc123-uc.a.run.app/docs
   ```

3. **Kiểm tra:**
   - ✅ Swagger UI load được
   - ✅ Thấy danh sách endpoints
   - ✅ Test GET /health → Response 200 OK

### Bước 6.4: Test Database Connection

**Tạo test endpoint (temporary):**

1. **Edit backend/app/main.py:**
   ```python
   @app.get("/test-db")
   async def test_db():
       from .core.database import SessionLocal
       try:
           db = SessionLocal()
           result = db.execute("SELECT 1")
           db.close()
           return {"status": "Database connected"}
       except Exception as e:
           return {"status": "Database error", "error": str(e)}
   ```

2. **Redeploy:**
   ```bash
   gcloud run deploy optichain-backend \
     --source . \
     --region asia-southeast1
   ```

3. **Test:**
   ```bash
   curl $SERVICE_URL/test-db

   # Expected:
   # {"status":"Database connected"}
   ```

---

## 7. Troubleshooting

### Issue 1: Build Failed

**Error:**
```
ERROR: failed to solve: process "/bin/sh -c pip install..." did not complete successfully
```

**Solution:**
```bash
# Check Dockerfile syntax
cat backend/Dockerfile

# Check requirements.txt
cat backend/requirements.txt

# Test build locally
cd backend
docker build -t test-backend .
```

### Issue 2: Deployment Timeout

**Error:**
```
ERROR: (gcloud.run.deploy) Revision failed with message: Ready condition status changed to False
```

**Solution:**
```bash
# Increase timeout
gcloud run deploy optichain-backend \
  --timeout 600 \
  --memory 1Gi
```

### Issue 3: Database Connection Failed

**Error in logs:**
```
could not connect to server: Connection refused
```

**Solution:**

1. **Check Cloud SQL instance is running:**
   ```bash
   gcloud sql instances describe optichain-db
   # Status should be RUNNABLE
   ```

2. **Verify connection string:**
   ```bash
   # Check env vars
   gcloud run services describe optichain-backend \
     --region asia-southeast1 \
     --format="value(spec.template.spec.containers.env)"
   ```

3. **Check Cloud SQL connection is added:**
   ```bash
   gcloud run services describe optichain-backend \
     --region asia-southeast1 \
     --format="value(spec.template.metadata.annotations)"

   # Should see: run.googleapis.com/cloudsql-instances
   ```

### Issue 4: 403 Forbidden

**Error:**
```
Error: Forbidden
Your client does not have permission to get URL
```

**Solution:**
```bash
# Make service public
gcloud run services add-iam-policy-binding optichain-backend \
  --region asia-southeast1 \
  --member="allUsers" \
  --role="roles/run.invoker"
```

### Issue 5: Check Logs

```bash
# View recent logs
gcloud run services logs read optichain-backend \
  --region asia-southeast1 \
  --limit 50

# Follow logs (real-time)
gcloud run services logs tail optichain-backend \
  --region asia-southeast1
```

### Issue 6: Out of Memory

**Error in logs:**
```
Memory limit exceeded
```

**Solution:**
```bash
# Increase memory
gcloud run deploy optichain-backend \
  --memory 1Gi \
  --region asia-southeast1
```

---

## 8. Update Backend (Redeploy)

### Sau khi sửa code:

```bash
# Navigate to project root
cd c:\Users\PC\Documents\aura

# Commit changes
git add backend/
git commit -m "Update backend code"

# Redeploy
cd backend
gcloud run deploy optichain-backend \
  --source . \
  --region asia-southeast1

# Verify
curl https://your-service-url.run.app/health
```

---

## 9. Environment Variables Management

### View current env vars:
```bash
gcloud run services describe optichain-backend \
  --region asia-southeast1 \
  --format="value(spec.template.spec.containers.env)"
```

### Update env vars:
```bash
gcloud run services update optichain-backend \
  --region asia-southeast1 \
  --update-env-vars "NEW_VAR=value,ANOTHER_VAR=value"
```

### Remove env var:
```bash
gcloud run services update optichain-backend \
  --region asia-southeast1 \
  --remove-env-vars "VAR_TO_REMOVE"
```

---

## 10. Cost Optimization

### For development/testing:

```bash
# Set min instances to 0 (scale to zero when not in use)
gcloud run services update optichain-backend \
  --region asia-southeast1 \
  --min-instances 0 \
  --max-instances 3

# Use smaller memory
gcloud run deploy optichain-backend \
  --memory 512Mi \
  --cpu 1
```

### For production:

```bash
# Keep 1 instance warm
gcloud run services update optichain-backend \
  --region asia-southeast1 \
  --min-instances 1 \
  --max-instances 10

# More resources
gcloud run deploy optichain-backend \
  --memory 1Gi \
  --cpu 2
```

---

## 11. Next Steps

✅ Backend đã deploy thành công!

**Tiếp theo:**

1. **Copy Service URL** cho frontend:
   ```bash
   gcloud run services describe optichain-backend \
     --region asia-southeast1 \
     --format="value(status.url)"
   ```

2. **Update frontend `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=https://optichain-backend-abc123-uc.a.run.app/api/v1
   ```

3. **Deploy Frontend:** Follow [Deploy Frontend Guide](DEPLOY-FRONTEND-FIREBASE.md)

4. **Setup Custom Domain (Optional):**
   - Cloud Run → optichain-backend → MANAGE CUSTOM DOMAINS
   - Add domain: api.yourdomain.com

5. **Setup SSL (Automatic):**
   - Cloud Run tự động provision SSL certificate

6. **Setup Monitoring:**
   - Cloud Run → optichain-backend → LOGS
   - Setup alerts cho errors

---

## 📞 Support

Nếu gặp vấn đề:
1. Check logs: `gcloud run services logs read optichain-backend --region asia-southeast1`
2. Check service status: `gcloud run services describe optichain-backend --region asia-southeast1`
3. Review [Troubleshooting](#7-troubleshooting) section
4. Contact team lead

---

**Last updated**: 2025-12-26
**Tested on**: Windows 11, macOS Sonoma, Ubuntu 22.04
