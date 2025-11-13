import { allShiftCodes, allWorkPositions, allTaskGroups, allTemplates, currentTemplateId } from './daily-templates-data.js';
import { timeToMinutes } from './utils.js';
import { initializeDragAndDrop, init } from './daily-templates.js';
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

    // Đối với Manager (RM/AM), chúng ta chỉ khóa các input chọn ca và vị trí,
    // nhưng vẫn cho phép họ tương tác với các task (kéo-thả, xóa).
    // Do đó, chúng ta sẽ không thêm lớp phủ (overlay) nữa.
    // Lớp phủ sẽ chỉ được thêm trong các trường hợp khác nếu cần.
    // Hiện tại, logic khóa hoàn toàn không còn cần thiết cho RM/AM.

    gridContainer.querySelectorAll('.shift-code-selector, .work-position-selector').forEach(el => {
        el.disabled = locked;
    });

    // Chỉ ẩn nút xóa dòng ca và nút thêm dòng, cho phép nút xóa task hiển thị.
    gridContainer.querySelectorAll('.delete-shift-row-btn').forEach(el => el.style.display = locked ? 'none' : '');

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
 * Tính toán và cập nhật các chỉ số ở phần đầu của lưới (Vị trí, giờ POS)
 * mà không cần render lại toàn bộ lưới.
 */
