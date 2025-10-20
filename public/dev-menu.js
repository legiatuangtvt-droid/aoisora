import { db } from './firebase.js';
import { writeBatch, doc, serverTimestamp, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

function initializeDevMenu() {
    // 1. Create and inject CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'dev-menu.css';
    document.head.appendChild(link);

    // 2. Create and inject HTML
    const menuContainer = document.createElement('div');
    menuContainer.id = 'dev-menu-container';
    menuContainer.innerHTML = `
        <div class="dev-menu-header">
            <span class="dev-menu-icon">DEV</span>
            <span class="dev-menu-title">Dev Tools</span>
        </div>
        <div class="dev-menu-body">
            <button id="seed-all-data-btn" class="dev-menu-button">
                <i class="fas fa-database"></i>
                <span>Nhập Dữ Liệu Mô Phỏng</span>
            </button>
            <button id="simulate-user-btn" class="dev-menu-button" title="Tính năng sẽ được phát triển sau">
                <i class="fas fa-user-secret"></i>
                <span>Người Dùng Mô Phỏng</span>
            </button>
        </div>
    `;
    document.body.appendChild(menuContainer);

    // 3. Add functionality
    const header = menuContainer.querySelector('.dev-menu-header');
    const seedAllDataBtn = document.getElementById('seed-all-data-btn');

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
        }
    });

    // --- Draggable logic ---
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    let animationFrameId = null;

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

        // Ngăn chặn việc chọn văn bản khi kéo
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            animationFrameId = requestAnimationFrame(() => {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                const menuRect = menuContainer.getBoundingClientRect();
                let newX = initialLeft + dx;
                let newY = initialTop + dy;

                // Giữ menu trong màn hình
                newX = Math.max(0, Math.min(newX, window.innerWidth - menuRect.width));
                newY = Math.max(0, Math.min(newY, window.innerHeight - menuRect.height));

                menuContainer.style.transform = `translate(${newX - initialLeft}px, ${newY - initialTop}px)`;
            });
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }

            // Cập nhật vị trí cuối cùng vào top/left và reset transform
            const transformMatrix = new DOMMatrix(window.getComputedStyle(menuContainer).transform);
            const finalLeft = initialLeft + transformMatrix.e;
            const finalTop = initialTop + transformMatrix.f;

            menuContainer.style.transform = 'none';
            menuContainer.style.left = `${finalLeft}px`;
            menuContainer.style.top = `${finalTop}px`;
            menuContainer.style.bottom = 'auto';
            menuContainer.style.right = 'auto';

            isDragging = false;
            header.style.cursor = 'grab';
            // Use a timeout to differentiate click from drag-end
            setTimeout(() => {
                menuContainer.dataset.isDragging = 'false';
            }, 100);
        }
    });

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