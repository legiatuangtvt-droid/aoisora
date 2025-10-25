// Import các tiện ích toàn cục.
import './toast.js';
import './confirmation-modal.js';
import { initializeTaskLibrary, showTaskLibrary, hideTaskLibrary } from './task-library.js';
import './prompt-modal.js';
import { initializeDevMenu } from './dev-menu.js';
import { initializeLayoutController } from './layout-controller.js';

// Import các module trang thuộc nhóm Store Leader
import * as dailySchedule from './daily-schedule.js';
import * as staff from './staff.js';
import * as store from './store.js';
import * as dailyTemplates from './daily-templates.js';
import * as shiftCodes from './shift-codes.js';

// Map các trang của Store Leader App với module tương ứng
const storeLeaderPages = {
    'daily-schedule.html': { module: dailySchedule, title: 'Lịch Hàng Ngày' },
    'staff.html': { module: staff, title: 'Quản Lý Nhân Viên' },
    'store.html': { module: store, title: 'Quản Lý Cửa Hàng' },
    'daily-templates.html': { module: dailyTemplates, title: 'Quản Lý Mẫu Ngày' },
    'intro.html': { module: null, title: 'Giới Thiệu Dự Án' },
    'shift-codes.html': { module: shiftCodes, title: 'Quản Lý Mã Ca Làm Việc' }
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

    // Logic hiển thị Task Library
    if (pageName === 'daily-templates.html') {
        showTaskLibrary();
    } else {
        hideTaskLibrary();
    }
}

async function initializeStoreLeaderApp() {
    await initializeTaskLibrary();
    initializeDevMenu();
    initializeLayoutController();

    const initialPageName = window.location.pathname.split('/').pop() || 'daily-schedule.html';
    loadPageModule(initialPageName);

    document.addEventListener('page-content-loaded', (event) => loadPageModule(event.detail.pageName));
}
initializeStoreLeaderApp();