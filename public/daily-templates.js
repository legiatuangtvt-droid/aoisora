import { db } from './firebase.js';
import { collection, getDocs, query, orderBy, doc, setDoc, serverTimestamp, addDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let allStaff = [];
let allMainTasks = {}; // Dùng object để tra cứu nhanh bằng ID
let sortableInstances = [];

let allTemplates = [];
let currentTemplateId = null;

// Bảng màu định nghĩa các lớp CSS cho từng tên màu.
const colorDefinitions = {
    'green': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', hover: 'hover:bg-green-200' },
    'blue': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', hover: 'hover:bg-blue-200' },
    'indigo': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300', hover: 'hover:bg-indigo-200' },
    'amber': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', hover: 'hover:bg-amber-200' },
    'teal': { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300', hover: 'hover:bg-teal-200' },
    'purple': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', hover: 'hover:bg-purple-200' },
    'red': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', hover: 'hover:bg-red-200' },
    'pink': { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300', hover: 'hover:bg-pink-200' },
    'slate': { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300', hover: 'hover:bg-slate-200' },
};

// Bảng màu cho các nhóm, sẽ được xây dựng động từ Firestore.
let groupColorPalette = {
    'DEFAULT': colorDefinitions['slate']
};

// Hàm tiện ích để lấy màu dựa trên groupId
const getGroupColor = (groupId) => groupColorPalette[groupId] || groupColorPalette.DEFAULT;

/**
 * Tải tất cả dữ liệu nền cần thiết một lần.
 */
async function fetchInitialData() {
    try {
        // Tải danh sách nhân viên
        const staffQuery = query(collection(db, 'staff'), orderBy('name'));
        const staffSnapshot = await getDocs(staffQuery);
        allStaff = staffSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Tải danh sách công việc chính
        const tasksSnapshot = await getDocs(collection(db, 'main_tasks'));
        allMainTasks = tasksSnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = { id: doc.id, ...doc.data() };
            return acc;
        }, {});

        // Tải nhóm công việc và xây dựng bảng màu động
        const taskGroupsQuery = query(collection(db, 'task_groups'));
        const taskGroupsSnapshot = await getDocs(taskGroupsQuery);
        taskGroupsSnapshot.forEach(doc => {
            const group = doc.data();
            const groupCode = doc.id; // groupCode là ID của document
            const colorName = group.color || 'slate'; // Mặc định là 'slate' nếu không có màu
            if (colorDefinitions[colorName]) {
                groupColorPalette[groupCode] = colorDefinitions[colorName];
            }
        });
    } catch (error) {
        console.error("Lỗi nghiêm trọng khi tải dữ liệu nền:", error);
        const container = document.getElementById('template-builder-grid-container');
        if(container) container.innerHTML = `<div class="p-10 text-center text-red-500">Không thể tải danh sách nhân viên. Vui lòng thử lại.</div>`;
    }
}

/**
 * Render toàn bộ lưới xây dựng lịch trình.
 */
function renderGrid() {
    const container = document.getElementById('template-builder-grid-container');
    if (!container) return;

    const timeSlots = Array.from({ length: 16 }, (_, i) => `${i + 6}:00`); // 6:00 -> 21:00

    // Tạo bảng
    const table = document.createElement('table');
    table.className = 'min-w-full border-collapse border border-slate-200';

    // --- Tạo Header (Tên nhân viên) ---
    const thead = document.createElement('thead');
    thead.className = 'bg-slate-100 sticky top-0 z-20'; // Tăng z-index để header nổi trên các ô sticky
    let headerRowHtml = `<th class="p-2 border border-slate-200 w-48 sticky left-0 bg-slate-100 z-30">Nhân viên</th>`; // Cột Nhân viên, sticky
    timeSlots.forEach(time => {
        headerRowHtml += `
            <th class="p-2 border border-slate-200 min-w-[308px] text-center font-semibold text-slate-700">${time}</th>
        `;
    });
    thead.innerHTML = `<tr>${headerRowHtml}</tr>`;
    table.appendChild(thead);

    // --- Tạo Body (Các hàng thời gian và ô kéo thả) ---
    const tbody = document.createElement('tbody');
    allStaff.forEach(staff => {
        let bodyRowHtml = `
            <td class="p-2 border border-slate-200 align-top sticky left-0 bg-white z-10">
                <div class="font-semibold text-slate-700">${staff.name}</div>
                <div class="text-xs text-slate-500 font-normal">${staff.roleId || ''}</div>
            </td>
        `; // Ô thông tin nhân viên, sticky

        timeSlots.forEach(time => {
            // Mỗi ô lớn chứa 4 ô 15 phút
            bodyRowHtml += `
                <td class="p-0 border border-slate-200 align-top">
                    <div class="grid grid-cols-4 h-[104px] gap-1">
                        <div class="quarter-hour-slot border-r border-dashed border-slate-200 flex justify-center items-center" data-staff-id="${staff.id}" data-time="${time}" data-quarter="00"></div>
                        <div class="quarter-hour-slot border-r border-dashed border-slate-200 flex justify-center items-center" data-staff-id="${staff.id}" data-time="${time}" data-quarter="15"></div>
                        <div class="quarter-hour-slot border-r border-dashed border-slate-200 flex justify-center items-center" data-staff-id="${staff.id}" data-time="${time}" data-quarter="30"></div>
                        <div class="quarter-hour-slot flex justify-center items-center" data-staff-id="${staff.id}" data-time="${time}" data-quarter="45"></div>
                    </div>
                </td>
            `;
        });
        tbody.innerHTML += `<tr>${bodyRowHtml}</tr>`;
    });
    table.appendChild(tbody);

    container.innerHTML = ''; // Xóa nội dung "đang tải"
    container.appendChild(table);

    initializeDragAndDrop();
}

/**
 * Khởi tạo chức năng kéo thả cho các ô 15 phút.
 */
function initializeDragAndDrop() {
    // Hủy các instance cũ để tránh rò rỉ bộ nhớ
    sortableInstances.forEach(s => s.destroy());
    sortableInstances = [];

    document.querySelectorAll('.quarter-hour-slot').forEach(slot => {
        const sortable = Sortable.create(slot, {
            group: {
                name: 'template-tasks',
                pull: true,
                put: true // Cho phép nhận task từ thư viện
            },
            animation: 150,
            ghostClass: "swap-ghost", // Class cho "bóng ma" khi kéo, để tùy chỉnh hiệu ứng đổi chỗ
            onEnd: function (evt) {
                // Khi một task được kéo thả xong (thêm, di chuyển, xóa khỏi slot)
                // Cần cập nhật lại dữ liệu mẫu.
                updateTemplateFromDOM();
            },
            onEnd: function (evt) {
                const draggedItem = evt.item; // Phần tử task được kéo
                const originalSlot = evt.from; // Ô lịch trình gốc mà task được kéo ra
                const targetSlot = evt.to;     // Ô lịch trình đích mà task được thả vào

                // Chỉ áp dụng logic đổi chỗ cho các thao tác kéo-thả nội bộ (không phải từ thư viện)
                // và khi task được di chuyển giữa các ô khác nhau.
                if (originalSlot !== targetSlot && evt.pullMode !== 'clone') {
                    // Kiểm tra xem ô đích có nhiều hơn một phần tử con hay không.
                    // Nếu có, điều đó có nghĩa là đã có một task tồn tại ở đó trước khi task mới được thả vào.
                    if (targetSlot.children.length > 1) {
                        let existingItemInTarget = null;
                        // Tìm phần tử task đã có sẵn trong ô đích (phần tử không phải là draggedItem)
                        for (let i = 0; i < targetSlot.children.length; i++) {
                            if (targetSlot.children[i] !== draggedItem) {
                                existingItemInTarget = targetSlot.children[i];
                                break;
                            }
                        }
                        if (existingItemInTarget) {
                            // Di chuyển task đã có sẵn từ ô đích trở lại ô gốc
                            originalSlot.appendChild(existingItemInTarget);
                        }
                    }
                }
                // Luôn cập nhật dữ liệu mẫu sau bất kỳ thao tác kéo-thả nào
                updateTemplateFromDOM();
            },
            onAdd: function (evt) {
                const item = evt.item;
                const taskCode = item.dataset.taskCode;
                const groupId = item.dataset.groupId; // Lấy groupId từ task được kéo

                // Chỉ định dạng lại nếu task đến từ thư viện (pullMode === 'clone')
                // Nếu là di chuyển nội bộ, item đã có định dạng đúng.
                if (evt.pullMode === 'clone') {
                    // Khi kéo từ thư viện, item.textContent chính là tên task
                    const taskName = item.textContent;
                    const color = getGroupColor(groupId); // Lấy bộ màu tương ứng

                    // Ghi đè class để định dạng lại task trong lưới lịch trình
                    // Sử dụng justify-between để đẩy taskCode xuống dưới
                    item.className = `scheduled-task-item relative group w-[70px] h-[100px] ${color.bg} ${color.text} ${color.border} text-xs p-1 rounded-md shadow-sm cursor-pointer flex flex-col justify-between items-center text-center mb-1`;
                    item.dataset.taskCode = taskCode; // Gán lại mã task vào item mới
                    item.dataset.groupId = groupId; // Lưu lại groupId để dùng khi tải lại mẫu

                    // Xây dựng lại nội dung một lần duy nhất, sử dụng các biến đã lưu
                    item.innerHTML = `
                        <button class="delete-task-btn absolute top-0 right-0 p-1 leading-none font-bold text-current opacity-50 hover:opacity-100 group-hover:opacity-100">×</button>
                        <div class="flex-grow flex flex-col justify-center">
                            <span class="overflow-hidden text-ellipsis">${taskName}</span>
                        </div>
                        <span class="font-semibold mt-auto">${taskCode}</span>
                    `;
                }
                // Nếu không phải clone (tức là di chuyển nội bộ), không cần làm gì, item đã có định dạng đúng.
            }
        });
        sortableInstances.push(sortable);
    });

    // Thêm listener để xóa task
    const gridContainer = document.getElementById('template-builder-grid-container');
    if (gridContainer) {
        gridContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-task-btn')) {
                e.target.closest('.scheduled-task-item').remove(); // Xóa toàn bộ thẻ task
                updateTemplateFromDOM(); // Cập nhật lại dữ liệu sau khi xóa
            }
        });
    }
}

