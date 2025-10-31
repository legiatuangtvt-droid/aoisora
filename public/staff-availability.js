import { db } from './firebase.js';
import { doc, setDoc, getDoc, serverTimestamp, writeBatch, collection, query, where, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let viewStartDate = new Date(); // Sẽ được đặt lại thành ngày mai
let shiftCodes = [];
const SHIFT_CODES_STORAGE_KEY = 'aoisora_shiftCodes';

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

function getTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
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
 * Tải danh sách mã ca từ localStorage.
 */
function loadShiftCodes() {
    const storedData = localStorage.getItem(SHIFT_CODES_STORAGE_KEY);

    if (storedData) {
        try {
            const parsedData = JSON.parse(storedData);
            if (Array.isArray(parsedData)) {
                // Chỉ tải mảng shiftCodes, không còn tương tác với DOM datalist toàn cục
                shiftCodes = parsedData;
            }
        } catch (e) {
            console.error("Lỗi khi đọc dữ liệu mã ca từ localStorage", e);
            shiftCodes = [];
        }
    } else {
        console.warn("Không tìm thấy dữ liệu mã ca trong localStorage.");
    }
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
    const weekHeaderRow = document.getElementById('week-header-row');    
    const registrationRow = document.getElementById('registration-row');
    const currentDateDisplay = document.getElementById('current-date-display');

    if (!weekHeaderRow || !registrationRow || !currentDateDisplay) return;

    // Xóa nội dung cũ
    weekHeaderRow.innerHTML = '';
    registrationRow.innerHTML = '';

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(viewStartDate);
        date.setDate(date.getDate() + i);
        weekDates.push(date);
    }

    const firstDay = weekDates[0];
    const lastDay = weekDates[6];
    currentDateDisplay.textContent = `Tuần từ ${firstDay.toLocaleDateString('vi-VN')} - ${lastDay.toLocaleDateString('vi-VN')}`;

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

    weekDates.forEach(date => {
        // Dòng 2: Header ngày
        const headerCell = dayHeaderTemplate.content.cloneNode(true);
        const dayName = headerCell.querySelector('.day-name');
        const dateNumber = headerCell.querySelector('.date-number');
        
        dayName.textContent = date.toLocaleDateString('en-US', { weekday: 'short' });
        dateNumber.textContent = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        if (formatDate(date) === todayString) {
            headerCell.querySelector('th').classList.add('bg-indigo-50', 'text-indigo-700');
        }
        weekHeaderRow.appendChild(headerCell);

        // Dòng 3: Ô đăng ký (chứa 2 ca)
        const shiftCell = shiftCellTemplate.content.cloneNode(true);
        const td = shiftCell.querySelector('td');
        const dateStr = formatDate(date);
        td.dataset.date = dateStr;

        // Lặp qua 2 khối đăng ký trong template
        td.querySelectorAll('.shift-registration-block').forEach(block => {
            const input = block.querySelector('.shift-input');
            const priorityBtns = block.querySelectorAll('.priority-btn');
            const shiftIndex = block.dataset.shiftIndex;

            // Đặt placeholder
            const defaultOptionText = (shiftIndex === '0' ? '-- Ca 1 --' : '-- Ca 2 --');
            input.placeholder = defaultOptionText;

            // Gán ID duy nhất cho input
            const inputId = `shift-input-${dateStr}-${shiftIndex}`;
            input.id = inputId;

            // Tạo một datalist duy nhất cho input này
            const datalistId = `datalist-${dateStr}-${shiftIndex}`;
            const datalist = document.createElement('datalist');
            datalist.id = datalistId;
            // Ban đầu điền tất cả các mã ca vào datalist
            shiftCodes.forEach(sc => {
                datalist.innerHTML += `<option value="${sc.shiftCode}">${sc.timeRange}</option>`;
            });
            td.appendChild(datalist); // Thêm datalist vào td
            input.setAttribute('list', datalistId); // Liên kết input với datalist của nó

            // Vô hiệu hóa nút ưu tiên mặc định
            priorityBtns.forEach(btn => btn.disabled = true);

            // Vô hiệu hóa hoàn toàn nếu ngày là hôm nay hoặc trong quá khứ
            if (dateStr <= todayString) {
                block.classList.add('opacity-50', 'pointer-events-none');
                input.disabled = true;
                input.placeholder = '-- Đã khóa --';
                priorityBtns.forEach(btn => btn.disabled = true);
            }
        });
        if (dateStr <= todayString) {
            td.classList.add('bg-slate-50');
        }
        registrationRow.appendChild(shiftCell);
    });

    await loadAvailabilityForWeek(weekDates);
    addCellEventListeners();
}

/**
 * Tải dữ liệu đăng ký đã có cho tuần đang hiển thị.
 * @param {Date[]} weekDates - Mảng các đối tượng Date trong tuần.
 */
