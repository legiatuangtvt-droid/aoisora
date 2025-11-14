import { db } from './firebase.js';
import { doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { initDesktopView, cleanupDesktopView, renderDesktopView } from './staff-availability-desktop.js';
import { initMobileView, cleanupMobileView, renderMobileView } from './staff-availability-mobile.js';

let domController = null;
let payrollCycle = getPayrollCycle(new Date());
let shiftCodes = [];
let availabilityData = {}; // Dữ liệu đăng ký sẽ được lưu tạm ở đây

// Biến để theo dõi trạng thái view hiện tại
let isMobileViewActive = false;
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
async function loadApplicableShiftCodes() {
    try {
        const shiftCodesDocRef = doc(db, 'system_configurations', 'shift_codes');
        const shiftCodesSnap = await getDoc(shiftCodesDocRef);
        if (shiftCodesSnap.exists()) {
            shiftCodes = shiftCodesSnap.data().codes || [];
        }
    } catch (error) {
        console.error("Lỗi khi tải mã ca từ Firestore:", error);
        window.showToast("Không thể tải danh sách mã ca.", "error");
        shiftCodes = []; // Đảm bảo shiftCodes là một mảng rỗng nếu có lỗi
    }
}

/**
 * Tải dữ liệu đăng ký đã có cho tuần đang hiển thị.
 */
async function loadAvailabilityData() {
    const currentUser = window.currentUser;
    if (!currentUser || !currentUser.id) {
        availabilityData = {};
        return;
    }

    const startDateStr = formatDate(payrollCycle.start);
    const endDateStr = formatDate(payrollCycle.end);

    try {
        const q = query(
            collection(db, 'schedules'),
            where('employeeId', '==', currentUser.id),
            where('date', '>=', startDateStr),
            where('date', '<=', endDateStr)
        );
        const querySnapshot = await getDocs(q);
        const newAvailabilityData = {};
        querySnapshot.forEach((doc) => {
            const schedule = doc.data();
            newAvailabilityData[schedule.date] = schedule;
        });
        availabilityData = newAvailabilityData;
    } catch (error) {
        console.error("Lỗi khi tải lịch làm việc đã phân công:", error);
        window.showToast("Không thể tải lịch làm việc của bạn.", "error");
        availabilityData = {};
    }
}

/**
 * Chuyển đổi giao diện giữa Desktop và Mobile.
 */
function toggleView() {
    const body = document.body;
    const btn = document.getElementById('view-toggle-btn');
    const icon = btn.querySelector('i');
    const text = btn.querySelector('span');
    const desktopView = document.getElementById('desktop-view');
    const mobileView = document.getElementById('mobile-view');

    body.classList.toggle('mobile-active');
    isMobileViewActive = body.classList.contains('mobile-active');

    if (isMobileViewActive) {
        desktopView.classList.add('hidden');
        mobileView.classList.remove('hidden');
        icon.className = 'fas fa-desktop mr-2';
        text.textContent = 'Desktop View';
        renderMobileView({ payrollCycle, shiftCodes, availabilityData, formatDate });
    } else {
        desktopView.classList.remove('hidden');
        mobileView.classList.add('hidden');
        icon.className = 'fas fa-mobile-alt mr-2';
        text.textContent = 'Mobile View';
        renderDesktopView({ payrollCycle, shiftCodes, availabilityData, formatDate });
    }
}

// Export các biến và hàm dùng chung cho các module con
export const sharedData = {
    get payrollCycle() { return payrollCycle; },
    get shiftCodes() { return shiftCodes; },
    get availabilityData() { return availabilityData; },
};

export async function init() {
    // Trong kiến trúc SPA này, init() được gọi sau khi nội dung trang đã được tải vào DOM.
    // Do đó, không cần chờ 'DOMContentLoaded' nữa và có thể chạy trực tiếp.
    // Logic mới: Kiểm tra tham số 'date' trên URL trước khi chạy init
    const urlParams = new URLSearchParams(window.location.search);

    domController = new AbortController();
    const { signal } = domController;

    const dateParam = urlParams.get('date');
    const initialDate = dateParam ? new Date(dateParam + 'T00:00:00') : new Date();
    payrollCycle = getPayrollCycle(initialDate);

    // Tải dữ liệu cần thiết
    await loadApplicableShiftCodes();
    await loadAvailabilityData();

    // Khởi tạo cả hai view và gắn sự kiện
    initDesktopView({ db, payrollCycle, shiftCodes, availabilityData, formatDate });
    initMobileView({ payrollCycle, shiftCodes, availabilityData, formatDate });

    // Render giao diện mặc định (Desktop)
    await renderDesktopView({ payrollCycle, shiftCodes, availabilityData, formatDate });

    const toggleBtn = document.getElementById('view-toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleView, { signal });
    }
}

export function cleanup() {
    if (domController) {
        domController.abort();
        // Dọn dẹp các module con
        cleanupDesktopView();
        cleanupMobileView();
    }
}