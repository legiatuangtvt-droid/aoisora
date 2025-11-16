import { db } from './firebase.js';
import { collection, getDocs, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";



let activeListeners = [];
let currentEditId = null;
let domController = null;

// --- Pagination State ---
let allTasks = [];
let filteredTasks = [];
let currentPage = 1;
const itemsPerPage = 25; // Hiển thị cố định 10 dòng trên mỗi trang

/**
 * Lắng nghe các thay đổi từ collection `re_tasks` và render lại.
 */
async function listenForTaskChanges() {
    allTasks = [];
    const taskGroupsSnapshot = await getDocs(collection(db, 'task_groups'));
    const taskGroups = taskGroupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Lặp qua từng nhóm công việc và thu thập các task
    for (const group of taskGroups) {
        if (group.tasks && Array.isArray(group.tasks)) {
            group.tasks.forEach(task => {
                allTasks.push({
                    id: `${group.id}-${task.order}`, // Tạo ID duy nhất từ group id và task order
                    groupCode: group.code,
                    ...task
                });
            });
        }
    }
    filterAndRender();
}
/**
 * Render danh sách RE tasks ra bảng.
 * @param {Array} tasks - Mảng các task từ Firestore.
 * @param {number} startIndex - Chỉ số bắt đầu để tính STT.
 */
function renderTaskList(tasks, startIndex) {
    const listElement = document.getElementById('re-task-list');
    if (!listElement) return;

    listElement.innerHTML = ''; // Xóa nội dung cũ

    if (tasks.length === 0) {
        listElement.innerHTML = `<tr><td colspan="11" class="text-center p-10 text-gray-500">Không có dữ liệu để hiển thị.</td></tr>`;
        return;
    }

    tasks.forEach((task, index) => {
        const row = document.createElement('tr');        
        row.className = 'hover:bg-gray-50';
        row.dataset.id = task.id;
        row.innerHTML = `
            <td class="td-main text-sm text-center border-l border-gray-200">${startIndex + index + 1}</td>
            <td class="td-main text-sm text-center border-l border-gray-200">${task.groupCode || ''}</td> 
            <td class="td-main text-sm text-center border-l border-gray-200">${task.typeTask || ''}</td>
            <td class="td-main text-sm text-left font-semibold border-l border-gray-200">${task.name || ''}</td>
            <td class="td-main text-sm text-center border-l border-gray-200">${task.frequency || ''}</td>
            <td class="td-main text-sm text-center border-l border-gray-200">${task.frequencyNumber || ''}</td>
            <td class="td-main text-sm text-center border-l border-gray-200">${task.reUnit || ''}</td>
            <td class="td-main text-sm text-center border-l border-gray-200">${task.manual_number || ''}</td>
            <td class="td-main text-sm text-left text-gray-600 border-l border-gray-200 truncate" title="${task.manualLink || ''}">${task.manualLink || ''}</td>
            <td class="td-main text-sm text-left text-gray-600 border-l border-gray-200">${task.note || ''}</td>
            <td class="td-main text-sm text-center border-l border-r border-gray-200">
                <div class="flex items-center justify-center gap-4">
                    <button class="edit-btn text-indigo-600 hover:text-indigo-900" title="Chỉnh sửa"><i class="fas fa-pencil-alt"></i></button>
                    <button class="delete-btn text-red-600 hover:text-red-900" title="Xóa"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;
        listElement.appendChild(row);
    });
}

/**
 * Render các nút điều khiển phân trang.
 */
function renderPaginationControls() {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) return;

    const totalItems = filteredTasks.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    if (totalItems <= itemsPerPage) {
        paginationContainer.classList.add('hidden'); // Ẩn nếu chỉ có 1 trang
        return;
    }

    // Hiển thị container nếu có nhiều hơn 1 trang
    paginationContainer.classList.remove('hidden');

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

    // Cập nhật nội dung text
    document.getElementById('pagination-start-index').textContent = startIndex;
    document.getElementById('pagination-end-index').textContent = endIndex;
    document.getElementById('pagination-total-items').textContent = totalItems;

    // Cập nhật trạng thái disabled của các nút
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    paginationContainer.querySelectorAll('.pagination-btn[data-page="prev"]').forEach(btn => btn.disabled = isFirstPage);
    paginationContainer.querySelectorAll('.pagination-btn[data-page="next"]').forEach(btn => btn.disabled = isLastPage);
}

/**
 * Render trang hiện tại của danh sách.
 */
function renderCurrentPage() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const tasksForPage = filteredTasks.slice(startIndex, endIndex);

    renderTaskList(tasksForPage, startIndex);
    renderPaginationControls();
}

/**
 * Lọc và render lại danh sách task dựa trên từ khóa tìm kiếm.
 */
function filterAndRender() {
    const searchTerm = document.getElementById('search-task-input')?.value.toLowerCase() || '';
    
    if (searchTerm) {
        filteredTasks = allTasks.filter(task => 
            task.name.toLowerCase().includes(searchTerm) ||
            (task.groupCode && task.groupCode.toLowerCase().includes(searchTerm)));
    } else {
        filteredTasks = [...allTasks];
    }
    currentPage = 1; // Reset về trang đầu tiên mỗi khi tìm kiếm
    renderCurrentPage();
}

/**
 * Mở modal và chuẩn bị form để thêm hoặc sửa task.
 * @param {object|null} task - Đối tượng task cần sửa, hoặc null để thêm mới.
 */
function openTaskModal(task = null) {
    const modal = document.getElementById('re-task-modal');
    const modalTitle = document.getElementById('re-task-modal-title');
    const form = document.getElementById('re-task-form');
    const submitButton = form.querySelector('button[type="submit"]');
    form.reset();

    if (task) { // Chế độ Sửa
        currentEditId = task.id;
        modalTitle.textContent = 'Chỉnh Sửa RE Task';
        submitButton.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Cập nhật';

        document.getElementById('task-group-code').value = task.groupCode || '';
        document.getElementById('task-type').value = task.typeTask || '';
        document.getElementById('task-name').value = task.name || '';        
        document.getElementById('task-frequency').value = task.frequency || '';        
        document.getElementById('task-frequency-number').value = task.frequencyNumber || '';
        document.getElementById('task-re-unit').value = task.reUnit || '';
        document.getElementById('task-manual-number').value = task.manual_number || '';
        document.getElementById('task-manual-link').value = task.manualLink || '';
        document.getElementById('task-note').value = task.note || '';
    } else { // Chế độ Thêm
        currentEditId = null;
        modalTitle.textContent = 'Thêm RE Task Mới';
        submitButton.innerHTML = '<i class="fas fa-plus-circle mr-2"></i>Thêm Task';
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => modal.classList.add('show'), 10);
}

/**
 * Xử lý việc submit form thêm/sửa task.
 * @param {Event} e - Sự kiện submit.
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const isEditMode = !!currentEditId;

    submitButton.disabled = true;
    submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>${isEditMode ? 'Đang cập nhật...' : 'Đang thêm...'}`;

    try {
        if (isEditMode) {
            // Logic cập nhật task (đã có)
        }

        // Tách groupCode và order từ currentEditId
        const [groupCode, originalOrderStr] = currentEditId.split('-');
        const originalOrder = parseInt(originalOrderStr, 10);

        if (!groupCode || isNaN(originalOrder)) {
            throw new Error("ID của task không hợp lệ.");
        }

        const groupDocRef = doc(db, 'task_groups', groupCode);
        const docSnap = await getDoc(groupDocRef);

        if (!docSnap.exists()) {
            throw new Error(`Không tìm thấy nhóm công việc với mã: ${groupCode}`);
        }

        let tasks = docSnap.data().tasks || [];
        // Sử dụng so sánh lỏng (==) để xử lý trường hợp `order` trong Firestore là string
        // trong khi `originalOrder` là number.
        const taskIndex = tasks.findIndex(t => t.order == originalOrder);

        if (taskIndex === -1) {
            throw new Error(`Không tìm thấy task với order ${originalOrder} trong nhóm.`);
        }

        // Cập nhật các trường của task
        tasks[taskIndex].name = document.getElementById('task-name').value;
        tasks[taskIndex].typeTask = document.getElementById('task-type').value;
        tasks[taskIndex].frequency = document.getElementById('task-frequency').value;
        tasks[taskIndex].frequencyNumber = document.getElementById('task-frequency-number').value;
        tasks[taskIndex].reUnit = document.getElementById('task-re-unit').value;
        tasks[taskIndex].manual_number = document.getElementById('task-manual-number').value;
        tasks[taskIndex].manualLink = document.getElementById('task-manual-link').value;
        tasks[taskIndex].note = document.getElementById('task-note').value;

        // Ghi lại toàn bộ mảng tasks đã được cập nhật
        await updateDoc(groupDocRef, { tasks: tasks });

        window.showToast('Đã cập nhật task thành công!', 'success');
        hideModal();
        listenForTaskChanges(); // Tải lại dữ liệu để làm mới bảng

    } catch (error) {
        console.error("Lỗi khi cập nhật RE task:", error);
        window.showToast(error.message || "Có lỗi xảy ra khi lưu.", "error");
    } finally {
        submitButton.disabled = false;
        if (isEditMode) {
            submitButton.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Cập nhật';
        } else {
            submitButton.innerHTML = '<i class="fas fa-plus-circle mr-2"></i>Thêm Task';
        }
    }
}

/**
 * Đóng modal đang mở.
 */
function hideModal() {
    const modals = document.querySelectorAll('.modal-overlay.show');
    modals.forEach(modal => {
        modal.classList.remove('show');
        modal.addEventListener('transitionend', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, { once: true });
    });
}

/**
 * Xuất dữ liệu RE Tasks hiện tại ra file Excel.
 */
function exportTasksToExcel() {
    if (typeof XLSX === 'undefined') {
        window.showToast('Lỗi: Thư viện Excel chưa được tải. Vui lòng thử lại.', 'error');
        return;
    }

    if (!filteredTasks || filteredTasks.length === 0) {
        window.showToast('Không có dữ liệu để xuất.', 'info');
        return;
    }

    window.showToast('Đang chuẩn bị file Excel...', 'info');

    // Định nghĩa header cho file Excel
    const headers = [
        "Group", "Type Task", "Task Name", "Frequency Type", "Frequency Number",
        "Re Unit (min)", "Manual Number", "Manual Link", "Note"
    ];

    // Chuyển đổi dữ liệu task thành mảng các mảng
    const data = filteredTasks.map(task => [
        task.groupCode || '',
        task.typeTask || '',
        task.name || '',
        task.frequency || '',
        task.frequencyNumber || '',
        task.reUnit || '',
        task.manual_number || '',
        task.manualLink || '',
        task.note || ''
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "RE Tasks");

    // Tạo và tải file
    XLSX.writeFile(workbook, `RE_Tasks_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/**
 * Dọn dẹp các listener khi rời khỏi trang.
 */
export function cleanup() {
    if (domController) {
        domController.abort();
        domController = null;
    }
    activeListeners.forEach(unsubscribe => unsubscribe && unsubscribe());
    activeListeners = [];
}

/**
 * Hàm khởi tạo chính của module.
 */
export function init() {
    domController = new AbortController();
    const { signal } = domController;

    listenForTaskChanges();

    // Gắn sự kiện cho các nút chính
    document.getElementById('re-task-form')?.addEventListener('submit', handleFormSubmit, { signal });
    document.getElementById('export-tasks-btn')?.addEventListener('click', (event) => {
        event.stopPropagation(); // Ngăn sự kiện lan truyền lên body, tránh xung đột với layout-controller
        exportTasksToExcel();
    }, { signal });

   // Gắn sự kiện cho ô tìm kiếm
    document.getElementById('search-task-input')?.addEventListener('input', filterAndRender, { signal });

    // Gắn sự kiện cho phân trang
    document.getElementById('pagination-container')?.addEventListener('click', (e) => {
        const button = e.target.closest('.pagination-btn');
        if (!button || button.disabled) return;

        const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
        const action = button.dataset.page;

        if (action === 'prev' && currentPage > 1) currentPage--;
        if (action === 'next' && currentPage < totalPages) currentPage++;
        
        renderCurrentPage();
    }, { signal });

    // Event delegation cho các nút trong modal và bảng
    document.body.addEventListener('click', (e) => {
        // Đóng modal
        if (e.target.closest('.modal-close-btn') || e.target.classList.contains('modal-overlay')) {
            hideModal();
        }

        // Nút sửa
        const editBtn = e.target.closest('.edit-btn');
        if (editBtn) {
            const row = editBtn.closest('tr');
            const taskId = row.dataset.id;
            // Lấy dữ liệu từ các ô của hàng để điền vào modal
            const taskData = {
                id: taskId,
                groupCode: row.cells[1].textContent,
                typeTask: row.cells[2].textContent,
                name: row.cells[3].textContent,
                frequency: row.cells[4].textContent,                
                frequencyNumber: row.cells[5].textContent,
                reUnit: row.cells[6].textContent,
                manual_number: row.cells[7].textContent,
                manualLink: row.cells[8].textContent,
                note: row.cells[9].textContent,
            };
            openTaskModal(taskData);
        }
    }, { signal });
}