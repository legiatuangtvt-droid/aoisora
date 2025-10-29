﻿import { db } from './firebase.js';
import { collection, onSnapshot, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;

// Biến toàn cục để lưu trữ dữ liệu
let allEmployees = [];
let allStores = [];
let allAreas = [];
let allRegions = [];
let allTaskGroups = {};
let dailyTemplate = null; // Biến để lưu mẫu lịch trình ngày
let currentScheduleData = []; // Lịch làm việc cho ngày đang chọn
let allShiftCodes = []; // Biến để lưu danh sách mã ca
const SHIFT_CODES_STORAGE_KEY = 'aoisora_shiftCodes';

//#region DATA_FETCHING
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
 * Tải tất cả dữ liệu nền cần thiết một lần.
 */
async function fetchInitialData() {
    try {
        const [employeesSnap, storesSnap, areasSnap, regionsSnap, taskGroupsSnap, templateSnap] = await Promise.all([
            getDocs(collection(db, 'employee')),
            getDocs(collection(db, 'stores')),
            getDocs(collection(db, 'areas')),
            getDocs(collection(db, 'regions')),
            getDocs(collection(db, 'task_groups')),
            getDocs(query(collection(db, 'daily_templates'), where('name', '==', 'Test'))), // Tải mẫu "Test"
        ]);

        let fetchedEmployees = employeesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allStores = storesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allAreas = areasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allRegions = regionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        taskGroupsSnap.docs.forEach(doc => {
            allTaskGroups[doc.id] = { id: doc.id, ...doc.data() };
        });
        // Lưu mẫu đã tải
        if (!templateSnap.empty) {
            dailyTemplate = templateSnap.docs[0].data();
        }


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
    // Hủy listener cũ nếu có để tránh rò rỉ bộ nhớ
    if (window.currentScheduleUnsubscribe) {
        window.currentScheduleUnsubscribe();
        window.currentScheduleUnsubscribe = null;
    }

    const storeFilter = document.getElementById('store-filter');
    const selectedStoreId = storeFilter ? storeFilter.value : 'all';

    if (selectedStoreId === 'all') {
        currentScheduleData = [];
        renderScheduleGrid();
        return;
    }

    // --- LOGIC MỚI: Tải dữ liệu thật từ collection 'schedules' ---
    const scheduleQuery = query(
        collection(db, 'schedules'),
        where('date', '==', dateString),
        where('storeId', '==', selectedStoreId)
    );

    // Sử dụng onSnapshot để lắng nghe thay đổi theo thời gian thực
    window.currentScheduleUnsubscribe = onSnapshot(scheduleQuery, (querySnapshot) => {
        const schedules = [];
        querySnapshot.forEach((doc) => {
            const scheduleData = doc.data();
            const employeeInfo = allEmployees.find(emp => emp.id === scheduleData.employeeId);

            if (employeeInfo) {
                schedules.push({
                    ...scheduleData,
                    name: employeeInfo.name, // Làm giàu dữ liệu với tên nhân viên
                    role: employeeInfo.roleId
                });
            }
        });
        currentScheduleData = schedules;

        // --- LOGIC SẮP XẾP MỚI ---
        if (dailyTemplate && dailyTemplate.shiftMappings) {
            currentScheduleData.sort((a, b) => {
                // Helper function to get start time string (e.g., "06:00")
                const getStartTime = (shiftCode) => {
                    const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === shiftCode);
                    return shiftInfo ? shiftInfo.timeRange.split('~')[0].trim() : '99:99'; // Default to a late time if not found
                };

                const startTimeA = getStartTime(a.shift);
                const startTimeB = getStartTime(b.shift);

                // 1. Sắp xếp theo giờ bắt đầu ca
                if (startTimeA !== startTimeB) {
                    return startTimeA.localeCompare(startTimeB);
                }

                // 2. Nếu cùng giờ bắt đầu, ưu tiên "LEADER"
                if (a.positionId === 'LEADER') return -1;
                if (b.positionId === 'LEADER') return 1;

                // 3. Nếu không phải LEADER, sắp xếp theo thứ tự trong template
                const orderA = Object.keys(dailyTemplate.shiftMappings).findIndex(key => dailyTemplate.shiftMappings[key].positionId === a.positionId);
                const orderB = Object.keys(dailyTemplate.shiftMappings).findIndex(key => dailyTemplate.shiftMappings[key].positionId === b.positionId);
                return orderA - orderB;
            });
        }
        renderScheduleGrid();
    }, (error) => {
        console.error("Lỗi khi lắng nghe thay đổi lịch làm việc: ", error);
        window.showToast("Không thể tải lịch làm việc.", "error");
    });
}
//#endregion

//#region SCROLLING
/**
 * Chuyển đổi chuỗi thời gian "HH:mm" thành số phút trong ngày.
 * @param {string} timeStr - Chuỗi thời gian (e.g., "08:30").
 * @returns {number|null} - Tổng số phút từ 00:00, hoặc null nếu định dạng không hợp lệ.
 */
function timeToMinutes(timeStr) {
    if (!timeStr || !timeStr.includes(':')) return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    return hours * 60 + minutes;
}

/**
 * Tự động cuộn đến nhân viên đang trong ca làm việc tại thời điểm hiện tại.
 */
function scrollToCurrentEmployee() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Tìm nhân viên đầu tiên có ca làm việc chứa giờ hiện tại
    const activeEmployee = currentScheduleData.find(schedule => {
        const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === schedule.shift);
        if (!shiftInfo || !shiftInfo.timeRange) return false;

        const [startStr, endStr] = shiftInfo.timeRange.split('~').map(s => s.trim());
        const startMinutes = timeToMinutes(startStr);
        const endMinutes = timeToMinutes(endStr);

        return startMinutes !== null && endMinutes !== null && currentMinutes >= startMinutes && currentMinutes < endMinutes;
    });

    if (activeEmployee) {
        const employeeRow = document.querySelector(`tr[data-employee-id="${activeEmployee.employeeId}"]`);
        employeeRow?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

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
    if (currentScheduleData.length === 0) {
        const selectedDate = document.getElementById('date').value;
        const storeFilter = document.getElementById('store-filter');
        const selectedStoreId = storeFilter ? storeFilter.value : 'all';

        if (selectedStoreId === 'all') {
            tbody.innerHTML = `<tr><td colspan="${25}" class="text-center p-10 text-gray-500">Vui lòng chọn cửa hàng để xem lịch làm việc.</td></tr>`;
        } else {
            tbody.innerHTML = `<tr><td colspan="${25}" class="text-center p-10 text-gray-500">Không có lịch làm việc cho ngày ${selectedDate}.</td></tr>`;
        }
    } else { 
        currentScheduleData.forEach(schedule => {
            // Tìm khung giờ tương ứng với mã ca
            const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === schedule.shift);
            const timeRange = shiftInfo ? shiftInfo.timeRange : '';

            const row = document.createElement('tr');
            row.className = 'border-b border-slate-200';
            row.dataset.employeeId = schedule.employeeId; // Thêm ID để dễ dàng truy vấn
            let rowHtml = `
                <td class="group p-2 border border-slate-200 align-middle sticky left-0 bg-white z-10 w-40 min-w-40 font-semibold text-center">
                    <div class="text-sm text-slate-800">${schedule.name}</div>
                    <div class="text-xs text-slate-600 font-medium mt-1">${schedule.positionId || ''}</div>
                    <div class="text-xs text-slate-500 font-normal">${schedule.shift}</div>
                    <div class="text-xs text-slate-500 font-normal">${timeRange}</div>
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
            (schedule.tasks || []).forEach(task => {
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

    updateTimeIndicator(); // Thay thế hàm cũ
    scrollToCurrentEmployee(); // Thêm chức năng cuộn dọc
}

/**
 * Tự động cuộn ngang đến cột giờ hiện tại và tô màu cột 15 phút hiện tại.
 */
function updateTimeIndicator() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const container = document.getElementById('schedule-grid-container');
    if (!container) return;

    // --- 1. Cuộn ngang đến cột giờ hiện tại ---
    const headerCell = container.querySelector(`th[data-hour="${currentHour}"]`);
    if (headerCell) {
        const containerRect = container.getBoundingClientRect();
        const cellRect = headerCell.getBoundingClientRect();
        const scrollLeft = cellRect.left - containerRect.left + container.scrollLeft;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }

    // --- 2. Tô màu cột 15 phút hiện tại ---
    // Xóa highlight cũ trên toàn bộ bảng
    document.querySelectorAll('.current-time-slot').forEach(el => el.classList.remove('current-time-slot', 'bg-amber-100'));

    // Xác định quarter hiện tại
    const quarter = currentMinute < 15 ? '00' : currentMinute < 30 ? '15' : currentMinute < 45 ? '30' : '45';
    const timeString = `${String(currentHour).padStart(2, '0')}:00`;

    // Tìm và tô màu các ô trong cột quarter hiện tại
    const slotsToHighlight = container.querySelectorAll(`.quarter-hour-slot[data-time="${timeString}"][data-quarter="${quarter}"]`);
    slotsToHighlight.forEach(slot => slot.classList.add('current-time-slot', 'bg-amber-100'));
}
//#endregion
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

    loadShiftCodes(); // Tải mã ca để sử dụng cho việc sắp xếp
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