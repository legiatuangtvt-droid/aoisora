import { db } from './firebase.js';
import { collection, getDocs, query, orderBy, doc, setDoc, serverTimestamp, addDoc, deleteDoc, getDoc, where, writeBatch, limit, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let sortableInstances = [];
let domController = null;

let allTemplates = [];
let currentTemplateId = null;
let currentMonthlyPlan = null; // Biến để lưu kế hoạch tháng hiện tại cho RM
let originalTemplateData = null; // Biến để lưu trạng thái mẫu gốc cho RM

let allPersonnel = []; // For HQ Apply
let allWorkPositions = []; // Biến để lưu danh sách vị trí công việc
let allShiftCodes = []; // Biến để lưu danh sách mã ca
// Bảng màu mặc định nếu group không có màu

// --- RE Logic Data ---
let allRETasks = [];
// --- End RE Logic Data ---

let currentView = 'builder'; // 'builder' or 're-logic'


const defaultColor = {
    tailwind_bg: 'bg-slate-200', tailwind_text: 'text-slate-800', tailwind_border: 'border-slate-400'
};
let allTaskGroups = {};

/**
 * Xử lý sự kiện khi một task được kéo thả xong (di chuyển, thêm, xóa).
 * @param {Event} evt - Sự kiện từ SortableJS.
 */
function handleDragEnd(evt) {
    updateTemplateFromDOM();
    updateTemplateStats();
}

/**
 * Xử lý sự kiện khi một task mới được thêm vào một slot từ thư viện.
 * @param {Event} evt - Sự kiện từ SortableJS.
 */
function handleTaskAdd(evt) {
    const item = evt.item;
    const toSlot = evt.to;

    // --- LOGIC HOÁN ĐỔI NÂNG CAO ---
    if (evt.pullMode !== 'clone' && toSlot.children.length > 1) {
        const existingItem = Array.from(toSlot.children).find(child => child !== item);
        if (existingItem) {
            evt.from.appendChild(existingItem);
        }
    }

    if (evt.pullMode === 'clone') {
        const taskCode = item.dataset.taskCode;
        const groupId = item.dataset.groupId;
        const taskName = item.textContent;
        const group = allTaskGroups[groupId] || {};
        // Chuyển sang dùng inline style để đảm bảo màu sắc luôn được áp dụng
        const color = (group.color && group.color.bg) ? group.color : defaultColor;

        item.className = `scheduled-task-item relative group w-[70px] h-[100px] border-2 text-xs p-1 rounded-md shadow-sm cursor-grab flex flex-col justify-between items-center text-center mb-1`;
        item.dataset.taskCode = taskCode;
        item.dataset.groupId = groupId;
        item.style.backgroundColor = color.bg;
        item.style.color = color.text;
        item.style.borderColor = color.border;
        item.innerHTML = `
            <div class="resize-handle left-handle" title="Kéo để nhân bản"></div>
            <div class="resize-handle right-handle" title="Kéo để nhân bản"></div>
            <button class="delete-task-btn absolute top-0 right-0 p-1 leading-none font-bold text-current opacity-50 hover:opacity-100 group-hover:opacity-100">×</button>
            <div class="flex-grow flex flex-col justify-center"><span class="overflow-hidden text-ellipsis">${item.querySelector('.text-ellipsis')?.textContent || taskName}</span></div>
            <span class="font-semibold mt-auto">${taskCode}</span>
        `;
    }

    updateTemplateFromDOM();
    checkTemplateChangesAndToggleResetButton(); // Kiểm tra thay đổi sau khi thêm task
    updateTemplateStats();
}

/**
 * Tải tất cả dữ liệu nền cần thiết một lần.
 */
async function fetchInitialData() {
    try {
        const shiftCodesDocRef = doc(db, 'system_configurations', 'shift_codes');
        // Tải nhóm công việc để lấy thông tin màu
        const taskGroupsQuery = query(collection(db, 'task_groups'));
        const taskGroupsSnapshot = await getDocs(taskGroupsQuery);
        allTaskGroups = taskGroupsSnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = { id: doc.id, ...doc.data() };
            return acc;
        }, {});

        // Tải danh sách vị trí công việc
        const workPositionsSnapshot = await getDocs(collection(db, 'work_positions'));
        allWorkPositions = workPositionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Tải mã ca
        const shiftCodesSnap = await getDoc(shiftCodesDocRef);
        if (shiftCodesSnap.exists()) {
            allShiftCodes = shiftCodesSnap.data().codes || [];
        }

        // Tải dữ liệu nhân sự cần cho chức năng "Apply" của HQ
        const [employeesSnap, areaManagersSnap, regionalManagersSnap] = await Promise.all([
            getDocs(collection(db, 'employee')),
            getDocs(collection(db, 'area_managers')),
            getDocs(collection(db, 'regional_managers')),
        ]);
        const employees = employeesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const areaManagers = areaManagersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const regionalManagers = regionalManagersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allPersonnel = [...employees, ...areaManagers, ...regionalManagers];
    } catch (error) {
        console.error("Lỗi nghiêm trọng khi tải dữ liệu nền:", error);
        const container = document.getElementById('template-builder-grid-container');
        if(container) container.innerHTML = `<div class="p-10 text-center text-red-500">Không thể tải dữ liệu nền. Vui lòng thử lại.</div>`;
    }
}

/**
 * Chuyển đổi chuỗi thời gian "HH:mm" thành số phút trong ngày.
 * @param {string} timeStr - Chuỗi thời gian (e.g., "08:30").
 * @returns {number} - Tổng số phút từ 00:00.
 */
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * Định dạng một đối tượng Date thành chuỗi YYYY-MM-DD theo giờ địa phương.
 * @param {Date} date - Đối tượng Date.
 * @returns {string} Chuỗi ngày tháng.
 */
function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Cập nhật giao diện của một dòng ca dựa trên mã ca được chọn.
 * @param {HTMLTableRowElement} row - Phần tử <tr> của dòng ca.
 */
function updateRowAppearance(row) {
    const selector = row.querySelector('.shift-code-selector');
    const selectedShiftCode = selector.value;
    const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === selectedShiftCode);

    const slots = row.querySelectorAll('.quarter-hour-slot');

    if (!shiftInfo || !shiftInfo.timeRange) {
        // Nếu không có ca nào được chọn, reset tất cả các ô về trạng thái mặc định
        slots.forEach(slot => {
            slot.classList.remove('bg-slate-50', 'non-work-slot');
            slot.classList.add('bg-white');
        });
        return;
    }

    const [startStr, endStr] = shiftInfo.timeRange.split('~').map(s => s.trim());
    const shiftStartMinutes = timeToMinutes(startStr);
    const shiftEndMinutes = timeToMinutes(endStr);

    slots.forEach(slot => {
        const time = slot.dataset.time;
        const quarter = parseInt(slot.dataset.quarter, 10);
        const slotDuration = 15; // Mỗi ô là 15 phút
        const slotStartMinutes = timeToMinutes(time) + quarter;
        const slotEndMinutes = slotStartMinutes + slotDuration;

        // Kiểm tra xem slot có nằm trong khoảng thời gian làm việc không
        // Điều kiện mới: Thời gian bắt đầu của ô phải nhỏ hơn thời gian kết thúc ca,
        // và thời gian kết thúc của ô phải nhỏ hơn hoặc bằng thời gian kết thúc ca.
        if (slotStartMinutes >= shiftStartMinutes && slotEndMinutes <= shiftEndMinutes) {
            slot.classList.remove('bg-slate-50', 'non-work-slot');
            slot.classList.add('bg-green-50'); // Ô trong giờ làm việc, cho phép kéo thả
        } else {
            slot.classList.remove('bg-green-50');
            slot.classList.add('bg-slate-50', 'non-work-slot'); // Ô ngoài giờ làm việc
        }
    });
}

/**
 * Thêm một dòng ca mới vào bảng.
 * @param {HTMLTableSectionElement} tbody - Phần tử tbody của bảng.
 * @param {number} shiftNumber - Số thứ tự của ca (ví dụ: 2 cho "Ca 2").
 */
function addShiftRow(tbody, shiftNumber) {
    const currentUser = window.currentUser;
    const isManager = currentUser && (currentUser.roleId === 'REGIONAL_MANAGER' || currentUser.roleId === 'AREA_MANAGER');
    const disabledAttr = isManager ? 'disabled' : '';

    const timeSlots = Array.from({ length: 18 }, (_, i) => `${i + 6}:00`);
    const shiftId = `shift-${shiftNumber}`;
    const newRow = document.createElement('tr');
    newRow.dataset.shiftId = shiftId;

    // Tạo dropdown cho việc chọn mã ca
    // Tạo dropdown cho việc chọn vị trí công việc
    const workPositionOptions = allWorkPositions.map(pos => `<option value="${pos.id}">${pos.name}</option>`).join('');
    const deleteButtonHTML = isManager ? '' : `
        <button class="delete-shift-row-btn absolute top-1 right-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" title="Xóa dòng ca này">
            <i class="fas fa-times"></i>
        </button>
    `;

    let bodyRowHtml = `
        <td class="group p-1 border border-slate-200 align-center sticky left-0 bg-white z-10 w-40 min-w-40 font-semibold text-center">
            <div class="space-y-1">
                <input list="shift-codes-datalist" 
                       class="shift-code-selector form-input w-full text-xs text-center p-1 font-semibold" 
                       placeholder="-- Nhập/Chọn Ca --" ${disabledAttr}>
                <!-- Thêm div để hiển thị khung giờ -->
                <div class="shift-time-display text-xs text-slate-500 h-4"></div>
                <select class="work-position-selector form-input w-full text-xs text-center p-1" ${disabledAttr}>
                    <option value="">-- Chọn Vị trí --</option>
                    ${workPositionOptions}
                </select>
            </div>
            ${deleteButtonHTML}
        </td>
    `;

    timeSlots.forEach(time => {
        bodyRowHtml += `
            <td class="p-0 border border-slate-200 align-top">
                <div class="grid grid-cols-4 h-[104px]">
                    <div class="quarter-hour-slot border-r border-dashed border-slate-200 flex justify-center items-center" data-shift-id="${shiftId}" data-time="${time}" data-quarter="00"></div>
                    <div class="quarter-hour-slot border-r border-dashed border-slate-200 flex justify-center items-center" data-shift-id="${shiftId}" data-time="${time}" data-quarter="15"></div>
                    <div class="quarter-hour-slot border-r border-dashed border-slate-200 flex justify-center items-center" data-shift-id="${shiftId}" data-time="${time}" data-quarter="30"></div>
                    <div class="quarter-hour-slot flex justify-center items-center" data-shift-id="${shiftId}" data-time="${time}" data-quarter="45"></div>
                </div>
            </td>
        `;
    });

    newRow.innerHTML = bodyRowHtml;
    tbody.appendChild(newRow);

    // Gắn sự kiện onchange cho dropdown vừa tạo
    const newSelector = newRow.querySelector('.shift-code-selector');
    if (newSelector) {
        // Sử dụng sự kiện 'input' để bắt cả việc gõ và chọn từ datalist
        newSelector.addEventListener('input', () => {
            const shiftCodeValue = newSelector.value;
            const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === shiftCodeValue);
            const timeDisplay = newRow.querySelector('.shift-time-display');

            if (shiftInfo) {
                if (timeDisplay) timeDisplay.textContent = shiftInfo.timeRange;
            } else {
                if (timeDisplay) timeDisplay.textContent = ''; // Xóa giờ nếu mã ca không hợp lệ
            }

            // Cập nhật giao diện và lưu thay đổi
            updateRowAppearance(newRow);
            updateTemplateFromDOM();
        });
    }
    const newPositionSelector = newRow.querySelector('.work-position-selector');
    if (newPositionSelector) {
        // Tự động lưu khi thay đổi vị trí
        newPositionSelector.addEventListener('change', updateTemplateFromDOM);
    }

    // Kích hoạt lại chức năng kéo-thả cho các ô mới trong dòng vừa thêm
    newRow.querySelectorAll('.quarter-hour-slot').forEach(slot => {
        const sortable = Sortable.create(slot, {
            group: {
                name: 'template-tasks',
                pull: true,
                put: function (to) {
                    // Đảm bảo logic này nhất quán với initializeDragAndDrop
                    return !to.el.classList.contains('non-work-slot');
                }
            },
            animation: 150,
            ghostClass: "swap-ghost",
            onEnd: handleDragEnd, onAdd: handleTaskAdd
        });
        sortableInstances.push(sortable);
    });
}

