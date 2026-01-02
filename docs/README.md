# Aoisora Documentation

**Project**: Aoisora - Work Schedule Management System
**Version**: 2.0
**Last Updated**: 2025-12-31

---

## Documentation Structure

```
docs/
├── 01-overview/           # Project overview & changelog
├── 02-backend/            # Laravel backend documentation
├── 03-frontend/           # Next.js frontend documentation
├── 04-database/           # Database schema & structure
├── 05-api/                # API specifications & endpoints
├── 06-deployment/         # Deployment guides
├── 07-guides/             # Development guides & troubleshooting
└── 08-design-specs/       # Design documents, presentations, wireframes
```

---

## Quick Links

### 01. Overview
| Document | Description |
|----------|-------------|
| [README.md](01-overview/README.md) | Project introduction |
| [CHANGELOG.md](01-overview/CHANGELOG.md) | Version history |

### 02. Backend (Laravel)
| Document | Description |
|----------|-------------|
| [BE_DEVELOPMENT_SETUP.md](02-backend/BE_DEVELOPMENT_SETUP.md) | Backend setup, Laravel stack decisions, environment config |
| [BE_SYSTEM_ARCHITECTURE.md](02-backend/BE_SYSTEM_ARCHITECTURE.md) | System architecture, modules, tech stack |

### 03. Frontend (Next.js)
| Document | Description |
|----------|-------------|
| *Coming soon* | Frontend documentation |

### 04. Database (PostgreSQL)
| Document | Description |
|----------|-------------|
| [DB_DATABASE_STRUCTURE.md](04-database/DB_DATABASE_STRUCTURE.md) | Complete database schema, 23 tables documentation |

### 05. API
| Document | Description |
|----------|-------------|
| [API_SPECIFICATION.md](05-api/API_SPECIFICATION.md) | API design specification |
| [API_FUNCTION_LIST.md](05-api/API_FUNCTION_LIST.md) | Complete API endpoints list |

### 06. Deployment
| Document | Description |
|----------|-------------|
| [DEPLOYMENT.md](06-deployment/DEPLOYMENT.md) | General deployment guide |
| [DEPLOY-BACKEND-CLOUDRUN.md](06-deployment/DEPLOY-BACKEND-CLOUDRUN.md) | Deploy backend to Google Cloud Run |
| [DEPLOY-FRONTEND-FIREBASE.md](06-deployment/DEPLOY-FRONTEND-FIREBASE.md) | Deploy frontend to Firebase Hosting |
| [DEPLOY-RENDER-NETLIFY-NEON.md](06-deployment/DEPLOY-RENDER-NETLIFY-NEON.md) | Alternative: Render + Netlify + Neon |
| [DEPLOY-FREE-ALTERNATIVES.md](06-deployment/DEPLOY-FREE-ALTERNATIVES.md) | Free deployment options |
| [ENVIRONMENT-VARIABLES.md](06-deployment/ENVIRONMENT-VARIABLES.md) | Environment variables reference |

### 07. Guides
| Document | Description |
|----------|-------------|
| [TROUBLESHOOT-CORS.md](07-guides/TROUBLESHOOT-CORS.md) | CORS troubleshooting |
| [CODEMAGIC-IOS-SETUP.md](07-guides/CODEMAGIC-IOS-SETUP.md) | iOS build setup with Codemagic |
| [SIDELOADLY-GUIDE.md](07-guides/SIDELOADLY-GUIDE.md) | Sideloadly installation guide |

### 08. Design Specifications
| Folder | Contents |
|--------|----------|
| [presentations/](08-design-specs/presentations/) | PowerPoint presentations |
| [excel/](08-design-specs/excel/) | Excel documents (specs, function lists) |
| [wireframes/](08-design-specs/wireframes/) | HTML wireframes |
| [wbs/](08-design-specs/wbs/) | Work Breakdown Structure |
| [others/](08-design-specs/others/) | Other documents (PDF, images, etc.) |

---

## System Modules

### Aoi WS (Work Schedule)
- Staff scheduling and shift management
- Task assignment and tracking
- Checklist management

### Aoi DWS (Dispatch Work Schedule)
- Daily work scheduling
- Task groups and templates
- Real-time status updates

### Aoi Manual (Knowledge Base)
- Document management
- Step-by-step guides
- Media attachments

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, TypeScript, TailwindCSS |
| **Backend** | Laravel 7.x → 11.x (upgrading) |
| **Database** | PostgreSQL 15+ |
| **Authentication** | Laravel Passport (OAuth2) |
| **Caching** | Redis, Spatie Response Cache |
| **Testing** | Pest PHP |
| **Monitoring** | Laravel Pulse |

---

## Getting Started

1. **Read Backend Setup**: [02-backend/BE_DEVELOPMENT_SETUP.md](02-backend/BE_DEVELOPMENT_SETUP.md)
2. **Understand Architecture**: [02-backend/BE_SYSTEM_ARCHITECTURE.md](02-backend/BE_SYSTEM_ARCHITECTURE.md)
3. **Review Database Schema**: [04-database/DB_DATABASE_STRUCTURE.md](04-database/DB_DATABASE_STRUCTURE.md)
4. **Check API Endpoints**: [05-api/API_FUNCTION_LIST.md](05-api/API_FUNCTION_LIST.md)

---

## Contributing

1. All documentation should be written in Markdown
2. Follow the folder structure above
3. Update this README when adding new documents
4. Use Vietnamese or English consistently within each document

---

**Maintained by**: Aoisora Development Team
