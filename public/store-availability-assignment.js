import { db } from './firebase.js';
import { collection, getDocs, query, where, doc, setDoc, serverTimestamp, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let viewStartDate = new Date();
let allEmployeesInStore = [];
let allAvailabilities = [];
let workPositions = []; // To store all possible work positions from datalist
let shiftCodes = [];
const SHIFT_CODES_STORAGE_KEY = 'aoisora_shiftCodes';

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
}

/**
 * Tải danh sách mã ca từ localStorage.
 */
function loadShiftCodes() {
    const storedData = localStorage.getItem(SHIFT_CODES_STORAGE_KEY);
    const datalist = document.getElementById('shift-codes-datalist');
    if (!datalist) return;

    datalist.innerHTML = ''; // Clear old options

    if (storedData) {
        try {
            const parsedData = JSON.parse(storedData);
            if (Array.isArray(parsedData)) {
                shiftCodes = parsedData;
                shiftCodes.forEach(sc => {
                    datalist.innerHTML += `<option value="${sc.shiftCode}">${sc.timeRange}</option>`;
                });
            }
        } catch (e) {
            console.error("Lỗi khi đọc dữ liệu mã ca từ localStorage", e);
        }
    }
}

/**
 * Tải danh sách các vị trí công việc từ datalist.
 */
function loadWorkPositions() {
    const datalist = document.getElementById('work-positions-datalist');
    if (datalist) {
        workPositions = Array.from(datalist.options).map(option => option.value);
    }
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
    const footer = document.getElementById('assignment-table-footer');
    const dateDisplay = document.getElementById('current-date-display');
    if (!header || !body || !footer || !dateDisplay) return;

    header.innerHTML = '';
    body.innerHTML = '';
    footer.innerHTML = '';

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(viewStartDate);
        date.setDate(date.getDate() + i);
        weekDates.push(date);
    }

    dateDisplay.textContent = `Tuần từ ${weekDates[0].toLocaleDateString('vi-VN')} - ${weekDates[6].toLocaleDateString('vi-VN')}`;

    // Render Header
    let headerHTML = `<tr class="border-y border-gray-200">
        <th class="p-2 border-x border-gray-200 text-center sticky left-0 z-10 bg-slate-50">Nhân viên</th>`;
    weekDates.forEach(date => {
        headerHTML += `<th class="p-1 border-x border-gray-200 min-w-[130px] text-center">
            <div class="day-name font-semibold text-gray-700">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div class="date-number text-xs text-gray-500">${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
        </th>`;
    });
    // Thêm các cột header cho từng vị trí công việc
    workPositions.forEach((pos, index) => {
        // Cột cuối cùng sẽ là sticky
        const stickyClass = index === workPositions.length - 1 ? 'sticky right-0 z-10' : '';
        headerHTML += `<th class="p-1 border-x border-gray-200 bg-slate-50 text-center text-xs ${stickyClass} w-10 ">${pos}</th>`;
    });
    headerHTML += `</tr>`;
    header.innerHTML = headerHTML;

    // Render Footer with Assign Buttons
    let footerHTML = `<tr><td class="p-1 border-x border-gray-200 sticky left-0 z-10 bg-slate-50"></td>`;
    weekDates.forEach(date => {
        const dateStr = formatDate(date);
        footerHTML += `<td class="p-1 border-x border-gray-200 text-center">
            <div class="flex items-center justify-center gap-1">
                <button class="suggest-day-btn btn btn-outline-amber btn-sm text-xs" data-date="${dateStr}">Đề xuất</button>
                <button class="assign-day-btn btn btn-indigo btn-sm text-xs" data-date="${dateStr}">Phân công</button>
            </div>
        </td>`;
    });
    // Thêm các ô footer trống để căn chỉnh
    workPositions.forEach((pos, index) => {
        const stickyClass = index === workPositions.length - 1 ? 'sticky right-0 z-10' : '';
        footerHTML += `<td class="p-1 border-x border-gray-200 ${stickyClass} bg-slate-50"></td>`;
    });
    footerHTML += `</tr>`;
    footer.innerHTML = footerHTML;

    // Render Body
    if (allEmployeesInStore.length === 0) {
        body.innerHTML = `<tr><td colspan="${8 + workPositions.length}" class="text-center p-10 text-gray-500">Cửa hàng này chưa có nhân viên.</td></tr>`;
        return;
    }

    allEmployeesInStore.forEach(employee => {
        const row = document.createElement('tr');
        row.dataset.employeeId = employee.id;
        let rowHTML = `<td class="p-1 border-x border-gray-200 bg-white text-center sticky left-0 z-10 font-semibold text-sm">${employee.name}</td>`;

        weekDates.forEach(date => {
            rowHTML += renderCellContent(employee, date);
        });

        // Thêm ô thống kê vào cuối mỗi hàng
        workPositions.forEach((pos, index) => {
            const stickyClass = index === workPositions.length - 1 ? 'sticky right-0 z-10' : '';
            rowHTML += `<td class="p-1 border-x border-gray-200 align-middle text-center relative bg-white ${stickyClass}" data-position="${pos}">
                            <span class="stat-percentage text-sm font-semibold text-gray-700">0.0%</span>
                        </td>`;
        });

        row.innerHTML = rowHTML;
        body.appendChild(row);
    });

    document.getElementById('prev-week-btn')?.addEventListener('click', () => changeWeek(-1), { signal: domController.signal });
    document.getElementById('next-week-btn')?.addEventListener('click', () => changeWeek(1), { signal: domController.signal });
}



