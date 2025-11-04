import { db } from './firebase.js';
import { collection, getDocs, query, where, doc, setDoc, serverTimestamp, deleteDoc, writeBatch, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let viewStartDate = new Date();
let allEmployeesInStore = [];
let allAvailabilities = [];
let workPositions = []; // To store all possible work positions from datalist
let allRoles = []; // Để lưu trữ danh sách chức vụ
let shiftCodes = [];

//Mock Data:
//1. Mỗi nhân viên chỉ có thể đăng ký 1 trong 2 ca: V812 và V829;
//2. Mỗi nhân viên có xác suất đăng ký số lượng ca mỗi ngày như sau: 2 ca: 60%, 1 ca: 30%, không đăng ký ca nào: 10%;
//3. Mỗi ca đăng ký có xác xuất 3 trạng thái như sau: Chắc chắn vào ca: 70%, có thể vào ca: 30%;
const mockStaffProfiles = [
    // Profile 1: 6 ngày (2 ca), 3 ngày (1 ca), 1 ngày (0 ca)
    {
        "2025-11-26": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-27": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-28": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-29": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-30": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 2 }] },
        "2025-12-01": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-12-02": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: '', priority: 0 }] },
        "2025-12-03": { registrations: [{ shiftCode: 'V829', priority: 2 }, { shiftCode: '', priority: 0 }] },
        "2025-12-04": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: '', priority: 0 }] },
        "2025-12-05": { registrations: [{ shiftCode: '', priority: 0 }, { shiftCode: '', priority: 0 }] },
    },
    // Profile 2: 6 ngày (2 ca), 3 ngày (1 ca), 1 ngày (0 ca) - Thứ tự khác
    {
        "2025-11-26": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-27": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: '', priority: 0 }] },
        "2025-11-28": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-29": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-30": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-12-01": { registrations: [{ shiftCode: 'V829', priority: 2 }, { shiftCode: '', priority: 0 }] },
        "2025-12-02": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 2 }] },
        "2025-12-03": { registrations: [{ shiftCode: '', priority: 0 }, { shiftCode: '', priority: 0 }] },
        "2025-12-04": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-12-05": { registrations: [{ shiftCode: 'V829', priority: 1 }, { shiftCode: '', priority: 0 }] },
    },
    // Profile 3: 6 ngày (2 ca), 3 ngày (1 ca), 1 ngày (0 ca) - Thứ tự khác
    {
        "2025-11-26": { registrations: [{ shiftCode: '', priority: 0 }, { shiftCode: '', priority: 0 }] },
        "2025-11-27": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-28": { registrations: [{ shiftCode: 'V829', priority: 1 }, { shiftCode: '', priority: 0 }] },
        "2025-11-29": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-30": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-12-01": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 2 }] },
        "2025-12-02": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: '', priority: 0 }] },
        "2025-12-03": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-12-04": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-12-05": { registrations: [{ shiftCode: 'V812', priority: 2 }, { shiftCode: '', priority: 0 }] },
    },
    // Profile 4: 6 ngày (2 ca), 3 ngày (1 ca), 1 ngày (0 ca) - Thứ tự khác
    {
        "2025-11-26": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-27": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: '', priority: 0 }] },
        "2025-11-28": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-29": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-30": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-12-01": { registrations: [{ shiftCode: 'V829', priority: 1 }, { shiftCode: '', priority: 0 }] },
        "2025-12-02": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-12-03": { registrations: [{ shiftCode: 'V812', priority: 2 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-12-04": { registrations: [{ shiftCode: '', priority: 0 }, { shiftCode: '', priority: 0 }] },
        "2025-12-05": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: '', priority: 0 }] },
    },
    // Profile 5: 6 ngày (2 ca), 3 ngày (1 ca), 1 ngày (0 ca) - Thứ tự khác
    {
        "2025-11-26": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-27": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-28": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: '', priority: 0 }] },
        "2025-11-29": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-30": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-12-01": { registrations: [{ shiftCode: 'V829', priority: 1 }, { shiftCode: '', priority: 0 }] },
        "2025-12-02": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 2 }] },
        "2025-12-03": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-12-04": { registrations: [{ shiftCode: '', priority: 0 }, { shiftCode: '', priority: 0 }] },
        "2025-12-05": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: '', priority: 0 }] },
    },
    // Profile 6: 6 ngày (2 ca), 3 ngày (1 ca), 1 ngày (0 ca) - Thứ tự khác
    {
        "2025-11-26": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-27": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-28": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: '', priority: 0 }] },
        "2025-11-29": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-11-30": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-12-01": { registrations: [{ shiftCode: 'V829', priority: 1 }, { shiftCode: '', priority: 0 }] },
        "2025-12-02": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 2 }] },
        "2025-12-03": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: 'V829', priority: 1 }] },
        "2025-12-04": { registrations: [{ shiftCode: '', priority: 0 }, { shiftCode: '', priority: 0 }] },
        "2025-12-05": { registrations: [{ shiftCode: 'V812', priority: 1 }, { shiftCode: '', priority: 0 }] },
    }
];

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


