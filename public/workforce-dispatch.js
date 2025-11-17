import { db } from './firebase.js';
import { collection, getDocs, query, where, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let currentCycle = { start: new Date(), end: new Date() }; // Chu kỳ hiển thị hiện tại

// Biến lưu trữ dữ liệu
let allPersonnel = [];
let allStores = [];
let allAreas = [];
let allRegions = [];
let allSchedules = [];
let allRoles = [];
let allShiftCodes = [];
let dailyTemplate = null;

/**
 * Định dạng Date thành chuỗi 'YYYY-MM-DD'.
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Lấy chu kỳ lương dựa trên một ngày tham chiếu.
 * @param {Date} referenceDate - Ngày tham chiếu để xác định chu kỳ.
 * @returns {{start: Date, end: Date}} - Đối tượng chứa ngày bắt đầu và kết thúc của chu kỳ.
 */
function getPayrollCycle(referenceDate) {
    const payrollStartDay = 26;
    let year = referenceDate.getFullYear();
    let month = referenceDate.getMonth();

    // Logic mới: Luôn tính chu kỳ KẾ TIẾP để điều phối.
    // Nếu ngày hiện tại (referenceDate.getDate()) nhỏ hơn ngày bắt đầu chu kỳ (payrollStartDay),
    // thì chu kỳ tiếp theo sẽ bắt đầu vào ngày payrollStartDay của tháng NÀY.
    // Ví dụ: Hôm nay là 17/11, payrollStartDay là 26. 17 < 26 -> chu kỳ tiếp theo bắt đầu ngày 26/11.
    if (referenceDate.getDate() >= payrollStartDay) {
        // Nếu ngày hiện tại lớn hơn hoặc bằng ngày bắt đầu chu kỳ,
        // thì chu kỳ tiếp theo sẽ bắt đầu vào ngày payrollStartDay của tháng SAU.
        month += 1;
    }
    const start = new Date(year, month, payrollStartDay);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, payrollStartDay - 1);
    return { start, end };
}

/**
 * Hiển thị spinner loading.
 */
function showLoading() {
    const body = document.getElementById('dispatch-table-body');
    if (body) {
        body.innerHTML = `<tr><td colspan="15" class="text-center p-10"><i class="fas fa-spinner fa-spin fa-2x text-gray-400"></i><p class="mt-2">Đang tải dữ liệu...</p></td></tr>`;
    }
}

/**
 * Tải tất cả dữ liệu cần thiết từ Firestore.
 */
