import { fetchInitialData, fetchAndRenderTemplates, renderMonthlyPlansForManager, allTemplates, currentTemplateId, allTaskGroups, allWorkPositions, createNewTemplate, setCurrentTemplateId } from './daily-templates-data.js';
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
    handleAutoGenerate,
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

                // [DEBUG] Log cho giờ nguồn và giờ đích
                logPosTaskCountForHour(evt.from.dataset.time, 'Move/Swap (Source)');
                logPosTaskCountForHour(evt.to.dataset.time, 'Move/Swap (Dest)');
            },
            onAdd: (evt) => {
                const toSlot = evt.to; // Ô đích
                const fromSlot = evt.from; // Ô nguồn
                const draggedItem = evt.item; // Task được kéo
                
                // Tìm tất cả các task trong ô đích, loại trừ task đang được kéo
                const itemsInDest = Array.from(toSlot.querySelectorAll('.scheduled-task-item')).filter(item => item !== draggedItem);

                // Đảm bảo task được kéo vào luôn có các nút điều khiển
                addControlsToTask(draggedItem);

                // LOGIC HOÁN ĐỔI MỚI:
                // Nếu có bất kỳ task nào khác trong ô đích (thường chỉ có một),
                // di chuyển nó về ô nguồn. Điều này xử lý cả trường hợp chèn trước và sau.
                if (itemsInDest.length > 0) { // Nếu ô đích đã có task
                    const oldItem = itemsInDest[0];
                    // Kiểm tra xem nguồn kéo có phải từ thư viện không
                    const isFromLibrary = fromSlot.closest('#task-library-container');

                    if (isFromLibrary) {
                        // Nếu kéo từ thư viện, task cũ sẽ bị xóa (thay thế)
                        oldItem.remove();
                    } else {
                        // Nếu kéo từ ô khác trong lưới, thực hiện hoán đổi
                        fromSlot.appendChild(oldItem);
                        addControlsToTask(oldItem);
                    }
                }

                // Cập nhật lại toàn bộ thống kê khi có task mới từ thư viện.
                updateTemplateFromDOM(); // Lưu lại thay đổi vào template
                updateTemplateStats();   // Cập nhật bảng thống kê bên phải
                updateGridHeaderStats();
                updateAllResizeHandlesVisibility(); // Cập nhật lại tay nắm resize

                // [DEBUG] Log cho giờ đích
                logPosTaskCountForHour(toSlot.dataset.time, 'Add from Library');
            }
        });
        sortableInstances.push(sortable);
    });

}
/**
 * [DEBUG] Ghi log số lượng task POS cho một giờ cụ thể.
 * @param {string} hour - Giờ cần kiểm tra (ví dụ: "06:00").
 * @param {string} operation - Tên thao tác (ví dụ: "Move/Swap").
 */
function logPosTaskCountForHour(hour, operation) {
    const posGroup = Object.values(allTaskGroups).find(g => g.code === 'POS');
    if (!posGroup) return;

    const posGroupId = posGroup.id;
    const hourKey = hour.split(':')[0];
    let posTaskCount = 0;

    // Đếm các task POS trong giờ đó trên toàn bộ lưới
    document.querySelectorAll(`#template-builder-tbody .quarter-hour-slot[data-time^="${hourKey}:"]`).forEach(slot => {
        const task = slot.querySelector(`.scheduled-task-item[data-group-id="${posGroupId}"]`);
        if (task) {
            posTaskCount++;
        }
    });
    console.log(`[Drag&Drop Debug] Operation: ${operation} | Time: ${hour} | posTaskCount: ${posTaskCount}`);
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
        updateGridHeaderStats(); // <-- FIX: Thêm dòng này để cập nhật lại header sau khi nhân bản
        updateAllResizeHandlesVisibility(); // Cập nhật hiển thị tay nắm sau khi nhân bản

        // [DEBUG] Log cho các giờ bị ảnh hưởng bởi nhân bản
        const affectedHours = new Set(Array.from(highlightedSlots).map(slot => slot.dataset.time));
        affectedHours.forEach(hour => logPosTaskCountForHour(hour, 'Clone'));

    };

    gridContainer.addEventListener('mousedown', onMouseDown);
}

