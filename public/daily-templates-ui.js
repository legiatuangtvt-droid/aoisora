import { allShiftCodes, allWorkPositions, allTaskGroups, allTemplates, currentTemplateId } from './daily-templates-data.js';
import { timeToMinutes } from './utils.js';
import { initializeDragAndDrop } from './daily-templates.js';
import { showTaskLibrary, hideTaskLibrary } from './task-library.js';
import { initRELogicView } from './re-logic.js';

let currentView = 'builder'; // 'builder' or 're-logic'
import { addShiftRow } from './daily-templates-logic.js';
import { updateTemplateFromDOM } from './daily-templates-logic.js';
/**
 * Khóa hoặc mở khóa toàn bộ giao diện xây dựng mẫu.
 * @param {boolean} locked - True để khóa, false để mở khóa.
 */
export function toggleTemplateBuilderLock(locked) {
    const gridContainer = document.getElementById('template-builder-grid-container');
    const addRowButton = document.getElementById('add-shift-row-btn');
    if (!gridContainer) return;

    const overlayId = 'template-builder-overlay';
    let overlay = gridContainer.querySelector(`#${overlayId}`);

    if (locked) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = overlayId;
            overlay.className = 'absolute inset-0 bg-gray-400 bg-opacity-20 z-30 cursor-not-allowed';
            overlay.title = 'Mẫu đang được triển khai, không thể chỉnh sửa.';
            if (getComputedStyle(gridContainer).position === 'static') {
                gridContainer.style.position = 'relative';
            }
            gridContainer.appendChild(overlay);
        }
        overlay.style.width = `${gridContainer.offsetWidth}px`;
        overlay.style.height = `${gridContainer.offsetHeight}px`;

    } else {
        if (overlay) {
            overlay.remove();
        }
    }

    gridContainer.querySelectorAll('.shift-code-selector, .work-position-selector').forEach(el => {
        el.disabled = locked;
    });

    gridContainer.querySelectorAll('.delete-task-btn, .delete-shift-row-btn, .resize-handle').forEach(el => {
        el.style.display = locked ? 'none' : '';
    });

    if (addRowButton) addRowButton.classList.toggle('hidden', locked);
}

/**
 * Cập nhật giao diện của một dòng ca dựa trên mã ca được chọn.
 * @param {HTMLTableRowElement} row - Phần tử <tr> của dòng ca.
 */
export function updateRowAppearance(row) {
    const selector = row.querySelector('.shift-code-selector');
    const selectedShiftCode = selector.value;
    const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === selectedShiftCode);

    const slots = row.querySelectorAll('.quarter-hour-slot');

    if (!shiftInfo || !shiftInfo.timeRange) {
        slots.forEach(slot => {
            slot.classList.remove('bg-slate-50', 'non-work-slot', 'bg-green-50');
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
        const slotDuration = 15;
        const slotStartMinutes = timeToMinutes(time) + quarter;
        const slotEndMinutes = slotStartMinutes + slotDuration;

        if (slotStartMinutes >= shiftStartMinutes && slotEndMinutes <= shiftEndMinutes) {
            slot.classList.remove('bg-slate-50', 'non-work-slot');
            slot.classList.add('bg-green-50');
        } else {
            slot.classList.remove('bg-green-50');
            slot.classList.add('bg-slate-50', 'non-work-slot');
        }
    });
}

/**
 * Tạo và chèn thẻ <datalist> chứa tất cả các mã ca vào body.
 * Thẻ này sẽ được sử dụng bởi các input `shift-code-selector`.
 */
export function createShiftCodeDatalist() {
    // Xóa datalist cũ nếu có để tránh trùng lặp
    document.getElementById('shift-codes-datalist')?.remove();

    const datalist = document.createElement('datalist');
    datalist.id = 'shift-codes-datalist';
    datalist.innerHTML = allShiftCodes.map(sc => 
        `<option value="${sc.shiftCode}">${sc.timeRange}</option>`
    ).join('');
    document.body.appendChild(datalist);
}

/**
 * Cập nhật hiển thị khung giờ và màu sắc của dòng dựa trên mã ca được chọn.
 * @param {HTMLInputElement} selector - Input element của mã ca.
 */
export function updateShiftTimeDisplay(selector) {
    const row = selector.closest('tr');
    if (!row) return;

    const timeDisplay = row.querySelector('.shift-time-display');
    const selectedShiftCode = selector.value;
    const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === selectedShiftCode);

    if (timeDisplay) {
        timeDisplay.textContent = shiftInfo ? shiftInfo.timeRange : '';
    }
    updateRowAppearance(row);
}
/**
 * Render toàn bộ lưới xây dựng lịch trình.
 */