/**
 * Thu thập dữ liệu từ lưới và lưu vào Firestore.
 */
async function saveTemplate() {
    const saveButton = document.getElementById('save-template-btn');
    let templateIdToSave = currentTemplateId;
    let templateName = '';

    // Nếu đang ở chế độ tạo mới, yêu cầu nhập tên
    if (!templateIdToSave) {
        templateName = prompt("Nhập tên cho mẫu mới (ví dụ: Ngày cuối tuần):");
        if (!templateName || templateName.trim() === '') {
            window.showToast('Tên mẫu không được để trống.', 'warning');
            return;
        }
    } else {
        templateName = allTemplates.find(t => t.id === templateIdToSave)?.name;
    }

    saveButton.disabled = true;
    saveButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Đang lưu...`;

    const scheduleData = {};

    // 1. Thu thập dữ liệu từ DOM
    document.querySelectorAll('.scheduled-task-item').forEach(taskItem => {
        const slot = taskItem.closest('.quarter-hour-slot');
        if (!slot) return;

        const staffId = slot.dataset.staffId;
        const taskName = taskItem.querySelector('span.overflow-hidden').textContent; // Lấy tên task từ DOM
        const taskCode = taskItem.dataset.taskCode;
        const groupId = taskItem.dataset.groupId; // Lấy groupId từ DOM
        const time = slot.dataset.time;
        const quarter = slot.dataset.quarter;
        const startTime = `${time.split(':')[0].padStart(2, '0')}:${quarter}`;

        if (!scheduleData[staffId]) {
            scheduleData[staffId] = [];
        }

        scheduleData[staffId].push({ taskCode, taskName, startTime, groupId });
    });

    // 2. Lưu vào Firestore
    try {
        if (templateIdToSave) {
            // Cập nhật mẫu đã có
            const templateRef = doc(db, 'daily_templates', templateIdToSave);
            await setDoc(templateRef, { schedule: scheduleData, updatedAt: serverTimestamp() }, { merge: true });
        } else {
            // Tạo mẫu mới
            const newDocRef = await addDoc(collection(db, 'daily_templates'), {
                name: templateName.trim(),
                schedule: scheduleData,
                createdAt: serverTimestamp()
            });
            // Sau khi tạo thành công, tải lại danh sách và tự động chọn mẫu vừa tạo
            await fetchAndRenderTemplates();
            document.getElementById('template-selector').value = newDocRef.id;
            await loadTemplate(newDocRef.id);
        }

        window.showToast('Đã lưu lịch trình mẫu thành công!', 'success');
    } catch (error) {
        console.error("Lỗi khi lưu lịch trình mẫu:", error);
        window.showToast('Lỗi khi lưu lịch trình. Vui lòng thử lại.', 'error');
    } finally {
        saveButton.disabled = false;
        saveButton.innerHTML = `<i class="fas fa-save mr-2"></i> Lưu Lịch Trình Mẫu`;
    }
}

/**
 * Thu thập dữ liệu từ DOM và cập nhật mẫu hiện tại trong Firestore.
 * Không yêu cầu tên mẫu hay tạo mẫu mới.
 */
async function updateTemplateFromDOM() {
    if (!currentTemplateId) {
        // Nếu không có mẫu nào đang được chọn (chế độ tạo mới), không làm gì cả.
        // Việc lưu sẽ được xử lý bởi saveTemplate khi người dùng nhấn nút lưu.
        return;
    }

    const scheduleData = {};

    // 1. Thu thập dữ liệu từ DOM
    document.querySelectorAll('.scheduled-task-item').forEach(taskItem => {
        const slot = taskItem.closest('.quarter-hour-slot');
        if (!slot) return;

        const staffId = slot.dataset.staffId;
        const taskName = taskItem.querySelector('span.overflow-hidden').textContent;
        const taskCode = taskItem.dataset.taskCode;
        const groupId = taskItem.dataset.groupId; // Lấy groupId
        const time = slot.dataset.time;
        const quarter = slot.dataset.quarter;
        const startTime = `${time.split(':')[0].padStart(2, '0')}:${quarter}`;

        if (!scheduleData[staffId]) {
            scheduleData[staffId] = [];
        }
        scheduleData[staffId].push({ taskCode, taskName, startTime, groupId });
    });

    // 2. Cập nhật vào Firestore
    try {
        const templateRef = doc(db, 'daily_templates', currentTemplateId);
        await setDoc(templateRef, { schedule: scheduleData, updatedAt: serverTimestamp() }, { merge: true });
        // showToast('Đã tự động lưu thay đổi!', 'success', 1000); // Có thể thêm toast nhỏ
    } catch (error) {
        console.error("Lỗi khi tự động cập nhật lịch trình mẫu:", error);
        window.showToast('Lỗi khi tự động lưu thay đổi. Vui lòng thử lại.', 'error');
    }
}

/**
 * Tải danh sách các mẫu và render vào dropdown.
 */
async function fetchAndRenderTemplates() {
    const templateSelector = document.getElementById('template-selector');
    templateSelector.innerHTML = `<option value="">-- Đang tải... --</option>`;

    try {
        const q = query(collection(db, 'daily_templates'), orderBy('name'));
        const snapshot = await getDocs(q);
        allTemplates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Luôn thêm lựa chọn "Tạo Mẫu Mới" ở đầu
        let optionsHtml = `<option value="new">-- Tạo Mẫu Mới --</option>`;
        optionsHtml += allTemplates.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
        templateSelector.innerHTML = optionsHtml;

    } catch (error) {
        console.error("Lỗi khi tải danh sách mẫu:", error);
        templateSelector.innerHTML = `<option value="">-- Lỗi tải mẫu --</option>`;
    }
}

/**
 * Tải dữ liệu của một mẫu cụ thể và hiển thị lên lưới.
 * @param {string} templateId ID của mẫu cần tải.
 */
async function loadTemplate(templateId) {
    // Nếu người dùng chọn "Tạo Mẫu Mới"
    if (templateId === 'new') {
        switchToCreateNewMode();
        return;
    }

    currentTemplateId = templateId;
    renderGrid(); // Render lại lưới trống trước

    // Hiển thị các nút cho chế độ xem/sửa
    document.getElementById('new-template-btn').classList.remove('hidden');
    document.getElementById('delete-template-btn').classList.remove('hidden');

    if (!templateId) return; // Thoát nếu không có ID

    try {
        const templateRef = doc(db, 'daily_templates', templateId);
        const docSnap = await getDoc(templateRef);

        if (docSnap.exists()) {
            const { schedule } = docSnap.data();
            if (!schedule) return;
            
            // Điền các task vào lưới
            Object.keys(schedule).forEach(staffId => {
                schedule[staffId].forEach(taskInfo => { // taskInfo giờ đây có cả taskName
                    const { taskCode, startTime, groupId } = taskInfo;
                    const [hour, quarter] = startTime.split(':');
                    const time = `${parseInt(hour, 10)}:00`;

                    const slot = document.querySelector(`.quarter-hour-slot[data-staff-id="${staffId}"][data-time="${time}"][data-quarter="${quarter}"]`);
                    if (slot) {
                        const color = getGroupColor(groupId);
                        // Giả lập một item task để thêm vào
                        const taskName = taskInfo.taskName || '...'; // Lấy taskName từ dữ liệu mẫu
                        const taskItem = document.createElement('div');
                        // Sử dụng justify-between để đẩy taskCode xuống dưới
                        taskItem.className = `scheduled-task-item relative group w-[70px] h-[100px] ${color.bg} ${color.text} ${color.border} text-xs p-1 rounded-md shadow-sm cursor-pointer flex flex-col justify-between items-center text-center mb-1`;
                        taskItem.dataset.taskCode = taskCode;
                        taskItem.dataset.groupId = groupId;
                        taskItem.innerHTML = `
                            <button class="delete-task-btn absolute top-0 right-0 p-1 leading-none font-bold text-current opacity-50 hover:opacity-100 group-hover:opacity-100">×</button>
                            <div class="flex-grow flex flex-col justify-center">
                                <span class="overflow-hidden text-ellipsis">${taskName}</span>
                            </div>
                            <span class="font-semibold mt-auto">${taskCode}</span>
                        `;
                        slot.appendChild(taskItem);
                    }
                });
            });
        }
    } catch (error) {
        console.error("Lỗi khi tải chi tiết mẫu:", error);
        window.showToast('Không thể tải dữ liệu cho mẫu này.', 'error');
    }
}

/**
 * Chuyển giao diện về chế độ tạo mẫu mới.
 */
function switchToCreateNewMode() {
    currentTemplateId = null;
    document.getElementById('template-selector').value = 'new';
    renderGrid(); // Vẽ lại lưới trống

    // Ẩn các nút không cần thiết
    document.getElementById('new-template-btn').classList.add('hidden');
    document.getElementById('delete-template-btn').classList.add('hidden');
}

/**
 * Xử lý việc xóa mẫu hiện tại.
 */
async function deleteCurrentTemplate() {
    if (!currentTemplateId) return;

    const currentTemplate = allTemplates.find(t => t.id === currentTemplateId);
    if (confirm(`Bạn có chắc chắn muốn xóa mẫu "${currentTemplate.name}" không? Hành động này không thể hoàn tác.`)) {
        try {
            await deleteDoc(doc(db, 'daily_templates', currentTemplateId));
            window.showToast(`Đã xóa mẫu "${currentTemplate.name}".`, 'success');
            await fetchAndRenderTemplates(); // Tải lại danh sách và chọn mẫu đầu tiên
        } catch (error) {
            console.error("Lỗi khi xóa mẫu:", error);
            window.showToast('Đã có lỗi xảy ra khi xóa mẫu.', 'error');
        }
    }
}

export async function init() {
    await fetchInitialData();
    await fetchAndRenderTemplates(); // Tải danh sách mẫu vào dropdown
    switchToCreateNewMode(); // Đặt trạng thái mặc định là tạo mới

    document.getElementById('save-template-btn')?.addEventListener('click', saveTemplate);
    document.getElementById('new-template-btn')?.addEventListener('click', switchToCreateNewMode);
    document.getElementById('delete-template-btn')?.addEventListener('click', deleteCurrentTemplate);
    document.getElementById('template-selector')?.addEventListener('change', (e) => loadTemplate(e.target.value));
}

export function cleanup() {
    sortableInstances.forEach(s => s.destroy());
    sortableInstances = [];
    // Dọn dẹp các listener bằng cách clone và thay thế node
    ['save-template-btn', 'new-template-btn', 'delete-template-btn', 'template-selector'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const newEl = el.cloneNode(true);
            el.parentNode.replaceChild(newEl, el);
        }
    });
}