/**
 * Render toàn bộ lưới xây dựng lịch trình.
 */
function renderGrid() {
    const container = document.getElementById('template-builder-grid-container');
    if (!container) return;

    const timeSlots = Array.from({ length: 18 }, (_, i) => `${i + 6}:00`); // 6:00 -> 23:00

    // Tạo bảng
    const table = document.createElement('table');
    table.className = 'min-w-full border-collapse border border-slate-200 table-fixed';

    // --- Tạo Header (Tên nhân viên) ---
    const thead = document.createElement('thead');
    thead.className = 'bg-slate-100 sticky top-0 z-20'; // Tăng z-index để header nổi trên các ô sticky
    let headerRowHtml = `<th class="p-2 border border-slate-200 min-w-36 sticky left-0 bg-slate-100 z-30">Ca</th>`; // Cột Ca, sticky
    timeSlots.forEach(time => {
        headerRowHtml += `
            <th class="p-2 border border-slate-200 min-w-[308px] text-center font-semibold text-slate-700">${time}</th>
        `;
    });
    thead.innerHTML = `<tr>${headerRowHtml}</tr>`;
    table.appendChild(thead);

    // --- Tạo Body (Các hàng thời gian và ô kéo thả) ---
    const tbody = document.createElement('tbody');
    addShiftRow(tbody, 1); // Chỉ tạo 1 dòng ca ban đầu
    table.appendChild(tbody);

    container.innerHTML = ''; // Xóa nội dung "đang tải"
    container.appendChild(table);

    // --- Tạo nút "Thêm Dòng Ca" ---
    const addRowButtonContainer = document.createElement('div');
    // Nút này sẽ nằm dưới bảng
    addRowButtonContainer.className = 'mt-4';
    const addRowButton = document.createElement('button');
    addRowButton.id = 'add-shift-row-btn';
    addRowButton.className = 'btn btn-secondary text-sm';
    addRowButton.innerHTML = '<i class="fas fa-plus mr-2"></i> Thêm Ca';
    addRowButton.addEventListener('click', () => {
        const currentShiftCount = tbody.children.length;
        addShiftRow(tbody, currentShiftCount + 1);
    });
    addRowButtonContainer.appendChild(addRowButton);
    container.appendChild(addRowButtonContainer);
    // Chỉ hiển thị nút này cho HQ/Admin
    const currentUser = window.currentUser;
    if (currentUser && (currentUser.roleId === 'HQ_STAFF' || currentUser.roleId === 'ADMIN')) {
        const addRowButtonContainer = document.createElement('div');
        addRowButtonContainer.className = 'mt-4';
        const addRowButton = document.createElement('button');
        addRowButton.id = 'add-shift-row-btn';
        addRowButton.className = 'btn btn-secondary text-sm';
        addRowButton.innerHTML = '<i class="fas fa-plus mr-2"></i> Thêm Ca';
        addRowButton.addEventListener('click', () => {
            const currentShiftCount = tbody.children.length;
            addShiftRow(tbody, currentShiftCount + 1);
        });
        addRowButtonContainer.appendChild(addRowButton);
        container.appendChild(addRowButtonContainer);
    }

    initializeDragAndDrop();
}


/**
 * Khởi tạo chức năng kéo thả cho các ô 15 phút.
 */
function initializeDragAndDrop() {
    // Hủy các instance cũ để tránh rò rỉ bộ nhớ
    sortableInstances.forEach(s => s.destroy());
    sortableInstances = [];

    document.querySelectorAll('.quarter-hour-slot').forEach(slot => {
        const sortable = Sortable.create(slot, {
            group: {
                name: 'template-tasks',
                pull: true,
                // Chỉ cho phép thả vào ô không phải là 'non-work-slot'
                put: function (to) {
                    // `to.el` là phần tử DOM của slot đang được kéo vào
                    return !to.el.classList.contains('non-work-slot');
                }
            },
            animation: 150,
            ghostClass: "swap-ghost", // Class cho "bóng ma" khi kéo, để tùy chỉnh hiệu ứng đổi chỗ
            onEnd: handleDragEnd,
            onAdd: handleTaskAdd
        });
        sortableInstances.push(sortable);
    });

    // Thêm listener để xóa task
    const gridContainer = document.getElementById('template-builder-grid-container');
    if (gridContainer) {
        gridContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-task-btn')) {
                e.target.closest('.scheduled-task-item').remove(); // Xóa toàn bộ thẻ task
                updateTemplateFromDOM(); // Cập nhật lại dữ liệu sau khi xóa. Hàm này đã gọi checkTemplateChangesAndToggleResetButton()
                updateTemplateStats(); // Cập nhật thống kê
            }

            // Xử lý xóa dòng ca
            if (e.target.closest('.delete-shift-row-btn')) {
                const row = e.target.closest('tr');
                const shiftId = row.dataset.shiftId;
                const shiftName = row.querySelector('.shift-code-selector option:checked')?.textContent || 'Ca chưa chọn';

                window.showConfirmation(`Bạn có chắc chắn muốn xóa toàn bộ dòng "${shiftName}" không?`, 'Xác nhận xóa dòng', 'Xóa', 'Hủy').then(confirmed => {
                    if (confirmed) {
                        row.remove();
                        updateTemplateFromDOM(); // Cập nhật lại dữ liệu sau khi xóa. Hàm này đã gọi checkTemplateChangesAndToggleResetButton()
                        updateTemplateStats();
                    }
                });
            }
        });

        initializeResizeListeners(gridContainer);
    }
}

/**
 * Khởi tạo listener cho việc kéo-thả nhân bản task.
 * @param {HTMLElement} container - Container chính của lưới.
 */
function initializeResizeListeners(container) {
    let isResizing = false;
    let originalTask = null;
    let processedSlots = new Set();
    let previewContainer = null;

    container.addEventListener('mousedown', function(e) {
        const handle = e.target.closest('.resize-handle');
        if (!handle) return;

        e.preventDefault();
        e.stopPropagation();

        isResizing = true;
        originalTask = handle.closest('.scheduled-task-item');
        processedSlots.clear();
        processedSlots.add(originalTask.parentElement); // Thêm slot gốc vào danh sách đã xử lý

        document.body.style.cursor = 'col-resize';

        // Tạo container cho các preview ghost
        // Thay vì container, ta tạo một ghost element duy nhất
        previewContainer = originalTask.cloneNode(true);
        previewContainer.id = 'resize-ghost-stretched'; // Đặt ID để dễ dàng truy vấn và xóa
        // Xóa các thành phần không cần thiết trên ghost
        previewContainer.querySelector('.left-handle')?.remove();
        previewContainer.querySelector('.right-handle')?.remove();
        previewContainer.querySelector('.delete-task-btn')?.remove();
        document.body.appendChild(previewContainer);
    });

    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;

        const targetSlot = e.target.closest('.quarter-hour-slot');
        if (!targetSlot || processedSlots.has(targetSlot)) {
            return;
        }

        // Chỉ cho phép nhân bản trong cùng một hàng (cùng nhân viên)
        const originalShiftId = originalTask.closest('.quarter-hour-slot').dataset.shiftId;
        if (targetSlot.dataset.shiftId !== originalShiftId) {
            return;
        }

        // --- Logic hiển thị preview kéo giãn ---
        const allSlotsInRow = Array.from(targetSlot.closest('tr').querySelectorAll('.quarter-hour-slot'));
        const originalSlot = originalTask.parentElement;
        const originalIndex = allSlotsInRow.indexOf(originalSlot);
        const targetIndex = allSlotsInRow.indexOf(targetSlot);

        const snapThreshold = 15; // Khoảng cách (px) từ cạnh để bắt đầu bám dính
        const originalRect = originalSlot.getBoundingClientRect();
        const targetRect = targetSlot.getBoundingClientRect();
        const mouseX = e.clientX;

        let left, width;
        if (targetIndex >= originalIndex) {
            // Kéo sang phải
            left = originalRect.left;
            // Bám dính vào cạnh phải của ô target
            if (mouseX >= targetRect.right - snapThreshold) {
                width = targetRect.right - originalRect.left;
            // Bám dính vào cạnh trái của ô target (khi kéo lùi lại)
            } else if (mouseX <= targetRect.left + snapThreshold) {
                width = targetRect.left - originalRect.left;
            } else {
                // Kéo mượt ở giữa
                width = mouseX - originalRect.left;
            }
        } else {
            // Kéo sang trái
            // Bám dính vào cạnh trái của ô target
            if (mouseX <= targetRect.left + snapThreshold) {
                left = targetRect.left;
                width = originalRect.right - targetRect.left;
            // Bám dính vào cạnh phải của ô target (khi kéo lùi lại)
            } else if (mouseX >= targetRect.right - snapThreshold) {
                left = targetRect.right;
                width = originalRect.right - targetRect.right;
            } else {
                // Kéo mượt ở giữa
                left = mouseX;
                width = originalRect.right - mouseX;
            }
        }

        previewContainer.style.left = `${left + window.scrollX}px`;
        previewContainer.style.top = `${originalRect.top + window.scrollY}px`;
        previewContainer.style.width = `${width}px`;
        previewContainer.style.height = `${originalRect.height}px`;
    });

    document.addEventListener('mouseup', function(e) {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = 'default';

            // Xóa container preview
            if (previewContainer) {
                previewContainer.remove();
                previewContainer = null;
            }

            // Thực hiện nhân bản thật
            const finalClones = createRealClones(e.target, originalTask);
            if (finalClones > 0) {
                updateTemplateFromDOM();
                updateTemplateStats();
            }
        }
    })
}

