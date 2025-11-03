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
import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { loadLayoutComponents } from './layout-loader.js';

let allStores = [];
let allRoles = [];

/**
 * Tải danh sách tất cả cửa hàng từ Firestore.
 */
async function fetchStores() {
    try {
        const storesSnapshot = await getDocs(collection(db, 'stores'));
        allStores = storesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Bootstrapper: Lỗi khi tải dữ liệu cửa hàng.", error);
    }
}

/**
 * Tải danh sách tất cả các vai trò từ Firestore để lấy thông tin `level`.
 */
async function fetchRoles() {
    try {
        const rolesSnapshot = await getDocs(collection(db, 'roles'));
        allRoles = rolesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Bootstrapper: Lỗi khi tải dữ liệu vai trò.", error);
    }
}

/**
 * Cập nhật thông tin người dùng trên header.
 * @param {object} user - Đối tượng người dùng hiện tại.
 */
function updateHeaderUserInfo(user) {
    const userNameEl = document.getElementById('user-name');
    const userStoreEl = document.getElementById('user-store');
    const userAvatarEl = document.getElementById('user-avatar');

    if (user) {
        if (userNameEl) userNameEl.textContent = user.name;
        if (userStoreEl) {
            if (user.storeId) {
                const store = allStores.find(s => s.id === user.storeId);
                userStoreEl.textContent = store ? store.name : (user.roleId || '');
            } else if (user.roleId === 'STORE_INCHARGE' && Array.isArray(user.managedStoreIds) && user.managedStoreIds.length > 0) {
                userStoreEl.textContent = user.managedStoreIds.join(', ');
            } else {
                userStoreEl.textContent = user.roleId || '';
            }
        }
        if (userAvatarEl) {
            // Tạo avatar từ 2 chữ cái đầu của tên
            const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'AV';
            userAvatarEl.src = `https://placehold.co/40x40/E2E8F0/4A5568?text=${initials}`;
        }
    } else { // Chế độ Admin mặc định
        if (userNameEl) userNameEl.textContent = 'Admin';
        if (userStoreEl) userStoreEl.textContent = 'Toàn quyền truy cập';
    }
}

async function bootstrapApp() {
    // Khởi tạo biến toàn cục để lưu thông tin người dùng hiện tại
    window.currentUser = null;
    const SIMULATED_USER_STORAGE_KEY = 'simulatedUser';
    
    // Đọc thông tin người dùng mô phỏng từ localStorage
    const simulatedUserString = localStorage.getItem(SIMULATED_USER_STORAGE_KEY);
    if (simulatedUserString) {
        try {
            window.currentUser = JSON.parse(simulatedUserString);
        } catch (e) {
            console.error("Bootstrapper: Lỗi khi phân tích dữ liệu người dùng mô phỏng.", e);
            localStorage.removeItem(SIMULATED_USER_STORAGE_KEY);
        }
    } else {
        console.log('[Bootstrapper] No simulated user found. Defaulting to ADMIN.');
    }

    // Tải song song dữ liệu cửa hàng và vai trò để tăng tốc độ
    await Promise.all([
        fetchStores(),
        fetchRoles()
    ]);

    // Nếu không có người dùng mô phỏng, mặc định là Admin
    if (!window.currentUser) {
        window.currentUser = { roleId: 'ADMIN', name: 'Admin', level: 99 };
    } 
    // Nếu có người dùng, gắn thêm thông tin `level` vào
    else if (window.currentUser.roleId) {
        const userRoleData = allRoles.find(role => role.id === window.currentUser.roleId);
        window.currentUser.level = userRoleData ? userRoleData.level : 0; // Mặc định level 0 nếu không tìm thấy
    }

    // Tải các thành phần layout SAU KHI đã xác định được currentUser
    await loadLayoutComponents();

    // Cập nhật thông tin người dùng trên header
    updateHeaderUserInfo(window.currentUser);
    
    // Map vai trò với file app tương ứng
    const roleToAppMap = {
        'ADMIN': 'admin-app.js',
        'HQ_STAFF': 'admin-app.js',
        'STAFF': 'staff-app.js',
        'STORE_LEADER_G2': 'store-leader-app.js',
        'STORE_LEADER_G3': 'store-leader-app.js',
        'STORE_INCHARGE': 'store-leader-app.js',
        'AREA_MANAGER': 'manager-app.js',
        'REGIONAL_MANAGER': 'manager-app.js'
    };

    // Mặc định là app của Admin nếu không có người dùng mô phỏng
    const userRole = window.currentUser ? window.currentUser.roleId : 'ADMIN';
    const appFile = roleToAppMap[userRole] || 'admin-app.js';

    // Tự động tạo và chèn thẻ script vào cuối thẻ <body>
    const script = document.createElement('script');
    script.type = 'module';
    script.src = appFile;
    script.defer = true;
    document.body.appendChild(script);
}

// Chạy bootstrapper ngay khi DOM được tải
document.addEventListener('DOMContentLoaded', bootstrapApp);