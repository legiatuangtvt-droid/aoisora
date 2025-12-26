'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ShiftCode } from '@/types/dws';
import { defaultShiftCodes } from '@/data/shiftCodes';

export default function ShiftCodesPage() {
  const [shiftCodes, setShiftCodes] = useState<ShiftCode[]>(defaultShiftCodes);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Generator form state
  const [genChar, setGenChar] = useState('V');
  const [genDurationMin, setGenDurationMin] = useState(4);
  const [genDurationMax, setGenDurationMax] = useState(8);
  const [genStartTime, setGenStartTime] = useState('06:00');
  const [genEndTimeMax, setGenEndTimeMax] = useState('23:00');

  // Manual add form state
  const [manualCode, setManualCode] = useState('');
  const [manualStartTime, setManualStartTime] = useState('');
  const [manualEndTime, setManualEndTime] = useState('');

  // Generate shift codes
  const generateShiftCodes = () => {
    const newCodes: ShiftCode[] = [];
    const char = genChar.toUpperCase();

    const timeToMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const startTimeMin = timeToMinutes(genStartTime);
    const endTimeMax = timeToMinutes(genEndTimeMax);

    for (let duration = genDurationMin; duration <= genDurationMax; duration += 1) {
      const latestPossibleStartTime = endTimeMax - duration * 60;

      for (let currentTime = startTimeMin; currentTime <= latestPossibleStartTime; currentTime += 30) {
        const startHour = Math.floor(currentTime / 60);
        const startMinute = currentTime % 60;
        const timeCode = startHour * 2 + startMinute / 30;
        const shiftCode = `${char}${duration}${timeCode}`;

        const startDate = new Date();
        startDate.setHours(startHour, startMinute, 0, 0);
        const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);

        const formatTime = (date: Date) => {
          const h = String(date.getHours()).padStart(2, '0');
          const m = String(date.getMinutes()).padStart(2, '0');
          return `${h}:${m}`;
        };

        const timeRange = `${formatTime(startDate)} ~ ${formatTime(endDate)}`;

        newCodes.push({ shiftCode, timeRange, duration });
      }
    }

    setShiftCodes(newCodes);
    setShowGenerator(false);
  };

  // Add manual shift code
  const addManualShiftCode = () => {
    if (!manualCode || !manualStartTime || !manualEndTime) return;

    const timeToMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const startMinutes = timeToMinutes(manualStartTime);
    const endMinutes = timeToMinutes(manualEndTime);
    const durationMinutes = endMinutes - startMinutes;
    const duration = durationMinutes / 60;

    const newCode: ShiftCode = {
      shiftCode: manualCode.toUpperCase(),
      timeRange: `${manualStartTime} ~ ${manualEndTime}`,
      duration: parseFloat(duration.toFixed(2)),
    };

    setShiftCodes(prev => [...prev, newCode]);
    setShowAddModal(false);
    setManualCode('');
    setManualStartTime('');
    setManualEndTime('');
  };

  // Group shift codes by duration
  const groupedShiftCodes = useMemo(() => {
    const groups: Record<number, ShiftCode[]> = {};
    shiftCodes.forEach(code => {
      if (!groups[code.duration]) {
        groups[code.duration] = [];
      }
      groups[code.duration].push(code);
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
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Them Ma Ca
              </button>
              <button
                onClick={() => setShowGenerator(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Tao Ma Ca Tu Dong
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Danh Sach Ma Ca ({shiftCodes.length} ma)
              </h2>
              <div className="text-sm text-gray-500">
                Nhom theo thoi luong ca lam viec
              </div>
            </div>
          </div>

          <div className="overflow-auto max-h-[calc(100vh-250px)]">
            <table className="min-w-full">
              <thead className="bg-slate-100 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ma Ca</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khung Gio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thoi Luong</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(groupedShiftCodes)
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([duration, codes]) => (
                    <>
                      <tr key={`header-${duration}`} className="bg-indigo-50">
                        <td colSpan={4} className="px-6 py-2 text-sm font-bold text-indigo-700">
                          Ca {duration} gio ({codes.length} ma)
                        </td>
                      </tr>
                      {codes.map((code, index) => (
                        <tr key={code.shiftCode} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600 text-center">{code.shiftCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center font-medium">{code.timeRange}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{code.duration} gio</td>
                        </tr>
                      ))}
                    </>
                  ))}
              </tbody>
            </table>

            {shiftCodes.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                Chua co ma ca nao duoc tao.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Tao Ma Ca Tu Dong</h3>
              <button onClick={() => setShowGenerator(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ky Tu Dau (A-Z)</label>
                <input
                  type="text"
                  value={genChar}
                  onChange={e => setGenChar(e.target.value.slice(0, 1).toUpperCase())}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  maxLength={1}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">So Gio Toi Thieu</label>
                  <input
                    type="number"
                    value={genDurationMin}
                    onChange={e => setGenDurationMin(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min={1}
                    max={12}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">So Gio Toi Da</label>
                  <input
                    type="number"
                    value={genDurationMax}
                    onChange={e => setGenDurationMax(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min={1}
                    max={12}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gio Bat Dau Som Nhat</label>
                  <input
                    type="time"
                    value={genStartTime}
                    onChange={e => setGenStartTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gio Ket Thuc Muon Nhat</label>
                  <input
                    type="time"
                    value={genEndTimeMax}
                    onChange={e => setGenEndTimeMax(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowGenerator(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Huy
              </button>
              <button
                onClick={generateShiftCodes}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Tao Ma Ca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Manual Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Them Ma Ca Thu Cong</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ma Ca</label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={e => setManualCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="VD: V812"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gio Bat Dau</label>
                  <input
                    type="time"
                    value={manualStartTime}
                    onChange={e => setManualStartTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gio Ket Thuc</label>
                  <input
                    type="time"
                    value={manualEndTime}
                    onChange={e => setManualEndTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Huy
              </button>
              <button
                onClick={addManualShiftCode}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Them Ma Ca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
