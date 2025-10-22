import { db } from './firebase.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.0/Sortable.min.js";

// Biến để lưu trữ dữ liệu và các view
let allGroupedTasks = [];
let groupView, taskView;
let taskLibraryController = null;

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
/**
 * Lấy dữ liệu công việc từ Firestore và nhóm chúng lại.
 */
async function fetchAndGroupTasks() {
    const taskGroupsQuery = query(collection(db, 'task_groups'), orderBy('order'));
    const taskGroupsSnapshot = await getDocs(taskGroupsQuery);

    const groupedTasks = [];
    taskGroupsSnapshot.forEach(doc => {
        const group = { id: doc.id, ...doc.data() };
        groupedTasks.push({
            ...group,
            tasks: group.tasks || [] // Đảm bảo tasks là một mảng
        });
    });
    return groupedTasks;
}

/**
 * Chuyển đổi giữa các view (group và task).
 * @param {'group' | 'task'} viewName - Tên view cần hiển thị.
 */
function switchToView(viewName) {
    if (viewName === 'task') {
        groupView.classList.add('hidden');
        taskView.classList.remove('hidden');
    } else {
        taskView.classList.add('hidden');
        groupView.classList.remove('hidden');
    }
}

/**
 * Render view lưới các nhóm công việc.
 */
function renderGroupGridView() {
    if (!groupView) return;
    groupView.innerHTML = '';

    if (allGroupedTasks.length === 0) {
        groupView.innerHTML = '<p class="text-center text-gray-500">Không tìm thấy nhóm công việc.</p>';
        return;
    }

    allGroupedTasks.forEach(group => {
        const colorName = group.color || 'slate'; // Lấy màu từ group data
        const color = colorDefinitions[colorName] || colorDefinitions['slate'];

        const groupItem = document.createElement('div');
        // Sử dụng màu nhạt hơn cho thẻ group
        groupItem.className = `group-grid-item ${color.bg} ${color.border} ${color.hover}`;
        groupItem.dataset.groupId = group.id;
        groupItem.innerHTML = `
            <span class="code">${group.code}</span>
            <span class="count">${group.tasks.length} tasks</span>
        `;
        groupItem.addEventListener('click', () => renderTaskGridView(group.id));
        groupView.appendChild(groupItem);
    });
}

/**
 * Render view lưới các task của một nhóm cụ thể.
 * @param {string} groupId - ID của nhóm cần hiển thị task.
 */
function renderTaskGridView(groupId) {
    if (!taskView) return;

    const group = allGroupedTasks.find(g => g.id === groupId);
    if (!group) {
        console.error(`Không tìm thấy nhóm với ID: ${groupId}`);
        return;
    }

    taskView.innerHTML = `
        <div class="task-view-header">
            <button class="task-view-back-btn" title="Quay lại"><i class="fas fa-arrow-left"></i></button>
            <h3 class="task-view-title">${group.name || group.code}</h3>
        </div>
        <div id="task-view-content"></div>
    `;

    const taskContent = taskView.querySelector('#task-view-content');
    if (group.tasks.length > 0) {
        // Sắp xếp task theo 'order' trước khi render
        const sortedTasks = [...group.tasks].sort((a, b) => (a.order || 0) - (b.order || 0));
        sortedTasks.forEach(task => {
            const colorName = group.color || 'slate';
            const color = colorDefinitions[colorName] || colorDefinitions['slate'];
            const taskItem = document.createElement('div');
            const generatedCode = `1${group.order}${String(task.order).padStart(2, '0')}`;
            
            // Áp dụng layout và màu sắc tương tự như task trong lưới lịch trình
            taskItem.className = `task-library-item relative group ${color.bg} ${color.text} ${color.border} text-xs p-1 rounded-md shadow-sm cursor-grab flex flex-col justify-between items-center text-center mb-1`;
            taskItem.dataset.taskCode = generatedCode; // Gán mã task đã tạo vào dataset
            taskItem.dataset.groupId = group.id; // Thêm groupId để xác định màu sắc
            taskItem.innerHTML = `
                <div class="flex-grow flex flex-col justify-center">
                    <span class="overflow-hidden text-ellipsis">${task.name}</span>
                </div>
                <span class="font-semibold mt-auto">${generatedCode}</span>
            `;
            taskContent.appendChild(taskItem);
        });

        // Khởi tạo SortableJS cho danh sách task để có thể kéo đi
        Sortable.create(taskContent, {
            group: {
                name: 'template-tasks',
                pull: 'clone', // Quan trọng: Sao chép task khi kéo, không di chuyển
                put: false // Không cho phép thả item vào đây
            },
            sort: false, // Không cần sắp xếp lại trong thư viện
            animation: 150,
            onStart: function () {
                document.body.classList.add('is-dragging-task');
            },
            onEnd: function () {
                document.body.classList.remove('is-dragging-task');
            }
        });
    } else {
        taskContent.innerHTML = '<p class="text-sm text-gray-500">Không có công việc trong nhóm này.</p>';
    }

    taskView.querySelector('.task-view-back-btn').addEventListener('click', () => switchToView('group'));

    switchToView('task');
}

