import { db } from './firebase.js';
import { collection, onSnapshot, query, where, getDocs, doc, setDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let activeModal = null;

// Biến toàn cục để lưu trữ dữ liệu
let allEmployees = [];
let allStores = [];
let allAreas = [];
let allRegions = []; // Dùng object để tra cứu nhanh bằng ID
let allMainTasks = {};
let currentScheduleData = []; // Lịch làm việc cho ngày đang chọn
let sortableInstances = [];

const timeSlots = ["6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

//#region DATA_FETCHING
/**
 * Tải tất cả dữ liệu nền cần thiết một lần.
 */
async function fetchInitialData() {
    try {
        const [employeesSnap, storesSnap, areasSnap, regionsSnap] = await Promise.all([
            getDocs(collection(db, 'employee')),
            getDocs(collection(db, 'stores')),
            getDocs(collection(db, 'areas')),
            getDocs(collection(db, 'regions')),
        ]);

        let fetchedEmployees = employeesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allStores = storesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allAreas = areasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allRegions = regionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Lọc nhân viên dựa trên vai trò của người dùng hiện tại
        const currentUser = window.currentUser;
        if (currentUser) {
            switch (currentUser.roleId) {
                case 'STAFF':
                    fetchedEmployees = fetchedEmployees.filter(emp => emp.id === currentUser.id);
                    break;
                case 'STORE_LEADER':
                    fetchedEmployees = fetchedEmployees.filter(emp => emp.storeId === currentUser.storeId);
                    break;
                case 'AREA_MANAGER':
                    if (currentUser.managedAreaIds && currentUser.managedAreaIds.length > 0) {
                        const managedStoreIds = allStores.filter(s => currentUser.managedAreaIds.includes(s.areaId)).map(s => s.id);
                        fetchedEmployees = fetchedEmployees.filter(emp => managedStoreIds.includes(emp.storeId));
                    }
                    break;
                case 'REGIONAL_MANAGER':
                    if (currentUser.managedRegionId) {
                        const managedAreaIds = allAreas.filter(a => a.regionId === currentUser.managedRegionId).map(a => a.id);
                        const managedStoreIds = allStores.filter(s => managedAreaIds.includes(s.areaId)).map(s => s.id);
                        fetchedEmployees = fetchedEmployees.filter(emp => managedStoreIds.includes(emp.storeId));
                    }
                    break;
            }
        }
        allEmployees = fetchedEmployees;

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
    const employeeIds = allEmployees.map(emp => emp.id);
    if (employeeIds.length === 0) {
        currentScheduleData = [];
        renderSchedule();
        return;
    }
    const q = query(collection(db, 'schedules'), where("date", "==", dateString), where("employeeId", "in", employeeIds));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        currentScheduleData = snapshot.docs.map(doc => {
            const data = doc.data();
            const employeeInfo = allEmployees.find(s => s.id === data.employeeId) || { name: data.employeeId, role: 'N/A' };
            return {
                docId: doc.id,
                ...data,
                name: employeeInfo.name,
                role: employeeInfo.roleId,
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
/**
 * Bảng màu cho các nhóm công việc.
 * Mỗi nhóm được gán một bộ màu nền, chữ và viền.
 */
const groupColorPalette = {
    'TBTS': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' }, // Trưng Bày Tươi Sống
    'TBHK': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },   // Trưng Bày Hàng Khô
    'MKTG': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' }, // Marketing & Giá
    'QLTK': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' }, // Quản Lý Tồn Kho
    'VS':   { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },     // Vệ Sinh
    'CAFE': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' }, // Cafe
    'DEFAULT': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' } // Mặc định
};

/**
 * Lấy bộ màu cho một công việc dựa trên groupId của nó.
 * @param {string} groupId - ID của nhóm công việc.
 * @returns {object} - Object chứa các class màu {bg, text, border}.
 */
function getGroupColor(groupId) {
    return groupColorPalette[groupId] || groupColorPalette['DEFAULT'];
}

/**
 * Tính toán vị trí và chiều rộng của một task trên timeline 15 giờ (900 phút).
 * @param {string} startTime - Thời gian bắt đầu (HH:mm).
 * @param {number} duration - Thời lượng (phút).
 * @returns {{left: string, width: string}} - Vị trí và chiều rộng dưới dạng phần trăm.
 */
function calculateTaskPosition(startTime, duration) {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const totalTimelineMinutes = (21 - 6) * 60; // 15 giờ * 60 phút = 900 phút

    // Tính số phút từ lúc bắt đầu timeline (6:00)
    const minutesFromStart = (startHour - 6) * 60 + startMinute;

    // Tính toán vị trí `left` và `width` dưới dạng phần trăm
    // Đảm bảo không có giá trị âm
    const leftPercent = Math.max(0, (minutesFromStart / totalTimelineMinutes) * 100);
    const widthPercent = (duration / totalTimelineMinutes) * 100;

    return {
        left: `${leftPercent}%`,
        width: `${widthPercent}%`
    };
}


function renderSchedule() {
    const dateInput = document.getElementById('date');
    const selectedDate = dateInput.value;
    const container = document.getElementById('schedule-container');
    if (!container) return;
    container.innerHTML = '';
    
    // Thiết lập cấu trúc grid 18 cột cho container
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(18, minmax(0, 1fr))';

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
    const headerHTML = `
        <div class="col-span-2 p-3 text-sm font-semibold text-gray-700 border-r flex items-center justify-center sticky top-0 bg-gray-100 z-10 border-b-2 border-gray-300">
            <div class="text-lg">${selectedDate.split('-').reverse().join('-')}</div>
        </div>
        ${timeSlots.map(slot => `
            <div class="text-center border-l sticky top-0 z-10 border-b-2 border-gray-300 flex flex-col">
                <div class="man-hour-header bg-green-100 text-green-800 text-xs font-semibold py-1">${manHours[slot].display}</div>
                <div class="time-slot-header bg-green-700 text-white font-bold flex-grow flex items-center justify-center">${slot}</div>
            </div>
        `).join('')}
    `;
    container.innerHTML += headerHTML;

    // Build Body Rows
    if (currentScheduleData.length === 0) {
        container.innerHTML += `<div class="p-10 text-center text-gray-500 col-span-full bg-white">Không có lịch làm việc cho ngày ${selectedDate}.</div>`;
    } else {
        // Thêm các cột giờ trống làm nền cho timeline
        const backgroundGrid = document.createElement('div');
        backgroundGrid.className = 'col-start-3 col-span-16 grid grid-cols-16 h-full';
        timeSlots.slice(0, -1).forEach(() => { // Chỉ cần 15 vạch kẻ
            backgroundGrid.innerHTML += `<div class="border-r"></div>`;
        });
        container.appendChild(backgroundGrid);

        currentScheduleData.forEach(employee => {
            // Name Cell
            const nameCell = document.createElement('div');
            nameCell.className = 'col-span-2 p-3 border-r border-b flex items-center sticky left-0 bg-white z-20';
            nameCell.innerHTML = `
                    <div class="flex-1">
                        <div class="employee-name text-gray-800 text-lg">${employee.name}</div>
                        <div class="text-sm text-gray-600">${employee.role}</div>
                        <div class="text-xs text-gray-500 mt-2 font-medium">${employee.shift}</div>
                    </div>
            `;
            container.appendChild(nameCell);

            // Timeline container for this employee's tasks
            const timelineContainer = document.createElement('div');
            timelineContainer.className = 'col-span-16 border-b relative h-20'; // h-20 để có chiều cao cố định

            // Giả định employee.tasks là một mảng các object: [{id, startTime}, ...]
            const tasks = employee.tasks || [];
            const allTaskGroups = window.allTaskGroups || {}; // Lấy từ thư viện task
            tasks.forEach(taskInfo => {
                if (!taskInfo.id || !taskInfo.startTime) return;
                const taskData = { id: taskInfo.id, name: taskInfo.name, groupId: taskInfo.groupId, estimatedTime: 15 }; // Tạo task data tạm
                
                const estimatedTime = taskData.estimatedTime || 15;
                const { left, width } = calculateTaskPosition(taskInfo.startTime, estimatedTime);
                const color = getGroupColor(taskData.groupId);

                const taskElement = document.createElement('div');
                taskElement.className = `sub-task-card absolute top-1 bottom-1 group border ${color.bg} ${color.border} shadow-sm flex flex-col justify-center items-center p-1 rounded-md overflow-hidden`;
                taskElement.setAttribute('data-task-code', taskData.id);
                taskElement.style.left = left;
                taskElement.style.width = width;
                taskElement.innerHTML = `
                        <div class="sub-task-name text-xs font-semibold ${color.text} text-center truncate w-full px-1">${taskData.name}</div>
                        <div class="sub-task-code text-xxs">${taskData.id}</div>
                            <button class="delete-task-btn absolute top-0 right-0 p-1 leading-none opacity-0 group-hover:opacity-100 transition-opacity" onclick="window.dailySchedule.deleteTask(this)">
                                <i class="fas fa-times text-xxs"></i>
                            </button>
                `;
                timelineContainer.appendChild(taskElement);
            });
            container.appendChild(timelineContainer);
        });
    }

    // initializeDragAndDrop(); // Kéo thả không còn tương thích với layout này
}
//#endregion

//#region INTERACTIONS
function initializeDragAndDrop() {
    sortableInstances.forEach(instance => instance.destroy());
    sortableInstances = [];

    // Logic kéo thả cần được viết lại hoàn toàn để hoạt động với position: absolute.
    // document.querySelectorAll('.sub-task-grid').forEach(container => {
    //     const sortable = Sortable.create(container, {
    //         group: 'shared',
    //         animation: 150,
    //         dataIdAttr: 'data-task-code',
    //         onEnd: async function (evt) {
    //             updateScheduleDataFromDOM();
    //         }
    //     });
    //     sortableInstances.push(sortable);
    // });
}

// Hàm này không còn hợp lệ với cấu trúc timeline mới
async function updateScheduleDataFromDOM() {
    const grids = document.querySelectorAll('.sub-task-grid');
    const updatesByDoc = {};

    // 1. Gom tất cả các thay đổi theo từng document (từng nhân viên)
    grids.forEach(grid => {
        const docId = grid.dataset.docId;
        const slot = grid.dataset.slot;
        if (!docId || !slot) return;

        if (!updatesByDoc[docId]) {
            // Lấy lại tasks cũ từ `currentScheduleData` để không làm mất các slot không có trên DOM
            const originalData = currentScheduleData.find(d => d.docId === docId);
            updatesByDoc[docId] = originalData ? { ...originalData.tasks } : {};
        }

        const taskElements = grid.querySelectorAll('.sub-task-card');
        updatesByDoc[docId][slot] = Array.from(taskElements).map(el => el.dataset.taskCode);
    });

    // 2. Gửi các lệnh cập nhật lên Firestore
    const updatePromises = Object.keys(updatesByDoc).map(docId => {
        const docRef = doc(db, 'schedules', docId);
        return updateDoc(docRef, { tasks: updatesByDoc[docId] });
    });

    try {
        await Promise.all(updatePromises);
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
        // Logic xóa cần được cập nhật để xóa task khỏi mảng `tasks` của nhân viên trên Firestore
        showToast('Chức năng xóa đang được cập nhật cho giao diện timeline mới.', 'info');
        // taskCard.remove();
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
    const employeeSelect = document.getElementById('schedule-employee');
    if (employeeSelect) {
        employeeSelect.innerHTML = '<option value="">-- Chọn Nhân Viên --</option>' + 
            allEmployees.map(s => `<option value="${s.id}">${s.name} (${s.roleId || 'N/A'})</option>`).join('');
    }
    document.getElementById('schedule-date').value = document.getElementById('date').value;
    showModal('schedule-modal');
}

async function handleAddSchedule(e) {
    e.preventDefault();
    const employeeId = document.getElementById('schedule-employee').value;
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
    // Đặt ngày mặc định là ngày hiện tại
    if (dateInput && !dateInput.value) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
    }
    listenForScheduleChanges(dateInput.value);

    // Gán listener cho sự kiện thay đổi ngày
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