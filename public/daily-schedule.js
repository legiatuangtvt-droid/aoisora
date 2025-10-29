﻿import { db } from './firebase.js';
import { collection, onSnapshot, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;

// Biến toàn cục để lưu trữ dữ liệu
let allEmployees = [];
let allStores = [];
let allAreas = [];
let allRegions = [];
let allTaskGroups = {};
let currentScheduleData = []; // Lịch làm việc cho ngày đang chọn
let filteredEmployees = []; // Nhân viên sau khi đã lọc theo cửa hàng

//#region DATA_FETCHING
/**
 * Tải tất cả dữ liệu nền cần thiết một lần.
 */
async function fetchInitialData() {
    try {
        const [employeesSnap, storesSnap, areasSnap, regionsSnap, taskGroupsSnap] = await Promise.all([
            getDocs(collection(db, 'employee')),
            getDocs(collection(db, 'stores')),
            getDocs(collection(db, 'areas')),
            getDocs(collection(db, 'regions')),
            getDocs(collection(db, 'task_groups')),
        ]);

        let fetchedEmployees = employeesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allStores = storesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allAreas = areasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allRegions = regionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        taskGroupsSnap.docs.forEach(doc => {
            allTaskGroups[doc.id] = { id: doc.id, ...doc.data() };
        });

        // Lọc nhân viên dựa trên vai trò của người dùng hiện tại
        const currentUser = window.currentUser;
        if (currentUser) {
            switch (currentUser.roleId) {
                case 'STAFF':
                    fetchedEmployees = fetchedEmployees.filter(emp => emp.id === currentUser.id);
                    break;
                case 'STORE_LEADER':
                    fetchedEmployees = fetchedEmployees.filter(emp => emp.storeId === currentUser.storeId);
                    break;
                case 'AREA_MANAGER':
                    if (currentUser.managedAreaIds && currentUser.managedAreaIds.length > 0) {
                        const managedStoreIds = allStores.filter(s => currentUser.managedAreaIds.includes(s.areaId)).map(s => s.id);
                        fetchedEmployees = fetchedEmployees.filter(emp => managedStoreIds.includes(emp.storeId));
                    }
                    break;
                case 'REGIONAL_MANAGER':
                    if (currentUser.managedRegionId) {
                        const managedAreaIds = allAreas.filter(a => a.regionId === currentUser.managedRegionId).map(a => a.id);
                        const managedStoreIds = allStores.filter(s => managedAreaIds.includes(s.areaId)).map(s => s.id);
                        fetchedEmployees = fetchedEmployees.filter(emp => managedStoreIds.includes(emp.storeId));
                    }
                    break;
            }
        }
        allEmployees = fetchedEmployees;

    } catch (error) {
        console.error("Lỗi nghiêm trọng khi tải dữ liệu nền:", error);
        showToast("Không thể tải dữ liệu nền. Vui lòng thử lại.", "error");
    }
}

/**
 * Lắng nghe thay đổi lịch làm việc cho một ngày cụ thể.
 * @param {string} dateString - Ngày cần lấy dữ liệu (YYYY-MM-DD).
 */
function listenForScheduleChanges(dateString) {
    // Hủy listener cũ trước khi tạo listener mới
    if (window.currentScheduleUnsubscribe) {
        window.currentScheduleUnsubscribe();
        window.currentScheduleUnsubscribe = null;
    }

    const storeFilter = document.getElementById('store-filter');
    const selectedStoreId = storeFilter ? storeFilter.value : 'all';

    if (selectedStoreId === 'all') {
        filteredEmployees = [];
    } else {
        filteredEmployees = allEmployees.filter(emp => emp.storeId === selectedStoreId);
    }

    const employeeIds = filteredEmployees.map(emp => emp.id);

    if (employeeIds.length === 0) {
        currentScheduleData = [];
        renderScheduleGrid();
        return;
    }
    const q = query(collection(db, 'schedules'), where("date", "==", dateString), where("employeeId", "in", employeeIds));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        currentScheduleData = snapshot.docs.map(doc => {
            const data = doc.data(); // Dữ liệu từ Firestore
            const employeeInfo = filteredEmployees.find(emp => emp.id === data.employeeId) || { name: 'Không rõ', roleId: 'N/A' };
            return {
                docId: doc.id,
                ...data,
                name: employeeInfo.name, // Sửa lỗi: employeeInfo chưa được định nghĩa
                role: employeeInfo.roleId,
                shift: "Ca làm việc", // Cần bổ sung thông tin ca làm
            };
        });
        renderScheduleGrid();
    }, (error) => {
        console.error(`Lỗi khi lắng nghe lịch ngày ${dateString}:`, error);
        showToast("Mất kết nối tới dữ liệu lịch làm việc.", "error");
    });

    // Đảm bảo listener cũ được hủy khi có listener mới
    if (window.currentScheduleUnsubscribe) {
        window.currentScheduleUnsubscribe();
    }
    window.currentScheduleUnsubscribe = unsubscribe;
}
//#endregion

