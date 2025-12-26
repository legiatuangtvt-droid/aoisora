import { TaskGroup } from '@/types/dws';

export const taskGroups: TaskGroup[] = [
  {
    id: 'POS',
    order: 1,
    code: 'POS',
    priority: 100,
    color: { name: 'slate', bg: '#e2e8f0', text: '#1e293b', border: '#94a3b8' },
    tasks: [
      { order: '1', name: 'Mo POS', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 1, reUnit: 10, manual_number: 'POS-001', note: 'Tinh theo so luong POS', concurrentPerformers: 1, allowedPositions: ['POS', 'Leader'], timeWindows: [{ startTime: '05:40', endTime: '05:50' }] },
      { order: '2', name: 'EOD POS', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 1, reUnit: 15, manual_number: 'POS-002', note: 'Tinh theo so luong POS', concurrentPerformers: 1, allowedPositions: ['POS', 'Leader'], timeWindows: [{ startTime: '22:20', endTime: '22:30' }] },
      { order: '3', name: 'Chuan bi POS', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 1, reUnit: 5, manual_number: 'POS-003', note: 'Tinh theo so luong POS', concurrentPerformers: 1, allowedPositions: ['POS', 'Leader'], timeWindows: [{ startTime: '05:55', endTime: '06:00' }] },
      { order: '4', name: 'Doi tien le', typeTask: 'CTM', frequency: 'Daily', frequencyNumber: 2, reUnit: 5, manual_number: 'POS-004', note: 'Tinh theo so luong POS', concurrentPerformers: 1, allowedPositions: ['POS', 'Leader'], timeWindows: [{ startTime: '10:00', endTime: '10:10' }, { startTime: '16:00', endTime: '16:10' }] },
      { order: '5', name: 'Ho tro POS', typeTask: 'CTM', frequency: 'Daily', frequencyNumber: 1, reUnit: 60, manual_number: 'POS-006', note: 'Tinh theo so luong POS', concurrentPerformers: 2, allowedPositions: ['POS', 'Leader', 'Nganh hang', 'Aeon Cafe'], timeWindows: [{ startTime: '06:00', endTime: '22:00' }] },
      { order: '6', name: 'Ket ca', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 1, reUnit: 15, manual_number: 'POS-007', note: 'Tinh theo so luong POS', concurrentPerformers: 1, allowedPositions: ['POS', 'Leader'], timeWindows: [{ startTime: '22:00', endTime: '22:20' }] },
      { order: '7', name: 'Giao ca', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 1, reUnit: 10, manual_number: 'POS-008', note: 'Tinh theo so luong POS', concurrentPerformers: 1, allowedPositions: ['POS', 'Leader'], timeWindows: [{ startTime: '13:30', endTime: '13:45' }] },
    ],
  },
  {
    id: 'PERI',
    order: 2,
    code: 'PERI',
    priority: 80,
    color: { name: 'green', bg: '#bbf7d0', text: '#166534', border: '#4ade80' },
    tasks: [
      { order: '1', name: 'Len hang thit ca', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 2, reUnit: 1.5, manual_number: 'PER-001', note: 'Tinh theo khoi luong', concurrentPerformers: 2, allowedPositions: ['Nganh hang', 'Leader'], timeWindows: [{ startTime: '06:00', endTime: '11:00' }] },
      { order: '2', name: 'Len hang trai cay rau cu', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 3, reUnit: 1.5, manual_number: 'PER-002', note: 'Tinh theo khoi luong', concurrentPerformers: 2, allowedPositions: ['Nganh hang', 'Leader'], timeWindows: [{ startTime: '06:00', endTime: '11:00' }] },
      { order: '3', name: 'Repack', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 1, reUnit: 1.5, manual_number: 'PER-004', note: 'Tinh theo khoi luong', concurrentPerformers: 2, allowedPositions: ['Nganh hang', 'Leader'], timeWindows: [{ startTime: '15:30', endTime: '16:00' }] },
      { order: '4', name: 'Huy hang', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 1, reUnit: 20, manual_number: 'PER-006', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['Nganh hang', 'Leader'], timeWindows: [{ startTime: '13:30', endTime: '13:45' }, { startTime: '22:00', endTime: '22:15' }] },
      { order: '5', name: 'Kiem tra HSD Tuoi Song', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 2, reUnit: 15, manual_number: 'PER-007', note: 'Tinh theo lan', concurrentPerformers: 2, allowedPositions: ['Nganh hang', 'Leader'], timeWindows: [{ startTime: '21:30', endTime: '22:00' }] },
      { order: '6', name: 'Giam gia Peri', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 2, reUnit: 1, manual_number: 'PER-010', note: 'Tinh theo khoi luong', concurrentPerformers: 2, allowedPositions: ['Nganh hang', 'Leader'], timeWindows: [{ startTime: '20:00', endTime: '20:15' }] },
    ],
  },
  {
    id: 'DRY',
    order: 3,
    code: 'DRY',
    priority: 70,
    color: { name: 'blue', bg: '#bfdbfe', text: '#1e40af', border: '#60a5fa' },
    tasks: [
      { order: '1', name: 'Len hang kho', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 1, reUnit: 3, manual_number: 'DRY-001', note: 'Tinh theo luong hang kho', concurrentPerformers: 0, allowedPositions: ['Nganh hang', 'Leader'], timeWindows: [{ startTime: '14:00', endTime: '17:00' }] },
      { order: '2', name: 'Keo mat hang kho', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 2, reUnit: 1.5, manual_number: 'DRY-002', note: 'Tinh theo luong hang kho', concurrentPerformers: 0, allowedPositions: ['Nganh hang', 'Leader'], timeWindows: [{ startTime: '12:30', endTime: '13:00' }, { startTime: '21:45', endTime: '22:15' }] },
      { order: '3', name: 'Kiem tra HSD hang kho', typeTask: 'Product', frequency: 'Weekly', frequencyNumber: 1, reUnit: 60, manual_number: 'DRY-003', note: 'Tinh theo lan', concurrentPerformers: 2, allowedPositions: ['Nganh hang', 'Leader'], timeWindows: [{ startTime: '15:00', endTime: '16:15' }] },
      { order: '4', name: 'Ban OOS', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 1, reUnit: 30, manual_number: 'DRY-004', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['Nganh hang', 'Leader'], timeWindows: [{ startTime: '10:00', endTime: '10:30' }] },
      { order: '5', name: 'Key Auto ORD', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 1, reUnit: 45, manual_number: 'DRY-010', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['Nganh hang', 'Leader'], timeWindows: [{ startTime: '20:00', endTime: '20:15' }] },
    ],
  },
  {
    id: 'MMD',
    order: 4,
    code: 'MMD',
    priority: 90,
    color: { name: 'amber', bg: '#fde68a', text: '#92400e', border: '#facc15' },
    tasks: [
      { order: '1', name: 'Nhan hang Peri', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 41, reUnit: 10, manual_number: 'MMD-001', note: 'Tinh theo lan', concurrentPerformers: 2, allowedPositions: ['MMD', 'Leader'], timeWindows: [{ startTime: '06:00', endTime: '11:00' }] },
      { order: '2', name: 'Nhan hang Delica', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 1, reUnit: 30, manual_number: 'MMD-002', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['MMD', 'Leader'], timeWindows: [{ startTime: '06:45', endTime: '07:00' }, { startTime: '10:00', endTime: '10:05' }] },
      { order: '3', name: 'Nhan hang RDC Dry', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 1, reUnit: 90, manual_number: 'MMD-003', note: 'Tinh theo lan', concurrentPerformers: 2, allowedPositions: ['MMD', 'Leader'], timeWindows: [{ startTime: '11:00', endTime: '15:00' }] },
      { order: '4', name: 'Xu ly va update GTN/GRN', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 1, reUnit: 60, manual_number: 'MMD-007', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['MMD', 'Leader'], timeWindows: [{ startTime: '13:00', endTime: '13:10' }] },
    ],
  },
  {
    id: 'LEADER',
    order: 5,
    code: 'LEADER',
    priority: 95,
    color: { name: 'teal', bg: '#99f6e4', text: '#134e4a', border: '#2dd4bf' },
    tasks: [
      { order: '1', name: 'Mo kho', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 1, reUnit: 15, manual_number: 'LEA-001', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['Leader'], timeWindows: [{ startTime: '05:30', endTime: '05:45' }] },
      { order: '2', name: 'Dong kho', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 2, reUnit: 45, manual_number: 'LEA-002', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['Leader'], timeWindows: [{ startTime: '22:00', endTime: '22:45' }] },
      { order: '3', name: 'Balancing', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 1, reUnit: 20, manual_number: 'LEA-005', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['Leader'], timeWindows: [{ startTime: '13:30', endTime: '13:40' }, { startTime: '21:00', endTime: '21:10' }] },
      { order: '4', name: 'Tao va chinh sua DWS', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 2, reUnit: 45, manual_number: 'LEA-009', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['Leader'], timeWindows: [] },
      { order: '5', name: 'Ban giao tien cho ngan hang', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 1, reUnit: 15, manual_number: 'LEA-010', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['Leader'], timeWindows: [{ startTime: '14:00', endTime: '16:00' }] },
      { order: '6', name: 'Kiem tra DWS', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 2, reUnit: 30, manual_number: 'LEA-012', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['Leader'], timeWindows: [] },
    ],
  },
  {
    id: 'QC-FSH',
    order: 6,
    code: 'QC-FSH',
    priority: 20,
    color: { name: 'purple', bg: '#e9d5ff', text: '#6b21a8', border: '#c084fc' },
    tasks: [
      { order: '1', name: '5S khu vuc POS', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 2, reUnit: 15, manual_number: 'QCF-001', note: 'Tinh theo lan', concurrentPerformers: 0, allowedPositions: ['POS', 'Nganh hang', 'Aeon Cafe', 'MMD', 'Leader'], timeWindows: [] },
      { order: '2', name: '5S khu vuc van phong', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 1, reUnit: 15, manual_number: 'QCF-002', note: 'Tinh theo lan', concurrentPerformers: 0, allowedPositions: ['Leader', 'POS', 'Nganh hang'], timeWindows: [] },
      { order: '3', name: 'Cleaning Time 09:00', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 1, reUnit: 15, manual_number: 'QCF-008', note: 'Tinh theo lan', concurrentPerformers: 0, allowedPositions: ['Leader', 'POS', 'Nganh hang', 'Aeon Cafe', 'MMD'], timeWindows: [{ startTime: '09:00', endTime: '09:15' }] },
      { order: '4', name: 'Cleaning Time 15:00', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 1, reUnit: 15, manual_number: 'QCF-009', note: 'Tinh theo lan', concurrentPerformers: 0, allowedPositions: ['Leader', 'POS', 'Nganh hang', 'Aeon Cafe', 'MMD'], timeWindows: [{ startTime: '15:00', endTime: '15:15' }] },
      { order: '5', name: 'Cleaning Time 20:00', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 1, reUnit: 15, manual_number: 'QCF-010', note: 'Tinh theo lan', concurrentPerformers: 0, allowedPositions: ['Leader', 'POS', 'Nganh hang', 'Aeon Cafe', 'MMD'], timeWindows: [{ startTime: '20:00', endTime: '20:15' }] },
    ],
  },
  {
    id: 'DELICA',
    order: 7,
    code: 'DELICA',
    priority: 75,
    color: { name: 'indigo', bg: '#c7d2fe', text: '#3730a3', border: '#818cf8' },
    tasks: [
      { order: '1', name: 'Pha che Cafe', typeTask: 'CTM', frequency: 'Daily', frequencyNumber: 1, reUnit: 20, manual_number: 'DEL-001', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['Aeon Cafe', 'Leader'], timeWindows: [] },
      { order: '2', name: 'Chuan bi Aeon Cafe dau ngay', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 1, reUnit: 30, manual_number: 'DEL-002', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['Aeon Cafe', 'Leader'], timeWindows: [{ startTime: '06:00', endTime: '06:15' }] },
      { order: '3', name: 'Len hang Delica', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 1, reUnit: 15, manual_number: 'DEL-003', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['Aeon Cafe', 'Leader'], timeWindows: [{ startTime: '07:00', endTime: '07:25' }, { startTime: '10:00', endTime: '10:25' }] },
      { order: '4', name: 'Keo mat Delica', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 1, reUnit: 10, manual_number: 'DEL-004', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['Aeon Cafe', 'Leader'], timeWindows: [{ startTime: '10:00', endTime: '10:10' }, { startTime: '17:00', endTime: '17:10' }, { startTime: '20:00', endTime: '20:10' }] },
      { order: '5', name: 'Giam gia Delica', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 1, reUnit: 5, manual_number: 'DEL-006', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['Aeon Cafe', 'Leader'], timeWindows: [{ startTime: '11:00', endTime: '11:10' }, { startTime: '17:00', endTime: '17:10' }] },
    ],
  },
  {
    id: 'DND',
    order: 8,
    code: 'D&D',
    priority: 60,
    color: { name: 'red', bg: '#fecaca', text: '#991b1b', border: '#f87171' },
    tasks: [
      { order: '1', name: 'Len hang D&D', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 2, reUnit: 45, manual_number: 'DND-001', note: 'Tinh theo lan', concurrentPerformers: 2, allowedPositions: ['Nganh hang', 'Leader'], timeWindows: [{ startTime: '10:00', endTime: '11:00' }] },
      { order: '2', name: 'Keo mat D&D', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 2, reUnit: 30, manual_number: 'DND-002', note: 'Tinh theo lan', concurrentPerformers: 2, allowedPositions: ['Nganh hang', 'Leader'], timeWindows: [{ startTime: '07:00', endTime: '07:15' }, { startTime: '15:00', endTime: '15:15' }, { startTime: '20:00', endTime: '20:15' }] },
      { order: '3', name: 'Kiem tra HSD D&D', typeTask: 'Product', frequency: 'Daily', frequencyNumber: 2, reUnit: 15, manual_number: 'DND-003', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['Nganh hang', 'Leader'], timeWindows: [{ startTime: '20:00', endTime: '21:00' }] },
    ],
  },
  {
    id: 'OTHER',
    order: 9,
    code: 'OTHER',
    priority: 30,
    color: { name: 'pink', bg: '#fbcfe8', text: '#9d174d', border: '#f472b6' },
    tasks: [
      { order: '1', name: 'BRF Dau ca', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 1, reUnit: 15, manual_number: 'OTH-003', note: 'Tinh theo lan', concurrentPerformers: 0, allowedPositions: ['Leader', 'POS', 'Nganh hang', 'Aeon Cafe', 'MMD'], timeWindows: [] },
      { order: '2', name: 'Break Time', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 1, reUnit: 60, manual_number: 'OTH-010', note: 'Tinh theo lan', concurrentPerformers: 0, allowedPositions: ['Leader', 'POS', 'Nganh hang', 'Aeon Cafe', 'MMD'], timeWindows: [{ startTime: '10:00', endTime: '12:00' }, { startTime: '16:00', endTime: '19:00' }] },
      { order: '3', name: 'Kiem tra DWS', typeTask: 'Fixed', frequency: 'Daily', frequencyNumber: 1, reUnit: 15, manual_number: 'OTH-011', note: 'Tinh theo lan', concurrentPerformers: 0, allowedPositions: ['POS', 'Nganh hang', 'Aeon Cafe', 'MMD'], timeWindows: [] },
      { order: '4', name: 'Giao hang', typeTask: 'CTM', frequency: 'Daily', frequencyNumber: 1, reUnit: 120, manual_number: 'OTH-015', note: 'Tinh theo lan', concurrentPerformers: 1, allowedPositions: ['MMD', 'Leader'], timeWindows: [{ startTime: '09:00', endTime: '11:00' }, { startTime: '14:00', endTime: '16:30' }] },
    ],
  },
];

// Helper function to get task group by ID
export function getTaskGroupById(id: string): TaskGroup | undefined {
  return taskGroups.find(g => g.id === id);
}

// Helper function to get task group color
export function getTaskGroupColor(groupId: string): TaskGroup['color'] {
  const group = getTaskGroupById(groupId);
  return group?.color || { name: 'gray', bg: '#e5e7eb', text: '#374151', border: '#9ca3af' };
}
