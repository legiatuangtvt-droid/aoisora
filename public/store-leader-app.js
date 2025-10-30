// Import các tiện ích toàn cục.
import './toast.js';
import './confirmation-modal.js';
import { initializeTaskLibrary, showTaskLibrary, hideTaskLibrary } from './task-library.js';
import './prompt-modal.js';
import { initializeDevMenu } from './dev-menu.js';
import { initializeLayoutController } from './layout-controller.js';

// Import các module trang thuộc nhóm Store Leader
import * as dailySchedule from './daily-schedule.js';
import * as storeSchedule from './store-schedule.js';
import * as monthlySchedules from './monthly-schedules.js';
import * as storeAvailabilityAssignment from './store-availability-assignment.js';

// Map các trang của Store Leader App với module tương ứng
const storeLeaderPages = {
    'daily-schedule.html': { module: dailySchedule, title: 'Lịch Hàng Ngày' },
    'monthly-schedules.html': { module: monthlySchedules, title: 'Lịch Làm Việc Tháng' },
    'store-schedule.html': { module: storeSchedule, title: 'Lịch Làm Việc Cửa Hàng' },
    'store-availability-assignment.html': { module: storeAvailabilityAssignment, title: 'Phân Công Ca Làm Việc' }
};

let currentPageModule = null;

function loadPageModule(pageName) {
    // Dọn dẹp module cũ
    if (currentPageModule && typeof currentPageModule.cleanup === 'function') {
        currentPageModule.cleanup();
    }

    // Tải module mới
    const page = storeLeaderPages[pageName];
    if (page && page.module) {
        currentPageModule = page.module;
        if (typeof currentPageModule.init === 'function') {
            currentPageModule.init();
        }
    } else {
        currentPageModule = null;
    }

}

async function initializeStoreLeaderApp() {
    await initializeTaskLibrary();
    initializeDevMenu();
    initializeLayoutController();

    const initialPageName = window.location.pathname.split('/').pop() || 'store-schedule.html';
    loadPageModule(initialPageName);

    document.addEventListener('page-content-loaded', (event) => loadPageModule(event.detail.pageName));
}
initializeStoreLeaderApp();