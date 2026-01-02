'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TodoFilters } from '@/types/todoTask';
import {
  mockWeekInfo,
  mockOverviewTasks,
  mockLastWeekTasks,
  mockDailyTasks,
  mockManagerComments,
  mockOtherComments,
} from '@/data/mockTodoTask';
import WeekHeader from '@/components/tasks/todo/WeekHeader';
import OverallWeekPanel from '@/components/tasks/todo/OverallWeekPanel';
import LastWeekReviewPanel from '@/components/tasks/todo/LastWeekReviewPanel';
import FilterBar from '@/components/tasks/todo/FilterBar';
import CalendarView from '@/components/tasks/todo/CalendarView';
import ManagerCommentPanel from '@/components/tasks/todo/ManagerCommentPanel';

export default function TodoTaskPage() {
  const router = useRouter();

  // State
  const [filters, setFilters] = useState<TodoFilters>({
    user: 'all',
    status: 'all',
    type: 'all',
  });
  const [isPanelsExpanded, setIsPanelsExpanded] = useState(true);
  const [showComments, setShowComments] = useState(false);

  const handleAddNew = () => {
    router.push('/tasks/new');
  };

  const handlePrevWeek = () => {
    // TODO: Implement week navigation
    console.log('Navigate to previous week');
  };

  const handleNextWeek = () => {
    // TODO: Implement week navigation
    console.log('Navigate to next week');
  };

  const handleTargetChange = (taskId: string, value: string) => {
    // TODO: Implement target update
    console.log('Update target:', taskId, value);
  };

  const handleTaskClick = (task: { id: string; name: string }) => {
    // TODO: Open task detail modal
    console.log('Task clicked:', task);
  };

  const handleStatusChange = (taskId: string) => {
    // TODO: Open status dropdown
    console.log('Change status:', taskId);
  };

  const handleAddManagerComment = (content: string) => {
    // TODO: Add manager comment
    console.log('Add manager comment:', content);
  };

  const handleAddOtherComment = (content: string) => {
    // TODO: Add other comment
    console.log('Add other comment:', content);
  };

  // Filter daily tasks based on filters
  const filteredDailyTasks = mockDailyTasks.map((day) => ({
    ...day,
    tasks: day.tasks.filter((task) => {
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.type !== 'all' && task.type !== filters.type) return false;
      return true;
    }),
  }));

  const totalComments = mockManagerComments.length + mockOtherComments.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 sm:p-6">
        {/* Week Header */}
        <WeekHeader weekInfo={mockWeekInfo} onAddNew={handleAddNew} />

        {/* Row 1: Overview Panels - Stack on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <OverallWeekPanel
            weekNumber={mockWeekInfo.weekNumber}
            tasks={mockOverviewTasks}
            onTargetChange={handleTargetChange}
            isExpanded={isPanelsExpanded}
            onToggle={() => setIsPanelsExpanded(!isPanelsExpanded)}
          />
          <LastWeekReviewPanel
            weekNumber={mockWeekInfo.weekNumber - 1}
            tasks={mockLastWeekTasks}
            isExpanded={isPanelsExpanded}
            onToggle={() => setIsPanelsExpanded(!isPanelsExpanded)}
          />
        </div>

        {/* Filter Bar */}
        <FilterBar filters={filters} onFiltersChange={setFilters} />

        {/* Mobile: Tab navigation between Calendar and Comments */}
        <div className="sm:hidden mb-4">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowComments(false)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                !showComments
                  ? 'border-pink-600 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setShowComments(true)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                showComments
                  ? 'border-pink-600 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Comments ({totalComments})
            </button>
          </div>
        </div>

        {/* Mobile: Show Calendar or Comments based on tab */}
        <div className="sm:hidden">
          {!showComments ? (
            <CalendarView
              weekInfo={mockWeekInfo}
              dailyTasks={filteredDailyTasks}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              onTaskClick={handleTaskClick}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <ManagerCommentPanel
              managerComments={mockManagerComments}
              otherComments={mockOtherComments}
              onAddManagerComment={handleAddManagerComment}
              onAddOtherComment={handleAddOtherComment}
            />
          )}
        </div>

        {/* Desktop: Row 2: Calendar View + Manager Comments side by side */}
        <div className="hidden sm:grid grid-cols-12 gap-6">
          {/* Calendar View */}
          <div className="col-span-12 lg:col-span-9">
            <CalendarView
              weekInfo={mockWeekInfo}
              dailyTasks={filteredDailyTasks}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              onTaskClick={handleTaskClick}
              onStatusChange={handleStatusChange}
            />
          </div>

          {/* Manager Comments - Hidden on tablet, shown on desktop */}
          <div className="hidden lg:block col-span-3">
            <ManagerCommentPanel
              managerComments={mockManagerComments}
              otherComments={mockOtherComments}
              onAddManagerComment={handleAddManagerComment}
              onAddOtherComment={handleAddOtherComment}
            />
          </div>
        </div>

        {/* Tablet: Comments below calendar */}
        <div className="hidden sm:block lg:hidden mt-6">
          <ManagerCommentPanel
            managerComments={mockManagerComments}
            otherComments={mockOtherComments}
            onAddManagerComment={handleAddManagerComment}
            onAddOtherComment={handleAddOtherComment}
          />
        </div>
      </div>

      {/* Mobile FAB for Add New */}
      <button
        onClick={handleAddNew}
        className="sm:hidden fixed bottom-20 right-4 w-14 h-14 bg-pink-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-700 active:scale-95 transition-all z-40"
        aria-label="Add new task"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
