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

    // Dữ liệu giả cho các ca làm việc
    const mockShiftCodes = [
        { shiftCode: 'V812', timeRange: '08:00 ~ 16:00' },
        { shiftCode: 'V829', timeRange: '14:00 ~ 22:00' }
    ];

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
                const taskHours = calculateREForTask(task, groupInfo, reParameters);
                const numSlots = Math.round(taskHours * 4); // 1 slot = 0.25 giờ
                if (numSlots > 0) {
                    taskSlotsToPlace.push({
                        taskCode: task.manual_number || task.code || '', // Ưu tiên manual_number
                        taskName: task.name,
                        groupId: groupInfo.id, // Lấy id từ chính groupInfo
                        numSlotsRemaining: numSlots,
                        originalNumSlots: numSlots, // Giữ lại số slot gốc để sắp xếp
                        priority: groupInfo.priority || 0 // Giả định group có thể có thuộc tính priority
                        // concurrentPerformers được lấy động bên dưới
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

        const shiftInfo = mockShiftCodes.find(sc => sc.shiftCode === shiftCodeForThisRow);
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
    // --- TOÀN BỘ LOGIC LẬP KẾ HOẠCH CA CŨ ĐÃ ĐƯỢC THAY THẾ BẰNG LOGIC MOCK DATA Ở TRÊN ---

    // 4. Điền các task vào các slot đã chuẩn bị
    let currentTaskIndex = 0;
    // Lặp qua từng ca đã được lập kế hoạch

    // --- LOGIC MỚI: Theo dõi số lượng task đồng thời ---
    const concurrentTaskCount = {}; // { "startTime_taskCode": count }

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
                // --- LOGIC MỚI: Kiểm tra giới hạn concurrentPerformers ---
                const taskKey = `${slot.startTime}_${taskToAssign.taskCode}`;
                const currentCount = concurrentTaskCount[taskKey] || 0;

                // Tìm thông tin chi tiết của task để lấy giá trị concurrentPerformers
                const taskGroup = taskGroupsArray.find(g => g.id === taskToAssign.groupId);
                const taskInfo = taskGroup?.tasks.find(t => (t.manual_number || t.code) === taskToAssign.taskCode);
                const limit = taskInfo?.concurrentPerformers;

                // Nếu limit là 0 (không giới hạn) hoặc số lượng hiện tại chưa đạt giới hạn
                if (limit === 0 || limit === undefined || currentCount < limit) {
                    // Gán task vào slot
                    newScheduleData[slot.shiftId].push({
                        taskCode: taskToAssign.taskCode,
                        taskName: taskToAssign.taskName,
                        startTime: slot.startTime,
                        groupId: taskToAssign.groupId
                    });
                    taskToAssign.numSlotsRemaining--;

                    // Tăng bộ đếm cho task này tại thời điểm này
                    concurrentTaskCount[taskKey] = currentCount + 1;
                }
                // Nếu đã đạt giới hạn, không làm gì cả, vòng lặp sẽ chuyển sang slot tiếp theo
                // và thử lại với cùng một task (hoặc task tiếp theo nếu task hiện tại đã hết slot).
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