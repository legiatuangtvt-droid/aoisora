# Manual Module - Knowledge Base

## Overview

Module quản lý tài liệu hướng dẫn, knowledge base cho nhân viên.

## Screens

| Screen | Spec File | Description |
|--------|-----------|-------------|
| Browse | TBD | Duyệt tài liệu theo thư mục |
| Document Detail | TBD | Chi tiết tài liệu với các bước |
| Search | TBD | Tìm kiếm tài liệu |

## Frontend Path

```
/frontend/src/app/manual/
```

## Backend Controllers

- `ManualFolderController`
- `ManualDocumentController`
- `ManualStepController`
- `ManualMediaController`

## API Routes

```
/api/v1/manual/browse
/api/v1/manual/search
/api/v1/manual/folders
/api/v1/manual/documents
/api/v1/manual/steps
/api/v1/manual/media
```

## Status

| Feature | Status |
|---------|--------|
| Folders CRUD | ✅ Done (Backend) |
| Documents CRUD | ✅ Done (Backend) |
| Steps CRUD | ✅ Done (Backend) |
| Media Upload | ✅ Done (Backend) |
| Frontend | ⏳ Pending |
