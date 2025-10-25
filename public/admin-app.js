// Import các tiện ích toàn cục.
import './toast.js';
import './confirmation-modal.js';
import { initializeTaskLibrary, showTaskLibrary, hideTaskLibrary } from './task-library.js';
import './prompt-modal.js';
import { initializeDevMenu } from './dev-menu.js';
import { initializeLayoutController } from './layout-controller.js';

// Import tất cả các module trang
import * as dailySchedule from './daily-schedule.js';
import * as staff from './staff.js';
import * as store from './store.js';
import * as dailyTemplates from './daily-templates.js';
import * as shiftCodes from './shift-codes.js';
import * as taskGroups from './task-groups.js';
import * as mainTasks from './main-tasks.js';

// Map tất cả các trang với module tương ứng
const allPages = {
    'daily-schedule.html': { module: dailySchedule, title: 'Lịch Hàng Ngày' },
    'staff.html': { module: staff, title: 'Quản Lý Nhân Viên' },
    'store.html': { module: store, title: 'Quản Lý Cửa Hàng' },
    'daily-templates.html': { module: dailyTemplates, title: 'Quản Lý Mẫu Ngày' },
    'shift-codes.html': { module: shiftCodes, title: 'Quản Lý Mã Ca Làm Việc' },
    'task-groups.html': { module: taskGroups, title: 'Quản Lý Nhóm Công Việc' },
    'main-tasks.html': { module: mainTasks, title: 'Quản Lý Công Việc Chính' },
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