//#region RENDERING
const defaultColor = {
    bg: '#e2e8f0', text: '#1e293b', border: '#94a3b8'
};

function renderScheduleGrid() {
    const container = document.getElementById('schedule-grid-container');
    if (!container) return;

    const timeSlots = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

    const table = document.createElement('table');
    table.className = 'min-w-full border-collapse border border-slate-200 table-fixed';

    // --- Tạo Header ---
    const thead = document.createElement('thead');
    thead.className = 'bg-slate-100 sticky top-0 z-20';
    let headerRowHtml = `<th class="p-2 border border-slate-200 w-40 min-w-40 sticky left-0 bg-slate-100 z-30">Nhân viên</th>`;
    timeSlots.forEach(time => {
        headerRowHtml += `<th class="p-2 border border-slate-200 min-w-[308px] text-center font-semibold text-slate-700" data-hour="${time.split(':')[0]}">${time}</th>`;
    });
    thead.innerHTML = `<tr>${headerRowHtml}</tr>`;
    table.appendChild(thead);

    // --- Tạo Body ---
    const tbody = document.createElement('tbody');
    if (filteredEmployees.length === 0) {
        const selectedDate = document.getElementById('date').value;
        const storeFilter = document.getElementById('store-filter');
        const selectedStoreId = storeFilter ? storeFilter.value : 'all';

        if (selectedStoreId === 'all') {
            tbody.innerHTML = `<tr><td colspan="${25}" class="text-center p-10 text-gray-500">Vui lòng chọn cửa hàng để xem lịch làm việc.</td></tr>`;
        } else {
            tbody.innerHTML = `<tr><td colspan="${25}" class="text-center p-10 text-gray-500">Không có lịch làm việc cho ngày ${selectedDate}.</td></tr>`;
        }
    } else { 
        filteredEmployees.forEach(employee => {
            const row = document.createElement('tr');
            row.className = 'border-b border-slate-200';
            let rowHtml = `
                <td class="group relative p-2 border border-slate-200 align-top sticky left-0 bg-white z-10 w-40 min-w-40 font-semibold text-left">
                    <div class="text-sm text-slate-800">${employee.name}</div>
                    <div class="text-xs text-slate-500 font-normal">${employee.shift}</div>
                </td>`;

            timeSlots.forEach(time => {
                rowHtml += `
                    <td class="p-0 border border-slate-200 align-top">
                        <div class="grid grid-cols-4 h-[104px]">
                            <div class="quarter-hour-slot border-r border-dashed border-slate-200 flex justify-center items-center" data-time="${time}" data-quarter="00"></div>
                            <div class="quarter-hour-slot border-r border-dashed border-slate-200 flex justify-center items-center" data-time="${time}" data-quarter="15"></div>
                            <div class="quarter-hour-slot border-r border-dashed border-slate-200 flex justify-center items-center" data-time="${time}" data-quarter="30"></div>
                            <div class="quarter-hour-slot flex justify-center items-center" data-time="${time}" data-quarter="45"></div>
                        </div>
                    </td>`;
            });
            row.innerHTML = rowHtml;

            // Điền các task vào các ô
            const employeeSchedule = currentScheduleData.find(sch => sch.employeeId === employee.id);
            (employeeSchedule?.tasks || []).forEach(task => {
                const [hour, quarter] = task.startTime.split(':');
                const time = `${hour}:00`;
                const slot = row.querySelector(`.quarter-hour-slot[data-time="${time}"][data-quarter="${quarter}"]`);
                if (slot) {
                    const group = allTaskGroups[task.groupId] || {};
                    const color = (group.color && group.color.bg) ? group.color : defaultColor;
                    const taskItem = document.createElement('div');
                    // Áp dụng style giống trang daily-templates
                    taskItem.className = `scheduled-task-item relative group w-[70px] h-[100px] border-2 text-xs p-1 rounded-md shadow-sm flex flex-col justify-between items-center text-center mb-1`;
                    taskItem.style.backgroundColor = color.bg;
                    taskItem.style.color = color.text;
                    taskItem.style.borderColor = color.border;
                    taskItem.title = `${task.name} (${task.taskCode})`;
                    taskItem.innerHTML = `
                        <div class="flex-grow flex flex-col justify-center"><span class="overflow-hidden text-ellipsis">${task.name}</span></div>
                        <span class="font-semibold mt-auto">${task.taskCode}</span>
                    `;
                    slot.appendChild(taskItem);
                }
            });
            tbody.appendChild(row);
        });
    }
    table.appendChild(tbody);

    container.innerHTML = '';
    container.appendChild(table);

    scrollToCurrentTime();
}