export function renderGrid(templateData = null) {
    const schedule = templateData?.schedule || {};
    const shiftMappings = templateData?.shiftMappings || {};
    const currentUser = window.currentUser;
    const isManager = currentUser && (currentUser.roleId === 'REGIONAL_MANAGER' || currentUser.roleId === 'AREA_MANAGER');

    const container = document.getElementById('template-builder-grid-container');
    if (!container) return;

    const timeSlots = Array.from({ length: 18 }, (_, i) => `${i + 6}:00`);

    const table = document.createElement('table');
    table.className = 'min-w-full border-collapse border border-slate-200 table-fixed';

    const thead = document.createElement('thead');

    thead.className = 'bg-slate-100 sticky top-0 z-20';
    let headerRowHtml = `<th class="p-2 border border-slate-200 min-w-36 sticky left-0 bg-slate-100 z-30">Ca</th>`;
    timeSlots.forEach(time => {
        headerRowHtml += `
            <th class="p-2 border border-slate-200 min-w-[308px] text-center font-semibold text-slate-700">            
                <div class="flex justify-between items-center">
                    <span><i class="fas fa-users text-blue-600"> 0</i></span>
                    ${time}
                    <span><i class="fas fa-cash-register text-green-600"></i> 0</span>
                </div>
            </th>
        `;
    });
    thead.innerHTML = `<tr>${headerRowHtml}</tr>`;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    tbody.id = 'template-builder-tbody';

    // --- LOGIC MỚI: Render các dòng dựa trên templateData ---
    if (templateData && shiftMappings) {
        const sortedShiftIds = Object.keys(shiftMappings).sort((a, b) => {
            const shiftA = shiftMappings[a];
            const shiftB = shiftMappings[b];
            const shiftInfoA = allShiftCodes.find(sc => sc.shiftCode === shiftA.shiftCode);
            const shiftInfoB = allShiftCodes.find(sc => sc.shiftCode === shiftB.shiftCode);
            const startTimeA = shiftInfoA ? timeToMinutes(shiftInfoA.timeRange.split('~')[0]) : 9999;
            const startTimeB = shiftInfoB ? timeToMinutes(shiftInfoB.timeRange.split('~')[0]) : 9999;
            return startTimeA - startTimeB;
        });

        sortedShiftIds.forEach(shiftId => {
            const mapping = shiftMappings[shiftId];
            const shiftTasks = schedule[shiftId] || [];
            const newRow = document.createElement('tr');
            newRow.dataset.shiftId = shiftId;

            const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === mapping.shiftCode);
            const timeRange = shiftInfo ? shiftInfo.timeRange : '';
            // Tạo HTML cho ô thông tin ca (ô đầu tiên)
            const workPositionOptions = allWorkPositions ? allWorkPositions.map(pos => `<option value="${pos.id}" ${pos.id === mapping.positionId ? 'selected' : ''}>${pos.name}</option>`).join('') : '';
            const deleteButtonHTML = isManager ? '' : `<button class="delete-shift-row-btn absolute top-1 right-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" title="Xóa dòng ca này"><i class="fas fa-times"></i></button>`;
            let firstCellHtml = `
                <td class="group p-1 border border-slate-200 align-center sticky left-0 bg-white z-10 w-40 min-w-40 font-semibold text-center">
                    <div class="space-y-1">
                        <input list="shift-codes-datalist" class="shift-code-selector form-input w-full text-xs text-center p-1 font-semibold" placeholder="-- Nhập/Chọn Ca --" value="${mapping.shiftCode || ''}" ${isManager ? 'disabled' : ''}>
                        <div class="shift-time-display text-xs text-slate-500 h-4">${timeRange}</div>
                        <select class="work-position-selector form-input w-full text-xs text-center p-1" ${isManager ? 'disabled' : ''}>
                            <option value="">-- Chọn Vị trí --</option>
                            ${workPositionOptions}
                        </select>
                    </div>
                    ${deleteButtonHTML}
                </td>`;

            // Tạo HTML cho các ô thời gian
            let timeCellsHtml = '';
            timeSlots.forEach(time => {
                timeCellsHtml += `<td class="p-0 border border-slate-200 align-center"><div class="grid grid-cols-4 h-[104px]">`;
                ['00', '15', '30', '45'].forEach(quarter => {
                    const startTime = `${time.split(':')[0].padStart(2, '0')}:${quarter}`;
                    const task = shiftTasks.find(t => t.startTime === startTime);
                    let taskItemHtml = '';
                    if (task) {
                        const group = allTaskGroups[task.groupId] || {};
                        const color = (group.color && group.color.bg) ? group.color : { bg: '#e2e8f0', text: '#1e293b', border: '#94a3b8' };
                        taskItemHtml = `
                            <div class="scheduled-task-item relative group w-[70px] h-[100px] border-2 text-xs p-1 rounded-md shadow-sm flex flex-col justify-between items-center text-center" 
                                 data-task-code="${task.taskCode}" data-group-id="${task.groupId}"
                                 style="background-color: ${color.bg}; color: ${color.text}; border-color: ${color.border};">
                                <div class="flex-grow flex flex-col justify-center"><span class="overflow-hidden text-ellipsis">${task.taskName}</span></div>
                                <span class="font-semibold mt-auto">${task.taskCode}</span>
                                ${!isManager ? '<button class="delete-task-btn absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity" title="Xóa task">&times;</button>' : ''}
                            </div>`;
                    }
                    timeCellsHtml += `<div class="quarter-hour-slot border-r border-dashed border-slate-200 flex justify-center items-center" data-shift-id="${shiftId}" data-time="${time}" data-quarter="${quarter}">${taskItemHtml}</div>`;
                });
                timeCellsHtml += `</div></td>`;
            });

            newRow.innerHTML = firstCellHtml + timeCellsHtml;
            tbody.appendChild(newRow);
            // Cập nhật giao diện cho dòng vừa thêm
            updateRowAppearance(newRow);
        });
    }

    if (!templateData) {
        const newShiftNumber = tbody.children.length + 1;
        addShiftRow(tbody, newShiftNumber, allWorkPositions); // Sử dụng biến tbody đã được tạo ở trên
    }

    table.appendChild(tbody);

    // Nếu ở chế độ tạo mới (không có templateData) và không phải là Manager,
    // hiển thị nút "Thêm ca" trong chân bảng (luôn hiển thị nếu không phải Manager).
    if (!isManager) {
        const tfoot = document.createElement('tfoot');
        tfoot.innerHTML = `
            <tr>
                <td class="p-4 text-left">
                    <button id="add-shift-row-btn" class="btn btn-secondary whitespace-nowrap"><i class="fas fa-plus mr-2"></i>Thêm ca</button>
                </td>
                <td colspan="${timeSlots.length}"></td>
            </tr>
        `;
        table.appendChild(tfoot);
    }
    container.innerHTML = '';
    container.appendChild(table);

    // Khởi tạo lại chức năng kéo thả sau khi render xong
    initializeDragAndDrop();

    // Gắn listener cho các input mã ca để cập nhật khung giờ
    container.querySelectorAll('.shift-code-selector').forEach(selector => {
        selector.addEventListener('change', (e) => {
            updateShiftTimeDisplay(e.target);
            // Tự động lưu lại thay đổi
            updateTemplateFromDOM();
        });
    });
}

