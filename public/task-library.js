import { db } from './firebase.js';
import { collection, getDocs, query, orderBy, where, limit } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"; // This is a global import
import "https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.0/Sortable.min.js";

// Biến để lưu trữ dữ liệu và các view
let allGroupedTasks = [];
let menuContainer = null; // Biến toàn cục cho container chính
let groupTabsContainer, taskGridContainer;
let isStateLoaded = false; // Cờ để kiểm tra xem state từ localStorage đã được tải chưa
let typeTabsContainer = null; // NEW: Container cho các tab loại task
let currentFilters = { groupId: null, typeTask: 'Related' }; // Mặc định hiển thị tab "Gần đây"
let taskLibraryController = null;
let recentlyUsedTasks = []; // Biến mới để lưu các task đã dùng gần đây

// Bảng màu mặc định nếu group không có màu
const defaultColor = {
    bg: '#e2e8f0', text: '#1e293b', border: '#94a3b8', hover: '#cbd5e1', tailwind_bg: 'bg-slate-200', tailwind_text: 'text-slate-800', tailwind_border: 'border-slate-400'
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
 * Render các tab nhóm công việc ở cột bên trái.
 */
function renderGroupTabs() {
    if (!groupTabsContainer) return;
    groupTabsContainer.innerHTML = '';

    if (allGroupedTasks.length === 0) {
        groupTabsContainer.innerHTML = '<p class="p-2 text-center text-xs text-slate-500">Không có nhóm nào.</p>';
        return;
    }

    allGroupedTasks.forEach(group => {
        const color = (group.color && group.color.bg) ? group.color : defaultColor; // Giờ đây color chứa giá trị HEX
        const tab = document.createElement('button');
        tab.className = 'group-tab';
        tab.dataset.groupId = group.id;
        // Gán màu trực tiếp vào style của tab
        tab.style.backgroundColor = color.bg;
        tab.style.color = color.text;
        tab.style.setProperty('--hover-bg-color', color.hover); // Lưu màu hover vào biến CSS
        tab.style.setProperty('--active-border-color', color.border); // Lưu màu border active vào biến CSS
        tab.title = group.name || group.code;
        tab.innerHTML = `
            <span class="group-tab-code">${group.code}</span>
            <span class="group-tab-count">${group.tasks.length}</span>
        `;
        tab.addEventListener('click', () => {
            // Xóa active class khỏi tab hiện tại
            const currentActive = groupTabsContainer.querySelector('.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            // Xóa nội dung ô tìm kiếm khi chuyển tab
            const searchInput = document.getElementById('task-library-search');
            if (searchInput) {
                searchInput.value = '';
            }
            // Thêm active class cho tab được click
            currentFilters.groupId = group.id;
            // FIX: Thêm class 'active' vào tab vừa được click
            tab.classList.add('active');
            renderTaskGrid();
        });
        groupTabsContainer.appendChild(tab);
    });

    // Tự động click vào tab đầu tiên để hiển thị task
    if (groupTabsContainer.firstChild) {
        groupTabsContainer.firstChild.click();
    }
}

/**
 * Cập nhật trạng thái active cho các tab loại task.
 */
function updateActiveTypeTab() {
    if (!typeTabsContainer) return;
    typeTabsContainer.querySelectorAll('.type-task-tab').forEach(tab => {
        const isActive = tab.dataset.type === currentFilters.typeTask;
        tab.classList.toggle('active', isActive);
    });
}

/**
 * Cập nhật số lượng task trên các tab loại task.
 */
function updateTypeTaskCounts() {
    if (!typeTabsContainer) return;
    typeTabsContainer.querySelectorAll('.type-task-tab').forEach(tab => {
        const typeId = tab.dataset.type;
        const currentGroup = allGroupedTasks.find(g => g.id === currentFilters.groupId);
        let count = 0;
        if (currentGroup && currentGroup.tasks) {
            count = currentGroup.tasks.filter(task => task.typeTask === typeId).length;
        }
        const countSpan = tab.querySelector('.task-type-count');
        if (countSpan) countSpan.textContent = count;
    });
}

/**
 * Render các tab lọc theo loại task (Product, Fixed, CTM).
 */
function renderTypeTaskTabs() {
    if (!typeTabsContainer) return;
    typeTabsContainer.className = 'flex-shrink-0 w-28 bg-slate-50 border-l border-slate-200 p-2 flex flex-col gap-2 overflow-y-auto';
    
    const types = [
        { id: 'Related', name: 'Gần đây', colorClasses: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200', icon: 'fas fa-history' },
        { id: 'CTM', name: 'CTM', colorClasses: 'bg-slate-200 text-slate-800 hover:bg-slate-300' },
        { id: 'Fixed', name: 'Fixed (F)', colorClasses: 'bg-green-100 text-green-800 hover:bg-green-200' },
        { id: 'Product', name: 'Product (P)', colorClasses: 'bg-amber-100 text-amber-800 hover:bg-amber-200' }
    ];
    
    typeTabsContainer.innerHTML = types.map(type => {
        // Calculate the count of tasks for the current type within this map iteration
        let count = 0;
        if (type.id !== 'Related' && allGroupedTasks.length > 0 && currentFilters.groupId) {
            const currentGroup = allGroupedTasks.find(g => g.id === currentFilters.groupId);
            if (currentGroup && currentGroup.tasks) {
                count = currentGroup.tasks.filter(task => task.typeTask === type.id).length;
            }
        }
        
        const contentHTML = type.icon
            ? `<i class="${type.icon} text-xl"></i><span class="font-semibold text-sm mt-1">${type.name}</span>`
            : `<span class="font-bold text-lg">${type.id}</span><span class="task-type-count text-sm font-medium text-slate-600">${count}</span>`;
            
        return `
            <button class="type-task-tab flex flex-col items-center justify-center w-full h-20 p-1 rounded-lg border-2 border-transparent shadow-sm cursor-pointer transition-all duration-200 ${type.colorClasses}" data-type="${type.id}" title="${type.name}">
                ${contentHTML}
            </button>
        `
    }).join('');

    typeTabsContainer.querySelectorAll('.type-task-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const clickedType = tab.dataset.type;
            // Nếu click vào tab đang active, hủy chọn nó (quay về 'All')
            // Ngược lại, chọn tab mới
            if (currentFilters.typeTask === clickedType) {
                currentFilters.typeTask = 'All';
            } else {
                currentFilters.typeTask = clickedType;
            }
            renderTaskGrid();
        });
    });
    updateTypeTaskCounts(); // Gọi hàm cập nhật số lượng sau khi render HTML
    updateActiveTypeTab();
}

