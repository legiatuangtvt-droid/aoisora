// Import các tiện ích toàn cục.
import './toast.js';
import './confirmation-modal.js';
import { initializeTaskLibrary, showTaskLibrary, hideTaskLibrary } from './task-library.js';
import './prompt-modal.js';
import { initializeDevMenu } from './dev-menu.js';
import { initializeLayoutController } from './layout-controller.js';

// Import các module trang thuộc nhóm Manager
import * as dailySchedule from './daily-schedule.js';
import * as monthlySchedules from './monthly-schedules.js';
import * as staffManagement from './staff-management.js';
import * as storeManagement from './store-management.js';
import * as dailyTemplates from './daily-templates.js';
import * as workforceDispatch from './workforce-dispatch.js';

// Map các trang của Manager App với module tương ứng
const managerPages = {
    'daily-schedule.html': { module: dailySchedule, title: 'Lịch Hàng Ngày' },
    'monthly-schedules.html': { module: monthlySchedules, title: 'Lịch Làm Việc Tháng' },
    'staff-management.html': { module: staffManagement, title: 'Quản Lý Nhân Viên' },
    'store-management.html': { module: storeManagement, title: 'Quản Lý Cửa Hàng' },
    'daily-templates.html': { module: dailyTemplates, title: 'Quản Lý Mẫu Ngày' },
    'workforce-dispatch.html': { module: workforceDispatch, title: 'Điều Phối Nhân Lực' },
};

let currentPageModule = null;

function loadPageModule(pageName) {
    // Dọn dẹp module cũ
    if (currentPageModule && typeof currentPageModule.cleanup === 'function') {
        currentPageModule.cleanup();
    }

    // Tải module mới
    const page = managerPages[pageName];
    if (page && page.module) {
        currentPageModule = page.module;
        if (typeof currentPageModule.init === 'function') {
            currentPageModule.init();
        }
    } else {
        currentPageModule = null;
    }
}

initializeDevMenu();
initializeLayoutController();
const initialPageName = window.location.pathname.split('/').pop() || 'workforce-dispatch.html';
loadPageModule(initialPageName);
document.addEventListener('page-content-loaded', (event) => loadPageModule(event.detail.pageName));