﻿import { fetchInitialData, changeWeek, setViewStartDate, allEmployees, currentScheduleData, updateTaskStatus } from './daily-schedule-logic.js';
import { renderWeekControls, createStoreFilter, showLoadingSpinner, updateTimeIndicator, triggerCompletionEffects, startAttentionAnimationInterval } from './daily-schedule-ui.js';
import { formatDate, getMonday } from './utils.js';
import { initializeCheckTaskView } from './check-task.js';

let domController = null;

/**
 * Xử lý khi người dùng click vào một task.
 * @param {Event} event
 */
async function handleTaskClick(event) {
    const taskItem = event.target.closest('.scheduled-task-item');
    if (!taskItem) return;
    const row = taskItem.closest('tr');

    // Chỉ cho phép click khi hàng đang ở chế độ edit
    if (!row || !row.classList.contains('edit-mode-active')) {
        return;
    }

    const { scheduleId, taskIndex, employeeId } = taskItem.dataset;

    // Nếu người dùng click vào task của người khác, hiển thị popup xác nhận
    if (window.currentUser?.id !== employeeId) {
        const targetEmployee = allEmployees.find(emp => emp.id === employeeId);
        const targetName = targetEmployee ? targetEmployee.name : 'người này';
        const confirmed = await window.showConfirmation(
            `Bạn có chắc chắn muốn xác nhận hoàn thành công việc này thay cho <strong>${targetName}</strong> không?`,
            'Xác nhận làm thay',
            'Xác nhận',
            'Hủy'
        );

        if (!confirmed) {
            return; // Người dùng hủy, không làm gì cả
        }
    }

    // --- LOGIC MỚI: KIỂM TRA THỜI GIAN THỰC HIỆN TASK ---
    const isTryingToComplete = !taskItem.classList.contains('task-completed');
    if (isTryingToComplete) {
        const schedule = currentScheduleData.find(s => s.id === scheduleId);
        if (!schedule) return;

        const task = schedule.tasks[parseInt(taskIndex, 10)];
        if (!task) return;

        // Tạo đối tượng Date cho thời gian bắt đầu của task
        const [year, month, day] = schedule.date.split('-').map(Number);
        const [hour, minute] = task.startTime.split(':').map(Number);
        const taskStartDateTime = new Date(year, month - 1, day, hour, minute);

        // Tạo thời gian cho phép bắt đầu (1 giờ trước lịch trình)
        const allowedStartTime = new Date(taskStartDateTime.getTime() - 60 * 60 * 1000); // 1 giờ = 60 phút * 60 giây * 1000 ms

        // So sánh với thời gian hiện tại
        if (new Date() < allowedStartTime) {
            window.showToast('Chỉ có thể xác nhận hoàn thành trước tối đa 1 giờ.', 'warning');
            return; // Dừng thực thi
        }
    }

    const isCurrentlyCompleted = taskItem.classList.contains('task-completed');
    let pointsChange = 0;
    let toastMessage = '';

    const scheduleForPoints = currentScheduleData.find(s => s.id === scheduleId);
    const taskForPoints = scheduleForPoints?.tasks[parseInt(taskIndex, 10)];

    if (isCurrentlyCompleted) {
        // Logic khi HỦY HOÀN THÀNH: Trừ lại đúng số điểm đã được cộng trước đó
        pointsChange = -(taskForPoints?.awardedPoints || 5); // Dùng điểm đã lưu, nếu không có thì mặc định là 5
    } else {
        // Logic khi HOÀN THÀNH MỚI: Tính điểm thưởng/phạt
        const basePoints = 5;
        const bonusPoints = 1;
        const effortBonus = 1; // Điểm thưởng nỗ lực khi làm thay

        const [year, month, day] = scheduleForPoints.date.split('-').map(Number);
        const [hour, minute] = taskForPoints.startTime.split(':').map(Number);
        const taskStartDateTime = new Date(year, month - 1, day, hour, minute);
        const now = new Date();

        const timeDiffMinutes = Math.abs((now.getTime() - taskStartDateTime.getTime()) / (1000 * 60));

        if (timeDiffMinutes <= 60) {
            // Hoàn thành trong vòng 1 giờ (trước hoặc sau) so với lịch trình
            pointsChange = basePoints + bonusPoints;
            toastMessage = `Đúng giờ! Bạn nhận được ${pointsChange} điểm kinh nghiệm.`;
        } else {
            // Hoàn thành ngoài khoảng 1 giờ
            pointsChange = basePoints;
            toastMessage = `Bạn nhận được ${pointsChange} điểm kinh nghiệm.`;
        }

        // Cộng điểm nỗ lực nếu hoàn thành thay người khác
        if (window.currentUser?.id !== employeeId) {
            pointsChange += effortBonus;
            toastMessage = `Bạn nhận được ${pointsChange} điểm (bao gồm +${effortBonus} điểm nỗ lực).`;
        }
    }

    // Vô hiệu hóa tạm thời để tránh click đúp
    taskItem.style.pointerEvents = 'none';

    try {
        // Lấy ID của người dùng đang thực hiện hành động
        const completingUserId = window.currentUser?.id;
        const userToUpdateId = !isCurrentlyCompleted ? completingUserId : (taskForPoints.completingUserId || completingUserId);

        // Truyền ID của người xác nhận vào hàm cập nhật
        await updateTaskStatus(scheduleId, parseInt(taskIndex, 10), completingUserId, !isCurrentlyCompleted, pointsChange);

        // Cập nhật thủ công điểm EXP ở phía client sau khi transaction thành công
        const employeeToUpdate = allEmployees.find(emp => emp.id === userToUpdateId);
        if (employeeToUpdate) {
            employeeToUpdate.experiencePoints = (employeeToUpdate.experiencePoints || 0) + pointsChange;
        }

        // Chỉ chạy hiệu ứng nếu hoàn thành task mới
        if (!isCurrentlyCompleted) {
            triggerCompletionEffects(taskItem, pointsChange);
            if (toastMessage) {
                window.showToast(toastMessage, 'success');
            }
        }
        // onSnapshot sẽ tự động cập nhật lại giao diện, không cần gọi render lại ở đây.

    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái task:", error);
        window.showToast("Không thể cập nhật công việc. Vui lòng thử lại.", "error");
    } finally {
        // Kích hoạt lại sau một khoảng trễ ngắn
        setTimeout(() => {
            taskItem.style.pointerEvents = 'auto';
        }, 500);
    }
}

