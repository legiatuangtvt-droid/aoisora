// Import các tiện ích toàn cục.
import './toast.js';
import './confirmation-modal.js';
import { initializeDevMenu } from './dev-menu.js';
import { initializeLayoutController } from './layout-controller.js';

// Import các module trang thuộc nhóm Staff
import * as monthlySchedules from './monthly-schedules.js';
import * as staffAvailability from './staff-availability.js';
import * as dailySchedule from './daily-schedule.js';

// Map các trang của Staff App với module tương ứng
const staffPages = {
    'monthly-schedules.html': { module: monthlySchedules, title: 'Lịch Làm Việc Tháng' },
    'staff-availability.html': { module: staffAvailability, title: 'Đăng Ký Giờ Làm' },
    'daily-schedule.html': { module: dailySchedule, title: 'Lịch Hàng Ngày' },
    // Thêm các trang cho Staff ở đây nếu có
};

let currentPageModule = null;

function loadPageModule(pageName) {
    // Dọn dẹp module cũ
    if (currentPageModule && typeof currentPageModule.cleanup === 'function') {
        currentPageModule.cleanup();
    }

    // Tải module mới
    const page = staffPages[pageName];
    if (page && page.module) {
        currentPageModule = page.module;
        if (typeof currentPageModule.init === 'function') {
            currentPageModule.init();
        }
    } else {
        currentPageModule = null;
    }
}

async function initializeStaffApp() {
    initializeDevMenu();
    initializeLayoutController();

    const initialPageName = window.location.pathname.split('/').pop() || 'monthly-schedules.html';
    loadPageModule(initialPageName);

    document.addEventListener('page-content-loaded', (event) => loadPageModule(event.detail.pageName));
}
initializeStaffApp();