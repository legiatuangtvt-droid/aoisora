﻿﻿﻿import { db } from './firebase.js';
import { collection, onSnapshot, query, where, getDocs, doc, getDoc, runTransaction, increment } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let viewStartDate = new Date(); // Ngày đầu tiên của tuần đang xem (Thứ 2)
let domController = null;

// Biến toàn cục để lưu trữ dữ liệu
let allEmployees = [];
let allStores = [];
let allAreas = [];
let allRegions = [];
let allTaskGroups = {};
let dailyTemplate = null; // Biến để lưu mẫu lịch trình ngày
let allWorkPositions = []; // Biến để lưu vị trí làm việc
let currentScheduleData = []; // Lịch làm việc cho ngày đang chọn
let allShiftCodes = []; // Biến để lưu danh sách mã ca

let isInitialLoad = true; // Cờ để kiểm tra tải trang lần đầu
/**
 * Định dạng một đối tượng Date thành chuỗi YYYY-MM-DD.
 * @param {Date} date - Đối tượng Date.
 * @returns {string} Chuỗi ngày tháng.
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Lấy ngày thứ 2 của tuần chứa ngày đã cho.
 * @param {Date} d - Ngày bất kỳ.
 * @returns {Date} - Ngày thứ 2 của tuần đó.
 */
