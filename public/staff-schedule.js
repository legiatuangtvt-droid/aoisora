import { db } from './firebase.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let currentDate = new Date(); // Bắt đầu với tháng hiện tại

let allSchedulesForMonth = [];
let allStores = [];
let allShiftCodes = [];
const SHIFT_CODES_STORAGE_KEY = 'aoisora_shiftCodes';

/**
 * Tải danh sách mã ca từ localStorage.
 */
function loadShiftCodes() {
    const storedData = localStorage.getItem(SHIFT_CODES_STORAGE_KEY);
    if (storedData) {
        try {
            const parsedData = JSON.parse(storedData);
            if (Array.isArray(parsedData)) {
                allShiftCodes = parsedData;
            }
        } catch (e) {
            console.error("Lỗi khi đọc dữ liệu mã ca từ localStorage", e);
        }
    }
}

/**
 * Tải dữ liệu nền cần thiết (ví dụ: danh sách cửa hàng).
 */
async function fetchInitialData() {
    try {
        const storesSnapshot = await getDocs(collection(db, 'stores'));
        allStores = storesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Lỗi khi tải danh sách cửa hàng:", error);
        window.showToast("Không thể tải dữ liệu cửa hàng.", "error");
    }
}

/**
 * Tải lịch làm việc của người dùng hiện tại cho tháng đang xem.
 */
async function fetchSchedulesForMonth() {
    const currentUser = window.currentUser;
    if (!currentUser || !currentUser.id) {
        allSchedulesForMonth = [];
        return;
    }

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).toISOString().split('T')[0];
    const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const scheduleQuery = query(collection(db, 'schedules'),
        where("employeeId", "==", currentUser.id),
        where("date", ">=", firstDay),
        where("date", "<=", lastDay)
    );

    const scheduleSnapshot = await getDocs(scheduleQuery);
    allSchedulesForMonth = scheduleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Render toàn bộ giao diện lịch.
 */
function renderCalendar() {
    const headerEl = document.getElementById('calendar-header');
    const weekdaysEl = document.getElementById('calendar-weekdays');
    const bodyEl = document.getElementById('calendar-body');

    if (!headerEl || !weekdaysEl || !bodyEl) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString('vi-VN', { month: 'long' });
    
    const today = new Date();
    const isCurrentMonthView = today.getFullYear() === year && today.getMonth() === month;

    // 1. Render Header
    headerEl.innerHTML = `
        <h2 class="text-xl font-bold text-gray-800">${monthName} ${year}</h2>
        <div class="flex items-center gap-2">
            <button id="prev-month-btn" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" title="Tháng trước">
                <i class="fas fa-chevron-left text-sm text-gray-600"></i>
            </button>
            <button id="next-month-btn" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" title="Tháng sau">
                <i class="fas fa-chevron-right text-sm text-gray-600"></i>
            </button>
        </div>
    `;

    // 2. Render Weekday Headers
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    weekdaysEl.innerHTML = weekdays.map(day => `
        <div class="p-3 text-center font-semibold text-sm text-gray-500">${day}</div>
    `).join('');

    // 3. Render Calendar Body
    bodyEl.innerHTML = ''; // Xóa các ô cũ

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Lấy ngày bắt đầu của tuần (0=Sun, 1=Mon, ..., 6=Sat)
    let startDayIndex = firstDayOfMonth.getDay();
    if (startDayIndex === 0) startDayIndex = 7; // Chuyển Chủ Nhật về cuối (7)
    const paddingDays = startDayIndex - 1;

    // Render các ngày trống của tháng trước
    // Thêm border-b cho hàng cuối cùng của các ngày trống nếu cần
    for (let i = 0; i < paddingDays; i++) {
        bodyEl.innerHTML += `<div class="border-t border-l border-gray-200 bg-gray-50 [&:nth-child(7n)]:border-r"></div>`;
    }

    // Render các ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const schedule = allSchedulesForMonth.find(s => s.date === dateStr);
        const isToday = isCurrentMonthView && today.getDate() === day;

        // Thêm lớp để kẻ viền phải cho cột cuối cùng và viền dưới cho hàng cuối cùng
        let dayCellClasses = "relative p-2 border-t border-l border-gray-200 flex flex-col [&:nth-child(7n)]:border-r";
        let daySpanClasses = "self-end text-sm font-medium text-gray-500";

        // Nếu là ngày hôm nay, áp dụng style đặc biệt
        if (isToday) {
            dayCellClasses += " bg-green-50"; // Nền xanh nhạt cho cả ô
            daySpanClasses = "self-end text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white"; // Vòng tròn màu xanh cho số ngày
        }

        let contentHTML = '';
        if (schedule) {
            const storeName = allStores.find(s => s.id === schedule.storeId)?.name || schedule.storeId;
            const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === schedule.shift);
            const timeRange = shiftInfo ? shiftInfo.timeRange : 'N/A';
            contentHTML = `
                <div class="text-center mt-2 w-full">
                    <p class="font-bold text-sm text-indigo-700 truncate" title="${storeName}">${storeName}</p>
                    <p class="text-xs text-gray-600 mt-1" title="Mã ca: ${schedule.shift || 'N/A'}">${timeRange}</p>
                </div>
            `;
        }

        bodyEl.innerHTML += `
            <div class="${dayCellClasses}">
                <span class="${daySpanClasses}">${day}</span>
                <div class="flex-1 flex items-center justify-center">
                    ${contentHTML}
                </div>
            </div>
        `;
    }

    // Render các ngày trống của tháng sau để lấp đầy lưới
    const totalCells = paddingDays + daysInMonth;
    const remainingCells = (totalCells % 7 === 0) ? 0 : 7 - (totalCells % 7);
    
    for (let i = 0; i < remainingCells; i++) {
        bodyEl.innerHTML += `<div class="border-t border-l border-gray-200 bg-gray-50 [&:nth-child(7n)]:border-r"></div>`;
    }

    // Thêm border-b cho tất cả các ô trong hàng cuối cùng
    const allCells = bodyEl.children;
    for (let i = allCells.length - 7; i < allCells.length; i++) {
        if (allCells[i]) allCells[i].classList.add('border-b');
    }
    // Gắn lại sự kiện cho các nút điều hướng
    document.getElementById('prev-month-btn')?.addEventListener('click', () => changeMonth(-1), { signal: domController.signal });
    document.getElementById('next-month-btn')?.addEventListener('click', () => changeMonth(1), { signal: domController.signal });
}

async function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    await fetchSchedulesForMonth();
    renderCalendar();
}

export function cleanup() {
    if (domController) {
        domController.abort();
        domController = null;
    }
}

export async function init() {
    domController = new AbortController();
    loadShiftCodes();
    await fetchInitialData();
    await fetchSchedulesForMonth();
    renderCalendar();
}