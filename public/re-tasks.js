import { db } from './firebase.js';
import { collection, onSnapshot, query, orderBy, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, writeBatch } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let activeListeners = [];
let currentEditId = null;

// --- Pagination State ---
let allTasks = [];
let filteredTasks = [];
let currentPage = 1;
const itemsPerPage = 10; // Hiển thị cố định 10 dòng trên mỗi trang

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
            <td class="td-main text-sm border-l border-gray-200">${task.category || ''}</td>
            <td class="td-main text-sm font-semibold border-l border-gray-200">${task.name || ''}</td>
            <td class="td-main text-sm border-l border-gray-200">${task.frequency || ''}</td>
            <td class="td-main text-sm text-center border-l border-gray-200">${task.reResultMin ?? ''}</td>
            <td class="td-main text-sm text-center border-l border-gray-200">${task.dailyHours ?? ''}</td>
            <td class="td-main text-sm text-center border-l border-gray-200">${task.inputNumber ?? ''}</td>
            <td class="td-main text-sm border-l border-gray-200">${task.reUnit || ''}</td>
            <td class="td-main text-sm border-l border-gray-200">${task.manualNumber || ''}</td>
            <td class="td-main text-sm text-gray-600 border-l border-gray-200">${task.note || ''}</td>
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
    const paginationContainer = document.getElementById('pagination-controls');
    if (!paginationContainer) return;

    const totalItems = filteredTasks.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    if (totalItems <= itemsPerPage) {
        paginationContainer.innerHTML = ''; // Ẩn nếu chỉ có 1 trang
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

    paginationContainer.innerHTML = `
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
                <p class="text-sm text-gray-700">
                    Hiển thị từ <span class="font-medium">${startIndex}</span> đến <span class="font-medium">${endIndex}</span> trong tổng số <span class="font-medium">${totalItems}</span> mục
                </p>
            </div>
            <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button class="pagination-btn relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>
                        <span class="sr-only">Trang trước</span>
                        <i class="fas fa-chevron-left h-5 w-5"></i>
                    </button>
                    <button class="pagination-btn relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" data-page="next" ${currentPage === totalPages ? 'disabled' : ''}>
                        <span class="sr-only">Trang sau</span>
                        <i class="fas fa-chevron-right h-5 w-5"></i>
                    </button>
                </nav>
            </div>
        </div>
    `;
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
        filteredTasks = allTasks.filter(task => task.name.toLowerCase().includes(searchTerm));
    } else {
        filteredTasks = [...allTasks];
    }
    currentPage = 1; // Reset về trang đầu tiên mỗi khi tìm kiếm
    renderCurrentPage();
}

/**
 * Lắng nghe các thay đổi từ collection `re_tasks` và render lại.
 */
function listenForTaskChanges() {
    const tasksCollection = collection(db, 're_tasks');
    // Sắp xếp theo thời gian tạo để các task mới nhất hiện lên trên
    const q = query(tasksCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        allTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sau khi lấy dữ liệu mới, áp dụng bộ lọc hiện tại và render lại
        filterAndRender();
    }, (error) => {
        console.error("Lỗi khi lắng nghe thay đổi RE tasks:", error);
        window.showToast("Không thể tải danh sách công việc.", "error");
    });

    activeListeners.push(unsubscribe);
}

/**
 * Mở modal và chuẩn bị form để thêm hoặc sửa task.
 * @param {object|null} task - Đối tượng task cần sửa, hoặc null để thêm mới.
 */
