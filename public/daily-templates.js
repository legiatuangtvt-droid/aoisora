import { fetchInitialData, fetchAndRenderTemplates, allTemplates, allTaskGroups, allWorkPositions } from './daily-templates-data.js';
import { renderGrid, updateRowAppearance, toggleBuilderView, createShiftCodeDatalist, updateGridHeaderStats } from './daily-templates-ui.js';
import { 
    addShiftRow,
    updateTemplateFromDOM,
    switchToCreateNewMode,
    deleteCurrentTemplate,
    handleResetTemplate,
    applyTemplateForHq,
    loadAppliedPlanForManager,
    updateTemplateStats,
    checkTemplateChangesAndToggleResetButton,
    loadTemplate
} from './daily-templates-logic.js';
import { calculateREForGroup } from './re-calculator.js';
import { showTaskLibrary, hideTaskLibrary } from './task-library.js';
import { initRELogicView } from './re-logic.js';


let sortableInstances = [];
let domController = null;
let currentView = 'builder'; // 'builder' or 're-logic'


/**
 * Khởi tạo chức năng kéo thả cho các ô 15 phút.
 */
export function initializeDragAndDrop() {
    // Hủy các instance cũ để tránh rò rỉ bộ nhớ
    sortableInstances.forEach(s => s.destroy());
    sortableInstances = [];

    document.querySelectorAll('.quarter-hour-slot').forEach(slot => {
        const sortable = Sortable.create(slot, {
            group: {
                name: 'template-tasks',
                pull: true,
                put: function (to) {
                    // Cho phép thả vào bất kỳ ô làm việc nào.
                    // SortableJS sẽ tự động xử lý việc hoán đổi nếu ô đó đã có task.
                    return !to.el.classList.contains('non-work-slot');
                }
            },
            animation: 150,
            ghostClass: "swap-ghost", // Giữ lại ghost class để có hiệu ứng đẹp
            // swap: true, // TẮT tùy chọn swap để xử lý thủ công
            // swapClass: "swap-highlight", 
            onEnd: (evt) => {
                // onEnd vẫn cần thiết để cập nhật DOM và thống kê sau mỗi lần kéo thả,
                // bất kể là di chuyển, hoán đổi hay kéo từ thư viện.
                updateTemplateFromDOM();
                updateTemplateStats();
                updateGridHeaderStats();
                updateAllResizeHandlesVisibility();
            },
            onAdd: (evt) => {
                const toSlot = evt.to; // Ô đích
                const fromSlot = evt.from; // Ô nguồn
                const draggedItem = evt.item; // Task được kéo
                const oldItem = toSlot.querySelector('.scheduled-task-item:not(.sortable-ghost)'); // Task cũ trong ô đích (nếu có)

                // Đảm bảo task được kéo vào luôn có các nút điều khiển
                addControlsToTask(draggedItem);

                // Logic hoán đổi thủ công:
                // Nếu ô đích đã có một task (oldItem) và nó không phải là task đang được kéo,
                // thì di chuyển task cũ đó về ô nguồn.
                if (oldItem && oldItem !== draggedItem) {
                    fromSlot.appendChild(oldItem);
                    // Đảm bảo task được chuyển về cũng có các nút điều khiển
                    addControlsToTask(oldItem);
                }

                // Các hàm cập nhật sẽ được gọi trong onEnd để tránh gọi nhiều lần.
            }
        });
        sortableInstances.push(sortable);
    });

}

/**
 * Thêm các nút điều khiển (xóa, tay nắm resize) vào một task.
 * Hàm này được tách ra để tái sử dụng trong cả onAdd và onEnd.
 * @param {HTMLElement} taskElement - Phần tử DOM của task.
 */
