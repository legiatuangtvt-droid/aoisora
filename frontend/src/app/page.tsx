'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Simple API functions
async function checkHealth() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  const response = await fetch(API_URL.replace('/api/v1', '/health'));
  return await response.json();
}

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const health = await checkHealth();
        setBackendStatus(health);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">OptiChain WS & DWS</h1>
          <p className="text-xl text-gray-600">Work Schedule and Dispatch Work Schedule Management System</p>
        </div>

        <div className={`p-6 rounded-xl border-2 mb-8 ${backendStatus ? 'bg-green-50 border-green-300' : loading ? 'bg-yellow-50 border-yellow-300' : 'bg-red-50 border-red-300'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-4 h-4 rounded-full ${backendStatus ? 'bg-green-500' : loading ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <span className="text-lg font-semibold">
              Backend API: {backendStatus ? '✅ Connected' : loading ? '⏳ Connecting...' : '❌ Disconnected'}
            </span>
          </div>
          {backendStatus && (
            <div className="p-4 bg-white rounded-lg border">
              <p><strong>Message:</strong> {backendStatus.message}</p>
              <p><strong>Version:</strong> {backendStatus.version}</p>
              <p><strong>Status:</strong> {backendStatus.status}</p>
            </div>
          )}
          {error && (
            <div className="mt-3 p-4 bg-red-100 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg bg-white">
            <h2 className="text-2xl font-semibold mb-4">WS - Work Schedule</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Task Management</li>
              <li>✓ Checklist System</li>
              <li>✓ Notifications</li>
              <li>✓ Reporting</li>
            </ul>
          </div>
          <div className="p-6 border rounded-lg bg-white">
            <h2 className="text-2xl font-semibold mb-4">DWS - Dispatch Work Schedule</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Shift Management</li>
              <li>✓ Staff Assignment</li>
              <li>✓ Schedule Templates</li>
              <li>✓ Monthly Planning</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
