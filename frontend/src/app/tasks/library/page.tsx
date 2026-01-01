'use client';

import React, { useState, useMemo } from 'react';
import { TaskCategory, DepartmentType, TaskTemplate, TaskGroup } from '@/types/taskLibrary';
import { getFilteredTasks, officeTaskGroups, storeTaskGroups } from '@/data/mockTaskLibrary';
import TaskLibraryHeader from '@/components/library/TaskLibraryHeader';
import TaskLibraryTabs from '@/components/library/TaskLibraryTabs';
import DepartmentFilterChips from '@/components/library/DepartmentFilterChips';
import TaskSearchBar from '@/components/library/TaskSearchBar';
import TaskGroupSection from '@/components/library/TaskGroupSection';

export default function TaskLibraryPage() {
  const [activeTab, setActiveTab] = useState<TaskCategory>('office');
  const [selectedDepartments, setSelectedDepartments] = useState<DepartmentType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<DepartmentType, boolean>>({
    Admin: true,
    HR: false,
    Legal: false,
  });

  // Get available departments based on active tab
  const availableDepartments = useMemo(() => {
    const groups = activeTab === 'office' ? officeTaskGroups : storeTaskGroups;
    return groups.map(g => g.department);
  }, [activeTab]);

  // Get filtered task groups
  const filteredGroups = useMemo(() => {
    const groups = getFilteredTasks(activeTab, selectedDepartments, searchQuery);
    return groups.map(group => ({
      ...group,
      isExpanded: expandedGroups[group.department] ?? false,
    }));
  }, [activeTab, selectedDepartments, searchQuery, expandedGroups]);

  const handleTabChange = (tab: TaskCategory) => {
    setActiveTab(tab);
    setSelectedDepartments([]);
    setSearchQuery('');
  };

  const handleDepartmentToggle = (department: DepartmentType) => {
    setSelectedDepartments(prev =>
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  const handleGroupToggle = (department: DepartmentType) => {
    setExpandedGroups(prev => ({
      ...prev,
      [department]: !prev[department],
    }));
  };

  const handleCreateNew = () => {
    // TODO: Implement create new task modal
    console.log('Create new task');
  };

  const handleFilterClick = () => {
    // TODO: Implement advanced filter modal
    console.log('Open filter modal');
  };

  const handleEdit = (task: TaskTemplate) => {
    // TODO: Implement edit task
    console.log('Edit task:', task);
  };

  const handleDuplicate = (task: TaskTemplate) => {
    // TODO: Implement duplicate task
    console.log('Duplicate task:', task);
  };

  const handleDelete = (task: TaskTemplate) => {
    // TODO: Implement delete task
    console.log('Delete task:', task);
  };

  const handleViewUsage = (task: TaskTemplate) => {
    // TODO: Implement view usage stats
    console.log('View usage:', task);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <TaskLibraryHeader onCreateNew={handleCreateNew} />

        {/* Tabs */}
        <TaskLibraryTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Department Filter Chips */}
        <DepartmentFilterChips
          departments={availableDepartments}
          selectedDepartments={selectedDepartments}
          onDepartmentToggle={handleDepartmentToggle}
        />

        {/* Search and Filter Bar */}
        <TaskSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={handleFilterClick}
        />

        {/* Task Groups */}
        <div className="space-y-4">
          {filteredGroups.length > 0 ? (
            filteredGroups.map(group => (
              <TaskGroupSection
                key={group.department}
                group={group}
                onToggle={handleGroupToggle}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onViewUsage={handleViewUsage}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-gray-500 text-sm">No matching tasks found</p>
              <p className="text-gray-400 text-xs mt-1">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
