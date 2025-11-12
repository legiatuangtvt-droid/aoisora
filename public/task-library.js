import { db } from './firebase.js';
import { collection, getDocs, query, orderBy, where, limit, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { logTaskUsage } from './daily-templates-logic.js'; // Import hàm logTaskUsage
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
 * Xử lý sự kiện khi kéo-thả một task từ thư viện kết thúc.
 * Đây là nơi duy nhất sự kiện onEnd được kích hoạt khi clone.
 * @param {Event} evt - Sự kiện từ SortableJS.
 */
async function handleLibraryDragEnd(evt) {
    // evt.to là container đích mà task được thả vào.
    // Nếu không có container đích (kéo ra ngoài) hoặc thả vào chính nó, thì không làm gì cả.
    if (!evt.to || evt.to === evt.from) {
        return;
    }
    // Chỉ ghi nhận khi một task được sao chép (clone) thành công vào một ô hợp lệ.
    // evt.pullMode === 'clone' và evt.clone là phần tử được tạo ra ở đích.
    if (evt.pullMode === 'clone' && evt.clone) {
        const originalTaskItem = evt.item; // Phần tử gốc trong thư viện
        const groupId = originalTaskItem.dataset.groupId;
        const taskOrder = originalTaskItem.dataset.taskOrder;

        // 1. Ghi nhận việc sử dụng task và đợi cho đến khi hoàn tất
        await logTaskUsage(groupId, taskOrder);

        // 2. Tải lại danh sách các task được dùng nhiều nhất
        await fetchMostUsedTasks();

        // 3. Nếu tab "Gần đây" đang được chọn, render lại lưới để cập nhật giao diện
        if (currentFilters.typeTask === 'Related') {
            renderTaskGrid();
        }
    }
}
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
    groupTabsContainer.innerHTML = ''; // Xóa nội dung cũ để render lại

    if (allGroupedTasks.length === 0) {
        groupTabsContainer.innerHTML = '<p class="p-2 text-center text-xs text-slate-500">Không có nhóm nào.</p>';
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
            // Khi chọn một nhóm mới, luôn reset bộ lọc loại task về 'All'
            // để hiển thị tất cả các task trong nhóm đó.
            currentFilters.typeTask = 'All';

            // Thêm active class cho tab được click
            currentFilters.groupId = group.id;
            // FIX: Thêm class 'active' vào tab vừa được click
            tab.classList.add('active');
            renderTaskGrid();
        });
        groupTabsContainer.appendChild(tab);
    });
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
 * Render một task đơn lẻ vào container được chỉ định.
 * @param {object} task - Đối tượng task.
 * @param {HTMLElement} container - Container để render task vào.
 */
function renderSingleTask(task, container) {
    const group = allGroupedTasks.find(g => g.id === task.groupId);
    if (!group) return; // Bỏ qua nếu không tìm thấy nhóm

    const color = (group.color && group.color.bg) ? group.color : defaultColor;
    const taskItem = document.createElement('div');
    const generatedCode = `1${group.order}${String(task.order).padStart(2, '0')}`;

    taskItem.className = `task-library-item relative group border-2 text-xs p-1 rounded-md shadow-sm cursor-grab flex flex-col justify-between items-center text-center`;
    taskItem.dataset.taskCode = generatedCode;
    taskItem.dataset.taskOrder = task.order;
    taskItem.dataset.groupId = group.id;
    taskItem.style.backgroundColor = color.bg;
    taskItem.style.color = color.text;
    taskItem.style.borderColor = color.border;

    taskItem.innerHTML = `
        <div class="flex-grow flex flex-col justify-center">
            <span class="overflow-hidden text-ellipsis">${task.name}</span>
        </div>
        <span class="font-semibold mt-auto">${generatedCode}</span>
    `;
    container.appendChild(taskItem);
}

/**
 * Khởi tạo SortableJS cho một grid container.
 * @param {HTMLElement} gridContainer - Container của lưới task.
 */
function initializeSortableForGrid(gridContainer) {
    Sortable.create(gridContainer, {
        group: {
            name: 'template-tasks',
            pull: 'clone',
            put: false
        },
        sort: false,
        animation: 150,
        onEnd: handleLibraryDragEnd
    });
}

/**
 * Render lưới các task cho một nhóm cụ thể ở khu vực bên phải.
 */
