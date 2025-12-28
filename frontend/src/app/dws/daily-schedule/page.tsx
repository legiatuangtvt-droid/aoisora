'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import {
  checkHealth,
  getStores,
  getStaff,
  getShiftAssignments,
  getShiftCodes,
} from '@/lib/api';
import type { Store, Staff, ShiftAssignment, ShiftCode } from '@/types/api';

// Task Group colors from legacy system - matching data-task_groups.json
const TASK_GROUP_COLORS: Record<string, { bg: string; text: string; border: string; name: string }> = {
  POS: { bg: '#e2e8f0', text: '#1e293b', border: '#94a3b8', name: 'Thu ngan' },
  PERI: { bg: '#bbf7d0', text: '#166534', border: '#4ade80', name: 'Tuoi song' },
  DRY: { bg: '#bfdbfe', text: '#1e40af', border: '#60a5fa', name: 'Hang kho' },
  MMD: { bg: '#fde68a', text: '#92400e', border: '#facc15', name: 'Nhan hang' },
  LEADER: { bg: '#99f6e4', text: '#134e4a', border: '#2dd4bf', name: 'Quan ly' },
  'QC-FSH': { bg: '#e9d5ff', text: '#6b21a8', border: '#c084fc', name: 'Ve sinh' },
  DELICA: { bg: '#c7d2fe', text: '#3730a3', border: '#818cf8', name: 'Delica' },
  DND: { bg: '#fecaca', text: '#991b1b', border: '#f87171', name: 'D&D' },
  OTHER: { bg: '#fbcfe8', text: '#9d174d', border: '#f472b6', name: 'Khac' },
};

// Task assignment for a time slot (matching legacy daily-templates format)
interface ScheduledTask {
  taskCode: string;
  taskName: string;
  groupId: string;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  isComplete?: 0 | 1;  // Legacy uses 0/1, optional for mock
  awardedPoints?: number;
}

