import { fetchInitialData, fetchAndRenderTemplates, allTemplates, allTaskGroups, allWorkPositions } from './daily-templates-data.js';
import { renderGrid, updateRowAppearance, toggleBuilderView, createShiftCodeDatalist } from './daily-templates-ui.js';
import { 
    handleDragEnd, 
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
            ghostClass: "swap-ghost",
            swap: true, // Bật chức năng hoán đổi
            swapClass: "swap-highlight", // Áp dụng class này cho item bị hoán đổi
            onAdd: (evt) => {
                const itemEl = evt.item; // Đây là task vừa được kéo vào
                const isManager = window.currentUser && (window.currentUser.roleId === 'REGIONAL_MANAGER' || window.currentUser.roleId === 'AREA_MANAGER');

                // Đảm bảo task được kéo vào có đúng class để xử lý xóa
                itemEl.classList.add('scheduled-task-item'); // Chỉ cần thêm class này, không xóa class cũ

                // Chỉ thêm nút xóa nếu không phải là Manager
                if (!isManager && !itemEl.querySelector('.delete-task-btn')) {
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-task-btn absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity';
                    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
                    itemEl.appendChild(deleteBtn);
                }
            }
        });
        sortableInstances.push(sortable);
    });

}

export async function init() {
    domController = new AbortController();
    const { signal } = domController;

    // Tải dữ liệu nền và danh sách mẫu trước
    await fetchInitialData();

    // Tạo datalist cho mã ca sau khi đã có dữ liệu
    createShiftCodeDatalist();

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
                }
            }

            // Xử lý xóa dòng ca
            if (e.target.closest('.delete-shift-row-btn')) {
                const deleteButton = e.target.closest('.delete-shift-row-btn');
                const row = deleteButton ? deleteButton.closest('tr') : null;
                if (!row) return; // Nếu không tìm thấy dòng, không làm gì cả

                window.showConfirmation(`Bạn có chắc chắn muốn xóa dòng ca này không?`, 'Xác nhận xóa dòng', 'Xóa', 'Hủy').then(confirmed => {
                    if (confirmed) { row.remove(); updateTemplateFromDOM(); updateTemplateStats(); } // Giờ đây `row` chắc chắn không phải là null
                });
            }
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