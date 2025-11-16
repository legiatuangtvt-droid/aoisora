import { doc, serverTimestamp, writeBatch, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let localDb = null;
let localShiftCodes = [];
let domController = null;

/**
 * Chuyển đổi chuỗi thời gian "HH:mm" thành số phút trong ngày.
 */
function timeToMinutes(timeStr) {
    if (!timeStr || !timeStr.includes(':')) return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    return hours * 60 + minutes;
}

/**
 * Lọc các tùy chọn trong một datalist dựa trên các ca đã chọn trong cùng một ngày.
 */
function filterDatalist(datalistElement, selfShiftCode, otherShiftCode) {
    if (!datalistElement) return;
    datalistElement.innerHTML = ''; // Xóa các tùy chọn hiện có

    const otherShift = otherShiftCode ? localShiftCodes.find(sc => sc.shiftCode === otherShiftCode) : null;
    let startOther = null, endOther = null;
    if (otherShift) {
        const [startStr, endStr] = otherShift.timeRange.split('~').map(s => s.trim());
        startOther = timeToMinutes(startStr);
        endOther = timeToMinutes(endStr);
    }

    localShiftCodes.forEach(potentialShift => {
        if (potentialShift.shiftCode === selfShiftCode) {
            datalistElement.innerHTML += `<option value="${potentialShift.shiftCode}">${potentialShift.timeRange}</option>`;
            return;
        }

        if (!otherShift || !otherShiftCode) {
            datalistElement.innerHTML += `<option value="${potentialShift.shiftCode}">${potentialShift.timeRange}</option>`;
        } else {
            const [startPotentialStr, endPotentialStr] = potentialShift.timeRange.split('~').map(s => s.trim());
            const startPotential = timeToMinutes(startPotentialStr);
            const endPotential = timeToMinutes(endPotentialStr);
            const overlaps = (startPotential < endOther && endPotential > startOther);
            if (!overlaps) {
                datalistElement.innerHTML += `<option value="${potentialShift.shiftCode}">${potentialShift.timeRange}</option>`;
            }
        }
    });
}

/**
 * Tải và điền dữ liệu đã phân công vào giao diện Desktop.
 */
function loadAvailabilityForDesktopView(availabilityData) {
    const allCells = document.querySelectorAll('#availability-table-body td[data-date]');
    allCells.forEach(td => {
        const dateStr = td.dataset.date;
        const schedule = availabilityData[dateStr];

        if (schedule && schedule.shift) {
            const shiftInput = td.querySelector('.shift-input');
            const priorityBtn = td.querySelector('.priority-toggle-btn');

            if (shiftInput) {
                shiftInput.value = schedule.shift;
                shiftInput.disabled = true;
                shiftInput.classList.add('bg-gray-100', 'cursor-not-allowed');
            }
            if (priorityBtn) {
                priorityBtn.disabled = true;
            }
        }
    });
}

/**
 * Cập nhật giao diện của các nút ưu tiên.
 */
function updatePriorityUI(button, priority) {
    if (!button) return;
    const icon = button.querySelector('i');
    if (!icon) return;

    icon.classList.remove('fa-circle', 'fa-triangle-exclamation', 'text-green-500', 'text-amber-500', 'text-gray-300');

    if (priority === 1) {
        icon.classList.add('fa-circle', 'text-green-500');
        button.dataset.priority = "1";
        button.title = "Chắc chắn vào ca";
    } else if (priority === 2) {
        icon.classList.add('fa-triangle-exclamation', 'text-amber-500');
        button.dataset.priority = "2";
        button.title = "Có thể vào ca";
    } else {
        icon.classList.add('fa-circle', 'text-gray-300');
        button.dataset.priority = "1";
        button.title = "Chắc chắn vào ca";
    }
}

/**
 * Xử lý sự kiện khi người dùng thay đổi giá trị input hoặc click vào nút.
 */
function handleCellChange(event) {
    const target = event.target;

    // Xử lý khi click nút "Help"
    const helpBtnHeader = target.closest('.help-btn');
    if (helpBtnHeader) {
        const th = helpBtnHeader.closest('th[data-date]');
        if (th) {
            openHelpModal(th.dataset.date);
        }
        return; // Dừng lại sau khi xử lý nút Help
    }

    // Xử lý khi thay đổi giá trị ô nhập ca
    if (target.classList.contains('shift-input') && event.type === 'change') {
        const registrationBlock = target.closest('.shift-registration-block');
        if (!registrationBlock) return;
        const priorityBtn = registrationBlock.querySelector('.priority-toggle-btn');
        
        // Kiểm tra trùng lặp khung giờ (logic này giữ nguyên)
        // ...
        
        if (target.value) {
            priorityBtn.disabled = false;
            updatePriorityUI(priorityBtn, 1); // Mặc định là priority 1 (hình tròn)
        } else {
            priorityBtn.disabled = true;
            updatePriorityUI(priorityBtn, 0); // Reset nếu không có ca
        }
        return; // Dừng lại sau khi xử lý thay đổi input
    }

    // Xử lý khi click nút ưu tiên
    const priorityBtn = target.closest('.priority-toggle-btn');
    if (priorityBtn) {
        const currentPriority = parseInt(priorityBtn.dataset.priority, 10);
        // Chuyển đổi giữa 1 (tròn) và 2 (tam giác)
        const nextPriority = currentPriority === 1 ? 2 : 1;
        updatePriorityUI(priorityBtn, nextPriority);
    }
}

/**
 * Xử lý sự kiện khi người dùng focus vào một ô input ca.
 */
function handleCellFocus(event) {
    const target = event.target;
    if (!target.classList.contains('shift-input')) return;

    const td = target.closest('td');
    if (!td) return;

    const inputsInDay = Array.from(td.querySelectorAll('.shift-input'));
    const otherInput = inputsInDay.find(inp => inp !== target);

    const targetDatalist = document.getElementById(target.getAttribute('list'));
    const otherDatalist = otherInput ? document.getElementById(otherInput.getAttribute('list')) : null;
    
    if (targetDatalist) filterDatalist(targetDatalist, target.value, otherInput ? otherInput.value : null);
    if (otherDatalist) filterDatalist(otherDatalist, otherInput.value, target.value);
}

/**
 * Gửi dữ liệu đăng ký lên Firestore.
 */
async function saveWeekAvailability() {
    const saveButton = document.getElementById('save-week-availability-btn');
    const currentUser = window.currentUser;
    if (!saveButton || !currentUser) return;

    saveButton.disabled = true;
    saveButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Đang lưu...`;

    const allCells = document.querySelectorAll('#availability-table-body td[data-date]');
    const dataByDate = {};

    allCells.forEach(td => {
        const date = td.dataset.date;
        dataByDate[date] = [];
        td.querySelectorAll('.shift-registration-block').forEach(block => {
            const shiftIndex = parseInt(block.dataset.shiftIndex, 10);
            const shiftCode = block.querySelector('.shift-input').value;
            const priorityBtn = block.querySelector('.priority-toggle-btn');
            const priority = shiftCode ? parseInt(priorityBtn.dataset.priority, 10) : 0;
            dataByDate[date][shiftIndex] = { shiftCode, priority };
        });

        const helpBtn = document.querySelector(`th[data-date="${date}"] .help-btn`);
        if (helpBtn && helpBtn.dataset.helpShiftCode) {
            dataByDate[date].helpShiftCode = helpBtn.dataset.helpShiftCode;
        }
    });

    try {
        const batch = writeBatch(localDb);
        for (const date in dataByDate) {
            const docId = `${date}_${currentUser.id}`;
            const docRef = doc(localDb, 'staff_availability', docId);
            const hasRegistration = dataByDate[date]?.some(reg => reg && reg.shiftCode);

            if (hasRegistration || dataByDate[date].helpShiftCode) {
                const dataToSet = {
                    employeeId: currentUser.id,
                    employeeName: currentUser.name,
                    date: date,
                    registrations: dataByDate[date].filter(item => typeof item === 'object'),
                    helpShiftCode: dataByDate[date].helpShiftCode || null,
                    updatedAt: serverTimestamp()
                };
                batch.set(docRef, dataToSet, { merge: true });
            } else {
                batch.delete(docRef);
            }
        }
        await batch.commit();
        window.showToast('Đã lưu đăng ký tuần thành công!', 'success');
    } catch (error) {
        console.error("Lỗi khi lưu đăng ký:", error);
        window.showToast("Đã xảy ra lỗi khi lưu đăng ký.", "error");
    } finally {
        saveButton.disabled = false;
        saveButton.innerHTML = `<i class="fas fa-save mr-2"></i> Đăng Ký`;
    }
}

function openHelpModal(date) {
    const modal = document.getElementById('help-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => modal.classList.add('show'), 10);

    const dateObj = new Date(date + 'T00:00:00');
    document.getElementById('help-modal-title').textContent = `Đăng ký ca hỗ trợ ngày ${dateObj.toLocaleDateString('vi-VN')}`;
    document.getElementById('help-modal-date').value = date;

    // Điền các mã ca vào dropdown
    const helpShiftSelect = document.getElementById('help-shift-select');
    helpShiftSelect.innerHTML = '<option value="">-- Bỏ chọn --</option>'; // Tùy chọn để xóa đăng ký
    localShiftCodes.forEach(sc => {
        helpShiftSelect.innerHTML += `<option value="${sc.shiftCode}">${sc.shiftCode} (${sc.timeRange})</option>`;
    });

    // Chọn lại giá trị đã lưu trước đó
    const helpBtn = document.querySelector(`th[data-date="${date}"] .help-btn`);
    helpShiftSelect.value = helpBtn?.dataset.helpShiftCode || '';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.addEventListener('transitionend', () => {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }, { once: true });
    }
}

function updateHelpButtonUI(button, helpShiftCode) {
    if (!button) return;
    const hasHelpShift = !!helpShiftCode;
    button.classList.toggle('btn-success', hasHelpShift);
    button.classList.toggle('btn-secondary', !hasHelpShift);

    if (hasHelpShift) {
        const shiftInfo = localShiftCodes.find(sc => sc.shiftCode === helpShiftCode);
        button.title = shiftInfo ? `Hỗ trợ ca ${helpShiftCode} (${shiftInfo.timeRange})` : 'Đăng ký ca hỗ trợ';
        button.dataset.helpShiftCode = helpShiftCode;
    } else {
        button.title = 'Đăng ký ca hỗ trợ';
        delete button.dataset.helpShiftCode;
    }
}

function handleSaveHelpTime() {
    const date = document.getElementById('help-modal-date').value;
    const selectedShiftCode = document.getElementById('help-shift-select').value;

    const mainShiftInputs = document.querySelectorAll(`td[data-date="${date}"] .shift-input`);
    for (const input of mainShiftInputs) {
        if (input.value) {
            const shift = localShiftCodes.find(sc => sc.shiftCode === input.value);
            if (shift) {
                const [shiftStartStr, shiftEndStr] = shift.timeRange.split('~').map(s => s.trim());
                const shiftStartMinutes = timeToMinutes(shiftStartStr);
                const shiftEndMinutes = timeToMinutes(shiftEndStr);

                if (selectedShiftCode) {
                    const helpShift = localShiftCodes.find(sc => sc.shiftCode === selectedShiftCode);
                    if (helpShift) {
                        const [helpStartStr, helpEndStr] = helpShift.timeRange.split('~').map(s => s.trim());
                        const helpStartMinutes = timeToMinutes(helpStartStr);
                        const helpEndMinutes = timeToMinutes(helpEndStr);
                        if (helpStartMinutes < shiftEndMinutes && shiftStartMinutes < helpEndMinutes) {
                            window.showToast(`Lỗi: Ca hỗ trợ (${helpShift.timeRange}) bị trùng với ca làm việc chính (${shift.timeRange}).`, 'error');
                            return;
                        }
                    }
                }
            }
        }
    }

    const helpBtn = document.querySelector(`th[data-date="${date}"] .help-btn`);
    updateHelpButtonUI(helpBtn, selectedShiftCode);
    closeModal('help-modal');
    window.showToast('Đã cập nhật đăng ký ca hỗ trợ!', 'success');
}

function addEventListeners() {
    domController = new AbortController();
    const { signal } = domController;

    const tableBody = document.getElementById('availability-table-body');
    if (tableBody) {
        tableBody.addEventListener('click', handleCellChange, { signal });
        tableBody.addEventListener('change', handleCellChange, { signal });
        tableBody.addEventListener('focusin', handleCellFocus, { signal });
    }

    document.getElementById('save-week-availability-btn')?.addEventListener('click', saveWeekAvailability, { signal });
    document.getElementById('save-help-time-btn')?.addEventListener('click', handleSaveHelpTime, { signal });
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.dataset.modalId), { signal });
    });
}

export function cleanupDesktopView() {
    if (domController) {
        domController.abort();
    }
}

export function initDesktopView(config) {
    localDb = config.db;
    localShiftCodes = config.shiftCodes;
    addEventListeners();
}

export async function renderDesktopView({ payrollCycle, shiftCodes, availabilityData, formatDate }) {
    const tableBody = document.getElementById('availability-table-body');
    const currentDateDisplay = document.getElementById('current-date-display');
    if (!tableBody || !currentDateDisplay) return;

    tableBody.innerHTML = '';
    currentDateDisplay.textContent = `Chu kỳ từ ${payrollCycle.start.toLocaleDateString('vi-VN')} đến ${payrollCycle.end.toLocaleDateString('vi-VN')}`;

    const todayString = formatDate(new Date());
    const dayHeaderTemplate = document.getElementById('day-header-template');
    const shiftCellTemplate = document.getElementById('shift-cell-template');

    if (!dayHeaderTemplate || !shiftCellTemplate) return;

    const allDates = [];
    for (let d = new Date(payrollCycle.start); d <= payrollCycle.end; d.setDate(d.getDate() + 1)) {
        allDates.push(new Date(d));
    }

    for (let i = 0; i < allDates.length; i += 7) {
        const weekDates = allDates.slice(i, i + 7);
        const weekHeaderRow = document.createElement('tr');
        const registrationRow = document.createElement('tr');

        weekDates.forEach(date => {
            const dateStr = formatDate(date);
            const headerCell = dayHeaderTemplate.content.cloneNode(true);
            headerCell.querySelector('.day-name').textContent = date.toLocaleDateString('en-US', { weekday: 'short' });
            headerCell.querySelector('.date-number').textContent = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
            const th = headerCell.querySelector('th');
            th.dataset.date = dateStr;
            if (dateStr === todayString) {
                th.classList.add('bg-indigo-50', 'text-indigo-700');
            }
            weekHeaderRow.appendChild(headerCell);

            const shiftCell = shiftCellTemplate.content.cloneNode(true);
            const td = shiftCell.querySelector('td');
            td.dataset.date = dateStr;
            td.querySelectorAll('.shift-registration-block').forEach(block => {
                const input = block.querySelector('.shift-input');
                const priorityBtn = block.querySelector('.priority-toggle-btn');
                const shiftIndex = block.dataset.shiftIndex;
                input.id = `shift-input-${dateStr}-${shiftIndex}`;
                let optionsHTML = `<option value="">-- Ca ${parseInt(shiftIndex, 10) + 1} --</option>`;
                shiftCodes.forEach(sc => {
                    optionsHTML += `<option value="${sc.shiftCode}">${sc.timeRange}</option>`;
                });
                input.innerHTML = optionsHTML;
                priorityBtn.disabled = true;
                if (dateStr < todayString) {
                    block.classList.add('opacity-50', 'pointer-events-none');
                    input.disabled = true;
                    input.options[0].textContent = '-- Đã khóa --';
                }
            });
            if (dateStr < todayString) {
                td.classList.add('bg-slate-50');
            }
            registrationRow.appendChild(shiftCell);
        });

        tableBody.appendChild(weekHeaderRow);
        tableBody.appendChild(registrationRow);
    }

    loadAvailabilityForDesktopView(availabilityData);
}