async function fetchInitialData() {
    const currentUser = window.currentUser;
    if (!currentUser) {
        console.error("Không thể xác định người dùng hiện tại.");
        return;
    }

    try {
        // Tải dữ liệu mã ca từ Firestore
        const shiftCodesDocRef = doc(db, 'system_configurations', 'shift_codes');

        // Tối ưu hóa: Chuẩn bị các promise để chạy song song
        const promises = [
            // Các truy vấn này sẽ chạy đồng thời
            getDoc(shiftCodesDocRef), // Tải mã ca
            getDocs(collection(db, 'stores')),
            getDocs(collection(db, 'areas')),
            getDocs(collection(db, 'regions')),
            getDocs(query(collection(db, 'daily_templates'), where('name', '==', 'Test'))),
            getDocs(query(collection(db, 'roles')))
        ];

        // Chuẩn bị promise để tải nhân viên dựa trên vai trò
        let employeePromise;
        switch (currentUser.roleId) {
            case 'ADMIN':
            case 'HQ_STAFF': // Admin và HQ Staff có quyền xem tất cả
                employeePromise = getDocs(collection(db, 'employee'));
                break;
            case 'REGIONAL_MANAGER':
            case 'AREA_MANAGER':
            case 'STORE_INCHARGE':
                // Với các vai trò này, chúng ta vẫn cần tải stores/areas trước để lọc,
                // nhưng có thể tối ưu hóa bằng cách không gộp vào Promise.all ban đầu.
                // Logic hiện tại đã khá tốt cho các trường hợp này. Chúng ta giữ nguyên.
                break; // Sẽ xử lý bên dưới
            default: // STAFF
                employeePromise = getDocs(query(collection(db, 'employee'), where('storeId', '==', currentUser.storeId || '')));
                break;
        }

        if (employeePromise) {
            promises.push(employeePromise);
        }

        const [
            shiftCodesSnap, storesSnap, areasSnap, regionsSnap, templateSnap, rolesSnap, employeeSnap
        ] = await Promise.all(promises);

        // Xử lý mã ca
        if (shiftCodesSnap.exists()) {
            allShiftCodes = shiftCodesSnap.data().codes || [];
        }

        allStores = storesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allAreas = areasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allRegions = regionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allRoles = rolesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Nếu employeePromise đã được thực thi, xử lý kết quả
        if (employeeSnap) {
             const employees = employeeSnap.docs.map(doc => {
                const empData = doc.data();
                const role = allRoles.find(r => r.id === empData.roleId);
                return { id: doc.id, type: 'employee', level: role?.level || 0, ...empData };
            });
            employees.sort((a, b) => (b.level - a.level) || a.name.localeCompare(b.name));
            allPersonnel = employees;
        } else {
            // Logic cũ cho các vai trò quản lý cấp trung
            const managedStoreIds = getManagedStoreIds(currentUser, allStores, allAreas);
            if (managedStoreIds.length > 0) {
                const CHUNK_SIZE = 30;
                const storeIdChunks = Array.from({ length: Math.ceil(managedStoreIds.length / CHUNK_SIZE) }, (_, i) =>
                    managedStoreIds.slice(i * CHUNK_SIZE, i * CHUNK_SIZE + CHUNK_SIZE)
                );

                const employeePromises = storeIdChunks.map(chunk =>
                    getDocs(query(collection(db, 'employee'), where('storeId', 'in', chunk)))
                );

                const employeeSnapshots = await Promise.all(employeePromises);
                const employees = employeeSnapshots.flatMap(snap => snap.docs.map(doc => {
                    const empData = doc.data();
                    const role = allRoles.find(r => r.id === empData.roleId);
                    return { id: doc.id, type: 'employee', level: role?.level || 0, ...empData };
                }));
                employees.sort((a, b) => (b.level - a.level) || a.name.localeCompare(b.name));
                allPersonnel = employees;
            } else {
                allPersonnel = [];
            }
        }

        if (!templateSnap.empty) {
            dailyTemplate = { id: templateSnap.docs[0].id, ...templateSnap.docs[0].data() };
        } else {
            console.warn("Không tìm thấy template 'Test'. Các tính toán man-hour sẽ không chính xác.");
            dailyTemplate = { totalManHour: 80 }; // Fallback
        }
    } catch (error) {
        console.error("Lỗi nghiêm trọng khi tải dữ liệu ban đầu:", error);
        window.showToast("Không thể tải dữ liệu cần thiết.", "error");
    }
}

/**
 * Lấy danh sách ID các cửa hàng mà người dùng hiện tại có quyền quản lý.
 * @param {object} user - Đối tượng người dùng hiện tại.
 * @param {Array} stores - Mảng tất cả cửa hàng.
 * @param {Array} areas - Mảng tất cả khu vực.
 * @returns {Array<string>} - Mảng các storeId.
 */
function getManagedStoreIds(user, stores, areas) {
    switch (user.roleId) {
        case 'ADMIN':
        case 'HQ_STAFF':
            return stores.map(s => s.id);
        case 'REGIONAL_MANAGER':
            if (!user.managedRegionId) return [];
            const areaIdsInRegion = areas.filter(a => a.regionId === user.managedRegionId).map(a => a.id);
            return stores.filter(s => areaIdsInRegion.includes(s.areaId)).map(s => s.id);
        case 'AREA_MANAGER':
            if (!user.managedAreaIds || user.managedAreaIds.length === 0) return [];
            return stores.filter(s => user.managedAreaIds.includes(s.areaId)).map(s => s.id);
        case 'STORE_INCHARGE':
            return user.managedStoreIds || [];
        default:
            return user.storeId ? [user.storeId] : [];
    }
}


/**
 * Tải lịch làm việc cho tuần đang xem.
 */
