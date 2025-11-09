/**
 * re-calculator.js
 * Module tính toán giờ đề xuất (RE) dùng chung cho toàn bộ ứng dụng.
 */

/**
 * Làm tròn số giờ lên bội số gần nhất của 0.25 (15 phút).
 * @param {number} hours - Số giờ cần làm tròn.
 * @returns {number} Số giờ đã làm tròn.
 */
function roundUpToNearest15Minutes(hours) {
    if (typeof hours !== 'number' || isNaN(hours)) return 0;
    return Math.ceil(hours * 4) / 4;
}

/**
 * Tính toán số giờ đề xuất (RE) cho một task cụ thể (chưa làm tròn).
 * @param {object} task - Đối tượng task.
 * @param {object} groupInfo - Thông tin của nhóm chứa task đó.
 * @param {object} reParameters - Các tham số RE của cửa hàng.
 * @returns {number} Số giờ đề xuất (chưa làm tròn).
 */
export function calculateREForTask(task, groupInfo, reParameters) {
    let taskHours = 0;
    const { customerCount = 0, posCount = 0, vegetableWeight = 0, dryGoodsVolume = 0 } = reParameters || {};
    const reUnit = task.reUnit || 0;
    let frequencyNumber = parseFloat(task.frequencyNumber) || 1;

    // Áp dụng hệ số tần suất
    switch (task.frequency) {
        case 'Weekly':
            frequencyNumber /= 7;
            break;
        case 'Monthly':
            frequencyNumber /= 30;
            break;
        case 'Yearly':
            frequencyNumber /= 365;
            break;
    }

        // Áp dụng công thức tính RE (Giờ) cho từng nhóm
    switch (groupInfo.code) {
        case 'POS':
            switch (task.name) {
                case 'Chuẩn bị POS': case 'Đổi tiền lẻ': case 'EOD POS': case 'Giao ca':
                case 'Hỗ trợ POS': case 'Kết ca': case 'Mở POS': case 'Thế cơm Leader':
                case 'Thế cơm POS Staff':
                    taskHours = (reUnit * posCount * frequencyNumber) / 60;
                    break;
                case 'POS 1': case 'POS 2': case 'POS 3':
                    taskHours = (reUnit * customerCount * frequencyNumber) / 60;
                    break;
            }
            break;

        case 'PERI':
            const periTasksWithWeight = ['Lên hàng thịt cá', 'Lên hàng rau củ', 'Repack Peri', 'Cắt gọt', 'Giảm giá Perish'];
            if (periTasksWithWeight.includes(task.name)) {
                taskHours = (reUnit * vegetableWeight * frequencyNumber) / 60;
            } else {
                taskHours = (reUnit * frequencyNumber) / 60;
            }
            break;
        
        case 'DRY':
            const dryTasksWithVolume = ['Lên hàng khô', 'Kéo mặt hàng khô', 'Check tồn WH nóc kệ châm hàng', 'Kéo mặt Grocery', 'Kéo mặt NF-HBC HL-SL'];
            if (dryTasksWithVolume.includes(task.name)) {
                taskHours = (reUnit * dryGoodsVolume * frequencyNumber) / 60;
            } else {
                // Các task còn lại trong nhóm DRY dùng công thức chuẩn
                taskHours = (reUnit * frequencyNumber) / 60;
            }
            break;
        
        // Các nhóm còn lại đều được tính theo lần, không phụ thuộc vào thông số cửa hàng
        case 'MMD':
        case 'LEADER':
        case 'QC-FSH':
        case 'DELICA':
        case 'DND': // D&D
        case 'OTHER':
        default:
            taskHours = (reUnit * frequencyNumber) / 60;
            break;
    }
    return taskHours;
}

/**
 * Tính toán tổng số giờ đề xuất (RE) cho một nhóm công việc.
 * @param {object} groupInfo - Thông tin của nhóm công việc (chứa danh sách các task).
 * @param {object} reParameters - Các tham số RE của cửa hàng (customerCount, posCount).
 * @returns {number} Tổng số giờ đề xuất đã được làm tròn.
 */
export function calculateREForGroup(groupInfo, reParameters) {
    let totalSuggestedHours = 0;
    const { posCount = 0 } = reParameters || {};

    if (groupInfo.tasks && Array.isArray(groupInfo.tasks)) {
        groupInfo.tasks.forEach(task => {
            // Bỏ qua việc tính toán các task POS không đủ điều kiện
            if (task.name === 'POS 2' && posCount < 2) return;
            if (task.name === 'POS 3' && posCount < 3) return;

            // Gọi hàm tính toán tập trung cho từng task
            const taskHours = calculateREForTask(task, groupInfo, reParameters);
            totalSuggestedHours += roundUpToNearest15Minutes(taskHours);
        });
    }
    return totalSuggestedHours;
}