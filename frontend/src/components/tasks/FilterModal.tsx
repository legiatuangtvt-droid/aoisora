'use client';

import { useState } from 'react';
import { TaskFilters, TaskStatus, HQCheckStatus, Department } from '@/types/tasks';
import { mockDepartments } from '@/data/mockTasks';

type FilterSection = 'department' | 'status' | 'hqCheck' | null;

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TaskFilters;
  onApplyFilters: (filters: TaskFilters) => void;
}

export default function FilterModal({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<TaskFilters>(filters);
  const [selectedDepts, setSelectedDepts] = useState<Set<string>>(
    new Set(filters.departments)
  );
  const [expandedSection, setExpandedSection] = useState<FilterSection>(null);

  if (!isOpen) return null;

  // Toggle section - only one can be open at a time
  const toggleSection = (section: FilterSection) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Handle department checkbox - with parent-child logic
  const handleDeptToggle = (dept: Department) => {
    const newSelected = new Set(selectedDepts);

    if (newSelected.has(dept.id)) {
      // Uncheck: remove self and children
      newSelected.delete(dept.id);
      if (dept.children) {
        dept.children.forEach((child) => newSelected.delete(child.id));
      }
    } else {
      // Check: add self and children
      newSelected.add(dept.id);
      if (dept.children) {
        dept.children.forEach((child) => newSelected.add(child.id));
      }
    }

    setSelectedDepts(newSelected);
  };

  // Handle status chip toggle
  const handleStatusToggle = (status: TaskStatus) => {
    const newStatuses = localFilters.status.includes(status)
      ? localFilters.status.filter((s) => s !== status)
      : [...localFilters.status, status];

    setLocalFilters({ ...localFilters, status: newStatuses });
  };

  // Handle HQ Check chip toggle
  const handleHQCheckToggle = (hqCheck: HQCheckStatus) => {
    const newHQChecks = localFilters.hqCheck.includes(hqCheck)
      ? localFilters.hqCheck.filter((h) => h !== hqCheck)
      : [...localFilters.hqCheck, hqCheck];

    setLocalFilters({ ...localFilters, hqCheck: newHQChecks });
  };

  // Reset all filters
  const handleReset = () => {
    setLocalFilters({
      viewScope: 'All team',
      departments: [],
      status: [],
      hqCheck: [],
    });
    setSelectedDepts(new Set());
  };

  // Apply filters
  const handleApply = () => {
    onApplyFilters({
      ...localFilters,
      departments: Array.from(selectedDepts),
    });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* View Scope */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              View Scope
            </label>
            <select
              value={localFilters.viewScope}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, viewScope: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="All team">All team</option>
              <option value="Team A">Team A</option>
              <option value="Team B">Team B</option>
              <option value="Team C">Team C</option>
            </select>
          </div>

          {/* Department - Accordion Section */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('department')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                Department
                {selectedDepts.size > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                    {selectedDepts.size}
                  </span>
                )}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedSection === 'department' ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {expandedSection === 'department' && (
              <div className="px-4 pb-4 space-y-2 border-t border-gray-200 pt-3">
              {mockDepartments.map((dept) => (
                <div key={dept.id}>
                  {/* Level 1 - Parent */}
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedDepts.has(dept.id)}
                      onChange={() => handleDeptToggle(dept)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {dept.name} ({dept.code})
                    </span>
                  </label>

                  {/* Level 2 - Children */}
                  {dept.children && (
                    <div className="ml-6 mt-1 space-y-1">
                      {dept.children.map((child) => (
                        <label
                          key={child.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedDepts.has(child.id)}
                            onChange={() => handleDeptToggle(child)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {child.name} ({child.code})
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              </div>
            )}
          </div>

          {/* Status - Accordion Section */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('status')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                Status
                {localFilters.status.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                    {localFilters.status.length}
                  </span>
                )}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedSection === 'status' ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {expandedSection === 'status' && (
              <div className="px-4 pb-4 border-t border-gray-200 pt-3">
                <div className="flex flex-wrap gap-2">
              {(['NOT_YET', 'DONE', 'DRAFT'] as TaskStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusToggle(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    localFilters.status.includes(status)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'NOT_YET' ? 'Not Yet' : status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
                </div>
              </div>
            )}
          </div>

          {/* HQ Check - Accordion Section */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('hqCheck')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                HQ Check
                {localFilters.hqCheck.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                    {localFilters.hqCheck.length}
                  </span>
                )}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedSection === 'hqCheck' ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {expandedSection === 'hqCheck' && (
              <div className="px-4 pb-4 border-t border-gray-200 pt-3">
                <div className="flex flex-wrap gap-2">
              {(['NOT_YET', 'DONE', 'DRAFT'] as HQCheckStatus[]).map((hqCheck) => (
                <button
                  key={hqCheck}
                  onClick={() => handleHQCheckToggle(hqCheck)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    localFilters.hqCheck.includes(hqCheck)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {hqCheck === 'NOT_YET' ? 'Not Yet' : hqCheck.charAt(0) + hqCheck.slice(1).toLowerCase()}
                </button>
              ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            RESET
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            APPLY
          </button>
        </div>
      </div>
    </>
  );
}