function getMonday(d) {
    d = new Date(d);
    const day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

//#region DATA_FETCHING
/**
 * Tải tất cả dữ liệu nền cần thiết một lần.
 */
async function fetchInitialData() {
    try {
        const shiftCodesDocRef = doc(db, 'system_configurations', 'shift_codes');
        const workPositionsQuery = query(collection(db, 'work_positions'), where('status', '==', 'ACTIVE'));
        const [
            shiftCodesSnap,
            workPositionsSnap, employeesSnap, storesSnap, areasSnap, regionsSnap, taskGroupsSnap, templateSnap
        ] = await Promise.all([
            getDoc(shiftCodesDocRef),
            getDocs(workPositionsQuery),
            getDocs(collection(db, 'employee')),
            getDocs(collection(db, 'stores')),
            getDocs(collection(db, 'areas')),
            getDocs(collection(db, 'regions')),
            getDocs(collection(db, 'task_groups')),
            getDocs(query(collection(db, 'daily_templates'), where('name', '==', 'Test'))), // Tải mẫu "Test"
        ]);

        // Xử lý mã ca
        if (shiftCodesSnap.exists()) {
            allShiftCodes = shiftCodesSnap.data().codes || [];
        }

        // Xử lý vị trí làm việc
        allWorkPositions = workPositionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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
                case 'STAFF': // Fall-through to STORE_LEADER logic
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
    showLoadingSpinner(); // Hiển thị spinner khi bắt đầu tải
    if (window.currentScheduleUnsubscribe) { // Hủy listener cũ trước khi tạo listener mới
        window.currentScheduleUnsubscribe();
        window.currentScheduleUnsubscribe = null;
    }

    const storeFilter = document.getElementById('store-filter');
    const selectedStoreId = storeFilter ? storeFilter.value : 'all';

    if (!selectedStoreId || selectedStoreId === 'all' || !dateString) {
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
                    id: doc.id, // Lưu lại ID của document schedule
                    ...scheduleData,
                    name: employeeInfo.name,
                    role: employeeInfo.roleId,
                    experiencePoints: employeeInfo.experiencePoints || 0 // Lấy điểm kinh nghiệm tích lũy
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

//#region LOADING_SPINNER
/**
 * Hiển thị spinner tải dữ liệu trong container chính.
 */
function showLoadingSpinner() {
    const container = document.getElementById('schedule-grid-container');
    if (container) {
        container.innerHTML = `
            <div class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                    <i class="fas fa-spinner fa-spin fa-2x"></i>
                    <p class="mt-2 text-sm">Đang tải dữ liệu...</p>
                </div>
            </div>
        `;
    }
}

/**
 * Ẩn spinner tải dữ liệu (bằng cách xóa nội dung container).
 */
function hideLoadingSpinner() {
    const container = document.getElementById('schedule-grid-container');
    if (container) {
        container.innerHTML = '';
    }
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
    const targetTime = new Date(now.getTime() - 30 * 60 * 1000); // Lùi lại 30 phút
    const targetMinutes = targetTime.getHours() * 60 + targetTime.getMinutes();

    // Tìm TẤT CẢ nhân viên có ca làm việc chứa giờ hiện tại
    const activeEmployees = currentScheduleData.filter(schedule => {
        const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === schedule.shift);
        if (!shiftInfo || !shiftInfo.timeRange) return false;

        const [startStr, endStr] = shiftInfo.timeRange.split('~').map(s => s.trim());
        const startMinutes = timeToMinutes(startStr);
        const endMinutes = timeToMinutes(endStr);
        
        return startMinutes !== null && endMinutes !== null && targetMinutes >= startMinutes && targetMinutes < endMinutes;
    });

    // Nếu có nhân viên đang làm việc, cuộn đến người cuối cùng trong danh sách
    if (activeEmployees.length > 0) {
        const lastActiveEmployee = activeEmployees[activeEmployees.length - 1];
        const employeeRow = document.querySelector(`tr[data-employee-id="${lastActiveEmployee.employeeId}"]`);
        employeeRow?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

//#region RENDERING
const defaultColor = {
    bg: '#e2e8f0', text: '#1e293b', border: '#94a3b8'
};

function renderScheduleGrid() {
    const container = document.getElementById('schedule-grid-container');
    if (!container) return;

    hideLoadingSpinner(); // Ẩn spinner trước khi render lưới
    const timeSlots = Array.from({ length: 19 }, (_, i) => `${String(i + 5).padStart(2, '0')}:00`); // Từ 05:00 đến 23:00

    const table = document.createElement('table');
    table.className = 'min-w-full border-collapse border border-slate-200 table-fixed';

    // --- Tạo Header ---
    // Calculate hourly man-hours
    const hourlyManhours = new Map();
    for (let h = 5; h <= 23; h++) {
        hourlyManhours.set(String(h).padStart(2, '0'), 0);
    }

    currentScheduleData.forEach(schedule => {
        (schedule.tasks || []).forEach(task => {
            const hour = task.startTime.split(':')[0]; // e.g., "06" from "06:15"
            let current = hourlyManhours.get(hour) || 0;
            hourlyManhours.set(hour, current + 0.25); // Each task is 15 minutes = 0.25 hours
        });
    });

    const thead = document.createElement('thead');
    thead.className = 'bg-slate-100 border-2 border-b-black sticky top-0 z-20'; // Tăng z-index để header nổi trên các ô sticky
    
    // First header row: Man-hours
    const manhourRow = document.createElement('tr');
    manhourRow.innerHTML = `<th rowspan="2" class="p-2 border border-slate-200 w-40 min-w-40 sticky left-0 bg-slate-100 z-30">Nhân viên</th>`;
    for (let h = 5; h <= 23; h++) {
        const hourKey = String(h).padStart(2, '0');
        const manhours = hourlyManhours.get(hourKey) || 0;
        manhourRow.innerHTML += `<th class="p-2 border border-slate-200 text-center font-semibold text-slate-700">${manhours.toFixed(2)} Manhour</th>`;
    }
    thead.appendChild(manhourRow);

    // Second header row: Time slots
    const timeSlotRow = document.createElement('tr');
    timeSlots.forEach(time => {
        timeSlotRow.innerHTML += `<th class="p-2 border border-slate-200 min-w-[308px] text-center font-semibold text-slate-700" data-hour="${time.split(':')[0]}">${time}</th>`;
    });
    thead.appendChild(timeSlotRow);
    table.appendChild(thead);

    // --- Tạo Body ---
    const tbody = document.createElement('tbody');
    if (currentScheduleData.length === 0) {
        const selectedDate = document.querySelector('.day-selector-btn.active')?.dataset.date || formatDate(new Date());
        const storeFilter = document.getElementById('store-filter'); // Lấy phần tử select
        const selectedStoreId = storeFilter ? storeFilter.value : 'all'; // Lấy giá trị được chọn

        if (selectedStoreId === 'all') {
            tbody.innerHTML = `<tr><td colspan="${timeSlots.length + 1}" class="text-center p-10 text-gray-500">Vui lòng chọn cửa hàng để xem lịch làm việc.</td></tr>`;
        } else {
            const selectedStore = allStores.find(s => s.id === selectedStoreId); // Tìm cửa hàng trong danh sách đã tải
            const storeName = selectedStore ? selectedStore.name : 'Cửa hàng này';
            const formattedDate = new Date(selectedDate).toLocaleDateString('vi-VN');
            tbody.innerHTML = `<tr>
                <td colspan="${25}" class="text-center p-10">
                    <div class="flex flex-col items-center justify-center text-gray-500">
                        <i class="fas fa-calendar-times fa-3x mb-4 text-gray-400"></i>
                        <p class="font-semibold text-lg">Chưa có dữ liệu</p>
                        <p>Cửa hàng <span class="font-bold text-gray-600">${storeName}</span> chưa có lịch làm việc cho ngày <span class="font-bold text-gray-600">${formattedDate}</span>.</p>
                    </div>
                </td>
            </tr>`;
        }
    } else { 
        currentScheduleData.forEach(schedule => {
            // Tìm khung giờ tương ứng với mã ca
            const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === schedule.shift);
            const timeRange = shiftInfo ? shiftInfo.timeRange : '';

            const row = document.createElement('tr');
            row.className = 'border-b-2 border-black';
            // Tô màu nền cho dòng của người dùng hiện tại
            if (schedule.employeeId === window.currentUser?.id) {
                row.classList.add('bg-green-50');
            }
            row.dataset.employeeId = schedule.employeeId; // Thêm ID để dễ dàng truy vấn
            const positionInfo = allWorkPositions.find(p => p.id === schedule.positionId);
            const positionName = positionInfo ? positionInfo.name : (schedule.positionId || '');

            // --- TÍNH TOÁN DỮ LIỆU CHO BIỂU ĐỒ ---
            const totalTasks = (schedule.tasks || []).length;
            const completedTasks = (schedule.tasks || []).filter(task => task.isComplete === 1).length;
            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            const dailyExp = completedTasks * 5;

            let rowHtml = `
                <td data-action="toggle-edit" data-employee-id="${schedule.employeeId}" class="h-[106px] align-middle group border-l-2 border-r-2 border-black sticky left-0 bg-white z-10 min-w-52 flex flex-col transition-all duration-200 ease-in-out" title="Nhấp đúp để kích hoạt chỉnh sửa">
                    <!-- Dòng 1: Tên, Vị trí, Điểm kinh nghiệm -->
                    <div class="relative text-center flex-shrink-0">
                        <div class="text-sm font-semibold text-slate-800">${schedule.name}</div>
                        <div class="text-xs text-slate-600">${positionName}</div>
                        <div class="absolute bottom-1 right-2 text-xs text-amber-600 font-bold" title="Điểm kinh nghiệm">
                            <i class="fas fa-star text-amber-500"></i> ${(schedule.experiencePoints || 0).toLocaleString('vi-VN')}
                        </div>
                    </div>

                    <!-- Dòng 2: Plan/Actual (trái) và Biểu đồ vành khăn (phải) -->
                    <div class="flex justify-between items-stretch flex-grow border-t border-black">
                        <!-- Cụm bên trái: Plan/Actual và Alert -->
                        <div class="text-xs whitespace-nowrap border-r border-black flex-grow">
                            <div><strong>Plan:</strong> ${schedule.shift}: ${timeRange}</div>
                            <div><strong>Actual:</strong> 07:00~10:00</div>
                            <div class="text-red-500 font-semibold"><i class="fas fa-exclamation-triangle mr-1"></i> Đi trễ</div>
                        </div>

                        <!-- Cụm bên phải (Biểu đồ vành khăn) -->
                        <div class="relative w-12 h-12 flex-shrink-0 self-center mx-2" title="Tỷ lệ hoàn thành task">
                             <svg class="w-full h-full" viewBox="0 0 36 36">
                                 <path class="stroke-slate-200" stroke-width="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                                 <path class="stroke-green-500" stroke-width="4" fill="none" stroke-dasharray="${completionRate}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                             </svg>
                             <div class="absolute inset-0 flex flex-col items-center justify-center leading-tight">
                                 <span class="text-xs font-bold text-green-600">${completionRate}%</span>
                                 <span class="text-[10px] font-semibold text-amber-600">+${dailyExp.toLocaleString('vi-VN')}</span>
                             </div>
                        </div>
                    </div>
                    <!-- Dòng 3, Ô 4: Sub-tasks -->
                    <div class="border-t pb-[2px] border-black text-xs"><strong>Sub-tasks:</strong> Lên hàng, kiểm kê...</div>
                </td>`;

            timeSlots.forEach(time => {
                rowHtml += `
                    <td class="p-0 border border-slate-200 align-middle">
                        <div class="grid grid-cols-4 h-[104px] ">
                            <div class="quarter-hour-slot border-r border-dashed border-slate-200 flex justify-center items-center" data-time="${time}" data-quarter="00"></div>
                            <div class="quarter-hour-slot border-r border-dashed border-slate-200 flex justify-center items-center" data-time="${time}" data-quarter="15"></div>
                            <div class="quarter-hour-slot border-r border-dashed border-slate-200 flex justify-center items-center" data-time="${time}" data-quarter="30"></div>
                            <div class="quarter-hour-slot flex justify-center items-center" data-time="${time}" data-quarter="45"></div>
                        </div>
                    </td>`;
            });
            row.innerHTML = rowHtml;

            // Điền các task vào các ô
            (schedule.tasks || []).forEach((task, index) => {
                const [hour, quarter] = task.startTime.split(':');
                const time = `${hour}:00`;
                const slot = row.querySelector(`.quarter-hour-slot[data-time="${time}"][data-quarter="${quarter}"]`);
                if (slot) {
                    const group = allTaskGroups[task.groupId] || {};
                    const color = (group.color && group.color.bg) ? group.color : defaultColor;
                    const isOwner = window.currentUser?.id === schedule.employeeId;
                    const isCompleted = task.isComplete === 1;

                    const taskItem = document.createElement('div');
                    // Áp dụng style giống trang daily-templates
                    taskItem.className = `scheduled-task-item relative group w-[70px] h-[100px] border-2 text-xs p-1 rounded-md shadow-sm flex flex-col justify-between items-center text-center ${isOwner ? 'cursor-pointer' : ''} ${isCompleted ? 'task-completed' : ''}`;
                    taskItem.dataset.scheduleId = schedule.id;
                    taskItem.dataset.taskIndex = index;
                    taskItem.dataset.employeeId = schedule.employeeId;

                    taskItem.style.backgroundColor = color.bg;
                    taskItem.style.color = color.text;
                    taskItem.style.borderColor = color.border;
                    taskItem.title = `${task.name} (${task.taskCode})`;
                    taskItem.innerHTML = `
                        <div class="task-content flex-grow flex flex-col justify-center"><span class="overflow-hidden text-ellipsis">${task.name}</span></div>
                        <span class="task-content font-semibold mt-auto">${task.taskCode}</span>
                        <div class="task-completed-overlay absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                            <span class="completed-text-stamp">Complete</span>
                        </div>
                    `;
                    slot.appendChild(taskItem);
                }
            });
            tbody.appendChild(row);

            // Ẩn các ô không thuộc khung giờ 05:30 - 23:00
            const firstHourSlots = row.querySelectorAll('.quarter-hour-slot[data-time="05:00"]');
            if (firstHourSlots.length >= 2) {
                firstHourSlots[0].style.visibility = 'hidden';
                firstHourSlots[1].style.visibility = 'hidden';
            }
        });
    }
    table.appendChild(tbody);

    container.innerHTML = '';
    container.appendChild(table);

    // --- HIGHLIGHT CURRENT TIME SLOT ---
    // Xác định quarter tại thời điểm hiện tại
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const quarter = currentMinute < 15 ? '00' : currentMinute < 30 ? '15' : currentMinute < 45 ? '30' : '45';
    const timeString = `${String(currentHour).padStart(2, '0')}:00`;

    // Tìm và tô màu các ô trong cột quarter hiện tại
    const slotsToHighlight = container.querySelectorAll(`.quarter-hour-slot[data-time="${timeString}"][data-quarter="${quarter}"]`);
    slotsToHighlight.forEach(slot => slot.classList.add('current-time-slot', 'bg-amber-100'));



    // Thêm một khoảng trễ nhỏ để đảm bảo trình duyệt đã render xong trước khi cuộn.
    // Điều này khắc phục vấn đề không cuộn đúng vị trí khi tải lại trang (F5).
    setTimeout(() => {
        if (currentScheduleData.length > 0) {
            // Nếu có dữ liệu, cuộn đến giờ và nhân viên hiện tại
            if (isInitialLoad) {
                updateTimeIndicator(); // Hàm này cũng bao gồm cuộn ngang
                isInitialLoad = false; // Đặt lại cờ sau lần cuộn đầu tiên
            }
        } else {
            // Nếu không có dữ liệu, cuộn ra giữa để thấy thông báo
            // Dùng setTimeout để đảm bảo DOM đã được render trước khi cuộn
            const gridContainer = document.getElementById('schedule-grid-container');
            if (gridContainer) {
                // Tính toán vị trí cuộn để nội dung thông báo ở giữa màn hình
                const scrollLeft = (gridContainer.scrollWidth - gridContainer.clientWidth) / 2;
                gridContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    }, 100);
    scrollToCurrentEmployee();
}

/**
 * Xử lý khi người dùng click vào một task.
 * @param {Event} event
 */
async function handleTaskClick(event) {
    const taskItem = event.target.closest('.scheduled-task-item');
    if (!taskItem) return;
    const row = taskItem.closest('tr');

    // Chỉ cho phép click khi hàng đang ở chế độ edit
    if (!row || !row.classList.contains('edit-mode-active')) {
        return;
    }

    const { scheduleId, taskIndex, employeeId } = taskItem.dataset;

    // Chỉ cho phép chủ nhân của task tương tác
    if (window.currentUser?.id !== employeeId) {
        window.showToast('Bạn chỉ có thể cập nhật công việc của chính mình.', 'warning');
        return;
    }

    // --- LOGIC MỚI: KIỂM TRA THỜI GIAN THỰC HIỆN TASK ---
    const isTryingToComplete = !taskItem.classList.contains('task-completed');
    if (isTryingToComplete) {
        const schedule = currentScheduleData.find(s => s.id === scheduleId);
        if (!schedule) return;

        const task = schedule.tasks[parseInt(taskIndex, 10)];
        if (!task) return;

        // Tạo đối tượng Date cho thời gian bắt đầu của task
        const [year, month, day] = schedule.date.split('-').map(Number);
        const [hour, minute] = task.startTime.split(':').map(Number);
        const taskStartDateTime = new Date(year, month - 1, day, hour, minute);

        // So sánh với thời gian hiện tại
        if (new Date() < taskStartDateTime) {
            window.showToast('Chưa đến giờ thực hiện công việc này.', 'warning');
            return; // Dừng thực thi
        }
    }

    const isCurrentlyCompleted = taskItem.classList.contains('task-completed');
    const points = isCurrentlyCompleted ? -5 : 5; // Trừ điểm nếu hủy, cộng điểm nếu hoàn thành

    // Vô hiệu hóa tạm thời để tránh click đúp
    taskItem.style.pointerEvents = 'none';

    try {
        await updateTaskStatus(scheduleId, parseInt(taskIndex, 10), employeeId, !isCurrentlyCompleted);

        // Chỉ chạy hiệu ứng nếu hoàn thành task mới
        if (!isCurrentlyCompleted) {
            triggerCompletionEffects(taskItem, points);
            // Tự động khóa lại hàng sau khi hoàn thành
            const row = taskItem.closest('tr');
            row?.classList.remove('edit-mode-active');
        }
        // onSnapshot sẽ tự động cập nhật lại giao diện, không cần gọi render lại ở đây.

    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái task:", error);
        window.showToast("Không thể cập nhật công việc. Vui lòng thử lại.", "error");
    } finally {
        // Kích hoạt lại sau một khoảng trễ ngắn
        setTimeout(() => {
            taskItem.style.pointerEvents = 'auto';
        }, 500);
    }
}

/**
 * Cập nhật trạng thái của một task và điểm kinh nghiệm của nhân viên trong một transaction.
 * @param {string} scheduleId ID của document schedule.
 * @param {number} taskIndex Index của task trong mảng.
 * @param {string} employeeId ID của nhân viên.
 * @param {boolean} newIsComplete Trạng thái hoàn thành mới (true/false).
 */
async function updateTaskStatus(scheduleId, taskIndex, employeeId, newIsComplete) {
    const scheduleRef = doc(db, "schedules", scheduleId);
    const employeeRef = doc(db, "employee", employeeId); // Sửa "employees" thành "employee"
    const EXP_PER_TASK = 5;

    await runTransaction(db, async (transaction) => {
        const scheduleDoc = await transaction.get(scheduleRef);
        if (!scheduleDoc.exists()) {
            throw "Lịch làm việc không tồn tại!";
        }

        const scheduleData = scheduleDoc.data();
        const tasks = scheduleData.tasks || [];
        const targetTask = tasks[taskIndex];

        if (!targetTask) {
            throw "Công việc không tồn tại!";
        }

        // Chỉ thực hiện cập nhật nếu trạng thái thay đổi
        const currentIsComplete = targetTask.isComplete === 1;
        if (currentIsComplete === newIsComplete) {
            console.log("Trạng thái công việc không đổi, bỏ qua cập nhật.");
            return;
        }

        // Cập nhật trạng thái task
        targetTask.isComplete = newIsComplete ? 1 : 0;

        // 1. Cập nhật lại mảng tasks trong document schedule
        transaction.update(scheduleRef, { tasks: tasks });

        // 2. Cập nhật điểm kinh nghiệm cho nhân viên
        const pointsChange = newIsComplete ? EXP_PER_TASK : -EXP_PER_TASK;
        transaction.update(employeeRef, {
            experiencePoints: increment(pointsChange)
        });
    });
}

/**
 * Kích hoạt các hiệu ứng hình ảnh và âm thanh khi hoàn thành task.
 * @param {HTMLElement} taskElement - Phần tử DOM của task vừa được click.
 * @param {number} points - Số điểm được cộng.
 */
function triggerCompletionEffects(taskElement, points) {
    // 1. Xác định icon dựa trên nhóm công việc
    const taskGroupIcons = {
        'DELICA': 'fas fa-coffee',          // Đồ ăn chế biến sẵn, cafe
        'DND': 'fas fa-cheese',             // Delicatessen & Dairy - Phô mai, sữa
        'DRY': 'fas fa-box-open',           // Dry Goods - Hàng khô
        'LEADER': 'fas fa-user-tie',         // Công việc quản lý
        'MMD': 'fas fa-truck-loading',      // Merchandising/Receiving - Nhận hàng
        'OTHER': 'fas fa-star',             // Các công việc khác
        'PERI': 'fas fa-apple-alt',         // Perishables - Hàng tươi sống
        'POS': 'fas fa-cash-register',      // Point of Sale - Thu ngân
        'QC-FSH': 'fas fa-broom',            // Quality Control/Fresh - Vệ sinh
    };
    const groupId = taskElement.dataset.groupId;
    const iconClass = taskGroupIcons[groupId] || 'fas fa-star'; // Mặc định là ngôi sao
    // 1. Hiệu ứng âm thanh
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    // 2. Hiệu ứng "+5" bay lên
    const pointsEl = document.createElement('div');
    pointsEl.className = 'floating-points-animation';
    pointsEl.textContent = `+${points}`;
    taskElement.appendChild(pointsEl);
    setTimeout(() => pointsEl.remove(), 1000);

    // 3. Hiệu ứng sao bay
    const starEl = document.createElement('i'); // Thay đổi thành icon tương ứng
    starEl.className = 'fas fa-star flying-star-animation';
    document.body.appendChild(starEl);

    const startRect = taskElement.getBoundingClientRect();
    const totalExpEl = taskElement.closest('tr').querySelector('.fa-star'); // Tìm ngôi sao của điểm tổng
    const endRect = totalExpEl.getBoundingClientRect();

    // Đặt vị trí ban đầu của ngôi sao
    starEl.style.left = `${startRect.left + startRect.width / 2}px`;
    starEl.style.top = `${startRect.top + startRect.height / 2}px`;

    // Dùng requestAnimationFrame để đảm bảo trình duyệt đã áp dụng style ban đầu
    requestAnimationFrame(() => {
        // Đặt vị trí cuối cùng để kích hoạt transition
        starEl.style.transform = `translate(${endRect.left - startRect.left}px, ${endRect.top - startRect.top}px) scale(0.5)`;
        starEl.style.opacity = '0';
    });

    // Xóa ngôi sao sau khi animation kết thúc
    setTimeout(() => starEl.remove(), 1000);

    // 4. Hiệu ứng trên điểm tổng
    totalExpEl.parentElement.classList.add('animate-pulse-once');
    setTimeout(() => {
        totalExpEl.parentElement.classList.remove('animate-pulse-once');
    }, 700);
}

/**
 * Tự động cuộn ngang đến cột giờ hiện tại và tô màu cột 15 phút hiện tại.
 */
function updateTimeIndicator() {
    const now = new Date();
    const scrollTargetTime = new Date(now.getTime() - 30 * 60 * 1000); // Thời gian để cuộn: lùi lại 30 phút
    
    const scrollTargetHour = scrollTargetTime.getHours();
    
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const container = document.getElementById('schedule-grid-container');
    if (!container) return;

    // --- 1. Cuộn ngang đến cột giờ mục tiêu (30 phút trước) ---
    const headerCell = container.querySelector(`th[data-hour="${scrollTargetHour}"]`);
    if (headerCell) {
        const containerRect = container.getBoundingClientRect();
        const cellRect = headerCell.getBoundingClientRect();
        const scrollLeft = cellRect.left - containerRect.left + container.scrollLeft;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }

    // --- 2. Tô màu cột 15 phút tại thời điểm hiện tại ---
    // Xóa highlight cũ trên toàn bộ bảng
    document.querySelectorAll('.current-time-slot').forEach(el => el.classList.remove('current-time-slot', 'bg-amber-100'));

    // Xác định quarter tại thời điểm hiện tại
    const quarter = currentMinute < 15 ? '00' : currentMinute < 30 ? '15' : currentMinute < 45 ? '30' : '45';
    const timeString = `${String(currentHour).padStart(2, '0')}:00`;

    // Tìm và tô màu các ô trong cột quarter hiện tại
    const slotsToHighlight = container.querySelectorAll(`.quarter-hour-slot[data-time="${timeString}"][data-quarter="${quarter}"]`);
    slotsToHighlight.forEach(slot => slot.classList.add('current-time-slot', 'bg-amber-100'));
}
//#endregion
//#endregion

//#region INTERACTIONS
/**
 * Chuyển sang tuần khác.
 * @param {number} direction - 1 cho tuần tới, -1 cho tuần trước.
 */
function changeWeek(direction) {
    // Tìm vị trí (index) của ngày đang được chọn trong tuần (0=T2, 1=T3,...)
    const dayButtons = Array.from(document.querySelectorAll('.day-selector-btn'));
    const activeDayButton = document.querySelector('.day-selector-btn.active');
    let selectedDayIndex = 0; // Mặc định là Thứ 2 nếu không tìm thấy
    if (activeDayButton) {
        selectedDayIndex = dayButtons.indexOf(activeDayButton);
        if (selectedDayIndex === -1) selectedDayIndex = 0; // Fallback
    }

    viewStartDate.setDate(viewStartDate.getDate() + (direction * 7));
    const selectedDateString = activeDayButton ? activeDayButton.dataset.date : null;
    renderWeekControls(selectedDateString); // Truyền ngày đang active vào
    // Tự động chọn ngày tương ứng ở tuần mới và tải lịch
    const newDayToSelect = document.querySelectorAll('.day-selector-btn')[selectedDayIndex];
    if (newDayToSelect) {
        changeDay(newDayToSelect.dataset.date);
    }
}

/**
 * Chuyển sang ngày khác trong tuần.
 * @param {string} dateString - Ngày được chọn (YYYY-MM-DD).
 */
function changeDay(dateString) {
    isInitialLoad = true; // Reset cờ khi người dùng chủ động chuyển ngày
    const todayString = formatDate(new Date());

    document.querySelectorAll('.day-selector-btn').forEach(btn => {
        const btnDate = btn.dataset.date;
        const isToday = btnDate === todayString;
        const isActive = btnDate === dateString;

        // 1. Reset tất cả các style cũ
        btn.classList.remove('bg-indigo-600', 'text-white', 'hover:bg-indigo-700', 'border-b-2', 'border-indigo-500', 'active');
        btn.classList.add('hover:bg-gray-100');

        // 2. Áp dụng style mới dựa trên trạng thái
        if (isActive) {
            btn.classList.add('active', 'bg-indigo-600', 'text-white', 'hover:bg-indigo-700');
            btn.classList.remove('hover:bg-gray-100');
        } else if (isToday) {
            btn.classList.add('border-b-2', 'border-indigo-500');
        }
    });
    // Tải lịch cho ngày mới
    listenForScheduleChanges(dateString);
}

/**
 * Render các nút điều khiển tuần và ngày.
 */
function renderWeekControls(activeDate) {
    const dayContainer = document.querySelector('#daily-schedule-controls > div');
    if (!dayContainer) return;

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(viewStartDate);
        date.setDate(date.getDate() + i);
        weekDates.push(date);
    }

    // Render các nút ngày
    const todayString = formatDate(new Date());
    const selectedDateString = activeDate || document.querySelector('.day-selector-btn.active')?.dataset.date;

    // Xóa các nút ngày cũ trước khi render lại
    dayContainer.querySelectorAll('.day-selector-btn').forEach(btn => btn.remove());

    const dayButtonsHTML = weekDates.map((date, index) => {
        const dateString = formatDate(date);
        const dayName = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][index];
        const dayAndMonth = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        const isToday = dateString === todayString;
        const isActive = dateString === selectedDateString;

        let classes = 'day-selector-btn btn-base px-3 h-auto text-xs font-semibold text-gray-700 hover:bg-gray-100 relative leading-tight text-center transition-colors duration-150';
        
        if (isActive) {
            // Ngày đang được chọn sẽ có màu nổi bật nhất
            classes += ' bg-indigo-600 text-white hover:bg-indigo-700';
        } else if (isToday) { // Nếu là ngày hôm nay nhưng không được chọn, chỉ gạch chân
            classes += ' border-b-2 border-indigo-500';
        }

        return `
            <button class="${classes}" data-date="${dateString}" title="${date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}">
                <span class="text-sm">${dayName}</span>
                <br>
                <span class="font-normal">${dayAndMonth}</span>
            </button>
        `;
    }).join('');

    // Chèn các nút ngày vào giữa hai nút điều hướng tuần
    const prevBtn = document.getElementById('prev-week-btn');
    prevBtn.insertAdjacentHTML('afterend', dayButtonsHTML);

    // Gắn lại sự kiện cho các nút ngày vừa tạo
    dayContainer.querySelectorAll('.day-selector-btn').forEach(btn => {
        btn.addEventListener('click', () => changeDay(btn.dataset.date));
    });
}

//#endregion
//#region FILTERS
/**
 * Tạo và điền dữ liệu cho bộ lọc cửa hàng.
 */
function createStoreFilter() {
    const container = document.getElementById('store-filter-container');
    if (!container) return;
    
    const currentUser = window.currentUser;

    if (currentUser && (
        currentUser.roleId === 'STAFF' || 
        currentUser.roleId === 'STORE_LEADER_G2' || 
        currentUser.roleId === 'STORE_LEADER_G3'
    )) {
        // --- LOGIC CHO NHÂN VIÊN ---
        const staffStore = allStores.find(s => s.id === currentUser.storeId);
        if (staffStore) {
            // Hiển thị tên cửa hàng nhưng không cho phép thay đổi
            container.innerHTML = `
                <div class="flex-1 max-w-xs">
                    <label for="store-filter" class="sr-only">Cửa hàng</label>
                    <select id="store-filter" class="form-select w-full" disabled>
                        <option value="${staffStore.id}" selected>${staffStore.name}</option>
                    </select>
                </div>
            `;
            // Tự động tải lịch cho cửa hàng của nhân viên
            listenForScheduleChanges(document.querySelector('.day-selector-btn.active')?.dataset.date);
        } else {
            container.innerHTML = `<div class="flex-1 max-w-xs text-sm text-gray-500">Bạn chưa được gán vào cửa hàng nào.</div>`;
        }
    } else {
        // --- LOGIC CHO ADMIN VÀ QUẢN LÝ (như cũ) ---
        const accessibleStoreIds = [...new Set(allEmployees.map(emp => emp.storeId).filter(Boolean))];
        const accessibleStores = allStores
            .filter(store => accessibleStoreIds.includes(store.id))
            .sort((a, b) => a.name.localeCompare(b.name));
        
        if (accessibleStores.length === 0) {
            container.innerHTML = `<div class="flex-1 max-w-xs text-sm text-gray-500">Không có cửa hàng nào được quản lý.</div>`;
            currentScheduleData = [];
            renderScheduleGrid();
            return;
        }

        const optionsHTML = accessibleStores.map(store => `<option value="${store.id}">${store.name}</option>`).join('');
        container.innerHTML = `
            <div class="flex-1 max-w-xs">
                <label for="store-filter" class="sr-only">Lọc theo cửa hàng</label>
                <select id="store-filter" class="form-select w-full">${optionsHTML}</select>
            </div>
        `;
        
        const storeFilter = document.getElementById('store-filter');
        storeFilter?.addEventListener('change', () => {
            const selectedDate = document.querySelector('.day-selector-btn.active')?.dataset.date;
            listenForScheduleChanges(selectedDate);
        });

        // Tải lịch cho cửa hàng đầu tiên trong danh sách
        listenForScheduleChanges(document.querySelector('.day-selector-btn.active')?.dataset.date);
    }
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

    // Logic mới: Kiểm tra tham số 'date' trên URL
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    let initialDate = new Date(); // Mặc định là hôm nay

    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
        const [year, month, day] = dateParam.split('-').map(Number);
        initialDate = new Date(year, month - 1, day);
    }

    showLoadingSpinner();
    await fetchInitialData();

    // Khởi tạo ngày bắt đầu của tuần là thứ 2 của tuần hiện tại
    updateTimeIndicator();
    viewStartDate = getMonday(initialDate);
    viewStartDate.setHours(0, 0, 0, 0);

    // Render bộ điều khiển tuần
    renderWeekControls(formatDate(initialDate)); // Truyền ngày được chọn (hoặc hôm nay) để active ban đầu

    // Tự động chọn ngày hôm nay khi khởi tạo
    const todayString = formatDate(new Date());
    const todayButton = document.querySelector(`.day-selector-btn[data-date="${todayString}"]`);
    if (todayButton) {
        todayButton.classList.add('active');
    }

    // Tạo bộ lọc cửa hàng, hàm này sẽ tự động gọi listenForScheduleChanges
    createStoreFilter();

    // Gắn listener cho các nút điều khiển tuần
    document.getElementById('prev-week-btn')?.addEventListener('click', () => changeWeek(-1), { signal });
    document.getElementById('next-week-btn')?.addEventListener('click', () => changeWeek(1), { signal });

    // --- SỬ DỤNG EVENT DELEGATION CHO TOÀN BỘ LƯỚI ---
    const gridContainer = document.getElementById('schedule-grid-container');
    if (gridContainer) {
        // Listener cho việc click vào task
        gridContainer.addEventListener('click', (event) => {
            if (event.target.closest('.scheduled-task-item')) {
                handleTaskClick(event);
            }
        }, { signal });

        // Listener cho việc nhấp đúp để mở khóa hàng
        gridContainer.addEventListener('dblclick', (event) => {
            const cell = event.target.closest('td[data-action="toggle-edit"]');
            if (!cell) return;

            const employeeId = cell.dataset.employeeId;
            // Chỉ cho phép người dùng hiện tại kích hoạt hàng của chính họ
            if (employeeId !== window.currentUser?.id) {
                window.showToast('Bạn chỉ có thể chỉnh sửa công việc của mình.', 'warning');
                return;
            }

            const row = cell.closest('tr');
            if (row) {
                // Trước khi kích hoạt hàng mới, hãy hủy kích hoạt tất cả các hàng khác
                document.querySelectorAll('tr.edit-mode-active').forEach(activeRow => {
                    activeRow.classList.remove('edit-mode-active');
                });
                row.classList.toggle('edit-mode-active');
            }
        }, { signal });
    }
}