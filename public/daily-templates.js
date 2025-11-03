import { db } from './firebase.js';
import { collection, getDocs, query, orderBy, doc, setDoc, serverTimestamp, addDoc, deleteDoc, getDoc, where, writeBatch } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let sortableInstances = [];
let domController = null;

let allTemplates = [];
let currentTemplateId = null;

let allPersonnel = []; // For HQ Apply
let allWorkPositions = []; // Biến để lưu danh sách vị trí công việc
let allShiftCodes = []; // Biến để lưu danh sách mã ca
// Bảng màu mặc định nếu group không có màu
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
    const timeSlots = Array.from({ length: 18 }, (_, i) => `${i + 6}:00`);
    const shiftId = `shift-${shiftNumber}`;
    const newRow = document.createElement('tr');
    newRow.dataset.shiftId = shiftId;

    // Tạo dropdown cho việc chọn mã ca
    // Tạo dropdown cho việc chọn vị trí công việc
    const workPositionOptions = allWorkPositions.map(pos => `<option value="${pos.id}">${pos.name}</option>`).join('');

    let bodyRowHtml = `
        <td class="group p-1 border border-slate-200 align-top sticky left-0 bg-white z-10 w-40 min-w-40 font-semibold text-center">
            <div class="space-y-1">
                <input list="shift-codes-datalist" 
                       class="shift-code-selector form-input w-full text-xs text-center p-1 font-semibold" 
                       placeholder="-- Nhập/Chọn Ca --">
                <!-- Thêm div để hiển thị khung giờ -->
                <div class="shift-time-display text-xs text-slate-500 h-4"></div>
                <select class="work-position-selector form-input w-full text-xs text-center p-1">
                    <option value="">-- Chọn Vị trí --</option>
                    ${workPositionOptions}
                </select>
            </div>
            <button class="delete-shift-row-btn absolute top-1 right-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" title="Xóa dòng ca này">
                <i class="fas fa-times"></i>
            </button>
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
                updateTemplateFromDOM(); // Cập nhật lại dữ liệu sau khi xóa
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
                        updateTemplateFromDOM();
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
    if (!currentTemplateId) {
        // Nếu không có mẫu nào đang được chọn (chế độ tạo mới), không làm gì cả.
        // Việc lưu sẽ được xử lý bởi saveTemplate khi người dùng nhấn nút lưu.
        return;
    }

    const scheduleData = {};
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

        // Luôn thêm lựa chọn "Tạo Mẫu Mới" ở đầu
        let optionsHtml = `<option value="new">-- Tạo Mẫu Mới --</option>`;
        optionsHtml += allTemplates.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
        templateSelector.innerHTML = optionsHtml;

    } catch (error) {
        console.error("Lỗi khi tải danh sách mẫu:", error);
        templateSelector.innerHTML = `<option value="">-- Lỗi tải mẫu --</option>`;
    }
}

/**
 * Tải dữ liệu của một mẫu cụ thể và hiển thị lên lưới.
 * @param {string} templateId ID của mẫu cần tải.
 */
async function loadTemplate(templateId) {
    // Nếu người dùng chọn "Tạo Mẫu Mới"
    if (templateId === 'new') {
        switchToCreateNewMode();
        return;
    }

    currentTemplateId = templateId;
    renderGrid(); // Render lại lưới trống trước

    // Hiển thị các nút cho chế độ xem/sửa
    document.getElementById('new-template-btn').classList.remove('hidden');
    document.getElementById('delete-template-btn').classList.remove('hidden');

    updateTemplateStats(); // Xóa thống kê cũ
    if (!templateId) return; // Thoát nếu không có ID

    try {
        const templateRef = doc(db, 'daily_templates', templateId);
        const docSnap = await getDoc(templateRef);

        if (docSnap.exists()) {
            const { schedule, totalManhour, shiftMappings } = docSnap.data();

            // Cập nhật giá trị Manhour từ Firestore
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
    currentTemplateId = null;
    document.getElementById('template-selector').value = 'new';
    renderGrid(); // Vẽ lại lưới trống

    // Ẩn các nút không cần thiết
    document.getElementById('new-template-btn').classList.add('hidden');
    document.getElementById('delete-template-btn').classList.add('hidden');

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

    await fetchInitialData();
    await fetchAndRenderTemplates(); // Tải danh sách mẫu vào dropdown
    switchToCreateNewMode(); // Đặt trạng thái mặc định là tạo mới

    // Show HQ Apply button if user is HQ_STAFF
    if (window.currentUser && ['HQ_STAFF', 'ADMIN', 'REGIONAL_MANAGER', 'AREA_MANAGER'].includes(window.currentUser.roleId)) {
        const hqApplyBtn = document.getElementById('apply-template-hq-btn');
        if (hqApplyBtn) {
            hqApplyBtn.classList.remove('hidden');
            hqApplyBtn.addEventListener('click', applyTemplateForHq, { signal });
        }
    }

    // Tạo datalist cho mã ca nếu chưa có
    if (!document.getElementById('shift-codes-datalist')) {
        const datalist = document.createElement('datalist');
        datalist.id = 'shift-codes-datalist';
        datalist.innerHTML = allShiftCodes.map(sc => `<option value="${sc.shiftCode}">${sc.timeRange}</option>`).join('');
        document.body.appendChild(datalist);
    }

    document.getElementById('save-template-btn')?.addEventListener('click', saveTemplate, { signal });
    document.getElementById('new-template-btn')?.addEventListener('click', switchToCreateNewMode, { signal });
    document.getElementById('delete-template-btn')?.addEventListener('click', deleteCurrentTemplate, { signal });
    document.getElementById('template-selector')?.addEventListener('change', (e) => loadTemplate(e.target.value), { signal });


    // Thêm listener để cập nhật tiêu đề khi nhập manhour
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
    ['save-template-btn', 'new-template-btn', 'delete-template-btn', 'template-selector', 'apply-template-hq-btn'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const newEl = el.cloneNode(true);
            el.parentNode.replaceChild(newEl, el);
        }
    });
}

/**
 * Áp dụng template cho các cửa hàng của một Miền được chọn (dành cho HQ Staff).
 */
async function applyTemplateForHq() {
    const btn = document.getElementById('apply-template-hq-btn');
    const btnSpan = btn.querySelector('span');
    btn.disabled = true;    if (btnSpan) btnSpan.textContent = 'Đang xử lý...';

    try {
        // 1. Kiểm tra đã chọn template chưa
        if (!currentTemplateId) {
            throw new Error("Vui lòng chọn một mẫu lịch trình trước khi áp dụng.");
        }
        const template = allTemplates.find(t => t.id === currentTemplateId);
        if (!template || !template.schedule || !template.shiftMappings) {
            throw new Error(`Mẫu "${template.name}" không hợp lệ hoặc không có dữ liệu ca làm việc.`);
        }

        // 2. Lấy danh sách Region Managers và yêu cầu chọn
        const regionalManagers = allPersonnel.filter(p => p.roleId === 'REGIONAL_MANAGER');
        if (regionalManagers.length === 0) {
            throw new Error("Không tìm thấy Quản lý Miền (Regional Manager) nào trong hệ thống.");
        }

        // --- NEW: Chuẩn bị dữ liệu cho bảng ---
        const storesSnap = await getDocs(collection(db, 'stores'));
        const allStores = storesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const areasSnap = await getDocs(collection(db, 'areas'));
        const allAreas = areasSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const regionsSnap = await getDocs(collection(db, 'regions'));
        const allRegions = regionsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const managerOptions = {
            headers: ['Quản lý', 'Miền', 'Số cửa hàng'],
            rows: regionalManagers.map(rm => {
                const region = allRegions.find(r => r.id === rm.managedRegionId);
                const areasInRegion = allAreas.filter(a => a.regionId === rm.managedRegionId);
                const areaIds = areasInRegion.map(a => a.id);
                const storeCount = allStores.filter(s => areaIds.includes(s.areaId)).length;

                return { value: rm.id, cells: [rm.name, region?.name || 'N/A', storeCount] };
            })
        };

        const selectedManagerIds = await window.showCheckboxListPrompt(
            'Chọn Quản lý Miền để áp dụng lịch trình:',
            'Áp dụng Lịch trình cho Miền',
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

        // 4. Lấy danh sách cửa hàng thuộc tất cả các miền đã chọn
        const selectedRegionIds = selectedManagers.map(rm => rm.managedRegionId);
        const managedAreaIds = allAreas.filter(a => selectedRegionIds.includes(a.regionId)).map(a => a.id);
        const storesInRegion = allStores.filter(s => managedAreaIds.includes(s.areaId));

        if (storesInRegion.length === 0) {
            throw new Error(`Các miền đã chọn không quản lý cửa hàng nào.`);
        }

        // 5. Hỏi xác nhận
        const confirmed = await window.showConfirmation(
            `Bạn có chắc chắn muốn XÓA TẤT CẢ lịch làm việc của ngày ${dateString} tại ${storesInRegion.length} cửa hàng thuộc các miền của [${selectedManagerNames}] và tạo lại từ mẫu "${template.name}" không?`,
            'Xác nhận tạo lịch hàng loạt',
            'Xóa và Tạo mới',
            'Hủy'
        );

        if (!confirmed) {
            window.showToast('Đã hủy thao tác.', 'info');
            return;
        }

        window.showToast(`Bắt đầu tạo lịch cho ngày ${dateString} từ mẫu "${template.name}"...`, 'info');

        // 6. Bắt đầu quá trình áp dụng (tương tự logic trong dev-menu)
        const { schedule: templateSchedule, shiftMappings } = template;
        const batch = writeBatch(db);

        // Xóa lịch trình cũ trong ngày đã chọn cho các cửa hàng thuộc miền
        const storeIdsInRegion = storesInRegion.map(s => s.id);
        const oldSchedulesQuery = query(collection(db, 'schedules'), where('date', '==', dateString), where('storeId', 'in', storeIdsInRegion));
        const oldSchedulesSnap = await getDocs(oldSchedulesQuery);
        oldSchedulesSnap.forEach(doc => batch.delete(doc.ref));
        if (!oldSchedulesSnap.empty) {
            window.showToast(`Đã xóa ${oldSchedulesSnap.size} lịch làm việc cũ của ngày ${dateString}.`, 'info');
        }

        // Tải dữ liệu nhân viên và đăng ký ca
        const employeesInRegionSnap = await getDocs(query(collection(db, 'employee'), where('storeId', 'in', storeIdsInRegion)));
        const employeesInRegion = employeesInRegionSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const availabilityQuery = query(collection(db, 'staff_availability'), where('date', '==', dateString));
        const availabilitySnap = await getDocs(availabilityQuery);
        const allAvailabilities = availabilitySnap.docs.map(doc => doc.data());

        let schedulesCreatedCount = 0;

        for (const store of storesInRegion) {
            const storeEmployees = employeesInRegion.filter(emp => emp.storeId === store.id && emp.status === 'ACTIVE');
            if (storeEmployees.length === 0) continue;

            let slotsToFill = Object.keys(shiftMappings).map(shiftId => ({
                shiftId: shiftId,
                shiftCode: shiftMappings[shiftId].shiftCode,
                positionId: shiftMappings[shiftId].positionId,
                employeeId: null
            }));

            let availableEmployees = [...storeEmployees];

            // --- BƯỚC 1: PHÂN CÔNG LEADER ---
            const leaderSlots = slotsToFill.filter(slot => slot.positionId === 'LEADER' && !slot.employeeId);
            const leadersInStore = availableEmployees.filter(emp => emp.roleId.includes('LEADER'));

            if (leaderSlots.length > 0 && leadersInStore.length > 0) {
                let leaderIndex = 0;
                for (const slot of leaderSlots) {
                    const leaderToAssign = leadersInStore[leaderIndex % leadersInStore.length];
                    slot.employeeId = leaderToAssign.id;
                    availableEmployees = availableEmployees.filter(emp => emp.id !== leaderToAssign.id);
                    leaderIndex++;
                }
            }

            // --- BƯỚC 2: PHÂN CÔNG THEO ĐĂNG KÝ ƯU TIÊN ---
            const employeeAvailabilities = allAvailabilities.filter(a => availableEmployees.some(e => e.id === a.employeeId));
            employeeAvailabilities.sort((a, b) => (a.registrations[0]?.priority || 3) - (b.registrations[0]?.priority || 3));

            for (const availability of employeeAvailabilities) {
                if (!availableEmployees.some(e => e.id === availability.employeeId)) continue;

                for (const registration of availability.registrations) {
                    if (!registration.shiftCode) continue;

                    const matchingSlot = slotsToFill.find(slot =>
                        !slot.employeeId &&
                        slot.shiftCode === registration.shiftCode &&
                        slot.positionId !== 'LEADER'
                    );

                    if (matchingSlot) {
                        matchingSlot.employeeId = availability.employeeId;
                        availableEmployees = availableEmployees.filter(emp => emp.id !== availability.employeeId);
                        break;
                    }
                }
            }

            // --- BƯỚC 3: PHÂN CÔNG CÁC SUẤT CÒN LẠI ---
            const remainingSlots = slotsToFill.filter(slot => !slot.employeeId);
            for (const slot of remainingSlots) {
                if (availableEmployees.length === 0) {
                    console.warn(`Cửa hàng ${store.name} không đủ nhân viên để lấp đầy suất ${slot.positionId} (${slot.shiftCode})`);
                    continue;
                }

                // Sắp xếp ngẫu nhiên nhân viên còn lại để phân công
                availableEmployees.sort(() => 0.5 - Math.random());
                const employeeToAssign = availableEmployees.shift();
                slot.employeeId = employeeToAssign.id;
            }

            // --- BƯỚC 4: TẠO BẢN GHI LỊCH TRÌNH ---
            for (const filledSlot of slotsToFill) {
                if (filledSlot.employeeId) {
                    const tasks = (templateSchedule[filledSlot.shiftId] || []).map(task => ({
                        groupId: task.groupId,
                        startTime: task.startTime,
                        taskCode: task.taskCode,
                        name: task.taskName
                    }));

                    const newScheduleDoc = {
                        date: dateString,
                        employeeId: filledSlot.employeeId,
                        storeId: store.id,
                        shift: filledSlot.shiftCode,
                        positionId: filledSlot.positionId,
                        tasks,
                        createdAt: serverTimestamp()
                    };

                    const scheduleRef = doc(collection(db, 'schedules'));
                    batch.set(scheduleRef, newScheduleDoc);
                    schedulesCreatedCount++;
                }
            }
        }

        await batch.commit();
        window.showToast(`Hoàn tất! Đã tạo ${schedulesCreatedCount} lịch làm việc cho ngày ${dateString} tại ${storesInRegion.length} cửa hàng.`, 'success', 5000);

    } catch (error) {
        console.error("Lỗi khi áp dụng template cho miền:", error);
        window.showToast(`Đã xảy ra lỗi: ${error.message}`, 'error');
    } finally {
        btn.disabled = false;
        if (btnSpan) btnSpan.textContent = 'Áp dụng cho Miền';
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