/**
 * Thu thập dữ liệu từ lưới và lưu vào Firestore.
 */
async function saveTemplate() {
    const saveButton = document.getElementById('save-template-btn');
    let templateIdToSave = currentTemplateId;
    let templateName = '';

    // Nếu đang ở chế độ tạo mới, yêu cầu nhập tên
    const totalManhour = parseFloat(document.getElementById('template-manhour-input').value) || 0;
    if (!templateIdToSave) {
        templateName = await showPrompt("Nhập tên cho mẫu mới:", "Tạo Lịch Trình Mẫu", "Ví dụ: Ngày cuối tuần", "Lưu", "Hủy");
        if (!templateName || templateName.trim() === '') {
            window.showToast('Tên mẫu không được để trống.', 'warning');
            return;
        }
    } else {
        templateName = allTemplates.find(t => t.id === templateIdToSave)?.name;
    }

    saveButton.disabled = true;
    saveButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Đang lưu...`;

    const scheduleData = {};
    const shiftMappings = {}; // Lưu map giữa shiftId và shiftCode

    // 1. Thu thập dữ liệu task từ DOM
    document.querySelectorAll('.scheduled-task-item').forEach(taskItem => {
        const slot = taskItem.closest('.quarter-hour-slot');
        if (!slot) return;

        const shiftId = slot.dataset.shiftId;
        if (!shiftId) return;

        const taskName = taskItem.querySelector('span.overflow-hidden').textContent; // Lấy tên task từ DOM
        const taskCode = taskItem.dataset.taskCode;
        const groupId = taskItem.dataset.groupId; // Lấy groupId từ DOM
        const time = slot.dataset.time;
        const quarter = slot.dataset.quarter;
        const startTime = `${time.split(':')[0].padStart(2, '0')}:${quarter}`;

        if (!scheduleData[shiftId]) {
            scheduleData[shiftId] = [];
        }

        scheduleData[shiftId].push({ taskCode, taskName, startTime, groupId });
    });

    // Thu thập dữ liệu từ các dropdown chọn ca và vị trí
    document.querySelectorAll('#template-builder-grid-container tbody tr').forEach(row => {
        const shiftId = row.dataset.shiftId;
        const selectedShiftCode = row.querySelector('.shift-code-selector')?.value;
        const selectedPositionId = row.querySelector('.work-position-selector')?.value;
        if (shiftId && (selectedShiftCode || selectedPositionId)) {
            shiftMappings[shiftId] = { shiftCode: selectedShiftCode, positionId: selectedPositionId };
        }
    });

    // 2. Lưu vào Firestore
    try {
        const dataToSave = { schedule: scheduleData, shiftMappings: shiftMappings, totalManhour: totalManhour };
        if (templateIdToSave) {
            // Cập nhật mẫu đã có
            const templateRef = doc(db, 'daily_templates', templateIdToSave);
            await setDoc(templateRef, { ...dataToSave, updatedAt: serverTimestamp() }, { merge: true });
        } else {
            // Tạo mẫu mới
            const newDocRef = await addDoc(collection(db, 'daily_templates'), {
                name: templateName.trim(),
                schedule: scheduleData,
                shiftMappings: shiftMappings, // Lưu cả khi tạo mới
                createdAt: serverTimestamp()
            , totalManhour: totalManhour});
            // Sau khi tạo thành công, tải lại danh sách và tự động chọn mẫu vừa tạo
            await fetchAndRenderTemplates();
            document.getElementById('template-selector').value = newDocRef.id;
            await loadTemplate(newDocRef.id);
        }

        window.showToast('Đã lưu lịch trình mẫu thành công!', 'success');
    } catch (error) {
        console.error("Lỗi khi lưu lịch trình mẫu:", error);
        window.showToast('Lỗi khi lưu lịch trình. Vui lòng thử lại.', 'error');
    } finally {
        saveButton.disabled = false;
        saveButton.innerHTML = `<i class="fas fa-save mr-2"></i> Lưu Lịch Trình Mẫu`;
    }
}

/**
 * Thu thập dữ liệu từ DOM và cập nhật mẫu hiện tại trong Firestore.
 * Không yêu cầu tên mẫu hay tạo mẫu mới.
 */
async function updateTemplateFromDOM() {
    // --- LOGIC MỚI: Chỉ lưu vào DB nếu là HQ/Admin ---
    const currentUser = window.currentUser;
    const isPrivilegedUser = currentUser && (currentUser.roleId === 'HQ_STAFF' || currentUser.roleId === 'ADMIN');

    // Luôn kiểm tra thay đổi để hiển thị nút Reset cho RM/AM
    checkTemplateChangesAndToggleResetButton(); // Kiểm tra thay đổi mỗi khi DOM cập nhật

    if (!currentTemplateId) {
        // Nếu không có mẫu nào đang được chọn (chế độ tạo mới), không làm gì cả.
        // Việc lưu sẽ được xử lý bởi saveTemplate khi người dùng nhấn nút lưu.
        return;
    }

    const scheduleData = {};
    // Nếu không phải người dùng có quyền, chỉ cần chạy checkTemplateChangesAndToggleResetButton và thoát
    if (!isPrivilegedUser) {
        // Không thực hiện việc thu thập dữ liệu và ghi vào DB
        return;
    }

    const shiftMappings = {};
    const totalManhour = parseFloat(document.getElementById('template-manhour-input').value) || 0;

    // 1. Thu thập dữ liệu từ DOM
    document.querySelectorAll('#template-builder-grid-container .scheduled-task-item').forEach(taskItem => {
        const slot = taskItem.closest('.quarter-hour-slot');
        if (!slot) return;

        const shiftId = slot.dataset.shiftId;
        const taskName = taskItem.querySelector('span.overflow-hidden').textContent;
        const taskCode = taskItem.dataset.taskCode;
        const groupId = taskItem.dataset.groupId; // Lấy groupId
        const time = slot.dataset.time;
        const quarter = slot.dataset.quarter;
        const startTime = `${time.split(':')[0].padStart(2, '0')}:${quarter}`;

        if (!scheduleData[shiftId]) {
            scheduleData[shiftId] = [];
        }
        scheduleData[shiftId].push({ taskCode, taskName, startTime, groupId });
    });

    // Thu thập dữ liệu từ các dropdown chọn ca và vị trí
    document.querySelectorAll('#template-builder-grid-container tbody tr').forEach(row => {
        const shiftId = row.dataset.shiftId;
        const selectedShiftCode = row.querySelector('.shift-code-selector')?.value;
        const selectedPositionId = row.querySelector('.work-position-selector')?.value;
        if (shiftId) {
            // Lưu cả mã ca và mã vị trí
            shiftMappings[shiftId] = { shiftCode: selectedShiftCode, positionId: selectedPositionId };
        }
    });

    // 2. Cập nhật vào Firestore
    try {
        const templateRef = doc(db, 'daily_templates', currentTemplateId); // Cập nhật shiftMappings
        await setDoc(templateRef, { schedule: scheduleData, shiftMappings: shiftMappings, totalManhour: totalManhour, updatedAt: serverTimestamp() }, { merge: true });
        // showToast('Đã tự động lưu thay đổi!', 'success', 1000); // Có thể thêm toast nhỏ
    } catch (error) {
        console.error("Lỗi khi tự động cập nhật lịch trình mẫu:", error);
        window.showToast('Lỗi khi tự động lưu thay đổi. Vui lòng thử lại.', 'error');
    }
}

/**
 * Tải danh sách các mẫu và render vào dropdown.
 */
async function fetchAndRenderTemplates() {
    const templateSelector = document.getElementById('template-selector');
    templateSelector.innerHTML = `<option value="">-- Đang tải... --</option>`;

    try {
        const q = query(collection(db, 'daily_templates'), orderBy('name'));
        const snapshot = await getDocs(q);
        allTemplates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const currentUser = window.currentUser;
        let optionsHtml = '';

        // Chỉ hiển thị tùy chọn "Tạo Mẫu Mới" cho vai trò HQ và Admin
        if (currentUser && (currentUser.roleId === 'HQ_STAFF' || currentUser.roleId === 'ADMIN')) {
            optionsHtml = `<option value="new">-- Tạo Mẫu Mới --</option>`;
        } else {
            // Đối với các vai trò khác (Manager), kiểm tra xem có mẫu nào không
            if (allTemplates.length > 0) {
                optionsHtml = ``; // Không cần tùy chọn mặc định vì hệ thống sẽ tự động chọn mẫu được áp dụng
            } else {
                optionsHtml = `<option value="">-- Chưa có mẫu --</option>`;
            }
        }
        optionsHtml += allTemplates.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
        templateSelector.innerHTML = optionsHtml;

    } catch (error) {
        console.error("Lỗi khi tải danh sách mẫu:", error);
        templateSelector.innerHTML = `<option value="">-- Lỗi tải mẫu --</option>`;
    }
}

/**
 * (Dành cho HQ) Tìm và hiển thị trạng thái áp dụng của mẫu đang được chọn.
 * @param {string} templateId ID của mẫu đang được chọn.
 */
async function showTemplateApplyStatus(templateId) {
    const statusContainer = document.getElementById('template-display-container');
    const statusDisplay = document.getElementById('template-name-display');
    if (!statusContainer || !statusDisplay) return;

    if (!templateId || templateId === 'new') {
        statusContainer.classList.add('hidden');
        return;
    }
    // Lấy các nút để điều khiển trạng thái
    const hqApplyBtn = document.getElementById('apply-template-hq-btn');
    const hqApplyBtnSpan = hqApplyBtn?.querySelector('span');
    const saveBtn = document.getElementById('save-template-btn');
    const deleteBtn = document.getElementById('delete-template-btn');

    // Reset trạng thái các nút về mặc định trước khi kiểm tra
    if (hqApplyBtn) hqApplyBtn.classList.remove('hidden');
    if (hqApplyBtnSpan) hqApplyBtnSpan.textContent = 'Triển khai';
    if (saveBtn) saveBtn.classList.remove('hidden');
    if (deleteBtn) deleteBtn.classList.remove('hidden');


    statusDisplay.textContent = 'Đang kiểm tra trạng thái...';
    statusContainer.classList.remove('hidden');

    try {
        const plansQuery = query(
            collection(db, 'monthly_plans'),
            where('templateId', '==', templateId),
            orderBy('cycleStartDate', 'desc'),
            limit(1)
        );
        const plansSnap = await getDocs(plansQuery);
 
        if (plansSnap.empty) {
            statusDisplay.textContent = 'Chưa được áp dụng cho chu kỳ nào.';
        } else {
            const latestPlan = plansSnap.docs[0].data();
            const isFinalState = latestPlan.status === 'HQ_CONFIRMED' || latestPlan.status === 'HQ_REJECTED_RM_CHANGES';

            if (isFinalState) {
                // Nếu kế hoạch đã hoàn thành hoặc bị từ chối, cho phép chỉnh sửa/áp dụng lại mẫu
                statusDisplay.textContent = `Chu kỳ gần nhất đã hoàn tất (${latestPlan.status}). Mẫu có thể được sử dụng lại.`;
                if (hqApplyBtn) hqApplyBtn.classList.remove('hidden');
                if (hqApplyBtnSpan) hqApplyBtnSpan.textContent = 'Triển khai';
                if (saveBtn) saveBtn.classList.remove('hidden');
                if (deleteBtn) deleteBtn.classList.remove('hidden');
            } else {
                // Nếu kế hoạch đang trong quá trình xử lý, ẩn các nút
                const hqAppliedEntry = latestPlan.history?.find(h => h.status === 'HQ_APPLIED');
                const deploymentDateTime = hqAppliedEntry?.timestamp.toDate().toLocaleString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) || 'không rõ';
                const cycleStartDate = new Date(latestPlan.cycleStartDate).toLocaleDateString('vi-VN');

                statusDisplay.textContent = `Mẫu đang được triển khai tới RM, do HQ thực hiện vào lúc ${deploymentDateTime}.`;

                // Ẩn các nút vì mẫu đã được gửi đi
                if (hqApplyBtn) hqApplyBtn.classList.add('hidden');
                if (saveBtn) saveBtn.classList.add('hidden');
                if (deleteBtn) deleteBtn.classList.add('hidden');

            }
        }
    } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái mẫu:", error);
        statusDisplay.textContent = 'Lỗi khi kiểm tra trạng thái.';
    }
}

/**
 * Tải dữ liệu của một mẫu cụ thể và hiển thị lên lưới.
 * @param {string} templateId ID của mẫu cần tải.
 */
async function loadTemplate(templateId) {
    // Nếu người dùng chọn "Tạo Mẫu Mới"
    originalTemplateData = null; // Reset trạng thái gốc mỗi khi tải mẫu mới
    if (templateId === 'new') {
        switchToCreateNewMode();
        return;
    }

    currentTemplateId = templateId;
    renderGrid(); // Render lại lưới trống trước

    // Đối với HQ, hiển thị trạng thái áp dụng của mẫu đã chọn
    const currentUser = window.currentUser;
    if (currentUser && (currentUser.roleId === 'HQ_STAFF' || currentUser.roleId === 'ADMIN' || currentUser.roleId === 'REGIONAL_MANAGER' || currentUser.roleId === 'AREA_MANAGER')) {
        showTemplateApplyStatus(templateId);
    }

    // Hiển thị các nút cho chế độ xem/sửa, chỉ dành cho HQ/Admin
    if (currentUser && (currentUser.roleId === 'HQ_STAFF' || currentUser.roleId === 'ADMIN')) {
        document.getElementById('new-template-btn').classList.remove('hidden');
        document.getElementById('delete-template-btn').classList.remove('hidden');
    }

    updateTemplateStats(); // Xóa thống kê cũ
    if (!templateId) return; // Thoát nếu không có ID

    try {
        const templateRef = doc(db, 'daily_templates', templateId);
        const docSnap = await getDoc(templateRef);

        if (docSnap.exists()) {
            const { schedule, totalManhour, shiftMappings } = docSnap.data();

            // Cập nhật giá trị Manhour từ Firestore
            // Lưu lại trạng thái ban đầu của mẫu cho việc so sánh
            originalTemplateData = {
                schedule: JSON.parse(JSON.stringify(schedule || {})),
                shiftMappings: JSON.parse(JSON.stringify(shiftMappings || {})),
                totalManhour: totalManhour || 0
            };
            const manhourInput = document.getElementById('template-manhour-input');
            const manhourDisplay = document.getElementById('total-manhour-display');
            if (manhourInput) {
                manhourInput.value = totalManhour || '';
            }
            if (manhourDisplay) {
                manhourDisplay.textContent = totalManhour || '0';
            }
            if (!schedule) { updateTemplateStats(); return; };

            // --- FIX: Tự động tạo thêm dòng ca nếu mẫu có nhiều hơn 1 dòng ---
            const shiftIds = Object.keys(schedule);
            if (shiftIds.length > 0) {
                // Tìm số thứ tự ca lớn nhất trong dữ liệu mẫu
                const maxShiftNumber = Math.max(...shiftIds.map(id => parseInt(id.replace('shift-', ''), 10)));
                
                const tbody = document.querySelector('#template-builder-grid-container tbody');
                if (tbody) {
                    // Tạo thêm các dòng từ 2 đến maxShiftNumber
                    for (let i = 2; i <= maxShiftNumber; i++) {
                        addShiftRow(tbody, i);
                    }
                }
            }

            // --- FIX: Chọn lại mã ca đã lưu trong dropdown ---
            if (shiftMappings) {
                Object.keys(shiftMappings).forEach(shiftId => {
                    const row = document.querySelector(`tr[data-shift-id="${shiftId}"]`);
                    if (row) {
                        const selector = row.querySelector('.shift-code-selector');
                        const positionSelector = row.querySelector('.work-position-selector');
                        const mappingData = shiftMappings[shiftId];
                        if (selector && mappingData?.shiftCode) selector.value = mappingData.shiftCode; // Gán giá trị cho input
                        if (positionSelector && mappingData?.positionId) positionSelector.value = mappingData.positionId;
                        updateRowAppearance(row); // Tô màu cho dòng sau khi tải

                        // Cập nhật hiển thị khung giờ cho input
                        if (selector.value && mappingData?.shiftCode) {
                            const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === mappingData.shiftCode);
                            const timeDisplay = row.querySelector('.shift-time-display');
                            if (shiftInfo && timeDisplay) {
                                timeDisplay.textContent = shiftInfo.timeRange;
                            }
                        }

                    }
                });
            }
            
            // Điền các task vào lưới
            Object.keys(schedule).forEach(shiftId => {
                (schedule[shiftId] || []).forEach(taskInfo => { // taskInfo giờ đây có cả taskName
                    const { taskCode, startTime, groupId } = taskInfo;
                    const [hour, quarter] = startTime.split(':');
                    const time = `${parseInt(hour, 10)}:00`;

                    const slot = document.querySelector(`.quarter-hour-slot[data-shift-id="${shiftId}"][data-time="${time}"][data-quarter="${quarter}"]`);
                    if (slot) {
                        const group = allTaskGroups[groupId] || {};
                        // Chuyển sang dùng inline style để đảm bảo màu sắc luôn được áp dụng
                        const color = (group.color && group.color.bg) ? group.color : defaultColor;
                        // Lấy tên task từ dữ liệu mẫu, nếu không có thì dùng mã task
                        const taskName = taskInfo.taskName || '...'; // Lấy taskName từ dữ liệu mẫu
                        const taskItem = document.createElement('div'); 
                        // Sử dụng justify-between để đẩy taskCode xuống dưới
                        taskItem.className = `scheduled-task-item relative group w-[70px] h-[100px] border-2 text-xs p-1 rounded-md shadow-sm cursor-grab flex flex-col justify-between items-center text-center mb-1`;
                        taskItem.dataset.taskCode = taskCode;
                        taskItem.dataset.groupId = groupId;
                        taskItem.style.backgroundColor = color.bg;
                        taskItem.style.color = color.text;
                        taskItem.style.borderColor = color.border;
                        taskItem.innerHTML = `
                            <div class="resize-handle left-handle" title="Kéo để nhân bản"></div>
                            <div class="resize-handle right-handle" title="Kéo để nhân bản"></div>
                            <button class="delete-task-btn absolute top-0 right-0 p-1 leading-none font-bold text-current opacity-50 hover:opacity-100 group-hover:opacity-100">×</button>
                            <div class="flex-grow flex flex-col justify-center">
                                <span class="overflow-hidden text-ellipsis">${taskInfo.taskName || taskCode}</span>
                            </div>
                            <span class="font-semibold mt-auto">${taskCode}</span>
                        `;
                        slot.appendChild(taskItem);
                    }
                });
            });
            // Cập nhật thống kê sau khi tải xong
            updateTemplateStats();
        }
    } catch (error) {
        console.error("Lỗi khi tải chi tiết mẫu:", error);
        window.showToast('Không thể tải dữ liệu cho mẫu này.', 'error');
    }
}

/**
 * Chuyển giao diện về chế độ tạo mẫu mới.
 */
function switchToCreateNewMode() {
    originalTemplateData = null; // Xóa trạng thái gốc
    currentTemplateId = null;
    document.getElementById('template-selector').value = 'new';
    renderGrid(); // Vẽ lại lưới trống

    // Ẩn các nút không cần thiết
    document.getElementById('new-template-btn').classList.add('hidden');
    document.getElementById('delete-template-btn').classList.add('hidden');

    document.getElementById('reset-template-btn')?.classList.add('hidden');
    // Ẩn luôn phần hiển thị trạng thái
    const statusContainer = document.getElementById('template-display-container');
    if (statusContainer) {
        statusContainer.classList.add('hidden');
    }
    // Reset giá trị Manhour
    const manhourInput = document.getElementById('template-manhour-input');
    const manhourDisplay = document.getElementById('total-manhour-display');
    if (manhourInput) {
        manhourInput.value = '';
    }
    if (manhourDisplay) {
        manhourDisplay.textContent = '0';
    }
    updateTemplateStats(); // Xóa thống kê
}

/**
 * Xử lý việc xóa mẫu hiện tại.
 */
async function deleteCurrentTemplate() {
    if (!currentTemplateId) return;

    const currentTemplate = allTemplates.find(t => t.id === currentTemplateId);
    const confirmed = await showConfirmation(`Bạn có chắc chắn muốn xóa mẫu "${currentTemplate.name}" không? Hành động này không thể hoàn tác.`, 'Xác nhận xóa', 'Xóa', 'Hủy');
    if (confirmed) {
        try {
            await deleteDoc(doc(db, 'daily_templates', currentTemplateId));
            window.showToast(`Đã xóa mẫu "${currentTemplate.name}".`, 'success');
            await fetchAndRenderTemplates(); // Tải lại danh sách và chọn mẫu đầu tiên
            switchToCreateNewMode(); // Chuyển về chế độ tạo mới
        } catch (error) {
            console.error("Lỗi khi xóa mẫu:", error);
            window.showToast('Đã có lỗi xảy ra khi xóa mẫu.', 'error');
        }
    }
}

export async function init() {
    domController = new AbortController();
    const { signal } = domController;

    // Tải dữ liệu nền và danh sách mẫu trước
    await fetchInitialData();
    await fetchAndRenderTemplates();

    const currentUser = window.currentUser;

    // Phân luồng hiển thị giao diện dựa trên vai trò người dùng
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

    } else if (currentUser && (currentUser.roleId === 'HQ_STAFF' || currentUser.roleId === 'ADMIN')) {
        // --- GIAO DIỆN CHO HQ/ADMIN ---
        // Hiển thị bộ chọn mẫu và các nút quản lý
        document.getElementById('template-selector-container')?.classList.remove('hidden');
        document.getElementById('template-display-container')?.classList.remove('hidden'); // Cho phép HQ xem trạng thái
        document.getElementById('apply-template-hq-btn')?.classList.remove('hidden');
        document.getElementById('save-template-btn')?.classList.remove('hidden');
        document.getElementById('new-template-btn')?.classList.remove('hidden');
        document.getElementById('delete-template-btn')?.classList.remove('hidden');
        document.getElementById('toggle-view-btn')?.classList.remove('hidden');
        // Đặt trạng thái mặc định là "Tạo Mẫu Mới"
        switchToCreateNewMode();
    }

    document.getElementById('save-template-btn')?.addEventListener('click', saveTemplate, { signal });
    document.getElementById('new-template-btn')?.addEventListener('click', switchToCreateNewMode, { signal });
    document.getElementById('delete-template-btn')?.addEventListener('click', deleteCurrentTemplate, { signal });
    document.getElementById('reset-template-btn')?.addEventListener('click', handleResetTemplate, { signal });
    document.getElementById('toggle-view-btn')?.addEventListener('click', toggleBuilderView, { signal });
    document.getElementById('template-selector')?.addEventListener('change', (e) => loadTemplate(e.target.value), { signal });


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
    const hqApplyBtn = document.getElementById('apply-template-hq-btn');
    if (hqApplyBtn) {
        hqApplyBtn.addEventListener('click', handleDeployClick, { signal });
    }
    if (!document.getElementById('shift-codes-datalist')) {
        const datalist = document.createElement('datalist');
        datalist.id = 'shift-codes-datalist';
        datalist.innerHTML = allShiftCodes.map(sc => `<option value="${sc.shiftCode}">${sc.timeRange}</option>`).join(''); // Fix: Thêm đóng tag option
        document.body.appendChild(datalist);
    }
    const manhourInput = document.getElementById('template-manhour-input');
    const manhourDisplay = document.getElementById('total-manhour-display');
    if (manhourInput && manhourDisplay) {
        manhourInput.addEventListener('input', () => {
            manhourDisplay.textContent = manhourInput.value || '0';
            updateTemplateFromDOM(); // Tự động lưu khi thay đổi manhour
        });
        // Thêm listener để đồng bộ ngược lại khi giá trị được load từ template
        // (Mặc dù đã có trong loadTemplate, việc này đảm bảo tính nhất quán nếu có thay đổi trong tương lai)
        manhourInput.addEventListener('change', () => {
            manhourDisplay.textContent = manhourInput.value || '0';
            // Không cần gọi updateTemplateFromDOM() ở đây vì listener 'input' đã xử lý
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
    // Dọn dẹp các listener bằng cách clone và thay thế node
    ['save-template-btn', 'new-template-btn', 'delete-template-btn', 'template-selector', 'apply-template-hq-btn', 'reset-template-btn', 'approve-plan-btn', 'reject-plan-btn'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { // Thêm nút reset vào danh sách dọn dẹp
            const newEl = el.cloneNode(true);
            el.parentNode.replaceChild(newEl, el);
        }
    });
}

/**
 * Chuyển đổi giữa giao diện xây dựng mẫu và giao diện RE Logic.
 */
async function toggleBuilderView() {
    const builderContainer = document.getElementById('template-builder-grid-container');
    const reLogicContainer = document.getElementById('re-logic-container');
    const toggleBtn = document.getElementById('toggle-view-btn');
    const toggleBtnIcon = toggleBtn.querySelector('i');
    const toggleBtnSpan = toggleBtn.querySelector('span');
    const rightSidebar = document.getElementById('right-sidebar-container');
    const saveBtn = document.getElementById('save-template-btn');
    const newBtn = document.getElementById('new-template-btn');
    const deployBtn = document.getElementById('apply-template-hq-btn');
    const deleteBtn = document.getElementById('delete-template-btn');

    if (currentView === 'builder') {
        // Chuyển sang RE Logic (Detail)
        currentView = 're-logic';
        builderContainer.classList.add('hidden');
        reLogicContainer.classList.remove('hidden');

        toggleBtnIcon.className = 'fas fa-sitemap mr-2';
        toggleBtnSpan.textContent = 'Model';

        // Ẩn các nút của builder
        saveBtn.classList.add('hidden');
        newBtn.classList.add('hidden');
        deployBtn.classList.add('hidden');
        deleteBtn.classList.add('hidden');

        // Tải và khởi tạo view RE Logic nếu chưa có nội dung
        if (!reLogicContainer.innerHTML.trim()) {
            await initRELogicView();
        }

    } else {
        // Chuyển về Template Builder
        currentView = 'builder';
        builderContainer.classList.remove('hidden');
        reLogicContainer.classList.add('hidden');

        toggleBtnIcon.className = 'fas fa-list-alt mr-2';
        toggleBtnSpan.textContent = 'Detail';

        // Hiện lại các nút của builder
        if (window.currentUser && (window.currentUser.roleId === 'HQ_STAFF' || window.currentUser.roleId === 'ADMIN')) {
            saveBtn.classList.remove('hidden');
            newBtn.classList.remove('hidden');
            deployBtn.classList.remove('hidden');
            deleteBtn.classList.remove('hidden');
        }
    }
}

// =================================================================================
// RE LOGIC FUNCTIONS (Moved from re-logic.js)
// =================================================================================

/**
 * Tải dữ liệu cần thiết cho RE Logic view.
 */
async function fetchREData() {
    try {
        // allTaskGroups đã được tải ở fetchInitialData()
        const reTasksSnap = await getDocs(query(collection(db, 're_tasks'), orderBy('category'), orderBy('name')));
        allRETasks = reTasksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        window.showToast("Failed to load RE logic data.", "error");
        console.error("Error fetching RE data:", error);
    }
}

/**
 * Render nội dung chính của RE Logic view.
 */
function renderREView() {
    const accordionContainer = document.getElementById('re-task-accordion');
    if (!accordionContainer) return;

    const sortedTaskGroups = Object.values(allTaskGroups).sort((a, b) => (a.order || 99) - (b.order || 99));

    if (sortedTaskGroups.length === 0) {
        accordionContainer.innerHTML = '<p class="text-slate-500">Không tìm thấy nhóm công việc nào.</p>';
        return;
    }

    accordionContainer.innerHTML = sortedTaskGroups.map(group => {
        const tasksInCategory = allRETasks.filter(task => task.category === group.code);
        const totalRE = tasksInCategory.reduce((sum, task) => sum + (task.dailyHours || 0), 0);

        const taskRows = tasksInCategory.map((task, index) => `
            <tr>
                <td class="p-2 border text-center">${index + 1}</td>
                <td class="p-2 border text-left">${task.name}</td>
                <td class="p-2 border text-center">${task.frequency || '-'}</td>
                <td class="p-2 border text-center">${task.reUnit || '-'}</td>
                <td class="p-2 border text-right">${(task.dailyHours || 0).toFixed(2)}</td>
            </tr>
        `).join('');

        return `
            <div class="re-accordion-item border rounded-lg overflow-hidden">
                <button class="re-accordion-toggle w-full text-left p-3 font-semibold flex justify-between items-center bg-slate-50 hover:bg-slate-100">
                    <span>${group.name} (${group.code})</span>
                    <i class="fas fa-chevron-down transition-transform"></i>
                </button>
                <div class="re-accordion-content hidden p-2">
                    <table class="w-full text-sm border-collapse">
                        <thead class="bg-slate-100">
                            <tr>
                                <th class="p-2 border text-center w-12">STT</th>
                                <th class="p-2 border text-left">Task</th>
                                <th class="p-2 border text-center">Tần suất</th>
                                <th class="p-2 border text-center">Unit RE</th>
                                <th class="p-2 border text-right w-24">RE (Giờ)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${taskRows.length > 0 ? taskRows : `<tr><td colspan="5" class="text-center p-4 text-slate-500">Không có task nào trong nhóm này.</td></tr>`}
                            <tr class="font-bold bg-slate-100">
                                <td colspan="4" class="p-2 border text-right">Tổng giờ ${group.code}</td>
                                <td class="p-2 border text-right">${totalRE.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }).join('');

    // Gắn sự kiện cho các accordion vừa tạo
    document.querySelectorAll('.re-accordion-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const icon = button.querySelector('i');
            content.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        });
    });
}