async function fetchSchedulesForCycle() {
    const startDateStr = formatDate(currentCycle.start);
    const endDateStr = formatDate(currentCycle.end);

    // Chỉ tải lịch của các nhân viên thuộc phạm vi quản lý đã được lọc
    const employeeIds = allPersonnel.map(p => p.id);
    if (employeeIds.length === 0) {
        allSchedules = [];
        return;
    }

    // Tối ưu hóa: Thay vì lặp qua từng ngày, chúng ta sẽ truy vấn một khoảng thời gian cho mỗi lô nhân viên.
    // Điều này giảm số lượng truy vấn từ (số lô * 7 ngày) xuống chỉ còn (số lô).
    const CHUNK_SIZE = 30;
    const employeeIdChunks = [];
    for (let i = 0; i < employeeIds.length; i += CHUNK_SIZE) {
        employeeIdChunks.push(employeeIds.slice(i, i + CHUNK_SIZE));
    }

    const schedulePromises = employeeIdChunks.map(chunk =>
        getDocs(query(
            collection(db, 'schedules'),
            where('employeeId', 'in', chunk),
            where('date', '>=', startDateStr),
            where('date', '<=', endDateStr)
        ))
    );

    const scheduleSnapshots = await Promise.all(schedulePromises);
    const schedules = scheduleSnapshots.flatMap(snap => snap.docs.map(doc => doc.data()));
    allSchedules = schedules;
}

/**
 * Lấy chuỗi HTML cho phần thân của bảng tổng quan trạng thái các cửa hàng.
 * @param {Array<Date>} cycleDates - Mảng các ngày trong chu kỳ.
 * @returns {string} - Chuỗi HTML chứa các thẻ <tr> cho tbody.
 */
function getStoreStatusTableBody(cycleDates) {
    let bodyHTML = '';

    const managedStoreIds = getManagedStoreIds(window.currentUser, allStores, allAreas);
    const managedStores = allStores.filter(s => managedStoreIds.includes(s.id));

    // --- LOGIC MOCK DATA MỚI ---
    // Với mỗi ngày, chọn ngẫu nhiên 0, 1, hoặc 2 cửa hàng để tạo chênh lệch giờ.
    const dailyImbalances = new Map();
    cycleDates.forEach(date => {
        const dateStr = formatDate(date);
        const shuffledStores = [...managedStores].sort(() => 0.5 - Math.random());
        const imbalanceCount = Math.floor(Math.random() * 3); // 0, 1, hoặc 2
        const storesWithImbalance = shuffledStores.slice(0, imbalanceCount);
        dailyImbalances.set(dateStr, storesWithImbalance.map(s => s.id));
    });
    // --- KẾT THÚC LOGIC MOCK DATA MỚI ---

    managedStores.forEach(store => {
        let cellsHTML = '';
        cycleDates.forEach(date => {
            const dateStr = formatDate(date);
            let diff = 0;

            // Kiểm tra xem cửa hàng này có nằm trong danh sách được chọn để tạo chênh lệch không
            if (dailyImbalances.get(dateStr)?.includes(store.id)) {
                // Tạo chênh lệch ngẫu nhiên (thừa hoặc thiếu)
                if (Math.random() > 0.5) {
                    diff = -(Math.random() * 8 + 4); // Thiếu từ 4-12 giờ
                } else {
                    diff = Math.random() * 6 + 2; // Thừa từ 2-8 giờ
                }
            }

            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const weekendCellClass = isWeekend ? 'bg-amber-50' : '';

            // Render ô dựa trên chênh lệch, colspan="2" để khớp với bảng dưới
            if (Math.abs(diff) > 0.01) {
                if (diff > 0) {
                    cellsHTML += `<td colspan="2" class="p-2 border text-center font-bold text-sm text-green-600 ${weekendCellClass}"><i class="fas fa-arrow-up mr-1"></i> ${diff.toFixed(1)}h</td>`;
                } else {
                    cellsHTML += `<td colspan="2" class="p-2 border text-center font-bold text-sm text-red-600 ${weekendCellClass}"><i class="fas fa-arrow-down mr-1"></i> ${Math.abs(diff).toFixed(1)}h</td>`;
                }
            } else {
                cellsHTML += `<td colspan="2" class="p-2 border text-center ${weekendCellClass}"></td>`;
            }
        });

        bodyHTML += `
            <tr class="bg-white store-status-row" data-store-id="${store.id}">
                <td class="p-2 border sticky left-0 bg-white z-10 cursor-pointer" title="Click để mở/đóng danh sách nhân viên của ${store.name}">
                    <div class="font-semibold text-sm">${store.name}</div>
                </td>
                ${cellsHTML}
            </tr>
        `;
    });

    if (managedStores.length === 0) {
        bodyHTML = `<tr><td colspan="${cycleDates.length + 1}" class="text-center p-4 text-gray-500">Không có cửa hàng nào để hiển thị.</td></tr>`;
    }

    return bodyHTML;
}


