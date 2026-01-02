# OptiChain Documentation

## Structure

```
docs/
├── README.md                    # This file
├── CHANGELOG.md                 # Version history
├── architecture/                # System design docs
│   ├── SYSTEM_ARCHITECTURE.md   # Overall system architecture
│   └── DESIGN_DOCUMENT.md       # Detailed design document
├── api/                         # API documentation
│   ├── API_SPECIFICATION.md     # API endpoints specification
│   └── API_FUNCTION_LIST.md     # List of API functions
├── deployment/                  # Deployment guides
│   ├── DEPLOYMENT.md            # General deployment overview
│   ├── DEPLOY-RENDER-NETLIFY-NEON.md  # Current stack (Render + Netlify + Neon)
│   ├── DEPLOY-BACKEND-CLOUDRUN.md     # Google Cloud Run option
│   ├── DEPLOY-FRONTEND-FIREBASE.md    # Firebase Hosting option
│   ├── DEPLOY-FREE-ALTERNATIVES.md    # Free hosting alternatives
│   └── ENVIRONMENT-VARIABLES.md       # Environment variables reference
└── guides/                      # How-to guides
    ├── TROUBLESHOOT-CORS.md     # CORS troubleshooting
    ├── CODEMAGIC-IOS-SETUP.md   # iOS build with Codemagic
    └── SIDELOADLY-GUIDE.md      # Sideloading iOS apps
```

## Quick Links

### Getting Started
- [System Architecture](architecture/SYSTEM_ARCHITECTURE.md) - Understand the system design
- [Deployment Guide](deployment/DEPLOYMENT.md) - Deploy the application

### For Developers
- [API Specification](api/API_SPECIFICATION.md) - API endpoints and usage
- [API Function List](api/API_FUNCTION_LIST.md) - Complete API reference
- [Design Document](architecture/DESIGN_DOCUMENT.md) - Technical design details

### Deployment
- [Render + Netlify + Neon](deployment/DEPLOY-RENDER-NETLIFY-NEON.md) - **Current Production Stack**
- [Environment Variables](deployment/ENVIRONMENT-VARIABLES.md) - Required env vars

### Troubleshooting
- [CORS Issues](guides/TROUBLESHOOT-CORS.md) - Fix CORS errors

## Current Stack

| Component | Service | URL |
|-----------|---------|-----|
| Frontend | Netlify | optichain-app.netlify.app |
| Backend | Render | optichain-api.onrender.com |
| Database | Neon | PostgreSQL on Neon |
