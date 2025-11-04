// import { db } from './firebase.js';
// import { doc, setDoc, getDoc, serverTimestamp, writeBatch, collection, query, where, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let viewStartDate = new Date(); // Sẽ được đặt lại thành ngày mai
let shiftCodes = [];

/**
 * ==================================================
 * MOCK DATA FOR DEMO
 * ==================================================
 */
const mockCurrentUser = {
    id: 'staff01',
    name: 'Nguyễn Văn A'
};

const mockShiftCodes = [
    { shiftCode: 'V712', timeRange: '06:00 ~ 13:00', duration: 7 },
    { shiftCode: 'V829', timeRange: '14:30 ~ 22:30', duration: 8 }
];

let mockAvailability = {}; // Dữ liệu đăng ký sẽ được lưu tạm ở đây

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
 * Lấy ngày bắt đầu chu kỳ lương tiếp theo (ngày 26).
 * @returns {Date} - Ngày bắt đầu chu kỳ lương tiếp theo.
 */
function getTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
}

function getNextPayrollStartDate() {
    const today = new Date();
    const payrollStartDay = 26; // Ngày bắt đầu chu kỳ lương
    let startDate = new Date(today.getFullYear(), today.getMonth(), payrollStartDay);
    return startDate;
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
    // DEMO: Sử dụng dữ liệu giả
    console.log("DEMO: Loading mock shift codes.");
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
 * Render toàn bộ bảng đăng ký cho tuần hiện tại.
 */
async function renderWeekView() {
    const tableBody = document.getElementById('availability-table-body');
    const currentDateDisplay = document.getElementById('current-date-display');

    if (!tableBody || !currentDateDisplay) return;

    // Xóa nội dung cũ
    tableBody.innerHTML = '';

    const allDates = [];
    const totalDays = 30; // Hiển thị 30 ngày
    for (let i = 0; i < totalDays; i++) {
        const date = new Date(viewStartDate);
        date.setDate(date.getDate() + i);
        allDates.push(date);
    }

    const firstDay = allDates[0];
    const lastDay = allDates[allDates.length - 1];
    currentDateDisplay.textContent = `Chu kỳ từ ${firstDay.toLocaleDateString('vi-VN')} đến ${lastDay.toLocaleDateString('vi-VN')}`;

    // Vô hiệu hóa nút lùi nếu tuần hiện tại chứa ngày mai
    const prevWeekBtn = document.getElementById('prev-week-btn');
    if (prevWeekBtn) {
        const tomorrow = getTomorrow();
        prevWeekBtn.disabled = firstDay <= tomorrow;
    }

    const todayString = formatDate(new Date());
    // Tạo các ô
    const dayHeaderTemplate = document.getElementById('day-header-template');
    const shiftCellTemplate = document.getElementById('shift-cell-template');

    if (!dayHeaderTemplate || !shiftCellTemplate) {
        console.error("Lỗi: Không tìm thấy 'day-header-template' hoặc 'shift-cell-template' trong DOM. Vui lòng kiểm tra file HTML.");
        registrationRow.innerHTML = `<tr><td colspan="7" class="text-center p-10 text-red-500">Lỗi giao diện: Template không tồn tại.</td></tr>`;
        return;
    }

    // Chia 30 ngày thành các tuần (mỗi tuần 7 ngày)
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
            weekHeaderRow.appendChild(headerCell);

            // Dòng ô đăng ký
            const shiftCell = shiftCellTemplate.content.cloneNode(true);
            const td = shiftCell.querySelector('td');
            const dateStr = formatDate(date);
            td.dataset.date = dateStr;

            // Lặp qua 2 khối đăng ký trong template
            td.querySelectorAll('.shift-registration-block').forEach(block => {
                const input = block.querySelector('.shift-input');
                const priorityBtn = block.querySelector('.priority-toggle-btn');
                const shiftIndex = block.dataset.shiftIndex;

                input.id = `shift-input-${dateStr}-${shiftIndex}`;

                // Tạo các tùy chọn cho select dropdown
                let optionsHTML = `<option value="">-- Ca ${parseInt(shiftIndex, 10) + 1} --</option>`;
                shiftCodes.forEach(sc => {
                    optionsHTML += `<option value="${sc.shiftCode}">${sc.timeRange}</option>`;
                });
                input.innerHTML = optionsHTML;

                priorityBtn.disabled = true;

                if (dateStr <= todayString) {
                    block.classList.add('opacity-50', 'pointer-events-none');
                    input.disabled = true;
                    // Thay đổi option đầu tiên thành "Đã khóa"
                    input.options[0].textContent = '-- Đã khóa --';
                    priorityBtn.disabled = true;
                }
            });
            if (dateStr <= todayString) {
                td.classList.add('bg-slate-50');
            }
            registrationRow.appendChild(shiftCell);
        });

        tableBody.appendChild(weekHeaderRow);
        tableBody.appendChild(registrationRow);
    }

    await loadAvailabilityForWeek(allDates);
    addCellEventListeners();
}

/**
 * Tải dữ liệu đăng ký đã có cho tuần đang hiển thị.
 * @param {Date[]} weekDates - Mảng các đối tượng Date trong tuần.
 */
