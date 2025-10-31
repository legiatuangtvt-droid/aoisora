import { db } from './firebase.js';
import { collection, getDocs, query, where, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let viewStartDate = new Date(); // Ngày đầu tiên của 7 ngày hiển thị

// Biến lưu trữ dữ liệu
let allPersonnel = [];
let allStores = [];
let allAreas = [];
let allRegions = [];
let allSchedules = [];
let allShiftCodes = [];
let dailyTemplate = null;

const SHIFT_CODES_STORAGE_KEY = 'aoisora_shiftCodes';

/**
 * Định dạng Date thành chuỗi 'YYYY-MM-DD'.
 */
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Lấy ngày bắt đầu hiển thị, luôn là ngày mai.
 * @returns {Date}
 */
function getStartDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow; // Bảng sẽ luôn bắt đầu từ ngày mai
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
        // Tải dữ liệu mã ca từ localStorage
        const storedShifts = localStorage.getItem(SHIFT_CODES_STORAGE_KEY);
        if (storedShifts) allShiftCodes = JSON.parse(storedShifts);

        // Tải các collection cơ bản để xây dựng cấu trúc
        const [
            storesSnap, areasSnap, regionsSnap, templateSnap, rolesSnap
        ] = await Promise.all([
            getDocs(collection(db, 'stores')),
            getDocs(collection(db, 'areas')),
            getDocs(collection(db, 'regions')),
            getDocs(query(collection(db, 'daily_templates'), where('name', '==', 'Test'))),
            getDocs(collection(db, 'roles')) // Tải roles để lấy level
        ]);

        allStores = storesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allAreas = areasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allRegions = regionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const allRoles = rolesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Xác định các storeId thuộc phạm vi quản lý của người dùng
        const managedStoreIds = getManagedStoreIds(currentUser, allStores, allAreas);

        // Tải nhân viên chỉ thuộc các cửa hàng được quản lý
        if (managedStoreIds.length > 0) {
            // Firestore 'in' query giới hạn 30 item, nên ta phải chia nhỏ nếu cần
            const CHUNK_SIZE = 30;
            const storeIdChunks = [];
            for (let i = 0; i < managedStoreIds.length; i += CHUNK_SIZE) {
                storeIdChunks.push(managedStoreIds.slice(i, i + CHUNK_SIZE));
            }

            const employeePromises = storeIdChunks.map(chunk =>
                getDocs(query(collection(db, 'employee'), where('storeId', 'in', chunk)))
            );

            const employeeSnapshots = await Promise.all(employeePromises);
            const employees = [];
            employeeSnapshots.forEach(snap => {
                snap.docs.forEach(doc => {
                    const empData = doc.data();
                    const role = allRoles.find(r => r.id === empData.roleId);
                    employees.push({ id: doc.id, type: 'employee', level: role?.level || 0, ...empData });
                });
            });
            // Sắp xếp nhân viên theo level giảm dần, sau đó theo tên
            employees.sort((a, b) => {
                if (b.level !== a.level) return b.level - a.level;
                return a.name.localeCompare(b.name);
            });
            allPersonnel = employees;
        } else {
            allPersonnel = [];
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
async function fetchSchedulesForWeek() {
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(viewStartDate);
        date.setDate(date.getDate() + i);
        return formatDate(date);
    });

    // Chỉ tải lịch của các nhân viên thuộc phạm vi quản lý
    const employeeIds = allPersonnel.map(p => p.id);
    if (employeeIds.length === 0) {
        allSchedules = [];
        return;
    }

    // Chia nhỏ truy vấn nếu cần
    const CHUNK_SIZE = 30;
    const employeeIdChunks = [];
    for (let i = 0; i < employeeIds.length; i += CHUNK_SIZE) {
        employeeIdChunks.push(employeeIds.slice(i, i + CHUNK_SIZE));
    }

    const schedulePromises = employeeIdChunks.flatMap(chunk =>
        weekDates.map(date => getDocs(query(collection(db, 'schedules'), where('employeeId', 'in', chunk), where('date', '==', date))))
    );

    const scheduleSnapshots = await Promise.all(schedulePromises);
    const schedules = scheduleSnapshots.flatMap(snap => snap.docs.map(doc => doc.data()));
    allSchedules = schedules;
}

/**
 * Render toàn bộ bảng điều phối.
 */
function renderDispatchTable() {
    const header = document.getElementById('dispatch-table-header');
    const body = document.getElementById('dispatch-table-body');
    const weekDisplay = document.getElementById('week-range-display');
    if (!header || !body || !weekDisplay) return;

    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(viewStartDate);
        d.setDate(d.getDate() + i);
        return d;
    });

    weekDisplay.textContent = `Tuần từ ${weekDates[0].toLocaleDateString('vi-VN')} đến ${weekDates[6].toLocaleDateString('vi-VN')}`;

    // Render Header
    let headerHTML = '<tr><th class="p-2 border sticky left-0 bg-slate-100 z-30 min-w-[250px]">Nhân viên</th>';
    weekDates.forEach(date => {
        headerHTML += `
            <th colspan="2" class="p-1 border text-center">
                <div class="font-semibold">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div class="text-xs font-normal">${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
            </th>`;
    });
    headerHTML += '</tr>';
    header.innerHTML = headerHTML;

    // Render Body
    body.innerHTML = ''; // Xóa nội dung cũ
    const currentUser = window.currentUser;
    const hierarchy = buildHierarchy(currentUser);

    hierarchy.forEach(item => {
        body.innerHTML += renderRowRecursive(item, 0, weekDates);
    });

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
 * @param {Array<Date>} weekDates - Mảng các ngày trong tuần.
 * @param {boolean} isParentCollapsed - Trạng thái thu gọn của mục cha.
 * @returns {string} - Chuỗi HTML của hàng và các con của nó.
 */
