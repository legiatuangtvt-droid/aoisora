import { db } from './firebase.js';
import { writeBatch, doc, serverTimestamp, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

function initializeDevMenu() {
    // CSS giờ đã được quản lý bởi Tailwind, không cần inject file riêng.

    // Create and inject HTML
    const menuContainer = document.createElement('div');
    menuContainer.id = 'dev-menu-container';
    menuContainer.innerHTML = `
        <div class="dev-menu-header flex items-center p-2.5 bg-slate-50 border-b border-slate-200 cursor-grab select-none h-[60px] box-border flex-shrink-0 active:cursor-grabbing">
            <span class="dev-menu-icon bg-emerald-500 text-white font-bold text-sm rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">DEV</span>
            <span class="dev-menu-title ml-3 font-semibold text-slate-800 whitespace-nowrap opacity-0 transition-opacity">Dev Tools</span>
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
            // Before toggling, check if we are about to expand
            const isExpanding = !menuContainer.classList.contains('expanded');

            if (isExpanding) {
                const menuRect = menuContainer.getBoundingClientRect();
                const expandedWidth = 300; // Chiều rộng của menu khi mở rộng
                const expandedHeight = 200; // Chiều cao ước tính của menu khi mở rộng
                let moved = false;

                // Nếu cạnh phải của menu mở rộng vượt ra ngoài màn hình
                if (menuRect.left + expandedWidth > window.innerWidth) {
                    menuContainer.dataset.originalLeft = menuContainer.style.left;
                    // Tính toán vị trí left mới để nó không bị tràn
                    const newLeft = window.innerWidth - expandedWidth - 10; // 10px là khoảng đệm
                    menuContainer.style.left = `${Math.max(0, newLeft)}px`;
                    moved = true;
                }
                // Nếu cạnh dưới của menu mở rộng vượt ra ngoài màn hình
                if (menuRect.top + expandedHeight > window.innerHeight) {
                    menuContainer.dataset.originalTop = menuContainer.style.top;
                    const newTop = window.innerHeight - expandedHeight - 10; // 10px là khoảng đệm
                    menuContainer.style.top = `${Math.max(0, newTop)}px`;
                    moved = true;
                }
            } else { // Đang thu gọn lại
                // Khôi phục vị trí ban đầu nếu nó đã bị di chuyển
                if (menuContainer.dataset.originalLeft) {
                    menuContainer.style.left = menuContainer.dataset.originalLeft;
                    delete menuContainer.dataset.originalLeft;
                }
                if (menuContainer.dataset.originalTop) {
                    menuContainer.style.top = menuContainer.dataset.originalTop;
                    delete menuContainer.dataset.originalTop;
                }
            }

            menuContainer.classList.toggle('expanded');
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
        const confirmed = await window.showConfirmation(
            'Hành động này sẽ XÓA SẠCH và ghi đè toàn bộ dữ liệu mẫu (Khu vực, Nhóm, Công việc). Bạn có chắc chắn muốn tiếp tục?',
            'Xác nhận Nhập Dữ Liệu'
        );
        if (!confirmed) return;

        try {
            window.showToast('Đang xử lý... Vui lòng chờ.', 'info');
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Không thể tải file data.json');
            
            const data = await response.json();
            const batch = writeBatch(db);

            // --- Bước 1: Xóa dữ liệu cũ ---
            window.showToast('Bước 1/2: Đang xóa dữ liệu cũ...', 'info');
            const collectionsToDelete = ['task_areas', 'task_groups', 'main_tasks'];
            
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

            // Seed Task Areas
            data.task_areas?.forEach(area => {
                if (area.id && area.name) {
                    const docRef = doc(db, 'task_areas', area.id);
                    addBatch.set(docRef, { name: area.name });
                }
            });

            // Seed Task Groups
            data.task_groups?.forEach(group => {
                if (group.id && group.name) {
                    const docRef = doc(db, 'task_groups', group.id);
                    addBatch.set(docRef, {
                        name: group.name,
                        description: group.description || '',
                        area: group.area || '',
                        taskCount: group.taskCount || 0,
                        createdAt: serverTimestamp()
                    });
                }
            });

            // Seed Main Tasks
            data.main_tasks?.forEach(task => {
                if (task.id && task.name) {
                    const docRef = doc(db, 'main_tasks', task.id);
                    addBatch.set(docRef, {
                        name: task.name,
                        description: task.description || '',
                        groupId: task.groupId || '',
                        estimatedTime: task.estimatedTime || 15,
                        createdAt: serverTimestamp()
                    });
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