function renderTaskGrid() {
    console.log(`[TaskLib] Bắt đầu render lưới. Filters: groupId=${currentFilters.groupId}, typeTask=${currentFilters.typeTask}`);
    // Cập nhật số lượng task trên các tab loại task mỗi khi render lại lưới
    updateTypeTaskCounts();

    updateActiveTypeTab(); // Thêm dòng này để đảm bảo tab luôn được cập nhật
    if (!taskGridContainer) return;

    const group = allGroupedTasks.find(g => g.id === currentFilters.groupId);
    
    // Xử lý trường hợp đặc biệt cho tab "Related"
    if (currentFilters.typeTask === 'Related') {
        console.log('[TaskLib] Chế độ "Related". Gọi renderRecentlyUsedTasks().');
        const searchTerm = document.getElementById('task-library-search')?.value.toLowerCase() || '';
        renderRecentlyUsedTasks(searchTerm);
        return;
    }

    if (!group) {
        // Nếu không tìm thấy nhóm (ví dụ: khi vừa mở thư viện và chưa chọn nhóm nào),
        // không làm gì cả hoặc hiển thị thông báo.
        taskGridContainer.innerHTML = `<p class="text-sm text-gray-500 text-center mt-4 col-span-full">Vui lòng chọn một nhóm để xem công việc.</p>`;
        return;
    }
    taskGridContainer.innerHTML = ''; // Xóa nội dung cũ

    const searchTerm = document.getElementById('task-library-search')?.value.toLowerCase() || '';
    
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
        sortedTasks.forEach(task => renderSingleTask({ ...task, groupId: group.id }, taskGridContainer));
        initializeSortableForGrid(taskGridContainer);
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
 * Tải 16 task được người dùng hiện tại sử dụng (kéo-thả) nhiều nhất.
 */
export async function fetchMostUsedTasks() {
    console.log('[TaskLib Fetch] 1. Bắt đầu tải các task được dùng nhiều nhất.');
    const currentUser = window.currentUser;
    if (!currentUser || !currentUser.id) {
        console.warn('[TaskLib Fetch] Lỗi: Không tìm thấy người dùng hiện tại.');
        recentlyUsedTasks = [];
        return;
    }

    try {
        const userStatsRef = doc(db, 'task_usage_stats', currentUser.id);
        const docSnap = await getDoc(userStatsRef);
        console.log('docSnap: ', docSnap.data());

        if (!docSnap.exists() || !docSnap.data().usageCounts) {
            console.log('[Related Tasks] Không có dữ liệu tần suất sử dụng cho người dùng này.');
            recentlyUsedTasks = []; // Đảm bảo mảng rỗng
            return;
        }

        const usageCounts = docSnap.data().usageCounts;

        // Chuyển map thành mảng, sắp xếp theo số lần sử dụng giảm dần và lấy 16 task đầu tiên
        const sortedTaskIds = Object.entries(usageCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 16)
            .map(([taskId]) => taskId);

        console.log('[TaskLib Fetch] 1.1. Các ID task được dùng nhiều nhất:', sortedTaskIds);

        // Lấy thông tin chi tiết của 16 task này từ `allGroupedTasks` đã được tải
        const mostUsedTasks = [];
        for (const taskId of sortedTaskIds) {
            const [groupId, taskCode] = taskId.split('__'); // Sử dụng dấu phân cách an toàn hơn
            const group = allGroupedTasks.find(g => g.id === groupId);
            if (group) {
                // Tìm task dựa trên taskCode (mã gốc, không phải mã đã генерується)
                // Cần đảm bảo taskCode trong `daily-templates-logic` là mã gốc.
                // taskCode ở đây chính là `order` của task trong nhóm.
                const task = group.tasks.find(t => String(t.order) === taskCode);
                if (task) {
                    mostUsedTasks.push({ ...task, groupId: group.id }); // Thêm groupId để render
                }
            }
        }

        recentlyUsedTasks = mostUsedTasks;
        console.log('[TaskLib Fetch] 1.2. Hoàn tất tải "Related Tasks". Kết quả:', recentlyUsedTasks);
    } catch (error) {
        console.error("Lỗi khi tải các task được dùng nhiều nhất:", error);
        recentlyUsedTasks = [];
    }
}

/**
 * Render các task đã sử dụng gần đây.
 * @param {string} searchTerm - Từ khóa tìm kiếm.
 */
function renderRecentlyUsedTasks(searchTerm) {
    console.log('[TaskLib Render] Đang render danh sách "Related Tasks".');
    if (!taskGridContainer) return;
    taskGridContainer.innerHTML = '';

    let tasksToRender = recentlyUsedTasks.filter(task => 
        task.name.toLowerCase().includes(searchTerm)
    );
    console.log('tasksToRender: ', tasksToRender)

    if (tasksToRender.length > 0) {
        console.log(`[TaskLib Render] Tìm thấy ${tasksToRender.length} task "Related". Bắt đầu render...`);
        // Sắp xếp các task theo tần suất sử dụng (đã được sắp xếp từ fetchMostUsedTasks)
        // và render từng task.
        tasksToRender.forEach(task => {
            renderSingleTask(task, taskGridContainer);
        });
        initializeSortableForGrid(taskGridContainer);
    } else {
        console.log('[TaskLib Render] Không tìm thấy task "Related" nào để hiển thị.');
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

    console.log('[TaskLib Init] Bắt đầu khởi tạo thư viện task...');
    // --- Tải và render nội dung ---
    // Thay đổi thứ tự: Tải tất cả dữ liệu trước, sau đó mới render
    try {
        // 1. Tải song song dữ liệu task và dữ liệu "Related"
        console.log('[TaskLib Init] Bắt đầu tải allGroupedTasks.');
        allGroupedTasks = await fetchAndGroupTasks();
        console.log('[TaskLib Init] Tải allGroupedTasks hoàn tất. Bắt đầu tải mostUsedTasks.');
        await fetchMostUsedTasks();
        console.log('[TaskLib Init] Tải mostUsedTasks hoàn tất. Dữ liệu đã sẵn sàng.');


        // 2. Render các thành phần giao diện
        console.log('[TaskLib Init] Bắt đầu render các thành phần UI (tabs).');
        renderGroupTabs();
        renderTypeTaskTabs();
        
        // 3. Render lưới task lần đầu tiên
        console.log('[TaskLib Init] Bắt đầu render lưới task lần đầu.');
        renderTaskGrid();
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