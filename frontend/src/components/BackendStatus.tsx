'use client';

import { useEffect, useState } from 'react';

async function checkHealth() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  const response = await fetch(`${API_URL}/health`);
  return await response.json();
}

interface BackendStatusProps {
  compact?: boolean;
}

export default function BackendStatus({ compact = false }: BackendStatusProps) {
  const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [backendInfo, setBackendInfo] = useState<any>(null);

  useEffect(() => {
    async function check() {
      try {
        const health = await checkHealth();
        setBackendInfo(health);
        setStatus('online');
      } catch {
        setStatus('offline');
      }
    }
    check();
    // Check every 30 seconds
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            status === 'online' ? 'bg-green-500' : status === 'offline' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
          }`}
          title={
            status === 'online'
              ? `Backend Online - ${backendInfo?.version || ''}`
              : status === 'offline'
              ? 'Backend Offline'
              : 'Checking...'
          }
        />
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-xl border-2 ${
        status === 'online'
          ? 'bg-green-50 border-green-300'
          : status === 'offline'
          ? 'bg-red-50 border-red-300'
          : 'bg-yellow-50 border-yellow-300'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-4 h-4 rounded-full ${
            status === 'online' ? 'bg-green-500' : status === 'offline' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
          }`}
        />
        <span className="text-lg font-semibold">
          Backend API:{' '}
          {status === 'online' ? '✅ Connected' : status === 'offline' ? '❌ Disconnected' : '⏳ Connecting...'}
        </span>
      </div>
      {backendInfo && (
        <div className="p-4 bg-white rounded-lg border">
          <p>
            <strong>Message:</strong> {backendInfo.message}
          </p>
          <p>
            <strong>Version:</strong> {backendInfo.version}
          </p>
          <p>
            <strong>Status:</strong> {backendInfo.status}
          </p>
        </div>
      )}
    </div>
  );
}
