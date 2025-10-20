import { db } from './firebase.js';
import { collection, onSnapshot, query, where, getDocs, doc, setDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let activeModal = null;

// Biến toàn cục để lưu trữ dữ liệu
let allStaff = [];
let allMainTasks = {}; // Dùng object để tra cứu nhanh bằng ID
let currentScheduleData = []; // Lịch làm việc cho ngày đang chọn
let sortableInstances = [];

const timeSlots = ["6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

//#region DATA_FETCHING
/**
 * Tải tất cả dữ liệu nền cần thiết một lần.
 */
async function fetchInitialData() {
    try {
        // Tải danh sách nhân viên
        const staffSnapshot = await getDocs(collection(db, 'staff'));
        allStaff = staffSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Tải danh sách công việc chính
        const tasksSnapshot = await getDocs(collection(db, 'main_tasks'));
        allMainTasks = tasksSnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = { id: doc.id, ...doc.data() };
            return acc;
        }, {});

    } catch (error) {
        console.error("Lỗi nghiêm trọng khi tải dữ liệu nền:", error);
        showToast("Không thể tải dữ liệu nền. Vui lòng thử lại.", "error");
    }
}

/**
 * Lắng nghe thay đổi lịch làm việc cho một ngày cụ thể.
 * @param {string} dateString - Ngày cần lấy dữ liệu (YYYY-MM-DD).
 */
function listenForScheduleChanges(dateString) {
    const q = query(collection(db, 'schedules'), where("date", "==", dateString));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        currentScheduleData = snapshot.docs.map(doc => {
            const data = doc.data();
            const staffInfo = allStaff.find(s => s.id === data.staffId) || { name: data.staffId, role: 'N/A' };
            return {
                docId: doc.id, // Lưu ID của document để cập nhật/xóa
                ...data,
                name: staffInfo.name,
                role: staffInfo.roleId, // Sẽ cần tra cứu tên Role sau
                shift: "Ca làm việc", // Cần bổ sung thông tin ca làm
            };
        });
        renderSchedule();
    }, (error) => {
        console.error(`Lỗi khi lắng nghe lịch ngày ${dateString}:`, error);
        showToast("Mất kết nối tới dữ liệu lịch làm việc.", "error");
    });

    // Đảm bảo listener cũ được hủy khi có listener mới
    if (window.currentScheduleUnsubscribe) {
        window.currentScheduleUnsubscribe();
    }
    window.currentScheduleUnsubscribe = unsubscribe;
}
//#endregion