function addControlsToTask(taskElement) {
    if (!taskElement) return;

    const isManager = window.currentUser && (window.currentUser.roleId === 'REGIONAL_MANAGER' || window.currentUser.roleId === 'AREA_MANAGER');

    // Đảm bảo phần tử có class 'scheduled-task-item'
    taskElement.classList.add('scheduled-task-item');

    // Xóa các tay nắm cũ (nếu có) và tạo lại để đảm bảo tính nhất quán
    taskElement.querySelectorAll('.resize-handle').forEach(h => h.remove());

    // Tạo và thêm tay nắm bên trái
    const leftHandle = document.createElement('div');
    leftHandle.className = 'resize-handle resize-handle-left';
    leftHandle.dataset.direction = 'left';
    taskElement.prepend(leftHandle);

    // Tạo và thêm tay nắm bên phải
    const rightHandle = document.createElement('div');
    rightHandle.className = 'resize-handle resize-handle-right';
    rightHandle.dataset.direction = 'right';
    taskElement.prepend(rightHandle);

    // Chỉ thêm nút xóa nếu không phải là Manager và chưa có nút xóa
    if (!isManager && !taskElement.querySelector('.delete-task-btn')) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-task-btn absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10';
        deleteBtn.innerHTML = '&times;';
        taskElement.appendChild(deleteBtn);
    }
}

/**
 * Cập nhật trạng thái hiển thị của tất cả các tay nắm (resize handles) trên lưới.
 * Tay nắm sẽ bị ẩn nếu ô liền kề đã có task.
 */
function updateAllResizeHandlesVisibility() {
    const allTasks = document.querySelectorAll('#template-builder-tbody .scheduled-task-item');
    allTasks.forEach(task => {
        const currentSlot = task.closest('.quarter-hour-slot');
        if (!currentSlot) return;

        const leftHandle = task.querySelector('.resize-handle-left');
        const rightHandle = task.querySelector('.resize-handle-right');

        // Hàm trợ giúp để tìm ô liền kề, có xử lý trường hợp vượt qua ranh giới giờ (<td>)
        const getAdjacentSlot = (slot, direction) => {
            if (direction === 'previous') {
                // Nếu có ô trước đó trong cùng giờ, trả về nó
                if (slot.previousElementSibling) {
                    return slot.previousElementSibling;
                }
                // Nếu không, tìm ô cuối cùng của giờ trước đó
                return slot.closest('td')?.previousElementSibling?.querySelector('.quarter-hour-slot:last-child');
            } else { // direction === 'next'
                // Nếu có ô tiếp theo trong cùng giờ, trả về nó
                if (slot.nextElementSibling) {
                    return slot.nextElementSibling;
                }
                // Nếu không, tìm ô đầu tiên của giờ tiếp theo
                return slot.closest('td')?.nextElementSibling?.querySelector('.quarter-hour-slot:first-child');
            }
        };

        // Kiểm tra ô bên trái
        const prevSlot = getAdjacentSlot(currentSlot, 'previous');
        const hasTaskOnLeft = prevSlot && prevSlot.querySelector('.scheduled-task-item');
        leftHandle?.classList.toggle('hidden', !!hasTaskOnLeft);

        // Kiểm tra ô bên phải
        const nextSlot = getAdjacentSlot(currentSlot, 'next');
        const hasTaskOnRight = nextSlot && nextSlot.querySelector('.scheduled-task-item');
        rightHandle?.classList.toggle('hidden', !!hasTaskOnRight);
    });
}

/**
 * Khởi tạo logic kéo-giãn để nhân bản task.
 * Sử dụng event delegation trên container của lưới.
 */