/**
 * Render lưới các task cho một nhóm cụ thể ở khu vực bên phải.
 */
function renderTaskGrid() {
    // Cập nhật số lượng task trên các tab loại task mỗi khi render lại lưới
    updateTypeTaskCounts();

    updateActiveTypeTab(); // Thêm dòng này để đảm bảo tab luôn được cập nhật
    if (!taskGridContainer) return;

    const group = allGroupedTasks.find(g => g.id === currentFilters.groupId);
    if (!group) {
        taskGridContainer.innerHTML = '<p class="text-center text-red-500">Lỗi: Không tìm thấy nhóm.</p>';
        return;
    }

    taskGridContainer.innerHTML = ''; // Xóa nội dung cũ

    const searchTerm = document.getElementById('task-library-search')?.value.toLowerCase() || '';
    
    // Xử lý trường hợp đặc biệt cho tab "Related"
    if (currentFilters.typeTask === 'Related') {
        renderRecentlyUsedTasks(searchTerm);
        return;
    }

    let filteredTasks = group.tasks;

    // Lọc theo loại task
    if (currentFilters.typeTask !== 'All') {
        filteredTasks = filteredTasks.filter(task => task.typeTask === currentFilters.typeTask);
    }
    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(task => task.name.toLowerCase().includes(searchTerm));
    }

    if (filteredTasks.length > 0) {
        // Sắp xếp task theo 'order' trước khi render
        const sortedTasks = [...filteredTasks].sort((a, b) => (a.order || 0) - (b.order || 0));
        sortedTasks.forEach(task => {
            const color = (group.color && group.color.bg) ? group.color : defaultColor;
            const taskItem = document.createElement('div');
            const generatedCode = `1${group.order}${String(task.order).padStart(2, '0')}`;

            // Áp dụng class Tailwind tĩnh và màu sắc qua inline style
            taskItem.className = `task-library-item relative group border-2 text-xs p-1 rounded-md shadow-sm cursor-grab flex flex-col justify-between items-center text-center`;
            taskItem.dataset.taskCode = generatedCode; // Gán mã task đã tạo vào dataset
            taskItem.dataset.groupId = group.id; // Thêm groupId để xác định màu sắc
            taskItem.style.backgroundColor = color.bg;
            taskItem.style.color = color.text;
            taskItem.style.borderColor = color.border;

            taskItem.innerHTML = `
                <div class="flex-grow flex flex-col justify-center">
                    <span class="overflow-hidden text-ellipsis">${task.name}</span>
                </div>
                <span class="font-semibold mt-auto">${generatedCode}</span>
            `;
            taskGridContainer.appendChild(taskItem);
        });

        // Khởi tạo SortableJS cho danh sách task để có thể kéo đi
        Sortable.create(taskGridContainer, {
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
        const message = searchTerm
            ? `Không tìm thấy task nào với tên "${searchTerm}".`
            : 'Không có công việc trong nhóm này.';
        taskGridContainer.innerHTML = `<p class="text-sm text-gray-500 text-center mt-4 col-span-full">${message}</p>`;
    }

    // Cập nhật trạng thái active cho tab loại task
    updateActiveTypeTab();
}

/**
 * Tải 16 task được người dùng hiện tại hoàn thành gần đây nhất.
 */
async function fetchRecentlyUsedTasks() {
    const currentUser = window.currentUser;
    if (!currentUser || !currentUser.id) {
        recentlyUsedTasks = [];
        return;
    }

    try {
        // Truy vấn collection 'schedules' để tìm các task đã hoàn thành bởi người dùng này
        const q = query(
            collection(db, 'schedules'),
            where('tasks', 'array-contains-any', [
                { completingUserId: currentUser.id, isComplete: 1 }
            ]),
            orderBy('date', 'desc'), // Sắp xếp theo ngày gần nhất
            limit(50) // Lấy 50 lịch trình gần nhất để đảm bảo có đủ 16 task
        );

        const querySnapshot = await getDocs(q);
        const recentTasksSet = new Map(); // Dùng Map để tránh trùng lặp task

        querySnapshot.forEach(doc => {
            const schedule = doc.data();
            (schedule.tasks || []).forEach(task => {
                if (task.isComplete === 1 && task.completingUserId === currentUser.id && recentTasksSet.size < 16) {
                    const uniqueTaskId = `${task.groupId}-${task.taskCode}`;
                    if (!recentTasksSet.has(uniqueTaskId)) {
                        recentTasksSet.set(uniqueTaskId, task);
                    }
                }
            });
        });

        recentlyUsedTasks = Array.from(recentTasksSet.values());
    } catch (error) {
        console.error("Lỗi khi tải các task đã dùng gần đây:", error);
        recentlyUsedTasks = [];
    }
}

/**
 * Render các task đã sử dụng gần đây.
 * @param {string} searchTerm - Từ khóa tìm kiếm.
 */
function renderRecentlyUsedTasks(searchTerm) {
    if (!taskGridContainer) return;
    taskGridContainer.innerHTML = '';

    let tasksToRender = recentlyUsedTasks.filter(task => 
        task.name.toLowerCase().includes(searchTerm)
    );

    if (tasksToRender.length > 0) {
        tasksToRender.forEach(task => renderSingleTask(task, taskGridContainer));
        initializeSortableForGrid(taskGridContainer);
    } else {
        taskGridContainer.innerHTML = `<p class="text-sm text-gray-500 text-center mt-4 col-span-full">Không có công việc nào được sử dụng gần đây.</p>`;
    }
}
/**
 * Đặt vị trí mặc định cho menu.
 * Được gọi khi khởi tạo và khi không có trạng thái nào được lưu.
 */
function setDefaultPosition() {
    if (!menuContainer) return;
    // Reset các style cũ để đảm bảo CSS có thể áp dụng
    menuContainer.style.left = '';
    menuContainer.style.top = '';
    // Áp dụng vị trí mặc định
    menuContainer.style.bottom = '20px';
    menuContainer.style.left = '20px';
}

/**
 * Xóa các thuộc tính vị trí mặc định (bottom, right)
 * để cho phép định vị bằng left/top khi kéo thả.
 */
function clearDefaultPosition() {
    if (!menuContainer) return;
    menuContainer.style.bottom = '';
    menuContainer.style.right = '';
}

/**
 * Hàm này sẽ được gọi khi người dùng bắt đầu kéo menu.
 * Nó đảm bảo menu sẽ được định vị bằng `left` và `top`.
 */

/**
 * Lưu trạng thái của menu (vị trí, trạng thái mở rộng) vào localStorage.
 */
function saveMenuState() {
    if (!menuContainer) return;
    const state = {
        left: menuContainer.style.left,
        top: menuContainer.style.top,
        expanded: menuContainer.classList.contains('expanded')
    };
    localStorage.setItem('taskLibraryState', JSON.stringify(state));
}

/**
 * Tải trạng thái từ localStorage và áp dụng cho menu.
 * Chỉ được gọi một lần khi menu hiển thị lần đầu.
 */
function loadMenuState() {
    const savedState = localStorage.getItem('taskLibraryState');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            if (state.left && state.top) { // Chỉ áp dụng nếu cả hai đều có giá trị
                // Quan trọng: Xóa vị trí mặc định trước khi áp dụng vị trí đã lưu
                clearDefaultPosition();
                menuContainer.style.left = state.left;
                menuContainer.style.top = state.top;
            }
            if (state.expanded) {
                menuContainer.classList.add('expanded');
            }
        } catch (e) {
            console.error("Lỗi khi đọc trạng thái Task Library từ localStorage", e);
        }
    }
    isStateLoaded = true; // Đánh dấu là đã tải xong
}

