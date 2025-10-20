import { db } from './firebase.js';
import { writeBatch, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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
            if (!menuContainer.classList.contains('expanded')) {
                const menuRect = menuContainer.getBoundingClientRect();
                const expandedWidth = 300; // Giả định chiều rộng khi mở rộng là 250px.

                // Nếu cạnh phải của menu mở rộng vượt ra ngoài màn hình
                if (menuRect.left + expandedWidth > window.innerWidth) {
                    // Tính toán vị trí left mới để nó không bị tràn
                    const newLeft = window.innerWidth - expandedWidth - 10; // 10px là khoảng đệm
                    menuContainer.style.left = `${Math.max(0, newLeft)}px`;
                }
            }

            menuContainer.classList.toggle('expanded');
        }
    });

    // --- Draggable logic ---
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        menuContainer.dataset.isDragging = 'true';
        header.style.cursor = 'grabbing';
        
        // Calculate offset from the top-left corner of the menu
        offsetX = e.clientX - menuContainer.getBoundingClientRect().left;
        offsetY = e.clientY - menuContainer.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            // Calculate new position
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            // Constrain within viewport
            const menuRect = menuContainer.getBoundingClientRect();
            newX = Math.max(0, Math.min(newX, window.innerWidth - menuRect.width));
            newY = Math.max(0, Math.min(newY, window.innerHeight - menuRect.height));

            menuContainer.style.left = `${newX}px`;
            menuContainer.style.top = `${newY}px`;
            // Override bottom/right styles
            menuContainer.style.bottom = 'auto';
            menuContainer.style.right = 'auto';
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
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
            'Hành động này sẽ GHI ĐÈ toàn bộ dữ liệu mẫu (Khu vực, Nhóm, Công việc). Bạn có chắc chắn muốn tiếp tục?',
            'Xác nhận Nhập Dữ Liệu'
        );
        if (!confirmed) return;

        try {
            window.showToast('Đang tải và xử lý dữ liệu...', 'info');
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Không thể tải file data.json');
            
            const data = await response.json();
            const batch = writeBatch(db);

            // Seed Task Areas
            if (data.task_areas && Array.isArray(data.task_areas)) {
                data.task_areas.forEach(area => {
                    if (area.id && area.name) {
                        const docRef = doc(db, 'task_areas', area.id);
                        batch.set(docRef, { name: area.name });
                    }
                });
            }

            // Seed Task Groups
            if (data.task_groups && Array.isArray(data.task_groups)) {
                data.task_groups.forEach(group => {
                    if (group.id && group.name) {
                        const docRef = doc(db, 'task_groups', group.id);
                        batch.set(docRef, {
                            name: group.name,
                            description: group.description || '',
                            area: group.area || '',
                            taskCount: group.taskCount || 0,
                            createdAt: serverTimestamp()
                        });
                    }
                });
            }

            // Seed Main Tasks
            if (data.main_tasks && Array.isArray(data.main_tasks)) {
                data.main_tasks.forEach(task => {
                    if (task.id && task.name) {
                        const docRef = doc(db, 'main_tasks', task.id);
                        batch.set(docRef, {
                            name: task.name,
                            description: task.description || '',
                            groupId: task.groupId || '',
                            estimatedTime: task.estimatedTime || 15,
                            createdAt: serverTimestamp()
                        });
                    }
                });
            }

            await batch.commit();
            window.showToast('Hoàn tất! Đã nhập toàn bộ dữ liệu mẫu.', 'success', 4000);
        } catch (error) {
            console.error("Lỗi khi nhập dữ liệu mẫu: ", error);
            window.showToast("Lỗi khi nhập dữ liệu. Vui lòng kiểm tra console.", "error");
        }
    });
}

export { initializeDevMenu };