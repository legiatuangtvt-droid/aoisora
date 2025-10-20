import { db } from './firebase.js';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, doc, deleteDoc, updateDoc, getDoc, writeBatch, setDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Biến toàn cục để lưu trữ dữ liệu, giúp cho việc tìm kiếm không cần gọi lại Firestore
let allMainTasks = [];
let allTaskGroups = []; // Lưu trữ các nhóm để điền vào dropdown

// Biến để quản lý các listener, giúp dọn dẹp khi chuyển trang
let activeListeners = [];
let domController = null;

// Biến trạng thái cho phân trang
let currentPage = 1;
const ITEMS_PER_PAGE = 10;

// Tham chiếu đến các collection trên Firestore
const mainTasksCollection = collection(db, 'main_tasks');
const taskGroupsCollection = collection(db, 'task_groups');

/**
 * Bảng màu để tự động gán cho các nhóm công việc.
 */
const badgeColorPalette = [
    { bg: 'bg-green-100', text: 'text-green-800' },
    { bg: 'bg-blue-100', text: 'text-blue-800' },
    { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    { bg: 'bg-red-100', text: 'text-red-800' },
    { bg: 'bg-teal-100', text: 'text-teal-800' },
    { bg: 'bg-purple-100', text: 'text-purple-800' },
    { bg: 'bg-pink-100', text: 'text-pink-800' },
    { bg: 'bg-orange-100', text: 'text-orange-800' },
    { bg: 'bg-indigo-100', text: 'text-indigo-800' },
];

/**
 * Tạo badge màu dựa trên tên nhóm công việc.
 * @param {string} groupId - ID của nhóm để quyết định màu.
 * @param {string} groupName - Tên nhóm để hiển thị.
 * @returns {string} - Chuỗi HTML của badge.
 */
function getGroupBadge(groupId, groupName) {
    const defaultColor = { bg: 'bg-gray-100', text: 'text-gray-800' };
    if (!groupId) {
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${defaultColor.bg} ${defaultColor.text}">${groupName || 'Chưa phân loại'}</span>`;
    }
    const hash = groupId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = badgeColorPalette[hash % badgeColorPalette.length];
    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color.bg} ${color.text}">${groupName || groupId}</span>`;
}

/**
 * Lọc và render lại danh sách công việc dựa trên nội dung ô tìm kiếm.
 */
function filterAndRenderTasks() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    // Khi tìm kiếm, luôn quay về trang 1
    if (searchInput.value.toLowerCase().trim() !== (window.lastSearchTerm || '')) {
        currentPage = 1;
    }
    window.lastSearchTerm = searchInput.value.toLowerCase().trim();
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filteredTasks = searchTerm
        ? allMainTasks.filter(task =>
              task.id.toLowerCase().includes(searchTerm) ||
              task.name.toLowerCase().includes(searchTerm) ||
              (task.description || '').toLowerCase().includes(searchTerm)
          )
        : allMainTasks;

    // Logic phân trang
    const totalItems = filteredTasks.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    // Đảm bảo trang hiện tại không vượt quá tổng số trang
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const tasksToRender = filteredTasks.slice(startIndex, endIndex);

    renderMainTasks(tasksToRender);
    renderPaginationControls(totalPages, totalItems);
}

/**
 * Render các nút điều khiển phân trang.
 * @param {number} totalPages - Tổng số trang.
 * @param {number} totalItems - Tổng số công việc (sau khi lọc).
 */
function renderPaginationControls(totalPages, totalItems) {
    const container = document.getElementById('pagination-container');
    if (!container) return;
    container.innerHTML = '';

    if (totalPages <= 1) return; // Không hiển thị nếu chỉ có 1 trang

    // Nút "Trang trước"
    const prevButton = document.createElement('button');
    prevButton.innerHTML = `<i class="fas fa-chevron-left text-xs"></i>`;
    prevButton.className = 'px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            filterAndRenderTasks();
        }
    });
    container.appendChild(prevButton);

    // Hiển thị thông tin trang
    const pageInfo = document.createElement('span');
    pageInfo.className = 'px-3 py-1 text-sm text-gray-700';
    pageInfo.textContent = `Trang ${currentPage} / ${totalPages}`;
    container.appendChild(pageInfo);

    // Nút "Trang sau"
    const nextButton = document.createElement('button');
    nextButton.innerHTML = `<i class="fas fa-chevron-right text-xs"></i>`;
    nextButton.className = 'px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            filterAndRenderTasks();
        }
    });
    container.appendChild(nextButton);
}

/**
 * Render danh sách công việc chính của trang hiện tại ra bảng.
 */
