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
    // 4. Các task được bố trí không thể nằm ngoài phạm vi ca làm việc đã được gán cho mỗi dòng.
    // 5. Cố gắng phân bổ đều các task trong khung giờ hoạt động của mỗi ca.

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

    // SỬA LỖI: Khởi tạo lại biến availableShiftCodes đã bị thiếu.
    // Chuẩn bị danh sách mã ca để sử dụng lần lượt.
    const availableShiftCodes = (allShiftCodes && allShiftCodes.length > 0)
        ? allShiftCodes.map(sc => sc.shiftCode).filter(Boolean) // Lấy danh sách các mã ca hợp lệ
        : ['S1']; // Sử dụng 'S1' làm giá trị dự phòng nếu không có mã ca nào

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
                        taskCode: task.code || '', // SỬA LỖI: Đảm bảo taskCode không phải là undefined
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

    // --- LOGIC MỚI: Lập kế hoạch số ca tối thiểu để đạt targetManHours ---
    // 1. Tính tổng số slot 15 phút cần lấp đầy.
    const totalSlotsNeeded = Math.ceil(targetManHours * 4);

    // 2. Lấy thông tin về thời lượng của từng mã ca có sẵn.
    const availableShiftsWithDuration = allShiftCodes.map(sc => {
        if (!sc.timeRange) return null;
        const [startStr, endStr] = sc.timeRange.split('~').map(s => s.trim());
        const startMinutes = timeToMinutes(startStr);
        const endMinutes = timeToMinutes(endStr);
        if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) return null;
        return {
            shiftCode: sc.shiftCode,
            durationSlots: (endMinutes - startMinutes) / 15
        };
    }).filter(Boolean);

    // Fallback nếu không có ca nào được định nghĩa
    if (availableShiftsWithDuration.length === 0) {
        availableShiftsWithDuration.push({ shiftCode: 'S1', durationSlots: 32 }); // Mặc định ca 8 tiếng
    }

    // 3. Lặp và thêm từng ca cho đến khi tổng thời lượng đủ.
    const plannedShifts = [];
    let slotsAccountedFor = 0;
    let shiftNum = 0;
    const MAX_SHIFTS_DISPLAY = 10; // Giới hạn số ca tối đa để tránh vòng lặp vô tận

    while (slotsAccountedFor < totalSlotsNeeded && shiftNum < MAX_SHIFTS_DISPLAY) {
        shiftNum++;
        const shiftId = `shift-${shiftNum}`;
        // Quy tắc 1: Vị trí công việc trên cùng luôn là Leader
        const positionId = (shiftNum === 1) ? leaderWorkPositionId : defaultStaffWorkPositionId;
        // Lấy mã ca lần lượt từ danh sách có sẵn, quay vòng nếu cần.
        const shiftCodeForThisRow = availableShiftsWithDuration[(shiftNum - 1) % availableShiftsWithDuration.length].shiftCode;

        const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === shiftCodeForThisRow);
        if (!shiftInfo || !shiftInfo.timeRange) {
            console.warn(`Không tìm thấy thông tin hoặc timeRange cho mã ca: ${shiftCodeForThisRow}. Bỏ qua ca này.`);
            continue; // Bỏ qua nếu mã ca không hợp lệ
        }

        const [startStr, endStr] = shiftInfo.timeRange.split('~').map(s => s.trim());
        const shiftStartMinutes = timeToMinutes(startStr);
        const shiftEndMinutes = timeToMinutes(endStr);

        // Lưu lại kế hoạch cho ca này
        plannedShifts.push({
            shiftId,
            shiftCode: shiftCodeForThisRow,
            positionId,
            startMinutes: shiftStartMinutes,
            endMinutes: shiftEndMinutes,
            availableSlots: [] // Mảng chứa các slot 15 phút hợp lệ của riêng ca này
        });

        // Cộng dồn số slot của ca vừa thêm vào tổng
        slotsAccountedFor += (shiftEndMinutes - shiftStartMinutes) / 15;

        // Điền các slot hợp lệ vào cho ca vừa lập kế hoạch
        for (let currentMinute = shiftStartMinutes; currentMinute < shiftEndMinutes; currentMinute += 15) {
            const hour = Math.floor(currentMinute / 60);
            const minute = currentMinute % 60;
            const startTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            plannedShifts.find(p => p.shiftId === shiftId).availableSlots.push({ shiftId, startTime });
        }
        newScheduleData[shiftId] = [];
    }

    // 4. Điền các task vào các slot đã chuẩn bị
    let currentTaskIndex = 0;
    // Lặp qua từng ca đã được lập kế hoạch
    for (const shift of plannedShifts) { // Sửa lỗi: Lặp qua plannedShifts thay vì allAvailableGridSlots
        // Xáo trộn các slot trong ca này để phân bổ task ngẫu nhiên (Quy tắc 5)
        const shuffledSlotsInShift = [...shift.availableSlots].sort(() => Math.random() - 0.5);

        for (const slot of shuffledSlotsInShift) {
            if (currentTaskIndex >= taskSlotsToPlace.length) break; // Dừng nếu đã xếp hết task

            let taskToAssign = taskSlotsToPlace[currentTaskIndex];

            // Tìm task tiếp theo còn slot để xếp
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
        if (currentTaskIndex >= taskSlotsToPlace.length) break;
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