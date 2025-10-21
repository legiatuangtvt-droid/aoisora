import { db } from './firebase.js';
import { collection, getDocs, onSnapshot, query, orderBy, doc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let activeListeners = [];

// Bảng màu để người dùng có thể chọn cho mỗi nhóm
const colorPalette = [
    { name: 'slate', bg: 'bg-slate-50', border: 'border-slate-200', hover: 'hover:bg-slate-100' },
    { name: 'green', bg: 'bg-green-50', border: 'border-green-200', hover: 'hover:bg-green-100' },
    { name: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', hover: 'hover:bg-blue-100' },
    { name: 'amber', bg: 'bg-amber-50', border: 'border-amber-200', hover: 'hover:bg-amber-100' },
    { name: 'teal', bg: 'bg-teal-50', border: 'border-teal-200', hover: 'hover:bg-teal-100' },
    { name: 'purple', bg: 'bg-purple-50', border: 'border-purple-200', hover: 'hover:bg-purple-100' },
    { name: 'indigo', bg: 'bg-indigo-50', border: 'border-indigo-200', hover: 'hover:bg-indigo-100' },
    { name: 'red', bg: 'bg-red-50', border: 'border-red-200', hover: 'hover:bg-red-100' },
    { name: 'pink', bg: 'bg-pink-50', border: 'border-pink-200', hover: 'hover:bg-pink-100' },
];

// Key để lưu trạng thái màu vào localStorage
const GROUP_COLORS_STORAGE_KEY = 'taskGroupColors';

/**
 * Render toàn bộ nội dung trang, bao gồm thống kê và các thẻ nhóm công việc.
 */
async function renderPage() {
    try {
        // Sử dụng getDocs thay vì onSnapshot vì trang này chủ yếu để hiển thị, không cần real-time phức tạp
        const q = query(collection(db, 'task_groups'), orderBy("order"));
        const querySnapshot = await getDocs(q);
        const taskGroups = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        renderStatistics(taskGroups);
        renderGroupCards(taskGroups);
        addGroupCardEventListeners(); // Thêm listener sau khi render

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu nhóm công việc:", error);
        window.showToast("Không thể tải dữ liệu. Vui lòng thử lại.", "error");
        document.getElementById('task-groups-container').innerHTML = `<p class="text-red-500">Lỗi tải dữ liệu.</p>`;
    }
}

/**
 * Render khu vực thống kê.
 * @param {Array} taskGroups - Mảng các nhóm công việc.
 */
function renderStatistics(taskGroups) {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;

    let totalTasks = 0;
    let dailyTasks = 0;
    let weeklyTasks = 0;
    let monthlyTasks = 0;
    let yearlyTasks = 0;
    let otherTasks = 0;

    taskGroups.forEach(group => {
        if (group.tasks && Array.isArray(group.tasks)) {
            totalTasks += group.tasks.length;
            group.tasks.forEach(task => {
                switch (task.frequency) {
                    case 'Daily':
                        dailyTasks++;
                        break;
                    case 'Weekly':
                        weeklyTasks++;
                        break;
                    case 'Monthly':
                        monthlyTasks++;
                        break;
                    case 'Yearly':
                        yearlyTasks++;
                        break;
                    default:
                        otherTasks++;
                        break;
                }
            });
        }
    });

    const stats = [
        { title: 'Tổng số Task', value: totalTasks, icon: 'fa-tasks' },
        { title: 'Daily Task', value: dailyTasks, icon: 'fa-sun' },
        { title: 'Weekly', value: weeklyTasks, icon: 'fa-calendar-week' },
        { title: 'Monthly', value: monthlyTasks, icon: 'fa-calendar-alt' },
        { title: 'Yearly', value: yearlyTasks, icon: 'fa-calendar-check' },
        { title: 'Khác', value: otherTasks, icon: 'fa-asterisk' }
    ];

    statsContainer.innerHTML = stats.map(stat => `
        <div class="stat-card flex items-baseline gap-3 border border-gray-200 p-4">
            <div class="stat-icon text-gray-500"><i class="fas fa-lg ${stat.icon}"></i></div>
            <p class="text-sm font-medium text-gray-600 whitespace-nowrap">${stat.title}:</p>
            <p class="text-xl font-bold text-gray-900">${stat.value}</p>
        </div>
    `).join('');
}

/**
 * Render các thẻ nhóm công việc.
 * @param {Array} taskGroups - Mảng các nhóm công việc.
 */
function renderGroupCards(taskGroups) {
    const groupsContainer = document.getElementById('task-groups-container');
    if (!groupsContainer) return;

    // Lấy màu đã lưu từ localStorage
    const savedColors = JSON.parse(localStorage.getItem(GROUP_COLORS_STORAGE_KEY) || '{}');

    const defaultTaskColor = colorPalette.find(c => c.name === 'slate') || colorPalette[0];

    groupsContainer.innerHTML = taskGroups.map(group => {
        const currentColorName = savedColors[group.code] || group.color || 'slate';
        const color = colorPalette.find(c => c.name === currentColorName) || colorPalette[0];

        const headerCell = `
            <div class="group-order-card bg-slate-100 text-slate-800 p-2 rounded border border-slate-200 flex flex-col items-center justify-center text-center w-28 h-[161px] flex-shrink-0">
                <p class="font-bold text-4xl">${group.order}</p>
            </div>
            <div class="group-code-card ${color.bg} text-slate-800 rounded ${color.border} flex flex-col items-center justify-between text-center w-28 h-[161px] flex-shrink-0 cursor-pointer transition-colors ${color.hover}" data-group-code="${group.code}">
                <div class="w-full text-xs font-semibold py-0.5 bg-black/10 rounded-t">
                    Group Task
                </div>
                <h3 class="font-bold text-2xl">${group.code}</h3>
                <div class="w-full text-xs font-semibold py-0.5 bg-black/10 rounded-b">
                    Total Tasks: ${group.tasks?.length || 0}
                </div>
            </div>
        `;

        const sortedTasks = (group.tasks || []).sort((a, b) => a.order - b.order);
        let taskCells = '';
        for (let i = 0; i < sortedTasks.length; i += 4) {
            const chunk = sortedTasks.slice(i, i + 4);
            
            const orderRow = chunk.map(task => `
                <div class="w-[70px] text-center text-sm font-semibold text-green-800">${task.order}</div>
            `).join('<div class="w-3"></div>'); // Spacer

            const taskRow = chunk.map(task => {
                const generatedCode = `1${group.order}${String(task.order).padStart(2, '0')}`;
                return `
                    <div class="task-card ${defaultTaskColor.bg} rounded ${defaultTaskColor.border} flex flex-col items-center justify-between text-center w-[70px] h-[100px] flex-shrink-0 transition-all ${defaultTaskColor.hover} hover:shadow-md cursor-pointer" data-task-order="${task.order}">
                        <div class="flex-1 flex flex-col justify-center items-center px-1 pt-2 pb-1">
                            <p class="text-sm font-medium text-slate-800 leading-tight">${task.name}</p>
                        </div>
                        <p class="text-xs font-semibold text-slate-500 pb-1.5">${generatedCode}</p>
                    </div>
                `;
            }).join('');

            taskCells += `
                <div class="task-chunk flex flex-col flex-shrink-0 border-y border-r border-gray-200 bg-white">
                    <div class="flex flex-nowrap bg-green-200 py-1">
                        ${orderRow}
                    </div>
                    <div class="flex flex-nowrap gap-3 p-2">
                        ${taskRow}
                    </div>
                </div>
            `;
        }

        const actionCell = `
            <div class="action-card flex flex-col items-center justify-center gap-4 text-center w-28 h-[161px] flex-shrink-0 bg-slate-50 border border-slate-200 rounded-lg">
                <button class="add-task-to-group-btn text-slate-500 hover:text-blue-600 transition-colors" data-group-code="${group.code}" title="Thêm Task vào nhóm ${group.code}">
                    <i class="fas fa-plus fa-2x"></i>
                </button>
                <button class="edit-group-btn text-slate-500 hover:text-indigo-600 transition-colors" data-group-code="${group.code}" title="Sửa thông tin nhóm ${group.code}">
                    <i class="fas fa-pencil-alt fa-2x"></i>
                </button>
            </div>
        `;

        return `
            <div class="group-row flex items-start gap-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                ${headerCell}
                <div class="tasks-scroll-container flex-1 overflow-x-auto"><div class="tasks-list-inner flex flex-nowrap">${taskCells}</div></div>
                ${actionCell}
            </div>
        `;
    }).join('');
}

/**
 * Thêm các event listener cho các thẻ code của nhóm để đổi màu.
 */
function addGroupCardEventListeners() {
    // Sử dụng event delegation trên container để xử lý click
    const container = document.getElementById('task-groups-container');
    if (!container) return;

    container.addEventListener('click', (e) => {
        const groupCodeCard = e.target.closest('.group-code-card');
        if (groupCodeCard) {
            showColorPalette(groupCodeCard);
        }

        const taskCard = e.target.closest('.task-card');
        if (taskCard) {
            const groupRow = taskCard.closest('.group-row');
            const groupCode = groupRow.querySelector('.group-code-card').dataset.groupCode;
            const taskOrder = taskCard.dataset.taskOrder;
            showEditTaskModal(groupCode, parseInt(taskOrder, 10));
        }

        const addTaskBtn = e.target.closest('.add-task-to-group-btn');
        if (addTaskBtn) {
            const groupCode = addTaskBtn.dataset.groupCode;
            showAddTaskModal(groupCode);
        }

        const editGroupBtn = e.target.closest('.edit-group-btn');
        if (editGroupBtn) {
            const groupCode = editGroupBtn.dataset.groupCode;
            showEditGroupModal(groupCode);
        }
    });
}

/**
 * Hiển thị một popup bảng màu bên cạnh thẻ được nhấp.
 * @param {HTMLElement} targetCard - Thẻ code của nhóm được nhấp vào.
 */
function showColorPalette(targetCard) {
    // Xóa bất kỳ bảng màu nào đang tồn tại
    const existingPalette = document.getElementById('color-palette-popup');
    if (existingPalette) {
        existingPalette.remove();
    }

    const groupCode = targetCard.dataset.groupCode;
    if (!groupCode) return;

    // Tạo container cho bảng màu
    const palettePopup = document.createElement('div');
    palettePopup.id = 'color-palette-popup';
    palettePopup.className = 'absolute z-20 bg-white border border-gray-300 rounded-lg shadow-xl p-2 grid grid-cols-5 gap-2';

    // Điền các ô màu vào bảng màu
    palettePopup.innerHTML = colorPalette.map(color => `
        <div class="w-6 h-6 rounded-full cursor-pointer ${color.bg} border-2 ${color.border} hover:scale-110 transition-transform" 
             data-color-name="${color.name}" 
             title="${color.name}">
        </div>
    `).join('');

    document.body.appendChild(palettePopup);

    // Định vị bảng màu
    const cardRect = targetCard.getBoundingClientRect();
    palettePopup.style.left = `${cardRect.right + 10}px`;
    palettePopup.style.top = `${cardRect.top}px`;

    // Thêm listener cho các ô màu
    palettePopup.addEventListener('click', (e) => {
        const colorSwatch = e.target.closest('[data-color-name]');
        if (colorSwatch) {
            const newColorName = colorSwatch.dataset.colorName;
            updateGroupColor(groupCode, newColorName);
            palettePopup.remove(); // Đóng popup sau khi chọn
        }
    });

    // Thêm listener để đóng popup khi click ra ngoài
    setTimeout(() => {
        document.addEventListener('click', (e) => {
            if (!palettePopup.contains(e.target) && e.target !== targetCard && !targetCard.contains(e.target)) {
                palettePopup.remove();
            }
        }, { once: true });
    }, 0);
}

/**
 * Cập nhật màu cho một nhóm công việc cụ thể.
 * @param {string} groupCode - Mã của nhóm.
 * @param {string} newColorName - Tên màu mới từ bảng màu.
 */
function updateGroupColor(groupCode, newColorName) {
    const groupCodeCard = document.querySelector(`.group-code-card[data-group-code="${groupCode}"]`);
    if (!groupCodeCard) return;

    const newColor = colorPalette.find(c => c.name === newColorName) || colorPalette[0];

    // Cập nhật localStorage
    const savedColors = JSON.parse(localStorage.getItem(GROUP_COLORS_STORAGE_KEY) || '{}');
    savedColors[groupCode] = newColor.name;
    localStorage.setItem(GROUP_COLORS_STORAGE_KEY, JSON.stringify(savedColors));

    // Cập nhật màu cho ô code trong DOM
    // Xóa các class màu cũ
    colorPalette.forEach(color => {
        groupCodeCard.classList.remove(color.bg, color.border, color.hover);
    });
    // Thêm class màu mới
    groupCodeCard.classList.add(newColor.bg, newColor.border, newColor.hover);

    // Hiển thị thông báo nhỏ
    window.showToast(`Nhóm ${groupCode} đã đổi sang màu '${newColor.name}'`, 'info', 2000);
}

/**
 * Ẩn modal được chỉ định.
 * @param {string} modalId ID của modal cần ẩn.
 */
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('show');
    const onTransitionEnd = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        const form = modal.querySelector('form');
        if (form) form.reset();
        modal.removeEventListener('transitionend', onTransitionEnd);
    };
    modal.addEventListener('transitionend', onTransitionEnd);
}

