import { db } from './firebase.js';
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
let domController = null;

/**
 * Thêm một dòng mới vào bảng mã ca.
 * @param {object} shiftData - Dữ liệu ca làm việc.
 * @param {string} shiftData.shiftCode - Mã ca (e.g., "V8.512").
 * @param {string} shiftData.structure - Cấu trúc mã (e.g., "V - 8.5 - 12").
 * @param {string} shiftData.timeRange - Khoảng thời gian (e.g., "06:00 ~ 14:30").
 * @param {number} shiftData.duration - Tổng giờ.
 * @param {boolean} [shouldSave=true] - Có nên lưu vào localStorage không.
 */
function addShiftCodeToTable(shiftData) {
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

}

/**
 * Lưu danh sách mã ca hiện tại trong bảng vào Firestore.
 */
async function saveShiftCodesToFirestore() {
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

    try {
        const docRef = doc(db, 'system_configurations', 'shift_codes');
        await setDoc(docRef, { 
            codes: shiftCodes,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Lỗi khi lưu mã ca vào Firestore:", error);
        window.showToast("Không thể lưu danh sách mã ca.", "error");
    }
}

/**
 * Tải danh sách mã ca từ Firestore và hiển thị lên bảng.
 */
async function loadShiftCodesFromFirestore() {
    try {
        const docRef = doc(db, 'system_configurations', 'shift_codes');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().codes?.length > 0) {
            const shiftCodes = docSnap.data().codes;
            shiftCodes.forEach(shiftData => addShiftCodeToTable(shiftData));
            return true; // Dữ liệu đã tồn tại
        }
    } catch (error) {
        console.error("Lỗi khi tải mã ca từ Firestore:", error);
    }
    return false; // Không có dữ liệu
}

/**
 * Xử lý sự kiện submit form để tạo mã ca mới.
 * @param {Event} e - Sự kiện submit.
 */
async function handleGenerateShiftCode(e) {
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
    const startTimeStr = document.getElementById('shift-start-time-min').value;
    const endTimeMaxStr = document.getElementById('shift-end-time-max').value;

    // Validate character
    if (!/^[A-Z]$/.test(char)) {
        window.showToast("Ký tự phải là một chữ cái trong bảng chữ cái tiếng Anh (A-Z).", "warning");
        charInput.focus();
        return;
    }
    charInput.value = char; // Ensure input shows the uppercase value

    if (isNaN(durationMin) || isNaN(durationMax) || !startTimeStr || !endTimeMaxStr) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    if (durationMin > durationMax) {
        window.showToast("Số giờ tối thiểu không được lớn hơn số giờ tối đa.", "warning");
        return;
    }

    const timeToMinutes = (timeStr) => timeStr.split(':').map(Number).reduce((h, m) => h * 60 + m);
    const startTimeMin = timeToMinutes(startTimeStr);
    // Dựa theo logic đã sửa ở lần trước, đây là thời gian kết thúc muộn nhất
    const endTimeMax = timeToMinutes(endTimeMaxStr);

    // Đổi tên biến startTimeMax thành latestPossibleStartTime để rõ ràng hơn
    // và tính toán lại dựa trên endTimeMax và duration.
    // Đây là một phần logic đã được cập nhật ở các phiên bản trước.
    // Dòng if (startTimeMin > startTimeMax) dưới đây sẽ được điều chỉnh cho phù hợp.
    const startTimeMax = endTimeMax; // Tạm thời gán để logic cũ không bị lỗi hoàn toàn, nhưng sẽ được thay thế

    if (startTimeMin > startTimeMax) {
        alert("Thời gian bắt đầu tối thiểu không được lớn hơn thời gian bắt đầu tối đa.");
        return;
    }

    // Nested loops: duration and start time
    for (let duration = durationMin; duration <= durationMax; duration += 1) {
        // Vòng lặp cho thời gian bắt đầu, tăng 30 phút mỗi lần
        // Giới hạn trên của vòng lặp là thời gian kết thúc muộn nhất trừ đi thời gian làm việc,
        // để đảm bảo không có ca nào bắt đầu quá muộn.
        const latestPossibleStartTime = endTimeMax - (duration * 60);

        for (let currentTime = startTimeMin; currentTime <= latestPossibleStartTime; currentTime += 30) {
            const startHour = Math.floor(currentTime / 60);
            const startMinute = currentTime % 60;

            // Calculate component 3 (timeCode)
            const timeCode = startHour * 2 + (startMinute / 30);

            // Generate shift code
            const durationString = duration.toString().replace('.', 'S');
            const shiftCode = `${char}${durationString}${timeCode}`;

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
            });
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

    // Lưu tất cả các mã ca vừa tạo vào Firestore một lần duy nhất
    await saveShiftCodesToFirestore();
}

/**
 * Mở modal để thêm mã ca thủ công.
 */
function openAddManualShiftModal() {
    const modal = document.getElementById('add-manual-shift-modal');
    if (!modal) {
        console.error('Modal "add-manual-shift-modal" không tồn tại trong DOM.');
        return;
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => modal.classList.add('show'), 10);
}

/**
 * Đóng modal đang hiển thị.
 */
function hideCurrentModal() {
    const modal = document.querySelector('.modal-overlay.show');
    if (modal) {
        modal.classList.remove('show');
        modal.addEventListener('transitionend', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            const form = modal.querySelector('form');
            if (form) form.reset();
        }, { once: true });
    }
}