function renderMainTasks(tasksToRender) {
    const list = document.getElementById('main-tasks-list');
    if (!list) return;
    
    if (!tasksToRender) {
        tasksToRender = allMainTasks;
    }

    const searchTerm = document.getElementById('search-input')?.value.trim();
    if (allMainTasks.length === 0) {
        list.innerHTML = `<tr><td colspan="6" class="text-center py-10 text-gray-500">Chưa có công việc chính nào. Hãy thêm một công việc mới!</td></tr>`;
    } else if (tasksToRender.length === 0 && searchTerm) {
        list.innerHTML = `<tr><td colspan="6" class="text-center py-10 text-gray-500">Không tìm thấy công việc nào khớp với "${searchTerm}".</td></tr>`;
    } else {
        list.innerHTML = '';
    }

    tasksToRender.forEach(task => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        // Tìm tên nhóm từ ID
        const group = allTaskGroups.find(g => g.id === task.groupId);
        let groupName;
        if (group) {
            // Nếu tìm thấy nhóm, hiển thị tên nhóm
            groupName = group.name;
        } else if (allTaskGroups.length > 0) {
            // Nếu đã có danh sách nhóm mà vẫn không tìm thấy, hiển thị mã ID
            groupName = task.groupId || 'Chưa có';
        } else {
            // Nếu danh sách nhóm chưa được tải, hiển thị trạng thái chờ
            groupName = 'Đang tải...';
        }

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">${task.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">${task.name}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${task.description || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
                ${getGroupBadge(task.groupId, groupName)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">${task.estimatedTime || 'N/A'} phút</td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button data-id="${task.id}" class="edit-task-btn text-indigo-600 hover:text-indigo-900 mr-4"><i class="fas fa-edit mr-1"></i>Sửa</button>
                <button data-id="${task.id}" class="delete-task-btn text-red-600 hover:text-red-900"><i class="fas fa-trash mr-1"></i>Xóa</button>
            </td>
        `;
        list.appendChild(row);
    });
    // Cập nhật tóm tắt
    const taskSummary = document.getElementById('task-summary');
    if (taskSummary) {
        const totalFiltered = (searchTerm ? tasksToRender.length : allMainTasks.length);
        const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
        const endItem = startItem + tasksToRender.length - 1;
        
        taskSummary.textContent = tasksToRender.length > 0 ? `Hiển thị từ ${startItem} đến ${endItem} trên tổng số ${allMainTasks.length} công việc` : `Hiển thị 0 trên ${allMainTasks.length} công việc`;
    }
}

/**
 * Dọn dẹp tất cả các listener (sự kiện DOM) của module này.
 * Được gọi bởi main.js trước khi chuyển sang trang khác.
 */
export function cleanup() {
    // Hủy tất cả các listener của Firestore
    activeListeners.forEach(unsubscribe => unsubscribe());
    activeListeners = [];

    // Hủy tất cả các event listener của DOM
    if (domController) {
        domController.abort();
    }
}

/**
 * Lắng nghe các thay đổi từ collection `main_tasks` và render lại bảng.
 */
function listenForMainTasksChanges() {
    const q = query(mainTasksCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        allMainTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        filterAndRenderTasks(); // Render lại với bộ lọc hiện tại
    }, (error) => {
        console.error("Lỗi khi lắng nghe thay đổi công việc chính: ", error);
        showToast("Mất kết nối tới dữ liệu công việc.", "error");
    });
    activeListeners.push(unsubscribe);
}

/**
 * Tải danh sách nhóm công việc và điền vào các dropdown.
 */
function listenForTaskGroupsChanges() {
    const q = query(taskGroupsCollection, orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        allTaskGroups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const addSelect = document.getElementById('task-group');
        const editSelect = document.getElementById('edit-task-group');
        if (!addSelect || !editSelect) return;

        addSelect.innerHTML = '<option value="">-- Chọn Nhóm --</option>';
        editSelect.innerHTML = '<option value="">-- Chọn Nhóm --</option>';

        allTaskGroups.forEach(group => {
            const option = `<option value="${group.id}">${group.name}</option>`;
            addSelect.innerHTML += option;
            editSelect.innerHTML += option;
        });

        // Render lại bảng công việc chính để cập nhật tên nhóm
        filterAndRenderTasks();
    });
    activeListeners.push(unsubscribe);
}

/**
 * Mở modal chỉnh sửa và điền dữ liệu cho một công việc.
 * @param {string} taskId - ID của công việc.
 */
async function openEditModal(taskId) {
    try {
        const docRef = doc(db, 'main_tasks', taskId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const task = docSnap.data();
            document.getElementById('edit-task-id').value = taskId;
            document.getElementById('edit-task-name').value = task.name;
            document.getElementById('edit-task-group').value = task.groupId || '';
            document.getElementById('edit-task-duration').value = task.estimatedTime || 15;
            document.getElementById('edit-task-description').value = task.description || '';
            showModal('edit-task-modal');
        } else {
            showToast("Không tìm thấy công việc để sửa.", "error");
        }
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu để sửa: ", error);
        showToast("Đã xảy ra lỗi khi lấy dữ liệu.", "error");
    }
}

/**
 * Tự động gợi ý mã công việc khi người dùng chọn một nhóm.
 * Ví dụ: Chọn nhóm "Vệ Sinh" (VS) -> Gợi ý mã "VS-101", "VS-102",...
 */
function suggestTaskCode() {
    const groupSelect = document.getElementById('task-group');
    const codeInput = document.getElementById('task-code');
    if (!groupSelect || !codeInput) return;

    const selectedGroupId = groupSelect.value;
    if (selectedGroupId) {
        codeInput.value = `${selectedGroupId}-${Math.floor(100 + Math.random() * 900)}`;
    }
}

/**
 * Hàm khởi tạo, được gọi bởi main.js khi trang này được tải.
 */
export function init() {
    const mainAddTaskBtn = document.getElementById('main-add-task-btn');
    const addTaskForm = document.getElementById('add-task-form');
    const editTaskForm = document.getElementById('edit-task-form');
    const taskList = document.getElementById('main-tasks-list');

    domController = new AbortController();

    // Bắt đầu lắng nghe dữ liệu từ Firestore
    listenForMainTasksChanges();
    listenForTaskGroupsChanges();

    // Gán sự kiện cho ô tìm kiếm
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterAndRenderTasks, { signal: domController.signal });
    }
    // Gán sự kiện cho các nút mở Modal
    if (mainAddTaskBtn) {
        mainAddTaskBtn.addEventListener('click', () => showModal('task-modal'), { signal: domController.signal });
    }

    // Gán sự kiện cho dropdown chọn nhóm để gợi ý mã công việc
    const taskGroupSelect = document.getElementById('task-group');
    if (taskGroupSelect) {
        taskGroupSelect.addEventListener('change', suggestTaskCode, { signal: domController.signal });
    }

    // Xử lý gửi form Thêm mới
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const taskName = document.getElementById('task-name').value;
            const taskCode = document.getElementById('task-code').value;
            const groupId = document.getElementById('task-group').value;
            const estimatedTime = document.getElementById('task-duration').value;
            const taskDescription = document.getElementById('task-description').value;
            const submitButton = addTaskForm.querySelector('button[type="submit"]');

            if (!taskCode || !taskName) {
                showToast("Mã và Tên công việc là bắt buộc.", "warning");
                return;
            }

            const newTask = {
                name: taskName,
                groupId: groupId,
                estimatedTime: Number(estimatedTime),
                description: taskDescription,
                createdAt: serverTimestamp()
            };

            // Vô hiệu hóa nút submit để tránh double-click
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Đang lưu...';

            try {
                const docRef = doc(db, 'main_tasks', taskCode);

                // 1. Kiểm tra xem mã công việc đã tồn tại chưa
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    showToast(`Mã công việc "${taskCode}" đã tồn tại. Vui lòng chọn mã khác.`, "error");
                    // Mở lại nút submit
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<i class="fas fa-save mr-1"></i> Lưu Công Việc';
                    return; // Dừng thực thi
                }

                // 2. Nếu chưa tồn tại, tiến hành thêm mới
                await setDoc(docRef, newTask);
                showToast(`Đã thêm thành công công việc: ${taskName}`, 'success');
                hideModal();
                addTaskForm.reset();
                // Reset cả dropdown về giá trị mặc định
                document.getElementById('task-group').value = "";
            } catch (error) {
                console.error("Lỗi khi thêm công việc: ", error);
                showToast("Lỗi khi thêm công việc. Vui lòng thử lại.", "error");
            } finally {
                // 3. Dù thành công hay thất bại, hãy kích hoạt lại nút bấm
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<i class="fas fa-save mr-1"></i> Lưu Công Việc';
                }
            }
        }, { signal: domController.signal });
    }

    // Xử lý gửi form Chỉnh sửa
    if (editTaskForm) {
        editTaskForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const taskId = document.getElementById('edit-task-id').value;
            const updatedData = {
                name: document.getElementById('edit-task-name').value,
                groupId: document.getElementById('edit-task-group').value,
                estimatedTime: Number(document.getElementById('edit-task-duration').value),
                description: document.getElementById('edit-task-description').value,
            };

            try {
                const docRef = doc(db, 'main_tasks', taskId);
                await updateDoc(docRef, updatedData);
                showToast(`Đã cập nhật công việc: ${updatedData.name}`, 'success');
                hideModal();
            } catch (error) {
                console.error("Lỗi khi cập nhật công việc: ", error);
                showToast("Lỗi khi cập nhật công việc.", "error");
            }
        }, { signal: domController.signal });
    }

    // Sử dụng event delegation cho các nút Sửa/Xóa
    if (taskList) {
        taskList.addEventListener('click', async (e) => {
            const editBtn = e.target.closest('.edit-task-btn');
            if (editBtn) {
                const taskId = editBtn.dataset.id;
                openEditModal(taskId);
                return;
            }

            const deleteBtn = e.target.closest('.delete-task-btn');
            if (deleteBtn) {
                const taskId = deleteBtn.dataset.id;
                const confirmed = await showConfirmation(`Bạn có chắc chắn muốn xóa công việc có mã "${taskId}" không?`);
                if (confirmed) {
                    try {
                        await deleteDoc(doc(db, 'main_tasks', taskId));
                        showToast(`Đã xóa công việc ${taskId}.`, 'success');
                    } catch (error) {
                        console.error("Lỗi khi xóa công việc: ", error);
                        showToast("Lỗi khi xóa công việc.", "error");
                    }
                }
            }
        }, { signal: domController.signal });
    }
}