async function loadAvailabilityForWeek(weekDates) {
    const currentUser = window.currentUser;
    if (!currentUser || !currentUser.id) {
        return;
    }

    const dateStrings = weekDates.map(formatDate);
    const docIds = dateStrings.map(d => `${d}_${currentUser.id}`);
    
    if (docIds.length === 0) return;
    
    const availabilityRef = collection(db, 'staff_availability');
    const q = query(availabilityRef, where('__name__', 'in', docIds));
    
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(docSnap => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const date = data.date;
                const registrations = data.registrations || []; // [{shiftCode: 'V8', priority: 1}, {shiftCode: 'V4.5', priority: 2}]

                registrations.forEach((reg, index) => {
                    const block = document.querySelector(`td[data-date="${date}"] .shift-registration-block[data-shift-index="${index}"]`);
                    if (block) {
                        const td = block.closest('td'); // Định nghĩa td ở đây
                        const input = block.querySelector('.shift-input');
                        const priorityBtns = block.querySelectorAll('.priority-btn');

                        // Cập nhật input
                        if (reg.shiftCode) {
                            input.value = reg.shiftCode;
                            // Kích hoạt nút ưu tiên vì đã có ca được chọn
                            priorityBtns.forEach(btn => btn.disabled = false);
                        } else {
                            // Vô hiệu hóa nếu không có ca
                            priorityBtns.forEach(btn => btn.disabled = true);
                        }

                        // Cập nhật priority
                        if (reg.priority) {
                            updatePriorityUI(block, reg.priority);
                        }
                        updateShiftTimeDisplay(block); // Hiển thị khung giờ cho ca đã lưu

                    // Sau khi tải dữ liệu, lọc lại datalist cho cả hai input trong ngày
                    const targetInput = input;
                    const shiftIndex = index; // Gán giá trị index vào shiftIndex
                    const otherInput = td.querySelector(`.shift-input[data-shift-index="${1 - shiftIndex}"]`); // Lấy input còn lại
                    
                    const targetDatalist = document.getElementById(targetInput.getAttribute('list'));
                    const otherDatalist = otherInput ? document.getElementById(otherInput.getAttribute('list')) : null;

                    const targetShiftCode = targetInput.value;
                    const otherShiftCode = otherInput ? otherInput.value : null;

                    if (targetDatalist) filterDatalist(targetDatalist, targetShiftCode, otherShiftCode);
                    if (otherDatalist) filterDatalist(otherDatalist, otherShiftCode, targetShiftCode);

                    }
                });
            }
        });
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu đăng ký tuần:", error);
        window.showToast("Không thể tải dữ liệu đã đăng ký.", "error");
    }
}

/**
 * Cập nhật hiển thị khung giờ làm việc dựa trên mã ca đã nhập.
 * @param {HTMLElement} block - Khối div.shift-registration-block chứa input.
 */
function updateShiftTimeDisplay(block) {
    const input = block.querySelector('.shift-input');
    const timeDisplay = block.querySelector('.shift-time-display');
    if (!input || !timeDisplay) return;

    const shiftCodeValue = input.value;
    const shift = shiftCodes.find(sc => sc.shiftCode === shiftCodeValue);

    if (shift) {
        timeDisplay.textContent = shift.timeRange;
    } else {
        timeDisplay.textContent = '';
    }
}
/**
 * Cập nhật giao diện của các nút ưu tiên.
 * @param {HTMLElement} block - Khối div.shift-registration-block chứa các nút.
 * @param {number} selectedPriority - Mức ưu tiên được chọn (1 hoặc 2).
 */
