let domController = null;

/**
 * Render lịch tháng cho giao diện mobile.
 */
function renderMobileCalendar({ payrollCycle, availabilityData, formatDate, shiftCodes }) {
    const headerGrid = document.getElementById('mobile-calendar-header-grid');
    const bodyGrid = document.getElementById('mobile-calendar-body-grid');
    const header = document.getElementById('mobile-month-header');
    if (!headerGrid || !bodyGrid || !header) return;

    bodyGrid.innerHTML = ''; // Chỉ xóa nội dung của lưới ngày
    header.classList.add('flex', 'justify-between', 'items-center');
    header.innerHTML = `
        <span>${payrollCycle.start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        <button class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-cog"></i>
        </button>
    `;

    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    headerGrid.innerHTML = ''; // Xóa header cũ
    weekdays.forEach(day => {
        headerGrid.innerHTML += `<div class="calendar-day-header">${day}</div>`;
    });

    let firstDayOfWeek = payrollCycle.start.getDay();
    if (firstDayOfWeek === 0) firstDayOfWeek = 7;
    for (let i = 1; i < firstDayOfWeek; i++) {
        bodyGrid.innerHTML += '<div></div>';
    }

    const todayStr = formatDate(new Date());
    for (let d = new Date(payrollCycle.start); d <= payrollCycle.end; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDate(d);
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.dataset.date = dateStr;

        if (dateStr === todayStr) {
            dayCell.classList.add('today');
        }

        // --- LOGIC MỚI: Thêm tháng vào ngày đầu và cuối tháng ---
        let dayDisplay = d.getDate();
        const nextDay = new Date(d);
        nextDay.setDate(d.getDate() + 1);

        // Kiểm tra nếu là ngày đầu tiên của tháng, hoặc là ngày cuối cùng của tháng
        if (d.getDate() === 1 || nextDay.getDate() === 1) {
            dayDisplay = `${d.getDate()}/${d.getMonth() + 1}`;
        }

        const schedule = availabilityData[dateStr];
        const shiftCode = schedule?.shift || '';

        dayCell.innerHTML = `
            <span class="day-number">${dayDisplay}</span>
            <span class="shift-code-mobile">${shiftCode}</span>
        `;
        bodyGrid.appendChild(dayCell);
    }
}

/**
 * Tạo dữ liệu chấm công giả lập dựa trên lịch đã phân công.
 * Trong tương lai, hàm này sẽ được thay thế bằng logic tải dữ liệu chấm công thật.
 * @param {object} availabilityData - Dữ liệu lịch làm việc đã phân công.
 * @returns {object} Dữ liệu chấm công giả lập.
 */
function getMockAttendanceData(availabilityData) {
    // Hiện tại, chúng ta giả định nhân viên làm việc đúng theo lịch đã phân công.
    // Dữ liệu trả về có cấu trúc giống hệt availabilityData.
    return availabilityData;
}

/**
 * Tính và hiển thị tổng giờ, tổng lương ước tính.
 */
function calculateMobileTotals({ payrollCycle, shiftCodes, availabilityData, formatDate }) {
    const totalPayEl = document.getElementById('mobile-total-pay');
    if (!totalPayEl) return;

    // Sử dụng dữ liệu chấm công giả lập
    const attendanceData = getMockAttendanceData(availabilityData);
    const currentUser = window.currentUser;
    let totalHours = 0;

    for (let d = new Date(payrollCycle.start); d <= payrollCycle.end; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDate(d); // Sử dụng formatDate để đảm bảo định dạng đúng
        const attendance = attendanceData[dateStr];
        if (attendance && attendance.shift) {
            const shiftInfo = shiftCodes.find(sc => sc.shiftCode === attendance.shift);
            if (shiftInfo) {
                totalHours += shiftInfo.duration;
            }
        }
    }

    const totalPay = totalHours * (currentUser?.hourlyRate || 1000); // Sử dụng 1000 yên/giờ làm mặc định
    const formattedHours = `${Math.floor(totalHours)}:${String(Math.round((totalHours % 1) * 60)).padStart(2, '0')}`;

    totalPayEl.innerHTML = `¥${totalPay.toLocaleString('ja-JP')} <span class="text-gray-500 font-normal">(${formattedHours})</span>`;
}

/**
 * Hiển thị chú thích các mã ca.
 */
function renderShiftLegend({ shiftCodes, availabilityData, selectedDateStr }) {
    const legendBody = document.getElementById('mobile-shift-legend-body');
    if (!legendBody) return;

    let shiftsToShow = [];
    if (selectedDateStr && availabilityData[selectedDateStr]) {
        const schedule = availabilityData[selectedDateStr];
        if (schedule && schedule.shift) {
            const assignedShift = shiftCodes.find(sc => sc.shiftCode === schedule.shift);
            if (assignedShift) {
                shiftsToShow.push(assignedShift);
            }
        }
    }

    if (shiftsToShow.length === 0) {
        legendBody.innerHTML = '<div class="text-center text-gray-500 italic">Không có ca làm việc nào được phân công cho ngày này.</div>';
    } else {
        legendBody.innerHTML = shiftsToShow.map(sc => `
            <div class="font-semibold text-left">${sc.shiftCode}</div>
            <div class="text-right">${sc.timeRange}</div>
        `).join('');
    }
}

/**
 * Xử lý sự kiện khi người dùng chọn một ngày trên lịch mobile.
 */
function handleDaySelection(dateStr = null, config) {
    const grid = document.getElementById('mobile-calendar-body-grid');
    if (!grid) return;

    const targetDateStr = dateStr || config.formatDate(new Date());
    const targetCell = grid.querySelector(`.calendar-day[data-date='${targetDateStr}']`);

    const currentSelected = grid.querySelector('.selected');
    if (currentSelected) {
        currentSelected.classList.remove('selected');
    }

    if (targetCell) {
        targetCell.classList.add('selected');
        const selectedDate = new Date(targetDateStr + 'T00:00:00');
        const selectedDateDisplay = document.getElementById('mobile-selected-date');
        if (selectedDateDisplay) {
            selectedDateDisplay.textContent = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        }
    }
    // Render lại bảng chú thích ca làm việc với ngày vừa được chọn
    renderShiftLegend({ ...config, selectedDateStr: targetDateStr });
}

export function renderMobileView(config) {
    renderMobileCalendar(config);
    renderShiftLegend({ ...config, selectedDateStr: config.formatDate(new Date()) }); // Initial render with today's date
    calculateMobileTotals(config);
    handleDaySelection(null, config); // Pass full config
}

export function initMobileView(config) { // Modified to accept full config
    domController = new AbortController();
    const { signal } = domController;

    const mobileGrid = document.getElementById('mobile-calendar-body-grid');
    if (mobileGrid) {
        mobileGrid.addEventListener('click', (e) => {
            const dayCell = e.target.closest('.calendar-day');
            if (dayCell && dayCell.dataset.date) {
                handleDaySelection(dayCell.dataset.date, config);
            }
        }, { signal });
    }
}

export function cleanupMobileView() {
    if (domController) {
        domController.abort();
    }
}