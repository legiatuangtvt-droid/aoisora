const mainTasks = [
    { id: "1002", name: "Display Delica", description: "Kiểm tra và trưng bày hàng tươi Delica", group: "Trưng Bày Tươi Sống", duration: "30 phút" },
    { id: "1003", name: "Display Dry", description: "Sắp xếp lại khu vực hàng khô theo tiêu chuẩn", group: "Trưng Bày Hàng Khô", duration: "45 phút" },
    { id: "1004", name: "Check POP", description: "Kiểm tra và thay thế các biển POP đã cũ/sai giá", group: "Marketing & Giá", duration: "20 phút" },
    { id: "1010", name: "Check OOS", description: "Rà soát lỗi hết hàng (Out of Stock) và báo cáo", group: "Quản Lý Tồn Kho", duration: "60 phút" },
    { id: "2001", name: "Clean Floor Area", description: "Vệ sinh sàn khu vực Bán Hàng", group: "Vệ Sinh Chung", duration: "15 phút" },
];

// Biến để quản lý các listener, giúp dọn dẹp khi chuyển trang
let domController = null;

/**
 * Tạo badge màu dựa trên tên nhóm công việc.
 * @param {string} groupName - Tên nhóm.
 * @returns {string} - Chuỗi HTML của badge.
 */
function getGroupBadge(groupName) {
    let colorClass = 'bg-gray-100 text-gray-800';
    if (groupName.includes('Tươi Sống')) colorClass = 'bg-green-100 text-green-800';
    else if (groupName.includes('Hàng Khô')) colorClass = 'bg-blue-100 text-blue-800';
    else if (groupName.includes('Marketing') || groupName.includes('Giá')) colorClass = 'bg-yellow-100 text-yellow-800';
    else if (groupName.includes('Tồn Kho')) colorClass = 'bg-red-100 text-red-800';
    else if (groupName.includes('Vệ Sinh')) colorClass = 'bg-teal-100 text-teal-800';

    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}">${groupName}</span>`;
}

/**
 * Lọc và render lại danh sách công việc dựa trên nội dung ô tìm kiếm.
 */
function filterAndRenderTasks() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase().trim();

    if (!searchTerm) {
        renderMainTasks(mainTasks); // Render toàn bộ danh sách nếu không có từ khóa
        return;
    }

    const filteredTasks = mainTasks.filter(task => {
        return task.id.toLowerCase().includes(searchTerm) ||
               task.name.toLowerCase().includes(searchTerm) ||
               task.description.toLowerCase().includes(searchTerm);
    });

    renderMainTasks(filteredTasks);
}

/**
 * Render danh sách công việc chính ra bảng.
 */
function renderMainTasks() {
    const list = document.getElementById('main-tasks-list');
    if (!list) return;
    list.innerHTML = '';

    const tasksToRender = arguments.length > 0 ? arguments[0] : mainTasks;

    tasksToRender.forEach(task => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${task.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${task.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${task.description}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${getGroupBadge(task.group)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${task.duration}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" class="text-indigo-600 hover:text-indigo-900 mr-4"><i class="fas fa-edit mr-1"></i>Sửa</a>
                <a href="#" class="text-red-600 hover:text-red-900"><i class="fas fa-trash mr-1"></i>Xóa</a>
            </td>
        `;
        list.appendChild(row);
    });

    // Cập nhật tóm tắt
    const taskSummary = document.getElementById('task-summary');
    if (taskSummary) {
        taskSummary.textContent = `Hiển thị ${tasksToRender.length} trên ${mainTasks.length} Công việc Chính`;
    }
}

/**
 * Dọn dẹp tất cả các listener (sự kiện DOM) của module này.
 * Được gọi bởi main.js trước khi chuyển sang trang khác.
 */
export function cleanup() {
    // Hủy tất cả các event listener của DOM
    if (domController) {
        domController.abort();
    }
}

/**
 * Hàm khởi tạo, được gọi bởi main.js khi trang này được tải.
 */
export function init() {
    const mainAddTaskBtn = document.getElementById('main-add-task-btn');
    const addTaskForm = document.getElementById('add-task-form');

    // Khởi tạo controller cho các sự kiện DOM
    domController = new AbortController();

    renderMainTasks();

    // Gán sự kiện cho ô tìm kiếm
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterAndRenderTasks, { signal: domController.signal });
    }
    // Gán sự kiện cho nút mở Modal
    if (mainAddTaskBtn) {
        mainAddTaskBtn.addEventListener('click', () => showModal('task-modal'), { signal: domController.signal });
    }

    // Xử lý gửi form (Mô phỏng)
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const taskName = document.getElementById('task-name').value;
            const taskCode = document.getElementById('task-code').value;
            const taskGroup = document.getElementById('task-group').value;
            const taskDuration = document.getElementById('task-duration').value;
            const taskDescription = document.getElementById('task-description').value;

            const newTask = {
                id: taskCode,
                name: taskName,
                description: taskDescription,
                group: taskGroup,
                duration: taskDuration + ' phút'
            };

            // Thêm công việc mới vào mảng dữ liệu giả lập
            mainTasks.push(newTask);
            
            // Cập nhật lại danh sách hiển thị
            renderMainTasks();

            showToast(`Đã thêm thành công Công việc: ${taskName} (Mã: ${taskCode})`, 'success');
            hideModal();
            addTaskForm.reset();
        }, { signal: domController.signal });
    }
}