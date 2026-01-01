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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6">
        {/* Week Header */}
        <WeekHeader weekInfo={mockWeekInfo} onAddNew={handleAddNew} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column: Overview Panels + Calendar */}
          <div className="col-span-9 space-y-6">
            {/* Overview Panels Row */}
            <div className="grid grid-cols-2 gap-6">
              <OverallWeekPanel
                weekNumber={mockWeekInfo.weekNumber}
                tasks={mockOverviewTasks}
                onTargetChange={handleTargetChange}
              />
              <LastWeekReviewPanel
                weekNumber={mockWeekInfo.weekNumber - 1}
                tasks={mockLastWeekTasks}
              />
            </div>

            {/* Filter Bar */}
            <FilterBar filters={filters} onFiltersChange={setFilters} />

            {/* Calendar View */}
            <CalendarView
              weekInfo={mockWeekInfo}
              dailyTasks={filteredDailyTasks}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              onTaskClick={handleTaskClick}
              onStatusChange={handleStatusChange}
            />
          </div>

          {/* Right Column: Manager Comments */}
          <div className="col-span-3">
            <ManagerCommentPanel
              managerComments={mockManagerComments}
              otherComments={mockOtherComments}
              onAddManagerComment={handleAddManagerComment}
              onAddOtherComment={handleAddOtherComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
