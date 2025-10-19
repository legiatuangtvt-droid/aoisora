// Import các tiện ích toàn cục. Chúng sẽ chỉ được tải một lần.
import './modal.js';
import './toast.js';

// Ánh xạ từ tên file HTML đến module JS tương ứng của nó.
const pageModules = {
    'task-groups.html': './task-groups.js',
    // Thêm các trang khác có logic JS riêng ở đây
    // 'main-tasks.html': './main-tasks.js', 
    // 'index.html': './daily-schedule.js',
};

/**
 * Tải và thực thi module JS cho một trang cụ thể.
 * @param {string} pageName - Tên file của trang (ví dụ: 'task-groups.html').
 */
async function loadPageModule(pageName) {
    const modulePath = pageModules[pageName];
    if (modulePath) {
        try {
            // Sử dụng dynamic import để tải module
            const pageModule = await import(modulePath);
            // Nếu module có hàm init(), gọi nó.
            if (pageModule && typeof pageModule.init === 'function') {
                pageModule.init();
            }
        } catch (error) {
            console.error(`Lỗi khi tải module cho trang ${pageName}:`, error);
        }
    }
}

/**
 * Hàm khởi tạo chính cho SPA.
 * Lắng nghe sự kiện khi nội dung trang được thay đổi bởi layout.js.
 */
function initializeRouter() {
    // Lắng nghe sự kiện tùy chỉnh 'page-content-loaded' từ layout.js
    document.addEventListener('page-content-loaded', (event) => {
        const pageName = event.detail.pageName;
        loadPageModule(pageName);
    });

    // Tải module cho trang đầu tiên khi load
    const initialPageName = window.location.pathname.split('/').pop() || 'index.html';
    loadPageModule(initialPageName);
}

document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo layout trước
    if (window.initializeLayout) {
        window.initializeLayout().then(() => {
            // Sau khi layout sẵn sàng, khởi tạo router
            initializeRouter();
        });
    }
});