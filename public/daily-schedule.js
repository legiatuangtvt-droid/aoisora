﻿﻿﻿import { db } from './firebase.js';
import { collection, onSnapshot, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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
            // row.className = 'border-2 border-black';
            // Tô màu nền cho dòng của người dùng hiện tại
            if (schedule.employeeId === window.currentUser?.id) {
                row.classList.add('bg-green-50');
            }
            row.dataset.employeeId = schedule.employeeId; // Thêm ID để dễ dàng truy vấn
            const positionInfo = allWorkPositions.find(p => p.id === schedule.positionId);
            const positionName = positionInfo ? positionInfo.name : (schedule.positionId || '');

            let rowHtml = `
                <td class="group border-l-2 border-r-2 border-b-2 border-black align-top sticky left-0 bg-white z-10 w-80 min-w-80 flex flex-col">
                    <!-- Dòng 1: Tên, Vị trí, Điểm kinh nghiệm -->
                    <div class="relative text-center flex-shrink-0">
                        <div class="text-sm font-semibold text-slate-800">${schedule.name}</div>
                        <div class="text-xs text-slate-600">${positionName}</div>
                        <div class="absolute bottom-1 right-2 text-xs text-amber-600 font-bold" title="Điểm kinh nghiệm">
                            <i class="fas fa-star text-amber-500"></i> 1,234
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
                                 <path class="stroke-green-500" stroke-width="4" fill="none" stroke-dasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                             </svg>
                             <div class="absolute inset-0 flex flex-col items-center justify-center leading-tight">
                                 <span class="text-xs font-bold text-green-600">75%</span>
                                 <span class="text-[10px] font-semibold text-amber-600">+1000</span>
                             </div>
                        </div>
                    </div>
                    <!-- Dòng 3, Ô 4: Sub-tasks -->
                    <div class="border-t border-black text-xs"><strong>Sub-tasks:</strong> Lên hàng, kiểm kê...</div>
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
                    taskItem.className = `scheduled-task-item relative group w-[70px] h-[100px] border-2 text-xs p-1 rounded-md shadow-sm flex flex-col justify-between items-center text-center`;
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

    // Thêm một khoảng trễ nhỏ để đảm bảo trình duyệt đã render xong trước khi cuộn.
    // Điều này khắc phục vấn đề không cuộn đúng vị trí khi tải lại trang (F5).
    setTimeout(() => {
        if (currentScheduleData.length > 0) {
            // Nếu có dữ liệu, cuộn đến giờ và nhân viên hiện tại
            updateTimeIndicator();
            scrollToCurrentEmployee();
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
}