//#region RENDERING
const taskColorMap = {
    'Display': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
    'Restock': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
    'Check': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
    'Clean': { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300' },
    'Cafe': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
    'System': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
    'Admin': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
};

function getTaskColor(task) {
    const name = task.name || '';
    const code = task.id || '';
    if (name.includes('Display')) return taskColorMap.Display;
    if (name.includes('Restock') || name.includes('Rotate')) return taskColorMap.Restock;
    if (name.includes('Clean') || name.includes('Wash')) return taskColorMap.Clean;
    if (name.includes('Check') || name.includes('OOS') || name.includes('POP')) return taskColorMap.Check;
    if (name.includes('Serve') || name.includes('Prep') || name.includes('Coffee')) return taskColorMap.Cafe;
    if (code.startsWith('2')) return taskColorMap.Cafe;
    if (code === '1010') return taskColorMap.System;
    if (code.startsWith('0') || code.startsWith('99')) return taskColorMap.Admin;
    return taskColorMap.Check;
}

function renderSchedule() {
    const dateInput = document.getElementById('date');
    const selectedDate = dateInput.value;
    const container = document.getElementById('schedule-container');
    if (!container) return;
    container.innerHTML = '';

    // Tính toán man hours
    const manHours = {};
    timeSlots.forEach(slot => {
        let total = 0;
        currentScheduleData.forEach(employee => {
            if (employee.tasks[slot] && employee.tasks[slot].length > 0) {
                total++;
            }
        });
        manHours[slot] = { total, display: `${total} Man Hour` };
    });

    // Build Header
    const header = document.createElement('div');
    header.className = 'grid grid-cols-18 sticky top-0 bg-gray-100 z-10 border-b-2 border-gray-300'; // 2 + 16
    header.innerHTML = `
        <div class="col-span-2 p-3 text-sm font-semibold text-gray-700 border-r flex items-center justify-center">
            <div class="text-lg">${selectedDate.split('-').reverse().join('-')}</div>
        </div>
        <div class="col-span-16 grid grid-cols-16">
            ${timeSlots.map(slot => `
                <div class="text-center p-0 border-l">
                    <div class="man-hour-header">${manHours[slot].display}</div>
                    <div class="time-slot-header">${slot}</div>
                </div>
            `).join('')}
        </div>
    `;
    container.appendChild(header);

    // Build Body Rows
    if (currentScheduleData.length === 0) {
        container.innerHTML += `<div class="p-10 text-center text-gray-500 col-span-full">Không có lịch làm việc cho ngày ${selectedDate}.</div>`;
    } else {
        currentScheduleData.forEach(employee => {
            const employeeRow = document.createElement('div');
            employeeRow.className = 'grid grid-cols-18 border-b min-h-[120px]';
            employeeRow.dataset.docId = employee.docId; // Lưu docId để cập nhật

            // Name Cell
            let nameCellHTML = `
                <div class="col-span-2 p-3 border-r flex items-center">
                    <div class="flex-1">
                        <div class="employee-name text-gray-800 text-lg">${employee.name}</div>
                        <div class="text-sm text-gray-600">${employee.role}</div>
                        <div class="text-xs text-gray-500 mt-2 font-medium">${employee.shift}</div>
                    </div>
                    <div class="w-12 h-12 flex-shrink-0 relative">
                        <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
                            <path class="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
                            <path class="text-green-500" stroke-dasharray="80, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
                        </svg>
                        <span class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-gray-700">80%</span>
                    </div>
                </div>`;

            // Task Cells
            let tasksCellHTML = `<div class="col-span-16 grid grid-cols-16">`;
            timeSlots.forEach(slot => {
                const tasks = employee.tasks[slot] || [];
                const tasksGridId = `task-grid-${employee.staffId}-${slot}`;
                
                let tasksHtmlContent = '';
                tasks.forEach(taskCode => {
                    const task = allMainTasks[taskCode] || { id: taskCode, name: `Unknown (${taskCode})` };
                    const color = getTaskColor(task);
                    tasksHtmlContent += `
                        <div class="sub-task-card border ${color.bg} ${color.border} shadow-sm" data-task-code="${task.id}">
                            <div class="sub-task-name ${color.text}">${task.name}</div>
                            <div class="sub-task-code">${task.id}</div>
                            <button class="delete-task-btn" onclick="window.dailySchedule.deleteTask(this)">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>`;
                });

                tasksCellHTML += `
                    <div class="p-2 border-l">
                        <div class="sub-task-grid" id="${tasksGridId}">${tasksHtmlContent}</div>
                    </div>`;
            });
            tasksCellHTML += `</div>`;

            employeeRow.innerHTML = nameCellHTML + tasksCellHTML;
            container.appendChild(employeeRow);
        });
    }

    initializeDragAndDrop();
}
//#endregion

//#region INTERACTIONS
function initializeDragAndDrop() {
    sortableInstances.forEach(instance => instance.destroy());
    sortableInstances = [];

    document.querySelectorAll('.sub-task-grid').forEach(container => {
        const sortable = Sortable.create(container, {
            group: 'shared',
            animation: 150,
            dataIdAttr: 'data-task-code',
            onEnd: function (evt) {
                updateScheduleDataFromDOM();
            }
        });
        sortableInstances.push(sortable);
    });
}

async function updateScheduleDataFromDOM() {
    const scheduleRows = document.querySelectorAll('#schedule-container > .grid.grid-cols-18');
    const updates = [];

    scheduleRows.forEach(row => {
        const docId = row.dataset.docId;
        if (!docId) return;

        const newTasks = {};
        row.querySelectorAll('.sub-task-grid').forEach(grid => {
            const gridIdParts = grid.id.split('-');
            const slot = gridIdParts[gridIdParts.length - 1];
            const taskElements = grid.querySelectorAll('.sub-task-card');
            if (taskElements.length > 0) {
                newTasks[slot] = Array.from(taskElements).map(el => el.dataset.taskCode);
            }
        });
        
        const docRef = doc(db, 'schedules', docId);
        updates.push(updateDoc(docRef, { tasks: newTasks }));
    });

    try {
        await Promise.all(updates);
        showToast("Đã cập nhật lịch làm việc!", "success", 1500);
        // onSnapshot sẽ tự động render lại
    } catch (error) {
        console.error("Lỗi khi cập nhật lịch làm việc:", error);
        showToast("Lỗi khi cập nhật lịch. Dữ liệu có thể không đồng bộ.", "error");
    }
}

async function deleteTask(buttonElement) {
    const taskCard = buttonElement.closest('.sub-task-card');
    const taskName = taskCard.querySelector('.sub-task-name').textContent;

    if (confirm(`Bạn có chắc chắn muốn xóa công việc "${taskName}"?`)) {
        taskCard.remove();
        await updateScheduleDataFromDOM();
    }
}

function changeDate(delta) {
    const dateInput = document.getElementById('date');
    let currentDate = new Date(dateInput.value);
    currentDate.setDate(currentDate.getDate() + delta);
    
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
    
    // Lắng nghe dữ liệu cho ngày mới
    listenForScheduleChanges(dateInput.value);
}
//#endregion

//#region MODAL_MANAGEMENT
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    activeModal = modal;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => modal.classList.add('show'), 10);
}