/**
 * Tự động cuộn ngang đến cột giờ hiện tại.
 */
function scrollToCurrentTime() {
    const currentHour = new Date().getHours();
    const container = document.getElementById('schedule-grid-container');
    const headerCell = container.querySelector(`th[data-hour="${currentHour}"]`);

    if (headerCell && container) {
        const containerRect = container.getBoundingClientRect();
        const cellRect = headerCell.getBoundingClientRect();
        
        // Tính toán vị trí cuộn: vị trí của ô so với container + vị trí cuộn hiện tại
        const scrollLeft = cellRect.left - containerRect.left + container.scrollLeft;
        
        container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    }
}
//#endregion

//#region INTERACTIONS
function changeDate(delta) {
    const dateInput = document.getElementById('date');
    let currentDate = new Date(dateInput.value);
    currentDate.setDate(currentDate.getDate() + delta);
    
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
    
    // Lắng nghe dữ liệu cho ngày mới
    listenForScheduleChanges(dateInput.value);
}

/**
 * Chuyển về ngày hiện tại.
 */
function jumpToToday() {
    const dateInput = document.getElementById('date');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;

    dateInput.value = todayString;
    listenForScheduleChanges(todayString);
}
//#endregion
//#region FILTERS
/**
 * Tạo và điền dữ liệu cho bộ lọc cửa hàng.
 */
function createStoreFilter() {
    const container = document.getElementById('store-filter-container');
    if (!container) return;

    // Lấy danh sách cửa hàng mà người dùng hiện tại có quyền xem
    const accessibleStoreIds = [...new Set(allEmployees.map(emp => emp.storeId).filter(Boolean))];
    const accessibleStores = allStores
        .filter(store => accessibleStoreIds.includes(store.id))
        .sort((a, b) => a.name.localeCompare(b.name));

    let optionsHTML = '<option value="all">-- Tất cả cửa hàng --</option>';
    accessibleStores.forEach(store => {
        optionsHTML += `<option value="${store.id}">${store.name}</option>`;
    });

    container.innerHTML = `
        <div class="flex-1 max-w-xs">
            <label for="store-filter" class="sr-only">Lọc theo cửa hàng</label>
            <select id="store-filter" class="form-select w-full">${optionsHTML}</select>
        </div>
    `;

    document.getElementById('store-filter')?.addEventListener('change', () => {
        const dateInput = document.getElementById('date');
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayString = `${year}-${month}-${day}`;

        // Tự động đặt lại ngày về hôm nay và tải lịch
        if (dateInput) dateInput.value = todayString;
        listenForScheduleChanges(todayString);
    });
}
//#endregion

export function cleanup() {
    if (domController) {
        domController.abort();
        domController = null;
    }
    if (window.currentScheduleUnsubscribe) {
        window.currentScheduleUnsubscribe();
        window.currentScheduleUnsubscribe = null;
    }
}

export async function init() {
    domController = new AbortController();
    const { signal } = domController;

    // Gán hàm changeDate vào window để HTML có thể gọi
    window.dailySchedule = { changeDate, jumpToToday };

    await fetchInitialData();

    const dateInput = document.getElementById('date');
    // Đặt ngày mặc định là ngày hiện tại
    if (dateInput && !dateInput.value) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
    }
    listenForScheduleChanges(dateInput.value);

    createStoreFilter();

    // Gán listener cho sự kiện thay đổi ngày
    dateInput.addEventListener('change', () => listenForScheduleChanges(dateInput.value), { signal });
}