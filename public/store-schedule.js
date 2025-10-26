import { db } from './firebase.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let currentDate = new Date();
let allEmployeesInStore = [];
let allSchedulesForMonth = [];

/**
 * Tải dữ liệu nhân viên và lịch làm việc cho tháng hiện tại.
 */
async function fetchInitialData() {
    const currentUser = window.currentUser;
    if (!currentUser || !currentUser.storeId) {
        window.showToast("Không thể xác định cửa hàng của bạn.", "error");
        return;
    }

    // 1. Tải danh sách nhân viên trong cửa hàng
    const employeeQuery = query(collection(db, 'employee'), where("storeId", "==", currentUser.storeId));
    const employeeSnapshot = await getDocs(employeeQuery);
    allEmployeesInStore = employeeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 2. Tải lịch làm việc của tất cả nhân viên đó trong tháng
    await fetchSchedulesForMonth();
}

/**
 * Tải lịch làm việc cho tháng đang xem.
 */
async function fetchSchedulesForMonth() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const employeeIds = allEmployeesInStore.map(emp => emp.id);
    if (employeeIds.length === 0) {
        allSchedulesForMonth = [];
        return;
    }

    const scheduleQuery = query(collection(db, 'schedules'),
        where("employeeId", "in", employeeIds),
        where("date", ">=", firstDay.toISOString().split('T')[0]),
        where("date", "<=", lastDay.toISOString().split('T')[0])
    );

    const scheduleSnapshot = await getDocs(scheduleQuery);
    allSchedulesForMonth = scheduleSnapshot.docs.map(doc => doc.data());
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

    headerEl.innerHTML = `<h2 class="text-xl font-bold text-gray-800">${monthName} ${year}</h2>
        <div class="flex items-center gap-2">
            <button id="prev-month-btn" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" title="Tháng trước"><i class="fas fa-chevron-left text-sm text-gray-600"></i></button>
            <button id="next-month-btn" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" title="Tháng sau"><i class="fas fa-chevron-right text-sm text-gray-600"></i></button>
        </div>`;

    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    weekdaysEl.innerHTML = weekdays.map(day => `<div class="p-3 text-center font-semibold text-sm text-gray-500">${day}</div>`).join('');

    bodyEl.innerHTML = '';

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    let startDayIndex = firstDayOfMonth.getDay();
    if (startDayIndex === 0) startDayIndex = 7;
    const paddingDays = startDayIndex - 1;

    for (let i = 0; i < paddingDays; i++) {
        bodyEl.innerHTML += `<div class="border-t border-l border-gray-200 bg-gray-50 [&:nth-child(7n)]:border-r"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const schedulesForDay = allSchedulesForMonth.filter(s => s.date === dateStr);

        let contentHTML = '<ul class="text-xs space-y-1 mt-1 overflow-y-auto">';
        schedulesForDay.forEach(schedule => {
            const employee = allEmployeesInStore.find(e => e.id === schedule.employeeId);
            contentHTML += `<li class="truncate" title="${employee?.name}: ${schedule.shiftCode}"><span class="font-semibold">${employee?.name || 'N/A'}:</span> ${schedule.shiftCode || 'N/A'}</li>`;
        });
        contentHTML += '</ul>';

        bodyEl.innerHTML += `
            <div class="relative p-2 border-t border-l border-gray-200 flex flex-col [&:nth-child(7n)]:border-r h-32">
                <span class="self-end text-sm font-medium text-gray-500">${day}</span>
                <div class="flex-1">${contentHTML}</div>
            </div>`;
    }

    const totalCells = paddingDays + daysInMonth;
    const remainingCells = (totalCells % 7 === 0) ? 0 : 7 - (totalCells % 7);
    for (let i = 0; i < remainingCells; i++) {
        bodyEl.innerHTML += `<div class="border-t border-l border-gray-200 bg-gray-50 [&:nth-child(7n)]:border-r"></div>`;
    }

    const allCells = bodyEl.children;
    for (let i = allCells.length - 7; i < allCells.length; i++) {
        if (allCells[i]) allCells[i].classList.add('border-b');
    }

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
    await fetchInitialData();
    renderCalendar();
}