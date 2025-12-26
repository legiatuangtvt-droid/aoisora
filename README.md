# OptiChain WS & DWS - Version 1.0

Hệ thống quản lý công việc và lịch trình tổng hợp kết hợp WS (Work Schedule) và DWS (Dispatch Work Schedule).

## Cấu trúc Project

```
├── backend/          # Python Backend (FastAPI)
├── frontend/         # Next.js Web Application
├── mobile/          # Flutter Mobile App (iOS/Android)
├── docs/            # Tài liệu thiết kế và API
├── legacy/          # Code cũ để tham khảo
│   ├── officepc/    # WS cũ (PHP)
│   └── refactor-dws/# DWS cũ (Firebase)
└── database/        # Database schema và migrations
```

## Tech Stack

### Backend
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **Database**: PostgreSQL 15+
- **ORM**: SQLAlchemy
- **Authentication**: JWT

### Frontend Web
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 18+
- **Styling**: Tailwind CSS
- **State Management**: Zustand / React Query

### Mobile
- **Framework**: Flutter 3.16+
- **Language**: Dart
- **State Management**: Riverpod / Bloc

## Tính năng chính

### Từ WS (Work Schedule)
- Quản lý Task và Checklist
- Phân công công việc (HQ → Manager → Staff)
- Notifications & SSE
- Báo cáo và theo dõi tiến độ
- Upload files/images

### Từ DWS (Dispatch Work Schedule)
- Quản lý ca làm việc (Shift Management)
- Đăng ký và phân công ca
- Template công việc hàng ngày/tháng
- Quản lý nhân viên và cửa hàng
- Tính toán và tối ưu lịch trình

## Development

Xem hướng dẫn chi tiết trong từng thư mục:
- [Backend Setup](backend/README.md)
- [Frontend Setup](frontend/README.md)
- [Mobile Setup](mobile/README.md)

## Database

- **Database**: PostgreSQL
- **Schema**: Xem [database/schema.sql](database/schema.sql)
- **Migrations**: Alembic (Python)

## Deployment

### Production Stack
- **Backend**: Google Cloud Run (FastAPI + Python)
- **Frontend**: Firebase Hosting (Next.js Static)
- **Mobile**: Codemagic CI/CD (iOS + Android)
- **Database**: Cloud SQL PostgreSQL

### Quick Deploy

```bash
# Deploy backend to Cloud Run
./scripts/deploy-backend.sh

# Deploy frontend to Firebase
./scripts/deploy-frontend.sh

# Mobile: Push to GitHub triggers Codemagic build
git push origin develop_WS_DWS_ver1
```

### Documentation

**🆓 Deploy Miễn Phí (Recommended cho Testing):**
- [FREE Deployment Guide](docs/DEPLOY-FREE-ALTERNATIVES.md) - Railway + Vercel + Supabase ($0/tháng)

**💰 Deploy Production (Khi có budget):**
- [Backend → Cloud Run](docs/DEPLOY-BACKEND-CLOUDRUN.md) - Step-by-step deploy Backend
- [Frontend → Firebase](docs/DEPLOY-FRONTEND-FIREBASE.md) - Step-by-step deploy Frontend
- [Full Stack Guide](docs/DEPLOYMENT.md) - Tổng quan deployment

**📱 Mobile:**
- [Codemagic Config](codemagic.yaml) - CI/CD configuration cho iOS & Android

## License

Proprietary - Aoi Sora Project
