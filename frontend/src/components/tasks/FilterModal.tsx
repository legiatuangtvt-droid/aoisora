'use client';

import { useState, useEffect, useMemo } from 'react';
import { TaskFilters, TaskStatus, HQCheckStatus, Department } from '@/types/tasks';
import { Department as ApiDepartment } from '@/types/api';

type FilterSection = 'department' | 'status' | 'hqCheck' | null;

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TaskFilters;
  onApplyFilters: (filters: TaskFilters) => void;
  departments: ApiDepartment[];
  isHQUser?: boolean;
}

// Status options based on user type
// HQ users (G2-G9): APPROVE → DRAFT → OVERDUE → NOT_YET → ON_PROGRESS → DONE
// Store users (S1-S6): OVERDUE → NOT_YET → ON_PROGRESS → DONE
const HQ_STATUS_OPTIONS: TaskStatus[] = ['APPROVE', 'DRAFT', 'OVERDUE', 'NOT_YET', 'ON_PROGRESS', 'DONE'];
const STORE_STATUS_OPTIONS: TaskStatus[] = ['OVERDUE', 'NOT_YET', 'ON_PROGRESS', 'DONE'];

// HQ Check options - only 2 statuses (different from Task Status)
// NOT_YET = chưa kiểm tra, DONE = đã kiểm tra xong
const HQ_CHECK_OPTIONS: HQCheckStatus[] = ['NOT_YET', 'DONE'];