/**
 * Khởi tạo RE Logic view (tải HTML và dữ liệu).
 */
async function initRELogicView() {
    const reLogicContainer = document.getElementById('re-logic-container');
    reLogicContainer.innerHTML = `<div class="p-10 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i> Đang tải dữ liệu RE Logic...</div>`;

    // Chèn trực tiếp HTML vào container
    reLogicContainer.innerHTML = getRELogicHTMLTemplate();

    // Tải dữ liệu và render
    await fetchREData();
    renderREView();
}

/**
 * Xử lý sự kiện click nút "Triển khai" / "Xin xác nhận" / "Sẵn sàng triển khai".
 * Logic sẽ phân nhánh dựa trên vai trò người dùng và trạng thái kế hoạch.
 */
async function handleDeployClick() {
    const btn = document.getElementById('apply-template-hq-btn');    
    const btnSpan = btn?.querySelector('span');
    if (btn) btn.disabled = true;
    if (btnSpan) btnSpan.textContent = 'Đang xử lý...';

    try {
        if (!currentTemplateId) {
            throw new Error("Vui lòng chọn một mẫu lịch trình trước khi áp dụng.");
        }
        const template = allTemplates.find(t => t.id === currentTemplateId);
        if (!template || !template.schedule || !template.shiftMappings) {
            throw new Error(`Mẫu "${template.name}" không hợp lệ hoặc không có dữ liệu ca làm việc.`);
        }        const currentUser = window.currentUser;
        // --- LOGIC CHO RM ---
        if (currentUser.roleId === 'REGIONAL_MANAGER' || currentUser.roleId === 'AREA_MANAGER') {
            if (!currentMonthlyPlan) throw new Error("Không tìm thấy kế hoạch tháng hiện tại để xử lý.");

            const changePercentage = parseFloat(document.getElementById('reset-percentage-display')?.textContent.replace(/[()%]/g, '')) || 0;
            const planRef = doc(db, 'monthly_plans', currentMonthlyPlan.id);

            // Trường hợp 1: Thay đổi ít hoặc đã được HQ duyệt -> Triển khai cho Staff
            if (changePercentage <= 10 || currentMonthlyPlan.status === 'HQ_APPROVED_RM_CHANGES') {
                await updateDoc(planRef, {
                    status: 'RM_SENT_TO_STAFF',
                    'history': [...currentMonthlyPlan.history, {
                        status: 'RM_SENT_TO_STAFF',
                        timestamp: new Date(),
                        userId: currentUser.id,
                        userName: currentUser.name,
                        comment: `Triển khai kế hoạch với ${changePercentage.toFixed(1)}% thay đổi.`
                    }]
                });
                window.showToast('Đã gửi kế hoạch đăng ký ca cho nhân viên.', 'success');
                await loadAppliedPlanForManager(); // Tải lại để cập nhật trạng thái
            }
            // Trường hợp 2: Thay đổi nhiều -> Gửi yêu cầu phê duyệt
            else if (changePercentage > 10) {
                await updateDoc(planRef, {
                    status: 'RM_AWAITING_APPROVAL',
                    'history': [...currentMonthlyPlan.history, {
                        status: 'RM_AWAITING_APPROVAL',
                        timestamp: new Date(),
                        userId: currentUser.id,
                        userName: currentUser.name,
                        comment: `Yêu cầu phê duyệt cho kế hoạch có ${changePercentage.toFixed(1)}% thay đổi.`
                    }]
                });
                window.showToast('Đã gửi yêu cầu phê duyệt đến HQ.', 'info');
                await loadAppliedPlanForManager(); // Tải lại để cập nhật trạng thái
            }
            return; // Dừng hàm sau khi xử lý logic của RM
        }

        // --- LOGIC CHO HQ (giữ nguyên) ---
        await applyTemplateForHq(template);
    } catch (error) {
        console.error("Lỗi khi xử lý nút triển khai:", error);
        window.showToast(`Đã xảy ra lỗi: ${error.message}`, 'error');
    } finally {
        if (btn) btn.disabled = false;
        // Việc cập nhật lại text của button sẽ được xử lý trong checkTemplateChangesAndToggleResetButton
    }
}/**
 * (Chỉ dành cho HQ) Áp dụng template cho các miền được chọn.
 * @param {object} template - Đối tượng template đã được chọn.
 */async function applyTemplateForHq(template) {
        // 2. Lấy danh sách Region Managers và yêu cầu chọn
        const regionalManagers = allPersonnel.filter(p => p.roleId === 'REGIONAL_MANAGER');
        if (regionalManagers.length === 0) {
            throw new Error("Không tìm thấy Quản lý Miền (Regional Manager) nào trong hệ thống.");
        }

        // --- NEW: Chuẩn bị dữ liệu cho bảng ---
        const storesSnap = await getDocs(collection(db, 'stores'));
        const allStores = storesSnap.docs.map(d => ({ id: d.id, ...d.data() })); // This is a re-declaration, but it's scoped inside the function, so it's okay.
        const areasSnap = await getDocs(collection(db, 'areas'));
        const allAreas = areasSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const regionsSnap = await getDocs(collection(db, 'regions'));
        const allRegions = regionsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const managerOptions = {
            headers: ['Miền', 'Quản lý', 'Số cửa hàng'],
            rows: regionalManagers.map(rm => {
                const region = allRegions.find(r => r.id === rm.managedRegionId);
                const areasInRegion = allAreas.filter(a => a.regionId === rm.managedRegionId);
                const areaIds = areasInRegion.map(a => a.id);
                const storeCount = allStores.filter(s => areaIds.includes(s.areaId)).length;

                return { value: rm.id, cells: [region?.name || 'N/A', rm.name, storeCount] };
            })
        };

        const selectedManagerIds = await window.showCheckboxListPrompt(
            'Chọn Quản lý Miền để triển khai kế hoạch:',
            'Triển khai Kế hoạch cho Miền',
            managerOptions
        );

        if (!selectedManagerIds || selectedManagerIds.length === 0) {
            window.showToast('Hủy thao tác.', 'info');
            return;
        }
        const selectedManagers = regionalManagers.filter(rm => selectedManagerIds.includes(rm.id));
        const selectedManagerNames = selectedManagers.map(rm => rm.name).join(', ');

        // 3. Tự động tính toán ngày bắt đầu áp dụng dựa trên chu kỳ lương từ Firebase
        const payrollSettingsRef = doc(db, 'system_configurations', 'payroll_settings');
        const payrollSettingsSnap = await getDoc(payrollSettingsRef);
        const payrollStartDay = payrollSettingsSnap.exists() ? payrollSettingsSnap.data().startDay : 26; // Mặc định là 26 nếu không có

        const today = new Date();
        let startDate;

        if (today.getDate() < payrollStartDay) {
            // Nếu ngày hiện tại nhỏ hơn ngày bắt đầu chu kỳ, áp dụng cho chu kỳ của tháng này
            startDate = new Date(today.getFullYear(), today.getMonth(), payrollStartDay);
        } else {
            // Nếu ngày hiện tại bằng hoặc lớn hơn, áp dụng cho chu kỳ của tháng tiếp theo
            startDate = new Date(today.getFullYear(), today.getMonth() + 1, payrollStartDay);
        }

        const dateString = formatLocalDate(startDate);
        const formattedStartDate = startDate.toLocaleDateString('vi-VN');
        window.showToast(`Mẫu sẽ được áp dụng từ ngày ${formattedStartDate}.`, 'info', 4000);

        const batch = writeBatch(db);

        // 4. Lấy danh sách cửa hàng thuộc tất cả các miền đã chọn
        // --- LOGIC MỚI: Tạo bản ghi kế hoạch cho từng miền ---
        for (const manager of selectedManagers) {
            const newPlan = {
                regionId: manager.managedRegionId,
                regionManagerId: manager.id,
                cycleStartDate: dateString,
                templateId: template.id,
                templateName: template.name,
                status: 'HQ_APPLIED', // Step 1
                history: [{
                    status: 'HQ_APPLIED',
                    timestamp: new Date(), // Sử dụng new Date() thay vì serverTimestamp() trong mảng
                    userId: window.currentUser.id,
                    userName: window.currentUser.name
                }],
                comments: []
            };
            const planRef = doc(collection(db, 'monthly_plans'));
            batch.set(planRef, newPlan);
        }
        const selectedRegionIds = selectedManagers.map(rm => rm.managedRegionId);
        const managedAreaIds = allAreas.filter(a => selectedRegionIds.includes(a.regionId)).map(a => a.id);
        const storesInRegion = allStores.filter(s => managedAreaIds.includes(s.areaId));

        if (storesInRegion.length === 0) {
            throw new Error(`Các miền đã chọn không quản lý cửa hàng nào.`);
        }

        // 5. Hỏi xác nhận
        const confirmed = await window.showConfirmation(
            `Bạn có chắc chắn muốn gửi kế hoạch dựa trên mẫu <strong>"${template.name}"</strong> đến các miền của [${selectedManagerNames}] cho chu kỳ bắt đầu từ ngày <strong>${formattedStartDate}</strong> không?`,
            'Xác nhận gửi kế hoạch',
            'Gửi Kế hoạch',
            'Hủy'
        );

        if (!confirmed) {
            window.showToast('Đã hủy thao tác.', 'info');
            return;
        }

        await batch.commit();
        window.showToast(`Hoàn tất! Đã gửi kế hoạch từ mẫu "${template.name}" đến ${selectedManagers.length} miền.`, 'success', 5000);}

