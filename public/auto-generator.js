import { allTemplates, currentTemplateId, allWorkPositions, allShiftCodes, allTaskGroups } from './daily-templates-data.js';
import { calculateREForTask } from './re-calculator.js';
import { timeToMinutes } from './utils.js';

/**
 * auto-generator.js
 * Module chịu trách nhiệm cho logic tự động tạo lịch trình (Auto Generate).
 */

/**
 * Tự động tính toán và tạo ra một cấu trúc lịch trình mới dựa trên các tham số.
 * Hàm này chỉ trả về dữ liệu, không tương tác trực tiếp với DOM hay Firestore.
 *
 * @param {string} openTime - Thời gian mở cửa (ví dụ: "06:00").
 * @param {string} closeTime - Thời gian đóng cửa (ví dụ: "22:00").
 * @param {number} targetManHours - Tổng giờ công mong muốn.
 * @returns {object} Một đối tượng chứa { schedule, shiftMappings, totalManhour }.
 */
export function generateSchedule(openTime, closeTime, targetManHours) {
    // --- START: MOCK DATA CHO VỊ TRÍ CÔNG VIỆC VÀ CA LÀM VIỆC ---
    // (Dữ liệu này sẽ được thay thế bằng thuật toán trong tương lai)

    // Quy tắc: 5 ca V812 và 5 ca V829, mỗi nhóm có các vị trí theo thứ tự
    const positionOrder = ['Leader', 'POS', 'MMD', 'Ngành hàng', 'Aeon Cafe'];
    const shiftCodeOrder = ['V812', 'V812', 'V812', 'V812', 'V812', 'V829', 'V829', 'V829', 'V829', 'V829'];

    // --- END: MOCK DATA ---

    // QUY TẮC:
    // 1. Vị trí công việc trên cùng trong bảng lịch trình luôn là Leader.
    // 2. Phân bổ các task dựa trên RE (Recommended Effort) đã tính toán.
    // 3. Ưu tiên các task có RE cao hơn hoặc các task quan trọng (theo priority của group).
    // 4. Các task được bố trí không thể nằm ngoài phạm vi ca làm việc đã được gán cho mỗi dòng.
    // 5. Cố gắng phân bổ đều các task trong khung giờ hoạt động của mỗi ca.

    const newScheduleData = {};
    const newShiftMappings = {};

    // Lấy thông tin mẫu hiện tại và các tham số RE
    const currentTemplate = allTemplates.find(t => t.id === currentTemplateId);
    const reParameters = currentTemplate?.reParameters || {};

    // Tìm ID của vị trí công việc 'Leader' và một vị trí 'Staff' mặc định
    const leaderWorkPosition = allWorkPositions.find(pos => pos.name === 'Leader'); // SỬA: Dùng dữ liệu thật
    const leaderWorkPositionId = leaderWorkPosition ? leaderWorkPosition.id : null;
    const defaultStaffWorkPosition = allWorkPositions.find(pos => pos.name !== 'Leader'); // SỬA: Dùng dữ liệu thật
    const defaultStaffWorkPositionId = defaultStaffWorkPosition ? defaultStaffWorkPosition.id : null;

    if (!leaderWorkPositionId) {
        console.warn("Không tìm thấy vị trí công việc 'Leader'. Vui lòng cấu hình.");
        throw new Error("Không tìm thấy vị trí công việc 'Leader'.");
    }
    // if (!defaultStaffWorkPositionId) { // Tạm thời vô hiệu hóa vì logic đã thay đổi
    //     console.warn("Không tìm thấy vị trí công việc 'Staff' mặc định. Vui lòng cấu hình.");
    //     throw new Error("Không tìm thấy vị trí công việc 'Staff' mặc định.");
    // }

    // Tạo một map để tra cứu tên vị trí công việc từ ID cho hiệu quả
    const positionIdToNameMap = allWorkPositions.reduce((acc, pos) => {
        acc[pos.id] = pos.name;
        return acc;
    }, {});

    // SỬA LỖI: Khởi tạo lại biến availableShiftCodes đã bị thiếu.
    // Chuẩn bị danh sách mã ca để sử dụng lần lượt.
    const availableShiftCodes = (allShiftCodes && allShiftCodes.length > 0)
        ? allShiftCodes.map(sc => sc.shiftCode).filter(Boolean) // Lấy danh sách các mã ca hợp lệ
        : ['S1']; // Sử dụng 'S1' làm giá trị dự phòng nếu không có mã ca nào

    // Quy tắc 2: Phân bổ các task dựa trên RE đã tính toán.
    // 1. Tính toán số lượng slot (15 phút) cần thiết cho mỗi task dựa trên RE
    const taskSlotsToPlace = [];
    // CHỈNH SỬA: Chuyển đổi allTaskGroups thành mảng để sử dụng nhất quán
    const taskGroupsArray = Object.values(allTaskGroups);

    for (const groupInfo of taskGroupsArray) {
        if (groupInfo.tasks && Array.isArray(groupInfo.tasks)) {
            groupInfo.tasks.forEach(task => {
                // BỎ QUA: Các task POS đặc biệt sẽ được xử lý riêng
                if (task.name === 'POS 1' || task.name === 'POS 2' || task.name === 'POS 3') {
                    return;
                }

                const taskHours = calculateREForTask(task, groupInfo, reParameters);
                const numSlots = Math.round(taskHours * 4); // 1 slot = 0.25 giờ
                if (numSlots > 0) {
                    // SỬA ĐỔI: Tạo taskCode theo quy tắc mới: 1 + [group.order] + [task.order]
                    const groupOrder = String(groupInfo.order || '0');
                    const taskOrder = String(task.order || '0').padStart(2, '0');
                    const newTaskCode = `1${groupOrder}${taskOrder}`;
                    taskSlotsToPlace.push({
                        taskCode: newTaskCode,
                        taskName: task.name,
                        groupId: groupInfo.id, // Lấy id từ chính groupInfo
                        numSlotsRemaining: numSlots,
                        originalNumSlots: numSlots, // Giữ lại số slot gốc để sắp xếp
                        priority: groupInfo.priority || 0, // Giả định group có thể có thuộc tính priority
                        typeTask: task.typeTask // BỔ SUNG: Lưu lại typeTask để sắp xếp
                        // concurrentPerformers được lấy động bên dưới
                    });
                }
            });
        }
    }

    // Quy tắc 3: Ưu tiên bố trí task theo typeTask (Fixed > CTM > Product), sau đó là priority của group và RE.
    const typeTaskPriority = {
        'Fixed': 1,
        'CTM': 2,
        'Product': 3
    };

    taskSlotsToPlace.sort((a, b) => {
        const priorityA = typeTaskPriority[a.typeTask] || 99;
        const priorityB = typeTaskPriority[b.typeTask] || 99;
        return priorityA - priorityB || b.priority - a.priority || b.originalNumSlots - a.originalNumSlots;
    });

    // 2. Xác định khung giờ hoạt động và số lượng ca cần thiết
    const openMinutes = timeToMinutes(openTime);
    const closeMinutes = timeToMinutes(closeTime);

    // --- LOGIC MỚI: Lập kế hoạch ca làm việc dựa trên MOCK DATA ---
    const plannedShifts = [];
    for (let i = 0; i < shiftCodeOrder.length; i++) {
        const shiftId = `shift-${i + 1}`;
        const shiftCodeForThisRow = shiftCodeOrder[i];
        // Vị trí công việc được xác định theo thứ tự lặp lại cho mỗi nhóm 5 ca
        const positionName = positionOrder[i % 5];
        const position = allWorkPositions.find(p => p.name === positionName);

        if (!position) {
            console.warn(`Không tìm thấy vị trí công việc '${positionName}' trong mock data.`);
            continue;
        }

        // SỬA: Tra cứu thông tin ca làm việc từ `allShiftCodes` thay vì mock data
        const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === shiftCodeForThisRow);
        if (!shiftInfo || !shiftInfo.timeRange) {
            console.warn(`Không tìm thấy thông tin hoặc timeRange cho mã ca: ${shiftCodeForThisRow}. Bỏ qua ca này.`);
            continue;
        }

        const [startStr, endStr] = shiftInfo.timeRange.split('~').map(s => s.trim());
        const shiftStartMinutes = timeToMinutes(startStr);
        const shiftEndMinutes = timeToMinutes(endStr);

        plannedShifts.push({
            shiftId,
            shiftCode: shiftCodeForThisRow,
            positionId: position.id,
            startMinutes: shiftStartMinutes,
            endMinutes: shiftEndMinutes,
            availableSlots: []
        });

        for (let currentMinute = shiftStartMinutes; currentMinute < shiftEndMinutes; currentMinute += 15) {
            const hour = Math.floor(currentMinute / 60);
            const minute = currentMinute % 60;
            const startTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            plannedShifts.find(p => p.shiftId === shiftId).availableSlots.push({ shiftId, startTime });
        }
        newScheduleData[shiftId] = [];
    }
    // --- KẾT THÚC LOGIC MỚI ---

    // --- LOGIC MỚI: BỐ TRÍ CÁC TASK POS 1, 2, 3 DỰA TRÊN NHU CẦU MANHOUR (ƯU TIÊN ĐẦU TIÊN) ---
    const posGroup = taskGroupsArray.find(g => g.code === 'POS');
    if (posGroup) {
        const posTasksInfo = {
            'POS 1': posGroup.tasks.find(t => t.name === 'POS 1'),
            'POS 2': posGroup.tasks.find(t => t.name === 'POS 2'),
            'POS 3': posGroup.tasks.find(t => t.name === 'POS 3')
        };

        // Tạo taskCode cho các task POS
        if (posTasksInfo['POS 1']) posTasksInfo['POS 1'].taskCode = `1${posGroup.order}${String(posTasksInfo['POS 1'].order).padStart(2, '0')}`;
        if (posTasksInfo['POS 2']) posTasksInfo['POS 2'].taskCode = `1${posGroup.order}${String(posTasksInfo['POS 2'].order).padStart(2, '0')}`;
        if (posTasksInfo['POS 3']) posTasksInfo['POS 3'].taskCode = `1${posGroup.order}${String(posTasksInfo['POS 3'].order).padStart(2, '0')}`;

        // Lặp qua từng giờ hoạt động của cửa hàng
        for (let hour = openMinutes / 60; hour < closeMinutes / 60; hour++) {
            // --- LOGIC MỚI: GIAI ĐOẠN 1A - BỐ TRÍ POS 1 (BẮT BUỘC) ---
            const pos1Task = posTasksInfo['POS 1'];
            if (pos1Task && pos1Task.startTime && pos1Task.endTime) {
                const pos1StartMinutes = timeToMinutes(pos1Task.startTime);
                const pos1EndMinutes = timeToMinutes(pos1Task.endTime);

                for (let minute = pos1StartMinutes; minute < pos1EndMinutes; minute += 15) {
                    const h = Math.floor(minute / 60);
                    const m = minute % 60;
                    const startTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

                    // --- FIX: KIỂM TRA concurrentPerformers CHO POS 1 ---
                    // Đếm xem đã có bao nhiêu task POS 1 được xếp vào thời điểm này trên TẤT CẢ các ca.
                    let existingPos1Count = 0;
                    for (const shiftId in newScheduleData) {
                        if (newScheduleData[shiftId].some(t => t.startTime === startTime && t.taskCode === pos1Task.taskCode)) {
                            existingPos1Count++;
                        }
                    }

                    // Nếu số lượng hiện tại đã đạt hoặc vượt giới hạn, bỏ qua slot này.
                    if (existingPos1Count >= (pos1Task.concurrentPerformers || 1)) {
                        continue;
                    }

                    // SỬA ĐỔI: Tìm ca làm việc theo thứ tự ưu tiên trong allowedPositions
                    let availableShift = null;
                    const prioritizedPositions = pos1Task.allowedPositions || [];

                    for (const positionName of prioritizedPositions) {
                        const foundShift = plannedShifts.find(shift => {
                            const shiftPositionName = positionIdToNameMap[shift.positionId];
                            // Điều kiện: đúng vị trí công việc, ca còn hoạt động, và slot còn trống
                            return shiftPositionName === positionName &&
                                   minute >= shift.startMinutes && minute < shift.endMinutes &&
                                   !newScheduleData[shift.shiftId].some(t => t.startTime === startTime);
                        });

                        if (foundShift) {
                            availableShift = foundShift;
                            break; // Đã tìm thấy ca phù hợp với vị trí ưu tiên, dừng tìm kiếm
                        }
                    }

                    if (availableShift) {
                        newScheduleData[availableShift.shiftId].push({
                            taskCode: pos1Task.taskCode,
                            taskName: pos1Task.name,
                            startTime: startTime,
                            groupId: posGroup.id
                        });
                    } else {
                        // Ghi log nếu không tìm thấy ca trống cho một slot bắt buộc
                        // console.warn(`Không tìm thấy ca làm việc trống để bố trí POS 1 tại ${startTime}`);
                    }
                }
            }

            // --- GIAI ĐOẠN 1B - BỐ TRÍ POS 2, 3 (NẾU CẦN) ---
            const hourKey = String(hour).padStart(2, '0');


            // 1. Tính toán man-hour POS tiêu chuẩn cho giờ này
            const hourlyCustomerCount = reParameters.customerCountByHour?.[hourKey] || 0;
            const standardPosManhour = Math.ceil((hourlyCustomerCount / 60) * 4) / 4;
            const requiredPosSlots = standardPosManhour * 4;

            if (requiredPosSlots <= 0) continue;

            // 2. Đếm số slot POS đã được phân bổ trong giờ này (từ các task POS khác nếu có)
            let actualPosSlots = 0;
            for (const shiftId in newScheduleData) {
                newScheduleData[shiftId].forEach(task => {
                    const taskHour = parseInt(task.startTime.split(':')[0], 10);
                    if (task.groupId === posGroup.id && taskHour === hour) {
                        actualPosSlots++;
                    }
                });
            }


            // 3. Tính toán số slot POS cần bổ sung
            let slotsToFill = requiredPosSlots - actualPosSlots;
            if (slotsToFill <= 0) continue;

            // 4. Lặp qua 4 quarter của giờ hiện tại để lấp đầy các slot còn thiếu
            for (let q = 0; q < 4; q++) {

                if (slotsToFill <= 0) break;

                const quarter = q * 15;
                const startTime = `${hourKey}:${String(quarter).padStart(2, '0')}`;

                // Tìm một ca làm việc có slot trống tại thời điểm này
                const availableShift = plannedShifts.find(shift => {
                    const slotMinutes = timeToMinutes(startTime);
                    const shiftPositionName = positionIdToNameMap[shift.positionId];

                    // Ca phải bao gồm thời điểm này
                    if (slotMinutes < shift.startMinutes || slotMinutes >= shift.endMinutes) {
                        return false;
                    }
                    // Slot phải còn trống và vị trí công việc phải được phép
                    // (Giả định POS2/3 có cùng allowedPositions)
                    if (!posTasksInfo['POS 2']?.allowedPositions?.includes(shiftPositionName)) return false;
                    return !newScheduleData[shift.shiftId].some(t => t.startTime === startTime);
                });

                if (availableShift) {

                    // Xác định task POS cần thêm (chỉ POS 2 hoặc 3)
                    let taskToAdd = null;
                    // Đếm lại số slot POS thực tế trong giờ này để quyết định thêm POS 2 hay 3
                    let currentPosSlotsInHour = 0;
                    for (const shiftId in newScheduleData) {
                        newScheduleData[shiftId].forEach(task => {
                            if (task.groupId === posGroup.id && parseInt(task.startTime.split(':')[0], 10) === hour) {
                                currentPosSlotsInHour++;
                            }
                        });
                    }
                    if (currentPosSlotsInHour < 8 && posTasksInfo['POS 2']) { // Nếu có dưới 2 người (8 slots) thì thêm POS 2
                        taskToAdd = posTasksInfo['POS 2'];
                    } else if (posTasksInfo['POS 3']) {
                        taskToAdd = posTasksInfo['POS 3'];
                    }

                    if (taskToAdd) {
                        newScheduleData[availableShift.shiftId].push({
                            taskCode: taskToAdd.taskCode,
                            taskName: taskToAdd.name,
                            startTime: startTime,
                            groupId: posGroup.id
                        });
                        slotsToFill--;
                    }
                }
            }
        }

    }
    // --- KẾT THÚC LOGIC POS ---

    // --- GIAI ĐOẠN 2: BỐ TRÍ CÁC TASK CHÍNH THEO THỨ TỰ ƯU TIÊN ---
    const concurrentTaskCount = {}; // { "startTime_taskCode": count }

    /**
     * Hàm phụ trợ để xếp lịch cho một danh sách task cụ thể.
     * @param {Array} tasks - Danh sách các task cần xếp.
     */
    const scheduleTaskType = (tasks) => {
        for (const shift of plannedShifts) {
            const shuffledSlots = [...shift.availableSlots].sort(() => Math.random() - 0.5);

            for (const slot of shuffledSlots) {
                // Bỏ qua slot đã được lấp đầy
                if (newScheduleData[slot.shiftId].some(t => t.startTime === slot.startTime)) {
                    continue;
                }

                // Tìm task phù hợp trong danh sách được cung cấp
                for (const taskToAssign of tasks) {
                    if (taskToAssign.numSlotsRemaining <= 0) {
                        continue;
                    }

                    const taskGroup = taskGroupsArray.find(g => g.id === taskToAssign.groupId);
                    const taskInfo = taskGroup?.tasks.find(t => t.name === taskToAssign.taskName);

                    // QUY TẮC MỚI: Kiểm tra xem vị trí công việc của ca có được phép thực hiện task này không
                    const shiftPositionName = positionIdToNameMap[shift.positionId];
                    const allowed = taskInfo?.allowedPositions;
                    // Nếu mảng allowedPositions tồn tại và không chứa vị trí công việc của ca, bỏ qua task này
                    if (Array.isArray(allowed) && allowed.length > 0 && !allowed.includes(shiftPositionName)) {
                        continue;
                    }

                    if (taskInfo && taskInfo.startTime && taskInfo.endTime) {
                        const slotMinutes = timeToMinutes(slot.startTime);
                        const taskStartMinutes = timeToMinutes(taskInfo.startTime);
                        const taskEndMinutes = timeToMinutes(taskInfo.endTime);
                        if (slotMinutes < taskStartMinutes || slotMinutes >= taskEndMinutes) {
                            continue;
                        }
                    }

                    const taskKey = `${slot.startTime}_${taskToAssign.taskCode}`;
                    const currentCount = concurrentTaskCount[taskKey] || 0;
                    const limit = taskInfo?.concurrentPerformers;

                    if (limit === 0 || limit === undefined || currentCount < limit) {
                        newScheduleData[slot.shiftId].push({
                            taskCode: taskToAssign.taskCode,
                            taskName: taskToAssign.taskName,
                            startTime: slot.startTime,
                            groupId: taskToAssign.groupId
                        });
                        taskToAssign.numSlotsRemaining--;
                        concurrentTaskCount[taskKey] = currentCount + 1;
                        break;
                    }
                }
            }
        }
    };

    // Thực hiện xếp lịch theo từng giai đoạn (dựa trên typeTask)
    scheduleTaskType(taskSlotsToPlace.filter(t => t.typeTask === 'Fixed'));
    scheduleTaskType(taskSlotsToPlace.filter(t => t.typeTask === 'CTM'));
    scheduleTaskType(taskSlotsToPlace.filter(t => t.typeTask === 'Product'));

    // --- GIAI ĐOẠN 3: LẤP ĐẦY CÁC SLOT CÒN TRỐNG ---
    const fillerTask = {
        taskCode: '99999',
        taskName: 'Hỗ trợ khu vực',
        groupId: 'OTHER' // Giả định có group 'OTHER' cho các task chung
    };

    for (const shift of plannedShifts) {
        for (const slot of shift.availableSlots) {
            const isSlotFilled = newScheduleData[shift.shiftId].some(t => t.startTime === slot.startTime);
            if (!isSlotFilled) {
                // Lấp đầy slot trống bằng task "filler"
                newScheduleData[shift.shiftId].push({
                    taskCode: fillerTask.taskCode,
                    taskName: fillerTask.taskName,
                    startTime: slot.startTime,
                    groupId: fillerTask.groupId
                });
            }
        }
    }

    // Sắp xếp lại các task trong mỗi ca theo thời gian bắt đầu để đảm bảo thứ tự
    for (const shiftId in newScheduleData) {
        newScheduleData[shiftId].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    // Cập nhật lại newShiftMappings từ các ca đã được lên kế hoạch
    plannedShifts.forEach(shift => {
        newShiftMappings[shift.shiftId] = {
            shiftCode: shift.shiftCode,
            positionId: shift.positionId
        };
    });

    return {
        schedule: newScheduleData,
        shiftMappings: newShiftMappings,
        totalManhour: targetManHours
    };
}