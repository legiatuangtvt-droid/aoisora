// RE Task (Routine Execution Task) Types for DWS Module

export interface RETask {
  id: number;
  group: string;           // Task group: DELICA, D&D, DRY, etc.
  typeTask: string;        // Task type: CTM, Product, etc.
  taskName: string;        // Task name
  frequencyType: string;   // Daily, Weekly, Monthly
  frequencyNumber: number; // Number of times
  reUnit: number;          // RE Unit in minutes
  manualNumber: string;    // Manual code: DEL-001, DND-001, etc.
  manualLink?: string;     // Link to manual
  note?: string;           // Additional notes
}

export interface RETaskGroup {
  id: string;
  name: string;
  color: string;
  bgColor: string;
}

export interface RETaskFilters {
  group: string[];
  typeTask: string[];
  frequencyType: string[];
  searchQuery: string;
}

// Task groups configuration
export const RE_TASK_GROUPS: RETaskGroup[] = [
  { id: 'DELICA', name: 'DELICA', color: '#7C3AED', bgColor: '#EDE9FE' },
  { id: 'D&D', name: 'D&D', color: '#DC2626', bgColor: '#FEE2E2' },
  { id: 'DRY', name: 'DRY', color: '#2563EB', bgColor: '#DBEAFE' },
  { id: 'POS', name: 'POS', color: '#059669', bgColor: '#D1FAE5' },
  { id: 'PERI', name: 'PERI', color: '#D97706', bgColor: '#FEF3C7' },
  { id: 'MMD', name: 'MMD', color: '#0891B2', bgColor: '#CFFAFE' },
  { id: 'LEADER', name: 'LEADER', color: '#4F46E5', bgColor: '#E0E7FF' },
  { id: 'QC-FSH', name: 'QC-FSH', color: '#DB2777', bgColor: '#FCE7F3' },
  { id: 'OTHER', name: 'OTHER', color: '#6B7280', bgColor: '#F3F4F6' },
];

// Task types
export const RE_TASK_TYPES = ['CTM', 'Product', 'Service', 'Quality', 'Safety'];

// Frequency types
export const FREQUENCY_TYPES = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