/**
 * (Dành cho RM/AM) Tải kế hoạch và mẫu được áp dụng gần nhất.
 */
async function loadAppliedPlanForManager() {
    const currentUser = window.currentUser;
    if (!currentUser) return;

    let regionIdToQuery = null;
    if (currentUser.roleId === 'REGIONAL_MANAGER') {
        regionIdToQuery = currentUser.managedRegionId;
    } else if (currentUser.roleId === 'AREA_MANAGER') {
        // Tìm regionId dựa trên areaId của AM
        const areasSnap = await getDocs(query(collection(db, 'areas'), where('id', 'in', currentUser.managedAreaIds || ['dummy']), limit(1)));
        if (!areasSnap.empty) {
            regionIdToQuery = areasSnap.docs[0].data().regionId;
        }
    }

    if (!regionIdToQuery) {
        // Nếu không có miền, ẩn bộ chọn và hiển thị thông báo
        // Nếu không có miền, ẩn bộ chọn và hiển thị thông báo tĩnh
        document.getElementById('template-selector-container').classList.add('hidden');
        document.getElementById('template-display-container').classList.remove('hidden');
        document.getElementById('template-name-display').textContent = 'Bạn chưa được phân công vào miền nào.';
        renderGrid();
        return;
    }

    // Tìm kế hoạch gần nhất cho miền này
    const plansQuery = query(
        collection(db, 'monthly_plans'),
        where('regionId', '==', regionIdToQuery),
        orderBy('cycleStartDate', 'desc'),
        limit(1)
    );

    const plansSnap = await getDocs(plansQuery);
    if (plansSnap.empty) {
        // Nếu không có kế hoạch nào, ẩn bộ chọn và hiển thị thông báo
        document.getElementById('template-selector-container').classList.add('hidden');
        document.getElementById('template-display-container').classList.remove('hidden');
        document.getElementById('template-display-container').querySelector('#template-name-display').textContent = 'Chưa có kế hoạch nào được áp dụng cho miền của bạn.';
        renderGrid();
    } else {
        const plan = { id: plansSnap.docs[0].id, ...plansSnap.docs[0].data() };
        currentMonthlyPlan = plan;

        // Tự động chọn mẫu của kế hoạch vào dropdown và tải dữ liệu
        document.getElementById('template-selector').value = plan.templateId; // Fix: Ensure this line is present
        await loadTemplate(plan.templateId);

        // Hiển thị thông tin theo        renderPlanTracker(plan);
        renderPlanTracker(plan);
    }
}