/**
 * Render toàn bộ bảng điều phối.
 */
function renderDispatchTable() {
    const table = document.getElementById('unified-dispatch-table');
    const header = table.querySelector('thead');
    const body = table.querySelector('tbody');
    const cycleDisplay = document.getElementById('cycle-range-display');
    if (!table || !header || !body || !cycleDisplay) return;

    const cycleDates = [];
    for (let d = new Date(currentCycle.start); d <= currentCycle.end; d.setDate(d.getDate() + 1)) {
        cycleDates.push(new Date(d));
    }

    cycleDisplay.textContent = `Chu kỳ từ ${currentCycle.start.toLocaleDateString('vi-VN')} đến ${currentCycle.end.toLocaleDateString('vi-VN')}`;

    // --- BƯỚC 1: RENDER HEADER CHUNG VÀ COLGROUP ---
    // Sử dụng colgroup để định nghĩa chiều rộng cố định cho các cột
    let colgroupHTML = '<colgroup><col style="min-width: 300px;">';
    cycleDates.forEach(() => {
        colgroupHTML += '<col style="min-width: 120px;"><col style="min-width: 120px;">'; // 2 ca mỗi ngày
    });
    colgroupHTML += '</colgroup>';
    
    let headerRowHTML = '<tr><th class="p-2 border sticky left-0 bg-slate-100 z-30 text-sm font-semibold">Nhân viên</th>';
    cycleDates.forEach(date => {
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0: Sunday, 6: Saturday
        const weekendClass = isWeekend ? 'bg-amber-100' : '';
        headerRowHTML += `
            <th colspan="2" class="p-1 border text-center w-[240px] ${weekendClass}">
                <div class="font-semibold text-sm">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div class="text-xs font-normal">${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
            </th>`;
    });
    headerRowHTML += '</tr>';
    // Chèn colgroup và header vào thead của bảng trên
    header.innerHTML = headerRowHTML; // colgroup sẽ được chèn vào table

    // --- BƯỚC 2: RENDER TOÀN BỘ BODY (TỔNG QUAN + CHI TIẾT) VÀO MỘT TBODY DUY NHẤT ---
    body.innerHTML = ''; // Xóa nội dung cũ
    const bodyFragment = document.createDocumentFragment(); // *** TẠO FRAGMENT ***

    // 2.1. Render các hàng tổng quan cửa hàng và thêm vào fragment
    const storeStatusRowsHTML = getStoreStatusTableBody(cycleDates);
    const tempStoreDiv = document.createElement('div');
    tempStoreDiv.innerHTML = `<table><tbody>${storeStatusRowsHTML}</tbody></table>`;
    Array.from(tempStoreDiv.querySelector('tbody').children).forEach(row => bodyFragment.appendChild(row));

    // 2.2. Render các hàng chi tiết nhân viên và thêm vào fragment
    const currentUser = window.currentUser;
    const hierarchy = buildHierarchy(currentUser);
    hierarchy.forEach(item => {
        const rowsHTML = renderRowRecursive(item, 0, cycleDates);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `<table><tbody>${rowsHTML}</tbody></table>`;
        Array.from(tempDiv.querySelector('tbody').children).forEach(row => bodyFragment.appendChild(row));
    });

    // --- BƯỚC 3: CHÈN COLGROUP VÀ BODY VÀO BẢNG CHÍNH ---
    table.insertAdjacentHTML('afterbegin', colgroupHTML);
    body.appendChild(bodyFragment); // *** CHÈN VÀO DOM 1 LẦN DUY NHẤT ***

    // Gắn sự kiện sau khi render
    attachRowEvents();
}