function renderRowRecursive(item, level, weekDates, isParentCollapsed = false) {
    const isCollapsible = item.children?.length > 0;
    // Mặc định, tất cả các cấp có thể thu gọn (level > -1) đều được thu gọn.
    const isCollapsed = isCollapsible && level > -1; 
    const isHidden = isParentCollapsed; // Hàng này bị ẩn nếu cha của nó bị thu gọn.

    let rowHTML = renderSingleRow(item, level, weekDates, isCollapsed, isHidden);

    if (isCollapsible) {
        item.children.forEach(child => { // Luôn render các con, nhưng truyền trạng thái isHidden
            rowHTML += renderRowRecursive(child, level + 1, weekDates, isCollapsed || isHidden);
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
 * @param {Array<Date>} weekDates - Mảng các ngày.
 * @param {boolean} isCollapsed - Hàng này có được thu gọn không.
 * @param {boolean} isHidden - Hàng này có bị ẩn bởi cha không.
 * @returns {string} - Chuỗi HTML của một hàng <tr>.
 */
function renderSingleRow(item, level, weekDates, isCollapsed, isHidden) {
    const indent = level * 20;
    const isCollapsible = item.children?.length > 0;
    const rowId = `${item.type}-${item.id}`;

    let firstColHTML = `
        <div class="flex items-center" style="padding-left: ${indent}px;">
            ${isCollapsible ? `<button class="toggle-btn w-6 h-6 flex-shrink-0 text-gray-500 hover:bg-gray-200 rounded-full"><i class="fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-down'}"></i></button>` : '<div class="w-6"></div>'}
            <span class="ml-2 font-semibold">${item.name}</span>
        </div>`;

    let cellsHTML = '';
    weekDates.forEach(date => {
        const dateStr = formatDate(date);
        if (item.type === 'employee') {
            const shifts = allSchedules.filter(s => s.employeeId === item.id && s.date === dateStr).slice(0, 2);
            cellsHTML += renderEmployeeShiftCell(shifts[0] || {}, allStores, date);
            cellsHTML += renderEmployeeShiftCell(shifts[1] || {}, allStores, date);
        } else if (item.type === 'store') {
            const schedulesInStoreOnDate = allSchedules.filter(s => s.storeId === item.id && s.date === dateStr);
            const actualManHour = schedulesInStoreOnDate.reduce((total, schedule) => {
                const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === schedule.shift);
                return total + (shiftInfo?.duration || 0);
            }, 0);
            const modelManHour = dailyTemplate?.totalManHour || 80;
            const diff = actualManHour - modelManHour;
            let colorClass = diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-500';
            cellsHTML += `<td colspan="2" class="p-2 border text-center font-bold ${colorClass}">${diff.toFixed(1)}h</td>`;
        } else {
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
    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.addEventListener('click', () => {
            const row = button.closest('tr');
            const rowId = row.dataset.id;
            const level = parseInt(row.dataset.level, 10);
            const isExpanded = !row.classList.contains('collapsed');

            button.querySelector('i').classList.toggle('fa-chevron-down', !isExpanded);
            button.querySelector('i').classList.toggle('fa-chevron-right', isExpanded);
            row.classList.toggle('collapsed', isExpanded);

            // Tìm và ẩn/hiện tất cả các hàng con
            let nextRow = row.nextElementSibling;
            while (nextRow && parseInt(nextRow.dataset.level, 10) > level) {
                if (isExpanded) {
                    // Nếu đang mở -> đóng lại tất cả các con cháu
                    nextRow.classList.add('hidden');
                } else {
                    // Nếu đang đóng -> chỉ mở cấp con trực tiếp
                    if (parseInt(nextRow.dataset.level, 10) === level + 1) {
                        // Chỉ hiện hàng con nếu nó không bị ẩn bởi một cấp cha cao hơn nữa
                        // (Điều này thường không xảy ra với logic hiện tại nhưng để phòng xa)
                        if (!nextRow.classList.contains('hidden-by-ancestor')) {
                            nextRow.classList.remove('hidden');
                            // Nếu hàng con này cũng đang bị thu gọn, thì không mở cháu của nó
                            if (nextRow.classList.contains('collapsed')) {
                                let grandChild = nextRow.nextElementSibling;
                                while(grandChild && parseInt(grandChild.dataset.level, 10) > level + 1) {
                                    grandChild.classList.add('hidden');
                                    grandChild = grandChild.nextElementSibling;
                                }
                            }
                        }
                    }
                }
                nextRow = nextRow.nextElementSibling;
            }
        });
    });
}

/**
 * Chuyển tuần và tải lại dữ liệu.
 */
async function changeWeek(direction) {
    viewStartDate.setDate(viewStartDate.getDate() + (direction * 7));
    showLoading();
    await fetchSchedulesForWeek();
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
    const startTime = performance.now();
    console.log("Bắt đầu tải trang Điều phối nhân lực...");

    domController = new AbortController();
    const { signal } = domController;

    viewStartDate = getStartDate();
    showLoading();

    // Tải dữ liệu song song
    await fetchInitialData();
    await fetchSchedulesForWeek();

    renderDispatchTable();

    const endTime = performance.now();
    console.log(`%cHoàn tất tải và render trang trong ${(endTime - startTime).toFixed(2)} ms.`, 'color: green; font-weight: bold;');

    document.getElementById('prev-week-btn')?.addEventListener('click', () => changeWeek(-1), { signal });
    document.getElementById('next-week-btn')?.addEventListener('click', () => changeWeek(1), { signal });
}