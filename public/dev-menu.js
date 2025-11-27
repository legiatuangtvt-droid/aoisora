import { db } from './firebase.js';
import { writeBatch, doc, serverTimestamp, collection, getDocs, query, orderBy, where, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
// --- FIX: Import các module tiện ích cần thiết ---
import './toast.js';
import './prompt-modal.js';
import './confirmation-modal.js';
// ----------------------------------------------------

let allRoles = [];
let allEmployees = [];
let allAreaManagers = [];
let allRegionalManagers = [];
let allPersonnel = []; // Mảng tổng hợp tất cả các cấp nhân viên
let allStores = [];
let allAreas = [];
let allRegions = [];

let simulatedUser = null;
const SIMULATED_USER_STORAGE_KEY = 'simulatedUser';

function initializeDevMenu() {
    // Create and inject HTML
    const menuContainer = document.createElement('div');
    menuContainer.id = 'dev-menu-container';
    menuContainer.innerHTML = `
        <div class="dev-menu-header flex items-center p-2.5 bg-slate-50 border-b border-slate-200 cursor-grab select-none h-[60px] box-border flex-shrink-0 active:cursor-grabbing">
            <span class="dev-menu-icon bg-emerald-500 text-white font-bold text-sm rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">DEV</span>
            <span class="dev-menu-title ml-3 font-semibold text-slate-800 whitespace-nowrap opacity-0 transition-opacity ease-in">Công cụ Dev</span>
        </div>
        <div class="dev-menu-body p-3 flex flex-col gap-2 opacity-0 invisible transition-opacity delay-100">
            <button id="seed-all-data-btn" class="dev-menu-button flex items-center gap-2.5 px-3 py-2 border border-slate-300 rounded-md bg-white cursor-pointer text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-400">
                <i class="fas fa-database"></i>
                <span>Nhập Dữ Liệu Mô Phỏng</span>
            </button>
            <button id="apply-template-all-stores-btn" class="dev-menu-button flex items-center gap-2.5 px-3 py-2 border border-slate-300 rounded-md bg-white cursor-pointer text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-400">
                <i class="fas fa-store"></i>
                <span>Áp dụng Template</span>
            </button>
            <button id="recalculate-exp-btn" class="dev-menu-button flex items-center gap-2.5 px-3 py-2 border border-slate-300 rounded-md bg-white cursor-pointer text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-400">
                <i class="fas fa-calculator text-amber-500"></i>
                <span>Tính lại EXP Toàn bộ</span>
            </button>
            <div class="border-t border-slate-200 my-2"></div>
            <div class="dev-menu-title-section">Mô phỏng người dùng</div>
            <div class="dev-menu-section">
                <label for="dev-role-select" class="dev-menu-label"><i class="fas fa-user-tag mr-2 text-slate-500"></i>Chức vụ</label>
                <select id="dev-role-select" class="dev-menu-select"></select>
            </div>
            <div class="dev-menu-section">
                <label for="dev-employee-select" class="dev-menu-label"><i class="fas fa-user mr-2 text-slate-500"></i>Nhân viên</label>
                <select id="dev-employee-select" class="dev-menu-select"></select>
            </div>
            <button id="clear-simulation-btn" class="dev-menu-button flex items-center gap-2.5 px-3 py-2 border border-slate-300 rounded-md bg-white cursor-pointer text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-400">
                <i class="fas fa-times-circle"></i>
                <span>Xóa Mô Phỏng</span>
            </button>
        </div>
    `;
    document.body.appendChild(menuContainer);

    // Add functionality
    const header = menuContainer.querySelector('.dev-menu-header');
    const seedAllDataBtn = document.getElementById('seed-all-data-btn');
    const applyTemplateBtn = document.getElementById('apply-template-all-stores-btn');
    const recalculateExpBtn = document.getElementById('recalculate-exp-btn');
    const menuBody = menuContainer.querySelector('.dev-menu-body');
    const menuTitle = menuContainer.querySelector('.dev-menu-title');
    const roleSelect = document.getElementById('dev-role-select');
    const clearSimulationBtn = document.getElementById('clear-simulation-btn');
    const employeeSelect = document.getElementById('dev-employee-select');


    // --- Logic lưu/tải trạng thái từ localStorage ---
    const DEV_MENU_STORAGE_KEY = 'devMenuState';

    function saveMenuState() {
        if (!menuContainer) return;
        const state = {
            left: menuContainer.style.left,
            top: menuContainer.style.top,
            expanded: menuContainer.classList.contains('expanded')
        };
        localStorage.setItem(DEV_MENU_STORAGE_KEY, JSON.stringify(state));
    }

    function loadMenuState() {
        const savedState = localStorage.getItem(DEV_MENU_STORAGE_KEY);
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                // Áp dụng vị trí
                if (state.left) menuContainer.style.left = state.left;
                if (state.top) menuContainer.style.top = state.top;

                // Bỏ qua việc tải trạng thái mở/đóng, luôn khởi động ở trạng thái thu gọn.
                
                // Đảm bảo menu không bị ra ngoài màn hình khi tải lại
                const rect = menuContainer.getBoundingClientRect();
                menuContainer.style.left = `${Math.max(0, Math.min(rect.left, window.innerWidth - rect.width))}px`;
                menuContainer.style.top = `${Math.max(0, Math.min(rect.top, window.innerHeight - rect.height))}px`;
            } catch (e) {
                console.error("Lỗi khi đọc trạng thái Dev Menu từ localStorage", e);
            }
        }
    }

    // --- Toggle expand/collapse ---
    header.addEventListener('click', (e) => {
        // Only toggle if not dragging
        if (menuContainer.dataset.isDragging !== 'true') {
            const isCurrentlyExpanded = menuContainer.classList.contains('expanded');

            if (isCurrentlyExpanded) {
                // --- LOGIC THU GỌN ---
                menuBody.classList.add('opacity-0', 'invisible');
                menuTitle.classList.add('opacity-0');
                menuContainer.classList.remove('expanded');

                // Khôi phục vị trí ban đầu nếu nó đã bị di chuyển
                if (menuContainer.dataset.originalLeft) {
                    menuContainer.style.left = menuContainer.dataset.originalLeft;
                    delete menuContainer.dataset.originalLeft;
                }
                if (menuContainer.dataset.originalTop) {
                    menuContainer.style.top = menuContainer.dataset.originalTop;
                    delete menuContainer.dataset.originalTop;
                }
            } else {
                // --- LOGIC MỞ RỘNG ---
                menuBody.classList.remove('opacity-0', 'invisible');
                menuTitle.classList.remove('opacity-0');
                menuContainer.classList.add('expanded');

                // Xử lý chống tràn màn hình khi mở rộng
                const menuRect = menuContainer.getBoundingClientRect();
                const expandedWidth = 250; // Chiều rộng của menu khi mở rộng
                const expandedHeight = 200; // Chiều cao ước tính

                if (menuRect.right > window.innerWidth) {
                    menuContainer.dataset.originalLeft = menuContainer.style.left;
                    menuContainer.style.left = `${window.innerWidth - expandedWidth - 20}px`;
                }
                if (menuRect.bottom > window.innerHeight) {
                    menuContainer.dataset.originalTop = menuContainer.style.top;
                    menuContainer.style.top = `${window.innerHeight - expandedHeight - 20}px`;
                }
            }

            saveMenuState(); // Lưu trạng thái sau khi mở/đóng
        }
    });

    // --- Draggable logic ---
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    let ghostElement = null; // Phần tử "ảnh" khi kéo

    header.addEventListener('mousedown', (e) => {
        // Chỉ kéo bằng chuột trái
        if (e.button !== 0) return;

        isDragging = true;
        menuContainer.dataset.isDragging = 'true';
        header.style.cursor = 'grabbing';

        const rect = menuContainer.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = rect.left;
        initialTop = rect.top;

        // --- TẠO GHOST ELEMENT (Tối ưu) ---
        // Nếu menu đang thu gọn, chỉ clone header để ghost là hình tròn.
        // Nếu menu đang mở rộng, clone toàn bộ.
        if (menuContainer.classList.contains('expanded')) {
            ghostElement = menuContainer.cloneNode(true);
        } else {
            ghostElement = header.cloneNode(true);
            ghostElement.style.width = `${rect.width}px`;
            ghostElement.style.height = `${rect.height}px`;
            ghostElement.style.borderRadius = '9999px'; // Thêm dòng này để đảm bảo ghost là hình tròn
        }
        ghostElement.id = 'dev-menu-ghost';
        ghostElement.style.left = `${initialLeft}px`;
        ghostElement.style.top = `${initialTop}px`;
        document.body.appendChild(ghostElement);

        menuContainer.classList.add('dragging'); // Làm mờ menu gốc

        // Ngăn chặn việc chọn văn bản khi kéo
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            // Di chuyển ghost element theo chuột
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            let newX = initialLeft + dx;
            let newY = initialTop + dy;

            // Giữ ghost trong màn hình
            const ghostRect = ghostElement.getBoundingClientRect();
            newX = Math.max(0, Math.min(newX, window.innerWidth - ghostRect.width));
            newY = Math.max(0, Math.min(newY, window.innerHeight - ghostRect.height));

            ghostElement.style.left = `${newX}px`;
            ghostElement.style.top = `${newY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            // Di chuyển menu thật đến vị trí của ghost và xóa ghost
            const ghostRect = ghostElement.getBoundingClientRect();
            menuContainer.style.left = `${ghostRect.left}px`;
            menuContainer.style.top = `${ghostRect.top}px`;
            menuContainer.style.bottom = 'auto';
            menuContainer.style.right = 'auto';
            
            saveMenuState(); // Lưu vị trí sau khi kéo thả

            document.body.removeChild(ghostElement);
            ghostElement = null;
            menuContainer.classList.remove('dragging');

            isDragging = false;
            header.style.cursor = 'grab';
            // Use a timeout to differentiate click from drag-end
            setTimeout(() => {
                menuContainer.dataset.isDragging = 'false';
            }, 100);
        }
    });

    // Tải trạng thái đã lưu khi khởi tạo
    loadMenuState();

    // --- Logic mô phỏng người dùng ---
    async function fetchPersonnelData() {
        // Vô hiệu hóa select để tránh người dùng tương tác khi đang tải
        roleSelect.disabled = true;
        employeeSelect.disabled = true;

        try {
            const rolesQuery = query(collection(db, 'roles'), orderBy('name'));
        const [rolesSnap, employeesSnap, areaManagersSnap, regionalManagersSnap, storesSnap, areasSnap, regionsSnap] = await Promise.all([
                getDocs(rolesQuery),
                getDocs(collection(db, 'employee')),
                getDocs(collection(db, 'area_managers')),
            getDocs(collection(db, 'regional_managers')),
            getDocs(collection(db, 'stores')),
            getDocs(collection(db, 'areas')),
            getDocs(collection(db, 'regions')),
            ]);

            allRoles = rolesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            allEmployees = employeesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            allAreaManagers = areaManagersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            allRegionalManagers = regionalManagersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allStores = storesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allAreas = areasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allRegions = regionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            allPersonnel = [...allEmployees, ...allAreaManagers, ...allRegionalManagers];

            populateRoleSelect();
            populateEmployeeSelect();

            // Kiểm tra nếu có người dùng đang được mô phỏng và pre-select dropdowns
            const storedSimulatedUser = localStorage.getItem(SIMULATED_USER_STORAGE_KEY);
            if (storedSimulatedUser) {
                simulatedUser = JSON.parse(storedSimulatedUser);
                if (simulatedUser && simulatedUser.id && simulatedUser.roleId) {
                    roleSelect.value = simulatedUser.roleId;
                    populateEmployeeSelect(simulatedUser.roleId); // Cập nhật danh sách nhân viên đã lọc
                    employeeSelect.value = simulatedUser.id;
                    window.showToast(`Đang mô phỏng: ${simulatedUser.name} (${simulatedUser.roleId})`, 'info');
                }
            } else { // Nếu không có người dùng mô phỏng, mặc định là Admin
                roleSelect.value = 'ADMIN'; // Đặt giá trị mặc định là 'ADMIN'
                employeeSelect.value = '';
                window.showToast('Đang ở chế độ Admin (toàn quyền).', 'info');
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu nhân sự cho Dev Menu:", error);
            roleSelect.innerHTML = `<option>Lỗi tải</option>`;
            employeeSelect.innerHTML = `<option>Lỗi tải</option>`;
        } finally {
            // Kích hoạt lại select sau khi tải xong (dù thành công hay thất bại)
            roleSelect.disabled = false;
            employeeSelect.disabled = false;
        }
    }

    function populateRoleSelect() {
        // Sắp xếp vai trò theo 'level' giảm dần. Vai trò không có level sẽ được coi là 0.
        const sortedRoles = [...allRoles].sort((a, b) => (b.level || 0) - (a.level || 0));
        roleSelect.innerHTML = `<option value="ADMIN">Admin (Toàn quyền)</option>`;
        sortedRoles.forEach(role => {
            roleSelect.innerHTML += `<option value="${role.id}">${role.name}</option>`;
        });
    }

    function populateEmployeeSelect(selectedRoleId = 'all') {
        const filteredPersonnel = (selectedRoleId === 'all')
            ? [...allPersonnel] // Nếu là 'all', lấy tất cả nhân viên
            : allPersonnel.filter(p => p.roleId === selectedRoleId); // Lọc theo roleId

        // Sắp xếp danh sách: ưu tiên nhóm theo cửa hàng, sau đó sắp xếp theo tên
        filteredPersonnel.sort((a, b) => {
            // Xử lý trường hợp nhân viên không có cửa hàng (ví dụ: quản lý cấp cao)
            const storeA = a.storeId || 'ZZZ'; // Đẩy những người không có cửa hàng xuống cuối
            const storeB = b.storeId || 'ZZZ';

            if (storeA < storeB) return -1;
            if (storeA > storeB) return 1;

            // Nếu cùng cửa hàng, sắp xếp theo tên
            return a.name.localeCompare(b.name, 'vi');
        });
    
        // Tạo HTML cho các option và cập nhật một lần để tối ưu hiệu năng
        const optionsHtml = filteredPersonnel.map(person => {
            let contextInfo = '';
            switch (person.roleId) {
                case 'STAFF':
                case 'STORE_LEADER_G2':
                case 'STORE_LEADER_G3':
                    const store = allStores.find(s => s.id === person.storeId);
                    if (store) contextInfo = ` - ${store.name}`;
                    break;
                case 'STORE_INCHARGE':
                    if (Array.isArray(person.managedStoreIds) && person.managedStoreIds.length > 0) {
                        const managedStoreNames = person.managedStoreIds.map(id => allStores.find(s => s.id === id)?.name).filter(Boolean);
                        if (managedStoreNames.length > 0) contextInfo = ` - (Quản lý: ${managedStoreNames.join(', ')})`;
                    }
                    break;
                case 'AREA_MANAGER':
                    if (person.managedAreaIds && person.managedAreaIds.length > 0) {
                        const area = allAreas.find(a => a.id === person.managedAreaIds[0]);
                        if (area) contextInfo = ` - ${area.name}`;
                    }
                    break;
                case 'REGIONAL_MANAGER':
                    const region = allRegions.find(r => r.id === person.managedRegionId);
                    if (region) contextInfo = ` - ${region.name}`;
                    break;
            }
            return `<option value="${person.id}">${person.name}${contextInfo}</option>`;
        }).join('');
    
        employeeSelect.innerHTML = `<option value="">-- Chọn nhân viên --</option>${optionsHtml}`;
    }

    roleSelect.addEventListener('change', () => {
        const selectedRole = roleSelect.value;
        if (selectedRole === 'ADMIN') {
            // Nếu chọn Admin, xóa mô phỏng và tải lại trang
            if (localStorage.getItem(SIMULATED_USER_STORAGE_KEY)) {
                localStorage.removeItem(SIMULATED_USER_STORAGE_KEY);
                window.location.reload();
            }
        } else {
            populateEmployeeSelect(selectedRole);
        }
    });

    employeeSelect.addEventListener('change', () => {
        const selectedEmployeeId = employeeSelect.value;
        if (selectedEmployeeId) {
            const selectedPerson = allPersonnel.find(p => p.id === selectedEmployeeId);
            if (selectedPerson) { // Lưu toàn bộ thông tin cần thiết của người dùng mô phỏng
                simulatedUser = {
                    id: selectedPerson.id,
                    name: selectedPerson.name,
                    roleId: selectedPerson.roleId,
                    storeId: selectedPerson.storeId || null, // Thêm dòng này
                    managedAreaIds: selectedPerson.managedAreaIds || null,
                    managedRegionId: selectedPerson.managedRegionId || null,
                    managedStoreIds: selectedPerson.managedStoreIds || null, // Bổ sung trường còn thiếu
                    experiencePoints: selectedPerson.experiencePoints || 0 // FIX: Thêm experiencePoints
                };
                localStorage.setItem(SIMULATED_USER_STORAGE_KEY, JSON.stringify(simulatedUser));
                window.showToast(`Chuyển sang người dùng: ${selectedPerson.name} (${selectedPerson.roleId})`, 'info');

                window.location.href = 'daily-schedule.html'; // Luôn điều hướng đến trang lịch hàng ngày
            }
        }
    });

    // Xử lý nút "Xóa Mô Phỏng"
    clearSimulationBtn.addEventListener('click', () => {
        if (localStorage.getItem(SIMULATED_USER_STORAGE_KEY)) {
            localStorage.removeItem(SIMULATED_USER_STORAGE_KEY);
            simulatedUser = null;
            window.showToast('Đã quay lại chế độ Admin.', 'info');
            window.location.href = 'daily-schedule.html'; // Quay về trang lịch ngày mặc định
        } else {
            window.showToast('Không có người dùng nào đang được mô phỏng.', 'warning');
        }
    });

    if (applyTemplateBtn) {
        applyTemplateBtn.addEventListener('click', applyTemplateToAllStores);
    }

    if (recalculateExpBtn) {
        recalculateExpBtn.addEventListener('click', reCalculateAllEmployeeExp);
    }

    fetchPersonnelData();

    // --- Seed data logic ---
    seedAllDataBtn.addEventListener('click', async () => {
        // Loại bỏ hộp thoại xác nhận theo yêu cầu, thay bằng toast.
        window.showToast('Bắt đầu nhập dữ liệu mô phỏng...', 'info');

        try {
            const dataFiles = [
                'data-roles.json',
                'data-employee.json',
                'data-area_managers.json',
                'data-regional_managers.json',
                'data-stores.json',
                'data-areas.json',
                'data-regions.json',
                'data-employee_statuses.json',
                'data-store_statuses.json',
                'data-work_positions.json',
                'data-daily_templates.json',
                'data-task_groups.json'
            ];

            const fetchPromises = dataFiles.map(file =>
                fetch(file).then(res => {
                    if (!res.ok) throw new Error(`Không thể tải tệp ${file}`);
                    return res.json();
                })
            );

            const allDataArray = await Promise.all(fetchPromises);
            const data = allDataArray.reduce((acc, current) => ({ ...acc, ...current }), {});
            // --- Bước 1: Xóa dữ liệu cũ ---
            window.showToast('Bước 1/2: Đang xóa dữ liệu cũ...', 'info');
            const collectionsToDelete = [
                'daily_templates',
                'staff', 
                'staff_statuses', 
                'task_groups', 
                'roles', 
                'stores', 
                'store_statuses', 
                'employee', 
                'area_managers', 
                'regional_managers', 
                'areas', 
                'regions', 
                'employee_statuses',
                'staff_availability', 
                'work_assignments', 
                'work_positions',
                'monthly_plans' // Xóa dữ liệu kế hoạch tháng để reset quy trình
            ];
            
            const batch = writeBatch(db); // Sử dụng một batch duy nhất
            for (const collName of collectionsToDelete) {
                // Bỏ qua nếu collection không tồn tại trong data.json để tránh lỗi không cần thiết
                if (data[collName] === undefined && !['staff', 'staff_statuses', 'monthly_plans'].includes(collName)) continue;

                const collRef = collection(db, collName);
                const snapshot = await getDocs(collRef);
                snapshot.forEach(doc => {
                    batch.delete(doc.ref); // Thêm thao tác xóa vào batch chung
                });
            }

            // --- Bước 2: Nhập dữ liệu mới ---
            window.showToast('Bước 2/2: Đang nhập dữ liệu mới...', 'info');

            // Hàm trợ giúp để seed một collection
            const seedCollection = (collectionName, items) => {
                items?.forEach(item => { // Ưu tiên sử dụng trường 'id' làm document ID.
                    if (!item.id) return;

                    const docRef = doc(db, collectionName, item.id);
                    const dataToSet = { ...item };
                    delete dataToSet.id; // Xóa trường id khỏi dữ liệu lưu trữ vì nó đã được dùng làm key

                    // Xử lý đặc biệt cho daily_templates để sử dụng serverTimestamp
                    if (collectionName === 'daily_templates') {
                        delete dataToSet.createdAt; // Xóa chuỗi timestamp từ JSON
                        delete dataToSet.updatedAt; // Xóa chuỗi timestamp từ JSON
                        batch.set(docRef, {
                            ...dataToSet,
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                        });
                    } else {
                        batch.set(docRef, { ...dataToSet, createdAt: serverTimestamp() });
                    }
                });
            };

            // Seed Stores
            data.stores?.forEach(store => {
                if (store.id && store.name) {
                    const docRef = doc(db, 'stores', store.id);
                    batch.set(docRef, {
                        name: store.name,
                        areaId: store.areaId || '',
                        address: store.address || '',
                        status: store.status || 'ACTIVE'
                    });
                }
            });

            // Seed các collection còn lại
            seedCollection('roles', data.roles);
            seedCollection('employee', data.employee);
            seedCollection('area_managers', data.area_managers);
            seedCollection('regional_managers', data.regional_managers);
            seedCollection('areas', data.areas);
            seedCollection('regions', data.regions);
            seedCollection('employee_statuses', data.employee_statuses);
            seedCollection('store_statuses', data.store_statuses);            
            seedCollection('task_groups', data.task_groups);
            seedCollection('daily_templates', data.daily_templates);
            seedCollection('work_positions', data.work_positions);

            await batch.commit(); // Commit tất cả các thay đổi (xóa và thêm) trong một lần
            window.showToast('Hoàn tất! Đã nhập toàn bộ dữ liệu mẫu.', 'success', 4000);
        } catch (error) {
            console.error("Lỗi khi nhập dữ liệu mẫu: ", error);
            window.showToast("Lỗi khi nhập dữ liệu. Vui lòng kiểm tra console.", "error");
        }
    });
}

/**
 * Định dạng một đối tượng Date thành chuỗi YYYY-MM-DD theo giờ địa phương.
 * @param {Date} date - Đối tượng Date.
 * @returns {string} Chuỗi ngày tháng.
 */
function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Áp dụng một template được chọn cho tất cả các cửa hàng vào một ngày cụ thể.
 * Chức năng này được kích hoạt từ Dev Menu.
 */
async function applyTemplateToAllStores() {

    const btn = document.getElementById('apply-template-all-stores-btn');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Đang xử lý...';

    try {
        // 1. Lấy danh sách templates
        const templatesSnap = await getDocs(query(collection(db, 'daily_templates'), orderBy('name')));
        const allTemplates = templatesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const templateNames = allTemplates.map(t => t.name).join(', ');

        // Lấy tên mẫu đầu tiên làm giá trị mặc định
        const defaultTemplateName = allTemplates.length > 0 ? allTemplates[0].name : '';

        // 2. Yêu cầu người dùng nhập tên template
        const templateName = await window.showPrompt(
            `Nhập tên mẫu. Các mẫu có sẵn: ${templateNames}`,
            'Chọn mẫu lịch trình',
            defaultTemplateName // Mặc định là mẫu đầu tiên trong danh sách
        );

        if (!templateName) {
            window.showToast('Hủy thao tác.', 'info');
            return;
        }

        const template = allTemplates.find(t => t.name.toLowerCase() === templateName.toLowerCase().trim());
        if (!template || !template.schedule || !template.shiftMappings) {
            throw new Error(`Template "${templateName}" không hợp lệ hoặc không có dữ liệu ca làm việc.`);
        }

        // 3. Yêu cầu người dùng nhập ngày
        const dateString = await window.showPrompt(
            'Nhập ngày bạn muốn tạo lịch (YYYY-MM-DD):',
            'Áp dụng Lịch trình cho tất cả cửa hàng',
            formatLocalDate(new Date()) // Gợi ý ngày hôm nay theo giờ địa phương
        );

        if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            window.showToast('Ngày không hợp lệ. Vui lòng nhập theo định dạng YYYY-MM-DD.', 'error');
            return;
        }

        // --- LOGIC MỚI: Xác định trạng thái hoàn thành dựa trên ngày ---
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt về 0 giờ để so sánh ngày chính xác

        // Chuyển đổi chuỗi ngày nhập vào thành đối tượng Date
        const [year, month, day] = dateString.split('-').map(Number);
        const scheduleDate = new Date(year, month - 1, day);

        const isCompleteValue = scheduleDate < today ? 1 : 0;

        // Hỏi xác nhận trước khi xóa và tạo mới
        const confirmed = await window.showConfirmation(
            `Bạn có chắc chắn muốn XÓA TẤT CẢ lịch làm việc của ngày ${dateString} và tạo lại từ mẫu "${template.name}" không?`,
            'Xác nhận tạo lịch hàng loạt',
            'Xóa và Tạo mới',
            'Hủy'
        );

        if (!confirmed) {
            window.showToast('Đã hủy thao tác.', 'info');
            return;
        }

        // --- TẢI DỮ LIỆU BỔ SUNG CHO QUY TẮC 4 (CÂN BẰNG) ---
        // Tải lịch sử làm việc trong 2 tháng gần nhất để tính toán tỷ lệ hiện tại
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        const historyQuery = query(collection(db, 'schedules'),
            where('date', '>=', formatLocalDate(startDate)),
            where('date', '<=', formatLocalDate(endDate))
        );
        const [workPositionsSnap, historySnap, shiftCodesSnap] = await Promise.all([
            getDocs(collection(db, 'work_positions')),
            getDocs(historyQuery),
            getDoc(doc(db, 'system_configurations', 'shift_codes'))
        ]);
        const allWorkPositions = workPositionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const scheduleHistory = historySnap.docs.map(doc => doc.data());
        const allShiftCodes = shiftCodesSnap.exists() ? shiftCodesSnap.data().codes : [];

        // --- TÍNH TOÁN TỶ LỆ LÀM VIỆC HIỆN TẠI CHO TẤT CẢ NHÂN VIÊN (QUY TẮC 4) ---
        const employeePositionHours = new Map(); // Map<employeeId, Map<positionName, totalHours>>
        scheduleHistory.forEach(schedule => {
            const { employeeId, positionId, shift } = schedule;
            if (!employeeId || !positionId || !shift) return;

            const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === shift);
            if (!shiftInfo || !shiftInfo.duration) return; // Bỏ qua nếu không tìm thấy ca hoặc ca không có số giờ

            // Tìm tên vị trí từ ID
            const positionInfo = allWorkPositions.find(p => p.id === positionId);
            if (!positionInfo) return;
            const positionName = positionInfo.name;

            if (!employeePositionHours.has(employeeId)) {
                const positionMap = new Map();
                allWorkPositions.forEach(p => positionMap.set(p.name, 0));
                employeePositionHours.set(employeeId, positionMap);
            }

            const currentHoursMap = employeePositionHours.get(employeeId);
            if (currentHoursMap.has(positionName)) {
                currentHoursMap.set(positionName, currentHoursMap.get(positionName) + shiftInfo.duration);
            }
        });


        window.showToast(`Bắt đầu tạo lịch cho ngày ${dateString} từ mẫu "${template.name}"...`, 'info');

        // 4. Lấy dữ liệu cần thiết
        const { schedule: templateSchedule, shiftMappings } = template;
        const batch = writeBatch(db);

        // --- BƯỚC MỚI: Xóa tất cả lịch trình cũ trong ngày đã chọn ---
        const oldSchedulesQuery = query(collection(db, 'schedules'), where('date', '==', dateString));
        const oldSchedulesSnap = await getDocs(oldSchedulesQuery);
        oldSchedulesSnap.forEach(doc => batch.delete(doc.ref));
        if (!oldSchedulesSnap.empty) {
            window.showToast(`Đã xóa ${oldSchedulesSnap.size} lịch làm việc cũ của ngày ${dateString}.`, 'info');
        }

        const storesSnap = await getDocs(collection(db, 'stores'));
        const allStores = storesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const employeesSnap = await getDocs(collection(db, 'employee'));
        const allEmployees = employeesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Tải dữ liệu đăng ký ca của nhân viên cho ngày đã chọn (Quy tắc 5)
        const availabilityQuery = query(collection(db, 'staff_availability'), where('date', '==', dateString));
        const availabilitySnap = await getDocs(availabilityQuery);
        const allAvailabilities = availabilitySnap.docs.map(doc => doc.data());

        let schedulesCreatedCount = 0;

        // =================================================================================
        // LOGIC PHÂN CÔNG LỊCH LÀM VIỆC MỚI (ĐÃ SỬA LỖI)
        // Cách tiếp cận: Coi mỗi `shiftId` trong template là một "suất" cần được lấp đầy.
        // Việc phân công là tìm một nhân viên phù hợp cho mỗi "suất".
        // =================================================================================
        for (const store of allStores) {
            const storeEmployees = allEmployees.filter(emp => emp.storeId === store.id && emp.status === 'ACTIVE');
            if (storeEmployees.length === 0) continue;

            // Danh sách các "suất" làm việc cần được phân công, lấy từ template
            let slotsToFill = Object.keys(shiftMappings).map(shiftId => ({
                shiftId: shiftId,
                shiftCode: shiftMappings[shiftId].shiftCode,
                positionId: shiftMappings[shiftId].positionId,
                employeeId: null // Nhân viên sẽ được gán vào đây
            }));

            let availableEmployees = [...storeEmployees];

            // --- BƯỚC 1: PHÂN CÔNG VỊ TRÍ LEADER (QUY TẮC 2 & 3) ---
            const leaderSlots = slotsToFill.filter(slot => slot.positionId === 'LEADER' && !slot.employeeId);
            const leadersInStore = availableEmployees.filter(emp => emp.roleId.includes('LEADER'));

            if (leaderSlots.length > 0 && leadersInStore.length > 0) {
                let leaderIndex = 0;
                for (const slot of leaderSlots) {
                    const leaderToAssign = leadersInStore[leaderIndex % leadersInStore.length];
                    slot.employeeId = leaderToAssign.id;
                    // Loại leader đã được phân công ra khỏi danh sách nhân viên có sẵn để tránh bị phân công lại ở các bước sau
                    availableEmployees = availableEmployees.filter(emp => emp.id !== leaderToAssign.id);
                    leaderIndex++;
                }
            }

            // --- BƯỚC 2: PHÂN CÔNG THEO ĐĂNG KÝ ƯU TIÊN (QUY TẮC 5) ---
            const employeeAvailabilities = allAvailabilities.filter(a => availableEmployees.some(e => e.id === a.employeeId));
            // Sắp xếp nhân viên theo priority (1 là cao nhất)
            employeeAvailabilities.sort((a, b) => (a.registrations[0]?.priority || 3) - (b.registrations[0]?.priority || 3));

            for (const availability of employeeAvailabilities) {
                // Nếu nhân viên này đã được phân công, bỏ qua
                if (!availableEmployees.some(e => e.id === availability.employeeId)) continue;

                for (const registration of availability.registrations) {
                    if (!registration.shiftCode) continue;

                    // Tìm một "suất" trống phù hợp với đăng ký của nhân viên
                    const matchingSlot = slotsToFill.find(slot =>
                        !slot.employeeId && // Suất còn trống
                        slot.shiftCode === registration.shiftCode && // Đúng mã ca
                        slot.positionId !== 'LEADER' // Không phải suất leader
                    );

                    if (matchingSlot) {
                        matchingSlot.employeeId = availability.employeeId;
                        // Loại nhân viên đã được phân công ra khỏi danh sách có sẵn
                        availableEmployees = availableEmployees.filter(emp => emp.id !== availability.employeeId);
                        break; // Mỗi nhân viên chỉ được xếp 1 ca ở bước này
                    }
                }
            }

            // --- BƯỚC 3: PHÂN CÔNG CÁC SUẤT CÒN LẠI (QUY TẮC 1 & 4) ---
            const remainingSlots = slotsToFill.filter(slot => !slot.employeeId);
            for (const slot of remainingSlots) {
                if (availableEmployees.length === 0) {
                    // Nếu hết nhân viên mà vẫn còn suất, suất đó sẽ bị bỏ trống.
                    console.warn(`Cửa hàng ${store.name} không đủ nhân viên để lấp đầy suất ${slot.positionId} (${slot.shiftCode})`);
                    continue;
                }

                // Sắp xếp nhân viên còn lại dựa trên "độ thiếu hụt" vị trí của slot hiện tại
                availableEmployees.sort((a, b) => {
                    const positionInfo = allWorkPositions.find(p => p.id === slot.positionId);
                    const targetBalance = positionInfo ? (positionInfo.balance / 100) : 0;

                    const getShortage = (employeeId) => {
                        const positionHours = employeePositionHours.get(employeeId);
                        const totalHours = positionHours ? Array.from(positionHours.values()).reduce((sum, h) => sum + h, 0) : 0;
                        const currentPercentage = totalHours > 0 ? ((positionHours?.get(slot.positionId) || 0) / totalHours) : 0;
                        return targetBalance - currentPercentage;
                    };

                    return getShortage(b.id) - getShortage(a.id); // Sắp xếp giảm dần, người thiếu hụt nhiều nhất lên đầu
                });

                const employeeToAssign = availableEmployees.shift(); // Lấy người phù hợp nhất
                slot.employeeId = employeeToAssign.id;
            }

            // --- BƯỚC 4: TẠO BẢN GHI LỊCH TRÌNH TỪ CÁC SUẤT ĐÃ PHÂN CÔNG ---
            for (const filledSlot of slotsToFill) {
                // Chỉ tạo lịch nếu suất đó đã được phân công cho một nhân viên
                if (filledSlot.employeeId) {
                    const tasks = (templateSchedule[filledSlot.shiftId] || []).map(task => ({ // Áp dụng giá trị isComplete
                        groupId: task.groupId,
                        startTime: task.startTime,
                        taskCode: task.taskCode,
                        name: task.taskName,
                        isComplete: isCompleteValue
                    }));

                    const newScheduleDoc = {
                        date: dateString,
                        employeeId: filledSlot.employeeId,
                        storeId: store.id,
                        shift: filledSlot.shiftCode,
                        positionId: filledSlot.positionId,
                        tasks,
                        createdAt: serverTimestamp()
                    };

                    const scheduleRef = doc(collection(db, 'schedules'));
                    batch.set(scheduleRef, newScheduleDoc);
                    schedulesCreatedCount++;
                }
            }
        }

        // 6. Ghi dữ liệu vào Firestore
        await batch.commit();
        window.showToast(`Hoàn tất! Đã tạo ${schedulesCreatedCount} lịch làm việc cho ngày ${dateString} tại ${allStores.length} cửa hàng.`, 'success', 5000);

    } catch (error) {
        console.error("Lỗi khi áp dụng template cho tất cả cửa hàng:", error);
        window.showToast(`Đã xảy ra lỗi: ${error.message}`, 'error');
    } finally {
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Áp dụng Template';
    }
}

/**
 * Tính toán lại tổng điểm kinh nghiệm (EXP) cho tất cả nhân viên.
 * Đọc toàn bộ collection `schedules`, đếm số task đã hoàn thành (`isComplete: 1`)
 * cho mỗi nhân viên, và cập nhật lại trường `experiencePoints` trong collection `employee`.
 * Đây là logic từ file `re-calculate-exp.js` được tích hợp vào đây.
 */
async function reCalculateAllEmployeeExp() {
    const btn = document.getElementById('recalculate-exp-btn');
    const confirmed = await window.showConfirmation(
        'Bạn có chắc chắn muốn tính toán lại điểm kinh nghiệm cho TOÀN BỘ nhân viên không? Quá trình này sẽ đọc toàn bộ lịch sử công việc và có thể mất một lúc.',
        'Xác nhận tính lại EXP',
        'Chạy tính toán',
        'Hủy'
    );

    if (!confirmed) {
        window.showToast('Đã hủy thao tác.', 'info');
        return;
    }

    btn.disabled = true;
    btn.querySelector('span').textContent = 'Đang tính toán...';
    window.showToast('🚀 Bắt đầu quá trình tính toán lại EXP...', 'info');

    const EXP_PER_TASK = 5;

    try {
        // --- Bước 1: Tải tất cả lịch sử công việc và nhân viên ---
        window.showToast('... (1/3) Đang tải dữ liệu...', 'info');
        const [schedulesSnapshot, employeesSnapshot] = await Promise.all([
            getDocs(collection(db, 'schedules')),
            getDocs(collection(db, 'employee'))
        ]);
        const allSchedules = schedulesSnapshot.docs.map(doc => doc.data());
        const allEmployees = employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // --- Bước 2: Tính toán EXP cho mỗi nhân viên ---
        window.showToast('... (2/3) Đang tính toán EXP...', 'info');
        const employeeExpMap = new Map();
        allEmployees.forEach(emp => employeeExpMap.set(emp.id, 0));

        allSchedules.forEach(schedule => {
            if (!schedule.employeeId || !schedule.tasks) return;
            const completedTasksCount = schedule.tasks.filter(task => task.isComplete === 1).length;
            if (completedTasksCount > 0) {
                const currentExp = employeeExpMap.get(schedule.employeeId) || 0;
                employeeExpMap.set(schedule.employeeId, currentExp + (completedTasksCount * EXP_PER_TASK));
            }
        });

        // --- Bước 3: Cập nhật EXP cho từng nhân viên ---
        window.showToast(`... (3/3) Đang cập nhật ${employeeExpMap.size} nhân viên...`, 'info');
        const updatePromises = [];
        employeeExpMap.forEach((totalExp, employeeId) => {
            const employeeRef = doc(db, 'employee', employeeId);
            updatePromises.push(updateDoc(employeeRef, { experiencePoints: totalExp }));
        });
        await Promise.all(updatePromises);

        window.showToast('🎉 HOÀN TẤT! Đã cập nhật thành công điểm kinh nghiệm.', 'success', 5000);
    } catch (error) {
        console.error("❌ Đã xảy ra lỗi nghiêm trọng trong quá trình tính toán lại EXP:", error);
        window.showToast('Đã có lỗi xảy ra. Vui lòng kiểm tra Console (F12).', 'error');
    } finally {
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Tính lại EXP Toàn bộ';
    }
}

export { initializeDevMenu };
