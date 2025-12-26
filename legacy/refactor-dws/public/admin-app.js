// Import các tiện ích toàn cục.
import './toast.js';
import './confirmation-modal.js';
import { initializeTaskLibrary, showTaskLibrary, hideTaskLibrary } from './task-library.js';
import './select-prompt-modal.js';
import './checkbox-list-modal.js';
import './prompt-modal.js';
import { initializeDevMenu } from './dev-menu.js';
import { initializeLayoutController } from './layout-controller.js';

// Import tất cả các module trang
import * as dailySchedule from './daily-schedule.js';
import * as staffManagement from './staff-management.js';
import * as storeManagement from './store-management.js';
import * as dailyTemplates from './daily-templates.js';
import * as shiftCodes from './shift-codes.js';
import * as taskGroups from './task-groups.js';
import * as monthlySchedules from './monthly-schedules.js';
import * as workforceDispatch from './workforce-dispatch.js';
import * as reTasks from './re-tasks.js';
import * as report from './report.js'; // Thêm module báo cáo

// Map tất cả các trang với module tương ứng
const allPages = {
    'daily-schedule.html': { module: dailySchedule, title: 'Lịch Hàng Ngày' },
    'staff-management.html': { module: staffManagement, title: 'Quản Lý Nhân Viên' },
    'store-management.html': { module: storeManagement, title: 'Quản Lý Cửa Hàng' },
    'daily-templates.html': { module: dailyTemplates, title: 'Quản Lý Mẫu Ngày' },
    'shift-codes.html': { module: shiftCodes, title: 'Quản Lý Mã Ca Làm Việc' },
    'task-groups.html': { module: taskGroups, title: 'Quản Lý Nhóm Công Việc' },
    'monthly-schedules.html': { module: monthlySchedules, title: 'Lịch Làm Việc Tháng' },
    'workforce-dispatch.html': { module: workforceDispatch, title: 'Điều Phối Nhân Lực' },
    're-tasks.html': { module: reTasks, title: 'Quản Lý RE Task' },
    'report.html': { module: report, title: 'Báo Cáo' }, // Đăng ký trang báo cáo
    'intro.html': { module: null, title: 'Giới Thiệu Dự Án' },
};

let currentPageModule = null;

function loadPageModule(pageName) {
    // Dọn dẹp module cũ
    if (currentPageModule && typeof currentPageModule.cleanup === 'function') {
        currentPageModule.cleanup();
    }

    // Tải module mới
    const page = allPages[pageName];
    if (page && page.module) {
        currentPageModule = page.module;
        if (typeof currentPageModule.init === 'function') {
            currentPageModule.init();
        }
    } else {
        currentPageModule = null;
    }

    // Logic hiển thị Task Library
    if (pageName === 'daily-templates.html') {
        showTaskLibrary();
    } else {
        hideTaskLibrary();
    }
}

async function initializeAdminApp() {
    await initializeTaskLibrary();
    initializeDevMenu();
    initializeLayoutController();

    const initialPageName = window.location.pathname.split('/').pop() || 'daily-schedule.html';
    loadPageModule(initialPageName);

    document.addEventListener('page-content-loaded', (event) => loadPageModule(event.detail.pageName));
}

initializeAdminApp();