import { db } from './firebase.js';
import { collection, getDocs, query, where, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let allStores = [];
let allEmployees = [];
let currentDate = new Date();
let allShiftCodes = []; // Biến để lưu danh sách mã ca
let payrollStartDay = 1; // Ngày bắt đầu chu kỳ lương, mặc định là 1

/**
 * Hiển thị spinner tải dữ liệu.
 */
function showLoadingSpinner() {
    const container = document.getElementById('schedule-container');
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
 * Tải danh sách mã ca từ Firestore.
 */
async function loadShiftCodes() {
    try {
        const shiftCodesDocRef = doc(db, 'system_configurations', 'shift_codes');
        const shiftCodesSnap = await getDoc(shiftCodesDocRef);
        if (shiftCodesSnap.exists()) {
            allShiftCodes = shiftCodesSnap.data().codes || [];
        }
    } catch (error) {
        console.error("Lỗi khi tải mã ca từ Firestore:", error);
    }
}

/**
 * Tải cài đặt chu kỳ lương từ Firestore.
 */
async function loadPayrollSettings() {
    try {
        const payrollSettingsRef = doc(db, 'system_configurations', 'payroll_settings');
        const docSnap = await getDoc(payrollSettingsRef);
        if (docSnap.exists() && docSnap.data().startDay) {
            payrollStartDay = docSnap.data().startDay;
        }
    } catch (error) {
        console.error("Lỗi khi tải cài đặt chu kỳ lương:", error);
    }
}
/**
 * Tải dữ liệu nền cần thiết.
 */
async function fetchInitialData() {
    try {
        const [storesSnap, employeesSnap] = await Promise.all([
            getDocs(collection(db, 'stores')),
            getDocs(collection(db, 'employee'))
        ]);
        allStores = storesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allEmployees = employeesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu nền:", error);
        window.showToast("Không thể tải dữ liệu cần thiết.", "error");
    }
}

/**
 * Tạo và hiển thị bộ lọc cửa hàng cho các vai trò quản lý.
 */
function createStoreFilter() {
    const filterContainer = document.getElementById('filter-container');
    const currentUser = window.currentUser;

    // Hiển thị cài đặt chu kỳ lương cho Admin
    const adminSettingsContainer = document.getElementById('admin-settings-container');
    if (currentUser?.roleId === 'ADMIN' && adminSettingsContainer) {
        adminSettingsContainer.classList.remove('hidden');
        adminSettingsContainer.classList.add('flex');
        const payrollInput = document.getElementById('payroll-day-input');
        const saveBtn = document.getElementById('save-payroll-day-btn');
        if (payrollInput) payrollInput.value = payrollStartDay;

        saveBtn?.addEventListener('click', async () => {
            const newDay = parseInt(payrollInput.value, 10);
            if (newDay >= 1 && newDay <= 28) {
                const payrollSettingsRef = doc(db, 'system_configurations', 'payroll_settings');
                await setDoc(payrollSettingsRef, { startDay: newDay, updatedAt: serverTimestamp() });
                payrollStartDay = newDay;
                window.showToast('Đã lưu ngày bắt đầu chu kỳ lương!', 'success');
                changeMonth(0); // Tải lại lịch cho chu kỳ hiện tại
            } else {
                window.showToast('Ngày bắt đầu chu kỳ phải từ 1 đến 28.', 'error');
            }
        });
    }

    if (!filterContainer || !currentUser) return;

    // Chỉ hiển thị bộ lọc cho các vai trò có level >= 20 (quản lý từ 2 cửa hàng trở lên)
    if (currentUser.level >= 20) {
        const accessibleStores = allStores.filter(store => {
            if (currentUser.roleId === 'ADMIN') return true;
            if (currentUser.roleId === 'REGIONAL_MANAGER' && currentUser.managedRegionId) {
                const managedAreaIds = allAreas.filter(a => a.regionId === currentUser.managedRegionId).map(a => a.id);
                return managedAreaIds.includes(store.areaId);
            }
            if (currentUser.roleId === 'AREA_MANAGER' && currentUser.managedAreaIds) {
                return currentUser.managedAreaIds.includes(store.areaId);
            }
            if (currentUser.roleId === 'STORE_INCHARGE' && currentUser.managedStoreIds) {
                return currentUser.managedStoreIds.includes(store.id);
            }
            return false;
        }).sort((a, b) => a.name.localeCompare(b.name));

        if (accessibleStores.length > 1) {
            const optionsHTML = accessibleStores.map(store => `<option value="${store.id}">${store.name}</option>`).join('');
            filterContainer.innerHTML = `
                <label for="store-filter" class="text-sm font-medium text-gray-700">Cửa hàng:</label>
                <select id="store-filter" class="form-select w-64">
                    ${optionsHTML}
                </select>
            `;

            const storeFilter = document.getElementById('store-filter');
            storeFilter?.addEventListener('change', () => {
                loadScheduleForStore(storeFilter.value);
            });
            // Tải lịch cho cửa hàng đầu tiên
            loadScheduleForStore(accessibleStores[0].id);
        } else if (accessibleStores.length === 1) {
            loadScheduleForStore(accessibleStores[0].id);
        }
    } else if (currentUser.storeId) {
        // Đối với nhân viên và trưởng cửa hàng, tải lịch cho cửa hàng của họ
        loadScheduleForStore(currentUser.storeId);
    } else {
        document.getElementById('schedule-container').innerHTML = '<div class="text-center p-10 text-gray-500">Không thể xác định cửa hàng của bạn.</div>';
    }
}

/**
 * Tải và hiển thị lịch làm việc cho một cửa hàng cụ thể.
 * @param {string} storeId ID của cửa hàng.
 */
async function loadScheduleForStore(storeId) {    
    showLoadingSpinner();

    // --- LOGIC MỚI: TÍNH TOÁN NGÀY BẮT ĐẦU VÀ KẾT THÚC DỰA TRÊN CHU KỲ LƯƠNG ---
    const today = currentDate;
    let cycleStartDate, cycleEndDate;

    if (today.getDate() >= payrollStartDay) {
        // Chu kỳ hiện tại: từ ngày payrollStartDay của tháng này đến ngày (payrollStartDay - 1) của tháng sau
        cycleStartDate = new Date(today.getFullYear(), today.getMonth(), payrollStartDay);
        cycleEndDate = new Date(today.getFullYear(), today.getMonth() + 1, payrollStartDay - 1);
    } else {
        // Chu kỳ hiện tại: từ ngày payrollStartDay của tháng trước đến ngày (payrollStartDay - 1) của tháng này
        cycleStartDate = new Date(today.getFullYear(), today.getMonth() - 1, payrollStartDay);
        cycleEndDate = new Date(today.getFullYear(), today.getMonth(), payrollStartDay - 1);
    }
    cycleEndDate.setHours(23, 59, 59, 999); // Đảm bảo lấy hết ngày cuối cùng

    // Lấy danh sách nhân viên thuộc cửa hàng này
    const employeesInStore = allEmployees.filter(emp => emp.storeId === storeId);
    const employeeIds = employeesInStore.map(emp => emp.id);

    if (employeeIds.length === 0) {
        renderCalendar([], employeesInStore); // Vẫn render lịch trống
        return;
    }

    // Tải lịch làm việc của tất cả nhân viên đó trong tháng
    const scheduleQuery = query(collection(db, 'schedules'),
        where("storeId", "==", storeId),
        where("date", ">=", cycleStartDate.toISOString().split('T')[0]),
        where("date", "<=", cycleEndDate.toISOString().split('T')[0])
    );

    try {
        const scheduleSnapshot = await getDocs(scheduleQuery);
        const schedulesForMonth = scheduleSnapshot.docs.map(doc => doc.data());
        renderCalendar(schedulesForMonth, employeesInStore);
    } catch (error) {
        console.error("Lỗi khi tải lịch làm việc tháng:", error);
        window.showToast("Không thể tải lịch làm việc.", "error");
        document.getElementById('schedule-container').innerHTML = '<div class="text-center p-10 text-red-500">Đã xảy ra lỗi khi tải dữ liệu.</div>';
    }
}

/**
 * Render toàn bộ giao diện lịch.
 * @param {Array} schedules - Mảng các lịch làm việc trong tháng.
 * @param {Array} employees - Mảng các nhân viên trong cửa hàng.
 */
function renderCalendar(schedules, employees) {
    const container = document.getElementById('schedule-container');
    if (!container) return;

    // --- LOGIC MỚI: TÍNH TOÁN NGÀY BẮT ĐẦU VÀ KẾT THÚC DỰA TRÊN CHU KỲ LƯƠNG ---
    const today = currentDate;
    let cycleStartDate, cycleEndDate;

    if (today.getDate() >= payrollStartDay) {
        cycleStartDate = new Date(today.getFullYear(), today.getMonth(), payrollStartDay);
        cycleEndDate = new Date(today.getFullYear(), today.getMonth() + 1, payrollStartDay - 1);
    } else {
        cycleEndDate = new Date(today.getFullYear(), today.getMonth(), payrollStartDay - 1);
        cycleStartDate = new Date(today.getFullYear(), today.getMonth() - 1, payrollStartDay);
    }
    cycleEndDate.setHours(23, 59, 59, 999);

    const cycleRangeString = `${cycleStartDate.toLocaleDateString('vi-VN')} - ${cycleEndDate.toLocaleDateString('vi-VN')}`;

    let calendarHTML = `
        <div id="calendar-header" class="flex justify-between items-center mb-4 px-2">
            <h2 class="text-xl font-bold text-gray-800">Chu kỳ: ${cycleRangeString}</h2>
            <div class="flex items-center gap-2">
                <button id="prev-month-btn" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" title="Chu kỳ trước"><i class="fas fa-chevron-left text-sm text-gray-600"></i></button>
                <button id="next-month-btn" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" title="Chu kỳ sau"><i class="fas fa-chevron-right text-sm text-gray-600"></i></button>
            </div>
        </div>
        <div class="grid grid-cols-7">
            <!-- Weekday Headers -->
            <div class="col-span-7 grid grid-cols-7 border-t border-l border-r border-gray-200 bg-gray-50">
                ${['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => `<div class="p-3 text-center font-semibold text-sm text-gray-500">${day}</div>`).join('')}
            </div>
            <!-- Day Cells -->
            <div id="calendar-body" class="col-span-7 grid grid-cols-7">`;

    // --- LOGIC MỚI: RENDER CÁC NGÀY TRONG CHU KỲ ---
    const firstDayOfGrid = new Date(cycleStartDate);
    let startDayIndex = firstDayOfGrid.getDay();
    if (startDayIndex === 0) startDayIndex = 7; // Chủ nhật là 0, chuyển thành 7
    const paddingDays = startDayIndex - 1;

    for (let i = 0; i < paddingDays; i++) {
        calendarHTML += `<div class="border-t border-l border-gray-200 bg-gray-50 [&:nth-child(7n)]:border-r"></div>`;
    }

    for (let d = new Date(cycleStartDate); d <= cycleEndDate; d.setDate(d.getDate() + 1)) {
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const lunarIconHTML = ''; // Xóa bỏ logic lịch âm

        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const schedulesForDay = schedules.filter(s => s.date === dateStr);
        let contentHTML = '';
        const currentUser = window.currentUser;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const cellDate = new Date(d);
        const isPastDate = cellDate < today;

        if (currentUser && currentUser.roleId === 'STAFF') {
            // Logic hiển thị cho nhân viên
            const userSchedule = schedulesForDay.find(s => s.employeeId === currentUser.id);
            if (userSchedule) {
                const store = allStores.find(st => st.id === userSchedule.storeId);
                const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === userSchedule.shift);
                const timeRange = shiftInfo ? shiftInfo.timeRange : 'N/A';

                contentHTML = `
                    <div class="flex flex-col justify-center h-full text-center text-xs p-1">
                        <div class="font-semibold text-gray-800">${store?.name || 'N/A'}</div>
                        <div class="text-gray-600" title="Mã ca: ${userSchedule.shift || ''}">${timeRange}</div>
                    </div>
                `;
            }
        } else if (currentUser && (currentUser.roleId === 'STORE_LEADER_G2' || currentUser.roleId === 'STORE_LEADER_G3' || currentUser.roleId === 'STORE_INCHARGE')) {
            // Logic hiển thị cho Store Leader (G2, G3, SI)
            if (schedulesForDay.length > 0) {
                const storeId = schedulesForDay[0].storeId;
                const store = allStores.find(st => st.id === storeId);
                
                // Tính tổng man-hour thực tế
                const totalManHours = schedulesForDay.reduce((total, schedule) => {
                    const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === schedule.shift);
                    return total + (shiftInfo?.duration || 0);
                }, 0);

                contentHTML = `
                    <div class="flex flex-col justify-center h-full text-center text-xs p-1">
                        <div class="font-semibold text-gray-800">${store?.name || 'N/A'}</div>
                        <div class="mt-1 flex justify-center items-baseline gap-1">
                            <div class="text-gray-600">Tổng giờ làm:</div>
                            <div class="font-bold text-lg text-indigo-700">${totalManHours.toFixed(1)}h</div>
                        </div>
                    </div>
                `;
            }
        } else {
            // Logic hiển thị cho quản lý (như cũ)
            contentHTML = '<ul class="text-xs space-y-1 mt-1 overflow-y-auto">';
            schedulesForDay.forEach(schedule => {
                const employee = employees.find(e => e.id === schedule.employeeId);
                contentHTML += `<li class="truncate" title="${employee?.name}: ${schedule.shift}"><span class="font-semibold">${employee?.name || 'N/A'}:</span> ${schedule.shift || 'N/A'}</li>`;
            });
            contentHTML += '</ul>';
        }

        // Thêm class và data-attribute cho nhân viên để có thể nhấp vào đăng ký
        let cellClasses = "relative p-2 border-t border-l border-gray-200 flex flex-col [&:nth-child(7n)]:border-r h-32";
        let cellDataAttributes = '';        
        const hasSchedule = schedulesForDay.length > 0;
        const isTodayOrPast = cellDate <= today;

        if (currentUser && currentUser.roleId === 'STAFF' && !isPastDate) {
            cellClasses += ' cursor-pointer hover:bg-blue-50 transition-colors duration-200';
            cellDataAttributes = `data-date="${dateStr}"`;
        } else if (isTodayOrPast && hasSchedule) {
            // Logic mới: Nếu là ngày hôm nay hoặc quá khứ và có lịch, cho phép click để xem chi tiết
            cellClasses += ' cursor-pointer hover:bg-blue-50 transition-colors duration-200';
            cellDataAttributes = `data-redirect-daily="${dateStr}"`;
        }
        
        calendarHTML += `
            <div class="${cellClasses} ${contentHTML ? 'bg-green-50' : ''}" ${cellDataAttributes}>
                <span class="self-end text-sm font-medium text-gray-500 flex items-center">
                    ${lunarIconHTML}
                    ${day}/${month}</span>
                <div class="flex-1 pointer-events-none">${contentHTML}</div>
            </div>`;
    }
    calendarHTML += `</div></div>`;
    container.innerHTML = calendarHTML;

    // Gắn sự kiện cho nút chuyển tháng
    document.getElementById('prev-month-btn')?.addEventListener('click', () => changeMonth(-1));
    document.getElementById('next-month-btn')?.addEventListener('click', () => changeMonth(1));

    // Gắn sự kiện click cho các ô ngày
    document.getElementById('calendar-body')?.addEventListener('click', (event) => {
        const cell = event.target.closest('[data-date], [data-redirect-daily]');
        if (!cell) return;

        // Ưu tiên chuyển hướng đến trang đăng ký cho nhân viên
        if (cell.dataset.date && window.currentUser?.roleId === 'STAFF') {
            const date = cell.dataset.date;
            window.location.href = `staff-availability.html?date=${date}`;
        } 
        // Chuyển hướng đến trang lịch hàng ngày cho các ngày trong quá khứ có lịch
        else if (cell.dataset.redirectDaily) {
            const date = cell.dataset.redirectDaily;
            window.location.href = `daily-schedule.html?date=${date}`;
        }
    });
    
}

/**
 * Chuyển tháng và tải lại lịch.
 * @param {number} delta - Số tháng để thay đổi (+1 hoặc -1).
 */
function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta, payrollStartDay); // Đặt ngày về ngày bắt đầu chu kỳ để tránh lỗi nhảy tháng
    const storeFilter = document.getElementById('store-filter');
    const storeId = storeFilter ? storeFilter.value : window.currentUser?.storeId;
    if (storeId) {
        loadScheduleForStore(storeId);
    }
}

export async function init() {
    domController = new AbortController();
    currentDate = new Date(); // Reset về tháng hiện tại mỗi khi init
    showLoadingSpinner();
    await loadPayrollSettings(); // Tải cài đặt chu kỳ lương
    await loadShiftCodes(); // Tải mã ca
    await fetchInitialData();
    createStoreFilter();
}