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
 * @param {number} targetManHours - Giờ công mục tiêu (ngân sách).
 * @param {object} reParameters - Các tham số RE của cửa hàng.
 * @returns {object} Một đối tượng chứa { schedule, shiftMappings, finalScheduledManHours, totalRequiredRE, budgetManHours }.
 */
export function generateSchedule(openTime, closeTime, targetManHours, reParameters) {
    // --- START: MOCK DATA CHO VỊ TRÍ CÔNG VIỆC VÀ CA LÀM VIỆC ---
    const positionOrder = ['Leader', 'POS', 'MMD', 'Ngành hàng', 'Aeon Cafe'];
    const shiftCodeOrder = ['V911', 'V911', 'V911', 'V911', 'V911', 'V829', 'V829', 'V829', 'V829', 'V829'];
    // --- END: MOCK DATA ---

    const newScheduleData = {};
    const newShiftMappings = {};
    const taskGroupsArray = Object.values(allTaskGroups);

    const positionIdToNameMap = allWorkPositions.reduce((acc, pos) => {
        acc[pos.id] = pos.name;
        return acc;
    }, {});

    // 1. Tính toán số lượng slot (15 phút) cần thiết cho mỗi task dựa trên RE
    const taskSlotsToPlace = [];
    let totalRequiredRE = 0;

    for (const groupInfo of taskGroupsArray) {
        if (groupInfo.tasks && Array.isArray(groupInfo.tasks)) {
            groupInfo.tasks.forEach(task => {
                // Bỏ qua các task POS 1,2,3 và Hỗ trợ POS ở bước này, chúng sẽ được xử lý riêng
                if (task.name === 'POS 1' || task.name === 'POS 2' || task.name === 'POS 3' || task.name === 'Hỗ trợ POS') {
                    return;
                }
                const taskHours = calculateREForTask(task, groupInfo, reParameters);
                totalRequiredRE += taskHours;
                const numSlots = Math.round(taskHours * 4);
                if (numSlots > 0) {
                    const groupOrder = String(groupInfo.order || '0');
                    const taskOrder = String(task.order || '0').padStart(2, '0');
                    const newTaskCode = `1${groupOrder}${taskOrder}`;
                    taskSlotsToPlace.push({
                        ...task,
                        taskCode: newTaskCode,
                        groupPriority: groupInfo.priority || 0,
                        taskName: task.name || `Unnamed Task ${newTaskCode}`,
                        groupId: groupInfo.id,
                        numSlotsRemaining: numSlots,
                        originalNumSlots: numSlots
                    });
                }
            });
        }
    }

    // 2. Sắp xếp các task theo độ ưu tiên
    const typeTaskPriority = { 'Fixed': 1, 'CTM': 2, 'Product': 3 };
    taskSlotsToPlace.sort((a, b) => {
        const priorityA = typeTaskPriority[a.typeTask] || 99;
        const priorityB = typeTaskPriority[b.typeTask] || 99;
        return priorityA - priorityB || b.groupPriority - a.groupPriority || b.originalNumSlots - a.originalNumSlots;
    });

    // 3. Lập kế hoạch ca làm việc (dựa trên mock data)
    const plannedShifts = [];
    for (let i = 0; i < shiftCodeOrder.length; i++) {
        const shiftId = `shift-${i + 1}`;
        const shiftCodeForThisRow = shiftCodeOrder[i];
        const positionName = positionOrder[i % 5];
        const position = allWorkPositions.find(p => p.name === positionName);
        if (!position) continue;

        const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === shiftCodeForThisRow);
        if (!shiftInfo || !shiftInfo.timeRange) continue;

        const [startStr, endStr] = shiftInfo.timeRange.split('~').map(s => s.trim());
        const shiftStartMinutes = timeToMinutes(startStr);
        const shiftEndMinutes = timeToMinutes(endStr);

        const shiftData = {
            shiftId,
            shiftCode: shiftCodeForThisRow,
            positionId: position.id,
            startMinutes: shiftStartMinutes,
            endMinutes: shiftEndMinutes,
            availableSlots: []
        };

        for (let currentMinute = shiftStartMinutes; currentMinute < shiftEndMinutes; currentMinute += 15) {
            const hour = Math.floor(currentMinute / 60);
            const minute = currentMinute % 60;
            shiftData.availableSlots.push({ shiftId, startTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}` });
        }
        plannedShifts.push(shiftData);
        newScheduleData[shiftId] = [];
    }
    
    let scheduledManHours = 0;
    const flexibilityFactor = 1.10;
    const flexibleTargetManHours = targetManHours * flexibilityFactor;

    // 4. Xử lý các task có vị trí cố định (Placement Tasks)
    const placementTasks = taskSlotsToPlace.filter(t => t.shiftPlacement);
    if (placementTasks.length > 0) {
        const positionShifts = {};
        plannedShifts.forEach(shift => {
            const positionName = positionIdToNameMap[shift.positionId];
            if (!positionShifts[positionName]) positionShifts[positionName] = [];
            positionShifts[positionName].push(shift);
        });
        for (const posName in positionShifts) {
            positionShifts[posName].sort((a, b) => a.startMinutes - b.startMinutes);
        }

        const placeTaskInSlot = (shift, startTime, task) => {
            if (newScheduleData[shift.shiftId].some(t => t.startTime === startTime)) return false;
            newScheduleData[shift.shiftId].push({ taskCode: task.taskCode, taskName: task.name, startTime, groupId: task.groupId });
            task.numSlotsRemaining = 0; // Placement tasks are usually one-slot
            scheduledManHours += 0.25;
            return true;
        };

        const placementHandlers = {
            'firstOfDay': () => {
                const tasks = placementTasks.filter(t => t.shiftPlacement.type === 'firstOfDay');
                tasks.forEach(task => {
                    (task.allowedPositions || []).forEach(posName => {
                        const shiftsForPos = positionShifts[posName];
                        if (shiftsForPos && shiftsForPos.length > 0) {
                            const firstShift = shiftsForPos[0];
                            const startTime = `${String(Math.floor(firstShift.startMinutes / 60)).padStart(2, '0')}:${String(firstShift.startMinutes % 60).padStart(2, '0')}`;
                            placeTaskInSlot(firstShift, startTime, task);
                        }
                    });
                });
            },
            'lastOfDay': () => {
                const tasks = placementTasks.filter(t => t.shiftPlacement.type === 'lastOfDay');
                tasks.forEach(task => {
                    (task.allowedPositions || []).forEach(posName => {
                        const shiftsForPos = positionShifts[posName];
                        if (shiftsForPos && shiftsForPos.length > 0) {
                            const lastShift = shiftsForPos[shiftsForPos.length - 1];
                            const lastSlotMinutes = lastShift.endMinutes - 15;
                            const startTime = `${String(Math.floor(lastSlotMinutes / 60)).padStart(2, '0')}:${String(lastSlotMinutes % 60).padStart(2, '0')}`;
                            placeTaskInSlot(lastShift, startTime, task);
                        }
                    });
                });
            },
            'firstOfShift': () => {
                const tasks = placementTasks.filter(t => t.shiftPlacement.type === 'firstOfShift');
                plannedShifts.forEach(shift => {
                    const shiftPositionName = positionIdToNameMap[shift.positionId];
                    const appropriateTask = tasks.find(t => (t.allowedPositions || []).includes(shiftPositionName));
                    if (!appropriateTask) return;

                    const firstShiftOfDayForPosition = positionShifts[shiftPositionName]?.[0];
                    if (firstShiftOfDayForPosition?.shiftId === shift.shiftId) {
                        const firstSlotStartTime = `${String(Math.floor(shift.startMinutes / 60)).padStart(2, '0')}:${String(shift.startMinutes % 60).padStart(2, '0')}`;
                        if (newScheduleData[shift.shiftId].some(t => t.startTime === firstSlotStartTime)) return;
                    }

                    for (let minute = shift.startMinutes; minute < shift.endMinutes; minute += 15) {
                        const startTime = `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
                        if (placeTaskInSlot(shift, startTime, appropriateTask)) break;
                    }
                });
            },
            'lastOfShift': () => {
                plannedShifts.forEach(shift => {
                    const shiftPositionName = positionIdToNameMap[shift.positionId];
                    const appropriateTask = placementTasks.find(t =>
                        t.shiftPlacement.type === 'lastOfShift' &&
                        (t.allowedPositions || []).includes(shiftPositionName)
                    );
                    if (!appropriateTask) return;

                    const lastShiftOfDayForPosition = positionShifts[shiftPositionName]?.[positionShifts[shiftPositionName].length - 1];
                    if (lastShiftOfDayForPosition?.shiftId === shift.shiftId) {
                        const lastSlotMinutes = shift.endMinutes - 15;
                        const lastSlotStartTime = `${String(Math.floor(lastSlotMinutes / 60)).padStart(2, '0')}:${String(lastSlotMinutes % 60).padStart(2, '0')}`;
                        if (newScheduleData[shift.shiftId].some(t => t.startTime === lastSlotStartTime)) return;
                    }

                    for (let minute = shift.endMinutes - 15; minute >= shift.startMinutes; minute -= 15) {
                        const startTime = `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
                        if (placeTaskInSlot(shift, startTime, appropriateTask)) break;
                    }
                });
            }
        };

        const handlerOrder = ['firstOfDay', 'lastOfDay', 'firstOfShift', 'lastOfShift'];
        handlerOrder.forEach(handlerType => {
            const hasTaskForHandler = placementTasks.some(t => t.shiftPlacement.type === handlerType);
            if (hasTaskForHandler) {
                const handler = placementHandlers[handlerType];
                handler();
            }
        });
    }

    // 5. Bố trí các task POS (POS 1, 2, 3) theo nhu cầu khách hàng
    // Logic này có độ ưu tiên cao, chạy ngay sau các task cố định (placement tasks).
    const posGroup = taskGroupsArray.find(g => g.id === 'POS');
    if (posGroup && reParameters.customerCountByHour) {
        const posTasks = {
            'POS 1': posGroup.tasks.find(t => t.name === 'POS 1'),
            'POS 2': posGroup.tasks.find(t => t.name === 'POS 2'),
            'POS 3': posGroup.tasks.find(t => t.name === 'POS 3'),
            'Hỗ trợ POS': posGroup.tasks.find(t => t.name === 'Hỗ trợ POS') // Thêm task "Hỗ trợ POS"
        };

        // Lấy khung giờ hoạt động của cửa hàng
        const openHour = parseInt(openTime.split(':')[0], 10);
        const closeHour = parseInt(closeTime.split(':')[0], 10);

        // Duyệt qua từng giờ hoạt động để xếp lịch POS
        for (let hour = openHour; hour < closeHour; hour++) {
            const hourKey = String(hour).padStart(2, '0');
            const hourlyCustomerCount = reParameters.customerCountByHour[hourKey] || 0;

            // Quy tắc 3: Tính toán số giờ POS yêu cầu trong giờ này.
            // Công thức: (Số khách hàng mỗi giờ * 1 phút/khách) / 60 phút = số giờ công POS cần thiết.
            const requiredPosManhour = hourlyCustomerCount / 60;
            // Chuyển đổi giờ công thành số lượng slot 15 phút cần lấp đầy.
            // Ví dụ: 1.5 giờ công cần -> 6 slot 15 phút.
            let requiredPosSlots = Math.ceil(requiredPosManhour * 4);

            // Duyệt qua từng slot 15 phút trong giờ hiện tại
            for (let quarter = 0; quarter < 60; quarter += 15) {
                if (scheduledManHours >= flexibleTargetManHours) break;

                const startTime = `${hourKey}:${String(quarter).padStart(2, '0')}`;

                // Hàm trợ giúp để tìm một ca làm việc còn trống và phù hợp
                const findAndPlacePosTask = (taskName, preferredPositions) => {
                    const taskInfo = posTasks[taskName];
                    if (!taskInfo) return false;

                    // Lặp qua danh sách vị trí ưu tiên (ví dụ: ["POS", "Leader"])
                    for (const posName of preferredPositions) {
                        const availableShift = plannedShifts.find(shift => {
                        const shiftPositionName = positionIdToNameMap[shift.positionId];
                        // Chỉ tìm trong các ca có vị trí đang được ưu tiên
                        if (shiftPositionName !== posName) return false;

                        const isWithinShift = timeToMinutes(startTime) >= shift.startMinutes && timeToMinutes(startTime) < shift.endMinutes;
                        const isSlotFree = !newScheduleData[shift.shiftId].some(t => t.startTime === startTime);
                        return isWithinShift && isSlotFree;
                        });

                        if (availableShift) {
                            const taskCode = `1${posGroup.order}${String(taskInfo.order).padStart(2, '0')}`;
                            newScheduleData[availableShift.shiftId].push({ taskCode, taskName: taskInfo.name, startTime, groupId: posGroup.id });
                            scheduledManHours += 0.25;
                            requiredPosSlots--; // Giảm số slot cần lấp đầy
                            return true; // Đã tìm thấy và xếp lịch thành công
                        }
                    }
                    return false; // Không tìm thấy ca phù hợp cho vị trí ưu tiên này
                };

                // Quy tắc 2: Luôn cố gắng bố trí POS 1 cho mỗi slot thời gian.
                // Quy tắc 1 được áp dụng bên trong hàm findAndPlacePosTask thông qua mảng ["POS", "Leader"].
                if (findAndPlacePosTask('POS 1', ["POS", "Leader"])) {
                    // Nếu vẫn còn yêu cầu giờ công sau khi đã xếp POS 1, tiếp tục xếp POS 2, POS 3...
                    if (requiredPosSlots > 0) findAndPlacePosTask('POS 2', ["POS", "Leader"]);
                    if (requiredPosSlots > 0) findAndPlacePosTask('POS 3', ["POS", "Leader"]);
                    // Nếu vẫn còn thiếu, sử dụng "Hỗ trợ POS" làm phương án dự phòng
                    if (requiredPosSlots > 0) findAndPlacePosTask('Hỗ trợ POS', ["POS", "Leader", "Ngành hàng", "Aeon Cafe"]);
                }
            }
            if (scheduledManHours >= flexibleTargetManHours) break;
        }
        // Cập nhật lại tổng RE sau khi tính POS
        const posManHours = scheduledManHours - placementTasks.length * 0.25; // Giờ POS đã xếp
        totalRequiredRE += posManHours;
    }


    // 6. Bố trí các task còn lại
    const concurrentTaskCount = {};
    
    const getAllAvailableSlots = () => {
        const allSlots = [];
        plannedShifts.forEach(shift => {
            shift.availableSlots.forEach(slot => {
                allSlots.push({ ...slot, shift: shift });
            });
        });
        return allSlots.sort(() => Math.random() - 0.5);
    };

    let slotsFilledInLastPass = -1;
    while (slotsFilledInLastPass !== 0) {
        slotsFilledInLastPass = 0;
        for (const taskToAssign of taskSlotsToPlace) {
            if (taskToAssign.numSlotsRemaining <= 0 || taskToAssign.shiftPlacement) continue;
            if (scheduledManHours >= flexibleTargetManHours) break;

            const taskInfo = taskGroupsArray.find(g => g.id === taskToAssign.groupId)?.tasks.find(t => t.name === taskToAssign.taskName);
            if (!taskInfo) continue;

            // --- LOGIC MỚI: Ưu tiên theo thứ tự trong allowedPositions ---
            const preferredPositions = taskInfo.allowedPositions && taskInfo.allowedPositions.length > 0 
                ? taskInfo.allowedPositions 
                : allWorkPositions.map(p => p.name); // Nếu không có, xét tất cả các vị trí

            for (const positionName of preferredPositions) {
                if (taskToAssign.numSlotsRemaining <= 0 || scheduledManHours >= flexibleTargetManHours) break;

                // Lấy tất cả các slot trống thuộc về vị trí đang xét và xáo trộn chúng
                const slotsForPosition = getAllAvailableSlots().filter(slot => positionIdToNameMap[slot.shift.positionId] === positionName);

                for (const slot of slotsForPosition) {
                    if (taskToAssign.numSlotsRemaining <= 0 || scheduledManHours >= flexibleTargetManHours) break;

                    // Bỏ qua slot đã có task
                    if (newScheduleData[slot.shift.shiftId].some(t => t.startTime === slot.startTime)) continue;

                    // Kiểm tra khung giờ cho phép của task
                    const slotMinutes = timeToMinutes(slot.startTime);
                    const slotEndMinutes = slotMinutes + 15;
                    const isSlotInValidTimeWindow = !taskInfo.timeWindows || taskInfo.timeWindows.length === 0 || taskInfo.timeWindows.some(window => {
                        const windowStartMinutes = timeToMinutes(window.startTime);
                        const windowEndMinutes = timeToMinutes(window.endTime);
                        return !(slotEndMinutes <= windowStartMinutes || slotMinutes >= windowEndMinutes);
                    });

                    if (isSlotInValidTimeWindow) {
                        const taskKey = `${slot.startTime}_${taskToAssign.taskCode}`;
                        const currentCount = concurrentTaskCount[taskKey] || 0;
                        const limit = taskInfo.concurrentPerformers;

                        if (limit === 0 || limit === undefined || currentCount < limit) {
                            newScheduleData[slot.shift.shiftId].push({ taskCode: taskToAssign.taskCode, taskName: taskToAssign.taskName, startTime: slot.startTime, groupId: taskToAssign.groupId });
                            taskToAssign.numSlotsRemaining--;
                            concurrentTaskCount[taskKey] = currentCount + 1;
                            scheduledManHours += 0.25;
                            slotsFilledInLastPass++;
                        }
                    }
                }
            }
        }
    }

    // 7. Sắp xếp và trả về kết quả (đổi thành 7)
    for (const shiftId in newScheduleData) {
        newScheduleData[shiftId].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    plannedShifts.forEach(shift => {
        newShiftMappings[shift.shiftId] = {
            shiftCode: shift.shiftCode,
            positionId: shift.positionId
        };
    });

    return {
        schedule: newScheduleData,
        shiftMappings: newShiftMappings,
        finalScheduledManHours: scheduledManHours,
        totalRequiredRE: totalRequiredRE,
        budgetManHours: targetManHours
    };
}