export function cleanup() {
    if (domController) {
        domController.abort();
        domController = null;
    }
    if (window.currentScheduleUnsubscribe) {
        window.currentScheduleUnsubscribe();
        window.currentScheduleUnsubscribe = null;
    }
    // Dừng interval của animation
    if (window.attentionInterval) {
        clearInterval(window.attentionInterval);
        window.attentionInterval = null;
    }
}

export async function init() {
    domController = new AbortController();
    const { signal } = domController;

    // Logic mới: Kiểm tra tham số 'date' trên URL
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    let initialDate = new Date(); // Mặc định là hôm nay

    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
        const [year, month, day] = dateParam.split('-').map(Number);
        initialDate = new Date(year, month - 1, day);
    }

    showLoadingSpinner();
    await fetchInitialData();

    // Khởi tạo ngày bắt đầu của tuần là thứ 2 của tuần hiện tại
    setViewStartDate(getMonday(initialDate));
    updateTimeIndicator();

    // Render bộ điều khiển tuần
    renderWeekControls(formatDate(initialDate)); // Truyền ngày được chọn (hoặc hôm nay) để active ban đầu

    // Tự động chọn ngày hôm nay khi khởi tạo
    const todayString = formatDate(new Date());
    const todayButton = document.querySelector(`.day-selector-btn[data-date="${todayString}"]`);
    if (todayButton) {
        todayButton.classList.add('active');
    }

    // Tạo bộ lọc cửa hàng, hàm này sẽ tự động gọi listenForScheduleChanges
    createStoreFilter();

    // Gắn listener cho các nút điều khiển tuần
    document.getElementById('prev-week-btn')?.addEventListener('click', () => changeWeek(-1), { signal });
    document.getElementById('next-week-btn')?.addEventListener('click', () => changeWeek(1), { signal });

    // Gắn listener cho nút Check Task
    document.getElementById('check-task-btn')?.addEventListener('click', initializeCheckTaskView, { signal });

    // --- SỬ DỤNG EVENT DELEGATION CHO TOÀN BỘ LƯỚI ---
    const gridContainer = document.getElementById('schedule-grid-container');
    if (gridContainer) {
        // Listener cho việc click vào task
        gridContainer.addEventListener('click', (event) => {
            if (event.target.closest('.scheduled-task-item')) {
                handleTaskClick(event);
            }
        }, { signal });

        // Listener cho việc nhấp đúp để mở khóa hàng
        gridContainer.addEventListener('dblclick', (event) => {
            const cell = event.target.closest('td[data-action="toggle-edit"]');
            if (!cell) return;

            const employeeId = cell.dataset.employeeId;

            const row = cell.closest('tr');
            if (row) {
                row.classList.toggle('edit-mode-active'); // Chỉ bật/tắt chế độ edit cho hàng được nhấp đúp
            }
        }, { signal });
    }
}