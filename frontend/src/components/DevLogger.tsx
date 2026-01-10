'use client';

import { useEffect, useRef } from 'react';

/**
 * DevLogger - Logs timestamp whenever Fast Refresh rebuilds the app
 * Only active in development mode
 */
export default function DevLogger() {
  const renderCount = useRef(0);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      renderCount.current += 1;

      const now = new Date();
      const timestamp = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      // Log with timestamp whenever component mounts/updates (Fast Refresh)
      if (renderCount.current === 1) {
        console.log(`[${timestamp}] 🚀 App initialized`);
      } else {
        console.log(`[${timestamp}] 🔄 [Fast Refresh] rebuilding (render #${renderCount.current})`);
      }
    }
  });

  return null; // This component renders nothing
}
