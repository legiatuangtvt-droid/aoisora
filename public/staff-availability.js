import { db } from './firebase.js';
import { doc, setDoc, getDoc, serverTimestamp, writeBatch, collection, query, where, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let payrollCycle = getPayrollCycle(new Date());
let shiftCodes = [];
let availabilityData = {}; // Dữ liệu đăng ký sẽ được lưu tạm ở đây
/**
 * ==================================================
 * MOCK DATA FOR DEMO
 * ==================================================
 */
const mockCurrentUser = {
    id: 'staff01',
    name: 'Nguyễn Văn A',
    hourlyRate: 1000 // Lương mỗi giờ
};

const mockShiftCodes = [
    { shiftCode: 'V712', timeRange: '06:00 ~ 13:00', duration: 7 },
    { shiftCode: 'V829', timeRange: '14:30 ~ 22:30', duration: 8 }
];
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Lấy chu kỳ lương hiện tại dựa trên một ngày cho trước.
 * @param {Date} date - Ngày để xác định chu kỳ.
 * @returns {{start: Date, end: Date}} - Đối tượng chứa ngày bắt đầu và kết thúc của chu kỳ.
 */
function getPayrollCycle(date) {
    const payrollStartDay = 26;
    let year = date.getFullYear();
    let month = date.getMonth();

    if (date.getDate() < payrollStartDay) {
        month -= 1;
    }
    const start = new Date(year, month, payrollStartDay);
    const end = new Date(year, month + 1, payrollStartDay - 1);
    return { start, end };
}
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
 * Tải 2 mã ca áp dụng cho nhân viên từ mẫu "Test" hoặc dùng mã mặc định.
 */
async function loadApplicableShiftCodes() {
    // TODO: Thay thế bằng logic tải từ Firestore nếu cần
    shiftCodes = mockShiftCodes;
    // Giả lập độ trễ mạng
    return new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * Lọc các tùy chọn trong một datalist dựa trên các ca đã chọn trong cùng một ngày.
 * @param {HTMLDataListElement} datalistElement - Datalist cần lọc.
 * @param {string} selfShiftCode - Mã ca hiện đang được chọn trong input liên kết với datalist này.
 * @param {string} otherShiftCode - Mã ca được chọn trong input *còn lại* của cùng một ngày.
 */
function filterDatalist(datalistElement, selfShiftCode, otherShiftCode) {
    if (!datalistElement) return;
    datalistElement.innerHTML = ''; // Xóa các tùy chọn hiện có

    const otherShift = otherShiftCode ? shiftCodes.find(sc => sc.shiftCode === otherShiftCode) : null;
    let startOther = null, endOther = null;
    if (otherShift) {
        const [startStr, endStr] = otherShift.timeRange.split('~').map(s => s.trim());
        startOther = timeToMinutes(startStr);
        endOther = timeToMinutes(endStr);
    }

    shiftCodes.forEach(potentialShift => {
        // Luôn bao gồm mã ca hiện tại của input này (nếu có)
        if (potentialShift.shiftCode === selfShiftCode) {
            datalistElement.innerHTML += `<option value="${potentialShift.shiftCode}">${potentialShift.timeRange}</option>`;
            return;
        }

        // Nếu không có ca nào khác được chọn, hoặc ca tiềm năng không trùng với ca khác, thì thêm vào.
        if (!otherShift || !otherShiftCode) { // Không có ca khác được chọn, tất cả đều hợp lệ
            datalistElement.innerHTML += `<option value="${potentialShift.shiftCode}">${potentialShift.timeRange}</option>`;
        } else {
            const [startPotentialStr, endPotentialStr] = potentialShift.timeRange.split('~').map(s => s.trim());
            const startPotential = timeToMinutes(startPotentialStr);
            const endPotential = timeToMinutes(endPotentialStr);

            // Kiểm tra chồng chéo: (StartA < EndB) and (StartB < EndA)
            const overlaps = (startPotential < endOther && endPotential > startOther);

            if (!overlaps) {
                datalistElement.innerHTML += `<option value="${potentialShift.shiftCode}">${potentialShift.timeRange}</option>`;
            }
        }
    });
}

/**
 * Tải dữ liệu đăng ký đã có cho tuần đang hiển thị.
 */
async function loadAvailabilityData() {
    // TODO: Thay thế bằng logic tải từ Firestore
    const currentUser = mockCurrentUser;
    const docRef = doc(db, 'staff_availability', `${formatDate(new Date())}_${currentUser.id}`); // Ví dụ
    // const docSnap = await getDoc(docRef);
    // if (docSnap.exists()) { availabilityData = docSnap.data(); }
}

/**
 * Render toàn bộ bảng đăng ký cho giao diện Desktop.
 */
async function renderDesktopView() {
    const tableBody = document.getElementById('availability-table-body');
    const currentDateDisplay = document.getElementById('current-date-display');

    if (!tableBody || !currentDateDisplay) return;

    // Xóa nội dung cũ
    tableBody.innerHTML = '';

    currentDateDisplay.textContent = `Chu kỳ từ ${payrollCycle.start.toLocaleDateString('vi-VN')} đến ${payrollCycle.end.toLocaleDateString('vi-VN')}`;

    const todayString = formatDate(new Date());
    const dayHeaderTemplate = document.getElementById('day-header-template');
    const shiftCellTemplate = document.getElementById('shift-cell-template');

    if (!dayHeaderTemplate || !shiftCellTemplate) {
        console.error("Lỗi: Không tìm thấy 'day-header-template' hoặc 'shift-cell-template' trong DOM.");
        return;
    }

    // Tạo một mảng chứa tất cả các ngày trong chu kỳ
    const allDates = [];
    for (let d = new Date(payrollCycle.start); d <= payrollCycle.end; d.setDate(d.getDate() + 1)) {
        allDates.push(new Date(d));
    }

    // Chia các ngày thành các tuần (7 ngày)
    for (let i = 0; i < allDates.length; i += 7) {
        const weekDates = allDates.slice(i, i + 7);

        const weekHeaderRow = document.createElement('tr');
        const registrationRow = document.createElement('tr');

        weekDates.forEach(date => {
            // Dòng header ngày
            const headerCell = dayHeaderTemplate.content.cloneNode(true);
            const dayName = headerCell.querySelector('.day-name');
            const dateNumber = headerCell.querySelector('.date-number');
            
            dayName.textContent = date.toLocaleDateString('en-US', { weekday: 'short' });
            dateNumber.textContent = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
            if (formatDate(date) === todayString) {
                headerCell.querySelector('th').classList.add('bg-indigo-50', 'text-indigo-700');
            }
            headerCell.querySelector('th').dataset.date = formatDate(date);
            weekHeaderRow.appendChild(headerCell);

            // Dòng ô đăng ký
            const shiftCell = shiftCellTemplate.content.cloneNode(true);
            const td = shiftCell.querySelector('td');
            const dateStr = formatDate(date);
            td.dataset.date = dateStr;

            td.querySelectorAll('.shift-registration-block').forEach(block => {
                const input = block.querySelector('.shift-input');
                const priorityBtn = block.querySelector('.priority-toggle-btn');
                const shiftIndex = block.dataset.shiftIndex;

                input.id = `shift-input-${dateStr}-${shiftIndex}`;

                let optionsHTML = `<option value="">-- Ca ${parseInt(shiftIndex, 10) + 1} --</option>`;
                shiftCodes.forEach(sc => {
                    optionsHTML += `<option value="${sc.shiftCode}">${sc.timeRange}</option>`;
                });
                input.innerHTML = optionsHTML;

                priorityBtn.disabled = true;

                if (dateStr < todayString) {
                    block.classList.add('opacity-50', 'pointer-events-none');
                    input.disabled = true;
                    input.options[0].textContent = '-- Đã khóa --';
                    priorityBtn.disabled = true;
                }
            });
            if (dateStr < todayString) {
                td.classList.add('bg-slate-50');
            }
            registrationRow.appendChild(shiftCell);
        });

        tableBody.appendChild(weekHeaderRow);
        tableBody.appendChild(registrationRow);
    }

    await loadAvailabilityForDesktopView();
}

/**
 * Tải và điền dữ liệu đăng ký đã có cho giao diện Desktop.
 */
async function loadAvailabilityForDesktopView() {
    // TODO: Tải dữ liệu từ Firestore và điền vào các ô input/priority button
    // Ví dụ:
    // const availability = availabilityData[`2025-11-26_${mockCurrentUser.id}`];
}

/**
 * Cập nhật giao diện của các nút ưu tiên.
 * @param {HTMLElement} block - Khối div.shift-registration-block chứa các nút.
 * @param {number} selectedPriority - Mức ưu tiên được chọn (1 hoặc 2).
 * 0 để reset.
 */
function updatePriorityUI(button, priority) {
    if (!button) return;
    const icon = button.querySelector('i');
    if (!icon) return;

    // Reset icon
    icon.classList.remove('fa-circle', 'fa-triangle-exclamation', 'text-green-500', 'text-amber-500');

    if (priority === 1) {
        icon.classList.add('fa-circle', 'text-green-500');
        button.dataset.priority = "1";
        button.title = "Chắc chắn vào ca";
    } else if (priority === 2) {
        icon.classList.add('fa-triangle-exclamation', 'text-amber-500');
        button.dataset.priority = "2";
        button.title = "Có thể vào ca";
    } else { // Trạng thái reset hoặc không chọn
        icon.classList.add('text-gray-300');
        // Mặc định là icon tròn khi reset
        icon.classList.add('fa-circle');
        button.dataset.priority = "1"; // Khi reset, lần click tiếp theo sẽ là prio 1
        button.title = "Chắc chắn vào ca";
    }
}

/**
 * Xử lý sự kiện khi người dùng thay đổi giá trị input hoặc click vào nút ưu tiên.
 */
function handleCellChange(event) {
    const target = event.target; // Có thể là input hoặc button

    // --- Xử lý khi click nút Help (nằm trong <th>) ---
    const helpBtnHeader = target.closest('.help-btn');
    if (helpBtnHeader) {
        const th = helpBtnHeader.closest('th[data-date]');
        if (th) {
            openHelpModal(th.dataset.date);
            return; // Dừng xử lý để tránh xung đột
        }
    }
    
    // --- Xử lý khi tương tác với ô đăng ký (nằm trong <td>) ---
    const registrationBlock = target.closest('.shift-registration-block');
    if (registrationBlock) {
        const td = registrationBlock.closest('td[data-date]');
        if (!td) return;

        // Xử lý khi thay đổi giá trị ca
        if (target.classList.contains('shift-input') && event.type === 'change') {
            const priorityBtn = registrationBlock.querySelector('.priority-toggle-btn');
            // --- LOGIC KIỂM TRA TRÙNG GIỜ ---
            const inputs = td.querySelectorAll('.shift-input');
            const otherInput = Array.from(inputs).find(inp => inp !== target);

            if (otherInput && otherInput.value) {
                const shift1 = shiftCodes.find(sc => sc.shiftCode === target.value);
                const shift2 = shiftCodes.find(sc => sc.shiftCode === otherInput.value);

                if (shift1 && shift2) {
                    const [start1Str, end1Str] = shift1.timeRange.split('~').map(s => s.trim());
                    const [start2Str, end2Str] = shift2.timeRange.split('~').map(s => s.trim());
                    const start1 = timeToMinutes(start1Str);
                    const end1 = timeToMinutes(end1Str);
                    const start2 = timeToMinutes(start2Str);
                    const end2 = timeToMinutes(end2Str);

                    if (start1 < end2 && start2 < end1) {
                        window.showToast('Lỗi: Khung giờ của hai ca bị trùng nhau.', 'error');
                        target.value = ''; // Xóa lựa chọn không hợp lệ
                        // Vô hiệu hóa và reset ưu tiên
                        priorityBtn.disabled = true;
                        updatePriorityUI(priorityBtn, 0);
                        return; // Dừng xử lý thêm
                    }
                }
            }
            // --- KẾT THÚC LOGIC KIỂM TRA ---

            if (target.value) {
                // Kích hoạt nút ưu tiên và đặt mặc định là Prio 1 (icon tròn)
                priorityBtn.disabled = false;
                updatePriorityUI(priorityBtn, 1);
            } else {
                // Vô hiệu hóa và reset ưu tiên nếu không có ca nào được chọn
                priorityBtn.disabled = true;
                updatePriorityUI(priorityBtn, 0); // Reset về trạng thái ban đầu
            }

        }
        return; // Dừng xử lý để tránh xung đột
    }

    // Xử lý chọn priority
    const priorityBtn = target.closest('.priority-toggle-btn');
    if (priorityBtn) {
        const currentPriority = parseInt(priorityBtn.dataset.priority, 10);
        // Chuyển đổi trạng thái: nếu đang là 1 -> 2, nếu là 2 -> 1
        const nextPriority = currentPriority === 1 ? 2 : 1;
        updatePriorityUI(priorityBtn, nextPriority);
    }

    // Xử lý khi click nút Help
    const helpBtn = target.closest('.help-btn');
    const th = target.closest('th[data-date]');
    if (helpBtn && th) {
        openHelpModal(td.dataset.date);
    }
}

/**
 * Xử lý sự kiện khi người dùng focus vào một ô input ca.
 * Mục đích là để lọc datalist trước khi nó được hiển thị.
 */
function handleCellFocus(event) {
    const target = event.target;
    if (!target.classList.contains('shift-input')) return;

    const td = target.closest('td');
    if (!td) return;

    const inputsInDay = Array.from(td.querySelectorAll('.shift-input'));
    const otherInput = inputsInDay.find(inp => inp !== target);

    // Áp dụng lọc cho cả hai datalist trong ngày để đồng bộ
    const targetDatalist = document.getElementById(target.getAttribute('list'));
    const otherDatalist = otherInput ? document.getElementById(otherInput.getAttribute('list')) : null;
    const targetShiftCode = target.value;
    const otherShiftCode = otherInput ? otherInput.value : null;
    if (targetDatalist) filterDatalist(targetDatalist, targetShiftCode, otherShiftCode);
    if (otherDatalist) filterDatalist(otherDatalist, otherShiftCode, targetShiftCode);
}

/**
 * Gửi dữ liệu đăng ký của cả tuần hiển thị lên Firestore.
 */
async function saveWeekAvailability() {
    const saveButton = document.getElementById('save-week-availability-btn');
    const currentUser = mockCurrentUser;
    if (!saveButton) return;

    saveButton.disabled = true;
    saveButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Đang lưu...`;

    // const batch = writeBatch(db); // Loại bỏ dòng code liên quan đến Firebase
    const allCells = document.querySelectorAll('.min-w-full tbody td[data-date]');
    const dataByDate = {};

    // 1. Gom nhóm dữ liệu theo ngày từ DOM
    allCells.forEach(td => {
        const date = td.dataset.date;
        td.querySelectorAll('.shift-registration-block').forEach(block => {
            const shiftIndex = parseInt(block.dataset.shiftIndex, 10);
            const shiftCode = block.querySelector('.shift-input').value;
            const priorityBtn = block.querySelector('.priority-toggle-btn');
            const priority = shiftCode ? parseInt(priorityBtn.dataset.priority, 10) : 0;

        if (!dataByDate[date]) {
            dataByDate[date] = [];
        }
        dataByDate[date][shiftIndex] = { shiftCode, priority };
    });
    });
    // Thu thập dữ liệu giờ help từ tooltip của nút
    allCells.forEach(td => {
        const date = td.dataset.date;
        // Tìm nút help trong header tương ứng với ngày này
        const helpBtn = document.querySelector(`th[data-date="${date}"] .help-btn`);
        if (helpBtn && helpBtn.dataset.startTime && helpBtn.dataset.endTime) {
            if (!dataByDate[date]) dataByDate[date] = []; // Đảm bảo object tồn tại
            dataByDate[date].helpTime = { start: helpBtn.dataset.startTime, end: helpBtn.dataset.endTime };
        }
    });

    // 2. DEMO: Lưu vào biến mockAvailability
    for (const date in dataByDate) {
        const docId = `${date}_${currentUser.id}`;
        const hasRegistration = dataByDate[date]?.some(reg => reg && reg.shiftCode);

        // Kiểm tra xem có đăng ký ca hoặc đăng ký help không
        if (hasRegistration || dataByDate[date].helpTime) {
            mockAvailability[docId] = {
                employeeId: currentUser.id,
                employeeName: currentUser.name,
                date: date,
                registrations: dataByDate[date].filter(item => typeof item === 'object'), // Chỉ lấy các object đăng ký ca
                helpTime: dataByDate[date].helpTime || null
            };
        } else {
            // Nếu không có đăng ký nào, xóa khỏi mock data
            delete mockAvailability[docId];
        }
    }

    // 3. Giả lập lưu thành công
    setTimeout(() => {
        window.showToast('Đã lưu đăng ký tuần thành công!', 'success');
        saveButton.disabled = false;
        saveButton.innerHTML = `<i class="fas fa-save mr-2"></i> Đăng Ký`;
    });
}

/**
 * Mở modal để chọn giờ Help.
 * @param {string} date - Ngày được chọn (YYYY-MM-DD).
 */
function openHelpModal(date) {
    const modal = document.getElementById('help-modal');
    const title = document.getElementById('help-modal-title');
    const dateInput = document.getElementById('help-modal-date');
    const startTimeInput = document.getElementById('help-start-time');
    const endTimeInput = document.getElementById('help-end-time');

    if (!modal || !title || !dateInput || !startTimeInput || !endTimeInput) return;

    // Điền thông tin vào modal
    title.textContent = `Đăng ký giờ hỗ trợ ngày ${new Date(date + 'T00:00:00').toLocaleDateString('vi-VN')}`;
    dateInput.value = date;

    // Lấy giờ đã lưu (nếu có) từ nút help tương ứng
    // Tìm nút help trong header của cột tương ứng
    const helpBtn = document.querySelector(`th[data-date="${date}"] .help-btn`);
    startTimeInput.value = helpBtn?.dataset.startTime || '';
    endTimeInput.value = helpBtn?.dataset.endTime || '';

    // Hiển thị modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => modal.classList.add('show'), 10);
}

/**
 * Đóng modal.
 * @param {string} modalId - ID của modal cần đóng.
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }, 200);
    }
}

/**
 * Cập nhật giao diện nút Help sau khi lưu.
 * @param {HTMLElement} button - Nút help cần cập nhật.
 * @param {string} startTime - Giờ bắt đầu.
 * @param {string} endTime - Giờ kết thúc.
 */
function updateHelpButtonUI(button, startTime, endTime) {
    if (!button) return;

    if (startTime && endTime) {
        button.classList.remove('btn-secondary');
        button.classList.add('btn-success'); // Đổi màu nút để báo hiệu đã đăng ký
        button.title = `Hỗ trợ từ ${startTime} đến ${endTime}`;
        // Lưu giờ vào dataset để dễ truy xuất
        button.dataset.startTime = startTime;
        button.dataset.endTime = endTime;
    } else {
        button.classList.remove('btn-success');
        button.classList.add('btn-secondary');
        button.title = '';
        // Xóa dataset
        delete button.dataset.startTime;
        delete button.dataset.endTime;
    }
}

/**
 * Xử lý việc lưu giờ Help từ modal.
 */
function handleSaveHelpTime() {
    const date = document.getElementById('help-modal-date').value;
    const startTime = document.getElementById('help-start-time').value;
    const endTime = document.getElementById('help-end-time').value;

    if (startTime && endTime && startTime >= endTime) {
        window.showToast('Lỗi: Giờ kết thúc phải sau giờ bắt đầu.', 'error');
        return;
    }

    // --- LOGIC MỚI: KIỂM TRA TRÙNG LẶP VỚI CA CHÍNH ---
    const helpStartMinutes = timeToMinutes(startTime);
    const helpEndMinutes = timeToMinutes(endTime);

    // Tìm các ca chính đã đăng ký trong ngày
    const mainShiftInputs = document.querySelectorAll(`td[data-date="${date}"] .shift-input`);
    for (const input of mainShiftInputs) {
        const shiftCode = input.value;
        if (shiftCode) {
            const shift = shiftCodes.find(sc => sc.shiftCode === shiftCode);
            if (shift) {
                const [shiftStartStr, shiftEndStr] = shift.timeRange.split('~').map(s => s.trim());
                const shiftStartMinutes = timeToMinutes(shiftStartStr);
                const shiftEndMinutes = timeToMinutes(shiftEndStr);

                // Công thức kiểm tra trùng lặp: (StartA < EndB) and (StartB < EndA)
                const overlaps = (helpStartMinutes < shiftEndMinutes && shiftStartMinutes < helpEndMinutes);

                if (overlaps) {
                    window.showToast(`Lỗi: Giờ Help (${startTime} - ${endTime}) bị trùng với ca làm việc chính (${shift.timeRange}).`, 'error');
                    return; // Dừng thực thi
                }
            }
        }
    }
    // --- KẾT THÚC LOGIC KIỂM TRA ---

    // Tìm nút help trong header của cột tương ứng
    const helpBtn = document.querySelector(`th[data-date="${date}"] .help-btn`);
    updateHelpButtonUI(helpBtn, startTime, endTime);
    closeModal('help-modal');
    window.showToast('Đã cập nhật giờ hỗ trợ!', 'success');
}

/**
 * Gắn các event listener cho các ô trong bảng.
 */
function addCellEventListeners() {
    const tableBody = document.getElementById('availability-table-body');
    if (tableBody) {
        // Sử dụng event delegation
        tableBody.addEventListener('click', handleCellChange);
        tableBody.addEventListener('change', handleCellChange); // Đổi từ 'input' sang 'change' cho <select>
        tableBody.addEventListener('focusin', handleCellFocus); // Xử lý khi focus vào input
    }

    // Gắn listener cho các nút trong modal
    document.getElementById('save-help-time-btn')?.addEventListener('click', handleSaveHelpTime);
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.dataset.modalId;
            if (modalId) closeModal(modalId);
        });
    });
}

//#region MOBILE VIEW LOGIC

/**
 * Render toàn bộ giao diện mobile.
 */
function renderMobileView() {
    renderMobileCalendar();
    renderShiftLegend();
    calculateMobileTotals();
    handleDaySelection(); // Chọn ngày hôm nay làm mặc định
}

/**
 * Render lịch tháng cho giao diện mobile.
 */
function renderMobileCalendar() {
    const grid = document.getElementById('mobile-calendar-grid');
    const header = document.getElementById('mobile-month-header');
    if (!grid || !header) return;

    grid.innerHTML = ''; // Xóa lịch cũ
    // Thêm các class flexbox để căn chỉnh các mục con
    header.classList.add('flex', 'justify-between', 'items-center');

    // Cập nhật header để chứa cả tháng/năm và icon bánh răng
    header.innerHTML = `
        <span>${payrollCycle.start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        <button class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-cog"></i>
        </button>
    `;

    // Thêm tiêu đề các ngày trong tuần
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    weekdays.forEach(day => {
        grid.innerHTML += `<div class="calendar-day-header">${day}</div>`;
    });

    // Thêm các ô trống cho ngày đầu tiên của tháng
    let firstDayOfWeek = payrollCycle.start.getDay(); // 0=Sun, 1=Mon
    if (firstDayOfWeek === 0) firstDayOfWeek = 7; // Chuyển Chủ nhật thành 7
    for (let i = 1; i < firstDayOfWeek; i++) {
        grid.innerHTML += '<div></div>';
    }

    // Render các ngày trong chu kỳ
    const todayStr = formatDate(new Date());
    for (let d = new Date(payrollCycle.start); d <= payrollCycle.end; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDate(d);
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.dataset.date = dateStr;

        if (d.getMonth() !== payrollCycle.start.getMonth()) {
            dayCell.classList.add('other-month');
        }
        if (dateStr === todayStr) {
            dayCell.classList.add('today');
        }

        // Lấy ca làm việc cho ngày này
        const availability = availabilityData[`${dateStr}_${mockCurrentUser.id}`];
        const shiftCode = availability?.registrations?.find(r => r.shiftCode)?.shiftCode || '';

        dayCell.innerHTML = `
            <span class="day-number">${d.getDate()}</span>
            <span class="shift-code-mobile">${shiftCode}</span>
        `;
        grid.appendChild(dayCell);
    }
}

/**
 * Tính và hiển thị tổng giờ, tổng lương ước tính.
 */
function calculateMobileTotals() {
    const totalPayEl = document.getElementById('mobile-total-pay');
    if (!totalPayEl) return;

    let totalHours = 0;
    for (let d = new Date(payrollCycle.start); d <= payrollCycle.end; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDate(d);
        const availability = availabilityData[`${dateStr}_${mockCurrentUser.id}`];
        if (availability && availability.registrations) {
            availability.registrations.forEach(reg => {
                if (reg.shiftCode) {
                    const shiftInfo = shiftCodes.find(sc => sc.shiftCode === reg.shiftCode);
                    if (shiftInfo) {
                        totalHours += shiftInfo.duration;
                    }
                }
            });
        }
    }

    const totalPay = totalHours * (mockCurrentUser.hourlyRate || 1000);
    // Ký hiệu Yên Nhật: ¥
    totalPayEl.innerHTML = `¥${totalPay.toLocaleString('ja-JP')} <span class="text-gray-500 font-normal">(${totalHours}h)</span>`;
}

/**
 * Hiển thị chú thích các mã ca.
 */
function renderShiftLegend() {
    const legendBody = document.getElementById('mobile-shift-legend-body');
    if (!legendBody) return;

    legendBody.innerHTML = shiftCodes.map(sc => `
        <div class="font-semibold text-left">${sc.shiftCode}</div>
        <div class="text-right">${sc.timeRange}</div>
    `).join('');
}

/**
 * Xử lý sự kiện khi người dùng chọn một ngày trên lịch mobile.
 * @param {string|null} dateStr - Ngày được chọn (YYYY-MM-DD), hoặc null để chọn ngày hôm nay.
 */
function handleDaySelection(dateStr = null) {
    const grid = document.getElementById('mobile-calendar-grid');
    if (!grid) return;

    const targetDateStr = dateStr || formatDate(new Date());
    const targetCell = grid.querySelector(`.calendar-day[data-date="${targetDateStr}"]`);

    // Bỏ chọn ô cũ
    const currentSelected = grid.querySelector('.selected');
    if (currentSelected) {
        currentSelected.classList.remove('selected');
    }

    if (targetCell) {
        targetCell.classList.add('selected');
        const selectedDate = new Date(targetDateStr + 'T00:00:00');
        const selectedDateDisplay = document.getElementById('mobile-selected-date');
        if (selectedDateDisplay) {
            selectedDateDisplay.textContent = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        }
        // TODO: Tải memo cho ngày được chọn
    }
}

/**
 * Chuyển đổi giao diện giữa Desktop và Mobile.
 */
function toggleView() {
    console.log('toggleView function called.');
    const body = document.body;
    const btn = document.getElementById('view-toggle-btn');
    const icon = btn.querySelector('i');
    const text = btn.querySelector('span');
    const desktopView = document.getElementById('desktop-view');
    const mobileView = document.getElementById('mobile-view');

    body.classList.toggle('mobile-active');
    console.log('Body classList is now:', body.classList.toString());

    if (body.classList.contains('mobile-active')) {
        console.log('Activating mobile view...');
        desktopView.classList.add('hidden');
        mobileView.classList.remove('hidden');
        icon.className = 'fas fa-desktop mr-2';
        text.textContent = 'Desktop View';
        renderMobileView();
    } else {
        console.log('Activating desktop view...');
        desktopView.classList.remove('hidden');
        mobileView.classList.add('hidden');
        icon.className = 'fas fa-mobile-alt mr-2';
        text.textContent = 'Mobile View';
        // renderDesktopView(); // Render lại giao diện desktop nếu cần
    }
}

//#endregion

export async function init() {
    // Trong kiến trúc SPA này, init() được gọi sau khi nội dung trang đã được tải vào DOM.
    // Do đó, không cần chờ 'DOMContentLoaded' nữa và có thể chạy trực tiếp.
    // Logic mới: Kiểm tra tham số 'date' trên URL trước khi chạy init
    const urlParams = new URLSearchParams(window.location.search);
    // Gán mockCurrentUser vào window để các phần khác của app (nếu có) có thể truy cập
    window.currentUser = mockCurrentUser;

    domController = new AbortController();
    const { signal } = domController;

    const dateParam = urlParams.get('date');
    const initialDate = dateParam ? new Date(dateParam + 'T00:00:00') : new Date();
    payrollCycle = getPayrollCycle(initialDate);

    // Tải dữ liệu cần thiết
    await loadApplicableShiftCodes();
    await loadAvailabilityData();

    // Render giao diện mặc định (Desktop) và gắn sự kiện
    await renderDesktopView();
    const toggleBtn = document.getElementById('view-toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleView, { signal });
    }

    // Gắn sự kiện cho lịch mobile
    const mobileGrid = document.getElementById('mobile-calendar-grid');
    if (mobileGrid) {
        mobileGrid.addEventListener('click', (e) => {
            const dayCell = e.target.closest('.calendar-day');
            if (dayCell && dayCell.dataset.date) {
                handleDaySelection(dayCell.dataset.date);
            }
        }, { signal });
    }
}

export function cleanup() {
    if (domController) {
        domController.abort();
    }
}