/**
 * So sánh mẫu hiện tại với mẫu gốc và hiển thị/ẩn nút Reset.
 * Chỉ hoạt động cho vai trò không phải HQ/Admin.
 */
function checkTemplateChangesAndToggleResetButton() {
    const currentUser = window.currentUser;
    if (!currentUser || currentUser.roleId === 'HQ_STAFF' || currentUser.roleId === 'ADMIN' || !originalTemplateData) {
        return;
    }

    // --- LOGIC TÍNH TOÁN MỚI: SO SÁNH SLOT-BY-SLOT ---

    // Hàm trợ giúp để tạo một "bản đồ" các task từ dữ liệu schedule
    // Key: "shiftId_time_quarter", Value: taskCode
    const createTaskMap = (schedule) => {
        const map = new Map();
        if (!schedule) return map;
        for (const shiftId in schedule) {
            for (const task of schedule[shiftId]) {
                const [hour, quarter] = task.startTime.split(':');
                const time = `${parseInt(hour, 10)}:00`;
                const key = `${shiftId}_${time}_${quarter}`;
                map.set(key, task.taskCode);
            }
        }
        return map;
    };

    // 1. Tạo bản đồ cho mẫu gốc
    const originalTaskMap = createTaskMap(originalTemplateData.schedule);

    // 2. Tạo bản đồ cho mẫu hiện tại từ DOM
    const currentTaskMap = new Map();
    document.querySelectorAll('#template-builder-grid-container .scheduled-task-item').forEach(taskItem => {
        const slot = taskItem.closest('.quarter-hour-slot');
        if (!slot) return;
        const key = `${slot.dataset.shiftId}_${slot.dataset.time}_${slot.dataset.quarter}`;
        currentTaskMap.set(key, taskItem.dataset.taskCode);
    });

    // 3. So sánh hai bản đồ và đếm số vị trí thay đổi
    let changedSlotCount = 0;
    const allSlotKeys = new Set([...originalTaskMap.keys(), ...currentTaskMap.keys()]);

    allSlotKeys.forEach(key => {
        const originalTaskCode = originalTaskMap.get(key);
        const currentTaskCode = currentTaskMap.get(key);

        // Một vị trí được coi là thay đổi nếu task ở đó khác với bản gốc
        // (bao gồm cả việc thêm mới vào ô trống hoặc xóa task khỏi ô đã có)
        if (originalTaskCode !== currentTaskCode) {
            changedSlotCount++;
        }
    });

    // 4. Tính toán tỷ lệ phần trăm
    const totalOriginalSlots = originalTaskMap.size;
    const changePercentage = totalOriginalSlots > 0
        ? (changedSlotCount / totalOriginalSlots) * 100
        : (changedSlotCount > 0 ? 100 : 0);

    // 5. Cập nhật giao diện
    const resetButton = document.getElementById('reset-template-btn');
    const percentageDisplay = document.getElementById('reset-percentage-display');
    const deployButton = document.getElementById('apply-template-hq-btn');
    const deployButtonSpan = deployButton?.querySelector('span');

    // Cập nhật nút "Triển khai" cho RM
    if (currentUser && (currentUser.roleId === 'REGIONAL_MANAGER' || currentUser.roleId === 'AREA_MANAGER') && deployButton && deployButtonSpan) {
        deployButton.disabled = false; // Mặc định là bật
        deployButton.title = '';

        if (currentMonthlyPlan?.status === 'RM_AWAITING_APPROVAL') {
            deployButtonSpan.textContent = 'Đang chờ xác nhận';
            deployButton.disabled = true;
            deployButton.title = 'Đã gửi yêu cầu, đang chờ HQ phê duyệt.';
        } else if (currentMonthlyPlan?.status === 'HQ_APPROVED_RM_CHANGES') {
            deployButtonSpan.textContent = 'Sẵn sàng triển khai';
            deployButton.title = 'HQ đã đồng ý và cho phép triển khai tới Staff.';
        } else if (changePercentage > 10) {
            deployButtonSpan.textContent = 'Xin xác nhận';
            deployButton.title = 'Thay đổi vượt quá 10%, cần gửi HQ phê duyệt trước khi triển khai.';
        } else {
            deployButtonSpan.textContent = 'Triển khai';
            deployButton.title = 'Triển khai kế hoạch đăng ký ca cho nhân viên.';
        }
    } else if (deployButtonSpan) {
        // Reset về trạng thái mặc định cho HQ
        deployButtonSpan.textContent = 'Triển khai';
        deployButton.title = '';
    }

    if (resetButton && percentageDisplay) {
        const hasChanged = changePercentage > 0;
        resetButton.classList.toggle('hidden', !hasChanged);
        if (hasChanged) {
            percentageDisplay.textContent = `(${changePercentage.toFixed(1)}%)`;
        }
    }
}