function hideModal() {
    if (!activeModal) return;
    const modal = activeModal;
    modal.classList.remove('show');
    modal.addEventListener('transitionend', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        const form = modal.querySelector('form');
        if (form) form.reset();
    }, { once: true });
    activeModal = null;
}

function openScheduleModal() {
    const staffSelect = document.getElementById('schedule-staff');
    if (staffSelect) {
        staffSelect.innerHTML = '<option value="">-- Chọn Nhân Viên --</option>' + 
            allStaff.map(s => `<option value="${s.id}">${s.name} (${s.roleId || 'N/A'})</option>`).join('');
    }
    document.getElementById('schedule-date').value = document.getElementById('date').value;
    showModal('schedule-modal');
}

async function handleAddSchedule(e) {
    e.preventDefault();
    const staffId = document.getElementById('schedule-staff').value;
    const date = document.getElementById('schedule-date').value;
    // Logic thêm lịch mới vào Firestore
    showToast('Chức năng thêm lịch đang được phát triển.', 'info');
    hideModal();
}
//#endregion

export function cleanup() {
    if (domController) {
        domController.abort();
        domController = null;
    }
    if (window.currentScheduleUnsubscribe) {
        window.currentScheduleUnsubscribe();
        window.currentScheduleUnsubscribe = null;
    }
    sortableInstances.forEach(instance => instance.destroy());
    sortableInstances = [];
}

export async function init() {
    domController = new AbortController();
    const { signal } = domController;

    // Gán các hàm vào window để HTML có thể gọi
    window.dailySchedule = { changeDate, deleteTask, openScheduleModal, hideModal };

    // Hiển thị các nút điều khiển ngày trên header
    const dateControls = document.getElementById('daily-schedule-controls');
    if (dateControls) {
        dateControls.classList.remove('hidden');
        dateControls.classList.add('flex');
    }

    await fetchInitialData();

    const dateInput = document.getElementById('date');
    // Đặt ngày mặc định là ngày đầu tiên có trong dữ liệu mô phỏng
    if (dateInput && !dateInput.value) {
        dateInput.value = '2025-10-20';
    }
    listenForScheduleChanges(dateInput.value);

    dateInput.addEventListener('change', () => listenForScheduleChanges(dateInput.value), { signal });

    document.getElementById('main-add-schedule-btn')?.addEventListener('click', openScheduleModal, { signal });
    document.getElementById('sidebar-add-schedule-btn')?.addEventListener('click', openScheduleModal, { signal });
    document.getElementById('add-schedule-form')?.addEventListener('submit', handleAddSchedule, { signal });

    // Listener đóng modal
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.modal-close-btn') || e.target.id === 'schedule-modal') {
            hideModal();
        }
    }, { signal });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeModal) {
            hideModal();
        }
    }, { signal });
}