/**
 * Hiển thị giao diện theo dõi tiến độ kế hoạch.
 * @param {object} plan - Đối tượng kế hoạch tháng.
 */
export function renderPlanTracker(plan) {
    const container = document.getElementById('plan-tracker-modal');
    if (!container) return;

    const historyList = container.querySelector('#plan-history-list');
    const approvalActions = document.getElementById('plan-approval-actions');

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

    if (plan.history && plan.history.length > 0) {
        const historyHTML = plan.history
            .sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis())
            .map(historyEntry => {
                const stepInfo = steps.find(s => s.id === historyEntry.status);
                const label = stepInfo ? stepInfo.label : historyEntry.status;

                const timestamp = historyEntry.timestamp?.toDate().toLocaleString('vi-VN') || 'N/A';
                const iconClass = historyEntry.status.includes('REJECTED') ? 'fa-times-circle text-red-600' : 'fa-check-circle text-green-700';
                
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
 * Chuyển đổi giữa giao diện xây dựng mẫu và giao diện RE Logic.
 */
export async function toggleBuilderView() {
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
        currentView = 're-logic';
        builderContainer.classList.add('hidden');
        reLogicContainer.classList.remove('hidden');
        toggleBtnIcon.className = 'fas fa-sitemap mr-2';
        toggleBtnSpan.textContent = 'Model';
        saveBtn.classList.add('hidden');
        newBtn.classList.add('hidden');
        deployBtn.classList.add('hidden');
        deleteBtn.classList.add('hidden');
        hideTaskLibrary();
        await initRELogicView(currentTemplateId, allTemplates, allTaskGroups);
    } else {
        currentView = 'builder';
        builderContainer.classList.remove('hidden');
        reLogicContainer.classList.add('hidden');
        toggleBtnIcon.className = 'fas fa-list-alt mr-2';
        toggleBtnSpan.textContent = 'Detail';
        if (window.currentUser && (window.currentUser.roleId === 'HQ_STAFF' || window.currentUser.roleId === 'ADMIN')) {
            saveBtn.classList.remove('hidden');
            newBtn.classList.remove('hidden');
            deployBtn.classList.remove('hidden');
            deleteBtn.classList.remove('hidden');
            showTaskLibrary();
        }
    }
}