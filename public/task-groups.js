import { db } from './firebase.js';
import { collection, getDocs, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let activeListeners = [];

// Bảng màu để người dùng có thể chọn cho mỗi nhóm
const colorPalette = [
    { name: 'slate', bg: 'bg-slate-50', border: 'border-slate-200', hover: 'hover:bg-slate-100' },
    { name: 'green', bg: 'bg-green-50', border: 'border-green-200', hover: 'hover:bg-green-100' },
    { name: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', hover: 'hover:bg-blue-100' },
    { name: 'amber', bg: 'bg-amber-50', border: 'border-amber-200', hover: 'hover:bg-amber-100' },
    { name: 'teal', bg: 'bg-teal-50', border: 'border-teal-200', hover: 'hover:bg-teal-100' },
    { name: 'purple', bg: 'bg-purple-50', border: 'border-purple-200', hover: 'hover:bg-purple-100' },
    { name: 'indigo', bg: 'bg-indigo-50', border: 'border-indigo-200', hover: 'hover:bg-indigo-100' },
    { name: 'red', bg: 'bg-red-50', border: 'border-red-200', hover: 'hover:bg-red-100' },
    { name: 'pink', bg: 'bg-pink-50', border: 'border-pink-200', hover: 'hover:bg-pink-100' },
];

// Key để lưu trạng thái màu vào localStorage
const GROUP_COLORS_STORAGE_KEY = 'taskGroupColors';

/**
 * Render toàn bộ nội dung trang, bao gồm thống kê và các thẻ nhóm công việc.
 */
async function renderPage() {
    try {
        // Sử dụng getDocs thay vì onSnapshot vì trang này chủ yếu để hiển thị, không cần real-time phức tạp
        const q = query(collection(db, 'task_groups'), orderBy("order"));
        const querySnapshot = await getDocs(q);
        const taskGroups = querySnapshot.docs.map(doc => doc.data());

        renderStatistics(taskGroups);
        renderGroupCards(taskGroups);
        addGroupCardEventListeners(); // Thêm listener sau khi render

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu nhóm công việc:", error);
        window.showToast("Không thể tải dữ liệu. Vui lòng thử lại.", "error");
        document.getElementById('task-groups-container').innerHTML = `<p class="text-red-500">Lỗi tải dữ liệu.</p>`;
    }
}

/**
 * Render khu vực thống kê.
 * @param {Array} taskGroups - Mảng các nhóm công việc.
 */
function renderStatistics(taskGroups) {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;

    const totalTasks = taskGroups.reduce((sum, group) => sum + (group.tasks?.length || 0), 0);

    const stats = [
        { title: 'Tổng số Task', value: totalTasks, icon: 'fa-tasks', color: 'bg-blue-500' },
        { title: 'Daily Task', value: 'N/A', icon: 'fa-sun', color: 'bg-yellow-500' },
        { title: 'Weekly', value: 'N/A', icon: 'fa-calendar-week', color: 'bg-green-500' },
        { title: 'Monthly', value: 'N/A', icon: 'fa-calendar-alt', color: 'bg-purple-500' },
        { title: 'Yearly', value: 'N/A', icon: 'fa-calendar-check', color: 'bg-red-500' },
        { title: 'Khác', value: 'N/A', icon: 'fa-asterisk', color: 'bg-gray-500' }
    ];

    statsContainer.innerHTML = stats.map(stat => `
        <div class="stat-card flex items-baseline gap-3 border border-gray-200 p-4">
            <div class="stat-icon ${stat.color}"><i class="fas ${stat.icon}"></i></div>
            <p class="text-sm font-medium text-gray-600">${stat.title}:</p>
            <p class="text-xl font-bold text-gray-900">${stat.value}</p>
        </div>
    `).join('');
}

/**
 * Render các thẻ nhóm công việc.
 * @param {Array} taskGroups - Mảng các nhóm công việc.
 */
function renderGroupCards(taskGroups) {
    const groupsContainer = document.getElementById('task-groups-container');
    if (!groupsContainer) return;

    // Lấy màu đã lưu từ localStorage
    const savedColors = JSON.parse(localStorage.getItem(GROUP_COLORS_STORAGE_KEY) || '{}');

    const defaultTaskColor = colorPalette.find(c => c.name === 'slate') || colorPalette[0];

    groupsContainer.innerHTML = taskGroups.map(group => {
        const currentColorName = savedColors[group.code] || 'slate';
        const color = colorPalette.find(c => c.name === currentColorName) || colorPalette[0];

        const headerCell = `
            <div class="group-order-card bg-slate-100 text-slate-800 p-2 rounded border border-slate-200 flex flex-col items-center justify-center text-center aspect-square w-24 h-24 flex-shrink-0">
                <p class="font-bold text-4xl">${group.order}</p>
            </div>
            <div class="group-code-card ${color.bg} text-slate-800 rounded ${color.border} flex flex-col items-center justify-between text-center aspect-square w-24 h-24 flex-shrink-0 cursor-pointer transition-colors ${color.hover}" data-group-code="${group.code}">
                <div class="w-full text-xs font-semibold py-0.5 bg-black/10 rounded-t">
                    Group Task
                </div>
                <h3 class="font-bold text-2xl">${group.code}</h3>
                <div class="w-full text-xs font-semibold py-0.5 bg-black/10 rounded-b">
                    Total Tasks: ${group.tasks?.length || 0}
                </div>
            </div>
        `;

        const taskCells = (group.tasks || []).map(task => {
            // Tạo mã code theo công thức: 1<group.order><task.order (2 chữ số)>
            const generatedCode = `1${group.order}${String(task.order).padStart(2, '0')}`;

            return `
                <div class="task-card ${defaultTaskColor.bg} rounded ${defaultTaskColor.border} flex flex-col items-center justify-between text-center aspect-square w-24 h-24 flex-shrink-0 transition-all ${defaultTaskColor.hover} hover:shadow-md">
                    <div class="w-full text-xs font-semibold py-0.5 bg-black/10 rounded-t">
                        Order: ${task.order}
                    </div>
                    <p class="text-sm font-medium text-slate-800 leading-tight px-2">${task.name}</p>
                    <div class="w-full text-xs font-semibold py-0.5 bg-black/10 rounded-b">
                        ${generatedCode}
                    </div>
                </div>
            `;
        }).join('');

        const actionCell = `
            <div class="action-card flex flex-col items-center justify-center gap-4 text-center aspect-square w-24 h-24 flex-shrink-0 bg-slate-50 border border-slate-200 rounded-lg">
                <button class="add-task-to-group-btn text-slate-500 hover:text-blue-600 transition-colors" data-group-code="${group.code}" title="Thêm Task vào nhóm ${group.code}">
                    <i class="fas fa-plus fa-2x"></i>
                </button>
                <button class="edit-group-btn text-slate-500 hover:text-indigo-600 transition-colors" data-group-code="${group.code}" title="Sửa thông tin nhóm ${group.code}">
                    <i class="fas fa-pencil-alt fa-2x"></i>
                </button>
            </div>
        `;

        return `
            <div class="group-row flex items-start gap-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                ${headerCell}
                <div class="tasks-scroll-container flex-1 overflow-x-auto"><div class="tasks-list-inner flex flex-nowrap gap-3">${taskCells}</div></div>
                ${actionCell}
            </div>
        `;
    }).join('');
}

/**
 * Thêm các event listener cho các thẻ code của nhóm để đổi màu.
 */
function addGroupCardEventListeners() {
    // Sử dụng event delegation trên container để xử lý click
    const container = document.getElementById('task-groups-container');
    if (!container) return;

    container.addEventListener('click', (e) => {
        const groupCodeCard = e.target.closest('.group-code-card');
        if (groupCodeCard) {
            showColorPalette(groupCodeCard);
        }
    });
}

/**
 * Hiển thị một popup bảng màu bên cạnh thẻ được nhấp.
 * @param {HTMLElement} targetCard - Thẻ code của nhóm được nhấp vào.
 */
function showColorPalette(targetCard) {
    // Xóa bất kỳ bảng màu nào đang tồn tại
    const existingPalette = document.getElementById('color-palette-popup');
    if (existingPalette) {
        existingPalette.remove();
    }

    const groupCode = targetCard.dataset.groupCode;
    if (!groupCode) return;

    // Tạo container cho bảng màu
    const palettePopup = document.createElement('div');
    palettePopup.id = 'color-palette-popup';
    palettePopup.className = 'absolute z-20 bg-white border border-gray-300 rounded-lg shadow-xl p-2 grid grid-cols-5 gap-2';

    // Điền các ô màu vào bảng màu
    palettePopup.innerHTML = colorPalette.map(color => `
        <div class="w-6 h-6 rounded-full cursor-pointer ${color.bg} border-2 ${color.border} hover:scale-110 transition-transform" 
             data-color-name="${color.name}" 
             title="${color.name}">
        </div>
    `).join('');

    document.body.appendChild(palettePopup);

    // Định vị bảng màu
    const cardRect = targetCard.getBoundingClientRect();
    palettePopup.style.left = `${cardRect.right + 10}px`;
    palettePopup.style.top = `${cardRect.top}px`;

    // Thêm listener cho các ô màu
    palettePopup.addEventListener('click', (e) => {
        const colorSwatch = e.target.closest('[data-color-name]');
        if (colorSwatch) {
            const newColorName = colorSwatch.dataset.colorName;
            updateGroupColor(groupCode, newColorName);
            palettePopup.remove(); // Đóng popup sau khi chọn
        }
    });

    // Thêm listener để đóng popup khi click ra ngoài
    setTimeout(() => {
        document.addEventListener('click', (e) => {
            if (!palettePopup.contains(e.target) && e.target !== targetCard && !targetCard.contains(e.target)) {
                palettePopup.remove();
            }
        }, { once: true });
    }, 0);
}

/**
 * Cập nhật màu cho một nhóm công việc cụ thể.
 * @param {string} groupCode - Mã của nhóm.
 * @param {string} newColorName - Tên màu mới từ bảng màu.
 */
function updateGroupColor(groupCode, newColorName) {
    const groupCodeCard = document.querySelector(`.group-code-card[data-group-code="${groupCode}"]`);
    if (!groupCodeCard) return;

    const newColor = colorPalette.find(c => c.name === newColorName) || colorPalette[0];

    // Cập nhật localStorage
    const savedColors = JSON.parse(localStorage.getItem(GROUP_COLORS_STORAGE_KEY) || '{}');
    savedColors[groupCode] = newColor.name;
    localStorage.setItem(GROUP_COLORS_STORAGE_KEY, JSON.stringify(savedColors));

    // Cập nhật màu cho ô code trong DOM
    // Xóa các class màu cũ
    colorPalette.forEach(color => {
        groupCodeCard.classList.remove(color.bg, color.border, color.hover);
    });
    // Thêm class màu mới
    groupCodeCard.classList.add(newColor.bg, newColor.border, newColor.hover);

    // Hiển thị thông báo nhỏ
    window.showToast(`Nhóm ${groupCode} đã đổi sang màu '${newColor.name}'`, 'info', 2000);
}

/**
 * Dọn dẹp tất cả các listener (sự kiện DOM, Firestore) của module này.
 * Được gọi bởi main.js trước khi chuyển sang trang khác.
 */
export function cleanup() {
    // Hủy tất cả các listener của Firestore
    activeListeners.forEach(unsubscribe => unsubscribe && unsubscribe());
    activeListeners = [];
}

/**
 * Hàm khởi tạo, được gọi bởi main.js khi trang này được tải.
 */
export function init() {
    renderPage();
}