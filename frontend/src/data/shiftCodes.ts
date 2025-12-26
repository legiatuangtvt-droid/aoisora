import { ShiftCode } from '@/types/dws';

// Default shift codes from legacy system
export const defaultShiftCodes: ShiftCode[] = [
  { shiftCode: 'V812', timeRange: '06:00 ~ 14:30', duration: 8.5 },
  { shiftCode: 'V829', timeRange: '14:30 ~ 23:00', duration: 8.5 },
  { shiftCode: 'V712', timeRange: '06:00 ~ 13:30', duration: 7.5 },
  { shiftCode: 'V728', timeRange: '13:30 ~ 21:00', duration: 7.5 },
  { shiftCode: 'V612', timeRange: '06:00 ~ 12:30', duration: 6.5 },
  { shiftCode: 'V626', timeRange: '12:30 ~ 19:00', duration: 6.5 },
  { shiftCode: 'V512', timeRange: '06:00 ~ 11:30', duration: 5.5 },
  { shiftCode: 'V524', timeRange: '11:30 ~ 17:00', duration: 5.5 },
  { shiftCode: 'V412', timeRange: '06:00 ~ 10:30', duration: 4.5 },
  { shiftCode: 'V422', timeRange: '10:30 ~ 15:00', duration: 4.5 },
];

// Helper function to get shift info by code
export function getShiftByCode(code: string): ShiftCode | undefined {
  return defaultShiftCodes.find(s => s.shiftCode === code);
}

// Helper function to parse time range
export function parseTimeRange(timeRange: string): { start: string; end: string } {
  const [start, end] = timeRange.split('~').map(t => t.trim());
  return { start, end };
}

// Helper function to convert time string to minutes
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Helper function to format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get Monday of the week containing the given date
export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// Get payroll cycle based on reference date
export function getPayrollCycle(referenceDate: Date): { start: Date; end: Date } {
  const payrollStartDay = 26;
  let year = referenceDate.getFullYear();
  let month = referenceDate.getMonth();

  if (referenceDate.getDate() >= payrollStartDay) {
    month += 1;
  }

  const start = new Date(year, month, payrollStartDay);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, payrollStartDay - 1);

  return { start, end };
}