export default function FilterModal({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  departments,
  isHQUser = true,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<TaskFilters>(filters);
  const [selectedDepts, setSelectedDepts] = useState<Set<string>>(
    new Set(filters.departments)
  );
  const [expandedSection, setExpandedSection] = useState<FilterSection>(null);

  // Helper: Format division display name
  // Show "Name (CODE)" for meaningful abbreviations (like PERI, GRO)
  // Hide code only if it's exactly the same as name (like Delica, D&D, CS)
  const formatDivisionName = (name: string, code: string): string => {
    if (!code) return name;

    // Only hide code if it's exactly the same as name (case-insensitive)
    // Examples: "Delica" with code "Delica" → show "Delica"
    //           "D&D" with code "D&D" → show "D&D"
    if (code.toUpperCase() === name.toUpperCase()) return name;

    // Show code for all other cases
    // Examples: "Perisable" with code "PERI" → show "Perisable (PERI)"
    //           "Grocery" with code "GRO" → show "Grocery (GRO)"
    return `${name} (${code})`;
  };

  // Transform flat API departments to hierarchical structure
  const hierarchicalDepts = useMemo((): Department[] => {
    // Get parent departments (no parent_id)
    const parents = departments
      .filter((d) => d.parent_id === null)
      .sort((a, b) => a.sort_order - b.sort_order);

    return parents.map((parent) => {
      // Find children for this parent
      const children = departments
        .filter((d) => d.parent_id === parent.department_id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((child) => ({
          id: String(child.department_id),
          name: formatDivisionName(child.department_name, child.department_code || ''),
          code: child.department_code || '',
          level: 2,
        }));

      return {
        id: String(parent.department_id),
        name: `${parent.sort_order}. ${parent.department_name}`,
        code: parent.department_code || '',
        level: 1,
        children: children.length > 0 ? children : undefined,
      };
    });
  }, [departments]);

  // Auto-apply filters whenever they change
  useEffect(() => {
    onApplyFilters({
      ...localFilters,
      departments: Array.from(selectedDepts),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localFilters, selectedDepts]);

  if (!isOpen) return null;

  // Toggle section - only one can be open at a time
  const toggleSection = (section: FilterSection) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Find parent department for a child
  const findParentDept = (childId: string): Department | undefined => {
    return hierarchicalDepts.find(
      (parent) => parent.children?.some((child) => child.id === childId)
    );
  };

  // Handle department checkbox - with parent-child logic
  const handleDeptToggle = (dept: Department, isChild: boolean = false) => {
    const newSelected = new Set(selectedDepts);

    if (newSelected.has(dept.id)) {
      // Uncheck: remove self and children
      newSelected.delete(dept.id);
      if (dept.children) {
        dept.children.forEach((child) => newSelected.delete(child.id));
      }

      // If this is a child, uncheck parent (since not all children are selected anymore)
      if (isChild) {
        const parent = findParentDept(dept.id);
        if (parent) {
          // Always uncheck parent when any child is unchecked
          // This follows the principle: parent checked = all children checked
          newSelected.delete(parent.id);
        }
      }
    } else {
      // Check: add self and children
      newSelected.add(dept.id);
      if (dept.children) {
        dept.children.forEach((child) => newSelected.add(child.id));
      }

      // If this is a child, check if ALL siblings are now selected
      if (isChild) {
        const parent = findParentDept(dept.id);
        if (parent && parent.children) {
          const allChildrenSelected = parent.children.every((child) =>
            newSelected.has(child.id)
          );
          // Only check parent if ALL children are selected
          if (allChildrenSelected) {
            newSelected.add(parent.id);
          }
        }
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

  // Reset all filters (auto-apply via useEffect)
  const handleReset = () => {
    setLocalFilters({
      viewScope: 'All team',
      departments: [],
      status: [],
      hqCheck: [],
    });
    setSelectedDepts(new Set());
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed right-0 top-0 bottom-0 w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filter</h2>
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
        <div>
          {/* View Scope */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              View Scope
            </label>
            <select
              value={localFilters.viewScope}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, viewScope: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="All team">All team</option>
              <option value="My Tasks">My Tasks (created by me)</option>
            </select>
          </div>

          {/* Department - Accordion Section */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toggleSection('department')}
              className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
              <div className="px-6 pb-4 pt-3 animate-fade-in-down">
              {hierarchicalDepts.map((dept, index) => (
                <div key={dept.id}>
                  <div className="py-3">
                    {/* Level 1 - Parent */}
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedDepts.has(dept.id)}
                        onChange={() => handleDeptToggle(dept)}
                        className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {dept.name}
                      </span>
                    </label>

                    {/* Level 2 - Children as horizontal checkboxes */}
                    {dept.children && (
                      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                        {dept.children.map((child) => (
                          <label
                            key={child.id}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDepts.has(child.id)}
                              onChange={() => handleDeptToggle(child, true)}
                              className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {child.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Divider between departments */}
                  {index < hierarchicalDepts.length - 1 && (
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                  )}
                </div>
              ))}
              </div>
            )}
          </div>

          {/* Status - Accordion Section */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toggleSection('status')}
              className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
              <div className="px-6 pb-4 pt-3 animate-fade-in-down">
                <div className="flex flex-wrap gap-2">
              {(isHQUser ? HQ_STATUS_OPTIONS : STORE_STATUS_OPTIONS).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusToggle(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                    localFilters.status.includes(status)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {status === 'NOT_YET' ? 'Not Yet' : status === 'ON_PROGRESS' ? 'On Progress' : status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
                </div>
              </div>
            )}
          </div>

          {/* HQ Check - Accordion Section */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toggleSection('hqCheck')}
              className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
              <div className="px-6 pb-4 pt-3 animate-fade-in-down">
                <div className="flex flex-wrap gap-2">
              {HQ_CHECK_OPTIONS.map((hqCheck) => (
                <button
                  key={hqCheck}
                  onClick={() => handleHQCheckToggle(hqCheck)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                    localFilters.hqCheck.includes(hqCheck)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {hqCheck === 'NOT_YET' ? 'Not Yet' : 'Done'}
                </button>
              ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Reset Button */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
          <button
            onClick={handleReset}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
              selectedDepts.size > 0 || localFilters.status.length > 0 || localFilters.hqCheck.length > 0
                ? 'border-[#C5055B] bg-[#C5055B] text-white hover:bg-[#A00449]'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 16c1.671 0 3-1.331 3-3s-1.329-3-3-3s-3 1.331-3 3s1.329 3 3 3"/>
              <path fill="currentColor" d="M20.817 11.186a8.9 8.9 0 0 0-1.355-3.219a9 9 0 0 0-2.43-2.43a9 9 0 0 0-3.219-1.355a9 9 0 0 0-1.838-.18V2L8 5l3.975 3V6.002c.484-.002.968.044 1.435.14a7 7 0 0 1 2.502 1.053a7 7 0 0 1 1.892 1.892A6.97 6.97 0 0 1 19 13a7 7 0 0 1-.55 2.725a7 7 0 0 1-.644 1.188a7 7 0 0 1-.858 1.039a7.03 7.03 0 0 1-3.536 1.907a7.1 7.1 0 0 1-2.822 0a7 7 0 0 1-2.503-1.054a7 7 0 0 1-1.89-1.89A7 7 0 0 1 5 13H3a9 9 0 0 0 1.539 5.034a9.1 9.1 0 0 0 2.428 2.428A8.95 8.95 0 0 0 12 22a9 9 0 0 0 1.814-.183a9 9 0 0 0 3.218-1.355a9 9 0 0 0 1.331-1.099a9 9 0 0 0 1.1-1.332A8.95 8.95 0 0 0 21 13a9 9 0 0 0-.183-1.814"/>
            </svg>
            RESET
          </button>
        </div>
      </div>
    </>
  );
}
