'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TaskDetail, ViewMode, TaskDetailFilters, StoreResult, StaffResult } from '@/types/tasks';
import { mockTaskDetail, mockStoreResults, mockStaffResults } from '@/data/mockTaskDetail';
import TaskDetailHeader from '@/components/tasks/TaskDetailHeader';
import TaskFilterBar from '@/components/tasks/TaskFilterBar';
import StoreResultCard from '@/components/tasks/StoreResultCard';
import StaffCard from '@/components/tasks/StaffCard';

interface TaskDetailClientProps {
  taskId: string;
}

export default function TaskDetailClient({ taskId }: TaskDetailClientProps) {
  const router = useRouter();

  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('results');
  const [filters, setFilters] = useState<TaskDetailFilters>({
    region: 'all',
    area: 'all',
    store: 'all',
    location: 'all',
    status: 'all',
    search: '',
  });

  // Store and Staff results
  const [storeResults, setStoreResults] = useState<StoreResult[]>([]);
  const [staffResults, setStaffResults] = useState<StaffResult[]>([]);

  useEffect(() => {
    // Simulate API call - replace with actual API later
    const loadData = async () => {
      setLoading(true);
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Load task detail
      if (mockTaskDetail.id === taskId || taskId) {
        setTask(mockTaskDetail);
        setStoreResults(mockStoreResults);
        setStaffResults(mockStaffResults);
      }
      setLoading(false);
    };

    loadData();
  }, [taskId]);

  // Filter store results based on filters
  const filteredStoreResults = storeResults.filter(result => {
    if (filters.region !== 'all' && !result.storeLocation.toLowerCase().includes(filters.region.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'all' && result.status !== filters.status) {
      return false;
    }
    return true;
  });

  // Filter staff results based on filters
  const filteredStaffResults = staffResults.filter(result => {
    if (filters.location !== 'all' && result.store.toLowerCase() !== filters.location.toLowerCase()) {
      return false;
    }
    if (filters.status !== 'all' && result.status !== filters.status) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        result.staffName.toLowerCase().includes(searchLower) ||
        result.staffId.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const handleAddComment = (storeId: string, content: string) => {
    console.log('Add comment to store:', storeId, content);
    // TODO: Implement API call to add comment
  };

  const handleSendReminder = (staffId: string) => {
    console.log('Send reminder to staff:', staffId);
    // TODO: Implement API call to send reminder
  };

  const handleStaffComment = (staffId: string, content: string) => {
    console.log('Add comment to staff:', staffId, content);
    // TODO: Implement API call to add comment
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Task Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The task you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/tasks/list')}
            className="px-4 py-2 bg-[#C5055B] text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  // Determine if we should show staff view filters
  const isStaffView = viewMode === 'results' && filteredStaffResults.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => router.push('/tasks/list')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to List
          </button>
        </div>

        {/* Task Header */}
        <TaskDetailHeader task={task} />

        {/* Filter Bar */}
        <TaskFilterBar
          filters={filters}
          onFilterChange={setFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showStaffFilters={isStaffView}
        />

        {/* Content based on view mode */}
        {viewMode === 'results' && (
          <div className="space-y-6">
            {/* Store Results */}
            {filteredStoreResults.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Store Results ({filteredStoreResults.length})
                </h3>
                {filteredStoreResults.map((result) => (
                  <StoreResultCard
                    key={result.storeId}
                    result={result}
                    onAddComment={handleAddComment}
                  />
                ))}
              </div>
            )}

            {/* Staff Results Grid */}
            {filteredStaffResults.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Staff Progress ({filteredStaffResults.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStaffResults.map((staff) => (
                    <StaffCard
                      key={staff.id}
                      staff={staff}
                      onSendReminder={handleSendReminder}
                      onAddComment={handleStaffComment}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredStoreResults.length === 0 && filteredStaffResults.length === 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">No results found matching your filters.</p>
              </div>
            )}
          </div>
        )}

        {viewMode === 'comment' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              All Comments
            </h3>
            {/* Show store results with comments only view */}
            {filteredStoreResults.map((result) => (
              <StoreResultCard
                key={result.storeId}
                result={result}
                showImages={false}
                onAddComment={handleAddComment}
              />
            ))}

            {filteredStoreResults.length === 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">No comments found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