/**
 * Xây dựng cấu trúc cây phân cấp dựa trên vai trò người dùng.
 */
function buildHierarchy(user) {
    if (!user || !user.roleId) return [];

    let filteredRegions = [];
    let filteredAreas = [];
    let filteredStores = [];

    switch (user.roleId) {
        case 'ADMIN':
        case 'HQ_STAFF':
            // Admin/HQ thấy tất cả
            filteredRegions = [...allRegions];
            filteredAreas = [...allAreas];
            filteredStores = [...allStores];
            break;

        case 'REGIONAL_MANAGER':
            if (!user.managedRegionId) return [];
            filteredRegions = allRegions.filter(r => r.id === user.managedRegionId);
            filteredAreas = allAreas.filter(a => a.regionId === user.managedRegionId);
            const areaIdsForRM = filteredAreas.map(a => a.id);
            filteredStores = allStores.filter(s => areaIdsForRM.includes(s.areaId));
            break;

        case 'AREA_MANAGER':
            if (!user.managedAreaIds || user.managedAreaIds.length === 0) return [];
            filteredAreas = allAreas.filter(a => user.managedAreaIds.includes(a.id));
            const regionIdsForAM = [...new Set(filteredAreas.map(a => a.regionId))];
            filteredRegions = allRegions.filter(r => regionIdsForAM.includes(r.id));
            filteredStores = allStores.filter(s => user.managedAreaIds.includes(s.areaId));
            break;

        case 'STORE_INCHARGE':
            if (!user.managedStoreIds || user.managedStoreIds.length === 0) return [];
            filteredStores = allStores.filter(s => user.managedStoreIds.includes(s.id));
            const areaIdsForSI = [...new Set(filteredStores.map(s => s.areaId))];
            filteredAreas = allAreas.filter(a => areaIdsForSI.includes(a.id));
            const regionIdsForSI = [...new Set(filteredAreas.map(a => a.regionId))];
            filteredRegions = allRegions.filter(r => regionIdsForSI.includes(r.id));
            break;

        default:
            return []; // Các vai trò khác không có quyền xem trang này
    }

    // Xây dựng cây phân cấp từ dữ liệu đã lọc
    return filteredRegions.map(region => {
        const areasInRegion = filteredAreas.filter(area => area.regionId === region.id);
        return {
            ...region, type: 'region',
            children: areasInRegion.map(area => ({ ...area, type: 'area', children: filteredStores.filter(store => store.areaId === area.id).map(store => ({ ...store, type: 'store', children: allPersonnel.filter(p => p.storeId === store.id && p.type === 'employee') })) }))
        };
    });
}

/**
 * Render một hàng và các con của nó một cách đệ quy, với trạng thái thu gọn mặc định.
 * @param {object} item - Mục cần render (region, area, store, employee).
 * @param {number} level - Cấp độ của mục trong cây phân cấp.
 * @param {Array<Date>} cycleDates - Mảng các ngày trong chu kỳ.
 * @param {boolean} isParentCollapsed - Trạng thái thu gọn của mục cha.
 * @returns {string} - Chuỗi HTML của hàng và các con của nó.
 */
function renderRowRecursive(item, level, cycleDates, isParentCollapsed = false) {
    const isCollapsible = item.children?.length > 0;
    // Mặc định, tất cả các cấp có thể thu gọn (level > -1) đều được thu gọn.
    const isCollapsed = isCollapsible && level > -1; 
    const isHidden = isParentCollapsed; // Hàng này bị ẩn nếu cha của nó bị thu gọn.

    let rowHTML = renderSingleRow(item, level, cycleDates, isCollapsed, isHidden);

    if (isCollapsible) {
        item.children.forEach(child => { // Luôn render các con, nhưng truyền trạng thái isHidden
            rowHTML += renderRowRecursive(child, level + 1, cycleDates, isCollapsed || isHidden);
        });
    }
    return rowHTML;
}

/**
 * Render nội dung một ô ca làm việc cho nhân viên.
 */