function initializeTaskCloning() {
    const gridContainer = document.getElementById('template-builder-grid-container');
    if (!gridContainer) return;

    let isCloning = false;
    let sourceTaskElement = null;
    let ghostElement = null;
    let startX = 0;
    let direction = 'right';
    let slotWidth = 0;
    let initialSlot = null;

    const onMouseDown = (e) => {
        const handle = e.target.closest('.resize-handle');
        if (!handle) return;

        e.preventDefault();
        e.stopPropagation(); // Ngăn SortableJS hoạt động

        isCloning = true;
        sourceTaskElement = handle.closest('.scheduled-task-item');
        initialSlot = sourceTaskElement.closest('.quarter-hour-slot');
        startX = e.clientX;
        direction = handle.dataset.direction;
        slotWidth = initialSlot.getBoundingClientRect().width;

        // Tạo ghost element
        ghostElement = sourceTaskElement.cloneNode(true);
        const sourceRect = sourceTaskElement.getBoundingClientRect();
        ghostElement.id = 'cloning-ghost'; // Áp dụng ID để CSS có thể target
        Object.assign(ghostElement.style, {
            position: 'fixed', // Sử dụng 'fixed' để ghost không bị ảnh hưởng bởi cuộn trang
            left: `${sourceRect.left}px`, // Vị trí so với viewport
            top: `${sourceRect.top}px`,   // Vị trí so với viewport
            width: `${sourceRect.width}px`, // Bắt đầu với chiều rộng của task gốc
            height: `${sourceRect.height}px`, // Thêm height để đảm bảo kích thước
            zIndex: '9999' // Đảm bảo ghost luôn ở trên cùng
        });
        document.body.appendChild(ghostElement);

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
        if (!isCloning) return;

        const dx = e.clientX - startX;
        let numSlots = 0;

        // Chỉ tính toán số ô khi kéo đúng hướng
        if ((direction === 'right' && dx > 0) || (direction === 'left' && dx < 0)) {
            numSlots = Math.round(Math.abs(dx) / slotWidth);
        }

        // Cập nhật chiều rộng của ghost
        const sourceRect = sourceTaskElement.getBoundingClientRect();
        ghostElement.style.width = `${sourceRect.width + (numSlots * slotWidth)}px`;

        // Nếu kéo sang trái, cập nhật lại vị trí `left` của ghost
        if (direction === 'left' && dx < 0) {
            ghostElement.style.left = `${sourceRect.left - (numSlots * slotWidth)}px`;
        }
        
        // Highlight các ô đích
        highlightTargetSlots(numSlots);
    };

    const onMouseUp = (e) => {
        if (!isCloning) return;

        const dx = e.clientX - startX;
        let numSlots = 0;

        // Chỉ tính toán số ô khi kéo đúng hướng
        if ((direction === 'right' && dx > 0) || (direction === 'left' && dx < 0)) {
            numSlots = Math.round(Math.abs(dx) / slotWidth);
        }


        if (numSlots > 0) {
            cloneTasksToHighlightedSlots();
        }

        // Dọn dẹp
        isCloning = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        ghostElement?.remove();
        document.querySelectorAll('.clone-target-highlight').forEach(el => el.classList.remove('clone-target-highlight'));
    };

    const highlightTargetSlots = (numSlots) => {
        // Xóa highlight cũ
        document.querySelectorAll('.clone-target-highlight').forEach(el => el.classList.remove('clone-target-highlight'));

        let currentSlot = initialSlot;
        for (let i = 0; i < numSlots; i++) {
            // Xác định ô tiếp theo dựa trên hướng kéo
            const nextSlot = direction === 'right'
                ? currentSlot.nextElementSibling || currentSlot.parentElement?.parentElement?.nextElementSibling?.querySelector('.quarter-hour-slot')
                : currentSlot.previousElementSibling || currentSlot.parentElement?.parentElement?.previousElementSibling?.querySelector('.quarter-hour-slot:last-child');
            
            // Dừng lại nếu không tìm thấy ô tiếp theo, hoặc ô đó không hợp lệ
            // (đã có task, hoặc là ô không làm việc)
            if (nextSlot && !nextSlot.querySelector('.scheduled-task-item') && !nextSlot.classList.contains('non-work-slot')) {
                nextSlot.classList.add('clone-target-highlight');
                currentSlot = nextSlot;
            } else {
                break; // Dừng lại nếu ô tiếp theo không hợp lệ
            }
        }
    };

    const cloneTasksToHighlightedSlots = () => {
        const highlightedSlots = document.querySelectorAll('.clone-target-highlight');
        highlightedSlots.forEach(slot => {
            const newTask = sourceTaskElement.cloneNode(true);
            // Xóa các class và id không cần thiết của ghost/handle
            newTask.classList.remove('dragging');
            newTask.classList.remove('sortable-chosen', 'sortable-ghost', 'sortable-drag'); // Xóa các class của SortableJS
            newTask.removeAttribute('id');
            
            // Đảm bảo nút xóa được thêm đúng cách
            const isManager = window.currentUser && (window.currentUser.roleId === 'REGIONAL_MANAGER' || window.currentUser.roleId === 'AREA_MANAGER');
            if (!isManager && !newTask.querySelector('.delete-task-btn')) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-task-btn absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10';
                deleteBtn.title = 'Xóa task';
                deleteBtn.innerHTML = '&times;'; // Sử dụng &times; cho an toàn
                newTask.appendChild(deleteBtn);
            }

            slot.innerHTML = ''; // Xóa highlight
            slot.appendChild(newTask);
        });

        updateTemplateFromDOM();
        updateTemplateStats();
        updateAllResizeHandlesVisibility(); // Cập nhật hiển thị tay nắm sau khi nhân bản
    };

    gridContainer.addEventListener('mousedown', onMouseDown);
}