export async function init() {
    domController = new AbortController();
    const { signal } = domController;

    // Tải dữ liệu nền và danh sách mẫu trước
    await fetchInitialData();

    // Gán hàm render vào window để logic.js có thể gọi
    window.renderMonthlyPlansForManager = renderMonthlyPlansForManager;

    // Tạo datalist cho mã ca sau khi đã có dữ liệu
    createShiftCodeDatalist();

    // Khởi tạo tính năng kéo-nhân-bản
    initializeTaskCloning();

    // Khởi tạo modal "Auto Generate"
    initializeAutoGenerateModal(signal);

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
        document.getElementById('auto-generate-btn')?.classList.remove('hidden');
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

    document.getElementById('template-selector')?.addEventListener('change', async (e) => {
        const selectedValue = e.target.value;
        const currentUser = window.currentUser;
        const isManager = currentUser && (currentUser.roleId === 'REGIONAL_MANAGER' || currentUser.roleId === 'AREA_MANAGER');

        if (isManager) {
            // Đối với RM/AM, giá trị là planId. Cần tìm templateId từ plan đó.
            const plan = allTemplates.find(p => p.id === selectedValue); // allTemplates bây giờ chứa plans cho RM
            if (plan) {
                await loadTemplate(plan.templateId);
            }
        } else {
            await loadTemplate(selectedValue);
        }
    }, { signal });

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
/**
 * Khởi tạo các trình xử lý sự kiện cho modal "Auto Generate".
 * @param {AbortSignal} signal - Signal để hủy các event listener khi cần.
 */
function initializeAutoGenerateModal(signal) {
    const autoGenerateBtn = document.getElementById('auto-generate-btn');
    const autoGenerateModal = document.getElementById('auto-generate-modal');

    // --- LOGIC MỚI: Modal tùy chỉnh phân bổ khách hàng ---
    const distributionModal = document.getElementById('customer-distribution-modal');
    const openDistributionBtn = document.getElementById('customize-customer-distribution-btn');
    let customDistributionProfile = null; // Biến tạm để lưu hồ sơ tùy chỉnh
    // ----------------------------------------------------

    if (!autoGenerateBtn || !autoGenerateModal) {
        return;
    }

    const closeBtn = autoGenerateModal.querySelector('.modal-close-btn');
    const cancelBtn = autoGenerateModal.querySelector('.modal-cancel-btn');
    const autoGenerateForm = document.getElementById('auto-generate-form');

    const openModal = () => {
        // Pre-fill values
        document.getElementById('ag-open-time').value = '06:00';
        document.getElementById('ag-close-time').value = '22:00';

        const currentTemplate = allTemplates.find(t => t.id === currentTemplateId);
        const storeInfo = currentTemplate?.storeInfo || {};

        // Điền giá trị từ template hoặc giá trị mặc định
        document.getElementById('ag-target-man-hours').value = currentTemplate?.totalManhour || '80';
        document.getElementById('ag-pos-count').value = storeInfo.posCount || '3';
        document.getElementById('ag-area-size').value = storeInfo.areaSize || '200';
        document.getElementById('ag-employee-count').value = storeInfo.employeeCount || '10';
        document.getElementById('ag-dry-goods-volume').value = storeInfo.dryGoodsVolume || '70';
        document.getElementById('ag-vegetable-weight').value = storeInfo.vegetableWeight || '20';
        
        // Tính và điền tổng số khách hàng từ dữ liệu theo giờ
        const customerCountByHour = storeInfo.customerCountByHour || {};
        const totalCustomers = Object.values(customerCountByHour).reduce((sum, count) => sum + (parseInt(count, 10) || 0), 0);
        document.getElementById('ag-total-customers').value = totalCustomers > 0 ? totalCustomers : '800';


        // Xóa các giá trị khách hàng theo giờ nếu có
        const customerDataInput = document.getElementById('ag-customer-data');
        if (customerDataInput) {
            customerDataInput.value = '';
        }

        autoGenerateModal.classList.remove('hidden');
        autoGenerateModal.classList.add('flex');
        setTimeout(() => autoGenerateModal.classList.add('show'), 10);
    };

    const closeModal = () => {
        autoGenerateModal.classList.remove('show');
        autoGenerateModal.addEventListener('transitionend', () => autoGenerateModal.classList.add('hidden'), { once: true });
    };

    autoGenerateBtn.addEventListener('click', openModal, { signal });
    closeBtn.addEventListener('click', closeModal, { signal });
    cancelBtn.addEventListener('click', closeModal, { signal });
    autoGenerateModal.addEventListener('click', (e) => {
        if (e.target === autoGenerateModal) {
            closeModal();
        }
    }, { signal });

    // --- LOGIC MỚI: Xử lý modal tùy chỉnh phân bổ khách hàng ---
    if (distributionModal && openDistributionBtn) {
        const distributionForm = document.getElementById('customer-distribution-form');
        const tableBody = document.getElementById('distribution-table-body');
        const totalPercentageSpan = document.getElementById('distribution-total-percentage');
        const errorMessageDiv = document.getElementById('distribution-error-message');

        const defaultProfile = {
            "06": 2, "07": 4, "08": 5, "09": 6, "10": 7, "11": 8, "12": 7, "13": 5, 
            "14": 4, "15": 5, "16": 6, "17": 8, "18": 10, "19": 11, "20": 8, "21": 4, "22": 0
        };

        const updateDistributionTable = () => {
            let total = 0;
            const totalCustomers = parseInt(document.getElementById('ag-total-customers').value, 10) || 0;

            tableBody.querySelectorAll('tr').forEach(row => {
                const input = row.querySelector('.distribution-input');
                const percentage = parseInt(input.value, 10) || 0;
                total += percentage;

                const customerCountCell = row.querySelector('.customer-count-output');
                const calculatedCustomers = Math.round(totalCustomers * (percentage / 100));
                customerCountCell.textContent = calculatedCustomers.toLocaleString('vi-VN');
            });

            totalPercentageSpan.textContent = total;
            totalPercentageSpan.classList.toggle('text-red-600', total !== 100);
            totalPercentageSpan.classList.toggle('text-green-600', total === 100);
        };

        const openDistributionModal = () => {
            const profileToLoad = customDistributionProfile || defaultProfile;
            tableBody.innerHTML = '';
            errorMessageDiv.classList.add('hidden');

            Object.keys(profileToLoad).sort().forEach(hour => {
                const value = profileToLoad[hour];
                const row = document.createElement('tr');
                row.className = 'hover:bg-slate-50';
                row.innerHTML = `
                    <td class="p-2 border-b text-center font-medium">${hour}:00 - ${hour}:59</td>
                    <td class="p-2 border-b text-center">
                        <input type="number" min="0" max="100" value="${value}" data-hour="${hour}" class="form-input form-input-min w-20 text-center p-1 distribution-input">
                    </td>
                    <td class="p-2 border-b text-center customer-count-output">0</td>
                `;
                tableBody.appendChild(row);
            });

            tableBody.querySelectorAll('.distribution-input').forEach(input => {
                input.addEventListener('input', updateDistributionTable, { signal });
            });
            updateDistributionTable();
            distributionModal.classList.remove('hidden');
            distributionModal.classList.add('flex');
            setTimeout(() => distributionModal.classList.add('show'), 10);
        };

        const closeDistributionModal = () => {
            distributionModal.classList.remove('show');
            distributionModal.addEventListener('transitionend', () => distributionModal.classList.add('hidden'), { once: true });
        };

        openDistributionBtn.addEventListener('click', openDistributionModal, { signal });
        distributionModal.querySelector('.modal-close-btn').addEventListener('click', closeDistributionModal, { signal });
        distributionModal.querySelector('.modal-cancel-btn').addEventListener('click', closeDistributionModal, { signal });

        distributionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let total = 0;
            const newProfile = {};
            tableBody.querySelectorAll('.distribution-input').forEach(input => {
                const value = parseInt(input.value, 10) || 0;
                total += value;
                newProfile[input.dataset.hour] = value;
            });

            if (total !== 100) {
                errorMessageDiv.textContent = 'Tổng tỷ lệ phải bằng 100%.';
                errorMessageDiv.classList.remove('hidden');
                return;
            }

            customDistributionProfile = newProfile; // Lưu hồ sơ tùy chỉnh vào biến tạm
            window.showToast('Đã lưu hồ sơ phân bổ tùy chỉnh.', 'success');
            closeDistributionModal();
        }, { signal });
    }
    // ----------------------------------------------------------

    if (autoGenerateForm) {
        autoGenerateForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            let templateId = currentTemplateId;

            // Nếu đang ở chế độ tạo mới (chưa có templateId)
            if (!templateId) {
                const newTemplateName = await window.showPrompt('Bạn đang tạo lịch cho một mẫu mới. Vui lòng đặt tên cho mẫu này:', 'Đặt tên cho Mẫu mới', 'Auto Generate Model');
                if (!newTemplateName || !newTemplateName.trim()) {
                    window.showToast('Đã hủy thao tác vì chưa đặt tên cho mẫu.', 'info');
                    return;
                }
                try {
                    templateId = await createNewTemplate(newTemplateName.trim());
                    setCurrentTemplateId(templateId); // Cập nhật ID mẫu hiện tại
                } catch (error) {
                    window.showToast(`Lỗi khi tạo mẫu mới: ${error.message}`, 'error');
                    return;
                }
            }

            const openTime = document.getElementById('ag-open-time').value;
            const closeTime = document.getElementById('ag-close-time').value;
            const targetManHours = parseFloat(document.getElementById('ag-target-man-hours').value);
            const totalCustomers = parseInt(document.getElementById('ag-total-customers').value, 10) || 0;
            
            // LOGIC MỚI: Sử dụng hồ sơ tùy chỉnh nếu có, nếu không thì dùng mặc định
            const customerDistributionProfile = customDistributionProfile || {
                "06": 2, "07": 4, "08": 5, "09": 6, "10": 7, "11": 8, "12": 7, "13": 5, 
                "14": 4, "15": 5, "16": 6, "17": 8, "18": 10, "19": 11, "20": 8, "21": 4, "22": 0
            };

            // Tạo lại đối tượng customerCountByHour từ tổng số khách hàng
            const newCustomerCountByHour = {};
            for (const hour in customerDistributionProfile) {
                const percentage = customerDistributionProfile[hour];
                newCustomerCountByHour[hour] = Math.round(totalCustomers * (percentage / 100));
            }

            // Thu thập các thông số cửa hàng từ form
            const storeParams = {
                posCount: parseInt(document.getElementById('ag-pos-count').value, 10),
                areaSize: parseInt(document.getElementById('ag-area-size').value, 10),
                employeeCount: parseInt(document.getElementById('ag-employee-count').value, 10),
                dryGoodsVolume: parseInt(document.getElementById('ag-dry-goods-volume').value, 10),
                vegetableWeight: parseInt(document.getElementById('ag-vegetable-weight').value, 10),
                // Ghi đè dữ liệu khách hàng bằng dữ liệu mới được phân bổ
                customerCountByHour: newCustomerCountByHour,
                // Cập nhật lại tổng số khách hàng để nhất quán
                customerCount: totalCustomers
            };

            const submitBtn = autoGenerateForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            try {
                await handleAutoGenerate(openTime, closeTime, targetManHours, storeParams);
                window.showToast('Đã tự động tạo lịch trình thành công!', 'success');
            } catch (error) {
                console.error("Lỗi khi tự động tạo lịch trình:", error);
                window.showToast(`Đã xảy ra lỗi: ${error.message}`, 'error');
            } finally {
                closeModal();
                if (submitBtn) submitBtn.disabled = false;
            }
        }, { signal });
    }
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