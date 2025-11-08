import { db } from './firebase.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;

/**
 * Tính toán và hiển thị báo cáo điểm kinh nghiệm.
 */
async function generateReport() {
    const loadingSpinner = document.getElementById('loading-spinner');
    const reportContent = document.getElementById('report-content');

    loadingSpinner.classList.remove('hidden');
    reportContent.classList.add('hidden');

    const currentUser = window.currentUser;

    if (!currentUser || !currentUser.id) {
        reportContent.innerHTML = '<p class="text-red-500 text-center">Không thể xác định người dùng hiện tại.</p>';
        loadingSpinner.classList.add('hidden');
        reportContent.classList.remove('hidden');
        return;
    }

    try {
        // Tải tất cả các nhóm task để lấy tên
        const taskGroupsSnap = await getDocs(collection(db, 'task_groups'));
        const taskGroups = {};
        taskGroupsSnap.forEach(doc => {
            taskGroups[doc.id] = doc.data();
        });

        // --- FIX: Tối ưu hóa truy vấn ---
        // Chỉ tải các lịch làm việc có chứa ID của người dùng hiện tại trong mảng completedBy.
        const schedulesQuery = query(
            collection(db, 'schedules'),
            where('completedBy', 'array-contains', currentUser.id) // <-- Điểm có thể gây ra vấn đề
        );
        const schedulesSnap = await getDocs(schedulesQuery);

        const groupExp = {};
        let bonusExp = 0;
        let effortExp = 0;

        // Khởi tạo điểm cho tất cả các nhóm là 0
        Object.keys(taskGroups).forEach(groupId => {
            groupExp[groupId] = 0;
        });

        // Duyệt qua tất cả lịch trình để tính điểm
        schedulesSnap.forEach(doc => {
            const schedule = doc.data();
            (schedule.tasks || []).forEach(task => {
                // Chỉ tính các task đã hoàn thành bởi người dùng hiện tại
                if (task.isComplete === 1 && task.completingUserId === currentUser.id) {
                    const awardedPoints = task.awardedPoints || 0;

                    // Phân loại điểm
                    const basePoints = 5;
                    const timeBonus = 1;
                    const effortBonus = 1;

                    let pointsLeft = awardedPoints;

                    // 1. Trừ điểm nỗ lực nếu có
                    if (schedule.employeeId !== currentUser.id) {
                        effortExp += effortBonus;
                        pointsLeft -= effortBonus;
                    }

                    // 2. Trừ điểm thưởng đúng giờ nếu có
                    if (pointsLeft > basePoints) {
                        bonusExp += timeBonus;
                        pointsLeft -= timeBonus;
                    }

                    // 3. Điểm còn lại là điểm cơ bản của nhóm
                    if (task.groupId && groupExp.hasOwnProperty(task.groupId)) {
                        groupExp[task.groupId] += pointsLeft;
                    }
                }
            });
        });

        // Hiển thị kết quả
        // Lấy tổng điểm tích lũy trực tiếp từ thông tin người dùng hiện tại
        document.getElementById('total-exp').textContent = (currentUser.experiencePoints || 0).toLocaleString('vi-VN');
        document.getElementById('bonus-exp').textContent = bonusExp.toLocaleString('vi-VN');
        document.getElementById('effort-exp').textContent = effortExp.toLocaleString('vi-VN');

        const groupContainer = document.getElementById('group-exp-container');
        groupContainer.innerHTML = Object.entries(groupExp).map(([groupId, points]) => {
            const groupInfo = taskGroups[groupId];
            if (!groupInfo) return '';
            return `
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span class="font-medium text-gray-700">${groupInfo.name || groupId}</span>
                    <span class="font-bold text-gray-900 text-lg">${points.toLocaleString('vi-VN')}</span>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error("Lỗi khi tạo báo cáo:", error);
        reportContent.innerHTML = '<p class="text-red-500 text-center">Đã xảy ra lỗi khi tải dữ liệu báo cáo.</p>';
    } finally {
        loadingSpinner.classList.add('hidden');
        reportContent.classList.remove('hidden');
    }
}

export function cleanup() {
    if (domController) {
        domController.abort();
        domController = null;
    }
}

export async function init() {
    domController = new AbortController();
    await generateReport();
}