/**
 * Helper function to render cell content based on user role.
 * @param {object} employee 
 * @param {Date} date 
 * @returns {string}
 */
function renderCellContent(employee, date) {
    if (employee.id === window.currentUser.id) {
        return renderEditableCellForLeader(employee, date);
    }
    return renderReadOnlyCellForStaff(employee, date);
}
/**
 * Render ô có thể chỉnh sửa cho trưởng cửa hàng.
 * @param {object} employee - Đối tượng nhân viên (trưởng cửa hàng).
 * @param {Date} date - Ngày của ô.
 * @returns {string} - Chuỗi HTML của ô <td>.
 */
function renderEditableCellForLeader(employee, date) {
    const dateStr = formatDate(date);
    const availability = allAvailabilities.find(a => a.employeeId === employee.id && a.date === dateStr);
    const registrations = availability?.registrations || [{}, {}];

    let blocksHTML = '';
    for (let i = 0; i < 2; i++) {
        const reg = registrations[i] || {};
        const hasShift = !!reg.shiftCode;
        const priority1Selected = reg.priority === 1;
        const priority2Selected = reg.priority === 2;

        blocksHTML += `
            <div class="shift-registration-block flex-1" data-shift-index="${i}">
                <div class="flex-grow space-y-1">
                    <input list="shift-codes-datalist" class="shift-input text-center form-input form-input-sm w-full text-xs" 
                           placeholder="-- Ca ${i + 1} --" value="${reg.shiftCode || ''}">
                    <div class="shift-time-display text-xs text-center text-gray-500 h-4">${(shiftCodes.find(sc => sc.shiftCode === reg.shiftCode)?.timeRange) || ''}</div>
                </div>
                <div class="priority-selector flex justify-center items-center gap-2 mt-1">
                    <button class="priority-btn" data-priority="1" title="Chắc chắn vào ca" ${!hasShift ? 'disabled' : ''}>
                        <i class="fas fa-circle text-base ${priority1Selected ? 'text-green-500' : 'text-gray-300'}"></i>
                    </button>
                    <button class="priority-btn" data-priority="2" title="Có thể vào ca" ${!hasShift ? 'disabled' : ''}>
                        <i class="fas fa-triangle-exclamation text-base ${priority2Selected ? 'text-amber-500' : 'text-gray-300'}"></i>
                    </button>
                </div>
            </div>
        `;
    }

    return `<td class="p-2 border-x border-gray-200 align-top" data-date="${dateStr}" data-is-editable="true">
                <div class="flex items-start gap-0.5">${blocksHTML}</div>
            </td>`;
}

