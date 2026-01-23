'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingIndicator';

export default function TasksPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/tasks/list');
  }, [router]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <LoadingSpinner size="lg" color="pink" />
    </div>
  );
}