/**
 * Xử lý sự kiện khi RM/AM nhấn nút Reset.
 */
async function handleResetTemplate() {
    const confirmed = await window.showConfirmation('Bạn có chắc chắn muốn khôi phục lịch trình về trạng thái ban đầu do HQ gửi không? Mọi thay đổi sẽ bị mất.', 'Xác nhận Reset', 'Khôi phục', 'Hủy');
    if (confirmed) {
        await loadTemplate(currentTemplateId); // Tải lại mẫu gốc từ Firestore
        checkTemplateChangesAndToggleResetButton(); // Kiểm tra thay đổi và ẩn nút Reset nếu cần
        window.showToast('Đã khôi phục lịch trình về trạng thái ban đầu.', 'success');
    }
}
/**
 * Hiển thị giao diện theo dõi tiến độ kế hoạch.
 * @param {object} plan - Đối tượng kế hoạch tháng.
 */
function renderPlanTracker(plan) {
    const container = document.getElementById('plan-tracker-modal'); // Thay đổi để nhắm đến modal
    if (!container) return;    

    const currentUser = window.currentUser;
    const historyList = container.querySelector('#plan-history-list');
    const commentList = container.querySelector('#plan-comments-list');
    const approvalActions = document.getElementById('plan-approval-actions');
    const commentsContainer = document.getElementById('plan-comments-container');
    const approveBtn = document.getElementById('approve-plan-btn');
    const rejectBtn = document.getElementById('reject-plan-btn');

    // Logic hiển thị các nút Phê duyệt/Từ chối cho HQ
    if (currentUser.roleId === 'HQ_STAFF' || currentUser.roleId === 'ADMIN') {
        if (plan.status === 'RM_AWAITING_APPROVAL') {
            approvalActions.classList.remove('hidden');
            approvalActions.classList.add('flex');
        } else {
            approvalActions.classList.add('hidden');
            approvalActions.classList.remove('flex');
        }
    } else {
        approvalActions.classList.add('hidden');
        approvalActions.classList.remove('flex');
    }

    // Gắn sự kiện cho các nút phê duyệt
    approveBtn.onclick = () => handleApprovalAction(plan.id, true);
    rejectBtn.onclick = () => handleApprovalAction(plan.id, false);

    // Định nghĩa các bước
    const steps = [
        { id: 'HQ_APPLIED', label: '1. HQ triển khai đến RM' },
        { id: 'RM_AWAITING_APPROVAL', label: '1.5. RM gửi yêu cầu phê duyệt' },
        { id: 'HQ_REJECTED_RM_CHANGES', label: '1.6. HQ từ chối thay đổi' },
        { id: 'HQ_APPROVED_RM_CHANGES', label: '1.7. HQ phê duyệt thay đổi' },
        { id: 'RM_SENT_TO_STAFF', label: '2. RM gửi về Staff' },
        { id: 'STAFF_REGISTERED', label: '3. Staff đăng ký' },
        { id: 'SL_ADJUSTED', label: '4. SL điều chỉnh & gửi AM' },
        { id: 'AM_DISPATCHED', label: '5. AM điều phối & gửi RM' },
        { id: 'RM_DISPATCHED', label: '6. RM điều phối & gửi HQ' },
        { id: 'HQ_CONFIRMED', label: '7. HQ xác nhận & gửi Store' }
    ];

    // Hiển thị lịch sử: Chỉ hiển thị các bước đã xảy ra
    if (plan.history && plan.history.length > 0) {
        const historyHTML = plan.history
            .sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis()) // Sắp xếp các bước theo thời gian
            .map(historyEntry => {
                // Tìm label tương ứng với status trong mảng steps
                const stepInfo = steps.find(s => s.id === historyEntry.status);
                const label = stepInfo ? stepInfo.label : historyEntry.status; // Fallback về status nếu không tìm thấy label

                const timestamp = historyEntry.timestamp?.toDate().toLocaleString('vi-VN') || 'N/A';
                const iconClass = historyEntry.status.includes('REJECTED') ? 'fa-times-circle text-red-600' : 'fa-check-circle text-green-700';
                
                // Hiển thị bình luận ngay dưới bước tương ứng nếu có
                const commentHTML = historyEntry.comment 
                    ? `<div class="text-xs text-gray-600 italic pl-6 mt-1 p-1 bg-gray-100 rounded">- ${historyEntry.comment}</div>` 
                    : '';

                return `<li class="flex items-start"><i class="fas ${iconClass} mr-2 mt-1 flex-shrink-0"></i><div><strong>${label}:</strong> Hoàn thành bởi ${historyEntry.userName} lúc ${timestamp}${commentHTML}</div></li>`;
            }).join('');
        historyList.innerHTML = historyHTML;
    } else {
        historyList.innerHTML = `<li class="text-gray-400 italic">Chưa có hoạt động nào được ghi nhận.</li>`;
    }
}

