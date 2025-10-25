import { db } from './firebase.js';
import { collection, getDocs, query, orderBy, doc, setDoc, serverTimestamp, addDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let allMainTasks = {}; // Dùng object để tra cứu nhanh bằng ID
let sortableInstances = [];

let allTemplates = [];
let currentTemplateId = null;

// Bảng màu mặc định nếu group không có màu
const defaultColor = {
    tailwind_bg: 'bg-slate-200', tailwind_text: 'text-slate-800', tailwind_border: 'border-slate-400'
};
let allTaskGroups = {};

/**
 * Tải tất cả dữ liệu nền cần thiết một lần.
 */
async function fetchInitialData() {
    try {
        // Tải danh sách công việc chính
        const tasksSnapshot = await getDocs(collection(db, 'main_tasks'));
        allMainTasks = tasksSnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = { id: doc.id, ...doc.data() };
            return acc;
        }, {});

        // Tải nhóm công việc để lấy thông tin màu
        const taskGroupsQuery = query(collection(db, 'task_groups'));
        const taskGroupsSnapshot = await getDocs(taskGroupsQuery);
        allTaskGroups = taskGroupsSnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = { id: doc.id, ...doc.data() };
            return acc;
        }, {});
    } catch (error) {
        console.error("Lỗi nghiêm trọng khi tải dữ liệu nền:", error);
        const container = document.getElementById('template-builder-grid-container');
        if(container) container.innerHTML = `<div class="p-10 text-center text-red-500">Không thể tải dữ liệu nền. Vui lòng thử lại.</div>`;
    }
}

/**
 * Render toàn bộ lưới xây dựng lịch trình.
 */