/**
 * Lấy ngày bắt đầu chu kỳ lương tiếp theo (mặc định là ngày 26).
 * @returns {Date}
 */
function getNextPayrollStartDate() {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const payrollStartDay = 26;

    let nextPayrollDate;

    if (currentDay < payrollStartDay) {
        // Chu kỳ tiếp theo bắt đầu vào ngày 26 của tháng này
        nextPayrollDate = new Date(currentYear, currentMonth, payrollStartDay);
    } else {
        // Chu kỳ tiếp theo bắt đầu vào ngày 26 của tháng sau
        nextPayrollDate = new Date(currentYear, currentMonth + 1, payrollStartDay);
    }
    return nextPayrollDate;
}

/**
 * Tải danh sách mã ca từ Firestore.
 */
async function loadShiftCodes() {
    const datalist = document.getElementById('shift-codes-datalist');
    if (!datalist) return;

    datalist.innerHTML = ''; // Clear old options

    try {
        const shiftCodesDocRef = doc(db, 'system_configurations', 'shift_codes');
        const shiftCodesSnap = await getDoc(shiftCodesDocRef);
        if (shiftCodesSnap.exists()) {
            shiftCodes = shiftCodesSnap.data().codes || [];
            shiftCodes.forEach(sc => datalist.innerHTML += `<option value="${sc.shiftCode}">${sc.timeRange}</option>`);
        }
    } catch (error) {
        console.error("Lỗi khi tải mã ca từ Firestore:", error);
    }
}

/**
 * Tải danh sách các vị trí công việc từ Firestore.
 */
async function loadWorkPositions() {
    try {
        const querySnapshot = await getDocs(collection(db, 'work_positions'));        
        workPositions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Cập nhật datalist để người dùng có thể nhập liệu
        const datalist = document.getElementById('work-positions-datalist');
        if (datalist) {
            datalist.innerHTML = ''; // Xóa các lựa chọn cũ
            workPositions.forEach(pos => {
                datalist.innerHTML += `<option value="${pos.name}"></option>`;
            });
        }
    } catch (error) {
        console.error("Lỗi khi tải danh sách vị trí công việc:", error);
        window.showToast("Không thể tải danh sách vị trí công việc.", "error");
        workPositions = []; // Đặt lại thành mảng rỗng nếu có lỗi
    }
}

/**
 * Tải danh sách các chức vụ từ Firestore.
 */
async function loadRoles() {
    try {
        const querySnapshot = await getDocs(collection(db, 'roles'));
        allRoles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Lỗi khi tải danh sách chức vụ:", error);
        window.showToast("Không thể tải danh sách chức vụ.", "error");
    }
}