function openTaskModal(task = null) {
    const modal = document.getElementById('re-task-modal');
    const modalTitle = document.getElementById('re-task-modal-title');
    const form = document.getElementById('re-task-form');
    form.reset();

    if (task) { // Chế độ Sửa
        currentEditId = task.id;
        modalTitle.textContent = 'Chỉnh Sửa RE Task';
        document.getElementById('task-id').value = task.id;
        document.getElementById('task-category').value = task.category || '';
        document.getElementById('task-name').value = task.name || '';
        document.getElementById('task-frequency').value = task.frequency || '';
        document.getElementById('task-re-result').value = task.reResultMin ?? '';
        document.getElementById('task-daily-hours').value = task.dailyHours ?? '';
        document.getElementById('task-input-number').value = task.inputNumber ?? '';
        document.getElementById('task-re-unit').value = task.reUnit || '';
        document.getElementById('task-manual-number').value = task.manualNumber || '';
        document.getElementById('task-note').value = task.note || '';
    } else { // Chế độ Thêm
        currentEditId = null;
        modalTitle.textContent = 'Thêm RE Task Mới';
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => modal.classList.add('show'), 10);
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
 * Mở modal nhập hàng loạt.
 */
function openImportModal() {
    const modal = document.getElementById('import-tasks-modal');
    const form = document.getElementById('import-tasks-form');
    form.reset();
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

    const taskData = {
        category: document.getElementById('task-category').value.trim(),
        name: document.getElementById('task-name').value.trim(),
        frequency: document.getElementById('task-frequency').value.trim(),
        reResultMin: parseFloat(document.getElementById('task-re-result').value) || null,
        dailyHours: parseFloat(document.getElementById('task-daily-hours').value) || null,
        inputNumber: parseInt(document.getElementById('task-input-number').value, 10) || null,
        reUnit: document.getElementById('task-re-unit').value.trim(),
        manualNumber: document.getElementById('task-manual-number').value.trim(),
        note: document.getElementById('task-note').value.trim(),
    };

    if (!taskData.name) {
        window.showToast("Tên Task (Task Name in DWS) là bắt buộc.", "warning");
        return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Đang lưu...`;

    try {
        if (currentEditId) {
            // Cập nhật task đã có
            const taskRef = doc(db, 're_tasks', currentEditId);
            taskData.updatedAt = serverTimestamp();
            await updateDoc(taskRef, taskData);
            window.showToast('Đã cập nhật task thành công!', 'success');
        } else {
            // Thêm task mới
            taskData.createdAt = serverTimestamp();
            await addDoc(collection(db, 're_tasks'), taskData);
            window.showToast('Đã thêm task mới thành công!', 'success');
        }
        hideModal();
    } catch (error) {
        console.error("Lỗi khi lưu task:", error);
        window.showToast("Đã xảy ra lỗi khi lưu task.", "error");
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = `<i class="fas fa-save mr-2"></i>Lưu Task`;
    }
}

/**
 * Xử lý việc xóa một task.
 * @param {string} taskId - ID của task cần xóa.
 */
async function handleDeleteTask(taskId) {
    const confirmed = await window.showConfirmation(
        'Bạn có chắc chắn muốn xóa task này không? Hành động này không thể hoàn tác.',
        'Xác nhận xóa', 'Xóa', 'Hủy'
    );

    if (confirmed) {
        try {
            await deleteDoc(doc(db, 're_tasks', taskId));
            window.showToast('Đã xóa task thành công.', 'success');
        } catch (error) {
            console.error("Lỗi khi xóa task:", error);
            window.showToast('Đã xảy ra lỗi khi xóa task.', 'error');
        }
    }
}

/**
 * Xử lý việc nhập hàng loạt các task.
 * @param {Event} e - Sự kiện submit.
 */
async function handleBulkImportSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const textarea = document.getElementById('bulk-data');
    const rawData = textarea.value.trim();

    if (!rawData) {
        window.showToast("Vui lòng dán dữ liệu vào ô nhập.", "warning");
        return;
    }

    const lines = rawData.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
        window.showToast("Không có dữ liệu hợp lệ để nhập.", "warning");
        return;
    }

    // Thêm bước xác nhận trước khi xóa dữ liệu cũ
    const confirmed = await window.showConfirmation(
        'Hành động này sẽ <strong>XÓA TẤT CẢ</strong> dữ liệu RE Task hiện tại và thay thế bằng dữ liệu mới. Bạn có chắc chắn muốn tiếp tục không?',
        'Xác nhận Nhập và Ghi đè',
        'Xóa và Nhập mới',
        'Hủy'
    );

    if (!confirmed) {
        return; // Người dùng đã hủy
    }

    submitButton.disabled = true;
    submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Đang xử lý...`;

    try {
        const batch = writeBatch(db);
        let importedCount = 0;

        // Bước 1: Lấy và xóa tất cả các task cũ
        const tasksCollection = collection(db, 're_tasks');
        const oldTasksSnapshot = await getDocs(tasksCollection);
        oldTasksSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        lines.forEach((line, index) => {
            const columns = line.split('\t'); // Tách cột bằng ký tự tab
            const taskName = columns[1]?.trim();

            // Bỏ qua nếu không có tên task
            if (!taskName) return;

            const taskData = {
                category: columns[0]?.trim() || '',
                name: taskName,
                frequency: columns[2]?.trim() || '',
                reResultMin: parseFloat(columns[3]) || null,
                dailyHours: parseFloat(columns[4]) || null,
                inputNumber: parseInt(columns[5], 10) || null,
                reUnit: columns[6]?.trim() || '',
                manualNumber: columns[7]?.trim() || '',
                note: columns[8]?.trim() || '',
                createdAt: serverTimestamp(),
            };

            const newDocRef = doc(collection(db, 're_tasks'));
            batch.set(newDocRef, taskData);
            importedCount++;
        });

        await batch.commit();
        window.showToast(`Đã xóa dữ liệu cũ và nhập thành công ${importedCount} task mới!`, 'success');
        hideModal();
    } catch (error) {
        console.error("Lỗi khi nhập hàng loạt:", error);
        window.showToast("Đã xảy ra lỗi trong quá trình nhập. Vui lòng kiểm tra lại dữ liệu.", "error");
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = `<i class="fas fa-check mr-2"></i>Xác Nhận Nhập`;
    }
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
    document.getElementById('add-task-btn')?.addEventListener('click', () => openTaskModal(), { signal });
    document.getElementById('import-tasks-btn')?.addEventListener('click', openImportModal, { signal });
    document.getElementById('re-task-form')?.addEventListener('submit', handleFormSubmit, { signal });
    document.getElementById('import-tasks-form')?.addEventListener('submit', handleBulkImportSubmit, { signal });
    
    // Gắn sự kiện cho ô tìm kiếm
    document.getElementById('search-task-input')?.addEventListener('input', filterAndRender, { signal });

    // Gắn sự kiện cho phân trang
    document.getElementById('pagination-controls')?.addEventListener('click', (e) => {
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
            // Cần lấy lại dữ liệu đầy đủ của task để điền vào form
            const taskData = {
                id: taskId,
                category: row.cells[1].textContent,
                name: row.cells[2].textContent,
                frequency: row.cells[3].textContent,
                reResultMin: row.cells[4].textContent,
                dailyHours: row.cells[5].textContent,
                inputNumber: row.cells[6].textContent,
                reUnit: row.cells[7].textContent,
                manualNumber: row.cells[8].textContent,
                note: row.cells[9].textContent,
            };
            openTaskModal(taskData);
        }

        // Nút xóa
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            const taskId = deleteBtn.closest('tr').dataset.id;
            handleDeleteTask(taskId);
        }
    }, { signal });
}