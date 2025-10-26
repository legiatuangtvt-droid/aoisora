import { db } from './firebase.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let viewStartDate = new Date();
let allEmployeesInStore = [];
let allAvailabilities = [];

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function fetchInitialData() {
    const currentUser = window.currentUser;
    if (!currentUser || !currentUser.storeId) {
        window.showToast("Không thể xác định cửa hàng của bạn.", "error");
        return;
    }

    const employeeQuery = query(collection(db, 'employee'), where("storeId", "==", currentUser.storeId));
    const employeeSnapshot = await getDocs(employeeQuery);
    allEmployeesInStore = employeeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    await fetchAvailabilitiesForWeek();
}

async function fetchAvailabilitiesForWeek() {
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(viewStartDate);
        date.setDate(date.getDate() + i);
        weekDates.push(formatDate(date));
    }

    const employeeIds = allEmployeesInStore.map(emp => emp.id);
    if (employeeIds.length === 0 || weekDates.length === 0) {
        allAvailabilities = [];
        return;
    }

    const availabilityQuery = query(collection(db, 'staff_availability'),
        where("employeeId", "in", employeeIds),
        where("date", "in", weekDates)
    );

    const availabilitySnapshot = await getDocs(availabilityQuery);
    allAvailabilities = availabilitySnapshot.docs.map(doc => doc.data());
}

function renderAssignmentTable() {
    const header = document.getElementById('assignment-table-header');
    const body = document.getElementById('assignment-table-body');
    const dateDisplay = document.getElementById('current-date-display');
    if (!header || !body || !dateDisplay) return;

    header.innerHTML = '';
    body.innerHTML = '';

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(viewStartDate);
        date.setDate(date.getDate() + i);
        weekDates.push(date);
    }

    dateDisplay.textContent = `Tuần từ ${weekDates[0].toLocaleDateString('vi-VN')} - ${weekDates[6].toLocaleDateString('vi-VN')}`;

    // Render Header
    let headerHTML = `<tr class="border-y border-gray-200"><th class="p-2 border-x border-gray-200 min-w-[150px] bg-slate-50 sticky left-0 z-10">Nhân viên</th>`;
    weekDates.forEach(date => {
        headerHTML += `<th class="p-2 border-x border-gray-200 min-w-[200px] text-center">
            <div class="day-name font-semibold text-gray-700">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div class="date-number text-xs text-gray-500">${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
        </th>`;
    });
    headerHTML += `</tr>`;
    header.innerHTML = headerHTML;

    // Render Body
    if (allEmployeesInStore.length === 0) {
        body.innerHTML = `<tr><td colspan="8" class="text-center p-10 text-gray-500">Cửa hàng này chưa có nhân viên.</td></tr>`;
        return;
    }

    allEmployeesInStore.forEach(employee => {
        const row = document.createElement('tr');
        let rowHTML = `<td class="p-2 border-x border-gray-200 bg-white sticky left-0 z-10 font-semibold">${employee.name}</td>`;

        weekDates.forEach(date => {
            const dateStr = formatDate(date);
            const availability = allAvailabilities.find(a => a.employeeId === employee.id && a.date === dateStr);
            const registrations = availability?.registrations || [];

            let cellContent = '';
            for (let i = 0; i < 2; i++) {
                const reg = registrations[i] || {};
                const shiftCode = reg.shiftCode || '---';
                let priorityIcon = '';
                if (reg.priority === 1) {
                    priorityIcon = '<i class="fas fa-circle text-green-500 ml-2" title="Chắc chắn"></i>';
                } else if (reg.priority === 2) {
                    priorityIcon = '<i class="fas fa-triangle-exclamation text-amber-500 ml-2" title="Có thể"></i>';
                }
                cellContent += `<div class="text-sm p-1 rounded ${reg.priority ? 'bg-slate-100' : ''}">${shiftCode}${priorityIcon}</div>`;
            }
            rowHTML += `<td class="p-2 border-x border-gray-200 align-top">${cellContent}</td>`;
        });
        row.innerHTML = rowHTML;
        body.appendChild(row);
    });

    document.getElementById('prev-week-btn')?.addEventListener('click', () => changeWeek(-1), { signal: domController.signal });
    document.getElementById('next-week-btn')?.addEventListener('click', () => changeWeek(1), { signal: domController.signal });
}

async function changeWeek(direction) {
    viewStartDate.setDate(viewStartDate.getDate() + (direction * 7));
    await fetchAvailabilitiesForWeek();
    renderAssignmentTable();
}

export function cleanup() {
    if (domController) {
        domController.abort();
        domController = null;
    }
}

export async function init() {
    domController = new AbortController();
    viewStartDate.setDate(viewStartDate.getDate() - viewStartDate.getDay() + 1); // Bắt đầu từ thứ 2 của tuần hiện tại
    viewStartDate.setHours(0, 0, 0, 0);

    await fetchInitialData();
    renderAssignmentTable();
}