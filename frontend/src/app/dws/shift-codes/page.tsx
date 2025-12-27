'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  checkHealth,
  getShiftCodes,
  createShiftCode,
  deleteShiftCode,
} from '@/lib/api';
import type { ShiftCode, ShiftCodeCreate } from '@/types/api';

export default function ShiftCodesPage() {
  const { t } = useLanguage();
  const [backendOnline, setBackendOnline] = useState(false);
  const [shiftCodes, setShiftCodes] = useState<ShiftCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Auto-generator form state
  const [genChar, setGenChar] = useState('V');
  const [genDurationMin, setGenDurationMin] = useState(4);
  const [genDurationMax, setGenDurationMax] = useState(9);
  const [genStartTime, setGenStartTime] = useState('05:30');
  const [genEndTime, setGenEndTime] = useState('23:00');

  // Manual add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [manualStartTime, setManualStartTime] = useState('');
  const [manualEndTime, setManualEndTime] = useState('');

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
        setError('Không thể kết nối đến server.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Calculate duration between two times
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

  // Format time for display
  const formatTimeRange = (start: string, end: string): string => {
    const startFormatted = start?.substring(0, 5) || '';
    const endFormatted = end?.substring(0, 5) || '';
    return `${startFormatted} - ${endFormatted}`;
  };

  // Generate shift codes automatically
  const handleGenerateShiftCodes = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!genChar || genChar.length !== 1 || !/[A-Z]/i.test(genChar)) {
      setError('Ký tự phải là một chữ cái A-Z.');
      return;
    }

    if (genDurationMin >= genDurationMax) {
      setError('Số giờ tối thiểu phải nhỏ hơn số giờ tối đa.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const generatedCodes: ShiftCode[] = [];
      const letter = genChar.toUpperCase();

      // Generate codes for each duration from min to max (step 0.5)
      for (let duration = genDurationMin; duration <= genDurationMax; duration += 0.5) {
        // Parse start and end times
        const [startH, startM] = genStartTime.split(':').map(Number);
        const [endH] = genEndTime.split(':').map(Number);

        // Generate codes for different start times (every 30 minutes)
        for (let h = startH; h <= endH - duration; h++) {
          for (let m = (h === startH ? startM : 0); m < 60; m += 30) {
            // Calculate end time for this shift
            const shiftEndMinutes = (h * 60 + m) + (duration * 60);
            const shiftEndH = Math.floor(shiftEndMinutes / 60) % 24;
            const shiftEndM = shiftEndMinutes % 60;

            // Check if end time is within allowed range
            if (shiftEndH > endH || (shiftEndH === endH && shiftEndM > 0)) {
              continue;
            }

            // Create shift code name: V8.512 = V + 8h + start at 5:12
            const durationStr = duration % 1 === 0 ? duration.toString() : duration.toFixed(1);
            const startTimeStr = `${h.toString()}${m === 30 ? '30' : m === 0 ? '' : m.toString().padStart(2, '0')}`;
            const code = `${letter}${durationStr}.${startTimeStr}`;

            const startTimeFormatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            const endTimeFormatted = `${shiftEndH.toString().padStart(2, '0')}:${shiftEndM.toString().padStart(2, '0')}`;

            // Create via API
            const data: ShiftCodeCreate = {
              shift_code: code,
              shift_name: `Ca ${code}`,
              start_time: startTimeFormatted + ':00',
              end_time: endTimeFormatted + ':00',
              duration_hours: duration,
              color_code: '#4F46E5',
            };

            try {
              const newCode = await createShiftCode(data);
              generatedCodes.push(newCode);
            } catch (err) {
              // Skip duplicates silently
              console.warn(`Shift code ${code} may already exist, skipping...`);
            }
          }
        }
      }

      if (generatedCodes.length > 0) {
        setShiftCodes(prev => [...prev, ...generatedCodes]);
      }
    } catch (err) {
      console.error('Failed to generate shift codes:', err);
      setError('Không thể tạo mã ca.');
    } finally {
      setProcessing(false);
    }
  };

  // Add manual shift code
  const handleAddManualShiftCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!manualCode || !manualStartTime || !manualEndTime) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const duration = calculateDuration(manualStartTime, manualEndTime);
      const data: ShiftCodeCreate = {
        shift_code: manualCode.toUpperCase(),
        shift_name: `Ca ${manualCode.toUpperCase()}`,
        start_time: manualStartTime + ':00',
        end_time: manualEndTime + ':00',
        duration_hours: duration,
        color_code: '#4F46E5',
      };

      const newCode = await createShiftCode(data);
      setShiftCodes(prev => [...prev, newCode]);
      setShowAddModal(false);
      setManualCode('');
      setManualStartTime('');
      setManualEndTime('');
    } catch (err) {
      console.error('Failed to add shift code:', err);
      setError('Không thể thêm mã ca. Mã ca có thể đã tồn tại.');
    } finally {
      setProcessing(false);
    }
  };

  // Delete shift code
  const handleDeleteShiftCode = async (id: number, code: string) => {
    if (!confirm(`Bạn có chắc muốn xóa mã ca "${code}"?`)) return;

    setProcessing(true);
    try {
      await deleteShiftCode(id);
      setShiftCodes(prev => prev.filter(c => c.shift_code_id !== id));
    } catch (err) {
      console.error('Failed to delete shift code:', err);
      setError('Không thể xóa mã ca.');
    } finally {
      setProcessing(false);
    }
  };

  // Sort shift codes by code
  const sortedShiftCodes = [...shiftCodes].sort((a, b) => {
    return a.shift_code.localeCompare(b.shift_code);
  });

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dws" className="text-indigo-600 hover:text-indigo-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-gray-800">
                {t('dws.shiftCodes')} - Quan Ly Ma Ca
              </h1>
            </div>

            {/* Backend status indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${backendOnline ? 'bg-green-500' : 'bg-red-500'}`}
              />
              <span className="text-xs text-gray-500">
                {backendOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              &times;
            </button>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Auto Generator Form */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Tao Ma Ca Tu Dong</h3>
            <form onSubmit={handleGenerateShiftCodes} className="flex flex-wrap items-end gap-4">
              {/* 1. Letter */}
              <div className="flex-shrink-0" style={{ maxWidth: '80px' }}>
                <label className="block text-xs font-medium text-gray-600 mb-1">1. Ky tu</label>
                <input
                  type="text"
                  value={genChar}
                  onChange={(e) => setGenChar(e.target.value.toUpperCase().slice(0, 1))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase text-center font-bold"
                  maxLength={1}
                  placeholder="A-Z"
                />
              </div>

              {/* 2. Duration Range */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-gray-600 mb-1">2. So gio lam (Toi thieu - Toi da)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={genDurationMin}
                    onChange={(e) => setGenDurationMin(Number(e.target.value))}
                    min={1}
                    max={12}
                    step={0.5}
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={genDurationMax}
                    onChange={(e) => setGenDurationMax(Number(e.target.value))}
                    min={1}
                    max={12}
                    step={0.5}
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* 3. Time Range */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-gray-600 mb-1">3. Bat dau tu - Ket thuc muon nhat</label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={genStartTime}
                    onChange={(e) => setGenStartTime(e.target.value)}
                    step={1800}
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="time"
                    value={genEndTime}
                    onChange={(e) => setGenEndTime(e.target.value)}
                    step={1800}
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={processing}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {processing ? 'Dang tao...' : 'Tao Ma ca'}
              </button>

              {/* Manual Add Button */}
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Them ma ca
              </button>
            </form>
          </div>

          {/* Shift Codes Table */}
          <div className="overflow-x-auto">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Danh Sach Ma Ca Lam Viec ({shiftCodes.length} ma ca)
            </h2>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      STT
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ma Ca Lam Viec
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thoi gian lam viec
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tong gio
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Xoa
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedShiftCodes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-500">
                        Chua co ma ca nao duoc tao.
                      </td>
                    </tr>
                  ) : (
                    sortedShiftCodes.map((code, index) => (
                      <tr key={code.shift_code_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="px-3 py-1 rounded bg-indigo-100 text-indigo-800 font-bold text-sm">
                            {code.shift_code}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                          {formatTimeRange(code.start_time, code.end_time)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                          {code.duration_hours}h
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleDeleteShiftCode(code.shift_code_id, code.shift_code)}
                            disabled={processing}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                            title="Xoa ma ca"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <form onSubmit={handleAddManualShiftCode}>
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-bold text-gray-800">Them Ma Ca Thu Cong</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ma Ca (*)</label>
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase"
                    placeholder="Vi du: V8.512"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gio Bat Dau (*)</label>
                    <input
                      type="time"
                      value={manualStartTime}
                      onChange={(e) => setManualStartTime(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gio Ket Thuc (*)</label>
                    <input
                      type="time"
                      value={manualEndTime}
                      onChange={(e) => setManualEndTime(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                {manualStartTime && manualEndTime && (
                  <div className="text-sm text-gray-500">
                    Tong gio: {calculateDuration(manualStartTime, manualEndTime)}h
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Huy
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {processing ? 'Dang luu...' : 'Luu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
