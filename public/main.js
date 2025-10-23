// Import các tiện ích toàn cục. Chúng sẽ chỉ được tải một lần.
import './toast.js';
import './confirmation-modal.js';
import './prompt-modal.js';
import { initializeDevMenu } from './dev-menu.js';

// Import all page modules
import * as dailySchedule from './daily-schedule.js';
import * as mainTasks from './main-tasks.js';
import * as taskGroups from './task-groups.js';
import * as staff from './staff.js';
import * as store from './store.js';
import * as dailyTemplates from './daily-templates.js';
import * as shiftCodes from './shift-codes.js';

// Map page filenames to their corresponding modules and titles
const pages = {
    'daily-schedule.html': { module: dailySchedule, title: 'Lịch Hàng Ngày' },
    'task-groups.html': { module: taskGroups, title: 'Quản Lý Nhóm Công Việc' },
    'main-tasks.html': { module: mainTasks, title: 'Quản Lý Công Việc Chính' },
    'staff.html': { module: staff, title: 'Quản Lý Nhân Viên' },
    'store.html': { module: store, title: 'Quản Lý Cửa Hàng' },
    'daily-templates.html': { module: dailyTemplates, title: 'Quản Lý Mẫu Ngày' },
    'intro.html': { module: null, title: 'Giới Thiệu Dự Án' },
    'shift-codes.html': { module: shiftCodes, title: 'Quản Lý Mã Ca Làm Việc' }
};

let currentPageModule = null;

/**
 * Loads and initializes the JavaScript module for a specific page.
 * @param {string} pageName - The filename of the page (e.g., 'task-groups.html').
 */
function loadPageModule(pageName) {
    // 1. Cleanup the old page's module before loading the new one
    if (currentPageModule && typeof currentPageModule.cleanup === 'function') {
        currentPageModule.cleanup();
    }

    // 2. Find the new module from the `pages` map
    const page = pages[pageName];
    if (page && page.module) {
        // 3. Store the new module and initialize it
        currentPageModule = page.module;
        if (typeof currentPageModule.init === 'function') {
            currentPageModule.init();
        }
    } else {
        // 4. If the new page has no module, reset the current module
        currentPageModule = null;
    }
}

/**
 * Main initialization function for the application.
 * Listens for page content changes from layout.js.
 */
function initializeApp() {
    const initialPageName = window.location.pathname.split('/').pop() || 'daily-schedule.html';
    loadPageModule(initialPageName);
    document.addEventListener('page-content-loaded', (event) => loadPageModule(event.detail.pageName));
}

document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo layout trước
    if (window.initializeLayout) {
        window.initializeLayout().then(() => {
            // Sau khi layout sẵn sàng, khởi tạo logic của ứng dụng
            initializeApp();
            // Khởi tạo Dev Menu để nó hiển thị trên tất cả các trang
            initializeDevMenu();
        });
    }
});