export async function init() {
    domController = new AbortController();
    const { signal } = domController;

    // Tải dữ liệu nền và danh sách mẫu trước
    await fetchInitialData();

    // Tạo datalist cho mã ca sau khi đã có dữ liệu
    createShiftCodeDatalist();

    // Khởi tạo tính năng kéo-nhân-bản
    initializeTaskCloning();

    const currentUser = window.currentUser;

    if (currentUser && (currentUser.roleId === 'REGIONAL_MANAGER' || currentUser.roleId === 'AREA_MANAGER')) {
        // --- GIAO DIỆN CHO MANAGER (RM/AM) ---
        // Hiển thị bộ chọn mẫu
        document.getElementById('template-selector-container')?.classList.remove('hidden');
        // Ẩn tất cả các nút quản lý không liên quan
        document.getElementById('save-template-btn')?.classList.add('hidden');
        document.getElementById('new-template-btn')?.classList.add('hidden');
        document.getElementById('delete-template-btn')?.classList.add('hidden');
        document.getElementById('reset-template-btn')?.classList.add('hidden'); // Ban đầu ẩn nút reset, chỉ hiện khi có thay đổi
        document.getElementById('apply-template-hq-btn')?.classList.remove('hidden'); // Hiển thị nút "Triển khai" cho RM/AM

        // Tải kế hoạch và mẫu được áp dụng gần nhất cho RM/AM
        await loadAppliedPlanForManager();
        
        // Luôn hiển thị thư viện task cho Manager để họ có thể kéo-thả
        showTaskLibrary();

    } else if (currentUser && (currentUser.roleId === 'HQ_STAFF' || currentUser.roleId === 'ADMIN')) {
        // --- GIAO DIỆN CHO HQ/ADMIN ---
        // Hiển thị bộ chọn mẫu và các nút quản lý
        document.getElementById('template-selector-container')?.classList.remove('hidden');
        document.getElementById('template-display-container')?.classList.remove('hidden'); // Luôn hiển thị container trạng thái cho HQ
        document.getElementById('apply-template-hq-btn')?.classList.remove('hidden');
        document.getElementById('save-template-btn')?.classList.remove('hidden');
        document.getElementById('new-template-btn')?.classList.remove('hidden');
        document.getElementById('delete-template-btn')?.classList.remove('hidden');
        document.getElementById('toggle-view-btn')?.classList.remove('hidden');
        // Đặt trạng thái mặc định là "Tạo Mẫu Mới"
        await fetchAndRenderTemplates();
        switchToCreateNewMode();
    }

    document.getElementById('save-template-btn')?.addEventListener('click', () => { /* Logic save đã chuyển đi */ }, { signal });
    document.getElementById('new-template-btn')?.addEventListener('click', switchToCreateNewMode, { signal });
    document.getElementById('delete-template-btn')?.addEventListener('click', deleteCurrentTemplate, { signal });
    document.getElementById('reset-template-btn')?.addEventListener('click', handleResetTemplate, { signal });
    document.getElementById('toggle-view-btn')?.addEventListener('click', toggleBuilderView, { signal });

    // --- LOGIC MỚI: Gắn sự kiện cho nút "Triển khai" / "Xin xác nhận" ---
    const applyBtn = document.getElementById('apply-template-hq-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            // Hàm applyTemplateForHq sẽ tự kiểm tra vai trò và trạng thái để thực hiện hành động phù hợp
            applyTemplateForHq();
        }, { signal });
    }
    // --------------------------------------------------------------------

    document.getElementById('template-selector')?.addEventListener('change', (e) => loadTemplate(e.target.value), { signal });

    // Sử dụng event delegation cho các nút thêm/xóa trên toàn bộ lưới
    const gridContainer = document.getElementById('template-builder-grid-container');
    if (gridContainer) {
        gridContainer.addEventListener('click', function (e) {
            // Xử lý thêm ca mới
            if (e.target.id === 'add-shift-row-btn') {
                const tbody = document.getElementById('template-builder-tbody');
                if (tbody) {
                    const newShiftNumber = tbody.children.length + 1;
                    addShiftRow(tbody, newShiftNumber);
                }
            }

            // Xử lý xóa task
            const deleteTaskButton = e.target.closest('.delete-task-btn');
            if (deleteTaskButton) {
                const taskItem = deleteTaskButton.closest('.scheduled-task-item');
                if (taskItem) { // Kiểm tra an toàn để đảm bảo taskItem không phải là null
                    taskItem.remove();
                    updateTemplateFromDOM();
                    updateTemplateStats();
                    updateGridHeaderStats(); // Cập nhật chỉ số trên header
                }
            }

            // Xử lý xóa dòng ca
            if (e.target.closest('.delete-shift-row-btn')) {
                const deleteButton = e.target.closest('.delete-shift-row-btn');
                const row = deleteButton ? deleteButton.closest('tr') : null;
                if (!row) return; // Nếu không tìm thấy dòng, không làm gì cả

                window.showConfirmation(`Bạn có chắc chắn muốn xóa dòng ca này không?`, 'Xác nhận xóa dòng', 'Xóa', 'Hủy').then(confirmed => {
                    if (confirmed) { row.remove(); updateTemplateFromDOM(); updateTemplateStats(); updateGridHeaderStats(); } // Giờ đây `row` chắc chắn không phải là null
                });
            }

            // Cập nhật lại trạng thái tay nắm sau khi xóa task/dòng
            updateAllResizeHandlesVisibility();
        }, { signal });
    }

    // --- LOGIC MỚI: Xử lý Modal theo dõi tiến độ ---
    const planTrackerModal = document.getElementById('plan-tracker-modal');
    const templateDisplayContainer = document.getElementById('template-display-container');

    if (planTrackerModal && templateDisplayContainer) {
        // Mở modal khi click vào khu vực trạng thái
        templateDisplayContainer.addEventListener('click', () => {
            planTrackerModal.classList.remove('hidden');
            planTrackerModal.classList.add('flex');
            setTimeout(() => planTrackerModal.classList.add('show'), 10);
        }, { signal });

        // Đóng modal khi click nút close hoặc click ra ngoài
        planTrackerModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') || e.target.closest('.modal-close-btn')) {
                planTrackerModal.classList.remove('show');
                planTrackerModal.addEventListener('transitionend', () => planTrackerModal.classList.add('hidden'), { once: true });
            }
        }, { signal });
    }

    // Thêm listener để cập nhật tiêu đề khi nhập manhour
    const manhourInput = document.getElementById('template-manhour-input');
    const manhourDisplay = document.getElementById('total-manhour-display');
    if (manhourInput && manhourDisplay) {
        manhourInput.addEventListener('input', () => {
            manhourDisplay.textContent = manhourInput.value || '0';
            updateTemplateFromDOM(); // Tự động lưu khi thay đổi manhour
        });
    }

    // Gọi lần đầu để đảm bảo các tay nắm được hiển thị đúng khi tải trang
    updateAllResizeHandlesVisibility();
}

export function cleanup() {
    sortableInstances.forEach(s => s.destroy());
    sortableInstances = [];
    if (domController) {
        domController.abort();
        domController = null;
    }

    ['save-template-btn', 'new-template-btn', 'delete-template-btn', 'template-selector', 'apply-template-hq-btn', 'reset-template-btn'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const newEl = el.cloneNode(true);
            el.parentNode.replaceChild(newEl, el);

        }
    });
}