/**
 * (Dành cho HQ) Xử lý hành động phê duyệt hoặc từ chối kế hoạch.
 * @param {string} planId - ID của kế hoạch.
 * @param {boolean} isApproved - True nếu phê duyệt, false nếu từ chối.
 */
async function handleApprovalAction(planId, isApproved) {
    const currentUser = window.currentUser;
    const planRef = doc(db, 'monthly_plans', planId);
    const planSnap = await getDoc(planRef);
    if (!planSnap.exists()) {
        window.showToast('Lỗi: Không tìm thấy kế hoạch để xử lý.', 'error');
        return;
    }

    const planData = planSnap.data();
    let newStatus = '';
    let comment = '';

    if (isApproved) {
        newStatus = 'HQ_APPROVED_RM_CHANGES';
        comment = 'Đã phê duyệt các thay đổi từ RM.';
    } else {
        comment = await window.showPrompt('Vui lòng nhập lý do từ chối:', 'Từ chối Kế hoạch');
        if (!comment || comment.trim() === '') {
            window.showToast('Bạn phải nhập lý do để từ chối.', 'warning');
            return;
        }
        newStatus = 'HQ_REJECTED_RM_CHANGES';
    }

    try {
        await updateDoc(planRef, {
            status: newStatus,
            'history': [...planData.history, {
                status: newStatus,
                timestamp: new Date(),
                userId: currentUser.id,
                userName: currentUser.name,
                comment: comment
            }]
        });
        window.showToast(`Đã ${isApproved ? 'phê duyệt' : 'từ chối'} kế hoạch thành công.`, 'success');
        hideModal(); // Đóng popup trạng thái
        await loadAppliedPlanForManager(); // Tải lại để cập nhật giao diện cho RM (nếu RM đang xem)
    } catch (error) {
        console.error('Lỗi khi xử lý phê duyệt:', error);
        window.showToast('Đã có lỗi xảy ra.', 'error');
    }
}
/**
 * Tạo các bản sao thực sự khi người dùng nhả chuột.
 * @param {HTMLElement} finalTarget - Phần tử cuối cùng mà chuột trỏ tới.
 * @param {HTMLElement} originalTask - Task gốc được kéo.
 * @returns {number} Số lượng clone đã được tạo.
 */
function createRealClones(finalTarget, originalTask) {
    const endSlot = finalTarget.closest('.quarter-hour-slot');
    if (!endSlot || !originalTask) return 0;

    const originalShiftId = originalTask.closest('.quarter-hour-slot').dataset.shiftId;
    if (endSlot.dataset.shiftId !== originalShiftId) {
        return 0;
    }

    const allSlotsInRow = Array.from(endSlot.closest('tr').querySelectorAll('.quarter-hour-slot'));
    const originalIndex = allSlotsInRow.indexOf(originalTask.parentElement);
    const targetIndex = allSlotsInRow.indexOf(endSlot);

    const start = Math.min(originalIndex, targetIndex);
    const end = Math.max(originalIndex, targetIndex);
    let clonesCreated = 0;

    for (let i = start; i <= end; i++) {
        const slot = allSlotsInRow[i];
        // Bỏ qua ô gốc và các ô đã có task
        if (i === originalIndex || slot.querySelector('.scheduled-task-item')) {
            continue;
        }

        const clone = originalTask.cloneNode(true);
        // Gắn lại handle cho các task mới để chúng cũng có thể được nhân bản
        const leftHandle = document.createElement('div');
        leftHandle.className = 'resize-handle left-handle';
        leftHandle.title = 'Kéo để nhân bản';
        const rightHandle = document.createElement('div');
        rightHandle.className = 'resize-handle right-handle';
        rightHandle.title = 'Kéo để nhân bản';
        clone.prepend(rightHandle);
        clone.prepend(leftHandle);

        slot.appendChild(clone);
        clonesCreated++;
    }
    return clonesCreated;
}

/**
 * Kích hoạt hiệu ứng animation cho một ô trong bảng thống kê.
 * @param {HTMLElement} cell - Ô (td) cần tạo hiệu ứng.
 * @param {string} text - Nội dung của hiệu ứng (ví dụ: '+1').
 */
function triggerStatAnimation(cell, text) {
    if (!cell || !text) return;

    const animationEl = document.createElement('span');
    animationEl.className = 'stat-change-animation';
    animationEl.textContent = text;

    // Thêm vào cell và xóa sau khi animation kết thúc
    cell.style.position = 'relative'; // Cần thiết để định vị absolute cho animation
    cell.appendChild(animationEl);

    // Tự động xóa element sau khi animation hoàn tất
    setTimeout(() => animationEl.remove(), 500); // 500ms khớp với thời gian animation
}

/**
 * Cập nhật bảng thống kê group task dựa trên các task đang có trên lưới.
 */
function updateTemplateStats() {
    const statsContentWrapper = document.getElementById('stats-content-wrapper');
    if (!statsContentWrapper) return;
    const scheduledTasks = document.querySelectorAll('.scheduled-task-item');

    // --- Tính toán số liệu mới từ các task trên lưới ---
    const newStats = {}; // { groupId: { count: number } }

    scheduledTasks.forEach(taskItem => {
        const groupId = taskItem.dataset.groupId;
        if (!groupId) return;

        if (!newStats[groupId]) {
            newStats[groupId] = { count: 0 };
        }
        newStats[groupId].count++;
    });

    let table = statsContentWrapper.querySelector('#stats-table');
    // Nếu bảng chưa tồn tại, tạo mới và chèn vào DOM
    if (!table) {
        statsContentWrapper.innerHTML = ''; // Chỉ xóa nội dung bên trong wrapper
        table = document.createElement('table');
        table.id = 'stats-table';
        table.className = 'w-full text-xs border-collapse';
        table.innerHTML = `
            <thead class="bg-slate-50 sticky top-0 z-10">
                <tr>
                    <th class="p-2 text-center font-semibold text-slate-600 w-12">STT</th>
                    <th class="text-center font-semibold text-slate-600">Group Task</th>
                    <th class="p-2 text-center font-semibold text-slate-600 w-24">Giờ</th>
                </tr>
            </thead>
            <tbody></tbody>
            <tfoot class="bg-slate-100 font-bold sticky bottom-0">
                 <tr>
                    <td class="p-2 font-semibold text-center" colspan="2">Tổng cộng</td>
                    <td id="stats-total-time" class="p-2 text-center">0.00</td>
                </tr>
            </tfoot>
        `;
        statsContentWrapper.appendChild(table);
    }

    const tbody = table.querySelector('tbody');
    let totalCount = 0;
    let rowIndex = 1;

    // Sắp xếp các nhóm theo 'order' để hiển thị nhất quán
    const sortedGroupIds = Object.keys(allTaskGroups).sort((a, b) => {
        const groupA = allTaskGroups[a];
        const groupB = allTaskGroups[b];
        return (groupA.order || 999) - (groupB.order || 999);
    });

    // --- Cập nhật hoặc thêm các dòng cho từng group ---
    for (const groupId of sortedGroupIds) {
        const groupInfo = allTaskGroups[groupId];
        const currentCount = newStats[groupId] ? newStats[groupId].count : 0;
        const currentTime = (currentCount * 0.25).toFixed(2);
        totalCount += currentCount;

        let row = tbody.querySelector(`tr[data-group-id="${groupId}"]`);

        if (!row) { // Nếu dòng chưa tồn tại, tạo mới
            const color = (groupInfo.color && groupInfo.color.tailwind_text) ? groupInfo.color : defaultColor;
            const stt = tbody.children.length + 1;
            row = document.createElement('tr');
            row.className = 'border-b border-slate-100';
            row.dataset.groupId = groupId;
            row.innerHTML = `
                <td class="p-2 text-center text-slate-500">${stt}</td>
                <td class="text-center font-medium ${color.tailwind_text}">${groupInfo.code}</td>
                <td class="stat-time p-2 text-center text-slate-500">0.00</td>
            `;
            tbody.appendChild(row);
        }

        // Cập nhật giá trị và kích hoạt animation nếu có thay đổi
        const timeCell = row.querySelector('.stat-time');
        timeCell.textContent = currentTime;
    }

    // --- Cập nhật dòng tổng kết ---
    const totalTimeCell = table.querySelector('#stats-total-time');
    const newTotalTime = totalCount * 0.25;
    totalTimeCell.textContent = newTotalTime.toFixed(2);

    // Đồng bộ giá trị "Đã sắp xếp" ở trên với tổng số giờ vừa tính toán
    const scheduledHoursValueEl = document.getElementById('scheduled-hours-value');
    if (scheduledHoursValueEl) scheduledHoursValueEl.textContent = newTotalTime.toFixed(2);
}

/**
 * Trả về chuỗi HTML cho giao diện RE Logic.
 * (Nội dung từ re-logic.html)
 */
function getRELogicHTMLTemplate() {
    return `
      <div id="re-logic-main-content" class="p-4 flex flex-col h-full">
          <!-- Store Info Section -->
          <div class="mb-4 flex-shrink-0">
              <h3 class="text-lg font-semibold text-slate-800 mb-2 flex items-center">
                  Thông tin cửa hàng
              </h3>
              <div id="re-store-info-content" class="mt-2 p-4 border rounded-lg bg-white">
                  <table class="w-full text-sm border-collapse">
                      <thead class="bg-slate-50">
                          <tr>
                              <th class="p-2 border text-center font-semibold text-slate-600">Số khách hàng (người)</th>
                              <th class="p-2 border text-center font-semibold text-slate-600">Diện tích (m2)</th>
                              <th class="p-2 border text-center font-semibold text-slate-600">Số nhân viên (người)</th>
                              <th class="p-2 border text-center font-semibold text-slate-600">Tổng kiện hàng khô (kiện)</th>
                              <th class="p-2 border text-center font-semibold text-slate-600">Hàng rau củ (kg)</th>
                          </tr>
                      </thead>
                      <tbody id="re-store-info-body">
                          <tr>
                              <td class="p-2 border text-center">0</td>
                              <td class="p-2 border text-center">0</td>
                              <td class="p-2 border text-center">0</td>
                              <td class="p-2 border text-center">0</td>
                              <td class="p-2 border text-center">0</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
          <!-- Task Details Section -->
          <div class="bg-white p-4 rounded-lg shadow-sm border flex-1 overflow-y-auto">
              <h3 class="text-lg font-semibold text-slate-800 mb-4">Chi tiết các Group Task</h3>
              <div id="re-task-accordion" class="space-y-2">
                  <p class="text-slate-500">Đang tải danh sách công việc...</p>
              </div>
          </div>
      </div>
    `;
}