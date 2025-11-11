import { db } from './firebase.js';
import { collection, getDocs, query, orderBy, doc, setDoc, serverTimestamp, addDoc, deleteDoc, getDoc, where, writeBatch, limit, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { calculateREForGroup } from './re-calculator.js';
import { showTaskLibrary } from './task-library.js';
import { initRELogicView } from './re-logic.js';
import { toggleTemplateBuilderLock, updateRowAppearance, renderGrid, renderPlanTracker } from './daily-templates-ui.js';
import { allTemplates, currentTemplateId, currentMonthlyPlan, originalTemplateData, allWorkPositions, allTaskGroups, fetchAndRenderTemplates, setCurrentTemplateId, setOriginalTemplateData, loadTemplateData } from './daily-templates-data.js';
import { initializeDragAndDrop } from './daily-templates.js';
import { timeToMinutes, formatDate } from './utils.js';

/**
 * Xử lý sự kiện khi một task được kéo thả xong (di chuyển, thêm, xóa).
 */
export function handleDragEnd(evt) {
    updateTemplateFromDOM();
    updateTemplateStats();
}

/**
 * Thêm một dòng ca mới vào bảng.
 */
export function addShiftRow(tbody, shiftNumber) {
    const currentUser = window.currentUser;
    const isManager = currentUser && (currentUser.roleId === 'REGIONAL_MANAGER' || currentUser.roleId === 'AREA_MANAGER');
    const disabledAttr = isManager ? 'disabled' : '';

    const timeSlots = Array.from({ length: 18 }, (_, i) => `${i + 6}:00`);
    const shiftId = `shift-${shiftNumber}`;
    const newRow = document.createElement('tr');
    newRow.dataset.shiftId = shiftId;

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
            <td class="p-0 border border-slate-200 align-center">
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

    // Khởi tạo lại kéo-thả cho các ô mới được thêm vào
    initializeDragAndDrop();
}

/**
 * Thu thập dữ liệu từ DOM và cập nhật mẫu hiện tại trong Firestore.
 */
export async function updateTemplateFromDOM() {
    const currentUser = window.currentUser;
    const isPrivilegedUser = currentUser && (currentUser.roleId === 'HQ_STAFF' || currentUser.roleId === 'ADMIN');

    checkTemplateChangesAndToggleResetButton();

    if (!currentTemplateId) {
        return;
    }

    if (!isPrivilegedUser) {
        return;
    }

    const scheduleData = {};
    const shiftMappings = {};
    const totalManhour = parseFloat(document.getElementById('template-manhour-input').value) || 0;

    document.querySelectorAll('#template-builder-grid-container .scheduled-task-item').forEach(taskItem => {
        const slot = taskItem.closest('.quarter-hour-slot');
        if (!slot) return;

        const shiftId = slot.dataset.shiftId;
        const taskName = taskItem.querySelector('span.overflow-hidden').textContent;
        const taskCode = taskItem.dataset.taskCode;
        const groupId = taskItem.dataset.groupId;
        const time = slot.dataset.time;
        const quarter = slot.dataset.quarter;
        const startTime = `${time.split(':')[0].padStart(2, '0')}:${quarter}`;

        if (!scheduleData[shiftId]) {
            scheduleData[shiftId] = [];
        }
        scheduleData[shiftId].push({ taskCode, taskName, startTime, groupId });
    });

    document.querySelectorAll('#template-builder-grid-container tbody tr').forEach(row => {
        const shiftId = row.dataset.shiftId;
        const selectedShiftCode = row.querySelector('.shift-code-selector')?.value;
        const selectedPositionId = row.querySelector('.work-position-selector')?.value;
        if (shiftId) {
            shiftMappings[shiftId] = { shiftCode: selectedShiftCode, positionId: selectedPositionId };
        }
    });

    try {
        const templateRef = doc(db, 'daily_templates', currentTemplateId);
        await setDoc(templateRef, { schedule: scheduleData, shiftMappings: shiftMappings, totalManhour: totalManhour, updatedAt: serverTimestamp() }, { merge: true });
    } catch (error) {
        console.error("Lỗi khi tự động cập nhật lịch trình mẫu:", error);
        window.showToast('Lỗi khi tự động lưu thay đổi. Vui lòng thử lại.', 'error');
    }
}

/**
 * Chuyển giao diện về chế độ tạo mẫu mới.
 */
export function switchToCreateNewMode() {
    setOriginalTemplateData(null);
    setCurrentTemplateId(null);
    document.getElementById('template-selector').value = 'new';
    toggleTemplateBuilderLock(false);
    renderGrid();

    document.getElementById('new-template-btn').classList.add('hidden');
    document.getElementById('delete-template-btn').classList.add('hidden');

    document.getElementById('reset-template-btn')?.classList.add('hidden');
    const statusContainer = document.getElementById('template-display-container');
    if (statusContainer) {
        statusContainer.classList.add('hidden');
    }

    const manhourInput = document.getElementById('template-manhour-input');
    const manhourDisplay = document.getElementById('total-manhour-display');
    if (manhourInput) {
        manhourInput.value = '';
    }
    if (manhourDisplay) {
        manhourDisplay.textContent = '0';
    }
    updateTemplateStats();
}

/**
 * Tải dữ liệu của một mẫu, render lại lưới và cập nhật trạng thái.
 * Đây là hàm điều phối chính khi người dùng chọn một mẫu từ dropdown.
 * @param {string} templateId - ID của mẫu cần tải, hoặc 'new' để tạo mới.
 */
export async function loadTemplate(templateId) {
    const currentUser = window.currentUser;
    const isManager = currentUser && (currentUser.roleId === 'REGIONAL_MANAGER' || currentUser.roleId === 'AREA_MANAGER');

    if (templateId === 'new') {
        switchToCreateNewMode();
        return;
    }

    if (!templateId) {
        renderGrid(); // Render lưới trống nếu không có templateId
        return;
    }

    const templateData = await loadTemplateData(templateId);
    setCurrentTemplateId(templateId);

    if (templateData) {
        // Render lưới với dữ liệu mẫu
        renderGrid(templateData);
        // Cập nhật các giá trị input/display
        const manhourInput = document.getElementById('template-manhour-input');
        const manhourDisplay = document.getElementById('total-manhour-display');
        if (manhourInput) manhourInput.value = templateData.totalManhour || 0;
        if (manhourDisplay) manhourDisplay.textContent = templateData.totalManhour || 0;

        // Khóa giao diện nếu là Manager
        toggleTemplateBuilderLock(isManager);
    } else {
        // Nếu không tải được dữ liệu, render lưới trống
        renderGrid();
    }
    updateTemplateStats();
    checkTemplateChangesAndToggleResetButton();
}

/**
 * Xử lý việc xóa mẫu hiện tại.
 */
export async function deleteCurrentTemplate() {
    if (!currentTemplateId) return;

    const currentTemplate = allTemplates.find(t => t.id === currentTemplateId);
    const confirmed = await showConfirmation(`Bạn có chắc chắn muốn xóa mẫu "${currentTemplate.name}" không? Hành động này không thể hoàn tác.`, 'Xác nhận xóa', 'Xóa', 'Hủy');
    if (confirmed) {
        try {
            await deleteDoc(doc(db, 'daily_templates', currentTemplateId));
            window.showToast(`Đã xóa mẫu "${currentTemplate.name}".`, 'success');
            await fetchAndRenderTemplates();
            switchToCreateNewMode();
        } catch (error) {
            console.error("Lỗi khi xóa mẫu:", error);
            window.showToast('Đã có lỗi xảy ra khi xóa mẫu.', 'error');
        }
    }
}

/**
 * So sánh mẫu hiện tại với mẫu gốc và hiển thị/ẩn nút Reset.
 */
export function checkTemplateChangesAndToggleResetButton() {
    const currentUser = window.currentUser;
    if (!currentUser || currentUser.roleId === 'HQ_STAFF' || currentUser.roleId === 'ADMIN' || !originalTemplateData) {
        return;
    }

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

    const originalTaskMap = createTaskMap(originalTemplateData.schedule);

    const currentTaskMap = new Map();
    document.querySelectorAll('#template-builder-grid-container .scheduled-task-item').forEach(taskItem => {
        const slot = taskItem.closest('.quarter-hour-slot');
        if (!slot) return;
        const key = `${slot.dataset.shiftId}_${slot.dataset.time}_${slot.dataset.quarter}`;
        currentTaskMap.set(key, taskItem.dataset.taskCode);
    });

    let changedSlotCount = 0;
    const allSlotKeys = new Set([...originalTaskMap.keys(), ...currentTaskMap.keys()]);

    allSlotKeys.forEach(key => {
        const originalTaskCode = originalTaskMap.get(key);
        const currentTaskCode = currentTaskMap.get(key);

        if (originalTaskCode !== currentTaskCode) {
            changedSlotCount++;
        }
    });

    const totalOriginalSlots = originalTaskMap.size;
    const changePercentage = totalOriginalSlots > 0
        ? (changedSlotCount / totalOriginalSlots) * 100
        : (changedSlotCount > 0 ? 100 : 0);

    const resetButton = document.getElementById('reset-template-btn');
    const percentageDisplay = document.getElementById('reset-percentage-display');
    const deployButton = document.getElementById('apply-template-hq-btn');
    const deployButtonSpan = deployButton?.querySelector('span');

    if (currentUser && (currentUser.roleId === 'REGIONAL_MANAGER' || currentUser.roleId === 'AREA_MANAGER') && deployButton && deployButtonSpan) {
        deployButton.disabled = false;
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
export async function handleResetTemplate() {
    const confirmed = await window.showConfirmation('Bạn có chắc chắn muốn khôi phục lịch trình về trạng thái ban đầu do HQ gửi không? Mọi thay đổi sẽ bị mất.', 'Xác nhận Reset', 'Khôi phục', 'Hủy');
    if (confirmed) {
        await loadTemplate(currentTemplateId);
        checkTemplateChangesAndToggleResetButton();
        window.showToast('Đã khôi phục lịch trình về trạng thái ban đầu.', 'success');
    }
}

/**
 * (Chỉ dành cho HQ) Áp dụng template cho các miền được chọn.
 */
export async function applyTemplateForHq(template) {
        const payrollSettingsRef = doc(db, 'system_configurations', 'payroll_settings');
        const payrollSettingsSnap = await getDoc(payrollSettingsRef);
        const payrollStartDay = payrollSettingsSnap.exists() ? payrollSettingsSnap.data().startDay : 26;

        const today = new Date();
        let startDate;

        if (today.getDate() < payrollStartDay) {
            startDate = new Date(today.getFullYear(), today.getMonth(), payrollStartDay);
        } else {
            startDate = new Date(today.getFullYear(), today.getMonth() + 1, payrollStartDay);
        }

        const dateString = formatDate(startDate);
        const formattedStartDate = startDate.toLocaleDateString('vi-VN');
        window.showToast(`Mẫu sẽ được áp dụng từ ngày ${formattedStartDate}.`, 'info', 4000);

        const batch = writeBatch(db);

        const newPlan = {
            regionId: "ALL",
            regionManagerId: "ALL",
            cycleStartDate: dateString,
            templateId: template.id,
            templateName: template.name,
            status: 'HQ_APPLIED',
            history: [{
                status: 'HQ_APPLIED',
                timestamp: new Date(),
                userId: window.currentUser.id,
                userName: window.currentUser.name
            }],
            comments: []
        };
        const planRef = doc(collection(db, 'monthly_plans'));
        batch.set(planRef, newPlan);

        const confirmed = await window.showConfirmation(
            `Bạn có chắc chắn muốn gửi kế hoạch dựa trên mẫu <strong>"${template.name}"</strong> đến các miền của [Tất cả] cho chu kỳ bắt đầu từ ngày <strong>${formattedStartDate}</strong> không?`,
            'Xác nhận gửi kế hoạch',
            'Gửi Kế hoạch',
            'Hủy'
        );

        if (!confirmed) {
            window.showToast('Đã hủy thao tác.', 'info');
            return;
        }

        await batch.commit();
        window.showToast(`Hoàn tất! Đã gửi kế hoạch từ mẫu "${template.name}" đến tất cả các miền.`, 'success', 5000);
        
        await showTemplateApplyStatus(template.id);
}

/**
 * (Dành cho RM/AM) Tải kế hoạch và mẫu được áp dụng gần nhất.
 */
export async function loadAppliedPlanForManager() {
    const currentUser = window.currentUser;
    if (!currentUser) return;

    let regionIdToQuery = null;
    if (currentUser.roleId === 'REGIONAL_MANAGER') {
        regionIdToQuery = currentUser.managedRegionId;
    } else if (currentUser.roleId === 'AREA_MANAGER') {
        const areasSnap = await getDocs(query(collection(db, 'areas'), where('id', 'in', currentUser.managedAreaIds || ['dummy']), limit(1)));
        if (!areasSnap.empty) {
            regionIdToQuery = areasSnap.docs[0].data().regionId;
        }
    }

    if (!regionIdToQuery) {
        document.getElementById('template-selector-container').classList.add('hidden');
        document.getElementById('template-display-container').classList.remove('hidden');
        document.getElementById('template-display-container').querySelector('#template-name-display').textContent = 'Bạn chưa được phân công vào miền nào.';
        renderGrid();
        return;
    }

    const plansQuery = query(
        collection(db, 'monthly_plans'),
        where('regionId', '==', regionIdToQuery),
        orderBy('cycleStartDate', 'desc'),
        limit(1)
    );

    const plansSnap = await getDocs(plansQuery);
    if (plansSnap.empty) {
        document.getElementById('template-selector-container').classList.add('hidden');
        document.getElementById('template-display-container').classList.remove('hidden');
        document.getElementById('template-display-container').querySelector('#template-name-display').textContent = 'Chưa có kế hoạch nào được áp dụng cho miền của bạn.';
        renderGrid();
    } else {
        const plan = { id: plansSnap.docs[0].id, ...plansSnap.docs[0].data() };
        currentMonthlyPlan = plan;

        document.getElementById('template-selector').value = plan.templateId;
        await loadTemplate(plan.templateId); // Sử dụng hàm loadTemplate mới

        renderPlanTracker(plan);
    }
}

/**
 * Cập nhật bảng thống kê group task dựa trên các task đang có trên lưới.
 */
export function updateTemplateStats() {
    const statsContentWrapper = document.getElementById('stats-content-wrapper');
    if (!statsContentWrapper) return;
    const scheduledTasks = document.querySelectorAll('.scheduled-task-item');

    const newStats = {};

    scheduledTasks.forEach(taskItem => {
        const groupId = taskItem.dataset.groupId;
        if (!groupId) return;

        if (!newStats[groupId]) {
            newStats[groupId] = { count: 0 };
        }
        newStats[groupId].count++;
    });

    let table = statsContentWrapper.querySelector('#stats-table');
    if (!table) {
        statsContentWrapper.innerHTML = '';
        table = document.createElement('table');
        table.id = 'stats-table';
        table.className = 'w-full text-xs border-collapse';
        table.innerHTML = `
            <thead class="bg-slate-50 sticky top-0 z-10">
                <tr>
                    <th class="p-2 text-center font-semibold text-slate-600 w-12">STT</th>
                    <th class="text-center font-semibold text-slate-600">Group Task</th>
                    <th class="p-2 text-center font-semibold text-slate-600 w-24">Đề xuất</th>
                    <th class="p-2 text-center font-semibold text-slate-600 w-24">Sắp xếp</th>
                </tr>
            </thead>
            <tbody></tbody>
            <tfoot class="bg-slate-100 font-bold sticky bottom-0">
                 <tr>
                    <td class="p-2 font-semibold text-center" colspan="2">Tổng cộng</td>
                    <td id="re-total-time" class="p-2 text-center">0.00</td>
                    <td id="stats-total-time" class="p-2 text-center">0.00</td>
                </tr>
            </tfoot>
        `;
        statsContentWrapper.appendChild(table);
    }

    const tbody = table.querySelector('tbody');
    const currentTemplate = allTemplates.find(t => t.id === currentTemplateId);
    const reParameters = currentTemplate?.reParameters || {};
    let totalCount = 0;
    let totalSuggestedHours = 0;

    const sortedGroupIds = Object.keys(allTaskGroups).sort((a, b) => (allTaskGroups[a].order || 999) - (allTaskGroups[b].order || 999));

    sortedGroupIds.forEach((groupId, index) => {
        const groupInfo = allTaskGroups[groupId];
        const currentCount = newStats[groupId] ? newStats[groupId].count : 0;
        const currentTime = (currentCount * 0.25).toFixed(2);
        const suggestedHours = calculateREForGroup(groupInfo, reParameters);

        totalSuggestedHours += suggestedHours;
        totalCount += currentCount;

        let row = tbody.querySelector(`tr[data-group-id="${groupId}"]`);
        if (!row) {
            const color = (groupInfo.color && groupInfo.color.tailwind_text) ? groupInfo.color : { tailwind_text: 'text-slate-800' };
            row = document.createElement('tr');
            row.className = 'border-b border-slate-100';
            row.dataset.groupId = groupId;
            row.innerHTML = `
                <td class="p-2 text-center text-slate-500">${index + 1}</td>
                <td class="text-center font-medium ${color.tailwind_text}">${groupInfo.code}</td>
                <td class="stat-suggested p-2 text-center text-slate-500 font-bold">${suggestedHours.toFixed(2)}</td>
                <td class="stat-time p-2 text-center text-slate-500">${currentTime}</td>
            `;
            tbody.appendChild(row);
        } else {
            row.querySelector('.stat-suggested').textContent = suggestedHours.toFixed(2);
            row.querySelector('.stat-time').textContent = currentTime;
        }
    });

    const totalTimeCell = table.querySelector('#stats-total-time');
    const newTotalTime = totalCount * 0.25;
    const reTotalTimeCell = table.querySelector('#re-total-time');
    reTotalTimeCell.textContent = totalSuggestedHours.toFixed(2);
    totalTimeCell.textContent = newTotalTime.toFixed(2);

    const scheduledHoursValueEl = document.getElementById('scheduled-hours-value');
    if (scheduledHoursValueEl) scheduledHoursValueEl.textContent = newTotalTime.toFixed(2);
}