/**
 * Render ô chỉ đọc cho nhân viên.
 * @param {object} employee - Đối tượng nhân viên.
 * @param {Date} date - Ngày của ô.
 * @returns {string} - Chuỗi HTML của ô <td>.
 */
function renderReadOnlyCellForStaff(employee, date) {
    const dateStr = formatDate(date);
    const availability = allAvailabilities.find(a => a.employeeId === employee.id && a.date === dateStr);
    const registrations = availability?.registrations || [];

    const reg1 = registrations[0] || {};
    const reg2 = registrations[1] || {};

    const timeRange1 = shiftCodes.find(sc => sc.shiftCode === reg1.shiftCode)?.timeRange || '&nbsp;';
    const timeRange2 = shiftCodes.find(sc => sc.shiftCode === reg2.shiftCode)?.timeRange || '&nbsp;';
    const priorityIcon1 = reg1.priority === 1 ? '<i class="fas fa-circle text-green-500" title="Chắc chắn"></i>' : (reg1.priority === 2 ? '<i class="fas fa-triangle-exclamation text-amber-500" title="Có thể"></i>' : '<i class="fas fa-circle text-transparent"></i>');
    const priorityIcon2 = reg2.priority === 1 ? '<i class="fas fa-circle text-green-500" title="Chắc chắn"></i>' : (reg2.priority === 2 ? '<i class="fas fa-triangle-exclamation text-amber-500" title="Có thể"></i>' : '<i class="fas fa-circle text-transparent"></i>');
    
    const shiftInfoHTML = `
        <div class="flex flex-col gap-0.5">
            <div class="flex justify-around items-center text-xs font-medium">
                <span class="px-0.5 ${reg1.shiftCode ? 'text-gray-800' : 'text-gray-400'}">${reg1.shiftCode || '---'}</span>
                <span class="px-0.5 ${reg2.shiftCode ? 'text-gray-800' : 'text-gray-400'}">${reg2.shiftCode || '---'}</span>
            </div>
            <div class="flex justify-around items-center text-xs text-gray-500 h-4">
                <span class="px-0.5 whitespace-nowrap text-[10px]">${timeRange1}</span>
                <span class="px-0.5 whitespace-nowrap text-[10px]">${timeRange2}</span>
            </div>
            <div class="flex justify-around items-center text-xs h-4">
                <span>${priorityIcon1}</span>
                <span>${priorityIcon2}</span>
            </div>
        </div>
    `;

    const positionInputLine = `
        <div class="mt-1 flex gap-1">
            <input list="work-positions-datalist" class="position-input form-input form-input-sm w-full text-center text-xs ${!reg1.shiftCode ? 'bg-slate-50' : ''}" data-shift-index="0" placeholder="Vị trí 1..." ${!reg1.shiftCode ? 'disabled' : ''}>
            <input list="work-positions-datalist" class="position-input form-input form-input-sm w-full text-center text-xs ${!reg2.shiftCode ? 'bg-slate-50' : ''}" data-shift-index="1" placeholder="Vị trí 2..." ${!reg2.shiftCode ? 'disabled' : ''}>
        </div>`;

    return `<td class="p-1 border-x border-gray-200 align-top" data-date="${dateStr}">
                <div class="flex flex-col gap-1">${shiftInfoHTML}${positionInputLine}</div>
            </td>`;
}



/**
 * Xử lý việc lưu phân công cho một ngày cụ thể.
 * @param {Event} event 
 */