// Mock scheduled tasks per staff (for demo) - Matches seed_data.py
// CA SÁNG: Staff 1-4 (06:00-14:00), CA CHIỀU: Staff 5-8 (14:30-22:30)
// Mỗi khung giờ 15 phút có đủ 4 task từ 4 nhân viên trong ca
const MOCK_SCHEDULED_TASKS: Record<number, ScheduledTask[]> = {
  // ========== CA SÁNG ==========
  1: [ // Staff 1 - Leader ca sáng
    // 06:00 slot - 4 tasks cùng lúc với staff 2,3,4
    { taskCode: '1501', taskName: 'Mở kho', groupId: 'LEADER', startTime: '06:00', endTime: '06:15' },
    { taskCode: '1505', taskName: 'Balancing', groupId: 'LEADER', startTime: '06:15', endTime: '06:30' },
    { taskCode: '0101', taskName: 'Mở POS', groupId: 'POS', startTime: '06:30', endTime: '06:45' },
    { taskCode: '0102', taskName: 'Check POS', groupId: 'POS', startTime: '06:45', endTime: '07:00' },
    // 07:00 slot
    { taskCode: '1506', taskName: 'Kiểm hàng', groupId: 'LEADER', startTime: '07:00', endTime: '07:15' },
    { taskCode: '1507', taskName: 'Duyệt đơn', groupId: 'LEADER', startTime: '07:15', endTime: '07:30' },
    { taskCode: '1508', taskName: 'Giao việc', groupId: 'LEADER', startTime: '07:30', endTime: '07:45' },
    { taskCode: '0103', taskName: 'Hỗ trợ POS', groupId: 'POS', startTime: '07:45', endTime: '08:00' },
    // 08:00 slot
    { taskCode: '1509', taskName: 'Meeting', groupId: 'LEADER', startTime: '08:00', endTime: '08:15' },
    { taskCode: '0104', taskName: 'Đối soát', groupId: 'POS', startTime: '08:15', endTime: '08:30' },
    { taskCode: '0105', taskName: 'In báo cáo', groupId: 'POS', startTime: '08:30', endTime: '08:45' },
    { taskCode: '0106', taskName: 'Kiểm POS', groupId: 'POS', startTime: '08:45', endTime: '09:00' },
    // 09:00 slot - Cleaning
    { taskCode: '0801', taskName: 'Cleaning', groupId: 'QC-FSH', startTime: '09:00', endTime: '09:15' },
    { taskCode: '0802', taskName: 'Kiểm VSC', groupId: 'QC-FSH', startTime: '09:15', endTime: '09:30' },
    { taskCode: '0803', taskName: 'VS khu POS', groupId: 'QC-FSH', startTime: '09:30', endTime: '09:45' },
    { taskCode: '1510', taskName: 'Bàn giao', groupId: 'LEADER', startTime: '09:45', endTime: '10:00' },
    // 10:00-11:00
    { taskCode: '1511', taskName: 'Check OOS', groupId: 'LEADER', startTime: '10:00', endTime: '10:15' },
    { taskCode: '1512', taskName: 'Duyệt KM', groupId: 'LEADER', startTime: '10:15', endTime: '10:30' },
    { taskCode: '0107', taskName: 'Đổi tiền', groupId: 'POS', startTime: '10:30', endTime: '10:45' },
    { taskCode: '0108', taskName: 'Voucher', groupId: 'POS', startTime: '10:45', endTime: '11:00' },
    // 11:00-12:00
    { taskCode: '0109', taskName: 'Phục vụ', groupId: 'POS', startTime: '11:00', endTime: '11:15' },
    { taskCode: '0110', taskName: 'Thanh toán', groupId: 'POS', startTime: '11:15', endTime: '11:30' },
    { taskCode: '0111', taskName: 'Khiếu nại', groupId: 'POS', startTime: '11:30', endTime: '11:45' },
    { taskCode: '1513', taskName: 'Giám sát', groupId: 'LEADER', startTime: '11:45', endTime: '12:00' },
    // 12:00-13:00 Break
    { taskCode: '1005', taskName: 'Break', groupId: 'OTHER', startTime: '12:00', endTime: '12:15' },
    { taskCode: '1006', taskName: 'Break', groupId: 'OTHER', startTime: '12:15', endTime: '12:30' },
    { taskCode: '1007', taskName: 'Break', groupId: 'OTHER', startTime: '12:30', endTime: '12:45' },
    { taskCode: '1008', taskName: 'Break', groupId: 'OTHER', startTime: '12:45', endTime: '13:00' },
    // 13:00-14:00
    { taskCode: '1514', taskName: 'Chuẩn bị', groupId: 'LEADER', startTime: '13:00', endTime: '13:15' },
    { taskCode: '1515', taskName: 'Đóng kho', groupId: 'LEADER', startTime: '13:15', endTime: '13:30' },
    { taskCode: '0112', taskName: 'Kiểm POS', groupId: 'POS', startTime: '13:30', endTime: '13:45' },
    { taskCode: '1516', taskName: 'Bàn giao', groupId: 'LEADER', startTime: '13:45', endTime: '14:00' },
  ],
  2: [ // Staff 2 - PERI ca sáng
    // 06:00 slot
    { taskCode: '0201', taskName: 'Lên thịt', groupId: 'PERI', startTime: '06:00', endTime: '06:15' },
    { taskCode: '0202', taskName: 'Lên rau', groupId: 'PERI', startTime: '06:15', endTime: '06:30' },
    { taskCode: '0203', taskName: 'Sắp kệ', groupId: 'PERI', startTime: '06:30', endTime: '06:45' },
    { taskCode: '0204', taskName: 'Kiểm HSD', groupId: 'PERI', startTime: '06:45', endTime: '07:00' },
    // 07:00 slot
    { taskCode: '0205', taskName: 'Cắt gọt', groupId: 'PERI', startTime: '07:00', endTime: '07:15' },
    { taskCode: '0206', taskName: 'Đóng gói', groupId: 'PERI', startTime: '07:15', endTime: '07:30' },
    { taskCode: '0207', taskName: 'Cân gói', groupId: 'PERI', startTime: '07:30', endTime: '07:45' },
    { taskCode: '0208', taskName: 'Dán nhãn', groupId: 'PERI', startTime: '07:45', endTime: '08:00' },
    // 08:00 slot
    { taskCode: '0209', taskName: 'Bổ sung', groupId: 'PERI', startTime: '08:00', endTime: '08:15' },
    { taskCode: '0210', taskName: 'Giảm giá', groupId: 'PERI', startTime: '08:15', endTime: '08:30' },
    { taskCode: '0211', taskName: 'FIFO', groupId: 'PERI', startTime: '08:30', endTime: '08:45' },
    { taskCode: '0212', taskName: 'Nhiệt độ', groupId: 'PERI', startTime: '08:45', endTime: '09:00' },
    // 09:00 slot
    { taskCode: '0801', taskName: 'Cleaning', groupId: 'QC-FSH', startTime: '09:00', endTime: '09:15' },
    { taskCode: '0804', taskName: 'VS Peri', groupId: 'QC-FSH', startTime: '09:15', endTime: '09:30' },
    { taskCode: '0213', taskName: 'Kiểm kho', groupId: 'PERI', startTime: '09:30', endTime: '09:45' },
    { taskCode: '0214', taskName: 'Đặt hàng', groupId: 'PERI', startTime: '09:45', endTime: '10:00' },
    // 10:00-14:00 (tiếp tục)
    { taskCode: '0215', taskName: 'Hàng hư', groupId: 'PERI', startTime: '10:00', endTime: '10:15' },
    { taskCode: '0216', taskName: 'Cắt gọt', groupId: 'PERI', startTime: '10:15', endTime: '10:30' },
    { taskCode: '0217', taskName: 'Kéo mặt', groupId: 'PERI', startTime: '10:30', endTime: '10:45' },
    { taskCode: '0218', taskName: 'OOS Peri', groupId: 'PERI', startTime: '10:45', endTime: '11:00' },
    { taskCode: '0219', taskName: 'Lên trưa', groupId: 'PERI', startTime: '11:00', endTime: '11:15' },
    { taskCode: '0220', taskName: 'Salad', groupId: 'PERI', startTime: '11:15', endTime: '11:30' },
    { taskCode: '0221', taskName: 'Kệ lạnh', groupId: 'PERI', startTime: '11:30', endTime: '11:45' },
    { taskCode: '0222', taskName: 'CB giảm', groupId: 'PERI', startTime: '11:45', endTime: '12:00' },
    // Break
    { taskCode: '1005', taskName: 'Break', groupId: 'OTHER', startTime: '12:00', endTime: '12:15' },
    { taskCode: '1006', taskName: 'Break', groupId: 'OTHER', startTime: '12:15', endTime: '12:30' },
    { taskCode: '1007', taskName: 'Break', groupId: 'OTHER', startTime: '12:30', endTime: '12:45' },
    { taskCode: '1008', taskName: 'Break', groupId: 'OTHER', startTime: '12:45', endTime: '13:00' },
    // 13:00-14:00
    { taskCode: '0223', taskName: 'Giảm trưa', groupId: 'PERI', startTime: '13:00', endTime: '13:15' },
    { taskCode: '0224', taskName: 'Hàng tồn', groupId: 'PERI', startTime: '13:15', endTime: '13:30' },
    { taskCode: '0225', taskName: 'Vệ sinh', groupId: 'PERI', startTime: '13:30', endTime: '13:45' },
    { taskCode: '0226', taskName: 'Bàn giao', groupId: 'PERI', startTime: '13:45', endTime: '14:00' },
  ],
  3: [ // Staff 3 - DRY ca sáng
    { taskCode: '0301', taskName: 'Lên khô', groupId: 'DRY', startTime: '06:00', endTime: '06:15' },
    { taskCode: '0302', taskName: 'Kéo mặt', groupId: 'DRY', startTime: '06:15', endTime: '06:30' },
    { taskCode: '0303', taskName: 'Sắp kệ', groupId: 'DRY', startTime: '06:30', endTime: '06:45' },
    { taskCode: '0304', taskName: 'Bắn OOS', groupId: 'DRY', startTime: '06:45', endTime: '07:00' },
    { taskCode: '0305', taskName: 'HSD Dry', groupId: 'DRY', startTime: '07:00', endTime: '07:15' },
    { taskCode: '0306', taskName: 'FIFO', groupId: 'DRY', startTime: '07:15', endTime: '07:30' },
    { taskCode: '0307', taskName: 'Dán nhãn', groupId: 'DRY', startTime: '07:30', endTime: '07:45' },
    { taskCode: '0308', taskName: 'Check giá', groupId: 'DRY', startTime: '07:45', endTime: '08:00' },
    { taskCode: '0309', taskName: 'Bổ sung', groupId: 'DRY', startTime: '08:00', endTime: '08:15' },
    { taskCode: '0310', taskName: 'Promo', groupId: 'DRY', startTime: '08:15', endTime: '08:30' },
    { taskCode: '0311', taskName: 'Endcap', groupId: 'DRY', startTime: '08:30', endTime: '08:45' },
    { taskCode: '0312', taskName: 'VS kệ', groupId: 'DRY', startTime: '08:45', endTime: '09:00' },
    { taskCode: '0801', taskName: 'Cleaning', groupId: 'QC-FSH', startTime: '09:00', endTime: '09:15' },
    { taskCode: '0805', taskName: 'VS Dry', groupId: 'QC-FSH', startTime: '09:15', endTime: '09:30' },
    { taskCode: '0313', taskName: 'Kiểm kho', groupId: 'DRY', startTime: '09:30', endTime: '09:45' },
    { taskCode: '0314', taskName: 'Đặt hàng', groupId: 'DRY', startTime: '09:45', endTime: '10:00' },
    { taskCode: '0315', taskName: 'Hàng lỗi', groupId: 'DRY', startTime: '10:00', endTime: '10:15' },
    { taskCode: '0316', taskName: 'Kéo mặt 2', groupId: 'DRY', startTime: '10:15', endTime: '10:30' },
    { taskCode: '0317', taskName: 'Check OOS', groupId: 'DRY', startTime: '10:30', endTime: '10:45' },
    { taskCode: '0318', taskName: 'POG', groupId: 'DRY', startTime: '10:45', endTime: '11:00' },
    { taskCode: '0319', taskName: 'Snack', groupId: 'DRY', startTime: '11:00', endTime: '11:15' },
    { taskCode: '0320', taskName: 'Nước', groupId: 'DRY', startTime: '11:15', endTime: '11:30' },
    { taskCode: '0321', taskName: 'Mì gói', groupId: 'DRY', startTime: '11:30', endTime: '11:45' },
    { taskCode: '0322', taskName: 'Gia vị', groupId: 'DRY', startTime: '11:45', endTime: '12:00' },
    { taskCode: '1005', taskName: 'Break', groupId: 'OTHER', startTime: '12:00', endTime: '12:15' },
    { taskCode: '1006', taskName: 'Break', groupId: 'OTHER', startTime: '12:15', endTime: '12:30' },
    { taskCode: '1007', taskName: 'Break', groupId: 'OTHER', startTime: '12:30', endTime: '12:45' },
    { taskCode: '1008', taskName: 'Break', groupId: 'OTHER', startTime: '12:45', endTime: '13:00' },
    { taskCode: '0323', taskName: 'Kéo cuối', groupId: 'DRY', startTime: '13:00', endTime: '13:15' },
    { taskCode: '0324', taskName: 'BC OOS', groupId: 'DRY', startTime: '13:15', endTime: '13:30' },
    { taskCode: '0325', taskName: 'Vệ sinh', groupId: 'DRY', startTime: '13:30', endTime: '13:45' },
    { taskCode: '0326', taskName: 'Bàn giao', groupId: 'DRY', startTime: '13:45', endTime: '14:00' },
  ],
  4: [ // Staff 4 - MMD ca sáng
    { taskCode: '0401', taskName: 'Nhận Peri', groupId: 'MMD', startTime: '06:00', endTime: '06:15' },
    { taskCode: '0402', taskName: 'Kiểm Peri', groupId: 'MMD', startTime: '06:15', endTime: '06:30' },
    { taskCode: '0403', taskName: 'Nhận RDC', groupId: 'MMD', startTime: '06:30', endTime: '06:45' },
    { taskCode: '0404', taskName: 'Kiểm RDC', groupId: 'MMD', startTime: '06:45', endTime: '07:00' },
    { taskCode: '0405', taskName: 'Nhận D&D', groupId: 'MMD', startTime: '07:00', endTime: '07:15' },
    { taskCode: '0406', taskName: 'Phân loại', groupId: 'MMD', startTime: '07:15', endTime: '07:30' },
    { taskCode: '0407', taskName: 'Nhập kho', groupId: 'MMD', startTime: '07:30', endTime: '07:45' },
    { taskCode: '0408', taskName: 'Cập nhật', groupId: 'MMD', startTime: '07:45', endTime: '08:00' },
    { taskCode: '0409', taskName: 'Hàng trả', groupId: 'MMD', startTime: '08:00', endTime: '08:15' },
    { taskCode: '0410', taskName: 'Kiểm DC', groupId: 'MMD', startTime: '08:15', endTime: '08:30' },
    { taskCode: '0411', taskName: 'BC nhập', groupId: 'MMD', startTime: '08:30', endTime: '08:45' },
    { taskCode: '0412', taskName: 'Sắp kho', groupId: 'MMD', startTime: '08:45', endTime: '09:00' },
    { taskCode: '0801', taskName: 'Cleaning', groupId: 'QC-FSH', startTime: '09:00', endTime: '09:15' },
    { taskCode: '0806', taskName: 'VS kho', groupId: 'QC-FSH', startTime: '09:15', endTime: '09:30' },
    { taskCode: '0413', taskName: 'Kiểm MMD', groupId: 'MMD', startTime: '09:30', endTime: '09:45' },
    { taskCode: '0414', taskName: 'Nhận BS', groupId: 'MMD', startTime: '09:45', endTime: '10:00' },
    { taskCode: '0415', taskName: 'Claim', groupId: 'MMD', startTime: '10:00', endTime: '10:15' },
    { taskCode: '0416', taskName: 'HSD kho', groupId: 'MMD', startTime: '10:15', endTime: '10:30' },
    { taskCode: '0417', taskName: 'CB xuất', groupId: 'MMD', startTime: '10:30', endTime: '10:45' },
    { taskCode: '0418', taskName: 'RDC 2', groupId: 'MMD', startTime: '10:45', endTime: '11:00' },
    { taskCode: '0419', taskName: 'Kiểm RDC2', groupId: 'MMD', startTime: '11:00', endTime: '11:15' },
    { taskCode: '0420', taskName: 'Phân RDC', groupId: 'MMD', startTime: '11:15', endTime: '11:30' },
    { taskCode: '0421', taskName: 'Nhập BS', groupId: 'MMD', startTime: '11:30', endTime: '11:45' },
    { taskCode: '0422', taskName: 'Hệ thống', groupId: 'MMD', startTime: '11:45', endTime: '12:00' },
    { taskCode: '1005', taskName: 'Break', groupId: 'OTHER', startTime: '12:00', endTime: '12:15' },
    { taskCode: '1006', taskName: 'Break', groupId: 'OTHER', startTime: '12:15', endTime: '12:30' },
    { taskCode: '1007', taskName: 'Break', groupId: 'OTHER', startTime: '12:30', endTime: '12:45' },
    { taskCode: '1008', taskName: 'Break', groupId: 'OTHER', startTime: '12:45', endTime: '13:00' },
    { taskCode: '0423', taskName: 'BC tồn', groupId: 'MMD', startTime: '13:00', endTime: '13:15' },
    { taskCode: '0424', taskName: 'Hàng chờ', groupId: 'MMD', startTime: '13:15', endTime: '13:30' },
    { taskCode: '0425', taskName: 'VS MMD', groupId: 'MMD', startTime: '13:30', endTime: '13:45' },
    { taskCode: '0426', taskName: 'Bàn giao', groupId: 'MMD', startTime: '13:45', endTime: '14:00' },
  ],

  // ========== CA CHIỀU (14:30-22:30) ==========
  5: [ // Staff 5 - Leader ca chiều
    { taskCode: '2501', taskName: 'Nhận BG', groupId: 'LEADER', startTime: '14:30', endTime: '14:45' },
    { taskCode: '2502', taskName: 'Kiểm ca', groupId: 'LEADER', startTime: '14:45', endTime: '15:00' },
    { taskCode: '2503', taskName: 'OOS', groupId: 'LEADER', startTime: '15:00', endTime: '15:15' },
    { taskCode: '2504', taskName: 'Duyệt giảm', groupId: 'LEADER', startTime: '15:15', endTime: '15:30' },
    { taskCode: '2505', taskName: 'Giám sát', groupId: 'LEADER', startTime: '15:30', endTime: '15:45' },
    { taskCode: '0113', taskName: 'Hỗ trợ', groupId: 'POS', startTime: '15:45', endTime: '16:00' },
    { taskCode: '2506', taskName: 'Promo', groupId: 'LEADER', startTime: '16:00', endTime: '16:15' },
    { taskCode: '0114', taskName: 'Tiền POS', groupId: 'POS', startTime: '16:15', endTime: '16:30' },
    { taskCode: '0115', taskName: 'Đổi tiền', groupId: 'POS', startTime: '16:30', endTime: '16:45' },
    { taskCode: '2507', taskName: 'Meeting', groupId: 'LEADER', startTime: '16:45', endTime: '17:00' },
    { taskCode: '0116', taskName: 'Hỗ trợ TT', groupId: 'POS', startTime: '17:00', endTime: '17:15' },
    { taskCode: '0117', taskName: 'Phục vụ', groupId: 'POS', startTime: '17:15', endTime: '17:30' },
    { taskCode: '2508', taskName: 'GS POS', groupId: 'LEADER', startTime: '17:30', endTime: '17:45' },
    { taskCode: '0118', taskName: 'Khiếu nại', groupId: 'POS', startTime: '17:45', endTime: '18:00' },
    { taskCode: '2509', taskName: 'Điều phối', groupId: 'LEADER', startTime: '18:00', endTime: '18:15' },
    { taskCode: '0119', taskName: 'POS peak', groupId: 'POS', startTime: '18:15', endTime: '18:30' },
    { taskCode: '0120', taskName: 'Queue', groupId: 'POS', startTime: '18:30', endTime: '18:45' },
    { taskCode: '2510', taskName: 'Kiểm sàn', groupId: 'LEADER', startTime: '18:45', endTime: '19:00' },
    { taskCode: '0121', taskName: 'Đối soát', groupId: 'POS', startTime: '19:00', endTime: '19:15' },
    { taskCode: '2511', taskName: 'Giảm tối', groupId: 'LEADER', startTime: '19:15', endTime: '19:30' },
    { taskCode: '0807', taskName: 'Clean tối', groupId: 'QC-FSH', startTime: '19:30', endTime: '19:45' },
    { taskCode: '2512', taskName: 'VSC', groupId: 'LEADER', startTime: '19:45', endTime: '20:00' },
    { taskCode: '1005', taskName: 'Break', groupId: 'OTHER', startTime: '20:00', endTime: '20:15' },
    { taskCode: '1006', taskName: 'Break', groupId: 'OTHER', startTime: '20:15', endTime: '20:30' },
    { taskCode: '1007', taskName: 'Break', groupId: 'OTHER', startTime: '20:30', endTime: '20:45' },
    { taskCode: '1008', taskName: 'Break', groupId: 'OTHER', startTime: '20:45', endTime: '21:00' },
    { taskCode: '2513', taskName: 'CB đóng', groupId: 'LEADER', startTime: '21:00', endTime: '21:15' },
    { taskCode: '0122', taskName: 'Đếm tiền', groupId: 'POS', startTime: '21:15', endTime: '21:30' },
    { taskCode: '2514', taskName: 'Kiểm kho', groupId: 'LEADER', startTime: '21:30', endTime: '21:45' },
    { taskCode: '2515', taskName: 'BC ngày', groupId: 'LEADER', startTime: '21:45', endTime: '22:00' },
    { taskCode: '0123', taskName: 'Đóng POS', groupId: 'POS', startTime: '22:00', endTime: '22:15' },
    { taskCode: '2516', taskName: 'Đóng kho', groupId: 'LEADER', startTime: '22:15', endTime: '22:30' },
  ],
  6: [ // Staff 6 - PERI ca chiều
    { taskCode: '0227', taskName: 'Nhận BG', groupId: 'PERI', startTime: '14:30', endTime: '14:45' },
    { taskCode: '0228', taskName: 'Kiểm Peri', groupId: 'PERI', startTime: '14:45', endTime: '15:00' },
    { taskCode: '0229', taskName: 'Bổ sung', groupId: 'PERI', startTime: '15:00', endTime: '15:15' },
    { taskCode: '0230', taskName: 'Kéo mặt', groupId: 'PERI', startTime: '15:15', endTime: '15:30' },
    { taskCode: '0231', taskName: 'Cắt gọt', groupId: 'PERI', startTime: '15:30', endTime: '15:45' },
    { taskCode: '0232', taskName: 'Đóng gói', groupId: 'PERI', startTime: '15:45', endTime: '16:00' },
    { taskCode: '0233', taskName: 'HSD', groupId: 'PERI', startTime: '16:00', endTime: '16:15' },
    { taskCode: '0234', taskName: 'CB giảm', groupId: 'PERI', startTime: '16:15', endTime: '16:30' },
    { taskCode: '0235', taskName: 'Sticker', groupId: 'PERI', startTime: '16:30', endTime: '16:45' },
    { taskCode: '0236', taskName: 'FIFO', groupId: 'PERI', startTime: '16:45', endTime: '17:00' },
    { taskCode: '0237', taskName: 'BS peak', groupId: 'PERI', startTime: '17:00', endTime: '17:15' },
    { taskCode: '0238', taskName: 'Kéo peak', groupId: 'PERI', startTime: '17:15', endTime: '17:30' },
    { taskCode: '0239', taskName: 'OOS', groupId: 'PERI', startTime: '17:30', endTime: '17:45' },
    { taskCode: '0240', taskName: 'Cắt BS', groupId: 'PERI', startTime: '17:45', endTime: '18:00' },
    { taskCode: '0241', taskName: 'Salad', groupId: 'PERI', startTime: '18:00', endTime: '18:15' },
    { taskCode: '0242', taskName: 'Nhiệt độ', groupId: 'PERI', startTime: '18:15', endTime: '18:30' },
    { taskCode: '0243', taskName: 'Hàng hư', groupId: 'PERI', startTime: '18:30', endTime: '18:45' },
    { taskCode: '0244', taskName: 'Kéo tối', groupId: 'PERI', startTime: '18:45', endTime: '19:00' },
    { taskCode: '0245', taskName: 'Giảm 30%', groupId: 'PERI', startTime: '19:00', endTime: '19:15' },
    { taskCode: '0246', taskName: 'Giảm 50%', groupId: 'PERI', startTime: '19:15', endTime: '19:30' },
    { taskCode: '0808', taskName: 'VS Peri', groupId: 'QC-FSH', startTime: '19:30', endTime: '19:45' },
    { taskCode: '0247', taskName: 'Thu dọn', groupId: 'PERI', startTime: '19:45', endTime: '20:00' },
    { taskCode: '1005', taskName: 'Break', groupId: 'OTHER', startTime: '20:00', endTime: '20:15' },
    { taskCode: '1006', taskName: 'Break', groupId: 'OTHER', startTime: '20:15', endTime: '20:30' },
    { taskCode: '1007', taskName: 'Break', groupId: 'OTHER', startTime: '20:30', endTime: '20:45' },
    { taskCode: '1008', taskName: 'Break', groupId: 'OTHER', startTime: '20:45', endTime: '21:00' },
    { taskCode: '0248', taskName: 'Thu cuối', groupId: 'PERI', startTime: '21:00', endTime: '21:15' },
    { taskCode: '0249', taskName: 'Kho tối', groupId: 'PERI', startTime: '21:15', endTime: '21:30' },
    { taskCode: '0250', taskName: 'Vệ sinh', groupId: 'PERI', startTime: '21:30', endTime: '21:45' },
    { taskCode: '0251', taskName: 'BC Peri', groupId: 'PERI', startTime: '21:45', endTime: '22:00' },
    { taskCode: '0252', taskName: 'Đóng lạnh', groupId: 'PERI', startTime: '22:00', endTime: '22:15' },
    { taskCode: '0253', taskName: 'BG cuối', groupId: 'PERI', startTime: '22:15', endTime: '22:30' },
  ],
  7: [ // Staff 7 - DRY ca chiều
    { taskCode: '0327', taskName: 'Nhận BG', groupId: 'DRY', startTime: '14:30', endTime: '14:45' },
    { taskCode: '0328', taskName: 'OOS Dry', groupId: 'DRY', startTime: '14:45', endTime: '15:00' },
    { taskCode: '0329', taskName: 'Bổ sung', groupId: 'DRY', startTime: '15:00', endTime: '15:15' },
    { taskCode: '0330', taskName: 'Kéo mặt', groupId: 'DRY', startTime: '15:15', endTime: '15:30' },
    { taskCode: '0331', taskName: 'Promo', groupId: 'DRY', startTime: '15:30', endTime: '15:45' },
    { taskCode: '0332', taskName: 'Endcap', groupId: 'DRY', startTime: '15:45', endTime: '16:00' },
    { taskCode: '0333', taskName: 'HSD', groupId: 'DRY', startTime: '16:00', endTime: '16:15' },
    { taskCode: '0334', taskName: 'Snack', groupId: 'DRY', startTime: '16:15', endTime: '16:30' },
    { taskCode: '0335', taskName: 'Nước', groupId: 'DRY', startTime: '16:30', endTime: '16:45' },
    { taskCode: '0336', taskName: 'FIFO', groupId: 'DRY', startTime: '16:45', endTime: '17:00' },
    { taskCode: '0337', taskName: 'BS peak', groupId: 'DRY', startTime: '17:00', endTime: '17:15' },
    { taskCode: '0338', taskName: 'Kéo peak', groupId: 'DRY', startTime: '17:15', endTime: '17:30' },
    { taskCode: '0339', taskName: 'OOS peak', groupId: 'DRY', startTime: '17:30', endTime: '17:45' },
    { taskCode: '0340', taskName: 'Gondola', groupId: 'DRY', startTime: '17:45', endTime: '18:00' },
    { taskCode: '0341', taskName: 'Mì gói', groupId: 'DRY', startTime: '18:00', endTime: '18:15' },
    { taskCode: '0342', taskName: 'Gia vị', groupId: 'DRY', startTime: '18:15', endTime: '18:30' },
    { taskCode: '0343', taskName: 'Bánh kẹo', groupId: 'DRY', startTime: '18:30', endTime: '18:45' },
    { taskCode: '0344', taskName: 'Kéo tối', groupId: 'DRY', startTime: '18:45', endTime: '19:00' },
    { taskCode: '0345', taskName: 'Giảm HSD', groupId: 'DRY', startTime: '19:00', endTime: '19:15' },
    { taskCode: '0346', taskName: 'Thu dọn', groupId: 'DRY', startTime: '19:15', endTime: '19:30' },
    { taskCode: '0809', taskName: 'VS Dry', groupId: 'QC-FSH', startTime: '19:30', endTime: '19:45' },
    { taskCode: '0347', taskName: 'Kiểm kho', groupId: 'DRY', startTime: '19:45', endTime: '20:00' },
    { taskCode: '1005', taskName: 'Break', groupId: 'OTHER', startTime: '20:00', endTime: '20:15' },
    { taskCode: '1006', taskName: 'Break', groupId: 'OTHER', startTime: '20:15', endTime: '20:30' },
    { taskCode: '1007', taskName: 'Break', groupId: 'OTHER', startTime: '20:30', endTime: '20:45' },
    { taskCode: '1008', taskName: 'Break', groupId: 'OTHER', startTime: '20:45', endTime: '21:00' },
    { taskCode: '0348', taskName: 'Kéo cuối', groupId: 'DRY', startTime: '21:00', endTime: '21:15' },
    { taskCode: '0349', taskName: 'BC OOS', groupId: 'DRY', startTime: '21:15', endTime: '21:30' },
    { taskCode: '0350', taskName: 'Vệ sinh', groupId: 'DRY', startTime: '21:30', endTime: '21:45' },
    { taskCode: '0351', taskName: 'BC Dry', groupId: 'DRY', startTime: '21:45', endTime: '22:00' },
    { taskCode: '0352', taskName: 'Kiểm cuối', groupId: 'DRY', startTime: '22:00', endTime: '22:15' },
    { taskCode: '0353', taskName: 'BG cuối', groupId: 'DRY', startTime: '22:15', endTime: '22:30' },
  ],
  8: [ // Staff 8 - DELICA/DND ca chiều
    { taskCode: '0506', taskName: 'Nhận BG', groupId: 'DELICA', startTime: '14:30', endTime: '14:45' },
    { taskCode: '0603', taskName: 'Kiểm D&D', groupId: 'DND', startTime: '14:45', endTime: '15:00' },
    { taskCode: '0507', taskName: 'Pha Cafe', groupId: 'DELICA', startTime: '15:00', endTime: '15:15' },
    { taskCode: '0508', taskName: 'Lên Delica', groupId: 'DELICA', startTime: '15:15', endTime: '15:30' },
    { taskCode: '0604', taskName: 'Đặt D&D', groupId: 'DND', startTime: '15:30', endTime: '15:45' },
    { taskCode: '0605', taskName: 'Kéo D&D', groupId: 'DND', startTime: '15:45', endTime: '16:00' },
    { taskCode: '0509', taskName: 'HSD Del', groupId: 'DELICA', startTime: '16:00', endTime: '16:15' },
    { taskCode: '0510', taskName: 'Bánh', groupId: 'DELICA', startTime: '16:15', endTime: '16:30' },
    { taskCode: '0606', taskName: 'Sữa D&D', groupId: 'DND', startTime: '16:30', endTime: '16:45' },
    { taskCode: '0607', taskName: 'FIFO D&D', groupId: 'DND', startTime: '16:45', endTime: '17:00' },
    { taskCode: '0511', taskName: 'Pha peak', groupId: 'DELICA', startTime: '17:00', endTime: '17:15' },
    { taskCode: '0512', taskName: 'Phục vụ', groupId: 'DELICA', startTime: '17:15', endTime: '17:30' },
    { taskCode: '0608', taskName: 'D&D peak', groupId: 'DND', startTime: '17:30', endTime: '17:45' },
    { taskCode: '0609', taskName: 'OOS D&D', groupId: 'DND', startTime: '17:45', endTime: '18:00' },
    { taskCode: '0513', taskName: 'BS Del', groupId: 'DELICA', startTime: '18:00', endTime: '18:15' },
    { taskCode: '0514', taskName: 'Kéo Del', groupId: 'DELICA', startTime: '18:15', endTime: '18:30' },
    { taskCode: '0610', taskName: 'Nhiệt D&D', groupId: 'DND', startTime: '18:30', endTime: '18:45' },
    { taskCode: '0611', taskName: 'Kéo D&D', groupId: 'DND', startTime: '18:45', endTime: '19:00' },
    { taskCode: '0515', taskName: 'Giảm Del', groupId: 'DELICA', startTime: '19:00', endTime: '19:15' },
    { taskCode: '0612', taskName: 'Giảm D&D', groupId: 'DND', startTime: '19:15', endTime: '19:30' },
    { taskCode: '0810', taskName: 'VS Del', groupId: 'QC-FSH', startTime: '19:30', endTime: '19:45' },
    { taskCode: '0516', taskName: 'Thu Del', groupId: 'DELICA', startTime: '19:45', endTime: '20:00' },
    { taskCode: '1005', taskName: 'Break', groupId: 'OTHER', startTime: '20:00', endTime: '20:15' },
    { taskCode: '1006', taskName: 'Break', groupId: 'OTHER', startTime: '20:15', endTime: '20:30' },
    { taskCode: '1007', taskName: 'Break', groupId: 'OTHER', startTime: '20:30', endTime: '20:45' },
    { taskCode: '1008', taskName: 'Break', groupId: 'OTHER', startTime: '20:45', endTime: '21:00' },
    { taskCode: '0517', taskName: 'Đóng Del', groupId: 'DELICA', startTime: '21:00', endTime: '21:15' },
    { taskCode: '0613', taskName: 'Thu D&D', groupId: 'DND', startTime: '21:15', endTime: '21:30' },
    { taskCode: '0518', taskName: 'VS máy', groupId: 'DELICA', startTime: '21:30', endTime: '21:45' },
    { taskCode: '0614', taskName: 'Kho D&D', groupId: 'DND', startTime: '21:45', endTime: '22:00' },
    { taskCode: '0519', taskName: 'BC Del', groupId: 'DELICA', startTime: '22:00', endTime: '22:15' },
    { taskCode: '0615', taskName: 'BG D&D', groupId: 'DND', startTime: '22:15', endTime: '22:30' },
  ],
};

