import { db } from './firebase.js';
import { writeBatch, doc, serverTimestamp, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

/**
 * Hiển thị một popup xác nhận tùy chỉnh.
 * @param {string} message - Thông điệp cần hiển thị.
 * @param {string} [title='Xác nhận'] - Tiêu đề của popup.
 * @returns {Promise<boolean>} - Trả về Promise, resolve `true` nếu xác nhận, `false` nếu hủy.
 */
function showDevConfirmation(message, title = 'Xác nhận') {
    // Tạm thời, chúng ta sẽ dùng hàm confirm() của trình duyệt cho đơn giản.
    // Trong tương lai, có thể tạo một modal riêng cho dev-menu nếu cần.
    const result = window.confirm(`[${title}]\n\n${message}`);
    return Promise.resolve(result);
}
window.showConfirmation = showDevConfirmation; // Gán tạm vào window để các module khác có thể dùng

function initializeDevMenu() {
    // Create and inject HTML
    const menuContainer = document.createElement('div');
    menuContainer.id = 'dev-menu-container';
    menuContainer.innerHTML = `
        <div class="dev-menu-header flex items-center p-2.5 bg-slate-50 border-b border-slate-200 cursor-grab select-none h-[60px] box-border flex-shrink-0 active:cursor-grabbing">
            <span class="dev-menu-icon bg-emerald-500 text-white font-bold text-sm rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">DEV</span>
            <span class="dev-menu-title ml-3 font-semibold text-slate-800 whitespace-nowrap opacity-0 transition-opacity ease-in">Dev Tools</span>
        </div>
        <div class="dev-menu-body p-3 flex flex-col gap-2 opacity-0 invisible transition-opacity delay-100">
            <button id="seed-all-data-btn" class="dev-menu-button flex items-center gap-2.5 px-3 py-2 border border-slate-300 rounded-md bg-white cursor-pointer text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-400">
                <i class="fas fa-database"></i>
                <span>Nhập Dữ Liệu Mô Phỏng</span>
            </button>
            <button id="simulate-user-btn" class="dev-menu-button flex items-center gap-2.5 px-3 py-2 border border-slate-300 rounded-md bg-white cursor-pointer text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-400" title="Tính năng sẽ được phát triển sau">
                <i class="fas fa-user-secret"></i>
                <span>Người Dùng Mô Phỏng</span>
            </button>
        </div>
    `;
    document.body.appendChild(menuContainer);

    // Add functionality
    const header = menuContainer.querySelector('.dev-menu-header');
    const seedAllDataBtn = document.getElementById('seed-all-data-btn');
    const menuBody = menuContainer.querySelector('.dev-menu-body');
    const menuTitle = menuContainer.querySelector('.dev-menu-title');

    // --- Logic lưu/tải trạng thái từ localStorage ---
    const DEV_MENU_STORAGE_KEY = 'devMenuState';

    function saveMenuState() {
        if (!menuContainer) return;
        const state = {
            left: menuContainer.style.left,
            top: menuContainer.style.top,
            expanded: menuContainer.classList.contains('expanded')
        };
        localStorage.setItem(DEV_MENU_STORAGE_KEY, JSON.stringify(state));
    }

    function loadMenuState() {
        const savedState = localStorage.getItem(DEV_MENU_STORAGE_KEY);
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                // Áp dụng vị trí
                if (state.left) menuContainer.style.left = state.left;
                if (state.top) menuContainer.style.top = state.top;

                // Bỏ qua việc tải trạng thái mở/đóng, luôn khởi động ở trạng thái thu gọn.
                
                // Đảm bảo menu không bị ra ngoài màn hình khi tải lại
                const rect = menuContainer.getBoundingClientRect();
                menuContainer.style.left = `${Math.max(0, Math.min(rect.left, window.innerWidth - rect.width))}px`;
                menuContainer.style.top = `${Math.max(0, Math.min(rect.top, window.innerHeight - rect.height))}px`;
            } catch (e) {
                console.error("Lỗi khi đọc trạng thái Dev Menu từ localStorage", e);
            }
        }
    }

    // --- Toggle expand/collapse ---
    header.addEventListener('click', (e) => {
        // Only toggle if not dragging
        if (menuContainer.dataset.isDragging !== 'true') {
            const isCurrentlyExpanded = menuContainer.classList.contains('expanded');

            if (isCurrentlyExpanded) {
                // --- LOGIC THU GỌN ---
                menuBody.classList.add('opacity-0', 'invisible');
                menuTitle.classList.add('opacity-0');
                menuContainer.classList.remove('expanded');

                // Khôi phục vị trí ban đầu nếu nó đã bị di chuyển
                if (menuContainer.dataset.originalLeft) {
                    menuContainer.style.left = menuContainer.dataset.originalLeft;
                    delete menuContainer.dataset.originalLeft;
                }
                if (menuContainer.dataset.originalTop) {
                    menuContainer.style.top = menuContainer.dataset.originalTop;
                    delete menuContainer.dataset.originalTop;
                }
            } else {
                // --- LOGIC MỞ RỘNG ---
                menuBody.classList.remove('opacity-0', 'invisible');
                menuTitle.classList.remove('opacity-0');
                menuContainer.classList.add('expanded');

                // Xử lý chống tràn màn hình khi mở rộng
                const menuRect = menuContainer.getBoundingClientRect();
                const expandedWidth = 250; // Chiều rộng của menu khi mở rộng
                const expandedHeight = 200; // Chiều cao ước tính

                if (menuRect.right > window.innerWidth) {
                    menuContainer.dataset.originalLeft = menuContainer.style.left;
                    menuContainer.style.left = `${window.innerWidth - expandedWidth - 20}px`;
                }
                if (menuRect.bottom > window.innerHeight) {
                    menuContainer.dataset.originalTop = menuContainer.style.top;
                    menuContainer.style.top = `${window.innerHeight - expandedHeight - 20}px`;
                }
            }

            saveMenuState(); // Lưu trạng thái sau khi mở/đóng
        }
    });

    // --- Draggable logic ---
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    let ghostElement = null; // Phần tử "ảnh" khi kéo

    header.addEventListener('mousedown', (e) => {
        // Chỉ kéo bằng chuột trái
        if (e.button !== 0) return;

        isDragging = true;
        menuContainer.dataset.isDragging = 'true';
        header.style.cursor = 'grabbing';

        const rect = menuContainer.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = rect.left;
        initialTop = rect.top;

        // --- TẠO GHOST ELEMENT (Tối ưu) ---
        // Nếu menu đang thu gọn, chỉ clone header để ghost là hình tròn.
        // Nếu menu đang mở rộng, clone toàn bộ.
        if (menuContainer.classList.contains('expanded')) {
            ghostElement = menuContainer.cloneNode(true);
        } else {
            ghostElement = header.cloneNode(true);
            ghostElement.style.width = `${rect.width}px`;
            ghostElement.style.height = `${rect.height}px`;
            ghostElement.style.borderRadius = '9999px'; // Thêm dòng này để đảm bảo ghost là hình tròn
        }
        ghostElement.id = 'dev-menu-ghost';
        ghostElement.style.left = `${initialLeft}px`;
        ghostElement.style.top = `${initialTop}px`;
        document.body.appendChild(ghostElement);

        menuContainer.classList.add('dragging'); // Làm mờ menu gốc

        // Ngăn chặn việc chọn văn bản khi kéo
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            // Di chuyển ghost element theo chuột
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            let newX = initialLeft + dx;
            let newY = initialTop + dy;

            // Giữ ghost trong màn hình
            const ghostRect = ghostElement.getBoundingClientRect();
            newX = Math.max(0, Math.min(newX, window.innerWidth - ghostRect.width));
            newY = Math.max(0, Math.min(newY, window.innerHeight - ghostRect.height));

            ghostElement.style.left = `${newX}px`;
            ghostElement.style.top = `${newY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            // Di chuyển menu thật đến vị trí của ghost và xóa ghost
            const ghostRect = ghostElement.getBoundingClientRect();
            menuContainer.style.left = `${ghostRect.left}px`;
            menuContainer.style.top = `${ghostRect.top}px`;
            menuContainer.style.bottom = 'auto';
            menuContainer.style.right = 'auto';
            
            saveMenuState(); // Lưu vị trí sau khi kéo thả

            document.body.removeChild(ghostElement);
            ghostElement = null;
            menuContainer.classList.remove('dragging');

            isDragging = false;
            header.style.cursor = 'grab';
            // Use a timeout to differentiate click from drag-end
            setTimeout(() => {
                menuContainer.dataset.isDragging = 'false';
            }, 100);
        }
    });

    // Tải trạng thái đã lưu khi khởi tạo
    loadMenuState();

    // --- Seed data logic ---
    seedAllDataBtn.addEventListener('click', async () => {
        // Loại bỏ hộp thoại xác nhận theo yêu cầu, thay bằng toast.
        window.showToast('Bắt đầu nhập dữ liệu mô phỏng...', 'info');

        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Không thể tải file data.json');
            
            const data = await response.json();
            const batch = writeBatch(db);

            // --- Bước 1: Xóa dữ liệu cũ ---
            window.showToast('Bước 1/2: Đang xóa dữ liệu cũ...', 'info');
            const collectionsToDelete = ['task_groups', 'staff', 'roles', 'stores', 'staff_statuses', 'store_statuses', 'schedules'];
            
            const deleteBatch = writeBatch(db);
            for (const collName of collectionsToDelete) {
                const collRef = collection(db, collName);
                const snapshot = await getDocs(collRef);
                snapshot.forEach(doc => {
                    deleteBatch.delete(doc.ref);
                });
            }
            await deleteBatch.commit();

            // --- Bước 2: Nhập dữ liệu mới ---
            window.showToast('Bước 2/2: Đang nhập dữ liệu mới...', 'info');
            const addBatch = writeBatch(db);

            // Seed Task Groups
            data.task_groups?.forEach(group => {
                // Sử dụng 'code' làm ID document để đảm bảo tính duy nhất
                if (group.code && group.tasks) {
                    // Chuẩn bị object màu mặc định nếu trong data.json không có
                    const defaultColorObject = {
                        name: 'slate', bg: '#e2e8f0', text: '#1e293b', border: '#94a3b8', hover: '#cbd5e1',
                        tailwind_bg: 'bg-slate-200', tailwind_text: 'text-slate-800', tailwind_border: 'border-slate-400'
                    };

                    const docRef = doc(db, 'task_groups', group.code);
                    addBatch.set(docRef, {
                        order: group.order,
                        code: group.code,
                        // Đảm bảo trường color là một object hợp lệ
                        color: (group.color && typeof group.color === 'object') ? group.color : defaultColorObject,
                        tasks: group.tasks, // Lưu toàn bộ mảng tasks vào document
                        createdAt: serverTimestamp(),
                        name: group.name || group.code // Thêm trường name nếu có
                    });
                }
            });

            // Seed Staff
            data.staff?.forEach(staff => {
                if (staff.id && staff.name) {
                    const docRef = doc(db, 'staff', staff.id);
                    addBatch.set(docRef, {
                        name: staff.name,
                        roleId: staff.roleId || '',
                        storeId: staff.storeId || '',
                        phone: staff.phone || '',
                        status: staff.status || 'ACTIVE',
                        createdAt: serverTimestamp()
                    });
                }
            });

            // Seed Roles
            data.roles?.forEach(role => {
                if (role.id && role.name) {
                    const docRef = doc(db, 'roles', role.id);
                    addBatch.set(docRef, { name: role.name });
                }
            });

            // Seed Stores
            data.stores?.forEach(store => {
                if (store.id && store.name) {
                    const docRef = doc(db, 'stores', store.id);
                    addBatch.set(docRef, {
                        name: store.name,
                        address: store.address || '',
                        status: store.status || 'ACTIVE'
                    });
                }
            });

            // Seed Staff Statuses
            data.staff_statuses?.forEach(status => {
                if (status.id && status.name) {
                    const docRef = doc(db, 'staff_statuses', status.id);
                    addBatch.set(docRef, { name: status.name, color: status.color || 'gray' });
                }
            });

            // Seed Store Statuses
            data.store_statuses?.forEach(status => {
                if (status.id && status.name) {
                    const docRef = doc(db, 'store_statuses', status.id);
                    addBatch.set(docRef, { name: status.name, color: status.color || 'gray' });
                }
            });

            // Seed Schedules
            data.schedules?.forEach(schedule => {
                if (schedule.date && schedule.staffId) {
                    // Tạo ID tự động cho lịch làm việc để tránh trùng lặp
                    const docRef = doc(collection(db, 'schedules'));
                    addBatch.set(docRef, schedule);
                }
            });

            await addBatch.commit();
            window.showToast('Hoàn tất! Đã nhập toàn bộ dữ liệu mẫu.', 'success', 4000);
        } catch (error) {
            console.error("Lỗi khi nhập dữ liệu mẫu: ", error);
            window.showToast("Lỗi khi nhập dữ liệu. Vui lòng kiểm tra console.", "error");
        }
    });
}

export { initializeDevMenu };