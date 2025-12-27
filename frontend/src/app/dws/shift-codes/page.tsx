'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  checkHealth,
  getShiftCodes,
  createShiftCode,
  updateShiftCode,
  deleteShiftCode,
  generateShiftCodes as apiGenerateShiftCodes,
} from '@/lib/api';
import type { ShiftCode, ShiftCodeCreate } from '@/types/api';

export default function ShiftCodesPage() {
  const [backendOnline, setBackendOnline] = useState(false);
  const [shiftCodes, setShiftCodes] = useState<ShiftCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showGenerator, setShowGenerator] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCode, setEditingCode] = useState<ShiftCode | null>(null);
  const [processing, setProcessing] = useState(false);

  // Manual add form state
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formStartTime, setFormStartTime] = useState('');
  const [formEndTime, setFormEndTime] = useState('');
  const [formColor, setFormColor] = useState('#4F46E5');

  // Load shift codes
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        await checkHealth();
        setBackendOnline(true);

        const data = await getShiftCodes();
        setShiftCodes(data);
      } catch (err) {
        console.error('Failed to load shift codes:', err);
        setBackendOnline(false);
        setError('Failed to connect to backend.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Calculate duration
  const calculateDuration = (startTime: string, endTime: string): number => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    let startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;

    // Handle overnight shifts
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }

    return (endMinutes - startMinutes) / 60;
  };

  // Add shift code
  const handleAddShiftCode = async () => {
    if (!formCode || !formName || !formStartTime || !formEndTime) {
      setError('Please fill in all fields.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const duration = calculateDuration(formStartTime, formEndTime);
      const data: ShiftCodeCreate = {
        shift_code: formCode.toUpperCase(),
        shift_name: formName,
        start_time: formStartTime + ':00',
        end_time: formEndTime + ':00',
        duration_hours: duration,
        color_code: formColor,
      };

      const newCode = await createShiftCode(data);
      setShiftCodes(prev => [...prev, newCode]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('Failed to add shift code:', err);
      setError('Failed to add shift code.');
    } finally {
      setProcessing(false);
    }
  };

  // Edit shift code
  const handleEditShiftCode = async () => {
    if (!editingCode || !formCode || !formName || !formStartTime || !formEndTime) {
      setError('Please fill in all fields.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const duration = calculateDuration(formStartTime, formEndTime);
      const data = {
        shift_code: formCode.toUpperCase(),
        shift_name: formName,
        start_time: formStartTime + ':00',
        end_time: formEndTime + ':00',
        duration_hours: duration,
        color_code: formColor,
      };

      const updatedCode = await updateShiftCode(editingCode.shift_code_id, data);
      setShiftCodes(prev =>
        prev.map(c => (c.shift_code_id === editingCode.shift_code_id ? updatedCode : c))
      );
      setShowEditModal(false);
      setEditingCode(null);
      resetForm();
    } catch (err) {
      console.error('Failed to update shift code:', err);
      setError('Failed to update shift code.');
    } finally {
      setProcessing(false);
    }
  };

  // Delete shift code
  const handleDeleteShiftCode = async (id: number) => {
    if (!confirm('Are you sure you want to delete this shift code?')) return;

    setProcessing(true);
    try {
      await deleteShiftCode(id);
      setShiftCodes(prev => prev.filter(c => c.shift_code_id !== id));
    } catch (err) {
      console.error('Failed to delete shift code:', err);
      setError('Failed to delete shift code.');
    } finally {
      setProcessing(false);
    }
  };

  // Generate default shift codes
  const handleGenerateDefaults = async () => {
    setProcessing(true);
    setError(null);

    try {
      const generated = await apiGenerateShiftCodes();
      setShiftCodes(prev => [...prev, ...generated]);
      setShowGenerator(false);
    } catch (err) {
      console.error('Failed to generate shift codes:', err);
      setError('Failed to generate default shift codes.');
    } finally {
      setProcessing(false);
    }
  };

  // Open edit modal
  const openEditModal = (code: ShiftCode) => {
    setEditingCode(code);
    setFormCode(code.shift_code);
    setFormName(code.shift_name);
    setFormStartTime(code.start_time.substring(0, 5));
    setFormEndTime(code.end_time.substring(0, 5));
    setFormColor(code.color_code || '#4F46E5');
    setShowEditModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormCode('');
    setFormName('');
    setFormStartTime('');
    setFormEndTime('');
    setFormColor('#4F46E5');
  };

  // Group shift codes by duration
  const groupedShiftCodes = useMemo(() => {
    const groups: Record<number, ShiftCode[]> = {};
    shiftCodes.forEach(code => {
      const duration = code.duration_hours || 0;
      if (!groups[duration]) {
        groups[duration] = [];
      }
      groups[duration].push(code);
    });
    return groups;
  }, [shiftCodes]);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-indigo-600 hover:text-indigo-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-gray-800">Quan Ly Ma Ca - Shift Codes</h1>
              {/* Backend status */}
              <div
                className={`w-3 h-3 rounded-full ${backendOnline ? 'bg-green-400' : 'bg-red-400'}`}
                title={backendOnline ? 'Backend Connected' : 'Backend Offline'}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Shift Code
              </button>
              <button
                onClick={() => setShowGenerator(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Generate Defaults
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}>&times;</button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Shift Codes List ({shiftCodes.length} codes)
              </h2>
              <div className="text-sm text-gray-500">
                Grouped by duration
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="overflow-auto max-h-[calc(100vh-250px)]">
              <table className="min-w-full">
                <thead className="bg-slate-100 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Range</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(groupedShiftCodes)
                    .sort(([a], [b]) => Number(b) - Number(a))
                    .map(([duration, codes]) => (
                      <>
                        <tr key={`header-${duration}`} className="bg-indigo-50">
                          <td colSpan={7} className="px-6 py-2 text-sm font-bold text-indigo-700">
                            {duration}h shifts ({codes.length} codes)
                          </td>
                        </tr>
                        {codes.map((code, index) => (
                          <tr key={code.shift_code_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className="px-3 py-1 rounded-full text-sm font-bold"
                                style={{
                                  backgroundColor: code.color_code || '#E5E7EB',
                                  color: '#fff',
                                }}
                              >
                                {code.shift_code}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                              {code.shift_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {code.start_time?.substring(0, 5)} - {code.end_time?.substring(0, 5)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {code.duration_hours}h
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: code.color_code || '#E5E7EB' }}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => openEditModal(code)}
                                className="text-indigo-600 hover:text-indigo-800 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteShiftCode(code.shift_code_id)}
                                className="text-red-600 hover:text-red-800"
                                disabled={processing}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </>
                    ))}
                </tbody>
              </table>

              {shiftCodes.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No shift codes found. Click &quot;Generate Defaults&quot; to create standard codes.
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Generate Defaults Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Generate Default Shift Codes</h3>
              <button onClick={() => setShowGenerator(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              This will generate the following default shift codes:
            </p>

            <ul className="list-disc list-inside text-sm text-gray-600 mb-6 space-y-1">
              <li><strong>S</strong> - Ca Sáng (Morning) 06:00 - 14:00</li>
              <li><strong>C</strong> - Ca Chiều (Afternoon) 14:00 - 22:00</li>
              <li><strong>T</strong> - Ca Tối (Night) 22:00 - 06:00</li>
              <li><strong>OFF</strong> - Nghỉ (Day Off)</li>
              <li><strong>FULL</strong> - Ca Toàn Thời (Full Day) 08:00 - 20:00</li>
            </ul>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowGenerator(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateDefaults}
                disabled={processing}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {processing ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Add Shift Code</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., S, C, V812"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="color"
                    value={formColor}
                    onChange={e => setFormColor(e.target.value)}
                    className="w-full h-10 border rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Ca Sáng, Morning Shift"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={e => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={e => setFormEndTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {formStartTime && formEndTime && (
                <div className="text-sm text-gray-500">
                  Duration: {calculateDuration(formStartTime, formEndTime)}h
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddShiftCode}
                disabled={processing}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {processing ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Edit Shift Code</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="color"
                    value={formColor}
                    onChange={e => setFormColor(e.target.value)}
                    className="w-full h-10 border rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={e => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={e => setFormEndTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {formStartTime && formEndTime && (
                <div className="text-sm text-gray-500">
                  Duration: {calculateDuration(formStartTime, formEndTime)}h
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditShiftCode}
                disabled={processing}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {processing ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
