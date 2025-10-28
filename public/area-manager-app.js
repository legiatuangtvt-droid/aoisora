// Import các tiện ích toàn cục.
import './toast.js';
import './confirmation-modal.js';
import { initializeDevMenu } from './dev-menu.js';
import { initializeLayoutController } from './layout-controller.js';

// Import các module trang thuộc nhóm Area Manager
import * as taskGroups from './task-groups.js';

// Map các trang của Area Manager App với module tương ứng
const areaManagerPages = {
    'task-groups.html': { module: taskGroups, title: 'Quản Lý Nhóm Công Việc' },
    // Thêm các trang báo cáo, quản lý khu vực ở đây
};

let currentPageModule = null;

function loadPageModule(pageName) {
    // Dọn dẹp module cũ
    if (currentPageModule && typeof currentPageModule.cleanup === 'function') {
        currentPageModule.cleanup();
    }

    // Tải module mới
    const page = areaManagerPages[pageName];
    if (page && page.module) {
        currentPageModule = page.module;
        if (typeof currentPageModule.init === 'function') {
            currentPageModule.init();
        }
    } else {
        currentPageModule = null;
    }
}

async function initializeAreaManagerApp() {
    initializeDevMenu();
    initializeLayoutController();

    const initialPageName = window.location.pathname.split('/').pop() || 'task-groups.html';
    loadPageModule(initialPageName);

    document.addEventListener('page-content-loaded', (event) => loadPageModule(event.detail.pageName));
}
initializeAreaManagerApp();