async function handleSaveAssignmentForDay(event) {
    const button = event.target;
    const date = button.dataset.date;

    if (!date) return;

    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;

    const assignments = [];
    let isValid = true;

    const employeeRows = document.querySelectorAll('#assignment-table-body tr[data-employee-id]');

    for (const row of employeeRows) {
        const employeeId = row.dataset.employeeId;
        const employee = allEmployeesInStore.find(e => e.id === employeeId);
        const cell = row.querySelector(`td[data-date="${date}"]`);
        if (!cell || !employee) continue;

        const availability = allAvailabilities.find(a => a.employeeId === employeeId && a.date === date);
        const registrations = availability?.registrations || [];
        const positionInputs = cell.querySelectorAll('.position-input');

        const employeeAssignments = [];

        for (let i = 0; i < 2; i++) {
            const reg = registrations[i] || {};
            const input = Array.from(positionInputs).find(inp => inp.dataset.shiftIndex == i);
            const position = input ? input.value.trim() : '';

            if (reg.shiftCode) {
                if (!position) {
                    isValid = false;
                    input.classList.add('border-red-500', 'ring-red-500');
                    window.showToast(`Vui lòng phân công vị trí cho ${employee.name} (Ca ${i + 1})`, 'warning');
                } else {
                    input.classList.remove('border-red-500', 'ring-red-500');
                    employeeAssignments.push({
                        shiftCode: reg.shiftCode,
                        priority: reg.priority,
                        position: position
                    });
                }
            }
        }

        if (employeeAssignments.length > 0) {
            assignments.push({
                employeeId: employeeId,
                employeeName: employee.name,
                assignments: employeeAssignments
            });
        }
    }

    if (!isValid) {
        button.disabled = false;
        button.textContent = 'Phân công';
        return;
    }

    try {
        const docRef = doc(db, 'work_assignments', date);
        await setDoc(docRef, { assignments, updatedAt: serverTimestamp() });
        window.showToast(`Đã lưu phân công cho ngày ${date}`, 'success');
    } catch (error) {
        console.error("Lỗi khi lưu phân công:", error);
        window.showToast("Đã xảy ra lỗi khi lưu phân công.", "error");
    } finally {
        button.disabled = false;
        button.textContent = 'Phân công';
    }
}

/**
 * Lấy model công việc cho một ngày cụ thể.
 * @param {string} date - Ngày cần lấy model (YYYY-MM-DD).
 * @returns {Promise<string[]>} - Mảng các vị trí công việc cần thiết.
 */
async function getWorkModelForDate(date) {
    // TODO: Thay thế bằng logic lấy model thật từ Firestore hoặc nguồn khác.
    // Model giả lập: trả về một danh sách các vị trí cần được lấp đầy.
    console.log(`Đang sử dụng model giả lập cho ngày ${date}`);
    const mockModel = [
        'Thu ngân', 'Thu ngân',
        'Pha chế', 'Pha chế', 'Pha chế',
        'Kho',
        'Sơ chế'
    ];
    return mockModel;
}

/**
 * Tính toán tổng số ca đã đăng ký của mỗi nhân viên trong tuần hiện tại.
 * @returns {Map<string, number>} - Một Map với key là employeeId và value là tổng số ca.
 */
function calculateWeeklyWorkload() {
    const workload = new Map();
    // Khởi tạo tất cả nhân viên trong cửa hàng với 0 ca
    allEmployeesInStore.forEach(emp => workload.set(emp.id, 0));

    // Lặp qua tất cả các đăng ký trong tuần và đếm số ca
    allAvailabilities.forEach(avail => {
        if (avail.registrations) {
            const shiftCount = avail.registrations.filter(reg => reg && reg.shiftCode).length;
            if (shiftCount > 0) {
                workload.set(avail.employeeId, (workload.get(avail.employeeId) || 0) + shiftCount);
            }
        }
    });
    return workload;
}

/**
 * Xử lý đề xuất phân công cho một ngày.
 * @param {Event} event 
 */