function renderEmployeeShiftCell(schedule, stores, date) {
    const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === schedule.shift);
    const timeRange = shiftInfo ? shiftInfo.timeRange : 'Nghỉ';

    // Kiểm tra xem ngày của ô có phải là hôm nay hoặc trong quá khứ không
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPastOrToday = date <= today;

    // Tạo dropdown các cửa hàng
    const storeOptions = stores.map(store =>
        `<option value="${store.id}" ${schedule.storeId === store.id ? 'selected' : ''}>${store.name}</option>`
    ).join('');

    // Vô hiệu hóa select nếu không có ca làm việc, hoặc nếu ngày là hôm nay/quá khứ
    const disabledAttribute = (!schedule.shift || isPastOrToday) ? 'disabled' : '';

    return `
        <td class="p-1 border text-xs">
            <div class="flex flex-col gap-1">
                <select class="form-input form-input-sm p-1 text-xs" ${disabledAttribute}>
                    ${storeOptions}
                </select>
                <div class="text-center text-gray-600">${timeRange}</div>
            </div>
        </td>`;
}

/**
 * Render một hàng đơn lẻ trong bảng.
 * @param {object} item - Mục cần render.
 * @param {number} level - Cấp độ của mục.
 * @param {Array<Date>} cycleDates - Mảng các ngày.
 * @param {boolean} isCollapsed - Hàng này có được thu gọn không.
 * @param {boolean} isHidden - Hàng này có bị ẩn bởi cha không.
 * @returns {string} - Chuỗi HTML của một hàng <tr>.
 */
function renderSingleRow(item, level, cycleDates, isCollapsed, isHidden) {
    const indent = level * 20;
    const isCollapsible = item.children?.length > 0;
    const rowId = `${item.type}-${item.id}`;

    let firstColHTML = `
        <div class="flex items-center" style="padding-left: ${indent}px;">
            ${isCollapsible ? `<button class="toggle-btn w-6 h-6 flex-shrink-0 text-gray-500 hover:bg-gray-200 rounded-full"><i class="fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-down'}"></i></button>` : '<div class="w-6 h-6 flex-shrink-0"></div>'}
            <div class="ml-2">
                <span class="font-semibold text-sm">${item.name}</span>
                ${item.type === 'employee' && item.roleId ? `<div class="text-xs text-gray-500">${allRoles.find(r => r.id === item.roleId)?.name || item.roleId}</div>` : ''}
            </div>
        </div>`;

    let cellsHTML = '';
    cycleDates.forEach(date => {
        const dateStr = formatDate(date);
        if (item.type === 'employee') {
            const shiftsForDay = allSchedules.filter(s => s.employeeId === item.id && s.date === dateStr);

            // Sắp xếp các ca làm việc theo thời gian bắt đầu để đảm bảo thứ tự hiển thị chính xác
            shiftsForDay.sort((a, b) => {
                const shiftInfoA = allShiftCodes.find(sc => sc.shiftCode === a.shift);
                const shiftInfoB = allShiftCodes.find(sc => sc.shiftCode === b.shift);
                if (!shiftInfoA?.timeRange) return 1;
                if (!shiftInfoB?.timeRange) return -1;
                const startTimeA = shiftInfoA.timeRange.split('~')[0].trim();
                const startTimeB = shiftInfoB.timeRange.split('~')[0].trim();
                return startTimeA.localeCompare(startTimeB);
            });

            const shifts = shiftsForDay.slice(0, 2);
            cellsHTML += renderEmployeeShiftCell(shifts[0] || {}, allStores, date);
            cellsHTML += renderEmployeeShiftCell(shifts[1] || {}, allStores, date);
        } else {
            // Dòng region và area sẽ có ô trống
            cellsHTML += `<td colspan="2" class="p-2 border"></td>`;
        }
    });

    const collapsedClass = isCollapsed ? 'collapsed' : '';
    const hiddenClass = isHidden ? 'hidden' : '';

    return `<tr data-id="${rowId}" data-level="${level}" class="bg-white ${collapsedClass} ${hiddenClass}">
                <td class="p-2 border sticky left-0 bg-white z-10">${firstColHTML}</td>
                ${cellsHTML}
            </tr>`;
}
/**
 * Gắn sự kiện cho các hàng (thu gọn/mở rộng).
 */