function updatePriorityUI(block, selectedPriority) {
    const priorityBtns = block.querySelectorAll('.priority-btn');
    priorityBtns.forEach(btn => {
        const icon = btn.querySelector('i');
        const priority = parseInt(btn.dataset.priority, 10);

        // Reset màu
        icon.classList.remove('text-green-500', 'text-amber-500');
        icon.classList.add('text-gray-300');

        if (priority === selectedPriority) {
            if (priority === 1) {
                icon.classList.add('text-green-500');
            } else if (priority === 2) {
                icon.classList.add('text-amber-500');
            }
            icon.classList.remove('text-gray-300');
        }
    });
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
    // Xử lý khi thay đổi giá trị ca (sự kiện 'input')
    if (target.classList.contains('shift-input')) {
        const priorityBtns = block.querySelectorAll('.priority-btn');
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
                        priorityBtns.forEach(btn => btn.disabled = true);
                        updatePriorityUI(block, 0);
                        updateShiftTimeDisplay(block);
                        return; // Dừng xử lý thêm
                    }
                }
            }
            // --- KẾT THÚC LOGIC KIỂM TRA ---


            if (target.value) {
                // Kích hoạt các nút ưu tiên nếu một ca được chọn
                priorityBtns.forEach(btn => btn.disabled = false);
            } else {
                // Vô hiệu hóa và reset ưu tiên nếu không có ca nào được chọn
                priorityBtns.forEach(btn => btn.disabled = true);
                updatePriorityUI(block, 0); // Reset màu của icon
            }
            updateShiftTimeDisplay(block); // Cập nhật hiển thị khung giờ

        }
    // Xử lý chọn priority
    const priorityBtn = target.closest('.priority-btn');
    if (priorityBtn) {
        const currentPriority = parseInt(priorityBtn.dataset.priority, 10);
        const icon = priorityBtn.querySelector('i');
        
        // Nếu icon đã được chọn, bỏ chọn nó
        if (!icon.classList.contains('text-gray-300')) {
            updatePriorityUI(block, 0); // 0 để bỏ chọn tất cả
        } else {
            updatePriorityUI(block, currentPriority);
        }
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
    const currentUser = window.currentUser;
    if (!currentUser || !currentUser.id) {
        return;
    }

    const saveButton = document.getElementById('save-week-availability-btn');
    if (!saveButton) return;

    saveButton.disabled = true;
    saveButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Đang lưu...`;

    const batch = writeBatch(db);
    const allCells = document.querySelectorAll('.min-w-full tbody td[data-date]');
    const dataByDate = {};

    // 1. Gom nhóm dữ liệu theo ngày từ DOM
    allCells.forEach(td => {
        const date = td.dataset.date;
        td.querySelectorAll('.shift-registration-block').forEach(block => {
            const shiftIndex = parseInt(block.dataset.shiftIndex, 10);
            const shiftCode = block.querySelector('.shift-input').value;
            const selectedPriorityBtn = block.querySelector('.priority-btn i:not(.text-gray-300)');
        const priority = selectedPriorityBtn ? parseInt(selectedPriorityBtn.closest('.priority-btn').dataset.priority, 10) : 0;

        if (!dataByDate[date]) {
            dataByDate[date] = [];
        }
        dataByDate[date][shiftIndex] = { shiftCode, priority };
    });
    });

    // 2. Chuẩn bị ghi hàng loạt (batch write)
    for (const date in dataByDate) {
        let registrations = dataByDate[date];

        // Lọc bỏ các đăng ký rỗng ở cuối để tiết kiệm dung lượng
        while (registrations.length > 0) {
            const lastReg = registrations[registrations.length - 1];
            if (!lastReg || (!lastReg.shiftCode && lastReg.priority === 0)) {
                registrations.pop();
            } else {
                break;
            }
        }

        const docId = `${date}_${currentUser.id}`;
        const docRef = doc(db, 'staff_availability', docId);

        if (registrations.length === 0) {
            // Nếu không có đăng ký nào cho ngày này, xóa document khỏi Firestore
            batch.delete(docRef);
        } else {
            // Nếu có, cập nhật hoặc tạo mới document
            const dataToSave = {
                employeeId: currentUser.id,
                employeeName: currentUser.name,
                date: date,
                registrations: registrations,
                updatedAt: serverTimestamp()
            };
            batch.set(docRef, dataToSave);
        }
    }

    // 3. Thực thi ghi hàng loạt
    try {
        await batch.commit();
        window.showToast('Đã lưu đăng ký tuần thành công!', 'success');
    } catch (error) {
        console.error("Lỗi khi lưu đăng ký tuần:", error);
        window.showToast("Đã xảy ra lỗi khi lưu đăng ký.", "error");
    } finally {
        saveButton.disabled = false;
        saveButton.innerHTML = `<i class="fas fa-save mr-2"></i> Lưu Đăng Ký Tuần`;
    }
}

/**
 * Gắn các event listener cho các ô trong bảng.
 */
function addCellEventListeners() {
    const tableBody = document.querySelector('.min-w-full tbody');
    if (tableBody) {
        // Sử dụng event delegation
        tableBody.addEventListener('click', handleCellChange); // Chỉ xử lý click nút ưu tiên
        tableBody.addEventListener('input', handleCellChange); // Xử lý khi giá trị input thay đổi
        tableBody.addEventListener('focusin', handleCellFocus); // Xử lý khi focus vào input
    }
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
    const tableBody = document.querySelector('.min-w-full tbody');
    if (tableBody) {
        tableBody.removeEventListener('click', handleCellChange);
        tableBody.removeEventListener('input', handleCellChange);
        tableBody.removeEventListener('focusin', handleCellFocus);
    }
}

export function init() {
    // Trong kiến trúc SPA này, init() được gọi sau khi nội dung trang đã được tải vào DOM.
    // Do đó, không cần chờ 'DOMContentLoaded' nữa và có thể chạy trực tiếp.
    runInit();
}

function runInit() {
    domController = new AbortController();
    const { signal } = domController;

    // Đặt ngày bắt đầu là ngày mai
    viewStartDate = getTomorrow();
    viewStartDate.setHours(0, 0, 0, 0);

    loadShiftCodes();
    renderWeekView();

    document.getElementById('prev-week-btn')?.addEventListener('click', () => changeWeek(-1), { signal });
    document.getElementById('next-week-btn')?.addEventListener('click', () => changeWeek(1), { signal });
    document.getElementById('save-week-availability-btn')?.addEventListener('click', saveWeekAvailability, { signal });
}