//#region ADD TASK MODAL
/**
 * Tạo và chèn modal thêm task vào DOM nếu chưa tồn tại.
 */
function injectAddTaskModal() {
    if (document.getElementById('add-task-to-group-modal')) return;

    const modalHTML = `
        <div id="add-task-to-group-modal" class="modal-overlay hidden">
            <div class="modal-content max-w-md w-full">
                <form id="add-task-to-group-form">
                    <div class="modal-header">
                        <h3 class="modal-title">Thêm Task Mới vào Nhóm</h3>
                        <button type="button" class="modal-close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="add-task-group-code">Nhóm</label>
                            <input type="text" id="add-task-group-code" name="groupCode" readonly class="form-input bg-gray-100 cursor-not-allowed">
                        </div>
                        <div class="form-group">
                            <label for="add-task-name">Tên Task <span class="text-red-500">*</span></label>
                            <input type="text" id="add-task-name" name="name" required class="form-input" placeholder="Ví dụ: Lau sàn khu vực A">
                        </div>
                        <div class="form-group">
                            <label for="add-task-order">Thứ tự (Order) <span class="text-red-500">*</span></label>
                            <input type="number" id="add-task-order" name="order" required class="form-input" min="1" placeholder="Ví dụ: 1, 2, 3...">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label for="add-task-frequency">Tần suất</label>
                                <select id="add-task-frequency" name="frequency" class="form-input">
                                    <option value="Daily" selected>Hàng ngày (Daily)</option>
                                    <option value="Weekly">Hàng tuần (Weekly)</option>
                                    <option value="Monthly">Hàng tháng (Monthly)</option>
                                    <option value="Yearly">Hàng năm (Yearly)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="add-task-manual-number">Số Manual</label>
                                <input type="text" id="add-task-manual-number" name="manual_number" class="form-input" placeholder="Ví dụ: 12345">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="add-task-manual-link">Link Manual</label>
                            <input type="text" id="add-task-manual-link" name="manual_link" class="form-input" placeholder="Dán link tài liệu hướng dẫn...">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-close-btn">Hủy</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save mr-1"></i> Lưu Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Gắn listener cho modal vừa tạo
    const modal = document.getElementById('add-task-to-group-modal');
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay') || e.target.closest('.modal-close-btn')) {
            hideModal('add-task-to-group-modal');
        }
    });

    document.getElementById('add-task-to-group-form').addEventListener('submit', handleAddTaskSubmit);
}

/**
 * Hiển thị modal thêm task.
 * @param {string} groupCode Mã nhóm để thêm task vào.
 */
function showAddTaskModal(groupCode) {
    document.getElementById('add-task-group-code').value = groupCode;
    
    const modal = document.getElementById('add-task-to-group-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => modal.classList.add('show'), 10);
}

/**
 * Xử lý việc submit form thêm task mới.
 * @param {Event} e 
 */
async function handleAddTaskSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const groupCode = form.elements.groupCode.value;
    const taskName = form.elements.name.value.trim();
    const taskOrder = parseInt(form.elements.order.value, 10);
    const frequency = form.elements.frequency.value;
    const manualNumber = form.elements.manual_number.value.trim();
    const manualLink = form.elements.manual_link.value.trim();
    const submitButton = form.querySelector('button[type="submit"]');

    if (!groupCode || !taskName || isNaN(taskOrder)) {
        window.showToast("Vui lòng điền đầy đủ thông tin hợp lệ.", "warning");
        return;
    }

    const newTask = {
        name: taskName,
        order: taskOrder,
        frequency: frequency,
        manual_number: manualNumber || null,
        manual_link: manualLink || ''
    };

    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Đang lưu...';

    try {
        // Để xử lý việc chèn và cập nhật order, chúng ta cần đọc, sửa, rồi ghi lại.
        const groupDocRef = doc(db, 'task_groups', groupCode);
        const docSnap = await getDoc(groupDocRef);

        if (!docSnap.exists()) {
            throw new Error(`Không tìm thấy nhóm với mã: ${groupCode}`);
        }

        let tasks = docSnap.data().tasks || [];

        // Kiểm tra xem order đã tồn tại chưa và cập nhật các order khác nếu cần
        const orderExists = tasks.some(task => task.order === taskOrder);
        if (orderExists) {
            tasks = tasks.map(task => {
                if (task.order >= taskOrder) {
                    return { ...task, order: task.order + 1 };
                }
                return task;
            });
        }

        tasks.push(newTask);

        await updateDoc(groupDocRef, {
            tasks: tasks
        });
        window.showToast(`Đã thêm task "${taskName}" vào nhóm ${groupCode}.`, 'success');
        hideModal('add-task-to-group-modal');
        renderPage(); // Render lại trang để cập nhật
    } catch (error) {
        console.error("Lỗi khi thêm task vào nhóm:", error);
        window.showToast("Đã xảy ra lỗi. Vui lòng thử lại.", "error");
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-save mr-1"></i> Lưu Task';
    }
}
//#endregion

//#region EDIT GROUP MODAL
/**
 * Tạo và chèn modal chỉnh sửa nhóm vào DOM nếu chưa tồn tại.
 */
function injectEditGroupModal() {
    if (document.getElementById('edit-group-modal')) return;

    const modalHTML = `
        <div id="edit-group-modal" class="modal-overlay hidden">
            <div class="modal-content max-w-md w-full">
                <form id="edit-group-form">
                    <div class="modal-header">
                        <h3 class="modal-title">Chỉnh Sửa Nhóm Công Việc</h3>
                        <button type="button" class="modal-close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="edit-group-code">Mã Nhóm</label>
                            <input type="text" id="edit-group-code" name="groupCode" readonly class="form-input bg-gray-100 cursor-not-allowed">
                        </div>
                        <div class="form-group">
                            <label for="edit-group-name">Tên Nhóm <span class="text-red-500">*</span></label>
                            <input type="text" id="edit-group-name" name="groupName" required class="form-input" placeholder="Ví dụ: Vệ Sinh Chung">
                        </div>
                        <div class="form-group">
                            <label for="edit-group-order">Thứ tự (Order) <span class="text-red-500">*</span></label>
                            <input type="number" id="edit-group-order" name="groupOrder" required class="form-input" min="1" placeholder="Ví dụ: 1, 2, 3...">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-close-btn">Hủy</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save mr-1"></i> Cập Nhật Nhóm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Gắn listener cho modal vừa tạo
    const modal = document.getElementById('edit-group-modal');
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay') || e.target.closest('.modal-close-btn')) {
            hideModal('edit-group-modal');
        }
    });

    document.getElementById('edit-group-form').addEventListener('submit', handleEditGroupSubmit);
}

