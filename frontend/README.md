# OptiChain Frontend

Next.js frontend application for OptiChain WS & DWS system.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React 18 + Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and API clients
│   ├── hooks/           # Custom React hooks
│   └── types/           # TypeScript types
├── public/              # Static assets
└── package.json
```

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Update the API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Building for Production

```bash
npm run build
npm start
```

## Features (Planned)

### WS - Work Schedule
- Task management dashboard
- Checklist system
- Real-time notifications
- Report generation
- File upload for task attachments

### DWS - Dispatch Work Schedule
- Shift management interface
- Staff assignment calendar
- Daily/Monthly schedule templates
- Drag-and-drop schedule builder

## Components Structure

```
components/
├── layout/          # Layout components (Header, Sidebar, etc.)
├── tasks/           # Task-related components
├── shifts/          # Shift management components
├── staff/           # Staff management components
└── common/          # Reusable UI components
```

## API Integration

API client configuration in `src/lib/api.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

## Styling

Using Tailwind CSS for styling. Configuration in `tailwind.config.ts`.

## License

Proprietary - Aoi Sora Project
