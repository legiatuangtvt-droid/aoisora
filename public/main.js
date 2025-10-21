// Import các tiện ích toàn cục. Chúng sẽ chỉ được tải một lần.
import './toast.js';
import { initializeDevMenu } from './dev-menu.js';

// Ánh xạ từ tên file HTML đến module JS tương ứng của nó.
const pageModules = {
    'task-groups.html': './task-groups.js',
    'main-tasks.html': './main-tasks.js',
    'store.html': './store.js',
    'staff.html': './staff.js',
    'daily-templates.html': './daily-templates.js',
    'daily-schedule.html': './daily-schedule.js',
};

// Biến để lưu trữ module của trang hiện tại, giúp gọi hàm cleanup
let currentPageModule = null;

/**
 * Tải và thực thi module JS cho một trang cụ thể.
 * @param {string} pageName - Tên file của trang (ví dụ: 'task-groups.html').
 */
function loadPageModule(pageName) {
    // 1. Dọn dẹp module của trang cũ trước khi tải module mới
    if (currentPageModule && typeof currentPageModule.cleanup === 'function') {
        try {
            currentPageModule.cleanup();
        } catch (error) {
            console.error(`Lỗi khi dọn dẹp module cũ:`, error);
        }
    }

    const modulePath = pageModules[pageName];
    return new Promise(async (resolve) => {
        if (modulePath) {
            try {
                // Sử dụng dynamic import để tải module
                const pageModule = await import(modulePath);
                currentPageModule = pageModule; // 2. Lưu lại module mới
                // Nếu module có hàm init(), gọi nó.
                if (pageModule && typeof pageModule.init === 'function') {
                    pageModule.init();
                }
            } catch (error) {
                console.error(`Lỗi khi tải module cho trang ${pageName}:`, error);
            }
        } else {
            currentPageModule = null; // Reset nếu trang mới không có module
        }
        resolve(); // Báo cho layout.js biết là đã xong
    });
}

/**
 * Hàm khởi tạo chính cho SPA.
 * Lắng nghe sự kiện khi nội dung trang được thay đổi bởi layout.js.
 */
function initializeRouter() {
    // Lắng nghe sự kiện tùy chỉnh 'page-content-loaded' từ layout.js
    document.addEventListener('page-content-loaded', (event) => {
        const pageName = event.detail.pageName;
        return loadPageModule(pageName);
    });

    // Tải module cho trang đầu tiên khi load
    const initialPageName = window.location.pathname.split('/').pop() || 'daily-schedule.html';
    loadPageModule(initialPageName);
}

document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo layout trước
    if (window.initializeLayout) {
        window.initializeLayout().then(() => {
            // Sau khi layout sẵn sàng, khởi tạo router
            initializeRouter();
            // Khởi tạo Dev Menu để nó hiển thị trên tất cả các trang
            initializeDevMenu();
        });
    }
});