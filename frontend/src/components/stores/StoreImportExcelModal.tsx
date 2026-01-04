'use client';

import React, { useState, useRef, useCallback } from 'react';

interface StoreImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<ImportResult>;
}

interface ImportResult {
  success: boolean;
  message: string;
  imported?: number;
  errors?: string[];
}

interface PreviewData {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

const StoreImportExcelModal: React.FC<StoreImportExcelModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setImporting(false);
    setIsDragging(false);
  }, []);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];
    const validExtensions = ['.xlsx', '.xls', '.csv'];

    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

    if (!validTypes.includes(file.type) && !validExtensions.includes(extension)) {
      setError('Please upload a valid Excel file (.xlsx, .xls) or CSV file');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return false;
    }

    return true;
  };

  const parseCSVPreview = async (file: File): Promise<PreviewData> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0]?.split(',').map(h => h.trim().replace(/^"|"$/g, '')) || [];
        const rows = lines.slice(1, 6).map(line =>
          line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
        );
        resolve({
          headers,
          rows,
          totalRows: lines.length - 1,
        });
      };
      reader.readAsText(file);
    });
  };

  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    setResult(null);

    if (!validateFile(selectedFile)) {
      return;
    }

    setFile(selectedFile);

    if (selectedFile.name.toLowerCase().endsWith('.csv')) {
      try {
        const previewData = await parseCSVPreview(selectedFile);
        setPreview(previewData);
      } catch {
        setError('Failed to parse file preview');
      }
    } else {
      setPreview({
        headers: ['(Excel preview requires server-side processing)'],
        rows: [],
        totalRows: 0,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setError(null);

    try {
      const importResult = await onImport(file);
      setResult(importResult);

      if (importResult.success) {
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Store import template
    const headers = ['store_code', 'store_name', 'region', 'address', 'phone', 'email', 'manager_code'];
    const sampleRows = [
      ['ST001', 'Ocean Park Store 1', 'OCEAN', '123 Ocean Street, Hanoi', '+84123456789', 'oceanpark1@store.com', 'MGR001'],
      ['ST002', 'Ha Dong Store 2', 'HA DONG', '456 Ha Dong Street, Hanoi', '+84987654321', 'hadong2@store.com', 'MGR002'],
    ];

    const csvContent = [headers.join(','), ...sampleRows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'store_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[10px] w-full max-w-[600px] max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E8]">
          <h2 className="text-[20px] font-bold text-[#333333]">Import Stores</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-[#6B6B6B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Instructions */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-[13px] text-blue-700">
              Import stores and their basic information. Required columns: store_code, store_name, region.
            </p>
          </div>

          {/* Download Template */}
          <div className="mb-6">
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-2 text-[14px] text-[#0664E9] hover:underline"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Template
            </button>
            <p className="text-[12px] text-[#6B6B6B] mt-1">
              Download the template file to see the required format and sample data
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-[#0664E9] bg-blue-50'
                : file
                  ? 'border-green-400 bg-green-50'
                  : 'border-[#E8E8E8] hover:border-[#9B9B9B]'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleInputChange}
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#333333]">{file.name}</p>
                  <p className="text-[12px] text-[#6B6B6B]">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setResult(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="text-[13px] text-[#DC2626] hover:underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#6B6B6B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] text-[#333333]">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#0664E9] hover:underline font-medium"
                    >
                      Click to upload
                    </button>
                    {' '}or drag and drop
                  </p>
                  <p className="text-[12px] text-[#6B6B6B] mt-1">
                    Excel (.xlsx, .xls) or CSV files up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          {preview && preview.headers.length > 0 && preview.rows.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[14px] font-medium text-[#333333] mb-3">
                Preview ({preview.totalRows} rows)
              </h3>
              <div className="border border-[#E8E8E8] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="bg-gray-50">
                        {preview.headers.map((header, index) => (
                          <th
                            key={index}
                            className="px-3 py-2 text-left font-medium text-[#333333] whitespace-nowrap border-b border-[#E8E8E8]"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-3 py-2 text-[#6B6B6B] whitespace-nowrap border-b border-[#E8E8E8]"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {preview.totalRows > 5 && (
                  <div className="px-3 py-2 text-[12px] text-[#6B6B6B] bg-gray-50 text-center">
                    Showing 5 of {preview.totalRows} rows
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-[13px] text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Result Message */}
          {result && (
            <div className={`mt-4 p-3 rounded-lg ${
              result.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                )}
                <div>
                  <p className={`text-[13px] ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.message}
                  </p>
                  {result.imported !== undefined && result.success && (
                    <p className="text-[12px] text-green-600 mt-1">
                      {result.imported} stores imported successfully
                    </p>
                  )}
                  {result.errors && result.errors.length > 0 && (
                    <ul className="text-[12px] text-red-600 mt-1 list-disc list-inside">
                      {result.errors.slice(0, 5).map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                      {result.errors.length > 5 && (
                        <li>...and {result.errors.length - 5} more errors</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E8E8E8]">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-[14px] text-[#6B6B6B] hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!file || importing}
            className="px-6 py-2 text-[14px] text-white bg-[#0664E9] rounded-lg hover:bg-[#0553c7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? 'Importing...' : 'Import Stores'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreImportExcelModal;