async function fetchInitialData() {
    const currentUser = window.currentUser;
    if (!currentUser || !currentUser.storeId) {
        window.showToast("Không thể xác định cửa hàng của bạn.", "error");
        return;
    }
    await loadRoles(); // Tải danh sách chức vụ

    const employeeQuery = query(collection(db, 'employee'), where("storeId", "==", currentUser.storeId));
    const employeeSnapshot = await getDocs(employeeQuery);
    allEmployeesInStore = employeeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    await fetchAvailabilitiesForWeek();

    // --- LOGIC MỚI: GÁN DỮ LIỆU MÔ PHỎNG CHO NHÂN VIÊN (TRỪ LEADER CAO NHẤT) ---
    let highestLeader = null;
    let maxLevel = -1;

    // 1. Tìm leader có cấp bậc cao nhất trong cửa hàng
    allEmployeesInStore.forEach(emp => {
        const role = allRoles.find(r => r.id === emp.roleId);
        const level = role ? (role.level || 0) : 0;
        if (level > maxLevel) {
            maxLevel = level;
            highestLeader = emp;
        }
    });

    // 2. Lọc ra danh sách nhân viên cần đăng ký ca (tất cả trừ leader cao nhất)
    const employeesToAssign = allEmployeesInStore
        .filter(emp => !highestLeader || emp.id !== highestLeader.id)
        .sort((a, b) => a.name.localeCompare(b.name)); // Sắp xếp để đảm bảo thứ tự gán ổn định

    // 3. Chỉ lấy số lượng nhân viên bằng số lượng profile có sẵn
    const limitedEmployees = employeesToAssign.slice(0, mockStaffProfiles.length);

    const newMockAvailabilities = [];
    limitedEmployees.forEach((employee, index) => {
        const profile = mockStaffProfiles[index]; // Gán profile tương ứng
        for (const date in profile) {
            newMockAvailabilities.push({
                employeeId: employee.id,
                date: date,
                ...profile[date] // Sao chép cả registrations và helpTime
            });
        }
    });
    // Ghi đè allAvailabilities bằng dữ liệu mô phỏng vừa tạo
    allAvailabilities = newMockAvailabilities;
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

    // Firestore giới hạn truy vấn 'in' với tối đa 30 giá trị.
    // Chúng ta cần chia danh sách employeeIds thành các lô nhỏ hơn (chunks).
    // Đồng thời, Firestore chỉ cho phép MỘT mệnh đề 'in' trên mỗi truy vấn.
    // Do đó, chúng ta sẽ chia employeeIds và lặp qua từng ngày.
    const CHUNK_SIZE = 30;
    const employeeIdChunks = [];
    for (let i = 0; i < employeeIds.length; i += CHUNK_SIZE) {
        employeeIdChunks.push(employeeIds.slice(i, i + CHUNK_SIZE));
    }

    // Tạo một mảng các promise. Mỗi promise sẽ là một truy vấn.
    const promises = [];

    // Lặp qua từng lô employeeId
    for (const chunk of employeeIdChunks) {
        // Lặp qua từng ngày trong tuần
        for (const date of weekDates) {
            const availabilityQuery = query(collection(db, 'staff_availability'),
                where("employeeId", "in", chunk),
                where("date", "==", date) // Chỉ sử dụng MỘT mệnh đề 'in' và một mệnh đề '=='
            );
            promises.push(getDocs(availabilityQuery));
        }
    }

    // Thực thi tất cả các truy vấn song song và gộp kết quả.
    try {
        const snapshots = await Promise.all(promises);
        const results = [];
        snapshots.forEach(snapshot => {
            snapshot.docs.forEach(doc => results.push(doc.data()));
        });
        allAvailabilities = results;
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu đăng ký ca làm việc:", error);
        window.showToast("Không thể tải dữ liệu đăng ký ca.", "error");
        allAvailabilities = [];
    }
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
        headerHTML += `<th class="p-1 border-x border-gray-200 min-w-[110px] text-center">
            <div class="day-name font-semibold text-gray-700">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div class="date-number text-xs text-gray-500">${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
        </th>`;
    });
    // Thêm các cột header cho từng vị trí công việc
    const positionHeaders = workPositions.map(pos => `
        <div class="flex flex-col items-center justify-center p-1">
            <div class="text-xs font-semibold">${pos.name}</div>
            <div class="text-[10px] text-slate-500">(${pos.balance}%)</div>
        </div>
    `).join('');    
    
    const gridStyle = `grid-template-columns: repeat(${workPositions.length || 1}, minmax(0, 1fr));`; // Dùng || 1 để tránh lỗi repeat(0)
    
    headerHTML += `<th class="p-0 border-x border-gray-200 bg-slate-50 sticky right-0 z-10 min-w-[300px]">
                        <div class="grid divide-x divide-gray-200 h-full" style="${gridStyle}">${positionHeaders}</div>
                   </th>`;
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
    footerHTML += `<td class="p-1 border-x border-gray-200 bg-slate-50 sticky right-0 z-10 min-w-[300px]"></td>`;
    footerHTML += `</tr>`;
    footer.innerHTML = footerHTML;

    // Render Body
    if (allEmployeesInStore.length === 0) {
        body.innerHTML = `<tr><td colspan="${8 + workPositions.length}" class="text-center p-10 text-gray-500">Cửa hàng này chưa có nhân viên.</td></tr>`;
        return;
    }

    // Sắp xếp lại danh sách nhân viên theo thứ tự: SI -> G3 -> G2 -> Staff có đăng ký -> Staff không đăng ký
    const rolePriority = {
        'STORE_INCHARGE': 1,
        'STORE_LEADER_G3': 2,
        'STORE_LEADER_G2': 3,
        'STAFF': 4
    };

    const getRolePriority = (employee) => rolePriority[employee.roleId] || 99; // 99 cho các vai trò khác

    const sortedEmployees = [...allEmployeesInStore].sort((a, b) => {
        const priorityA = getRolePriority(a);
        const priorityB = getRolePriority(b);

        // 1. Sắp xếp theo chức vụ
        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }

        // 2. Nếu cùng là STAFF, sắp xếp theo tình trạng đăng ký
        if (priorityA === 4) { // Cả hai đều là STAFF
            const hasAvailabilityA = allAvailabilities.some(avail => avail.employeeId === a.id && avail.registrations.some(reg => reg.shiftCode));
            const hasAvailabilityB = allAvailabilities.some(avail => avail.employeeId === b.id && avail.registrations.some(reg => reg.shiftCode));
            if (hasAvailabilityA !== hasAvailabilityB) {
                return hasAvailabilityB - hasAvailabilityA; // true (1) sẽ đứng trước false (0)
            }
        }

        // 3. Nếu các điều kiện trên bằng nhau, sắp xếp theo tên
        return a.name.localeCompare(b.name);
    });

    sortedEmployees.forEach(employee => {
        const row = document.createElement('tr');
        const role = allRoles.find(r => r.id === employee.roleId);
        row.dataset.employeeId = employee.id;
        let rowHTML = `
            <td class="p-1 border-x border-gray-200 bg-white text-center sticky left-0 z-10">
                <div class="font-semibold text-sm">${employee.name}</div>
                <div class="text-xs text-gray-500" title="${role?.name || ''}">${role?.name || employee.roleId || ''}</div>
            </td>
        `;

        weekDates.forEach(date => { rowHTML += renderCellContent(employee, date); });

        // Thêm ô thống kê vào cuối mỗi hàng
        const statCells = workPositions.map(pos => `
            <div class="p-1 align-middle text-center relative bg-white h-full flex flex-col justify-center" data-position-name="${pos.name}">
                            <span class="stat-percentage text-sm font-semibold text-gray-700">0.0%</span>
            </div>
        `).join('');
        rowHTML += `<td class="p-0 border-x border-gray-200 sticky right-0 z-10 bg-white min-w-[300px]">
                        <div class="grid divide-x divide-gray-200 h-full" style="${gridStyle}">${statCells}</div>
                    </td>`;

        row.innerHTML = rowHTML;
        body.appendChild(row);
    });
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

    // Lấy thông tin giờ help và tạo khối HTML trước vòng lặp
    const helpTime = availability?.helpTime;
    const helpTimeRange = helpTime ? `${helpTime.start} - ${helpTime.end}` : '';
    const helpBlockHTML = `
        <div class="flex-1 text-center text-xs p-1 border border-dashed border-slate-300 rounded-md bg-slate-50">
            <div class="font-semibold text-slate-700">${helpTimeRange || '---'}</div>
            <div class="mt-1 text-slate-500">${helpTime ? '<i class="fas fa-hands-helping"></i>' : ''}</div>
        </div>`;

    let blocksHTML = '';
    for (let i = 0; i < 2; i++) {
        const reg = registrations[i] || {};
        const hasShift = !!reg.shiftCode;
        const priority1Selected = reg.priority === 1;
        const priority2Selected = reg.priority === 2;

        // Lọc ra 2 mã ca V812 và V829 để tạo options cho select
        const leaderShiftOptions = shiftCodes
            .filter(sc => ['V812', 'V829'].includes(sc.shiftCode))
            .map(sc => `<option value="${sc.shiftCode}" ${reg.shiftCode === sc.shiftCode ? 'selected' : ''}>${sc.shiftCode}</option>`)
            .join('');

        blocksHTML += `
            <div class="shift-registration-block flex-1" data-shift-index="${i}">
                <div class="flex-grow space-y-1">
                    <select class="shift-input text-center form-select form-select-sm w-full text-xs">
                        <option value="">-- Ca ${i + 1} --</option>
                        ${leaderShiftOptions}
                    </select>
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
    
    const helpTime = availability?.helpTime;
    const helpTimeRange = helpTime ? `${helpTime.start} - ${helpTime.end}` : '';
    const priorityIcon2 = reg2.priority === 1 ? '<i class="fas fa-circle text-green-500" title="Chắc chắn"></i>' : (reg2.priority === 2 ? '<i class="fas fa-triangle-exclamation text-amber-500" title="Có thể"></i>' : '<i class="fas fa-circle text-transparent"></i>');
    
    const shiftInfoHTML = `
        <div class="flex items-start gap-1 w-full">
            <!-- Cột Ca 1 -->
            <div class="flex-1 text-center text-xs">
                <div class="font-medium ${reg1.shiftCode ? 'text-gray-800' : 'text-gray-400'}">${reg1.shiftCode || '---'}</div>
                <div class="text-gray-500 text-[10px] h-4">${timeRange1}</div>
                <div class="h-4">${priorityIcon1}</div>
            </div>
            <!-- Cột Ca 2 -->
            <div class="flex-1 text-center text-xs">
                <div class="font-medium ${reg2.shiftCode ? 'text-gray-800' : 'text-gray-400'}">${reg2.shiftCode || '---'}</div>
                <div class="text-gray-500 text-[10px] h-4">${timeRange2}</div>
                <div class="h-4">${priorityIcon2}</div>
            </div>
        </div>
    `;

    // Vô hiệu hóa input cho các ngày trong quá khứ
    const todayStr = formatDate(new Date());
    const isPastDate = dateStr < todayStr;
    const disabledAttr = isPastDate ? 'disabled' : '';
    
    // Lọc danh sách vị trí công việc. Nếu là STAFF, loại bỏ vị trí 'LEADER'.
    const isStaff = employee.roleId === 'STAFF';
    const filteredWorkPositions = isStaff
        ? workPositions.filter(pos => pos.id !== 'LEADER') // Nếu là STAFF, ẩn vị trí LEADER
        : workPositions; // Các vai trò khác (Leader) hiển thị tất cả vị trí

    const workPositionOptions = filteredWorkPositions.map(pos => `<option value="${pos.id}">${pos.name}</option>`).join('');

    // Thay thế input bằng select
    const positionSelectLine = `
        <div class="mt-1 flex gap-1">
            <select class="position-input form-select form-select-sm w-full text-center text-xs ${!reg1.shiftCode || isPastDate ? 'bg-slate-50' : ''}" data-shift-index="0" ${!reg1.shiftCode ? 'disabled' : ''} ${disabledAttr}>
                <option value="">-- Vị trí 1 --</option>
                ${workPositionOptions}
            </select>
            <select class="position-input form-select form-select-sm w-full text-center text-xs ${!reg2.shiftCode || isPastDate ? 'bg-slate-50' : ''}" data-shift-index="1" ${!reg2.shiftCode ? 'disabled' : ''} ${disabledAttr}>
                <option value="">-- Vị trí 2 --</option>
                ${workPositionOptions}
            </select>
        </div>`;

    return `<td class="p-1 border-x border-gray-200 align-top" data-date="${dateStr}">
                <div class="flex flex-col gap-1">${shiftInfoHTML}${positionSelectLine}</div>
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

    const batch = writeBatch(db);
    const currentUser = window.currentUser;

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

        // Bỏ qua nếu là trưởng cửa hàng (không có input) hoặc ngày trong quá khứ
        if (employee.id === currentUser.id || (positionInputs.length > 0 && positionInputs[0].disabled)) {
            continue;
        }


        const employeeAssignments = [];

        for (let i = 0; i < 2; i++) {
            const reg = registrations[i] || {};
            const input = Array.from(positionInputs).find(inp => inp.dataset.shiftIndex == i);
            const positionId = input ? input.value : ''; // Lấy thẳng ID từ value của select

            if (reg.shiftCode) {
                if (!positionId) {
                    isValid = false;
                    input.classList.add('border-red-500', 'ring-red-500');
                    window.showToast(`Vui lòng phân công vị trí cho ${employee.name} (Ca ${i + 1})`, 'warning');
                } else {
                    input.classList.remove('border-red-500', 'ring-red-500');
                    employeeAssignments.push({
                        shiftCode: reg.shiftCode,
                        priority: reg.priority,
                        position: positionId,
                        // Thêm thông tin để tìm document schedule
                        shiftIndex: i 
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
        // Lấy tất cả các lịch trình của cửa hàng trong ngày để cập nhật
        const scheduleQuery = query(collection(db, 'schedules'), where('storeId', '==', currentUser.storeId), where('date', '==', date));
        const scheduleSnapshot = await getDocs(scheduleQuery);
        const existingSchedules = scheduleSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        for (const empAssignment of assignments) {
            for (const as of empAssignment.assignments) {
                // Tìm lịch trình hiện có khớp với nhân viên và ca làm việc
                // Logic này giả định một nhân viên chỉ có một ca trong ngày. Cần điều chỉnh nếu phức tạp hơn.
                const scheduleDoc = existingSchedules.find(s => s.employeeId === empAssignment.employeeId && s.shift === as.shiftCode);

                if (scheduleDoc) {
                    // Nếu tìm thấy, cập nhật vị trí
                    const scheduleRef = doc(db, 'schedules', scheduleDoc.id);
                    batch.update(scheduleRef, { positionId: as.position });
                } else {
                    // Nếu không tìm thấy, tạo lịch trình mới
                    const newScheduleRef = doc(collection(db, 'schedules'));
                    batch.set(newScheduleRef, {
                        date: date,
                        employeeId: empAssignment.employeeId,
                        storeId: currentUser.storeId,
                        shift: as.shiftCode,
                        positionId: as.position,
                        tasks: [] // Mặc định không có task khi tạo từ trang này
                    });
                }
            }
        }
        await batch.commit();
        window.showToast(`Đã lưu phân công cho ngày ${date}`, 'success');
        updateEmployeeStats(); // Cập nhật thống kê sau khi lưu thành công

    } catch (error) {
        console.error("Lỗi khi lưu phân công:", error);
        window.showToast("Đã xảy ra lỗi khi lưu phân công.", "error");
    } finally {
        button.disabled = false;
        button.textContent = 'Phân công';
    }

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

    // 1. Tạo model công việc dựa trên tỷ lệ balance và tổng số ca có sẵn
    const totalAvailableShifts = availableStaffSlots.length;
    if (totalAvailableShifts === 0) {
        window.showToast('Không có nhân viên nào đăng ký ca trong ngày này.', 'info');
        return;
    }

    const neededPositions = [];
    const percentages = workPositions.map(p => p.balance / 100);
    const counts = percentages.map(p => Math.floor(totalAvailableShifts * p));
    let remainder = totalAvailableShifts - counts.reduce((a, b) => a + b, 0);

    // Phân bổ phần dư cho các vị trí có phần thập phân lớn nhất để đảm bảo tổng số vị trí khớp với tổng số ca
    const remainders = percentages.map((p, i) => (totalAvailableShifts * p) - counts[i]);
    while (remainder > 0) {
        let maxIdx = -1;
        let maxRem = -1;
        for (let i = 0; i < remainders.length; i++) {
            if (remainders[i] > maxRem) {
                maxRem = remainders[i];
                maxIdx = i;
            }
        }
        if (maxIdx !== -1) {
            counts[maxIdx]++;
            remainders[maxIdx] = -1; // Đánh dấu đã sử dụng
            remainder--;
        } else break; // Không tìm thấy, thoát vòng lặp
    }

    counts.forEach((count, index) => {
        for (let i = 0; i < count; i++) neededPositions.push(workPositions[index].name);
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

    // Cập nhật lại bảng thống kê dựa trên các giá trị vừa đề xuất
    updateEmployeeStats();
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
    await fetchAvailabilitiesForWeek(); // Tải dữ liệu đăng ký ca
    renderAssignmentTable();
    await loadWorkAssignmentsForWeek(); // Tải lại dữ liệu phân công vị trí cho tuần mới
}

export function cleanup() {
    if (domController) {
        domController.abort();
        domController = null;
    }
}

export async function init() {
    domController = new AbortController();
    viewStartDate = getNextPayrollStartDate(); // Bắt đầu từ ngày 26 kế tiếp
    viewStartDate.setHours(0, 0, 0, 0);

    await loadShiftCodes();
    await loadWorkPositions(); // Load work positions at initialization
    await fetchInitialData();
    renderAssignmentTable();
    await loadWorkAssignmentsForWeek(); // Tải dữ liệu phân công vị trí

    // Gắn sự kiện cho nút điều hướng tuần một lần duy nhất
    document.getElementById('prev-week-btn')?.addEventListener('click', () => changeWeek(-1), { signal: domController.signal });
    document.getElementById('next-week-btn')?.addEventListener('click', () => changeWeek(1), { signal: domController.signal });

    // Event delegation for assign buttons
    const footer = document.getElementById('assignment-table-footer');
    if (footer) {
        footer.addEventListener('click', (event) => {
            if (event.target.classList.contains('assign-day-btn')) {
                handleSaveAssignmentForDay(event);
            } else if (event.target.closest('.suggest-day-btn')) {
                handleSuggestAssignmentForDay(event); // Chỉ đề xuất, không lưu
            }
        });
    }

    // Event delegation for leader's editable cells
    const body = document.getElementById('assignment-table-body');
    if (body) {
        body.addEventListener('change', handleLeaderCellInteraction);
        body.addEventListener('click', handleLeaderCellInteraction);
        // Thêm listener để cập nhật thống kê khi vị trí thay đổi
        body.addEventListener('change', (event) => {
            if (event.target.classList.contains('position-input')) {
                updateEmployeeStats();
            }
        });
    }
}

/**
 * Tải và hiển thị các vị trí công việc đã được phân công.
 */
async function loadWorkAssignmentsForWeek() {
    const currentUser = window.currentUser;
    if (!currentUser || !currentUser.storeId) return;

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(viewStartDate);
        date.setDate(date.getDate() + i);
        weekDates.push(formatDate(date));
    }
    if (weekDates.length === 0) return;

    // Truy vấn collection 'schedules' thay vì 'work_assignments'
    const q = query(
        collection(db, 'schedules'),
        where('storeId', '==', currentUser.storeId),
        where('date', 'in', weekDates)
    );
    const querySnapshot = await getDocs(q);

    const schedulesByEmployeeAndDate = new Map();
    querySnapshot.forEach(doc => {
        const schedule = doc.data();
        const key = `${schedule.employeeId}_${schedule.date}`;
        if (!schedulesByEmployeeAndDate.has(key)) {
            schedulesByEmployeeAndDate.set(key, []);
        }
        schedulesByEmployeeAndDate.get(key).push(schedule);
    });

    // Cập nhật giao diện
    allEmployeesInStore.forEach(employee => {
        const row = document.querySelector(`tr[data-employee-id="${employee.id}"]`);
        if (!row) return;

        weekDates.forEach(date => {
            const schedules = schedulesByEmployeeAndDate.get(`${employee.id}_${date}`);
            if (schedules) {
                schedules.forEach((schedule, index) => {
                    const input = row.querySelector(`td[data-date="${date}"] .position-input[data-shift-index="${index}"]`);
                    // Gán thẳng positionId vào value của select
                    if (input && schedule.positionId) {
                        input.value = schedule.positionId;
                    }
                })
            }
        });
    });

    // Cập nhật thống kê sau khi tải xong
    updateEmployeeStats();
}

/**
 * Tính toán và cập nhật bảng thống kê tỷ lệ vị trí công việc (theo giờ) cho từng nhân viên.
 * Phạm vi tính toán là 2 tháng (1 tháng trước và 1 tháng sau ngày hiện tại).
 */
async function updateEmployeeStats() {
    const currentUser = window.currentUser;
    if (!currentUser || !currentUser.storeId) {
        console.warn("Không thể xác định cửa hàng của người dùng để cập nhật thống kê.");
        return;
    }

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);

    // 1. Lấy dữ liệu lịch trình của cửa hàng hiện tại trong khoảng thời gian 2 tháng
    const q = query(collection(db, 'schedules'), 
        where('storeId', '==', currentUser.storeId),
        where('date', '>=', startDateStr), 
        where('date', '<=', endDateStr));
    const querySnapshot = await getDocs(q);

    // 2. Xử lý dữ liệu và tính toán số lượng cho mỗi nhân viên
    const employeePositionHours = new Map(); // Map<employeeId, Map<positionName, totalHours>>

    querySnapshot.forEach(doc => {
        const schedule = doc.data();
        const { employeeId, positionId, shift } = schedule;

        if (!employeeId || !positionId || !shift) return;

        // Tìm thông tin ca làm để lấy số giờ (duration)
        const shiftInfo = shiftCodes.find(sc => sc.shiftCode === shift);
        if (!shiftInfo || !shiftInfo.duration) return; // Bỏ qua nếu không tìm thấy ca hoặc ca không có số giờ

        // Tìm tên vị trí từ ID
        const positionInfo = workPositions.find(p => p.id === positionId);
        if (!positionInfo) return;
        const positionName = positionInfo.name;

        if (!employeePositionHours.has(employeeId)) {
            const positionMap = new Map();
            workPositions.forEach(p => positionMap.set(p.name, 0));
            employeePositionHours.set(employeeId, positionMap);
        }

        const currentHoursMap = employeePositionHours.get(employeeId);
        if (currentHoursMap.has(positionName)) {
            currentHoursMap.set(positionName, currentHoursMap.get(positionName) + shiftInfo.duration);
        }
    });

    const employeeRows = document.querySelectorAll('#assignment-table-body tr[data-employee-id]');
    employeeRows.forEach(row => {
        const employeeId = row.dataset.employeeId;
        const positionHours = employeePositionHours.get(employeeId);

        // Nếu không có dữ liệu giờ làm, coi như tổng giờ là 0
        const totalAssignedHours = positionHours ? Array.from(positionHours.values()).reduce((sum, hours) => sum + hours, 0) : 0;

        workPositions.forEach(pos => {
            const statsCell = row.querySelector(`div[data-position-name="${pos.name}"]`);
            if (!statsCell) return;

            // Lấy giờ làm cho vị trí, nếu không có thì là 0
            const hoursForPosition = positionHours ? (positionHours.get(pos.name) || 0) : 0;
            const percentage = totalAssignedHours > 0 ? (hoursForPosition / totalAssignedHours) * 100 : 0;
            const percentageSpan = statsCell.querySelector('.stat-percentage');
            percentageSpan.textContent = `${percentage.toFixed(1)}%`;

            const balancePercentage = pos.balance || 0;
            // Xóa các lớp màu cũ trước khi thêm lớp mới
            percentageSpan.classList.remove('text-red-600', 'text-blue-600', 'text-green-600', 'text-gray-700');

            // Sử dụng một epsilon rất nhỏ chỉ để xử lý sai số dấu phẩy động khi so sánh bằng nhau.
            const epsilon = 0.00001;

            // Logic so sánh chính xác theo yêu cầu
            if (Math.abs(percentage - balancePercentage) < epsilon) {
                // Coi là bằng nhau nếu chênh lệch cực nhỏ
                percentageSpan.classList.add('text-green-600'); // Bằng -> màu xanh lá cây
            } else if (percentage > balancePercentage) {
                percentageSpan.classList.add('text-red-600'); // Lớn hơn -> màu đỏ
            } else { // percentage < balancePercentage
                percentageSpan.classList.add('text-blue-600'); // Nhỏ hơn -> màu xanh dương
            }
        });
    });
}

/**
 * Kích hoạt hiệu ứng animation cho một ô trong bảng thống kê.
 * @param {HTMLElement} cell - Ô (td) cần tạo hiệu ứng.
 */
function triggerStatAnimation(cell) {
    if (!cell) return;

    const animationEl = document.createElement('span');
    animationEl.className = 'stat-change-animation';
    animationEl.textContent = '●'; // Dùng một ký tự đơn giản để chỉ báo sự thay đổi

    cell.appendChild(animationEl);

    // Tự động xóa element sau khi animation hoàn tất
    setTimeout(() => animationEl.remove(), 1000); // Giảm thời gian animation
}
