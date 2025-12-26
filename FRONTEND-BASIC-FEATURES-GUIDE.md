# Frontend Basic Features Implementation Guide

## 🎯 Goal
Add interactive features to Frontend Web to test backend connection (No login required)

## ✅ What Was Created

### 1. API Utility Library
**File**: `frontend/src/lib/api.ts`

This file provides functions to call backend API.

### 2. Updated Homepage
**File**: `frontend/src/app/page.tsx`

Homepage now shows:
- ✅ Backend connection status (real-time)
- ✅ Backend health info (message, version, status)
- ✅ Store count (if available)
- ✅ Staff count (if available)
- ✅ Navigation cards to different sections
- ✅ Loading states
- ✅ Error handling

## 📝 Step-by-Step Implementation

### Step 1: Replace `frontend/src/app/page.tsx`

Replace the entire file with this code:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { checkHealth, getStores, getStaff } from '@/lib/api';
import Link from 'next/link';

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<any>(null);
  const [stores, setStores] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Check backend health
        const health = await checkHealth();
        setBackendStatus(health);

        // Load stores (if endpoint exists)
        try {
          const storesData = await getStores();
          setStores(storesData);
        } catch (err) {
          console.log('Stores endpoint not ready yet');
        }

        // Load staff (if endpoint exists)
        try {
          const staffData = await getStaff();
          setStaff(staffData);
        } catch (err) {
          console.log('Staff endpoint not ready yet');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to backend');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            OptiChain WS & DWS
          </h1>
          <p className="text-xl text-gray-600">
            Work Schedule and Dispatch Work Schedule Management System
          </p>
        </div>

        {/* Backend Status Card */}
        <div className="mb-8">
          <div className={`p-6 rounded-xl border-2 shadow-sm ${ backendStatus
              ? 'bg-green-50 border-green-300'
              : loading
              ? 'bg-yellow-50 border-yellow-300'
              : 'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-4 h-4 rounded-full animate-pulse ${
                backendStatus ? 'bg-green-500' : loading ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-lg font-semibold">
                Backend API: {
                  backendStatus
                    ? '✅ Connected'
                    : loading
                    ? '⏳ Connecting...'
                    : '❌ Disconnected'
                }
              </span>
            </div>

            {backendStatus && (
              <div className="mt-3 p-4 bg-white rounded-lg border border-green-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Message:</span>
                    <p className="text-gray-900">{backendStatus.message}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Version:</span>
                    <p className="text-gray-900">{backendStatus.version}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Status:</span>
                    <p className="text-gray-900 capitalize">{backendStatus.status}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-3 p-4 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-sm text-red-800 font-medium">⚠️ Connection Error:</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            href="/stores"
            className="group p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-xl transition-all duration-200"
          >
            <div className="text-4xl mb-3">🏪</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600">
              Stores
            </h3>
            <p className="text-gray-600 text-sm mb-3">Manage store locations and details</p>
            {stores.length > 0 ? (
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {stores.length} stores
              </div>
            ) : (
              <div className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                Loading...
              </div>
            )}
          </Link>

          <Link
            href="/staff"
            className="group p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:shadow-xl transition-all duration-200"
          >
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-green-600">
              Staff
            </h3>
            <p className="text-gray-600 text-sm mb-3">Manage employees and assignments</p>
            {staff.length > 0 ? (
              <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {staff.length} staff
              </div>
            ) : (
              <div className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                Loading...
              </div>
            )}
          </Link>

          <Link
            href="/tasks"
            className="group p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-xl transition-all duration-200"
          >
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-purple-600">
              Tasks
            </h3>
            <p className="text-gray-600 text-sm mb-3">Work schedule and task management</p>
            <div className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
              Coming soon
            </div>
          </Link>

          <Link
            href="/shifts"
            className="group p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-xl transition-all duration-200"
          >
            <div className="text-4xl mb-3">📅</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-orange-600">
              Shifts
            </h3>
            <p className="text-gray-600 text-sm mb-3">Dispatch and schedule planning</p>
            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
              Coming soon
            </div>
          </Link>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
              <span>📊</span> WS - Work Schedule
            </h2>
            <ul className="space-y-3">
              {['Task Management', 'Checklist System', 'Notifications', 'Reporting'].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
              <span>🚛</span> DWS - Dispatch Work Schedule
            </h2>
            <ul className="space-y-3">
              {['Shift Management', 'Staff Assignment', 'Schedule Templates', 'Monthly Planning'].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">✓</span>
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Stats Dashboard */}
        {!loading && !error && backendStatus && (
          <div className="p-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg text-white">
            <h3 className="text-2xl font-bold mb-6">📈 Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-4xl font-bold mb-1">{stores.length || '0'}</div>
                <div className="text-sm opacity-90">Stores</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-4xl font-bold mb-1">{staff.length || '0'}</div>
                <div className="text-sm opacity-90">Staff Members</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-4xl font-bold mb-1">—</div>
                <div className="text-sm opacity-90">Active Tasks</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-4xl font-bold mb-1">—</div>
                <div className="text-sm opacity-90">Today's Shifts</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
```

## 🚀 Deploy to Test

After updating the code:

```bash
cd frontend
git add .
git commit -m "Add interactive homepage with backend connection"
git push origin develop_WS_DWS_ver1
```

Netlify will auto-deploy in ~2-3 minutes.

## ✅ Expected Result

When you open `https://luminous-swan-eb543e.netlify.app`:

1. **Backend Status Card** shows:
   - ✅ Green if connected
   - Backend message, version, status

2. **Store & Staff Cards** show:
   - Number of stores (from backend)
   - Number of staff (from backend)

3. **Quick Stats** shows:
   - Real data from backend

## 🔧 Troubleshooting

If you see "Disconnected":
1. Check `NEXT_PUBLIC_API_URL` in Netlify env vars
2. Check backend is awake on Render
3. Check browser Console (F12) for errors

## 📝 Next Steps

After this works, we can add:
1. Stores list page
2. Staff list page
3. Task management
4. Shift scheduling

---

Let me know when you're ready to implement this!
