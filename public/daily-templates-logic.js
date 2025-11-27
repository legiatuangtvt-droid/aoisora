import { db } from './firebase.js';
import { collection, getDocs, query, orderBy, doc, setDoc, serverTimestamp, addDoc, deleteDoc, getDoc, where, writeBatch, limit, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { calculateREForGroup } from './re-calculator.js';
import { showTaskLibrary } from './task-library.js';
import { initRELogicView } from './re-logic.js';
import { toggleTemplateBuilderLock, updateRowAppearance, renderGrid, renderPlanTracker, updateShiftTimeDisplay, getCurrentView, updateGridHeaderStats} from './daily-templates-ui.js';
import { allTemplates, currentTemplateId, currentMonthlyPlan, originalTemplateData, allWorkPositions, allTaskGroups, fetchAndRenderTemplates, setCurrentTemplateId, setOriginalTemplateData, loadTemplateData, setCurrentMonthlyPlan, allShiftCodes } from './daily-templates-data.js';
import { initializeDragAndDrop } from './daily-templates.js';
import { generateSchedule } from './auto-generator.js';
import { timeToMinutes, formatDate } from './utils.js';

// Map các trạng thái kế hoạch tháng sang chuỗi hiển thị thân thiện
const planStatusMessages = {

    'HQ_APPLIED': 'HQ đã triển khai tới RM',
    'RM_AWAITING_APPROVAL': 'RM đang chờ HQ phê duyệt',
    'HQ_REJECTED_RM_CHANGES': 'HQ đã từ chối thay đổi của RM',
    'HQ_APPROVED_RM_CHANGES': 'HQ đã phê duyệt thay đổi của RM',
    'RM_SENT_TO_STAFF': 'RM đã gửi về Staff',
    'STAFF_REGISTERED': 'Staff đã đăng ký',
    'SL_ADJUSTED': 'SL đã điều chỉnh',
    'AM_DISPATCHED': 'AM đã điều phối',
    'RM_DISPATCHED': 'RM đã điều phối',
    'HQ_CONFIRMED': 'HQ đã xác nhận',

    // Thêm các trạng thái khác nếu có
};

/**
 * Ghi nhận việc một task được sử dụng (kéo-thả) vào Firestore.
 * @param {string} groupId - ID của nhóm chứa task.
 * @param {string} taskCode - Mã của task.
 */
export async function logTaskUsage(groupId, taskCode) {
    const currentUser = window.currentUser;
    if (!currentUser || !currentUser.id || !groupId || !taskCode) {
        console.warn('[Task Usage] Dừng ghi nhận: Thiếu thông tin người dùng, groupId, hoặc taskCode.');
        return;
    }

    try {
        const uniqueTaskId = `${groupId}__${taskCode}`; // Sử dụng dấu phân cách an toàn hơn
        const userStatsRef = doc(db, 'task_usage_stats', currentUser.id);

        // Sử dụng increment() để tăng số đếm một cách an toàn, tránh race condition.
        // Field name sử dụng dấu chấm để cập nhật một key cụ thể trong map.
        // SỬA LỖI: Dùng updateDoc thay vì setDoc để đảm bảo dot notation hoạt động đúng với nested map.
        // updateDoc sẽ tự động tạo document nếu nó không tồn tại khi dùng trong transaction hoặc batch,
        // nhưng ở đây ta cần đảm bảo document tồn tại hoặc dùng setDoc với cấu trúc đúng.
        await setDoc(userStatsRef, {
            usageCounts: { [uniqueTaskId]: increment(1) }
        }, { merge: true }); // Dùng setDoc với merge:true và cấu trúc nested object

    } catch (error) {
        console.error("Lỗi khi ghi nhận tần suất sử dụng task:", error);
        // Không cần thông báo cho người dùng để tránh làm phiền
    }
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

    const workPositionOptions = allWorkPositions ? allWorkPositions.map(pos => `<option value="${pos.id}">${pos.name}</option>`).join('') : '';
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

    // Sau khi thêm dòng mới, khởi tạo lại kéo-thả
    initializeDragAndDrop();

    // Gắn listener cho input mã ca của dòng vừa thêm
    const newSelector = newRow.querySelector('.shift-code-selector');
    if (newSelector) {
        newSelector.addEventListener('change', (e) => {
            // Cập nhật lại toàn bộ logic giống như khi render lưới ban đầu
            updateShiftTimeDisplay(e.target); // Cập nhật giao diện dòng (màu sắc, giờ)
            updateGridHeaderStats();          // Cập nhật chỉ số header (vị trí, man-hour)
            updateTemplateFromDOM();          // Tự động lưu thay đổi
        });
    }
}

/**
 * Thu thập dữ liệu từ DOM và cập nhật mẫu hiện tại trong Firestore.
 */
export async function updateTemplateFromDOM(manualScheduleData = null, manualShiftMappings = null, manualTotalManhour = null) {
    const currentUser = window.currentUser;
    const isPrivilegedUser = currentUser && (currentUser.roleId === 'HQ_STAFF' || currentUser.roleId === 'ADMIN');

    checkTemplateChangesAndToggleResetButton();

    if (!currentTemplateId && !manualScheduleData) { // Allow saving new template if manual data is provided
        return;
    }

    if (!isPrivilegedUser) {
        return;
    }

    const scheduleData = manualScheduleData || {};
    const shiftMappings = manualShiftMappings || {};
    const totalManhour = manualTotalManhour !== null ? manualTotalManhour : (parseFloat(document.getElementById('template-manhour-input').value) || 0);
    const hourlyManhours = {}; // --- NEW: Đối tượng để lưu manhour theo giờ ---

    if (!manualScheduleData) { // If not provided manually, read from DOM
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
    }

    if (!manualShiftMappings) { // If not provided manually, read from DOM
        document.querySelectorAll('#template-builder-grid-container tbody tr').forEach(row => {
            const shiftId = row.dataset.shiftId;
            const selectedShiftCode = row.querySelector('.shift-code-selector')?.value;
            const selectedPositionId = row.querySelector('.work-position-selector')?.value;
            if (shiftId) {
                // SỬA LỖI: Đảm bảo không có giá trị `undefined` được gửi đến Firestore.
                // Nếu không có giá trị được chọn, gán một chuỗi rỗng thay vì `undefined`.
                shiftMappings[shiftId] = { shiftCode: selectedShiftCode || '', positionId: selectedPositionId || '' };
            }
        });
    }

    // --- NEW: Lấy dữ liệu manhour theo giờ từ header của bảng ---
    document.querySelectorAll('#template-builder-grid-container thead th[data-hour]').forEach(headerCell => {
        const hour = headerCell.dataset.hour; // "06", "07", ...
        // Lấy giá trị từ span chứa manhour của POS, đã được tính toán bởi `calculateHourlyStatsForTime`
        const manhourValue = parseFloat(headerCell.querySelector('.hourly-position-count')?.textContent) || 0;
        if (hour) {
            hourlyManhours[hour] = manhourValue;
        }
    });

    try {
        const templateRef = doc(db, 'daily_templates', currentTemplateId);
        await setDoc(templateRef, {
            schedule: scheduleData,
            shiftMappings: shiftMappings,
            totalManhour: totalManhour,
            hourlyManhours: hourlyManhours, // --- NEW: Thêm trường mới vào Firestore ---
            updatedAt: serverTimestamp()
        }, { merge: true });
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

    // --- LOGIC MỚI: Hiển thị lại container trạng thái khi tải mẫu có sẵn ---
    const statusContainerForLoad = document.getElementById('template-display-container');
    if (statusContainerForLoad) {
        statusContainerForLoad.classList.remove('hidden');
    }

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

        // Nếu người dùng đang ở view 're-logic', cập nhật lại view đó
        if (getCurrentView() === 're-logic') {
            await initRELogicView(templateId, allTemplates, allTaskGroups); // Đã sửa ở lần trước
        }
    } else {
        // Nếu không tải được dữ liệu, render lưới trống
        renderGrid();
    }
    updateTemplateStats();
    checkTemplateChangesAndToggleResetButton();

    // --- LOGIC MỚI: Tải và hiển thị trạng thái kế hoạch cho HQ ---
    const statusContainer = document.getElementById('template-display-container');
    const statusDisplay = document.getElementById('template-name-display');

    if (currentUser && (currentUser.roleId === 'HQ_STAFF' || currentUser.roleId === 'ADMIN') && statusContainer) {
        if (templateId && templateId !== 'new') {
            // Tìm kế hoạch gần nhất được tạo từ template này
            const plansQuery = query(
                collection(db, 'monthly_plans'),
                where('templateId', '==', templateId),
                orderBy('cycleStartDate', 'desc'),
                limit(1)
            );
            const plansSnap = await getDocs(plansQuery);
           if (plansSnap.empty) {
                statusDisplay.textContent = 'Mẫu này chưa được áp dụng.';
            } else {
                const plan = { id: plansSnap.docs[0].id, ...plansSnap.docs[0].data() };
                setCurrentMonthlyPlan(plan); // Sử dụng hàm setter để cập nhật biến

                // Cập nhật dòng trạng thái chính để hiển thị thêm thông tin
                const { allPersonnel } = await import('./daily-templates-data.js');
                const regionName = allPersonnel.find(p => p.roleId === 'REGIONAL_MANAGER' && p.managedRegionId === plan.regionId)?.name || plan.regionId;
                const cycleDate = plan.cycleStartDate.toDate ? plan.cycleStartDate.toDate() : new Date(plan.cycleStartDate);
                const formattedDate = cycleDate.toLocaleDateString('vi-VN');
                const statusText = planStatusMessages[plan.status] || `Trạng thái: ${plan.status}`;
                statusDisplay.textContent = `${statusText}`;

                renderPlanTracker(plan); // Dùng hàm renderPlanTracker để hiển thị trạng thái
            }
        }
    }
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
export async function applyTemplateForHq() {
    const currentUser = window.currentUser;
    if (!currentUser) return;

    // --- LOGIC FOR RM/AM ---
    if (currentUser.roleId === 'REGIONAL_MANAGER' || currentUser.roleId === 'AREA_MANAGER') {
        if (!currentMonthlyPlan) {
            window.showToast('Không tìm thấy kế hoạch tháng hiện tại để thực hiện hành động.', 'error');
            return;
        }

        const deployButton = document.getElementById('apply-template-hq-btn');
        const buttonText = deployButton?.querySelector('span')?.textContent;

        // Logic khi RM nhấn "Triển khai" (thay đổi < 10% hoặc đã được HQ duyệt)
        if (buttonText === 'Triển khai' || buttonText === 'Sẵn sàng triển khai') {
            const confirmed = await window.showConfirmation(
                'Bạn có chắc chắn muốn triển khai kế hoạch này đến nhân viên không? Sau khi triển khai, nhân viên sẽ có thể bắt đầu đăng ký ca làm việc.',
                'Xác nhận triển khai',
                'Triển khai',
                'Hủy'
            );
            if (!confirmed) return;

            try {
                const planRef = doc(db, 'monthly_plans', currentMonthlyPlan.id);
                const newHistoryEntry = { status: 'RM_SENT_TO_STAFF', timestamp: new Date(), userId: currentUser.id, userName: currentUser.name, userRole: currentUser.roleId };
                await updateDoc(planRef, {
                    status: 'RM_SENT_TO_STAFF',
                    history: [...(currentMonthlyPlan.history || []), newHistoryEntry]
                });
                window.showToast('Đã triển khai kế hoạch thành công!', 'success');

                // --- LOGIC MỚI: Cập nhật ngay lập tức text trạng thái chính ---
                const statusDisplay = document.getElementById('template-name-display');
                if (statusDisplay) {
                    const cycleDate = currentMonthlyPlan.cycleStartDate.toDate ? currentMonthlyPlan.cycleStartDate.toDate() : new Date(currentMonthlyPlan.cycleStartDate);
                    const newStatusText = planStatusMessages['RM_SENT_TO_STAFF'] || 'RM đã gửi về Staff';
                    statusDisplay.textContent = `Kế hoạch chu kỳ ${cycleDate.toLocaleDateString('vi-VN')}. ${newStatusText}`;
                }
                // -------------------------------------------------------------

                await loadTemplate(currentMonthlyPlan.templateId); // Tải lại để cập nhật trạng thái
            } catch (error) {
                console.error("Lỗi khi triển khai kế hoạch:", error);
                window.showToast('Đã xảy ra lỗi khi triển khai kế hoạch.', 'error');
            }
        }
        return;
    }

    // --- LOGIC FOR HQ/ADMIN ---
    const { allPersonnel } = await import('./daily-templates-data.js');
    const allRegions = await fetchAllRegions(); // Lấy danh sách tất cả các miền

    const template = allTemplates.find(t => t.id === currentTemplateId);
    if (!template) {
        window.showToast('Vui lòng chọn một mẫu để áp dụng.', 'warning');
        return;
    }

    // --- FIX: Hiển thị modal chọn miền để lấy selectedRegionIds ---
    const selectedRegionIds = await window.showCheckboxListPrompt(
        'Chọn các miền để áp dụng mẫu:',
        'Áp dụng cho Miền',
        {
            headers: ['Tên Miền', 'Tên RM'],
            rows: allRegions.map(region => {
                // Tìm RM quản lý miền này
                const regionalManager = allPersonnel.find(p =>
                    p.roleId === 'REGIONAL_MANAGER' && p.managedRegionId === region.id
                );
                return {
                    value: region.id,
                    cells: [
                        region.name,
                        regionalManager ? regionalManager.name : '<span class="text-gray-400 italic">Chưa có</span>'
                    ]
                };
            })
        }
    );

    if (!selectedRegionIds || selectedRegionIds.length === 0) {
        window.showToast('Đã hủy thao tác.', 'info');
        return;
    }

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

    const selectedRegionNames = selectedRegionIds.map(id => allRegions.find(r => r.id === id)?.name || id).join(', ');

    const confirmed = await window.showConfirmation(
            `Bạn có chắc chắn muốn gửi kế hoạch dựa trên mẫu <strong>"${template.name}"</strong> đến các miền: <strong>${selectedRegionNames}</strong> cho chu kỳ bắt đầu từ ngày <strong>${formattedStartDate}</strong> không?`,
            'Xác nhận gửi kế hoạch',
            'Gửi Kế hoạch',
            'Hủy'
        );

    if (!confirmed) {
        window.showToast('Đã hủy thao tác.', 'info');
        return;
    }

    const batch = writeBatch(db);
    // Tạo một ID duy nhất cho đợt triển khai này để nhóm các kế hoạch lại với nhau
    const deploymentBatchId = doc(collection(db, 'monthly_plans')).id;

    selectedRegionIds.forEach(regionId => {
        const newPlan = {
            regionId: regionId,
            cycleStartDate: dateString,
            templateId: template.id,
            templateName: template.name,
            userRole: currentUser.roleId,
            userId: currentUser.id,
            userName: currentUser.name,
            status: 'HQ_APPLIED',
            history: [{ status: 'HQ_APPLIED', timestamp: new Date(), userId: currentUser.id, userName: currentUser.name, userRole: currentUser.roleId }],
            comments: [],
            deploymentBatchId: deploymentBatchId // Thêm ID của đợt triển khai
        };
        const planRef = doc(collection(db, 'monthly_plans'));
        batch.set(planRef, newPlan);
    });

    await batch.commit();
    window.showToast(`Hoàn tất! Đã gửi kế hoạch từ mẫu "${template.name}" đến ${selectedRegionIds.length} miền đã chọn.`, 'success', 5000);
        
    // FIX: Tải lại thông tin của mẫu vừa áp dụng để cập nhật trạng thái
    // và render lại modal theo dõi tiến độ với dữ liệu mới nhất.
    await loadTemplate(template.id);
}

/**
 * Tải danh sách tất cả các miền (regions) từ Firestore.
 * @returns {Promise<Array>}
 */
async function fetchAllRegions() {
    try {
        const regionsSnapshot = await getDocs(collection(db, 'regions'));
        return regionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Lỗi khi tải danh sách khu vực:", error);
        window.showToast("Không thể tải danh sách khu vực.", "error");
        return [];
    }
}
/**
 * (Dành cho RM/AM) Tải kế hoạch và mẫu được áp dụng gần nhất.
 */
export async function loadAppliedPlanForManager() {
    const currentUser = window.currentUser; // Sửa lỗi: Thêm khai báo currentUser
    if (!currentUser) {
        return;
    }

    let regionIdToQuery = null;
    if (currentUser.roleId === 'REGIONAL_MANAGER') {
        regionIdToQuery = currentUser.managedRegionId;
    } else if (currentUser.roleId === 'AREA_MANAGER') {
        const areasSnap = await getDocs(query(collection(db, 'areas'), where('id', 'in', currentUser.managedAreaIds || ['dummy']), limit(1)));
        if (!areasSnap.empty) {
            regionIdToQuery = areasSnap.docs[0].data()?.regionId;
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
        orderBy('cycleStartDate', 'desc') // Bỏ limit(1) để tải tất cả các kế hoạch
    );
    
    const plansSnap = await getDocs(plansQuery);
    if (plansSnap.empty) {
        document.getElementById('template-selector-container').classList.add('hidden');
        document.getElementById('template-display-container').classList.remove('hidden');
        document.getElementById('template-display-container').querySelector('#template-name-display').textContent = 'Chưa có kế hoạch nào được áp dụng cho miền của bạn.';
        renderGrid();
    } else {
        const allPlansForRegion = plansSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Render danh sách kế hoạch vào dropdown
        await window.renderMonthlyPlansForManager(allPlansForRegion);

        // Tự động chọn và tải kế hoạch gần nhất (đầu tiên trong danh sách đã sắp xếp)
        const latestPlan = allPlansForRegion[0];
        setCurrentMonthlyPlan(latestPlan);
        document.getElementById('template-selector').value = latestPlan.id;
        await loadTemplate(latestPlan.templateId);

        // Cập nhật dòng trạng thái cho RM/AM
        const statusContainer = document.getElementById('template-display-container');
        const statusDisplay = document.getElementById('template-name-display');
        if (statusContainer && statusDisplay) {
            statusContainer.classList.remove('hidden');
            const statusText = planStatusMessages[latestPlan.status] || `Trạng thái: ${latestPlan.status}`;
            // Sửa lỗi: Kiểm tra xem cycleStartDate có phải là Timestamp không trước khi gọi toDate()
            const cycleDate = latestPlan.cycleStartDate.toDate ? latestPlan.cycleStartDate.toDate() : new Date(latestPlan.cycleStartDate);
            statusDisplay.textContent = `Kế hoạch chu kỳ ${cycleDate.toLocaleDateString('vi-VN')}. ${statusText}`;
        }

        // FIX: Gọi renderPlanTracker để cập nhật nội dung modal theo dõi tiến độ ngay khi tải trang
        await renderPlanTracker(latestPlan);
    }
}

/**
 * Cập nhật bảng thống kê group task dựa trên các task đang có trên lưới.
 */
export function updateTemplateStats() {
    const statsContentWrapper = document.getElementById('stats-content-wrapper');
    if (!statsContentWrapper) return;
    // Sửa lỗi: Chỉ đếm các task đã thực sự được render, bỏ qua các ô đang được highlight để nhân bản.
    // Điều này ngăn việc tính thừa giờ trong quá trình kéo-giãn.
    const scheduledTasks = document.querySelectorAll('#template-builder-tbody .scheduled-task-item');


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

/**
 * Tự động gán task vào bảng lịch trình dựa trên các tham số đầu vào.
 * @param {string} openTime - Thời gian mở cửa (ví dụ: "06:00").
 * @param {string} closeTime - Thời gian đóng cửa (ví dụ: "22:00").
 * @param {number} targetManHours - Tổng giờ công mong muốn.
 */
export async function handleAutoGenerate(openTime, closeTime, targetManHours) {
    // Đối tượng chứa dữ liệu lịch trình mới và ánh xạ ca làm việc
    const newScheduleData = {};
    const newShiftMappings = {};

    // Lấy thông tin mẫu hiện tại và các tham số RE
    const currentTemplate = allTemplates.find(t => t.id === currentTemplateId);
    const reParameters = currentTemplate?.reParameters || {};

    // 1. Gọi hàm generateSchedule để lấy dữ liệu lịch trình mới
    const {
        schedule: generatedSchedule,
        shiftMappings: generatedShiftMappings,
        totalManhour: generatedTotalManhour
    } = generateSchedule(openTime, closeTime, targetManHours);

    // 5. Cập nhật giao diện và lưu vào Firestore
    const updatedTemplateData = {
        ...currentTemplate, // Giữ lại các thông tin khác của template hiện tại
        schedule: generatedSchedule,
        shiftMappings: generatedShiftMappings,
        totalManhour: generatedTotalManhour, // Cập nhật tổng manhour theo giá trị nhập vào
        hourlyManhours: {} // Sẽ được tính toán lại bởi updateTemplateFromDOM từ DOM sau khi render
    };

    // Cập nhật biến global `allTemplates` để `renderGrid` và các hàm khác sử dụng dữ liệu mới nhất
    const currentTemplateIndex = allTemplates.findIndex(t => t.id === currentTemplateId);
    if (currentTemplateIndex !== -1) {
        allTemplates[currentTemplateIndex] = updatedTemplateData;
    }

    renderGrid(updatedTemplateData); // Render lại lưới với dữ liệu lịch trình mới
    updateTemplateStats(); // Cập nhật bảng thống kê group task
    updateGridHeaderStats(); // Cập nhật thống kê header của lưới
    initializeDragAndDrop(); // Khởi tạo lại chức năng kéo-thả cho các task mới

    // Lưu các thay đổi vào Firestore. Truyền trực tiếp dữ liệu đã tạo để tránh đọc lại từ DOM ngay lập tức.
    await updateTemplateFromDOM(generatedSchedule, generatedShiftMappings, generatedTotalManhour);
}