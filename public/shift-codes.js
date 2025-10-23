let domController = null;
const SHIFT_CODES_STORAGE_KEY = 'aoisora_shiftCodes';

/**
 * Thêm một dòng mới vào bảng mã ca.
 * @param {object} shiftData - Dữ liệu ca làm việc.
 * @param {string} shiftData.shiftCode - Mã ca (e.g., "V8.512").
 * @param {string} shiftData.structure - Cấu trúc mã (e.g., "V - 8.5 - 12").
 * @param {string} shiftData.timeRange - Khoảng thời gian (e.g., "06:00 ~ 14:30").
 * @param {number} shiftData.duration - Tổng giờ.
 * @param {boolean} [shouldSave=true] - Có nên lưu vào localStorage không.
 */
function addShiftCodeToTable(shiftData, shouldSave = true) {
    const list = document.getElementById('shift-codes-list');
    if (!list) return;

    // Remove the empty row if it exists
    const emptyRow = document.getElementById('empty-row');
    if (emptyRow) {
        emptyRow.remove();
    }

    const stt = list.children.length + 1;
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50';
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">${stt}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600 text-center">${shiftData.shiftCode}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center font-medium">${shiftData.timeRange}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">${shiftData.duration} giờ</td>
    `;

    list.appendChild(row);

    if (shouldSave) {
        saveShiftCodesToStorage();
    }
}

/**
 * Lưu danh sách mã ca hiện tại trong bảng vào localStorage.
 */
function saveShiftCodesToStorage() {
    const list = document.getElementById('shift-codes-list');
    if (!list) return;

    const rows = list.querySelectorAll('tr:not(#empty-row)');
    const shiftCodes = Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');
        return {
            shiftCode: cells[1].textContent,
            structure: '', // Không còn cột cấu trúc
            timeRange: cells[2].textContent,
            duration: parseFloat(cells[3].textContent)
        };
    });

    localStorage.setItem(SHIFT_CODES_STORAGE_KEY, JSON.stringify(shiftCodes));
}

/**
 * Tải danh sách mã ca từ localStorage và hiển thị lên bảng.
 */
function loadShiftCodesFromStorage() {
    const storedData = localStorage.getItem(SHIFT_CODES_STORAGE_KEY);
    if (storedData && storedData !== '[]') {
        try {
            const shiftCodes = JSON.parse(storedData);
            if (Array.isArray(shiftCodes) && shiftCodes.length > 0) {
                shiftCodes.forEach(shiftData => addShiftCodeToTable(shiftData, false));
                return true; // Dữ liệu đã tồn tại
            }
        } catch (e) {
            console.error("Lỗi khi đọc dữ liệu mã ca từ localStorage", e);
        }
    }
    return false; // Không có dữ liệu
}

/**
 * Xử lý sự kiện submit form để tạo mã ca mới.
 * @param {Event} e - Sự kiện submit.
 */
function handleGenerateShiftCode(e) {
    e.preventDefault();

    const list = document.getElementById('shift-codes-list');
    const listExisted = list && list.children.length > 0 && !list.querySelector('#empty-row');

    // Xóa danh sách hiện tại trước khi tạo danh sách mới
    if (list) {
        list.innerHTML = ''; // Xóa các hàng trong bảng
    }
    // Dòng trống sẽ được thêm lại nếu không có kết quả nào được tạo
    let itemsGenerated = 0;

    const charInput = document.getElementById('shift-char');
    const char = charInput.value.trim().toUpperCase();
    const durationMin = parseFloat(document.getElementById('shift-duration-min').value);
    const durationMax = parseFloat(document.getElementById('shift-duration-max').value);
    const startTimeMinStr = document.getElementById('shift-start-time-min').value;
    const startTimeMaxStr = document.getElementById('shift-start-time-max').value;

    // Validate character
    if (!/^[A-Z]$/.test(char)) {
        alert("Ký tự phải là một chữ cái trong bảng chữ cái tiếng Anh (A-Z).");
        charInput.focus();
        return;
    }
    charInput.value = char; // Ensure input shows the uppercase value

    if (isNaN(durationMin) || isNaN(durationMax) || !startTimeMinStr || !startTimeMaxStr) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    if (durationMin > durationMax) {
        alert("Số giờ tối thiểu không được lớn hơn số giờ tối đa.");
        return;
    }

    const timeToMinutes = (timeStr) => timeStr.split(':').map(Number).reduce((h, m) => h * 60 + m);
    const startTimeMin = timeToMinutes(startTimeMinStr);
    const startTimeMax = timeToMinutes(startTimeMaxStr);

    if (startTimeMin > startTimeMax) {
        alert("Thời gian bắt đầu tối thiểu không được lớn hơn thời gian bắt đầu tối đa.");
        return;
    }

    // Nested loops: duration and start time
    for (let duration = durationMin; duration <= durationMax; duration += 0.5) {
        for (let currentTime = startTimeMin; currentTime <= startTimeMax; currentTime += 30) {
            const startHour = Math.floor(currentTime / 60);
            const startMinute = currentTime % 60;

            // Calculate component 3 (timeCode)
            const timeCode = startHour * 2 + (startMinute / 30);

            // Generate shift code
            const shiftCode = `${char}${duration}${timeCode}`;

            // Generate structure string
            const structure = `${char} - ${duration} - ${timeCode}`;

            // Calculate end time
            const startDate = new Date();
            startDate.setHours(startHour, startMinute, 0, 0);
            const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
            
            const formatTime = (date) => {
                const h = String(date.getHours()).padStart(2, '0');
                const m = String(date.getMinutes()).padStart(2, '0');
                return `${h}:${m}`;
            };

            const timeRange = `${formatTime(startDate)} ~ ${formatTime(endDate)}`;

            addShiftCodeToTable({
                shiftCode,
                structure,
                timeRange,
                duration
            }, false); // false để không lưu vào localStorage trong mỗi vòng lặp
            itemsGenerated++;
        }
    }

    // Nếu không có mã ca nào được tạo, hiển thị lại thông báo trống
    if (itemsGenerated === 0 && list) {
        list.innerHTML = `<tr id="empty-row"><td colspan="4" class="text-center py-10 text-gray-500">Chưa có mã ca nào được tạo.</td></tr>`;
        window.showToast('Không có mã ca nào được tạo với các điều kiện đã chọn.', 'info');
    } else if (itemsGenerated > 0) {
        if (listExisted) {
            window.showToast(`Đã cập nhật thành công Danh sách ${itemsGenerated} Mã ca làm việc.`, 'success');
        } else {
            window.showToast(`Đã tạo thành công ${itemsGenerated} mã ca làm việc.`, 'success');
        }
    }

    // Lưu tất cả các mã ca vừa tạo vào localStorage một lần duy nhất
    saveShiftCodesToStorage();
}

/**
 * Dọn dẹp các listener.
 */
export function cleanup() {
    if (domController) {
        domController.abort();
        domController = null;
    }
}

/**
 * Hàm khởi tạo, được gọi bởi main.js.
 */
export function init() {
    domController = new AbortController();
    const { signal } = domController;

    const dataExists = loadShiftCodesFromStorage();
    const button = document.querySelector('#shift-code-generator-form button[type="submit"]');

    // Cập nhật nút nếu dữ liệu đã tồn tại khi tải trang
    if (dataExists && button) {
        button.innerHTML = `<i class="fas fa-sync-alt mr-2"></i> Cập nhật Danh sách Mã ca làm việc`;
    }

    const form = document.getElementById('shift-code-generator-form');
    if (form) {
        form.addEventListener('submit', handleGenerateShiftCode, { signal });
    }
}