// Mock data from JSON files (subset for demo)
const MOCK_STORES: Store[] = [
  { store_id: 1, store_code: 'AMPM_D1_NCT', store_name: 'AEON MaxValu Nguyen Cu Trinh', region_id: null, address: 'Quan 1, TP.HCM', phone: null, email: null, manager_id: null, status: 'ACTIVE', created_at: '', updated_at: '' },
  { store_id: 2, store_code: 'AMPM_D3_LVT', store_name: 'AEON MaxValu Le Van Sy', region_id: null, address: 'Quan 3, TP.HCM', phone: null, email: null, manager_id: null, status: 'ACTIVE', created_at: '', updated_at: '' },
  { store_id: 3, store_code: 'AMPM_D10_CMT', store_name: 'AEON MaxValu CMT8', region_id: null, address: 'Quan 10, TP.HCM', phone: null, email: null, manager_id: null, status: 'ACTIVE', created_at: '', updated_at: '' },
  { store_id: 4, store_code: 'AMPM_SALA', store_name: 'AEON MaxValu Sala', region_id: null, address: 'Quan 2, TP.HCM', phone: null, email: null, manager_id: null, status: 'ACTIVE', created_at: '', updated_at: '' },
];

const MOCK_STAFF: Staff[] = [
  { staff_id: 1, staff_code: 'AMPM_D1_NCT_LEAD_01', staff_name: 'Vo Minh Tuan', role: 'STORE_LEADER_G3', store_id: 1, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 2, staff_code: 'AMPM_D1_NCT_STAFF_02', staff_name: 'Dang Thu Ha', role: 'STAFF', store_id: 1, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 3, staff_code: 'AMPM_D1_NCT_STAFF_03', staff_name: 'Hoang Xuan Kien', role: 'STAFF', store_id: 1, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 4, staff_code: 'AMPM_D1_NCT_STAFF_04', staff_name: 'Bui Thi Lan', role: 'STAFF', store_id: 1, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 5, staff_code: 'AMPM_D1_NCT_STAFF_05', staff_name: 'Le Quoc Phong', role: 'STAFF', store_id: 1, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 6, staff_code: 'AMPM_D1_NCT_STAFF_06', staff_name: 'Tran Ngoc Hanh', role: 'STAFF', store_id: 1, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 7, staff_code: 'AMPM_D1_NCT_STAFF_07', staff_name: 'Pham Duc Anh', role: 'STAFF', store_id: 1, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 8, staff_code: 'AMPM_D1_NCT_STAFF_08', staff_name: 'Vo Phuong Chi', role: 'STAFF', store_id: 1, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 9, staff_code: 'AMPM_D3_LVT_LEAD_01', staff_name: 'Ngo Gia Bao', role: 'STORE_LEADER_G3', store_id: 2, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 10, staff_code: 'AMPM_D3_LVT_STAFF_02', staff_name: 'Duong Ngoc Mai', role: 'STAFF', store_id: 2, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
];

const MOCK_SHIFT_CODES: ShiftCode[] = [
  { shift_code_id: 1, shift_code: 'V8.6', shift_name: 'Ca V8.6', start_time: '06:00:00', end_time: '14:00:00', duration_hours: 8, color_code: '#4F46E5', is_active: true, created_at: '' },
  { shift_code_id: 2, shift_code: 'V8.14', shift_name: 'Ca V8.14', start_time: '14:30:00', end_time: '22:30:00', duration_hours: 8, color_code: '#10B981', is_active: true, created_at: '' },
  { shift_code_id: 3, shift_code: 'V6.8', shift_name: 'Ca V6.8', start_time: '08:00:00', end_time: '14:00:00', duration_hours: 6, color_code: '#F59E0B', is_active: true, created_at: '' },
  { shift_code_id: 4, shift_code: 'V6.16', shift_name: 'Ca V6.16', start_time: '16:00:00', end_time: '22:00:00', duration_hours: 6, color_code: '#EF4444', is_active: true, created_at: '' },
  { shift_code_id: 5, shift_code: 'OFF', shift_name: 'Nghi', start_time: '00:00:00', end_time: '00:00:00', duration_hours: 0, color_code: '#9CA3AF', is_active: true, created_at: '' },
];

// Generate mock shift assignments
const generateMockAssignments = (dateStr: string, staffList: Staff[], shiftCodes: ShiftCode[]): ShiftAssignment[] => {
  return staffList.map((staff, index) => {
    const shiftIndex = index % (shiftCodes.length - 1); // Don't use OFF for everyone
    return {
      assignment_id: index + 1,
      staff_id: staff.staff_id,
      store_id: staff.store_id,
      shift_date: dateStr,
      shift_code_id: shiftCodes[shiftIndex].shift_code_id,
      status: 'assigned',
      notes: null,
      assigned_by: null,
      assigned_at: '',
    };
  });
};

// Format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get Monday of the week
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Schedule row type
interface ScheduleRow {
  staff: Staff;
  assignment: ShiftAssignment | null;
  shiftCode: ShiftCode | null;
}

export default function DailySchedulePage() {
  const { t } = useLanguage();
  const { currentUser } = useUser();
  const router = useRouter();
  const [backendOnline, setBackendOnline] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStoreId, setSelectedStoreId] = useState<string>('1');

  // Data
  const [stores, setStores] = useState<Store[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [shiftCodes, setShiftCodes] = useState<ShiftCode[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Week dates
  const weekDates = useMemo(() => {
    const monday = getMonday(selectedDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  // Time slots generation moved inline to hour columns in render

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        await checkHealth();
        setBackendOnline(true);

        const [storesData, staffData, shiftCodesData] = await Promise.all([
          getStores().catch(() => []),
          getStaff().catch(() => []),
          getShiftCodes(true).catch(() => []),
        ]);

        if (storesData.length > 0) {
          setStores(storesData);
          setStaffList(staffData);
          setShiftCodes(shiftCodesData);
          setSelectedStoreId(String(storesData[0].store_id));
        } else {
          // Use mock data
          setStores(MOCK_STORES);
          setStaffList(MOCK_STAFF);
          setShiftCodes(MOCK_SHIFT_CODES);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setBackendOnline(false);
        // Use mock data when backend is offline
        setStores(MOCK_STORES);
        setStaffList(MOCK_STAFF);
        setShiftCodes(MOCK_SHIFT_CODES);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Load assignments when date or store changes
  useEffect(() => {
    async function loadAssignments() {
      const dateStr = formatDate(selectedDate);

      if (backendOnline) {
        try {
          const params: Record<string, unknown> = {
            start_date: dateStr,
            end_date: dateStr,
          };

          if (selectedStoreId !== 'all') {
            params.store_id = parseInt(selectedStoreId);
          }

          const data = await getShiftAssignments(params);
          setAssignments(data);
        } catch (err) {
          console.error('Failed to load assignments:', err);
          // Generate mock assignments
          const filteredStaff = staffList.filter(s => s.store_id === parseInt(selectedStoreId));
          setAssignments(generateMockAssignments(dateStr, filteredStaff, shiftCodes));
        }
      } else {
        // Generate mock assignments when offline
        const filteredStaff = staffList.filter(s => s.store_id === parseInt(selectedStoreId));
        setAssignments(generateMockAssignments(dateStr, filteredStaff, shiftCodes));
      }
    }

    if (staffList.length > 0 && shiftCodes.length > 0) {
      loadAssignments();
    }
  }, [selectedDate, selectedStoreId, backendOnline, staffList, shiftCodes]);

  // Build schedule rows
  const scheduleRows: ScheduleRow[] = useMemo(() => {
    // Filter staff by store
    const filteredStaff = selectedStoreId === 'all'
      ? staffList
      : staffList.filter(s => s.store_id === parseInt(selectedStoreId));

    return filteredStaff.map(staff => {
      const assignment = assignments.find(a => a.staff_id === staff.staff_id) || null;
      const shiftCode = assignment
        ? shiftCodes.find(sc => sc.shift_code_id === assignment.shift_code_id) || null
        : null;

      return { staff, assignment, shiftCode };
    });
  }, [staffList, assignments, shiftCodes, selectedStoreId]);

  // Navigation functions
  const changeWeek = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setSelectedDate(newDate);
  };

  const selectDay = (date: Date) => {
    setSelectedDate(date);
  };

  // Get ALL tasks that start at this specific time slot (returns array)
  const getTasksStartingAtSlot = (staffId: number, hour: number, minute: number): ScheduledTask[] => {
    const tasks = MOCK_SCHEDULED_TASKS[staffId];
    if (!tasks) return [];

    return tasks.filter(task => {
      const [startH, startM] = task.startTime.split(':').map(Number);
      return startH === hour && startM === minute;
    });
  };

  // Handle Check Task button
  const handleCheckTask = () => {
    alert('Check Task clicked - Feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar Navigation */}
      <aside className="w-14 bg-slate-800 flex flex-col items-center py-4 gap-2 flex-shrink-0">
        {/* Logo */}
        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
          <span className="text-white font-bold text-lg">A</span>
        </div>

        {/* Navigation Items */}
        <button
          className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center"
          title="Lich Hang Ngay"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        <button
          className="w-10 h-10 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors"
          title="Phan Cong Ca"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>

        <button
          className="w-10 h-10 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors"
          title="Bao Cao"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>

        <button
          className="w-10 h-10 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors"
          title="Cai Dat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Help */}
        <button
          className="w-10 h-10 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors"
          title="Tro Giup"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-indigo-600 hover:text-indigo-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-800">
                {t('dws.dailySchedule')} - Lich Hang Ngay
              </h1>
            </div>

            {/* Backend status indicator + Current User */}
            <div className="flex items-center gap-4">
              {/* Current User */}
              {currentUser && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {currentUser.staff_name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-xs">
                    <div className="font-medium text-gray-800">{currentUser.staff_name}</div>
                    <div className="text-gray-500">{currentUser.role}</div>
                  </div>
                </div>
              )}

              {/* Backend Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${backendOnline ? 'bg-green-500' : 'bg-red-500'}`}
                />
                <span className="text-xs text-gray-500">
                  {backendOnline ? 'Online' : 'Offline (Demo)'}
                </span>
                <span className="text-[10px] text-gray-400 ml-1">v21</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Store Filter */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600">Cua hang:</label>
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              {stores.map(store => (
                <option key={store.store_id} value={store.store_id}>{store.store_name}</option>
              ))}
            </select>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            {/* Check Task Button */}
            <button
              onClick={handleCheckTask}
              className="px-4 py-2 bg-blue-400 text-black rounded-md border border-black hover:bg-blue-500 transition-colors text-sm font-medium"
            >
              Check Task
            </button>

            {/* Week Navigation */}
            <div className="flex items-center rounded-md shadow-sm ring-1 ring-inset ring-gray-300 divide-x divide-gray-300">
              <button
                onClick={() => changeWeek(-1)}
                className="p-2 h-9 w-9 flex items-center justify-center rounded-l-md text-gray-600 hover:bg-gray-50"
                title="Tuan truoc"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {weekDates.map((date, index) => {
                const dateStr = formatDate(date);
                const isSelected = formatDate(selectedDate) === dateStr;
                const isToday = formatDate(new Date()) === dateStr;
                const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

                return (
                  <button
                    key={dateStr}
                    onClick={() => selectDay(date)}
                    className={`px-3 py-1 text-sm font-medium transition-colors min-w-[50px] ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : isToday
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-xs">{dayNames[index]}</div>
                    <div className="text-[10px]">{date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
                  </button>
                );
              })}

              <button
                onClick={() => changeWeek(1)}
                className="p-2 h-9 w-9 flex items-center justify-center rounded-r-md text-gray-600 hover:bg-gray-50"
                title="Tuan sau"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-hidden flex flex-col">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden flex-1 flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-500">Dang tai du lieu...</p>
              </div>
            </div>
          ) : scheduleRows.length === 0 ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">Khong co du lieu</p>
                <p className="text-sm">Khong co lich lam viec cho ngay nay</p>
              </div>
            </div>
          ) : (
            <div className="overflow-auto flex-1" id="schedule-grid-container">
              <table className="min-w-full border-collapse table-fixed">
                {/* Header - like legacy with completion rate */}
                <thead className="bg-slate-100 border-2 border-b-black sticky top-0 z-20">
                  <tr>
                    {/* First column - Store completion rate like legacy */}
                    <th className="p-2 border border-black w-40 min-w-40 sticky left-0 bg-slate-100 z-30">
                      <div className="relative w-full h-full flex items-center justify-center" title="Ty le hoan thanh cua cua hang">
                        <svg className="w-16 h-16" viewBox="0 0 36 36">
                          <path className="stroke-slate-300" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                          <path className="stroke-indigo-500" strokeWidth="4" fill="none" strokeDasharray="68, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-base font-bold text-indigo-600">68%</div>
                      </div>
                    </th>
                    {/* Hour columns - each hour gets 4 quarter slots */}
                    {Array.from({ length: 19 }, (_, i) => i + 5).map(hour => (
                      <th
                        key={hour}
                        data-hour={hour}
                        className="p-2 border border-black min-w-[310px] text-center font-semibold text-slate-700"
                        colSpan={4}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-blue-600 text-sm">
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-xs">1.25</span>
                          </span>
                          <span className="text-2xl">{String(hour).padStart(2, '0')}:00</span>
                          <span className="text-green-600 text-sm">
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs">1.50</span>
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Body - like legacy with tall rows and task cards */}
                <tbody>
                  {scheduleRows.map(row => {
                    const staffTasks = MOCK_SCHEDULED_TASKS[row.staff.staff_id] || [];
                    const completedCount = staffTasks.filter(t => t.isComplete === 1).length;
                    const totalCount = staffTasks.length;
                    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                    const experiencePoints = staffTasks.reduce((sum, t) => sum + (t.awardedPoints || 5), 0);

                    return (
                      <tr key={row.staff.staff_id} className="border-b-2 border-black">
                        {/* Staff Info - Left Column (like legacy) */}
                        <td className="h-[106px] align-middle border-l-2 border-r-2 border-black sticky left-0 bg-white z-10 min-w-40 flex flex-col transition-all">
                          {/* Row 1: Name, Position, Experience Points */}
                          <div className="relative text-center flex-shrink-0 p-1">
                            <div className="text-sm font-semibold text-slate-800">{row.staff.staff_name}</div>
                            <div className="text-xs text-slate-600">{row.staff.role || 'Staff'}</div>
                            <div className="absolute bottom-1 right-2 text-xs text-amber-600 font-bold" title="Diem kinh nghiem">
                              <svg className="w-3 h-3 inline text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {experiencePoints.toLocaleString()}
                            </div>
                          </div>

                          {/* Row 2: Plan/Actual and Progress Ring */}
                          <div className="flex justify-between items-stretch flex-grow border-t border-black">
                            {/* Left: Plan/Actual and Alert */}
                            <div className="text-xs whitespace-nowrap border-r border-black flex-grow p-1">
                              {row.shiftCode ? (
                                <>
                                  <div><strong>Plan:</strong> {row.shiftCode.shift_code}: {row.shiftCode.start_time.substring(0, 5)}~{row.shiftCode.end_time.substring(0, 5)}</div>
                                  <div><strong>Actual:</strong> {row.shiftCode.start_time.substring(0, 5)}~{row.shiftCode.end_time.substring(0, 5)}</div>
                                  <div className="text-green-600 font-semibold">
                                    <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Dung gio
                                  </div>
                                </>
                              ) : (
                                <div className="text-gray-400">OFF</div>
                              )}
                            </div>

                            {/* Right: Progress Ring */}
                            <div className="relative w-12 h-12 flex-shrink-0 self-center mx-2" title={`Ty le hoan thanh: ${completionRate}%`}>
                              <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path className="stroke-slate-200" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                                <path className="stroke-green-500" strokeWidth="4" fill="none" strokeDasharray={`${completionRate}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center leading-tight">
                                <span className="text-xs font-bold text-green-600">{completionRate}%</span>
                                <span className="text-[10px] font-semibold text-amber-600">+{experiencePoints}</span>
                              </div>
                            </div>
                          </div>

                          {/* Row 3: Sub-tasks */}
                          <div className="border-t pb-[2px] border-black text-xs p-1">
                            <strong>Sub-tasks:</strong> {staffTasks.length > 0 ? staffTasks.slice(0, 2).map(t => t.taskName).join(', ') : 'N/A'}...
                          </div>
                        </td>

                        {/* Time Slots - 15 minute intervals with task cards */}
                        {Array.from({ length: 19 }, (_, hourIdx) => hourIdx + 5).map(hour => (
                          <td key={`${row.staff.staff_id}-hour-${hour}`} className="p-0 border border-black align-middle">
                            <div className="grid grid-cols-4 h-[104px]">
                              {[0, 15, 30, 45].map(minute => {
                                const slotTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                                const tasksAtSlot = getTasksStartingAtSlot(row.staff.staff_id, hour, minute);
                                const now = new Date();
                                const currentHour = now.getHours();
                                const currentMinute = now.getMinutes();
                                const currentQuarter = currentMinute < 15 ? 0 : currentMinute < 30 ? 15 : currentMinute < 45 ? 30 : 45;
                                const isCurrentSlot = hour === currentHour && minute === currentQuarter && formatDate(selectedDate) === formatDate(now);

                                return (
                                  <div
                                    key={`${slotTime}`}
                                    className={`quarter-hour-slot border-r border-dashed border-slate-200 last:border-r-0 h-full ${
                                      isCurrentSlot ? 'bg-amber-100' : ''
                                    }`}
                                    data-time={`${String(hour).padStart(2, '0')}:00`}
                                    data-quarter={String(minute).padStart(2, '0')}
                                  >
                                    {tasksAtSlot.map((task, taskIdx) => {
                                      const taskColors = TASK_GROUP_COLORS[task.groupId];
                                      return (
                                        <div
                                          key={`${task.taskCode}-${taskIdx}`}
                                          className="scheduled-task-item w-full h-full border-2 text-xs p-1 rounded-md shadow-sm flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-md transition-shadow"
                                          style={{
                                            backgroundColor: taskColors?.bg || '#f1f5f9',
                                            color: taskColors?.text || '#1e293b',
                                            borderColor: taskColors?.border || '#94a3b8',
                                          }}
                                          title={`${task.taskName} (${task.taskCode})`}
                                        >
                                          <span className="font-medium leading-tight truncate w-full">{task.taskName}</span>
                                          <span className="font-bold text-sm mt-1">{task.taskCode}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      </div>
    </div>
  );
}
