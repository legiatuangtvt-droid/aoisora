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
 * Tính toán tổng số giờ đề xuất (RE) cho một nhóm công việc.
 * @param {object} groupInfo - Thông tin của nhóm công việc (chứa danh sách các task).
 * @param {object} reParameters - Các tham số RE của cửa hàng (customerCount, posCount).
 * @returns {number} Tổng số giờ đề xuất đã được làm tròn.
 */
export function calculateREForGroup(groupInfo, reParameters) {
    let totalSuggestedHours = 0;
    const { customerCount = 0, posCount = 0 } = reParameters || {};

    if (groupInfo.tasks && Array.isArray(groupInfo.tasks)) {
        groupInfo.tasks.forEach(task => {
            let taskHours = 0;
            const reUnit = task.reUnit || 0;
            const frequencyNumber = parseFloat(task.frequencyNumber) || 1; // Lấy Frequency Number, mặc định là 1 nếu không có hoặc không hợp lệ

            // Bỏ qua việc tính toán các task POS không đủ điều kiện
            if (task.name === 'POS 2' && posCount < 2) return;
            if (task.name === 'POS 3' && posCount < 3) return;

            // Áp dụng công thức tính RE (Giờ) mới, bao gồm cả Frequency Number
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
            totalSuggestedHours += roundUpToNearest15Minutes(taskHours);
        });
    }
    return totalSuggestedHours;
}