'use client';

import { useState, useRef, useCallback } from 'react';
import { RETask } from '@/types/reTask';
import {
  parseCSV,
  parseJSON,
  validateImportedTasks,
  generateCSVTemplate,
} from '@/utils/reTaskExport';

interface ImportRETaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (tasks: RETask[]) => void;
}

export default function ImportRETaskModal({
  isOpen,
  onClose,
  onImport,
}: ImportRETaskModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<RETask[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setErrors([]);
    setPreview([]);

    try {
      const content = await file.text();
      let parsedTasks: Partial<RETask>[] = [];

      if (file.name.endsWith('.csv')) {
        parsedTasks = parseCSV(content);
      } else if (file.name.endsWith('.json')) {
        parsedTasks = parseJSON(content);
      } else {
        throw new Error('Unsupported file format. Please use CSV or JSON files.');
      }

      const { valid, errors: validationErrors } = validateImportedTasks(parsedTasks);

      setPreview(valid);
      setErrors(validationErrors);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Failed to parse file']);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
        processFile(droppedFile);
      }
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        processFile(selectedFile);
      }
    },
    [processFile]
  );

  const handleImport = () => {
    if (preview.length > 0) {
      onImport(preview);
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview([]);
    setErrors([]);
    setIsProcessing(false);
    onClose();
  };

  const handleDownloadTemplate = () => {
    generateCSVTemplate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative z-50 w-full max-w-2xl p-6 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Import RE Tasks
            </h3>
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drop Zone */}
          <div
            className={`relative p-8 mb-4 border-2 border-dashed rounded-lg transition-colors ${
              dragActive
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="text-center">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              {file ? (
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {file.name}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ) : (
                <>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Drag and drop</span> your file here, or
                  </p>
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                  >
                    Browse Files
                  </button>
                </>
              )}

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Supported formats: CSV, JSON
              </p>
            </div>
          </div>

          {/* Template Download */}
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  Need a template? Download the sample CSV file.
                </span>
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                Download Template
              </button>
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center py-4">
              <svg className="w-6 h-6 animate-spin text-green-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Processing file...
              </span>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                    {errors.length} error(s) found:
                  </p>
                  <ul className="text-xs text-red-600 dark:text-red-400 list-disc list-inside max-h-24 overflow-y-auto">
                    {errors.slice(0, 10).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {errors.length > 10 && (
                      <li>...and {errors.length - 10} more errors</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Preview ({preview.length} tasks ready to import)
                </span>
              </div>
              <div className="max-h-48 overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      <th className="px-2 py-1 text-left font-medium text-gray-600 dark:text-gray-300">Group</th>
                      <th className="px-2 py-1 text-left font-medium text-gray-600 dark:text-gray-300">Task Name</th>
                      <th className="px-2 py-1 text-left font-medium text-gray-600 dark:text-gray-300">Frequency</th>
                      <th className="px-2 py-1 text-center font-medium text-gray-600 dark:text-gray-300">RE Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {preview.slice(0, 10).map((task, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-2 py-1 text-gray-900 dark:text-white">{task.group}</td>
                        <td className="px-2 py-1 text-gray-900 dark:text-white truncate max-w-[150px]">{task.taskName}</td>
                        <td className="px-2 py-1 text-gray-600 dark:text-gray-400">{task.frequencyType}</td>
                        <td className="px-2 py-1 text-center text-gray-600 dark:text-gray-400">{task.reUnit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {preview.length > 10 && (
                  <div className="px-2 py-1 text-xs text-center text-gray-500 bg-gray-50 dark:bg-gray-700">
                    ...and {preview.length - 10} more tasks
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={preview.length === 0 || isProcessing}
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Import {preview.length > 0 && `(${preview.length} tasks)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
