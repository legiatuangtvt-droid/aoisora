// Mock data for RE Task List (DWS Module)
import { RETask } from '@/types/reTask';

export const MOCK_RE_TASKS: RETask[] = [
  // DELICA Tasks
  { id: 1, group: 'DELICA', typeTask: 'CTM', taskName: 'Pha che Cafe', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 20, manualNumber: 'DEL-001', note: 'Tinh theo lan' },
  { id: 2, group: 'DELICA', typeTask: 'Product', taskName: 'Chuan bi Aeon Cafe dau ngay', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 30, manualNumber: 'DEL-002', note: 'Tinh theo lan' },
  { id: 3, group: 'DELICA', typeTask: 'Product', taskName: 'Len hang Delica', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 15, manualNumber: 'DEL-003', note: 'Tinh theo lan' },
  { id: 4, group: 'DELICA', typeTask: 'Product', taskName: 'Keo mat Delica', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 10, manualNumber: 'DEL-004', note: 'Tinh theo lan' },
  { id: 5, group: 'DELICA', typeTask: 'Product', taskName: 'Kiem tra HSD Delica', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 10, manualNumber: 'DEL-005', note: 'Tinh theo lan' },
  { id: 6, group: 'DELICA', typeTask: 'Product', taskName: 'Giam gia Delica', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 5, manualNumber: 'DEL-006', note: 'Tinh theo lan' },
  { id: 7, group: 'DELICA', typeTask: 'Product', taskName: 'Kiem tra POP Delica', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 5, manualNumber: 'DEL-007', note: 'Tinh theo lan' },
  { id: 8, group: 'DELICA', typeTask: 'Product', taskName: 'Dat nguyen lieu Delica', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 10, manualNumber: 'DEL-008', note: 'Tinh theo lan' },
  { id: 9, group: 'DELICA', typeTask: 'Product', taskName: 'Dat hang Delica', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 10, manualNumber: 'DEL-009', note: 'Tinh theo lan' },
  { id: 10, group: 'DELICA', typeTask: 'Product', taskName: 'Chuan bi Aeon Cafe cho ngay hom sau', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 20, manualNumber: 'DEL-010', note: 'Tinh theo lan' },
  { id: 11, group: 'DELICA', typeTask: 'Product', taskName: 'Bo sung vat tu Aeon Cafe', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 5, manualNumber: 'DEL-011', note: 'Tinh theo lan' },
  { id: 12, group: 'DELICA', typeTask: 'Product', taskName: 'Kiem ke Delica', frequencyType: 'Monthly', frequencyNumber: 1, reUnit: 20, manualNumber: 'DEL-012', note: 'Tinh theo lan' },

  // D&D Tasks
  { id: 13, group: 'D&D', typeTask: 'Product', taskName: 'Len hang D&D', frequencyType: 'Daily', frequencyNumber: 2, reUnit: 45, manualNumber: 'DND-001', note: 'Tinh theo lan' },
  { id: 14, group: 'D&D', typeTask: 'Product', taskName: 'Keo mat D&D', frequencyType: 'Daily', frequencyNumber: 2, reUnit: 30, manualNumber: 'DND-002', note: 'Tinh theo lan' },
  { id: 15, group: 'D&D', typeTask: 'Product', taskName: 'Kiem tra HSD D&D', frequencyType: 'Daily', frequencyNumber: 2, reUnit: 15, manualNumber: 'DND-003', note: 'Tinh theo lan' },
  { id: 16, group: 'D&D', typeTask: 'Product', taskName: 'Dat hang D&D', frequencyType: 'Daily', frequencyNumber: 2, reUnit: 45, manualNumber: 'DND-004', note: 'Tinh theo lan' },
  { id: 17, group: 'D&D', typeTask: 'Product', taskName: 'Lam PC/POP D&D', frequencyType: 'Weekly', frequencyNumber: 2, reUnit: 45, manualNumber: 'DND-005', note: 'Tinh theo lan' },

  // DRY Tasks
  { id: 18, group: 'DRY', typeTask: 'Product', taskName: 'Len hang kho', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 3, manualNumber: 'DRY-001', note: 'Tinh theo luong hang kho (kien)' },
  { id: 19, group: 'DRY', typeTask: 'Product', taskName: 'Keo mat hang kho', frequencyType: 'Daily', frequencyNumber: 2, reUnit: 1.5, manualNumber: 'DRY-002', note: 'Tinh theo luong hang kho (kien)' },
  { id: 20, group: 'DRY', typeTask: 'Product', taskName: 'Kiem tra HSD hang kho', frequencyType: 'Weekly', frequencyNumber: 1, reUnit: 60, manualNumber: 'DRY-003', note: 'Tinh theo lan' },
  { id: 21, group: 'DRY', typeTask: 'Product', taskName: 'Ban OOS', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 30, manualNumber: 'DRY-004', note: 'Tinh theo lan' },
  { id: 22, group: 'DRY', typeTask: 'Product', taskName: 'Keo mat COC', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 20, manualNumber: 'DRY-005', note: 'Tinh theo lan' },

  // POS Tasks
  { id: 23, group: 'POS', typeTask: 'Service', taskName: 'Thu ngan', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 480, manualNumber: 'POS-001', note: 'Tinh theo ca' },
  { id: 24, group: 'POS', typeTask: 'Service', taskName: 'Mo/Dong quy', frequencyType: 'Daily', frequencyNumber: 2, reUnit: 15, manualNumber: 'POS-002', note: 'Tinh theo lan' },
  { id: 25, group: 'POS', typeTask: 'Service', taskName: 'Kiem tra voucher', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 10, manualNumber: 'POS-003', note: 'Tinh theo lan' },

  // PERI Tasks
  { id: 26, group: 'PERI', typeTask: 'Product', taskName: 'Len hang tuoi song', frequencyType: 'Daily', frequencyNumber: 2, reUnit: 30, manualNumber: 'PERI-001', note: 'Tinh theo lan' },
  { id: 27, group: 'PERI', typeTask: 'Product', taskName: 'Kiem tra nhiet do tu lanh', frequencyType: 'Daily', frequencyNumber: 3, reUnit: 5, manualNumber: 'PERI-002', note: 'Tinh theo lan' },
  { id: 28, group: 'PERI', typeTask: 'Product', taskName: 'Ve sinh khu vuc tuoi song', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 20, manualNumber: 'PERI-003', note: 'Tinh theo lan' },

  // MMD Tasks
  { id: 29, group: 'MMD', typeTask: 'Product', taskName: 'Nhan hang', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 60, manualNumber: 'MMD-001', note: 'Tinh theo chuyen' },
  { id: 30, group: 'MMD', typeTask: 'Product', taskName: 'Kiem tra hang nhap', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 30, manualNumber: 'MMD-002', note: 'Tinh theo chuyen' },
  { id: 31, group: 'MMD', typeTask: 'Product', taskName: 'Sap xep kho', frequencyType: 'Weekly', frequencyNumber: 1, reUnit: 60, manualNumber: 'MMD-003', note: 'Tinh theo lan' },

  // LEADER Tasks
  { id: 32, group: 'LEADER', typeTask: 'Service', taskName: 'Hop giao ca', frequencyType: 'Daily', frequencyNumber: 2, reUnit: 15, manualNumber: 'LEAD-001', note: 'Tinh theo lan' },
  { id: 33, group: 'LEADER', typeTask: 'Service', taskName: 'Kiem tra cua hang', frequencyType: 'Daily', frequencyNumber: 2, reUnit: 20, manualNumber: 'LEAD-002', note: 'Tinh theo lan' },
  { id: 34, group: 'LEADER', typeTask: 'Service', taskName: 'Bao cao cuoi ngay', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 30, manualNumber: 'LEAD-003', note: 'Tinh theo lan' },

  // QC-FSH Tasks
  { id: 35, group: 'QC-FSH', typeTask: 'Quality', taskName: 'Ve sinh mat bang ban hang', frequencyType: 'Daily', frequencyNumber: 2, reUnit: 30, manualNumber: 'QC-001', note: 'Tinh theo lan' },
  { id: 36, group: 'QC-FSH', typeTask: 'Quality', taskName: 'Ve sinh kho', frequencyType: 'Weekly', frequencyNumber: 1, reUnit: 60, manualNumber: 'QC-002', note: 'Tinh theo lan' },
  { id: 37, group: 'QC-FSH', typeTask: 'Quality', taskName: 'Kiem tra VSATTP', frequencyType: 'Daily', frequencyNumber: 1, reUnit: 15, manualNumber: 'QC-003', note: 'Tinh theo lan' },
];

// Pagination helper
export const paginateRETask = (tasks: RETask[], page: number, pageSize: number) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return {
    data: tasks.slice(startIndex, endIndex),
    total: tasks.length,
    page,
    pageSize,
    totalPages: Math.ceil(tasks.length / pageSize),
  };
};
