/**
 * HQ Create Task - Logic for creating new and repeated tasks.
 * Encapsulated to avoid global scope pollution.
 */
(function () {
    'use strict';

    //================================================================================
    // I. CONFIG & CONSTANTS
    //================================================================================

    const API_URL = (() => {
        return window.location.hostname === 'localhost'
            ? 'http://localhost/auraProject/api'
            : 'https://auraorientalis.vn/auraProject/api';
    })();

    //================================================================================
    // II. DOM ELEMENTS
    //================================================================================

    const dom = {
        // Navigation
        goToHQTasksButton: document.getElementById('go-to-hq-tasks'),
        goToReceivingTaskButton: document.getElementById('go-to-task-list'),
        goToCreateTaskButton: document.getElementById('go-to-create-task'),
        goToStoreListButton: document.getElementById('go-to-store-list'),
        goToStoreScreenButton: document.getElementById('store-screen'),

        // Form elements
        isRepeatRadios: document.querySelectorAll('input[name="is-repeat"]'),
        startInput: document.getElementById("start-day"),
        endInput: document.getElementById("end-day"),
        keywordInput: document.getElementById("keyword"),
        suggestionList: document.getElementById('suggestion-list'),
        manualLinkInput: document.getElementById("manual-link"),
        manualDisplayArea: document.getElementById("manual-display-area"),
        manualNameDisplay: document.getElementById("manual-name-display"),
        manualUrlLink: document.getElementById("manual-url-link"),
        fileUploadButton: document.getElementById("upload-file"),
        manualFileInput: document.getElementById('manual-file-input'),
        storeNameSearchInput: document.getElementById("store-filter"),
        storeRegionSearchInput: document.getElementById("region-filter"),
        storeListTable: document.getElementById("store-list"),
        storeListBody: document.getElementById("store-list").getElementsByTagName('tbody')[0],
        storeListHeaderCheckbox: document.getElementById("store-list").querySelector('thead input[type="checkbox"]'),
        storeTableTitle: document.getElementById('storeTableTitle'),
        reInput: document.getElementById("re"),
        taskNameInput: document.getElementById("task-name"),
        taskTypeSelect: document.getElementById("task-type"),
        responseTypeSelect: document.getElementById("response-type"),
        responseTypeNumberInput: document.getElementById("response-type-number"),
        taskDetailsInput: document.getElementById("task-details"),
        checklistContainer: document.getElementById('checklist-container'),
        checklistTableBody: document.getElementById('checklist-table').getElementsByTagName('tbody')[0],
        checklistMessageCell: document.getElementById('checklist-message-cell'),

        // Action Buttons
        checkButton: document.getElementById('check-button'),
        addButton: document.getElementById('add-button'),
        addRepeatButton: document.getElementById('add-repeat-task'),
        createTaskButton: document.getElementById("create-task"),
    };

    //================================================================================
    // III. STATE MANAGEMENT
    //================================================================================

    const state = {
        isRepeat: 'Yes',
        selectedStores: [],
        cachedData: {
            templateTasks: null,
            stores: null,
            regions: null,
            codes: null,
        }
    };

    //================================================================================
    // IV. API & DATA FETCHING
    //================================================================================

    async function fetchFromAPI(endpoint) {
        try {
            const [path, queryString] = endpoint.split('?');
            const url = `${API_URL}/${path}.php${queryString ? '?' + queryString : ''}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (err) {
            console.error(`Error fetching ${endpoint}:`, err);
            return [];
        }
    }

    const getTemplateTasks = async () => {
        if (!state.cachedData.templateTasks) {
            const tasks = await fetchFromAPI('template_tasks');
            // The data is already joined in the backend.
            // We just need to ensure the structure matches what the frontend expects.
            state.cachedData.templateTasks = tasks.map(t => ({
                ...t, // Includes task_type_name, task_type_code, etc.
            }));
        }
        return state.cachedData.templateTasks;
    };

    // Function to fetch codes based on classification
    const getCodes = async (classification) => {
        try {
            const response = await fetchFromAPI(`code_master?classification=${classification}`);
            return response;
        } catch (error) {
            console.error(`Error fetching codes for classification ${classification}:`, error);
            return [];
        }
    };

    // Helper to get regions, with caching
    const getRegions = () => state.cachedData.regions || (state.cachedData.regions = fetchFromAPI('region_master'));


  const getStores = async () => {
        if (!state.cachedData.stores) {
            const [stores, regions] = await Promise.all([
                fetchFromAPI('store_master'),
                getRegions()
            ]);
            const regionMap = new Map(regions.map(r => [r.region_id, r.region_name]));
            state.cachedData.stores = stores.map(store => ({
                ...store,
                region_name: regionMap.get(store.region_id) || null
            }));
        }
        return state.cachedData.stores;
    };

    /**
     * Finds the manager (highest role_id) for a given store.
     * @param {number} storeId The ID of the store.
     * @returns {Promise<object|null>} The staff object or null.
     */
    async function findStoreManager(storeId) {
        try {
            // API returns an array of staff members in the store
            const staffInStore = await fetchFromAPI(`staff_master?store_id=${storeId}`);

            if (!staffInStore || staffInStore.length === 0) { 
                return null; // No staff in the store
            }

            // Find the staff member with the highest role_id
            const manager = staffInStore.reduce((max, staff) =>
                (parseInt(staff.role_id) > parseInt(max.role_id) ? staff : max),
                staffInStore[0]
            );

            return manager; // Return the manager's object
        } catch (error) {
            console.error(`Error finding manager for store ${storeId}:`, error);
            return null;
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
                    actor_id: 1 // Giả định người tạo task từ HQ là user có ID=1 (hoặc một ID admin cụ thể)
                })
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error creating notification:', error);
            return { success: false };
        }
    }
    /**
     * Creates new checklist items in the database and returns their IDs.
     * @param {string[]} checklistNames - An array of checklist item names.
     * @returns {Promise<number[]>} A promise that resolves to an array of new checklist IDs.
     */
    async function createChecklistItems(checklistNames) {
        if (!checklistNames || checklistNames.length === 0) {
            return [];
        }
        try {
            const payload = { items: checklistNames.map(name => ({ check_list_name: name })) };

            // Use fetch() directly to ensure POST method is used.
            // The existing fetchFromAPI helper is only for GET requests.
            const response = await fetch(`${API_URL}/check_lists.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
            const result = await response.json();
            return result.ids || [];
        } catch (error) {
            console.error("Error creating checklist items:", error);
            showToast('Failed to save checklist items.', 'error');
            return [];
        }
    }

    async function postTasks(taskData) {
        const storeIdList = taskData.storeList || [];
        if (storeIdList.length === 0) {
            showToast('No stores selected.', 'error');
            return;
        }
        // Create a base task object without store-specific info
        const baseTask = { ...taskData };
        delete baseTask.storeList;

        // Step 1: Create checklist items if they exist and get their IDs
        let newChecklistIds = [];
        const isChecklist = dom.responseTypeSelect.options[dom.responseTypeSelect.selectedIndex]?.text.toLowerCase().includes('check-list');
        if (isChecklist && taskData.checklistItems && taskData.checklistItems.length > 0) {
            newChecklistIds = await createChecklistItems(taskData.checklistItems);
        }


        // Step 2: Create a task for each selected store
        const promises = storeIdList.map(async storeId => {
            // Create a clean payload for the API to ensure correct fields are sent.
            // This maps the data from the form (taskData) to the expected API fields.
            const manager = await findStoreManager(storeId);
            if (!manager) {
                // Skip this store if no manager is found
                console.warn(`Could not find a manager for store ID ${storeId}. Skipping task creation for this store.`);
                // We resolve instead of reject to not fail the entire batch
                return Promise.resolve({ success: false, message: `No manager for store ${storeId}` });
            }

            const apiPayload = {
                task_name: baseTask.task_name,
                manual_id: baseTask.manual_id,
                re: parseInt(baseTask.re, 10) || 0,
                task_type_id: baseTask.task_type_id,
                response_type_id: baseTask.response_type_id,
                response_num: baseTask.response_num ? parseInt(baseTask.response_num, 10) : null,
                comment: baseTask.comment,
                status_id: baseTask.status_id,
                dept_id: baseTask.dept_id,
                created_staff_id: baseTask.created_staff_id,
                start_date: baseTask.start_date,
                end_date: baseTask.end_date,
                start_time: null, // Assuming this is not set from the form
                do_staff_id: manager.staff_id, // Use the found manager's ID
                completed_time: null, // Assuming this is not set from the form
                // Store-specific field
                do_staff_id: manager.staff_id, // Use the found manager's ID
                // Fields from taskData not sent to API: isRepeat, keyword, storeList
            };

            const response = await fetch(`${API_URL}/tasks.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(apiPayload)
            });

            if (!response.ok) {
                return response.json().catch(() => ({ message: `Server error for store ID ${storeId}: ${response.statusText}` })).then(err => Promise.reject(err));
            }
            const taskResult = await response.json();

            // Step 3: If task creation was successful, handle post-creation actions.
            if (taskResult.success && taskResult.id) {
                // Send notification to the assigned manager (do_staff_id)
                await createNotification(
                    manager.staff_id,
                    `A new task has been assigned to your store: "${apiPayload.task_name}".`,
                    taskResult.id
                );

                // If there are checklist items, associate them.
                if (newChecklistIds.length > 0) {
                    await fetch(`${API_URL}/task_check_list.php`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            task_id: parseInt(taskResult.id, 10),
                            check_list_ids: newChecklistIds
                        })
                    });
                }
            }

            return taskResult;
        });

        try {
            // Promise.allSettled is safer as it won't stop if one task creation fails.
            const results = await Promise.allSettled(promises);
            const successfulCreations = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
            showToast(`Successfully created tasks for ${storeIdList.length} stores!`, 'success');
        } catch (error) {
            const errorMessage = error.message || (typeof error === 'object' ? JSON.stringify(error) : 'An unknown error occurred.');
            showToast(`Error saving tasks: ${errorMessage}`, 'error');
            console.error("Error posting tasks:", error);
        }
    }

    /**
     * Displays a toast notification message.
     * @param {string} message The message to display.
     * @param {string} type 'success' or 'error'.
     */
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.top = '-50px';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    async function handleFileUpload(event) {
        const files = event.target.files;
        if (!files.length) return;

        const formData = new FormData();
        // Note: The PHP script seems to expect a single file 'manualFile', not an array.
        // We will upload one by one if multiple files are selected.
        for (const file of files) {
            formData.set('manualFile', file); // Use set to overwrite for each file

            // Show some loading indicator
            dom.fileUploadButton.disabled = true;
            dom.fileUploadButton.innerHTML = '...'; // Simple loading text

            try {
                const response = await fetch(`${API_URL}/upload.php`, {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();
                if (!response.ok || !result.success) { 
                    throw new Error(result.error || `Server error: ${response.statusText}`);
                }

                const fileUrl = `${window.location.protocol}//${window.location.host}/auraProject/${result.filePath}`;

                // Append new URL to the existing ones, separated by a comma and space
                dom.manualLinkInput.value += (dom.manualLinkInput.value ? ', ' : '') + fileUrl;

            } catch (error) { 
                showToast(`Error uploading file: ${error.message}`, 'error');
                console.error('File upload error:', error);
            } finally {
                dom.fileUploadButton.disabled = false;
                dom.fileUploadButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/><path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z"/></svg>`;
            }
        }
        event.target.value = ''; // Clear the file input to allow re-uploading the same file
    }

    //================================================================================
    // V. UI & RENDERING
    //================================================================================

    function renderStoreTable(storesToRender) {
        dom.storeListBody.innerHTML = '';
        if (!storesToRender || storesToRender.length === 0) {
            dom.storeListBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No stores found.</td></tr>`;
            return;
        }

        const rowsHtml = storesToRender.map(store => `
            <tr>
                <td data-label="Select"><input type="checkbox" class="select-store" data-store-id="${store.store_id}"></td>
                <td data-label="Store Code">${store.store_code || ''}</td>
                <td data-label="Store Name">${store.store_name || ''}</td>
                <td data-label="Region">${store.region_name || ''}</td>
            </tr>
        `).join('');
        dom.storeListBody.innerHTML = rowsHtml;
    }

    async function filterAndRenderStores() {
        const nameFilter = dom.storeNameSearchInput.value.toLowerCase().trim();
        const regionFilter = dom.storeRegionSearchInput.value.toLowerCase().trim();
        const allStores = await getStores();

        if (nameFilter || regionFilter) {
            dom.storeTableTitle.textContent = "Search Results";
            const filteredStores = allStores.filter(store =>
                (store.store_name?.toLowerCase().includes(nameFilter) ||
                 store.store_code?.toLowerCase().includes(nameFilter)) &&
                (store.region_name?.toLowerCase().includes(regionFilter))
            );
            renderStoreTable(filteredStores);
        } else {
            dom.storeTableTitle.textContent = "Selected Stores";
            const storesFromState = state.selectedStores.map(id => allStores.find(s => parseInt(s.store_id, 10) === id));
            renderStoreTable(storesFromState);
        }
    }

    function showConfirmationPopup(taskData, isRepeat) {
        // Remove any existing popup
        const existingPopup = document.getElementById('task-confirmation-popup');
        if (existingPopup) existingPopup.remove();
    
        const popupOverlay = document.createElement('div');
        popupOverlay.id = 'task-confirmation-popup';
        popupOverlay.className = 'confirmation-popup-overlay';
    
        const popupContent = `
            <div class="confirmation-popup-content">
                <h3 data-i18n-key="popup-confirm-title">Confirm Task Creation</h3>
                <p data-i18n-key="popup-confirm-message">Please review the details below before creating the task.</p>
                <ul class="confirmation-details-list">
                    <li><strong data-i18n-key="popup-task-name">Task Name</strong>: <span>${taskData.task_name}</span></li>
                    <li><strong data-i18n-key="popup-keyword">Keyword</strong>: <span>${taskData.keyword}</span></li>
                    <li><strong data-i18n-key="popup-is-repeat">Is Repeat</strong>: <span>${taskData.isRepeat}</span></li>
                    <li><strong data-i18n-key="popup-dates">Dates</strong>: <span>${taskData.start_date} to ${taskData.end_date}</span></li>
                    <li><strong data-i18n-key="popup-re-h">RE(h)</strong>: <span>${taskData.re}</span></li>
                    <li><strong data-i18n-key="popup-task-type">Task Type</strong>: <span>${dom.taskTypeSelect.options[dom.taskTypeSelect.selectedIndex].text}</span></li>
                    <li><strong data-i18n-key="popup-response-type">Response Type</strong>: <span>${dom.responseTypeSelect.options[dom.responseTypeSelect.selectedIndex].text}${taskData.response_num ? ` (${taskData.response_num})` : ''}</span></li>
                    <li><strong data-i18n-key="popup-stores">Stores</strong>: <span>${taskData.storeList.length} selected</span></li>
                    <li><strong data-i18n-key="popup-manual-link">Manual Link</strong>: <span>${taskData.manual_id || '(none)'}</span></li>
                    <li><strong data-i18n-key="popup-task-details">Task Details</strong>: <span>${taskData.comment || '(none)'}</span></li>
                </ul>
                <div class="confirmation-popup-actions">
                    <button id="cancel-task-creation" class="popup-btn-cancel" data-i18n-key="popup-cancel-btn">Cancel</button>
                    <button id="confirm-task-creation" class="popup-btn-confirm" data-i18n-key="popup-confirm-btn">Confirm & Create</button>
                </div>
            </div>
        `;
    
        popupOverlay.innerHTML = popupContent;
        document.body.appendChild(popupOverlay);
    
        applyTranslations(popupOverlay); // Apply translations to the new popup
        const closePopup = () => popupOverlay.remove();
    
        document.getElementById('cancel-task-creation').onclick = closePopup;
        popupOverlay.onclick = (e) => { if (e.target === popupOverlay) closePopup(); };
        document.getElementById('confirm-task-creation').onclick = () => { postTasks(taskData, isRepeat); resetForm(); closePopup(); };
    }

    /**
     * Shows a generic popup to display a list of items.
     * @param {string} title The title of the popup.
     * @param {object[]} items An array of store objects ({name, region}) to display in a table.
     */
    function showInfoPopup(title, items) {
        const existingPopup = document.getElementById('info-popup');
        if (existingPopup) existingPopup.remove();
    
        const popupOverlay = document.createElement('div');
        popupOverlay.id = 'info-popup';
        popupOverlay.className = 'confirmation-popup-overlay';
    
        let tableContent;
        if (items.length > 0) {
            const tableRows = items.map((item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name || ''}</td>
                    <td>${item.region || 'N/A'}</td>
                </tr>
            `).join('');
    
            tableContent = `
                <div class="info-popup-table-container">
                    <table class="info-popup-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th data-i18n-key="store-name">Store Name</th>
                                <th data-i18n-key="region">Region</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
            `;
        } else {
            tableContent = `<p style="text-align:center; margin: 20px 0;">No items to display.</p>`;
        }
    
        popupOverlay.innerHTML = `
            <div class="confirmation-popup-content" style="max-width: 450px;">
                <h3>${title}</h3>
                ${tableContent}
                <div class="confirmation-popup-actions">
                    <button id="close-info-popup" class="popup-btn-confirm">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(popupOverlay);

        applyTranslations(popupOverlay); // Apply translations to the new popup table headers

        const closePopup = () => popupOverlay.remove();
        document.getElementById('close-info-popup').onclick = closePopup;
        popupOverlay.onclick = (e) => { if (e.target === popupOverlay) closePopup(); };
    }

    function addChecklistRow() {
        const rowCount = dom.checklistTableBody.rows.length;
        if (rowCount >= 5) {
            // Optional: alert('Tối đa 5 nội dung');
            return;
        }

        const newRow = dom.checklistTableBody.insertRow();
        newRow.innerHTML = `
            <td class="row-index">${rowCount + 1}</td>
            <td><input type="text" placeholder="Enter checklist content..."></td>
            <td>
                <button type="button" class="delete-btn" title="Delete row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m3.5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m3.5-.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06"/>
                    </svg>
                </button>
            </td>
        `;

        const input = newRow.querySelector('input[type="text"]');
        input.addEventListener('input', handleChecklistInput);  // Kích hoạt trên mỗi lần gõ phím
        input.addEventListener('change', handleChecklistInput); // Kích hoạt sau khi nhập xong
        input.addEventListener('blur', handleChecklistInput);   // Kích hoạt khi rời khỏi ô
        newRow.querySelector('.delete-btn').addEventListener('click', handleDeleteChecklistRow);
    }

    /**
     * Updates the message in the checklist table's footer.
     */
    function updateChecklistMessage() {
        const rowCount = dom.checklistTableBody.rows.length;
        if (rowCount >= 5) {
            dom.checklistMessageCell.textContent = translate('checklist-max-items-alert');
        } else {
            dom.checklistMessageCell.textContent = translate('checklist-add-new-prompt');
        }
        // Apply translation again in case language changed
        applyTranslations(dom.checklistMessageCell.parentElement);
    }

    /**
     * Dọn dẹp các dòng checklist trống thừa, chỉ giữ lại một dòng trống duy nhất ở cuối.
     */
    function cleanupEmptyChecklistRows() {
        const allInputs = Array.from(dom.checklistTableBody.querySelectorAll('input[type="text"]'));
        const emptyInputs = allInputs.filter(input => input.value.trim() === '');

        // Giữ lại một dòng trống cuối cùng, xóa tất cả các dòng trống khác
        if (emptyInputs.length > 1) {
            // Lấy input trống cuối cùng
            const lastEmptyInput = emptyInputs[emptyInputs.length - 1];
            emptyInputs.forEach(input => {
                if (input !== lastEmptyInput) {
                    input.closest('tr').remove();
                }
            });
            updateChecklistIndexes();
            updateChecklistMessage();
        }
    }

    function handleChecklistInput(event) {
        // Bỏ qua sự kiện 'input' khi người dùng đang gõ ký tự phức hợp (VD: tiếng Việt)
        if (event.isComposing) {
            return;
        }

        // Dọn dẹp các dòng trống thừa trước
        cleanupEmptyChecklistRows();

        // Kiểm tra xem có cần thêm dòng mới không
        const allInputs = Array.from(dom.checklistTableBody.querySelectorAll('input[type="text"]'));
        const isAnyRowEmpty = allInputs.some(input => input.value.trim() === '');

        // Nếu không có dòng nào trống, thêm một dòng mới
        if (!isAnyRowEmpty) {
            addChecklistRow();
            updateChecklistMessage();
        }
    }

    function handleDeleteChecklistRow(event) {
        const row = event.target.closest('tr');
        row.remove();
        updateChecklistIndexes();
        updateChecklistMessage();

        // Sau khi xóa, kiểm tra xem có cần thêm dòng trống không
        const hasEmptyRow = Array.from(dom.checklistTableBody.querySelectorAll('input[type="text"]')).some(input => input.value.trim() === '');
        if (!hasEmptyRow) {
            addChecklistRow();
            updateChecklistMessage();
        }
    }

    function updateChecklistIndexes() {
        const rows = dom.checklistTableBody.rows;
        for (let i = 0; i < rows.length; i++) {
            rows[i].querySelector('.row-index').textContent = i + 1;
        }
    }

    async function fetchAndRenderChecklist(templateTaskId) {
        try {
            const checklistItems = await fetchFromAPI(`template_tasks_check_list?template_task_id=${templateTaskId}`);
 
            dom.checklistTableBody.innerHTML = ''; // Xóa các dòng cũ

            if (checklistItems && checklistItems.length > 0) {
                checklistItems.forEach(item => {
                    const newRow = dom.checklistTableBody.insertRow();
                    newRow.innerHTML = `
                        <td class="row-index">${dom.checklistTableBody.rows.length}</td>
                        <td><input type="text" value="${item.check_list_name || ''}" placeholder="Enter checklist content..." disabled></td>
                        <td></td>
                    `;
                });
            }
        } catch (error) {
            console.error(`Error fetching checklist for template task ${templateTaskId}:`, error);
        }
    }

    //================================================================================
    // VI. CORE LOGIC & HELPERS
    //================================================================================

    const redirectTo = (path) => window.location.href = path;

    function resetForm() {
        dom.keywordInput.value = '';
        dom.manualLinkInput.value = '';
        state.selectedStores = [];
        dom.reInput.value = '';
        dom.taskNameInput.value = '';
        dom.taskTypeSelect.selectedIndex = 0;
        dom.responseTypeSelect.selectedIndex = 0;
        dom.responseTypeNumberInput.value = '';
        dom.taskDetailsInput.value = '';
        filterAndRenderStores();
    }

    function validateForm() {
        const requiredFields = {
            "Start date": dom.startInput,
            "End date": dom.endInput,
            "Keyword": dom.keywordInput,
            "Manual link": dom.manualLinkInput,
            "RE(h)": dom.reInput,
            "Task Name": dom.taskNameInput,
        };

        const missingFields = [];
        for (const [name, element] of Object.entries(requiredFields)) {
            element.style.border = "";
            if (!element.value) {
                missingFields.push(name);
                element.style.border = "2px solid red";
            }
        }

        dom.storeListTable.style.border = "";
        if (state.selectedStores.length === 0) {
            missingFields.push("Store Selection");
            dom.storeListTable.style.border = "2px solid red";
        }

        if (missingFields.length > 0) {
            showToast((window.translate ? translate('fill-required-fields-alert') : 'Please fill in the following required fields:') + " " + missingFields.join(", "), 'warning');
            return false;
        }

        // Date validation
        const startDate = new Date(dom.startInput.value);
        const endDate = new Date(dom.endInput.value);
        if (endDate < startDate) { 
            showToast(window.translate ? translate('end-date-before-start-alert') : 'End date cannot be before the start date.', 'warning');
            dom.startInput.style.border = "2px solid red";
            dom.endInput.style.border = "2px solid red";
            return false;
        }
        return true;
    }
    let matchedTask = null;

    async function autofillFormFromKeyword() {
        const keyword = dom.keywordInput.value.trim().toLowerCase();
        if (state.isRepeat !== 'Yes' || !keyword) return;

        const templateTasks = await getTemplateTasks();
        matchedTask = templateTasks.find(task => task.key_work.toLowerCase() === keyword);
        
        // Hide input, show display area
        dom.manualLinkInput.style.display = 'none';
        dom.manualDisplayArea.style.display = 'flex';

        if (matchedTask) {
            // Fetch manual details if manual_id exists
            if (matchedTask.manual_id) {
                try {
                    const manualData = await fetchFromAPI(`manuals?manual_id=${matchedTask.manual_id}`);
                    if (manualData && manualData.length > 0) {
                        const manual = manualData[0];
                        dom.manualNameDisplay.textContent = manual.manual_name || 'Unnamed Manual';
                        dom.manualUrlLink.href = manual.manual_url || '#';
                        dom.manualLinkInput.value = manual.manual_url || ''; // Also update hidden input
                    } else {
                        dom.manualNameDisplay.textContent = `Manual ID ${matchedTask.manual_id} not found`;
                        dom.manualUrlLink.href = '#';
                    }
                } catch (error) {
                    console.error(`Error fetching manual ${matchedTask.manual_id}:`, error);
                    dom.manualNameDisplay.textContent = 'Error loading manual';
                }
            } else {
                dom.manualNameDisplay.textContent = 'No manual assigned';
                dom.manualUrlLink.href = '#';
            }

            dom.reInput.value = matchedTask.re || '';            
            dom.taskNameInput.value = matchedTask.task_name || '';
            dom.taskTypeSelect.value = matchedTask.task_type_id || '';
            dom.responseTypeSelect.value = matchedTask.response_type_id || '';
            dom.responseTypeNumberInput.value = matchedTask.response_num || '';
            handleResponseTypeChange({ target: dom.responseTypeSelect }); // Trigger change to update UI

            // So sánh bằng ID (giả định ID của Check List là 5) để tăng độ tin cậy
            if (matchedTask.response_type_id == 5) {
                fetchAndRenderChecklist(matchedTask.template_task_id);
            }

            // Disable fields, but keep manualLinkInput enabled for value storage
            [dom.reInput, dom.taskNameInput, dom.taskTypeSelect, dom.responseTypeSelect, dom.responseTypeNumberInput, dom.fileUploadButton].forEach(el => el.disabled = true);
        }
    }

    function resetAndEnableFormFields() {
        [dom.keywordInput, dom.manualLinkInput, dom.reInput, dom.taskNameInput, dom.taskTypeSelect, dom.responseTypeSelect, dom.responseTypeNumberInput, dom.fileUploadButton]
            .forEach(el => {
                if (el.tagName !== 'BUTTON') el.value = '';
                el.disabled = false;
            });
        // Reset manual display
        dom.manualLinkInput.style.display = 'block';
        dom.manualDisplayArea.style.display = 'none';
        // Clear checklist
        dom.checklistTableBody.innerHTML = '';
        addChecklistRow();
        updateChecklistMessage();
        dom.manualNameDisplay.textContent = '';
        dom.manualUrlLink.href = '#';
    }

    //================================================================================
    // VII. EVENT HANDLERS
    //================================================================================

    function handleIsRepeatChange(event) {
        state.isRepeat = event.target.value;
        dom.addRepeatButton.style.display = state.isRepeat === "Yes" ? "none" : "inline-block";
        if (state.isRepeat === 'No') {
            resetAndEnableFormFields();
        } else {
            autofillFormFromKeyword();
        }
    }

    function handleResponseTypeChange(event) {
        const selectElement = event.target;
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const selectedText = selectedOption ? selectedOption.text : '';

        // Normalize the string by removing spaces and hyphens, then compare
        if (selectedText.toLowerCase().replace(/[\s-]/g, '') === 'checklist') {
            dom.checklistContainer.style.display = 'block';
            // Add first row if table is empty
            if (dom.checklistTableBody.rows.length === 0) {
                addChecklistRow();
                updateChecklistMessage();
            }
        } else {
            dom.checklistContainer.style.display = 'none';
        }

        // Show/hide the number input based on selection
        if (selectedText.toLowerCase().replace(/[\s-]/g, '') === 'checklist' || selectedText.toLowerCase().replace(/[\s-]/g, '') === 'yesno') {
            dom.responseTypeNumberInput.style.display = 'none';
        } else {
            dom.responseTypeNumberInput.style.display = 'block'; // Or 'inline-block'
        }
    }

    async function handleKeywordInput() {
        if (state.isRepeat !== 'Yes') {
            dom.suggestionList.style.display = "none";
            return;
        }

        const inputValue = dom.keywordInput.value.toLowerCase().trim();
        const templateTasks = await getTemplateTasks();
        const keywords = [...new Set(templateTasks.map(task => task.key_work).filter(Boolean))];

        const filteredKeywords = keywords.filter(key => key.toLowerCase().includes(inputValue));

        dom.suggestionList.innerHTML = '';
        if (filteredKeywords.length > 0 && inputValue) {
            dom.suggestionList.style.display = "block";
            filteredKeywords.forEach(suggestion => {
                const li = document.createElement('li');
                li.textContent = suggestion;
                li.onclick = () => {
                    dom.keywordInput.value = suggestion;
                    dom.suggestionList.style.display = "none";
                    autofillFormFromKeyword();
                };
                dom.suggestionList.appendChild(li);
            });
        } else {
            dom.suggestionList.style.display = "none";
        }
    }

    async function handleAddStores() {
        const selectedCheckboxes = dom.storeListBody.querySelectorAll('.select-store:checked');
        if (selectedCheckboxes.length === 0) {
            showToast('Please select at least one store to add.', 'warning');
            return;
        }

        const addedStoreIds = [];
        selectedCheckboxes.forEach(cb => {
            const storeId = parseInt(cb.dataset.storeId, 10);
            if (!state.selectedStores.includes(storeId)) {
                state.selectedStores.push(storeId);
                addedStoreIds.push(storeId);
            }
        });

        const allStores = await getStores(); // Changed to array of objects
        const addedStoreInfo = addedStoreIds.map(id => {
            const store = allStores.find(s => parseInt(s.store_id, 10) === id);
            if (store) {
                return { name: store.store_name, region: store.region_name };
            }
            return { name: code, region: 'N/A' }; // Fallback
        });
    
        showInfoPopup('Stores Added to Task', addedStoreInfo);

        dom.storeNameSearchInput.value = '';
        dom.storeRegionSearchInput.value = '';
        filterAndRenderStores(); // Show the selected stores list
    }

    async function handleCheckSelectedStores() {
        if (state.selectedStores.length === 0) {
            showInfoPopup('Selected Stores', ['No stores have been added to the task yet.']);
            return;
        }
        
        const allStores = await getStores(); // Changed to array of objects
        const selectedStoreInfo = state.selectedStores.map(id => {
            const store = allStores.find(s => s.store_id === id);
            if (store) {
                return { name: store.store_name, region: store.region_name };
            }
            return { name: `ID ${id}`, region: 'N/A' };
        });
        showInfoPopup('Currently Selected Stores', selectedStoreInfo);
    }


    async function handleTaskCreation(isRepeat = false) {
        if (!validateForm()) return;

        // Get the selected option directly to read its data-id attribute.
        // This is more reliable than querying by value, especially with i18n.
        const selectedTaskTypeOption = dom.taskTypeSelect.options[dom.taskTypeSelect.selectedIndex];
        const selectedResponseTypeOption = dom.responseTypeSelect.options[dom.responseTypeSelect.selectedIndex];
        const taskTypeId = selectedTaskTypeOption ? selectedTaskTypeOption.dataset.id : null;
        const responseTypeId = selectedResponseTypeOption ? selectedResponseTypeOption.dataset.id : null;
        
        // Get checklist items
        const checklistItems = Array.from(dom.checklistTableBody.querySelectorAll('input[type="text"]'))
            .map(input => input.value.trim()).filter(Boolean);

        // This object is for the confirmation popup
        const taskData = {
            // Raw values for display
            isRepeat: state.isRepeat,
            keyword: dom.keywordInput.value,
            storeList: state.selectedStores,

            // Mapped values for PHP API
            task_name: dom.taskNameInput.value,
            // If it's a matched repeat task, use its numeric manual_id.
            // Otherwise, we have a URL string, which the DB cannot accept as an INT/BIGINT.
            // Send null in that case. A future improvement could be to save the new URL and get an ID.
            manual_id: matchedTask ? matchedTask.manual_id : null,
            re: dom.reInput.value,
            task_type_id: matchedTask ? matchedTask.task_type_id : taskTypeId,
            response_type_id: matchedTask ? matchedTask.response_type_id : responseTypeId,
            response_num: dom.responseTypeNumberInput.value || null,
            comment: dom.taskDetailsInput.value || null,
            status_id: 7, // Default to 'Not Yet' (assuming 7 is the ID for 'Not Yet')
            dept_id: 18,
            do_staff_id: null,
            start_date: dom.startInput.value,
            end_date: dom.endInput.value,
            start_time: null,
            completed_time: null,
            created_staff_id: 1,
            checklistItems: checklistItems,
            // These need to be provided, e.g., from a logged-in user state
            // dept_id: loggedInUser.deptId, 
            // created_staff_id: loggedInUser.staffId,
        };

        if (!taskData.task_type_id || !taskData.response_type_id) {
            showToast('Could not find ID for selected Task Type or Response Type. Please check API data.', 'error');
            return;
        }

        showConfirmationPopup(taskData, isRepeat); // Gọi popup xác nhận
    }

    function setupEventListeners() {
        // Navigation
        dom.goToHQTasksButton.addEventListener('click', () => redirectTo('hq-store.html'));
        dom.goToReceivingTaskButton.addEventListener('click', () => redirectTo('hq-task-list.html'));
        dom.goToCreateTaskButton.addEventListener('click', () => redirectTo('hq-create-task.html'));
        dom.goToStoreListButton.addEventListener('click', () => redirectTo('hq-store-detail.html'));
        dom.goToStoreScreenButton.addEventListener('click', () => redirectTo('index.html'));

        // Form Logic
        dom.isRepeatRadios.forEach(radio => radio.addEventListener("change", handleIsRepeatChange));
        dom.keywordInput.addEventListener("input", handleKeywordInput);
        dom.keywordInput.addEventListener("blur", () => setTimeout(() => dom.suggestionList.style.display = "none", 150));
        dom.storeNameSearchInput.addEventListener("input", filterAndRenderStores);
        dom.storeRegionSearchInput.addEventListener("input", filterAndRenderStores);
        dom.responseTypeSelect.addEventListener('change', handleResponseTypeChange);
        dom.fileUploadButton.addEventListener('click', () => dom.manualFileInput.click());
        dom.manualFileInput.addEventListener('change', handleFileUpload);

        // Action Buttons
        dom.addButton.addEventListener('click', handleAddStores);
        dom.checkButton.addEventListener('click', handleCheckSelectedStores);
        dom.createTaskButton.addEventListener("click", () => handleTaskCreation(false));
        dom.addRepeatButton.addEventListener("click", () => handleTaskCreation(true));
    }
    dom.storeListHeaderCheckbox.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
        dom.storeListBody.querySelectorAll('.select-store').forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    });

    //================================================================================
    // VIII. INITIALIZATION
    //================================================================================
    async function populateTaskTypeOptions() {
        try {
            const taskTypes = await getCodes('1'); // Fetch Task Types (Classification = 1)
            dom.taskTypeSelect.innerHTML = '<option value="" data-id="">-- Select Task Type --</option>' + taskTypes.map(type => `
                <option value="${type.code_master_id}" data-id="${type.code_master_id}">${type.name}</option>
            `).join('');
        } catch (error) {
            console.error("Error populating task type options:", error);
            dom.taskTypeSelect.innerHTML = '<option value="">Error loading types</option>';
        }
    }

    async function populateResponseTypeOptions() {
        try {
            const responseTypes = await getCodes('2'); // Fetch Response Types (Classification = 2)
            dom.responseTypeSelect.innerHTML = '<option value="" data-id="">-- Select Response Type --</option>' + responseTypes.map(type => `
                <option value="${type.code_master_id}" data-id="${type.code_master_id}">${type.name}</option>
            `).join('');
        } catch (error) {
            console.error("Error populating response type options:", error);
            dom.responseTypeSelect.innerHTML = '<option value="">Error loading types</option>';
        }
    }

    async function initialize() {
        const today = new Date().toISOString().split("T")[0];
        dom.startInput.value = today;
        dom.endInput.value = today;
        dom.addRepeatButton.style.display = "none"; // Default is "Yes"

        setupEventListeners();

        // Populate dropdowns asynchronously
        await Promise.all([populateTaskTypeOptions(), populateResponseTypeOptions()]);

        filterAndRenderStores(); // Initial render for selected stores (which is empty)
        // Trigger change event on load to set initial visibility
        handleResponseTypeChange({ target: dom.responseTypeSelect });
    }

    initialize();

})();