export async function initializeTaskLibrary() {
    if (document.getElementById('task-library-container')) return; // Đã khởi tạo

    // Create and inject HTML
    menuContainer = document.createElement('div');
    menuContainer.id = 'task-library-container';
    menuContainer.classList.add('hidden'); // Ẩn component ngay từ khi khởi tạo
    menuContainer.innerHTML = `
        <div class="task-library-header">
            <div class="task-library-toggle-area flex items-center cursor-pointer">
                <span class="task-library-icon bg-indigo-600 text-white font-bold text-sm rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0"><i class="fas fa-book"></i></span>
                <span class="task-library-title ml-3 font-semibold text-slate-800 whitespace-nowrap opacity-0 transition-opacity ease-in">Thư Viện Task</span>
            </div>
            <div class="task-library-search-container">
                <div class="search-input-wrapper">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" id="task-library-search" placeholder="Tìm theo tên task...">
                </div>
            </div>
        </div>
        <div class="task-library-body opacity-0 invisible flex flex-row">
            <div id="group-tabs-container" class="flex-shrink-0"></div>
            <div id="task-grid-container" class="flex-grow"></div>
            <div id="type-tabs-container" class="flex-shrink-0"></div>
        </div>
    `;
    document.body.appendChild(menuContainer);

    const header = menuContainer.querySelector('.task-library-header');
    const menuBody = menuContainer.querySelector('.task-library-body');
    const menuTitle = menuContainer.querySelector('.task-library-title');
    const taskLibraryToggleArea = menuContainer.querySelector('.task-library-toggle-area');
    groupTabsContainer = menuContainer.querySelector('#group-tabs-container');
    taskGridContainer = menuContainer.querySelector('#task-grid-container');
    typeTabsContainer = menuContainer.querySelector('#type-tabs-container');

    // Đặt vị trí mặc định ngay khi khởi tạo
    setDefaultPosition();

    // --- Tải và render nội dung ---
    try {
        allGroupedTasks = await fetchAndGroupTasks();
        renderGroupTabs();
        renderTypeTaskTabs();
        await fetchRecentlyUsedTasks(); // Tải các task đã dùng gần đây
    } catch (error) {
        console.error("Lỗi khi tải thư viện công việc:", error);
        groupTabsContainer.innerHTML = '<p class="p-2 text-center text-xs text-red-500">Lỗi tải.</p>';
    }

    // --- Toggle expand/collapse ---
    // Sử dụng 'dblclick' để mở/đóng, tránh xung đột với sự kiện kéo-thả (mousedown/mouseup)
    taskLibraryToggleArea.addEventListener('dblclick', (e) => {
        // Chỉ cần toggle class 'expanded' trên container chính.
        // CSS sẽ tự động xử lý việc hiển thị/ẩn các phần tử con.
        menuContainer.classList.toggle('expanded');
        saveMenuState();
    });

    // --- Search logic ---
    const searchInput = document.getElementById('task-library-search');
    searchInput.addEventListener('input', () => {
        const activeTab = groupTabsContainer.querySelector('.group-tab.active');
        if (activeTab) {
            currentFilters.groupId = activeTab.dataset.groupId;
            renderTaskGrid();
        }
    });

    // --- Draggable logic ---
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    let ghostElement = null;

    const onDragStart = async (e) => {
        // Chỉ kéo bằng chuột trái và khi target là header
        if (e.button !== 0) return;

        // Nếu người dùng click vào ô tìm kiếm, không bắt đầu kéo.
        if (e.target.closest('.task-library-search-container')) {
            return;
        }

        if (!e.target.closest('.task-library-header')) return;

        // Xóa vị trí mặc định (bottom, left) để bắt đầu kéo bằng top/left
        clearDefaultPosition();

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
        // Chỉ thực thi khi đang kéo VÀ ghost element đã được tạo
        if (!isDragging || !ghostElement) return;
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
            // Xóa vị trí bottom/right để không bị xung đột
            clearDefaultPosition();
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

/**
 * Hiển thị Task Library.
 */
export function showTaskLibrary() {
    if (menuContainer) {
        // Chỉ tải trạng thái từ localStorage một lần duy nhất,
        // khi component được hiển thị lần đầu tiên.
        if (!isStateLoaded) {
            loadMenuState();
        }
        menuContainer.classList.remove('hidden');
    }
}

/**
 * Ẩn Task Library.
 */
export function hideTaskLibrary() {
    if (menuContainer) {
        menuContainer.classList.add('hidden');
    }
}