async function loadAvailabilityForWeek(weekDates) {
    // DEMO: Đọc từ dữ liệu giả
    console.log("DEMO: Loading availability from mock data.");
    const currentUser = mockCurrentUser;

    weekDates.forEach(dateObj => {
        const dateStr = formatDate(dateObj);
        const docId = `${dateStr}_${currentUser.id}`;
        const data = mockAvailability[docId];

        if (data) {
            const registrations = data.registrations || [];
            registrations.forEach((reg, index) => {
                const block = document.querySelector(`td[data-date="${dateStr}"] .shift-registration-block[data-shift-index="${index}"]`);
                if (block) {
                    const input = block.querySelector('.shift-input');                    
                    const priorityBtn = block.querySelector('.priority-toggle-btn');

                    if (reg.shiftCode) {
                        input.value = reg.shiftCode;
                        priorityBtn.disabled = false;
                    }

                    // Cập nhật giao diện nút ưu tiên dựa trên dữ liệu đã lưu
                    updatePriorityUI(priorityBtn, reg.priority || 0);
                }
            });

            // Tải và hiển thị giờ help đã lưu
            if (data.helpTime) {
                // Tìm nút help trong header của cột tương ứng
                const helpBtn = document.querySelector(`th[data-date="${dateStr}"] .help-btn`);
                if (helpBtn) {
                    updateHelpButtonUI(helpBtn, data.helpTime.start, data.helpTime.end);
                }
            }
        }
    });
    // Giả lập độ trễ mạng
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
    const block = target.closest('.shift-registration-block');
    if (!block) return;

    const td = block.closest('td');
    if (!td) return;

    // Lấy cả hai input trong ô ngày hiện tại
    // Xử lý khi thay đổi giá trị ca
    if (target.classList.contains('shift-input') && event.type === 'change') {
        const priorityBtn = block.querySelector('.priority-toggle-btn');
            // --- LOGIC KIỂM TRA TRÙNG GIỜ ---
            const inputs = td.querySelectorAll('.shift-input');
            const otherInput = Array.from(inputs).find(inp => inp !== target);

            if (otherInput && otherInput.value) {
                const shift1Code = target.value;
                const shift2Code = otherInput.value;

                const shift1 = shiftCodes.find(sc => sc.shiftCode === shift1Code);
                const shift2 = shiftCodes.find(sc => sc.shiftCode === shift2Code);

                if (shift1 && shift2) {
                    const [start1Str, end1Str] = shift1.timeRange.split('~').map(s => s.trim());
                    const [start2Str, end2Str] = shift2.timeRange.split('~').map(s => s.trim());

                    const start1 = timeToMinutes(start1Str);
                    const end1 = timeToMinutes(end1Str);
                    const start2 = timeToMinutes(start2Str);
                    const end2 = timeToMinutes(end2Str);

                    // Kiểm tra chồng chéo: (StartA < EndB) and (StartB < EndA)
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
    console.log("DEMO: Saving data to mockAvailability object.");
    for (const date in dataByDate) {
        const docId = `${date}_${currentUser.id}`;
        const hasRegistration = dataByDate[date].some(reg => reg && reg.shiftCode);

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
        console.log("Current Mock Data:", mockAvailability);
    }, 500);
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

/**
 * Chuyển sang tuần khác.
 * @param {number} direction - 1 cho tuần tới, -1 cho tuần trước.
 */
function changeWeek(direction) {
    viewStartDate.setDate(viewStartDate.getDate() + (direction * 7));
    renderWeekView();
}

export function cleanup() {
    if (domController) {
        domController.abort();
        domController = null;
    }
    // Xóa event listener đã delegate
    const tableBody = document.getElementById('availability-table-body');
    if (tableBody) {
        tableBody.removeEventListener('click', handleCellChange);
        tableBody.removeEventListener('change', handleCellChange);
        tableBody.removeEventListener('focusin', handleCellFocus);
    }
}

export async function init() {
    // Trong kiến trúc SPA này, init() được gọi sau khi nội dung trang đã được tải vào DOM.
    // Do đó, không cần chờ 'DOMContentLoaded' nữa và có thể chạy trực tiếp.
    // Logic mới: Kiểm tra tham số 'date' trên URL trước khi chạy init
    const urlParams = new URLSearchParams(window.location.search);
    // Gán mockCurrentUser vào window để các phần khác của app (nếu có) có thể truy cập
    window.currentUser = mockCurrentUser;

    const dateParam = urlParams.get('date');
    let initialDate = null;

    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
        // Nếu có ngày hợp lệ, đặt ngày bắt đầu của tuần là ngày đó
        const [year, month, day] = dateParam.split('-').map(Number);
        initialDate = new Date(year, month - 1, day);
    }

    await runInit(initialDate);
}

async function runInit(initialDate = null) {
    domController = new AbortController();
    const { signal } = domController;

    // Đặt ngày bắt đầu là ngày mai
    viewStartDate = initialDate || getNextPayrollStartDate();
    viewStartDate.setHours(0, 0, 0, 0);

    await loadApplicableShiftCodes();
    renderWeekView();

    document.getElementById('prev-week-btn')?.addEventListener('click', () => changeWeek(-1), { signal });
    document.getElementById('next-week-btn')?.addEventListener('click', () => changeWeek(1), { signal });
    document.getElementById('save-week-availability-btn')?.addEventListener('click', saveWeekAvailability, { signal });
}