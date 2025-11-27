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
    // QUY TẮC:
    // 1. Vị trí công việc trên cùng trong bảng lịch trình luôn là Leader.
    // 2. Phân bổ các task dựa trên RE (Recommended Effort) đã tính toán.
    // 3. Ưu tiên các task có RE cao hơn hoặc các task quan trọng (theo priority của group).
    // 4. Cố gắng phân bổ đều các task trong khung giờ hoạt động.

    const newScheduleData = {};
    const newShiftMappings = {};

    // Lấy thông tin mẫu hiện tại và các tham số RE
    const currentTemplate = allTemplates.find(t => t.id === currentTemplateId);
    const reParameters = currentTemplate?.reParameters || {};

    // Tìm ID của vị trí công việc 'Leader' và một vị trí 'Staff' mặc định
    const leaderWorkPosition = allWorkPositions.find(pos => pos.name === 'Leader');
    const leaderWorkPositionId = leaderWorkPosition ? leaderWorkPosition.id : null;
    const defaultStaffWorkPosition = allWorkPositions.find(pos => pos.name !== 'Leader');
    const defaultStaffWorkPositionId = defaultStaffWorkPosition ? defaultStaffWorkPosition.id : null;

    if (!leaderWorkPositionId) {
        console.warn("Không tìm thấy vị trí công việc 'Leader'. Vui lòng cấu hình.");
        throw new Error("Không tìm thấy vị trí công việc 'Leader'.");
    }
    if (!defaultStaffWorkPositionId) {
        console.warn("Không tìm thấy vị trí công việc 'Staff' mặc định. Vui lòng cấu hình.");
        throw new Error("Không tìm thấy vị trí công việc 'Staff' mặc định.");
    }

    // Sử dụng mã ca đầu tiên có sẵn hoặc một mã mặc định
    const defaultShiftCode = allShiftCodes.length > 0 ? allShiftCodes[0].code : 'S1';

    // Quy tắc 2: Phân bổ các task dựa trên RE đã tính toán.
    // 1. Tính toán số lượng slot (15 phút) cần thiết cho mỗi task dựa trên RE
    const taskSlotsToPlace = [];
    for (const groupId in allTaskGroups) {
        const groupInfo = allTaskGroups[groupId];
        if (groupInfo.tasks && Array.isArray(groupInfo.tasks)) {
            groupInfo.tasks.forEach(task => {
                const taskHours = calculateREForTask(task, groupInfo, reParameters);
                const numSlots = Math.round(taskHours * 4); // 1 slot = 0.25 giờ
                if (numSlots > 0) {
                    taskSlotsToPlace.push({
                        taskCode: task.code,
                        taskName: task.name,
                        groupId: groupId,
                        numSlotsRemaining: numSlots,
                        originalNumSlots: numSlots, // Giữ lại số slot gốc để sắp xếp
                        priority: groupInfo.priority || 0 // Giả định group có thể có thuộc tính priority
                    });
                }
            });
        }
    }

    // Quy tắc 3: Ưu tiên các task có RE cao hơn hoặc các task quan trọng (theo priority của group).
    taskSlotsToPlace.sort((a, b) => b.priority - a.priority || b.originalNumSlots - a.originalNumSlots);

    // 2. Xác định khung giờ hoạt động và số lượng ca cần thiết
    const openMinutes = timeToMinutes(openTime);
    const closeMinutes = timeToMinutes(closeTime);

    // Ước tính số ca cần thiết dựa trên tổng giờ công mong muốn.
    const SLOTS_PER_STANDARD_SHIFT = 32; // 8 tiếng * 4 slots/tiếng
    let numShiftsNeeded = Math.ceil((targetManHours * 4) / SLOTS_PER_STANDARD_SHIFT);
    if (numShiftsNeeded === 0) numShiftsNeeded = 1;

    const MAX_SHIFTS_DISPLAY = 6;
    numShiftsNeeded = Math.min(numShiftsNeeded, MAX_SHIFTS_DISPLAY);

    // 3. Chuẩn bị tất cả các slot thời gian có thể điền và ánh xạ ca làm việc
    const allAvailableGridSlots = [];
    for (let shiftNum = 1; shiftNum <= numShiftsNeeded; shiftNum++) {
        const shiftId = `shift-${shiftNum}`;
        // Quy tắc 1: Vị trí công việc trên cùng luôn là Leader
        const positionId = (shiftNum === 1) ? leaderWorkPositionId : defaultStaffWorkPositionId;
        newShiftMappings[shiftId] = { shiftCode: defaultShiftCode, positionId: positionId };
        newScheduleData[shiftId] = [];

        for (let currentMinute = openMinutes; currentMinute < closeMinutes; currentMinute += 15) {
            const hour = Math.floor(currentMinute / 60);
            const minute = currentMinute % 60;
            const startTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            allAvailableGridSlots.push({ shiftId, startTime });
        }
    }

    // Quy tắc 4: Cố gắng phân bổ đều các task trong khung giờ hoạt động.
    for (let i = allAvailableGridSlots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allAvailableGridSlots[i], allAvailableGridSlots[j]] = [allAvailableGridSlots[j], allAvailableGridSlots[i]];
    }

    // 4. Điền các task vào các slot đã chuẩn bị
    let currentTaskIndex = 0;
    for (const slot of allAvailableGridSlots) {
        if (currentTaskIndex >= taskSlotsToPlace.length) break;

        let taskToAssign = taskSlotsToPlace[currentTaskIndex];

        while (taskToAssign && taskToAssign.numSlotsRemaining <= 0) {
            currentTaskIndex++;
            taskToAssign = taskSlotsToPlace[currentTaskIndex];
        }

        if (taskToAssign) {
            newScheduleData[slot.shiftId].push({
                taskCode: taskToAssign.taskCode,
                taskName: taskToAssign.taskName,
                startTime: slot.startTime,
                groupId: taskToAssign.groupId
            });
            taskToAssign.numSlotsRemaining--;
        }
    }

    return {
        schedule: newScheduleData,
        shiftMappings: newShiftMappings,
        totalManhour: targetManHours
    };
}