function renderGrid() {
    const container = document.getElementById('template-builder-grid-container');
    if (!container) return;

    const timeSlots = Array.from({ length: 16 }, (_, i) => `${i + 6}:00`); // 6:00 -> 21:00

    // Tạo bảng
    const table = document.createElement('table');
    table.className = 'min-w-full border-collapse border border-slate-200';

    // --- Tạo Header (Tên nhân viên) ---
    const thead = document.createElement('thead');
    thead.className = 'bg-slate-100 sticky top-0 z-20'; // Tăng z-index để header nổi trên các ô sticky
    let headerRowHtml = `<th class="p-2 border border-slate-200 w-20 min-w-20 sticky left-0 bg-slate-100 z-30">Ca</th>`; // Cột Ca, sticky
    timeSlots.forEach(time => {
        headerRowHtml += `
            <th class="p-2 border border-slate-200 min-w-[308px] text-center font-semibold text-slate-700">${time}</th>
        `;
    });
    thead.innerHTML = `<tr>${headerRowHtml}</tr>`;
    table.appendChild(thead);

    // --- Tạo Body (Các hàng thời gian và ô kéo thả) ---
    const tbody = document.createElement('tbody');
    for (let i = 1; i <= 10; i++) {
        const shiftId = `shift-${i}`;
        let bodyRowHtml = `
            <td class="p-2 border border-slate-200 align-top sticky left-0 bg-white z-10 w-20 min-w-20 font-semibold text-center">
                Ca ${i}
            </td>
        `; // Ô thông tin ca, sticky

        timeSlots.forEach(time => {
            // Mỗi ô lớn chứa 4 ô 15 phút
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
        tbody.innerHTML += `<tr data-shift-id="${shiftId}">${bodyRowHtml}</tr>`;
    }
    table.appendChild(tbody);

    container.innerHTML = ''; // Xóa nội dung "đang tải"
    container.appendChild(table);

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
                put: true // Cho phép nhận task từ thư viện
            },
            animation: 150,
            ghostClass: "swap-ghost", // Class cho "bóng ma" khi kéo, để tùy chỉnh hiệu ứng đổi chỗ
            onEnd: function (evt) {
                // Khi một task được kéo thả xong (thêm, di chuyển, xóa khỏi slot)
                // Cần cập nhật lại dữ liệu mẫu.
                updateTemplateFromDOM();
                updateTemplateStats(); // Cập nhật thống kê
            },
            onAdd: function (evt) {
                const item = evt.item;
                const toSlot = evt.to;

                // --- LOGIC HOÁN ĐỔI NÂNG CAO ---
                // Nếu đây là thao tác di chuyển nội bộ (không phải clone từ thư viện)
                // và ô đích đã có sẵn một task khác.
                if (evt.pullMode !== 'clone' && toSlot.children.length > 1) {
                    // Tìm task đã có sẵn trong ô đích (phần tử không phải là task đang kéo)
                    const existingItem = Array.from(toSlot.children).find(child => child !== item);
                    if (existingItem) {
                        // Di chuyển task có sẵn đó về lại ô gốc của task đang kéo
                        evt.from.appendChild(existingItem);
                    }
                }
                // --- KẾT THÚC LOGIC HOÁN ĐỔI ---

                const taskCode = item.dataset.taskCode;
                const groupId = item.dataset.groupId; // Lấy groupId từ task được kéo

                // Chỉ định dạng lại nếu task đến từ thư viện (pullMode === 'clone')
                // Nếu là di chuyển nội bộ, item đã có định dạng đúng.
                if (evt.pullMode === 'clone') {
                    // Khi kéo từ thư viện, item.textContent chứa cả tên và mã, ta cần lấy lại tên gốc
                    const taskName = item.textContent;
                    const group = allTaskGroups[groupId];
                    const color = (group && group.color && group.color.tailwind_bg) ? group.color : defaultColor;

                    // Ghi đè class để định dạng lại task trong lưới lịch trình
                    // Sử dụng justify-between để đẩy taskCode xuống dưới
                    item.className = `scheduled-task-item relative group w-[70px] h-[100px] ${color.tailwind_bg} ${color.tailwind_text} ${color.tailwind_border} border-2 text-xs p-1 rounded-md shadow-sm cursor-pointer flex flex-col justify-between items-center text-center mb-1`;
                    item.dataset.taskCode = taskCode; // Gán lại mã task vào item mới
                    item.dataset.groupId = groupId; // Lưu lại groupId để dùng khi tải lại mẫu

                    // Xây dựng lại nội dung một lần duy nhất, sử dụng các biến đã lưu
                    item.innerHTML = `
                        <div class="resize-handle left-handle" title="Kéo để nhân bản"></div>
                        <div class="resize-handle right-handle" title="Kéo để nhân bản"></div>
                        <button class="delete-task-btn absolute top-0 right-0 p-1 leading-none font-bold text-current opacity-50 hover:opacity-100 group-hover:opacity-100">×</button>
                        <div class="flex-grow flex flex-col justify-center">
                            <span class="overflow-hidden text-ellipsis">${item.querySelector('.text-ellipsis')?.textContent || taskName}</span>
                        </div>
                        <span class="font-semibold mt-auto">${taskCode}</span>
                    `;
                }
                // Nếu không phải clone (tức là di chuyển nội bộ), không cần làm gì, item đã có định dạng đúng.

                // CẬP NHẬT: Gọi hàm cập nhật sau khi thêm task mới từ thư viện
                updateTemplateFromDOM();
                updateTemplateStats();
            }
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

    // 1. Thu thập dữ liệu từ DOM
    document.querySelectorAll('.scheduled-task-item').forEach(taskItem => {
        const slot = taskItem.closest('.quarter-hour-slot');
        if (!slot) return;

        const shiftId = slot.dataset.shiftId;
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

    // 2. Lưu vào Firestore
    try {
        if (templateIdToSave) {
            // Cập nhật mẫu đã có
            const templateRef = doc(db, 'daily_templates', templateIdToSave);
            await setDoc(templateRef, { schedule: scheduleData, updatedAt: serverTimestamp() }, { merge: true });
        } else {
            // Tạo mẫu mới
            const newDocRef = await addDoc(collection(db, 'daily_templates'), {
                name: templateName.trim(),
                schedule: scheduleData,
                createdAt: serverTimestamp()
            });
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

    // 1. Thu thập dữ liệu từ DOM
    document.querySelectorAll('.scheduled-task-item').forEach(taskItem => {
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

    // 2. Cập nhật vào Firestore
    try {
        const templateRef = doc(db, 'daily_templates', currentTemplateId);
        await setDoc(templateRef, { schedule: scheduleData, updatedAt: serverTimestamp() }, { merge: true });
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
            const { schedule } = docSnap.data();
            if (!schedule) return;
            
            // Điền các task vào lưới
            Object.keys(schedule).forEach(shiftId => {
                (schedule[shiftId] || []).forEach(taskInfo => { // taskInfo giờ đây có cả taskName
                    const { taskCode, startTime, groupId } = taskInfo;
                    const [hour, quarter] = startTime.split(':');
                    const time = `${parseInt(hour, 10)}:00`;

                    const slot = document.querySelector(`.quarter-hour-slot[data-shift-id="${shiftId}"][data-time="${time}"][data-quarter="${quarter}"]`);
                    if (slot) {
                        const group = allTaskGroups[groupId] || {};
                        const color = (group.color && group.color.tailwind_bg) ? group.color : defaultColor;
                        // Lấy tên task từ dữ liệu mẫu, nếu không có thì dùng mã task
                        const taskName = taskInfo.taskName || '...'; // Lấy taskName từ dữ liệu mẫu
                        const taskItem = document.createElement('div'); 
                        // Sử dụng justify-between để đẩy taskCode xuống dưới
                        taskItem.className = `scheduled-task-item relative group w-[70px] h-[100px] ${color.tailwind_bg} ${color.tailwind_text} ${color.tailwind_border} border-2 text-xs p-1 rounded-md shadow-sm cursor-grab flex flex-col justify-between items-center text-center mb-1`;
                        taskItem.dataset.taskCode = taskCode;
                        taskItem.dataset.groupId = groupId;
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
    await fetchInitialData();
    await fetchAndRenderTemplates(); // Tải danh sách mẫu vào dropdown
    switchToCreateNewMode(); // Đặt trạng thái mặc định là tạo mới

    document.getElementById('save-template-btn')?.addEventListener('click', saveTemplate);
    document.getElementById('new-template-btn')?.addEventListener('click', switchToCreateNewMode);
    document.getElementById('delete-template-btn')?.addEventListener('click', deleteCurrentTemplate);
    document.getElementById('template-selector')?.addEventListener('change', (e) => loadTemplate(e.target.value));
}

export function cleanup() {
    sortableInstances.forEach(s => s.destroy());
    sortableInstances = [];
    // Dọn dẹp các listener bằng cách clone và thay thế node
    ['save-template-btn', 'new-template-btn', 'delete-template-btn', 'template-selector'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const newEl = el.cloneNode(true);
            el.parentNode.replaceChild(newEl, el);
        }
    });
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
    // --- Lấy dữ liệu cũ từ bảng đang hiển thị (nếu có) ---
    const oldTotalCountEl = document.getElementById('stats-total-count');
    const oldTotalCount = oldTotalCountEl ? parseInt(oldTotalCountEl.textContent, 10) : 0;

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
        table.className = 'w-full text-sm border-collapse';
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

    // --- Lấy dữ liệu cũ từ các dòng trong bảng ---
    const oldRowStats = {};
    table.querySelectorAll('tbody tr[data-group-id]').forEach(row => {
        const groupId = row.dataset.groupId;
        const countCell = row.querySelector('.stat-count');
        if (groupId && countCell) {
            oldRowStats[groupId] = {
                count: parseInt(countCell.textContent, 10) || 0
            };
        }
    });

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
        const oldGroupCount = oldRowStats[groupId] ? oldRowStats[groupId].count : 0;
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
                <td class="text-center font-medium ${color.tailwind_text}">${groupInfo.name}</td>
                <td class="stat-time p-2 text-center text-slate-500">0.00</td>
            `;
            tbody.appendChild(row);
        }

        // Cập nhật giá trị và kích hoạt animation nếu có thay đổi
        const timeCell = row.querySelector('.stat-time');

        // Tính toán sự thay đổi về thời gian để tạo hiệu ứng
        const oldTime = parseFloat(timeCell.textContent) || 0;
        const timeChange = currentTime - oldTime;

        if (timeChange !== 0) {
            timeCell.textContent = currentTime;
            triggerStatAnimation(timeCell, `${timeChange > 0 ? '+' : ''}${timeChange.toFixed(2)}`);
        }
    }

    // --- Cập nhật dòng tổng kết ---
    const totalTimeCell = table.querySelector('#stats-total-time');

    const oldTotalTime = parseFloat(totalTimeCell.textContent) || 0;
    const newTotalTime = totalCount * 0.25;
    const totalTimeChange = newTotalTime - oldTotalTime;

    if (totalTimeChange !== 0) {
        totalTimeCell.textContent = (totalCount * 0.25).toFixed(2);
        triggerStatAnimation(totalTimeCell, `${totalTimeChange > 0 ? '+' : ''}${totalTimeChange.toFixed(2)}`);
    }
}