import { db } from './firebase.js';
import { collection, getDocs, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let activeListeners = [];

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

    groupsContainer.innerHTML = taskGroups.map(group => {
        const firstTask = group.tasks?.[0] || { order: 'N/A', name: 'Chưa có task' };
        const taskCode = `1${String(group.order).padStart(2, '0')}${String(firstTask.order).padStart(2, '0')}`;

        return `
        <div class="group-card">
            <div class="header-cell">
                <span class="font-semibold text-sm uppercase tracking-wider">Group Tasks</span>
            </div>
            <div class="p-3 flex flex-col items-center justify-center text-center bg-slate-700 text-white" style="grid-row: 2 / 4;">
                <span class="text-sm text-gray-400">Order</span>
                <span class="text-4xl font-bold">${group.order}</span>
            </div>
            <div class="p-3 flex flex-col items-center justify-center text-center bg-slate-50" style="grid-row: 2 / 4;">
                <span class="text-sm text-gray-500">Code</span>
                <span class="text-2xl font-bold text-gray-800">${group.code}</span>
            </div>
            <div class="task-cell">
                <div class="flex justify-between items-baseline mb-1">
                    <span class="text-xs font-bold text-indigo-600">TASK ${firstTask.order}</span>
                    <span class="text-xs font-mono bg-gray-200 text-gray-700 px-2 py-0.5 rounded">${taskCode}</span>
                </div>
                <p class="font-semibold text-gray-800">${firstTask.name}</p>
            </div>
            <div class="footer-cell">
                <span class="text-sm font-medium text-gray-600">Total Tasks: ${group.tasks?.length || 0}</span>
            </div>
        </div>
        `;
    }).join('');
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