async function handleSuggestAssignmentForDay(event) {
    const button = event.target.closest('button');
    const date = button.dataset.date;
    if (!date) return;

    // 1. Lấy model công việc cho ngày
    const neededPositions = await getWorkModelForDate(date);
    if (neededPositions.length === 0) {
        window.showToast('Không có model công việc cho ngày này.', 'info');
        return;
    }

    // 2. Tính toán khối lượng công việc trong tuần của mỗi nhân viên
    const weeklyWorkload = calculateWeeklyWorkload();

    // 3. Thu thập và làm giàu dữ liệu nhân viên có đăng ký ca trong ngày
    const availableStaffSlots = [];
    allEmployeesInStore.forEach(employee => {
        const availability = allAvailabilities.find(a => a.employeeId === employee.id && a.date === date);
        if (availability && availability.registrations) {
            availability.registrations.forEach((reg, index) => {
                if (reg.shiftCode) {
                    const weeklyShiftCount = weeklyWorkload.get(employee.id) || 0;
                    availableStaffSlots.push({
                        employeeId: employee.id,
                        shiftIndex: index,
                        priority: reg.priority || 3, // Ưu tiên thấp nếu không có
                        weeklyShiftCount: weeklyShiftCount
                    });
                }
            });
        }
    });

    // 4. Sắp xếp nhân viên theo tiêu chí mới:
    // - Ưu tiên người có ít ca hơn trong tuần.
    // - Nếu số ca bằng nhau, ưu tiên người có priority 1 (chắc chắn).
    availableStaffSlots.sort((a, b) => {
        if (a.weeklyShiftCount !== b.weeklyShiftCount) {
            return a.weeklyShiftCount - b.weeklyShiftCount; // Ít ca hơn lên trước
        }
        return a.priority - b.priority; // Priority 1 lên trước
    });

    // 5. Thực hiện thuật toán phân công
    const suggestions = [];
    const positionsToFill = [...neededPositions]; // Clone mảng để có thể thay đổi

    for (const slot of availableStaffSlots) {
        if (positionsToFill.length === 0) break; // Dừng nếu đã hết vị trí cần điền

        // Kiểm tra xem slot này đã được phân công chưa (để tránh ghi đè)
        const existingAssignment = suggestions.find(s => s.employeeId === slot.employeeId && s.shiftIndex === slot.shiftIndex);
        if (existingAssignment) continue;

        const position = positionsToFill.shift(); // Lấy và xóa vị trí đầu tiên
        suggestions.push({
            employeeId: slot.employeeId,
            shiftIndex: slot.shiftIndex,
            position: position
        });
    }

    // 6. Cập nhật giao diện
    // Xóa các giá trị cũ trước khi điền đề xuất mới
    document.querySelectorAll(`td[data-date="${date}"] .position-input`).forEach(input => {
        input.value = '';
    });

    suggestions.forEach(suggestion => {
        const input = document.querySelector(`tr[data-employee-id="${suggestion.employeeId}"] td[data-date="${date}"] .position-input[data-shift-index="${suggestion.shiftIndex}"]`);
        if (input && !input.disabled) {
            input.value = suggestion.position;
        }
    });

    window.showToast(`Đã đề xuất ${suggestions.length} vị trí.`, 'success');
}

/**
 * Xử lý tương tác trên các ô có thể chỉnh sửa của trưởng cửa hàng.
 * @param {Event} event 
 */