/**
 * Hiển thị modal chỉnh sửa nhóm và điền dữ liệu hiện có.
 * @param {string} groupCode Mã nhóm cần chỉnh sửa.
 */
async function showEditGroupModal(groupCode) {
    try {
        const groupDocRef = doc(db, 'task_groups', groupCode);
        const docSnap = await getDoc(groupDocRef);

        if (docSnap.exists()) {
            const groupData = docSnap.data();
            document.getElementById('edit-group-code').value = groupCode;
            document.getElementById('edit-group-name').value = groupData.name || '';
            document.getElementById('edit-group-order').value = groupData.order || 1;
            
            const modal = document.getElementById('edit-group-modal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => modal.classList.add('show'), 10);
        } else {
            window.showToast(`Không tìm thấy nhóm "${groupCode}" để chỉnh sửa.`, 'error');
        }
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu nhóm để chỉnh sửa:", error);
        window.showToast("Đã xảy ra lỗi khi tải dữ liệu nhóm.", "error");
    }
}

/**
 * Xử lý việc submit form chỉnh sửa nhóm.
 * @param {Event} e 
 */
async function handleEditGroupSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const groupCode = form.elements.groupCode.value;
    const groupName = form.elements.groupName.value.trim();
    const groupOrder = parseInt(form.elements.groupOrder.value, 10);

    if (!groupCode || !groupName || isNaN(groupOrder)) {
        window.showToast("Vui lòng điền đầy đủ thông tin hợp lệ.", "warning");
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Đang cập nhật...';

    try {
        const groupDocRef = doc(db, 'task_groups', groupCode);
        await updateDoc(groupDocRef, {
            name: groupName,
            order: groupOrder
        });
        window.showToast(`Đã cập nhật nhóm "${groupName}" (${groupCode}).`, 'success');
        hideModal('edit-group-modal');
        renderPage(); // Render lại trang để cập nhật
    } catch (error) {
        console.error("Lỗi khi cập nhật nhóm:", error);
        window.showToast("Đã xảy ra lỗi khi cập nhật nhóm. Vui lòng thử lại.", "error");
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-save mr-1"></i> Cập Nhật Nhóm';
    }
}
//#endregion

//#region EDIT TASK MODAL
/**
 * Tạo và chèn modal chỉnh sửa task vào DOM nếu chưa tồn tại.
 */
function injectEditTaskModal() {
    if (document.getElementById('edit-task-modal')) return;

    const modalHTML = `
        <div id="edit-task-modal" class="modal-overlay hidden">
            <div class="modal-content max-w-md w-full">
                <form id="edit-task-form">
                    <div class="modal-header">
                        <h3 class="modal-title">Chỉnh Sửa Task</h3>
                        <button type="button" class="modal-close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="edit-task-group-code" name="groupCode">
                        <input type="hidden" id="edit-task-original-order" name="originalOrder">
                        <div class="form-group">
                            <label for="edit-task-name">Tên Task <span class="text-red-500">*</span></label>
                            <input type="text" id="edit-task-name" name="name" required class="form-input">
                        </div>
                        <div class="form-group">
                            <label for="edit-task-order">Thứ tự (Order) <span class="text-red-500">*</span></label>
                            <input type="number" id="edit-task-order" name="order" required class="form-input" min="1">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label for="edit-task-frequency">Tần suất</label>
                                <select id="edit-task-frequency" name="frequency" class="form-input">
                                    <option value="Daily">Hàng ngày (Daily)</option>
                                    <option value="Weekly">Hàng tuần (Weekly)</option>
                                    <option value="Monthly">Hàng tháng (Monthly)</option>
                                    <option value="Yearly">Hàng năm (Yearly)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="edit-task-manual-number">Số Manual</label>
                                <input type="text" id="edit-task-manual-number" name="manual_number" class="form-input">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="edit-task-manual-link">Link Manual</label>
                            <input type="text" id="edit-task-manual-link" name="manual_link" class="form-input">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-close-btn">Hủy</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save mr-1"></i> Lưu Thay Đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('edit-task-modal');
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay') || e.target.closest('.modal-close-btn')) {
            hideModal('edit-task-modal');
        }
    });

    document.getElementById('edit-task-form').addEventListener('submit', handleEditTaskSubmit);
}

/**
 * Hiển thị modal chỉnh sửa task và điền dữ liệu.
 * @param {string} groupCode Mã nhóm chứa task.
 * @param {number} taskOrder Thứ tự của task cần sửa.
 */
async function showEditTaskModal(groupCode, taskOrder) {
    try {
        const groupDocRef = doc(db, 'task_groups', groupCode);
        const docSnap = await getDoc(groupDocRef);

        if (docSnap.exists()) {
            const tasks = docSnap.data().tasks || [];
            // Sử dụng so sánh lỏng (==) để bỏ qua sự khác biệt giữa number và string.
            // Ví dụ: 1 == "1" là true, trong khi 1 === "1" là false.
            // Điều này giúp tìm thấy task ngay cả khi 'order' trong Firestore được lưu dưới dạng string.
            const taskToEdit = tasks.find(t => t.order == taskOrder);

            if (taskToEdit) {
                document.getElementById('edit-task-group-code').value = groupCode;
                document.getElementById('edit-task-original-order').value = taskToEdit.order;
                document.getElementById('edit-task-name').value = taskToEdit.name;
                document.getElementById('edit-task-order').value = taskToEdit.order;
                document.getElementById('edit-task-frequency').value = taskToEdit.frequency || 'Daily';
                document.getElementById('edit-task-manual-number').value = taskToEdit.manual_number || '';
                document.getElementById('edit-task-manual-link').value = taskToEdit.manual_link || '';
                const modal = document.getElementById('edit-task-modal');
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                setTimeout(() => modal.classList.add('show'), 10);
            } else {
                console.error(`Không tìm thấy task với order ${taskOrder} trong nhóm ${groupCode}.`);
                window.showToast(`Không tìm thấy task với order ${taskOrder} trong nhóm ${groupCode}.`, 'error');
            }
        }
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu task để sửa:", error);
        window.showToast("Đã xảy ra lỗi khi tải dữ liệu task.", "error");
    }
}

/**
 * Xử lý việc submit form chỉnh sửa task.
 * @param {Event} e 
 */
async function handleEditTaskSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const groupCode = form.elements.groupCode.value;
    const originalOrder = parseInt(form.elements.originalOrder.value, 10);
    const newName = form.elements.name.value.trim();
    const newOrder = parseInt(form.elements.order.value, 10);
    const newFrequency = form.elements.frequency.value;
    const newManualNumber = form.elements.manual_number.value.trim();
    const newManualLink = form.elements.manual_link.value.trim();

    if (!groupCode || !newName || isNaN(newOrder)) {
        window.showToast("Vui lòng điền đầy đủ thông tin hợp lệ.", "warning");
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Đang lưu...';

    try {
        const groupDocRef = doc(db, 'task_groups', groupCode);
        const docSnap = await getDoc(groupDocRef);
        let tasks = docSnap.data().tasks || [];

        // Tìm task gốc và lọc ra các task khác
        const taskToUpdate = tasks.find(t => t.order === originalOrder);
        const otherTasks = tasks.filter(t => t.order !== originalOrder);

        if (!taskToUpdate) {
            throw new Error(`Không tìm thấy task gốc với order ${originalOrder} để cập nhật.`);
        }

        // Nếu order mới đã tồn tại, đẩy các order khác lên
        // Chỉ thực hiện nếu order thực sự thay đổi
        if (originalOrder !== newOrder && otherTasks.some(t => t.order === newOrder)) {
            otherTasks.forEach(t => {
                if (t.order >= newOrder) t.order++;
            });
        }

        // Tạo task đã cập nhật và thêm lại vào mảng
        // Kế thừa các thuộc tính cũ và ghi đè những thuộc tính mới
        const updatedTask = {
            ...taskToUpdate, // Kế thừa tất cả thuộc tính của task gốc
            name: newName,
            order: newOrder,
            frequency: newFrequency,
            manual_number: newManualNumber || null,
            manual_link: newManualLink || ''
        };
        const finalTasks = [...otherTasks, updatedTask];

        await updateDoc(groupDocRef, { tasks: finalTasks });

        window.showToast(`Đã cập nhật task "${newName}".`, 'success');
        hideModal('edit-task-modal');
        renderPage();
    } catch (error) {
        console.error("Lỗi khi cập nhật task:", error);
        window.showToast("Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại.", "error");
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-save mr-1"></i> Lưu Thay Đổi';
    }
}
//#endregion

/**
 * Dọn dẹp tất cả các listener (sự kiện DOM, Firestore) của module này.
 * Được gọi bởi main.js trước khi chuyển sang trang khác.
 */
export function cleanup() {
    // Hủy tất cả các listener của Firestore
    activeListeners.forEach(unsubscribe => unsubscribe && unsubscribe());
    activeListeners = [];
}

/**
 * Hàm khởi tạo, được gọi bởi main.js khi trang này được tải.
 */
export function init() {
    injectEditTaskModal();
    injectEditGroupModal();
    injectAddTaskModal();
    renderPage();
}
