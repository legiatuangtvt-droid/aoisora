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

/**
 * =================================================================================
 * QUY TRÌNH LẬP KẾ HOẠCH LỊCH LÀM VIỆC THÁNG (MONTHLY PLANNING WORKFLOW)
 * =================================================================================
 * Đây là luồng nghiệp vụ chính cho việc tạo và phê duyệt lịch làm việc hàng tháng,
 * được theo dõi qua collection `monthly_plans` trên Firestore.
 *
 * Bước 1: HQ Staff áp dụng Mẫu Ngày cho các Miền (Region)
 *    - Vai trò: HQ Staff (admin-app.js)
 *    - Trang: daily-templates.html
 *    - Hành động: Chọn mẫu, chọn các RM và áp dụng. Một bản ghi `monthly_plans` được tạo với status 'HQ_APPLIED'.
 *
 * Bước 2: RM điều chỉnh kế hoạch và gửi đi
 *    - Vai trò: Regional Manager (manager-app.js)
 *    - Trang: daily-templates.html
 *    - Hành động:
 *      1. RM xem lại mẫu và có thể chỉnh sửa (thêm/bớt/thay đổi task).
 *      2. Hệ thống so sánh sự thay đổi (ví dụ: tổng man-hour) với mẫu gốc.
 *      3. Nếu thay đổi <= 10% (giá trị mặc định): RM có thể "Gửi Kế hoạch" trực tiếp. Status của `monthly_plans` chuyển thành 'RM_SENT_TO_STAFF'.
 *      4. Nếu thay đổi > 10%:
 *          a. RM phải "Gửi Yêu cầu Phê duyệt" lên HQ. Status chuyển thành 'RM_AWAITING_APPROVAL'.
 *          b. HQ nhận được yêu cầu, có thể "Phê duyệt" hoặc "Từ chối".
 *             - Nếu Phê duyệt: RM được phép "Gửi Kế hoạch".
 *             - Nếu Từ chối: HQ bắt buộc phải nhập lý do/hướng dẫn. Status của `monthly_plans` chuyển thành 'HQ_REJECTED'. RM nhận được thông báo, xem lý do và phải chỉnh sửa lại kế hoạch để gửi lại yêu cầu.
 *
 * Bước 3: Nhân viên (Staff) đăng ký ca làm việc
 *    - Vai trò: Staff (staff-app.js)
 *    - Trang: staff-availability.html
 *    - Hành động:
 *      1. Đăng ký một lần: Nhân viên phải đăng ký cho toàn bộ chu kỳ lương tiếp theo (mặc định bắt đầu từ ngày 26).
 *      2. Đăng ký ca chính: Nhân viên chính thức (Full-time) phải đăng ký đủ 8h/ngày, 40h/tuần. Nhân viên bán thời gian (Part-time) không bị giới hạn.
 *      3. Đăng ký hỗ trợ (Help): Có thể đăng ký thêm các khung giờ muốn đi hỗ trợ các cửa hàng khác trong cùng khu vực (Area).
 *      4. Lưu dữ liệu: Dữ liệu đăng ký (ca chính và ca hỗ trợ) được lưu vào collection `staff_availability`.
 *      5. Khóa đăng ký: Sau ngày bắt đầu chu kỳ lương, chức năng đăng ký sẽ bị khóa.
 *      6. Cập nhật trạng thái: Hệ thống có thể tự động cập nhật status của `monthly_plans` sang 'STAFF_REGISTERED' khi đủ số lượng đăng ký.
 *
 * Bước 4: Trưởng cửa hàng (Store Leader) điều chỉnh và gửi cho Quản lý Khu vực (AM)
 *    - Vai trò: Store Leader (G2, G3), Store Incharge (SI) (store-leader-app.js)
 *    - Trang: store-availability-assignment.html
 *    - Hành động:
 *      1. Khóa đăng ký: Khi SL bắt đầu điều chỉnh, chức năng đăng ký của nhân viên trong cửa hàng sẽ bị vô hiệu hóa.
 *      2. Phân công vị trí: Dựa trên nguyện vọng, balance, model..., các Leader phân công vị trí làm việc cho nhân viên đã đăng ký.
 *      3. Yêu cầu hỗ trợ: Nếu thiếu nhân sự, SL có thể chọn nhân viên từ các cửa hàng khác trong cùng Area (những người đã đăng ký "Help").
 *      4. Ép ca (nếu cần): Nếu vẫn thiếu, Leader có thể ép nhân viên vào ca trống và chờ nhân viên xác nhận/từ chối.
 *      5. Gửi AM: Sau khi hoàn tất phân công, Leader gửi kế hoạch lên cho Quản lý Khu vực (AM). Status của `monthly_plans` chuyển thành 'SL_ADJUSTED'.
 *
 * Bước 5: Quản lý Khu vực (AM) điều phối và gửi cho Quản lý Miền (RM)
 *    - Vai trò: Area Manager (manager-app.js)
 *    - Trang: workforce-dispatch.html
 *    - Hành động:
 *      1. Xem xét tổng thể: AM xem xét lịch của tất cả cửa hàng trong khu vực, dựa trên dữ liệu thừa/thiếu man-hour theo model.
 *      2. Điều phối nhân lực: Bố trí nhân viên đăng ký "Help" hoặc những nhân viên chưa được SL phân công vào các cửa hàng thiếu người.
 *      3. Mục tiêu: Hạn chế tối đa việc thiếu man-hour và giảm thiểu việc thừa man-hour (nhân viên đăng ký nhưng không được xếp lịch).
 *      4. Gửi RM: Sau khi hoàn tất điều phối, AM gửi kế hoạch lên cho Quản lý Miền (RM). Status của `monthly_plans` chuyển thành 'AM_DISPATCHED'.
 *
 * Bước 6: Quản lý Miền (RM) điều phối và gửi cho Trụ sở chính (HQ)
 *    - Vai trò: Regional Manager (manager-app.js)
 *    - Trang: workforce-dispatch.html
 *    - Hành động:
 *      1. Rà soát & Điều phối: RM rà soát lại công tác điều phối của các AM, thực hiện điều phối nhân lực lần cuối giữa các khu vực (Area) trong miền.
 *      2. Gửi HQ: Khi gửi, giao diện chuyển sang bảng thống kê man-hour (thừa/thiếu) để RM xác nhận và gửi lên HQ. Status của `monthly_plans` chuyển thành 'RM_DISPATCHED'.
 *      3. Xử lý từ chối: Nếu HQ từ chối, RM xem lại phản hồi, điều chỉnh lại kế hoạch điều phối và gửi lại.
 *
 * Bước 7: Trụ sở chính (HQ) xác nhận và gửi lịch chính thức về cửa hàng
 *    - Vai trò: HQ Staff (admin-app.js)
 *    - Trang: workforce-dispatch.html (hoặc trang phê duyệt cuối cùng)
 *    - Hành động:
 *      1. Phê duyệt cuối cùng: HQ xem lại bảng thống kê man-hour và kế hoạch điều phối từ RM.
 *      2. Nếu "Xác nhận": Lịch làm việc chính thức được tạo trong collection `schedules`. Status của `monthly_plans` chuyển thành 'HQ_CONFIRMED'.
 *      3. Nếu "Từ chối": HQ bắt buộc phải nhập lý do/hướng dẫn. Status của `monthly_plans` chuyển về trạng thái chờ RM điều chỉnh. RM nhận được phản hồi và phải thực hiện lại Bước 6.
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