/**
 * Xử lý việc submit form thêm mã ca thủ công.
 * @param {Event} e 
 */
async function handleManualAddSubmit(e) {
    e.preventDefault();
    const shiftCode = document.getElementById('manual-shift-code').value.trim().toUpperCase();
    const startTime = document.getElementById('manual-start-time').value;
    const endTime = document.getElementById('manual-end-time').value;

    if (!shiftCode || !startTime || !endTime) {
        window.showToast('Vui lòng điền đầy đủ các trường bắt buộc.', 'warning');
        return;
    }

    const timeToMinutes = (timeStr) => timeStr.split(':').map(Number).reduce((h, m) => h * 60 + m);
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (startMinutes >= endMinutes) {
        window.showToast('Giờ kết thúc phải sau giờ bắt đầu.', 'warning');
        return;
    }

    const durationMinutes = endMinutes - startMinutes;
    const durationHours = durationMinutes / 60;

    const newShiftData = {
        shiftCode: shiftCode,
        timeRange: `${startTime} ~ ${endTime}`,
        duration: parseFloat(durationHours.toFixed(2)),
        structure: '' // Cấu trúc không cần thiết cho việc thêm thủ công
    };

    addShiftCodeToTable(newShiftData);
    await saveShiftCodesToFirestore();
    window.showToast(`Đã thêm mã ca: ${shiftCode}`, 'success');
    hideCurrentModal();
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
export async function init() {
    domController = new AbortController();
    const { signal } = domController;

    const dataExists = await loadShiftCodesFromFirestore();
    const button = document.querySelector('#shift-code-generator-form button[type="submit"]');

    // Cập nhật nút nếu dữ liệu đã tồn tại khi tải trang
    if (dataExists && button) {
        button.innerHTML = `<i class="fas fa-sync-alt mr-2"></i> Cập nhật Mã ca`;
    }

    const form = document.getElementById('shift-code-generator-form');
    if (form) {
        form.addEventListener('submit', handleGenerateShiftCode, { signal });
    }

    // Gắn sự kiện cho nút thêm thủ công
    const addManualBtn = document.getElementById('add-manual-shift-btn');
    if (addManualBtn) {
        addManualBtn.addEventListener('click', openAddManualShiftModal, { signal });
    }

    // Gắn sự kiện cho modal thêm thủ công
    const manualForm = document.getElementById('add-manual-shift-form');
    if (manualForm) {
        manualForm.addEventListener('submit', handleManualAddSubmit, { signal });
    }
    document.querySelectorAll('#add-manual-shift-modal .modal-close-btn').forEach(btn => {
        btn.addEventListener('click', hideCurrentModal, { signal });
    });
}