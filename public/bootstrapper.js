/**
 * AoiSora Bootstrapper
 * 
 * Nhiệm vụ của file này:
 * 1. Đọc thông tin người dùng đang được mô phỏng từ localStorage.
 * 2. Dựa vào vai trò (roleId), quyết định xem cần tải file app nào (staff-app.js, store-leader-app.js, ...).
 * 3. Tự động chèn thẻ <script> của file app tương ứng vào trang.
 * 
 * Điều này giúp các file HTML không cần phải hardcode tên file app, làm cho hệ thống linh hoạt và dễ quản lý.
 */
import { loadLayoutComponents } from './layout-loader.js';

async function bootstrapApp() {
    await loadLayoutComponents();
    // Khởi tạo biến toàn cục để lưu thông tin người dùng hiện tại
    window.currentUser = null;
    const SIMULATED_USER_STORAGE_KEY = 'simulatedUser';

    // Đọc thông tin người dùng mô phỏng từ localStorage
    const simulatedUserString = localStorage.getItem(SIMULATED_USER_STORAGE_KEY);
    if (simulatedUserString) {
        try {
            window.currentUser = JSON.parse(simulatedUserString);
            console.log("Bootstrapper: Đang mô phỏng người dùng ->", window.currentUser);
        } catch (e) {
            console.error("Bootstrapper: Lỗi khi phân tích dữ liệu người dùng mô phỏng.", e);
            localStorage.removeItem(SIMULATED_USER_STORAGE_KEY);
        }
    }
    
    // Map vai trò với file app tương ứng
    const roleToAppMap = {
        'ADMIN': 'admin-app.js',
        'STAFF': 'staff-app.js',
        'STORE_LEADER': 'store-leader-app.js',
        'AREA_MANAGER': 'area-manager-app.js',
        'REGIONAL_MANAGER': 'regional-manager-app.js',
    };

    // Mặc định là app của Admin nếu không có người dùng mô phỏng
    const userRole = window.currentUser ? window.currentUser.roleId : 'ADMIN';
    const appFile = roleToAppMap[userRole] || 'admin-app.js';

    console.log(`Bootstrapper: Tải file ứng dụng cho vai trò '${userRole}' -> ${appFile}`);

    // Tự động tạo và chèn thẻ script vào cuối thẻ <body>
    const script = document.createElement('script');
    script.type = 'module';
    script.src = appFile;
    script.defer = true;
    document.body.appendChild(script);
}

// Chạy bootstrapper ngay khi DOM được tải
document.addEventListener('DOMContentLoaded', bootstrapApp);