function handleLeaderCellInteraction(event) {
    const target = event.target;
    const block = target.closest('.shift-registration-block');
    if (!block) return;

    const td = block.closest('td');
    if (!td || !td.dataset.isEditable) return;

    const date = td.dataset.date;

    // Xử lý khi thay đổi lựa chọn ca
    if (target.classList.contains('shift-input')) {
        const priorityBtns = block.querySelectorAll('.priority-btn');
        const timeDisplay = block.querySelector('.shift-time-display');
        const shift = shiftCodes.find(sc => sc.shiftCode === target.value);
        
        if (target.value && shift) {
            priorityBtns.forEach(btn => btn.disabled = false);
            timeDisplay.textContent = shift.timeRange;
        } else {
            target.value = ''; // Xóa nếu nhập mã không hợp lệ
            priorityBtns.forEach(btn => btn.disabled = true);
            timeDisplay.textContent = '';
            // Reset màu của icon
            block.querySelectorAll('.priority-btn i').forEach(icon => {
                icon.classList.remove('text-green-500', 'text-amber-500');
                icon.classList.add('text-gray-300');
            });
        }
    }

    // Xử lý chọn priority
    const priorityBtn = target.closest('.priority-btn');
    if (priorityBtn) {
        const currentPriority = parseInt(priorityBtn.dataset.priority, 10);
        const icon = priorityBtn.querySelector('i');
        
        // Nếu icon đã được chọn, bỏ chọn nó
        if (!icon.classList.contains('text-gray-300')) {
            icon.classList.remove('text-green-500', 'text-amber-500');
            icon.classList.add('text-gray-300');
        } else { // Nếu chưa được chọn, chọn nó và bỏ chọn cái còn lại
            block.querySelectorAll('.priority-btn').forEach(btn => {
                btn.querySelector('i').classList.remove('text-green-500', 'text-amber-500');
                btn.querySelector('i').classList.add('text-gray-300');
            });
            if (currentPriority === 1) icon.classList.add('text-green-500');
            if (currentPriority === 2) icon.classList.add('text-amber-500');
            icon.classList.remove('text-gray-300');
        }
    }

    // Lưu thay đổi ngay lập tức
    saveLeaderAvailabilityForDate(date);
}

/**
 * Lưu đăng ký của trưởng cửa hàng cho một ngày cụ thể vào staff_availability.
 * @param {string} date 
 */
async function saveLeaderAvailabilityForDate(date) {
    const currentUser = window.currentUser;
    const td = document.querySelector(`td[data-date="${date}"][data-is-editable="true"]`);
    if (!td || !currentUser) return;

    const registrations = [];
    td.querySelectorAll('.shift-registration-block').forEach(block => {
        const shiftCode = block.querySelector('.shift-input').value;
        const selectedPriorityBtn = block.querySelector('.priority-btn i:not(.text-gray-300)');
        const priority = selectedPriorityBtn ? parseInt(selectedPriorityBtn.closest('.priority-btn').dataset.priority, 10) : 0;
        registrations.push({ shiftCode, priority });
    });

    const docId = `${date}_${currentUser.id}`;
    const docRef = doc(db, 'staff_availability', docId);

    // Nếu cả 2 ca đều trống, xóa document
    if (registrations.every(reg => !reg.shiftCode)) {
        await deleteDoc(docRef);
    } else {
        const dataToSave = {
            employeeId: currentUser.id,
            employeeName: currentUser.name,
            date: date,
            registrations: registrations,
            updatedAt: serverTimestamp()
        };
        await setDoc(docRef, dataToSave);
    }
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
    viewStartDate = getTomorrow(); // Bắt đầu từ ngày mai
    viewStartDate.setHours(0, 0, 0, 0);

    loadShiftCodes();
    loadWorkPositions(); // Load work positions at initialization
    await fetchInitialData();
    renderAssignmentTable();
    loadWorkAssignmentsForWeek(); // Tải dữ liệu phân công vị trí

    // Event delegation for assign buttons
    const footer = document.getElementById('assignment-table-footer');
    if (footer) {
        footer.addEventListener('click', (event) => {
            if (event.target.classList.contains('assign-day-btn')) {
                handleSaveAssignmentForDay(event);
            } else if (event.target.closest('.suggest-day-btn')) {
                handleSuggestAssignmentForDay(event);
                handleSaveAssignmentForDay(event);
            }
        }, { signal: domController.signal });
    }

    // Event delegation for leader's editable cells
    const body = document.getElementById('assignment-table-body');
    if (body) {
        body.addEventListener('change', handleLeaderCellInteraction, { signal: domController.signal });
        body.addEventListener('click', handleLeaderCellInteraction, { signal: domController.signal });
        // Thêm listener để cập nhật thống kê khi vị trí thay đổi
        body.addEventListener('change', (event) => {
            if (event.target.classList.contains('position-input')) {
                updateEmployeeStats();
            }
        }, { signal: domController.signal });
    }
}