function attachRowEvents() {
    const tableBody = document.getElementById('dispatch-table-body');
    if (!tableBody) return;

    // Sử dụng một event listener duy nhất cho toàn bộ tbody để tối ưu hiệu suất
    tableBody.addEventListener('click', (event) => {
        const toggleBtn = event.target.closest('.toggle-btn');
        const storeStatusRow = event.target.closest('.store-status-row');

        // Xử lý click nút mở/đóng
        if (toggleBtn) {
            const row = toggleBtn.closest('tr');
            const level = parseInt(row.dataset.level, 10);
            const isCollapsing = !row.classList.contains('collapsed');

            toggleBtn.querySelector('i').classList.toggle('fa-chevron-down', !isCollapsing);
            toggleBtn.querySelector('i').classList.toggle('fa-chevron-right', isCollapsing);
            row.classList.toggle('collapsed');

            let nextRow = row.nextElementSibling;
            while (nextRow && parseInt(nextRow.dataset.level, 10) > level) {
                if (isCollapsing) {
                    nextRow.classList.add('hidden');
                } else {
                    if (parseInt(nextRow.dataset.level, 10) === level + 1) {
                        nextRow.classList.remove('hidden');
                        // Nếu hàng con này cũng bị thu gọn, các cháu của nó vẫn phải bị ẩn
                        if (nextRow.classList.contains('collapsed')) {
                            let grandChild = nextRow.nextElementSibling;
                            while (grandChild && parseInt(grandChild.dataset.level, 10) > level + 1) {
                                grandChild.classList.add('hidden');
                                grandChild = grandChild.nextElementSibling;
                            }
                        }
                    }
                }
                nextRow = nextRow.nextElementSibling;
            }
        }

        // Xử lý click vào hàng cửa hàng ở bảng trên
        if (storeStatusRow) {
            const storeId = storeStatusRow.dataset.storeId;
            if (storeId) {
                const storeRow = tableBody.querySelector(`tr[data-id="store-${storeId}"]`);
                if (!storeRow) return;

                // Hàm helper để mở một hàng nếu nó đang đóng
                const expandRowIfNeeded = (row) => {
                    if (row && row.classList.contains('collapsed')) {
                        row.querySelector('.toggle-btn')?.click();
                    }
                };

                // Tìm các hàng cha (khu vực và miền)
                let areaRow = null;
                let regionRow = null;
                let currentRow = storeRow.previousElementSibling;

                while (currentRow && (!areaRow || !regionRow)) {
                    const level = parseInt(currentRow.dataset.level, 10);
                    if (level === 1 && !areaRow) {
                        areaRow = currentRow;
                    }
                    if (level === 0 && !regionRow) {
                        regionRow = currentRow;
                        break; // Đã tìm thấy cả hai, không cần đi xa hơn
                    }
                    currentRow = currentRow.previousElementSibling;
                }

                // Mở rộng từ trên xuống dưới: Miền -> Khu vực -> Cửa hàng
                expandRowIfNeeded(regionRow);
                expandRowIfNeeded(areaRow);
                expandRowIfNeeded(storeRow);
            }
        }
    });
}

/**
 * Chuyển chu kỳ và tải lại dữ liệu.
 */
async function changeCycle(direction) {
    const newRefDate = new Date(currentCycle.start);
    // direction = 1 (tới), -1 (lùi)
    newRefDate.setMonth(newRefDate.getMonth() + direction);
    currentCycle = getPayrollCycle(newRefDate);

    showLoading();
    await fetchSchedulesForCycle();
    renderDispatchTable();
}

/**
 * Hàm dọn dẹp khi rời khỏi trang.
 */
export function cleanup() {
    if (domController) {
        domController.abort();
        domController = null;
    }
}

/**
 * Hàm khởi tạo chính.
 */
export async function init() {
    domController = new AbortController();
    const { signal } = domController;

    currentCycle = getPayrollCycle(new Date()); // Lấy chu kỳ hiện tại
    showLoading();

    // Tải dữ liệu song song
    await fetchInitialData();
    await fetchSchedulesForCycle();

    renderDispatchTable();

    document.getElementById('prev-cycle-btn')?.addEventListener('click', () => changeCycle(-1), { signal });
    document.getElementById('next-cycle-btn')?.addEventListener('click', () => changeCycle(1), { signal });
}