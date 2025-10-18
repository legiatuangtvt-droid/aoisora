/**
 * Do Task - Logic for the do-task.html screen.
 * Encapsulated to avoid global scope pollution.
 */
(function () {
    'use strict';

    //================================================================================
    // CONFIG & CONSTANTS
    //================================================================================
    const API_URL = window.location.hostname === 'localhost' ? 'http://localhost/auraProject/api' : 'https://auraorientalis.vn/auraProject/api';
    const DEPT_COLORS = {
        12: "#8ecae6", 13: "#219ebc", 14: "#bde0fe", 15: "#ffd54f",
        16: "#ffc8dd", 17: "#c5e1a5", 18: "#ffafcc"
    };
    const MEMBER_COLORS = ["#ffb703", "#fb8500", "#9b5de5", "#00b4d8", "#d00000", "#4caf50", "#6a4c93"];
    const STATUS_MAP = {
        YES: 9,  // Done
        NO: 12  // Confirm
    };

    //================================================================================
    // DOM & STATE
    //================================================================================
    const dom = {
        backButton: document.getElementById('back-button'),
        taskIndex: document.getElementById('task-index'),
        deptSquare: document.getElementById('dept-square'),
        userCircle: document.getElementById('user-circle'),
        taskName: document.getElementById('task-name'),
        taskMeta: document.getElementById('task-meta'),
        teachmeLink: document.getElementById('teachme-link'),
        fileLink: document.getElementById('file-link'),
        responsiblePersonTitle: document.getElementById('responsible-person-title'),
        responsiblePersonContainer: document.getElementById('responsible-person-container'),
        commentInput: document.getElementById('comment-input'),
        registerButton: document.getElementById('register-button'),
        photoContainer: document.querySelector('.photo-container'),
        checklistContainer: document.getElementById('checklist-container'),
        canCompleteSection: document.getElementById('can-complete-section'),
        confirmChecklistButton: document.getElementById('confirm-checklist-button'),
        userInfoDisplay: document.getElementById('user-info-display'),
    };

    const taskUpdateChannel = new BroadcastChannel('task_updates');
    const state = {
        task: null,
        staff: [],
        allStaff: [], // Thêm để lưu tất cả nhân viên cho user switcher
        uploadedImages: [],
        manual: null, // Thêm state để lưu thông tin manual
        currentUserId: null,
        currentUserData: null,
        isCurrentUserAManager: false,
    };

    //================================================================================
    // API & DATA FETCHING
    //================================================================================
    async function fetchFromAPI(endpoint) {
        try {
            const [path, queryString] = endpoint.split('?');
            const url = `${API_URL}/${path}.php${queryString ? '?' + queryString : ''}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            showToast(`Error loading data from ${endpoint}.`, 'error');
            return [];
        }
    }

    async function addExpToStaff(staffId, amount = 1) {
        try {
            const response = await fetch(`${API_URL}/staff_master.php`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ staff_id: staffId, exp_increment: amount })
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error adding EXP:', error);
            return { success: false };
        }
    }
    async function updateTask(taskId, data) {
        try {
            const response = await fetch(`${API_URL}/tasks.php`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_id: taskId, ...data }) // Đảm bảo task_id luôn được gửi
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error updating task:', error);
            showToast('Failed to update task.', 'error');
            return { success: false };
        }
    }

    async function createNotification(recipientId, message, taskId) {
        try {
            const response = await fetch(`${API_URL}/notifications.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipient_id: recipientId,
                    message: message,
                    task_id: taskId,
                    actor_id: state.currentUserId // Gửi ID của người thực hiện hành động
                })
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error creating notification:', error);
            return { success: false };
        }
    }
    async function updateTaskCheckListBatch(taskId, checks) {
        try {
            const response = await fetch(`${API_URL}/task_check_list.php`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_id: taskId, checks: checks })
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Error updating task checklist:", error);
            showToast('Failed to update checklist status.', 'error');
            return { success: false };
        }
    }

    /**
     * Finds the manager (highest role_id) for a given store from the allStaff list.
     * @param {number} storeId The ID of the store.
     * @returns {object|null} The staff object for the manager or null if not found.
     */
    function findStoreManager(storeId) {
        if (!storeId || !state.allStaff || state.allStaff.length === 0) {
            return null;
        }
        const staffInStore = state.allStaff.filter(s => s.store_id === storeId);
        if (staffInStore.length === 0) {
            return null;
        }
        // Find the staff member with the highest role_id in that store
        const manager = staffInStore.reduce((max, staff) =>
            (parseInt(staff.role_id) > parseInt(max.role_id) ? staff : max),
            staffInStore[0]
        );
        return manager;
    }

    //================================================================================
    // UI & RENDERING
    //================================================================================
    function renderTaskDetails() {
        if (!state.task) return;
        const t = state.task;

        dom.taskIndex.textContent = `${t.task_id}.`;
        dom.deptSquare.style.backgroundColor = DEPT_COLORS[t.dept_id] || '#ccc';
        dom.userCircle.style.backgroundColor = MEMBER_COLORS[t.do_staff_id % MEMBER_COLORS.length] || '#777';
        dom.taskName.textContent = t.task_name;
        dom.taskMeta.textContent = `RE ${t.re || 0} min • ${formatDate(t.start_date)} – ${formatDate(t.end_date)}`;
        
        // Note: Manual link needs to be fetched separately if manual_id is just an ID
        if (state.manual) {
            dom.teachmeLink.href = state.manual.manual_url || '#';
            dom.teachmeLink.textContent = state.manual.manual_name || 'View Manual';
        } else {
            dom.teachmeLink.href = '#';
            dom.teachmeLink.textContent = 'N/A';
        }

        dom.fileLink.href = t.image_path ? `uploads/${t.image_path}` : '#';
        dom.fileLink.textContent = t.image_path || 'N/A';

        // Hiển thị checklist nếu response type là 'Check list'
        // Giả định response_type_name được trả về từ API
        const isChecklistTask = t.response_type_name === 'Check-List' && t.check_lists && t.check_lists.length > 0;
        if (isChecklistTask) {
            dom.checklistContainer.style.display = 'block';
            // Ẩn phần Yes/No và nút Register vì trạng thái được quản lý bởi checklist
            dom.canCompleteSection.style.display = 'none';
            dom.registerButton.style.display = 'none';
            dom.confirmChecklistButton.style.display = 'block';
            renderChecklist(t.check_lists);
        }
    }

    function renderChecklist(checklistItems) {
        const tableBody = dom.checklistContainer.querySelector('tbody');
        if (!tableBody) return;

        tableBody.innerHTML = checklistItems.map((item, index) => {
            const isChecked = item.check_status === 'Done';
            return `
                <tr data-check-id="${item.check_list_id}">
                    <td>${index + 1}</td>
                    <td>
                        <label class="checklist-item-label">
                            <input type="checkbox" class="checklist-item-checkbox" ${isChecked ? 'checked' : ''}>
                            <span>${item.check_list_name}</span>
                        </label>
                    </td>
                    <td class="checklist-status">${item.check_status || 'Not Yet'}</td>
                    <td>${isChecked && item.completed_at ? formatDate(item.completed_at, true) : ''}</td>
                </tr>
            `;
        }).join('');

        // Thêm event listener cho các checkbox mới được tạo
        // Nếu là Admin, vô hiệu hóa tất cả checkbox
        if (state.currentUserId === 0) {
            tableBody.querySelectorAll('.checklist-item-checkbox').forEach(checkbox => {
                checkbox.disabled = true;
            });
        } else {
            tableBody.querySelectorAll('.checklist-item-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', handleChecklistChange);
            });
        }
    }

    /**
     * Disables all interactive elements on the page if the current user is Admin.
     */
    function disableAllInputsForAdmin() {
        document.querySelectorAll('input[name="can-complete"]').forEach(radio => radio.disabled = true);
        dom.commentInput.disabled = true;
        dom.photoContainer.querySelectorAll('input[type="file"]').forEach(input => input.disabled = true);
        dom.registerButton.disabled = true;
        dom.confirmChecklistButton.disabled = true;
        // Also add a class to visually indicate they are disabled
        dom.registerButton.classList.add('disabled');
        dom.confirmChecklistButton.classList.add('disabled');
        tableBody.querySelectorAll('.checklist-item-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', handleChecklistChange);
        });
    }

    //================================================================================
    // HELPERS & EVENT HANDLERS
    //================================================================================
    function getParamsFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return {
            taskId: parseInt(params.get('id'), 10),
            userId: params.get('userId') ? parseInt(params.get('userId'), 10) : 0 // Mặc định là admin nếu không có
        };
    }
    function formatDate(d, includeTime = false) {
        if (!d) return "";
        const date = new Date(d);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        if (includeTime) {
            const yyyy = date.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        }
        return `${dd}/${mm}`; // Format ngắn cho meta task
    }

    /**
     * Displays a toast notification message.
     * @param {string} message The message to display.
     * @param {string} type 'success', 'error', or 'warning'.
     */
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger the animation after the element is added to the DOM
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.top = '20px';
        }, 100);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.top = '-100px';
            setTimeout(() => toast.remove(), 400); // Match transition duration
        }, 3000);
    }

    async function handleRegister() {
        const canComplete = document.querySelector('input[name="can-complete"]:checked').value;
        const comment = dom.commentInput.value.trim();

        // Xác định người thực hiện task
        let responsibleStaffId;
        if (state.isCurrentUserAManager) {
            responsibleStaffId = parseInt(dom.responsiblePersonContainer.querySelector('select').value, 10);
        } else {
            responsibleStaffId = state.currentUserId;
        }

        if (canComplete === 'no' && !comment) {
            showToast('Please provide a comment explaining why the task cannot be completed.', 'warning');
            dom.commentInput.style.border = '2px solid red';
            dom.commentInput.focus();
            return;
        }
        dom.commentInput.style.border = '1px solid #ccc';

        const { taskId } = getParamsFromUrl();
        const statusId = canComplete === 'yes' ? STATUS_MAP.YES : STATUS_MAP.NO;

        const updateData = {
            status_id: statusId,
            comment: comment,
            do_staff_id: responsibleStaffId,
            completed_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
            // image upload logic needs to be implemented to send URLs/data
        };

        dom.registerButton.disabled = true;
        dom.registerButton.textContent = 'Registering...';

        const result = await updateTask(taskId, updateData);

        // Nếu task được hoàn thành (status=9), gọi API để cộng EXP
        if (statusId === STATUS_MAP.YES) {
            await addExpToStaff(responsibleStaffId, 1);

            // Gửi thông báo cho chính người thực hiện
            await createNotification(
                responsibleStaffId,
                `You have completed the task: "${state.task.task_name}".`,
                taskId
            );

            // Gửi thông báo cho quản lý của cửa hàng
            const storeManager = findStoreManager(state.task.store_id);
            if (storeManager && storeManager.staff_id !== state.currentUserId) {
                await createNotification(
                    storeManager.staff_id,
                    `${state.currentUserData.staff_name} has completed the task: "${state.task.task_name}".`,
                    taskId
                );
            }
        }

        if (result.success) {
            showToast('Task registered successfully!', 'success');
            // Gửi thông báo đến các tab khác rằng task đã được cập nhật
            taskUpdateChannel.postMessage({
                taskId: taskId
            });
            // goBack();
        } else {
            showToast('An error occurred. Please try again.', 'error');
            dom.registerButton.disabled = false;
            dom.registerButton.textContent = 'Register';
        }
    }

    function handleChecklistChange(event) {
        const checkbox = event.target;
        const row = checkbox.closest('tr');
        const checkId = parseInt(row.dataset.checkId, 10);
        const isChecked = checkbox.checked;

        // 1. Cập nhật trạng thái trong state cục bộ
        const checkItem = state.task.check_lists.find(c => c.check_list_id === checkId);
        if (checkItem) {
            checkItem.check_status = isChecked ? 'Done' : 'Not Yet';
            checkItem.completed_at = isChecked ? new Date().toISOString() : null;
        }

        // 2. Cập nhật giao diện của dòng tương ứng
        const statusCell = row.querySelector('.checklist-status');
        const completedAtCell = row.querySelector('td:last-child');
        statusCell.textContent = checkItem.check_status;
        completedAtCell.textContent = isChecked ? formatDate(checkItem.completed_at, true) : '';
    }

    async function handleConfirmChecklist() {
        const { taskId } = getParamsFromUrl();
        if (!state.task || !state.task.check_lists) return;

        // 1. Chuẩn bị dữ liệu để gửi lên API từ state hiện tại
        const checksToUpdate = state.task.check_lists.map(item => ({
            check_list_id: item.check_list_id,
            check_status: item.check_status
        }));

        // Xác định người thực hiện task
        let responsibleStaffId;
        if (state.isCurrentUserAManager) {
            responsibleStaffId = parseInt(dom.responsiblePersonContainer.querySelector('select').value, 10);
        } else {
            responsibleStaffId = state.currentUserId;
        }

        dom.confirmChecklistButton.disabled = true;
        dom.confirmChecklistButton.textContent = 'Confirming...';

        // 2. Gửi yêu cầu cập nhật hàng loạt cho checklist và cả người thực hiện
        const [checklistResult, taskUpdateResult] = await Promise.all([
            updateTaskCheckListBatch(taskId, checksToUpdate),
            updateTask(taskId, { do_staff_id: responsibleStaffId })
        ]);

        // Chỉ cần một trong hai thành công là có thể coi là thành công chung
        const result = { success: checklistResult.success || taskUpdateResult.success };
        
        // Nếu task được hoàn thành, cộng EXP cho người thực hiện
        const isAllDone = checksToUpdate.every(c => c.check_status === 'Done');
        if (isAllDone && state.task && state.task.do_staff_id) {
            await addExpToStaff(state.task.do_staff_id, 1);

            // Gửi thông báo cho chính người thực hiện
            await createNotification(
                state.task.do_staff_id,
                `You have confirmed the checklist for: "${state.task.task_name}".`,
                taskId
            );

            // Gửi thông báo cho quản lý của cửa hàng
            const storeManager = findStoreManager(state.task.store_id);
            if (storeManager && storeManager.staff_id !== state.currentUserId) {
                await createNotification(
                    storeManager.staff_id,
                    `${state.currentUserData.staff_name} has confirmed the checklist for: "${state.task.task_name}".`,
                    taskId
                );
            }
        }


        if (result.success) {
            showToast('Checklist confirmed successfully!', 'success');
            // Gửi thông báo đến các tab khác rằng task đã được cập nhật
            taskUpdateChannel.postMessage({
                taskId: taskId
            });
            goBack();
        } else {
            showToast('An error occurred while confirming. Please try again.', 'error');
            dom.confirmChecklistButton.disabled = false;
            dom.confirmChecklistButton.textContent = 'Confirm Checklist';
        }
    }
    
    function goBack() {
        const { userId } = getParamsFromUrl();
        // Khi quay lại, truyền userId để trang index.html biết user nào đang được chọn
        window.location.href = `index.html?userId=${userId}`;
    }

    function renderCurrentUserInfo() {
        if (!state.currentUserData && state.currentUserId !== 0) {
            return;
        }

        let displayText = '';
        if (state.currentUserId === 0) {
            displayText = 'Current User: Admin | Role: Super User | Department: All Stores';
        } else {
            const user = state.currentUserData;
            const roleLabel = state.isCurrentUserAManager ? 'Manager' : 'Staff';
            displayText = `Current User: ${user.staff_name} | Role: ${roleLabel} | Department: ${user.store_name}`;
        }

        if (dom.userInfoDisplay) {
            dom.userInfoDisplay.textContent = displayText;
        }
    }

    // updateUserStoreDisplay and handleUserChange are removed as the user switcher is being replaced by a static display.

    function renderResponsiblePersonSection() {
        // Find the currently assigned staff member's name
        const assignedStaffId = state.task?.do_staff_id;
        const assignedStaff = state.allStaff.find(s => s.staff_id === assignedStaffId);
        const assignedStaffName = assignedStaff?.staff_name || 'N/A';

        // Update the section title
        dom.responsiblePersonTitle.textContent = `Responsible Person: ${assignedStaffName}`;

        if (state.isCurrentUserAManager) {
            // Quản lý: Hiển thị dropdown để chọn nhân viên.
            const staffOptions = state.staff.map(s =>
                `<option value="${s.staff_id}" ${s.staff_id === state.task?.do_staff_id ? 'selected' : ''}>
                    ${s.staff_name}
                </option>`
            ).join('');
            dom.responsiblePersonContainer.innerHTML = `
                <label for="staff-select" class="sr-only">Responsible Person</label> <!-- Accessibility improvement -->
                <div class="responsible-person-controls">
                    <select id="staff-select" ${state.currentUserId === 0 ? 'disabled' : ''}>
                        ${staffOptions}
                    </select>
                    <button id="assign-staff-button" class="assign-button" ${state.currentUserId === 0 ? 'disabled' : ''}>Assign</button>
                </div>`;
        } else {
            // Nhân viên: Không hiển thị gì thêm vì tên đã có ở tiêu đề section.
            // Ẩn container đi cho gọn.
            dom.responsiblePersonContainer.style.display = 'none';
        }
    }

    function setupEventListeners() {
        dom.backButton.addEventListener('click', goBack);
        dom.registerButton.addEventListener('click', handleRegister);
        dom.confirmChecklistButton.addEventListener('click', handleConfirmChecklist);

        // Event delegation for the assign button
        dom.responsiblePersonContainer.addEventListener('click', async (e) => {
            if (e.target.id === 'assign-staff-button') {
                const assignButton = e.target;
                const staffSelect = document.getElementById('staff-select');
                if (!staffSelect) return;

                const newStaffId = parseInt(staffSelect.value, 10);
                const { taskId } = getParamsFromUrl();

                if (newStaffId === state.task.do_staff_id) {
                    showToast('This staff is already assigned to the task.', 'warning');
                    return;
                }

                assignButton.disabled = true;
                assignButton.textContent = 'Assigning...';

                const result = await updateTask(taskId, { do_staff_id: newStaffId });

                if (result.success) {
                    // Gửi thông báo cho nhân viên được giao
                    await createNotification(
                        newStaffId,
                        `You have been assigned a new task: "${state.task.task_name}".`,
                        taskId
                    );
                    showToast(`Task successfully assigned to ${staffSelect.options[staffSelect.selectedIndex].text}.`, 'success');
                    // Gửi thông báo đến các tab khác để cập nhật
                    taskUpdateChannel.postMessage({
                        taskId: taskId
                    });
                    // Đợi một chút để người dùng đọc thông báo rồi mới quay lại
                    setTimeout(() => {
                        goBack();
                    }, 1500);
                } else {
                    showToast('Failed to assign task. Please try again.', 'error');
                }

                assignButton.disabled = false;
                assignButton.textContent = 'Assign';
            }
        });
    }


    /**
     * Fetches staff from the same store as the task's assigned staff.
     */
    async function fetchStaffInStore(storeId) {
        if (!storeId) return [];
        return await fetchFromAPI(`staff_master?store_id=${storeId}`);
    }

    //================================================================================
    // INITIALIZATION
    //================================================================================
    async function initialize() {
        setupEventListeners();
        const { taskId, userId } = getParamsFromUrl();
        state.currentUserId = userId;

        if (!taskId) {
            showToast('No Task ID provided!', 'error');
            goBack();
            return;
        }

        // Tải song song task chi tiết và toàn bộ danh sách nhân viên (cho user switcher)
        const [taskData, allStaffData] = await Promise.all([
            fetchFromAPI(`tasks?task_id=${taskId}`),
            fetchFromAPI('staff_master')
        ]);

        // Nếu API không hỗ trợ lấy 1 task, ta phải lọc từ tất cả
        // const allTasks = await fetchFromAPI('tasks');
        // const allStaff = await fetchFromAPI('staff_master');

        // Nếu API trả về một mảng (khi lấy tất cả)
        if (Array.isArray(taskData)) {
            state.task = taskData.find(t => t.task_id === taskId);
        } else { // Nếu API trả về một object (khi lấy theo id)
            state.task = taskData;
        }

        // Gán dữ liệu nhân viên vào state TRƯỚC khi sử dụng
        state.allStaff = allStaffData;

        // Xác định vai trò của người dùng hiện tại
        state.currentUserData = state.allStaff.find(s => s.staff_id === state.currentUserId);
        if (state.currentUserData) {
            const staffInStore = state.allStaff.filter(s => s.store_id === state.currentUserData.store_id);
            if (staffInStore.length > 0) {
                const storeManager = staffInStore.reduce((max, staff) => 
                    (staff.role_id > max.role_id ? staff : max), staffInStore[0]
                );
                if (storeManager && state.currentUserId === storeManager.staff_id) {
                    state.isCurrentUserAManager = true;
                }
            }
        } else if (state.currentUserId === 0) { // Admin cũng được coi là quản lý
            state.isCurrentUserAManager = true;
        }

        if (!state.task) {
            showToast('Task not found!', 'error');
            goBack();
            return;
        }

        // Tải danh sách nhân viên dựa trên vai trò
        // Nếu là quản lý (bao gồm Admin), tải nhân viên trong cửa hàng của task để họ có thể phân công.
        // Nếu là nhân viên thường, không cần tải danh sách này.
        if (state.isCurrentUserAManager) { 
            let storeIdToFetch;
            // Nếu là quản lý (không phải Admin), lấy nhân viên từ cửa hàng của chính quản lý đó.
            if (state.currentUserId !== 0 && state.currentUserData) {
                storeIdToFetch = state.currentUserData.store_id;
            } else {
                // Nếu là Admin hoặc trường hợp khác, lấy nhân viên từ cửa hàng của task.
                storeIdToFetch = state.task.store_id;
            }
            state.staff = await fetchStaffInStore(storeIdToFetch);
        }


        // Hiển thị thông tin người dùng
        renderCurrentUserInfo();

        // Nếu task có manual_id, fetch thông tin manual
        if (state.task.manual_id) {
            const manualData = await fetchFromAPI(`manuals?manual_id=${state.task.manual_id}`);
            // API có thể trả về mảng, lấy phần tử đầu tiên
            if (Array.isArray(manualData) && manualData.length > 0) {
                state.manual = manualData[0];
            } else if (typeof manualData === 'object' && manualData !== null) {
                state.manual = manualData;
            }
        }

        renderTaskDetails();
        renderResponsiblePersonSection();

        // Nếu là Admin, vô hiệu hóa tất cả các input sau khi đã render xong
        if (state.currentUserId === 0) {
            disableAllInputsForAdmin();
        }
    }

    initialize();
})();

/**
 * Handles previewing an image in a photo slot and adding a remove button.
 * @param {HTMLInputElement} input The file input element.
 */
function previewImage(input) {
    if (!input.files?.[0]) return;

    const slot = input.closest(".photo-slot");
    const addIcon = slot.querySelector('.add-icon');

    const reader = new FileReader();
    reader.onload = e => {
        // Clear previous content (icon or old image/button)
        slot.innerHTML = ''; 

        // Add the new image
        const img = document.createElement("img");
        img.src = e.target.result;
        slot.appendChild(img);

        // Add the remove button
        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-image-btn";
        removeBtn.innerHTML = "&times;";
        removeBtn.title = "Remove image";
        removeBtn.onclick = (event) => {
            event.preventDefault(); // Prevent label from triggering file input
            input.value = ''; // Clear the file input
            slot.innerHTML = ''; // Clear image and button
            slot.appendChild(addIcon); // Restore the '+' icon
            slot.style.border = '2px dashed #ccc';
        };
        slot.appendChild(removeBtn);

        // Re-append the original hidden file input
        slot.appendChild(input);
        slot.style.border = '1px solid #ccc'; // Change border to solid
    };
    reader.readAsDataURL(input.files[0]);
}