/**
 * Tải và hiển thị các vị trí công việc đã được phân công.
 */
async function loadWorkAssignmentsForWeek() {
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(viewStartDate);
        date.setDate(date.getDate() + i);
        weekDates.push(formatDate(date));
    }

    if (weekDates.length === 0) return;

    const q = query(collection(db, 'work_assignments'), where('__name__', 'in', weekDates));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(docSnap => {
        const date = docSnap.id;
        const data = docSnap.data();
        data.assignments?.forEach(empAssignment => {
            const row = document.querySelector(`tr[data-employee-id="${empAssignment.employeeId}"]`);
            if (!row) return;

            empAssignment.assignments.forEach((as, index) => {
                // Tìm input tương ứng với ca (shiftIndex)
                const input = row.querySelector(`.position-input[data-shift-index="${index}"]`);
                if (input && as.position) {
                    input.value = as.position;
                }
            });
        });
    });

    // Cập nhật thống kê sau khi tải xong
    updateEmployeeStats();
}

/**
 * Cập nhật bảng thống kê cho từng nhân viên.
 */
function updateEmployeeStats() {
    const employeeRows = document.querySelectorAll('#assignment-table-body tr[data-employee-id]');

    employeeRows.forEach(row => {
        const employeeId = row.dataset.employeeId;
        if (!employeeId) return;

        // 1. Đếm số ca đã phân công cho từng vị trí
        const positionCounts = {};
        workPositions.forEach(pos => positionCounts[pos] = 0);
        let totalAssignedShifts = 0;

        const assignedInputs = row.querySelectorAll('.position-input:not([disabled])');
        assignedInputs.forEach(input => {
            const position = input.value.trim();
            if (position && workPositions.includes(position)) {
                positionCounts[position]++;
                totalAssignedShifts++;
            }
        });

        // 2. Cập nhật từng ô thống kê
        workPositions.forEach(pos => {
            const statsCell = row.querySelector(`td[data-position="${pos}"]`);
            if (!statsCell) return;

            const percentageEl = statsCell.querySelector('.stat-percentage');
            const oldPercentage = parseFloat(percentageEl.textContent);
            const newPercentage = totalAssignedShifts > 0 ? (positionCounts[pos] / totalAssignedShifts) * 100 : 0;
            const percentageChange = newPercentage - oldPercentage;

            percentageEl.textContent = `${newPercentage.toFixed(1)}%`;

            if (Math.abs(percentageChange) > 0.01) {
                triggerStatAnimation(statsCell, percentageChange, '%', 1);
            }
        });
    });
}

/**
 * Kích hoạt hiệu ứng animation cho một ô trong bảng thống kê.
 * @param {HTMLElement} cell - Ô (td) cần tạo hiệu ứng.
 * @param {number} change - Giá trị thay đổi (+ hoặc -).
 * @param {string} suffix - Hậu tố hiển thị (ví dụ: '%', ' ca').
 * @param {number} decimalPlaces - Số chữ số thập phân.
 */
function triggerStatAnimation(cell, change, suffix = '%', decimalPlaces = 1) {
    if (!cell) return;

    const animationEl = document.createElement('span');
    const isPositive = change > 0;
    animationEl.textContent = `${isPositive ? '+' : ''}${change.toFixed(decimalPlaces)}${suffix}`;

    // Sử dụng class animation đã có và thêm class màu sắc động
    animationEl.className = `stat-change-animation ${isPositive ? 'text-green-500' : 'text-red-500'}`;

    cell.appendChild(animationEl);

    // Tự động xóa element sau khi animation hoàn tất
    setTimeout(() => animationEl.remove(), 2000);
}
