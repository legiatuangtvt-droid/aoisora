// Import các tiện ích toàn cục.
import './toast.js';
import './confirmation-modal.js';
import { initializeDevMenu } from './dev-menu.js';
import { initializeLayoutController } from './layout-controller.js';

// Import các module trang thuộc nhóm Regional Manager
import * as taskGroups from './task-groups.js';
import * as mainTasks from './main-tasks.js';
import * as dailySchedule from './daily-schedule.js';

// Map các trang của Regional Manager App với module tương ứng
const regionalManagerPages = {
    'task-groups.html': { module: taskGroups, title: 'Quản Lý Nhóm Công Việc' },
    'main-tasks.html': { module: mainTasks, title: 'Quản Lý Công Việc Chính' },
    'daily-schedule.html': { module: dailySchedule, title: 'Lịch Hàng Ngày Toàn Miền' },
    // Thêm các trang báo cáo, quản lý miền ở đây
};

let currentPageModule = null;

function loadPageModule(pageName) {
    // Dọn dẹp module cũ
    if (currentPageModule && typeof currentPageModule.cleanup === 'function') {
        currentPageModule.cleanup();
    }

    // Tải module mới
    const page = regionalManagerPages[pageName];
    if (page && page.module) {
        currentPageModule = page.module;
        if (typeof currentPageModule.init === 'function') {
            currentPageModule.init();
        }
    } else {
        currentPageModule = null;
    }
}

async function initializeRegionalManagerApp() {
    initializeDevMenu();
    initializeLayoutController();

    const initialPageName = window.location.pathname.split('/').pop() || 'task-groups.html';
    loadPageModule(initialPageName);

    document.addEventListener('page-content-loaded', (event) => loadPageModule(event.detail.pageName));
}
initializeRegionalManagerApp();