export async function initializeTaskLibrary() {
    if (document.getElementById('task-library-container')) return; // Đã khởi tạo

    // Create and inject HTML
    const menuContainer = document.createElement('div');
    menuContainer.id = 'task-library-container';
    menuContainer.innerHTML = `
        <div class="task-library-header flex items-center p-2.5 bg-slate-50 border-b border-slate-200 cursor-grab select-none h-[60px] box-border flex-shrink-0 active:cursor-grabbing">
            <span class="task-library-icon bg-indigo-600 text-white font-bold text-sm rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0"><i class="fas fa-book"></i></span>
            <span class="task-library-title ml-3 font-semibold text-slate-800 whitespace-nowrap opacity-0 transition-opacity ease-in">Thư Viện Task</span>
        </div>
        <div class="task-library-body opacity-0 invisible">
            <div id="group-view-container" class="task-library-view">
                <p class="text-center text-gray-500">Đang tải thư viện...</p>
            </div>
            <div id="task-view-container" class="task-library-view hidden">
                <!-- Nội dung các task của một group sẽ được render ở đây -->
            </div>
        </div>
    `;
    document.body.appendChild(menuContainer);

    const header = menuContainer.querySelector('.task-library-header');
    const menuBody = menuContainer.querySelector('.task-library-body');
    const menuTitle = menuContainer.querySelector('.task-library-title');
    groupView = menuContainer.querySelector('#group-view-container');
    taskView = menuContainer.querySelector('#task-view-container');

    // --- Tải và render nội dung ---
    try {
        allGroupedTasks = await fetchAndGroupTasks();
        renderGroupGridView();
    } catch (error) {
        console.error("Lỗi khi tải thư viện công việc:", error);
        groupView.innerHTML = '<p class="text-center text-red-500">Lỗi tải dữ liệu.</p>';
    }

    // --- Logic lưu/tải trạng thái từ localStorage ---
    const TASK_LIBRARY_STORAGE_KEY = 'taskLibraryState';

    function saveMenuState() {
        if (!menuContainer) return;
        const state = {
            left: menuContainer.style.left,
            top: menuContainer.style.top,
            expanded: menuContainer.classList.contains('expanded')
        };
        localStorage.setItem(TASK_LIBRARY_STORAGE_KEY, JSON.stringify(state));
    }

    function loadMenuState() {
        const savedState = localStorage.getItem(TASK_LIBRARY_STORAGE_KEY);
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                if (state.left) menuContainer.style.left = state.left;
                if (state.top) menuContainer.style.top = state.top;
                if (state.expanded) {
                    // Dùng setTimeout để đảm bảo transition chạy đúng
                    setTimeout(() => header.click(), 50);
                }
                const rect = menuContainer.getBoundingClientRect();
                menuContainer.style.left = `${Math.max(0, Math.min(rect.left, window.innerWidth - rect.width))}px`;
                menuContainer.style.top = `${Math.max(0, Math.min(rect.top, window.innerHeight - rect.height))}px`;
            } catch (e) {
                console.error("Lỗi khi đọc trạng thái Task Library từ localStorage", e);
            }
        }
    }

    // --- Toggle expand/collapse ---
    // Sử dụng 'dblclick' để mở/đóng, tránh xung đột với sự kiện kéo-thả (mousedown/mouseup)
    header.addEventListener('dblclick', (e) => {
        // Chỉ cần toggle class 'expanded' trên container chính.
        // CSS sẽ tự động xử lý việc hiển thị/ẩn các phần tử con.
        menuContainer.classList.toggle('expanded');
        switchToView('group'); // Luôn quay về view group khi thu/mở, dù là mở hay đóng
        saveMenuState();
    });

    // --- Draggable logic ---
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    let ghostElement = null;

    const onDragStart = async (e) => {
        // Chỉ kéo bằng chuột trái và khi target là header
        if (e.button !== 0) return;
        if (!e.target.closest('.task-library-header')) return;

        isDragging = true;

        const rect = menuContainer.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = rect.left;
        initialTop = rect.top;
        
        e.preventDefault();
        menuContainer.classList.add('dragging');

        // --- Logic mới: Sử dụng html2canvas để tạo ảnh chụp của menu ---
        const canvas = await html2canvas(menuContainer, {
            useCORS: true,
            backgroundColor: null, // Nền trong suốt
            // Bỏ qua chính ghost element nếu nó vô tình được vẽ
            ignoreElements: (element) => element.id === 'task-library-window-ghost'
        });

        // Nếu người dùng đã thả chuột trong lúc đang vẽ canvas, không làm gì cả
        if (!isDragging) return;

        ghostElement = document.createElement('div');
        ghostElement.id = 'task-library-window-ghost'; // Đổi tên ID để tránh xung đột
        ghostElement.appendChild(canvas); // Thêm canvas vào ghost
        // Áp dụng style cho ghost
        ghostElement.style.left = `${initialLeft}px`;
        ghostElement.style.top = `${initialTop}px`;
        document.body.appendChild(ghostElement);
    };

    const onDragMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let newX = initialLeft + dx;
        let newY = initialTop + dy;
        const ghostRect = ghostElement.getBoundingClientRect();
        newX = Math.max(0, Math.min(newX, window.innerWidth - ghostRect.width));
        newY = Math.max(0, Math.min(newY, window.innerHeight - ghostRect.height));
        ghostElement.style.left = `${newX}px`;
        ghostElement.style.top = `${newY}px`;
    };

    const onDragEnd = () => {
        if (!isDragging) return; // Nếu không phải đang kéo thì thôi

        isDragging = false; // Đặt lại cờ isDragging ngay lập tức

        if (ghostElement) {
            const ghostRect = ghostElement.getBoundingClientRect();
            menuContainer.style.left = `${ghostRect.left}px`;
            menuContainer.style.top = `${ghostRect.top}px`;
            saveMenuState();
            document.body.removeChild(ghostElement);
            ghostElement = null;
        }
        menuContainer.classList.remove('dragging');
    };

    // Đăng ký các listener một lần duy nhất
    header.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);

    loadMenuState();

    taskLibraryController = {
        destroy: () => {
            document.body.removeChild(menuContainer);
            // Hủy các listener đã đăng ký để dọn dẹp bộ nhớ
            header.removeEventListener('mousedown', onDragStart);
            document.removeEventListener('mousemove', onDragMove);
            document.removeEventListener('mouseup', onDragEnd);
        }
    };
}

export function cleanupTaskLibrary() {
    if (taskLibraryController) {
        taskLibraryController.destroy();
        taskLibraryController = null;
    }
}