'use client';

import { useState } from 'react';
import { RETask } from '@/types/reTask';
import { exportToCSV, exportToExcel, exportToJSON } from '@/utils/reTaskExport';

interface ExportRETaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: RETask[];
  filteredCount: number;
  totalCount: number;
}

type ExportFormat = 'csv' | 'excel' | 'json';
type ExportScope = 'all' | 'filtered';

export default function ExportRETaskModal({
  isOpen,
  onClose,
  tasks,
  filteredCount,
  totalCount,
}: ExportRETaskModalProps) {
  const [format, setFormat] = useState<ExportFormat>('excel');
  const [scope, setScope] = useState<ExportScope>('filtered');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `re-task-list-${timestamp}`;

      // Small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 300));

      switch (format) {
        case 'csv':
          exportToCSV(tasks, filename);
          break;
        case 'excel':
          exportToExcel(tasks, filename);
          break;
        case 'json':
          exportToJSON(tasks, filename);
          break;
      }

      onClose();
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  const exportCount = scope === 'all' ? totalCount : filteredCount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative z-50 w-full max-w-md p-6 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Export RE Tasks
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Export Scope */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Export Scope
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="radio"
                  name="scope"
                  value="filtered"
                  checked={scope === 'filtered'}
                  onChange={(e) => setScope(e.target.value as ExportScope)}
                  className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Current View
                  </span>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    ({filteredCount} tasks)
                  </span>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="radio"
                  name="scope"
                  value="all"
                  checked={scope === 'all'}
                  onChange={(e) => setScope(e.target.value as ExportScope)}
                  className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    All Tasks
                  </span>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    ({totalCount} tasks)
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Export Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              File Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Excel */}
              <button
                onClick={() => setFormat('excel')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  format === 'excel'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <svg className="w-8 h-8 mx-auto mb-2 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.17 3.25Q21.5 3.25 21.76 3.5 22 3.74 22 4.08V19.92Q22 20.26 21.76 20.5 21.5 20.75 21.17 20.75H7.83Q7.5 20.75 7.24 20.5 7 20.26 7 19.92V17H2.83Q2.5 17 2.24 16.76 2 16.5 2 16.17V7.83Q2 7.5 2.24 7.24 2.5 7 2.83 7H7V4.08Q7 3.74 7.24 3.5 7.5 3.25 7.83 3.25M7 13.06L8.18 15.28H9.97L8 12.06L9.93 8.89H8.22L7.13 10.9L7.09 10.96L7.06 11.03Q6.8 10.5 6.5 9.96 6.25 9.43 5.97 8.89H4.16L6.05 12.08L4 15.28H5.78M13.88 19.5V17H8.25V19.5M13.88 15.75V12.63H12V15.75M13.88 11.38V8.25H12V11.38M13.88 7V4.5H8.25V7M20.75 19.5V17H15.13V19.5M20.75 15.75V12.63H15.13V15.75M20.75 11.38V8.25H15.13V11.38M20.75 7V4.5H15.13V7Z" />
                </svg>
                <span className={`text-xs font-medium ${format === 'excel' ? 'text-orange-600' : 'text-gray-600 dark:text-gray-400'}`}>
                  Excel
                </span>
              </button>

              {/* CSV */}
              <button
                onClick={() => setFormat('csv')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  format === 'csv'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <svg className="w-8 h-8 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className={`text-xs font-medium ${format === 'csv' ? 'text-orange-600' : 'text-gray-600 dark:text-gray-400'}`}>
                  CSV
                </span>
              </button>

              {/* JSON */}
              <button
                onClick={() => setFormat('json')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  format === 'json'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <svg className="w-8 h-8 mx-auto mb-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className={`text-xs font-medium ${format === 'json' ? 'text-orange-600' : 'text-gray-600 dark:text-gray-400'}`}>
                  JSON
                </span>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {format === 'excel' && 'Excel format (.xls) - Best for editing in Microsoft Excel'}
                {format === 'csv' && 'CSV format (.csv) - Universal format, works with any spreadsheet'}
                {format === 'json' && 'JSON format (.json) - Best for developers and data integration'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {isExporting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export {exportCount} Tasks
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
