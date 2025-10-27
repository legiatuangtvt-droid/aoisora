import { db } from './firebase.js';
import { collection, getDocs, query, where, doc, setDoc, serverTimestamp, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let viewStartDate = new Date();
let allEmployeesInStore = [];
let allAvailabilities = [];
let shiftCodes = [];
const SHIFT_CODES_STORAGE_KEY = 'aoisora_shiftCodes';

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    let headerHTML = `<tr class="border-y border-gray-200"><th class="p-2 border-x border-gray-200 bg-slate-50 text-center sticky left-0 z-10">Nhân viên</th>`;
    weekDates.forEach(date => {
        headerHTML += `<th class="p-2 border-x border-gray-200 min-w-[150px] text-center">
            <div class="day-name font-semibold text-gray-700">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div class="date-number text-xs text-gray-500">${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
        </th>`;
    });
    headerHTML += `</tr>`;
    header.innerHTML = headerHTML;

    // Render Footer with Assign Buttons
    let footerHTML = `<tr><td class="p-2 border-x border-gray-200 sticky left-0 z-10"></td>`;
    weekDates.forEach(date => {
        const dateStr = formatDate(date);
        footerHTML += `<td class="p-2 border-x border-gray-200 text-center">
            <button class="assign-day-btn btn btn-indigo btn-sm" data-date="${dateStr}">Phân công</button>
        </td>`;
    });
    footerHTML += `</tr>`;
    footer.innerHTML = footerHTML;

    // Render Body
    if (allEmployeesInStore.length === 0) {
        body.innerHTML = `<tr><td colspan="8" class="text-center p-10 text-gray-500">Cửa hàng này chưa có nhân viên.</td></tr>`;
        return;
    }

    allEmployeesInStore.forEach(employee => {
        const row = document.createElement('tr');
        row.dataset.employeeId = employee.id;
        let rowHTML = `<td class="p-2 border-x border-gray-200 bg-white text-center sticky left-0 z-10 font-semibold">${employee.name}</td>`;

        weekDates.forEach(date => {
            let cellContent = '';
            if (employee.id === window.currentUser.id) {
                cellContent = renderEditableCellForLeader(employee, date);
            } else {
                cellContent = renderReadOnlyCellForStaff(employee, date);
            }
            rowHTML += cellContent;
        });
        row.innerHTML = rowHTML;
        body.appendChild(row);
    });

    document.getElementById('prev-week-btn')?.addEventListener('click', () => changeWeek(-1), { signal: domController.signal });
    document.getElementById('next-week-btn')?.addEventListener('click', () => changeWeek(1), { signal: domController.signal });
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
                <div class="flex-grow">
                    <input list="shift-codes-datalist" class="shift-input text-center form-input form-input-sm w-full" 
                           placeholder="-- Ca ${i + 1} --" value="${reg.shiftCode || ''}">
                    <div class="shift-time-display text-xs text-center text-gray-500 h-4 mt-1">${(shiftCodes.find(sc => sc.shiftCode === reg.shiftCode)?.timeRange) || ''}</div>
                </div>
                <div class="priority-selector flex justify-center items-center gap-4 mt-2">
                    <button class="priority-btn" data-priority="1" title="Chắc chắn vào ca" ${!hasShift ? 'disabled' : ''}>
                        <i class="fas fa-circle text-lg ${priority1Selected ? 'text-green-500' : 'text-gray-300'}"></i>
                    </button>
                    <button class="priority-btn" data-priority="2" title="Có thể vào ca" ${!hasShift ? 'disabled' : ''}>
                        <i class="fas fa-triangle-exclamation text-lg ${priority2Selected ? 'text-amber-500' : 'text-gray-300'}"></i>
                    </button>
                </div>
            </div>
        `;
    }

    return `<td class="p-2 border-x border-gray-200 align-top" data-date="${dateStr}" data-is-editable="true">
                <div class="flex items-start gap-1">${blocksHTML}</div>
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

    const shiftCodeLine = `
        <div class="flex justify-around items-center text-sm font-medium">
            <span class="px-1 ${reg1.shiftCode ? 'text-gray-800' : 'text-gray-400'}">${reg1.shiftCode || '---'}</span>
            <span class="px-1 ${reg2.shiftCode ? 'text-gray-800' : 'text-gray-400'}">${reg2.shiftCode || '---'}</span>
        </div>`;

    // Dòng 1.5: Thời gian ca
    const timeRange1 = shiftCodes.find(sc => sc.shiftCode === reg1.shiftCode)?.timeRange || '&nbsp;';
    const timeRange2 = shiftCodes.find(sc => sc.shiftCode === reg2.shiftCode)?.timeRange || '&nbsp;';
    const shiftTimeLine = `
        <div class="flex justify-around items-center text-xs text-gray-500 h-4">
            <span class="px-1">${timeRange1}</span>
            <span class="px-1">${timeRange2}</span>
        </div>`;

    const priorityIcon1 = reg1.priority === 1 ? '<i class="fas fa-circle text-green-500" title="Chắc chắn"></i>' : (reg1.priority === 2 ? '<i class="fas fa-triangle-exclamation text-amber-500" title="Có thể"></i>' : '<i class="fas fa-circle text-transparent"></i>');
    const priorityIcon2 = reg2.priority === 1 ? '<i class="fas fa-circle text-green-500" title="Chắc chắn"></i>' : (reg2.priority === 2 ? '<i class="fas fa-triangle-exclamation text-amber-500" title="Có thể"></i>' : '<i class="fas fa-circle text-transparent"></i>');
    const priorityLine = `
        <div class="flex justify-around items-center text-xs h-4 mt-1">
            <span>${priorityIcon1}</span>
            <span>${priorityIcon2}</span>
        </div>`;

    const positionInputLine = `
        <div class="mt-2 flex gap-1">
            <input list="work-positions-datalist" class="position-input form-input form-input-sm w-full text-center text-xs ${!reg1.shiftCode ? 'bg-slate-50' : ''}" data-shift-index="0" placeholder="Vị trí 1..." ${!reg1.shiftCode ? 'disabled' : ''}>
            <input list="work-positions-datalist" class="position-input form-input form-input-sm w-full text-center text-xs ${!reg2.shiftCode ? 'bg-slate-50' : ''}" data-shift-index="1" placeholder="Vị trí 2..." ${!reg2.shiftCode ? 'disabled' : ''}>
        </div>`;

    return `<td class="p-2 border-x border-gray-200 align-top" data-date="${dateStr}">
                <div class="flex flex-col gap-1">${shiftCodeLine}${shiftTimeLine}${priorityLine}${positionInputLine}</div>
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
    viewStartDate.setDate(viewStartDate.getDate() - viewStartDate.getDay() + 1); // Bắt đầu từ thứ 2 của tuần hiện tại
    viewStartDate.setHours(0, 0, 0, 0);

    loadShiftCodes();
    await fetchInitialData();
    renderAssignmentTable();
    loadWorkAssignmentsForWeek(); // Tải dữ liệu phân công vị trí

    // Event delegation for assign buttons
    const footer = document.getElementById('assignment-table-footer');
    if (footer) {
        footer.addEventListener('click', (event) => {
            if (event.target.classList.contains('assign-day-btn')) {
                handleSaveAssignmentForDay(event);
            }
        }, { signal: domController.signal });
    }

    // Event delegation for leader's editable cells
    const body = document.getElementById('assignment-table-body');
    if (body) {
        body.addEventListener('change', handleLeaderCellInteraction, { signal: domController.signal });
        body.addEventListener('click', handleLeaderCellInteraction, { signal: domController.signal });
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
            // Logic điền vị trí vào các ô input sẽ được thêm ở đây
        });
    });
}