export function updateGridHeaderStats() {
    const thead = document.querySelector('#template-builder-grid-container thead');
    if (!thead) return;

    // 1. Thu thập dữ liệu hiện tại từ DOM
    const currentSchedule = {};
    const currentShiftMappings = {};

    document.querySelectorAll('#template-builder-tbody tr[data-shift-id]').forEach(row => {
        const shiftId = row.dataset.shiftId;
        const shiftCode = row.querySelector('.shift-code-selector')?.value;
        const positionId = row.querySelector('.work-position-selector')?.value;
        if (shiftId) {
            currentShiftMappings[shiftId] = { shiftCode, positionId };
        }

        row.querySelectorAll('.scheduled-task-item').forEach(taskItem => {
            const slot = taskItem.closest('.quarter-hour-slot');
            if (!slot) return;
            if (!currentSchedule[shiftId]) {
                currentSchedule[shiftId] = [];
            }
            currentSchedule[shiftId].push({
                groupId: taskItem.dataset.groupId,
                startTime: `${slot.dataset.time.split(':')[0]}:${slot.dataset.quarter}`
            });
        });
    });

    // 2. Tính toán lại các chỉ số
    const posGroup = Object.values(allTaskGroups).find(g => g.code === 'POS');
    const posGroupId = posGroup ? posGroup.id : null;

    thead.querySelectorAll('th[data-hour]').forEach(headerCell => {
        const time = `${headerCell.dataset.hour}:00`;
        const { positionCount, posManhour } = calculateHourlyStatsForTime(time, currentShiftMappings, currentSchedule, posGroupId);

        // 3. Cập nhật DOM
        const positionCountEl = headerCell.querySelector('.hourly-position-count');
        const posManhourEl = headerCell.querySelector('.hourly-pos-manhour');

        if (positionCountEl) positionCountEl.textContent = positionCount;
        if (posManhourEl) posManhourEl.textContent = posManhour;
    });
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
        const { positionCount, posManhour } = calculateHourlyStatsForTime(time, shiftMappings, schedule);
        headerRowHtml += `
            <th class="p-2 border border-slate-200 min-w-[308px] text-center font-semibold text-slate-700" data-hour="${time.split(':')[0]}">
                <div class="flex justify-between items-center">
                    <span><i class="fas fa-users text-blue-600"> <span class="hourly-position-count">${positionCount}</span></i></span>
                    ${time}
                    <span><i class="fas fa-cash-register text-green-600"></i> <span class="hourly-pos-manhour">${posManhour}</span></span>
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

            const getStartTime = (shift) => {
                const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === shift.shiftCode);
                return shiftInfo ? timeToMinutes(shiftInfo.timeRange.split('~')[0]) : 9999;
            };

            const startTimeA = getStartTime(shiftA);
            const startTimeB = getStartTime(shiftB);

            // Quy tắc 1: Ưu tiên giờ bắt đầu
            if (startTimeA !== startTimeB) {
                return startTimeA - startTimeB;
            }

            // Quy tắc 2: Nếu giờ bắt đầu giống nhau, ưu tiên vị trí công việc
            const positionOrder = {
                'LEADER': 1,
                'POS': 2,
                'MMD': 3,
                'MERCHANDISE': 4,
                'CAFE': 5
            };

            const positionA = shiftA.positionId || '';
            const positionB = shiftB.positionId || '';

            // Gán một số lớn (99) cho các vị trí không có trong danh sách ưu tiên để chúng xếp sau cùng
            const orderA = positionOrder[positionA] || 99;
            const orderB = positionOrder[positionB] || 99;

            return orderA - orderB;
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
                                <!-- Tay nắm để kéo nhân bản task -->
                                <div class="resize-handle resize-handle-left" data-direction="left"></div>
                                <div class="resize-handle resize-handle-right" data-direction="right"></div>
                                
                                <div class="flex-grow flex flex-col justify-center"><span class="overflow-hidden text-ellipsis">${task.taskName}</span></div>
                                <span class="font-semibold mt-auto">${task.taskCode}</span>
                                <button class="delete-task-btn absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10" title="Xóa task">&times;</button>
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
            updateGridHeaderStats(); // THÊM: Cập nhật lại chỉ số header khi đổi ca
            // Tự động lưu lại thay đổi
            updateTemplateFromDOM();
        });
    });
}

/**
 * Hàm trợ giúp để tính toán chỉ số cho một giờ cụ thể.
 * @param {string} time - Giờ cần tính (ví dụ: "06:00").
 * @param {object} shiftMappings - Dữ liệu map ca làm việc.
 * @param {object} schedule - Dữ liệu lịch trình.
 * @param {string|null} [posGroupId=null] - ID của nhóm POS.
 * @returns {{positionCount: number, posManhour: string}}
 */
function calculateHourlyStatsForTime(time, shiftMappings, schedule, posGroupId = null) {
    if (!posGroupId) {
        const posGroup = Object.values(allTaskGroups).find(g => g.code === 'POS');
        posGroupId = posGroup ? posGroup.id : null;
    }

    const hourStartMinutes = timeToMinutes(time);
    const hourEndMinutes = hourStartMinutes + 60;
    let totalTasksInHour = 0;
    let posTaskCount = 0;

    // Tính toán tổng số task và số task POS trong giờ
    for (const shiftId in schedule) {
        if (schedule[shiftId]) {
            schedule[shiftId].forEach(task => {
                const taskStartMinutes = timeToMinutes(task.startTime);
                if (taskStartMinutes >= hourStartMinutes && taskStartMinutes < hourEndMinutes) {
                    totalTasksInHour++;
                    if (posGroupId && task.groupId === posGroupId) {
                        posTaskCount++;
                    }
                }
            });
        }
    }

    // Tính toán manhour cho tổng số task và task POS
    const totalManhour = (totalTasksInHour * 0.25).toFixed(2);
    const posManhour = (posTaskCount * 0.25).toFixed(2);

    // Theo yêu cầu, positionCount được tính bằng manhour (số task trong giờ x 0.25)
    return { positionCount: totalManhour, posManhour: posManhour };
}

/**
 * Hiển thị giao diện theo dõi tiến độ kế hoạch.
 * @param {object} plan - Đối tượng kế hoạch tháng.
 */
export async function renderPlanTracker(plan) { // Giữ lại async vì có các thao tác bất đồng bộ bên trong
    const container = document.getElementById('plan-tracker-modal');
    if (!container) return;

    // Tải thêm dữ liệu về các miền
    const { allPersonnel, allRegions } = await import('./daily-templates-data.js');

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
            // --- LOGIC MỚI: Lọc ra các bước RM_SENT_TO_STAFF để không hiển thị riêng lẻ ---
            // Thông tin này sẽ được tích hợp vào mục "HQ_APPLIED"
            .filter(historyEntry => historyEntry.status !== 'RM_SENT_TO_STAFF')
            .map(async (historyEntry) => {
                const stepInfo = steps.find(s => s.id === historyEntry.status);
                const label = stepInfo ? stepInfo.label : historyEntry.status;
                
                const userRole = historyEntry.userRole;
                let displayRole = '';
                if (userRole) {
                    switch (userRole) {
                        case 'HQ_STAFF':
                        case 'ADMIN':
                            displayRole = 'HQ ';
                            break;
                        case 'REGIONAL_MANAGER':
                            displayRole = 'RM ';
                            break;
                        case 'AREA_MANAGER':
                            displayRole = 'AM ';
                            break;
                        case 'STORE_LEADER_G2':
                        case 'STORE_LEADER_G3':
                        case 'STORE_INCHARGE':
                            displayRole = 'SL ';
                            break;
                        case 'STAFF':
                            displayRole = 'Staff ';
                            break;
                        default:
                            displayRole = `${userRole} `; // Fallback to raw roleId if not mapped
                    }
                }

                const timestamp = historyEntry.timestamp?.toDate().toLocaleString('vi-VN') || 'N/A';
                const iconClass = historyEntry.status.includes('REJECTED') ? 'fa-times-circle text-red-600' : 'fa-check-circle text-green-700';
                
                let additionalMessage = '';
                // LOGIC MỚI: Xử lý hiển thị chi tiết cho trạng thái HQ_APPLIED
                if (historyEntry.status === 'HQ_APPLIED' && plan.deploymentBatchId) {
                    const { db } = await import('./firebase.js');
                    const { collection, query, where, getDocs } = await import("https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js");

                    const relatedPlansQuery = query(collection(db, 'monthly_plans'), where('deploymentBatchId', '==', plan.deploymentBatchId));
                    const relatedPlansSnap = await getDocs(relatedPlansQuery);
                    const relatedPlans = relatedPlansSnap.docs.map(doc => doc.data());

                    // --- LOGIC MỚI: Kiểm tra xem tất cả RM đã triển khai chưa ---
                    const allRmsDeployed = relatedPlans.length > 0 && relatedPlans.every(p =>
                        p.history.some(h => h.status === 'RM_SENT_TO_STAFF')
                    );

                    const completionIcon = allRmsDeployed
                        ? '<i class="fas fa-check-circle text-green-700 mr-2"></i>'
                        : ''; // Không hiển thị icon nếu chưa hoàn thành

                    const rmStatusesPromises = relatedPlans.map(async (p) => {
                        const regionalManager = allPersonnel.find(person => person.roleId === 'REGIONAL_MANAGER' && person.managedRegionId === p.regionId);
                        const region = allRegions.find(r => r.id === p.regionId);
                        const regionName = region ? region.name : `Miền ${p.regionId}`;
                        const rmName = regionalManager ? regionalManager.name : 'Chưa có RM';
                        const fullRmTitle = `RM ${regionName} ${rmName}`;
                        
                        // --- LOGIC MỚI: Tìm bước RM_SENT_TO_STAFF trong lịch sử của RM ---
                        const sentToStaffStep = p.history.find(h => h.status === 'RM_SENT_TO_STAFF');

                        if (sentToStaffStep) {
                            // Nếu RM đã triển khai cho nhân viên, hiển thị thông báo "Đã triển khai"
                            const sentTimestamp = sentToStaffStep.timestamp?.toDate().toLocaleString('vi-VN') || '';
                            return `<li class="ml-6 text-green-700"><i class="fas fa-check-circle mr-2"></i><strong>${fullRmTitle}:</strong> Đã triển khai lúc ${sentTimestamp}</li>`;
                        } else if (p.history.length > 1) {
                            // Nếu có bước khác nhưng không phải là 'RM_SENT_TO_STAFF' (ví dụ: đang chờ duyệt)
                            // Lấy bước gần nhất sau bước 'HQ_APPLIED'
                            const nextStep = p.history
                                .filter(h => h.status !== 'HQ_APPLIED')
                                .sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis())[0];
                            
                            const nextStepLabel = steps.find(s => s.id === nextStep.status)?.label.replace(/^\d+\.\d*\.?\s*/, '') || nextStep.status; // Bỏ số thứ tự đầu dòng
                            const nextStepTimestamp = nextStep.timestamp?.toDate().toLocaleString('vi-VN') || '';
                            return `<li class="ml-6 text-green-700"><i class="fas fa-check-circle mr-2"></i><strong>${fullRmTitle}:</strong> Đã xử lý (${nextStepLabel} lúc ${nextStepTimestamp})</li>`;
                        } else {
                            // Nếu chưa xử lý
                            return `<li class="ml-6 text-gray-500 italic"><i class="fas fa-spinner fa-spin mr-2"></i><strong>${fullRmTitle}:</strong> Đang xử lý...</li>`;
                        }
                    });

                    const rmStatuses = (await Promise.all(rmStatusesPromises)).join('');

                    additionalMessage = `
                        <div class="mt-2 pl-6">
                            <strong class="text-sm flex items-center">${completionIcon}2. RMs triển khai tới Staffs:</strong>
                            <ul class="space-y-1 mt-1">${rmStatuses}</ul>
                        </div>
                    `;
                }

                const commentHTML = historyEntry.comment 
                    ? `<div class="text-xs text-gray-600 italic pl-6 mt-1 p-1 bg-gray-100 rounded">- ${historyEntry.comment}</div>` 
                    : '';

                return `<li class="flex items-start"><i class="fas ${iconClass} mr-2 mt-1 flex-shrink-0"></i><div><strong>${label}:</strong> Hoàn thành bởi ${displayRole}${historyEntry.userName} lúc ${timestamp}.${commentHTML}</div></li>${additionalMessage}`;
            });
        // Chờ tất cả các promise được giải quyết và sau đó mới cập nhật DOM
        Promise.all(historyHTML).then(html => {
            historyList.innerHTML = html.join('');
        });
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

// Hàm mới để logic file khác có thể biết view hiện tại là gì
export function getCurrentView() {
    return currentView;
}